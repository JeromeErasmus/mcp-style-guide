import * as cheerio from 'cheerio';
import type { CheerioAPI } from 'cheerio';
import { PageContent, Section } from '../types/index.js';

export class SimpleContentExtractor {
  async extractPageContent(url: string): Promise<PageContent> {
    try {
      const $ = await cheerio.fromURL(url);
      
      // Clean up the DOM first
      this.cleanupDOM($);
      
      return {
        url,
        title: this.extractTitle($),
        content: this.extractStructuredContent($),
        sections: this.extractSections($),
        lastFetched: new Date()
      };
    } catch (error) {
      throw new Error(`Failed to extract content from ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private cleanupDOM($: CheerioAPI): void {
    // Remove unwanted elements
    $('script, style, nav, .navigation, .nav, .breadcrumb, .footer, .header, .sidebar, .menu').remove();
    $('[class*="nav"], [id*="nav"], .skip-link, .sr-only').remove();
    $('button, .button, input, form, .form').remove();
    $('.print-only, .screen-reader-text, [aria-hidden="true"]').remove();
  }

  private extractTitle($: CheerioAPI): string {
    // Try multiple selectors in order of preference
    const titleSelectors = ['h1', '.page-title', 'title'];
    for (const selector of titleSelectors) {
      const title = $(selector).first().text().trim();
      if (title) return title;
    }
    return 'Untitled';
  }

  private extractStructuredContent($: CheerioAPI): string {
    // Find the main content area
    const contentSelectors = ['main', '[role="main"]', '.main-content', '.content', '.entry-content', 'article', '.page-content'];
    let $content: cheerio.Cheerio<any> = $('body');
    
    for (const selector of contentSelectors) {
      const $el = $(selector).first();
      if ($el.length && $el.text().trim().length > 100) {
        $content = $el as any;
        break;
      }
    }
    
    return this.processContentToMarkdown($content, $);
  }

  private processContentToMarkdown($element: cheerio.Cheerio<any>, $: CheerioAPI): string {
    let markdown = '';
    
    $element.children().each((_, child) => {
      const $child = $(child);
      const tagName = child.tagName?.toLowerCase();
      
      switch (tagName) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
          const level = parseInt(tagName.slice(1));
          const heading = $child.text().trim();
          if (heading) {
            markdown += '\n' + '#'.repeat(level + 1) + ' ' + heading + '\n\n';
          }
          break;
          
        case 'p':
          const text = $child.text().trim();
          if (text) {
            markdown += text + '\n\n';
          }
          break;
          
        case 'ul':
        case 'ol':
          markdown += this.processListToMarkdown($child, $, tagName === 'ol') + '\n';
          break;
          
        case 'blockquote':
          const quote = $child.text().trim();
          if (quote) {
            markdown += '> ' + quote.replace(/\n/g, '\n> ') + '\n\n';
          }
          break;
          
        case 'div':
        case 'section':
        case 'article':
          // Recursively process container elements
          markdown += this.processContentToMarkdown($child, $);
          break;
          
        default:
          // For other elements, just extract text if meaningful
          const childText = $child.text().trim();
          if (childText && childText.length > 10) {
            markdown += childText + '\n\n';
          }
      }
    });
    
    return markdown;
  }

  private processListToMarkdown($list: cheerio.Cheerio<any>, $: CheerioAPI, isOrdered: boolean): string {
    let markdown = '';
    let counter = 1;
    
    $list.children('li').each((_, item) => {
      const $item = $(item);
      const text = $item.text().trim();
      if (text) {
        const prefix = isOrdered ? `${counter}. ` : '- ';
        markdown += prefix + text + '\n';
        counter++;
      }
    });
    
    return markdown;
  }

  private extractSections($: CheerioAPI): Section[] {
    const sections: Section[] = [];
    
    // Find main content area first
    const contentSelectors = ['main', '[role="main"]', '.main-content', '.content', 'article'];
    let $content: cheerio.Cheerio<any> = $('body');
    
    for (const selector of contentSelectors) {
      const $el = $(selector).first();
      if ($el.length) {
        $content = $el as any;
        break;
      }
    }
    
    // Extract sections from main content only
    $content.find('h2, h3, h4, h5, h6').each((_, element) => {
      const $el = $(element);
      const tagName = $el.prop('tagName');
      const heading = $el.text().trim();
      
      if (tagName && heading && heading.length > 2) {
        sections.push({
          heading,
          level: parseInt(tagName.slice(1)),
          content: this.getCleanSectionContent($, $el)
        });
      }
    });
    
    return sections;
  }

  private getCleanSectionContent($: CheerioAPI, $heading: cheerio.Cheerio<any>): string {
    const headingLevel = parseInt($heading.prop('tagName')?.slice(1) || '2');
    let content = '';
    let current = $heading.next();
    
    while (current.length) {
      // Stop at next heading of same or higher level
      if (current.is('h1, h2, h3, h4, h5, h6')) {
        const currentLevel = parseInt(current.prop('tagName')?.slice(1) || '6');
        if (currentLevel <= headingLevel) {
          break;
        }
      }
      
      // Process different content types
      const tagName = current.prop('tagName')?.toLowerCase();
      
      if (tagName === 'p') {
        const text = current.text().trim();
        if (text) {
          content += text + '\n\n';
        }
      } else if (tagName === 'ul' || tagName === 'ol') {
        content += this.processListToMarkdown(current, $, tagName === 'ol') + '\n';
      } else if (tagName === 'blockquote') {
        const quote = current.text().trim();
        if (quote) {
          content += '> ' + quote + '\n\n';
        }
      } else {
        const text = current.text().trim();
        if (text && text.length > 10) {
          content += text + '\n\n';
        }
      }
      
      current = current.next();
    }
    
    return content.trim();
  }
}