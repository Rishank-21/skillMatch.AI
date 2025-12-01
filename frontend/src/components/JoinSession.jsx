// import React, { useEffect, useRef, useState } from "react";
// import io from "socket.io-client";

// const JoinSession = ({ sessionId, userName, role = "user" }) => {
//   const localVideoRef = useRef();
//   const remoteVideoRef = useRef();
//   const peerConnection = useRef(null);
//   const localStream = useRef(null);
//   const socketRef = useRef(null);
//   const [error, setError] = useState("");
//   const [isAudioMuted, setIsAudioMuted] = useState(false);
//   const [isVideoOff, setIsVideoOff] = useState(false);
//   const [isConnecting, setIsConnecting] = useState(true);
//   const [isRemoteConnected, setIsRemoteConnected] = useState(false);

//   // Initialize Socket.IO
//   useEffect(() => {
//     socketRef.current = io("http://localhost:5000", {
//       transports: ["websocket", "polling"],
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//       withCredentials: true,
//     });

//     const socket = socketRef.current;

//     socket.on("connect", () => {
     
//       setIsConnecting(false);
//       setError(""); // Clear any errors
//     });

//     socket.on("disconnect", () => {
      
//       setError("Connection lost");
//     });

//     socket.on("connect_error", (err) => {
//       console.error("❌ Socket connection error:", err);
//       setError("Failed to connect to server");
//     });

//     // WebRTC event listeners
//     socket.on("peer-joined", async (peerId) => {
      
//       try {
//         if (!peerConnection.current) {
//           createPeer();
//         }

//         // Small delay to ensure peer is ready
//         await new Promise((resolve) => setTimeout(resolve, 500));

//         const offer = await peerConnection.current.createOffer();
//         await peerConnection.current.setLocalDescription(offer);
        
//         socket.emit("offer", { sessionId, offer });
//       } catch (err) {
//         console.error("Error creating offer:", err);
//         setError("Failed to connect with peer");
//       }
//     });

//     socket.on("offer", async ({ offer }) => {
      
//       try {
//         if (!peerConnection.current) {
//           createPeer();
//         }

//         await peerConnection.current.setRemoteDescription(
//           new RTCSessionDescription(offer)
//         );
//         const answer = await peerConnection.current.createAnswer();
//         await peerConnection.current.setLocalDescription(answer);
       
//         socket.emit("answer", { sessionId, answer });
//       } catch (err) {
//         console.error("Error handling offer:", err);
//         setError("Failed to establish connection");
//       }
//     });

//     socket.on("answer", async ({ answer }) => {
     
//       try {
//         if (
//           peerConnection.current &&
//           peerConnection.current.signalingState !== "stable"
//         ) {
//           await peerConnection.current.setRemoteDescription(
//             new RTCSessionDescription(answer)
//           );
          
//         }
//       } catch (err) {
//         console.error("❌ Error handling answer:", err);
//       }
//     });

//     socket.on("ice-candidate", async ({ candidate }) => {
//       try {
//         if (peerConnection.current?.remoteDescription) {
//           await peerConnection.current.addIceCandidate(
//             new RTCIceCandidate(candidate)
//           );
//         }
//       } catch (err) {
//         // Silently handle ICE errors
//       }
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [sessionId]);

//   // Initialize camera
//   useEffect(() => {
//     let stream;
//     const startCamera = async () => {
//       try {
//         stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: true,
//         });
//         localStream.current = stream;
//         if (localVideoRef.current) {
//           localVideoRef.current.srcObject = stream;
//         }

//         // Auto-join after camera is ready helper
//         setTimeout(() => {
//           if (socketRef.current?.connected) {
//             // Join the socket.io room for signalling
//             socketRef.current.emit("join-session", sessionId);
//             // Additionally tell the server which role joined so server records timestamps
//             socketRef.current.emit("joined-session", { sessionId, role });
            
//           }
//         }, 1000);
//       } catch (err) {
//         setError(
//           "Camera access denied. Please allow camera and microphone access."
//         );
//       }
//     };
//     startCamera();

//     return () => {
//       if (stream) {
//         stream.getTracks().forEach((track) => track.stop());
//       }
//       if (peerConnection.current) {
//         peerConnection.current.close();
//       }
//     };
//   }, [sessionId, role]);

//   const createPeer = () => {
    

//     peerConnection.current = new RTCPeerConnection({
//       iceServers: [
//         { urls: "stun:stun.l.google.com:19302" },
//         { urls: "stun:stun1.l.google.com:19302" },
//       ],
//     });

//     peerConnection.current.onicecandidate = (event) => {
//       if (event.candidate && socketRef.current) {
       
//         socketRef.current.emit("ice-candidate", {
//           sessionId,
//           candidate: event.candidate,
//         });
//       }
//     };

//     peerConnection.current.ontrack = (event) => {
      
//       setIsRemoteConnected(true);
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = event.streams[0];
       
//       }
//     };

//     peerConnection.current.oniceconnectionstatechange = () => {
//       const state = peerConnection.current.iceConnectionState;
     
//       if (state === "disconnected" || state === "failed") {
//         setIsRemoteConnected(false);
//         setError("Connection lost with peer");
//       } else if (state === "connected" || state === "completed") {
//         setIsRemoteConnected(true);
//         setError("");
        
//       }
//     };

//     peerConnection.current.onconnectionstatechange = () => {
//       console.log(
//         `📡 Connection State: ${peerConnection.current.connectionState}`
//       );
//     };

//     if (localStream.current) {
      
//       localStream.current.getTracks().forEach((track) => {
        
//         peerConnection.current.addTrack(track, localStream.current);
//       });
//     } else {
//       console.warn("⚠️ No local stream available!");
//     }
//   };

//   const toggleAudio = () => {
//     if (localStream.current) {
//       const audioTrack = localStream.current.getAudioTracks()[0];
//       if (audioTrack) {
//         audioTrack.enabled = !audioTrack.enabled;
//         setIsAudioMuted(!audioTrack.enabled);
//       }
//     }
//   };

//   const toggleVideo = () => {
//     if (localStream.current) {
//       const videoTrack = localStream.current.getVideoTracks()[0];
//       if (videoTrack) {
//         videoTrack.enabled = !videoTrack.enabled;
//         setIsVideoOff(!videoTrack.enabled);
//       }
//     }
//   };

//   return (
//     <div className="flex flex-col gap-6">
//       {error && (
//         <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm">
//           {error}
//         </div>
//       )}

//       {/* Videos */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Local Video */}
//         <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
//           <video
//             ref={localVideoRef}
//             autoPlay
//             playsInline
//             muted
//             className="w-full h-full object-cover bg-gray-900"
//           />
//           <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
//             <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//             You ({userName})
//           </div>
//           {isVideoOff && (
//             <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
//               <div className="text-center text-gray-400">
//                 <div className="text-6xl mb-2">📹</div>
//                 <div>Camera Off</div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Remote Video */}
//         <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
//           <video
//             ref={remoteVideoRef}
//             autoPlay
//             playsInline
//             className="w-full h-full object-cover bg-gray-900"
//           />
//           <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
//             <div
//               className={`w-2 h-2 rounded-full ${
//                 isRemoteConnected ? "bg-green-400 animate-pulse" : "bg-gray-400"
//               }`}
//             ></div>
//             Remote User
//           </div>
//           {!isRemoteConnected && (
//             <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
//               <div className="text-center text-gray-400">
//                 <div className="text-6xl mb-4">👤</div>
//                 <div className="text-lg">Waiting for peer to join...</div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="flex justify-center gap-4">
//         <button
//           onClick={toggleAudio}
//           className={`group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg ${
//             isAudioMuted
//               ? "bg-red-600 hover:bg-red-700 text-white"
//               : "bg-gray-700 hover:bg-gray-600 text-white"
//           }`}
//         >
//           <span className="text-xl">{isAudioMuted ? "🔇" : "🔊"}</span>
//           {isAudioMuted ? "Unmute" : "Mute"}
//         </button>

//         <button
//           onClick={toggleVideo}
//           className={`group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg ${
//             isVideoOff
//               ? "bg-red-600 hover:bg-red-700 text-white"
//               : "bg-gray-700 hover:bg-gray-600 text-white"
//           }`}
//         >
//           <span className="text-xl">{isVideoOff ? "📹" : "🎥"}</span>
//           {isVideoOff ? "Start Video" : "Stop Video"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default JoinSession;



// import React, { useEffect, useRef, useState } from "react";
// import io from "socket.io-client";
// import toast from 'react-hot-toast'; // Import toast

// const JoinSession = ({ sessionId, userName, role = "user" }) => {
//     const localVideoRef = useRef();
//     const remoteVideoRef = useRef();
//     const peerConnection = useRef(null);
//     const localStream = useRef(null);
//     const socketRef = useRef(null);
//     const [isAudioMuted, setIsAudioMuted] = useState(false);
//     const [isVideoOff, setIsVideoOff] = useState(false);
//     const [isConnecting, setIsConnecting] = useState(true);
//     const [isRemoteConnected, setIsRemoteConnected] = useState(false);

//     // --- Utility to display errors using toast ---
//     const handleError = (message, err = null) => {
//         console.error("❌ Session Error:", message, err);
//         toast.error(message);
//     };

//     const WEBRTC_URL = import.meta.env.VITE_WEBRTC_URL

//     // Initialize Socket.IO
//     useEffect(() => {
//         // NOTE: Replace "http://localhost:5000" with your actual VITE_API_URL if needed
//         socketRef.current = io(WEBRTC_URL, {
//             transports: ["websocket", "polling"],
//             reconnection: true,
//             reconnectionAttempts: 5,
//             reconnectionDelay: 1000,
//             withCredentials: true,
//         });

//         const socket = socketRef.current;

//         socket.on("connect", () => {
//             toast.success("Connected to signaling server.");
//             setIsConnecting(false);
//         });

//         socket.on("disconnect", () => {
//             handleError("Connection to server lost. Trying to reconnect...");
//         });

//         socket.on("connect_error", (err) => {
//             console.error("❌ Socket connection error:", err);
//             handleError("Failed to connect to signaling server.");
//         });

//         // WebRTC event listeners
//         socket.on("peer-joined", async (peerId) => {
//             toast.info("Peer joined the session. Setting up connection...");
//             try {
//                 if (!peerConnection.current) {
//                     createPeer();
//                 }

//                 // Small delay to ensure peer is ready
//                 await new Promise((resolve) => setTimeout(resolve, 500));

//                 const offer = await peerConnection.current.createOffer();
//                 await peerConnection.current.setLocalDescription(offer);
                
//                 socket.emit("offer", { sessionId, offer });
//             } catch (err) {
//                 console.error("Error creating offer:", err);
//                 handleError("Failed to connect with peer (offer error).");
//             }
//         });

//         socket.on("offer", async ({ offer }) => {
//             toast.info("Receiving session offer...");
//             try {
//                 if (!peerConnection.current) {
//                     createPeer();
//                 }

//                 await peerConnection.current.setRemoteDescription(
//                     new RTCSessionDescription(offer)
//                 );
//                 const answer = await peerConnection.current.createAnswer();
//                 await peerConnection.current.setLocalDescription(answer);
                
//                 socket.emit("answer", { sessionId, answer });
//             } catch (err) {
//                 console.error("Error handling offer:", err);
//                 handleError("Failed to establish connection (answer error).");
//             }
//         });

//         socket.on("answer", async ({ answer }) => {
//             toast.success("Connection handshake complete!");
//             try {
//                 if (
//                     peerConnection.current &&
//                     peerConnection.current.signalingState !== "stable"
//                 ) {
//                     await peerConnection.current.setRemoteDescription(
//                         new RTCSessionDescription(answer)
//                     );
                    
//                 }
//             } catch (err) {
//                 console.error("❌ Error handling answer:", err);
//             }
//         });

//         socket.on("ice-candidate", async ({ candidate }) => {
//             try {
//                 if (peerConnection.current?.remoteDescription) {
//                     await peerConnection.current.addIceCandidate(
//                         new RTCIceCandidate(candidate)
//                     );
//                 }
//             } catch (err) {
//                 // Silently handle ICE errors
//             }
//         });

//         return () => {
//             if (socket) {
//                 socket.disconnect();
//             }
//         };
//     }, [sessionId]);

//     // Initialize camera
//     useEffect(() => {
//         let stream;
//         const startCamera = async () => {
//             try {
//                 stream = await navigator.mediaDevices.getUserMedia({
//                     video: true,
//                     audio: true,
//                 });
//                 localStream.current = stream;
//                 if (localVideoRef.current) {
//                     localVideoRef.current.srcObject = stream;
//                 }

//                 // Auto-join after camera is ready
//                 setTimeout(() => {
//                     if (socketRef.current?.connected) {
//                         socketRef.current.emit("join-session", sessionId);
//                         socketRef.current.emit("joined-session", { sessionId, role });
//                         toast.info("Camera and Mic connected. Joining session room...");
//                     } else {
//                         handleError("Socket not connected. Cannot join session room.");
//                     }
//                 }, 1000);
//             } catch (err) {
//                 handleError(
//                     "Camera access denied. Please allow camera and microphone access to join the call.",
//                     err
//                 );
//             }
//         };
//         startCamera();

//         return () => {
//             if (stream) {
//                 stream.getTracks().forEach((track) => track.stop());
//             }
//             if (peerConnection.current) {
//                 peerConnection.current.close();
//             }
//         };
//     }, [sessionId, role]);

//     const createPeer = () => {
        
//         peerConnection.current = new RTCPeerConnection({
//             iceServers: [
//                 { urls: "stun:stun.l.google.com:19302" },
//                 { urls: "stun:stun1.l.google.com:19302" },
//             ],
//         });

//         peerConnection.current.onicecandidate = (event) => {
//             if (event.candidate && socketRef.current) {
                
//                 socketRef.current.emit("ice-candidate", {
//                     sessionId,
//                     candidate: event.candidate,
//                 });
//             }
//         };

//         peerConnection.current.ontrack = (event) => {
            
//             setIsRemoteConnected(true);
//             toast.success("Peer is connected and streaming!");
//             if (remoteVideoRef.current) {
//                 remoteVideoRef.current.srcObject = event.streams[0];
                
//             }
//         };

//         peerConnection.current.oniceconnectionstatechange = () => {
//             const state = peerConnection.current.iceConnectionState;
            
//             if (state === "disconnected" || state === "failed") {
//                 setIsRemoteConnected(false);
//                 handleError("Connection lost with peer.");
//             } else if (state === "connected" || state === "completed") {
//                 setIsRemoteConnected(true);
//                 // toast.success("Peer connection re-established."); // Optional re-establishment toast
//             }
//         };

//         peerConnection.current.onconnectionstatechange = () => {
//             console.log(
//                 `📡 Connection State: ${peerConnection.current.connectionState}`
//             );
//         };

//         if (localStream.current) {
            
//             localStream.current.getTracks().forEach((track) => {
                
//                 peerConnection.current.addTrack(track, localStream.current);
//             });
//         } else {
//             console.warn("⚠️ No local stream available!");
//             handleError("Local media access failed.");
//         }
//     };

//     const toggleAudio = () => {
//         if (localStream.current) {
//             const audioTrack = localStream.current.getAudioTracks()[0];
//             if (audioTrack) {
//                 audioTrack.enabled = !audioTrack.enabled;
//                 setIsAudioMuted(!audioTrack.enabled);
//                 toast.info(`Microphone ${audioTrack.enabled ? 'unmuted' : 'muted'}.`);
//             }
//         }
//     };

//     const toggleVideo = () => {
//         if (localStream.current) {
//             const videoTrack = localStream.current.getVideoTracks()[0];
//             if (videoTrack) {
//                 videoTrack.enabled = !videoTrack.enabled;
//                 setIsVideoOff(!videoTrack.enabled);
//                 toast.info(`Video ${videoTrack.enabled ? 'started' : 'stopped'}.`);
//             }
//         }
//     };

//     // Removed the 'error' state from the return JSX, as it's now handled by toasts.

//     return (
//         <div className="flex flex-col gap-6 p-4">
//             {/* Videos */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Local Video */}
//                 <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
//                     <video
//                         ref={localVideoRef}
//                         autoPlay
//                         playsInline
//                         muted
//                         className="w-full h-full object-cover bg-gray-900"
//                     />
//                     <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
//                         <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//                         You ({userName})
//                     </div>
//                     {isVideoOff && (
//                         <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
//                             <div className="text-center text-gray-400">
//                                 <div className="text-6xl mb-2">📹</div>
//                                 <div>Camera Off</div>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* Remote Video */}
//                 <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
//                     <video
//                         ref={remoteVideoRef}
//                         autoPlay
//                         playsInline
//                         className="w-full h-full object-cover bg-gray-900"
//                     />
//                     <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
//                         <div
//                             className={`w-2 h-2 rounded-full ${
//                                 isRemoteConnected ? "bg-green-400 animate-pulse" : "bg-gray-400"
//                             }`}
//                         ></div>
//                         Remote User
//                     </div>
//                     {!isRemoteConnected && (
//                         <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
//                             <div className="text-center text-gray-400">
//                                 <div className="text-6xl mb-4">👤</div>
//                                 <div className="text-lg">
//                                     {isConnecting
//                                         ? "Connecting to server..."
//                                         : "Waiting for peer to join..."}
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Controls */}
//             <div className="flex justify-center gap-4">
//                 <button
//                     onClick={toggleAudio}
//                     className={`group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg ${
//                         isAudioMuted
//                             ? "bg-red-600 hover:bg-red-700 text-white"
//                             : "bg-gray-700 hover:bg-gray-600 text-white"
//                     }`}
//                 >
//                     <span className="text-xl">{isAudioMuted ? "🔇" : "🔊"}</span>
//                     {isAudioMuted ? "Unmute" : "Mute"}
//                 </button>

//                 <button
//                     onClick={toggleVideo}
//                     className={`group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg ${
//                         isVideoOff
//                             ? "bg-red-600 hover:bg-red-700 text-white"
//                             : "bg-gray-700 hover:bg-gray-600 text-white"
//                     }`}
//                 >
//                     <span className="text-xl">{isVideoOff ? "📹" : "🎥"}</span>
//                     {isVideoOff ? "Start Video" : "Stop Video"}
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default JoinSession;

// JoinSession.jsx (patched)
import React, { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import toast from "react-hot-toast";

const JoinSession = ({ sessionId, userName, role = "user", showDebug = false }) => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isRemoteConnected, setIsRemoteConnected] = useState(false);
  const pendingCandidates = useRef([]);
  const hasJoinedRoom = useRef(false);

  const handleError = (message, err = null) => {
    console.error("❌", message, err);
    toast.error(message);
  };

  const safeEmit = (eventName, data) => {
    try {
      socket.emit(eventName, data);
      return true;
    } catch (err) {
      console.error(`Failed to emit ${eventName}:`, err.message);
      setTimeout(() => {
        try {
          socket.emit(eventName, data);
        } catch (retryErr) {
          console.error(`Retry failed for ${eventName}`, retryErr);
        }
      }, 100);
      return false;
    }
  };

  const createPeer = () => {
    if (peerConnection.current) {
      if (showDebug) console.log("⚠️ Peer exists");
      return peerConnection.current;
    }

    if (showDebug) console.log("🔧 Creating peer");

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    });

    // -------------------
    // IMPORTANT: set handlers BEFORE adding local tracks
    // -------------------
    pc.ontrack = (event) => {
      if (showDebug) console.log("🎉 ontrack event:", event);

      // Prefer event.streams[0] if available
      if (event.streams && event.streams[0]) {
        const stream = event.streams[0];
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
          // try play (may fail silently due to autoplay policies)
          remoteVideoRef.current.play().catch((e) => {
            if (showDebug) console.log("Remote play failed (autoplay?)", e);
          });
        }
      } else {
        // Fallback: create stream from incoming tracks
        const inboundStream = new MediaStream();
        inboundStream.addTrack(event.track);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = inboundStream;
          remoteVideoRef.current.play().catch((e) => {
            if (showDebug) console.log("Remote play failed (autoplay?)", e);
          });
        }
      }
      setIsRemoteConnected(true);
      toast.success("Connected! 🎥");
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        try {
          const candidateObj = e.candidate.toJSON(); // ensure serializable
          if (showDebug) console.log("🧊 Sending local ICE candidate", candidateObj);
          safeEmit("ice-candidate", { sessionId, candidate: candidateObj });
        } catch (err) {
          if (showDebug) console.error("Error serializing candidate", err);
        }
      }
    };

    pc.oniceconnectionstatechange = () => {
      if (showDebug) console.log("🧊 ICE state:", pc.iceConnectionState);
    };

    // add local tracks AFTER handlers are set
    if (localStream.current) {
      if (showDebug) console.log("🎥 Adding local tracks");
      localStream.current.getTracks().forEach((track) => {
        try {
          pc.addTrack(track, localStream.current);
        } catch (e) {
          if (showDebug) console.error("addTrack error", e);
        }
      });
    }

    // Add any pending remote ICE candidates that arrived early
    if (pendingCandidates.current.length > 0) {
      pendingCandidates.current.forEach(async (c) => {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(c));
          if (showDebug) console.log("Added pending candidate", c);
        } catch (e) {
          if (showDebug) console.error("Failed adding pending candidate", e);
        }
      });
      pendingCandidates.current = [];
    }

    peerConnection.current = pc;
    return pc;
  };

  // ---------------- SOCKET SETUP ----------------
  useEffect(() => {
    if (showDebug) console.log("🔌 Setup:", sessionId, role);

    if (!socket.connected) {
      socket.connect();
    }

    const onPeerJoined = async (peerId) => {
      try {
        if (showDebug) console.log("👤 peer joined:", peerId);
        toast.info("Peer joined!");

        // ensure we have local stream
        let tries = 0;
        while (!localStream.current && tries < 6) {
          await new Promise((r) => setTimeout(r, 300));
          tries++;
        }

        const pc = createPeer();

        if (showDebug) console.log("📝 Creating offer");
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        // send a plain serializable object (sdp & type)
        safeEmit("offer", { sessionId, offer: pc.localDescription.toJSON() });
        if (showDebug) console.log("📤 Offer sent");
      } catch (err) {
        console.error("❌ Offer error:", err);
        handleError("Offer creation failed");
      }
    };

    const onOffer = async ({ offer }) => {
      try {
        if (showDebug) console.log("📥 Received OFFER");

        // Wait for local stream to be ready
        let tries = 0;
        while (!localStream.current && tries < 6) {
          await new Promise((r) => setTimeout(r, 300));
          tries++;
        }

        const pc = createPeer();

        await pc.setRemoteDescription(new RTCSessionDescription(offer));

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        // send plain object
        safeEmit("answer", { sessionId, answer: pc.localDescription.toJSON() });
        if (showDebug) console.log("📤 Answer sent");
      } catch (err) {
        console.error("❌ Handling offer failed:", err);
        handleError("Failed to handle offer");
      }
    };

    const onAnswer = async ({ answer }) => {
      try {
        if (showDebug) console.log("📥 Received ANSWER");
        const pc = peerConnection.current;
        if (!pc) {
          if (showDebug) console.warn("No peerConnection when answer arrived");
          return;
        }
        // Always try to set remote description (more robust)
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        if (showDebug) console.log("✅ Remote description (answer) set");
      } catch (err) {
        console.error("❌ Answer handling error:", err);
      }
    };

    const onIce = async ({ candidate }) => {
      try {
        if (!candidate) return;
        if (peerConnection.current && peerConnection.current.remoteDescription) {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
          if (showDebug) console.log("✅ Added remote ICE candidate", candidate);
        } else {
          pendingCandidates.current.push(candidate);
          if (showDebug) console.log("⏳ Pushed pending candidate", candidate);
        }
      } catch (e) {
        if (showDebug) console.error("addIceCandidate error:", e);
      }
    };

    const onConnect = () => {
      if (showDebug) console.log("✅ Socket connected:", socket.id);
      setIsConnecting(false);
    };

    socket.on("connect", onConnect);
    socket.on("peer-joined", onPeerJoined);
    socket.on("offer", onOffer);
    socket.on("answer", onAnswer);
    socket.on("ice-candidate", onIce);

    return () => {
      socket.off("connect", onConnect);
      socket.off("peer-joined", onPeerJoined);
      socket.off("offer", onOffer);
      socket.off("answer", onAnswer);
      socket.off("ice-candidate", onIce);
    };
  }, [sessionId, role, showDebug]);

  // ---------------- CAMERA ----------------
  useEffect(() => {
    let stream;

    const startCamera = async () => {
      try {
        if (showDebug) console.log("📹 Camera...");
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });

        localStream.current = stream;
        if (showDebug) console.log("✅ Camera ready");

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          // autoplay muted local preview
          localVideoRef.current.muted = true;
          await localVideoRef.current.play().catch(() => {});
        }

        const joinRoom = () => {
          if (hasJoinedRoom.current) return;
          if (socket.connected) {
            if (showDebug) console.log("🚪 Joining:", sessionId, "as", role);
            safeEmit("join-session", sessionId);
            safeEmit("joined-session", { sessionId, role });
            hasJoinedRoom.current = true;
          } else {
            setTimeout(joinRoom, 500);
          }
        };

        setTimeout(joinRoom, 500);
      } catch (err) {
        console.error("❌ Camera:", err);
        handleError("Camera denied or not available");
      }
    };

    startCamera();

    return () => {
      if (showDebug) console.log("🧹 Cleanup");
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
      hasJoinedRoom.current = false;
      localStream.current = null;
    };
  }, [sessionId, role, showDebug]);

  const toggleAudio = () => {
    if (localStream.current) {
      const track = localStream.current.getAudioTracks()[0];
      if (track) {
        track.enabled = !track.enabled;
        setIsAudioMuted(!track.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream.current) {
      const track = localStream.current.getVideoTracks()[0];
      if (track) {
        track.enabled = !track.enabled;
        setIsVideoOff(!track.enabled);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover bg-gray-900"
          />
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              You ({userName})
            </div>
          </div>
        </div>

        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover bg-gray-900"
          />
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isRemoteConnected ? "bg-green-400 animate-pulse" : "bg-gray-400"
                }`}
              ></div>
              Remote
            </div>
          </div>
          {!isRemoteConnected && (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-6xl mb-4">👤</div>
                <div>Waiting...</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={toggleAudio}
          className={`px-6 py-3 rounded-xl ${isAudioMuted ? "bg-red-600" : "bg-gray-700"} text-white`}
        >
          {isAudioMuted ? "🔇" : "🔊"}
        </button>
        <button
          onClick={toggleVideo}
          className={`px-6 py-3 rounded-xl ${isVideoOff ? "bg-red-600" : "bg-gray-700"} text-white`}
        >
          {isVideoOff ? "📹" : "🎥"}
        </button>
      </div>
    </div>
  );
};

export default JoinSession;
