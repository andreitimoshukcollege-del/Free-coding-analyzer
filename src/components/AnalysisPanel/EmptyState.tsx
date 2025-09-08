// src/components/AnalysisPanel/EmptyState.tsx

import { Bug, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-analysis' | 'analyzing' | 'no-optimizations';
  darkMode: boolean;  // ← Make sure this line is here!
}

export const EmptyState = ({ type, darkMode }: EmptyStateProps) => {
  if (type === 'no-analysis') {
    return (
      <div className="p-12 text-center">
        <div className="w-24 h-24 mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl opacity-20 animate-pulse" />
          <div className="relative w-full h-full bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-3xl flex items-center justify-center">
            <Bug className="w-12 h-12 text-indigo-500" />
          </div>
        </div>
        <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          No Analysis Yet
        </h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Write some code and click "Analyze" to check for issues
        </p>
      </div>
    );
  }

  if (type === 'analyzing') {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Bug className="w-8 h-8 text-blue-600" />
        </div>
        <p className="text-gray-600">Analyzing your code...</p>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-2xl flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-green-500" />
      </div>
      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Code is Optimized!
      </p>
      <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        No obvious improvements found
      </p>
    </div>
  );
};