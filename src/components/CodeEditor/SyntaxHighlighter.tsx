import React from 'react';
import { getLanguageById } from '../../utils/languages';

interface SyntaxHighlighterProps {
  code: string;
  language: string;
  fontSize: number;
}

const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = ({ code, language, fontSize }) => {
  const langConfig = getLanguageById(language);

  const highlightCode = (code: string, keywords: string[]) => {
    let highlighted = code;

    // Comments
    if (language === 'solidity' || language === 'javascript' || language === 'typescript') {
      highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span class="text-gray-500">$1</span>');
      highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500">$1</span>');
    } else if (language === 'vyper' || language === 'python') {
      highlighted = highlighted.replace(/(#.*$)/gm, '<span class="text-gray-500">$1</span>');
    } else if (language === 'rust') {
      highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span class="text-gray-500">$1</span>');
      highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500">$1</span>');
    }

    // Strings
    highlighted = highlighted.replace(/(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="text-green-400">$1$2$1</span>');

    // Numbers
    highlighted = highlighted.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="text-blue-300">$1</span>');

    // Keywords
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span class="text-purple-400">${keyword}</span>`);
    });

    // Special Solidity highlighting
    if (language === 'solidity') {
      // Address literals
      highlighted = highlighted.replace(/\b0x[a-fA-F0-9]{40}\b/g, '<span class="text-yellow-300">$&</span>');
      // Pragma statements
      highlighted = highlighted.replace(/(pragma\s+solidity\s+[^;]+;)/g, '<span class="text-pink-400">$1</span>');
      // Function modifiers
      highlighted = highlighted.replace(/\b(public|private|internal|external|view|pure|payable|nonpayable)\b/g, '<span class="text-cyan-400">$1</span>');
      // Types
      highlighted = highlighted.replace(/\b(uint256|uint|int256|int|address|bool|string|bytes32|bytes)\b/g, '<span class="text-orange-400">$1</span>');
    }

    // Special Rust highlighting
    if (language === 'rust') {
      // Macros
      highlighted = highlighted.replace(/\b(\w+!)/g, '<span class="text-yellow-400">$1</span>');
      // Lifetimes
      highlighted = highlighted.replace(/('[a-zA-Z_][a-zA-Z0-9_]*)/g, '<span class="text-pink-400">$1</span>');
      // Types
      highlighted = highlighted.replace(/\b(u8|u16|u32|u64|u128|i8|i16|i32|i64|i128|f32|f64|usize|isize|bool|char|str)\b/g, '<span class="text-orange-400">$1</span>');
    }

    // Special TypeScript/JavaScript highlighting
    if (language === 'typescript' || language === 'javascript') {
      // Types (TypeScript)
      if (language === 'typescript') {
        highlighted = highlighted.replace(/\b(string|number|boolean|object|any|void|never|unknown)\b/g, '<span class="text-orange-400">$1</span>');
      }
      // Template literals
      highlighted = highlighted.replace(/(`[^`]*`)/g, '<span class="text-green-300">$1</span>');
    }

    return highlighted;
  };

  return (
    <div 
      className="absolute inset-0 p-4 pointer-events-none font-mono whitespace-pre-wrap overflow-hidden"
      style={{ 
        fontSize: `${fontSize}px`, 
        lineHeight: '1.5',
        color: 'transparent'
      }}
      dangerouslySetInnerHTML={{
        __html: highlightCode(code, langConfig.keywords)
      }}
    />
  );
};

export default SyntaxHighlighter;