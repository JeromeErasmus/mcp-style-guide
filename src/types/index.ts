// Core content types
export interface PageContent {
  url: string;
  title: string;
  content: string;
  sections: Section[];
  lastFetched: Date;
}

export interface Section {
  heading: string;
  level: number;
  content: string;
}

// Extended types for more detailed extraction
export interface ExtractedContent {
  url: string;
  title: string;
  content: string;
  sections: ContentSection[];
  lastModified?: string;
  extractedAt: Date;
  metadata: ContentMetadata;
}

export interface ContentSection {
  id: string;
  heading: string;
  level: number; // h2=2, h3=3, etc
  content: string;
  examples: string[];
  subsections?: ContentSection[];
}

export interface ContentMetadata {
  wordCount: number;
  hasExamples: boolean;
  contentType: 'guide' | 'reference' | 'example' | 'policy';
}

// Search related types
export interface Match {
  type: 'title' | 'heading' | 'content';
  text: string;
  snippet: string;
}

export interface SearchResult {
  url: string;
  matches: Match[];
}

// Processing types
export interface BatchOptions {
  batchSize: number;
  delayMs: number;
}

export interface DownloadResult {
  url: string;
  filename: string;
  success: boolean;
  error?: string;
}

// Error types
export class ToolError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'ToolError';
  }
}