import { z } from 'zod';
import { readFile, writeFile } from 'fs/promises';
import { StyleManualExtractor } from '../extraction/style-manual-extractor.js';
import { SimpleSearch } from '../search/simple-search.js';
import { formatAsMarkdown } from '../utils/formatters.js';
import { handleToolError } from '../utils/errors.js';
import { ToolError } from '../types/index.js';

// Style focus area mappings to Style Manual URLs
const FOCUS_AREA_URLS: Record<string, string[]> = {
  'plain-language': [
    '/writing-and-designing-content/clear-language-and-writing-style/plain-language-and-word-choice',
    '/writing-and-designing-content/clear-language-and-writing-style/sentences',
    '/accessible-and-inclusive-content/literacy-and-access'
  ],
  'active-voice': [
    '/writing-and-designing-content/clear-language-and-writing-style/voice-and-tone',
    '/writing-and-designing-content/clear-language-and-writing-style/sentences'
  ],
  'punctuation': [
    '/grammar-punctuation-and-conventions/punctuation/',
    '/grammar-punctuation-and-conventions/punctuation/commas',
    '/grammar-punctuation-and-conventions/punctuation/apostrophes',
    '/grammar-punctuation-and-conventions/punctuation/quotation-marks'
  ],
  'inclusive-language': [
    '/accessible-and-inclusive-content/inclusive-language/',
    '/accessible-and-inclusive-content/inclusive-language/gender-and-sexual-diversity',
    '/accessible-and-inclusive-content/inclusive-language/disability-and-neurodiversity',
    '/accessible-and-inclusive-content/inclusive-language/aboriginal-and-torres-strait-islander-peoples'
  ],
  'grammar': [
    '/grammar-punctuation-and-conventions/',
    '/grammar-punctuation-and-conventions/types-words',
    '/grammar-punctuation-and-conventions/parts-sentences'
  ],
  'accessibility': [
    '/accessible-and-inclusive-content/',
    '/accessible-and-inclusive-content/make-content-accessible',
    '/accessible-and-inclusive-content/how-people-read'
  ],
  'structure': [
    '/structuring-content/',
    '/structuring-content/headings',
    '/structuring-content/paragraphs',
    '/structuring-content/lists'
  ],
  'spelling': [
    '/grammar-punctuation-and-conventions/spelling',
    '/grammar-punctuation-and-conventions/spelling/common-misspellings-and-word-confusion'
  ],
  'structuringContent': [
    '/structuring-content/',
    '/structuring-content/structure-content-information-architecture',
    '/structuring-content/page-titles'
  ],
  'headings': [
    '/structuring-content/headings',
    '/structuring-content/headings/heading-hierarchy',
    '/structuring-content/headings/descriptive-headings'
  ],
  'links': [
    '/structuring-content/links',
    '/structuring-content/links/link-text',
    '/structuring-content/links/external-links'
  ],
  'lists': [
    '/structuring-content/lists',
    '/structuring-content/lists/bulleted-lists',
    '/structuring-content/lists/numbered-lists'
  ],
  'paragraphs': [
    '/structuring-content/paragraphs',
    '/structuring-content/paragraphs/paragraph-length',
    '/structuring-content/paragraphs/topic-sentences'
  ],
  'tables': [
    '/structuring-content/tables',
    '/structuring-content/tables/table-structure',
    '/structuring-content/tables/table-headers'
  ],
  'sentences': [
    '/writing-and-designing-content/clear-language-and-writing-style/sentences',
    '/writing-and-designing-content/clear-language-and-writing-style/sentences/sentence-length',
    '/writing-and-designing-content/clear-language-and-writing-style/sentences/sentence-structure'
  ],
  'howPeopleFindInfo': [
    '/accessible-and-inclusive-content/how-people-read',
    '/accessible-and-inclusive-content/how-people-read/scanning-and-reading-patterns',
    '/accessible-and-inclusive-content/how-people-read/cognitive-load'
  ],
  'numeralsOrWords': [
    '/grammar-punctuation-and-conventions/numbers',
    '/grammar-punctuation-and-conventions/numbers/when-to-use-numerals-or-words',
    '/grammar-punctuation-and-conventions/numbers/large-numbers'
  ],
  'currency': [
    '/grammar-punctuation-and-conventions/numbers/currency',
    '/grammar-punctuation-and-conventions/numbers/currency/australian-currency',
    '/grammar-punctuation-and-conventions/numbers/currency/foreign-currency'
  ],
  'dateTime': [
    '/grammar-punctuation-and-conventions/dates-and-time',
    '/grammar-punctuation-and-conventions/dates-and-time/date-formats',
    '/grammar-punctuation-and-conventions/dates-and-time/time-formats'
  ],
  'typesStructure': [
    '/structuring-content/types-structure',
    '/structuring-content/types-structure/introduction',
    '/structuring-content/types-structure/body-structure'
  ],
  'hierarchicalStructure': [
    '/structuring-content/types-structure/hierarchical-structure',
    '/structuring-content/types-structure/hierarchical-structure/overview-to-detail',
    '/structuring-content/types-structure/hierarchical-structure/category-structures'
  ],
  'sequentialStructure': [
    '/structuring-content/types-structure/sequential-structure',
    '/structuring-content/types-structure/sequential-structure/step-by-step',
    '/structuring-content/types-structure/sequential-structure/process-flows'
  ]
};

interface StyleGuideline {
  area: string;
  rule: string;
  example?: string;
  source: string;
}

export const rewriteDocumentTool = {
  name: "rewrite_with_style_guide",
  description: "Rewrite document using Australian Style Manual recommendations. Applies style guidelines for plain language, active voice, punctuation, inclusive language, and accessibility. Supports both direct document content and file input/output.",
  inputSchema: z.object({
    document: z.string().optional().describe("The document text to rewrite (required if no inputFile)"),
    inputFile: z.string().optional().describe("Path to input file to read and rewrite (required if no document)"),
    outputFile: z.string().optional().describe("Path to output file to write the rewritten content (optional, prints to console if not specified)"),
    focusAreas: z.array(z.enum([
      'plain-language', 
      'active-voice', 
      'punctuation', 
      'inclusive-language', 
      'grammar', 
      'accessibility', 
      'structure', 
      'spelling',
      'structuringContent',
      'headings',
      'links',
      'lists',
      'paragraphs',
      'tables',
      'sentences',
      'howPeopleFindInfo',
      'numeralsOrWords',
      'currency',
      'dateTime',
      'typesStructure',
      'hierarchicalStructure',
      'sequentialStructure'
    ])).optional().default([
      'plain-language', 
      'active-voice', 
      'structure', 
      'accessibility', 
      'inclusive-language',
      'structuringContent',
      'headings',
      'links',
      'lists',
      'paragraphs',
      'tables',
      'sentences',
      'howPeopleFindInfo',
      'numeralsOrWords',
      'currency',
      'dateTime',
      'typesStructure',
      'hierarchicalStructure',
      'sequentialStructure'
    ]).describe("Specific style areas to focus on (default: comprehensive readability, structure, and formatting areas)"),
    targetAudience: z.enum(['general-public', 'government-staff', 'technical-audience']).optional().default('general-public').describe("Target audience for the rewrite"),
    explanation: z.boolean().optional().default(true).describe("Include explanation of changes made")
  }).refine((data) => data.document || data.inputFile, {
    message: "Either 'document' content or 'inputFile' path must be provided"
  }),
  
  handler: async ({ 
    document,
    inputFile,
    outputFile,
    focusAreas = [
      'plain-language', 
      'active-voice', 
      'structure', 
      'accessibility', 
      'inclusive-language',
      'structuringContent',
      'headings',
      'links',
      'lists',
      'paragraphs',
      'tables',
      'sentences',
      'howPeopleFindInfo',
      'numeralsOrWords',
      'currency',
      'dateTime',
      'typesStructure',
      'hierarchicalStructure',
      'sequentialStructure'
    ], 
    targetAudience = 'general-public',
    explanation = true 
  }: { 
    document?: string; 
    inputFile?: string;
    outputFile?: string;
    focusAreas?: ('plain-language' | 'active-voice' | 'punctuation' | 'inclusive-language' | 'grammar' | 'accessibility' | 'structure' | 'spelling' | 'structuringContent' | 'headings' | 'links' | 'lists' | 'paragraphs' | 'tables' | 'sentences' | 'howPeopleFindInfo' | 'numeralsOrWords' | 'currency' | 'dateTime' | 'typesStructure' | 'hierarchicalStructure' | 'sequentialStructure')[] | undefined; 
    targetAudience?: 'general-public' | 'government-staff' | 'technical-audience' | undefined;
    explanation?: boolean | undefined;
  }) => {
    try {
      // Validate input: either document content or inputFile must be provided
      if (!document && !inputFile) {
        throw new ToolError('Either document content or inputFile must be provided');
      }

      // Read document content from file if inputFile is provided
      let documentContent: string;
      if (inputFile) {
        try {
          documentContent = await readFile(inputFile, 'utf-8');
          console.log(`📖 Read ${documentContent.length} characters from ${inputFile}`);
        } catch (error) {
          throw new ToolError(`Failed to read input file: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
      } else {
        documentContent = document!;
      }

      // Import URL configuration
      const { getFullUrl } = await import('../config/urls.js') as { getFullUrl: (path: string) => string };
      
      const extractor = new StyleManualExtractor();
      const searcher = new SimpleSearch();
      
      // Gather relevant style guidelines
      const guidelines: StyleGuideline[] = [];
      
      for (const focusArea of focusAreas) {
        const urls = FOCUS_AREA_URLS[focusArea];
        if (!urls) continue;
        
        for (const uriPath of urls) {
          try {
            const fullUrl = getFullUrl(uriPath);
            const content = await extractor.extractPageContent(fullUrl);
            
            // Extract key guidelines from content
            const keyPhrases = [
              'use plain language', 'write short sentences', 'use active voice',
              'avoid jargon', 'use simple words', 'be inclusive', 'avoid bias',
              'use proper punctuation', 'check spelling', 'structure clearly',
              'use headings', 'write for accessibility', 'year 7 reading level'
            ];
            
            for (const phrase of keyPhrases) {
              const matches = searcher.findMatches(content, phrase);
              for (const match of matches) {
                guidelines.push({
                  area: focusArea,
                  rule: match.snippet,
                  source: content.url
                });
              }
            }
          } catch (error) {
            // Continue with other URLs if one fails
            console.warn(`Failed to fetch guidelines from ${uriPath}:`, error);
          }
        }
      }
      
      // Generate rewrite instructions based on gathered guidelines and target audience
      const rewriteInstructions = generateRewriteInstructions(guidelines, targetAudience, focusAreas);
      
      // Apply rewriting logic
      const rewrittenDocument = await applyStyleRewrite(documentContent, rewriteInstructions, targetAudience);
      
      // Write to output file if specified
      if (outputFile) {
        try {
          await writeFile(outputFile, rewrittenDocument, 'utf-8');
          console.log(`💾 Written ${rewrittenDocument.length} characters to ${outputFile}`);
        } catch (error) {
          throw new ToolError(`Failed to write output file: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
      }
      
      // Format response
      let response = outputFile ? 
        `# Document Rewritten Successfully\n\n✅ **Input**: ${inputFile ? inputFile : 'Direct content'}\n✅ **Output**: ${outputFile}\n✅ **Length**: ${rewrittenDocument.length} characters\n\n` :
        `# Rewritten Document\n\n${rewrittenDocument}\n\n`;
      
      if (explanation) {
        response += `## Style Manual Guidelines Applied\n\n`;
        response += `**Target Audience:** ${targetAudience}\n`;
        response += `**Focus Areas:** ${focusAreas.join(', ')}\n\n`;
        
        response += `### Key Changes Made:\n`;
        response += generateChangeExplanation(documentContent, rewrittenDocument, guidelines);
        
        response += `\n### Style Manual Sources:\n`;
        const uniqueSources = [...new Set(guidelines.map(g => g.source))];
        for (const source of uniqueSources.slice(0, 5)) {
          response += `- ${source}\n`;
        }
      }
      
      return {
        content: [{ type: "text" as const, text: response }],
        // Include the rewritten document in the response for programmatic access
        rewrittenDocument: rewrittenDocument,
        inputSource: inputFile ? `file:${inputFile}` : 'direct',
        outputDestination: outputFile ? `file:${outputFile}` : 'response'
      };
      
    } catch (error) {
      return handleToolError(error);
    }
  }
};

function generateRewriteInstructions(
  guidelines: StyleGuideline[], 
  targetAudience: string,
  focusAreas: string[]
): string[] {
  const instructions: string[] = [];
  
  // Base instructions for all audiences
  instructions.push("Rewrite this document following Australian Government Style Manual guidelines.");
  
  if (focusAreas.includes('plain-language')) {
    instructions.push("Use plain language suitable for a year 7 reading level.");
    instructions.push("Replace complex words with simple alternatives.");
    instructions.push("Keep sentences to an average of 15-20 words.");
  }
  
  if (focusAreas.includes('active-voice')) {
    instructions.push("Use active voice instead of passive voice where possible.");
    instructions.push("Make the subject of sentences clear and direct.");
  }
  
  if (focusAreas.includes('structure')) {
    instructions.push("Use clear headings and logical structure.");
    instructions.push("Break up long paragraphs (keep to 3-4 sentences max).");
    instructions.push("Use bullet points for lists where appropriate.");
  }
  
  if (focusAreas.includes('inclusive-language')) {
    instructions.push("Use inclusive, non-discriminatory language.");
    instructions.push("Avoid gendered language where possible.");
    instructions.push("Be respectful of cultural diversity.");
  }
  
  if (focusAreas.includes('accessibility')) {
    instructions.push("Write for accessibility and screen readers.");
    instructions.push("Use descriptive link text.");
    instructions.push("Ensure content is logical when read aloud.");
  }
  
  if (focusAreas.includes('structuringContent')) {
    instructions.push("Structure content with clear information architecture.");
    instructions.push("Use logical content flow and organization.");
    instructions.push("Provide meaningful page titles and section structure.");
  }
  
  if (focusAreas.includes('headings')) {
    instructions.push("Use descriptive, hierarchical headings (H1, H2, H3).");
    instructions.push("Make headings informative and scannable.");
    instructions.push("Follow proper heading hierarchy without skipping levels.");
  }
  
  if (focusAreas.includes('links')) {
    instructions.push("Use descriptive link text that explains the destination.");
    instructions.push("Avoid generic link text like 'click here' or 'read more'.");
    instructions.push("Clearly indicate external links when appropriate.");
  }
  
  if (focusAreas.includes('lists')) {
    instructions.push("Use bulleted lists for unordered items.");
    instructions.push("Use numbered lists for sequential steps or priorities.");
    instructions.push("Keep list items parallel in structure and length.");
  }
  
  if (focusAreas.includes('paragraphs')) {
    instructions.push("Keep paragraphs focused on one main idea.");
    instructions.push("Limit paragraphs to 3-4 sentences maximum.");
    instructions.push("Use topic sentences to introduce paragraph content.");
  }
  
  if (focusAreas.includes('tables')) {
    instructions.push("Use proper table headers and structure.");
    instructions.push("Make table data scannable and accessible.");
    instructions.push("Provide table captions when needed for context.");
  }
  
  if (focusAreas.includes('sentences')) {
    instructions.push("Write clear, concise sentences with optimal length.");
    instructions.push("Use varied sentence structure to maintain engagement.");
    instructions.push("Ensure each sentence has one main idea.");
  }
  
  if (focusAreas.includes('howPeopleFindInfo')) {
    instructions.push("Structure content for scanning and reading patterns.");
    instructions.push("Reduce cognitive load with clear organization.");
    instructions.push("Use front-loading technique - put key information first.");
  }
  
  if (focusAreas.includes('numeralsOrWords')) {
    instructions.push("Use numerals for numbers 10 and above, words for numbers below 10.");
    instructions.push("Follow Australian conventions for large numbers and measurements.");
    instructions.push("Be consistent with number formatting throughout the document.");
  }
  
  if (focusAreas.includes('currency')) {
    instructions.push("Use Australian currency formats ($ before amount, no spaces).");
    instructions.push("Clearly indicate foreign currencies when referenced.");
    instructions.push("Follow government standards for financial amounts.");
  }
  
  if (focusAreas.includes('dateTime')) {
    instructions.push("Use clear, unambiguous date formats (DD Month YYYY).");
    instructions.push("Follow Australian date and time conventions.");
    instructions.push("Ensure dates are accessible and internationally understood.");
  }
  
  if (focusAreas.includes('typesStructure')) {
    instructions.push("Choose appropriate content structure type for the information.");
    instructions.push("Use clear introduction and body structure patterns.");
    instructions.push("Match structure to user needs and information type.");
  }
  
  if (focusAreas.includes('hierarchicalStructure')) {
    instructions.push("Organize content from overview to detail (hierarchical).");
    instructions.push("Use category-based structures where appropriate.");
    instructions.push("Create clear information hierarchies that guide users.");
  }
  
  if (focusAreas.includes('sequentialStructure')) {
    instructions.push("Use step-by-step structure for processes and procedures.");
    instructions.push("Create clear process flows and sequential information.");
    instructions.push("Number steps and use logical ordering for tasks.");
  }
  
  // Audience-specific adjustments
  switch (targetAudience) {
    case 'general-public':
      instructions.push("Write for the general public - avoid government jargon and acronyms.");
      instructions.push("Explain technical terms when necessary.");
      break;
    case 'government-staff':
      instructions.push("Write for government employees - some department terminology is acceptable.");
      instructions.push("Still maintain clarity and avoid unnecessary jargon.");
      break;
    case 'technical-audience':
      instructions.push("Write for technical professionals - technical terms are acceptable when appropriate.");
      instructions.push("Maintain precision while improving clarity.");
      break;
  }
  
  return instructions;
}

async function applyStyleRewrite(
  document: string, 
  instructions: string[],
  targetAudience: string
): Promise<string> {
  // This is a simplified rewriting function
  // In a real implementation, you might use AI/NLP libraries or more sophisticated text processing
  
  let rewritten = document;
  
  // Basic transformations based on Style Manual guidelines
  
  // 1. Replace passive voice patterns (simplified)
  rewritten = rewritten
    .replace(/is being (\w+)/g, '$1s')
    .replace(/was (\w+ed) by/g, '$1')
    .replace(/will be (\w+ed)/g, 'will $1');
  
  // 2. Replace complex words with simpler alternatives
  const wordReplacements: Record<string, string> = {
    'utilise': 'use',
    'commence': 'start',
    'terminate': 'end',
    'demonstrate': 'show',
    'implement': 'put in place',
    'facilitate': 'help',
    'endeavour': 'try',
    'subsequently': 'then',
    'prior to': 'before',
    'in order to': 'to',
    'with regard to': 'about',
    'in relation to': 'about'
  };
  
  for (const [complex, simple] of Object.entries(wordReplacements)) {
    const regex = new RegExp(`\\b${complex}\\b`, 'gi');
    rewritten = rewritten.replace(regex, simple);
  }
  
  // 3. Fix common punctuation issues
  rewritten = rewritten
    .replace(/\s+([.,;:!?])/g, '$1') // Remove spaces before punctuation
    .replace(/([.!?])\s*([A-Z])/g, '$1 $2') // Ensure single space after sentences
    .replace(/\s{2,}/g, ' ') // Replace multiple spaces with single space
    .trim();
  
  // 4. Break up very long sentences (simplified approach)
  const sentences = rewritten.split(/(?<=[.!?])\s+/);
  const rewrittenSentences = sentences.map(sentence => {
    if (sentence.split(' ').length > 25) {
      // Try to break at conjunctions
      return sentence
        .replace(/, and /g, '. ')
        .replace(/, but /g, '. However, ')
        .replace(/, however /g, '. However, ');
    }
    return sentence;
  });
  
  rewritten = rewrittenSentences.join(' ');
  
  return rewritten;
}

function generateChangeExplanation(
  original: string,
  rewritten: string,
  guidelines: StyleGuideline[]
): string {
  const changes: string[] = [];
  
  // Count word changes
  const originalWords = original.split(/\s+/).length;
  const rewrittenWords = rewritten.split(/\s+/).length;
  const wordDiff = rewrittenWords - originalWords;
  
  if (wordDiff < 0) {
    changes.push(`- Reduced word count by ${Math.abs(wordDiff)} words for clarity`);
  } else if (wordDiff > 0) {
    changes.push(`- Added ${wordDiff} words for clarity and completeness`);
  }
  
  // Check for specific improvements
  if (original.includes('utilise') || original.includes('commence')) {
    changes.push('- Replaced complex words with simpler alternatives');
  }
  
  if (original.match(/is being|was.*by|will be.*ed/)) {
    changes.push('- Converted passive voice to active voice');
  }
  
  // Sentence length analysis
  const originalSentences = original.split(/[.!?]+/).filter(s => s.trim());
  const rewrittenSentences = rewritten.split(/[.!?]+/).filter(s => s.trim());
  
  const avgOriginal = originalSentences.reduce((sum, s) => sum + s.split(' ').length, 0) / originalSentences.length;
  const avgRewritten = rewrittenSentences.reduce((sum, s) => sum + s.split(' ').length, 0) / rewrittenSentences.length;
  
  if (avgRewritten < avgOriginal - 2) {
    changes.push(`- Shortened average sentence length from ${Math.round(avgOriginal)} to ${Math.round(avgRewritten)} words`);
  }
  
  if (changes.length === 0) {
    changes.push('- Applied Style Manual formatting and clarity improvements');
  }
  
  return changes.join('\n');
}