# 🎤 voice-2-note Quick Reference

## ⚡ Quick Start
```bash
cd voice2note-app
npm install
npm run dev
# Open http://localhost:5173
```

## 🎯 Core Features
| Feature | File | Status |
|---------|------|--------|
| Speech-to-Text | `hooks/useSpeechRecognition.js` | ✅ Complete |
| Note Management | `components/NoteEditor.jsx` | ✅ Complete |
| List/Grid View | `components/NotesList.jsx` | ✅ Complete |
| Search | `App.jsx` filter logic | ✅ Complete |
| Theme Toggle | `App.css` + `Navbar.jsx` | ✅ Complete |
| Export Notes | `utils/exportUtils.js` | ✅ Complete |
| Data Persistence | `hooks/useLocalStorage.js` | ✅ Complete |
| Auth UI | `components/Auth/` | ✅ Frontend-only |

## 📦 Available Scripts
```bash
npm run dev       # Dev server (http://localhost:5173)
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## 🎙️ Speech Recognition Languages
- English (en-US) - Default
- Hindi (hi-IN)
- Spanish (es-ES)
- French (fr-FR)
- German (de-DE)

## 🗂️ Project Structure
```
src/
├── components/    # React components
│   └── Auth/      # Login/Signup UI
├── hooks/         # useSpeechRecognition, useLocalStorage
├── utils/         # dateUtils, exportUtils
├── App.jsx        # State management
└── App.css        # Global styles & theme
```

## 💾 localStorage Keys
- `voice-notes`: All notes
- `theme-dark`: Theme preference
- `view-grid`: View mode

## 🎨 Theme Colors
**Light Mode**: Purple #6200ea, Teal #03dac6
**Dark Mode**: Same primaries, inverted backgrounds

## 📱 Responsive Breakpoints
- Desktop: 1024px+ (sidebar visible)
- Tablet: 768px - 1024px
- Mobile: < 768px (sidebar toggleable)

## ✨ Key Hooks
```javascript
// Speech recognition
const { transcript, isListening, language, ... } = useSpeechRecognition();

// Local storage persistence
const [notes, setNotes] = useLocalStorage('voice-notes', []);
```

## 🗑️ Auto-Delete Logic
- Soft delete notes (deleted: true)
- 10-day retention in "Recently Deleted"
- Auto-remove after 10 days

## 📊 Note Data Structure
```javascript
{
  id: timestamp,
  title: string,
  content: string,
  createdAt: ISO8601,
  updatedAt: ISO8601,
  archived: boolean,
  deleted: boolean,
  deletedAt: ISO8601 | null
}
```

## 🚀 Deployment
**Vercel**: Connect GitHub repo → Auto-deploys  
**Render**: Create render.yaml → Connect repo  
**Manual**: `npm run build` → Upload `dist/` folder

## 🌐 Browser Support
✅ Chrome, Edge  
✅ Safari 14.1+  
⚠️ Firefox (limited)

## 📚 Documentation Files
- `README.md` - User guide
- `ARCHITECTURE.md` - Technical details
- `DEVELOPMENT.md` - Developer guide
- `COMPLETION_SUMMARY.md` - This implementation overview

## 🔍 View localStorage
DevTools → Application → Local Storage → Find domain

## 🐛 Clear All Data
```javascript
// In browser console
localStorage.clear();
location.reload();
```

## 💡 Common Tasks
**Add Language**: Edit `useSpeechRecognition.js` languages object  
**Change Colors**: Edit CSS variables in `App.css`  
**Add Export Format**: Add function to `exportUtils.js`  
**Customize Theme**: Modify `.dark-mode` styles in `App.css`

## ⚙️ Configuration Files
- `package.json` - Dependencies & scripts
- `vite.config.js` - Vite configuration
- `eslint.config.js` - Linting rules
- `.gitignore` - Git ignore patterns

## 📞 If Something Breaks
1. Check browser console (F12)
2. Verify microphone permissions
3. Test in Chrome/Edge first
4. Clear localStorage and reload
5. Check DEVELOPMENT.md troubleshooting

## 🎓 Next Steps
1. ✅ Run locally: `npm run dev`
2. ✅ Test all features
3. ✅ Read DEVELOPMENT.md
4. ✅ Deploy to Vercel/Render
5. ✅ Add backend API when ready

---

**Status**: 🟢 **PRODUCTION READY**  
**Last Updated**: January 24, 2026  
**Made with ❤️ using React 18 + Vite**