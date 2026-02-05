import React, { useState } from 'react';
import { Book, Plus, Trash2, ExternalLink, Quote, Search } from 'lucide-react';
import { Source } from '../types';

interface CitationPanelProps {
  sources: Source[];
  onAddSource: (source: Omit<Source, 'id'>) => void;
  onRemoveSource: (id: string) => void;
  onCite: (source: Source) => void;
}

const CitationPanel: React.FC<CitationPanelProps> = ({ sources, onAddSource, onRemoveSource, onCite }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newSource, setNewSource] = useState<{
    type: Source['type'];
    title: string;
    url: string;
    author: string;
    year: string;
  }>({
    type: 'website',
    title: '',
    url: '',
    author: '',
    year: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSource.title) return;
    
    // Simple logic to determine next citation ID
    const maxId = sources.reduce((max, s) => Math.max(max, s.citationId), 0);

    onAddSource({
      ...newSource,
      citationId: maxId + 1
    });
    
    setNewSource({ type: 'website', title: '', url: '', author: '', year: '' });
    setIsAdding(false);
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200 w-80 shrink-0">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Book className="w-4 h-4 text-purple-600" />
          Sources ({sources.length})
        </h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="p-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
          title="Add Source"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isAdding && (
          <form onSubmit={handleSubmit} className="bg-slate-50 p-4 rounded-xl border border-purple-200 shadow-sm animate-in slide-in-from-top-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Add New Source</h4>
            <div className="space-y-3">
              <select 
                value={newSource.type}
                onChange={e => setNewSource({...newSource, type: e.target.value as any})}
                className="w-full text-sm rounded-lg border-slate-200 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="website">Website</option>
                <option value="paper">Research Paper (DOI)</option>
                <option value="book">Book</option>
                <option value="manual">Manual Entry</option>
              </select>
              <input 
                type="text" 
                placeholder="Title" 
                className="w-full text-sm rounded-lg border-slate-200 focus:ring-purple-500 focus:border-purple-500"
                value={newSource.title}
                onChange={e => setNewSource({...newSource, title: e.target.value})}
                autoFocus
              />
               <input 
                type="text" 
                placeholder="Author (Optional)" 
                className="w-full text-sm rounded-lg border-slate-200 focus:ring-purple-500 focus:border-purple-500"
                value={newSource.author}
                onChange={e => setNewSource({...newSource, author: e.target.value})}
              />
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder={newSource.type === 'paper' ? 'DOI' : 'URL'} 
                  className="flex-1 text-sm rounded-lg border-slate-200 focus:ring-purple-500 focus:border-purple-500"
                  value={newSource.url}
                  onChange={e => setNewSource({...newSource, url: e.target.value})}
                />
                 <input 
                  type="text" 
                  placeholder="Year" 
                  className="w-20 text-sm rounded-lg border-slate-200 focus:ring-purple-500 focus:border-purple-500"
                  value={newSource.year}
                  onChange={e => setNewSource({...newSource, year: e.target.value})}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-md">Cancel</button>
                <button type="submit" className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md">Add Source</button>
              </div>
            </div>
          </form>
        )}

        {sources.map(source => (
          <div key={source.id} className="group bg-white border border-slate-200 rounded-lg p-3 hover:border-purple-300 transition-colors shadow-sm">
            <div className="flex justify-between items-start mb-1">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-slate-100 text-[10px] font-bold text-slate-600 border border-slate-200">
                {source.citationId}
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => onCite(source)}
                  className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                  title="Cite this source"
                >
                  <Quote className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => onRemoveSource(source.id)}
                  className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            
            <h4 className="text-sm font-medium text-slate-900 leading-snug mb-1">
              {source.title}
            </h4>
            
            <div className="text-xs text-slate-500 flex flex-wrap gap-x-2">
              {source.author && <span>{source.author}</span>}
              {source.year && <span className="text-slate-300">•</span>}
              {source.year && <span>{source.year}</span>}
            </div>

            {source.url && (
              <a 
                href={source.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-[10px] text-blue-500 hover:underline"
              >
                View Source <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        ))}

        {sources.length === 0 && !isAdding && (
          <div className="text-center py-8 text-slate-400">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No sources added yet.</p>
            <button onClick={() => setIsAdding(true)} className="text-purple-600 text-xs font-medium hover:underline mt-1">
              Add your first source
            </button>
          </div>
        )}
      </div>
      
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 text-center">
        Supported styles: APA, MLA, Chicago
      </div>
    </div>
  );
};

export default CitationPanel;