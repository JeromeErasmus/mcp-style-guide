# Australian Style Manual MCP Server

A Model Context Protocol (MCP) server that provides Claude with access to the Australian Government Style Manual as a reference tool for writing guidance.

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

### Quick Install (One Command)

```bash
# Install and auto-configure for Claude Code
curl -sSL https://raw.githubusercontent.com/user/mcp-style-guide/main/install.sh | bash
```

Or using git:
```bash
# Clone, build, and configure in one line
git clone <repo-url> ~/mcp-style-guide && cd ~/mcp-style-guide && yarn install && yarn build && echo "Add to Claude Code MCP config: node $(pwd)/dist/server.js"
```

### Manual Install

```bash
# Clone and build
git clone <repository>
cd mcp-style-guide
yarn install
yarn build
```

**Then add to your Claude Code MCP configuration (`~/.config/claude-code/mcp_settings.json`):**
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

## How It Works

### 1. Download Content (One Time)

**You:** "Download all Australian Style Manual content for offline use"

**Claude Code:** Uses `download_all_content({ outputDir: "./style-manual" })`

**Result:** Creates organized local files for instant access

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
│   └── ... (15+ files)
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
Rewrite documents using Australian Style Manual guidelines for clarity, accessibility, and government standards.

**When to use:** Improving existing documents, ensuring compliance with government writing standards

**Input:**
```json
{
  "document": "Your document text here...",
  "focusAreas": ["plain-language", "active-voice", "punctuation", "inclusive-language", "accessibility"],
  "targetAudience": "general-public", 
  "explanation": true
}
```

**Focus Areas (optional):**
- `plain-language`: Year 7 reading level, simple words
- `active-voice`: Convert passive to active voice  
- `punctuation`: Fix punctuation and grammar
- `inclusive-language`: Remove bias and discriminatory language
- `grammar`: Improve sentence structure and word choice
- `accessibility`: Optimize for screen readers and disabilities
- `structure`: Improve headings, paragraphs, and lists
- `spelling`: Fix common misspellings and word confusion

**Target Audiences:**
- `general-public`: Simplest language, no jargon (default)
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

URLs are configured in `src/config/urls.js`. The default set includes:
- Writing and designing content
- Grammar, punctuation, and conventions  
- Accessible and inclusive content
- Formatting guidelines
- 15+ comprehensive style guide pages

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

**Rewriting Government Documents:**
```json
// Simple rewrite with default settings
{
  "tool": "rewrite_with_style_guide",
  "document": "The utilisation of this process will be implemented by the department in order to facilitate improved outcomes for stakeholders.",
  "targetAudience": "general-public"
}
```

**Advanced Document Rewrite:**
```json
// Targeted improvements for specific areas  
{
  "tool": "rewrite_with_style_guide",
  "document": "[Long government policy document]",
  "focusAreas": ["plain-language", "structure", "inclusive-language"],
  "targetAudience": "government-staff",
  "explanation": true
}
```

**Policy Document Review:**
```json
// Accessibility-focused rewrite
{
  "tool": "rewrite_with_style_guide", 
  "document": "[Policy document with complex language]",
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