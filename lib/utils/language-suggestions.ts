/**
 * Language Suggestions Utility
 * 
 * Provides smart language defaults for code blocks based on:
 * 1. Recently used languages (localStorage)
 * 2. Technology-based suggestions
 * 3. All available languages
 */

export interface LanguageSuggestion {
  lang: string;
  timestamp?: number;
  category: 'recent' | 'suggested' | 'all';
}

// Technology → Language mapping
const TECH_LANGUAGE_MAP: Record<string, string[]> = {
  react: ['javascript', 'typescript', 'jsx', 'tsx'],
  'next.js': ['javascript', 'typescript', 'jsx', 'tsx'],
  vue: ['javascript', 'typescript'],
  angular: ['typescript'],
  node: ['javascript', 'typescript'],
  python: ['python'],
  django: ['python'],
  flask: ['python'],
  java: ['java'],
  spring: ['java'],
  go: ['go'],
  rust: ['rust'],
  php: ['php'],
  laravel: ['php'],
  sql: ['sql'],
  postgresql: ['sql'],
  mysql: ['sql'],
  docker: ['yaml', 'bash', 'shell'],
  kubernetes: ['yaml'],
  aws: ['yaml', 'json', 'bash'],
  'c++': ['cpp', 'c'],
  'c#': ['csharp'],
  ruby: ['ruby'],
  rails: ['ruby'],
};

// All available languages (from codemirror-block.tsx)
export const ALL_LANGUAGES = [
  'javascript',
  'typescript',
  'jsx',
  'tsx',
  'python',
  'css',
  'html',
  'json',
  'java',
  'cpp',
  'c',
  'csharp',
  'go',
  'rust',
  'php',
  'sql',
  'markdown',
  'xml',
  'yaml',
  'wasm',
  'bash',
  'shell',
];

const STORAGE_KEY = 'snippets_language_usage';

interface LanguageUsageData {
  recentLanguages: Array<{ lang: string; timestamp: number }>;
}

/**
 * Get language usage data from localStorage
 */
function getLanguageUsage(): LanguageUsageData {
  if (typeof window === 'undefined') {
    return { recentLanguages: [] };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { recentLanguages: [] };
    return JSON.parse(stored);
  } catch {
    return { recentLanguages: [] };
  }
}

/**
 * Save language usage to localStorage
 */
function saveLanguageUsage(data: LanguageUsageData): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Record that a language was used
 */
export function recordLanguageUsage(lang: string): void {
  const data = getLanguageUsage();
  
  // Remove existing entry for this language
  data.recentLanguages = data.recentLanguages.filter(item => item.lang !== lang);
  
  // Add to front
  data.recentLanguages.unshift({
    lang,
    timestamp: Date.now(),
  });
  
  // Keep only last 5
  data.recentLanguages = data.recentLanguages.slice(0, 5);
  
  saveLanguageUsage(data);
}

/**
 * Get suggested languages for a technology
 */
export function getSuggestedLanguages(technologyName?: string): string[] {
  if (!technologyName) return [];
  
  const normalized = technologyName.toLowerCase();
  return TECH_LANGUAGE_MAP[normalized] || [];
}

/**
 * Get smart language suggestions
 * Returns languages in priority order:
 * 1. Recently used (last 3, with timestamps)
 * 2. Technology-suggested
 * 3. All others
 */
export function getLanguageSuggestions(technologyName?: string): LanguageSuggestion[] {
  const data = getLanguageUsage();
  const suggestions: LanguageSuggestion[] = [];
  const used = new Set<string>();
  
  // 1. Recently used (last 3)
  const recentLanguages = data.recentLanguages.slice(0, 3);
  recentLanguages.forEach(item => {
    suggestions.push({
      lang: item.lang,
      timestamp: item.timestamp,
      category: 'recent',
    });
    used.add(item.lang);
  });
  
  // 2. Technology-suggested
  const techSuggestions = getSuggestedLanguages(technologyName);
  techSuggestions.forEach(lang => {
    if (!used.has(lang)) {
      suggestions.push({
        lang,
        category: 'suggested',
      });
      used.add(lang);
    }
  });
  
  // 3. All others
  ALL_LANGUAGES.forEach(lang => {
    if (!used.has(lang)) {
      suggestions.push({
        lang,
        category: 'all',
      });
    }
  });
  
  return suggestions;
}

/**
 * Get the default language for a technology
 * Returns the first recently used, or first tech-suggested, or 'javascript'
 */
export function getDefaultLanguage(technologyName?: string): string {
  const suggestions = getLanguageSuggestions(technologyName);
  
  // Prefer recent
  const recent = suggestions.find(s => s.category === 'recent');
  if (recent) return recent.lang;
  
  // Then tech-suggested
  const suggested = suggestions.find(s => s.category === 'suggested');
  if (suggested) return suggested.lang;
  
  // Fallback
  return 'javascript';
}
