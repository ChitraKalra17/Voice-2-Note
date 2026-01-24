# Development Guide - voice-2-note

## Getting Started

### Prerequisites
- Node.js v14+ ([Download](https://nodejs.org))
- npm or yarn
- A modern code editor (VS Code recommended)
- Git (optional, for version control)

### Installation

```bash
# Clone or navigate to project directory
cd voice2note-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
voice2note-app/
├── src/
│   ├── components/                 # React components
│   │   ├── Sidebar.jsx             # Sidebar navigation
│   │   ├── Navbar.jsx              # Top navigation bar
│   │   ├── NoteEditor.jsx          # Create/edit notes
│   │   ├── NotesList.jsx           # Display notes
│   │   └── Auth/                   # Authentication UI
│   │       ├── Login.jsx
│   │       └── Signup.jsx
│   ├── hooks/                      # Custom React hooks
│   │   ├── useSpeechRecognition.js # Web Speech API
│   │   └── useLocalStorage.js      # localStorage persistence
│   ├── utils/                      # Utility functions
│   │   ├── dateUtils.js            # Date formatting
│   │   └── exportUtils.js          # Export functionality
│   ├── App.jsx                     # Root component
│   ├── App.css                     # Global styles
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Base styles
├── public/                         # Static assets
├── package.json                    # Dependencies
├── vite.config.js                  # Vite configuration
├── README.md                       # Project overview
├── ARCHITECTURE.md                 # Technical architecture
├── LICENSE                         # MIT License
└── .gitignore                      # Git ignore rules
```

## Available Scripts

### Development
```bash
npm run dev          # Start dev server (port 5173)
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
```

## Key Features Implementation

### 1. Speech Recognition

**File**: `src/hooks/useSpeechRecognition.js`

The `useSpeechRecognition` hook provides:
- Real-time speech-to-text conversion
- Multi-language support (5 languages)
- Interim results display
- Error handling

**Usage in NoteEditor.jsx**:
```javascript
const {
  transcript,
  interimTranscript,
  isListening,
  language,
  setLanguage,
  startListening,
  stopListening,
} = useSpeechRecognition();
```

**Supported Languages**:
- English (en-US) - Default
- Hindi (hi-IN)
- Spanish (es-ES)
- French (fr-FR)
- German (de-DE)

### 2. State Management

**localStorage Hook**: `src/hooks/useLocalStorage.js`

Persists state to browser storage automatically:
```javascript
const [notes, setNotes] = useLocalStorage('voice-notes', []);
const [isDarkMode, setIsDarkMode] = useLocalStorage('theme-dark', false);
```

### 3. Theme System

**CSS Variables** in `src/App.css`:
- Light mode: Purple primary (#6200ea), Teal secondary (#03dac6)
- Dark mode: Same colors with adjusted backgrounds and text

**Toggle Implementation** in `Navbar.jsx`:
```javascript
<button onClick={onThemeToggle}>
  {isDarkMode ? '☀️' : '🌙'}
</button>
```

### 4. Notes Management

**Note Data Structure**:
```javascript
{
  id: 1704931200000,
  title: "My Note",
  content: "Note content here...",
  createdAt: "2026-01-24T10:00:00.000Z",
  updatedAt: "2026-01-24T10:00:00.000Z",
  archived: false,
  deleted: false,
  deletedAt: null
}
```

**Operations**:
- **Create**: New note added to beginning of array
- **Edit**: Replace note with same ID
- **Archive**: Set `archived: true`
- **Delete**: Set `deleted: true` with `deletedAt` timestamp
- **Restore**: Reset `archived` and `deleted` to false

### 5. Auto-Delete Logic

Deleted notes automatically removed after 10 days:

```javascript
useEffect(() => {
  const updatedNotes = notes.filter((note) => {
    if (!note.deleted) return true;
    const tenDaysInMs = 10 * 24 * 60 * 60 * 1000;
    return new Date() - new Date(note.deletedAt) < tenDaysInMs;
  });
  if (updatedNotes.length !== notes.length) {
    setNotes(updatedNotes);
  }
}, [notes, setNotes]);
```

### 6. Search & Filtering

Implemented in `NotesList.jsx`:
```javascript
const filteredNotes = notes.filter((note) => {
  const matchesView = /* view logic */;
  const matchesSearch = !searchQuery ||
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase());
  return matchesView && matchesSearch;
});
```

### 7. Export Functionality

**Export Formats** in `src/utils/exportUtils.js`:
- **TXT**: Plain text file
- **CSV**: Spreadsheet format
- **JSON**: Full note backup with metadata
- **PDF**: Client-side rendering (requires html2pdf library)

**Usage**:
```javascript
import exportUtils from '../utils/exportUtils';

exportUtils.exportToTxt(content, title);
exportUtils.exportToJSON(note);
exportUtils.exportAllNotesJSON(notes);
```

## Component Communication

### Parent-Child Props Flow

```
App.jsx
├── Sidebar (activeView, onViewChange)
├── Navbar (onSearch, onThemeToggle, onViewToggle, isDarkMode, isGridView)
├── NoteEditor (onSave, editingNote)
└── NotesList (notes, onEdit, onDelete, onArchive, onRestore, view, isGridView, searchQuery)
```

## Styling

### CSS Architecture

- **Global Styles**: `App.css` with CSS variables
- **Component Styles**: Individual `.css` files per component
- **Theme Variables**: 
  - Light mode in `:root`
  - Dark mode in `.dark-mode` selector

### Responsive Breakpoints

```css
/* Tablet (768px - 1024px) */
@media (max-width: 1024px) { }

/* Mobile (< 768px) */
@media (max-width: 768px) { }
```

## Browser DevTools Tips

### View localStorage
1. Open DevTools (F12)
2. Go to Application → Local Storage
3. Find domain and view stored data

**Keys**:
- `voice-notes`: All notes array
- `theme-dark`: Theme preference
- `view-grid`: View mode preference

### Debug Speech Recognition
1. Check microphone permissions
2. See console for `Speech API is not supported` message
3. Verify browser supports Web Speech API

### Clear All Data
```javascript
// In browser console
localStorage.clear();
location.reload();
```

## Common Tasks

### Add a New Language to Speech Recognition

**File**: `src/hooks/useSpeechRecognition.js`

1. Add to languages object:
```javascript
const languages = {
  'en-US': 'English',
  'pt-BR': 'Portuguese',  // Add new
};
```

2. Language automatically available in dropdown

### Add a New Export Format

**File**: `src/utils/exportUtils.js`

```javascript
exportUtils.exportToXML = (note) => {
  const xml = `<note><title>${note.title}</title></note>`;
  const blob = new Blob([xml], { type: 'application/xml' });
  // ... rest of implementation
};
```

Then use in NoteEditor:
```javascript
<button onClick={() => exportUtils.exportToXML(note)}>
  Export XML
</button>
```

### Modify Theme Colors

**File**: `src/App.css`

```css
:root {
  --primary-color: #YOUR_COLOR;
  --secondary-color: #YOUR_COLOR;
  /* ... rest of variables */
}
```

## Testing Tips

### Test Speech Recognition
1. Use Chrome or Edge (best support)
2. Allow microphone permission when prompted
3. Speak clearly into microphone
4. Check interim and final transcripts

### Test Note Persistence
1. Create a note
2. Refresh page
3. Note should still exist
4. Close browser and reopen
5. Notes should persist

### Test Auto-Delete
1. Create a test note
2. Delete it
3. Open DevTools console:
```javascript
// Set deletedAt to 11 days ago
const note = JSON.parse(localStorage.getItem('voice-notes'))[0];
note.deletedAt = new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString();
localStorage.setItem('voice-notes', JSON.stringify([note]));
// Refresh - note should be gone
```

## Debugging

### Common Issues

**Speech Recognition not working**
- ✅ Check browser support
- ✅ Verify microphone permissions
- ✅ Check console for errors
- ✅ Ensure HTTPS (required on production)

**Notes not saving**
- ✅ Check localStorage is enabled
- ✅ Open DevTools → Application → Local Storage
- ✅ Check browser storage quota

**Theme not persisting**
- ✅ Check 'theme-dark' key in localStorage
- ✅ Ensure .dark-mode class applied to html

### Performance Tips

- Notes array efficient up to ~5000 items
- Search runs on client (no server needed)
- Consider virtualization for 10,000+ notes
- Speech processing is local (no latency)

## Next Steps for Backend Integration

To add a backend, modify:

1. **Remove useLocalStorage** → Replace with API calls
2. **Create API service** → `src/services/api.js`
3. **Update App.jsx** → Use async/await with API
4. **Add authentication** → Connect Login/Signup to backend
5. **Sync strategy** → Handle offline, offline-first, or online-only

Example API hook:
```javascript
// src/hooks/useNotes.js
const useNotes = () => {
  const [notes, setNotes] = useState([]);
  
  useEffect(() => {
    fetch('/api/notes')
      .then(r => r.json())
      .then(setNotes)
      .catch(console.error);
  }, []);
  
  const saveNote = (note) => {
    return fetch('/api/notes', {
      method: 'POST',
      body: JSON.stringify(note)
    }).then(r => r.json());
  };
  
  return { notes, saveNote };
};
```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test
3. Run linter: `npm run lint`
4. Commit: `git commit -m 'Add feature'`
5. Push: `git push origin feature/your-feature`
6. Open Pull Request

## Resources

- [React Hooks Documentation](https://react.dev/reference/react)
- [Web Speech API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Vite Documentation](https://vitejs.dev)
- [CSS Variables Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [localStorage Guide](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

Happy coding! 🚀