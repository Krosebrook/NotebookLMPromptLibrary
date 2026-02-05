import React, { useState, useMemo, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar.tsx';
import PromptCard from './components/PromptCard.tsx';
import PromptModal from './components/PromptModal.tsx';
import Workbench from './components/Workbench.tsx';
import PromptGenerator from './components/PromptGenerator.tsx';
import TutorialOverlay from './components/TutorialOverlay.tsx';
import { PROMPTS, CATEGORIES } from './constants.ts';
import { PromptData, Collection } from './types.ts';
import { Search, Menu, Sparkles, Filter, Tag as TagIcon, FileText } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<'library' | 'workbench'>('library');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  
  const [selectedPrompt, setSelectedPrompt] = useState<PromptData | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [showTutorial, setShowTutorial] = useState(() => {
    return !localStorage.getItem('tutorial_completed');
  });

  const [savedPrompts, setSavedPrompts] = useState<PromptData[]>(() => {
    const saved = localStorage.getItem('notebook_saved_prompts');
    return saved ? JSON.parse(saved) : [];
  });

  const [collections, setCollections] = useState<Collection[]>(() => {
    const saved = localStorage.getItem('notebook_collections');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('notebook_saved_prompts', JSON.stringify(savedPrompts));
  }, [savedPrompts]);

  useEffect(() => {
    localStorage.setItem('notebook_collections', JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeCollection = collections.find(c => c.id === activeCategory);
  
  const activeCategoryData = useMemo(() => {
    if (activeCategory === 'saved') {
      return { id: 'saved', label: 'My Saved Templates', description: 'Your custom generated prompts' };
    }
    if (activeCollection) {
      return { id: activeCollection.id, label: activeCollection.name, description: 'Custom Collection' };
    }
    return CATEGORIES.find(c => c.id === activeCategory);
  }, [activeCategory, activeCollection]);

  const allPrompts = useMemo(() => {
    return [...savedPrompts, ...PROMPTS];
  }, [savedPrompts]);

  const uniqueFormats = useMemo(() => {
    const formats = new Set(allPrompts.map(p => p.format));
    return ['All', ...Array.from(formats)].sort();
  }, [allPrompts]);

  const filteredPrompts = useMemo(() => {
    return allPrompts.filter(prompt => {
      let matchesCategory = false;
      
      if (activeCategory === 'all') {
        matchesCategory = true;
      } else if (activeCategory === 'saved') {
        matchesCategory = prompt.categoryId === 'saved';
      } else if (activeCollection) {
        matchesCategory = prompt.collectionId === activeCategory;
      } else {
        matchesCategory = prompt.categoryId === activeCategory;
      }

      if (selectedFormat !== 'All' && prompt.format !== selectedFormat) {
        return false;
      }

      if (!searchQuery.trim()) return matchesCategory;

      const terms = searchQuery.toLowerCase().split(' ').filter(t => t.length > 0);
      const searchableText = `${prompt.title} ${prompt.bestFor} ${prompt.promptText} ${prompt.tags?.join(' ') || ''}`.toLowerCase();
      
      const matchesSearch = terms.every(term => searchableText.includes(term));
      
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, activeCollection, searchQuery, selectedFormat, allPrompts]);

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    
    const matchedTitles = allPrompts
      .filter(p => p.title.toLowerCase().includes(query))
      .map(p => ({ text: p.title, type: 'Title' }))
      .slice(0, 3);
      
    const matchedTags = Array.from(new Set(
      allPrompts.flatMap(p => p.tags || [])
        .filter(t => t.toLowerCase().includes(query))
    )).map(t => ({ text: t, type: 'Tag' }))
    .slice(0, 3);

    return [...matchedTitles, ...matchedTags];
  }, [searchQuery, allPrompts]);

  const handleQuickCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveCustomPrompt = (prompt: PromptData) => {
    setSavedPrompts(prev => [prompt, ...prev]);
    if (prompt.collectionId) {
      setActiveCategory(prompt.collectionId);
    } else {
      setActiveCategory('saved');
    }
    setCurrentView('library');
  };

  const handleUpdatePrompt = (updatedPrompt: PromptData) => {
    const isSaved = savedPrompts.some(p => p.id === updatedPrompt.id);
    if (isSaved) {
      setSavedPrompts(prev => prev.map(p => p.id === updatedPrompt.id ? updatedPrompt : p));
    } else {
      const newSavedPrompt = { ...updatedPrompt, categoryId: 'saved' };
      setSavedPrompts(prev => [newSavedPrompt, ...prev]);
    }
    setSelectedPrompt(updatedPrompt);
  };

  const handleCreateCollection = (name: string) => {
    const newCollection: Collection = {
      id: `col_${Date.now()}`,
      name,
      color: 'bg-blue-500',
      createdAt: Date.now()
    };
    setCollections(prev => [...prev, newCollection]);
    setActiveCategory(newCollection.id);
  };

  const handleDeleteCollection = (id: string) => {
    if (confirm('Are you sure you want to delete this collection? Prompts inside will remain in "Saved Templates".')) {
      setCollections(prev => prev.filter(c => c.id !== id));
      setSavedPrompts(prev => prev.map(p => p.collectionId === id ? { ...p, collectionId: undefined } : p));
      setActiveCategory('saved');
    }
  };

  const handleRenameCollection = (id: string, newName: string) => {
    setCollections(prev => prev.map(c => c.id === id ? { ...c, name: newName } : c));
  };

  const handleMovePrompt = (promptId: string, targetCollectionId: string) => {
    const promptToMove = allPrompts.find(p => p.id === promptId);
    if (!promptToMove) return;

    const isAlreadySaved = savedPrompts.some(p => p.id === promptId);

    if (isAlreadySaved) {
       setSavedPrompts(prev => prev.map(p => 
         p.id === promptId ? { ...p, collectionId: targetCollectionId } : p
       ));
    } else {
       const newPrompt = { 
         ...promptToMove, 
         categoryId: 'saved',
         collectionId: targetCollectionId,
         id: `saved_${promptToMove.id}_${Date.now()}` 
       };
       setSavedPrompts(prev => [...prev, newPrompt]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 overflow-hidden">
      <TutorialOverlay 
        isOpen={showTutorial} 
        onClose={() => {
          setShowTutorial(false);
          localStorage.setItem('tutorial_completed', 'true');
        }} 
      />

      <Sidebar 
        activeCategory={activeCategory} 
        onSelectCategory={setActiveCategory}
        collections={collections}
        onCreateCollection={handleCreateCollection}
        onDeleteCollection={handleDeleteCollection}
        onRenameCollection={handleRenameCollection}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        currentView={currentView}
        onChangeView={setCurrentView}
        onOpenGenerator={() => setIsGeneratorOpen(true)}
        onMovePrompt={handleMovePrompt}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        <button 
          className="md:hidden absolute top-4 left-4 z-40 p-2 bg-white/80 backdrop-blur shadow-sm border border-slate-200 rounded-lg text-slate-500"
          onClick={() => setIsMobileSidebarOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </button>

        {currentView === 'library' ? (
          <>
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 pl-16 md:pl-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1">
                
                <div className="relative w-full max-w-xl z-20" ref={searchContainerRef}>
                  <div className="flex gap-2">
                     <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                        placeholder="Search prompts..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setShowSearchSuggestions(true);
                        }}
                        onFocus={() => setShowSearchSuggestions(true)}
                      />
                    </div>
                    
                    <div className="relative">
                      <select
                        value={selectedFormat}
                        onChange={(e) => setSelectedFormat(e.target.value)}
                        className="appearance-none h-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-white transition-colors"
                      >
                        {uniqueFormats.map(f => (
                          <option key={f} value={f}>{f === 'All' ? 'All Formats' : f}</option>
                        ))}
                      </select>
                      <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {showSearchSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> Search Suggestions
                      </div>
                      {suggestions.map((item, idx) => (
                        <button
                          key={idx}
                          className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between group transition-colors border-b border-slate-50 last:border-0"
                          onClick={() => {
                            setSearchQuery(item.text);
                            setShowSearchSuggestions(false);
                          }}
                        >
                          <div className="flex items-center gap-3">
                             {item.type === 'Tag' ? <TagIcon className="w-4 h-4 text-slate-400" /> : <FileText className="w-4 h-4 text-slate-400" />}
                             <span className="font-medium group-hover:text-blue-600 transition-colors">{item.text}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase bg-slate-100 px-2 py-0.5 rounded transition-all group-hover:bg-blue-100 group-hover:text-blue-600">
                            {item.type}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-3">
                 <a 
                  href="https://notebooklm.google.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                 >
                   Open NotebookLM
                   <Sparkles className="w-4 h-4" />
                 </a>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <div className="max-w-6xl mx-auto">
                
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                      {activeCategoryData?.label || 'Unknown Category'}
                    </h2>
                    {selectedFormat !== 'All' && (
                       <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                         {selectedFormat}
                       </span>
                    )}
                  </div>
                  <p className="text-slate-500">
                    {activeCategory === 'all' 
                      ? `${allPrompts.length}+ context-engineered prompts ready to copy.` 
                      : activeCategoryData?.description}
                  </p>
                </div>

                {filteredPrompts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPrompts.map((prompt) => (
                      <PromptCard 
                        key={prompt.id} 
                        prompt={prompt}
                        onClick={() => setSelectedPrompt(prompt)}
                        onQuickCopy={(e, text) => handleQuickCopy(e, text, prompt.id)}
                        isCopied={copiedId === prompt.id}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                    <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-1">No prompts found</h3>
                    <p className="text-slate-500">Try adjusting your search terms or filters.</p>
                    {(activeCategory !== 'all' || selectedFormat !== 'All') && (
                      <button 
                        onClick={() => {
                          setActiveCategory('all');
                          setSelectedFormat('All');
                          setSearchQuery('');
                        }}
                        className="mt-4 text-blue-600 font-medium hover:underline"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                )}
                
                <footer className="mt-12 text-center text-xs text-slate-400 pb-4">
                  <p>Prompts designed using the R-I-S-E Framework (Role, Input, Stop, Example)</p>
                </footer>
              </div>
            </div>
            
            <PromptModal 
              prompt={selectedPrompt} 
              collections={collections}
              onUpdatePrompt={handleUpdatePrompt}
              onClose={() => setSelectedPrompt(null)} 
            />
          </>
        ) : (
          <Workbench />
        )}
        
        <PromptGenerator 
          isOpen={isGeneratorOpen} 
          collections={collections}
          onClose={() => setIsGeneratorOpen(false)} 
          onSave={handleSaveCustomPrompt}
        />
      </main>
    </div>
  );
}

export default App;