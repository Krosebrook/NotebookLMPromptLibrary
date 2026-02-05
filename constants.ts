import { Category, PromptData } from './types';

export const CATEGORIES: Category[] = [
  { id: 'all', label: 'All Prompts', iconName: 'All', description: 'Browse the entire collection' },
  { id: 'meta', label: 'Meta Prompts', iconName: 'Sparkles', description: 'Prompts to generate other prompts' },
  { id: 'audio', label: 'Audio Overview', iconName: 'Headphones', description: 'Deep dives, podcasts, and summaries' },
  { id: 'video', label: 'Video Overview', iconName: 'Video', description: 'Scripts for visual content' },
  { id: 'mindmap', label: 'Mind Map', iconName: 'BrainCircuit', description: 'Visualizing connections' },
  { id: 'report', label: 'Reports', iconName: 'FileText', description: 'Formal documents and analysis' },
  { id: 'flashcards', label: 'Flashcards', iconName: 'Layers', description: 'Study aids and memorization' },
  { id: 'quiz', label: 'Quiz', iconName: 'HelpCircle', description: 'Assessment and testing' },
  { id: 'infographic', label: 'Infographic', iconName: 'PieChart', description: 'Visual data representation' },
  { id: 'slide', label: 'Slide Deck', iconName: 'Presentation', description: 'Presentations and pitches' },
  { id: 'table', label: 'Data Table', iconName: 'Table', description: 'Structured data organization' },
];

export const PROMPTS: PromptData[] = [
  // --- META PROMPTS ---
  {
    id: 'm.1',
    categoryId: 'meta',
    title: 'The R-I-S-E Architect',
    format: 'Meta Prompt',
    bestFor: 'Creating structured prompts for any use case',
    promptText: `Act as a Prompt Engineering Expert.
I need you to generate a prompt for NotebookLM using the R-I-S-E framework (Role, Input, Stop, Example).
Target Task: [Describe your goal]
Audience: [Describe the audience]
Sources available: [Describe your source docs]
Output: A structured prompt I can paste into NotebookLM.`,
    exampleSources: 'N/A',
    tip: 'Use this to create high-quality prompts for specific needs.'
  },
  {
    id: 'm.2',
    categoryId: 'meta',
    title: 'The Persona Generator',
    format: 'Meta Prompt',
    bestFor: 'Defining specific roles for the AI',
    promptText: `Act as a Character Designer.
Create a detailed "Role" definition for NotebookLM to adopt when analyzing [Topic/Document].
Include: specific tone of voice, expertise level, biases to avoid, and a "catchphrase" or style guide for the output.
The goal is to make the AI sound exactly like a [Specific Job Title].`,
    exampleSources: 'Job descriptions, character bios',
    tip: 'Paste the result at the start of your main prompt.'
  },
  {
    id: 'm.3',
    categoryId: 'meta',
    title: 'The Constraint Optimizer',
    format: 'Meta Prompt',
    bestFor: 'Preventing hallucinations and staying on track',
    promptText: `Act as a Logic Gatekeeper.
Write a set of "Stop" commands (constraints) for a NotebookLM prompt about [Topic].
Ensure the AI is strictly forbidden from: [List things to avoid, e.g., external links, opinionated language, specific formats].
Phrasing should be authoritative and clear.`,
    exampleSources: 'Compliance docs, brand guidelines',
    tip: 'Crucial for regulatory or factual reporting.'
  },
  {
    id: 'm.4',
    categoryId: 'meta',
    title: 'The Few-Shot Example Creator',
    format: 'Meta Prompt',
    bestFor: 'Teaching the AI a specific output format',
    promptText: `Act as a Data Formatter.
I need to teach NotebookLM to output data in this specific format: [Describe format or paste snippet].
Generate 3 distinct "Input -> Output" examples I can include in my prompt to demonstrate this pattern clearly to the AI.`,
    exampleSources: 'Existing reports, template files',
    tip: 'Providing examples increases accuracy by 30%+.'
  },
  {
    id: 'm.5',
    categoryId: 'meta',
    title: 'The Socratic Tutor Builder',
    format: 'Meta Prompt',
    bestFor: 'Creating educational prompts that ask questions',
    promptText: `Act as a Pedagogy Expert.
Write a prompt that instructs NotebookLM to act as a Socratic Tutor based on [Source Material].
The prompt should ensure the AI never gives the answer directly but asks guiding questions to check the user's understanding of [Key Concept].`,
    exampleSources: 'Textbooks, lesson plans',
    tip: 'Great for active study sessions.'
  },
  {
    id: 'm.6',
    categoryId: 'meta',
    title: 'The Chain-of-Thought Architect',
    format: 'Meta Prompt',
    bestFor: 'Complex reasoning tasks',
    promptText: `Act as a Cognitive Scientist.
Write a prompt that forces NotebookLM to use "Chain of Thought" reasoning before answering a question about [Complex Topic].
Instruction: "Before providing the final answer, explicitly list the step-by-step logic and evidence from the sources used to derive the conclusion."`,
    exampleSources: 'Research papers, legal cases',
    tip: 'Reduces logic errors in complex analysis.'
  },
  {
    id: 'm.7',
    categoryId: 'meta',
    title: 'The Devil\'s Advocate Generator',
    format: 'Meta Prompt',
    bestFor: 'Stress testing arguments',
    promptText: `Act as a Critical Debater.
Write a prompt that instructs NotebookLM to analyze [My Argument/Paper] and ruthlessly identify logical fallacies, weak evidence, and potential counter-arguments.
Tone: Constructive but uncompromising.`,
    exampleSources: 'Draft essays, business proposals',
    tip: 'Use before finalizing any major document.'
  },
  {
    id: 'm.8',
    categoryId: 'meta',
    title: 'The Data Specialist',
    format: 'Meta Prompt',
    bestFor: 'Extracting structured data from text',
    promptText: `Act as a Database Administrator.
Write a prompt that instructs NotebookLM to traverse [Documents] and extract every instance of [Data Entity, e.g., Dates, Names, Costs] into a Markdown table.
Columns required: [List Columns].
Handling missing data: "Write 'N/A' - do not guess."`,
    exampleSources: 'Invoices, logs, messy reports',
    tip: 'Be very specific about table columns.'
  },
  {
    id: 'm.9',
    categoryId: 'meta',
    title: 'The Audience Adapter',
    format: 'Meta Prompt',
    bestFor: 'Rewriting content for different readers',
    promptText: `Act as a Communication Strategist.
Write a prompt that takes [Technical Source] and rewrites the executive summary for three distinct audiences:
1. A 5-year-old (ELI5)
2. A College Student (Academic)
3. A C-Level Executive (Strategic)
Define the tone and vocabulary restrictions for each.`,
    exampleSources: 'Technical whitepapers, medical journals',
    tip: 'Useful for multi-stakeholder communication.'
  },
  {
    id: 'm.10',
    categoryId: 'meta',
    title: 'The Abstract Summarizer',
    format: 'Meta Prompt',
    bestFor: 'High-level concept extraction',
    promptText: `Act as a Abstract Artist.
Write a prompt that asks NotebookLM to ignore the details and describe the "vibe," emotional arc, or underlying philosophy of [Literary Text/Transcript].
Output format: A generic, abstract summary that avoids specific proper nouns.`,
    exampleSources: 'Novels, diaries, philosophical texts',
    tip: 'Helps find themes across disparate sources.'
  },
  {
    id: 'm.11',
    categoryId: 'meta',
    title: 'The Code Documentation Generator',
    format: 'Meta Prompt',
    bestFor: 'Developers',
    promptText: `Act as a Technical Writer.
Write a prompt that instructs NotebookLM to read [Codebase Files] and generate standard Javadoc/TSDoc comments for every function.
Include: Parameters, Return Values, and Edge Cases based on the logic visible in the source.`,
    exampleSources: 'Raw code files',
    tip: 'Specify the coding language in the prompt.'
  },
  {
    id: 'm.12',
    categoryId: 'meta',
    title: 'The Metaphor Maker',
    format: 'Meta Prompt',
    bestFor: 'Explaining complex concepts',
    promptText: `Act as a Poet.
Write a prompt that asks NotebookLM to explain [Complex Topic] using an extended metaphor related to [Domain, e.g., Cooking, Gardening, Space Travel].
The metaphor must map key concepts from the source to elements of the metaphor domain.`,
    exampleSources: 'Scientific papers, system architectures',
    tip: 'Makes technical concepts sticky.'
  },
  {
    id: 'm.13',
    categoryId: 'meta',
    title: 'The Timeline Extractor',
    format: 'Meta Prompt',
    bestFor: 'History and Project Management',
    promptText: `Act as a Chronologist.
Write a prompt that extracts every date-stamped event from [Source Docs] and arranges them in a linear timeline.
Format: "YYYY-MM-DD: Event Description (Citation ID)".
Resolution strategy: "If specific date is missing, estimate month/year based on context and note as 'Estimated'."`,
    exampleSources: 'Biographies, project logs',
    tip: 'Crucial for understanding sequence.'
  },
  {
    id: 'm.14',
    categoryId: 'meta',
    title: 'The FAQ Generator',
    format: 'Meta Prompt',
    bestFor: 'Customer support, onboarding',
    promptText: `Act as a Customer Success Manager.
Write a prompt that analyzes [Product Manual] and anticipates the 10 most likely user questions.
Then, draft the answers strictly based on the text.
Format: Q&A pairs.`,
    exampleSources: 'Product manuals, policy docs',
    tip: 'Great for populating help centers.'
  },
  {
    id: 'm.15',
    categoryId: 'meta',
    title: 'The Anti-Hallucination Guard',
    format: 'Meta Prompt',
    bestFor: 'High-stakes accuracy',
    promptText: `Act as a Fact Checker.
Write a system instruction prompt that tells NotebookLM: "You are a closed system. You do not know anything outside of the uploaded documents. If the answer is not in the text, state 'Information not available in sources' immediately. Do not attempt to answer from general knowledge."`,
    exampleSources: 'Legal discovery, medical records',
    tip: 'Use for strict retrieval tasks.'
  },
  {
    id: 'm.16',
    categoryId: 'meta',
    title: 'The Gap Analyst',
    format: 'Meta Prompt',
    bestFor: 'Research validation',
    promptText: `Act as a Research Reviewer.
Write a prompt that asks NotebookLM to analyze [Literature Review] and identify what is MISSING.
"What perspectives, data points, or time periods are not covered in these sources? List the blind spots."`,
    exampleSources: 'Bibliographies, draft papers',
    tip: 'Finds holes in your research.'
  },
  {
    id: 'm.17',
    categoryId: 'meta',
    title: 'The Tone Polisher',
    format: 'Meta Prompt',
    bestFor: 'Editing drafts',
    promptText: `Act as a Copy Editor.
Write a prompt that takes a rough draft and rewrites it to match a specific style guide: [e.g., AP Style, Strunk & White, Corporate Brand Voice].
Focus on: Passive voice reduction, sentence variance, and strong verbs.`,
    exampleSources: 'Rough drafts, emails',
    tip: 'Define "Brand Voice" clearly.'
  },
  {
    id: 'm.18',
    categoryId: 'meta',
    title: 'The Syllabus Creator',
    format: 'Meta Prompt',
    bestFor: 'Teachers',
    promptText: `Act as a Curriculum Designer.
Write a prompt that takes [Textbook/Reading List] and breaks it down into a 12-week course syllabus.
Include: Weekly themes, reading assignments from the source, and discussion questions.`,
    exampleSources: 'Textbooks, article collections',
    tip: 'Specify the length of the course.'
  },
  {
    id: 'm.19',
    categoryId: 'meta',
    title: 'The Meeting Simulator',
    format: 'Meta Prompt',
    bestFor: 'Prep for difficult conversations',
    promptText: `Act as a Roleplay Facilitator.
Write a prompt that instructs NotebookLM to simulate a meeting with [Stakeholder Persona].
The AI should challenge my proposal based on [Strategy Doc] and force me to defend my points.
The AI starts the conversation.`,
    exampleSources: 'Strategy docs, stakeholder profiles',
    tip: 'Interactive practice.'
  },
  {
    id: 'm.20',
    categoryId: 'meta',
    title: 'The Universal Summary',
    format: 'Meta Prompt',
    bestFor: 'General purpose',
    promptText: `Act as a Summarizer.
Write a prompt that generates a "3-Level Summary" for any document:
1. The Tweet (280 chars)
2. The Abstract (1 paragraph)
3. The Deep Dive (Bullet points with citations)
This structure ensures I get both the gist and the details.`,
    exampleSources: 'Any document',
    tip: 'Standardize your intake process.'
  },

  // --- AUDIO ---
  {
    id: '1.1',
    categoryId: 'audio',
    title: 'Podcast-Style Deep Dive',
    format: 'Audio Overview',
    bestFor: 'Passive learning, commuting, research synthesis',
    promptText: `Act as two expert podcast hosts with contrasting perspectives.
Given the uploaded research papers and articles, create a conversational debate exploring the main arguments, methodologies, and conclusions.
Stop at the boundaries of the uploaded sources—do not introduce external research or citations.
Deliver a 10-12 minute audio overview in podcast format with natural dialogue, disagreements, and synthesis moments.`,
    exampleSources: 'Research papers, white papers, competing viewpoints',
    tip: 'Works best with 2-5 sources presenting different angles'
  },
  {
    id: '1.2',
    categoryId: 'audio',
    title: 'Weekly Meeting Recap',
    format: 'Audio Overview',
    bestFor: 'Teams, async updates, meeting summaries',
    promptText: `Act as an executive assistant synthesizing meeting notes.
Given the uploaded meeting transcripts, extract key decisions, action items, and blockers.
Stop at verbatim transcript content—do not infer decisions not explicitly stated.
Deliver a 5-7 minute audio "catch-up" show highlighting what busy team members need to know.`,
    exampleSources: 'Meeting transcripts (Zoom, Teams, Otter.ai), agenda docs',
    tip: 'Upload multiple meetings for weekly rollup; max 5 meetings'
  },
  {
    id: '1.3',
    categoryId: 'audio',
    title: 'Exam Cram Session',
    format: 'Audio Overview',
    bestFor: 'Students, certification prep, knowledge retention',
    promptText: `Act as a study tutor creating an exam prep guide.
Given the uploaded textbook chapters and lecture notes, identify the 10 most important concepts with definitions, examples, and common misconceptions.
Stop at source material—do not add practice problems from outside sources.
Deliver an 8-10 minute conversational audio guide optimized for memorization and recall.`,
    exampleSources: 'Textbook PDFs, lecture slides, syllabus',
    tip: 'Focus on 2-3 chapters max per session for depth'
  },
  {
    id: '1.4',
    categoryId: 'audio',
    title: 'Investor Pitch Rehearsal',
    format: 'Audio Overview',
    bestFor: 'Founders, sales teams, pitch practice',
    promptText: `Act as two investors—one skeptical, one supportive—reviewing a pitch deck.
Given the uploaded pitch deck and financials, role-play a Q&A session focusing on business model viability, market size, and competitive advantages.
Stop at deck content—do not introduce external market data.
Deliver a 10-minute audio dialogue with tough questions and constructive feedback.`,
    exampleSources: 'Pitch deck PDF, financial projections, one-pager',
    tip: 'Upload competitor decks to hear comparison'
  },
  {
    id: '1.5',
    categoryId: 'audio',
    title: 'Historical Debate Simulation',
    format: 'Audio Overview',
    bestFor: 'History students, understanding conflicting narratives',
    promptText: `Act as two historical figures or historians with opposing views on the event described in the sources.
Given the uploaded historical documents and accounts, debate the causes and consequences of the event.
Stop at the provided historical evidence—do not introduce modern hindsight unless specified.
Deliver a 10-minute audio debate highlighting the complexity of the historical moment.`,
    exampleSources: 'Primary source documents, letters, diary entries',
    tip: 'Upload sources from different sides of the conflict'
  },
  {
    id: '1.6',
    categoryId: 'audio',
    title: 'Codebase Walkthrough',
    format: 'Audio Overview',
    bestFor: 'Developers, onboarding new engineers',
    promptText: `Act as a senior software engineer explaining the architecture.
Given the uploaded documentation and code snippets, explain the data flow, key components, and design patterns used.
Stop at the provided documentation—do not assume external libraries not mentioned.
Deliver a 15-minute technical audio walkthrough suitable for developer onboarding.`,
    exampleSources: 'Architecture diagrams, READMEs, API docs',
    tip: 'Focus on "why" certain decisions were made'
  },
  {
    id: '1.7',
    categoryId: 'audio',
    title: 'Language Immersion Dialogue',
    format: 'Audio Overview',
    bestFor: 'Language learners, vocabulary practice',
    promptText: `Act as two native speakers of the target language.
Given the uploaded vocabulary list or story text, create a natural conversation using the key terms in context.
Stop at the vocabulary provided—keep the grammar simple if for beginners.
Deliver a 5-minute audio dialogue (slow and clear speed) for practice.`,
    exampleSources: 'Vocabulary lists, short stories, textbooks',
    tip: 'Specify proficiency level (A1, B2, etc.)'
  },
  {
    id: '1.8',
    categoryId: 'audio',
    title: 'Executive News Brief',
    format: 'Audio Overview',
    bestFor: 'CEOs, busy professionals',
    promptText: `Act as a news anchor.
Given the uploaded industry reports and news articles from the past week, summarize the top 3 stories and their potential business impact.
Stop at the facts in the articles.
Deliver a 3-minute high-energy news brief.`,
    exampleSources: 'News articles, RSS feed exports, industry reports',
    tip: 'Focus on "Bottom Line Up Front" (BLUF)'
  },
  {
    id: '1.9',
    categoryId: 'audio',
    title: 'Guided Meditation Script',
    format: 'Audio Overview',
    bestFor: 'Wellness, relaxation, focus',
    promptText: `Act as a meditation guide.
Given the uploaded text on a specific theme (e.g., stoicism, nature, focus), create a guided meditation script that uses imagery and concepts from the text.
Stop at the source themes.
Deliver a soothing audio script with pauses for breath work.`,
    exampleSources: 'Philosophical texts, nature descriptions, poems',
    tip: 'Indicate [PAUSE] durations in the text'
  },

  // --- VIDEO ---
  {
    id: '2.1',
    categoryId: 'video',
    title: 'Visual Lecture',
    format: 'Video Overview',
    bestFor: 'Educators, students, visual learners',
    promptText: `Act as a professor delivering a lecture.
Given the uploaded lecture notes, slides, or textbook chapters, create a structured video lesson with clear sections, key definitions, and illustrative examples.
Stop at uploaded materials—do not add external video clips.
Deliver a 5-7 minute narrated video overview optimized for visual learning.`,
    exampleSources: 'Lecture notes, PowerPoint exports, textbook PDFs',
    tip: 'Upload slides + notes for synchronized visuals'
  },
  {
    id: '2.3',
    categoryId: 'video',
    title: 'Product Demo Script',
    format: 'Video Overview',
    bestFor: 'Product managers, sales, demo preparation',
    promptText: `Act as a product marketer creating a demo script.
Given the uploaded product specs, feature docs, and user stories, visualize how the product solves customer problems with step-by-step walkthroughs.
Stop at spec content—do not invent features.
Deliver a 5-7 minute video demo outline with narration cues.`,
    exampleSources: 'Product specs, feature docs, user stories',
    tip: 'Upload customer testimonials for social proof integration'
  },
  {
    id: '2.4',
    categoryId: 'video',
    title: 'Social Media Script (TikTok/Reels)',
    format: 'Video Overview',
    bestFor: 'Content creators, social media managers',
    promptText: `Act as a viral content creator.
Given the uploaded article or topic summary, create a script for a 60-second vertical video (TikTok/Reels) with a hook, 3 key takeaways, and a call to action.
Stop at the source content—do not sensationalize beyond facts.
Deliver a table with "Visual Cue" and "Audio/Text" columns.`,
    exampleSources: 'Blog posts, news articles, product launches',
    tip: 'Keep the hook under 3 seconds'
  },
  {
    id: '2.5',
    categoryId: 'video',
    title: 'Mini-Documentary Narration',
    format: 'Video Overview',
    bestFor: 'Storytellers, journalists, video essayists',
    promptText: `Act as a documentary narrator (like David Attenborough or Ken Burns).
Given the uploaded research notes and timeline, write a narration script for a 5-minute mini-documentary that weaves facts into a compelling narrative arc.
Stop at the uploaded facts—do not invent events.
Deliver a script with suggested B-roll imagery for each section.`,
    exampleSources: 'Research notes, timelines, interview transcripts',
    tip: 'Focus on emotional resonance'
  },
  {
    id: '2.6',
    categoryId: 'video',
    title: 'DIY Tutorial Script',
    format: 'Video Overview',
    bestFor: 'Hobbyists, makers, support teams',
    promptText: `Act as a DIY instructor.
Given the uploaded user manual or assembly instructions, create a video script that demonstrates the process step-by-step, highlighting common pitfalls.
Stop at the manual instructions.
Deliver a script with camera angle suggestions (e.g., "Close-up on screw A").`,
    exampleSources: 'User manuals, assembly guides, recipe cards',
    tip: 'Break down complex steps into sub-steps'
  },
  {
    id: '2.7',
    categoryId: 'video',
    title: 'Unboxing/Review Script',
    format: 'Video Overview',
    bestFor: 'Influencers, reviewers',
    promptText: `Act as a tech reviewer.
Given the uploaded product spec sheet and marketing materials, create an unboxing and review script covering: packaging, first impressions, key features, and verdict.
Stop at the provided specs.
Deliver a conversational script with "Pros" and "Cons" sections.`,
    exampleSources: 'Product pages, spec sheets, press releases',
    tip: 'Focus on user experience over raw specs'
  },
  {
    id: '2.8',
    categoryId: 'video',
    title: 'Crowdfunding Pitch Video',
    format: 'Video Overview',
    bestFor: 'Entrepreneurs, startups',
    promptText: `Act as a startup founder.
Given the uploaded business plan and prototype description, write a script for a 2-minute Kickstarter/Indiegogo video that explains the problem, the solution, and the vision.
Stop at the project details.
Deliver an emotional and inspiring script with a strong call to back the project.`,
    exampleSources: 'Business plans, prototype photos, mission statement',
    tip: 'Start with the "Why" before the "What"'
  },

  // --- MIND MAP ---
  {
    id: '3.1',
    categoryId: 'mindmap',
    title: 'The "Everything" Connector',
    format: 'Mind Map',
    bestFor: 'Information architecture, research synthesis, pattern recognition',
    promptText: `Act as an information architect mapping knowledge domains.
Given all uploaded sources related to [project/topic], map the connections between documents to reveal hidden patterns, recurring themes, and conceptual relationships.
Stop at source content—do not add external frameworks.
Deliver a topic-based mind map showing how ideas interconnect across documents.`,
    exampleSources: 'All project docs (5-15 files), research papers',
    tip: 'Upload diverse sources for richest connections'
  },
  {
    id: '3.3',
    categoryId: 'mindmap',
    title: 'Character Relationship Web',
    format: 'Mind Map',
    bestFor: 'Writers, literature students, script analysis',
    promptText: `Act as a literary analyst.
Given the uploaded book chapters or script, map the relationships between characters, noting the nature of the connection (family, ally, rival, romantic).
Stop at the text provided—do not infer backstory not present.
Deliver a mind map description focusing on character dynamics.`,
    exampleSources: 'Novel chapters, movie scripts, play scripts',
    tip: 'Upload specific scenes to analyze evolving relationships'
  },
  {
    id: '3.4',
    categoryId: 'mindmap',
    title: 'Process Flowchart',
    format: 'Mind Map',
    bestFor: 'Operations managers, systems analysts',
    promptText: `Act as a systems analyst.
Given the uploaded standard operating procedure (SOP) or process description, create a step-by-step flowchart visualization including decision diamonds and start/end points.
Stop at the written procedure—do not optimize the process yet.
Deliver a text-based flowchart representation.`,
    exampleSources: 'SOP documents, employee handbooks, user guides',
    tip: 'Identify bottlenecks in the flow'
  },
  {
    id: '3.5',
    categoryId: 'mindmap',
    title: 'Argument Mapping',
    format: 'Mind Map',
    bestFor: 'Philosophy students, lawyers, critical thinking',
    promptText: `Act as a logician.
Given the uploaded essay or opinion piece, map the central thesis, supporting premises, counter-arguments, and rebuttals.
Stop at the text provided.
Deliver a hierarchical argument map showing logical flow.`,
    exampleSources: 'Op-eds, philosophical essays, legal briefs',
    tip: 'Differentiate between facts and value judgments'
  },
  {
    id: '3.6',
    categoryId: 'mindmap',
    title: 'Decision Tree Map',
    format: 'Mind Map',
    bestFor: 'Strategy, decision-making, scenario planning',
    promptText: `Act as a decision analyst mapping choice architectures.
Given the uploaded decision frameworks, strategy docs, or scenario analyses, create a mind map showing decision points, options, consequences, and dependencies.
Stop at document content—do not add external scenarios.
Deliver a decision tree mind map for strategic planning.`,
    exampleSources: 'Strategy docs, decision matrices, scenario plans',
    tip: 'Include probability estimates if available'
  },
  {
    id: '3.7',
    categoryId: 'mindmap',
    title: 'Stakeholder Analysis Map',
    format: 'Mind Map',
    bestFor: 'Project managers, change management',
    promptText: `Act as a project manager.
Given the uploaded project charter and email threads, map out all stakeholders, categorizing them by their level of "Interest" and "Power/Influence".
Stop at the identified people/groups.
Deliver a matrix or map description placing stakeholders in the correct quadrant.`,
    exampleSources: 'Project charters, org charts, emails',
    tip: 'Identify potential blockers early'
  },
  {
    id: '3.8',
    categoryId: 'mindmap',
    title: 'Root Cause (Fishbone) Map',
    format: 'Mind Map',
    bestFor: 'Quality assurance, problem solving',
    promptText: `Act as a quality engineer.
Given the uploaded incident reports and logs, map the potential causes of the problem into categories (Man, Machine, Material, Method, Environment).
Stop at the facts provided.
Deliver a fishbone diagram description.`,
    exampleSources: 'Incident reports, maintenance logs',
    tip: 'Use the "5 Whys" technique'
  },

  // --- REPORTS ---
  {
    id: '4.1',
    categoryId: 'report',
    title: 'Executive Summary',
    format: 'Report',
    bestFor: 'Leadership, board updates, stakeholder communication',
    promptText: `Act as a chief of staff creating an executive brief.
Given the uploaded 100+ page document or annual report, distill into a 2-3 page executive summary covering key findings, metrics, recommendations, and next steps.
Stop at document content—do not add external benchmarks.
Deliver a high-level executive summary report optimized for busy leaders.`,
    exampleSources: 'Annual reports, strategic plans, board materials',
    tip: 'Focus on decisions needed vs. exhaustive details'
  },
  {
    id: '4.2',
    categoryId: 'report',
    title: 'SWOT Analysis',
    format: 'Report',
    bestFor: 'Strategic planning, business analysis, market entry',
    promptText: `Act as a strategy consultant conducting SWOT analysis.
Given the uploaded business documents, market reports, or internal assessments, analyze Strengths, Weaknesses, Opportunities, and Threats with specific examples.
Stop at uploaded data—do not add external market trends.
Deliver a structured SWOT analysis report with actionable implications.`,
    exampleSources: 'Business plans, market reports, internal audits',
    tip: 'Upload competitor data for richer Opportunities/Threats'
  },
  {
    id: '4.3',
    categoryId: 'report',
    title: 'Literature Review',
    format: 'Report',
    bestFor: 'Researchers, academics, grad students',
    promptText: `Act as an academic researcher.
Given the uploaded bibliography and abstracts, synthesize the current state of knowledge, identifying major themes, consensus, and gaps in the research.
Stop at the uploaded sources—do not add external citations.
Deliver a structured literature review organized by theme.`,
    exampleSources: 'List of papers, abstracts, annotated bibliographies',
    tip: 'Highlight contradictions between sources'
  },
  {
    id: '4.4',
    categoryId: 'report',
    title: 'Grant Proposal Narrative',
    format: 'Report',
    bestFor: 'Non-profits, researchers, fundraising',
    promptText: `Act as a grant writer.
Given the uploaded project plan and mission statement, draft the "Statement of Need" and "Project Description" sections for a grant application, emphasizing impact and alignment with goals.
Stop at the project details provided.
Deliver a persuasive narrative suitable for funding applications.`,
    exampleSources: 'Project plans, mission statements, impact data',
    tip: 'Use active voice and clear metrics'
  },
  {
    id: '4.5',
    categoryId: 'report',
    title: 'Risk Assessment',
    format: 'Report',
    bestFor: 'Project managers, compliance officers',
    promptText: `Act as a risk manager.
Given the uploaded project plan or business proposal, identify potential risks (financial, operational, reputational) and suggest mitigation strategies for each.
Stop at the provided context—do not invent hypothetical disasters unlikely to occur.
Deliver a risk assessment matrix.`,
    exampleSources: 'Project charters, business plans, technical specs',
    tip: 'Categorize risks by probability and impact'
  },
  {
    id: '4.6',
    categoryId: 'report',
    title: 'Post-Mortem Analysis',
    format: 'Report',
    bestFor: 'Engineering teams, event planners, continuous improvement',
    promptText: `Act as a neutral facilitator.
Given the uploaded incident logs, timeline, and team feedback, write a blameless post-mortem report identifying the root cause, what went well, what went wrong, and preventive actions.
Stop at the facts provided.
Deliver a structured retrospective report.`,
    exampleSources: 'Incident logs, Slack transcripts, timelines',
    tip: 'Focus on process improvement, not person blaming'
  },
  {
    id: '4.7',
    categoryId: 'report',
    title: 'White Paper',
    format: 'Report',
    bestFor: 'Thought leadership, technical marketing, B2B sales',
    promptText: `Act as a subject matter expert authoring a white paper.
Given the uploaded research, technical docs, or industry analyses, create a deep-dive white paper covering problem landscape, solution approaches, technical architecture, and business impact.
Stop at source material—do not add external case studies.
Deliver a comprehensive white paper report (8-12 pages).`,
    exampleSources: 'Research papers, technical specs, market analyses',
    tip: 'Focus on problem → solution narrative arc'
  },
  {
    id: '4.8',
    categoryId: 'report',
    title: 'Policy Memo',
    format: 'Report',
    bestFor: 'Government, corporate strategy, public policy',
    promptText: `Act as a policy analyst.
Given the uploaded background documents and data, write a 2-page memo recommending a course of action to a decision-maker.
Stop at the evidence provided.
Deliver a memo with: Issue, Background, Options, Recommendation, and Rationale.`,
    exampleSources: 'Legislation drafts, internal data, stakeholder comments',
    tip: 'Be concise and decisive'
  },
  {
    id: '4.9',
    categoryId: 'report',
    title: 'Feasibility Study',
    format: 'Report',
    bestFor: 'Entrepreneurs, product managers',
    promptText: `Act as a business consultant.
Given the uploaded market research and cost estimates, assess the technical, economic, and operational feasibility of the proposed project.
Stop at the provided data.
Deliver a feasibility report with a "Go/No-Go" recommendation.`,
    exampleSources: 'Cost estimates, market surveys, technical reqs',
    tip: 'Highlight the "deal-breakers"'
  },
  {
    id: '4.10',
    categoryId: 'report',
    title: 'Sustainability Impact Report',
    format: 'Report',
    bestFor: 'CSR teams, environmental consultants',
    promptText: `Act as a sustainability officer.
Given the uploaded consumption data and supply chain info, calculate and report on the environmental impact (carbon footprint, waste, water).
Stop at the provided data.
Deliver a report aligned with ESG reporting standards.`,
    exampleSources: 'Utility bills, supply chain manifests, travel logs',
    tip: 'Suggest quick wins for reduction'
  },

  // --- FLASHCARDS ---
  {
    id: '5.1',
    categoryId: 'flashcards',
    title: 'Vocabulary Mastery',
    format: 'Flashcards',
    bestFor: 'Language learning, SAT/GRE prep, domain-specific jargon',
    promptText: `Act as a language instructor creating vocabulary flashcards.
Given the uploaded language textbook, word lists, or technical glossary, create flashcards with term on front, definition + example sentence + pronunciation on back.
Stop at source vocabulary—do not add external words.
Deliver 30-50 flashcards optimized for spaced repetition.`,
    exampleSources: 'Language textbooks, word lists, technical glossaries',
    tip: 'Group by difficulty level or theme'
  },
  {
    id: '5.2',
    categoryId: 'flashcards',
    title: 'Key Historical Dates',
    format: 'Flashcards',
    bestFor: 'History students, timeline memorization, exam prep',
    promptText: `Act as a history teacher creating timeline flashcards.
Given the uploaded history textbook or timeline documents, create flashcards with date on front, event + significance + key figures on back.
Stop at source content—do not add external dates.
Deliver 25-40 flashcards for chronological memorization.`,
    exampleSources: 'History textbooks, timelines, chronologies',
    tip: 'Organize by era or theme'
  },
  {
    id: '5.3',
    categoryId: 'flashcards',
    title: 'Medical Terminology Drill',
    format: 'Flashcards',
    bestFor: 'Med students, nursing students, anatomy',
    promptText: `Act as a medical educator.
Given the uploaded anatomy textbook chapter or pathology notes, create flashcards for key terms, covering origin/root, definition, and clinical significance.
Stop at the source material.
Deliver 40 flashcards for high-yield study.`,
    exampleSources: 'Anatomy textbooks, pathology notes, medical journals',
    tip: 'Focus on prefixes and suffixes'
  },
  {
    id: '5.4',
    categoryId: 'flashcards',
    title: 'Legal Precedents',
    format: 'Flashcards',
    bestFor: 'Law students, bar prep',
    promptText: `Act as a law professor.
Given the uploaded case briefs, create flashcards with Case Name on front, and Facts, Holding, and Rationale on back.
Stop at the provided cases.
Deliver 30 flashcards for case law memorization.`,
    exampleSources: 'Case briefs, legal textbooks, summaries',
    tip: 'Highlight the specific rule of law established'
  },
  {
    id: '5.5',
    categoryId: 'flashcards',
    title: 'Coding Syntax & Patterns',
    format: 'Flashcards',
    bestFor: 'Developers, comp sci students',
    promptText: `Act as a coding interviewer.
Given the uploaded documentation or code samples, create flashcards for design patterns or language-specific syntax (e.g., Python list comprehensions).
Stop at the provided language/framework.
Deliver flashcards with "Concept" on front and "Code Snippet" on back.`,
    exampleSources: 'Documentation, cheat sheets, codebases',
    tip: 'Focus on idiomatic usage'
  },
  {
    id: '5.6',
    categoryId: 'flashcards',
    title: 'Chemical Formulas & Elements',
    format: 'Flashcards',
    bestFor: 'Chemistry students',
    promptText: `Act as a chemistry tutor.
Given the uploaded periodic table or textbook chapter, create flashcards for elements (Symbol -> Name/Atomic #) or compounds (Formula -> Name).
Stop at the provided list.
Deliver 50 flashcards.`,
    exampleSources: 'Textbooks, periodic tables',
    tip: 'Include molar mass where relevant'
  },

  // --- QUIZ ---
  {
    id: '6.1',
    categoryId: 'quiz',
    title: 'Comprehensive Understanding Check',
    format: 'Quiz',
    bestFor: 'Self-assessment, study verification, knowledge gaps',
    promptText: `Act as an educator creating a comprehensive quiz.
Given the uploaded course materials, textbook chapters, or study guides, create a 15-20 question quiz covering key concepts, definitions, applications, and critical thinking.
Stop at source content—do not add external questions.
Deliver a mix of multiple choice, true/false, and short answer questions with answer key.`,
    exampleSources: 'Course materials, textbook chapters, study guides',
    tip: 'Balance recall + application questions'
  },
  {
    id: '6.2',
    categoryId: 'quiz',
    title: 'Certification Mock Exam',
    format: 'Quiz',
    bestFor: 'IT professionals, project managers (PMP, AWS)',
    promptText: `Act as a certification exam creator.
Given the uploaded study guide or white papers, create 20 multiple-choice questions that mimic the difficulty and format of the actual exam (e.g., scenario-based).
Stop at the source content.
Deliver questions with detailed explanations for the correct answer.`,
    exampleSources: 'Certification study guides, technical white papers',
    tip: 'Include distractors (wrong answers) that are plausible'
  },
  {
    id: '6.3',
    categoryId: 'quiz',
    title: 'Trivia Night Round',
    format: 'Quiz',
    bestFor: 'Team building, social events, fun',
    promptText: `Act as a trivia host.
Given the uploaded obscure facts or general interest articles, create a 10-question trivia round with increasing difficulty.
Stop at the provided facts.
Deliver questions and answers with a "Did you know?" bonus fact for each.`,
    exampleSources: 'Wikipedia articles, fun fact books, company history',
    tip: 'Theme the round (e.g., "80s Pop Culture" or "Company Origins")'
  },
  {
    id: '6.4',
    categoryId: 'quiz',
    title: 'Scenario-Based Quiz',
    format: 'Quiz',
    bestFor: 'Applied learning, case-based reasoning, professional training',
    promptText: `Act as a training specialist creating scenario quizzes.
Given the uploaded case studies, procedures, or training materials, create 10-15 scenario-based questions asking "What would you do in this case?" with multiple choice or short answer.
Stop at source scenarios—do not add external cases.
Deliver quiz with answer key explaining best practices.`,
    exampleSources: 'Case studies, procedures, training materials',
    tip: 'Include both routine + edge case scenarios'
  },
  {
    id: '6.5',
    categoryId: 'quiz',
    title: 'Listening Comprehension',
    format: 'Quiz',
    bestFor: 'Language learners, journalism students',
    promptText: `Act as a test proctor.
Given the uploaded transcript of an audio/video file, create a listening comprehension quiz that tests understanding of main ideas, details, and speaker attitude.
Stop at the transcript content.
Deliver questions that follow the flow of the conversation.`,
    exampleSources: 'Transcripts, interview logs, subtitles',
    tip: 'Ask about tone and intent'
  },
  {
    id: '6.6',
    categoryId: 'quiz',
    title: 'Code Debugging Challenge',
    format: 'Quiz',
    bestFor: 'Developers, students',
    promptText: `Act as a senior dev interviewer.
Given the uploaded code snippets containing bugs, create a "Find the Bug" quiz.
Stop at the provided code.
Deliver the snippet, the question "What is wrong?", and the correct fixed code explanation.`,
    exampleSources: 'Buggy code snippets, pull requests',
    tip: 'Focus on common logic errors'
  },

  // --- INFOGRAPHIC ---
  {
    id: '7.1',
    categoryId: 'infographic',
    title: 'Life Cycle Visualization',
    format: 'Infographic',
    bestFor: 'Process understanding, biological systems, product journeys',
    promptText: `Act as an information designer visualizing cyclical processes.
Given the uploaded process docs, biology materials, or product lifecycle documents, create an infographic showing the circular life cycle with stages, transitions, and key characteristics at each phase.
Stop at source material—do not add external lifecycle stages.
Deliver a circular life cycle infographic (plant, product, or project).`,
    exampleSources: 'Biology textbooks, product docs, project methodologies',
    tip: 'Use clockwise flow convention'
  },
  {
    id: '7.2',
    categoryId: 'infographic',
    title: 'Timeline of Events',
    format: 'Infographic',
    bestFor: 'Historians, project managers, legal cases',
    promptText: `Act as a visual data journalist.
Given the uploaded historical account or project logs, create a linear timeline visualization description, marking key milestones and the duration between them.
Stop at the provided dates.
Deliver a timeline layout description.`,
    exampleSources: 'Historical texts, project Gantt charts, legal chronologies',
    tip: 'Group events by era or phase'
  },
  {
    id: '7.3',
    categoryId: 'infographic',
    title: 'Pro/Con Comparison',
    format: 'Infographic',
    bestFor: 'Decision-making, product comparison, option evaluation',
    promptText: `Act as a decision analyst creating comparison visuals.
Given the uploaded comparison docs, product analyses, or option evaluations, create a side-by-side pros/cons infographic with balanced visual weight and clear decision criteria.
Stop at source comparisons—do not add external factors.
Deliver a pros/cons comparison infographic.`,
    exampleSources: 'Comparison docs, product analyses, decision matrices',
    tip: 'Use contrasting colors for visual clarity'
  },
  {
    id: '7.4',
    categoryId: 'infographic',
    title: 'Anatomy/Structure Labeling',
    format: 'Infographic',
    bestFor: 'Science students, engineering, technical manuals',
    promptText: `Act as a technical illustrator.
Given the uploaded diagram descriptions or biology text, describe a labeled diagram for the system or object, defining each part's function.
Stop at the source description.
Deliver a list of labels and their corresponding pointers/descriptions.`,
    exampleSources: 'Biology texts, engine manuals, architecture descriptions',
    tip: 'Start from macro to micro'
  },
  {
    id: '7.5',
    categoryId: 'infographic',
    title: 'Geographic Heatmap',
    format: 'Infographic',
    bestFor: 'Market researchers, epidemiologists',
    promptText: `Act as a cartographer.
Given the uploaded location data or regional statistics, describe a heatmap or choropleth map visualization showing density or intensity.
Stop at the data provided.
Deliver a map description highlighting hotspots and cold zones.`,
    exampleSources: 'Sales data, census reports, infection rates',
    tip: 'Suggest color gradients'
  },
  {
    id: '7.6',
    categoryId: 'infographic',
    title: 'Organizational Chart',
    format: 'Infographic',
    bestFor: 'HR, management',
    promptText: `Act as an HR specialist.
Given the uploaded employee list and titles, describe a hierarchical org chart visualization showing reporting lines.
Stop at the provided names.
Deliver a tree structure description.`,
    exampleSources: 'Employee directories, team lists',
    tip: 'Visualize span of control'
  },

  // --- SLIDE DECK ---
  {
    id: '8.1',
    categoryId: 'slide',
    title: 'Pitch Deck',
    format: 'Slide Deck',
    bestFor: 'Fundraising, investor meetings, startup presentations',
    promptText: `Act as a pitch consultant creating investor decks.
Given the uploaded business plan, financials, or startup materials, create a 10-15 slide pitch deck outline covering problem, solution, market, business model, traction, team, and ask.
Stop at business docs—do not add external market data.
Deliver a pitch deck outline with slide titles and key talking points.`,
    exampleSources: 'Business plans, financial models, startup docs',
    tip: 'Follow problem → solution → why now structure'
  },
  {
    id: '8.2',
    categoryId: 'slide',
    title: 'Sales Deck',
    format: 'Slide Deck',
    bestFor: 'Sales teams, account executives',
    promptText: `Act as a sales enablement manager.
Given the uploaded product value proposition and customer case studies, create a 10-slide sales deck outline that follows the "Challenge, Solution, Benefit, Proof" flow.
Stop at the product facts provided.
Deliver a slide outline with speaker notes.`,
    exampleSources: 'Product one-pagers, case studies, pricing sheets',
    tip: 'Focus on the customer\'s pain points first'
  },
  {
    id: '8.3',
    categoryId: 'slide',
    title: 'Quarterly Business Review',
    format: 'Slide Deck',
    bestFor: 'Leadership updates, team performance, strategic alignment',
    promptText: `Act as a business leader creating QBR decks.
Given the uploaded quarterly data, performance reports, or team updates, create a 15-20 slide QBR presentation covering wins, challenges, metrics, learnings, and next quarter priorities.
Stop at report data—do not add external benchmarks.
Deliver a QBR slide deck outline.`,
    exampleSources: 'Quarterly reports, performance data, team updates',
    tip: 'Use consistent metric format across quarters'
  },
  {
    id: '8.4',
    categoryId: 'slide',
    title: 'Educational Workshop',
    format: 'Slide Deck',
    bestFor: 'Trainers, teachers, workshop facilitators',
    promptText: `Act as an instructional designer.
Given the uploaded curriculum or training manual, create an outline for a 1-hour interactive workshop, including slide topics and timing for activities.
Stop at the source material.
Deliver a workshop deck outline with activity prompts.`,
    exampleSources: 'Training manuals, curriculum guides, topic summaries',
    tip: 'Include breaks and interaction points'
  },
  {
    id: '8.5',
    categoryId: 'slide',
    title: 'Team Onboarding',
    format: 'Slide Deck',
    bestFor: 'HR, hiring managers',
    promptText: `Act as a team lead.
Given the uploaded employee handbook and team wiki, create a 10-slide onboarding deck for new hires covering values, tools, expectations, and "who is who".
Stop at the provided policies.
Deliver a welcoming and informative deck outline.`,
    exampleSources: 'Handbooks, wikis, process docs',
    tip: 'Include a "First Week Checklist" slide'
  },
  {
    id: '8.6',
    categoryId: 'slide',
    title: 'Crisis Management Plan',
    format: 'Slide Deck',
    bestFor: 'PR teams, executives',
    promptText: `Act as a crisis communicator.
Given the uploaded incident details and response protocols, create a briefing deck for the response team covering the situation, immediate actions, and messaging.
Stop at the facts provided.
Deliver a clear, urgent deck outline.`,
    exampleSources: 'Incident logs, PR statements, protocols',
    tip: 'Focus on clarity and chain of command'
  },

  // --- DATA TABLE ---
  {
    id: '9.1',
    categoryId: 'table',
    title: 'Feature Comparison Matrix',
    format: 'Data Table',
    bestFor: 'Product comparison, vendor evaluation, decision-making',
    promptText: `Act as a product analyst creating comparison tables.
Given the uploaded product specs, competitive analyses, or feature lists, create a comparison table with products as columns, features as rows, and clear indicators (✓, ✗, or values).
Stop at source data—do not add external products.
Deliver a feature comparison matrix (export-ready for Sheets).`,
    exampleSources: 'Product specs, competitive analyses, feature lists',
    tip: 'Use consistent format for all cells'
  },
  {
    id: '9.2',
    categoryId: 'table',
    title: 'Action Item List',
    format: 'Data Table',
    bestFor: 'Project management, meeting follow-up, task tracking',
    promptText: `Act as a project coordinator creating action tables.
Given the uploaded meeting notes, project docs, or email threads, create an action item table with columns: Task, Owner, Deadline, Priority, Status, Dependencies.
Stop at source tasks—do not add unstated action items.
Deliver an action item table (sortable by deadline/owner).`,
    exampleSources: 'Meeting notes, project docs, email threads',
    tip: 'Use YYYY-MM-DD format for dates'
  },
  {
    id: '9.3',
    categoryId: 'table',
    title: 'Budget Breakdown',
    format: 'Data Table',
    bestFor: 'Finance teams, event planners, grant management',
    promptText: `Act as a financial analyst.
Given the uploaded expense reports or project estimates, create a categorized budget table with columns for Item, Category, Estimated Cost, Actual Cost, and Variance.
Stop at the provided figures.
Deliver a structured budget table.`,
    exampleSources: 'Expense reports, quotes, estimates',
    tip: 'Group by category (e.g., Venue, Catering, Marketing)'
  },
  {
    id: '9.4',
    categoryId: 'table',
    title: 'Interview Scoring Matrix',
    format: 'Data Table',
    bestFor: 'HR, hiring managers, recruiters',
    promptText: `Act as a recruitment specialist.
Given the uploaded job description and competency model, create an interview scoring matrix with rows for Competencies and columns for Interview Questions and Scoring Criteria (1-5).
Stop at the job requirements provided.
Deliver a scoring matrix for interviewers.`,
    exampleSources: 'Job descriptions, competency frameworks',
    tip: 'Define what a "5" looks like vs a "1"'
  },
  {
    id: '9.5',
    categoryId: 'table',
    title: 'Risk Register',
    format: 'Data Table',
    bestFor: 'Project managers, compliance',
    promptText: `Act as a risk officer.
Given the uploaded project plans, create a Risk Register table with columns: Risk ID, Description, Probability (H/M/L), Impact (H/M/L), Mitigation Strategy, and Owner.
Stop at the provided context.
Deliver a structured risk table.`,
    exampleSources: 'Project plans, risk meetings',
    tip: 'Sort by severity (Probability x Impact)'
  },
  {
    id: '9.6',
    categoryId: 'table',
    title: 'Resource Allocation Plan',
    format: 'Data Table',
    bestFor: 'Operations, producers',
    promptText: `Act as a resource planner.
Given the uploaded project timeline and staff list, create a resource table showing Who is working on What and When (dates/hours).
Stop at the provided constraints.
Deliver a resource schedule table.`,
    exampleSources: 'Gantt charts, staff availability',
    tip: 'Highlight over-allocated resources'
  }
];