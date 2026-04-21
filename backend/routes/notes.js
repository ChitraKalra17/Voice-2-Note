const Note = require("./models/Note");

app.post("/notes", async (req, res) => {
  try {
    const { title, content, language } = req.body;

    const newNote = new Note({
      title,
      content,
      language,
      userId: req.userId
    });

    await newNote.save();

    res.json(newNote);

  } catch (error) {
    res.status(500).json({ error: "Failed to save note" });
  }
});