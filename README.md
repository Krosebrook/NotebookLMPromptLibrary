# NotebookLM Prompt Library

A Progressive Web App (PWA) designed to curate, generate, and organize context-engineered prompts for Google NotebookLM. This application helps users leverage the R-I-S-E framework (Role, Input, Stop, Example) to get the most out of their AI interactions.

## Features

### 1. Extensive Prompt Library
*   **200+ Templates**: Browse categories ranging from Audio Overviews to Code Analysis.
*   **Meta Prompts**: Use the "Meta Prompts" category to generate high-quality prompts for any specific use case.
*   **Search**: Instantly filter by title, content, or tags.

### 2. Organization Tools
*   **Custom Collections**: Create folders to organize your prompts.
*   **Drag & Drop**: Simply drag prompt cards into folders in the sidebar to organize them.
*   **Tags**: Add custom tags to any prompt for granular filtering.

### 3. Prompt Workbench
*   **Collaborative Editor**: A simulated environment to test and refine prompts.
*   **Autosave**: Content is saved locally to your browser in real-time.
*   **Version History**: Roll back to previous versions of your notes.
*   **Real-time Indicators**: Visual cues for active collaborators and save status.

### 4. PWA Capabilities
*   **Installable**: Add to your home screen or desktop as a standalone app.
*   **Offline Access**: Browse the library even without an internet connection (cached via Service Worker).

## Usage Guide

### Organizing Prompts
1.  **Create a Collection**: Click the "+" icon next to "Collections" in the sidebar.
2.  **Move Prompts**: Click and drag any prompt card from the main grid and drop it onto a collection folder in the sidebar.
3.  **Tagging**: Click a prompt to open details, then click "Edit" to add comma-separated tags.

### Using the Workbench
*   **Shortcuts**:
    *   `Cmd/Ctrl + S`: Force Save
    *   `Cmd/Ctrl + Z`: Undo
    *   `Cmd/Ctrl + Shift + Z`: Redo
    *   `Cmd/Ctrl + I`: Toggle Preview Mode
*   **Citations**: Add sources in the right panel and click the quote icon to insert a citation reference `[1]` into your text.

## Technical Setup

### Installation
1.  Clone the repository.
2.  Run `npm install`.
3.  Run `npm start`.

### PWA Configuration
*   **Manifest**: Located at `/manifest.json`. Defines app name, icons, and theme color.
*   **Service Worker**: Located at `/sw.js`. Handles caching of static assets (HTML, JSON) for offline functionality.

### Customization
*   **Adding Prompts**: Update `constants.ts` to add permanent templates.
*   **Theming**: Tailwind CSS configuration is injected via the `<script>` tag in `index.html`.

---
*Built for the NotebookLM Community.*
