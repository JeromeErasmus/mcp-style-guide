import { PageContent, Match } from '../types/index.js';

export class SimpleSearch {
  findMatches(content: PageContent, query: string): Match[] {
    const matches: Match[] = [];
    const lowerQuery = query.toLowerCase();
    
    // Search in title
    if (content.title.toLowerCase().includes(lowerQuery)) {
      matches.push({
        type: 'title',
        text: content.title,
        snippet: content.title
      });
    }
    
    // Search in sections
    for (const section of content.sections) {
      if (section.heading.toLowerCase().includes(lowerQuery)) {
        matches.push({
          type: 'heading',
          text: section.heading,
          snippet: this.createSnippet(section.content, lowerQuery)
        });
      }
      
      if (section.content.toLowerCase().includes(lowerQuery)) {
        matches.push({
          type: 'content',
          text: section.heading,
          snippet: this.createSnippet(section.content, lowerQuery)
        });
      }
    }
    
    return matches;
  }
  
  private createSnippet(text: string, query: string): string {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return '';
    
    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + query.length + 50);
    
    return '...' + text.slice(start, end) + '...';
  }
}