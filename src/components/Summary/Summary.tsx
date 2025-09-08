// src/components/Summary/Summary.tsx

import { Bug, TrendingUp, Activity, Shield } from 'lucide-react';
import type { AnalysisResult } from '../../types';

interface SummaryProps {
  analysis: AnalysisResult;
  darkMode: boolean;
}

export const Summary = ({ analysis, darkMode }: SummaryProps) => {
  const getQualityScore = () => {
    const totalIssues = analysis.errors.length + analysis.optimizations.length;
    const score = Math.max(0, 100 - (totalIssues * 10));
    return score;
  };

  const getQualityLabel = () => {
    if (analysis.errors.length === 0 && analysis.optimizations.length === 0) {
      return { label: 'Excellent', color: 'text-green-500' };
    }
    if (analysis.errors.length === 0) {
      return { label: 'Good', color: 'text-yellow-500' };
    }
    return { label: 'Needs Work', color: 'text-red-500' };
  };

  const quality = getQualityLabel();
  const healthScore = getQualityScore();

  return (
    <div className={`mt-6 ${
      darkMode ? 'glass-dark' : 'glass'
    } rounded-2xl shadow-2xl p-6 transition-smooth`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Errors Card */}
        <div className={`p-4 rounded-xl ${
          darkMode ? 'bg-gray-900/50' : 'bg-gradient-to-br from-red-50 to-pink-50'
        } border ${darkMode ? 'border-gray-700' : 'border-red-200'} transition-smooth hover-scale`}>
          <div className="flex items-center justify-between mb-2">
            <Bug className="w-5 h-5 text-red-500" />
            <span className={`text-2xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>{analysis.errors.length}</span>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Errors Found
          </p>
        </div>

        {/* Optimizations Card */}
        <div className={`p-4 rounded-xl ${
          darkMode ? 'bg-gray-900/50' : 'bg-gradient-to-br from-yellow-50 to-orange-50'
        } border ${darkMode ? 'border-gray-700' : 'border-yellow-200'} transition-smooth hover-scale`}>
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-yellow-500" />
            <span className={`text-2xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>{analysis.optimizations.length}</span>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Optimizations
          </p>
        </div>

        {/* Code Health Card */}
        <div className={`p-4 rounded-xl ${
          darkMode ? 'bg-gray-900/50' : 'bg-gradient-to-br from-green-50 to-emerald-50'
        } border ${darkMode ? 'border-gray-700' : 'border-green-200'} transition-smooth hover-scale`}>
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-green-500" />
            <span className={`text-2xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              {healthScore}%
            </span>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Code Health
          </p>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                healthScore >= 80 ? 'bg-green-500' : 
                healthScore >= 60 ? 'bg-yellow-500' : 
                'bg-red-500'
              }`}
              style={{ width: `${healthScore}%` }}
            />
          </div>
        </div>

        {/* Overall Quality Card */}
        <div className={`p-4 rounded-xl ${
          darkMode ? 'bg-gray-900/50' : 'bg-gradient-to-br from-indigo-50 to-purple-50'
        } border ${darkMode ? 'border-gray-700' : 'border-indigo-200'} transition-smooth hover-scale`}>
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-5 h-5 text-indigo-500" />
            <span className={`text-lg font-bold ${quality.color}`}>
              {quality.label}
            </span>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Overall Quality
          </p>
        </div>
      </div>
    </div>
  );
};