import React from "react";
import { Link } from "react-router-dom";
import { getRandomColor } from "../../utils/generatecolors";

export default function NoteCard({ note }) {
  function formatTime(timestamp) {
    const date = new Date(timestamp);

    const options = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    return date.toLocaleTimeString(undefined, options);
  }



  return (
    <>
      <Link
        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer group overflow-hidden relative"
        to={`/note/${note?._id}`}
      >
        {/* Card Header Gradient */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>

        <div className="p-8">
          {/* Title and Users */}
          <div className="flex items-start justify-between mb-6">
            <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
              {note?.title}
            </h4>
            <div className="flex items-center space-x-3">
              <div className="flex -space-x-2">
                <div className="flex -space-x-2">
                  {note?.contributors.map((user, index) => {
                    console.log(user?.color);
                    return (
                      <div
                        key={index}
                        className={`w-8 h-8 ${getRandomColor()} rounded-full border-2 border-white 
        flex items-center justify-center text-sm text-black font-bold 
        shadow-md hover:scale-110 transition-transform duration-200`}
                        title={user?.name}
                      >
                        {user?.name.slice(0, 1).toUpperCase()}
                      </div>
                    );
                  })}
                </div>
              </div>
              {note?.contributors?.length > 0 && (
                <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full">
                  {note?.contributors?.length} users
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <p className="text-gray-600 text-base mb-6 leading-relaxed">
            {note?.content}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 font-medium">
              {formatTime(note?.updatedAt)}
            </span>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"></div>
      </Link>
    </>
  );
}
