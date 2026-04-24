"""
Download PDFs for literature review papers.
Strategy: OpenAlex (OA) → Unpaywall → Sci-Hub
Saves to the same folder as this script.
"""

import os, sys, time, json, urllib.request, urllib.parse, gzip, re
from pathlib import Path

OUT_DIR  = Path(__file__).parent
MAILTO   = "research@hkbu.edu.hk"
SCIHUB   = "https://sci-hub.st"
LOG_FILE = OUT_DIR / "download_log.json"

PAPERS = [
    # ── Vibe Coding / Natural Language Programming ──────────────────────────
    {"key": "subramonyam2023johnny",    "doi": "10.1145/3544548.3581388",              "title": "Why Johnny Can't Prompt (CHI 2023)"},
    {"key": "sarkar2022programming",    "doi": "10.48550/arxiv.2208.06213",            "title": "What is it like to program with AI"},
    {"key": "salleh2025vibecoding",     "doi": "10.36227/techrxiv.174681482.27435614/v1", "title": "A Review on Vibe Coding"},
    {"key": "abubakar2025vibe",         "doi": "10.48550/arxiv.2509.10652",            "title": "Vibe Coding for Product Design"},
    {"key": "sarkar2025vibecoding",     "doi": "10.48550/arxiv.2506.23253",            "title": "Vibe coding: programming through conversation with AI"},

    # ── Computational Thinking + Language Education ──────────────────────────
    {"key": "giannakos2024ct",          "doi": "10.1007/s10639-024-12522-4",           "title": "CT integrated into English language curriculum"},
    {"key": "su2023tracking",           "doi": "10.3390/su15031983",                   "title": "Tracking Visual Programming for CT"},
    {"key": "wing2006ct",               "doi": "10.1145/1118178.1118215",              "title": "Wing 2006 Computational Thinking (CACM)"},

    # ── Learnersourcing ──────────────────────────────────────────────────────
    {"key": "kim2022learnersourcing",   "doi": "10.1145/3491140.3528286",              "title": "Learnersourcing: Student-generated Content @ Scale"},
    {"key": "liu2024llm",               "doi": "10.1007/s10639-024-12851-4",           "title": "LLM evaluate learnersourcing quality"},
    {"key": "moore2022gpt3",            "doi": "10.1007/978-3-031-16290-9_18",         "title": "Student-generated SAQ quality via GPT-3"},

    # ── xAPI / Learning Analytics ────────────────────────────────────────────
    {"key": "glahn2022xapi",            "doi": "10.18608/jla.2022.7161",               "title": "xAPI Made Easy (JLA)"},

    # ── AI Assessment / Scoring ──────────────────────────────────────────────
    {"key": "yavuz2025llm",             "doi": "10.1111/bjet.13548",                   "title": "Yavuz 2025 LLM EFL essay grading (BJET)"},

    # ── ProComm / IEEE TPC reference cases ───────────────────────────────────
    {"key": "leydens2009listening",     "doi": "10.1109/TPC.2009.2013312",             "title": "Leydens & Lucena 2009 Listening (IEEE TPC)"},
]

# ────────────────────────────────────────────────────────────────────────────

def http_get(url, timeout=25):
    headers = {
        "User-Agent":      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0",
        "Accept":          "application/pdf,text/html,*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate",
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            data = r.read()
            if r.headers.get("Content-Encoding") == "gzip" or data[:2] == b'\x1f\x8b':
                try: data = gzip.decompress(data)
                except: pass
            return data
    except Exception as e:
        return None

def is_pdf(data):
    return bool(data and len(data) > 4 and data[:4] == b'%PDF')

def openalex_pdf(doi):
    enc = urllib.parse.quote(doi, safe="")
    url = f"https://api.openalex.org/works/https://doi.org/{enc}?mailto={MAILTO}"
    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            d = json.loads(r.read())
        oa = d.get("open_access", {})
        if oa.get("oa_url"): return oa["oa_url"]
        best = d.get("best_oa_location", {}) or {}
        return best.get("pdf_url") or best.get("url") or ""
    except:
        return ""

def unpaywall_pdf(doi):
    enc = urllib.parse.quote(doi, safe="")
    url = f"https://api.unpaywall.org/v2/{enc}?email={MAILTO}"
    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            d = json.loads(r.read())
        if not d.get("is_oa"): return ""
        best = d.get("best_oa_location") or {}
        return best.get("url_for_pdf") or best.get("url") or ""
    except:
        return ""

def scihub_pdf(doi):
    url = f"{SCIHUB}/{urllib.parse.quote(doi, safe='')}"
    html = http_get(url)
    if not html: return ""
    text = html.decode("utf-8", errors="ignore")
    # Look for the PDF embed URL
    m = re.search(r'<embed[^>]+src=["\']([^"\']+\.pdf[^"\']*)["\']', text, re.I)
    if not m:
        m = re.search(r'citation_pdf_url["\s:]+([^\s"\'<>]+)', text)
    if not m:
        m = re.search(r'(https?://[^\s"\'<>]+\.pdf)', text)
    if not m: return ""
    pdf_url = m.group(1)
    if pdf_url.startswith("//"): pdf_url = "https:" + pdf_url
    elif pdf_url.startswith("/"): pdf_url = SCIHUB + pdf_url
    return pdf_url

# ────────────────────────────────────────────────────────────────────────────

def load_log():
    if LOG_FILE.exists():
        return json.loads(LOG_FILE.read_text())
    return {}

def save_log(log):
    LOG_FILE.write_text(json.dumps(log, indent=2))

def main():
    log = load_log()
    downloaded = skipped = failed = 0

    print(f"Output folder: {OUT_DIR}")
    print(f"Papers to process: {len(PAPERS)}\n")

    for p in PAPERS:
        doi   = p["doi"]
        key   = p["key"]
        title = p["title"]
        dest  = OUT_DIR / f"{key}.pdf"

        print(f"[{key}] {title[:60]}")

        if dest.exists():
            print(f"  ✓ already downloaded — skip")
            skipped += 1
            continue

        if log.get(doi, {}).get("status") == "not-found":
            print(f"  – previously not found — skip")
            skipped += 1
            continue

        pdf_data = None
        source   = ""

        # 1. OpenAlex
        oa_url = openalex_pdf(doi)
        if oa_url:
            print(f"  → trying OpenAlex: {oa_url[:70]}...")
            pdf_data = http_get(oa_url)
            if is_pdf(pdf_data): source = "OpenAlex"
            else: pdf_data = None
        time.sleep(0.3)

        # 2. Unpaywall
        if not pdf_data:
            up_url = unpaywall_pdf(doi)
            if up_url:
                print(f"  → trying Unpaywall: {up_url[:70]}...")
                pdf_data = http_get(up_url)
                if is_pdf(pdf_data): source = "Unpaywall"
                else: pdf_data = None
            time.sleep(0.3)

        # 3. Sci-Hub
        if not pdf_data:
            print(f"  → trying Sci-Hub ({SCIHUB})...")
            sh_url = scihub_pdf(doi)
            if sh_url:
                print(f"     URL: {sh_url[:70]}...")
                pdf_data = http_get(sh_url)
                if is_pdf(pdf_data): source = "Sci-Hub"
                else: pdf_data = None
            time.sleep(2.5)

        if pdf_data and is_pdf(pdf_data):
            dest.write_bytes(pdf_data)
            log[doi] = {"status": "ok", "source": source, "file": dest.name}
            save_log(log)
            print(f"  ✅ saved → {dest.name} ({len(pdf_data)//1024}KB) [{source}]")
            downloaded += 1
        else:
            log[doi] = {"status": "not-found"}
            save_log(log)
            print(f"  ❌ not available")
            failed += 1

        print()

    print("=" * 55)
    print(f"Downloaded:  {downloaded}")
    print(f"Skipped:     {skipped}")
    print(f"Not found:   {failed}")
    print(f"Saved to:    {OUT_DIR}")

if __name__ == "__main__":
    main()
