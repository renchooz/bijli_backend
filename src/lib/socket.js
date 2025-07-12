import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

// Track userId ↔ socketId
const userSocketMap = new Map();   // key: userId , value: socketId

const broadcastOnline = () => {
  io.emit('onlineUsers', Array.from(userSocketMap.keys())); // ⚡
};

io.on('connection', (socket) => {
  console.log('⚡ Client connected:', socket.id);

  // store mapping on login
  socket.on('login', (userId) => {
    userSocketMap.set(userId, socket.id);
    console.log(`✅ User ${userId} connected with socket ${socket.id}`);
    broadcastOnline();                                                // ⚡
  });

  // join / leave private rooms
  socket.on('joinRoom', (roomId) => socket.join(roomId));
  socket.on('leaveRoom', (roomId) => socket.leave(roomId));

  // relay new messages
  socket.on('newMessage', (msg) => {
    socket.to(msg.roomId).emit('messageFromServer', msg);
  });

  socket.on('disconnect', () => {
    for (const [uid, sid] of userSocketMap.entries()) {
      if (sid === socket.id) {
        userSocketMap.delete(uid);
        break;
      }
    }
    broadcastOnline();                                               // ⚡
    console.log('❌ Client disconnected:', socket.id);
  });
});

export { app, io, server };
