import React, { createContext, useContext, useState, useCallback } from 'react';

interface FileTab {
  id: string;
  name: string;
  content: string;
  language: string;
  modified: boolean;
  path: string;
}

interface Project {
  id: string;
  name: string;
  files: FileTab[];
  activeFileId: string | null;
}

interface IDEContextType {
  projects: Project[];
  activeProject: Project | null;
  activeFile: FileTab | null;
  isTerminalOpen: boolean;
  isSplitScreen: boolean;
  fontSize: number;
  createProject: (name: string) => void;
  openProject: (projectId: string) => void;
  createFile: (name: string, language: string, path?: string) => void;
  openFile: (fileId: string) => void;
  updateFileContent: (fileId: string, content: string) => void;
  closeFile: (fileId: string) => void;
  deleteFile: (fileId: string) => void;
  renameFile: (fileId: string, newName: string) => void;
  createFolder: (name: string, path: string) => void;
  deleteFolder: (path: string) => void;
  renameFolder: (path: string, newName: string) => void;
  toggleTerminal: () => void;
  toggleSplitScreen: () => void;
  setFontSize: (size: number) => void;
}

const IDEContext = createContext<IDEContextType | undefined>(undefined);

export const IDEProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isSplitScreen, setIsSplitScreen] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  const activeProject = projects.find(p => p.id === activeProjectId) || null;
  const activeFile = activeProject?.files.find(f => f.id === activeProject.activeFileId) || null;

  const createProject = useCallback((name: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      files: [{
        id: 'welcome',
        name: 'welcome.js',
        content: `// Welcome to OWScript IDE!\n// Start coding your next amazing project here.\n\nconsole.log('Hello, OWScript!');`,
        language: 'javascript',
        modified: false,
        path: '/welcome.js'
      }],
      activeFileId: 'welcome'
    };
    setProjects(prev => [...prev, newProject]);
    setActiveProjectId(newProject.id);
  }, []);

  const openProject = useCallback((projectId: string) => {
    setActiveProjectId(projectId);
  }, []);

  const createFile = useCallback((name: string, language: string, path?: string) => {
    if (!activeProject) return;

    const newFile: FileTab = {
      id: Date.now().toString(),
      name,
      content: '',
      language,
      modified: false,
      path: path || `/${name}`
    };

    setProjects(prev => prev.map(p => 
      p.id === activeProject.id 
        ? { ...p, files: [...p.files, newFile], activeFileId: newFile.id }
        : p
    ));
  }, [activeProject]);

  const deleteFile = useCallback((fileId: string) => {
    if (!activeProject) return;

    const fileToDelete = activeProject.files.find(f => f.id === fileId);
    if (!fileToDelete) return;

    const remainingFiles = activeProject.files.filter(f => f.id !== fileId);
    const newActiveFileId = activeProject.activeFileId === fileId 
      ? (remainingFiles.length > 0 ? remainingFiles[0].id : null)
      : activeProject.activeFileId;

    setProjects(prev => prev.map(p => 
      p.id === activeProject.id 
        ? { ...p, files: remainingFiles, activeFileId: newActiveFileId }
        : p
    ));
  }, [activeProject]);

  const renameFile = useCallback((fileId: string, newName: string) => {
    if (!activeProject) return;

    setProjects(prev => prev.map(p => 
      p.id === activeProject.id 
        ? {
            ...p,
            files: p.files.map(f => 
              f.id === fileId 
                ? { ...f, name: newName, modified: true }
                : f
            )
          }
        : p
    ));
  }, [activeProject]);

  const createFolder = useCallback((name: string, path: string) => {
    // In a real implementation, this would create a folder structure
    console.log(`Creating folder: ${name} at ${path}`);
  }, []);

  const deleteFolder = useCallback((path: string) => {
    if (!activeProject) return;

    // Remove all files in the folder
    const filesToKeep = activeProject.files.filter(f => !f.path.startsWith(path));
    const newActiveFileId = filesToKeep.find(f => f.id === activeProject.activeFileId)
      ? activeProject.activeFileId
      : (filesToKeep.length > 0 ? filesToKeep[0].id : null);

    setProjects(prev => prev.map(p => 
      p.id === activeProject.id 
        ? { ...p, files: filesToKeep, activeFileId: newActiveFileId }
        : p
    ));
  }, [activeProject]);

  const renameFolder = useCallback((path: string, newName: string) => {
    if (!activeProject) return;

    // Update all file paths in the folder
    const pathParts = path.split('/').filter(part => part);
    const parentPath = pathParts.slice(0, -1).join('/');
    const newPath = parentPath ? `/${parentPath}/${newName}/` : `/${newName}/`;

    setProjects(prev => prev.map(p => 
      p.id === activeProject.id 
        ? {
            ...p,
            files: p.files.map(f => 
              f.path.startsWith(path)
                ? { ...f, path: f.path.replace(path, newPath), modified: true }
                : f
            )
          }
        : p
    ));
  }, [activeProject]);

  const openFile = useCallback((fileId: string) => {
    if (!activeProject) return;
    
    setProjects(prev => prev.map(p => 
      p.id === activeProject.id 
        ? { ...p, activeFileId: fileId }
        : p
    ));
  }, [activeProject]);

  const updateFileContent = useCallback((fileId: string, content: string) => {
    setProjects(prev => prev.map(p => ({
      ...p,
      files: p.files.map(f => 
        f.id === fileId 
          ? { ...f, content, modified: true }
          : f
      )
    })));
  }, []);

  const closeFile = useCallback((fileId: string) => {
    if (!activeProject) return;

    const remainingFiles = activeProject.files.filter(f => f.id !== fileId);
    const newActiveFileId = remainingFiles.length > 0 ? remainingFiles[0].id : null;

    setProjects(prev => prev.map(p => 
      p.id === activeProject.id 
        ? { ...p, files: remainingFiles, activeFileId: newActiveFileId }
        : p
    ));
  }, [activeProject]);

  const toggleTerminal = useCallback(() => {
    setIsTerminalOpen(prev => !prev);
  }, []);

  const toggleSplitScreen = useCallback(() => {
    setIsSplitScreen(prev => !prev);
  }, []);

  // Initialize with a sample project
  React.useEffect(() => {
    if (projects.length === 0) {
      createProject('My First Project');
    }
  }, [projects.length, createProject]);

  return (
    <IDEContext.Provider value={{
      projects,
      activeProject,
      activeFile,
      isTerminalOpen,
      isSplitScreen,
      fontSize,
      createProject,
      openProject,
      createFile,
      openFile,
      updateFileContent,
      closeFile,
      deleteFile,
      renameFile,
      createFolder,
      deleteFolder,
      renameFolder,
      toggleTerminal,
      toggleSplitScreen,
      setFontSize,
    }}>
      {children}
    </IDEContext.Provider>
  );
};

export const useIDE = () => {
  const context = useContext(IDEContext);
  if (!context) {
    throw new Error('useIDE must be used within an IDEProvider');
  }
  return context;
};