import React, { useState } from 'react';
import { useIDE } from '../../contexts/IDEContext';
import { 
  Folder,
  File,
  FolderOpen,
  Plus,
  X,
  ChevronRight,
  ChevronDown,
  Code,
  FileText,
  Database,
  Layers,
  MoreHorizontal,
  Edit3,
  Trash2,
  Copy,
  FolderPlus
} from 'lucide-react';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  modified?: boolean;
  language?: string;
}

const FileExplorer: React.FC = () => {
  const { 
    activeProject, 
    activeFile, 
    openFile, 
    closeFile, 
    createFile, 
    deleteFile,
    renameFile,
    createFolder,
    deleteFolder,
    renameFolder
  } = useIDE();
  
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/']));
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    node: FileNode;
    type: 'file' | 'folder';
  } | null>(null);
  const [renamingNode, setRenamingNode] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return <Code size={16} className="text-yellow-400" />;
      case 'py':
      case 'vy':
        return <Code size={16} className="text-blue-400" />;
      case 'sol':
        return <Code size={16} className="text-purple-400" />;
      case 'rs':
        return <Code size={16} className="text-orange-400" />;
      case 'json':
        return <Database size={16} className="text-green-400" />;
      case 'css':
      case 'scss':
        return <Layers size={16} className="text-blue-400" />;
      case 'html':
        return <Code size={16} className="text-red-400" />;
      case 'md':
        return <FileText size={16} className="text-gray-400" />;
      default:
        return <FileText size={16} className="text-gray-400" />;
    }
  };

  const buildFileTree = (): FileNode[] => {
    if (!activeProject) return [];

    const tree: FileNode[] = [];
    const folderMap = new Map<string, FileNode>();

    // Create root folder
    const rootFolder: FileNode = {
      id: '/',
      name: activeProject.name,
      type: 'folder',
      path: '/',
      children: []
    };
    tree.push(rootFolder);
    folderMap.set('/', rootFolder);

    // Add files to the tree
    activeProject.files.forEach(file => {
      const pathParts = file.path.split('/').filter(part => part);
      let currentPath = '/';
      let currentFolder = rootFolder;

      // Create intermediate folders if they don't exist
      for (let i = 0; i < pathParts.length - 1; i++) {
        const folderName = pathParts[i];
        currentPath += folderName + '/';
        
        if (!folderMap.has(currentPath)) {
          const newFolder: FileNode = {
            id: currentPath,
            name: folderName,
            type: 'folder',
            path: currentPath,
            children: []
          };
          currentFolder.children!.push(newFolder);
          folderMap.set(currentPath, newFolder);
        }
        currentFolder = folderMap.get(currentPath)!;
      }

      // Add the file
      const fileNode: FileNode = {
        id: file.id,
        name: file.name,
        type: 'file',
        path: file.path,
        modified: file.modified,
        language: file.language
      };
      currentFolder.children!.push(fileNode);
    });

    return tree;
  };

  const handleContextMenu = (e: React.MouseEvent, node: FileNode) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      node,
      type: node.type
    });
  };

  const handleCreateFile = (folderPath: string) => {
    const fileName = prompt('Enter file name with extension:');
    if (fileName) {
      const extension = fileName.split('.').pop()?.toLowerCase();
      const languageMap: { [key: string]: string } = {
        'js': 'javascript',
        'jsx': 'javascriptreact',
        'ts': 'typescript',
        'tsx': 'typescriptreact',
        'py': 'python',
        'sol': 'solidity',
        'rs': 'rust',
        'vy': 'vyper',
        'html': 'html',
        'css': 'css',
        'json': 'json',
        'md': 'markdown',
      };
      const language = languageMap[extension || ''] || 'plaintext';
      const fullPath = folderPath === '/' ? `/${fileName}` : `${folderPath}${fileName}`;
      createFile(fileName, language, fullPath);
    }
    setContextMenu(null);
  };

  const handleCreateFolder = (parentPath: string) => {
    const folderName = prompt('Enter folder name:');
    if (folderName) {
      const fullPath = parentPath === '/' ? `/${folderName}/` : `${parentPath}${folderName}/`;
      createFolder(folderName, fullPath);
    }
    setContextMenu(null);
  };

  const handleRename = (node: FileNode) => {
    setRenamingNode(node.id);
    setRenameValue(node.name);
    setContextMenu(null);
  };

  const handleRenameSubmit = (node: FileNode) => {
    if (renameValue.trim() && renameValue !== node.name) {
      if (node.type === 'file') {
        renameFile(node.id, renameValue.trim());
      } else {
        renameFolder(node.path, renameValue.trim());
      }
    }
    setRenamingNode(null);
    setRenameValue('');
  };

  const handleDelete = (node: FileNode) => {
    const confirmMessage = node.type === 'file' 
      ? `Are you sure you want to delete "${node.name}"?`
      : `Are you sure you want to delete folder "${node.name}" and all its contents?`;
    
    if (confirm(confirmMessage)) {
      if (node.type === 'file') {
        deleteFile(node.id);
      } else {
        deleteFolder(node.path);
      }
    }
    setContextMenu(null);
  };

  const renderFileNode = (node: FileNode, depth: number = 0): React.ReactNode => {
    const isExpanded = expandedFolders.has(node.id);
    const isActive = activeFile?.id === node.id;
    const isRenaming = renamingNode === node.id;

    return (
      <div key={node.id}>
        <div
          className={`flex items-center space-x-2 p-2 rounded cursor-pointer group transition-colors ${
            isActive && node.type === 'file'
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-700'
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.id);
            } else {
              openFile(node.id);
            }
          }}
          onContextMenu={(e) => handleContextMenu(e, node)}
        >
          {node.type === 'folder' && (
            <>
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
              {isExpanded ? (
                <FolderOpen size={16} className="text-blue-400" />
              ) : (
                <Folder size={16} className="text-blue-400" />
              )}
            </>
          )}
          
          {node.type === 'file' && getFileIcon(node.name)}
          
          {isRenaming ? (
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={() => handleRenameSubmit(node)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRenameSubmit(node);
                } else if (e.key === 'Escape') {
                  setRenamingNode(null);
                  setRenameValue('');
                }
              }}
              className="flex-1 bg-gray-600 text-white px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoFocus
            />
          ) : (
            <span className="text-sm flex-1 truncate">
              {node.name}
              {node.modified && <span className="text-orange-400 ml-1">●</span>}
            </span>
          )}

          {!isRenaming && node.type === 'file' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeFile(node.id);
              }}
              className="p-1 text-gray-400 hover:text-white hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100"
              title="Close File"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {node.type === 'folder' && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderFileNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const fileTree = buildFileTree();

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {fileTree.map(node => renderFileNode(node))}
        
        {activeProject && activeProject.files.length === 0 && (
          <div className="text-gray-400 text-sm p-4 text-center">
            <div className="mb-4">
              <Folder size={48} className="mx-auto mb-2 opacity-50" />
              <p>No files yet</p>
            </div>
            <button
              onClick={() => handleCreateFile('/')}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Create your first file
            </button>
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setContextMenu(null)}
          />
          <div
            className="fixed bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 z-50 min-w-[180px]"
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
            }}
          >
            {contextMenu.type === 'folder' ? (
              <>
                <button
                  onClick={() => handleCreateFile(contextMenu.node.path)}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <Plus size={14} />
                  <span>New File</span>
                </button>
                <button
                  onClick={() => handleCreateFolder(contextMenu.node.path)}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <FolderPlus size={14} />
                  <span>New Folder</span>
                </button>
                <hr className="border-gray-700 my-1" />
                <button
                  onClick={() => handleRename(contextMenu.node)}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <Edit3 size={14} />
                  <span>Rename</span>
                </button>
                {contextMenu.node.path !== '/' && (
                  <button
                    onClick={() => handleDelete(contextMenu.node)}
                    className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700 transition-colors flex items-center space-x-2"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => openFile(contextMenu.node.id)}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <File size={14} />
                  <span>Open</span>
                </button>
                <button
                  onClick={() => handleRename(contextMenu.node)}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <Edit3 size={14} />
                  <span>Rename</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(contextMenu.node.path);
                    setContextMenu(null);
                  }}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <Copy size={14} />
                  <span>Copy Path</span>
                </button>
                <hr className="border-gray-700 my-1" />
                <button
                  onClick={() => handleDelete(contextMenu.node)}
                  className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FileExplorer;