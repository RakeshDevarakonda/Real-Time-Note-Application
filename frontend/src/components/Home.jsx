import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import Navbar from "./Navbar";
import NoteCard from "./NoteCard";
import { getRandomUser } from "../../utils/generateName";
import socket from "../socket";
import {
  noteSelector,
  setNewNoteTitle,
  setSelectedNote,
  setUserDetails,
  setNotes,
  addNote,
} from "../Redux/NoteAppRedux";
import { useDispatch, useSelector } from "react-redux";



export default function Home() {

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { userDetail, notes, newNoteTitle } = useSelector(noteSelector);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}api/allnotes`);
        dispatch(setNotes(res?.data));
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      }
    };

    socket.emit("getnotesbysocket", (response) => {
      if (response.success) {
        console.log(response.notes);
        dispatch(setNotes(response?.notes));
      } else {
        fetchNotes();
      }
    });
  }, []);

  useEffect(() => {
    let storedUser = localStorage.getItem("user");

    if (!storedUser) {
      const newUser = getRandomUser();
      localStorage.setItem("user", JSON.stringify(newUser));
      dispatch(setUserDetails(newUser));
    } else {
      dispatch(setUserDetails(JSON.parse(storedUser)));
    }
  }, []);

  const handleCreateNote = async () => {
    if (!newNoteTitle.trim()) return;

    const user = {
      name: userDetail?.name,
      color: userDetail?.color,
    };

    const payload = {
      title: newNoteTitle,
      user,
    };

    socket.emit("create_note", payload, (response) => {
      if (response.success) {
        const newCreateNoteData = response.note;
        dispatch(setSelectedNote(newCreateNoteData));
        navigate(`/note/${newCreateNoteData?._id}`);
        dispatch(setNewNoteTitle(""));
      } else {
        console.error("Socket note creation failed:", response.error);
        fallbackToAPI();
      }
    });

    async function fallbackToAPI() {
      try {
        const res = await axios.post(`${ API_BASE_URL}/api/newnote`, {
          title: newNoteTitle,
          contributors: [user],
        });
        const createdNote = res.data;
        dispatch(setNotes([createdNote, ...notes]));
        dispatch(setSelectedNote(createdNote));
        dispatch(setNewNoteTitle(""));
        navigate(`/note/${createdNote?._id}`);
      } catch (err) {
        console.error("API fallback failed:", err);
      }
    }
  };

  useEffect(() => {
    const handleNewNote = (newNote) => {
      dispatch(addNote(newNote));
    };

    socket.on("note_created", handleNewNote);

    return () => {
      socket.off("note_created", handleNewNote);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Collaborate in{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Real-Time
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Create, edit, and share notes with your team instantly. See changes
            as they happen with beautiful real-time collaboration.
          </p>
        </div>

        {/* Create Note Form */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 hover:shadow-3xl transition-all duration-500">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Create Note Room
            </h3>
            <div className="space-y-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateNote();
                }}
              >
                <div className="relative">
                  <input
                    type="text"
                    value={newNoteTitle}
                    onChange={(e) => dispatch(setNewNoteTitle(e.target.value))}
                    placeholder="Enter note title..."
                    className="w-full px-6 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 text-lg placeholder-gray-400 shadow-inner"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none"></div>
                </div>

                <button
                  type="submit"
                  disabled={!newNoteTitle?.trim()}
                  className="mt-4 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-4 px-8 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none shadow-lg"
                >
                  Create Note Room
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Notes Grid */}

        {notes?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {notes?.map((note) => (
              <NoteCard key={note?._id} note={note} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-lg mt-10">
            No notes found.
          </div>
        )}
      </div>
    </div>
  );
}
