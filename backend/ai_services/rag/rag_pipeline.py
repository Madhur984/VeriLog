import json
import os
import re
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from langchain_core.documents import Document

# Configuration Constants
DEFAULT_MODEL = "Qwen/Qwen2.5-7B-Instruct"

# Generation constraints that force complete, coherent answers:
# a large token budget so replies are not cut mid-sentence, and a low
# temperature so output stays focused and well-formed.
LLM_MAX_NEW_TOKENS = 1280
LLM_TEMPERATURE = 0.35

try:
    from .route_mappings import find_mapped_route, is_confirmation_response, ROUTE_MAPPINGS
except ImportError:
    from route_mappings import find_mapped_route, is_confirmation_response, ROUTE_MAPPINGS

# Modular Gemini-backed vector store (see rag/vectorstore.py). The chat flow
# reads the routes/code collections from here so short keywords like "kmaps"
# resolve against the keyword-tagged route index.
try:
    from ..config.rag_config import VECTORSTORE_PERSIST_DIR
    from .embeddings import get_embeddings
    from .indexer import index_github_repository
    from .vectorstore import (
        COLLECTION_CODE as MODULAR_CODE_COLLECTION,
        COLLECTION_ROUTES as MODULAR_ROUTES_COLLECTION,
        index_routes as modular_index_routes,
        search as vectorstore_search,
    )
except ImportError:  # standalone execution with ai_services/ on sys.path
    from config.rag_config import VECTORSTORE_PERSIST_DIR
    from rag.embeddings import get_embeddings
    from rag.indexer import index_github_repository
    from rag.vectorstore import (
        COLLECTION_CODE as MODULAR_CODE_COLLECTION,
        COLLECTION_ROUTES as MODULAR_ROUTES_COLLECTION,
        index_routes as modular_index_routes,
        search as vectorstore_search,
    )

# Navigation INTENT phrases only. Bare topic words ("kmaps", "verilog",
# "roadmap", ...) are intentionally NOT triggers: they must not hijack QA
# questions like "what is a half adder in verilog". Bare keywords are handled
# by the exact-keyword path in classify_intent (route_mappings + route search).
NAVIGATION_TRIGGERS = [
    r"\btake me\b",
    r"\bnavigate\b",
    r"\bgo to\b",
    r"\bopen\b",
    r"\bshow me\b",
    r"\bwhere is\b",
    r"\blaunch\b",
    r"\bvisit\b",
    r"\blink for\b",
    r"\bdirect me\b",
    r"\bredirect me\b",
    r"\bi want to see\b",
    r"\bi want to practice\b",
    r"\bhow do i start coding\b",
]

IMPERATIVE_NAV_TRIGGERS = [
    r"\btake me there now\b",
    r"\bredirect me now\b",
    r"\binstant navigate\b",
    r"\bforce go\b",
    r"\bgo right now\b",
]

# Casual greetings ("hlo", "hi", "hello", ...) -> friendly text reply, no LLM.
GREETING_WORDS = {"hlo", "hi", "hii", "hello", "hey", "yo", "hola", "sup", "namaste"}

# Words that mark a query as a question/QA rather than a bare navigation keyword.
QUESTION_WORDS = {
    "what", "which", "who", "when", "where", "why", "how", "is", "are", "am",
    "do", "does", "did", "can", "could", "would", "should", "explain", "tell",
    "define", "meaning", "difference", "vs", "example", "the", "a", "an", "of",
    "for", "with", "in", "on", "at", "about", "me", "my", "i", "you", "please",
}

# Interrogatives / explain-verbs: when present (or the query ends in '?'), the
# query is a question, so it must NOT be treated as bare navigation even if a
# route alias happens to appear in it (e.g. "what is a half adder in verilog").
QUESTION_MARKERS = {
    "what", "which", "who", "when", "where", "why", "how", "is", "are", "am",
    "do", "does", "did", "can", "could", "would", "should", "explain", "tell",
    "define", "meaning", "difference", "vs", "example", "define", "describe",
}

VOLTMONKEY_SYSTEM_PROMPT = """You are VoltMonkey ⚡, the AI study buddy and ECE/VLSI lab companion for BitForBytes / VeriLog.

FRIENDLY SITE ROUTES & PAGES ON BITFORBYTES:
• Home (/) - Main landing page of BitForBytes
• Career Roadmap (/career-roadmap) - Semiconductor & VLSI career roadmap for ECE students
• Portal (/portal) - Main learning portal & course dashboard
• Verilog Playground (/verilog-playground) - Interactive Verilog code editor & practice playground
• Workbench (/workbench) - Digital design workbench & interactive lab environment
• K-Map Lab (/kmap-lab) - Karnaugh Map laboratory for Boolean simplification
• Verilog Library (/verilog-library) - Ready-to-use Verilog code examples & modules
• Interview Prep (/interview-prep) - VLSI & digital design interview preparation resources
• Analogies (/analogies) - Simple real-world analogies for digital electronics
• Silicon Map (/silicon-map) - Interactive map of the semiconductor & chip industry
• Module 1 (/module/1) - Boolean Forms & Canonical Forms
• Module 1 Chapter 1 (/module/1/1) - The Architecture of a Decision
• Module 2 (/module/2) - Module 2 of Digital System Design
• Module 3 (/module/3) - Module 3 of Digital System Design
• Module 4 (/module/4) - Module 4 of Digital System Design
• Module 5 (/module/5) - Module 5 of Digital System Design
• Pledge (/pledge) - BitForBytes student pledge & community commitment
• Privacy Policy (/privacy) - Privacy policy
• Terms of Service (/terms) - Terms of service & usage policy
• Basic Electronics (/basic-electronics) - Basic Electronics course modules
• Digital System Design (/dsd) - Digital System Design full course
• Hardware LeetCode (/hw-leetcode) - Hardware-focused coding challenges
• Logic Studio (/logic-studio) - Interactive logic design studio
• FSM Lab (/fsm) - Finite State Machine laboratory
• Signal Playground (/signal-playground) - Interactive signal & waveform playground

CRITICAL NAVIGATION & TEACHING RULES:
1. NEVER reply with manual UI instructions like "click on the top navigation bar", "look at the header menu", or "browse the top navbar".
2. Recognize friendly page names when the user asks to go somewhere, and respond with a friendly confirmation ("Would you like me to take you there?").
3. If the user confirms ("yes", "sure", "take me there"), return navigation payload (`type: "navigate"`).
4. Never suggest a route that the user is already on (`current_path`).
5. Be warm, encouraging, practical, and clear. For real questions, give a
   complete, well-explained answer — don't cut yourself short: cover the
   "why" as well as the "what", walk through the reasoning or an example
   when it helps understanding, and use as much space as the question
   actually needs. Keep it tight and readable (short paragraphs, no filler,
   no padding just to sound longer) — thorough, not rambling.
6. Navigation confirmations, greetings, and "you're already here" replies
   stay short (1-2 sentences) — the length guidance above is for answering
   real questions, not for these.
7. Lead with plain analogies before technical formulas.
"""


# -----------------------------------------------------------------------------
# 1. Routes / GitHub Indexing (legacy-compat wrappers)
#
# Indexing now runs entirely through the modular Gemini pipeline
# (rag/indexer.py and rag/vectorstore.py): chunks are embedded with Google
# Gemini (GOOGLE_API_KEY), never HuggingFace. These thin aliases keep the CLI
# scripts (index_routes.py, index_repo.py) and the test suite working
# unchanged, and persist into the same 'routes'/'code' collections the chat
# flow searches.
# -----------------------------------------------------------------------------
def index_routes(
    routes_file_path: Optional[str] = None,
    persist_directory: str = VECTORSTORE_PERSIST_DIR,
) -> int:
    """Sync routes.json into the Gemini-backed 'routes' collection."""
    return modular_index_routes(routes_file_path, persist_directory)


def index_github_repo(
    clone_url: str,
    branch: str = "main",
    file_filter_exts: Optional[List[str]] = None,
    persist_directory: str = VECTORSTORE_PERSIST_DIR,
) -> Dict[str, Any]:
    """
    Index a GitHub repository through the modular Gemini pipeline
    (load -> chunk -> Gemini embed -> 'code' collection).

    ``file_filter_exts`` is accepted for backwards compatibility; the modular
    github_loader applies its own ignore/extension rules (see rag_config.py).
    """
    return index_github_repository(clone_url, branch=branch, persist_directory=persist_directory)

# -----------------------------------------------------------------------------
# 3. Intent Classifier
# -----------------------------------------------------------------------------
def _is_bare_keyword_query(tokens: List[str]) -> bool:
    """
    True when the query looks like a bare short keyword (1-2 tokens, no
    question/proposition words) rather than a full sentence or question.
    E.g. "kmaps", "verilog lab" -> True; "what is a kmap" -> False.
    """
    if not tokens or len(tokens) > 2:
        return False
    return not any(t in QUESTION_WORDS for t in tokens)


def _route_matches_keywords(tokens: List[str], top_doc: Optional[Document]) -> bool:
    """
    True when a bare token of the query appears in the top route document's
    keyword list (e.g. "kmaps" matches the K-Map Lab route keywords).
    """
    if top_doc is None:
        return False
    keywords = (top_doc.metadata.get("keywords") or "").lower()
    keyword_set = {k.strip() for k in keywords.split(",") if k.strip()}
    return any(t in keyword_set for t in tokens)


def classify_intent(query: str, route_docs: List[Document]) -> Tuple[str, float, Optional[Dict[str, str]]]:
    query_lower = query.lower().strip()
    tokens = [t for t in re.split(r"\W+", query_lower) if t]

    # 0. Casual greeting ("hlo", "hi", "hello", ...) -> friendly reply, no LLM.
    if tokens and tokens[0] in GREETING_WORDS and len(tokens) <= 2:
        return "greeting", 0.98, None

    # A question (interrogative word or trailing '?') without an explicit
    # navigation trigger goes to QA, never to navigation.
    is_question = query_lower.endswith("?") or any(t in QUESTION_MARKERS for t in tokens[:4])

    has_nav_trigger = any(re.search(pattern, query_lower) for pattern in NAVIGATION_TRIGGERS)
    has_imperative_nav = any(re.search(pattern, query_lower) for pattern in IMPERATIVE_NAV_TRIGGERS)

    best_route = None
    top_doc = route_docs[0] if route_docs else None
    if top_doc:
        meta = top_doc.metadata
        best_route = {
            "name": meta.get("name", ""),
            "path": meta.get("path", ""),
            "description": meta.get("description", "")
        }

    confidence = 0.50
    if has_nav_trigger:
        confidence += 0.35
    if best_route and (best_route["name"].lower() in query_lower or best_route["path"].lower() in query_lower):
        confidence += 0.35

    confidence = min(0.98, confidence)

    # 1. Direct match from route_mappings dictionary (skipped for pure
    #    questions without an explicit navigation trigger, so "what is ...
    #    verilog" answers instead of navigating).
    mapped_route = None if (is_question and not has_nav_trigger) else find_mapped_route(query)
    if mapped_route:
        if has_imperative_nav:
            return "navigate", 0.95, mapped_route
        return "confirm_navigate", 0.89, mapped_route

    # 2. Bare short-keyword navigation ("kmaps", "verilog", "portal", ...)
    #    matched against the top route's indexed keywords.
    if _is_bare_keyword_query(tokens):
        if best_route and _route_matches_keywords(tokens, top_doc):
            if has_imperative_nav:
                return "navigate", round(confidence, 2), best_route
            return "confirm_navigate", round(confidence, 2), best_route
        # Bare keyword with no route hit -> treat as a QA query.
        return "text", 0.50, None

    # 3. Heuristic navigation trigger evaluation
    if has_nav_trigger and best_route:
        if has_imperative_nav:
            return "navigate", round(confidence, 2), best_route
        return "confirm_navigate", round(confidence, 2), best_route

    if best_route and confidence >= 0.70:
        return "mixed", round(confidence, 2), best_route

    return "text", round(confidence, 2), best_route


# -----------------------------------------------------------------------------
# 4. Multi-Collection Search & RAG Execution
# -----------------------------------------------------------------------------
def search_knowledge_base(
    query: str,
    k_routes: int = 3,
    k_code: int = 3,
    persist_directory: str = VECTORSTORE_PERSIST_DIR
) -> Dict[str, Any]:
    """
    Search the modular Gemini-backed collections ('routes' and 'code').

    The routes collection carries the keyword-tagged navigation index, so
    short keywords like "kmaps"/"verilog" resolve to the right page; the
    code collection carries GitHub source chunks (when indexed).
    """
    # Embed the query once and reuse it for both collection searches, instead
    # of letting each similarity_search() call re-embed the same text via its
    # own Gemini round-trip (2 embedding calls -> 1 per turn). Falls back to
    # per-collection text search (original behavior) if the embed call fails.
    query_vector = None
    try:
        query_vector = get_embeddings().embed_query(query)
    except Exception as e:
        print(f"Query embedding warning (falling back to per-collection embed): {e}")

    route_docs, code_docs = [], []
    try:
        route_docs = vectorstore_search(
            MODULAR_ROUTES_COLLECTION, query, k=k_routes,
            persist_directory=persist_directory, embedding=query_vector,
        )
    except Exception as e:
        print(f"Routes vectorstore query warning: {e}")

    try:
        code_docs = vectorstore_search(
            MODULAR_CODE_COLLECTION, query, k=k_code,
            persist_directory=persist_directory, embedding=query_vector,
        )
    except Exception as e:
        print(f"Code vectorstore query warning: {e}")

    formatted_context_blocks = []

    if route_docs:
        formatted_context_blocks.append("--- RELEVANT WEBSITE ROUTES ---")
        for i, doc in enumerate(route_docs, 1):
            meta = doc.metadata
            formatted_context_blocks.append(
                f"[{i}] Name: {meta.get('name')} | Path: {meta.get('path')}\n"
                f"    Description: {meta.get('description')}"
            )

    if code_docs:
        formatted_context_blocks.append("\n--- RELEVANT SOURCE CODE CHUNKS ---")
        for i, doc in enumerate(code_docs, 1):
            source_file = doc.metadata.get("source", "Unknown file")
            formatted_context_blocks.append(
                f"[{i}] File: {source_file}\n"
                f"Snippet:\n{doc.page_content[:400]}..."
            )

    return {
        "query": query,
        "routes": route_docs,
        "code_chunks": code_docs,
        "unified_context": "\n".join(formatted_context_blocks)
    }

def ensure_complete_sentence(text: str) -> str:
    """
    Post-processing check: Ensures response text ends with a complete sentence or clean punctuation.
    If cut off mid-sentence, trims back to the last valid sentence boundary or appends period.
    """
    if not text:
        return text

    trimmed = text.strip()
    valid_endings = ('.', '!', '?', '⚡', '🐵', '}', ']', ')', '"', "'")

    if trimmed.endswith(valid_endings):
        return trimmed

    # Look for last sentence punctuation mark if within trailing 120 characters
    last_punct_idx = max(trimmed.rfind('.'), trimmed.rfind('!'), trimmed.rfind('?'))
    if last_punct_idx > 0 and (len(trimmed) - last_punct_idx) < 120:
        return trimmed[:last_punct_idx + 1]

    # Otherwise append a period to cleanly close the sentence
    return trimmed + "."

STRICT_BASE_SYSTEM_PROMPT = """You are VoltMonkey ⚡, the AI study buddy and ECE/VLSI lab companion for BitForBytes / VeriLog.

STRICT OPERATIONAL DIRECTIVES & FORMATTING RULES:
1. ALWAYS maintain a warm, encouraging, clear, and professional tone.
2. NEVER reply with manual UI instructions like "click on the top navigation bar", "look at the header menu", or "browse the top navbar".
3. When the student's question matches a known site page/tool, offer a confirmation-based navigation query (`type: "confirm_navigate"`).
4. Keep explanations concise, practical, and clear (2 to 4 sentences max by default).
5. Lead with plain analogies before technical formulas.
6. Always finish your reply with a complete sentence. Never stop in the middle of a sentence.
7. STRICT PLAIN TEXT FORMATTING RULES (VERY IMPORTANT):
   - Write in clean, natural English only.
   - Do NOT use Markdown (no **, *, #, `, or bullet symbols that render as code).
   - Do NOT use LaTeX or dollar signs ($A=0$).
   - For truth tables or logic, write them in plain text like this:
     AND Gate:
     A=0, B=0 → 0
     A=0, B=1 → 0
     A=1, B=0 → 0
     A=1, B=1 → 1
   - Use simple line breaks and normal punctuation.
   - Make every answer easy to read, just like ChatGPT.
"""


def clean_markdown_and_latex(text: str) -> str:
    """
    Lightweight post-processing cleaner:
    - Removes markdown syntax (**bold**, *italic*, # headers, `code`)
    - Strips LaTeX symbols ($math$, \\rightarrow, \\times, \\implies)
    - Formats clean plain text for crisp readability
    """
    if not text:
        return text

    cleaned = text

    # 1. Replace LaTeX arrow and math command symbols
    cleaned = re.sub(r'\\rightarrow|\\to|\\implies', '→', cleaned)
    cleaned = re.sub(r'\\times', 'x', cleaned)
    cleaned = re.sub(r'\\cdot', '.', cleaned)

    # 2. Remove math dollar signs ($A=0$ -> A=0)
    cleaned = re.sub(r'\$([^$]+)\$', r'\1', cleaned)
    cleaned = cleaned.replace('$', '')

    # 3. Strip Markdown bold/italic/code/header characters (**text**, *text*, #, `)
    cleaned = re.sub(r'\*{1,3}', '', cleaned)
    cleaned = re.sub(r'#{1,6}\s*', '', cleaned)
    # Fenced code blocks: drop ```lang / ``` markers but keep the code content
    # (the old `{1,3}[a-zA-Z]*` pattern also ate the first word of inline code,
    # e.g. "`terms`" -> "" instead of "terms").
    cleaned = re.sub(r'```[a-zA-Z]*\n?', '', cleaned)
    cleaned = cleaned.replace('```', '')
    # Inline code: keep the content, drop the backticks.
    cleaned = re.sub(r'`([^`]*)`', r'\1', cleaned)
    cleaned = cleaned.replace('`', '')

    # 3b. Strikethrough, markdown links ([text](url) -> text), leading bullets
    cleaned = re.sub(r'~~.*?~~', '', cleaned)
    cleaned = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', cleaned)
    cleaned = re.sub(r'(?m)^\s*[-*+]\s+', '', cleaned)

    # 4. Clean up multiple spaces or leading indentation
    cleaned = re.sub(r'[ \t]+', ' ', cleaned).strip()

    return cleaned


INCOMPLETE_DANGLING_WORDS = {
    "to", "the", "a", "an", "dive", "is", "are", "and", "or", "with",
    "for", "in", "on", "at", "into", "from", "of", "about", "your", "next", "step"
}

def append_natural_finishing_sentence(text: str) -> str:
    """
    Additive safety layer:
    Checks the last 15 characters for dangling prepositions, articles, or incomplete words.
    If detected, appends 'Would you like me to explain the next step?' to guarantee a complete thought.
    """
    if not text:
        return text

    trimmed = text.strip()
    last_15_chars = trimmed[-15:].lower()
    words = [w.strip(".,!?\"'⚡🐵") for w in trimmed.split()]
    last_word = words[-1].lower() if words else ""

    is_dangling = (
        last_word in INCOMPLETE_DANGLING_WORDS or
        any(last_15_chars.endswith(f" {w}") or last_15_chars.endswith(f" {w}.") for w in INCOMPLETE_DANGLING_WORDS)
    )

    if is_dangling:
        clean_base = re.sub(r'\s+[a-zA-Z0-9]+\.?$', '', trimmed).strip()
        if clean_base and not clean_base.endswith(('.', '!', '?', '⚡', '🐵')):
            clean_base += "."
        return f"{clean_base} Would you like me to explain the next step?"

    return trimmed

def collapse_repeated_punctuation(text: str) -> str:
    """
    Collapse runs of repeated punctuation (!!!!!, ?????, ......, ...) into a
    single mark so replies never look corrupted: 'Great!!!!!' -> 'Great!',
    'hmm......' -> 'hmm...'. Applied before streaming and in the QA cleaner.
    """
    if not text:
        return text
    cleaned = re.sub(r'!{2,}', '!', text)
    cleaned = re.sub(r'\?{2,}', '?', cleaned)
    cleaned = re.sub(r'\.{2,}', '...', cleaned)
    cleaned = re.sub(r',{2,}', ',', cleaned)
    cleaned = re.sub(r';{2,}', ';', cleaned)
    cleaned = re.sub(r'-{2,}', '-', cleaned)
    return cleaned

def clean_sentence_wrapper(text: str) -> str:
    """
    Post-processing safety wrapper:
    - Strips markdown formatting (**bold**, *italic*, # headers, `code`) and LaTeX math ($...$, \rightarrow, \times)
    - Guarantees the response ends with '.', '!', '?', or an emoji.
    - Trims any trailing '...' or half-generated incomplete words.
    - Never leaves trailing ellipses or mid-sentence fragments.
    """
    if not text:
        return text

    # 1. Clean markdown & LaTeX symbols
    cleaned = clean_markdown_and_latex(text)

    # 1b. Collapse repeated characters (!!!!!, ......, ???)
    cleaned = collapse_repeated_punctuation(cleaned)

    # 2. Strip trailing ellipses or incomplete trailing dots
    cleaned = re.sub(r'(\s*\.\.\.|\s*…)+$', '', cleaned).strip()


    valid_endings = ('.', '!', '?', '⚡', '🐵', '}', ']', ')', '"', "'")
    if cleaned.endswith(valid_endings):
        return append_natural_finishing_sentence(cleaned)

    # 2. Look for last sentence punctuation mark if within trailing 150 characters
    last_punct_idx = max(cleaned.rfind('.'), cleaned.rfind('!'), cleaned.rfind('?'))
    if last_punct_idx > 0 and (len(cleaned) - last_punct_idx) < 150:
        truncated = cleaned[:last_punct_idx + 1].strip()
        if truncated:
            return append_natural_finishing_sentence(truncated)

    # 3. Clean trailing incomplete words and append period
    cleaned = re.sub(r'\s+[a-zA-Z0-9]+$', '', cleaned).strip()
    if not cleaned.endswith(valid_endings):
        cleaned += "."

    return append_natural_finishing_sentence(cleaned)


def normalize_rag_response(text: str) -> str:
    """
    Normalize a raw LLM/RAG response for display: strip markdown code fences,
    collapse excess blank lines, and trim surrounding whitespace.
    """
    if not text:
        return text
    cleaned = text.strip()
    cleaned = re.sub(r"^```[a-zA-Z]*\s*|```\s*$", "", cleaned).strip()
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
    return cleaned


def query_huggingface_llm(system_prompt: str, user_query: str) -> str:
    token = os.getenv("HF_TOKEN") or os.getenv("HUGGINGFACEHUB_API_TOKEN")
    if not token:
        return "Hugging Face API token is not configured. Set HF_TOKEN in environment."

    try:
        from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
        from langchain_core.messages import HumanMessage, SystemMessage

        llm = HuggingFaceEndpoint(
            repo_id=DEFAULT_MODEL,
            task="text-generation",
            max_new_tokens=LLM_MAX_NEW_TOKENS,
            temperature=LLM_TEMPERATURE,
            huggingfacehub_api_token=token
        )
        chat_model = ChatHuggingFace(llm=llm)
        messages = [
            SystemMessage(content=system_prompt + "\nAlways finish your reply with a complete sentence. Never stop in the middle of a sentence."),
            HumanMessage(content=user_query)
        ]
        res = chat_model.invoke(messages)
        raw_output = getattr(res, "content", str(res))
        normalized = normalize_rag_response(raw_output)
        return clean_sentence_wrapper(normalized)
    except Exception as exc:
        print(f"Hugging Face LLM execution error: {exc}")
        return f"I analyzed your query: '{user_query}'. Relevant context found in VeriLog database."




def normalize_route_path(path: str) -> str:
    if not path:
        return ""
    # Strip query params, hash fragments, trailing slashes, and convert to lowercase
    cleaned = path.split('?')[0].split('#')[0].strip().rstrip('/').lower()
    return cleaned

def paths_are_equal(path1: str, path2: str) -> bool:
    n1 = normalize_route_path(path1)
    n2 = normalize_route_path(path2)
    if not n1 or not n2:
        return False
    return n1 == n2

def find_last_suggested_route(chat_history: List[Dict[str, Any]]) -> Optional[Dict[str, str]]:
    if not chat_history:
        return None
    for msg in reversed(chat_history):
        path = msg.get("path") or msg.get("suggested_route")
        if path:
            for key, data in ROUTE_MAPPINGS.items():
                if paths_are_equal(data["path"], path):
                    return {"name": data["name"], "path": data["path"]}
            return {"name": "requested page", "path": path}
        
        content = str(msg.get("content") or msg.get("message") or msg.get("reply") or "")
        for key, data in ROUTE_MAPPINGS.items():
            if data["path"] in content or data["name"].lower() in content.lower():
                return {"name": data["name"], "path": data["path"]}
    return None

def run_rag_chain(
    query: str,
    chat_history: Optional[List[Dict[str, str]]] = None,
    page_context: str = "",
    current_path: str = ""
) -> Dict[str, Any]:
    if chat_history is None:
        chat_history = []

    kb_results = search_knowledge_base(query)
    route_docs = kb_results["routes"]
    user_active_path = current_path or page_context

    # Handle explicit user confirmation ("yes", "sure", "take me there")
    if is_confirmation_response(query):
        target_route = find_mapped_route(query) or find_last_suggested_route(chat_history)
        if target_route:
            if paths_are_equal(target_route["path"], user_active_path):
                msg = f"You are already on {target_route['name']}! What would you like to build or practice here?"
                return {
                    "success": True,
                    "type": "text",
                    "message": msg,
                    "path": None,
                    "confidence": 0.95,
                    "reply": msg,
                    "text": msg,
                    "suggested_route": None,
                    "level": 0,
                    "mood": "happy",
                    "emoji": "⚡"
                }
            msg = f"Taking you directly to {target_route['name']}..."
            return {
                "success": True,
                "type": "navigate",
                "message": msg,
                "path": target_route["path"],
                "confidence": 0.98,
                "reply": msg,
                "text": msg,
                "suggested_route": target_route["path"],
                "level": 0,
                "mood": "excited",
                "emoji": "⚡"
            }

    intent, confidence, best_route = classify_intent(query, route_docs)

    # 0. Casual greeting ("hlo", "hi", "hello", ...) -> friendly reply, no LLM.
    if intent == "greeting":
        msg = (
            "Hello there! ⚡ I'm VoltMonkey, your VLSI study buddy. "
            "Ask me about K-Maps, Verilog, or digital design — or say "
            "something like \"take me to the K-Map Lab\"!"
        )
        return {
            "success": True,
            "type": "text",
            "message": msg,
            "path": None,
            "confidence": confidence,
            "reply": msg,
            "text": msg,
            "suggested_route": None,
            "level": 0,
            "mood": "happy",
            "emoji": "⚡"
        }

    # Never suggest a route the user is already on!
    if best_route and paths_are_equal(best_route.get("path", ""), user_active_path):
        route_name = best_route.get("name", "this page")
        msg = f"You are already on {route_name}! What would you like to explore or practice here?"
        return {
            "success": True,
            "type": "text",
            "message": msg,
            "path": None,
            "confidence": confidence,
            "reply": msg,
            "text": msg,
            "suggested_route": None,
            "level": 0,
            "mood": "happy",
            "emoji": "⚡"
        }

    # Only attach a DB-context block when retrieval actually found something.
    # An always-present (possibly empty) "RELEVANT DATABASE CONTEXT:" header
    # invited the model to treat silence as "nothing to say"; omitting it
    # when there's nothing relevant lets VoltMonkey answer from its own
    # general knowledge instead, same as it would with no RAG step at all.
    unified_context_text = kb_results.get("unified_context", "").strip()
    context_block = (
        f"\n\nRELEVANT DATABASE CONTEXT — prefer these facts when relevant, "
        f"but if they don't answer the question, ignore them and answer "
        f"normally from your own knowledge:\n{unified_context_text}"
        if unified_context_text
        else ""
    )
    system_prompt = (
        f"{VOLTMONKEY_SYSTEM_PROMPT}\n\n"
        f"PAGE CONTEXT: {page_context}"
        f"{context_block}"
    )

    # 1. Confirmation Navigation Intent (confirm_navigate)
    if intent == "confirm_navigate" and best_route:
        route_name = best_route.get("name", "requested page")
        target_path = best_route.get("path", "/portal")
        
        msg = f"I found {route_name}. Would you like me to take you there?"

        return {
            "success": True,
            "type": "confirm_navigate",
            "message": msg,
            "path": target_path,
            "confidence": confidence,
            "reply": msg,
            "text": msg,
            "suggested_route": target_path,
            "level": 0,
            "mood": "excited",
            "emoji": "⚡"
        }

    # 2. Immediate Imperative Navigation Intent (navigate)
    if intent == "navigate" and best_route:
        msg = f"Taking you directly to {best_route['name']}..."
        target_path = best_route["path"]
        return {
            "success": True,
            "type": "navigate",
            "message": msg,
            "path": target_path,
            "confidence": confidence,
            "reply": msg,
            "text": msg,
            "suggested_route": target_path,
            "level": 0,
            "mood": "excited",
            "emoji": "⚡"
        }

    # 3. Informational Answer — always ask the LLM; when no relevant docs
    # were retrieved, context_block above is simply empty, so VoltMonkey
    # falls back to a normal (non-RAG-augmented) answer instead of refusing.
    answer = query_huggingface_llm(system_prompt, query)

    answer = normalize_rag_response(answer)
    target_path = best_route["path"] if (best_route and intent == "mixed") else None
    
    return {
        "success": True,

        "type": "mixed" if target_path else "text",
        "message": answer,
        "path": target_path,
        "confidence": confidence,
        # Dual compatibility fields
        "reply": answer,
        "text": answer,
        "suggested_route": target_path,
        "level": 0,
        "mood": "thinking",
        "emoji": "🐵"
    }

def stream_rag_chain_tokens(
    query: str,
    chat_history: Optional[List[Dict[str, str]]] = None,
    page_context: str = "",
    current_path: str = "",
    mode: str = "chat"
):
    """
    Yields OpenAI-compatible SSE events for streaming RAG responses.
    Format: data: {"choices":[{"delta":{"content":"chunk"}}]}
    """
    res = run_rag_chain(query, chat_history, page_context, current_path)
    answer_text = res.get("reply") or res.get("text") or res.get("message") or ""

    # Safety: never stream corrupted or half-generated text. This is the last
    # gate before the frontend, so it doesn't just trust that every branch of
    # run_rag_chain already cleaned its text upstream. The markdown/LaTeX pass
    # is real regex work, though, and query_huggingface_llm already ran it on
    # the common (LLM-answer) path -- so only re-run it here when one of its
    # target characters is actually still present, instead of unconditionally
    # reprocessing text that's already clean.
    if any(ch in answer_text for ch in ('*', '$', '`', '#', '\\')):
        answer_text = clean_markdown_and_latex(answer_text)
    answer_text = collapse_repeated_punctuation(answer_text).strip()
    answer_text = ensure_complete_sentence(answer_text)
    if not answer_text:
        answer_text = "Hmm, I couldn't generate a reply for that. Try asking in a different way!"

    # Split text into chunks to simulate SSE streaming for maximum UX responsiveness
    words = answer_text.split(" ")
    for i, word in enumerate(words):
        chunk = word if i == len(words) - 1 else word + " "
        payload = json.dumps({"choices": [{"delta": {"content": chunk}}]})
        yield f"data: {payload}\n\n"

    yield "data: [DONE]\n\n"
