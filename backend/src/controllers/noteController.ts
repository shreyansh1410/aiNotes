import { Request, Response } from "express";
import Note from "../models/Note";

interface AuthRequest extends Request {
  user?: any;
}

export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, isAudioNote, isFavorite, imageUrl } = req.body;
    console.log("Create Note Request Body:", req.body); // Debug log

    const note = new Note({
      title,
      content,
      user: req.user._id,
      isAudioNote,
      isFavorite,
      imageUrl, // Explicitly include imageUrl
    });

    await note.save();
    console.log("Saved Note:", note); // Debug log
    res.status(201).json(note);
  } catch (error) {
    console.error("Create Note Error:", error);
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
    const { title, content, isAudioNote, isFavorite, imageUrl } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { title, content, isAudioNote, isFavorite, imageUrl },
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
    const noteExists = await Note.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!noteExists) {
      return res.status(404).json({ message: "Note not found" });
    }

    const note = await Note.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting note" });
  }
};

export const uploadImage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.json({
      imageUrl: req.file.path,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Error uploading image" });
  }
};
