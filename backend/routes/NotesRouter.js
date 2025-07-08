import express from "express";
import Note from "../models/Note.js";

const notesRoutes = express.Router();

notesRoutes.get("/allnotes", async (req, res) => {
  try {
    const notes = await Note.find().sort({ updatedAt: -1 }); // latest first
    res.json(notes);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error fetching notes" });
  }
});
notesRoutes.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: "Error fetching note" });
  }
});

notesRoutes.post("/newnote", async (req, res) => {
  try {
    const { title, contributors } = req.body;
    const newNote = new Note({
      title,
      content: "Start typing your note here...",
      contributors,
    });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ error: "Failed to create note" });
  }
});

notesRoutes.put("/:id", async (req, res) => {
  try {
    const { content } = req.body;
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { content, updatedAt: new Date() },
      { new: true }
    );
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: "Error updating note" });
  }
});

export default notesRoutes;
