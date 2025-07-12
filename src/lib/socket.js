// src/lib/socket.js
import express from "express";
import http from "http";
import { Server } from "socket.io";

export const app = express();
export const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",                       // dev Vite
      "https://spiffy-brigadeiros-344677.netlify.app" // Netlify prod
               
    ],
    credentials: true
  }
});

// --- in‑memory map: userId -> socketId
const userSocketMap = new Map();

const broadcastOnline = () => {
  io.emit("onlineUsers", Array.from(userSocketMap.keys()));
};

io.on("connection", socket => {
  console.log("⚡  Client connected:", socket.id);

  socket.on("login", userId => {
    userSocketMap.set(userId, socket.id);
    console.log(`✅  User ${userId} logged in on ${socket.id}`);
    broadcastOnline();
  });

  socket.on("joinRoom", roomId => socket.join(roomId));
  socket.on("leaveRoom", roomId => socket.leave(roomId));

  socket.on("newMessage", msg => {
    socket.to(msg.roomId).emit("messageFromServer", msg);
  });

  socket.on("disconnect", () => {
    for (const [uid, sid] of userSocketMap) {
      if (sid === socket.id) {
        userSocketMap.delete(uid);
        break;
      }
    }
    console.log("❌  Client disconnected:", socket.id);
    broadcastOnline();
  });
});
