import { create } from "zustand";
import { notesService } from "../services/api";

export interface Note {
  _id: string;
  id?: string;
  title: string;
  content: string;
  isAudioNote?: boolean;
  createdAt?: Date;
  isFavorite?: boolean;
  imageUrl?: string | null;
}

interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
  fetchNotes: () => Promise<void>;
  createNote: (note: Partial<Note>) => Promise<void>;
  updateNote: (id: string, note: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<boolean>;
  toggleFavorite: (id: string) => Promise<boolean>;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  loading: false,
  error: null,

  fetchNotes: async () => {
    set({ loading: true, error: null });
    try {
      const response = await notesService.getNotes();
      set({ notes: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch notes", loading: false });
    }
  },

  createNote: async (note) => {
    set({ loading: true, error: null });
    try {
      const response = await notesService.createNote(note);
      set((state) => ({
        notes: [...state.notes, response.data],
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to create note", loading: false });
      throw error;
    }
  },

  updateNote: async (id, note) => {
    set({ loading: true, error: null });
    try {
      const response = await notesService.updateNote(id, note);
      set((state) => ({
        notes: state.notes.map((n) =>
          n._id === id ? { ...n, ...response.data } : n
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to update note", loading: false });
      throw error;
    }
  },

  deleteNote: async (id) => {
    set({ loading: true, error: null });
    try {
      await notesService.deleteNote(id);
      set((state) => ({
        notes: state.notes.filter((note) => note._id !== id),
        loading: false,
      }));
      return true;
    } catch (error) {
      set({ error: "Failed to delete note", loading: false });
      return false;
    }
  },

  toggleFavorite: async (id) => {
    set({ loading: true, error: null });
    try {
      // Find the current note and get its favorite status using get()
      const currentNote = get().notes.find((n) => n._id === id);
      const newFavoriteStatus = !(currentNote?.isFavorite ?? false);

      const response = await notesService.updateNote(id, {
        isFavorite: newFavoriteStatus,
      });
      set((state) => ({
        notes: state.notes.map((n) => (n._id === id ? response.data : n)),
        loading: false,
      }));
      return true;
    } catch (error) {
      set({ error: "Failed to update favorite status", loading: false });
      return false;
    }
  },
}));
