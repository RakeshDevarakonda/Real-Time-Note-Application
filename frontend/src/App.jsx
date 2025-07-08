


import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/Home';
import NoteEditor from './components/NoteEditor';
import socket from "./socket";
import { useEffect } from "react";

export default function App() {

  useEffect(() => {

    if (!socket.connected) {
      socket.connect();
      console.log("✅ Socket connected from App");
    }

    return () => {
      socket.disconnect();
      console.log("❌ Socket disconnected on app exit");
    };
  }, []);
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/note/:id" element={<NoteEditor />} />
      </Routes>
    </BrowserRouter>
  );
}

