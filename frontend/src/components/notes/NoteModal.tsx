import React, { useState } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { useNotesStore } from "../../stores/notesStore";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";
import { toast } from "sonner";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { createNote } = useNotesStore();
  const { transcript, isListening, startListening, stopListening } =
    useSpeechRecognition();

  const handleSpeechRecognition = () => {
    if (!isListening) {
      startListening();
      toast("Recording started", { icon: "🎤" });
    } else {
      stopListening();
      setContent(transcript);
      toast("Transcription complete", { icon: "✅" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createNote({
        title,
        content,
        isAudioNote: isListening,
      });
      toast.success("Note created successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to create note");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Create Note</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Note Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              placeholder="Note Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded h-32"
            />
            {isListening && (
              <div className="text-blue-500">Listening... {transcript}</div>
            )}
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleSpeechRecognition}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                {isListening ? "Stop Recording" : "Voice Input"}
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Create Note
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default NoteModal;
