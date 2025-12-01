// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// dotenv.config();
// const app = express();
// import cookieParser from "cookie-parser";
// import { connectDB } from "./config/db.js";
// import authRoutes from "./routes/authRoutes.js";
// import mentorRoutes from "./routes/mentorRoutes.js";
// import router from "./routes/resumeRoutes.js";
// import getMentorRoutes from "./routes/getMentorRoutes.js";
// import sessionRoutes from "./routes/sessionRoutes.js";
// import webhookRoutes from "./routes/webhookRoutes.js";
// import "./config/sessionReminder.js";
// import "./config/sessionStatusUpdater.js";
// import path from "path";
// import { createServer } from "http";
// import { Server } from "socket.io";

// import cookieSession from "cookie-session"; 
// import Session from "./models/sessionModel.js"; // <-- added import

// app.use(
//   cookieSession({
//     name: "session",
//     keys: [process.env.SESSION_SECRET || "secret"],
//     maxAge: 24 * 60 * 60 * 1000, // 1 day
//   })
// );

// const server = createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "https://skill-match-ai-ashy.vercel.app",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// io.on("connection", (socket) => {
 

//   // Handle joining a session
//   socket.on("join-session", (sessionId) => {
    
//     socket.join(sessionId);

//     const room = io.sockets.adapter.rooms.get(sessionId);
//     const participants = room ? room.size : 0;
    

//     // Notify existing participants about new peer
//     if (participants > 1) {
//       console.log(`📢 Notifying existing participant in room ${sessionId}`);
//       socket.to(sessionId).emit("peer-joined", socket.id);
//     } else {
//       console.log(`⏳ First user in room ${sessionId}, waiting for peer...`);
//     }
//   });

//   // New: record which role joined and timestamp it in DB helper
//   socket.on("joined-session", async (data) => {
//     try {
//       const { sessionId, role } = data || {};
//       if (!sessionId) return;
//       const session = await Session.findById(sessionId);
//       if (!session) {
//         console.warn(`⚠️ Session not found for joined-session: ${sessionId}`);
//         return;
//       }
//       const now = new Date();
//       if (role === "mentor") {
//         if (!session.mentorJoinedAt) {
//           session.mentorJoinedAt = now;
//           await session.save();
          
//         }
//       } else {
//         // treat as user by default
//         if (!session.userJoinedAt) {
//           session.userJoinedAt = now;
//           session.joined = true; // keep backwards compatibility
//           await session.save();
          
//         }
//       }
//     } catch (err) {
//       console.error("❌ Error handling joined-session:", err.message);
//     }
//   });

//   // Handle WebRTC offer
//   socket.on("offer", (data) => {
    
//     socket.to(data.sessionId).emit("offer", data);
//   });

//   // Handle WebRTC answer
//   socket.on("answer", (data) => {
//     socket.to(data.sessionId).emit("answer", data);
//   });

//   // Handle ICE candidates
//   socket.on("ice-candidate", (data) => {
   
//     socket.to(data.sessionId).emit("ice-candidate", data);
//   });

//   // Handle disconnection
//   socket.on("disconnect", () => {
//     console.log("❌ User disconnected:", socket.id);
//   });
// });

// // Express middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// app.use(
//   cors({
//     origin: "https://skill-match-ai-ashy.vercel.app",
//     credentials: true,
//   })
// );

// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// const port = process.env.PORT || 5000;

// connectDB();

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/mentor", mentorRoutes);
// app.use("/api/resume", router);
// app.use("/api", getMentorRoutes);
// app.use("/api/session", sessionRoutes);
// app.post(
//   "/webhook/stripe",
//   express.raw({ type: "application/json" }),
//   webhookRoutes
// );

// // CRITICAL: Use server.listen() NOT app.listen()
// server.listen(port, () => {
//   console.log(`🚀 Server running on port: ${port}`);
//   console.log(`🔌 Socket.IO server ready on ws://localhost:${port}`);
// });


// // ==========================
// // SkillMatch.AI - FIXED index.js
// // ==========================
// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// dotenv.config();

// import cookieParser from "cookie-parser";
// import { connectDB } from "./config/db.js";

// import authRoutes from "./routes/authRoutes.js";
// import mentorRoutes from "./routes/mentorRoutes.js";
// import resumeRoutes from "./routes/resumeRoutes.js";
// import getMentorRoutes from "./routes/getMentorRoutes.js";
// import sessionRoutes from "./routes/sessionRoutes.js";
// import webhookRoutes from "./routes/webhookRoutes.js";

// import "./config/sessionReminder.js";
// import "./config/sessionStatusUpdater.js";

// import path from "path";
// import { createServer } from "http";
// import { Server } from "socket.io";

// import Session from "./models/sessionModel.js";

// const app = express();
// const server = createServer(app);

// // -------------------------------
// // SOCKET.IO SETUP
// // -------------------------------
// const io = new Server(server, {
//   cors: {
//     origin: "https://skill-match-ai-ashy.vercel.app",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// // SOCKET EVENTS
// io.on("connection", (socket) => {
//   console.log("🟢 User connected:", socket.id);

//   socket.on("join-session", (sessionId) => {
//     socket.join(sessionId);

//     const room = io.sockets.adapter.rooms.get(sessionId);
//     const participants = room ? room.size : 0;

//     if (participants > 1) {
//       socket.to(sessionId).emit("peer-joined", socket.id);
//     }
//   });

//   socket.on("joined-session", async ({ sessionId, role }) => {
//     try {
//       const session = await Session.findById(sessionId);
//       if (!session) return;

//       const now = new Date();
//       if (role === "mentor") {
//         if (!session.mentorJoinedAt) session.mentorJoinedAt = now;
//       } else {
//         if (!session.userJoinedAt) {
//           session.userJoinedAt = now;
//           session.joined = true;
//         }
//       }
//       await session.save();
//     } catch (err) {
//       console.error("joined-session error:", err);
//     }
//   });

//   socket.on("offer", (data) => {
//     socket.to(data.sessionId).emit("offer", data);
//   });

//   socket.on("answer", (data) => {
//     socket.to(data.sessionId).emit("answer", data);
//   });

//   socket.on("ice-candidate", (data) => {
//     socket.to(data.sessionId).emit("ice-candidate", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("🔴 User disconnected:", socket.id);
//   });
// });

// // -------------------------------
// // MIDDLEWARE
// // -------------------------------
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // CORS CONFIG — IMPORTANT
// app.use(
//   cors({
//     origin: "https://skill-match-ai-ashy.vercel.app",
//     credentials: true,
//   })
// );

// // STATIC UPLOADS
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// // DB CONNECT
// connectDB();

// // -------------------------------
// // ROUTES
// // -------------------------------
// app.use("/api/auth", authRoutes);
// app.use("/api/mentor", mentorRoutes);
// app.use("/api/resume", resumeRoutes);
// app.use("/api", getMentorRoutes);
// app.use("/api/session", sessionRoutes);

// // Stripe webhook must use raw body
// app.post(
//   "/webhook/stripe",
//   express.raw({ type: "application/json" }),
//   webhookRoutes
// );

// // -------------------------------
// // SERVER START
// // -------------------------------
// const port = process.env.PORT || 5000;

// server.listen(port, () => {
//   console.log(`🚀 Server running on port ${port}`);
//   console.log(`🔌 Socket.IO ready`);
// });



// ==========================
// SkillMatch.AI - FIXED index.js
// ==========================
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import getMentorRoutes from "./routes/getMentorRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";

import "./config/sessionReminder.js";
import "./config/sessionStatusUpdater.js";

import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";

import Session from "./models/sessionModel.js";

const app = express();
const server = createServer(app);

// -------------------------------
// SOCKET.IO SETUP
// -------------------------------
const io = new Server(server, {
  cors: {
    origin: [
      "https://skill-match-ai-ashy.vercel.app",
      "http://localhost:5173", // For local testing
      "http://localhost:3000"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ["websocket", "polling"],
});

// SOCKET EVENTS
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // ========== JOIN SESSION ==========
  socket.on("join-session", (sessionId) => {
    console.log(`📥 join-session event from ${socket.id} for session: ${sessionId}`);
    
    socket.join(sessionId);

    const room = io.sockets.adapter.rooms.get(sessionId);
    const participants = room ? room.size : 0;
    const socketIds = room ? Array.from(room) : [];

    console.log(`📊 Session ${sessionId} now has ${participants} participant(s)`);
    console.log(`🔗 Socket IDs in room:`, socketIds);

    if (participants > 1) {
      console.log(`✅ Emitting peer-joined to others in session ${sessionId}`);
      console.log(`   Sender: ${socket.id}`);
      console.log(`   Recipients:`, socketIds.filter(id => id !== socket.id));
      
      socket.to(sessionId).emit("peer-joined", socket.id);
    } else {
      console.log(`⏳ First user in session ${sessionId}, waiting for peer...`);
    }
  });

  // ========== JOINED SESSION (DB Update) ==========
  socket.on("joined-session", async ({ sessionId, role }) => {
    console.log(`📝 joined-session: ${socket.id} joined as "${role}" in ${sessionId}`);
    
    try {
      const session = await Session.findById(sessionId);
      if (!session) {
        console.log(`❌ Session ${sessionId} not found in database`);
        return;
      }

      const now = new Date();
      if (role === "mentor") {
        if (!session.mentorJoinedAt) {
          session.mentorJoinedAt = now;
          console.log(`✅ Mentor joined at ${now.toISOString()}`);
        }
      } else {
        if (!session.userJoinedAt) {
          session.userJoinedAt = now;
          session.joined = true;
          console.log(`✅ User joined at ${now.toISOString()}`);
        }
      }
      await session.save();
      console.log(`💾 Session ${sessionId} updated in database`);
    } catch (err) {
      console.error(`❌ Error updating session ${sessionId}:`, err.message);
    }
  });

  // ========== OFFER ==========
  socket.on("offer", (data) => {
    console.log(`📤 Forwarding OFFER from ${socket.id} to session ${data.sessionId}`);
    socket.to(data.sessionId).emit("offer", data);
  });

  // ========== ANSWER ==========
  socket.on("answer", (data) => {
    console.log(`📤 Forwarding ANSWER from ${socket.id} to session ${data.sessionId}`);
    socket.to(data.sessionId).emit("answer", data);
  });

  // ========== ICE CANDIDATE ==========
  socket.on("ice-candidate", (data) => {
    console.log(`🧊 Forwarding ICE candidate from ${socket.id} to session ${data.sessionId}`);
    socket.to(data.sessionId).emit("ice-candidate", data);
  });

  // ========== DISCONNECT ==========
  socket.on("disconnect", (reason) => {
    console.log(`🔴 User disconnected: ${socket.id}, reason: ${reason}`);
  });

  // ========== ERROR HANDLING ==========
  socket.on("error", (error) => {
    console.error(`❌ Socket error for ${socket.id}:`, error);
  });
});

// Monitor Socket.IO engine errors
io.engine.on("connection_error", (err) => {
  console.error("❌ Socket.IO Engine Error:", {
    message: err.message,
    code: err.code,
    context: err.context
  });
});

// -------------------------------
// MIDDLEWARE
// -------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS CONFIG
app.use(
  cors({
    origin: [
      "https://skill-match-ai-ashy.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// STATIC UPLOADS
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// DB CONNECT
connectDB();

// -------------------------------
// ROUTES
// -------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api", getMentorRoutes);
app.use("/api/session", sessionRoutes);

// Stripe webhook must use raw body
app.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  webhookRoutes
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok",
    timestamp: new Date().toISOString(),
    socketConnections: io.engine.clientsCount
  });
});

// -------------------------------
// SERVER START
// -------------------------------
const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`🔌 Socket.IO ready`);
  console.log(`🌐 CORS enabled for: https://skill-match-ai-ashy.vercel.app`);
});