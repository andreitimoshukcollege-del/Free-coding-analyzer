// src/components/CodeEditor/CodeEditor.tsx

import { memo, useMemo, useCallback } from 'react';
import { Copy, Check, Play, Terminal, Activity } from 'lucide-react';
import type { Language, AnalysisResult } from '../../types';

interface CodeEditorProps {
  code: string;
  language: Language;
  analysis: AnalysisResult | null;
  isAnalyzing: boolean;
  darkMode: boolean;
  onCodeChange: (code: string) => void;
  onAnalyze: () => void;
  onCopy: () => void;
  onLoadSample: () => void;
  copied: boolean;
}

export const CodeEditor = memo(({
  code,
  language,
  analysis,
  isAnalyzing,
  darkMode,
  onCodeChange,
  onAnalyze,
  onCopy,
  onLoadSample,
  copied
}: CodeEditorProps) => {
  
  // Memoize line calculations
  const { lineCount, lineNumbersText, maxLines } = useMemo(() => {
    const lines = code.split('\n');
    const count = Math.max(lines.length, 20);
    const max = Math.min(count, 100); // Cap at 100 for performance
    
    // Create line numbers as a single string for performance
    const numbersText = Array.from(
      { length: max }, 
      (_, i) => i + 1
    ).join('\n');
    
    return {
      lineCount: count,
      lineNumbersText: numbersText,
      maxLines: max
    };
  }, [code]);

  // Memoize issues filtering
  const issueLines = useMemo(() => {
    if (!analysis) return [];
    const allIssues = [...analysis.errors, ...analysis.optimizations];
    return allIssues.filter(issue => issue.line <= maxLines);
  }, [analysis, maxLines]);

  // Memoize event handlers
  const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onCodeChange(e.target.value);
  }, [onCodeChange]);

  // Memoize className strings
  const containerClass = useMemo(() => 
    `${darkMode 
      ? 'bg-gray-800 rounded-2xl shadow-2xl' 
      : 'bg-white rounded-2xl shadow-2xl'
    } overflow-hidden`,
    [darkMode]
  );

  const headerClass = useMemo(() =>
    `border-b ${
      darkMode ? 'border-gray-700 bg-gray-800/80' : 'border-gray-200 bg-gray-50/80'
    } px-6 py-4 flex items-center justify-between`,
    [darkMode]
  );

  const lineNumberClass = useMemo(() =>
    `px-3 py-4 text-sm font-mono select-none border-r ${
      darkMode 
        ? 'bg-gray-900/50 text-gray-500 border-gray-700' 
        : 'bg-gray-50 text-gray-400 border-gray-200'
    }`,
    [darkMode]
  );

  const textareaClass = useMemo(() =>
    `flex-1 p-4 font-mono text-sm resize-none focus:outline-none ${
      darkMode 
        ? 'bg-gray-900/30 text-gray-100 placeholder-gray-500' 
        : 'bg-transparent text-gray-800 placeholder-gray-400'
    }`,
    [darkMode]
  );

  // Memoized subcomponents

    
    
  const IssueIndicators = useMemo(() => {
    if (issueLines.length === 0) return null;
    
    return (
      <div className="absolute left-0 top-16 w-1">
        {issueLines.map((issue, idx) => {
          // Determine if it's an error or optimization
          const isError = analysis?.errors.includes(issue);
          return (
            <div
              key={`${issue.line}-${idx}`}
              className={`absolute w-1 h-6 ${
                isError ? 'bg-red-500' : 'bg-yellow-500'
              }`}
              style={{ 
                top: `${(issue.line - 1) * 1.5}rem`,
                opacity: 0.5
              }}
            />
          );
        })}
      </div>
    );
  }, [issueLines, analysis]);

  return (
    <div className={containerClass}>
      <div className={headerClass}>
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-indigo-500" />
          <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Code Editor
          </h2>
          <span className={`text-xs px-2 py-1 rounded-full ${
            darkMode ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
          }`}>
            {language}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCopy}
            className={`p-2 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            title="Copy code"
          >
            {copied ? 
              <Check className="w-4 h-4 text-green-500" /> : 
              <Copy className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            }
          </button>
          <button
            onClick={onAnalyze}
            disabled={!code || isAnalyzing}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {isAnalyzing ? (
              <>
                <Activity className="w-4 h-4 animate-pulse" />
                Analyzing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Analyze Code
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="relative">
        
        <div className="flex">
          {/* Optimized Line Numbers */}
          <div className={lineNumberClass}>
            <pre style={{ 
              margin: 0, 
              lineHeight: '1.5rem',
              textAlign: 'right',
              minWidth: '2rem'
            }}>
              {lineNumbersText}
            </pre>
            {IssueIndicators}
          </div>
          
          {/* Code Textarea */}
          <textarea
            value={code}
            onChange={handleCodeChange}
            placeholder={`Write or paste your ${language} code here...`}
            className={textareaClass}
            style={{ 
              minHeight: '480px', 
              lineHeight: '1.5rem',
              tabSize: 4
            }}
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
});

CodeEditor.displayName = 'CodeEditor';