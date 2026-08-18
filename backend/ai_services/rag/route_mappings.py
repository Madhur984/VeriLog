"""
route_mappings.py - Common name and intent mappings for VeriLog navigation.
Maps natural language user intents, friendly names, synonyms, and keywords to real site routes.
"""

from typing import Dict, List, Optional, Tuple, Any

ROUTE_MAPPINGS: Dict[str, Dict[str, Any]] = {
    # Home
    "home": {
        "name": "Home",
        "path": "/",
        "aliases": ["home", "homepage", "main page", "landing", "start", "bitforbytes"]
    },
    # Career Roadmap
    "career roadmap": {
        "name": "Career Roadmap",
        "path": "/career-roadmap",
        "aliases": ["career roadmap", "roadmap", "career", "semiconductor career", "vlsi career", "career path", "job roadmap"]
    },
    # Portal
    "portal": {
        "name": "Portal",
        "path": "/portal",
        "aliases": ["portal", "dashboard", "main portal", "learning portal", "student portal", "workstation"]
    },
    # Verilog Playground
    "verilog playground": {
        "name": "Verilog Playground",
        "path": "/verilog-playground",
        "aliases": ["verilog playground", "playground", "code editor", "practice verilog", "verilog editor", "rtl editor", "coding playground", "verilog", "start coding", "how do i start coding"]
    },
    # Workbench
    "workbench": {
        "name": "Workbench",
        "path": "/workbench",
        "aliases": ["workbench", "lab workbench", "design workbench", "hardware workbench", "circuit workbench"]
    },
    # K-Map Lab
    "kmap lab": {
        "name": "K-Map Lab",
        "path": "/kmap-lab",
        "aliases": ["kmap lab", "kmap", "kmaps", "k-map", "karnaugh map", "k map lab", "boolean simplification", "karnaugh"]
    },
    # Verilog Library
    "verilog library": {
        "name": "Verilog Library",
        "path": "/verilog-library",
        "aliases": ["verilog library", "library", "code library", "verilog examples", "rtl library", "code collection"]
    },
    # Interview Prep
    "interview prep": {
        "name": "Interview Prep",
        "path": "/interview-prep",
        "aliases": ["interview prep", "interview", "vlsi interview", "placement", "job interview", "interview questions", "preparation"]
    },
    # Analogies
    "analogies": {
        "name": "Analogies",
        "path": "/analogies",
        "aliases": ["analogies", "analogy", "explanations", "simple explanation", "real world examples"]
    },
    # Silicon Map
    "silicon map": {
        "name": "Silicon Map",
        "path": "/silicon-map",
        "aliases": ["silicon map", "silicon", "chip map", "semiconductor map", "industry map"]
    },
    # Module 1
    "module 1": {
        "name": "Module 1",
        "path": "/module/1",
        "aliases": ["module 1", "first module", "boolean forms", "canonical forms", "module one"]
    },
    # Module 1 Chapter 1
    "module 1 chapter 1": {
        "name": "Module 1 Chapter 1",
        "path": "/module/1/1",
        "aliases": ["module 1 chapter 1", "architecture of a decision", "first chapter", "boolean chapter"]
    },
    # Module 2
    "module 2": {
        "name": "Module 2",
        "path": "/module/2",
        "aliases": ["module 2", "second module", "module two"]
    },
    # Module 3
    "module 3": {
        "name": "Module 3",
        "path": "/module/3",
        "aliases": ["module 3", "third module", "module three"]
    },
    # Module 4
    "module 4": {
        "name": "Module 4",
        "path": "/module/4",
        "aliases": ["module 4", "fourth module", "module four"]
    },
    # Module 5
    "module 5": {
        "name": "Module 5",
        "path": "/module/5",
        "aliases": ["module 5", "fifth module", "module five"]
    },
    # Pledge
    "pledge": {
        "name": "Pledge",
        "path": "/pledge",
        "aliases": ["pledge", "student pledge", "commitment"]
    },
    # Privacy Policy
    "privacy policy": {
        "name": "Privacy Policy",
        "path": "/privacy",
        "aliases": ["privacy policy", "privacy", "data privacy"]
    },
    # Terms of Service
    "terms of service": {
        "name": "Terms of Service",
        "path": "/terms",
        "aliases": ["terms of service", "terms", "terms and conditions", "usage policy"]
    },
    # Basic Electronics
    "basic electronics": {
        "name": "Basic Electronics",
        "path": "/basic-electronics",
        "aliases": ["basic electronics", "electronics basics", "physics of control", "semiconductor basics"]
    },
    # Digital System Design
    "digital system design": {
        "name": "Digital System Design",
        "path": "/dsd",
        "aliases": ["digital system design", "dsd", "digital design course", "boolean course"]
    },
    # Hardware LeetCode
    "hardware leetcode": {
        "name": "Hardware LeetCode",
        "path": "/hw-leetcode",
        "aliases": ["hardware leetcode", "hw leetcode", "verilog problems", "rtl problems", "coding challenges"]
    },
    # Logic Studio
    "logic studio": {
        "name": "Logic Studio",
        "path": "/logic-studio",
        "aliases": ["logic studio", "logic design", "gate studio"]
    },
    # FSM Lab
    "fsm lab": {
        "name": "FSM Lab",
        "path": "/fsm",
        "aliases": ["fsm lab", "fsm", "finite state machine", "state machine"]
    },
    # Signal Playground
    "signal playground": {
        "name": "Signal Playground",
        "path": "/signal-playground",
        "aliases": ["signal playground", "waveform", "signals", "timing diagram"]
    }
}

CONFIRMATION_AFFIRMATIVES = [
    "yes", "yeah", "yep", "sure", "ok", "okay", "take me there", "take me",
    "please take me there", "take me now", "go", "navigate", "lets go", "let's go"
]

def is_confirmation_response(query: str) -> bool:
    query_clean = query.lower().strip().rstrip(".!").strip()
    return query_clean in CONFIRMATION_AFFIRMATIVES

def find_mapped_route(query: str) -> Optional[Dict[str, str]]:
    """
    Map a query to its best-matching route alias.

    Substring matching is used ("take me to kmap lab" -> "kmap lab"), but when
    several aliases match, the LONGEST one wins so a specific phrase beats a
    short fragment (e.g. "how do i start coding" -> Verilog Playground, not
    Home via the "start" alias).
    """
    query_lower = query.lower().strip()
    best_route: Optional[Dict[str, str]] = None
    best_alias_len = 0
    for data in ROUTE_MAPPINGS.values():
        for alias in data.get("aliases", []):
            if alias in query_lower and len(alias) > best_alias_len:
                best_route = {"name": data["name"], "path": data["path"]}
                best_alias_len = len(alias)
    return best_route
