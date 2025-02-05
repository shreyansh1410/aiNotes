import { create } from "zustand";
import { notesService } from "../services/api";

export interface Note {
  id?: string;
  title: string;
  content: string;
  isAudioNote?: boolean;
  createdAt?: Date;
  isFavorite?: boolean;
}

interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
  fetchNotes: () => Promise<void>;
  createNote: (note: Note) => Promise<void>;
  updateNote: (id: string, note: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  favoriteNote: (id: string) => Promise<void>;
}

export const useNotesStore = create<NotesState>((set) => ({
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
    }
  },

  updateNote: async (id, note) => {
    set({ loading: true, error: null });
    try {
      const response = await notesService.updateNote(id, note);
      set((state) => ({
        notes: state.notes.map((n) =>
          n.id === id ? { ...n, ...response.data } : n
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to update note", loading: false });
    }
  },

  deleteNote: async (id) => {
    set({ loading: true, error: null });
    try {
      await notesService.deleteNote(id);
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to delete note", loading: false });
    }
  },

  favoriteNote: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await notesService.updateNote(id, { isFavorite: true });
      set((state) => ({
        notes: state.notes.map((n) => (n.id === id ? response.data : n)),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to favorite note", loading: false });
    }
  },
}));
