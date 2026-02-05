import React from 'react';
import { ArrowRight, Copy, Check } from 'lucide-react';
import { PromptData } from '../types';

interface PromptCardProps {
  prompt: PromptData;
  onClick: () => void;
  onQuickCopy: (e: React.MouseEvent, text: string) => void;
  isCopied: boolean;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onClick, onQuickCopy, isCopied }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', prompt.id);
    e.dataTransfer.effectAllowed = 'move';
    // Add visual feedback class to the card being dragged if desired
    // (e.target as HTMLElement).classList.add('opacity-50');
  };

  return (
    <div 
      onClick={onClick}
      draggable
      onDragStart={handleDragStart}
      className="group bg-white rounded-xl border border-slate-200 p-5 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-blue-200 transition-all duration-200 flex flex-col h-full transform hover:-translate-y-1 relative"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
          {prompt.format}
        </span>
        <button
          onClick={(e) => onQuickCopy(e, prompt.promptText)}
          className={`
            p-1.5 rounded-md transition-colors duration-200
            ${isCopied ? 'bg-green-100 text-green-700' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}
          `}
          title="Quick Copy"
        >
          {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      <h3 className="font-bold text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
        {prompt.title}
      </h3>
      
      <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-grow">
        {prompt.bestFor}
      </p>

      {/* Tags Display */}
      {prompt.tags && prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {prompt.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded border border-slate-100">
              #{tag}
            </span>
          ))}
          {prompt.tags.length > 3 && (
            <span className="text-[10px] text-slate-400 px-1">+ {prompt.tags.length - 3}</span>
          )}
        </div>
      )}

      <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
        <span className="text-xs text-slate-400 font-medium">Click to view details</span>
        <div className="bg-slate-50 p-1.5 rounded-full group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
        </div>
      </div>
    </div>
  );
};

export default PromptCard;