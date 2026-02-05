
export interface PromptData {
  id: string;
  categoryId: string;
  title: string;
  format: string;
  bestFor: string;
  promptText: string;
  exampleSources: string;
  tip: string;
  tags?: string[];
  collectionId?: string;
}

export interface Collection {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}

export interface Category {
  id: string;
  label: string;
  iconName: string;
  description: string;
}

export type IconName = 
  | 'Headphones' 
  | 'Video' 
  | 'BrainCircuit' 
  | 'FileText' 
  | 'Layers' 
  | 'HelpCircle' 
  | 'PieChart' 
  | 'Presentation' 
  | 'Table'
  | 'All'
  | 'Sparkles'; // Added Sparkles for Workbench

// New types for Workbench
export interface Source {
  id: string;
  type: 'website' | 'paper' | 'book' | 'manual';
  title: string;
  url?: string;
  author?: string;
  year?: string;
  citationId: number;
}

export interface Collaborator {
  id: string;
  name: string;
  role: 'editor' | 'viewer' | 'owner';
  color: string;
  initials: string;
  isActive: boolean;
}

export interface NoteVersion {
  id: string;
  timestamp: string;
  author: string;
  content: string;
}
