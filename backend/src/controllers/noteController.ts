import { Request, Response } from "express";
import Note from "../models/Note";

interface AuthRequest extends Request {
  user?: any;
}

export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, isAudioNote, isFavorite } = req.body;

    const note = new Note({
      title,
      content,
      user: req.user._id,
      isAudioNote,
      isFavorite,
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating note" });
  }
};

export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const notes = await Note.find({ user: req.user._id });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching notes" });
  }
};

export const updateNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, isAudioNote, isFavorite } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { title, content, isAudioNote, isFavorite },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating note" });
  }
};

export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const note = await Note.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting note" });
  }
};
