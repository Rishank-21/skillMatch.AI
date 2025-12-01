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

export const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  withCredentials: true,
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
