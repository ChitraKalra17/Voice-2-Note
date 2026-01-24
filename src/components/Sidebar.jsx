import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeView, onViewChange, isOpen, onToggleSidebar }) => {
    const views = [
        { id: 'notes', label: 'Notes', icon: '✎' },
        {
            id: 'archived',
            label: 'Archived',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
            ),
        },
        {
            id: 'deleted',
            label: 'Trash',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
            ),
        },
    ];

    return (
        <div className={`sidebar ${!isOpen ? 'collapsed' : ''}`}>
            <ul>
                {views.map((view) => (
                    <li
                        key={view.id}
                        className={activeView === view.id ? 'active' : ''}
                        onClick={() => onViewChange(view.id)}
                    >
                        <span className="view-icon">{view.icon}</span>
                        <span className="view-label">{view.label}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;