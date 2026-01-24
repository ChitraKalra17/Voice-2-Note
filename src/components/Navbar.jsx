import React, { useState } from 'react';
import './Navbar.css';
import logo from '../assets/logo.png';

const Navbar = ({
  onSearch,
  onThemeToggle,
  onViewToggle,
  isDarkMode,
  isGridView,
  onSidebarToggle,
  sidebarOpen
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button
          className="hamburger-btn-navbar"
          onClick={onSidebarToggle}
          title={sidebarOpen ? 'Collapse Menu' : 'Open Menu'}
          aria-label="Toggle sidebar"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* LOGO */}
        <img
          src={logo}
          alt="Voice-2-Note logo"
          className="navbar-logo-img"
          onClick={handleLogoClick}
        />

        <h1 className="navbar-logo" onClick={handleLogoClick}>Voice-2-Note</h1>
      </div>

      <div className="navbar-center">
        <div className="navbar-search">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="navbar-controls">
        <button
          className="nav-btn view-toggle"
          onClick={onViewToggle}
          title={isGridView ? 'List View' : 'Grid View'}
        >
          <svg className="icon-view" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isGridView ? (
              <>
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </>
            ) : (
              <>
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
              </>
            )}
          </svg>
        </button>

        <button
          className="nav-btn theme-toggle"
          onClick={onThemeToggle}
          title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
        >
          <svg className="icon-theme" viewBox="0 0 24 24" fill="currentColor">
            {isDarkMode ? (
              <>
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </>
            ) : (
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            )}
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
