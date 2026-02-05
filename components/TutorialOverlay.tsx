import React, { useState } from 'react';
import { X, ChevronRight, Check, Book, Layers, Sparkles, BrainCircuit } from 'lucide-react';

interface TutorialOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      icon: <Book className="w-8 h-8 text-blue-500" />,
      title: "Welcome to Prompt Lib",
      description: "Access 200+ curated prompts designed specifically for NotebookLM. Optimized using the R-I-S-E framework to get the best results."
    },
    {
      icon: <Layers className="w-8 h-8 text-indigo-500" />,
      title: "Collections & Tags",
      description: "Organize your workflow. Create custom collections in the sidebar and drag-and-drop prompts to save them. Add tags to find things faster."
    },
    {
      icon: <Sparkles className="w-8 h-8 text-purple-500" />,
      title: "Workbench Mode",
      description: "Switch to the Workbench to edit prompts, manage citations, and simulate collaborative sessions before using them in NotebookLM."
    },
    {
      icon: <BrainCircuit className="w-8 h-8 text-emerald-500" />,
      title: "Smart Generation",
      description: "Can't find what you need? Use the Prompt Generator to create custom templates tailored to your specific topic and audience."
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Progress Bar */}
        <div className="h-1 bg-slate-100 w-full">
          <div 
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-300 hover:text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
            {steps[step].icon}
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            {steps[step].title}
          </h2>
          
          <p className="text-slate-500 leading-relaxed mb-8">
            {steps[step].description}
          </p>

          <div className="flex items-center gap-3">
            <div className="flex gap-1.5 flex-1 justify-center">
              {steps.map((_, i) => (
                <div 
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${i === step ? 'bg-slate-800' : 'bg-slate-200'}`}
                />
              ))}
            </div>
            
            <button
              onClick={handleNext}
              className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 hover:shadow-slate-300 ml-auto"
            >
              {step === steps.length - 1 ? (
                <>Get Started <Check className="w-4 h-4" /></>
              ) : (
                <>Next <ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay;