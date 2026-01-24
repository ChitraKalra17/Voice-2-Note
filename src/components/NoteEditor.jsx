import React, { useState, useEffect } from 'react';
import './NoteEditor.css';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import exportUtils from '../utils/exportUtils';

const LANGUAGES = {
    'en-US': 'English',
    'hi-IN': 'Hindi',
    'es-ES': 'Spanish',
    'fr-FR': 'French',
    'de-DE': 'German',
    'it-IT': 'Italian',
    'pt-BR': 'Portuguese',
    'ja-JP': 'Japanese',
    'ru-RU': 'Russian',
    'zh-CN': 'Chinese (Simplified)'
};

const NoteEditor = ({ onSave, editingNote }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    
    const {
        transcript,
        interimTranscript,
        isListening,
        language,
        setLanguage,
        error,
        isSupported,
        startListening,
        stopListening,
        resetTranscript,
    } = useSpeechRecognition();

    // Warn before unloading if there are unsaved changes or recording is active
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            const isDirty = editingNote
                ? (title !== editingNote.title || content !== editingNote.content)
                : (title.trim() !== '' || content.trim() !== '');

            if (isListening || isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isListening, title, content, editingNote]);

    // Load note data when editing
    useEffect(() => {
        if (editingNote) {
            setTitle(editingNote.title);
            setContent(editingNote.content);
        } else {
            clearForm();
        }
    }, [editingNote]);

    // Add transcript to content when it changes
    useEffect(() => {
        const fullTranscript = transcript + interimTranscript;
        if (fullTranscript) {
            // Could auto-update content here if desired
        }
    }, [transcript, interimTranscript]);

    const handleMicClick = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const handleAddTranscript = () => {
        const fullTranscript = transcript + interimTranscript;
        if (fullTranscript) {
            setContent((prev) => prev + ' ' + fullTranscript);
            resetTranscript();
        }
    };

    const handleBoldClick = () => {
        setIsBold(!isBold);
    };

    const handleItalicClick = () => {
        setIsItalic(!isItalic);
    };

    const handleUnderlineClick = () => {
        setIsUnderline(!isUnderline);
    };

    const clearForm = () => {
        setTitle('');
        setContent('');
        setIsBold(false);
        setIsItalic(false);
        setIsUnderline(false);
        resetTranscript();
    };

    const handleSave = () => {
        if (!title.trim() && !content.trim()) {
            alert('Please add a title or content to save the note');
            return;
        }

        const note = {
            id: editingNote?.id || Date.now(),
            title: title.trim() || 'Untitled',
            content: content.trim(),
            createdAt: editingNote?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            archived: editingNote?.archived || false,
            deleted: editingNote?.deleted || false,
            deletedAt: editingNote?.deletedAt || null,
        };

        if (onSave) {
            onSave(note);
        }

        clearForm();
    };

    const handleExportTxt = () => {
        exportUtils.exportToTxt(`${title}\n\n${content}`, title || 'note');
    };

    return (
        <div className="note-editor">
            <div className="editor-header">
                <h2>{editingNote ? 'Edit Note' : 'Create Note'}</h2>
                {!isSupported && <p className="error-msg">Speech Recognition not supported</p>}
            </div>

            <input
                type="text"
                className="note-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note Title"
            />

            <div className="editor-toolbar">
                <div className="toolbar-group">
                    <button
                        className={`btn btn-speech ${isListening ? 'listening' : ''}`}
                        onClick={handleMicClick}
                        disabled={!isSupported}
                        title={isSupported ? (isListening ? 'Stop listening' : 'Start listening') : 'Not supported'}
                    >
                        {isListening ? '⏹️' : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                <line x1="12" y1="19" x2="12" y2="23" />
                                <line x1="8" y1="23" x2="16" y2="23" />
                            </svg>
                        )}
                    </button>

                    <select
                        className="language-select"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        disabled={!isSupported}
                    >
                        {Object.entries(LANGUAGES).map(([code, name]) => (
                            <option key={code} value={code}>
                                {name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="toolbar-group">
                    <button
                        className={`btn btn-format bold ${isBold ? 'active' : ''}`}
                        onClick={handleBoldClick}
                        title="Bold"
                    >
                        <strong>B</strong>
                    </button>
                    <button
                        className={`btn btn-format italic ${isItalic ? 'active' : ''}`}
                        onClick={handleItalicClick}
                        title="Italic"
                    >
                        <em>I</em>
                    </button>
                    <button
                        className={`btn btn-format underline ${isUnderline ? 'active' : ''}`}
                        onClick={handleUnderlineClick}
                        title="Underline"
                    >
                        <u>U</u>
                    </button>
                </div>

                <div className="toolbar-group">
                    <button className="btn btn-export" onClick={handleExportTxt} title="Export as TXT">
                        Export
                    </button>
                </div>

                <button className="btn btn-save" onClick={handleSave}>
                    {editingNote ? 'Update' : 'Save'} Note
                </button>
            </div>

            {error && <p className="error-msg">Error: {error}</p>}

            {(transcript || interimTranscript) && (
                <div className="transcript-display">
                    <p className="label">Speech Recognition:</p>
                    <p className="transcript">{transcript}</p>
                    <p className="interim">{interimTranscript}</p>
                    <button className="btn btn-add-transcript" onClick={handleAddTranscript}>
                        Add to Note
                    </button>
                </div>
            )}

            <textarea
                className={`note-content ${isBold ? 'bold' : ''} ${isItalic ? 'italic' : ''} ${
                    isUnderline ? 'underline' : ''
                }`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write or speak your note..."
            />
        </div>
    );
};

export default NoteEditor;