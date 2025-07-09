import React, { useState, useRef, useEffect } from 'react';
import { useIDE } from '../../contexts/IDEContext';
import MonacoEditor from './MonacoEditor';
import { 
  X, 
  MoreHorizontal, 
  Type,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

const CodeEditor: React.FC = () => {
  const { 
    activeProject, 
    activeFile, 
    closeFile, 
    openFile,
    fontSize,
    setFontSize
  } = useIDE();
  

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* Tab Bar */}
      {activeProject && activeProject.files.length > 0 && (
        <div className="bg-gray-800 border-b border-gray-700 flex overflow-x-auto">
          {activeProject.files.map((file) => (
            <div
              key={file.id}
              className={`flex items-center space-x-2 px-4 py-2 border-r border-gray-700 cursor-pointer min-w-0 ${
                activeFile?.id === file.id
                  ? 'bg-gray-900 text-white border-b-2 border-blue-400'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
              onClick={() => openFile(file.id)}
            >
              <span className="text-sm truncate max-w-32">
                {file.name}
                {file.modified && <span className="text-orange-400 ml-1">●</span>}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeFile(file.id);
                }}
                className="p-1 hover:bg-gray-600 rounded"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Editor Actions */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setFontSize(Math.max(10, fontSize - 1))}
              className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
              title="Decrease Font Size"
            >
              <ZoomOut size={14} />
            </button>
            <span className="text-xs text-gray-400 px-2">{fontSize}px</span>
            <button
              onClick={() => setFontSize(Math.min(24, fontSize + 1))}
              className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
              title="Increase Font Size"
            >
              <ZoomIn size={14} />
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400">
            {activeFile ? `${activeFile.language} • ${activeFile.content.split('\n').length} lines` : ''}
          </span>
          <button className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>


      {/* Editor Content */}
      <MonacoEditor />
    </div>
  );
};

export default CodeEditor;