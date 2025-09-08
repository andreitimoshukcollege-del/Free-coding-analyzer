// src/components/CodeEditor/LineNumbers.tsx - SIMPLE VERSION
interface LineNumbersProps {
  lines: number;
  getIssueType: (lineNum: number) => 'error' | 'optimization' | null;
  darkMode: boolean;
}

export const LineNumbers = ({ lines, darkMode }: LineNumbersProps) => {
  // Only render up to 50 line numbers for performance
  const maxLines = Math.min(lines, 50);
  
  // Create line numbers as a single string
  const lineNumbersText = Array.from(
    { length: maxLines }, 
    (_, i) => i + 1
  ).join('\n');

  return (
    <div className={`
      px-3 py-4 text-sm font-mono select-none border-r
      ${darkMode 
        ? 'bg-gray-900/50 text-gray-500 border-gray-700' 
        : 'bg-gray-50 text-gray-400 border-gray-200'
      }
    `}>
      <pre style={{ 
        margin: 0, 
        lineHeight: '1.5rem',
        textAlign: 'right'
      }}>
        {lineNumbersText}
      </pre>
    </div>
  );
};