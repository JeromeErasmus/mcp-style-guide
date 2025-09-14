#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { fetchPageTool } from './tools/fetch-page.js';
import { searchContentTool } from './tools/search-content.js';
import { downloadAllTool } from './tools/download-all.js';

// Create MCP server
const server = new McpServer({
  name: "australian-style-manual",
  version: "1.0.0"
});

// Register tools
server.registerTool(
  fetchPageTool.name,
  {
    title: "Fetch Style Manual Page",
    description: fetchPageTool.description,
    inputSchema: {
      url: z.string().url()
    }
  },
  fetchPageTool.handler
);

server.registerTool(
  searchContentTool.name,
  {
    title: "Search Style Manual Content", 
    description: searchContentTool.description,
    inputSchema: {
      query: z.string(),
      urls: z.array(z.string().url()).optional()
    }
  },
  searchContentTool.handler
);

server.registerTool(
  downloadAllTool.name,
  {
    title: "Download All Style Manual Content",
    description: downloadAllTool.description,
    inputSchema: {
      outputDir: z.string()
    }
  },
  downloadAllTool.handler
);

// Start server
async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    // Log startup (only visible when not connected to Claude Code)
    console.error("Australian Style Manual MCP Server running on stdio");
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.error("Shutting down Australian Style Manual MCP Server...");
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.error("Shutting down Australian Style Manual MCP Server...");
  process.exit(0);
});

// Start the server
main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});