import React, { useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import CodeEditor from './CodeEditor/CodeEditor';
import Terminal from './Terminal/Terminal';
import TopBar from './TopBar/TopBar';
import { useIDE } from '../contexts/IDEContext';
import { Menu, X } from 'lucide-react';

const MainIDE: React.FC = () => {
  const { isTerminalOpen, isSplitScreen } = useIDE();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <TopBar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {isMobile && isSidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <div className={`
          ${isMobile ? 'fixed' : 'relative'} 
          ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          ${isMobile ? 'z-50 w-80' : 'w-64'}
          transition-transform duration-300 ease-in-out
          bg-gray-800 border-r border-gray-700
        `}>
          <Sidebar />
          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="fixed top-20 left-4 z-30 p-2 bg-gray-800 rounded-lg shadow-lg text-white"
            >
              <Menu size={20} />
            </button>
          )}

          {/* Editor Area */}
          <div className={`flex-1 ${isSplitScreen ? 'flex' : ''} overflow-hidden`}>
            <div className={`${isSplitScreen ? 'w-1/2 border-r border-gray-700' : 'w-full'}`}>
              <CodeEditor />
            </div>
            {isSplitScreen && (
              <div className="w-1/2">
                <div className="h-full bg-gray-900 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📱</div>
                    <p>Preview Panel</p>
                    <p className="text-sm mt-2">Your app preview will appear here</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Terminal */}
          {isTerminalOpen && (
            <div className="h-64 border-t border-gray-700">
              <Terminal />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainIDE;