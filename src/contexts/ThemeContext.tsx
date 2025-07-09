import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light' | 'ocean' | 'forest';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: Record<Theme, any>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');

  const themes = {
    dark: {
      primary: 'bg-gray-900',
      secondary: 'bg-gray-800',
      accent: 'bg-blue-600',
      text: 'text-white',
      textSecondary: 'text-gray-300',
      border: 'border-gray-700',
    },
    light: {
      primary: 'bg-white',
      secondary: 'bg-gray-100',
      accent: 'bg-blue-600',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      border: 'border-gray-300',
    },
    ocean: {
      primary: 'bg-slate-900',
      secondary: 'bg-slate-800',
      accent: 'bg-cyan-600',
      text: 'text-cyan-100',
      textSecondary: 'text-slate-300',
      border: 'border-slate-700',
    },
    forest: {
      primary: 'bg-green-900',
      secondary: 'bg-green-800',
      accent: 'bg-emerald-600',
      text: 'text-green-100',
      textSecondary: 'text-green-300',
      border: 'border-green-700',
    },
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('owscript-theme') as Theme;
    if (savedTheme && themes[savedTheme]) {
      setTheme(savedTheme);
    }
  }, []);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('owscript-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};