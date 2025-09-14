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

## Usage

### With Claude Code

Add to your Claude Code MCP configuration:

```json
{
  "mcpServers": {
    "australian-style-manual": {
      "command": "node",
      "args": ["path/to/mcp-style-guide/dist/server.js"]
    }
  }
}
```

### Development

```bash
yarn dev
```

## How It Works

### 1. One-Time Setup

**Install and configure:**
```bash
git clone <repository>
cd mcp-style-guide
yarn install
yarn build
```

**Add to Claude Code configuration:**
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

### 2. Download Content (One Time)

**You:** "Download all Australian Style Manual content for offline use"

**Claude Code:** Uses `download_all_content({ outputDir: "./style-manual" })`

**Result:** Creates organized local files for instant access

### 3. Daily Usage (Lightning Fast)

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

### 4. Targeted Updates

**You:** "Check the latest grammar guidelines"

**Claude Code:** Uses `fetch_style_page()` for just that page

### 5. Research Queries

**You:** "Find content about bullet points across multiple pages"

**Claude Code:** Uses `search_style_content()` for comprehensive search

## Performance Comparison

### ❌ Without This Tool
1. Google "Australian Style Manual semicolons"
2. Navigate to website (slow)
3. Browse multiple pages
4. Copy/paste content
5. Repeat for each question

### ✅ With This Tool
1. **One-time:** Download content (5 minutes setup)
2. **Daily:** Instant `grep`/`read` commands
3. **Monthly:** Refresh as needed

**Speed difference:** Network requests (3-5 seconds) → Local search (instant)

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

## Typical Usage Pattern

```bash
# Week 1: Initial setup (one time)
download_all_content({ outputDir: "./style-manual" })

# Week 1-52: Daily usage (all instant)
grep "acronym" style-manual/sections/*.md
read style-manual/sections/grammar-punctuation.md  
glob "**/accessibility*.md"
grep -i -C 3 "apostrophe" style-manual/sections/*.md

# Month 3: Refresh content (as needed)
download_all_content({ outputDir: "./style-manual" })
```

## Configuration

URLs are configured in `src/config/urls.js`. The default set includes:
- Writing and designing content
- Grammar, punctuation, and conventions  
- Accessible and inclusive content
- Formatting guidelines
- 15+ comprehensive style guide pages

## Real Usage Examples

### Writing a Government Press Release

**You:** "Help me write a government press release following Australian Style Manual guidelines"

**Claude Code instantly searches:**
```bash
# Find press release guidance
grep -i -A 10 "press release\|media\|announcement" style-manual/sections/*.md

# Check tone guidelines
grep -i -B 5 -A 10 "tone\|voice\|style" style-manual/sections/writing-*.md

# Verify accessibility requirements  
read style-manual/sections/accessible-inclusive-content.md

# Check formatting rules
grep -i "heading\|format" style-manual/sections/*.md
```

**Result:** Comprehensive, current guidance in seconds

### Checking Punctuation Rules

**You:** "What's the rule for apostrophes in government writing?"

**Claude Code:** 
```bash
grep -i -C 5 "apostrophe" style-manual/sections/*.md
```
**Result:** Exact rules with context, instantly

### Finding Specific Guidelines

**You:** "Show me all acronym guidelines"

**Claude Code:**
```bash
grep -i -A 15 "acronym" style-manual/sections/*.md
```
**Result:** Complete acronym section with examples

## Why This Hybrid Approach Works

1. **MCP handles complexity:** Web scraping, rate limiting, content extraction
2. **Native tools handle speed:** Search, filtering, content access  
3. **Best of both worlds:** Comprehensive content + instant access
4. **Respectful to website:** Download once, use offline
5. **Always current:** Easy refresh via MCP tools
6. **Reference library approach:** Better than live API for documentation

## Performance Benefits

- **10x faster searches:** Local grep vs network requests
- **Always available:** Works offline
- **Comprehensive:** Full-text search across all content
- **Context-aware:** See surrounding content with `-A`, `-B`, `-C` flags
- **Flexible queries:** Combine multiple search patterns

## Security & Reliability

- **Domain restriction:** Only stylemanual.gov.au URLs allowed
- **Input validation:** Zod schemas prevent malformed requests
- **Error handling:** Graceful failures with helpful messages
- **Rate limiting:** Respectful 2-second delays between requests
- **Batch processing:** Maximum 3 concurrent requests
- **Offline capability:** No network dependency after initial download

## Development

```bash
yarn build    # Build TypeScript
yarn dev      # Development mode
yarn test     # Run tests
```

## License

MIT