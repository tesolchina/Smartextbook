import { google } from 'googleapis';

const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : 'depl ' + process.env.WEB_REPL_RENEWAL;

async function getAccessToken() {
    const res = await fetch(
        `https://${hostname}/api/v2/connection?include_secrets=true&connector_names=google-docs`,
        { headers: { 'Accept': 'application/json', 'X-Replit-Token': xReplitToken } }
    );
    const data = await res.json();
    const conn = data.items?.[0];
    return conn?.settings?.access_token || conn?.settings?.oauth?.credentials?.access_token;
}

const DOC_ID = '1UtgX2TW2J2ZZ53SZIpBWD2ZgIl_OcqUKTkuscrP56Ec';
const TAB_ID = 't.p2avynm1xu96';

// Each segment: { text, url?, bold? }
// The text segments are assembled in order; positions are tracked cumulatively.
const SEGMENTS = [
    { text: 'From Static to Smart: How Vibe Coding Democratizes AI-Augmented Textbooks for Every Educator', bold: true },
    { text: '\n\n' },

    { text: 'The textbook has endured for centuries as education\'s most trusted knowledge vessel. Yet this durability masks a fundamental incompatibility: the fixed, linear format that makes textbooks reliable also makes them resistant to how people actually learn — through varied formats, repeated exposure, and personalized pathways. Transforming a chapter into a multi-modal learning experience requires video production, quiz design, and software development — resources beyond most teachers. Recent Google research shows this is technically solvable. But it raises an urgent question: who gets to do the solving, and on whose terms?\n\n' },

    { text: 'Google\'s vision and its hidden cost\n', bold: true },
    { text: '\n' },

    { text: 'In 2025, Google\'s LearnLM team published ' },
    { text: '"Towards an AI-Augmented Textbook"', url: 'https://arxiv.org/abs/2509.13348' },
    { text: ', demonstrating a system that transforms static chapters into personalized learning experiences. Drawing on ' },
    { text: 'dual coding theory', url: 'https://nschwartz.yourweb.csuchico.edu/Clark%20&%20Paivio.pdf' },
    { text: ' — the cognitive principle that verbal and visual processing together strengthen retention — the system generates immersive text, narrated slides, audio lessons, and mind maps, all adapted to each student\'s grade level and interests.\n\n' },

    { text: 'The results are compelling: a randomized controlled trial found 11% higher retention rates, expert pedagogical ratings above 0.85, and 93% of students preferring it to traditional digital readers. But this system was built by 34+ Google researchers on proprietary infrastructure, optimized for adoption of Google\'s own ecosystem. It is not platform-neutral, not open-source, and not in the hands of educators.\n\n' },

    { text: 'What can a teacher do when they share this pedagogical vision but lack these resources?\n\n' },

    { text: 'Vibe coding: the missing translation layer\n', bold: true },
    { text: '\n' },

    { text: 'The answer lies in vibe coding — a paradigm where developers build software through natural language conversation with AI, rather than traditional code authorship. ' },
    { text: 'The first empirical study of vibe coding', url: 'https://arxiv.org/abs/2506.23253' },
    { text: ' found something counterintuitive: it does not eliminate expertise — it redistributes it. The bottleneck shifts from writing code to articulating intent precisely. ' },
    { text: 'A second taxonomic review', url: 'https://arxiv.org/abs/2505.19443' },
    { text: ' confirms that vibe coding systems "thrive in early-stage prototyping and education" — exactly where teachers operate.\n\n' },

    { text: 'For educators, this shift is transformative. Pedagogical clarity — knowing what students need, how to sequence a concept, what a good assessment looks like — is expertise teachers already hold. Vibe coding turns that expertise into a development asset.\n\n' },

    { text: 'In practice, building SmartTextbook meant describing each desired feature in plain language, then iterating through real failures: malformed outputs, broken quiz logic, interface mismatches. Each was resolved through conversation, not documentation. The constraint was never the technology. It was the clarity of intent.\n\n' },

    { text: 'SmartTextbook: one working proof of concept\n', bold: true },
    { text: '\n' },

    { text: 'SmartTextbook', url: 'https://smartextbook.replit.app' },
    { text: ' (open-source on ' },
    { text: 'GitHub', url: 'https://github.com/tesolchina/Smartextbook' },
    { text: ') is the result — a replicable starting point, not a finished product.\n\n' },

    { text: 'Educators paste a chapter or URL and the system generates a structured summary, key concept glossary, and interactive quiz. A mind map follows automatically, reflecting dual coding principles. An embedded AI tutor allows students to ask questions in real time, within the same interface.\n\n' },

    { text: 'Lessons export as fully self-contained HTML files — no server, no login, any device. Before publishing, an AI content check reviews lessons for factual accuracy and quiz correctness. Shared lessons (90-day public links) include a student comment section and a learning report feature, where students record quiz scores and reflections, downloadable as Markdown or emailed directly to an instructor.\n\n' },

    { text: 'The key architectural difference from Google\'s system: SmartTextbook uses a BYOK (Bring Your Own Key) model supporting 11 LLM providers — OpenAI, Gemini, DeepSeek, Mistral, Grok, and more. No vendor lock-in. Fully open-source.\n\n' },

    { text: 'Current limitations deserve honesty: no student account system, no class management dashboard, no audio or video output, no cross-session learning analytics. These are the next iteration targets, not permanent constraints.\n\n' },

    { text: 'What this proves: Create is within reach\n', bold: true },
    { text: '\n' },

    { text: 'In September 2024, UNESCO published AI competency frameworks for ' },
    { text: 'teachers', url: 'https://www.unesco.org/en/articles/ai-competency-framework-teachers' },
    { text: ' and ' },
    { text: 'students', url: 'https://www.unesco.org/en/articles/ai-competency-framework-students' },
    { text: ' that share the same architecture: three progressive levels of AI literacy. Teachers move from Acquire to Deepen to Create; students from Understand to Apply to Create. In both cases, the apex is not using AI tools — it is building them.\n\n' },

    { text: 'Most EdTech, including Google\'s system, positions educators as consumers. Vibe coding offers a different pathway — one that reaches the Create tier UNESCO defines as the highest form of AI literacy. ' },
    { text: 'Research on faculty AI development', url: 'https://arxiv.org/html/2509.11999v1' },
    { text: ' confirms that the deepest professional growth comes when instructors act as designers of responsible AI practice, not passive adopters. ' },
    { text: 'A global systematic review', url: 'https://www.sciencedirect.com/science/article/pii/S2590291125008447' },
    { text: ' further shows that adaptive AI systems improve learning outcomes by 15–25% compared to traditional instruction — making the case to build them compelling.\n\n' },

    { text: 'SmartTextbook is not the destination. It is evidence that the journey is possible — without a research team, without proprietary infrastructure, without platform dependency. The open-source model means the next version can be built by anyone: a language teacher in Hong Kong, a science educator in Nairobi, a curriculum designer in São Paulo.\n\n' },

    { text: 'Fork the repository. Describe your students. Build your version.', bold: true },
];

// Build full text and track link/bold ranges
let fullText = '';
const linkRanges = []; // { start, end, url }
const boldRanges = []; // { start, end }

for (const seg of SEGMENTS) {
    const start = fullText.length;
    fullText += seg.text;
    const end = fullText.length;
    if (seg.url) linkRanges.push({ start, end, url: seg.url });
    if (seg.bold) boldRanges.push({ start, end });
}

const wordCount = fullText.split(/\s+/).filter(w => w.length > 0).length;
console.log(`Total chars: ${fullText.length}, Word count: ~${wordCount}`);
console.log(`Links: ${linkRanges.length}, Bold ranges: ${boldRanges.length}`);

async function main() {
    const accessToken = await getAccessToken();
    if (!accessToken) throw new Error('No access token');
    console.log('Token obtained');

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    const docs = google.docs({ version: 'v1', auth });

    // Read current tab end index
    const doc = await docs.documents.get({ documentId: DOC_ID, includeTabsContent: true });
    const tab = doc.data.tabs?.find(t => t.tabProperties?.tabId === TAB_ID);
    const body = tab?.documentTab?.body;
    const endIndex = body?.content?.[body.content.length - 1]?.endIndex || 2;
    console.log(`Current endIndex: ${endIndex}`);

    // Step 1: Delete existing content + insert new text
    const step1Requests = [];
    if (endIndex > 2) {
        step1Requests.push({
            deleteContentRange: {
                range: { startIndex: 1, endIndex: endIndex - 1, tabId: TAB_ID }
            }
        });
    }
    step1Requests.push({
        insertText: {
            location: { index: 1, tabId: TAB_ID },
            text: fullText
        }
    });

    await docs.documents.batchUpdate({ documentId: DOC_ID, requestBody: { requests: step1Requests } });
    console.log('Text inserted');

    // Step 2: Apply bold and link styles
    // NOTE: Inserted text starts at index 1 in the doc, so we offset all positions by 1
    const OFFSET = 1;
    const step2Requests = [];

    // Apply bold formatting to headings
    for (const r of boldRanges) {
        step2Requests.push({
            updateTextStyle: {
                range: {
                    startIndex: r.start + OFFSET,
                    endIndex: r.end + OFFSET,
                    tabId: TAB_ID
                },
                textStyle: { bold: true },
                fields: 'bold'
            }
        });
    }

    // Apply hyperlinks
    for (const r of linkRanges) {
        step2Requests.push({
            updateTextStyle: {
                range: {
                    startIndex: r.start + OFFSET,
                    endIndex: r.end + OFFSET,
                    tabId: TAB_ID
                },
                textStyle: { link: { url: r.url } },
                fields: 'link'
            }
        });
    }

    await docs.documents.batchUpdate({ documentId: DOC_ID, requestBody: { requests: step2Requests } });
    console.log(`Formatting applied: ${boldRanges.length} bold, ${linkRanges.length} links`);
    console.log('Done! Article is ready.');
}

main().catch(e => { console.error('ERROR:', e.message, e.stack); process.exit(1); });
