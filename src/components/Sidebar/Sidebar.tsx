import React, { useState } from 'react';
import FileExplorer from './FileExplorer';
import GitPanel from './GitPanel';
import { 
  Folder,
  Settings,
  GitBranch,
  Search,
  Package
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [activePanel, setActivePanel] = useState<'explorer' | 'search' | 'git' | 'extensions'>('explorer');

  return (
    <div className="h-full bg-gray-800 text-white flex flex-col">
      {/* Activity Bar */}
      <div className="w-12 bg-gray-900 border-r border-gray-700 flex flex-col items-center py-2 space-y-2">
        <button
          onClick={() => setActivePanel('explorer')}
          className={`p-2 rounded transition-colors ${
            activePanel === 'explorer'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
          title="Explorer"
        >
          <Folder size={20} />
        </button>
        <button
          onClick={() => setActivePanel('search')}
          className={`p-2 rounded transition-colors ${
            activePanel === 'search'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
          title="Search"
        >
          <Search size={20} />
        </button>
        <button
          onClick={() => setActivePanel('git')}
          className={`p-2 rounded transition-colors ${
            activePanel === 'git'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
          title="Source Control"
        >
          <GitBranch size={20} />
        </button>
        <button
          onClick={() => setActivePanel('extensions')}
          className={`p-2 rounded transition-colors ${
            activePanel === 'extensions'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
          title="Extensions"
        >
          <Package size={20} />
        </button>
      </div>

      {/* Panel Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activePanel === 'explorer' && <FileExplorer />}
        {activePanel === 'search' && (
          <div className="p-4 text-center text-gray-400">
            <Search size={48} className="mx-auto mb-4 opacity-50" />
            <p>Global search coming soon</p>
          </div>
        )}
        {activePanel === 'git' && <GitPanel />}
        {activePanel === 'extensions' && (
          <div className="p-4 text-center text-gray-400">
            <Package size={48} className="mx-auto mb-4 opacity-50" />
            <p>Extensions panel coming soon</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-center">
          <button className="p-1 hover:text-white hover:bg-gray-700 rounded">
            <Settings size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;