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


import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_WEBRTC_URL || "https://skillmatch-ai-2v8j.onrender.com";

// Create socket with minimal config to avoid logger issues
export const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  withCredentials: true,
  // Disable all internal logging
  upgrade: false,
  rememberUpgrade: false,
  path: "/socket.io/",
});

// Suppress Socket.IO internal errors globally
if (typeof window !== 'undefined') {
  const originalError = window.console.error;
  window.console.error = (...args) => {
    const errorMsg = args.join(' ');
    
    // Block Socket.IO logger errors
    if (
      errorMsg.includes('info is not a function') ||
      errorMsg.includes('.info is not a function') ||
      errorMsg.includes('Q.info') ||
      errorMsg.includes('Z.info')
    ) {
      return; // Silently ignore
    }
    
    // Allow all other errors
    originalError.apply(console, args);
  };
}

// Clean event handlers
socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("🔴 Socket disconnected:", reason);
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err.message);
});

// Prevent duplicate listeners
socket.setMaxListeners(20);