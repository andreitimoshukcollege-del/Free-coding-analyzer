// src/components/AnalysisPanel/IssueCard.tsx

import { AlertCircle, Lightbulb } from 'lucide-react';
import type { Issue } from '../../types';

interface IssueCardProps {
  issue: Issue;
  darkMode: boolean;
  onClick?: () => void;
}

export const IssueCard = ({ issue, darkMode, onClick }: IssueCardProps) => {
  const isError = issue.type === 'error';
  
  const getSeverityColor = () => {
    if (isError) {
      return issue.severity === 'high' 
        ? 'bg-red-500' 
        : issue.severity === 'medium'
        ? 'bg-orange-500'
        : 'bg-yellow-500';
    }
    return issue.severity === 'high' 
      ? 'bg-orange-500' 
      : issue.severity === 'medium'
      ? 'bg-yellow-500'
      : 'bg-blue-500';
  };

  const getSeverityLabel = () => {
    if (isError) return issue.severity;
    return issue.severity === 'high' ? 'Important' : 
           issue.severity === 'medium' ? 'Moderate' : 
           'Minor';
  };

  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer hover:scale-[1.02] hover-scale ${
        isError
          ? darkMode 
            ? 'bg-red-900/20 border-red-800 hover:bg-red-900/30' 
            : 'bg-red-50 border-red-200 hover:bg-red-100'
          : darkMode 
            ? 'bg-yellow-900/20 border-yellow-800 hover:bg-yellow-900/30' 
            : 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${
          isError ? 'bg-red-500/20' : 'bg-yellow-500/20'
        }`}>
          {isError ? (
            <AlertCircle className="w-5 h-5 text-red-500" />
          ) : (
            <Lightbulb className="w-5 h-5 text-yellow-500" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-bold ${
              isError ? 'text-red-500' : 'text-yellow-600'
            }`}>
              Line {issue.line}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full text-white ${getSeverityColor()}`}>
              {getSeverityLabel()}
            </span>
          </div>
          
          <p className={`text-sm font-medium mb-2 ${
            darkMode ? 'text-gray-100' : 'text-gray-800'
          }`}>
            {issue.message}
          </p>
          
          {issue.suggestion && (
            <div className={`p-2 rounded-lg ${
              darkMode ? 'bg-gray-900/50' : 'bg-white'
            }`}>
              <p className="text-xs text-green-500 mb-1">
                {isError ? 'Suggestion:' : 'Better approach:'}
              </p>
              <code className="text-xs font-mono text-green-600">
                {issue.suggestion}
              </code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};