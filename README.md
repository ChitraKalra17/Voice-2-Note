# 🎙️ Voice-2-Note

A full-stack voice-to-text note-taking application that allows users to record, save, and manage notes seamlessly using speech recognition and a clean UI.

---

## 🚀 Live Demo

* **Frontend (Vercel):** https://voice-2-note-pink.vercel.app
* **Backend (Render):** https://voice-2-note.onrender.com

---

## ✨ Features

* 🎤 Convert voice to text in real-time
* 🔐 User authentication (email & password)
* 📝 Create, view, and delete notes
* 💾 Persistent data storage
* 🌐 Fully deployed full-stack application
* 📱 Responsive and user-friendly interface

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* JavaScript (ES6+)
* CSS

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### Deployment

* Frontend: Vercel
* Backend: Render

---

## 📂 Project Structure

```id="kz1y6c"
Voice-2-Note/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.cjs
│   └── package.json
│
├── src/
│   ├── components/
│   ├── pages/
│   └── App.jsx
│
├── public/
├── index.html
└── vite.config.js
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash id="94smqq"
git clone https://github.com/ChitraKalra17/Voice-2-Note.git
cd Voice-2-Note
```

---

### 2. Backend Setup

```bash id="9yz25c"
cd backend
npm install
```

Create a `.env` file:

```env id="wssx9p"
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Run backend:

```bash id="rmklp9"
node server.cjs
```

---

### 3. Frontend Setup

```bash id="8nk2zu"
cd ..
npm install
```

Create `.env` file:

```env id="kpg7d3"
VITE_API_URL=http://localhost:5000
```

Run frontend:

```bash id="mkq6eq"
npm run dev
```

---

## 🌐 Deployment Notes

* Frontend deployed on Vercel
* Backend deployed on Render
* Environment variables configured for production

---

## ⚠️ Notes

* Render free tier may cause initial delay due to cold starts
* Ensure correct API URL is set in environment variables

---

## 🔮 Future Improvements

* 🔐 Secure authentication with JWT
* 🔑 Google Sign-In (OAuth)
* 🏷️ Tagging and searching notes
* 🌙 Dark mode
* 📤 Export notes

---

## 👩‍💻 Author

**Chitra Kalra**

* GitHub: https://github.com/ChitraKalra17
* LinkedIn: [www.linkedin.com/in/chitra-kalra-938290324](http://www.linkedin.com/in/chitra-kalra-938290324)

---