import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

import authRoute from './src/routes/authRouter.js';
import messageRoute from './src/routes/MessageRoute.js';
import dbConnection from './src/lib/db.js';
import { app, server } from './src/lib/socket.js';

dotenv.config();

const __dirname = path.resolve();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Start server
server.listen(port, () => {
  console.log("✅ Server listening on port " + port);
  dbConnection();
});
