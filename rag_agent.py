"""
rag_agent.py — Smart RAG Agent with Intent Classification & Navigation Actions

Extends the dual-indexing RAG pipeline to:
1. Retrieve documents from both 'codebase' and 'routes' collections.
2. Classify user intent ('NAVIGATE' vs 'INFO') using heuristic & similarity signals.
3. Output structured JSON for navigation commands ({ "type": "navigate", "path": "...", ... })
4. Output conversational markdown for informational queries.
"""

import os
import json
import re
from typing import Dict, Any, Tuple, Optional
from pathlib import Path

# Import our underlying RAG Pipeline
from rag_pipeline import UnifiedRAGPipeline

# ---------------------------------------------------------------------------
# 1. Intent Classifier Module
# ---------------------------------------------------------------------------
class IntentClassifier:
    """Classifies user query into 'NAVIGATE' vs 'INFO' using action patterns & similarity scores."""

    NAVIGATE_PATTERNS = [
        r'\b(?:take me to|go to|open|navigate to|show me|take me|bring me to|head over to|redirect me to)\b',
        r'\b(?:where is|how do i get to|where can i find|i want to go to|i need to open)\b',
        r'\b(?:launch|start|open up)\b'
    ]

    def __init__(self, nav_threshold: float = 0.5):
        self.nav_threshold = nav_threshold
        self.pattern_regex = re.compile('|'.join(self.NAVIGATE_PATTERNS), re.IGNORECASE)

    def classify(self, query: str, top_route_match: Optional[Dict[str, Any]]) -> Tuple[str, float]:
        """
        Returns (intent_type, confidence_score)
        intent_type: 'NAVIGATE' or 'INFO'
        """
        q_lower = query.lower().strip()
        pattern_match = bool(self.pattern_regex.search(q_lower))

        # Check vector similarity score of top route match if present
        route_score = top_route_match.get("score", 1.0) if top_route_match else 1.0
        # Lower distance score in Chroma = higher similarity
        is_strong_route_match = route_score < 0.85

        if pattern_match and is_strong_route_match:
            confidence = min(0.98, max(0.85, 1.0 - (route_score * 0.3)))
            return "NAVIGATE", round(confidence, 2)
        elif pattern_match:
            return "NAVIGATE", 0.75
        elif is_strong_route_match and any(word in q_lower for word in ["page", "screen", "portal", "playground", "workbench", "settings"]):
            return "NAVIGATE", 0.82
        else:
            return "INFO", 0.90


# ---------------------------------------------------------------------------
# 2. Interactive RAG Agent Component
# ---------------------------------------------------------------------------
class RAGNavigationAgent:
    """
    RAG Agent that combines dual-collection search, intent detection,
    and structured navigation responses.
    """

    SYSTEM_PROMPT = """You are VoltMonkey ⚡, the AI navigator and study buddy for BitForBytes.

GUIDELINES FOR RESPONDING:
1. If INTENT is 'NAVIGATE' and a matching site route exists:
   - Output EXCLUSIVELY a JSON object in the exact format:
     {
       "type": "navigate",
       "path": "<URL_PATH>",
       "message": "<Friendly confirmation message>",
       "confidence": <CONFIDENCE_SCORE>
     }

2. If INTENT is 'INFO':
   - Provide a helpful, clear markdown explanation.
   - Ground your answer in the retrieved codebase and route documents.
   - If relevant, include a direct markdown link to the relevant page (e.g., [Open Logic Workbench](/workbench)).
"""

    def __init__(self, pipeline: Optional[UnifiedRAGPipeline] = None):
        self.pipeline = pipeline or UnifiedRAGPipeline()
        self.classifier = IntentClassifier()

    def process_query(self, query: str) -> Dict[str, Any]:
        # Step 1: Retrieve context from both routes & code collections
        search_results = self.pipeline.unified_search(query, k_routes=3, k_code=2)
        routes_found = search_results.get("routes_found", [])
        code_found = search_results.get("code_found", [])

        top_route = routes_found[0] if routes_found else None

        # Step 2: Classify Intent
        intent, confidence = self.classifier.classify(query, top_route)

        # Step 3: Generate Action / Response
        if intent == "NAVIGATE" and top_route:
            path = top_route.get("path", "/")
            name = top_route.get("name", "Target Page")
            
            response_payload = {
                "type": "navigate",
                "path": path,
                "message": f"Taking you to {name}...",
                "confidence": confidence,
                "metadata": {
                    "matched_category": top_route.get("category"),
                    "matched_name": name
                }
            }
            return response_payload

        else:
            # Informational response with grounding context
            info_response = self._build_info_response(query, routes_found, code_found)
            return {
                "type": "info",
                "message": info_response,
                "confidence": confidence,
                "retrieved_routes": [r["path"] for r in routes_found[:2]],
                "retrieved_files": [c["file_path"] for c in code_found[:2] if c.get("file_path")]
            }

    def _build_info_response(self, query: str, routes: list, code: list) -> str:
        """Constructs an informational markdown response grounded in retrieved context."""
        parts = []
        
        if routes:
            top = routes[0]
            parts.append(f"**{top['name']}** ({top['category']}):")
            parts.append(f"_{top['description']}_")
            parts.append(f"\n🔗 You can access this feature at [`{top['path']}`]({top['path']}).")
        else:
            parts.append("Here is the information based on the BitForBytes platform specs:")

        if code:
            parts.append(f"\n**Code Implementation Reference:**")
            for c in code[:2]:
                if c.get("file_path"):
                    parts.append(f"- File: `{c['file_path']}`")

        return "\n".join(parts)


# ---------------------------------------------------------------------------
# Demonstration & Test Suite
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    print("⚡ Initializing RAG Navigation Agent...")
    
    # Initialize agent (uses initialized routes in Chroma)
    agent = RAGNavigationAgent()
    
    # Ensure routes are loaded in vector db
    if os.path.exists("routes.json"):
        agent.pipeline.index_routes("routes.json")

    test_queries = [
        "Take me to the verilog playground",
        "Where can I find the Karnaugh map minimiser?",
        "I want to check my account settings",
        "What is the difference between half adder and full adder in DSD?",
        "Go to the course portal"
    ]

    print("\n" + "="*70)
    print("🤖 DEMONSTRATING RAG NAVIGATION AGENT")
    print("="*70)

    for q in test_queries:
        print(f"\n💬 User: \"{q}\"")
        res = agent.process_query(q)
        print("🤖 Agent Output:")
        print(json.dumps(res, indent=2, ensure_ascii=False))
