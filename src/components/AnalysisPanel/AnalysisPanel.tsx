import { useState, useEffect, memo, useCallback } from 'react';
import { Check, Shield, AlertCircle, Lightbulb, Cpu } from 'lucide-react';
// Import both AnalysisResult AND Issue from your types
import type { AnalysisResult, Issue } from '../../types';

// If IssueCard and EmptyState exist as separate files, import them instead:
// import { IssueCard } from './IssueCard';
// import { EmptyState } from './EmptyState';

interface AnalysisPanelProps {
  analysis: AnalysisResult | null;
  isAnalyzing: boolean;
  darkMode: boolean;
  onLineClick?: (line: number) => void;
}

// Use the imported Issue type directly
interface IssueCardProps {
  issue: Issue;
  darkMode: boolean;
  onClick?: (line: number) => void;
}

interface EmptyStateProps {
  type: 'no-analysis' | 'no-optimizations';
  darkMode: boolean;
}

// Memoized IssueCard component using Issue type
const IssueCard = memo<IssueCardProps>(({ issue, darkMode, onClick }) => {
  const handleClick = useCallback(() => {
    onClick?.(issue.line);
  }, [onClick, issue.line]);

  // Map all possible severity values to colors
  const getSeverityColor = (severity: any) => {
    // Handle whatever severity values your app uses
    if (severity === 'error' || severity === 'high') return 'text-red-500';
    if (severity === 'warning' || severity === 'medium') return 'text-yellow-500';
    if (severity === 'low' || severity === 'info') return 'text-blue-500';
    return 'text-gray-500';
  };

  return (
    <div 
      onClick={handleClick}
      className={`p-3 rounded-lg cursor-pointer transition-colors ${
        darkMode 
          ? 'hover:bg-gray-700/50 bg-gray-800/30' 
          : 'hover:bg-gray-100 bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-2">
        <AlertCircle className={`w-4 h-4 mt-0.5 ${getSeverityColor(issue.severity)}`} />
        <div className="flex-1">
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            {issue.message}
          </p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Line {issue.line} • {issue.type}
          </p>
        </div>
      </div>
    </div>
  );
});

IssueCard.displayName = 'IssueCard';

// Memoized EmptyState component
const EmptyState = memo<EmptyStateProps>(({ type, darkMode }) => {
  if (type === 'no-analysis') {
    return (
      <div className="p-12 text-center">
        <Shield className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Paste code to start analysis
        </p>
      </div>
    );
  }
  
  return (
    <div className="text-center py-8">
      <Lightbulb className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        No optimization suggestions
      </p>
    </div>
  );
});

EmptyState.displayName = 'EmptyState';

// Main component
export const AnalysisPanel = memo<AnalysisPanelProps>(({ 
  analysis, 
  isAnalyzing,
  darkMode,
  onLineClick 
}) => {
  const [activeTab, setActiveTab] = useState<'errors' | 'optimizations'>('errors');

  // Memoize computed values
  //const errorCount = useMemo(() => analysis?.errors?.length || 0, [analysis]);
  //const optimizationCount = useMemo(() => analysis?.optimizations?.length || 0, [analysis]);

  useEffect(() => {
    if (analysis) {
      if (analysis.errors.length > 0) {
        setActiveTab('errors');
      } else if (analysis.optimizations.length > 0) {
        setActiveTab('optimizations');
      }
    }
  }, [analysis]);

  // Memoize callbacks
  const handleErrorTabClick = useCallback(() => setActiveTab('errors'), []);
  const handleOptimizationTabClick = useCallback(() => setActiveTab('optimizations'), []);

  // Simplified className (removed expensive backdrop-blur)
  const containerClass = `${
    darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'
  } border rounded-2xl shadow-xl overflow-hidden transition-colors`;

  return (
    <div className={containerClass}>
      <div className={`border-b ${
        darkMode ? 'border-gray-700 bg-gray-800/80' : 'border-gray-200 bg-gray-50/80'
      } px-6 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-purple-500" />
          <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Analysis Results
          </h2>
          {analysis && (
            <div className="flex gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                analysis.errors.length === 0 
                  ? 'bg-green-500/20 text-green-500'
                  : 'bg-red-500/20 text-red-500'
              }`}>
                {analysis.errors.length} issues
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-600">
                {analysis.optimizations.length} optimizations
              </span>
            </div>
          )}
        </div>
      </div>

      {!analysis && !isAnalyzing && (
        <EmptyState type="no-analysis" darkMode={darkMode} />
      )}

      {isAnalyzing && (
        <div className="p-12 text-center">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl opacity-20" />
            <div className={`absolute inset-2 ${
              darkMode ? 'bg-gray-900' : 'bg-white'
            } rounded-2xl`} />
            <div className="relative w-full h-full flex items-center justify-center">
              <Cpu className="w-12 h-12 text-indigo-500" />
            </div>
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Analyzing Your Code
          </h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Running advanced pattern detection...
          </p>
        </div>
      )}

      {analysis && (
        <div>
          <div className="flex">
            <button
              onClick={handleErrorTabClick}
              className={`flex-1 px-4 py-3 font-medium transition-colors ${
                activeTab === 'errors'
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                  : darkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Issues ({analysis.errors.length})
              </div>
            </button>
            <button
              onClick={handleOptimizationTabClick}
              className={`flex-1 px-4 py-3 font-medium transition-colors ${
                activeTab === 'optimizations'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                  : darkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Optimizations ({analysis.optimizations.length})
              </div>
            </button>
          </div>

          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {activeTab === 'errors' && (
              <>
                {analysis.errors.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-2xl flex items-center justify-center">
                      <Check className="w-8 h-8 text-green-500" />
                    </div>
                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      No Issues Found!
                    </p>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Your code is syntactically correct
                    </p>
                  </div>
                ) : (
                  analysis.errors.map((error: Issue, idx: number) => (
                    <IssueCard 
                      key={idx} 
                      issue={error} 
                      darkMode={darkMode}
                      onClick={onLineClick}
                    />
                  ))
                )}
              </>
            )}

            {activeTab === 'optimizations' && (
              <>
                {analysis.optimizations.length === 0 ? (
                  <EmptyState type="no-optimizations" darkMode={darkMode} />
                ) : (
                  analysis.optimizations.map((opt: Issue, idx: number) => (
                    <IssueCard 
                      key={idx} 
                      issue={opt} 
                      darkMode={darkMode}
                      onClick={onLineClick}
                    />
                  ))
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

AnalysisPanel.displayName = 'AnalysisPanel';