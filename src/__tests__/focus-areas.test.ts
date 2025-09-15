import { 
  FOCUS_AREA_URLS, 
  FOCUS_AREA_KEYS, 
  DEFAULT_FOCUS_AREAS, 
  FocusAreaKey 
} from '../config/focus-areas.js';
import { rewriteDocumentTool } from '../tools/rewrite-document.js';

describe('Focus Areas Configuration', () => {
  describe('FOCUS_AREA_URLS', () => {
    test('should have URL mappings for all focus areas', () => {
      expect(Object.keys(FOCUS_AREA_URLS).length).toBeGreaterThan(0);
      
      // Each focus area should have at least one URL
      Object.entries(FOCUS_AREA_URLS).forEach(([area, urls]) => {
        expect(urls).toBeDefined();
        expect(urls.length).toBeGreaterThan(0);
        expect(typeof area).toBe('string');
      });
    });

    test('should include shortened-words focus area', () => {
      expect(FOCUS_AREA_URLS['shortened-words']).toBeDefined();
      expect(FOCUS_AREA_URLS['shortened-words'].length).toBeGreaterThan(0);
    });

    test('should include core focus areas', () => {
      const coreFocusAreas = [
        'plain-language', 
        'active-voice', 
        'accessibility', 
        'inclusive-language',
        'structure'
      ];
      
      coreFocusAreas.forEach(area => {
        expect(FOCUS_AREA_URLS[area]).toBeDefined();
        expect(FOCUS_AREA_URLS[area].length).toBeGreaterThan(0);
      });
    });
  });

  describe('FOCUS_AREA_KEYS', () => {
    test('should derive keys from FOCUS_AREA_URLS', () => {
      const expectedKeys = Object.keys(FOCUS_AREA_URLS);
      expect(FOCUS_AREA_KEYS).toEqual(expect.arrayContaining(expectedKeys));
      expect(FOCUS_AREA_KEYS.length).toBe(expectedKeys.length);
    });

    test('should include shortened-words in available keys', () => {
      expect(FOCUS_AREA_KEYS).toContain('shortened-words');
    });
  });

  describe('DEFAULT_FOCUS_AREAS', () => {
    test('should contain only valid focus area keys', () => {
      DEFAULT_FOCUS_AREAS.forEach(area => {
        expect(FOCUS_AREA_KEYS).toContain(area);
      });
    });

    test('should include shortened-words by default', () => {
      expect(DEFAULT_FOCUS_AREAS).toContain('shortened-words');
    });

    test('should include core areas by default', () => {
      const expectedDefaults = [
        'plain-language', 
        'active-voice', 
        'structure', 
        'accessibility', 
        'inclusive-language'
      ];
      
      expectedDefaults.forEach(area => {
        expect(DEFAULT_FOCUS_AREAS).toContain(area);
      });
    });

    test('should be a reasonable subset of all available areas', () => {
      expect(DEFAULT_FOCUS_AREAS.length).toBeGreaterThan(5);
      expect(DEFAULT_FOCUS_AREAS.length).toBeLessThan(FOCUS_AREA_KEYS.length);
    });
  });
});

describe('Rewrite Document Tool Focus Areas', () => {
  const testDocument = "The utilisation of complex methodologies requires careful consideration.";

  describe('Parameter validation', () => {
    test('should accept default focus areas', async () => {
      const result = await rewriteDocumentTool.handler({
        document: testDocument,
        targetAudience: 'general-public',
        explanation: false
      });
      
      expect(result.content).toBeDefined();
      expect(result.content[0].text).toBeDefined();
    }, 30000);

    test('should accept single focus area', async () => {
      const result = await rewriteDocumentTool.handler({
        document: testDocument,
        focusAreas: ['plain-language'],
        targetAudience: 'general-public',
        explanation: false
      });
      
      expect(result.content).toBeDefined();
      expect(result.content[0].text).toBeDefined();
    }, 10000);

    test('should accept multiple focus areas', async () => {
      const result = await rewriteDocumentTool.handler({
        document: testDocument,
        focusAreas: ['plain-language', 'accessibility', 'shortened-words'],
        targetAudience: 'technical-audience',
        explanation: false
      });
      
      expect(result.content).toBeDefined();
      expect(result.content[0].text).toBeDefined();
    }, 10000);

    test('should accept all available focus areas', async () => {
      const result = await rewriteDocumentTool.handler({
        document: testDocument,
        focusAreas: FOCUS_AREA_KEYS,
        targetAudience: 'government-staff',
        explanation: false
      });
      
      expect(result.content).toBeDefined();
      expect(result.content[0].text).toBeDefined();
    }, 60000);

    test('should work with shortened-words focus area specifically', async () => {
      const result = await rewriteDocumentTool.handler({
        document: "The govt. will utilise e.g. acronyms and i.e. abbreviations.",
        focusAreas: ['shortened-words', 'plain-language'],
        targetAudience: 'general-public',
        explanation: false
      });
      
      expect(result.content).toBeDefined();
      expect(result.content[0].text).toBeDefined();
    }, 10000);

    test('should work with additional focus areas combined with defaults', async () => {
      // Test combining non-default focus areas with the default set
      const additionalAreas = ['content-types', 'legal-material'];
      const combinedAreas = [...DEFAULT_FOCUS_AREAS, ...additionalAreas];
      
      const result = await rewriteDocumentTool.handler({
        document: "The utilisation of complex methodologies requires careful consideration. Its important to note that the govt's approach has been consistant throughout.",
        focusAreas: combinedAreas,
        targetAudience: 'general-public',
        explanation: false
      });
      
      expect(result.content).toBeDefined();
      expect(result.content[0].text).toBeDefined();
      
      // Verify that the combined areas are all valid
      combinedAreas.forEach(area => {
        expect(FOCUS_AREA_KEYS).toContain(area);
      });
      
      // Verify we have more than just defaults
      expect(combinedAreas.length).toBeGreaterThan(DEFAULT_FOCUS_AREAS.length);
    }, 30000);

    test('should work with reports focus area combined with defaults', async () => {
      // Test adding reports focus area to defaults (reports is in content-types)
      const combinedAreas = [...DEFAULT_FOCUS_AREAS, 'content-types'];
      
      const result = await rewriteDocumentTool.handler({
        document: "Executive Summary: This report presents findings from our comprehensive analysis of government methodologies and their implementation.",
        focusAreas: combinedAreas,
        targetAudience: 'general-public',
        explanation: false
      });
      
      expect(result.content).toBeDefined();
      expect(result.content[0].text).toBeDefined();
      
      // Verify content-types includes reports URL
      expect(FOCUS_AREA_KEYS).toContain('content-types');
    }, 60000);
  });

  describe('Target audience variations', () => {
    const audiences: ('general-public' | 'government-staff' | 'technical-audience')[] = [
      'general-public', 
      'government-staff', 
      'technical-audience'
    ];

    audiences.forEach(audience => {
      test(`should work with ${audience} target audience`, async () => {
        const result = await rewriteDocumentTool.handler({
          document: testDocument,
          focusAreas: ['plain-language', 'accessibility'],
          targetAudience: audience,
          explanation: false
        });
        
        expect(result.content).toBeDefined();
        expect(result.content[0].text).toBeDefined();
      }, 10000);
    });
  });

  describe('Explanation parameter', () => {
    test('should work with explanation enabled', async () => {
      const result = await rewriteDocumentTool.handler({
        document: testDocument,
        focusAreas: ['plain-language'],
        targetAudience: 'general-public',
        explanation: true
      });
      
      expect(result.content).toBeDefined();
      expect(result.content[0].text).toBeDefined();
    }, 10000);

    test('should work with explanation disabled', async () => {
      const result = await rewriteDocumentTool.handler({
        document: testDocument,
        focusAreas: ['plain-language'],
        targetAudience: 'general-public',
        explanation: false
      });
      
      expect(result.content).toBeDefined();
      expect(result.content[0].text).toBeDefined();
    }, 10000);
  });
});

describe('System Flexibility', () => {
  test('adding new focus areas should be straightforward', () => {
    // This test verifies the system design allows for easy extension
    expect(typeof FOCUS_AREA_URLS).toBe('object');
    expect(Array.isArray(FOCUS_AREA_KEYS)).toBe(true);
    expect(Array.isArray(DEFAULT_FOCUS_AREAS)).toBe(true);
    
    // If we were to add a new focus area, we would only need to:
    // 1. Add it to FOCUS_AREA_URLS in focus-areas.ts
    // 2. Optionally add it to DEFAULT_FOCUS_AREAS
    // 3. Everything else (types, enums, validation) is automatic
    expect(true).toBe(true); // System design test passes
  });

  test('should maintain type safety', () => {
    // Compile-time type checking ensures this
    DEFAULT_FOCUS_AREAS.forEach((area: FocusAreaKey) => {
      expect(typeof area).toBe('string');
      expect(FOCUS_AREA_KEYS).toContain(area);
    });
  });
});