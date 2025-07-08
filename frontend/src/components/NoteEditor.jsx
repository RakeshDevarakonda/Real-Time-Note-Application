import axios from "axios";
import { BarChart3, ChevronLeft, Users } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { replace, useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import socket from "../socket";
import { getRandomUser } from "../../utils/generateName";
import { useDispatch, useSelector } from "react-redux";

import JoditEditor from "jodit-react";

import {
  noteSelector,
  setActiveUsers,
  setSelectedNote,
  setUserDetails,
  updateNoteContent,
} from "../Redux/NoteAppRedux";
import { getRandomColor } from "../../utils/generatecolors";
import { useMemo } from "react";
import { toast } from "react-toastify";

export default function NoteEditor() {
  const editor = useRef(null);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { activeUsers, selectedNote, userDetail } = useSelector(noteSelector);
  selectedNote;

  const dispatch = useDispatch();

  const { id } = useParams();

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

  useEffect(() => {
    if (!id || !userDetail) return;

    socket.emit("join_note", {
      noteId: id,
      userName: userDetail?.name,
      color: userDetail?.color,
    });

    const handleActiveUsers = (userList) => {
      dispatch(setActiveUsers(userList));
    };

    const handleUserJoined = ({ userName }) => {
      console.log("User joined:", userName);
      // toast(`${userName} has joined the room.`);
    };

    const handleUserLeft = ({ userName }) => {
      // toast(`${userName} has left the room.`);
    };

    socket.on("active_users", handleActiveUsers);
    socket.on("user_joined", handleUserJoined);
    socket.on("user_left", handleUserLeft);

    return () => {
      socket.off("active_users", handleActiveUsers);
      socket.off("user_joined", handleUserJoined);
      socket.off("user_left", handleUserLeft);
      socket.emit("leave_note", { noteId: id, userName: userDetail?.name });
    };
  }, [id, userDetail?.name]);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/${id}`);
        dispatch(setSelectedNote(res.data));
        console.log(res.data);
      } catch (err) {
        console.error("Failed to fetch note:", err);
      }
    };

    if (id) {
      fetchNote();
    }
  }, [id]);

  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);

  useEffect(() => {
    const words = selectedNote?.content
      .trim()
      .split(/\s+/)
      .filter((word) => word?.length > 0).length;
    const chars = selectedNote?.content.length;
    const lines = selectedNote?.content.split("\n").length;

    setWordCount(words);
    setCharCount(chars);
    setLineCount(lines);
  }, [selectedNote]);

  const handleContentChange = (e) => {
    const updatedContent = e;
    dispatch(updateNoteContent(updatedContent));

    if (socket.connected) {
      socket.emit("note_update", { noteId: id, content: updatedContent });
    } else {
      axios
        .put(`${API_BASE_URL}/api/${id}`, { content: updatedContent })
        .catch((err) => console.error("API fallback failed:", err));
    }
  };

  useEffect(() => {
    const handleUpdateContent = (newContent) => {
      dispatch(updateNoteContent(newContent));
    };

    socket.on("note_update", handleUpdateContent);

    return () => {
      socket.off("note_update", handleUpdateContent);
    };
  }, []);

  const editorConfig = useMemo(
    () => ({
      readonly: false,
      toolbarAdaptive: false,
      height: 500,
      width: "100%",
      askBeforePasteHTML: false,
      pastePlainText: true,
      placeholder: "",

      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "eraser",
        "ul",
        "ol",
        "font",
        "fontsize",
        "paragraph",
        "lineHeight",
        "subscript",
        "superscript",
        "classSpan",
        "image",
        "video",
        "file",
        "speechRecognize",
        "paste",
        "selectall",
        "table",
        "hr",
        "link",
        "indent",
        "outdent",
        "left",
        "center",
        "right",
        "justify",
        "brush",
        "copyformat",
        "undo",
        "redo",
        "find",
        "source",
        "fullsize",
        "preview",
      ],
    }),
    [dispatch]
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="animate-fade-in">
          {/* Editor Header */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate("/")}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {selectedNote?.title}
                  </h1>
                  {/* <p className="text-sm text-gray-500">
                    Auto-saved {Math.floor((new Date() - lastSaved) / 1000)}{" "}
                    seconds ago
                  </p> */}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                {/* <textarea
                  value={selectedNote?.content}
                  onChange={handleContentChange}
                  className="w-full h-96 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none font-mono text-sm leading-relaxed"
                  placeholder="Start typing your note here..."
                /> */}

                <JoditEditor
                  ref={editor}
                  value={selectedNote?.content}
                  config={editorConfig}
                  onChange={(newContent) => {
                    handleContentChange(newContent);
                  }}
                  place
                  className="w-full"
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Active Users */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Active Users ({activeUsers?.length})</span>
                </h3>

                <div className="space-y-3">
                  {activeUsers?.map((user, index) => {
                    return (
                      <div
                        key={user.socketId || index}
                        className="flex items-center space-x-3 bg-white/80 p-2 rounded-xl shadow-sm"
                      >
                        <div
                          className={`w-8 h-8 ${getRandomColor(
                            user?.userName.slice(0, 1)
                          )} rounded-full border-2 border-white flex items-center justify-center text-sm text-white font-bold shadow-md`}
                          title={user.userName}
                        >
                          {user?.userName.slice(0, 1).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {user.userName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* {collabs} */}

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>
                    Collabarators ({selectedNote?.contributors?.length})
                  </span>
                </h3>

                <div className="space-y-3">
                  {selectedNote?.contributors.map((user, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 bg-white/80 p-2 rounded-xl shadow-sm"
                    >
                      <div
                        className={`w-8 h-8 ${getRandomColor(
                          user?.name.slice(0, 1)
                        )} rounded-full border-2 border-white flex items-center justify-center text-sm  font-bold shadow-md`}
                        title={user?.name}
                      >
                        {user?.name.slice(0, 1).toUpperCase()}
                      </div>
                      <span className="text-sm ml-2 font-medium text-gray-700">
                        {user?.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Note Stats */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Note Stats</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Words</span>
                    <span className="text-sm font-medium text-gray-900">
                      {wordCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Characters</span>
                    <span className="text-sm font-medium text-gray-900">
                      {charCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Lines</span>
                    <span className="text-sm font-medium text-gray-900">
                      {lineCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
