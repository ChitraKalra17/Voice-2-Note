import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import NoteEditor from './components/NoteEditor';
import NotesList from './components/NotesList';
import useLocalStorage from './hooks/useLocalStorage';

function App() {
    const [notes, setNotes] = useLocalStorage('voice-notes', []);
    const [activeView, setActiveView] = useState('notes');
    const [isDarkMode, setIsDarkMode] = useLocalStorage('theme-dark', false);
    const [isGridView, setIsGridView] = useLocalStorage('view-grid', true);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingNote, setEditingNote] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Apply theme on mount and when isDarkMode changes
    useEffect(() => {
        const htmlElement = document.documentElement;
        if (isDarkMode) {
            htmlElement.classList.add('dark-mode');
        } else {
            htmlElement.classList.remove('dark-mode');
        }
    }, [isDarkMode]);

    // Handle automatic deletion of notes older than 10 days
    useEffect(() => {
        const updatedNotes = notes.filter((note) => {
            if (!note.deleted) return true;

            const deletedTime = new Date(note.deletedAt || note.updatedAt).getTime();
            const currentTime = new Date().getTime();
            const tenDaysInMs = 10 * 24 * 60 * 60 * 1000;

            return currentTime - deletedTime < tenDaysInMs;
        });

        if (updatedNotes.length !== notes.length) {
            setNotes(updatedNotes);
        }
    }, [notes, setNotes]);

    const handleSaveNote = (note) => {
        if (editingNote) {
            // Update existing note
            const updatedNotes = notes.map((n) =>
                n.id === editingNote.id ? { ...note, id: editingNote.id } : n
            );
            setNotes(updatedNotes);
            setEditingNote(null);
        } else {
            // Create new note
            setNotes([note, ...notes]);
        }
    };

    const handleEditNote = (note) => {
        setEditingNote(note);
        setSearchQuery(''); // Clear search when opening a note
        // Scroll to editor
        const editor = document.querySelector('.note-editor');
        editor?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDeleteNote = (noteId) => {
        const note = notes.find(n => n.id === noteId);
        
        // If note is already deleted, permanently remove it
        if (note && note.deleted) {
            setNotes(notes.filter(n => n.id !== noteId));
        } else {
            // Otherwise, mark it as deleted
            const updatedNotes = notes.map((note) =>
                note.id === noteId
                    ? { ...note, deleted: true, deletedAt: new Date().toISOString() }
                    : note
            );
            setNotes(updatedNotes);
        }
    };

    const handleArchiveNote = (noteId) => {
        const updatedNotes = notes.map((note) =>
            note.id === noteId ? { ...note, archived: true } : note
        );
        setNotes(updatedNotes);
    };

    const handleRestoreNote = (noteId) => {
        const updatedNotes = notes.map((note) =>
            note.id === noteId
                ? { ...note, archived: false, deleted: false }
                : note
        );
        setNotes(updatedNotes);
    };

    const handleThemeToggle = () => {
        setIsDarkMode(!isDarkMode);
    };

    const handleViewToggle = () => {
        setIsGridView(!isGridView);
    };

    return (
        <div className="app">
            <Sidebar activeView={activeView} onViewChange={setActiveView} isOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className={`main ${!sidebarOpen ? 'sidebar-collapsed' : ''}`}>
                <Navbar
                    onSearch={setSearchQuery}
                    onThemeToggle={handleThemeToggle}
                    onViewToggle={handleViewToggle}
                    isDarkMode={isDarkMode}
                    isGridView={isGridView}
                    onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
                    sidebarOpen={sidebarOpen}
                />
                <div className="content-wrapper">
                    {activeView === 'notes' && !searchQuery && <NoteEditor onSave={handleSaveNote} editingNote={editingNote} />}
                </div>
                <div className="content-wrapper">
                    <NotesList
                        notes={notes}
                        onEdit={handleEditNote}
                        onDelete={handleDeleteNote}
                        onArchive={handleArchiveNote}
                        onRestore={handleRestoreNote}
                        view={activeView}
                        isGridView={isGridView}
                        searchQuery={searchQuery}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
