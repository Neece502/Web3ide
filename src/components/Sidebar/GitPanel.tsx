import React, { useState } from 'react';
import { useIDE } from '../../contexts/IDEContext';
import { 
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  Plus,
  Minus,
  RefreshCw,
  Upload,
  Download,
  Check,
  X,
  Circle,
  Square,
  ChevronRight,
  ChevronDown,
  Eye,
  History,
  User,
  Calendar,
  Hash
} from 'lucide-react';

interface GitFile {
  path: string;
  status: 'modified' | 'added' | 'deleted' | 'renamed' | 'untracked';
  staged: boolean;
}

interface GitCommit {
  hash: string;
  message: string;
  author: string;
  date: Date;
  files: string[];
}

interface GitBranch {
  name: string;
  current: boolean;
  remote?: string;
}

const GitPanel: React.FC = () => {
  const { activeProject } = useIDE();
  const [activeTab, setActiveTab] = useState<'changes' | 'history' | 'branches'>('changes');
  const [commitMessage, setCommitMessage] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['staged', 'unstaged']));
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  // Mock data - in a real implementation, this would come from Git
  const [gitFiles] = useState<GitFile[]>([
    { path: 'src/App.tsx', status: 'modified', staged: false },
    { path: 'src/components/CodeEditor.tsx', status: 'modified', staged: true },
    { path: 'src/utils/newFile.ts', status: 'added', staged: false },
    { path: 'README.md', status: 'modified', staged: false },
    { path: 'package.json', status: 'modified', staged: true },
  ]);

  const [gitCommits] = useState<GitCommit[]>([
    {
      hash: 'a1b2c3d',
      message: 'Add Monaco Editor integration',
      author: 'Developer',
      date: new Date(Date.now() - 3600000),
      files: ['src/components/CodeEditor.tsx', 'package.json']
    },
    {
      hash: 'e4f5g6h',
      message: 'Implement file explorer with context menu',
      author: 'Developer',
      date: new Date(Date.now() - 7200000),
      files: ['src/components/Sidebar/FileExplorer.tsx']
    },
    {
      hash: 'i7j8k9l',
      message: 'Initial commit',
      author: 'Developer',
      date: new Date(Date.now() - 86400000),
      files: ['src/App.tsx', 'package.json', 'README.md']
    }
  ]);

  const [gitBranches] = useState<GitBranch[]>([
    { name: 'main', current: true, remote: 'origin/main' },
    { name: 'feature/monaco-editor', current: false, remote: 'origin/feature/monaco-editor' },
    { name: 'feature/git-integration', current: false }
  ]);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const toggleFileSelection = (filePath: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(filePath)) {
      newSelected.delete(filePath);
    } else {
      newSelected.add(filePath);
    }
    setSelectedFiles(newSelected);
  };

  const stageFile = (filePath: string) => {
    console.log(`Staging file: ${filePath}`);
    // In a real implementation, this would call git add
  };

  const unstageFile = (filePath: string) => {
    console.log(`Unstaging file: ${filePath}`);
    // In a real implementation, this would call git reset
  };

  const stageAllFiles = () => {
    console.log('Staging all files');
    // In a real implementation, this would call git add .
  };

  const unstageAllFiles = () => {
    console.log('Unstaging all files');
    // In a real implementation, this would call git reset
  };

  const commitChanges = () => {
    if (!commitMessage.trim()) {
      alert('Please enter a commit message');
      return;
    }
    console.log(`Committing with message: ${commitMessage}`);
    setCommitMessage('');
    // In a real implementation, this would call git commit
  };

  const pushChanges = () => {
    console.log('Pushing changes to remote');
    // In a real implementation, this would call git push
  };

  const pullChanges = () => {
    console.log('Pulling changes from remote');
    // In a real implementation, this would call git pull
  };

  const switchBranch = (branchName: string) => {
    console.log(`Switching to branch: ${branchName}`);
    // In a real implementation, this would call git checkout
  };

  const createBranch = () => {
    const branchName = prompt('Enter new branch name:');
    if (branchName) {
      console.log(`Creating branch: ${branchName}`);
      // In a real implementation, this would call git checkout -b
    }
  };

  const getStatusIcon = (status: string, staged: boolean) => {
    const iconClass = staged ? 'text-green-400' : 'text-orange-400';
    
    switch (status) {
      case 'modified':
        return <Circle size={12} className={`${iconClass} fill-current`} />;
      case 'added':
        return <Plus size={12} className={iconClass} />;
      case 'deleted':
        return <Minus size={12} className={iconClass} />;
      case 'renamed':
        return <RefreshCw size={12} className={iconClass} />;
      case 'untracked':
        return <Circle size={12} className="text-gray-400" />;
      default:
        return <Circle size={12} className="text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'modified': return 'M';
      case 'added': return 'A';
      case 'deleted': return 'D';
      case 'renamed': return 'R';
      case 'untracked': return 'U';
      default: return '?';
    }
  };

  const renderChangesTab = () => {
    const stagedFiles = gitFiles.filter(f => f.staged);
    const unstagedFiles = gitFiles.filter(f => !f.staged);

    return (
      <div className="space-y-4">
        {/* Commit Message */}
        <div className="space-y-2">
          <textarea
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="Commit message..."
            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-400 focus:outline-none text-sm resize-none"
            rows={3}
          />
          <div className="flex space-x-2">
            <button
              onClick={commitChanges}
              disabled={!commitMessage.trim() || stagedFiles.length === 0}
              className="flex-1 flex items-center justify-center space-x-2 p-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm transition-colors"
            >
              <GitCommit size={14} />
              <span>Commit</span>
            </button>
            <button
              onClick={pushChanges}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
              title="Push"
            >
              <Upload size={14} />
            </button>
            <button
              onClick={pullChanges}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors"
              title="Pull"
            >
              <Download size={14} />
            </button>
          </div>
        </div>

        {/* Staged Changes */}
        <div>
          <div
            className="flex items-center justify-between p-2 hover:bg-gray-700 rounded cursor-pointer"
            onClick={() => toggleSection('staged')}
          >
            <div className="flex items-center space-x-2">
              {expandedSections.has('staged') ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
              <span className="text-sm font-medium">Staged Changes ({stagedFiles.length})</span>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  unstageAllFiles();
                }}
                className="p-1 text-gray-400 hover:text-white hover:bg-gray-600 rounded"
                title="Unstage All"
              >
                <Minus size={12} />
              </button>
            </div>
          </div>

          {expandedSections.has('staged') && (
            <div className="ml-6 space-y-1">
              {stagedFiles.map((file) => (
                <div
                  key={file.path}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded group"
                >
                  <input
                    type="checkbox"
                    checked={selectedFiles.has(file.path)}
                    onChange={() => toggleFileSelection(file.path)}
                    className="w-3 h-3"
                  />
                  {getStatusIcon(file.status, file.staged)}
                  <span className="text-sm flex-1 truncate">{file.path}</span>
                  <span className="text-xs text-gray-400 w-4">{getStatusText(file.status)}</span>
                  <button
                    onClick={() => unstageFile(file.path)}
                    className="p-1 text-gray-400 hover:text-white hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100"
                    title="Unstage"
                  >
                    <Minus size={12} />
                  </button>
                </div>
              ))}
              {stagedFiles.length === 0 && (
                <div className="text-gray-400 text-sm p-2">No staged changes</div>
              )}
            </div>
          )}
        </div>

        {/* Unstaged Changes */}
        <div>
          <div
            className="flex items-center justify-between p-2 hover:bg-gray-700 rounded cursor-pointer"
            onClick={() => toggleSection('unstaged')}
          >
            <div className="flex items-center space-x-2">
              {expandedSections.has('unstaged') ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
              <span className="text-sm font-medium">Changes ({unstagedFiles.length})</span>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  stageAllFiles();
                }}
                className="p-1 text-gray-400 hover:text-white hover:bg-gray-600 rounded"
                title="Stage All"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>

          {expandedSections.has('unstaged') && (
            <div className="ml-6 space-y-1">
              {unstagedFiles.map((file) => (
                <div
                  key={file.path}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded group"
                >
                  <input
                    type="checkbox"
                    checked={selectedFiles.has(file.path)}
                    onChange={() => toggleFileSelection(file.path)}
                    className="w-3 h-3"
                  />
                  {getStatusIcon(file.status, file.staged)}
                  <span className="text-sm flex-1 truncate">{file.path}</span>
                  <span className="text-xs text-gray-400 w-4">{getStatusText(file.status)}</span>
                  <button
                    onClick={() => stageFile(file.path)}
                    className="p-1 text-gray-400 hover:text-white hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100"
                    title="Stage"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              ))}
              {unstagedFiles.length === 0 && (
                <div className="text-gray-400 text-sm p-2">No changes</div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderHistoryTab = () => (
    <div className="space-y-3">
      {gitCommits.map((commit) => (
        <div key={commit.hash} className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <GitCommit size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-medium text-sm mb-1 truncate">
                {commit.message}
              </div>
              <div className="flex items-center space-x-4 text-xs text-gray-400 mb-2">
                <div className="flex items-center space-x-1">
                  <User size={12} />
                  <span>{commit.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar size={12} />
                  <span>{commit.date.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Hash size={12} />
                  <span className="font-mono">{commit.hash}</span>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {commit.files.length} file{commit.files.length !== 1 ? 's' : ''} changed
              </div>
            </div>
            <button className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded">
              <Eye size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderBranchesTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-white">Branches</h4>
        <button
          onClick={createBranch}
          className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
          title="Create Branch"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="space-y-2">
        {gitBranches.map((branch) => (
          <div
            key={branch.name}
            className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-colors ${
              branch.current
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-700 text-gray-300'
            }`}
            onClick={() => !branch.current && switchBranch(branch.name)}
          >
            <GitBranch size={16} />
            <div className="flex-1">
              <div className="text-sm font-medium">{branch.name}</div>
              {branch.remote && (
                <div className="text-xs text-gray-400">
                  tracks {branch.remote}
                </div>
              )}
            </div>
            {branch.current && (
              <Check size={14} className="text-green-400" />
            )}
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <button className="flex-1 flex items-center justify-center space-x-2 p-2 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors">
            <GitMerge size={14} />
            <span>Merge</span>
          </button>
          <button className="flex-1 flex items-center justify-center space-x-2 p-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors">
            <GitPullRequest size={14} />
            <span>Pull Request</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (!activeProject) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <div className="text-center">
          <GitBranch size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-sm">No project selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-gray-700">
        <div className="flex">
          {[
            { id: 'changes', label: 'Changes', icon: GitCommit },
            { id: 'history', label: 'History', icon: History },
            { id: 'branches', label: 'Branches', icon: GitBranch }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'changes' && renderChangesTab()}
        {activeTab === 'history' && renderHistoryTab()}
        {activeTab === 'branches' && renderBranchesTab()}
      </div>
    </div>
  );
};

export default GitPanel;