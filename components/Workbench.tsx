import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Users, Share2, Save, Undo, Redo, ChevronRight, Cloud, CheckCircle2 } from 'lucide-react';
import Editor from './Editor';
import CitationPanel from './CitationPanel';
import ShareDialog from './ShareDialog';
import { Collaborator, Source, NoteVersion } from '../types';

const INITIAL_COLLABORATORS: Collaborator[] = [
  { id: 'current', name: 'You', role: 'owner', color: 'bg-blue-500', initials: 'ME', isActive: true },
  { id: '2', name: 'Sarah Chen', role: 'editor', color: 'bg-emerald-500', initials: 'SC', isActive: true },
  { id: '3', name: 'Mike Ross', role: 'viewer', color: 'bg-amber-500', initials: 'MR', isActive: false },
];

const INITIAL_SOURCES: Source[] = [
  { id: '1', type: 'paper', title: 'Attention Is All You Need', author: 'Vaswani et al.', year: '2017', url: 'https://arxiv.org/abs/1706.03762', citationId: 1 },
  { id: '2', type: 'website', title: 'Google NotebookLM Documentation', author: 'Google', year: '2024', url: 'https://notebooklm.google.com', citationId: 2 },
];

const DEFAULT_CONTENT = `# Project Alpha Strategy

We need to evaluate the core competencies of the new model architecture. According to recent studies [1], transformer models have revolutionized NLP tasks.

## Key Objectives
1. Analyze performance metrics
2. Optimize latency
3. Integrate with existing knowledge base [2]

Let's discuss the implementation details below...`;

const Workbench: React.FC = () => {
  // Initialize content from localStorage or default
  const [content, setContent] = useState<string>(() => {
    return localStorage.getItem('notebook_content') || DEFAULT_CONTENT;
  });
  
  // History State for Undo/Redo
  const [history, setHistory] = useState<string[]>([content]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [sources, setSources] = useState<Source[]>(INITIAL_SOURCES);
  const [collaborators, setCollaborators] = useState<Collaborator[]>(INITIAL_COLLABORATORS);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [versions, setVersions] = useState<NoteVersion[]>([]);
  const [lastSaved, setLastSaved] = useState('Just now');
  const [isSaving, setIsSaving] = useState(false);

  // Handle Content Change with History Debounce
  const handleContentChange = useCallback((newText: string) => {
    setContent(newText);
    setIsSaving(true);
    // History update is handled by effect
  }, []);

  // Commit to history when user stops typing for 1 second
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (content !== history[historyIndex]) {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(content);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        setIsSaving(false);
        setLastSaved('Just now');
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [content, history, historyIndex]);

  // Save content explicitly (used for shortcuts)
  const saveContent = useCallback(() => {
    localStorage.setItem('notebook_content', content);
    setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setIsSaving(false);
    // Force history commit if pending
    if (content !== history[historyIndex]) {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(content);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }
  }, [content, history, historyIndex]);

  // Undo/Redo Functions
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
    }
  }, [historyIndex, history]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        saveContent();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveContent, handleUndo, handleRedo]);

  // Autosave to LocalStorage interval
  useEffect(() => {
    const saveInterval = setInterval(() => {
      localStorage.setItem('notebook_content', content);
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setIsSaving(false);
    }, 30000);

    // Initial save on unmount or change
    localStorage.setItem('notebook_content', content);

    return () => clearInterval(saveInterval);
  }, [content]);

  // Mock Versions
  useEffect(() => {
    setVersions([
      { id: 'v3', timestamp: 'Just now', author: 'You', content: content },
      { id: 'v2', timestamp: '10 mins ago', author: 'Sarah Chen', content: content.substring(0, Math.max(0, content.length - 50)) },
      { id: 'v1', timestamp: '1 hour ago', author: 'You', content: '# Initial Draft\n\nStarting thoughts...' },
    ]);
  }, [content]);

  const handleAddSource = (sourceData: Omit<Source, 'id'>) => {
    const newSource: Source = {
      ...sourceData,
      id: Math.random().toString(36).substr(2, 9),
    };
    setSources([...sources, newSource]);
  };

  const handleRemoveSource = (id: string) => {
    setSources(sources.filter(s => s.id !== id));
  };

  const handleCite = (source: Source) => {
    handleContentChange(content + ` [${source.citationId}]`);
  };

  const handleRoleUpdate = (id: string, role: Collaborator['role'] | 'remove') => {
    if (role === 'remove') {
      setCollaborators(prev => prev.filter(c => c.id !== id));
    } else {
      setCollaborators(prev => prev.map(c => c.id === id ? { ...c, role: role as any } : c));
    }
  };

  const restoreVersion = (version: NoteVersion) => {
    if (window.confirm('Restore this version? Current changes will be saved as a new version.')) {
      handleContentChange(version.content);
      setShowHistory(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Top Bar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              Untitled Project 
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium border border-slate-200">Draft</span>
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
               {isSaving ? (
                 <div className="flex items-center gap-1.5 text-xs text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 transition-all">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    <span className="font-medium">Saving...</span>
                 </div>
               ) : (
                 <div className="flex items-center gap-1.5 text-xs text-slate-400 px-1 py-0.5 rounded transition-all">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="font-medium text-slate-500">Autosaved</span>
                    <span className="text-slate-300 mx-0.5">•</span>
                    <span>{lastSaved}</span>
                 </div>
               )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center -space-x-2">
            {collaborators.map(user => (
              <div 
                key={user.id} 
                className="relative group cursor-default"
              >
                <div className={`w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-medium shadow-sm transition-transform group-hover:z-10 group-hover:scale-105 ${user.color}`}>
                  {user.initials}
                </div>
                {user.isActive && (
                   <div className="absolute bottom-0 right-0 h-3 w-3">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 ring-2 ring-white"></span>
                   </div>
                )}
                
                {/* Custom Tooltip */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                   <div className="font-semibold">{user.name}</div>
                   <div className="text-slate-400 capitalize">{user.role} • {user.isActive ? 'Active' : 'Away'}</div>
                </div>
              </div>
            ))}
            <button 
              onClick={() => setIsShareOpen(true)}
              className="w-9 h-9 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-slate-400 hover:text-slate-600 bg-white transition-colors relative z-0"
              title="Share with more people"
            >
              <Users className="w-4 h-4" />
            </button>
          </div>

          <div className="h-6 w-px bg-slate-200" />

          <div className="flex items-center gap-1">
             <button 
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className={`p-2 rounded-lg transition-colors ${historyIndex > 0 ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300 cursor-not-allowed'}`}
              title="Undo (Cmd+Z)"
            >
              <Undo className="w-5 h-5" />
            </button>
            <button 
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className={`p-2 rounded-lg transition-colors ${historyIndex < history.length - 1 ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300 cursor-not-allowed'}`}
              title="Redo (Cmd+Shift+Z)"
            >
              <Redo className="w-5 h-5" />
            </button>
          </div>

          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-lg transition-colors ${showHistory ? 'bg-slate-100 text-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}
            title="Version History"
          >
            <Clock className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setIsShareOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Editor */}
        <div className="flex-1 overflow-y-auto bg-white p-8 sm:p-12 shadow-inner">
          <div className="max-w-3xl mx-auto min-h-full">
            <Editor 
              content={content} 
              onChange={handleContentChange} 
              collaborators={collaborators}
            />
          </div>
        </div>

        {/* Citations Sidebar */}
        <CitationPanel 
          sources={sources}
          onAddSource={handleAddSource}
          onRemoveSource={handleRemoveSource}
          onCite={handleCite}
        />

        {/* Version History Overlay */}
        {showHistory && (
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-slate-50 border-l border-slate-200 shadow-xl transform transition-transform z-30 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
              <h3 className="font-bold text-slate-800">Version History</h3>
              <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-md">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 space-y-4">
              {versions.map((version) => (
                <div 
                  key={version.id} 
                  className="bg-white p-3 rounded-lg border border-slate-200 hover:border-blue-300 cursor-pointer group transition-all shadow-sm hover:shadow-md"
                  onClick={() => restoreVersion(version)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-semibold text-slate-700">{version.timestamp}</span>
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-medium border border-blue-100">Restore</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500 text-[8px] text-white flex items-center justify-center">
                      {version.author.charAt(0)}
                    </div>
                    <span className="text-xs text-slate-500">{version.author}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2 font-mono bg-slate-50 p-2 rounded border border-slate-100">
                    {version.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ShareDialog 
        isOpen={isShareOpen} 
        onClose={() => setIsShareOpen(false)}
        collaborators={collaborators}
        onUpdateRole={handleRoleUpdate}
      />
    </div>
  );
};

export default Workbench;