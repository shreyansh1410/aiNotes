import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  HomeIcon,
  StarIcon,
  SearchIcon,
  Trash2Icon,
  Music2Icon,
} from "lucide-react";
import { toast } from "sonner";
import { useNotesStore } from "../stores/notesStore";
import NoteModal from "../components/notes/NoteModal";
import { Note } from "../stores/notesStore";

const NoteCard = ({
  note,
  onFavorite,
  onDelete,
  onClick,
}: {
  note: Note;
  onFavorite: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onClick: (note: Note) => void;
}) => {
  const [imageError, setImageError] = useState(false);

  const formatDate = (date: string | Date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div
      onClick={() => onClick(note)}
      className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition relative cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2 pr-16">
          <h3 className="font-semibold text-lg">{note.title}</h3>
          {note.isAudioNote && (
            <span className="inline-flex items-center justify-center bg-blue-100 p-1 rounded-full">
              <Music2Icon size={16} className="text-blue-600" />
            </span>
          )}
        </div>
        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => onFavorite(note._id, e)}
            className={`p-1 rounded hover:bg-gray-100 ${
              note.isFavorite ? "text-yellow-500" : "text-gray-400"
            }`}
          >
            <StarIcon size={16} />
          </button>
          <button
            onClick={(e) => onDelete(note._id, e)}
            className="p-1 rounded hover:bg-gray-100 text-red-500"
          >
            <Trash2Icon size={16} />
          </button>
        </div>
      </div>
      <p className="text-gray-600 line-clamp-3">{note.content}</p>
      {note.imageUrl && !imageError && (
        <div className="mt-2">
          <img
            src={note.imageUrl}
            alt="Note attachment"
            className="max-h-32 w-full object-cover rounded"
            onError={(e) => {
              console.error("Image failed to load:", note.imageUrl);
              setImageError(true);
            }}
          />
        </div>
      )}
      <div className="text-xs text-gray-400 mt-2">
        {note.createdAt && formatDate(note.createdAt)}
      </div>
    </div>
  );
};
const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [currentView, setCurrentView] = useState<"all" | "favorites">("all");
  const { notes, fetchNotes, deleteNote, toggleFavorite, loading } =
    useNotesStore();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const filteredNotes = notes.filter(
    (note) =>
      (currentView === "all" ||
        (currentView === "favorites" && note.isFavorite)) &&
      (note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCardClick = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleDeleteNote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this note?")) {
      const success = await deleteNote(id);
      if (success) {
        toast.success("Note deleted");
      } else {
        toast.error("Failed to delete note");
      }
    }
  };

  const handleFavoriteNote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await toggleFavorite(id);
    if (success) {
      toast.success("Note updated");
    } else {
      toast.error("Failed to update note");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  const handleCreateNewNote = () => {
    setSelectedNote(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-8">AI Notes</h1>
          <nav className="space-y-2">
            <button
              onClick={() => setCurrentView("all")}
              className={`flex items-center space-x-2 w-full p-2 rounded transition-colors ${
                currentView === "all"
                  ? "bg-purple-100 text-purple-700"
                  : "hover:bg-gray-100"
              }`}
            >
              <HomeIcon size={20} />
              <span>All Notes</span>
            </button>
            <button
              onClick={() => setCurrentView("favorites")}
              className={`flex items-center space-x-2 w-full p-2 rounded transition-colors ${
                currentView === "favorites"
                  ? "bg-purple-100 text-purple-700"
                  : "hover:bg-gray-100"
              }`}
            >
              <StarIcon size={20} />
              <span>Favorites</span>
            </button>
          </nav>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {currentView === "all" ? "All Notes" : "Favorite Notes"}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onClick={handleCardClick}
                  onFavorite={handleFavoriteNote}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          )}

          <button
            onClick={handleCreateNewNote}
            className="fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
          >
            <PlusIcon size={24} />
          </button>
        </div>
      </div>

      {isModalOpen && (
        <NoteModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          note={selectedNote}
          isEditing={!!selectedNote}
        />
      )}
    </div>
  );
};

export default Dashboard;
