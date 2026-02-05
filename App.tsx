import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import PromptCard from './components/PromptCard';
import PromptModal from './components/PromptModal';
import Workbench from './components/Workbench';
import PromptGenerator from './components/PromptGenerator';
import { PROMPTS, CATEGORIES } from './constants';
import { PromptData, Collection } from './types';
import { Search, Menu, Sparkles } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<'library' | 'workbench'>('library');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<PromptData | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load saved prompts from localStorage
  const [savedPrompts, setSavedPrompts] = useState<PromptData[]>(() => {
    const saved = localStorage.getItem('notebook_saved_prompts');
    return saved ? JSON.parse(saved) : [];
  });

  // Load collections from localStorage
  const [collections, setCollections] = useState<Collection[]>(() => {
    const saved = localStorage.getItem('notebook_collections');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist saved prompts
  useEffect(() => {
    localStorage.setItem('notebook_saved_prompts', JSON.stringify(savedPrompts));
  }, [savedPrompts]);

  // Persist collections
  useEffect(() => {
    localStorage.setItem('notebook_collections', JSON.stringify(collections));
  }, [collections]);

  // Determine header text based on selection
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

      const matchesSearch = 
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.bestFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.promptText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prompt.tags && prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, activeCollection, searchQuery, allPrompts]);

  const handleQuickCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveCustomPrompt = (prompt: PromptData) => {
    setSavedPrompts(prev => [prompt, ...prev]);
    // Switch to the collection if one was assigned, otherwise saved view
    if (prompt.collectionId) {
      setActiveCategory(prompt.collectionId);
    } else {
      setActiveCategory('saved');
    }
    setCurrentView('library');
  };

  const handleUpdatePrompt = (updatedPrompt: PromptData) => {
    // Check if it's a saved prompt or a built-in one
    const isSaved = savedPrompts.some(p => p.id === updatedPrompt.id);
    
    if (isSaved) {
      setSavedPrompts(prev => prev.map(p => p.id === updatedPrompt.id ? updatedPrompt : p));
    } else {
      // If user edits a built-in prompt (like adding a tag), we save it as a new copy in their library 
      // to avoid mutating the constant data, or we could just locally override.
      const newSavedPrompt = { ...updatedPrompt, categoryId: 'saved' };
      setSavedPrompts(prev => [newSavedPrompt, ...prev]);
    }
    setSelectedPrompt(updatedPrompt);
  };

  const handleCreateCollection = (name: string) => {
    const newCollection: Collection = {
      id: `col_${Date.now()}`,
      name,
      color: 'bg-blue-500', // Default color, could be random
      createdAt: Date.now()
    };
    setCollections(prev => [...prev, newCollection]);
    setActiveCategory(newCollection.id);
  };

  const handleDeleteCollection = (id: string) => {
    if (confirm('Are you sure you want to delete this collection? Prompts inside will remain in "Saved Templates".')) {
      setCollections(prev => prev.filter(c => c.id !== id));
      // Remove collectionId from prompts in this collection
      setSavedPrompts(prev => prev.map(p => p.collectionId === id ? { ...p, collectionId: undefined } : p));
      setActiveCategory('saved');
    }
  };

  // Drag and Drop Logic
  const handleMovePrompt = (promptId: string, targetCollectionId: string) => {
    const promptToMove = allPrompts.find(p => p.id === promptId);
    if (!promptToMove) return;

    const isAlreadySaved = savedPrompts.some(p => p.id === promptId);

    if (isAlreadySaved) {
       // Update existing saved prompt
       setSavedPrompts(prev => prev.map(p => 
         p.id === promptId ? { ...p, collectionId: targetCollectionId } : p
       ));
    } else {
       // Create a copy of the built-in prompt in the user's library
       const newPrompt = { 
         ...promptToMove, 
         categoryId: 'saved',
         collectionId: targetCollectionId,
         // Ensure unique ID if cloning built-in to avoid conflicts if they drag it multiple times
         id: `saved_${promptToMove.id}_${Date.now()}` 
       };
       setSavedPrompts(prev => [...prev, newPrompt]);
    }
    // Optional: Switch view to target collection to show success
    // setActiveCategory(targetCollectionId);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 overflow-hidden">
      <Sidebar 
        activeCategory={activeCategory} 
        onSelectCategory={setActiveCategory}
        collections={collections}
        onCreateCollection={handleCreateCollection}
        onDeleteCollection={handleDeleteCollection}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        currentView={currentView}
        onChangeView={setCurrentView}
        onOpenGenerator={() => setIsGeneratorOpen(true)}
        onMovePrompt={handleMovePrompt}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        {/* Mobile Menu Button - Floating for Workbench view */}
        <button 
          className="md:hidden absolute top-4 left-4 z-40 p-2 bg-white/80 backdrop-blur shadow-sm border border-slate-200 rounded-lg text-slate-500"
          onClick={() => setIsMobileSidebarOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </button>

        {currentView === 'library' ? (
          <>
            {/* Top Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 pl-16 md:pl-6">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative w-full max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                    placeholder="Search prompts by title, tag, or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
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

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <div className="max-w-6xl mx-auto">
                
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    {activeCategoryData?.label || 'Unknown Category'}
                  </h2>
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
                    <p className="text-slate-500">Try adjusting your search terms or category.</p>
                    {activeCategory !== 'all' && (
                      <button 
                        onClick={() => setActiveCategory('all')}
                        className="mt-4 text-blue-600 font-medium hover:underline"
                      >
                        View all categories
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
        
        {/* Global Prompt Generator Modal */}
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