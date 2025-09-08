// src/types/index.ts

export type Language = 'python' | 'java' | 'javascript' | 'typescript';
export type Severity = 'high' | 'medium' | 'low';
export type IssueType = 'error' | 'optimization';

export interface Issue {
  type: IssueType;
  line: number;
  column?: number;
  message: string;
  suggestion?: string;
  severity: Severity;
}

export interface AnalysisResult {
  errors: Issue[];
  optimizations: Issue[];
}

export interface CodeSample {
  python: string;
  java: string;
  javascript: string;
  typescript: string;
}