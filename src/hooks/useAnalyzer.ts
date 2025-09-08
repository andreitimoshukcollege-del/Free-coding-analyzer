import { useState } from 'react';
import type { AnalysisResult, Language } from '../types';
import { CodeAnalyzer } from '../services/analyzer';

export const useAnalyzer = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const analyzeCode = async (code: string, language: Language) => {
    setIsAnalyzing(true);
    setAnalysis(null);
    
    try {
      const result = await CodeAnalyzer.analyze(code, language);
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAnalysis = () => {
    setAnalysis(null);
  };

  return {
    isAnalyzing,
    analysis,
    analyzeCode,
    clearAnalysis
  };
};