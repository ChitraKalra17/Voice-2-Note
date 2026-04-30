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
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://voice-2-note-pink.vercel.app"
];

app.use(cors({
  origin: function(origin, callback) {
    console.log('CORS: Request origin:', origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('CORS: Origin not allowed:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

//AUTH MIDDLEWARE
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  console.log('Auth middleware - Token:', token ? 'present' : 'missing');

  if (!token) {
    console.error('Auth middleware - No token provided');
    return res.status(401).json({ error: "No token" });
  }

  try {
    const decoded = jwt.verify(token, "secretkey");
    console.log('Auth middleware - User ID:', decoded.userId);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error('Auth middleware - Token error:', err.message);
    res.status(401).json({ error: "Invalid token" });
  }
};

//DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✓ MongoDB Connected Successfully'))
  .catch(err => {
    console.error('✗ MongoDB Connection Error:', err.message);
    console.error('  MONGO_URI:', process.env.MONGO_URI ? 'is set' : 'is NOT set');
  });

//TEST ENDPOINT
app.get("/test", (req, res) => {
  res.json({ message: "Backend is connected!" });
});

//AUTH ROUTES

//SIGNUP
app.post("/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('Signup attempt for email:', email);

    if (!name || !email || !password) {
      console.error('Signup: Missing required fields');
      return res.status(400).json({ error: "Name, email, and password required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error('Signup: User already exists:', email);
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();
    console.log('Signup: User created successfully:', email);

    res.json({ message: "User created" });
  } catch (err) {
    console.error('Signup: Error:', err.message);
    res.status(500).json({ error: "Signup failed: " + err.message });
  }
});


//LOGIN
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    if (!email || !password) {
      console.error('Login: Missing email or password');
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.error('Login: User not found for email:', email);
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error('Login: Wrong password for user:', email);
      return res.status(400).json({ error: "Wrong password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      "secretkey",
      { expiresIn: "7d" }
    );

    console.log('Login: Success for user:', email, 'Token:', token.substring(0, 20) + '...');
    res.json({
      token,
      user: {
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login: Error:', err.message);
    res.status(500).json({ error: "Login failed: " + err.message });
  }
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
    console.log('POST /notes - UserId:', req.userId);
    const { title, content, language } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const newNote = new Note({
      title,
      content,
      language,
      userId: req.userId
    });

    await newNote.save();
    console.log('POST /notes - Note saved successfully:', newNote._id);

    res.json({
      message: "Note saved successfully",
      note: newNote
    });
  } catch (err) {
    console.error('POST /notes - Error:', err.message);
    console.error('POST /notes - Full error:', err);
    res.status(500).json({ error: "Failed to save note: " + err.message });
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