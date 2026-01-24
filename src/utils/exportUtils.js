const exportUtils = {
    /**
     * Export note as plain text
     * @param {string} content - The note content
     * @param {string} title - The note title
     */
    exportToTxt: (content, title) => {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${title || 'note'}.txt`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    /**
     * Export note as CSV (for spreadsheet import)
     * @param {string} title - The note title
     * @param {string} content - The note content
     * @param {string} createdAt - Creation date
     */
    exportToCSV: (title, content, createdAt) => {
        const csvContent = `Title,Content,Created\n"${title}","${content.replace(/"/g, '""')}","${createdAt}"`;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${title || 'note'}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    /**
     * Export note as JSON (for backup)
     * @param {object} note - The complete note object
     */
    exportToJSON: (note) => {
        const jsonContent = JSON.stringify(note, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${note.title || 'note'}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    /**
     * Export all notes as JSON (backup all)
     * @param {array} notes - Array of all notes
     */
    exportAllNotesJSON: (notes) => {
        const jsonContent = JSON.stringify(notes, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `voice-notes-backup-${new Date().toISOString().split('T')[0]}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    /**
     * Simple HTML to Canvas to PDF conversion (client-side)
     * Requires html2pdf.js library to be included
     * @param {string} content - The note content
     * @param {string} title - The note title
     */
    exportToPDF: (content, title) => {
        // Check if html2pdf is available
        if (typeof html2pdf !== 'undefined') {
            const element = document.createElement('div');
            element.innerHTML = `<h1>${title}</h1><p>${content.replace(/\n/g, '<br>')}</p>`;
            
            const opt = {
                margin: 10,
                filename: `${title || 'note'}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
            };
            
            html2pdf().set(opt).from(element).save();
        } else {
            // Fallback: Create a simple print-friendly version
            const printWindow = window.open('', '', 'width=800,height=600');
            printWindow.document.write(`
                <html>
                <head>
                    <title>${title}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { color: #333; }
                        p { line-height: 1.6; color: #666; }
                    </style>
                </head>
                <body>
                    <h1>${title}</h1>
                    <p>${content.replace(/\n/g, '<br>')}</p>
                </body>
                </html>
            `);
            printWindow.document.close();
            setTimeout(() => {
                printWindow.print();
            }, 250);
        }
    },
};

export default exportUtils;