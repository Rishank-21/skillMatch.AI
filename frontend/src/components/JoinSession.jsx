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





import React, { useEffect, useRef, useState } from "react";
import { socket } from "../socket.js";
import toast from 'react-hot-toast';

const JoinSession = ({ sessionId, userName, role = "user" }) => {
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    const peerConnection = useRef(null);
    const localStream = useRef(null);
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isConnecting, setIsConnecting] = useState(true);
    const [isRemoteConnected, setIsRemoteConnected] = useState(false);
    const pendingCandidates = useRef([]);

    const handleError = (message, err = null) => {
        console.error("❌", message, err);
        toast.error(message);
    };

    // ========== CREATE PEER CONNECTION ==========
    const createPeer = () => {
        if (peerConnection.current) {
            console.log("⚠️ Peer already exists");
            return peerConnection.current;
        }

        console.log("🔧 Creating NEW peer connection");

        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:stun1.l.google.com:19302" },
            ],
        });

        // ========== ADD LOCAL TRACKS FIRST (CRITICAL!) ==========
        if (localStream.current) {
            console.log("🎥 Adding LOCAL tracks to peer:");
            localStream.current.getTracks().forEach((track) => {
                console.log(`  ➕ ${track.kind}:`, track.id);
                pc.addTrack(track, localStream.current);
            });
        } else {
            console.error("❌ NO LOCAL STREAM AVAILABLE!");
        }

        // ========== ONTRACK - RECEIVE REMOTE TRACKS ==========
        pc.ontrack = (event) => {
            console.log("🎉 🎉 🎉 REMOTE TRACK RECEIVED! 🎉 🎉 🎉");
            console.log("Track details:", {
                kind: event.track.kind,
                id: event.track.id,
                enabled: event.track.enabled,
                readyState: event.track.readyState,
                streams: event.streams.length
            });

            if (event.streams && event.streams[0]) {
                console.log("📺 Setting remote video srcObject NOW");
                
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = event.streams[0];
                    
                    // Force play
                    remoteVideoRef.current.play()
                        .then(() => {
                            console.log("✅ Remote video playing!");
                            setIsRemoteConnected(true);
                            toast.success("Peer video connected!");
                        })
                        .catch(err => console.error("Play error:", err));
                }
            }
        };

        // ========== ICE CANDIDATE ==========
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                console.log("🧊 Sending ICE:", event.candidate.type);
                socket.emit("ice-candidate", { sessionId, candidate: event.candidate });
            }
        };

        // ========== ICE CONNECTION STATE ==========
        pc.oniceconnectionstatechange = () => {
            console.log("🧊 ICE State:", pc.iceConnectionState);
            if (pc.iceConnectionState === "connected") {
                console.log("✅ ✅ ✅ ICE CONNECTED! ✅ ✅ ✅");
            }
        };

        // ========== CONNECTION STATE ==========
        pc.onconnectionstatechange = () => {
            console.log("📡 Connection State:", pc.connectionState);
        };

        // Add pending ICE candidates
        pendingCandidates.current.forEach(async (candidate) => {
            try {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
                console.error("ICE error:", err);
            }
        });
        pendingCandidates.current = [];

        peerConnection.current = pc;
        return pc;
    };

    // ========== SOCKET SETUP ==========
    useEffect(() => {
        console.log("🔌 Socket setup for session:", sessionId);

        if (!socket.connected) {
            socket.connect();
        }

        // ========== CONNECT ==========
        const onConnect = () => {
            console.log("✅ Socket connected:", socket.id);
            setIsConnecting(false);
        };

        // ========== PEER JOINED ==========
        const onPeerJoined = async (peerId) => {
            console.log("👤 👤 👤 PEER JOINED:", peerId);
            toast.info("Peer joined! Creating offer...");

            try {
                // Ensure local stream is ready
                if (!localStream.current) {
                    console.error("❌ Local stream not ready!");
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                const pc = createPeer();
                
                // Wait a bit for tracks to settle
                await new Promise(resolve => setTimeout(resolve, 300));

                console.log("📝 Creating OFFER...");
                const offer = await pc.createOffer({
                    offerToReceiveAudio: true,
                    offerToReceiveVideo: true
                });

                await pc.setLocalDescription(offer);
                console.log("📤 Sending OFFER");
                socket.emit("offer", { sessionId, offer });
            } catch (err) {
                console.error("❌ Offer error:", err);
            }
        };

        // ========== OFFER RECEIVED ==========
        const onOffer = async ({ offer }) => {
            console.log("📥 📥 📥 OFFER RECEIVED");

            try {
                // Ensure local stream is ready
                if (!localStream.current) {
                    console.error("❌ Local stream not ready!");
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                const pc = createPeer();

                console.log("📝 Setting remote description (OFFER)");
                await pc.setRemoteDescription(new RTCSessionDescription(offer));

                console.log("📝 Creating ANSWER...");
                const answer = await pc.createAnswer();

                await pc.setLocalDescription(answer);
                console.log("📤 Sending ANSWER");
                socket.emit("answer", { sessionId, answer });
            } catch (err) {
                console.error("❌ Answer error:", err);
            }
        };

        // ========== ANSWER RECEIVED ==========
        const onAnswer = async ({ answer }) => {
            console.log("📥 📥 📥 ANSWER RECEIVED");

            try {
                const pc = peerConnection.current;
                if (pc && pc.signalingState !== "stable") {
                    console.log("📝 Setting remote description (ANSWER)");
                    await pc.setRemoteDescription(new RTCSessionDescription(answer));
                    console.log("✅ Answer set successfully!");
                }
            } catch (err) {
                console.error("❌ Answer error:", err);
            }
        };

        // ========== ICE CANDIDATE ==========
        const onIceCandidate = async ({ candidate }) => {
            console.log("🧊 ICE candidate received");
            try {
                if (peerConnection.current?.remoteDescription) {
                    await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
                } else {
                    pendingCandidates.current.push(candidate);
                }
            } catch (err) {
                console.error("ICE error:", err);
            }
        };

        socket.on("connect", onConnect);
        socket.on("peer-joined", onPeerJoined);
        socket.on("offer", onOffer);
        socket.on("answer", onAnswer);
        socket.on("ice-candidate", onIceCandidate);

        return () => {
            socket.off("connect", onConnect);
            socket.off("peer-joined", onPeerJoined);
            socket.off("offer", onOffer);
            socket.off("answer", onAnswer);
            socket.off("ice-candidate", onIceCandidate);
        };
    }, [sessionId]);

    // ========== CAMERA SETUP ==========
    useEffect(() => {
        let stream;

        const startCamera = async () => {
            try {
                console.log("📹 Requesting camera...");
                stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

                localStream.current = stream;
                console.log("✅ Camera ready, tracks:", stream.getTracks().length);

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                // Join session after camera is ready
                const join = () => {
                    if (socket.connected) {
                        console.log("🚪 Joining session:", sessionId);
                        socket.emit("join-session", sessionId);
                        socket.emit("joined-session", { sessionId, role });
                    } else {
                        setTimeout(join, 500);
                    }
                };

                setTimeout(join, 1500);
            } catch (err) {
                console.error("❌ Camera error:", err);
                handleError("Camera access denied");
            }
        };

        startCamera();

        return () => {
            console.log("🧹 Cleanup");
            if (stream) {
                stream.getTracks().forEach(t => t.stop());
            }
            if (peerConnection.current) {
                peerConnection.current.close();
                peerConnection.current = null;
            }
        };
    }, [sessionId, role]);

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
                            <div className={`w-2 h-2 rounded-full ${isRemoteConnected ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                            Remote User
                        </div>
                    </div>
                    {!isRemoteConnected && (
                        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                            <div className="text-center text-gray-400">
                                <div className="text-6xl mb-4">👤</div>
                                <div>Waiting for peer...</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-center gap-4">
                <button onClick={toggleAudio} className={`px-6 py-3 rounded-xl ${isAudioMuted ? 'bg-red-600' : 'bg-gray-700'} text-white`}>
                    {isAudioMuted ? "🔇 Unmute" : "🔊 Mute"}
                </button>
                <button onClick={toggleVideo} className={`px-6 py-3 rounded-xl ${isVideoOff ? 'bg-red-600' : 'bg-gray-700'} text-white`}>
                    {isVideoOff ? "📹 Start" : "🎥 Stop"}
                </button>
            </div>
        </div>
    );
};

export default JoinSession;