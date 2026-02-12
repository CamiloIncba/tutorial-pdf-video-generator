/**
 * shadcn-dark — Dark cover + clean professional body
 *
 * Cover: zinc-950 (#09090b) background, card layout with zinc-800 borders
 * Body: White background with slate typography
 */

const CSS = `
/* ── Reset & base ── */
* { margin: 0; padding: 0; box-sizing: border-box; }

@page {
  size: A4;
  margin: 20mm 18mm 22mm 18mm;
}

body {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  font-size: 11pt;
  line-height: 1.55;
  color: #1e293b;
  background: #fff;
}

/* ── Cover (shadcn dark) ── */
.cover {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  text-align: center;
  page-break-after: always;
  background: #09090b;
  color: #fafafa;
}

.cover-card {
  border: 1px solid #27272a;
  border-radius: 12px;
  background: #0a0a0a;
  padding: 48px 56px;
  max-width: 480px;
  width: 100%;
}

.cover-logo {
  margin-bottom: 24px;
}

.cover-logo img {
  max-width: 240px;
  height: auto;
  border: none;
  box-shadow: none;
  border-radius: 0;
}

.cover-subtitle {
  display: none;
}

.cover-divider {
  width: 100%;
  height: 1px;
  background: #27272a;
  margin: 24px 0;
}

.cover-title {
  font-size: 22pt;
  font-weight: 600;
  color: #fafafa;
  margin-bottom: 10px;
  line-height: 1.3;
  letter-spacing: -0.3px;
}

.cover-desc {
  font-size: 11pt;
  color: #a1a1aa;
  max-width: 380px;
  line-height: 1.6;
  margin: 0 auto 28px auto;
}

.cover-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 9.5pt;
  color: #71717a;
  line-height: 1.5;
}

.cover-meta-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  border-bottom: 1px solid #18181b;
}

.cover-meta-label {
  color: #a1a1aa;
  font-weight: 500;
}

.cover-meta-value {
  color: #d4d4d8;
}

.cover-footer {
  margin-top: 48px;
  font-size: 8.5pt;
  color: #52525b;
  letter-spacing: 0.3px;
}

/* ── Table of contents ── */
.toc {
  page-break-after: always;
}

.toc h2 {
  font-size: 20pt;
  color: #0f172a;
  margin-bottom: 24px;
  padding-bottom: 8px;
  border-bottom: 3px solid #3b82f6;
}

.toc-list {
  list-style: none;
  padding: 0;
}

.toc-list li {
  padding: 6px 0;
  border-bottom: 1px solid #f1f5f9;
  font-size: 11pt;
}

.toc-list li a {
  color: #334155;
  text-decoration: none;
}

.toc-list li a:hover {
  color: #3b82f6;
}

.toc-list .toc-h2 {
  font-weight: 600;
  padding-left: 0;
  font-size: 11.5pt;
}

.toc-list .toc-h3 {
  font-weight: 400;
  padding-left: 24px;
  color: #64748b;
  font-size: 10.5pt;
}

/* ── Headings ── */
h1 {
  font-size: 24pt;
  font-weight: 800;
  color: #0f172a;
  margin: 20px 0 6px 0;
  letter-spacing: -0.5px;
  page-break-after: avoid;
}

h2 {
  font-size: 18pt;
  font-weight: 700;
  color: #0f172a;
  margin: 20px 0 8px 0;
  padding-bottom: 6px;
  border-bottom: 2px solid #e2e8f0;
  page-break-after: avoid;
}

h3 {
  font-size: 14pt;
  font-weight: 600;
  color: #1e40af;
  margin: 14px 0 4px 0;
  page-break-after: avoid;
}

h4 {
  font-size: 12pt;
  font-weight: 600;
  color: #334155;
  margin: 10px 0 4px 0;
  page-break-after: avoid;
}

/* ── Paragraphs ── */
p {
  margin: 5px 0;
  orphans: 3;
  widows: 3;
}

/* ── Lists ── */
ul, ol {
  margin: 4px 0 4px 20px;
}

li {
  margin: 2px 0;
}

/* ── Links ── */
a {
  color: #2563eb;
  text-decoration: none;
}

/* ── Code ── */
code {
  background: #f1f5f9;
  color: #be185d;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
  font-size: 0.9em;
}

pre {
  background: #0f172a;
  color: #e2e8f0;
  padding: 12px 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 8px 0;
  font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
  font-size: 9.5pt;
  line-height: 1.5;
  page-break-inside: avoid;
}

pre code {
  background: none;
  color: inherit;
  padding: 0;
  border-radius: 0;
  font-size: inherit;
}

/* ── Tables ── */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 8px 0;
  font-size: 10pt;
  page-break-inside: avoid;
}

thead th {
  background: #0f172a;
  color: white;
  font-weight: 600;
  text-align: left;
  padding: 10px 14px;
  font-size: 10pt;
}

thead th:first-child {
  border-radius: 6px 0 0 0;
}

thead th:last-child {
  border-radius: 0 6px 0 0;
}

tbody td {
  padding: 8px 14px;
  border-bottom: 1px solid #e2e8f0;
}

tbody tr:nth-child(even) {
  background: #f8fafc;
}

tbody tr:last-child td:first-child {
  border-radius: 0 0 0 6px;
}

tbody tr:last-child td:last-child {
  border-radius: 0 0 6px 0;
}

/* ── Images (screenshots) ── */
img {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 8px auto;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* ── Blockquotes ── */
blockquote {
  border-left: 4px solid #3b82f6;
  background: #eff6ff;
  padding: 8px 14px;
  margin: 8px 0;
  border-radius: 0 6px 6px 0;
  color: #1e40af;
}

blockquote p {
  margin: 2px 0;
}

/* ── Horizontal rule ── */
hr {
  border: none;
  height: 1px;
  background: #e2e8f0;
  margin: 14px 0;
}

/* ── Status badges ── */
.badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 9pt;
  font-weight: 600;
  letter-spacing: 0.3px;
}

/* ── State diagram ── */
.state-diagram {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px 16px;
  margin: 8px 0;
  font-family: 'Cascadia Code', monospace;
  font-size: 9.5pt;
  line-height: 1.8;
  white-space: pre;
  page-break-inside: avoid;
}

/* ── Strong in lists ── */
li strong {
  color: #0f172a;
}

/* ── Emoji sizing ── */
.emoji {
  font-size: 1.1em;
}

/* ── Print optimization ── */
@media print {
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .cover { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  thead th { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  pre { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  blockquote { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  tbody tr:nth-child(even) { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`;

export default CSS;
