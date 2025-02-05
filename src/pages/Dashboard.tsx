import React, { useState } from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import { CiSearch } from "react-icons/ci";
import { toast } from "sonner";
import { FaMicrophone } from "react-icons/fa";

interface Note {
  id: string;
  title: string;
  content: string;
  isAudioNote: boolean;
  createdAt: Date;
}

const Dashboard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleStartRecording = () => {
    // Implement speech recognition
    toast("Recording started", { icon: <FaMicrophone /> });
  };

  const handleCreateNote = () => {
    // Open note creation modal
    toast("Create new note");
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Notes</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-64"
            />
            <CiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <h3 className="font-semibold text-lg mb-2">{note.title}</h3>
            <p className="text-gray-600 truncate">{note.content}</p>
          </div>
        ))}
      </div>

      <div className="fixed bottom-6 right-6 flex space-x-4">
        <button
          onClick={handleStartRecording}
          className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition"
        >
          <FaMicrophone />
        </button>
        <button
          onClick={handleCreateNote}
          className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition"
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
