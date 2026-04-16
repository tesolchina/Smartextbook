# SmartTextbook Slide Deck — Making-of Process
## How the `talk15Apr.html` Presentation Was Built with AI Assistance

**Speaker:** Simon Wang · Lecturer in English & Innovation Officer · The Language Centre, HKBU  
**Event:** TeachingMatters Seminar, 15 April 2026  
**Live URL:** `https://smartextbook.replit.app/talk15Apr`  
**GitHub:** `https://github.com/tesolchina/Smartextbook`  
**Tool used:** Replit AI Agent (conversational, iterative — no code written manually)

---

## 1. Key Files and Their Roles

| File | Purpose | Lines (final) |
|---|---|---|
| `artifacts/lesson-builder/public/talk15Apr.html` | **Canonical slide file** — the one presented at the seminar | 1521 |
| `artifacts/lesson-builder/public/talk.html` | Sync copy (served at `/talk`) | 1521 |
| `lecture/slides.html` | Sync copy (kept in `lecture/` folder for archival reference) | 1521 |
| `artifacts/lesson-builder/src/pages/talk.tsx` | React component — embeds the slides as an iframe at the `/talk` route | 43 |
| `artifacts/lesson-builder/src/App.tsx` | App routing — registers `/talk` and `/talk15Apr` routes | — |
| `artifacts/lesson-builder/src/pages/landing.tsx` | Landing page — links to `/talk15Apr` from the main site | — |
| `lecture/notes.md` | Speaker notes (initial draft, written alongside first slide version) | 55 |
| `docs/lessonWorkshopBlog/slideStory.md` | Narrative structure document created mid-process | — |
| `attached_assets/IMG_6320_1775921717239.jpeg` | Photo uploaded at the start — used as visual reference material | — |

**Three-file sync rule:**  
All three HTML copies must stay identical. Any change to `talk15Apr.html` must be propagated:
```bash
cp artifacts/lesson-builder/public/talk15Apr.html artifacts/lesson-builder/public/talk.html
cp artifacts/lesson-builder/public/talk15Apr.html lecture/slides.html
```

---

## 2. Git History — Full Commit Log

All commits below touch at least one of the three slide files.  
Repository remote: `https://github.com/tesolchina/Smartextbook`

| Datetime (UTC) | Commit | Description |
|---|---|---|
| 2026-04-11 15:36 | `637ba7c` | **Create presentation materials for an upcoming lecture** |
| 2026-04-11 16:11 | `e500d00` | Update lecture materials with new narrative and examples |
| 2026-04-14 04:46 | `610ccb9` | Add a presentation page and interactive demo for users to try |
| 2026-04-14 13:22 | `7a5ae0f` | Make slides fill the entire screen and update documentation |
| 2026-04-14 13:50 | `4002818` | Update presentation slides to reflect project evolution and current context |
| 2026-04-14 13:52 | `d21eea4` | Update speaker's detailed identity across presentation slides |
| 2026-04-14 13:55 | `6b6e636` | Update word choice chatbot to reflect actual system prompt and menu options |
| 2026-04-14 13:57 | `71f2d38` | Update the application name from LessonBuilder to SmartTextbook |
| 2026-04-14 14:00 | `291d394` | Add new slides to discuss chatbot customization pathways and update article link |
| 2026-04-14 14:08 | `77844b3` | Update presentation to showcase chatbot customization and new project ideas |
| 2026-04-14 14:11 | `0168777` | Improve typography by adjusting spacing for better readability |
| 2026-04-14 14:18 | `ba00d78` | Add new slides introducing SCORM and xAPI integration concepts |
| 2026-04-14 14:20 | `755647d` | Improve typography — remove forced uppercase from card titles and headers |
| 2026-04-14 14:22 | `28816e2` | Update case study slide to demonstrate natural language programming |
| 2026-04-14 14:26 | `cfb227d` | Add a slide referencing an early article about AI access and equity |
| 2026-04-15 02:08 | `3f18f72` | Improve mobile usability and slide navigation |
| 2026-04-15 02:08 | `539d48e` | Make the article link on slide 3 clickable |
| 2026-04-15 02:09 | `d3ebc3d` | Update title capitalisation for chatbot customisation lesson |
| 2026-04-15 02:11 | `42a5e26` | Improve the display of bulleted lists to ensure text wraps correctly |
| 2026-04-15 02:27 | `1017d6a` | Update slides to reflect recent advancements in AI and educational technology |
| 2026-04-15 02:30 | `8485b29` | Add more links to sources and literature throughout the presentation |
| 2026-04-15 04:40 | `87f61c2` | Adjust slide layout to prevent content overflow and improve spacing |
| 2026-04-15 04:47 | `946f635` | Add interactive demo for customising chatbot behaviour |
| 2026-04-15 04:50 | `8f01c9e` | Add interactive demo walkthrough and update presentation slides |
| 2026-04-15 04:55 | `55235b4` | Update API key instructions to include DeepSeek for Hong Kong users |
| 2026-04-15 05:55 | `9ae66a7` | Improve mobile presentation with a new bottom bar and larger controls |
| 2026-04-15 08:33 | `e50b282` | Update lesson content, fix broken links, enable markdown rendering, add QR code |
| 2026-04-15 08:49 | `729b907` | Improve presentation of the AI system prompt for clarity |
| 2026-04-15 09:01 | `cd1ca8c` | Update broken links to Google DeepMind research on AI learning |
| 2026-04-15 09:03 | `70d3dab` | Update slide 10 with new research findings (arXiv:2509.13348) and links |
| 2026-04-15 09:18 | `f40242e` | Correct Karpathy's post link on "Vibe Coding" |

---

## 3. Phase-by-Phase Narrative

---

### Phase 1 — First Draft (Apr 11, 15:36)
**Commit:** `637ba7c`  
**Files created:**
- `lecture/slides.html` (735 lines — first version)
- `lecture/notes.md` (55 lines)
- `attached_assets/IMG_6320_1775921717239.jpeg` (photo uploaded by Simon as reference)

**What happened:**  
Simon uploaded a photo and asked for a slide deck for an upcoming seminar on democratising AI-augmented textbook creation. The AI wrote the entire HTML slide deck from scratch in one pass — no framework, no build tool. Pure HTML + CSS + JavaScript in a single file.

**Initial slide structure (9 slides):**
1. Title — "Democratising AI-Augmented Textbook Creation"
2. The Problem — static textbooks
3. Prior Art — Google "Learn Your Way" (11% improvement)
4. The Gap — technical barriers as gatekeeping
5. Vibe Coding — Karpathy's concept applied to education
6. Platform — SmartTextbook flow diagram
7. Contributions — 6-box summary
8. Implications — "0 lines of code" as the punchline
9. Q&A

**Core CSS architecture established here** (unchanged through to final version):
```css
:root {
  --primary: #b84c2a;   /* warm terracotta */
  --accent:  #c97b3a;
  --bg:      #faf9f7;
  --card:    #fff;
  --text:    #1a1714;
  --muted:   #6b6560;
  --border:  #e8e4de;
  --serif:   'Georgia', 'Times New Roman', serif;
  --sans:    system-ui, -apple-system, 'Segoe UI', sans-serif;
  --slide-w: 960px;
  --slide-h: 540px;
}
```

**Slide transition system** (CSS + JS, established at first draft):
```css
.slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transform: translateX(40px);
  transition: opacity .4s ease, transform .4s ease;
  pointer-events: none;
}
.slide.active  { opacity: 1; transform: none; pointer-events: auto; }
.slide.exit    { opacity: 0; transform: translateX(-40px); }
```

**Speaker notes (`lecture/notes.md`)** were written alongside the slides — listing 7 anticipated audience questions (hallucinations, BYOK cost, privacy, etc.) that Simon would prepare for.

---

### Phase 2 — Narrative Refinement (Apr 11, 16:11)
**Commit:** `e500d00`  
**Files changed:** `lecture/slides.html`, `lecture/notes.md`

Narrative arc was sharpened. The concept of "natural language orchestration" was defined and woven into the slides. LessonBuilder case studies were added with more concrete examples.

---

### Phase 3 — Making it a Live Route (Apr 14, 04:46)
**Commit:** `610ccb9`  
**Files created:**
- `artifacts/lesson-builder/public/talk.html` (722 lines — first copy inside the web app)
- `artifacts/lesson-builder/src/pages/talk.tsx` — React wrapper component
- Updated `artifacts/lesson-builder/src/App.tsx` — added `/talk` route
- Updated `artifacts/lesson-builder/src/pages/landing.tsx` — added "Get Started" guide + link

**What happened:**  
The slides existed only in `lecture/slides.html` — inaccessible to the public. Simon asked for a URL anyone could visit. The decision was made to serve the slide HTML as a static file and embed it in an iframe via a React component.

The React route (`talk.tsx`) is minimal — it simply wraps the static HTML in an iframe that fills the viewport:
```tsx
export default function TalkPage() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const slidesUrl = `${base}/talk.html`;
  return (
    <div className="min-h-screen flex flex-col bg-[#1a1714]">
      <header>...</header>
      <div className="flex-1 relative">
        <iframe src={slidesUrl} className="absolute inset-0 w-full h-full border-0" />
      </div>
    </div>
  );
}
```

This is a deliberate design choice: keeping the slides as a standalone HTML file means they can also be opened directly in any browser without the React app — useful for offline presentations.

---

### Phase 4 — Fullscreen Layout (Apr 14, 13:22)
**Commit:** `7a5ae0f`  
**Files changed:** `artifacts/lesson-builder/public/talk.html`, `lecture/slides.html`  
**File created:** `docs/lessonWorkshopBlog/slideStory.md`

**Problem:** The initial layout showed slides inside a dark-background page with visible margins — fine for reading, but not for a projected presentation.

**Solution:** Rewrote the layout to make the slide deck fill 100% of the viewport. An overlaid control bar (previous/next buttons, slide counter) floats over the slide rather than sitting below it. This required switching the `body` from `flex + centered` to `position: fixed; inset: 0`.

---

### Phase 5 — Content Sprint (Apr 14, 13:50–14:26)
**11 commits in 36 minutes.**  
**Files changed each time:** both `artifacts/lesson-builder/public/talk.html` and `lecture/slides.html`

This was an intensive back-and-forth session where Simon reviewed the slides and gave rapid feedback. Changes made:

| Commit | Change |
|---|---|
| `4002818` | Updated slides to reflect the project's actual evolution |
| `d21eea4` | Corrected Simon's identity: "Lecturer in English & Innovation Officer · The Language Centre, HKBU" |
| `6b6e636` | Fixed the word-choice chatbot description to match the actual system prompt and menu |
| `71f2d38` | **Renamed the platform from "LessonBuilder" to "SmartTextbook"** throughout all slides |
| `291d394` | Added two new slides on chatbot customisation pathways |
| `77844b3` | Updated to showcase chatbot customisation as a core feature |
| `0168777` | Fixed letter-spacing and line-height for better readability |
| `ba00d78` | Added slides introducing SCORM and xAPI integration concepts |
| `755647d` | **Removed forced `text-transform: uppercase`** — card titles and headers were displaying in ALL CAPS, which looked wrong for proper nouns and URLs |
| `28816e2` | Updated the case study slide to demonstrate natural language programming |
| `cfb227d` | Added a slide referencing Simon's early article on AI access and equity |

---

### Phase 6 — Late-Night Polish (Apr 15, 02:08–04:55)
**9 commits.** Simon reviewed on mobile and found several issues.

**Issue 1 — Keyboard navigation breaking when typing in the demo**  
The slide deck used `ArrowLeft`/`ArrowRight` to navigate. When Simon typed into the interactive chatbot demo embedded in a slide, the keystrokes moved the slides instead.  
**Fix** (`3f18f72`): Added a guard in the keydown listener:
```javascript
document.addEventListener('keydown', e => {
  const tag = document.activeElement?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
      || document.activeElement?.isContentEditable) return;
  if (['ArrowRight','ArrowDown',' '].includes(e.key)) { e.preventDefault(); goTo(current + 1); }
  if (['ArrowLeft','ArrowUp'].includes(e.key))        { e.preventDefault(); goTo(current - 1); }
});
```

**Issue 2 — Article link on slide 3 was plain text, not clickable**  
Fix (`539d48e`): Wrapped the URL in an `<a href="...">` tag with `onclick="event.stopPropagation()"` to prevent the click from triggering slide navigation.

**Issue 3 — Bullet list text not wrapping correctly**  
Fix (`42a5e26`): The `<ul>` elements had `white-space: nowrap` inherited from a parent rule. Explicitly set `white-space: normal` and `word-break: break-word` on list items.

**Issue 4 — Content overflow on some slides**  
Fix (`87f61c2`): Reduced `font-size` on body text from `.9em` to `.82em` on affected slides; adjusted padding from `48px 56px` to `36px 44px` on dense content slides.

**Issue 5 — Interactive demo missing from slides**  
Commits `946f635` and `8f01c9e` added an embedded live chatbot demo directly inside a slide — users could type a message and see the AI tutor respond without leaving the presentation. A walkthrough overlay was added explaining each step.

**Issue 6 — Gemini API not accessible in Hong Kong**  
Fix (`55235b4`): Updated the API key setup instructions slide to recommend DeepSeek first in all provider dropdowns, with a clear note: "Gemini is not currently accessible in Hong Kong without a VPN."

---

### Phase 7 — Mobile Bottom Bar (Apr 15, 05:55)
**Commit:** `9ae66a7`  
**Files changed:** `artifacts/lesson-builder/public/talk.html`, `lecture/slides.html`  
**+172 lines, −52 lines**

**Problem:** On portrait-orientation mobile, the slide (16:9 landscape) was scaled down to fit the width, leaving the navigation controls hidden off-screen below.

**Solution:** A persistent bottom bar that appears only on portrait mobile, containing large tap targets for prev/next and a fullscreen button. Portrait detection via:
```javascript
function isPortraitMobile() {
  return window.innerWidth < 768 && window.innerHeight > window.innerWidth;
}
function updateOrientation() {
  if (isPortraitMobile()) {
    phHint.classList.add('ph-show');
    // reserve bottom space so slide doesn't overlap bar
    const reservedH = phHint.offsetHeight || 56;
    // ... adjust slide scaling
  }
}
updateOrientation();
window.addEventListener('resize', updateOrientation);
```

Fullscreen was handled cross-browser (Webkit prefix):
```javascript
function doFullscreen() {
  const req = document.documentElement.requestFullscreen
            || document.documentElement.webkitRequestFullscreen;
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    req.call(document.documentElement);
  } else {
    (document.exitFullscreen || document.webkitExitFullscreen).call(document);
  }
}
```

---

### Phase 8 — Morning of the Seminar (Apr 15, 08:33–09:18)
**5 commits in 45 minutes** — final content fixes under time pressure.

**08:33 — `e50b282`:** Major content pass. Broken links updated, markdown rendering enabled for AI responses in the demo, QR code added to the final slide pointing to `smartextbook.replit.app`.

**08:49 — `729b907`:** Slide 5 (system prompt) redesigned.  
**Problem:** The full raw system prompt (several hundred characters) was displayed verbatim — too long for a slide, and hiding the structure from the audience.  
**Solution:** Split into two layers using native HTML `<details>`:
```html
<!-- Bullet summary always visible -->
<ul>
  <li>Grounds all answers in the uploaded chapter</li>
  <li>Socratic style — asks before it tells</li>
  <li>Refuses to generate content not in the source</li>
</ul>

<!-- Full prompt hidden behind toggle -->
<details onclick="event.stopPropagation()"
         style="flex:1;min-height:0;display:flex;flex-direction:column">
  <summary style="color:var(--primary);cursor:pointer">▶ Show full system prompt</summary>
  <pre>...raw prompt text...</pre>
</details>
```
`onclick="event.stopPropagation()"` prevents the click on the `<details>` from being intercepted by the slide navigation layer.

**09:01 — `cd1ca8c`:** Broken link fix.  
The citation URL for Google's "Learn Your Way" research was pointing to `deepmind.google/...` which returned 404. Replaced across all three file copies with the working URL:  
`https://research.google/blog/learn-your-way-reimagining-textbooks-with-generative-ai/`  
Citation updated to: "Google (DeepMind·Research·LearnX), 2025"

**09:03 — `70d3dab`:** Slide 10 fully rewritten.  
The previous Slide 10 referenced the Google research in general terms. Updated with full detail from the arXiv preprint:
- Citation: arXiv:2509.13348, "Towards an AI-Augmented Textbook" (2025)
- Two-stage approach: Stage 1 (personalised lesson generation) + Stage 2 (Socratic AI tutor)
- RCT result: 11% improvement in post-test scores
- Model attribution: Gemini 2.5 Pro

**09:18 — `f40242e`:** Karpathy tweet link corrected.  
The embedded X (Twitter) link used tweet ID ending in `...016` — the wrong tweet. Correct ID (last 3 digits `383`) confirmed and updated across all three file copies:  
`https://x.com/karpathy/status/1886192184808149383`

---

## 4. Key Technical Decisions

### Decision 1 — Pure HTML, no framework
The slides are a single self-contained `.html` file. No React, no build step, no dependencies. This means:
- ✅ Can be opened offline in any browser by double-clicking
- ✅ Can be emailed or shared as a single file
- ✅ No deployment risk — the file is static
- ⚠️ All CSS and JS must be inlined, which makes the file long (1521 lines)

### Decision 2 — CSS custom properties for theming
All colours, fonts, and spacing are defined as CSS variables in `:root`. Changing `--primary` changes the entire colour scheme. This made it easy to iterate on the visual identity rapidly.

### Decision 3 — Iframe embedding in React
The slides HTML is served as a static asset (`public/talk.html`) and embedded in a React component via `<iframe>`. This means:
- The slides work at both `/talk` (the React route, with the SmartTextbook nav header) and `/talk.html` (direct static file, full raw presentation)
- The React app does not need to know anything about the slide content

### Decision 4 — Three-file sync (not one source of truth)
There are three identical copies of the file. This is a known technical debt — ideally there would be one source file. The reason for three copies:
- `lecture/slides.html` — original location, before the web app existed
- `artifacts/lesson-builder/public/talk.html` — required to be at this path for the static file server
- `artifacts/lesson-builder/public/talk15Apr.html` — added for the permanent seminar URL `/talk15Apr`

**The sync command must be run manually after every change:**
```bash
cp artifacts/lesson-builder/public/talk15Apr.html artifacts/lesson-builder/public/talk.html
cp artifacts/lesson-builder/public/talk15Apr.html lecture/slides.html
```

---

## 5. Issues Encountered and How They Were Fixed

| Issue | When | Fix |
|---|---|---|
| Arrow key navigation fires when typing in embedded demo | Apr 15, 02:08 | `document.activeElement?.tagName` guard in keydown handler |
| Article URL not clickable | Apr 15, 02:08 | Wrapped in `<a>` with `stopPropagation()` |
| Bullet list text not wrapping | Apr 15, 02:11 | Set `white-space: normal` on `<li>` elements |
| Content overflow on dense slides | Apr 15, 04:40 | Reduced font-size and padding on affected slides |
| System prompt too long for one slide | Apr 15, 08:49 | `<details>`/`<summary>` collapsible with `stopPropagation()` |
| DeepMind link returning 404 | Apr 15, 09:01 | Replaced with `research.google/blog/...` URL |
| Karpathy tweet ID wrong | Apr 15, 09:18 | Corrected last 3 digits from `016` → `383` |
| Mobile portrait nav controls hidden | Apr 15, 05:55 | Added persistent bottom bar with portrait detection JS |
| Gemini API not accessible in HK | Apr 15, 04:55 | Added DeepSeek as primary recommendation |

---

## 6. What Could Be Improved Next Time

1. **Single source of truth** — Use a build step (e.g., a simple Node script) to generate all three copies from one source file. Eliminates the manual sync risk.

2. **Slide content in data, not markup** — Separate the slide content (text, links, titles) from the layout HTML. Something like a JSON array of slide objects that a small JS renderer turns into HTML. This would make content editing much faster and less error-prone.

3. **Version-controlled slide content** — If slide text were in a separate data file (JSON or Markdown), the git diff would show exactly what changed in each slide rather than diffing through a long HTML file.

4. **Automated link checker** — A pre-commit hook that runs `curl -I` on all `href` attributes in the slide HTML would have caught the DeepMind 404 earlier.

5. **Mobile-first layout** — The current approach is 16:9 landscape with a mobile workaround. A responsive layout that reflows content for portrait viewing would be cleaner than the bottom-bar adaptation.

6. **Tweet/post ID verification** — When embedding social media links, confirm the exact URL in the browser before committing. The Karpathy tweet error happened because the URL was reconstructed from memory rather than copied directly.

---

*Document compiled from 31 git commits across `lecture/slides.html`, `artifacts/lesson-builder/public/talk.html`, and `artifacts/lesson-builder/public/talk15Apr.html`. GitHub: `https://github.com/tesolchina/Smartextbook`. April 2026.*
