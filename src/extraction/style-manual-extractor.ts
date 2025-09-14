import * as cheerio from 'cheerio';
import type { CheerioAPI } from 'cheerio';
import { PageContent, Section } from '../types/index.js';

export class StyleManualExtractor {
  async extractPageContent(url: string): Promise<PageContent> {
    try {
      const $ = await cheerio.fromURL(url);
      
      // Site-specific cleanup
      this.cleanupStyleManualDOM($);
      
      return {
        url,
        title: this.extractTitle($),
        content: this.extractMainContent($),
        sections: this.extractStyleManualSections($),
        lastFetched: new Date()
      };
    } catch (error) {
      throw new Error(`Failed to extract content from ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private cleanupStyleManualDOM($: CheerioAPI): void {
    // Remove unwanted elements specific to stylemanual.gov.au
    $('script, style, noscript').remove();
    $('.skip-to-content, .site-header, .site-footer').remove();
    $('.nav, .navigation, .breadcrumb, .sidebar').remove();
    $('[class*="menu"], [class*="nav"], [id*="nav"]').remove();
    $('.print-only, .screen-reader-only, [aria-hidden="true"]').remove();
    $('button, input, form, .search').remove();
    $('.pagination, .share, .feedback').remove();
    
    // Remove empty containers
    $('div:empty, section:empty, article:empty').remove();
  }

  private extractTitle($: CheerioAPI): string {
    // Try multiple title selectors in order of preference
    const titleSelectors = [
      'h1.page-title',
      '.main-content h1',
      'main h1', 
      'h1',
      '.page-header h1',
      '.content-header h1',
      'title'
    ];
    
    for (const selector of titleSelectors) {
      const title = $(selector).first().text().trim();
      if (title && title !== 'Style Manual') {
        return this.cleanTitle(title);
      }
    }
    
    // Fallback to page title from head
    const pageTitle = $('title').text().trim();
    if (pageTitle && pageTitle !== 'Style Manual') {
      return this.cleanTitle(pageTitle);
    }
    
    return 'Style Manual';
  }

  private cleanTitle(title: string): string {
    return title
      .replace(/\s*\|\s*Style Manual.*$/i, '') // Remove site suffix
      .replace(/^Style Manual\s*[-–|]\s*/i, '') // Remove site prefix
      .trim();
  }

  private extractMainContent($: CheerioAPI): string {
    // Style Manual specific content selectors
    const contentSelectors = [
      'main .content',
      '.main-content',
      '[role="main"]',
      'main',
      '.page-content',
      '.entry-content'
    ];
    
    let $content: cheerio.Cheerio<any> | null = null;
    
    for (const selector of contentSelectors) {
      const $el = $(selector).first();
      if ($el.length && $el.text().trim().length > 100) {
        $content = $el as any;
        break;
      }
    }
    
    if (!$content) {
      return '';
    }
    
    return this.processMainContentToText($content, $);
  }

  private processMainContentToText($element: cheerio.Cheerio<any>, $: CheerioAPI): string {
    let text = '';
    
    // Extract intro/summary text first
    const $intro = $element.find('.intro, .summary, .lead, .description').first();
    if ($intro.length) {
      const introText = $intro.text().trim();
      if (introText && introText.length > 20) {
        text += introText + '\n\n';
      }
    }
    
    // Extract main paragraphs (skip headings as they'll be in sections)
    $element.find('p').each((_, p) => {
      const $p = $(p);
      // Skip if inside a section we'll process separately
      if (!$p.closest('section, .section').length) {
        const pText = $p.text().trim();
        if (pText && pText.length > 20) {
          text += pText + '\n\n';
        }
      }
    });
    
    return text.trim();
  }

  private extractStyleManualSections($: CheerioAPI): Section[] {
    const sections: Section[] = [];
    const processedHeadings = new Set<string>();
    
    // Find main content area
    const contentSelectors = [
      'main .content',
      '.main-content', 
      '[role="main"]',
      'main',
      '.page-content'
    ];
    
    let $content: cheerio.Cheerio<any> = $('body');
    for (const selector of contentSelectors) {
      const $el = $(selector).first();
      if ($el.length) {
        $content = $el as any;
        break;
      }
    }
    
    // Extract sections from headings
    $content.find('h2, h3, h4').each((_, element) => {
      const $heading = $(element);
      const headingText = this.cleanHeading($heading.text().trim());
      
      if (!headingText || processedHeadings.has(headingText) || headingText.length < 3) {
        return;
      }
      
      processedHeadings.add(headingText);
      
      const level = parseInt($heading.prop('tagName')?.slice(1) || '2');
      const content = this.extractSectionContent($, $heading);
      
      if (content && content.length > 20) {
        sections.push({
          heading: headingText,
          level,
          content: this.cleanSectionContent(content)
        });
      }
    });
    
    return sections;
  }

  private cleanHeading(heading: string): string {
    return heading
      .replace(/^\s*[\d\.\-\u2022\u2192]+\s*/, '') // Remove numbering and bullets
      .replace(/\s*[\u2192\u00bb\u203a]\s*$/, '') // Remove trailing arrows
      .trim();
  }

  private extractSectionContent($: CheerioAPI, $heading: cheerio.Cheerio<any>): string {
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
      
      const tagName = current.prop('tagName')?.toLowerCase();
      
      if (tagName === 'p') {
        const text = current.text().trim();
        if (text && text.length > 10) {
          content += text + '\n\n';
        }
      } else if (tagName === 'ul') {
        const listItems: string[] = [];
        current.find('li').each((_, li) => {
          const itemText = $(li).text().trim();
          if (itemText) {
            listItems.push(`- ${itemText}`);
          }
        });
        if (listItems.length > 0) {
          content += listItems.join('\n') + '\n\n';
        }
      } else if (tagName === 'ol') {
        const listItems: string[] = [];
        current.find('li').each((i, li) => {
          const itemText = $(li).text().trim();
          if (itemText) {
            listItems.push(`${i + 1}. ${itemText}`);
          }
        });
        if (listItems.length > 0) {
          content += listItems.join('\n') + '\n\n';
        }
      } else if (tagName === 'blockquote') {
        const quote = current.text().trim();
        if (quote) {
          content += `> ${quote}\n\n`;
        }
      } else if (tagName === 'div' || tagName === 'section') {
        // Process container elements
        const containerText = current.text().trim();
        if (containerText && containerText.length > 20 && 
            !current.find('h1, h2, h3, h4, h5, h6').length) {
          content += containerText + '\n\n';
        }
      }
      
      current = current.next();
    }
    
    return content.trim();
  }

  private cleanSectionContent(content: string): string {
    return content
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/\n\s*\n\s*\n+/g, '\n\n') // Clean up excessive line breaks
      .split('\n\n')
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 10) // Remove very short paragraphs
      .join('\n\n')
      .trim();
  }
}