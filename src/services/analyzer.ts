// src/services/analyzer.ts

import type { AnalysisResult, Language, Issue, IssueType, Severity } from '../types';

interface AnalysisPattern {
  pattern: RegExp;
  type: IssueType;
  message: string;
  suggestion: string;
  severity: Severity;
  requiresNoNullCheck?: boolean;
}

export class CodeAnalyzer {
  private static pythonPatterns: AnalysisPattern[] = [
    {
      pattern: /return\s+\w+\s*\/\s*\w+/,
      type: 'error',
      message: 'Potential ZeroDivisionError: Division by zero not handled',
      suggestion: 'Add a check: if b != 0: return a / b',
      severity: 'high'
    },
    {
      pattern: /for\s+\w+\s+in\s+range\(len\(/,
      type: 'optimization',
      message: 'Use enumerate() or iterate directly over the list',
      suggestion: 'for i, item in enumerate(numbers): ...',
      severity: 'medium'
    },
    {
      pattern: /\w+\s*=\s*\w+\s*\+/,
      type: 'optimization',
      message: 'Use += operator for better readability',
      suggestion: 'total += value',
      severity: 'low'
    }
  ];

  private static javaPatterns: AnalysisPattern[] = [
    {
      pattern: /String\s+\w+\s*=\s*"[^"]*";\s*[\s\S]*?\w+\s*=\s*\w+\s*\+/,
      type: 'optimization',
      message: 'Use StringBuilder for string concatenation in loops',
      suggestion: 'StringBuilder sb = new StringBuilder();\nsb.append(words[i]);',
      severity: 'high'
    },
    {
      pattern: /(\w+)\.length\(\)/,
      type: 'error',
      message: 'Potential NullPointerException: parameter not null-checked',
      suggestion: 'Add null check: if (text != null) { return text.length(); }',
      severity: 'high',
      requiresNoNullCheck: true
    },
    {
      pattern: /new ArrayList<\w+>\(\)/,
      type: 'optimization',
      message: 'Initialize ArrayList with capacity for better performance',
      suggestion: 'new ArrayList<>(initialCapacity)',
      severity: 'medium'
    }
  ];

  private static javascriptPatterns: AnalysisPattern[] = [
    {
      pattern: /for\s*\(\s*let\s+\w+\s*=\s*0;\s*\w+\s*<\s*\w+\.length/,
      type: 'optimization',
      message: 'Consider using for...of loop or array methods',
      suggestion: 'for (const item of array) { ... }',
      severity: 'low'
    },
    {
      pattern: /document\.getElementById/,
      type: 'optimization',
      message: 'Consider caching DOM queries',
      suggestion: 'const element = document.getElementById(...); // reuse element',
      severity: 'medium'
    }
  ];

  private static typescriptPatterns: AnalysisPattern[] = [
    {
      pattern: /any/,
      type: 'optimization',
      message: 'Avoid using "any" type - use specific types instead',
      suggestion: 'Use unknown, specific types, or generics',
      severity: 'high'
    },
    {
      pattern: /\w+\s*&&\s*\w+\.\w+\s*&&\s*\w+\.\w+\.\w+/,
      type: 'optimization',
      message: 'Use optional chaining for cleaner code',
      suggestion: 'obj?.property?.nestedProperty',
      severity: 'low'
    }
  ];

  static async analyze(code: string, language: Language): Promise<AnalysisResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const result: AnalysisResult = {
      errors: [],
      optimizations: []
    };

    if (!code.trim()) {
      return result;
    }

    const lines = code.split('\n');
    const patterns = language === 'python' ? this.pythonPatterns : 
                    language === 'java' ? this.javaPatterns :
                    language === 'javascript' ? this.javascriptPatterns :
                    this.typescriptPatterns;

    patterns.forEach(pattern => {
      lines.forEach((line, index) => {
        if (pattern.pattern.test(line)) {
          // Special handling for Java null check
          if (pattern.requiresNoNullCheck && code.includes('!= null')) {
            return;
          }

          const issue: Issue = {
            type: pattern.type,
            line: index + 1,
            message: pattern.message,
            suggestion: pattern.suggestion,
            severity: pattern.severity
          };

          if (pattern.type === 'error') {
            result.errors.push(issue);
          } else {
            result.optimizations.push(issue);
          }
        }
      });
    });

    // Check for nested loops (O(n²) complexity) in Python
    if (language === 'python') {
      const nestedLoopRegex = /for\s+\w+\s+in\s+range\(len\((\w+)\)\):[\s\S]*?for\s+\w+\s+in\s+range\(len\(\1\)\):/;
      if (nestedLoopRegex.test(code)) {
        result.optimizations.push({
          type: 'optimization',
          line: code.split('\n').findIndex(line => line.includes('for i in range(len(')) + 1,
          message: 'O(n²) complexity - Consider using a set for O(n) duplicate detection',
          suggestion: 'return len(lst) != len(set(lst))',
          severity: 'high'
        });
      }
    }

    return result;
  }
}