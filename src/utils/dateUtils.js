/**
 * Utility functions for date formatting and manipulation
 */

const dateUtils = {
    /**
     * Format ISO date string to readable format
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date string
     */
    formatDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    /**
     * Format date as relative time (e.g., "2 hours ago")
     * @param {string} dateString - ISO date string
     * @returns {string} Relative time string
     */
    getRelativeTime: (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return dateUtils.formatDate(dateString);
    },

    /**
     * Get short date format (e.g., "Jan 24")
     * @param {string} dateString - ISO date string
     * @returns {string} Short date
     */
    getShortDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    },

    /**
     * Check if date is today
     * @param {string} dateString - ISO date string
     * @returns {boolean}
     */
    isToday: (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        return date.toDateString() === today.toDateString();
    },

    /**
     * Check if date is within last N days
     * @param {string} dateString - ISO date string
     * @param {number} days - Number of days
     * @returns {boolean}
     */
    isWithinDays: (dateString, days) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / 86400000);
        return diffDays < days;
    },

    /**
     * Get days remaining before auto-delete (10 day limit)
     * @param {string} dateString - ISO date string
     * @returns {number} Days remaining
     */
    getDaysUntilDelete: (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / 86400000);
        const daysRemaining = 10 - diffDays;
        return Math.max(0, daysRemaining);
    }
};

export default dateUtils;