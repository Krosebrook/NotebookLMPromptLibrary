import React, { useRef, useEffect, useState } from 'react';
import { Collaborator } from '../types.ts';
import { Eye, Edit3, Type, List, Bold, Italic } from 'lucide-react';

interface EditorProps {
  content: string;
  onChange: (text: string) => void;
  collaborators: Collaborator[];
}

const Editor: React.FC<EditorProps> = ({ content, onChange, collaborators }) => {
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current && mode === 'write') {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content, mode]);

  // Toggle Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + I (for Inspect/Preview) or Cmd/Ctrl + P
      if ((e.metaKey || e.ctrlKey) && (e.key === 'i' || e.key === 'p')) {
        e.preventDefault();
        setMode(prev => prev === 'write' ? 'preview' : 'write');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Simulated active cursors for other users
  const activeCollaborators = collaborators.filter(c => c.isActive && c.id !== 'current');

  // Simple markdown parser for preview
  const renderMarkdown = (text: string) => {
    let html = text
      // Headers
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-4 mt-6">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mb-3 mt-5">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-medium mb-2 mt-4">$1</h3>')
      // Bold/Italic
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Lists
      .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc mb-1">$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal mb-1">$1</li>')
      // Blockquotes
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-slate-300 pl-4 italic my-4 text-slate-600">$1</blockquote>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank">$1</a>')
      // Citations (Special case for this app)
      .replace(/\[(\d+)\]/g, '<sup class="text-blue-600 font-bold ml-0.5 cursor-pointer">[$1]</sup>')
      // Line breaks
      .replace(/\n/g, '<br />');

    return { __html: html };
  };

  return (
    <div className="relative font-sans text-sm sm:text-base leading-relaxed flex flex-col h-full">
      {/* Editor Toolbar */}
      <div className="sticky top-0 bg-white/95 backdrop-blur z-20 border-b border-slate-100 pb-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setMode('write')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              mode === 'write' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
            title="Switch to Write mode"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Write
          </button>
          <button
            onClick={() => setMode('preview')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              mode === 'preview' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
            title="Switch to Preview mode (Cmd+I)"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
        </div>

        {mode === 'write' && (
          <div className="flex items-center gap-1 text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider mr-2">Format</span>
            <Bold className="w-4 h-4" />
            <Italic className="w-4 h-4" />
            <List className="w-4 h-4" />
            <Type className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Editor Content */}
      <div className="flex-1 relative min-h-[50vh]">
        {mode === 'write' ? (
          <>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-full bg-transparent resize-none focus:outline-none text-slate-800 placeholder-slate-300 font-mono"
              placeholder="Start typing your prompt or notes here... (Markdown supported)"
              spellCheck={false}
            />
            {/* Fake cursors overlay (only visible in write mode) */}
            {activeCollaborators.map((user, idx) => (
              <div 
                key={user.id}
                className="absolute pointer-events-none flex flex-col items-start z-10 animate-pulse transition-all duration-1000"
                style={{
                  // Random positions for demo purposes.
                  top: `${100 + (idx * 60)}px`,
                  left: `${20 + (idx * 150)}%`
                }}
              >
                <div className={`h-5 w-0.5 ${user.color}`}></div>
                <div className={`px-1.5 py-0.5 text-[10px] font-bold text-white rounded-br rounded-bl rounded-tr ${user.color}`}>
                  {user.name}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div 
            className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-blue-600 prose-sm sm:prose-base"
            dangerouslySetInnerHTML={renderMarkdown(content)}
          />
        )}
      </div>
    </div>
  );
};

export default Editor;