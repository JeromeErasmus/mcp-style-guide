// src/config/urls.ts

// Base URL for the Style Manual website
export const STYLE_MANUAL_BASE_URL = 'https://www.stylemanual.gov.au';

// URI paths for all Style Manual pages
export const STYLE_MANUAL_URLS: Record<string, string> = {
  
  // Writing and designing content
  userResearch: '/writing-and-designing-content/user-research-and-content',
  clearLanguage: '/writing-and-designing-content/clear-language-and-writing-style',
  plainLanguage: '/writing-and-designing-content/clear-language-and-writing-style/plain-language-and-word-choice',
  sentences: '/writing-and-designing-content/clear-language-and-writing-style/sentences',
  voiceAndTone: '/writing-and-designing-content/clear-language-and-writing-style/voice-and-tone',
  howPeopleFindInfo: '/writing-and-designing-content/findable-content/how-people-find-information',
  understandingSearchEngines: '/writing-and-designing-content/findable-content/understanding-search-engines',
  keywordsAndSearch: '/writing-and-designing-content/findable-content/keywords-and-search-engines',
  pageOptimisation: '/writing-and-designing-content/findable-content/page-optimisation',
  editingProofreading: '/writing-and-designing-content/editing-and-proofreading',
  securityClassifications: '/writing-and-designing-content/security-classifications-and-protective-markings',
  
  // Accessible and inclusive content
  makeContentAccessible: '/accessible-and-inclusive-content/make-content-accessible',
  agencyResponsibilities: '/accessible-and-inclusive-content/agency-responsibilities-and-commitments',
  applyAccessibilityPrinciples: '/accessible-and-inclusive-content/apply-accessibility-principles',
  designForAccessibility: '/accessible-and-inclusive-content/design-accessibility-and-inclusion',
  literacyAndAccess: '/accessible-and-inclusive-content/literacy-and-access',
  howPeopleRead: '/accessible-and-inclusive-content/how-people-read',
  aboriginalTorresStrait: '/accessible-and-inclusive-content/inclusive-language/aboriginal-and-torres-strait-islander-peoples',
  ageDiversity: '/accessible-and-inclusive-content/inclusive-language/age-diversity',
  culturalLinguisticDiversity: '/accessible-and-inclusive-content/inclusive-language/cultural-and-linguistic-diversity',
  disabilityNeurodiversity: '/accessible-and-inclusive-content/inclusive-language/disability-and-neurodiversity',
  genderSexualDiversity: '/accessible-and-inclusive-content/inclusive-language/gender-and-sexual-diversity',
  
  // Grammar, punctuation and conventions
  adjectives: '/grammar-punctuation-and-conventions/types-words/adjectives',
  adverbs: '/grammar-punctuation-and-conventions/types-words/adverbs',
  conjunctions: '/grammar-punctuation-and-conventions/types-words/conjunctions',
  determiners: '/grammar-punctuation-and-conventions/types-words/determiners',
  nouns: '/grammar-punctuation-and-conventions/types-words/nouns',
  prepositions: '/grammar-punctuation-and-conventions/types-words/prepositions',
  pronouns: '/grammar-punctuation-and-conventions/types-words/pronouns',
  verbs: '/grammar-punctuation-and-conventions/types-words/verbs',
  clauses: '/grammar-punctuation-and-conventions/parts-sentences/clauses',
  phrases: '/grammar-punctuation-and-conventions/parts-sentences/phrases',
  punctuationCapitalisation: '/grammar-punctuation-and-conventions/punctuation/punctuation-and-capitalisation',
  apostrophes: '/grammar-punctuation-and-conventions/punctuation/apostrophes',
  bracketsParentheses: '/grammar-punctuation-and-conventions/punctuation/brackets-and-parentheses',
  colons: '/grammar-punctuation-and-conventions/punctuation/colons',
  commas: '/grammar-punctuation-and-conventions/punctuation/commas',
  dashes: '/grammar-punctuation-and-conventions/punctuation/dashes',
  ellipses: '/grammar-punctuation-and-conventions/punctuation/ellipses',
  exclamationMarks: '/grammar-punctuation-and-conventions/punctuation/exclamation-marks',
  forwardSlashes: '/grammar-punctuation-and-conventions/punctuation/forward-slashes',
  fullStops: '/grammar-punctuation-and-conventions/punctuation/full-stops',
  hyphens: '/grammar-punctuation-and-conventions/punctuation/hyphens',
  questionMarks: '/grammar-punctuation-and-conventions/punctuation/question-marks',
  quotationMarks: '/grammar-punctuation-and-conventions/punctuation/quotation-marks',
  semicolons: '/grammar-punctuation-and-conventions/punctuation/semicolons',
  commonMisspellings: '/grammar-punctuation-and-conventions/spelling/common-misspellings-and-word-confusion',
  abbreviations: '/grammar-punctuation-and-conventions/shortened-words-and-phrases/abbreviations',
  acronymsInitialisms: '/grammar-punctuation-and-conventions/shortened-words-and-phrases/acronyms-and-initialisms',
  contractions: '/grammar-punctuation-and-conventions/shortened-words-and-phrases/contractions',
  latinShortened: '/grammar-punctuation-and-conventions/shortened-words-and-phrases/latin-shortened-forms',
  numbersMeasurements: '/grammar-punctuation-and-conventions/numbers-and-measurements',
  numeralsOrWords: '/grammar-punctuation-and-conventions/numbers-and-measurements/choosing-numerals-or-words',
  currency: '/grammar-punctuation-and-conventions/numbers-and-measurements/currency',
  datesTime: '/grammar-punctuation-and-conventions/numbers-and-measurements/dates-and-time',
  fractionsDecimals: '/grammar-punctuation-and-conventions/numbers-and-measurements/fractions-and-decimals',
  mathematicalRelationships: '/grammar-punctuation-and-conventions/numbers-and-measurements/mathematical-relationships',
  measurementUnits: '/grammar-punctuation-and-conventions/numbers-and-measurements/measurement-and-units',
  ordinalNumbers: '/grammar-punctuation-and-conventions/numbers-and-measurements/ordinal-numbers',
  percentages: '/grammar-punctuation-and-conventions/numbers-and-measurements/percentages',
  telephoneNumbers: '/grammar-punctuation-and-conventions/numbers-and-measurements/telephone-numbers',
  italics: '/grammar-punctuation-and-conventions/italics',
  namesTerms: '/grammar-punctuation-and-conventions/names-and-terms',
  australianPlaceNames: '/grammar-punctuation-and-conventions/names-and-terms/australian-place-names',
  commercialTerms: '/grammar-punctuation-and-conventions/names-and-terms/commercial-terms',
  governmentTerms: '/grammar-punctuation-and-conventions/names-and-terms/government-terms',
  medicalTerms: '/grammar-punctuation-and-conventions/names-and-terms/medical-terms',
  nationalitiesPeoples: '/grammar-punctuation-and-conventions/names-and-terms/nationalities-peoples-and-places-outside-australia',
  naturalPhenomena: '/grammar-punctuation-and-conventions/names-and-terms/natural-phenomena',
  organisationNames: '/grammar-punctuation-and-conventions/names-and-terms/organisation-names',
  personalNames: '/grammar-punctuation-and-conventions/names-and-terms/personal-names',
  plantsAnimals: '/grammar-punctuation-and-conventions/names-and-terms/plants-and-animals',
  shipsAircraftVehicles: '/grammar-punctuation-and-conventions/names-and-terms/ships-aircraft-and-other-vehicles',
  topographicTerms: '/grammar-punctuation-and-conventions/names-and-terms/topographic-terms',
  titlesHonours: '/grammar-punctuation-and-conventions/titles-honours-forms-address',
  academicsProfessionals: '/grammar-punctuation-and-conventions/titles-honours-forms-address/academics-and-professionals',
  australianDefenceForce: '/grammar-punctuation-and-conventions/titles-honours-forms-address/australian-defence-force',
  awardsHonours: '/grammar-punctuation-and-conventions/titles-honours-forms-address/awards-and-honours',
  diplomats: '/grammar-punctuation-and-conventions/titles-honours-forms-address/diplomats',
  judiciary: '/grammar-punctuation-and-conventions/titles-honours-forms-address/judiciary',
  parliamentsCouncils: '/grammar-punctuation-and-conventions/titles-honours-forms-address/parliaments-and-councils',
  royaltyViceRoyalty: '/grammar-punctuation-and-conventions/titles-honours-forms-address/royalty-vice-royalty-and-nobility',
  
  // Content types
  blogs: '/content-types/blogs',
  easyRead: '/content-types/easy-read',
  emailsLetters: '/content-types/emails-and-letters',
  forms: '/content-types/forms',
  images: '/content-types/images',
  altTextCaptions: '/content-types/images/alt-text-captions-and-titles-images',
  journalsMagazines: '/content-types/journals-magazines-and-newspapers',
  pdfFormat: '/content-types/pdf-portable-document-format',
  reports: '/content-types/reports',
  socialMedia: '/content-types/social-media',
  videoAudio: '/content-types/video-and-audio',
  videoAudioRequirements: '/content-types/video-and-audio/requirements-and-standards-video-and-audio',
  
  // Structuring content
  headings: '/structuring-content/headings',
  links: '/structuring-content/links',
  lists: '/structuring-content/lists',
  paragraphs: '/structuring-content/paragraphs',
  tables: '/structuring-content/tables',
  textBoxesCallouts: '/structuring-content/text-boxes-and-callouts',
  typesStructure: '/structuring-content/types-structure',
  hierarchicalStructure: '/structuring-content/types-structure/hierarchical-structure',
  invertedPyramidStructure: '/structuring-content/types-structure/inverted-pyramid-structure',
  narrativeStructure: '/structuring-content/types-structure/narrative-structure',
  sequentialStructure: '/structuring-content/types-structure/sequential-structure',
  
  // Referencing and attribution
  authorDate: '/referencing-and-attribution/author-date',
  broadcastMediaPodcasts: '/referencing-and-attribution/author-date/broadcast-media-and-podcasts-film-video-television-and-radio-programs',
  classics: '/referencing-and-attribution/author-date/classics',
  musicalCompositions: '/referencing-and-attribution/author-date/musical-compositions',
  playsPoetry: '/referencing-and-attribution/author-date/plays-and-poetry',
  worksArt: '/referencing-and-attribution/author-date/works-art',
  documentaryNote: '/referencing-and-attribution/documentary-note',
  legalMaterial: '/referencing-and-attribution/legal-material',
  actsParliament: '/referencing-and-attribution/legal-material/acts-parliament',
  authoritativeReports: '/referencing-and-attribution/legal-material/authoritative-reports',
  billsExplanatory: '/referencing-and-attribution/legal-material/bills-and-explanatory-material',
  casesLegalAuthorities: '/referencing-and-attribution/legal-material/cases-and-legal-authorities',
  delegatedLegislation: '/referencing-and-attribution/legal-material/delegated-legislation',
  schedules: '/referencing-and-attribution/legal-material/schedules',
  treaties: '/referencing-and-attribution/legal-material/treaties',
  shortenedFormsReferencing: '/referencing-and-attribution/shortened-forms-used-referencing',
  
  // Style Manual resources
  blog: '/style-manual-resources/blog',
  trainingDevelopment: '/style-manual-resources/training-and-professional-development',
  quickGuides: '/style-manual-resources/quick-guides',
  quickGuideMisspellings: '/style-manual-resources/quick-guides/quick-guide-common-misspellings-and-word-confusion',
  quickGuideDatesTime: '/style-manual-resources/quick-guides/quick-guide-dates-and-time',
  quickGuideLists: '/style-manual-resources/quick-guides/quick-guide-lists',
  quickGuideNumbers: '/style-manual-resources/quick-guides/quick-guide-numbers',
  quickGuidePlainLanguage: '/style-manual-resources/quick-guides/quick-guide-plain-language',
  quickGuideSpelling: '/style-manual-resources/quick-guides/quick-guide-spelling-capitals-links-and-dashes',
  
  // Government Writing Handbook
  accessiblePdf: '/style-manual-resources/government-writing-handbook/accessible-pdf',
  afterword: '/style-manual-resources/government-writing-handbook/afterword',
  frontMatter: '/style-manual-resources/government-writing-handbook/front-matter',
  handbookAcknowledgements: '/style-manual-resources/government-writing-handbook/front-matter/acknowledgements',
  handbookForeword: '/style-manual-resources/government-writing-handbook/front-matter/foreword-hon-patrick-gorman-mp',
  howCitePublication: '/style-manual-resources/government-writing-handbook/front-matter/how-cite-publication',
  handbookIntroduction: '/style-manual-resources/government-writing-handbook/front-matter/introduction',
  noteTerminology: '/style-manual-resources/government-writing-handbook/front-matter/note-terminology',
  makeArgument: '/style-manual-resources/government-writing-handbook/section-1-write-your-readers/make-argument',
  mechanicsWriting: '/style-manual-resources/government-writing-handbook/section-1-write-your-readers/mechanics-writing',
  relateReaders: '/style-manual-resources/government-writing-handbook/section-1-write-your-readers/relate-your-readers',
  tellReadersWhatNeed: '/style-manual-resources/government-writing-handbook/section-1-write-your-readers/tell-readers-what-they-need-know',
  tellStoryFollow: '/style-manual-resources/government-writing-handbook/section-1-write-your-readers/tell-story-and-follow-flow',
  understandWhoWhy: '/style-manual-resources/government-writing-handbook/section-1-write-your-readers/understand-who-you-are-writing-and-why',
  writeMeaningClear: '/style-manual-resources/government-writing-handbook/section-2-write-so-your-meaning-clear',
  beClearGrammatical: '/style-manual-resources/government-writing-handbook/section-2-write-so-your-meaning-clear/be-clear-being-grammatical',
  keepSimplePlain: '/style-manual-resources/government-writing-handbook/section-2-write-so-your-meaning-clear/keep-it-simple-plain-language',
  makeAccessibleInclusive: '/style-manual-resources/government-writing-handbook/section-2-write-so-your-meaning-clear/make-it-accessible-and-inclusive',
  useStructureReadable: '/style-manual-resources/government-writing-handbook/section-2-write-so-your-meaning-clear/use-structure-make-it-readable-bullet-lists',
  
  // Editor's Tips
  activePassiveVoice: '/style-manual-resources/government-writing-handbook/editors-tips/active-and-passive-voice',
  alwaysUseAustralianDictionary: '/style-manual-resources/government-writing-handbook/editors-tips/always-use-australian-dictionary',
  tipsHeadings: '/style-manual-resources/government-writing-handbook/editors-tips/headings',
  itsAndIts: '/style-manual-resources/government-writing-handbook/editors-tips/its-and-its',
  tipsNumeralsWords: '/style-manual-resources/government-writing-handbook/editors-tips/numbers-choosing-numerals-or-words',
  paragraphsStructureFlow: '/style-manual-resources/government-writing-handbook/editors-tips/paragraphs-structure-and-narratives-flow',
  parallelStructureLists: '/style-manual-resources/government-writing-handbook/editors-tips/parallel-structure-lists',
  positiveSentences: '/style-manual-resources/government-writing-handbook/editors-tips/positive-sentences',
  punctuationQuotationMarks: '/style-manual-resources/government-writing-handbook/editors-tips/punctuation-and-quotation-marks',
  sentenceLength: '/style-manual-resources/government-writing-handbook/editors-tips/sentence-length',
  wordOrder: '/style-manual-resources/government-writing-handbook/editors-tips/word-order',
  youMeOrYouI: '/style-manual-resources/government-writing-handbook/editors-tips/you-and-me-or-you-and-i'
};

// Helper function to create full URLs from URI paths
export function getFullUrl(uriPath: string): string {
  return `${STYLE_MANUAL_BASE_URL}${uriPath}`;
}

// Default URLs for search when none specified
export const DEFAULT_SEARCH_URLS: string[] = [
  getFullUrl(STYLE_MANUAL_URLS.clearLanguage),
  getFullUrl(STYLE_MANUAL_URLS.punctuationCapitalisation),
  getFullUrl(STYLE_MANUAL_URLS.makeContentAccessible),
  getFullUrl(STYLE_MANUAL_URLS.genderSexualDiversity),
  getFullUrl(STYLE_MANUAL_URLS.plainLanguage),
  getFullUrl(STYLE_MANUAL_URLS.headings),
  getFullUrl(STYLE_MANUAL_URLS.lists)
];

// URL validation
export const ALLOWED_DOMAIN = 'stylemanual.gov.au';

export function isValidStyleManualUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === ALLOWED_DOMAIN || urlObj.hostname === `www.${ALLOWED_DOMAIN}`;
  } catch {
    return false;
  }
}