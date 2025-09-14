# Australian Style Manual MCP Server

A Model Context Protocol (MCP) server that provides Claude with access to the Australian Government Style Manual as a reference tool for writing guidance.

## Features

- **Hybrid approach**: Download content once, search locally with Claude Code's native tools
- **Three MCP tools**:
  - `fetch_style_page`: Fetch individual pages from the Style Manual
  - `search_style_content`: Search across multiple pages for specific terms
  - `download_all_content`: Bulk download all configured pages to local markdown files
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


## Development

```bash
yarn dev      # Development mode
yarn build    # Build TypeScript
yarn test     # Run tests
```

## License

MIT