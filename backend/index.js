import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import "dotenv/config";
import notesRoutes from "./routes/NotesRouter.js";
import { mongoosedatabse } from "./config/db.js";
import Note from "./models/Note.js";
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL1, process.env.FRONTEND_URL2],
    methods: ["GET", "POST"],
    credentials: true,
    transports: ["websocket", "polling"],
  },
  allowEIO3: true,
});

const corsOptions = {
  origin: [process.env.FRONTEND_URL1, process.env.FRONTEND_URL2],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.redirect("https://real-time-note-application.vercel.app/");
});
app.use("/api", notesRoutes);

const activeUsers = {};

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("getnotesbysocket", async (callback) => {
    try {
      const notes = await Note.find().sort({ updatedAt: -1 });
      callback({ success: true, notes });
    } catch (err) {
      console.error("❌ Error fetching notes:", err);
      callback({ success: false, error: "Could not fetch notes" });
    }
  });

  socket.on("create_note", async (data, callback) => {
    const { title, user } = data;

    try {
      const newNote = await Note.create({
        title,
        content: "Start typing your note here...",
        contributors: [user],
      });

      callback({ success: true, note: newNote });

      socket.broadcast.emit("note_created", newNote);
    } catch (err) {
      console.error("Error creating note via socket:", err);
      callback({ success: false, error: "Failed to create note" });
    }
  });

  socket.on("join_note", ({ noteId, userName, color }) => {
    socket.join(noteId);
    socket.noteId = noteId;
    socket.userName = userName;
    socket.color = color;

    socket.to(noteId).emit("user_joined", { userName });

    if (!activeUsers[noteId]) activeUsers[noteId] = [];

    const alreadyExists = activeUsers[noteId].some(
      (u) => u.socketId === socket.id
    );

    if (!alreadyExists) {
      activeUsers[noteId].push({
        socketId: socket.id,
        userName,
        color,
      });
    }

    io.to(noteId).emit("active_users", activeUsers[noteId]);

    socket.on("note_update", async ({ noteId, content }) => {
      socket.to(noteId).emit("note_update", content);

      try {
        await Note.findByIdAndUpdate(noteId, {
          content,
          updatedAt: new Date(),
        });
      } catch (err) {
        console.error("MongoDB update failed:", err.message);
      }
    });
  });

  socket.on("leave_note", ({ noteId, userName }) => {
    if (activeUsers[noteId]) {
      activeUsers[noteId] = activeUsers[noteId].filter(
        (u) => u.socketId !== socket.id
      );
      socket.to(noteId).emit("user_left", { userName });
      socket.leave(noteId);
      io.to(noteId).emit("active_users", activeUsers[noteId]);
    }
  });

  socket.on("disconnect", () => {
    Object.keys(activeUsers).forEach((noteId) => {
      const initialLength = activeUsers[noteId].length;
      activeUsers[noteId] = activeUsers[noteId].filter(
        (u) => u.socketId !== socket.id
      );

      if (activeUsers[noteId].length !== initialLength) {
        io.to(noteId).emit("active_users", activeUsers[noteId]);
      }

      // socket.to(noteId).emit("user_left", { userName });
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  mongoosedatabse();
  console.log(`🚀 Server running on port ${PORT}`);
});
