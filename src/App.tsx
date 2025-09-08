// src/App.tsx

import { useState } from 'react';
import { Header } from './components/Header/Header';
import { CodeEditor } from './components/CodeEditor/CodeEditor';
import { AnalysisPanel } from './components/AnalysisPanel/AnalysisPanel';
import { Summary } from './components/Summary/Summary';
import { useAnalyzer } from './hooks/useAnalyzer';
import { useClipboard } from './hooks/useClipboard';
import { sampleCode } from './services/mockData';
import type { Language } from './types';

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<Language>('python');
  const [darkMode, setDarkMode] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const { isAnalyzing, analysis, analyzeCode, clearAnalysis } = useAnalyzer();
  const { copied, copyToClipboard } = useClipboard();

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    clearAnalysis();
  };

  const handleLoadSample = () => {
    setCode(sampleCode[language]);
    clearAnalysis();
    setShowWelcome(false);
  };

  const handleAnalyze = () => {
    analyzeCode(code, language);
  };

  const handleCopy = () => {
    copyToClipboard(code);
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (newCode && showWelcome) {
      setShowWelcome(false);
    }
  };

  return (
    
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'
    }`}>
      {/* Animated Background Elements */}


      <div className="relative z-10 max-w-7xl mx-auto p-6">
        <Header 
          language={language}
          darkMode={darkMode}
          onLanguageChange={handleLanguageChange}
          onLoadSample={handleLoadSample}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CodeEditor 
            code={code}
            language={language}
            analysis={analysis}
            isAnalyzing={isAnalyzing}
            darkMode={darkMode}
            onCodeChange={handleCodeChange}
            onAnalyze={handleAnalyze}
            onCopy={handleCopy}
            onLoadSample={handleLoadSample}
            copied={copied}
          />

          <AnalysisPanel 
            analysis={analysis}
            isAnalyzing={isAnalyzing}
            darkMode={darkMode}
          />
        </div>

        {analysis && <Summary analysis={analysis} darkMode={darkMode} />}
      </div>
    </div>
  );
}

export default App;