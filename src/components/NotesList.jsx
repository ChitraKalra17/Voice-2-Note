import React from 'react';
import './NotesList.css';
import dateUtils from '../utils/dateUtils';

const NotesList = ({ notes, onEdit, onDelete, onArchive, onRestore, view, isGridView, searchQuery }) => {
    const lowerQuery = searchQuery ? searchQuery.toLowerCase() : '';

    const filteredNotes = notes.filter((note) => {
        const matchesView =
            (view === 'notes' && !note.archived && !note.deleted) ||
            (view === 'archived' && note.archived && !note.deleted) ||
            (view === 'deleted' && note.deleted);

        const matchesSearch =
            !searchQuery ||
            (note.title || '').toLowerCase().includes(lowerQuery) ||
            (note.content || '').toLowerCase().includes(lowerQuery);

        return matchesView && matchesSearch;
    }).sort((a, b) => {
        if (!searchQuery) return 0;

        const titleA = (a.title || '').toLowerCase();
        const titleB = (b.title || '').toLowerCase();

        // Exact title match gets highest priority
        if (titleA === lowerQuery && titleB !== lowerQuery) return -1;
        if (titleB === lowerQuery && titleA !== lowerQuery) return 1;

        // Starts with query gets second priority
        if (titleA.startsWith(lowerQuery) && !titleB.startsWith(lowerQuery)) return -1;
        if (titleB.startsWith(lowerQuery) && !titleA.startsWith(lowerQuery)) return 1;

        // Title contains query gets third priority (over content only match)
        const titleAHas = titleA.includes(lowerQuery);
        const titleBHas = titleB.includes(lowerQuery);

        if (titleAHas && !titleBHas) return -1;
        if (titleBHas && !titleAHas) return 1;

        return 0;
    });

    if (filteredNotes.length === 0) {
        return (
            <div className={`notes-list ${isGridView ? 'grid' : 'list'}`}>
                <div className="empty-state">
                    <div className="empty-state-icon">◐</div>
                    <p>
                        {view === 'notes' && "No notes yet. Create one using the editor!"}
                        {view === 'archived' && 'No archived notes.'}
                        {view === 'deleted' && 'Trash is empty.'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`notes-list ${isGridView ? 'grid' : 'list'}`}>
            {view === 'deleted' && (
                <div className="deleted-warning">
                    Recently deleted notes can be restored within 10 days until permanently deleted.
                </div>
            )}
            <div className={`notes-container ${isGridView ? 'grid-view' : 'list-view'}`}>
                {filteredNotes.map((note) => (
                    <div
                        key={note.id}
                        className={isGridView ? 'note-item-grid' : 'note-item-list'}
                    >
                        <h3 className="title" onClick={() => onEdit(note)}>
                            {note.title}
                        </h3>
                        <p className="content-preview">{note.content.substring(0, 150)}...</p>
                        <div className="timestamp">
                            {dateUtils.formatDate(note.updatedAt)}
                        </div>
                        <div className="note-actions">
                            {view === 'notes' && (
                                <>
                                    <button className="note-action-btn" onClick={() => onEdit(note)}>
                                        Edit
                                    </button>
                                    <button className="note-action-btn" onClick={() => onArchive(note.id)}>
                                        Archive
                                    </button>
                                    <button className="note-action-btn delete" onClick={() => onDelete(note.id)}>
                                        Delete
                                    </button>
                                </>
                            )}
                            {view === 'archived' && (
                                <>
                                    <button className="note-action-btn" onClick={() => onRestore(note.id)}>
                                        Restore
                                    </button>
                                    <button className="note-action-btn delete" onClick={() => onDelete(note.id)}>
                                        Delete
                                    </button>
                                </>
                            )}
                            {view === 'deleted' && (
                                <>
                                    <button className="note-action-btn" onClick={() => onRestore(note.id)}>
                                        Restore
                                    </button>
                                    <button className="note-action-btn delete" onClick={() => onDelete(note.id)}>
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotesList;