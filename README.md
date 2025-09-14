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

```bash
yarn install
yarn build
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

## Recommended Workflow

1. **Initial Setup**: Use the `download_all_content` tool to fetch all Style Manual content locally
2. **Daily Usage**: Use Claude Code's native tools for efficient searching:
   ```bash
   grep -i "semicolon" style-manual/sections/*.md
   glob "**/accessibility*.md" 
   read style-manual/sections/grammar-punctuation.md
   ```
3. **Updates**: Periodically re-run MCP tools to refresh content

## Tools

### `fetch_style_page`
Fetch and extract content from any Australian Style Manual page.

**Input:**
```json
{ "url": "https://www.stylemanual.gov.au/grammar-punctuation-and-conventions/" }
```

### `search_style_content` 
Search for terms across Style Manual pages.

**Input:**
```json
{ 
  "query": "semicolon",
  "urls": ["optional array of specific URLs"]
}
```

### `download_all_content`
Download all configured Style Manual pages to local markdown files.

**Input:**
```json
{ "outputDir": "./style-manual" }
```

**Output Structure:**
```
style-manual/
├── index.md                    # Quick reference guide
├── sections/                   # Individual page content
├── search-index/              # Navigation aids
└── metadata/                  # Update tracking
```

## Configuration

URLs are configured in `src/config/urls.js`. The default set includes:
- Writing and designing content
- Grammar, punctuation, and conventions  
- Accessible and inclusive content
- Formatting guidelines

## Performance Benefits

- **Network efficiency**: Download once, search locally
- **Speed**: Native grep/read tools faster than network requests
- **Reliability**: Always available offline
- **Flexibility**: Full Claude Code search capabilities

## Security

- Domain restriction to stylemanual.gov.au only
- Input validation with Zod schemas
- Graceful error handling
- Rate limiting for respectful scraping

## Development

```bash
yarn build    # Build TypeScript
yarn dev      # Development mode
yarn test     # Run tests
```

## License

MIT