import React, { useState } from 'react';
import { useIDE } from '../../contexts/IDEContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Play, 
  Save, 
  Settings, 
  Terminal, 
  Split,
  Palette,
  Plus,
  Folder,
  Code
} from 'lucide-react';

const TopBar: React.FC = () => {
  const { 
    activeProject, 
    activeFile, 
    toggleTerminal, 
    toggleSplitScreen,
    isTerminalOpen,
    isSplitScreen,
    createFile,
    createProject
  } = useIDE();
  const { theme, setTheme, themes } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showNewMenu, setShowNewMenu] = useState(false);

  const handleSave = () => {
    if (activeFile) {
      // Simulate save operation
      console.log(`Saving ${activeFile.name}...`);
    }
  };

  const handleRun = () => {
    if (activeFile) {
      console.log(`Running ${activeFile.name}...`);
    }
  };

  const handleNewFile = () => {
    const fileName = prompt('File name (with extension):');
    if (fileName) {
      const extension = fileName.split('.').pop()?.toLowerCase();
      const language = getLanguageFromExtension(extension || '');
      createFile(fileName, language);
    }
    setShowNewMenu(false);
  };

  const handleNewProject = () => {
    const projectName = prompt('Project name:');
    if (projectName) {
      createProject(projectName);
    }
    setShowNewMenu(false);
  };

  const getLanguageFromExtension = (ext: string): string => {
    const languageMap: { [key: string]: string } = {
      'js': 'javascript',
      'jsx': 'javascriptreact',
      'ts': 'typescript',
      'tsx': 'typescriptreact',
      'py': 'python',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'md': 'markdown',
    };
    return languageMap[ext] || 'plaintext';
  };

  return (
    <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 relative">
      {/* Left Side - Logo and Project */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Code className="text-blue-400" size={24} />
          <span className="font-bold text-xl text-white">OWScript</span>
        </div>
        {activeProject && (
          <div className="hidden sm:flex items-center space-x-2 text-gray-300">
            <Folder size={16} />
            <span className="text-sm">{activeProject.name}</span>
          </div>
        )}
      </div>

      {/* Center - Action Buttons */}
      <div className="flex items-center space-x-2">
        <div className="relative">
          <button
            onClick={() => setShowNewMenu(!showNewMenu)}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="New..."
          >
            <Plus size={20} />
          </button>
          {showNewMenu && (
            <div className="absolute top-full mt-2 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 min-w-[150px] z-50">
              <button
                onClick={handleNewFile}
                className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              >
                New File
              </button>
              <button
                onClick={handleNewProject}
                className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              >
                New Project
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          title="Save"
          disabled={!activeFile}
        >
          <Save size={20} />
        </button>

        <button
          onClick={handleRun}
          className="p-2 text-green-400 hover:text-green-300 hover:bg-gray-700 rounded-lg transition-colors"
          title="Run"
          disabled={!activeFile}
        >
          <Play size={20} />
        </button>

        <button
          onClick={toggleSplitScreen}
          className={`p-2 rounded-lg transition-colors ${
            isSplitScreen 
              ? 'text-blue-400 bg-gray-700' 
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
          title="Toggle Split Screen"
        >
          <Split size={20} />
        </button>

        <button
          onClick={toggleTerminal}
          className={`p-2 rounded-lg transition-colors ${
            isTerminalOpen 
              ? 'text-blue-400 bg-gray-700' 
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
          title="Toggle Terminal"
        >
          <Terminal size={20} />
        </button>
      </div>

      {/* Right Side - Theme and Settings */}
      <div className="flex items-center space-x-2">
        <div className="relative">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="Change Theme"
          >
            <Palette size={20} />
          </button>
          {showThemeMenu && (
            <div className="absolute top-full mt-2 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 min-w-[120px] z-50">
              {Object.keys(themes).map((themeName) => (
                <button
                  key={themeName}
                  onClick={() => {
                    setTheme(themeName as any);
                    setShowThemeMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 transition-colors capitalize ${
                    theme === themeName
                      ? 'text-blue-400 bg-gray-700'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {themeName}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          title="Settings"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Click outside handlers */}
      {(showThemeMenu || showNewMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowThemeMenu(false);
            setShowNewMenu(false);
          }} 
        />
      )}
    </div>
  );
};

export default TopBar;