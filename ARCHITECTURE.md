# voice-2-note - Architecture & Implementation Guide

## Overview

This document describes the architecture and design decisions for the voice-2-note application.

## Component Architecture

### Main Components

#### App.jsx
- **Purpose**: Root component managing global state
- **State Management**: 
  - `notes`: Array of note objects (localStorage)
  - `activeView`: Current sidebar view (notes, archived, deleted)
  - `isDarkMode`: Theme preference (localStorage)
  - `isGridView`: View mode preference (localStorage)
  - `searchQuery`: Current search filter
  - `editingNote`: Currently edited note object

#### Sidebar.jsx
- **Purpose**: Navigation menu for different views
- **Props**: activeView, onViewChange
- **Features**: 
  - Three view options: Notes, Archived, Recently Deleted
  - Click handlers for view switching

#### Navbar.jsx
- **Purpose**: Top navigation with search, theme, and view toggles
- **Props**: onSearch, onThemeToggle, onViewToggle, isDarkMode, isGridView
- **Features**:
  - Search input with real-time filtering
  - Theme toggle button
  - View toggle (list/grid)
  - App branding

#### NoteEditor.jsx
- **Purpose**: Form for creating and editing notes
- **Props**: onSave, editingNote
- **Features**:
  - Title input
  - Speech recognition integration
  - Language selection
  - Text formatting toolbar (bold, italic, underline)
  - Transcript display with "Add to Note" button
  - Save functionality

#### NotesList.jsx
- **Purpose**: Display notes in list or grid view
- **Props**: notes, onEdit, onDelete, onArchive, onRestore, view, isGridView, searchQuery
- **Features**:
  - Conditional rendering based on view (notes/archived/deleted)
  - Search filtering
  - List and grid layouts
  - Action buttons (edit, archive, delete, restore)
  - Empty state messaging

### Authentication Components (Stub)

#### Login.jsx & Signup.jsx
- **Purpose**: Pre-built UI screens for future backend integration
- **Features**:
  - Form validation
  - Local state storage (proof of concept)
  - No actual authentication logic

## Custom Hooks

### useSpeechRecognition.js
- **Purpose**: Encapsulate Web Speech API functionality
- **Returns**:
  - `transcript`: Finalized speech text
  - `interimTranscript`: Live transcription
  - `isListening`: Recording status
  - `language`: Selected language
  - `setLanguage`: Language setter
  - `languages`: Available languages object
  - `error`: Error messages
  - `isSupported`: Browser support flag
  - `startListening()`: Start recording
  - `stopListening()`: Stop recording
  - `resetTranscript()`: Clear transcript
- **Supported Languages**: en-US, hi-IN, es-ES, fr-FR, de-DE

### useLocalStorage.js
- **Purpose**: Persistent state management
- **Returns**: [state, setState] tuple
- **Features**:
  - Automatic localStorage sync
  - Initial value loading
  - JSON serialization

## Utility Functions

### dateUtils.js
- `formatDate(dateString)`: Format ISO date to readable string
- `getRelativeTime(dateString)`: Convert to "X ago" format
- `getShortDate(dateString)`: Short date format
- `isToday(dateString)`: Check if date is today
- `isWithinDays(dateString, days)`: Check if within N days
- `getDaysUntilDelete(dateString)`: Days until auto-delete (10 day limit)

### exportUtils.js
- `exportToTxt(content, title)`: Export as plain text file
- `exportToCSV(title, content, createdAt)`: Export as CSV
- `exportToJSON(note)`: Export single note as JSON
- `exportAllNotesJSON(notes)`: Backup all notes
- `exportToPDF(content, title)`: Client-side PDF generation

## Theme System

### CSS Variables (App.css)

**Light Mode (Default)**
- Primary: #6200ea (Purple)
- Secondary: #03dac6 (Teal)
- Background: #f5f5f7
- Text: #1a1a1a

**Dark Mode**
- Primary: #6200ea (Same)
- Secondary: #03dac6 (Same)
- Background: #121212
- Text: #e0e0e0

### Theme Implementation
- CSS variables defined in `:root` and `.dark-mode`
- Toggle in Navbar calls `setIsDarkMode()`
- Stored in localStorage as 'theme-dark'
- Applied to `<html>` element with class `dark-mode`

## Data Model

### Note Object
```javascript
{
  id: number,                 // Timestamp-based unique ID
  title: string,             // Note title
  content: string,           // Note body text
  createdAt: string,         // ISO date string
  updatedAt: string,         // ISO date string
  archived: boolean,         // Archive status
  deleted: boolean,          // Delete status
  deletedAt: string,         // ISO date when marked for deletion (optional)
}
```

### Storage Keys
- `voice-notes`: Array of all notes
- `theme-dark`: Boolean (true = dark mode)
- `view-grid`: Boolean (true = grid view)
- `loggedIn`: User info (auth stub)

## State Flow

1. **Initial Load**
   - Load notes from localStorage
   - Load theme preference
   - Load view preference
   - Set activeView to 'notes'

2. **Creating a Note**
   - User fills NoteEditor form
   - Clicks "Save Note"
   - handleSaveNote() called in App
   - Note added to state
   - localStorage automatically updated
   - Form cleared

3. **Editing a Note**
   - User clicks note card
   - handleEditNote() called
   - editingNote state set
   - NoteEditor populated
   - User modifies and saves
   - Note updated in array
   - Clear editingNote state

4. **Deleting a Note**
   - User clicks delete button
   - handleDeleteNote() sets deleted=true
   - Note moved to "Recently Deleted" view
   - Cleanup effect checks 10-day limit
   - Auto-removes old deleted notes

5. **Archiving a Note**
   - User clicks archive button
   - handleArchiveNote() sets archived=true
   - Note moved to "Archived Notes" view
   - Can be restored anytime

## Auto-Cleanup Logic

**Automatic Deletion after 10 Days**
```javascript
useEffect(() => {
  const updatedNotes = notes.filter((note) => {
    if (!note.deleted) return true;
    const deletedTime = new Date(note.deletedAt).getTime();
    const currentTime = new Date().getTime();
    const tenDaysInMs = 10 * 24 * 60 * 60 * 1000;
    return currentTime - deletedTime < tenDaysInMs;
  });
  if (updatedNotes.length !== notes.length) {
    setNotes(updatedNotes);
  }
}, [notes, setNotes]);
```

## Responsive Design Breakpoints

- **Desktop**: Full layout with sidebar (1024px+)
- **Tablet**: Collapsible sidebar (768px - 1024px)
- **Mobile**: No sidebar by default (< 768px)

## Future Backend Integration

To add backend, modify:

1. **useLocalStorage** → Replace with API calls
2. **App.jsx** → Add API request functions
3. **Auth Components** → Connect to real auth endpoint
4. **Export Functions** → Add server-side PDF generation

This architecture enables easy migration from client-side to full-stack without major refactoring.

## Performance Considerations

- Notes stored as JSON array (fine for ~1000 notes)
- Search filters on client-side
- Speech API runs locally (no network calls)
- CSS transitions use GPU acceleration
- Lazy render of long note lists possible (future optimization)