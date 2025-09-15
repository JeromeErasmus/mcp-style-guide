import { STYLE_MANUAL_URLS } from './urls.js';

// Style focus area mappings to Style Manual URLs from configuration
export const FOCUS_AREA_URLS: Record<string, string[]> = {
  'plain-language': [
    STYLE_MANUAL_URLS.plainLanguage,
    STYLE_MANUAL_URLS.sentences,
    STYLE_MANUAL_URLS.literacyAndAccess
  ],
  'active-voice': [
    STYLE_MANUAL_URLS.voiceAndTone,
    STYLE_MANUAL_URLS.sentences,
    STYLE_MANUAL_URLS.activePassiveVoice
  ],
  'punctuation': [
    STYLE_MANUAL_URLS.punctuationCapitalisation,
    STYLE_MANUAL_URLS.commas,
    STYLE_MANUAL_URLS.apostrophes,
    STYLE_MANUAL_URLS.quotationMarks,
    STYLE_MANUAL_URLS.colons,
    STYLE_MANUAL_URLS.semicolons,
    STYLE_MANUAL_URLS.dashes,
    STYLE_MANUAL_URLS.hyphens,
    STYLE_MANUAL_URLS.bracketsParentheses,
    STYLE_MANUAL_URLS.ellipses,
    STYLE_MANUAL_URLS.exclamationMarks,
    STYLE_MANUAL_URLS.forwardSlashes,
    STYLE_MANUAL_URLS.fullStops,
    STYLE_MANUAL_URLS.questionMarks
  ],
  'inclusive-language': [
    STYLE_MANUAL_URLS.genderSexualDiversity,
    STYLE_MANUAL_URLS.disabilityNeurodiversity,
    STYLE_MANUAL_URLS.aboriginalTorresStrait,
    STYLE_MANUAL_URLS.culturalLinguisticDiversity,
    STYLE_MANUAL_URLS.ageDiversity
  ],
  'grammar': [
    STYLE_MANUAL_URLS.nouns,
    STYLE_MANUAL_URLS.verbs,
    STYLE_MANUAL_URLS.adjectives,
    STYLE_MANUAL_URLS.clauses,
    STYLE_MANUAL_URLS.adverbs,
    STYLE_MANUAL_URLS.conjunctions,
    STYLE_MANUAL_URLS.determiners,
    STYLE_MANUAL_URLS.phrases,
    STYLE_MANUAL_URLS.prepositions,
    STYLE_MANUAL_URLS.pronouns
  ],
  'accessibility': [
    STYLE_MANUAL_URLS.makeContentAccessible,
    STYLE_MANUAL_URLS.applyAccessibilityPrinciples,
    STYLE_MANUAL_URLS.howPeopleRead,
    STYLE_MANUAL_URLS.agencyResponsibilities,
    STYLE_MANUAL_URLS.designForAccessibility,
    STYLE_MANUAL_URLS.easyRead,
    STYLE_MANUAL_URLS.accessiblePdf
  ],
  'structure': [
    STYLE_MANUAL_URLS.headings,
    STYLE_MANUAL_URLS.paragraphs,
    STYLE_MANUAL_URLS.lists,
    STYLE_MANUAL_URLS.typesStructure,
    STYLE_MANUAL_URLS.textBoxesCallouts
  ],
  'spelling': [
    STYLE_MANUAL_URLS.commonMisspellings,
    STYLE_MANUAL_URLS.alwaysUseAustralianDictionary,
    STYLE_MANUAL_URLS.itsAndIts
  ],
  'structuringContent': [
    STYLE_MANUAL_URLS.typesStructure,
    STYLE_MANUAL_URLS.hierarchicalStructure,
    STYLE_MANUAL_URLS.sequentialStructure,
    STYLE_MANUAL_URLS.invertedPyramidStructure,
    STYLE_MANUAL_URLS.narrativeStructure
  ],
  'headings': [
    STYLE_MANUAL_URLS.headings,
    STYLE_MANUAL_URLS.tipsHeadings
  ],
  'links': [
    STYLE_MANUAL_URLS.links
  ],
  'lists': [
    STYLE_MANUAL_URLS.lists,
    STYLE_MANUAL_URLS.parallelStructureLists,
    STYLE_MANUAL_URLS.useStructureReadable
  ],
  'paragraphs': [
    STYLE_MANUAL_URLS.paragraphs,
    STYLE_MANUAL_URLS.paragraphsStructureFlow
  ],
  'tables': [
    STYLE_MANUAL_URLS.tables
  ],
  'sentences': [
    STYLE_MANUAL_URLS.sentences
  ],
  'howPeopleFindInfo': [
    STYLE_MANUAL_URLS.howPeopleRead,
    STYLE_MANUAL_URLS.howPeopleFindInfo
  ],
  'numeralsOrWords': [
    STYLE_MANUAL_URLS.numeralsOrWords,
    STYLE_MANUAL_URLS.numbersMeasurements,
    STYLE_MANUAL_URLS.tipsNumeralsWords
  ],
  'currency': [
    STYLE_MANUAL_URLS.currency
  ],
  'dateTime': [
    STYLE_MANUAL_URLS.datesTime
  ],
  'typesStructure': [
    STYLE_MANUAL_URLS.typesStructure
  ],
  'hierarchicalStructure': [
    STYLE_MANUAL_URLS.hierarchicalStructure
  ],
  'sequentialStructure': [
    STYLE_MANUAL_URLS.sequentialStructure
  ],
  'shortened-words': [
    STYLE_MANUAL_URLS.abbreviations,
    STYLE_MANUAL_URLS.acronymsInitialisms,
    STYLE_MANUAL_URLS.contractions,
    STYLE_MANUAL_URLS.latinShortened
  ],
  'writing-process': [
    STYLE_MANUAL_URLS.userResearch,
    STYLE_MANUAL_URLS.editingProofreading,
    STYLE_MANUAL_URLS.clearLanguage,
    STYLE_MANUAL_URLS.understandingSearchEngines,
    STYLE_MANUAL_URLS.keywordsAndSearch,
    STYLE_MANUAL_URLS.pageOptimisation,
    STYLE_MANUAL_URLS.securityClassifications
  ],
  // New comprehensive focus areas for complete coverage
  'numbers-and-measurements': [
    STYLE_MANUAL_URLS.numbersMeasurements,
    STYLE_MANUAL_URLS.mathematicalRelationships,
    STYLE_MANUAL_URLS.measurementUnits,
    STYLE_MANUAL_URLS.ordinalNumbers,
    STYLE_MANUAL_URLS.percentages,
    STYLE_MANUAL_URLS.fractionsDecimals,
    STYLE_MANUAL_URLS.telephoneNumbers
  ],
  'names-and-terminology': [
    STYLE_MANUAL_URLS.namesTerms,
    STYLE_MANUAL_URLS.australianPlaceNames,
    STYLE_MANUAL_URLS.commercialTerms,
    STYLE_MANUAL_URLS.governmentTerms,
    STYLE_MANUAL_URLS.medicalTerms,
    STYLE_MANUAL_URLS.nationalitiesPeoples,
    STYLE_MANUAL_URLS.naturalPhenomena,
    STYLE_MANUAL_URLS.organisationNames,
    STYLE_MANUAL_URLS.personalNames,
    STYLE_MANUAL_URLS.plantsAnimals,
    STYLE_MANUAL_URLS.shipsAircraftVehicles,
    STYLE_MANUAL_URLS.topographicTerms
  ],
  'titles-and-honours': [
    STYLE_MANUAL_URLS.titlesHonours,
    STYLE_MANUAL_URLS.academicsProfessionals,
    STYLE_MANUAL_URLS.australianDefenceForce,
    STYLE_MANUAL_URLS.awardsHonours,
    STYLE_MANUAL_URLS.diplomats,
    STYLE_MANUAL_URLS.judiciary,
    STYLE_MANUAL_URLS.parliamentsCouncils,
    STYLE_MANUAL_URLS.royaltyViceRoyalty
  ],
  'content-types': [
    STYLE_MANUAL_URLS.blogs,
    STYLE_MANUAL_URLS.emailsLetters,
    STYLE_MANUAL_URLS.forms,
    STYLE_MANUAL_URLS.images,
    STYLE_MANUAL_URLS.altTextCaptions,
    STYLE_MANUAL_URLS.journalsMagazines,
    STYLE_MANUAL_URLS.pdfFormat,
    STYLE_MANUAL_URLS.reports,
    STYLE_MANUAL_URLS.socialMedia,
    STYLE_MANUAL_URLS.videoAudio,
    STYLE_MANUAL_URLS.videoAudioRequirements
  ],
  'referencing-and-attribution': [
    STYLE_MANUAL_URLS.authorDate,
    STYLE_MANUAL_URLS.broadcastMediaPodcasts,
    STYLE_MANUAL_URLS.classics,
    STYLE_MANUAL_URLS.musicalCompositions,
    STYLE_MANUAL_URLS.playsPoetry,
    STYLE_MANUAL_URLS.worksArt,
    STYLE_MANUAL_URLS.documentaryNote,
    STYLE_MANUAL_URLS.shortenedFormsReferencing
  ],
  'legal-material': [
    STYLE_MANUAL_URLS.legalMaterial,
    STYLE_MANUAL_URLS.actsParliament,
    STYLE_MANUAL_URLS.authoritativeReports,
    STYLE_MANUAL_URLS.billsExplanatory,
    STYLE_MANUAL_URLS.casesLegalAuthorities,
    STYLE_MANUAL_URLS.delegatedLegislation,
    STYLE_MANUAL_URLS.schedules,
    STYLE_MANUAL_URLS.treaties
  ],
  'quick-guides': [
    STYLE_MANUAL_URLS.quickGuides,
    STYLE_MANUAL_URLS.quickGuideMisspellings,
    STYLE_MANUAL_URLS.quickGuideDatesTime,
    STYLE_MANUAL_URLS.quickGuideLists,
    STYLE_MANUAL_URLS.quickGuideNumbers,
    STYLE_MANUAL_URLS.quickGuidePlainLanguage,
    STYLE_MANUAL_URLS.quickGuideSpelling
  ],
  'government-writing-handbook': [
    STYLE_MANUAL_URLS.frontMatter,
    STYLE_MANUAL_URLS.handbookAcknowledgements,
    STYLE_MANUAL_URLS.handbookForeword,
    STYLE_MANUAL_URLS.howCitePublication,
    STYLE_MANUAL_URLS.handbookIntroduction,
    STYLE_MANUAL_URLS.noteTerminology,
    STYLE_MANUAL_URLS.makeArgument,
    STYLE_MANUAL_URLS.mechanicsWriting,
    STYLE_MANUAL_URLS.relateReaders,
    STYLE_MANUAL_URLS.tellReadersWhatNeed,
    STYLE_MANUAL_URLS.tellStoryFollow,
    STYLE_MANUAL_URLS.understandWhoWhy,
    STYLE_MANUAL_URLS.writeMeaningClear,
    STYLE_MANUAL_URLS.beClearGrammatical,
    STYLE_MANUAL_URLS.keepSimplePlain,
    STYLE_MANUAL_URLS.makeAccessibleInclusive,
    STYLE_MANUAL_URLS.afterword
  ],
  'style-manual-resources': [
    STYLE_MANUAL_URLS.blog,
    STYLE_MANUAL_URLS.trainingDevelopment
  ],
  'formatting-and-style': [
    STYLE_MANUAL_URLS.italics
  ]
};

// Derive focus area types from the configuration object
export type FocusAreaKey = keyof typeof FOCUS_AREA_URLS;
export const FOCUS_AREA_KEYS = Object.keys(FOCUS_AREA_URLS) as FocusAreaKey[];

// Default focus areas that provide comprehensive coverage
export const DEFAULT_FOCUS_AREAS: FocusAreaKey[] = [
  'plain-language', 
  'active-voice', 
  'punctuation',
  'structure', 
  'accessibility', 
  'inclusive-language',
  'grammar',
  'structuringContent',
  'headings',
  'links',
  'lists',
  'paragraphs',
  'tables',
  'sentences',
  'spelling',
  'howPeopleFindInfo',
  'numeralsOrWords',
  'currency',
  'dateTime',
  'numbers-and-measurements',
  'shortened-words',
  'writing-process'
];