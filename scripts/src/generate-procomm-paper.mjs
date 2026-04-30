/**
 * Generate IEEE ProComm 2026 camera-ready Word document
 * Run: node scripts/src/generate-procomm-paper.mjs
 */
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, Table, TableRow, TableCell, WidthType,
  BorderStyle, convertInchesToTwip, PageNumber, Footer,
  Header, TabStopType, TabStopPosition, ShadingType,
  UnderlineType, LineRuleType,
} from "docx";
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../../projects/IEEE/procomm2026-workshop-paper-CAMERA-READY.docx");

// ── Colours & fonts ──────────────────────────────────────────────────────────
const FONT = "Times New Roman";
const FONT_SANS = "Arial";
const BLACK = "000000";
const GREY = "444444";
const IEEE_BLUE = "1F497D";

// ── Helpers ──────────────────────────────────────────────────────────────────
const pt = (n) => n * 2; // half-points (docx unit)

const body = (text, opts = {}) =>
  new Paragraph({
    spacing: { after: 120, line: 276, lineRule: LineRuleType.AUTO },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: pt(11),
        color: BLACK,
        ...opts,
      }),
    ],
  });

const bold = (text, size = 11) =>
  new TextRun({ text, font: FONT, size: pt(size), bold: true, color: BLACK });

const italic = (text, size = 11) =>
  new TextRun({ text, font: FONT, size: pt(size), italics: true, color: BLACK });

const run = (text, size = 11, opts = {}) =>
  new TextRun({ text, font: FONT, size: pt(size), color: BLACK, ...opts });

const emptyLine = (pts = 6) =>
  new Paragraph({ spacing: { after: pt(pts) }, children: [new TextRun("")] });

const sectionHeading = (text) =>
  new Paragraph({
    spacing: { before: 200, after: 100 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: pt(11),
        bold: true,
        color: BLACK,
        allCaps: true,
      }),
    ],
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
    },
  });

const refLine = (text) =>
  new Paragraph({
    spacing: { after: 80 },
    indent: { left: convertInchesToTwip(0.25), hanging: convertInchesToTwip(0.25) },
    children: [new TextRun({ text, font: FONT, size: pt(10), color: GREY })],
  });

// ── Table helper ─────────────────────────────────────────────────────────────
const tableCell = (text, isHeader = false) =>
  new TableCell({
    shading: isHeader ? { fill: "E8F0FB", type: ShadingType.CLEAR } : undefined,
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            font: FONT,
            size: pt(10),
            bold: isHeader,
            color: isHeader ? IEEE_BLUE : BLACK,
          }),
        ],
      }),
    ],
  });

// ── Document ─────────────────────────────────────────────────────────────────
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: FONT, size: pt(11), color: BLACK },
        paragraph: { spacing: { after: 120 } },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1.25),
            right: convertInchesToTwip(1.25),
          },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: "ProComm 2026 Workshop Paper — Submission #64",
                  font: FONT_SANS,
                  size: pt(9),
                  color: "888888",
                  italics: true,
                }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "IEEE ProComm 2026 · Edmonton, Canada · July 12–15, 2026",
                  font: FONT_SANS,
                  size: pt(9),
                  color: "888888",
                }),
              ],
            }),
          ],
        }),
      },
      children: [
        // ── TITLE BLOCK ────────────────────────────────────────────────────
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 80 },
          children: [
            new TextRun({
              text: "WORKSHOP",
              font: FONT_SANS,
              size: pt(9),
              color: "888888",
              allCaps: true,
              bold: true,
            }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 160 },
          children: [
            new TextRun({
              text: "From Static to Interactive: Transforming Professional Communication Materials with Agentic AI and Vibe Coding",
              font: FONT,
              size: pt(16),
              bold: true,
              color: IEEE_BLUE,
            }),
          ],
        }),

        // Author
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [
            new TextRun({ text: "Simon Wang", font: FONT, size: pt(12), bold: true, color: BLACK }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: "Language Centre, Hong Kong Baptist University",
              font: FONT, size: pt(11), italics: true, color: GREY,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: "simonwang@hkbu.edu.hk",
              font: FONT, size: pt(11), color: GREY,
            }),
          ],
        }),

        emptyLine(4),

        // Submission info
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: "Submission #64  ·  Camera-ready  ·  April 30, 2026",
              font: FONT_SANS, size: pt(9), color: "888888",
            }),
          ],
        }),

        emptyLine(10),

        // ── KEYWORDS ──────────────────────────────────────────────────────
        new Paragraph({
          spacing: { after: 160 },
          children: [
            new TextRun({ text: "Keywords: ", font: FONT, size: pt(11), bold: true }),
            new TextRun({
              text: "Agentic AI, interactive learning materials, PITA framework, professional communication pedagogy, vibe coding",
              font: FONT, size: pt(11), italics: true, color: GREY,
            }),
          ],
        }),

        // ── ABSTRACT ──────────────────────────────────────────────────────
        sectionHeading("Abstract"),
        emptyLine(2),
        new Paragraph({
          spacing: { after: 120, line: 276, lineRule: LineRuleType.AUTO },
          indent: { left: convertInchesToTwip(0.25), right: convertInchesToTwip(0.25) },
          children: [
            new TextRun({
              text: "The IEEE Professional Communication Society hosts over 65 static articles of significant pedagogical value. This workshop introduces the PITA framework—Parse, Identify, Transform, Augment—a structured, no-code methodology for transforming these articles into interactive learning modules using agentic AI and vibe coding. Participants without programming backgrounds will direct an AI agent through each PITA stage using natural language instructions, producing a complete browser-based interactive lesson within the 75-minute session. A working prototype demonstrating the full workflow is available at ",
              font: FONT, size: pt(11), color: GREY,
            }),
            new TextRun({
              text: "https://smartextbook.replit.app/listening-demo.html",
              font: FONT, size: pt(11), color: "1155CC",
              underline: { type: UnderlineType.SINGLE, color: "1155CC" },
            }),
            new TextRun({ text: ".", font: FONT, size: pt(11), color: GREY }),
          ],
        }),

        emptyLine(8),

        // ── 1. INTRODUCTION ───────────────────────────────────────────────
        sectionHeading("1.  Introduction"),
        emptyLine(2),

        body(
          "Static professional communication articles rarely achieve their full pedagogical potential. Research consistently demonstrates that active engagement—through scenario-based questions, immediate feedback, and multimodal representation—produces deeper and more durable learning than passive reading [1]. The challenge for practitioners is not a shortage of good content but a shortage of accessible tools for transforming that content into interactive form."
        ),
        emptyLine(2),
        body(
          "Agentic AI systems can now execute multi-step document transformation tasks autonomously from natural language instructions—reading an article, identifying its structure, generating quiz items, producing narration scripts, and assembling HTML output without traditional programming. This capability, termed vibe coding [2], makes interactive learning design accessible to professional communicators whose expertise lies in language rather than software."
        ),

        emptyLine(8),

        // ── 2. PITA FRAMEWORK ─────────────────────────────────────────────
        sectionHeading("2.  The PITA Framework"),
        emptyLine(2),
        body("PITA is a four-stage workflow for transforming a static article into a self-contained interactive module."),
        emptyLine(2),

        new Paragraph({
          spacing: { after: 100, line: 276, lineRule: LineRuleType.AUTO },
          children: [bold("Parse.  "), run("The AI agent analyzes the source article, identifying key concepts, argumentative structure, and candidate learning objectives aligned to Bloom's Taxonomy.")],
        }),
        new Paragraph({
          spacing: { after: 100, line: 276, lineRule: LineRuleType.AUTO },
          children: [bold("Identify.  "), run("The practitioner, guided by Parse output, selects which concepts require active practice and what activity types—scenario questions, classification tasks, reflection prompts—will reveal genuine understanding rather than surface recall.")],
        }),
        new Paragraph({
          spacing: { after: 100, line: 276, lineRule: LineRuleType.AUTO },
          children: [bold("Transform.  "), run("The agent assembles a single-file HTML module with navigation, quiz logic, progress tracking, and instant feedback. The output requires no server infrastructure and runs in any browser.")],
        }),
        new Paragraph({
          spacing: { after: 100, line: 276, lineRule: LineRuleType.AUTO },
          children: [bold("Augment.  "), run("The practitioner adds modalities: AI-generated audio narration, design rationale annotations for educators, source citations, and accessibility features.")],
        }),

        emptyLine(8),

        // ── 3. PROTOTYPE ──────────────────────────────────────────────────
        sectionHeading("3.  Prototype: The Listening Demo"),
        emptyLine(2),
        body(
          "The workshop centers on a working example: an interactive transformation of Lydens and Lucena's 2009 IEEE Transactions on Professional Communication article on listening as an engineering skill [3]. The prototype demonstrates all four PITA stages in a completed artifact. Each section includes scenario-based quiz items targeting Bloom's Apply level, audio narration generated via ElevenLabs text-to-speech, and visible design annotations explaining each pedagogical decision. The entire module was produced through natural language instructions to an AI agent in under four hours, including content review. The original authors have reviewed and approved the transformation."
        ),

        emptyLine(8),

        // ── 4. WORKSHOP DESIGN ────────────────────────────────────────────
        sectionHeading("4.  Workshop Design"),
        emptyLine(2),
        body(
          "The 75-minute session requires no prior programming experience. Participants need only a laptop with a browser and access to poe.com, a platform-neutral interface supporting multiple AI model providers."
        ),
        emptyLine(6),

        // Table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                tableCell("Time", true),
                tableCell("Activity", true),
              ],
            }),
            new TableRow({ children: [tableCell("0–10 min"), tableCell("Live demonstration of the Listening Demo prototype")] }),
            new TableRow({ children: [tableCell("10–20 min"), tableCell("PITA framework introduction; participants receive a pre-built AI skill file")] }),
            new TableRow({ children: [tableCell("20–35 min"), tableCell("Hands-on: Parse and Identify with a chosen ProComm article")] }),
            new TableRow({ children: [tableCell("35–55 min"), tableCell("Hands-on: Transform—generating the interactive HTML")] }),
            new TableRow({ children: [tableCell("55–68 min"), tableCell("Hands-on: Augment—adding narration and design annotations")] }),
            new TableRow({ children: [tableCell("68–75 min"), tableCell("Debrief and next steps")] }),
          ],
        }),

        emptyLine(6),
        body(
          "Each participant receives a PITA skill file (a structured system prompt encoding the workflow), a curated list of ProComm articles cleared for workshop use, and a contribution guide for the open-source ProComm Interactive repository."
        ),

        emptyLine(8),

        // ── 5. BROADER INITIATIVE ─────────────────────────────────────────
        sectionHeading("5.  Broader Initiative and Research Agenda"),
        emptyLine(2),
        body(
          "The workshop introduces ProComm Interactive, an open-source project aiming to transform all 65 IEEE ProComm Communication Resources articles through volunteer contribution. Each completed module is submitted as a single HTML file with a metadata record documenting source article, contributor, and AI tools used."
        ),
        emptyLine(2),
        body(
          "This repository constitutes a research dataset for studying how professional communicators develop computational thinking through natural language programming—directly supporting a parallel Teaching Case submission to IEEE Transactions on Professional Communication investigating non-programming practitioners' engagement with agentic AI tools."
        ),

        emptyLine(8),

        // ── 6. CONCLUSION ─────────────────────────────────────────────────
        sectionHeading("6.  Conclusion"),
        emptyLine(2),
        body(
          "Professional communicators already possess the core competency that agentic AI collaboration requires: precise, purposeful language. The PITA framework gives that competency a new application—not writing about communication, but actively transforming accumulated professional knowledge into interactive educational resources. Participants will leave with a replicable workflow and a completed artifact, ready to contribute to a growing open collection of interactive professional communication learning materials."
        ),

        emptyLine(10),

        // ── REFERENCES ────────────────────────────────────────────────────
        sectionHeading("References"),
        emptyLine(2),
        refLine("[1] R. E. Mayer, Multimedia Learning, 2nd ed. Cambridge University Press, 2009."),
        refLine('[2] A. Sarkar and I. Drosas, "Vibe coding: programming through conversation with AI," arXiv:2506.23253, 2025.'),
        refLine('[3] J. A. Lydens and J. C. Lucena, "Listening as an Engineering Skill," IEEE Trans. Prof. Commun., vol. 52, no. 4, pp. 302–322, Dec. 2009.'),

        emptyLine(16),

        // Word count note
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({
              text: "Word count: ~700 words (body text, excluding title block, table, and references)",
              font: FONT_SANS, size: pt(9), color: "AAAAAA", italics: true,
            }),
          ],
        }),
      ],
    },
  ],
});

const buffer = await Packer.toBuffer(doc);
writeFileSync(OUT, buffer);
console.log("Written:", OUT);
console.log("Size:", (buffer.length / 1024).toFixed(1), "KB");
