import React, { useState } from 'react';
import { X, Wand2, Copy, Check, RefreshCw, Save, Tag, Folder, Sparkles, AlertCircle } from 'lucide-react';
import { CATEGORIES } from '../constants.ts';
import { PromptData, Collection } from '../types.ts';
import { GoogleGenAI } from '@google/genai';

interface PromptGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (prompt: PromptData) => void;
  collections?: Collection[];
}

const PromptGenerator: React.FC<PromptGeneratorProps> = ({ isOpen, onClose, onSave, collections = [] }) => {
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState('Audio Overview');
  const [audience, setAudience] = useState('General Audience');
  const [tone, setTone] = useState('Professional');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const [tags, setTags] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a high-quality NotebookLM prompt for the topic: "${topic}".
Format required: ${format}
Audience: ${audience}
Tone: ${tone}

You MUST follow the R-I-S-E framework:
- ROLE: Define a specific persona for the AI.
- INPUT: Specify how the AI should use the uploaded source materials.
- STOP: Set clear constraints and boundaries.
- EXAMPLE: Provide or describe the expected output format.

Return ONLY the prompt text, no conversational filler.`,
        config: {
          systemInstruction: "You are a world-class Prompt Engineer specializing in Google NotebookLM. Your prompts are structured, precise, and leverage the R-I-S-E framework to eliminate hallucinations and maximize depth.",
          temperature: 0.7,
        }
      });

      const text = response.text;
      if (text) {
        setGeneratedPrompt(text.trim());
      } else {
        throw new Error("No content received from AI.");
      }
    } catch (err: any) {
      console.error("Generation failed:", err);
      setError("Failed to generate prompt. Please check your connection or try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveToLibrary = () => {
    if (onSave) {
      const parsedTags = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
      
      const newPrompt: PromptData = {
        id: Math.random().toString(36).substr(2, 9),
        categoryId: 'saved',
        title: `${topic} (${format})`,
        format: format,
        bestFor: audience,
        promptText: generatedPrompt,
        exampleSources: 'Custom User Sources',
        tip: 'Generated via AI Prompt Generator',
        tags: parsedTags,
        collectionId: selectedCollectionId || undefined
      };
      onSave(newPrompt);
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 1000);
    }
  };

  const handleReset = () => {
    setGeneratedPrompt('');
    setIsCopied(false);
    setIsSaved(false);
    setTags('');
    setSelectedCollectionId('');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">AI Prompt Generator</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {!generatedPrompt ? (
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Topic or Source Material
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Quantum Computing Basics, Clinical Trial Results"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Format
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.label}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Professional">Professional</option>
                    <option value="Academic">Academic</option>
                    <option value="Casual">Casual</option>
                    <option value="Highly Critical">Highly Critical</option>
                    <option value="Socratic">Socratic</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  placeholder="e.g., C-Level Executives, Undergraduates"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!topic || isGenerating}
                  className={`
                    w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold transition-all
                    ${!topic || isGenerating 
                      ? 'bg-slate-300 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100'}
                  `}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      AI is Crafting Your Prompt...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Generate with Gemini
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 relative">
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={handleCopy}
                    className={`
                      p-2 rounded-lg transition-all shadow-sm
                      ${isCopied ? 'bg-green-600 text-white' : 'bg-white text-slate-400 hover:text-blue-600 border border-slate-200'}
                    `}
                    title="Copy to clipboard"
                  >
                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-blue-500" /> R-I-S-E Structured Prompt
                </h3>
                <pre className="whitespace-pre-wrap font-sans text-slate-800 text-sm leading-relaxed pr-8 max-h-64 overflow-y-auto">
                  {generatedPrompt}
                </pre>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-3">
                <h4 className="text-xs font-semibold text-slate-400 uppercase">Save to Library</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Tags
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="work, report"
                      className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                      <Folder className="w-3 h-3" /> Collection
                    </label>
                    <select
                      value={selectedCollectionId}
                      onChange={(e) => setSelectedCollectionId(e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 bg-white"
                    >
                      <option value="">None</option>
                      {collections.map(col => (
                        <option key={col.id} value={col.id}>{col.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 text-sm font-medium transition-colors"
                >
                  Start Over
                </button>
                
                {onSave && (
                   <button
                    onClick={handleSaveToLibrary}
                    disabled={isSaved}
                    className={`
                      flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                      ${isSaved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}
                    `}
                  >
                    {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {isSaved ? 'Saved!' : 'Save to My Collection'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptGenerator;