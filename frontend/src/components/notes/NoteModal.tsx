import React, { useState, useEffect } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { useNotesStore } from "../../stores/notesStore";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";
import { toast } from "sonner";
import { Expand, Mic, MicOff, Star, Image as ImageIcon, X } from "lucide-react";
import { Note } from "../../stores/notesStore";
import { notesService } from "../../services/api";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note?: Note | null;
  isEditing?: boolean;
}

const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  note,
  isEditing = false,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { createNote, updateNote } = useNotesStore();
  const { transcript, isListening, startListening, stopListening } =
    useSpeechRecognition();

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setImageUrl(note.imageUrl || null);
    }
  }, [note]);

  useEffect(() => {
    if (transcript && !isListening) {
      // Only update when listening stops
      setContent((prev) => prev + " " + transcript.trim());
    }
  }, [transcript, isListening]);

  const handleSpeechRecognition = () => {
    if (!isListening) {
      startListening();
      toast("Recording started - will stop after 60 seconds", { icon: "🎤" });
    } else {
      stopListening();
      toast("Converting speech to text...", { icon: "⌛" });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const { imageUrl } = await notesService.uploadImage(file);
      setImageUrl(imageUrl);

      if (isEditing && note?._id) {
        await updateNote(note._id, { ...note, imageUrl });
      }

      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const noteData = {
        title,
        content,
        isAudioNote: false,
        imageUrl,
        isFavorite: note?.isFavorite || false,
      };

      if (isEditing && note?._id) {
        await updateNote(note._id, noteData);
        toast.success("Note updated successfully");
      } else {
        await createNote(noteData);
        toast.success("Note created successfully");
      }
      onClose();
    } catch (error) {
      toast.error(
        isEditing ? "Failed to update note" : "Failed to create note"
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div
        className={`fixed inset-0 bg-black/50 flex items-center justify-center ${
          isFullscreen ? "p-0" : "p-4"
        }`}
      >
        <div
          className={`bg-white rounded-lg ${
            isFullscreen ? "w-full h-full" : "w-full max-w-2xl"
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-2xl font-bold">
              {isEditing ? "Edit Note" : "Create Note"}
            </h2>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Expand size={20} />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <input
              type="text"
              placeholder="Note Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />

            <div className="flex space-x-2 mb-2">
              <button
                type="button"
                onClick={handleSpeechRecognition}
                className={`p-2 rounded ${
                  isListening ? "bg-red-500" : "bg-green-500"
                } text-white`}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <label className="p-2 bg-blue-500 text-white rounded cursor-pointer">
                <ImageIcon size={20} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
              {note && (
                <button
                  type="button"
                  onClick={() =>
                    updateNote(note._id, { isFavorite: !note.isFavorite })
                  }
                  className={`p-2 rounded ${
                    note.isFavorite ? "bg-yellow-500" : "bg-gray-200"
                  }`}
                >
                  <Star size={20} />
                </button>
              )}
            </div>

            {imageUrl && (
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="Note attachment"
                  className="max-h-40 object-contain"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl(null)}
                  className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <textarea
              placeholder="Note Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`w-full p-2 border rounded ${
                isFullscreen ? "h-[calc(100vh-300px)]" : "h-64"
              }`}
            />

            {isListening && (
              <div className="text-blue-500">
                Recording... Current transcript: {transcript}
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {isEditing ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default NoteModal;
