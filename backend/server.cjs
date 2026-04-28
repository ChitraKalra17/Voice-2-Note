const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("./models/User");
const Note = require("./models/Note");

const app = express();

// middleware
app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? "https://voice-2-note-pink.vercel.app"
    : "http://localhost:5173", // Vite default (not 3000)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

//AUTH MIDDLEWARE
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  console.log('Auth middleware - Token:', token ? 'present' : 'missing');

  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, "secretkey");
    console.log('Auth middleware - User ID:', decoded.userId);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.log('Auth middleware - Token error:', err.message);
    res.status(401).json({ error: "Invalid token" });
  }
};

//DB
mongoose.connect(process.env.MONGO_URI)
  .catch(err => console.error(err));


//AUTH ROUTES

//SIGNUP
app.post("/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword
  });

  await user.save();

  res.json({ message: "User created" });
});


//LOGIN
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Wrong password" });

  const token = jwt.sign(
    { userId: user._id },
    "secretkey",
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: {
      name: user.name,
      email: user.email
    }
  });
});


//NOTES ROUTES (ALL PROTECTED)

//GET NOTES (USER-SPECIFIC)
app.get("/notes", authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});


//CREATE NOTE
app.post("/notes", authMiddleware, async (req, res) => {
  try {
    console.log('POST /notes - Creating note with data:', req.body);
    const { title, content, language } = req.body;

    const newNote = new Note({
      title,
      content,
      language,
      userId: req.userId
    });

    await newNote.save();
    console.log('POST /notes - Note saved:', newNote._id);

    res.json({
      message: "Note saved successfully",
      note: newNote
    });
  } catch (err) {
    console.error('POST /notes - Error:', err);
    res.status(500).json({ error: "Failed to save note" });
  }
});


//UPDATE NOTE (ONLY OWNER CAN UPDATE)
app.put("/notes/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!note) return res.status(404).json({ error: "Note not found" });

    Object.assign(note, req.body, { updatedAt: Date.now() });

    await note.save();

    res.json(note);

  } catch {
    res.status(500).json({ error: "Failed to update note" });
  }
});


//DELETE NOTE (HARD DELETE)
app.delete("/notes/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!note) return res.status(404).json({ error: "Note not found" });

    res.json({ message: "Deleted" });

  } catch {
    res.status(500).json({ error: "Failed to delete note" });
  }
});


//ARCHIVE TOGGLE
app.patch("/notes/:id/archive", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!note) return res.status(404).json({ error: "Note not found" });

    note.archived = !note.archived;
    await note.save();

    res.json(note);

  } catch {
    res.status(500).json({ error: "Failed to archive note" });
  }
});


//SOFT DELETE
app.patch("/notes/:id/delete", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!note) return res.status(404).json({ error: "Note not found" });

    note.deleted = true;
    note.updatedAt = Date.now();

    await note.save();

    res.json(note);

  } catch {
    res.status(500).json({ error: "Failed to delete note" });
  }
});


//RESTORE
app.patch("/notes/:id/restore", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!note) return res.status(404).json({ error: "Note not found" });

    note.deleted = false;
    note.archived = false;

    await note.save();

    res.json(note);

  } catch {
    res.status(500).json({ error: "Failed to restore note" });
  }
});


//SERVER
app.listen(5000, () => {
  console.log("Server listening on port 5000");
});