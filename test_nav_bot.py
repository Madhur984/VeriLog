"""
test_nav_bot.py — Automated Test Suite for VoltMonkey Navigation & RAG Agent

Tests:
1. Route & Code Indexing pipeline
2. Navigation vs Informational Intent Classification
3. Target Route Path Resolution Accuracy
4. Assertions & Validation Reporting
"""

import os
import sys
import json
from pathlib import Path

from rag_pipeline import UnifiedRAGPipeline
from rag_agent import RAGNavigationAgent

# ---------------------------------------------------------------------------
# Test Suite Definition
# ---------------------------------------------------------------------------
TEST_CASES = [
    {
        "id": "TC-01",
        "query": "Take me to the verilog playground",
        "expected_intent": "NAVIGATE",
        "expected_path": "/verilog-playground"
    },
    {
        "id": "TC-02",
        "query": "Where can I find the Karnaugh map minimiser?",
        "expected_intent": "NAVIGATE",
        "expected_path": "/kmap-lab"
    },
    {
        "id": "TC-03",
        "query": "Open my account settings",
        "expected_intent": "NAVIGATE",
        "expected_path": "/settings"
    },
    {
        "id": "TC-04",
        "query": "Take me to the full curriculum course portal",
        "expected_intent": "NAVIGATE",
        "expected_path": "/portal"
    },
    {
        "id": "TC-05",
        "query": "What is the difference between half adder and full adder in DSD?",
        "expected_intent": "INFO",
        "expected_path": None
    },
    {
        "id": "TC-06",
        "query": "How are signals and flip flops used in basic electronics?",
        "expected_intent": "INFO",
        "expected_path": None
    }
]

def run_test_suite():
    print("=" * 75)
    print("🧪 VOLTMONKEY NAV-BOT INTEGRATION & ACCURACY TEST SUITE")
    print("=" * 75)

    # 1. Pipeline & Vector DB Setup
    persist_dir = "./chroma_db_test"
    if os.path.exists(persist_dir):
        import shutil
        shutil.rmtree(persist_dir)

    pipeline = UnifiedRAGPipeline(persist_dir=persist_dir)
    
    if not os.path.exists("routes.json"):
        print("❌ Error: routes.json not found.")
        sys.exit(1)

    print("📦 Step 1: Indexing routes.json...")
    indexed_routes_count = pipeline.index_routes("routes.json")
    print(f"   Indexed {indexed_routes_count} routes successfully.")

    # 2. Agent Initialization
    agent = RAGNavigationAgent(pipeline=pipeline)

    # 3. Test Execution & Verification Loop
    passed_tests = 0
    total_tests = len(TEST_CASES)

    print("\n🔍 Step 2: Executing Intent & Navigation Test Cases...\n")

    for tc in TEST_CASES:
        tc_id = tc["id"]
        query = tc["query"]
        expected_intent = tc["expected_intent"]
        expected_path = tc["expected_path"]

        response = agent.process_query(query)
        actual_type = response.get("type")
        actual_intent = "NAVIGATE" if actual_type == "navigate" else "INFO"
        actual_path = response.get("path") if actual_type == "navigate" else None

        # Validation Logic
        intent_matches = actual_intent == expected_intent
        path_matches = (expected_path is None) or (actual_path == expected_path)
        test_passed = intent_matches and path_matches

        if test_passed:
            passed_tests += 1
            status_symbol = "✅ PASS"
        else:
            status_symbol = "❌ FAIL"

        print(f"[{status_symbol}] {tc_id}: \"{query}\"")
        print(f"       Expected: intent={expected_intent}, path={expected_path}")
        print(f"       Actual:   intent={actual_intent}, path={actual_path}")
        if actual_type == "navigate":
            print(f"       Action Payload: message=\"{response.get('message')}\", confidence={response.get('confidence')}")
        print("-" * 75)

    # 4. Summary & Assertion Report
    print(f"\n📊 TEST RESULTS SUMMARY:")
    print(f"   Passed: {passed_tests} / {total_tests} ({round((passed_tests/total_tests)*100, 1)}%)")

    assert passed_tests == total_tests, f"Test suite failure: Only {passed_tests}/{total_tests} passed."
    print("🎉 ALL TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_test_suite()
