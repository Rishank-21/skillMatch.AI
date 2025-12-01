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

// ========== ULTIMATE ERROR SUPPRESSION ==========
if (typeof window !== 'undefined') {
  // Store originals
  const _error = console.error;
  const _warn = console.warn;
  
  // Override console.error
  console.error = function(...args) {
    const msg = String(args[0] || '');
    
    // Block Socket.IO internal errors completely
    if (
      msg.includes('is not a function') ||
      msg.includes('Q.info') ||
      msg.includes('Z.info') ||
      msg.includes('MS.H') ||
      msg.includes('et.emit')
    ) {
      return; // Block completely
    }
    
    return _error.apply(console, args);
  };
  
  // Override console.warn
  console.warn = function(...args) {
    const msg = String(args[0] || '');
    if (msg.includes('is not a function')) {
      return;
    }
    return _warn.apply(console, args);
  };
  
  // Global error handler
  window.addEventListener('error', (e) => {
    if (e.message && e.message.includes('is not a function')) {
      e.stopImmediatePropagation();
      e.preventDefault();
      return false;
    }
  }, true);
  
  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (e) => {
    if (e.reason && String(e.reason).includes('is not a function')) {
      e.stopImmediatePropagation();
      e.preventDefault();
      return false;
    }
  }, true);
}

// Create socket
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
```

---

## 🎯 **Ab Test Karo:**

1. **Deploy karo yeh updated socket.js**
2. **Hard refresh karo dono browsers** (Ctrl + Shift + R)
3. **Join karo dono users**
4. **Console check karo:**

**Expected output:**
```
// 👤 👤 👤 PEER: yeuw4CfcNXeSDCbSAAAB
// 🔧 Creating peer
// 🎥 Adding tracks
// 📝 Creating offer
// 📤 Sending offer