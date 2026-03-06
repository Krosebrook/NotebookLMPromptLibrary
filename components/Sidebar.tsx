import React, { useState } from 'react';
import { 
  Headphones, 
  Video, 
  BrainCircuit, 
  FileText, 
  Layers, 
  HelpCircle, 
  PieChart, 
  Presentation, 
  Table, 
  LayoutGrid,
  Sparkles,
  X,
  Wand2,
  Bookmark,
  Folder,
  Plus,
  Trash2,
  Edit2,
  Check
} from 'lucide-react';
import { CATEGORIES } from '../constants.ts';
import { IconName, Collection } from '../types.ts';

interface SidebarProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  collections: Collection[];
  onCreateCollection: (name: string) => void;
  onDeleteCollection: (id: string) => void;
  onRenameCollection: (id: string, newName: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
  currentView: 'library' | 'workbench';
  onChangeView: (view: 'library' | 'workbench') => void;
  onOpenGenerator: () => void;
  onMovePrompt?: (promptId: string, collectionId: string) => void;
}

const getIcon = (name: IconName, className: string) => {
  const icons: Record<IconName, React.ReactNode> = {
    Headphones: <Headphones className={className} />,
    Video: <Video className={className} />,
    BrainCircuit: <BrainCircuit className={className} />,
    FileText: <FileText className={className} />,
    Layers: <Layers className={className} />,
    HelpCircle: <HelpCircle className={className} />,
    PieChart: <PieChart className={className} />,
    Presentation: <Presentation className={className} />,
    Table: <Table className={className} />,
    All: <LayoutGrid className={className} />,
    Sparkles: <Sparkles className={className} />,
  };
  return icons[name] || <LayoutGrid className={className} />;
};

const Sidebar: React.FC<SidebarProps> = ({ 
  activeCategory, 
  onSelectCategory, 
  collections,
  onCreateCollection,
  onDeleteCollection,
  onRenameCollection,
  isMobileOpen, 
  setIsMobileOpen,
  currentView,
  onChangeView,
  onOpenGenerator,
  onMovePrompt
}) => {
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  
  const [showNewBadge, setShowNewBadge] = useState(() => {
    return !localStorage.getItem('workbench_badge_dismissed');
  });

  const handleSubmitCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCollectionName.trim()) {
      onCreateCollection(newCollectionName.trim());
      setNewCollectionName('');
      setIsCreatingCollection(false);
    }
  };

  const handleRenameSubmit = (id: string) => {
    if (editingName.trim()) {
      onRenameCollection(id, editingName.trim());
      setEditingCollectionId(null);
    }
  };

  const handleDragOver = (e: React.DragEvent, collectionId: string) => {
    e.preventDefault();
    setDragOverId(collectionId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent, collectionId: string) => {
    e.preventDefault();
    setDragOverId(null);
    const promptId = e.dataTransfer.getData('text/plain');
    if (promptId && onMovePrompt) {
      onMovePrompt(promptId, collectionId);
    }
  };
  
  const dismissBadge = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowNewBadge(false);
    localStorage.setItem('workbench_badge_dismissed', 'true');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ease-out ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 shadow-2xl md:shadow-none
        transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1)
        md:translate-x-0 md:static md:w-64 md:block flex flex-col
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 shrink-0">
            <div 
              className="flex items-center gap-2 cursor-pointer group select-none" 
              onClick={() => { 
                onChangeView('library'); 
                setIsMobileOpen(false); 
              }}
            >
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg group-hover:shadow-md transition-all duration-200">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-slate-800 leading-tight">Prompt Lib</h1>
                <p className="text-xs text-slate-500 font-medium">for NotebookLM</p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <div className="space-y-1 mb-8 shrink-0">
            <button
              onClick={() => {
                onChangeView('library');
                setIsMobileOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 select-none
                ${currentView === 'library' 
                  ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <LayoutGrid className={`w-4 h-4 ${currentView === 'library' ? 'text-blue-600' : 'text-slate-400'}`} />
              Library
            </button>
            
            <div className="relative">
              <button
                onClick={() => {
                  onChangeView('workbench');
                  setIsMobileOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group select-none
                  ${currentView === 'workbench' 
                    ? 'bg-purple-50 text-purple-700 shadow-sm ring-1 ring-purple-100' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <Sparkles className={`w-4 h-4 ${currentView === 'workbench' ? 'text-purple-600' : 'text-slate-400'}`} />
                <span>Workbench</span>
              </button>
              
              {showNewBadge && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full shadow-sm animate-in fade-in zoom-in duration-300">
                  <span className="text-[10px] font-bold tracking-wide">NEW</span>
                  <button 
                    onClick={dismissBadge}
                    className="hover:bg-purple-200 rounded-full p-0.5 transition-colors focus:outline-none"
                    aria-label="Dismiss badge"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            
            <button
              onClick={() => {
                onOpenGenerator();
                setIsMobileOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 select-none"
            >
              <Wand2 className="w-4 h-4 text-slate-400" />
              Prompt Generator
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto scrollbar-hide -mx-2 px-2 pb-4">
            {currentView === 'library' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                
                {/* My Collection Section */}
                <div>
                  <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">My Collection</p>
                  <button
                      onClick={() => {
                        onSelectCategory('saved');
                        setIsMobileOpen(false);
                      }}
                      onDragOver={(e) => handleDragOver(e, 'saved')}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, 'saved')}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                        ${dragOverId === 'saved' ? 'bg-blue-50 ring-2 ring-blue-300 scale-[1.02]' : ''}
                        ${activeCategory === 'saved' 
                          ? 'bg-slate-100 text-slate-900' 
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
                      `}
                    >
                      <Bookmark className={`w-4 h-4 ${activeCategory === 'saved' ? 'text-slate-600' : 'text-slate-400'}`} />
                      Saved Templates
                    </button>

                  <div className="mt-2">
                    <div className="flex items-center justify-between px-3 py-2 group cursor-pointer hover:bg-slate-50 rounded-lg" onClick={() => setIsCreatingCollection(true)}>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-slate-600">Folders</span>
                      <button 
                        className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition-colors"
                        title="New Folder"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {isCreatingCollection && (
                      <form onSubmit={handleSubmitCollection} className="px-3 mb-2 animate-in fade-in slide-in-from-top-1">
                        <input
                          type="text"
                          autoFocus
                          placeholder="Folder name..."
                          className="w-full text-xs px-2 py-1.5 border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-100"
                          value={newCollectionName}
                          onChange={(e) => setNewCollectionName(e.target.value)}
                          onBlur={() => !newCollectionName && setIsCreatingCollection(false)}
                        />
                      </form>
                    )}

                    <div className="space-y-0.5">
                      {collections.map((collection) => (
                        <div 
                            key={collection.id} 
                            className={`
                              group flex items-center justify-between pr-2 rounded-lg transition-all duration-200
                              ${dragOverId === collection.id ? 'bg-blue-50 ring-2 ring-blue-300 scale-[1.02]' : ''}
                              ${activeCategory === collection.id ? 'bg-slate-100' : ''}
                            `}
                            onDragOver={(e) => handleDragOver(e, collection.id)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, collection.id)}
                        >
                          {editingCollectionId === collection.id ? (
                              <div className="flex-1 flex items-center gap-1 px-2 py-1 bg-white border border-blue-200 rounded-lg mx-1 my-0.5">
                                <input
                                  type="text"
                                  autoFocus
                                  value={editingName}
                                  onChange={(e) => setEditingName(e.target.value)}
                                  onBlur={() => handleRenameSubmit(collection.id)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit(collection.id)}
                                  className="flex-1 text-xs outline-none text-slate-700 font-medium"
                                />
                                <button onClick={() => handleRenameSubmit(collection.id)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                                  <Check className="w-3 h-3" />
                                </button>
                              </div>
                          ) : (
                              <>
                                <button
                                  onClick={() => {
                                    onSelectCategory(collection.id);
                                    setIsMobileOpen(false);
                                  }}
                                  className={`
                                    flex-1 flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left truncate
                                    ${activeCategory === collection.id ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}
                                  `}
                                >
                                  <Folder className={`w-4 h-4 flex-shrink-0 ${activeCategory === collection.id ? 'fill-blue-100 text-blue-600' : 'fill-slate-50 text-slate-400'}`} />
                                  <span className="truncate">{collection.name}</span>
                                </button>
                                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingCollectionId(collection.id);
                                      setEditingName(collection.name);
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                                    title="Rename"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDeleteCollection(collection.id);
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Categories Section */}
                <div>
                  <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Browse Categories</p>
                  <div className="space-y-0.5">
                    {CATEGORIES.filter(c => c.id !== 'all').map((category) => {
                      const isActive = activeCategory === category.id;
                      return (
                        <button
                          key={category.id}
                          onClick={() => {
                            onSelectCategory(category.id);
                            setIsMobileOpen(false);
                          }}
                          className={`
                            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                            ${isActive 
                              ? 'bg-slate-100 text-slate-900' 
                              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
                          `}
                        >
                          {getIcon(category.iconName as IconName, `w-4 h-4 ${isActive ? 'text-slate-600' : 'text-slate-400'}`)}
                          {category.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {currentView === 'workbench' && (
               <div className="space-y-4 px-3 animate-in fade-in slide-in-from-left-4 duration-300">
                 <div className="bg-purple-50 rounded-lg p-4 border border-purple-100 shadow-sm">
                   <h4 className="text-sm font-bold text-purple-900 mb-2">Collaborative Mode</h4>
                   <p className="text-xs text-purple-700 leading-relaxed mb-4">
                     This is a mock environment to test prompts with simulated real-time editing and citation tools.
                   </p>
                   
                   <div className="text-[10px] text-purple-800 bg-white/60 p-3 rounded border border-purple-200/50 space-y-1.5">
                     <p className="font-bold text-purple-900 uppercase tracking-wider mb-2">Keyboard Shortcuts</p>
                     <div className="flex justify-between items-center"><span className="font-medium">Save</span> <kbd className="bg-white px-1.5 py-0.5 rounded border border-purple-200 font-mono text-[9px]">Cmd+S</kbd></div>
                     <div className="flex justify-between items-center"><span className="font-medium">Undo</span> <kbd className="bg-white px-1.5 py-0.5 rounded border border-purple-200 font-mono text-[9px]">Cmd+Z</kbd></div>
                     <div className="flex justify-between items-center"><span className="font-medium">Redo</span> <kbd className="bg-white px-1.5 py-0.5 rounded border border-purple-200 font-mono text-[9px]">Cmd+Sh+Z</kbd></div>
                     <div className="flex justify-between items-center"><span className="font-medium">Toggle Preview</span> <kbd className="bg-white px-1.5 py-0.5 rounded border border-purple-200 font-mono text-[9px]">Cmd+I</kbd></div>
                   </div>
                 </div>
               </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-6 border-t border-slate-100 shrink-0">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm mb-2">R-I-S-E Framework</h3>
              <ul className="text-xs text-slate-500 space-y-1.5">
                <li className="flex gap-2"><strong className="text-slate-700 min-w-[12px]">R</strong>ole: Who AI acts as</li>
                <li className="flex gap-2"><strong className="text-slate-700 min-w-[12px]">I</strong>nput: Sources to use</li>
                <li className="flex gap-2"><strong className="text-slate-700 min-w-[12px]">S</strong>top: Boundaries</li>
                <li className="flex gap-2"><strong className="text-slate-700 min-w-[12px]">E</strong>xample: Output format</li>
              </ul>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;