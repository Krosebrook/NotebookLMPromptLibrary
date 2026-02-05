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
  Trash2
} from 'lucide-react';
import { CATEGORIES } from '../constants';
import { IconName, Collection } from '../types';

interface SidebarProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  collections: Collection[];
  onCreateCollection: (name: string) => void;
  onDeleteCollection: (id: string) => void;
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
  isMobileOpen, 
  setIsMobileOpen,
  currentView,
  onChangeView,
  onOpenGenerator,
  onMovePrompt
}) => {
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleSubmitCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCollectionName.trim()) {
      onCreateCollection(newCollectionName.trim());
      setNewCollectionName('');
      setIsCreatingCollection(false);
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

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-all duration-300 ease-in-out ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-out shadow-2xl md:shadow-none
        md:translate-x-0 md:static md:w-64 md:block
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div 
              className="flex items-center gap-2 cursor-pointer group" 
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
            
            {/* Close button for mobile */}
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1 mb-8">
            <button
              onClick={() => {
                onChangeView('library');
                setIsMobileOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${currentView === 'library' 
                  ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <LayoutGrid className={`w-4 h-4 ${currentView === 'library' ? 'text-blue-600' : 'text-slate-400'}`} />
              Library
            </button>
            <button
              onClick={() => {
                onChangeView('workbench');
                setIsMobileOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${currentView === 'workbench' 
                  ? 'bg-purple-50 text-purple-700 shadow-sm ring-1 ring-purple-100' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <Sparkles className={`w-4 h-4 ${currentView === 'workbench' ? 'text-purple-600' : 'text-slate-400'}`} />
              Workbench <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full ml-auto shadow-sm">NEW</span>
            </button>
            
            {/* New Generator Button */}
            <button
              onClick={() => {
                onOpenGenerator();
                setIsMobileOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
            >
              <Wand2 className="w-4 h-4 text-slate-400" />
              Prompt Generator
            </button>
          </div>

          {currentView === 'library' && (
            <div className="flex-1 overflow-y-auto scrollbar-hide space-y-1 animate-in fade-in slide-in-from-left-4 duration-300">
              <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">My Collection</p>
               <button
                  onClick={() => {
                    onSelectCategory('saved');
                    setIsMobileOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${activeCategory === 'saved' 
                      ? 'bg-slate-100 text-slate-900' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
                  `}
                >
                  <Bookmark className={`w-4 h-4 ${activeCategory === 'saved' ? 'text-slate-600' : 'text-slate-400'}`} />
                  Saved Templates
                </button>

              {/* Collections Section */}
              <div className="mt-4 mb-4">
                <div className="flex items-center justify-between px-3 mb-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Collections</p>
                  <button 
                    onClick={() => setIsCreatingCollection(true)}
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
                    title="New Collection"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isCreatingCollection && (
                  <form onSubmit={handleSubmitCollection} className="px-3 mb-2">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Name..."
                      className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded focus:border-blue-500 focus:outline-none"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      onBlur={() => !newCollectionName && setIsCreatingCollection(false)}
                    />
                  </form>
                )}

                {collections.map((collection) => (
                   <div 
                      key={collection.id} 
                      className={`
                        group flex items-center justify-between pr-2 rounded-lg transition-all
                        ${dragOverId === collection.id ? 'bg-blue-50 ring-2 ring-blue-200 scale-[1.02]' : ''}
                      `}
                      onDragOver={(e) => handleDragOver(e, collection.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, collection.id)}
                   >
                     <button
                      onClick={() => {
                        onSelectCategory(collection.id);
                        setIsMobileOpen(false);
                      }}
                      className={`
                        flex-1 flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-left truncate
                        ${activeCategory === collection.id 
                          ? 'bg-slate-100 text-slate-900' 
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
                      `}
                    >
                      <Folder className={`w-4 h-4 flex-shrink-0 ${activeCategory === collection.id ? 'fill-blue-100 text-blue-600' : 'fill-slate-50 text-slate-400'}`} />
                      <span className="truncate">{collection.name}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCollection(collection.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                      title="Delete Collection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                   </div>
                ))}
              </div>

              <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-6">Categories</p>
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
          )}

          {currentView === 'workbench' && (
             <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 px-3 animate-in fade-in slide-in-from-left-4 duration-300">
               <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                 <h4 className="text-xs font-bold text-purple-800 mb-1">Collaborative Mode</h4>
                 <p className="text-xs text-purple-600 leading-relaxed mb-3">
                   Mock environment to test prompts with simulated real-time editing and citation tools.
                 </p>
                 
                 <div className="text-[10px] text-purple-700 font-medium bg-purple-100/50 p-2 rounded border border-purple-200 space-y-1">
                   <p className="font-bold text-purple-800">Shortcuts</p>
                   <div className="flex justify-between"><span>Save</span> <span>Cmd + S</span></div>
                   <div className="flex justify-between"><span>Undo</span> <span>Cmd + Z</span></div>
                   <div className="flex justify-between"><span>Redo</span> <span>Cmd + Shift + Z</span></div>
                   <div className="flex justify-between"><span>Toggle Preview</span> <span>Cmd + I</span></div>
                 </div>
               </div>
             </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm mb-1">R-I-S-E Framework</h3>
              <ul className="text-xs text-slate-500 space-y-1">
                <li><strong className="text-slate-700">R</strong>ole: Who AI acts as</li>
                <li><strong className="text-slate-700">I</strong>nput: Sources to use</li>
                <li><strong className="text-slate-700">S</strong>top: Boundaries</li>
                <li><strong className="text-slate-700">E</strong>xample: Output format</li>
              </ul>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;