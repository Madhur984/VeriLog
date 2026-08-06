import os
import json
import re
from pathlib import Path
import pypdf

def clean_text(text: str) -> str:
    """Fix common PDF font extraction artifacts."""
    return text.replace("\u2014", "—").replace("\u00b7", "·").strip()

def parse_pdf_pages(pages_text: list):
    """
    State machine parser for BitForBytes Site Route Map text.
    Handles single-line, multi-line (path on one line, name on next),
    and 2-column formats cleanly.
    """
    routes = []
    current_category = "General"
    
    # Header keywords to trigger category changes
    category_map = {
        "PUBLIC CORE & CONTENT PAGES": "Public Core & Content Pages",
        "PUBLIC INTERACTIVE TOOLS": "Public Interactive Tools",
        "PUBLIC FOUNDATION MODULES": "Public Foundation Modules",
        "GATED DIGITAL SYSTEM DESIGN": "Gated Digital System Design",
        "GATED BASIC ELECTRONICS": "Gated Basic Electronics",
        "GATED TOOLS, GAMES & EXPERIENCES": "Gated Tools, Games & Experiences",
        "AUTH AUTHENTICATION & ACCOUNT": "Auth Authentication & Account",
    }

    pending_path = None

    for page_text in pages_text:
        lines = page_text.splitlines()
        for line in lines:
            line_str = line.strip()
            if not line_str:
                continue

            # 1. Category header check
            matched_cat = False
            for key, cat_name in category_map.items():
                if key in line_str:
                    current_category = cat_name
                    pending_path = None
                    matched_cat = True
                    break
            if matched_cat:
                continue

            # 2. Skip table column header lines
            if line_str in ["ROUTE", "PAGE", "MODULE", "CHAPTER ROUTE", "ROUTE / PAGE", "bitforbytes.in | Route reference"] or line_str.startswith("BitForBytes") or line_str.startswith("Every route served"):
                continue

            # 3. Check for inline route + name on same line (e.g., "/portfolio Engineering portfolio /activities Activities")
            # First handle 2-column lines with inline names
            inline_matches = list(re.finditer(r'(?P<path>/(?:[a-zA-Z0-9_\-:]+/?)*|\*)\s+(?P<name>[^/\n*]+)', line_str))
            if len(inline_matches) > 0 and not (line_str.startswith("/") and len(line_str.split()) == 1):
                for m in inline_matches:
                    p = m.group("path").strip()
                    n = clean_text(m.group("name"))
                    # Filter out noise like '/dsd/1/:chapter'
                    if p.endswith("/:chapter"):
                        if routes and routes[-1]["path"] in p:
                            routes[-1]["chapter_path"] = p
                        continue
                        
                    routes.append({
                        "name": n,
                        "path": p,
                        "category": current_category,
                        "description": f"{n} (Category: {current_category})"
                    })
                pending_path = None
                continue

            # 4. Check for path alone on a line (e.g. "/portal" or "*")
            is_path_only = re.match(r'^(?P<path>/(?:[a-zA-Z0-9_\-:]+/?)*|\*)$', line_str)
            if is_path_only:
                p = is_path_only.group("path").strip()
                if p.endswith("/:chapter"):
                    if routes:
                        routes[-1]["chapter_path"] = p
                    pending_path = None
                else:
                    pending_path = p
                continue

            # 5. If we have a pending path, current line is its name
            if pending_path:
                n = clean_text(line_str)
                routes.append({
                    "name": n,
                    "path": pending_path,
                    "category": current_category,
                    "description": f"{n} (Category: {current_category})"
                })
                pending_path = None

    return routes

def extract_routes_from_pdf(pdf_path: str):
    pages_text = []
    if os.path.exists(pdf_path):
        reader = pypdf.PdfReader(pdf_path)
        for page in reader.pages:
            pages_text.append(page.extract_text() or "")
            
    return parse_pdf_pages(pages_text)

def main():
    pdf_path = "Site_Route_Map.pdf"
    if not os.path.exists(pdf_path) and os.path.exists("BitForBytes-Site-Audit.pdf"):
        pdf_path = "BitForBytes-Site-Audit.pdf"

    routes = extract_routes_from_pdf(pdf_path)
    
    output_path = Path("routes.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(routes, f, indent=2, ensure_ascii=False)
        
    print(f"✅ Extracted {len(routes)} routes into '{output_path.resolve()}'")

if __name__ == "__main__":
    main()
