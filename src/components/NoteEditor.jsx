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
    const textareaRef = React.useRef(null);
    
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

    //warn before unloading if there are unsaved changes or recording is active
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

    //load note data when editing
    useEffect(() => {
        if (editingNote) {
            setTitle(editingNote.title);
            setContent(editingNote.content);
        } else {
            clearForm();
        }
    }, [editingNote]);

    //add transcript to content when it changes
    useEffect(() => {
        const fullTranscript = transcript + interimTranscript;
        if (fullTranscript) {
            //could auto-update content here if desired
        }
    }, [transcript, interimTranscript]);

    const handleMicClick = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const applyFormatting = (format) => {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);

        if (!selectedText) {
            alert('Please select text to format');
            return;
        }

        let formattedText = selectedText;
        switch (format) {
            case 'bold':
                formattedText = `**${selectedText}**`;
                break;
            case 'italic':
                formattedText = `*${selectedText}*`;
                break;
            case 'underline':
                formattedText = `__${selectedText}__`;
                break;
            default:
                return;
        }

        const newContent = content.substring(0, start) + formattedText + content.substring(end);
        setContent(newContent);

        // Restore focus and move cursor
        setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd = start + formattedText.length;
        }, 0);
    };

    const handleBoldClick = () => {
        applyFormatting('bold');
    };

    const handleItalicClick = () => {
        applyFormatting('italic');
    };

    const handleUnderlineClick = () => {
        applyFormatting('underline');
    };

    const handleAddTranscript = () => {
        const fullTranscript = transcript + interimTranscript;
        if (fullTranscript) {
            setContent((prev) => prev + ' ' + fullTranscript);
            resetTranscript();
        }
    };

    const clearForm = () => {
        setTitle('');
        setContent('');
        resetTranscript();
    };

    const handleSave = () => {
        if (!title.trim() && !content.trim()) {
            alert('Please add a title or content to save the note');
            return;
        }

        const note = {
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
                        className="btn btn-format bold"
                        onClick={handleBoldClick}
                        title="Bold (select text first)"
                    >
                        <strong>B</strong>
                    </button>
                    <button
                        className="btn btn-format italic"
                        onClick={handleItalicClick}
                        title="Italic (select text first)"
                    >
                        <em>I</em>
                    </button>
                    <button
                        className="btn btn-format underline"
                        onClick={handleUnderlineClick}
                        title="Underline (select text first)"
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
                ref={textareaRef}
                className="note-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write or speak your note..."
            />
        </div>
    );
};

export default NoteEditor;