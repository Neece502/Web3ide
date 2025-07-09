import React from 'react';
import { IDEProvider } from './contexts/IDEContext';
import { ThemeProvider } from './contexts/ThemeContext';
import MainIDE from './components/MainIDE';

function App() {
  return (
    <ThemeProvider>
      <IDEProvider>
        <div className="h-screen overflow-hidden bg-gray-900 text-white">
          <MainIDE />
        </div>
      </IDEProvider>
    </ThemeProvider>
  );
}

export default App;