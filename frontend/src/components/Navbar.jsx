import { Edit3 } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <Link
        className="bg-white/80  rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer group overflow-hidden relative"
        to="/"
      >
        <header className="bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl ml-5 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Edit3 className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  CollabNotes
                </h1>
              </div>
            </div>
          </div>
        </header>
      </Link>
    </>
  );
}
