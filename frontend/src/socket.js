// import { io } from "socket.io-client";

// const SOCKET_URL = import.meta.env.VITE_WEBRTC_URL || "https://skillmatch-ai-2v8j.onrender.com";

// export const socket = io(SOCKET_URL, {
//   transports: ["websocket", "polling"],
//   autoConnect: false,  // Manual connect for better control
//   reconnection: true,
//   reconnectionAttempts: 5,
//   reconnectionDelay: 1000,
//   withCredentials: true,
// });

// // Debug logs
// socket.on("connect", () => {
//   console.log("✅ Socket connected:", socket.id);
// });

// socket.on("disconnect", (reason) => {
//   console.log("🔴 Socket disconnected:", reason);
// });

// socket.on("connect_error", (err) => {
//   console.error("❌ Socket connection error:", err);
// });
// import { io } from "socket.io-client";

// const SOCKET_URL = import.meta.env.VITE_WEBRTC_URL || "https://skillmatch-ai-2v8j.onrender.com";

// // ========== NUCLEAR OPTION: Block ALL internal errors ==========
// if (typeof window !== 'undefined') {
//   const originalError = console.error;
  
//   window.console.error = function(...args) {
//     const msg = String(args[0] || '');
//     const stack = new Error().stack || '';
    
//     // Block if:
//     // 1. Contains "is not a function"
//     // 2. Originates from socket.io code (index-*.js)
//     if (
//       msg.includes('is not a function') ||
//       stack.includes('MS.H') ||
//       stack.includes('et.emit') ||
//       stack.includes('MS.emitEvent')
//     ) {
//       return; // Silently block
//     }
    
//     return originalError.apply(console, args);
//   };
// }

// // Create socket
// export const socket = io(SOCKET_URL, {
//   transports: ["websocket", "polling"],
//   autoConnect: false,
//   reconnection: true,
//   reconnectionAttempts: 5,
//   reconnectionDelay: 1000,
//   withCredentials: true,
// });

// socket.on("connect", () => {
//   console.log("✅ Socket connected:", socket.id);
// });

// socket.on("disconnect", (reason) => {
//   console.log("🔴 Socket disconnected:", reason);
// });

// socket.on("connect_error", (err) => {
//   console.error("❌ Socket error:", err.message);
// });

// export default socket;

// socket.js (recommended)
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_WEBRTC_URL || "https://skillmatch-ai-2v8j.onrender.com";
// socket.js — add this at the very top, before anything else runs
if (typeof window !== "undefined") {
  try {
    // create safe global fallback only if not present
    if (!window.J || typeof window.J.info !== "function") {
      window.J = window.J || {};
      window.J.info = window.J.info || function(...args) {
        // sahi debugging ke liye console.log; production me isko no-op bana sakte ho
        console.log("[J.info-fallback]", ...args);
      };
    }
  } catch (e) {
    // ignore if window is locked or restricted
    console.warn("Could not set J fallback", e);
  }
}


export const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  withCredentials: true,
});

socket.on("peer-joined", (peerId) => {
  console.log("SIGNAL: peer-joined ->", peerId);
  onPeerJoined(peerId); // keep existing handler logic
});

socket.on("offer", (data) => {
  console.log("SIGNAL: offer received:", data && (data.offer?.type || data.offer?.sdp?.substring?.(0,50)));
  onOffer(data);
});

socket.on("answer", (data) => {
  console.log("SIGNAL: answer received:", data && (data.answer?.type));
  onAnswer(data);
});

socket.on("ice-candidate", (data) => {
  console.log("SIGNAL: ice-candidate received:", data && data.candidate && data.candidate.candidate?.substring?.(0,80));
  onIce(data);
});


socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("🔴 Disconnected:", reason);
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket error:", err.message);
});

export default socket;
