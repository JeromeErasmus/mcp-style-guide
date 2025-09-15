# Australian Style Manual MCP Server

[![npm version](https://badge.fury.io/js/mcp-australian-style-manual.svg)](https://www.npmjs.com/package/mcp-australian-style-manual)

A Model Context Protocol (MCP) server that provides Claude with access to the Australian Government Style Manual as a reference tool for writing guidance.

**📦 Available on npm:** `mcp-australian-style-manual`

## Features

- **Global cache system**: Download content once, automatically reused across all projects
- **Permanent storage**: Downloaded files persist forever until manually refreshed
- **Four MCP tools**:
  - `fetch_style_page`: Fetch individual pages from the Style Manual
  - `search_style_content`: Search across ALL cached content instantly (155+ pages)
  - `download_all_content`: Bulk download to global cache for universal access
  - `rewrite_with_style_guide`: Rewrite documents using Style Manual guidelines
- **Zero project clutter**: No files created in user project directories
- **Lightning-fast searches**: Instant results from cached content
- **Respectful scraping**: Built-in rate limiting and batch processing
- **Domain validation**: Only allows URLs from stylemanual.gov.au
- **Rich markdown output**: Properly formatted content with sections and navigation

## Installation

### NPM Package Install (Recommended)

**1. Install the package from npm:**
```bash
npm install -g mcp-australian-style-manual
```

**2. Add the server configuration:**

**Option A: Using Claude CLI (Recommended):**
```bash
claude mcp add --scope user australian-style-manual npx mcp-australian-style-manual
```

**Option B: Manual configuration file edit:**
```bash
code ~/.config/claude/settings.json
```

**3. (Manual option only) Add the server configuration to the `"mcp"` → `"servers"` section:**
```json
{
  "mcp": {
    "servers": {
      "australian-style-manual": {
        "command": "npx",
        "args": ["mcp-australian-style-manual"]
      }
    }
  }
}
```

**4. Restart Claude Code**

### Development Install (Local)

**For development or customization:**
```bash
# Clone and build from source
git clone https://github.com/jerome-erasmus/mcp-style-guide.git
cd mcp-style-guide
yarn install
yarn build
```

**Add to Claude Code MCP configuration (`~/.config/claude/settings.json`):**

Add this to the `"mcp"` → `"servers"` section:
```json
{
  "mcp": {
    "servers": {
      "australian-style-manual": {
        "command": "node",
        "args": ["/absolute/path/to/mcp-style-guide/dist/server.js"]
      }
    }
  }
}
```

### Alternative Install Methods

**Global install:**
```bash
npm install -g mcp-australian-style-manual
```

**Quick test without install:**
```bash
npx mcp-australian-style-manual --help
```

## Uninstall

To completely remove the MCP server:

**1. Remove from Claude configuration:**
```bash
claude mcp remove australian-style-manual
```

**2. Uninstall the npm package:**
```bash
npm uninstall -g mcp-australian-style-manual
```

## How It Works

### 1. Download Content (One Time Setup)

**You:** "Download all Australian Style Manual content"

**Claude Code:** Uses `download_all_content({ forceRefresh: false })`

**Result:** Creates global cache with 155+ pages accessible from any project

**Cache Location:** `<mcp-server>/cache/` (automatically managed, no user interaction needed)

### 2. Daily Usage (Instant Results)

**Scenario: "How do I use semicolons in government writing?"**

**Claude Code:** Uses `search_style_content({ query: "semicolon" })`

**Result:** Instant search across ALL 155+ cached pages (no network calls)

**Scenario: "Show me accessibility guidelines"** 

**Claude Code:** Uses `search_style_content({ query: "accessibility" })`

**Result:** Comprehensive results from cached accessibility pages

**Scenario: "Find all mentions of 'plain English'"**

**Claude Code:** Uses `search_style_content({ query: "plain english" })`

**Result:** All relevant content instantly available

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
Download all Style Manual pages to permanent global cache.

**When to use:** Initial setup, or when forcing content refresh

**Input:**
```json
{ "forceRefresh": false }
```

**Parameters:**
- `forceRefresh` *(optional, default: false)*: Force re-download even if cache exists

**Global Cache Structure:**
```
<mcp-server>/cache/
├── index.md                    # Quick reference guide
├── sections/                   # 155+ content pages
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
│   └── ... (all Style Manual pages)
├── search-index/              # Keywords and topics
└── metadata/                  # Update tracking
```

**Benefits:**
- ✅ **Zero project clutter**: No files in user directories
- ✅ **Universal access**: Works across all projects 
- ✅ **Permanent storage**: Downloaded once, available forever
- ✅ **Automatic reuse**: Subsequent projects use existing cache

### `fetch_style_page` (Targeted Updates)
Fetch individual pages from the Style Manual.

**When to use:** Getting latest version of specific pages

**Input:**
```json
{ "url": "https://www.stylemanual.gov.au/grammar-punctuation-and-conventions/" }
```

### `search_style_content` (Research)
Search across ALL cached content instantly (155+ pages).

**When to use:** Any content search - automatically uses cache when available

**Input:**
```json
{ 
  "query": "plain English",
  "urls": ["optional array of specific URLs - falls back to web if cache unavailable"]
}
```

**Cache Behavior:**
- ✅ **Cache available**: Searches ALL 155+ cached pages instantly
- ⚠️ **No cache**: Falls back to web search with specified URLs
- 🔍 **Comprehensive**: Searches entire Style Manual when cached

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
- `punctuation`: Fix punctuation and grammar issues
- `grammar`: Improve sentence structure and word choice
- `spelling`: Fix common misspellings and word confusion
- `reports`: Specific guidelines for government reports and authoritative documents
- `government-writing`: Government Writing Handbook principles for official documents *(default)*
- `shortened-words`: Consistent abbreviations, acronyms, and contractions *(default)*
- `terminology`: Proper government, commercial, and geographic terminology *(default)*
- `extended-punctuation`: Advanced punctuation (dashes, colons, brackets, ellipses)
- `content-types`: Format-specific guidelines for blogs, emails, forms, PDFs, social media
- `writing-process`: Content strategy, user research, and systematic editing approaches

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
# Initial setup (once per MCP server installation)
download_all_content({ forceRefresh: false })
# → Creates permanent global cache

# Daily usage (instant from cache)
search_style_content({ query: "semicolons" })
search_style_content({ query: "accessibility guidelines" })
search_style_content({ query: "plain language" })

# Manual refresh (only when needed)
download_all_content({ forceRefresh: true })
# → Force re-download latest content
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
```json
search_style_content({ query: "press release media" })
search_style_content({ query: "tone voice" })
search_style_content({ query: "accessible inclusive content" })
```

**Checking Punctuation:**
```json
search_style_content({ query: "apostrophe semicolon" })
```

**Finding Guidelines:**
```json
search_style_content({ query: "acronym" })
search_style_content({ query: "accessibility" })
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