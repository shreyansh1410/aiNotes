import React, { useState, useEffect } from "react";
import { PlusIcon, TrashIcon, StarIcon } from "@radix-ui/react-icons";
import { CiSearch } from "react-icons/ci";
import { toast } from "sonner";
import { FaMicrophone } from "react-icons/fa";
import { useNotesStore } from "../stores/notesStore";
import NoteModal from "../components/notes/NoteModal";

// Add these type declarations at the top of the file, after the imports
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  start(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
}

interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { notes, fetchNotes, deleteNote, favoriteNote, loading } =
    useNotesStore();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    toast.success("Note deleted");
  };

  const handleFavoriteNote = (id: string) => {
    favoriteNote(id);
    toast.success("Note favorited");
  };

  const handleSpeechInput = () => {
    // Implement speech recognition
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
    };
    recognition.start();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Notes</h1>
        <div className="relative">
          <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <FaMicrophone
            onClick={handleSpeechInput}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
          />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 py-2 border rounded-lg w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition relative"
            >
              <h3 className="font-semibold text-lg mb-2">{note.title}</h3>
              <p className="text-gray-600 truncate">{note.content}</p>
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => handleFavoriteNote(note.id!)}
                  className="text-yellow-500 hover:text-yellow-600"
                >
                  <StarIcon />
                </button>
                <button
                  onClick={() => handleDeleteNote(note.id!)}
                  className="text-red-500 hover:text-red-600"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="fixed bottom-6 right-6 flex space-x-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition"
        >
          <PlusIcon />
        </button>
      </div>

      {isModalOpen &&  <NoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Dashboard;
