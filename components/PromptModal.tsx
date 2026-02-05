import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Info, Lightbulb, Tag, Folder, Layers, FileText, LayoutTemplate } from 'lucide-react';
import { PromptData, Collection } from '../types.ts';
import { CATEGORIES } from '../constants.ts';

interface PromptModalProps {
  prompt: PromptData | null;
  collections?: Collection[];
  onUpdatePrompt?: (prompt: PromptData) => void;
  onClose: () => void;
}

const PromptModal: React.FC<PromptModalProps> = ({ prompt, collections = [], onUpdatePrompt, onClose }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [tags, setTags] = useState<string>('');
  const [collectionId, setCollectionId] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsCopied(false);
    if (prompt) {
      setTags(prompt.tags ? prompt.tags.join(', ') : '');
      setCollectionId(prompt.collectionId || '');
      setIsEditing(false);
    }
  }, [prompt]);

  if (!prompt) return null;

  const category = CATEGORIES.find(c => c.id === prompt.categoryId);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.promptText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveOrganization = () => {
    if (onUpdatePrompt) {
      const parsedTags = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
      onUpdatePrompt({
        ...prompt,
        tags: parsedTags,
        collectionId: collectionId || undefined
      });
      setIsEditing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight pr-8">
              {prompt.title}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors absolute top-4 right-4"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          
          {/* Main Prompt Area */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 relative group">
            <div className="absolute top-3 right-3">
              <button
                onClick={handleCopy}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm
                  ${isCopied 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'}
                `}
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Prompt</span>
                  </>
                )}
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-slate-800 text-sm leading-relaxed pt-8 sm:pt-0 sm:pr-24">
              {prompt.promptText}
            </pre>
          </div>

          {/* New Visually Distinct Metadata Panel */}
          <div className="bg-slate-100 rounded-xl p-5 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Key Metadata</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                 <div>
                   <span className="text-[10px] text-slate-400 mb-1 block">Format</span>
                   <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
                     <FileText className="w-4 h-4 text-blue-500" />
                     {prompt.format}
                   </div>
                 </div>
                 <div>
                   <span className="text-[10px] text-slate-400 mb-1 block">Category</span>
                   <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
                     <Layers className="w-4 h-4 text-purple-500" />
                     {category?.label || 'General'}
                   </div>
                 </div>
              </div>
              
              <div>
                <span className="text-[10px] text-slate-400 mb-1 block flex items-center gap-1">
                  <Info className="w-3 h-3" /> Best For
                </span>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {prompt.bestFor}
                </p>
              </div>
            </div>
          </div>

          {/* Organization Bar */}
          <div className="bg-white border border-slate-200 rounded-lg p-3">
             <div className="flex justify-between items-center mb-2">
               <h4 className="text-xs font-bold text-slate-500 uppercase">Organization</h4>
               {!isEditing && onUpdatePrompt && (
                 <button onClick={() => setIsEditing(true)} className="text-xs text-blue-600 font-medium hover:underline">
                   Edit
                 </button>
               )}
             </div>

             {isEditing ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 <div>
                   <label className="text-xs text-slate-400 block mb-1">Tags</label>
                   <input
                    type="text"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded px-2 py-1"
                    placeholder="comma, separated"
                   />
                 </div>
                 <div>
                   <label className="text-xs text-slate-400 block mb-1">Collection</label>
                   <select
                    value={collectionId}
                    onChange={e => setCollectionId(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded px-2 py-1 bg-white"
                   >
                     <option value="">None</option>
                     {collections.map(c => (
                       <option key={c.id} value={c.id}>{c.name}</option>
                     ))}
                   </select>
                 </div>
                 <div className="sm:col-span-2 flex justify-end gap-2 mt-1">
                   <button onClick={() => setIsEditing(false)} className="text-xs px-2 py-1 text-slate-500">Cancel</button>
                   <button onClick={handleSaveOrganization} className="text-xs px-3 py-1 bg-blue-600 text-white rounded">Save Changes</button>
                 </div>
               </div>
             ) : (
               <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                 <div className="flex items-center gap-2">
                   <Folder className="w-4 h-4 text-slate-400" />
                   {collections.find(c => c.id === prompt.collectionId)?.name || <span className="text-slate-400 italic">Unfiled</span>}
                 </div>
                 <div className="flex items-center gap-2">
                   <Tag className="w-4 h-4 text-slate-400" />
                   {prompt.tags && prompt.tags.length > 0 ? (
                     <div className="flex gap-1 flex-wrap">
                       {prompt.tags.map(tag => (
                         <span key={tag} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-xs border border-slate-200">
                           {tag}
                         </span>
                       ))}
                     </div>
                   ) : (
                     <span className="text-slate-400 italic">No tags</span>
                   )}
                 </div>
               </div>
             )}
          </div>

          {/* Tip Section */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
             <div className="bg-amber-100 p-2 rounded-lg h-fit text-amber-600 shrink-0">
               <Lightbulb className="w-5 h-5" />
             </div>
             <div>
               <h4 className="text-amber-900 font-bold text-sm mb-1">NotebookLM Pro Tip</h4>
               <p className="text-sm text-amber-800 leading-relaxed">
                 {prompt.tip}
               </p>
             </div>
          </div>

           <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h4 className="text-blue-900 font-semibold text-sm mb-1">Recommended Sources</h4>
              <p className="text-sm text-blue-700">
                {prompt.exampleSources}
              </p>
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptModal;