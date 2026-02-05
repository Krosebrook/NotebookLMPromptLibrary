import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Users, Share2, Save, Undo, Redo, ChevronRight, CheckCircle2, Sparkles, AlertTriangle, X, BrainCircuit, RefreshCw } from 'lucide-react';
import Editor from './Editor.tsx';
import CitationPanel from './CitationPanel.tsx';
import ShareDialog from './ShareDialog.tsx';
import { Collaborator, Source } from '../types.ts';
import { GoogleGenAI } from '@google/genai';

const INITIAL_COLLABORATORS: Collaborator[] = [
  { id: 'current', name: 'You', role: 'owner', color: 'bg-blue-500', initials: 'ME', isActive: true },
  { id: '2', name: 'Sarah Chen', role: 'editor', color: 'bg-emerald-500', initials: 'SC', isActive: true },
];

const INITIAL_SOURCES: Source[] = [
  { id: '1', type: 'paper', title: 'Attention Is All You Need', author: 'Vaswani et al.', year: '2017', url: 'https://arxiv.org/abs/1706.03762', citationId: 1 },
];

const DEFAULT_CONTENT = `# Context Engineering Draft

Act as a Research Scientist.
I want you to summarize the core findings of [Source 1].

## Requirements
- Use bullet points.
- Focus on the Transformer architecture.
`;

const Workbench: React.FC = () => {
  const [content, setContent] = useState<string>(() => {
    return localStorage.getItem('notebook_content') || DEFAULT_CONTENT;
  });
  
  const [history, setHistory] = useState<string[]>([content]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [sources, setSources] = useState<Source[]>(INITIAL_SOURCES);
  const [collaborators, setCollaborators] = useState<Collaborator[]>(INITIAL_COLLABORATORS);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCritique, setShowCritique] = useState(false);
  const [critiqueText, setCritiqueText] = useState<string | null>(null);
  const [isCritiquing, setIsCritiquing] = useState(false);
  const [lastSaved, setLastSaved] = useState('Just now');
  const [isSaving, setIsSaving] = useState(false);

  const handleContentChange = useCallback((newText: string) => {
    setContent(newText);
    setIsSaving(true);
  }, []);

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

  const saveContent = useCallback(() => {
    localStorage.setItem('notebook_content', content);
    setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setIsSaving(false);
  }, [content]);

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

  const runAiCritique = async () => {
    if (!content.trim()) return;
    setIsCritiquing(true);
    setShowCritique(true);
    setCritiqueText(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Critique the following NotebookLM prompt draft based on the R-I-S-E framework.
Prompt Draft:
"""
${content}
"""

Provide:
1. Strengths (what's working)
2. Weaknesses (what's missing or vague)
3. A suggested R-I-S-E version of this prompt.

Format the output clearly using headers and bullet points.`,
        config: {
          systemInstruction: "You are a prompt engineer for Google NotebookLM. Your goal is to help users move from simple queries to context-engineered 'Power Prompts'. Be encouraging but ruthlessly accurate about missing constraints (the STOP part of RISE).",
          temperature: 0.5,
        }
      });

      setCritiqueText(response.text || "AI failed to generate a critique.");
    } catch (err) {
      console.error(err);
      setCritiqueText("Error connecting to Gemini. Please try again later.");
    } finally {
      setIsCritiquing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              Workbench Draft
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold border border-blue-100">AI Enabled</span>
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
               {isSaving ? (
                 <div className="text-xs text-amber-500 font-medium animate-pulse">Saving...</div>
               ) : (
                 <div className="flex items-center gap-1 text-xs text-slate-400">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>Last saved: {lastSaved}</span>
                 </div>
               )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={runAiCritique}
            disabled={isCritiquing}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-sm
              ${isCritiquing ? 'bg-slate-100 text-slate-400' : 'bg-white border border-blue-200 text-blue-600 hover:bg-blue-50'}
            `}
          >
            {isCritiquing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            AI Critique
          </button>

          <div className="h-6 w-px bg-slate-200" />

          <div className="flex items-center gap-1">
             <button onClick={handleUndo} disabled={historyIndex <= 0} className={`p-1.5 rounded-lg ${historyIndex > 0 ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300'}`}><Undo className="w-4 h-4" /></button>
             <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className={`p-1.5 rounded-lg ${historyIndex < history.length - 1 ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300'}`}><Redo className="w-4 h-4" /></button>
          </div>

          <button onClick={() => setShowHistory(!showHistory)} className={`p-2 rounded-lg ${showHistory ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}><Clock className="w-5 h-5" /></button>
          
          <button onClick={() => setIsShareOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2">
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 overflow-y-auto bg-white p-8 sm:p-12 shadow-inner">
          <div className="max-w-3xl mx-auto min-h-full">
            <Editor content={content} onChange={handleContentChange} collaborators={collaborators} />
          </div>
        </div>

        <CitationPanel sources={sources} onAddSource={(s) => setSources([...sources, {...s, id: String(Date.now())}])} onRemoveSource={(id) => setSources(sources.filter(s => s.id !== id))} onCite={(s) => handleContentChange(content + ` [${s.citationId}]`)} />

        {showCritique && (
          <div className="absolute right-[320px] top-4 bottom-4 w-96 bg-white border border-slate-200 shadow-2xl rounded-2xl z-40 flex flex-col animate-in slide-in-from-right-4 duration-300">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-blue-50/30 rounded-t-2xl">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-blue-600" />
                AI Feedback
              </h3>
              <button onClick={() => setShowCritique(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-md">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {isCritiquing ? (
                <div className="space-y-4">
                  <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-slate-100 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse"></div>
                  <div className="pt-4 text-center text-xs text-slate-400 italic">Gemini is analyzing your prompt...</div>
                </div>
              ) : (
                <div className="prose prose-sm text-slate-700 leading-relaxed">
                  <pre className="whitespace-pre-wrap font-sans text-sm">
                    {critiqueText}
                  </pre>
                </div>
              )}
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl">
              <p className="text-[10px] text-slate-400 text-center">
                Powered by Gemini 3 Flash • R-I-S-E Evaluation
              </p>
            </div>
          </div>
        )}

        {showHistory && (
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-slate-50 border-l border-slate-200 shadow-xl z-30 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
              <h3 className="font-bold text-slate-800">History</h3>
              <button onClick={() => setShowHistory(false)}><ChevronRight className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-4 text-sm text-slate-400 italic text-center mt-10">Local version history visible here.</div>
          </div>
        )}
      </div>

      <ShareDialog isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} collaborators={collaborators} onUpdateRole={(id, r) => setCollaborators(prev => prev.map(c => c.id === id ? {...c, role: r as any} : c))} />
    </div>
  );
};

export default Workbench;