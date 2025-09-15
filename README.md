# Australian Style Manual MCP Server

[![npm version](https://badge.fury.io/js/australian-style-manual-mcp.svg)](https://www.npmjs.com/package/australian-style-manual-mcp)

A Model Context Protocol (MCP) server that provides Claude with access to the Australian Government Style Manual as a reference tool for writing guidance.

**📦 Available on npm:** `australian-style-manual-mcp`

## Features

- **Hybrid approach**: Download content once, search locally with Claude Code's native tools
- **Four MCP tools**:
  - `fetch_style_page`: Fetch individual pages from the Style Manual
  - `search_style_content`: Search across multiple pages for specific terms
  - `download_all_content`: Bulk download all configured pages to local markdown files
  - `rewrite_with_style_guide`: Rewrite documents using Style Manual guidelines
- **Respectful scraping**: Built-in rate limiting and batch processing
- **Domain validation**: Only allows URLs from stylemanual.gov.au
- **Rich markdown output**: Properly formatted content with sections and navigation

## Installation

### NPM Package Install (Recommended)

**Install directly from npm:**
```bash
npx australian-style-manual-mcp
```

**Add to Claude Code MCP configuration (`~/.config/claude-code/mcp_settings.json`):**
```json
{
  "mcpServers": {
    "australian-style-manual": {
      "command": "npx",
      "args": ["australian-style-manual-mcp"]
    }
  }
}
```

**Or use Claude Code CLI:**
```bash
claude-code config add-mcp-server australian-style-manual npx australian-style-manual-mcp
```

### Development Install (Local)

**For development or customization:**
```bash
# Clone and build from source
git clone https://github.com/jerome-erasmus/mcp-style-guide.git
cd mcp-style-guide
yarn install
yarn build
```

**Add to Claude Code MCP configuration:**
```json
{
  "mcpServers": {
    "australian-style-manual": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-style-guide/dist/server.js"]
    }
  }
}
```

### Alternative Install Methods

**Global install:**
```bash
npm install -g australian-style-manual-mcp
```

**Quick test without install:**
```bash
npx australian-style-manual-mcp --help
```

## How It Works

### 1. Download Content (One Time)

**You:** "Download all Australian Style Manual content for offline use"

**Claude Code:** Uses `download_all_content({ outputDir: "./style-manual" })`

**Result:** Creates 160+ organized local files for instant access

### 2. Daily Usage (Lightning Fast)

**Scenario: "How do I use semicolons in government writing?"**

**Claude Code workflow:**
```bash
# Instant local search (no network calls)
grep -i "semicolon" style-manual/sections/*.md
```

**Scenario: "Show me accessibility guidelines"**

**Claude Code workflow:**
```bash
glob "style-manual/sections/*accessibility*.md"
read style-manual/sections/accessible-inclusive-content.md
```

**Scenario: "Find all mentions of 'plain English'"**

**Claude Code workflow:**
```bash
grep -i -C 3 "plain english" style-manual/sections/*.md
```

### 3. Targeted Updates

**You:** "Check the latest grammar guidelines"

**Claude Code:** Uses `fetch_style_page()` for just that page

### 4. Research Queries

**You:** "Find content about bullet points across multiple pages"

**Claude Code:** Uses `search_style_content()` for comprehensive search

### 5. Document Rewriting

**You:** "Rewrite this government document to follow Style Manual guidelines"

**Claude Code:** Uses `rewrite_with_style_guide()` to apply plain language, active voice, and accessibility improvements


## MCP Tools Reference

### `download_all_content` (Primary Tool)
Bulk download all Style Manual pages for offline use.

**When to use:** Initial setup, monthly refreshes

**Input:**
```json
{ "outputDir": "./style-manual" }
```

**Output Structure:**
```
style-manual/
├── index.md                    # Quick reference guide
├── sections/
│   ├── grammar-punctuation.md
│   ├── accessible-content.md
│   ├── writing-guidelines.md
│   ├── plain-language-and-word-choice.md
│   ├── sentences.md
│   ├── punctuation-and-capitalisation.md
│   ├── apostrophes.md
│   ├── commas.md
│   ├── lists.md
│   ├── headings.md
│   ├── links.md
│   ├── tables.md
│   └── ... (160+ comprehensive files)
├── search-index/              # Navigation aids
└── metadata/                  # Update tracking
```

### `fetch_style_page` (Targeted Updates)
Fetch individual pages from the Style Manual.

**When to use:** Getting latest version of specific pages

**Input:**
```json
{ "url": "https://www.stylemanual.gov.au/grammar-punctuation-and-conventions/" }
```

### `search_style_content` (Research)
Search across multiple pages for specific terms.

**When to use:** Complex queries across specific sections

**Input:**
```json
{ 
  "query": "plain English",
  "urls": ["optional array of specific URLs"]
}
```

### `rewrite_with_style_guide` (Document Improvement)
Rewrite documents using Australian Style Manual guidelines for clarity, accessibility, and government standards. **Supports both direct content and file input/output**.

**When to use:** Improving existing documents, ensuring compliance with government writing standards

**Input Options:**

**Option 1: Direct content**
```json
{
  "document": "Your document text here...",
  "outputFile": "optional/output/path.md",
  "focusAreas": ["plain-language", "active-voice", "structure"],
  "targetAudience": "general-public", 
  "explanation": true
}
```

**Option 2: File input/output**
```json
{
  "inputFile": "path/to/input.md",
  "outputFile": "path/to/improved.md",
  "focusAreas": ["plain-language", "accessibility", "inclusive-language"],
  "targetAudience": "technical-audience",
  "explanation": true
}
```

**Option 3: File input with console output**
```json
{
  "inputFile": "path/to/input.md",
  "focusAreas": ["structure", "plain-language"],
  "targetAudience": "government-staff"
}
```

**Parameters:**
- `document` *(optional)*: Direct text content to rewrite
- `inputFile` *(optional)*: Path to input file to read and rewrite
- `outputFile` *(optional)*: Path to save the rewritten content
- `focusAreas`: Areas to focus on (see full list below)
- `targetAudience`: "general-public", "government-staff", or "technical-audience"
- `explanation`: Include explanation of changes made

**Note:** Either `document` or `inputFile` must be provided.

**Focus Areas (defaults to comprehensive readability, structure, and formatting areas):**
- `plain-language`: Year 7 reading level, simple words *(default)*
- `active-voice`: Convert passive to active voice *(default)*
- `structure`: Improve headings, paragraphs, and lists *(default)*
- `accessibility`: Optimize for screen readers and disabilities *(default)*
- `inclusive-language`: Remove bias and discriminatory language *(default)*
- `structuringContent`: Content architecture and organization *(default)*
- `headings`: Descriptive, hierarchical heading structure *(default)*
- `links`: Descriptive link text and external link handling *(default)*
- `lists`: Proper bulleted and numbered list formatting *(default)*
- `paragraphs`: Focus and length optimization *(default)*
- `tables`: Accessible table structure and headers *(default)*
- `sentences`: Clear, concise sentence structure and length *(default)*
- `howPeopleFindInfo`: Scanning patterns and cognitive load reduction *(default)*
- `numeralsOrWords`: Number formatting and numeral conventions *(default)*
- `currency`: Australian currency formats and standards *(default)*
- `dateTime`: Clear date and time formatting *(default)*
- `typesStructure`: Appropriate content structure selection *(default)*
- `hierarchicalStructure`: Overview-to-detail organization *(default)*
- `sequentialStructure`: Step-by-step and process structures *(default)*
- `punctuation`: Fix punctuation and grammar
- `grammar`: Improve sentence structure and word choice
- `spelling`: Fix common misspellings and word confusion

**Target Audiences:**
- `general-public`: Simplest language, no jargon *(default)*
- `government-staff`: Some department terms acceptable
- `technical-audience`: Technical terms allowed when appropriate

**Example Output:**
```markdown
# Rewritten Document
[Improved document text with Style Manual guidelines applied]

## Style Manual Guidelines Applied
**Target Audience:** general-public
**Focus Areas:** plain-language, active-voice, punctuation

### Key Changes Made:
- Reduced word count by 45 words for clarity
- Converted passive voice to active voice
- Replaced complex words with simpler alternatives
- Shortened average sentence length from 28 to 16 words

### Style Manual Sources:
- https://www.stylemanual.gov.au/writing-and-designing-content/clear-language-and-writing-style/plain-language-and-word-choice
- https://www.stylemanual.gov.au/accessible-and-inclusive-content/literacy-and-access
```

## Typical Workflow

```bash
# Initial setup (once)
download_all_content({ outputDir: "./style-manual" })

# Daily usage (instant)
grep "term" style-manual/sections/*.md
read style-manual/sections/specific-file.md
glob "**/pattern*.md"

# Refresh (monthly)
download_all_content({ outputDir: "./style-manual" })
```

## Configuration

URLs are configured in `src/config/urls.ts`. The comprehensive set includes:
- **Writing and designing content** (12 pages) - User research, plain language, voice & tone, findability
- **Accessible and inclusive content** (11 pages) - Accessibility principles, inclusive language, literacy  
- **Grammar, punctuation and conventions** (82 pages) - All word types, punctuation, numbers, names, titles
- **Content types** (11 pages) - Blogs, PDFs, forms, images, video/audio, social media
- **Structuring content** (10 pages) - Headings, links, lists, paragraphs, tables, content structures
- **Referencing and attribution** (16 pages) - Citation styles, legal material, documentary notes
- **Style Manual resources** (17+ pages) - Quick guides, Government Writing Handbook, editor's tips
- **Total: 160+ comprehensive style guide pages**

## Usage Examples

**Writing a Press Release:**
```bash
grep -i -A 10 "press release\|media" style-manual/sections/*.md
grep -i "tone\|voice" style-manual/sections/writing-*.md
read style-manual/sections/accessible-inclusive-content.md
```

**Checking Punctuation:**
```bash
grep -i -C 5 "apostrophe\|semicolon" style-manual/sections/*.md
```

**Finding Guidelines:**
```bash
grep -i -A 15 "acronym" style-manual/sections/*.md
glob "**/accessibility*.md"
```

**Simple Document Rewrite:**
```json
// Direct content rewrite
{
  "tool": "rewrite_with_style_guide",
  "document": "The utilisation of this process will be implemented by the department in order to facilitate improved outcomes for stakeholders.",
  "targetAudience": "general-public"
}
```

**File-to-File Document Processing:**
```json
// Read from file, write improved version to another file
{
  "tool": "rewrite_with_style_guide",
  "inputFile": "./documents/draft-policy.md",
  "outputFile": "./documents/draft-policy-improved.md",
  "focusAreas": ["plain-language", "structure", "inclusive-language"],
  "targetAudience": "general-public",
  "explanation": true
}
```

**Batch Document Processing:**
```json
// Process file and save improved version
{
  "tool": "rewrite_with_style_guide", 
  "inputFile": "./complex-policy.md",
  "outputFile": "./simple-policy.md",
  "focusAreas": ["accessibility", "plain-language", "structure"],
  "targetAudience": "general-public"
}
```


## Development

```bash
yarn dev      # Development mode
yarn build    # Build TypeScript
yarn test     # Run tests
```

## License

MIT