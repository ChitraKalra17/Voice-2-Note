import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import NoteEditor from './components/NoteEditor';
import NotesList from './components/NotesList';

import {
    fetchNotes,
    createNote,
    updateNote,
    toggleArchive,
    softDelete,
    deleteNote,
    restoreNote,
    testConnection
} from './api/notes';

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ProtectedRoute from "./components/ProtectedRoute";


//MAIN APP
function MainApp() {
    const [notes, setNotes] = useState([]);
    const [activeView, setActiveView] = useState('notes');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isGridView, setIsGridView] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingNote, setEditingNote] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    //Theme toggle
    useEffect(() => {
        const htmlElement = document.documentElement;
        if (isDarkMode) htmlElement.classList.add('dark-mode');
        else htmlElement.classList.remove('dark-mode');
    }, [isDarkMode]);

    //Load notes
    useEffect(() => {
        const loadNotes = async () => {
            try {
                console.log('Testing backend connection...');
                await testConnection();
                console.log('Backend connection successful!');
                
                console.log('Fetching notes from backend...');
                const data = await fetchNotes();
                console.log('Fetched notes:', data);
                setNotes(data);

            } catch (err) {
                console.error('Error fetching notes:', err);
                setError("Failed to load notes. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        loadNotes();
    }, []);

    //Save/Update note
    const handleSaveNote = async (note) => {
        try {
            console.log('Saving note:', note);
            if (editingNote) {
                const updated = await updateNote(editingNote._id, note);
                console.log('Updated note:', updated);

                setNotes(prev =>
                    prev.map(n => n._id === updated._id ? updated : n)
                );
            } else {
                const saved = await createNote(note);
                console.log('Created note response:', saved);
                setNotes(prev => [saved.note, ...prev]);
            }

            setEditingNote(null);

        } catch (err) {
            console.error('Error saving note:', err);
            setError(`Failed to save note: ${err.message}`);
        }
    };

    //Edit
    const handleEditNote = (note) => {
        setEditingNote(note);
        setSearchQuery('');
        document.querySelector('.note-editor')?.scrollIntoView({ behavior: 'smooth' });
    };

    //Delete (Soft delete - send to trash)
    const handleDeleteNote = async (id) => {
        try {
            console.log('handleDeleteNote: Starting soft delete for id:', id);
            const updated = await softDelete(id);
            console.log('handleDeleteNote: Success, updated:', updated);

            setNotes(prev =>
                prev.map(n => n._id === id ? updated : n)
            );
        } catch (err) {
            console.error('handleDeleteNote: Error:', err.message);
            setError(`Failed to delete note: ${err.message}`);
        }
    };

    //Permanent Delete (Hard delete - remove from trash)
    const handlePermanentDeleteNote = async (id) => {
        try {
            console.log('handlePermanentDeleteNote: Starting permanent delete for id:', id);
            await deleteNote(id);
            console.log('handlePermanentDeleteNote: Success');

            setNotes(prev => prev.filter(n => n._id !== id));
        } catch (err) {
            console.error('handlePermanentDeleteNote: Error:', err.message);
            setError(`Failed to permanently delete note: ${err.message}`);
        }
    };

    //Archive
    const handleArchiveNote = async (id) => {
        try {
            console.log('handleArchiveNote: Starting archive toggle for id:', id);
            const updated = await toggleArchive(id);
            console.log('handleArchiveNote: Success, updated:', updated);

            setNotes(prev =>
                prev.map(n => n._id === id ? updated : n)
            );
        } catch (err) {
            console.error('handleArchiveNote: Error:', err.message);
            setError(`Failed to archive note: ${err.message}`);
        }
    };

    //Restore
    const handleRestoreNote = async (id) => {
        try {
            console.log('handleRestoreNote: Starting restore for id:', id);
            const updated = await restoreNote(id);
            console.log('handleRestoreNote: Success, updated:', updated);

            setNotes(prev =>
                prev.map(n => n._id === id ? updated : n)
            );
        } catch (err) {
            console.error('handleRestoreNote: Error:', err.message);
            setError(`Failed to restore note: ${err.message}`);
        }
    };

    const handleThemeToggle = () => setIsDarkMode(!isDarkMode);
    const handleViewToggle = () => setIsGridView(!isGridView);

    return (
        <div className="app">
            <Sidebar
                activeView={activeView}
                onViewChange={setActiveView}
                isOpen={sidebarOpen}
                onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />

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
                    {activeView === 'notes' && !searchQuery && (
                        <NoteEditor
                            onSave={handleSaveNote}
                            editingNote={editingNote}
                        />
                    )}
                </div>

                <div className="content-wrapper">

                    {loading && <p style={{ padding: "20px" }}>Loading...</p>}

                    {!loading && (
                        <NotesList
                            notes={notes}
                            onEdit={handleEditNote}
                            onDelete={handleDeleteNote}
                            onPermanentDelete={handlePermanentDeleteNote}
                            onArchive={handleArchiveNote}
                            onRestore={handleRestoreNote}
                            view={activeView}
                            isGridView={isGridView}
                            searchQuery={searchQuery}
                        />
                    )}

                </div>
            </div>
        </div>
    );
}


//ROUTER
function App() {
    const isLoggedIn = !!localStorage.getItem("token");

    return (
        <Router>
            <Routes>

                <Route
                    path="/login"
                    element={
                        isLoggedIn ? <Navigate to="/" /> : <Login />
                    }
                />

                <Route
                    path="/signup"
                    element={
                        isLoggedIn ? <Navigate to="/" /> : <Signup />
                    }
                />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <MainApp />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="*"
                    element={
                        isLoggedIn
                            ? <Navigate to="/" />
                            : <Navigate to="/login" />
                    }
                />

            </Routes>
        </Router>
    );
}

export default App;