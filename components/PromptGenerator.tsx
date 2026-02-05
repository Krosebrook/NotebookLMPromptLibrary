import React, { useState } from 'react';
import { X, Wand2, Copy, Check, RefreshCw, Save, Tag, Folder, MessageSquare } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { PromptData, Collection } from '../types';

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
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Organization fields
  const [tags, setTags] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState('');

  if (!isOpen) return null;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    // Simulate AI thinking time with slightly more complex logic
    setTimeout(() => {
      const prompt = `Act as an expert content creator specializing in ${format} for ${audience}.

Role: You are a ${tone} expert in ${topic}.
Input: Analyze the provided source materials related to ${topic}, extracting key information, themes, and data points.

Constraint: Stop at the provided context. Do not introduce external information or hallucinations outside of the source text. Maintain a ${tone.toLowerCase()} tone throughout.

Task: Deliver a ${format} that is strictly based on the source text, structured logically, and optimized for ${audience}.`;
      
      setGeneratedPrompt(prompt);
      setIsGenerating(false);
    }, 800);
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
        exampleSources: 'User specified sources',
        tip: 'Generated via Prompt Generator',
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
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 border border-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
              <Wand2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Prompt Generator</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!generatedPrompt ? (
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Topic or Source Material
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Quarterly Financial Report, The Great Gatsby"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.label}>{c.label}</option>
                    ))}
                    <option value="Custom Format">Custom Format</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                  >
                    <option value="Professional">Professional</option>
                    <option value="Academic">Academic</option>
                    <option value="Casual">Casual</option>
                    <option value="Funny">Funny</option>
                    <option value="Persuasive">Persuasive</option>
                    <option value="Empathetic">Empathetic</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  placeholder="e.g., Beginners, Executives, Students"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!topic || isGenerating}
                  className={`
                    w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-white font-medium transition-all
                    ${!topic || isGenerating 
                      ? 'bg-purple-300 cursor-not-allowed' 
                      : 'bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg'}
                  `}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      Generate Prompt
                    </>
                  )}
                </button>
              </div>
              
              <p className="text-center text-xs text-slate-400 mt-2">
                Uses the R-I-S-E framework to structure your prompt automatically.
              </p>
            </form>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 relative">
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={handleCopy}
                    className={`
                      p-1.5 rounded-md transition-all
                      ${isCopied ? 'bg-green-100 text-green-700' : 'bg-white text-slate-400 hover:text-purple-600 shadow-sm'}
                    `}
                    title="Copy to clipboard"
                  >
                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <h3 className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-2">Generated Prompt</h3>
                <pre className="whitespace-pre-wrap font-sans text-slate-800 text-sm leading-relaxed pr-8">
                  {generatedPrompt}
                </pre>
              </div>

              {/* Organization Fields for Saving */}
              {onSave && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase">Organization</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                        <Tag className="w-3 h-3" /> Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="e.g., work, important, draft"
                        className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                        <Folder className="w-3 h-3" /> Collection
                      </label>
                      <select
                        value={selectedCollectionId}
                        onChange={(e) => setSelectedCollectionId(e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white"
                      >
                        <option value="">None (Unsorted)</option>
                        {collections.map(col => (
                          <option key={col.id} value={col.id}>{col.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors"
                >
                  Back
                </button>
                
                {onSave && (
                   <button
                    onClick={handleSaveToLibrary}
                    className={`
                      flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm
                      ${isSaved ? 'bg-green-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:border-purple-300 hover:text-purple-600'}
                    `}
                  >
                    {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {isSaved ? 'Saved!' : 'Save Template'}
                  </button>
                )}

                <button
                  onClick={() => {
                    handleCopy();
                    onClose();
                  }}
                  className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium transition-colors shadow-sm"
                >
                  Copy & Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptGenerator;