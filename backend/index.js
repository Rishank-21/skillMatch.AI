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
//     origin: allowedOrigins,
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


// const allowedOrigins = [
//   "https://skill-match-ai-ashy.vercel.app",
//   "http://localhost:5173"
// ];

// app.use((req, res, next) => {
//   const origin = req.headers.origin;
//   if (allowedOrigins.includes(origin)) {
//     res.header("Access-Control-Allow-Origin", origin);
//   }
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }

//   next();
// });



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


import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import getMentorRoutes from "./routes/getMentorRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import Session from "./models/sessionModel.js";

import "./config/sessionReminder.js";
import "./config/sessionStatusUpdater.js";

dotenv.config();

const app = express();

// --- Configuration --------------------------------------------------
const allowedOrigins = [
  "https://skill-match-ai-ashy.vercel.app",
  "http://localhost:5173",
];

// Cookie session (keep early so socket auth / middleware can use it)
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET || "secret"],
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  })
);

// Basic CORS + preflight responder (apply before routes)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// Serve uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Create HTTP + Socket.IO server (Socket.IO reads allowedOrigins)
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO handlers
io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  socket.on("join-session", (sessionId) => {
    socket.join(sessionId);
    const room = io.sockets.adapter.rooms.get(sessionId);
    const participants = room ? room.size : 0;

    if (participants > 1) {
      console.log(`📢 Notifying existing participant in room ${sessionId}`);
      socket.to(sessionId).emit("peer-joined", socket.id);
    } else {
      console.log(`⏳ First user in room ${sessionId}, waiting for peer...`);
    }
  });

  socket.on("joined-session", async (data) => {
    try {
      const { sessionId, role } = data || {};
      if (!sessionId) return;
      const session = await Session.findById(sessionId);
      if (!session) {
        console.warn(`⚠️ Session not found for joined-session: ${sessionId}`);
        return;
      }
      const now = new Date();
      if (role === "mentor") {
        if (!session.mentorJoinedAt) {
          session.mentorJoinedAt = now;
          await session.save();
        }
      } else {
        if (!session.userJoinedAt) {
          session.userJoinedAt = now;
          session.joined = true;
          await session.save();
        }
      }
    } catch (err) {
      console.error("❌ Error handling joined-session:", err.message);
    }
  });

  socket.on("offer", (data) => {
    socket.to(data.sessionId).emit("offer", data);
  });

  socket.on("answer", (data) => {
    socket.to(data.sessionId).emit("answer", data);
  });

  socket.on("ice-candidate", (data) => {
    socket.to(data.sessionId).emit("ice-candidate", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// IMPORTANT: Mount the Stripe webhook route BEFORE body parsers so raw body is preserved
app.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  webhookRoutes
);

// Body parsers for the rest of the app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect DB
const port = process.env.PORT || 5000;
connectDB();

// App routes (mounted after middleware)
app.use("/api/auth", authRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api", getMentorRoutes);
app.use("/api/session", sessionRoutes);

// Start server
server.listen(port, () => {
  console.log(`🚀 Server running on port: ${port}`);
  console.log(`🔌 Socket.IO ready (allowed origins: ${allowedOrigins.join(", ")})`);
});

