import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Minimize2, Square } from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error';
  content: string;
  timestamp: Date;
}

const Terminal: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: '1',
      type: 'output',
      content: 'Welcome to OWScript Terminal v1.0.0',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'output',
      content: 'Type "help" for available commands',
      timestamp: new Date()
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentPath, setCurrentPath] = useState('~/project');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const addLine = (content: string, type: 'output' | 'error' = 'output') => {
    const newLine: TerminalLine = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setLines(prev => [...prev, newLine]);
  };

  const executeCommand = (command: string) => {
    // Add command to history
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);

    // Add command line
    const commandLine: TerminalLine = {
      id: Date.now().toString(),
      type: 'command',
      content: `${currentPath} $ ${command}`,
      timestamp: new Date()
    };
    setLines(prev => [...prev, commandLine]);

    // Process command
    const args = command.trim().split(' ');
    const cmd = args[0].toLowerCase();

    switch (cmd) {
      case 'help':
        addLine('Available commands:');
        addLine('  help      - Show this help message');
        addLine('  clear     - Clear terminal');
        addLine('  ls        - List files and directories');
        addLine('  pwd       - Print working directory');
        addLine('  echo      - Echo text');
        addLine('  date      - Show current date and time');
        addLine('  whoami    - Show current user');
        addLine('  npm       - Node package manager commands');
        addLine('  git       - Git version control commands');
        break;

      case 'clear':
        setLines([]);
        break;

      case 'ls':
        addLine('src/');
        addLine('public/');
        addLine('package.json');
        addLine('README.md');
        addLine('tsconfig.json');
        break;

      case 'pwd':
        addLine(currentPath);
        break;

      case 'date':
        addLine(new Date().toString());
        break;

      case 'whoami':
        addLine('developer');
        break;

      case 'echo':
        addLine(args.slice(1).join(' '));
        break;

      case 'npm':
        if (args[1] === 'install' || args[1] === 'i') {
          addLine('Installing dependencies...');
          setTimeout(() => {
            addLine('✓ Dependencies installed successfully');
          }, 1000);
        } else if (args[1] === 'start') {
          addLine('Starting development server...');
          setTimeout(() => {
            addLine('✓ Server running on http://localhost:3000');
          }, 1000);
        } else if (args[1] === 'run') {
          addLine(`Running script: ${args[2] || 'dev'}`);
          setTimeout(() => {
            addLine('✓ Script executed successfully');
          }, 800);
        } else {
          addLine('npm: command not found or not implemented');
        }
        break;

      case 'git':
        if (args[1] === 'status') {
          addLine('On branch main');
          addLine('Your branch is up to date with \'origin/main\'.');
          addLine('');
          addLine('Changes not staged for commit:');
          addLine('  modified:   src/App.tsx');
          addLine('  modified:   src/components/CodeEditor.tsx');
        } else if (args[1] === 'add') {
          addLine(`Added ${args[2] || '.'} to staging area`);
        } else if (args[1] === 'commit') {
          addLine('Committed changes successfully');
        } else if (args[1] === 'push') {
          addLine('Pushing to origin...');
          setTimeout(() => {
            addLine('✓ Successfully pushed to origin/main');
          }, 1200);
        } else {
          addLine('git: command not found or not implemented');
        }
        break;

      case '':
        // Empty command, just add a new prompt
        break;

      default:
        addLine(`Command not found: ${cmd}`, 'error');
        addLine('Type "help" for available commands');
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim()) {
      executeCommand(currentInput);
      setCurrentInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (commandHistory.length > 0) {
          const newIndex = historyIndex === -1 
            ? commandHistory.length - 1 
            : Math.max(0, historyIndex - 1);
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (historyIndex !== -1) {
          const newIndex = historyIndex + 1;
          if (newIndex >= commandHistory.length) {
            setHistoryIndex(-1);
            setCurrentInput('');
          } else {
            setHistoryIndex(newIndex);
            setCurrentInput(commandHistory[newIndex]);
          }
        }
        break;

      case 'Tab':
        e.preventDefault();
        // Simple tab completion for common commands
        const partial = currentInput.toLowerCase();
        const commands = ['help', 'clear', 'ls', 'pwd', 'echo', 'date', 'whoami', 'npm', 'git'];
        const matches = commands.filter(cmd => cmd.startsWith(partial));
        if (matches.length === 1) {
          setCurrentInput(matches[0]);
        }
        break;
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* Terminal Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TerminalIcon size={16} className="text-green-400" />
          <span className="text-sm font-medium text-white">Terminal</span>
          <span className="text-xs text-gray-400">{currentPath}</span>
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded">
            <Minimize2 size={14} />
          </button>
          <button className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded">
            <Square size={14} />
          </button>
          <button className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm"
      >
        {lines.map((line) => (
          <div key={line.id} className="flex items-start space-x-2 mb-1">
            <span className="text-xs text-gray-500 w-20 flex-shrink-0">
              {formatTimestamp(line.timestamp)}
            </span>
            <div className="flex-1">
              <pre className={`whitespace-pre-wrap ${
                line.type === 'command' 
                  ? 'text-blue-400' 
                  : line.type === 'error' 
                    ? 'text-red-400' 
                    : 'text-green-300'
              }`}>
                {line.content}
              </pre>
            </div>
          </div>
        ))}

        {/* Current Input Line */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 w-20 flex-shrink-0">
            {formatTimestamp(new Date())}
          </span>
          <form onSubmit={handleSubmit} className="flex-1 flex items-center">
            <span className="text-blue-400 mr-2">{currentPath} $</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-green-300 focus:outline-none font-mono"
              autoFocus
              autoComplete="off"
              spellCheck={false}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Terminal;