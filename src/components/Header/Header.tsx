// src/components/Header/Header.tsx

import { memo, useMemo, useCallback } from 'react';
import { Code2, FileCode, Moon, Sun } from 'lucide-react';
import type { Language } from '../../types';

interface HeaderProps {
  language: Language;
  darkMode: boolean;
  onLanguageChange: (language: Language) => void;
  onLoadSample: () => void;
  onToggleDarkMode: () => void;
}

// Static data outside component to prevent recreation
const LANGUAGES: Language[] = ['python', 'java', 'javascript', 'typescript'] as const;

// Memoized language display names
const LANGUAGE_DISPLAY_NAMES = {
  python: 'Python',
  java: 'Java',
  javascript: 'JavaScript',
  typescript: 'TypeScript'
} as const;

export const Header = memo(({ 
  language, 
  darkMode,
  onLanguageChange, 
  onLoadSample,
  onToggleDarkMode
}: HeaderProps) => {
  
  // Memoize className strings
  const headerClass = useMemo(() => 
    `mb-8 ${darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'} 
     border rounded-2xl shadow-xl p-6 transition-colors`,
    [darkMode]
  );

  const subtitleClass = useMemo(() => 
    `text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`,
    [darkMode]
  );

  const loadExampleClass = useMemo(() =>
    `px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 ${
      darkMode 
        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    } shadow-lg hover:shadow-xl`,
    [darkMode]
  );

  const darkModeToggleClass = useMemo(() =>
    `p-3 rounded-xl transition-colors ${
      darkMode 
        ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    } shadow-lg hover:shadow-xl`,
    [darkMode]
  );

  // Memoize language button click handlers
  const languageHandlers = useMemo(() => 
    LANGUAGES.reduce((acc, lang) => {
      acc[lang] = () => onLanguageChange(lang);
      return acc;
    }, {} as Record<Language, () => void>),
    [onLanguageChange]
  );

  // Memoize language button className generator
  const getLanguageButtonClass = useCallback((lang: Language) => {
    const isActive = language === lang;
    if (isActive) {
      return 'px-4 py-2 rounded-lg font-medium transition-colors bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg';
    }
    return `px-4 py-2 rounded-lg font-medium transition-colors ${
      darkMode 
        ? 'text-gray-400 hover:text-white hover:bg-gray-700'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`;
  }, [language, darkMode]);

  // Memoized logo component to prevent re-renders
  const Logo = useMemo(() => (
    <div className="relative">
      {/* Removed animate-pulse for better performance */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-30" />
      <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg">
        <Code2 className="w-7 h-7 text-white" />
      </div>
    </div>
  ), []);

  return (
    <header className={headerClass}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {Logo}
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Free Code Analyzer
            </h1>
            <p className={subtitleClass}>
              Intelligent code analysis powered by advanced patterns
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-1 rounded-xl">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={languageHandlers[lang]}
                className={getLanguageButtonClass(lang)}
                aria-label={`Select ${LANGUAGE_DISPLAY_NAMES[lang]}`}
              >
                {LANGUAGE_DISPLAY_NAMES[lang]}
              </button>
            ))}
          </div>
          
          {/* Load Sample Button */}
          <button
            onClick={onLoadSample}
            className={loadExampleClass}
            aria-label="Load code example"
          >
            <FileCode className="w-4 h-4" />
            Load Example
          </button>
          
          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className={darkModeToggleClass}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';