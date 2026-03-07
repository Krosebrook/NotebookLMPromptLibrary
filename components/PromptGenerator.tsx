import React, { useState } from 'react';
import { X, Wand2, Copy, Check, RefreshCw, Save, Tag, Folder, Sparkles, AlertCircle } from 'lucide-react';
import { CATEGORIES } from '../constants.ts';
import { PromptData, Collection } from '../types.ts';
import { GoogleGenAI } from '@google/genai';

interface PromptGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (prompt: PromptData) => void;
  collections?: Collection[];
}

const FRAMEWORKS: Record<string, string> = {
  'R-I-S-E': `You MUST follow the R-I-S-E framework:
- ROLE: Define a specific persona for the AI.
- INPUT: Specify how the AI should use the uploaded source materials.
- STOP: Set clear constraints and boundaries.
- EXAMPLE: Provide or describe the expected output format.`,
  'C-R-E-A-T-E': `You MUST follow the C-R-E-A-T-E framework:
- CONTEXT: Provide background information.
- REQUEST: State the specific task.
- EXPLANATION: Explain the purpose or goal.
- ACTION: Detail the steps to take.
- TONE: Specify the voice and style.
- EXTRAS: Add any additional constraints or details.`,
  'T-R-A-C-E': `You MUST follow the T-R-A-C-E framework:
- TASK: Define the specific task.
- REQUEST: State what you need the AI to do.
- ACTION: Detail the steps the AI should take.
- CONTEXT: Provide background information.
- EXAMPLE: Give an example of the desired output.`,
  'D-E-P-T-H': `You MUST follow the D-E-P-T-H framework:
- DETAIL: Provide specific details about the topic.
- EXPLAIN: Explain the core concepts or background.
- PURPOSE: State the goal of the prompt.
- TONE: Describe the desired attitude or voice.
- HELPFUL ADDITIONS: Provide any extra context or constraints.`,
  'V-I-S-T-A-D-E-L': `You MUST follow the V-I-S-T-A-D-E-L framework:
- VOICE: Define the persona.
- INFORMATION: Provide necessary background context.
- STEPS: Outline the sequence of actions.
- TONE: Specify the emotional or professional quality.
- AUDIENCE: Identify the target reader.
- DELIVERABLE: Describe the expected output format.
- EXTRAS: Add any constraints or specific inclusions.
- LENGTH: Specify the word count or size limit.`,
  'A-P-E': `You MUST follow the A-P-E framework:
- ACTION: Define the job or task to be done.
- PURPOSE: Discuss the intention or goal.
- EXPECTATION: State the desired outcome or format.`,
  'C-O-A-S-T': `You MUST follow the C-O-A-S-T framework:
- CONTEXT: Provide the background.
- OBJECTIVE: State the goal.
- AUDIENCE: Define the target reader.
- STYLE: Specify the writing style.
- TONE: Describe the emotional quality.`,
  'R-A-C-E': `You MUST follow the R-A-C-E framework:
- ROLE: Define the persona.
- ACTION: State the task.
- CONTEXT: Provide background.
- EXPECTATION: Describe the desired output.`,
  'T-R-I-C-K': `You MUST follow the T-R-I-C-K framework:
- TASK: What needs to be done.
- ROLE: Who the AI should act as.
- INTENT: The purpose of the task.
- CONTEXT: Background information.
- KNOWLEDGE: Specific information the AI should use.`,
  'R-O-S-E-S': `You MUST follow the R-O-S-E-S framework:
- ROLE: Define the persona.
- OBJECTIVE: State the main goal.
- SCENARIO: Describe the situation or context.
- EXPECTED SOLUTION: Define the format and criteria for the result.
- STEPS: Outline the sequence of actions to take.`,
  'C-A-R-E': `You MUST follow the C-A-R-E framework:
- CONTEXT: Provide the background or situation.
- ACTION: Describe what needs to be done.
- RESULT: State the desired outcome.
- EXAMPLE: Provide an example to guide the output.`,
  'R-O-S-E': `You MUST follow the R-O-S-E framework:
- ROLE: Define the persona.
- OBJECTIVE: State the main goal.
- SCENARIO: Describe the situation or context.
- EXPECTED OUTPUT: Define the format and criteria for the result.`,
  'P-A-S': `You MUST follow the P-A-S framework:
- PROBLEM: Identify the core issue.
- AGITATE: Highlight the consequences of the problem.
- SOLUTION: Provide the resolution or answer.`,
  'A-I-D-A': `You MUST follow the A-I-D-A framework:
- ATTENTION: Hook the reader.
- INTEREST: Provide compelling information.
- DESIRE: Create a want or need.
- ACTION: Call the reader to take a specific step.`,
  'S-T-A-R': `You MUST follow the S-T-A-R framework:
- SITUATION: Set the scene.
- TASK: Describe the challenge.
- ACTION: Detail the steps taken.
- RESULT: Explain the outcome.`,
  'R-T-F': `You MUST follow the R-T-F framework:
- ROLE: Specify the persona.
- TASK: Define the objective.
- FORMAT: Detail how the output should be structured.`,
  'B-A-B': `You MUST follow the B-A-B framework:
- BEFORE: Describe the current situation.
- AFTER: Describe the desired future state.
- BRIDGE: Explain how to get from Before to After.`,
  'P-E-E-L': `You MUST follow the P-E-E-L framework:
- POINT: State the main idea.
- EVIDENCE: Provide supporting facts or examples.
- EXPLANATION: Explain how the evidence supports the point.
- LINK: Connect back to the main topic or next point.`,
  'T-A-G': `You MUST follow the T-A-G framework:
- TASK: Define what needs to be done.
- ACTION: Specify the steps to achieve it.
- GOAL: State the ultimate objective.`,
  'C-L-E-A-R': `You MUST follow the C-L-E-A-R framework:
- CONTEXT: Provide background.
- LENGTH: Specify the desired output length.
- EXPLANATION: Detail the purpose.
- ACTION: State the specific task.
- ROLE: Define the persona.`,
  'E-R-A': `You MUST follow the E-R-A framework:
- EXPECTATION: State the desired outcome.
- ROLE: Define the persona.
- ACTION: Specify the steps to take.`,
  'S-C-O-P-E': `You MUST follow the S-C-O-P-E framework:
- SCENARIO: Describe the situation.
- CONTEXT: Provide background details.
- OBJECTIVE: State the goal.
- PARAMETERS: Define constraints and boundaries.
- EXTRAS: Add any additional requirements.`
};

const PromptGenerator: React.FC<PromptGeneratorProps> = ({ isOpen, onClose, onSave, collections = [] }) => {
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState('Audio Overview');
  const [audience, setAudience] = useState('General Audience');
  const [tone, setTone] = useState('Professional');
  const [framework, setFramework] = useState('R-I-S-E');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const [tags, setTags] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let frameworkInstructions = FRAMEWORKS[framework] || `You MUST follow the ${framework} framework to structure the prompt effectively.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a high-quality NotebookLM prompt for the topic: "${topic}".
Format required: ${format}
Audience: ${audience}
Tone: ${tone}

${frameworkInstructions}

Return ONLY the prompt text, no conversational filler.`,
        config: {
          systemInstruction: `You are a world-class Prompt Engineer specializing in Google NotebookLM. Your prompts are structured, precise, and leverage the ${framework} framework to eliminate hallucinations and maximize depth.`,
          temperature: 0.7,
        }
      });

      const text = response.text;
      if (text) {
        setGeneratedPrompt(text.trim());
      } else {
        throw new Error("No content received from AI.");
      }
    } catch (err: unknown) {
      console.error("Generation failed:", err);
      setError("Failed to generate prompt. Please check your connection or try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt).catch(() => {});
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveToLibrary = () => {
    if (onSave) {
      const parsedTags = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
      
      const newPrompt: PromptData = {
        id: crypto.randomUUID(),
        categoryId: 'saved',
        title: `${topic} (${format})`,
        format: format,
        bestFor: audience,
        promptText: generatedPrompt,
        exampleSources: 'Custom User Sources',
        tip: 'Generated via AI Prompt Generator',
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
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">AI Prompt Generator</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {!generatedPrompt ? (
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Topic or Source Material
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Quantum Computing Basics, Clinical Trial Results"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.label}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Professional">Professional</option>
                    <option value="Academic">Academic</option>
                    <option value="Casual">Casual</option>
                    <option value="Highly Critical">Highly Critical</option>
                    <option value="Socratic">Socratic</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., C-Level Execs"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Framework
                  </label>
                  <select
                    value={framework}
                    onChange={(e) => setFramework(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {Object.keys(FRAMEWORKS).map(fw => (
                      <option key={fw} value={fw}>{fw}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!topic || isGenerating}
                  className={`
                    w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold transition-all
                    ${!topic || isGenerating 
                      ? 'bg-slate-300 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100'}
                  `}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      AI is Crafting Your Prompt...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Generate with Gemini
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 relative">
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={handleCopy}
                    className={`
                      p-2 rounded-lg transition-all shadow-sm
                      ${isCopied ? 'bg-green-600 text-white' : 'bg-white text-slate-400 hover:text-blue-600 border border-slate-200'}
                    `}
                    title="Copy to clipboard"
                  >
                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-blue-500" /> {framework} Structured Prompt
                </h3>
                <pre className="whitespace-pre-wrap font-sans text-slate-800 text-sm leading-relaxed pr-8 max-h-64 overflow-y-auto">
                  {generatedPrompt}
                </pre>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-3">
                <h4 className="text-xs font-semibold text-slate-400 uppercase">Save to Library</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Tags
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="work, report"
                      className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                      <Folder className="w-3 h-3" /> Collection
                    </label>
                    <select
                      value={selectedCollectionId}
                      onChange={(e) => setSelectedCollectionId(e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 bg-white"
                    >
                      <option value="">None</option>
                      {collections.map(col => (
                        <option key={col.id} value={col.id}>{col.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 text-sm font-medium transition-colors"
                >
                  Start Over
                </button>
                
                {onSave && (
                   <button
                    onClick={handleSaveToLibrary}
                    disabled={isSaved}
                    className={`
                      flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                      ${isSaved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}
                    `}
                  >
                    {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {isSaved ? 'Saved!' : 'Save to My Collection'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptGenerator;