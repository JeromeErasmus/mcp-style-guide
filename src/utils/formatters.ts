import { promises as fs } from 'fs';
import { PageContent, SearchResult, DownloadResult } from '../types/index.js';

export function formatAsMarkdown(content: PageContent): string {
  let markdown = `# ${content.title}\n\n`;
  markdown += `**Source:** ${content.url}\n`;
  markdown += `**Last Fetched:** ${content.lastFetched.toISOString()}\n\n`;
  
  // Add main content
  if (content.content) {
    markdown += `## Overview\n\n${content.content}\n\n`;
  }
  
  // Add sections with proper hierarchy
  for (const section of content.sections) {
    const headerLevel = '#'.repeat(section.level + 1); // h2->###, h3->####
    markdown += `${headerLevel} ${section.heading}\n\n`;
    markdown += `${section.content}\n\n`;
  }
  
  return markdown;
}

export function formatSearchResults(results: SearchResult[], query: string): string {
  let markdown = `# Search Results for "${query}"\n\n`;
  markdown += `Found ${results.length} pages with matching content:\n\n`;
  
  for (const result of results) {
    markdown += `## ${result.url}\n\n`;
    
    for (const match of result.matches) {
      markdown += `**${match.type}:** ${match.text}\n`;
      markdown += `> ${match.snippet}\n\n`;
    }
    
    markdown += `---\n\n`;
  }
  
  return markdown;
}

export function generateFilename(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Extract meaningful part: /grammar-punctuation/ -> grammar-punctuation
    const segments = pathname.split('/').filter(s => s.length > 0);
    const filename = segments[segments.length - 1] || 'homepage';
    
    // Clean filename for filesystem
    const cleanName = filename
      .replace(/[^a-z0-9-]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase();
    
    return `${cleanName}.md`;
  } catch {
    // Fallback for invalid URLs
    return `page-${Date.now()}.md`;
  }
}

export async function generateIndexFiles(outputDir: string, successfulResults: DownloadResult[]): Promise<void> {
  // Generate main index with quick navigation
  const indexContent = generateMainIndex(successfulResults);
  await fs.writeFile(`${outputDir}/index.md`, indexContent, 'utf8');
  
  // Generate keyword mapping for search
  const keywordContent = generateKeywordIndex(successfulResults);
  await fs.writeFile(`${outputDir}/search-index/keywords.md`, keywordContent, 'utf8');
  
  // Generate topic-based navigation
  const topicContent = generateTopicIndex(successfulResults);
  await fs.writeFile(`${outputDir}/search-index/topics.md`, topicContent, 'utf8');
  
  // Generate metadata for freshness tracking
  const metadata = {
    lastUpdated: new Date().toISOString(),
    totalFiles: successfulResults.length,
    files: successfulResults.map(r => ({ url: r.url, filename: r.filename }))
  };
  await fs.writeFile(`${outputDir}/metadata/last-updated.json`, JSON.stringify(metadata, null, 2), 'utf8');
}

function generateMainIndex(results: DownloadResult[]): string {
  return `# Australian Style Manual - Quick Reference

## 📖 How to Use This Guide

### Quick Search Commands
\`\`\`bash
# Search for specific terms
grep -i "semicolon" sections/*.md

# Find files by topic  
glob "**/grammar*.md"

# Read specific sections
read sections/grammar-punctuation.md
\`\`\`

## 📁 Available Sections

${results.map(r => `- [${r.filename.replace('.md', '')}](sections/${r.filename}) - ${r.url}`).join('\n')}

## 🎯 Common Topics

| Topic | Files | Search Terms |
|-------|-------|--------------|
| **Punctuation** | grammar-punctuation.md | "comma", "semicolon", "apostrophe" |
| **Accessibility** | accessibility.md | "plain language", "inclusive" |
| **Writing Style** | writing-style.md | "tone", "voice", "clarity" |

## 📅 Last Updated
${new Date().toLocaleDateString()}
`;
}

function generateKeywordIndex(_results: DownloadResult[]): string {
  return `# Keyword to File Mapping

## Common Search Terms

### Grammar & Punctuation
- **comma rules** → sections/grammar-punctuation.md
- **semicolon usage** → sections/grammar-punctuation.md  
- **apostrophe guidelines** → sections/grammar-punctuation.md

### Accessibility
- **plain language** → sections/accessibility.md
- **inclusive language** → sections/accessibility.md
- **readability** → sections/accessibility.md

### Writing Style  
- **tone and voice** → sections/writing-style.md
- **content structure** → sections/writing-style.md
- **clarity** → sections/writing-style.md

## Quick Search Examples
\`\`\`bash
# Find comma rules
grep -i "comma" sections/grammar-punctuation.md

# Search for accessibility guidelines
grep -i "accessible" sections/*.md

# Look for formatting guidance  
grep -i "format" sections/*.md
\`\`\`
`;
}

function generateTopicIndex(_results: DownloadResult[]): string {
  return `# Topic-Based Navigation

## By Category

### 📝 Writing & Content
${_results.filter(r => r.filename.includes('writing') || r.filename.includes('content')).map(r => `- [${r.filename}](../sections/${r.filename})`).join('\n')}

### 📏 Grammar & Punctuation  
${_results.filter(r => r.filename.includes('grammar') || r.filename.includes('punctuation')).map(r => `- [${r.filename}](../sections/${r.filename})`).join('\n')}

### ♿ Accessibility & Inclusion
${_results.filter(r => r.filename.includes('accessibility') || r.filename.includes('inclusive')).map(r => `- [${r.filename}](../sections/${r.filename})`).join('\n')}

### 🎨 Formatting & Presentation
${_results.filter(r => r.filename.includes('format') || r.filename.includes('lists') || r.filename.includes('numbers')).map(r => `- [${r.filename}](../sections/${r.filename})`).join('\n')}
`;
}