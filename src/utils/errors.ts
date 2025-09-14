import { ToolError } from '../types/index.js';

export function handleToolError(error: unknown): { content: Array<{ type: "text"; text: string }>; isError?: boolean } {
  if (error instanceof ToolError) {
    // User-facing error - return in tool response
    return {
      content: [{ 
        type: "text" as const, 
        text: `❌ Error: ${error.message}` 
      }],
      isError: true
    };
  } else {
    // System error - log and provide generic message
    console.error('System error:', error);
    const toolError = new ToolError('An unexpected error occurred. Please try again.');
    return {
      content: [{ 
        type: "text" as const, 
        text: `❌ Error: ${toolError.message}` 
      }],
      isError: true
    };
  }
}