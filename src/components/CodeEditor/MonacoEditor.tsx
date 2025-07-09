import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useIDE } from '../../contexts/IDEContext';
import { useTheme } from '../../contexts/ThemeContext';

interface MonacoEditorProps {
  onMount?: (editor: any, monaco: any) => void;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({ onMount }) => {
  const { activeFile, updateFileContent, fontSize } = useIDE();
  const { theme } = useTheme();
  const editorRef = useRef<any>(null);

  const getMonacoTheme = () => {
    switch (theme) {
      case 'light':
        return 'light';
      case 'ocean':
        return 'vs-dark';
      case 'forest':
        return 'vs-dark';
      default:
        return 'vs-dark';
    }
  };

  const getLanguageFromExtension = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'sol': 'solidity',
      'rs': 'rust',
      'vy': 'python', // Vyper uses Python syntax
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'json': 'json',
      'md': 'markdown',
      'yaml': 'yaml',
      'yml': 'yaml',
      'xml': 'xml',
      'sql': 'sql',
      'sh': 'shell',
      'bash': 'shell',
      'dockerfile': 'dockerfile',
      'go': 'go',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'php': 'php',
      'rb': 'ruby',
      'swift': 'swift',
      'kt': 'kotlin',
      'dart': 'dart',
    };
    return languageMap[ext || ''] || 'plaintext';
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Configure editor options
    editor.updateOptions({
      fontSize: fontSize,
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
      lineHeight: 1.5,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'on',
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      parameterHints: { enabled: true },
      formatOnPaste: true,
      formatOnType: true,
    });

    // Add custom keybindings
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Save file
      console.log('Save triggered');
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
      editor.getAction('actions.find').run();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
      editor.getAction('editor.action.startFindReplaceAction').run();
    });

    // Register Solidity language if not already registered
    if (!monaco.languages.getLanguages().find((lang: any) => lang.id === 'solidity')) {
      monaco.languages.register({ id: 'solidity' });
      
      monaco.languages.setMonarchTokensProvider('solidity', {
        tokenizer: {
          root: [
            [/pragma\s+solidity/, 'keyword'],
            [/contract|interface|library|struct|enum|event|modifier|function|constructor|fallback|receive/, 'keyword'],
            [/public|private|internal|external|view|pure|payable|constant|immutable/, 'keyword'],
            [/uint256|uint|int256|int|address|bool|string|bytes32|bytes|mapping/, 'type'],
            [/require|assert|revert|emit|return/, 'keyword'],
            [/if|else|for|while|do|break|continue|try|catch/, 'keyword'],
            [/[a-zA-Z_]\w*/, 'identifier'],
            [/".*?"/, 'string'],
            [/'.*?'/, 'string'],
            [/\/\/.*$/, 'comment'],
            [/\/\*[\s\S]*?\*\//, 'comment'],
            [/\d+/, 'number'],
          ]
        }
      });
    }

    if (onMount) {
      onMount(editor, monaco);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (activeFile && value !== undefined) {
      updateFileContent(activeFile.id, value);
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({ fontSize });
    }
  }, [fontSize]);

  if (!activeFile) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-lg mb-2">Welcome to OWScript IDE</p>
          <p className="text-sm">Open a file to start coding</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-900">
      <Editor
        height="100%"
        language={getLanguageFromExtension(activeFile.name)}
        value={activeFile.content}
        theme={getMonacoTheme()}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
          cursorStyle: 'line',
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default MonacoEditor;