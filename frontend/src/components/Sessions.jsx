


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Nav from "./Nav";
// import {
//   Calendar,
//   Clock,
//   Video,
//   User,
//   MessageSquare,
//   ChevronRight,
//   Home,
//   X,
//   Send,
//   Mail,
//   PhoneOff,
//   DollarSign,
//   Mic,
// } from "lucide-react";
// import axios from "axios";
// import JoinSession from "./JoinSession";
// import { useSelector } from "react-redux";

// const Sessions = () => {
//   const userData = useSelector((state) => state.user.userData);
  
//   const statusStyles = {
//     upcoming: "bg-green-500/20 text-green-400 border border-green-500/50",
//     completed: "bg-blue-500/20 text-blue-400 border border-blue-500/50",
//     cancelled: "bg-slate-700 text-slate-400 border border-slate-600",
//   };

//   const [sessions, setSessions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [emailModal, setEmailModal] = useState(false);
//   const [videoModal, setVideoModal] = useState(false);
//   const [selectedSession, setSelectedSession] = useState(null);
//   const [emailData, setEmailData] = useState({ subject: "", message: "" });
//   const [currentUser, setCurrentUser] = useState(null);

//   const navigate = useNavigate();

//   const canJoinSession = (session) => {
//     if (!session.sessionTime?.[0]) return false;

//     const now = new Date();
//     const sessionDate = session.sessionTime[0].date;
//     const sessionTime = session.sessionTime[0].time;

//     const [hours, minutes] = sessionTime.split(":").map(Number);
//     const sessionDateTime = new Date(sessionDate);
//     sessionDateTime.setHours(hours, minutes, 0, 0);

//     const joinWindowStart = new Date(sessionDateTime.getTime() - 5 * 60 * 1000);
//     const joinWindowEnd = new Date(sessionDateTime.getTime() + 20 * 60 * 1000);

//     return now >= joinWindowStart && now <= joinWindowEnd;
//   };

//   const handleJoinSession = async (session) => {
//     setSelectedSession(session);
//     setVideoModal(true);
//   };

//   const handleCloseVideoModal = () => {
//     setSelectedSession(null);
//     setVideoModal(false);
//   };

//   useEffect(() => {
//     if (userData?.user) {
//       setCurrentUser(userData.user);
//     }
//   }, [userData]);

//   useEffect(() => {
//     const fetchSessions = async () => {
//       try {
//         const result = await axios.get(
//           `${import.meta.env.VITE_API_URL}/session/all`,
//           { withCredentials: true }
//         );
//         setSessions(result.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching sessions:", error);
//         setLoading(false);
//       }
//     };
//     fetchSessions();
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setSessions((prev) => [...prev]);
//     }, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   const formatTime = (timeString) => {
//     const [hours, minutes] = timeString.split(":");
//     const hour = parseInt(hours);
//     const ampm = hour >= 12 ? "PM" : "AM";
//     const hour12 = hour % 12 || 12;
//     return `${hour12}:${minutes} ${ampm}`;
//   };

//   const uniqueMentors =
//     sessions.length > 0
//       ? new Set(sessions.map((s) => s.mentor?._id || s.mentor)).size
//       : 0;

//   const handleMessageClick = (session) => {
//     setSelectedSession(session);
//     setEmailModal(true);
//   };

//   const handleCloseModal = () => {
//     setEmailModal(false);
//     setSelectedSession(null);
//     setEmailData({ subject: "", message: "" });
//   };

//   const sortedSessions = [...sessions].sort((a, b) => {
//     const aJoinable = a.status === "upcoming" && canJoinSession(a);
//     const bJoinable = b.status === "upcoming" && canJoinSession(b);

//     if (aJoinable && !bJoinable) return -1;
//     if (!aJoinable && bJoinable) return 1;

//     if (a.status === "upcoming" && b.status !== "upcoming") return -1;
//     if (b.status === "upcoming" && a.status !== "upcoming") return 1;

//     if (a.status === "completed" && b.status !== "completed") return -1;
//     if (b.status === "completed" && a.status !== "completed") return 1;

//     if (a.status === "cancelled" && b.status !== "cancelled") return 1;
//     if (b.status === "cancelled" && a.status !== "cancelled") return -1;

//     const aTime = new Date(
//       a.sessionTime?.[0]?.date + " " + a.sessionTime?.[0]?.time
//     );
//     const bTime = new Date(
//       b.sessionTime?.[0]?.date + " " + b.sessionTime?.[0]?.time
//     );
//     return aTime - bTime;
//   });

//   const handleSendEmail = async () => {
//     try {
//       await axios.post(
//         `${import.meta.env.VITE_API_URL}/session/send-mail`,
//         {
//           to: selectedSession?.mentor?.user?.email,
//           from: selectedSession?.user?.email,
//           subject: emailData.subject,
//           message: emailData.message,
//         },
//         { withCredentials: true }
//       );
//       handleCloseModal();
//     } catch (error) {
//       console.error("Error sending email:", error);
//     }
//   };

//   const getProfileImageSrc = (profileImage) => {
//     if (!profileImage) return "/placeholder-avatar.png";
//     if (/^https?:\/\//i.test(profileImage)) return profileImage;
//     const base = (import.meta.env.VITE_IMAGE_URL || "").replace(/\/$/, "");
//     return `${base}/${profileImage.replace(/\\/g, "/").replace(/^\//, "")}`;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-950">
//         <Nav />
//         <div className="flex items-center justify-center h-screen">
//           <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
//       {/* Animated Background */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
//         <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
//         <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '4s'}}></div>
//       </div>

//       <Nav />

//       {/* Email Modal */}
//       {emailModal && selectedSession && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl">
//             <div className="bg-gradient-to-r from-cyan-500 to-purple-600 p-6 rounded-t-3xl flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
//                   <Mail className="w-6 h-6 text-white" />
//                 </div>
//                 <h2 className="text-2xl font-bold text-white">Send Message</h2>
//               </div>
//               <button
//                 onClick={handleCloseModal}
//                 className="text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200 cursor-pointer"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>

//             <div className="p-6 space-y-5">
//               <div>
//                 <label className="block text-sm font-semibold text-slate-300 mb-2">
//                   From (Your Email)
//                 </label>
//                 <input
//                   type="email"
//                   value={selectedSession?.user.email || ""}
//                   disabled
//                   className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 cursor-not-allowed"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-300 mb-2">
//                   To (Mentor Email)
//                 </label>
//                 <input
//                   type="email"
//                   value={selectedSession?.mentor?.user?.email || ""}
//                   disabled
//                   className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 cursor-not-allowed"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-300 mb-2">
//                   Subject
//                 </label>
//                 <input
//                   type="text"
//                   value={emailData.subject}
//                   onChange={(e) =>
//                     setEmailData({ ...emailData, subject: e.target.value })
//                   }
//                   placeholder="Enter email subject..."
//                   className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-white placeholder-slate-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-300 mb-2">
//                   Message
//                 </label>
//                 <textarea
//                   value={emailData.message}
//                   onChange={(e) =>
//                     setEmailData({ ...emailData, message: e.target.value })
//                   }
//                   placeholder="Type your message here..."
//                   rows="6"
//                   className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 resize-none text-white placeholder-slate-500"
//                 ></textarea>
//               </div>

//               <div className="flex gap-3 pt-4">
//                 <button
//                   onClick={handleCloseModal}
//                   className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 cursor-pointer"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSendEmail}
//                   className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 cursor-pointer"
//                 >
//                   <Send className="w-5 h-5" />
//                   Send Message
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Full Screen Video Modal */}
//       {videoModal && selectedSession && currentUser && (
//         <div className="fixed inset-0 bg-black z-50 flex flex-col">
//           {/* Top Bar - Compact */}
//           <div className="bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 px-6 py-3 flex items-center justify-between shadow-lg z-20">
//             <div className="flex items-center gap-3">
//               <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
//                 <Video className="w-5 h-5 text-white" />
//               </div>
//               <div>
//                 <h2 className="text-lg font-bold text-white">Video Session</h2>
//                 <p className="text-cyan-100 text-xs flex items-center gap-2">
//                   <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
//                   {selectedSession?.mentor?.user?.username}
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={handleCloseVideoModal}
//               className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all duration-200 cursor-pointer"
//             >
//               <X className="w-5 h-5 text-white" />
//             </button>
//           </div>

//           {/* Video Content - Maximum Height */}
//           <div className="flex-1 bg-black p-2 overflow-hidden">
//             <div className="w-full h-full rounded-lg overflow-hidden">
//               <JoinSession
//                 sessionId={selectedSession._id}
//                 userName={currentUser.username}
//                 showDebug={false}
//                 role="user"
//               />
//             </div>
//           </div>

//           {/* Bottom Controls - Compact */}
//           <div className="bg-slate-900/95 px-6 py-3 flex items-center justify-between border-t border-cyan-500/10 z-20">
//             <p className="text-slate-400 text-xs">
//               ID: <span className="text-cyan-400 font-mono">{selectedSession._id.slice(-8)}</span>
//             </p>
            
//             <div className="flex items-center gap-4">
//               {/* Mic Button */}
//               <button className="p-3 bg-slate-700/80 hover:bg-slate-700 rounded-full transition-all duration-200 cursor-pointer">
//                 <Mic className="w-5 h-5 text-white" />
//               </button>

//               {/* End Call */}
//               <button
//                 onClick={handleCloseVideoModal}
//                 className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full font-semibold transition-all duration-200 shadow-lg hover:shadow-red-500/50 cursor-pointer"
//               >
//                 <PhoneOff className="w-4 h-4" />
//                 End Call
//               </button>

//               {/* Video Button */}
//               <button className="p-3 bg-slate-700/80 hover:bg-slate-700 rounded-full transition-all duration-200 cursor-pointer">
//                 <Video className="w-5 h-5 text-white" />
//               </button>
//             </div>

//             <div className="w-20"></div>
//           </div>
//         </div>
//       )}

//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-24">
//         <div className="mb-8 flex items-center justify-between">
//           <div>
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
//               Your Sessions
//             </h1>
//             <p className="text-slate-400 text-lg">
//               Manage and join your upcoming mentorship sessions
//             </p>
//           </div>
//           <button
//             onClick={() => navigate("/dashboard")}
//             className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 cursor-pointer"
//           >
//             <Home className="w-5 h-5" />
//             Home
//           </button>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-400 text-sm font-medium mb-1">
//                   Total Sessions
//                 </p>
//                 <p className="text-3xl font-bold text-cyan-400">
//                   {sessions.length}
//                 </p>
//               </div>
//               <div className="bg-cyan-500/20 p-3 rounded-xl border border-cyan-500/30">
//                 <Calendar className="w-8 h-8 text-cyan-400" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-400 text-sm font-medium mb-1">
//                   Total Spent
//                 </p>
//                 <p className="text-3xl font-bold text-purple-400">
//                   ₹{sessions.reduce((acc, s) => acc + (s.amountPaid || 0), 0)}
//                 </p>
//               </div>
//               <div className="bg-purple-500/20 p-3 rounded-xl border border-purple-500/30">
//                 <DollarSign className="w-8 h-8 text-purple-400" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-pink-500/50 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-400 text-sm font-medium mb-1">
//                   Mentors
//                 </p>
//                 <p className="text-3xl font-bold text-pink-400">
//                   {uniqueMentors}
//                 </p>
//               </div>
//               <div className="bg-pink-500/20 p-3 rounded-xl border border-pink-500/30">
//                 <User className="w-8 h-8 text-pink-400" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Sessions List */}
//         <div className="space-y-6">
//           {sortedSessions.length > 0 ? (
//             sortedSessions.map((session) => {
//               const isJoinable =
//                 session.status === "upcoming" && canJoinSession(session);

//               return (
//                 <div
//                   key={session._id}
//                   className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 overflow-hidden border border-slate-800 hover:border-cyan-500/50 group"
//                 >
//                   <div className="p-6">
//                     <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//                       <div className="flex items-start gap-4 flex-1">
//                         <img
//                           src={getProfileImageSrc(session?.mentor?.profileImage)}
//                           alt={session.mentor?.name || "Mentor"}
//                           className="w-16 h-16 rounded-xl object-cover ring-4 ring-slate-700 group-hover:ring-cyan-500 transition-all"
//                         />
//                         <div className="flex-1">
//                           <h3 className="text-xl font-bold text-white mb-1">
//                             {session.mentor.user.username}
//                           </h3>
//                           <p className="text-cyan-400 text-sm font-medium mb-2">
//                             {session.mentor?.title ||
//                               session.mentor?.skills?.[0] ||
//                               "Mentor"}
//                           </p>
//                           <p className="text-white font-medium mb-3">
//                             Session Price: ₹{session.amountPaid}
//                           </p>

//                           <div className="flex flex-wrap gap-4 text-sm">
//                             {session.sessionTime?.[0] && (
//                               <>
//                                 <div className="flex items-center gap-2 text-slate-400">
//                                   <Calendar className="w-4 h-4 text-cyan-400" />
//                                   <span>
//                                     {formatDate(session.sessionTime[0].date)}
//                                   </span>
//                                 </div>
//                                 <div className="flex items-center gap-2 text-slate-400">
//                                   <Clock className="w-4 h-4 text-purple-400" />
//                                   <span>
//                                     {formatTime(session.sessionTime[0].time)}
//                                   </span>
//                                 </div>
//                               </>
//                             )}
//                             <div className="flex items-center gap-2 text-slate-400">
//                               <Video className="w-4 h-4 text-pink-400" />
//                               <span>Video Call</span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex flex-col gap-3 lg:items-end">
//                         <div className="flex items-center gap-2">
//                           <span
//                             className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
//                               statusStyles[session.status] ||
//                               statusStyles["cancelled"]
//                             }`}
//                           >
//                             {session.status.charAt(0).toUpperCase() +
//                               session.status.slice(1)}
//                           </span>

//                        {isJoinable && (
//   <span className="animate-pulse inline-flex items-center px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-[0_0_15px_rgba(239,68,68,0.8)] border-2 border-red-400">
//     • LIVE NOW
//   </span>
// )}
//                         </div>

//                         <div className="flex gap-3">
//                           <button
//                             onClick={() => handleMessageClick(session)}
//                             className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 cursor-pointer"
//                           >
//                             <MessageSquare className="w-4 h-4" />
//                             Message
//                           </button>

//                           {session.status === "upcoming" && (
//                             <button
//                               disabled={!isJoinable}
//                               onClick={() => handleJoinSession(session)}
//                               className={`flex items-center gap-2 px-6 py-2 rounded-xl font-semibold shadow-lg transition-all duration-300 group ${
//                                 isJoinable
//                                   ? "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white hover:shadow-purple-500/50 hover:scale-105 cursor-pointer"
//                                   : "bg-slate-700 text-slate-500 cursor-not-allowed"
//                               }`}
//                             >
//                               Join Session
//                               <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
//                 </div>
//               );
//             })
//           ) : (
//             <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-lg p-12 text-center">
//               <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/30">
//                 <Calendar className="w-12 h-12 text-cyan-400" />
//               </div>
//               <h3 className="text-2xl font-bold text-white mb-3">
//                 No Sessions Yet
//               </h3>
//               <p className="text-slate-400 mb-6 max-w-md mx-auto">
//                 You don't have any scheduled sessions yet. Book a session with a
//                 mentor to get started!
//               </p>
//               <button
//                 onClick={() => navigate("/mentors/:userId")}
//                 className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 cursor-pointer"
//               >
//                 Browse Mentors
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       <style>{`
//         @keyframes pulse {
//           0%, 100% { opacity: 0.1; }
//           50% { opacity: 0.15; }
//         }
//         .animate-pulse {
//           animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Sessions;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import {
  Calendar,
  Clock,
  Video,
  User,
  MessageSquare,
  ChevronRight,
  Home,
  X,
  Send,
  Mail,
  PhoneOff,
  DollarSign,
  Mic,
} from "lucide-react";
import axios from "axios";
import JoinSession from "./JoinSession";
import { useSelector } from "react-redux";
import toast from 'react-hot-toast'; // ✅ Import toast

const Sessions = () => {
  const userData = useSelector((state) => state.user.userData);
  
  const statusStyles = {
    upcoming: "bg-green-500/20 text-green-400 border border-green-500/50",
    completed: "bg-blue-500/20 text-blue-400 border border-blue-500/50",
    cancelled: "bg-slate-700 text-slate-400 border border-slate-600",
  };

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailModal, setEmailModal] = useState(false);
  const [videoModal, setVideoModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [emailData, setEmailData] = useState({ subject: "", message: "" });
  const [currentUser, setCurrentUser] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false); // ✅ Add sending state

  const navigate = useNavigate();

  const canJoinSession = (session) => {
    if (!session.sessionTime?.[0]) return false;

    const now = new Date();
    const sessionDate = session.sessionTime[0].date;
    const sessionTime = session.sessionTime[0].time;

    const [hours, minutes] = sessionTime.split(":").map(Number);
    const sessionDateTime = new Date(sessionDate);
    sessionDateTime.setHours(hours, minutes, 0, 0);

    const joinWindowStart = new Date(sessionDateTime.getTime() - 5 * 60 * 1000);
    const joinWindowEnd = new Date(sessionDateTime.getTime() + 20 * 60 * 1000);

    return now >= joinWindowStart && now <= joinWindowEnd;
  };

  const handleJoinSession = async (session) => {
    setSelectedSession(session);
    setVideoModal(true);
    toast.success('Joining session... 🎥', { duration: 2000 }); // ✅ Join toast
  };

  const handleCloseVideoModal = () => {
    setSelectedSession(null);
    setVideoModal(false);
    toast('Session ended', { icon: '👋', duration: 2000 }); // ✅ End session toast
  };

  useEffect(() => {
    if (userData?.user) {
      setCurrentUser(userData.user);
    }
  }, [userData]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_API_URL}/session/all`,
          { withCredentials: true }
        );
        // After API response
        const uniqueSessions = Array.from(
          new Map(result.data.map((s) => [s._id, s])).values()
        );
        setSessions(uniqueSessions);

        setLoading(false);

        // ✅ Toast for session count
        if (result.data.length > 0) {
          const upcoming = result.data.filter(
            (s) => s.status === "upcoming"
          ).length;
          if (upcoming > 0) {
            toast.success(
              `You have ${upcoming} upcoming session${
                upcoming > 1 ? "s" : ""
              }!`,
              {
                duration: 3000,
                icon: "📅",
              }
            );
          }
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
        setLoading(false);
        toast.error('Failed to load sessions. Please refresh the page.'); // ✅ Error toast
      }
    };
    fetchSessions();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSessions((prev) => [...prev]);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const uniqueMentors =
    sessions.length > 0
      ? new Set(sessions.map((s) => s.mentor?._id || s.mentor)).size
      : 0;

  const handleMessageClick = (session) => {
    setSelectedSession(session);
    setEmailModal(true);
    toast('Compose your message', { icon: '✉️', duration: 2000 }); // ✅ Message modal toast
  };

  const handleCloseModal = () => {
    setEmailModal(false);
    setSelectedSession(null);
    setEmailData({ subject: "", message: "" });
  };

  const sortedSessions = [...sessions].sort((a, b) => {
    const aJoinable = a.status === "upcoming" && canJoinSession(a);
    const bJoinable = b.status === "upcoming" && canJoinSession(b);

    if (aJoinable && !bJoinable) return -1;
    if (!aJoinable && bJoinable) return 1;

    if (a.status === "upcoming" && b.status !== "upcoming") return -1;
    if (b.status === "upcoming" && a.status !== "upcoming") return 1;

    if (a.status === "completed" && b.status !== "completed") return -1;
    if (b.status === "completed" && a.status !== "completed") return 1;

    if (a.status === "cancelled" && b.status !== "cancelled") return 1;
    if (b.status === "cancelled" && a.status !== "cancelled") return -1;

    const aTime = new Date(
      a.sessionTime?.[0]?.date + " " + a.sessionTime?.[0]?.time
    );
    const bTime = new Date(
      b.sessionTime?.[0]?.date + " " + b.sessionTime?.[0]?.time
    );
    return aTime - bTime;
  });

  const handleSendEmail = async () => {
    // ✅ Validation
    if (!emailData.subject.trim()) {
      toast.error('Please enter a subject'); // ✅ Validation toast
      return;
    }
    
    if (!emailData.message.trim()) {
      toast.error('Please enter a message'); // ✅ Validation toast
      return;
    }

    setSendingEmail(true);
    const sendToast = toast.loading('Sending message...'); // ✅ Loading toast

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/session/send-mail`,
        {
          to: selectedSession?.mentor?.user?.email,
          from: selectedSession?.user?.email,
          subject: emailData.subject,
          message: emailData.message,
        },
        { withCredentials: true }
      );
      
      toast.dismiss(sendToast); // ✅ Dismiss loading
      toast.success(`Message sent to ${selectedSession?.mentor?.user?.username}! 📧`, {
        duration: 4000
      }); // ✅ Success toast
      handleCloseModal();
    } catch (error) {
      console.error("Error sending email:", error);
      toast.dismiss(sendToast); // ✅ Dismiss loading
      toast.error(
        error.response?.data?.message || 'Failed to send message. Please try again.'
      ); // ✅ Error toast
    } finally {
      setSendingEmail(false);
    }
  };

  const getProfileImageSrc = (profileImage) => {
    if (!profileImage) return "/placeholder-avatar.png";
    if (/^https?:\/\//i.test(profileImage)) return profileImage;
    const base = (import.meta.env.VITE_IMAGE_URL || "").replace(/\/$/, "");
    return `${base}/${profileImage.replace(/\\/g, "/").replace(/^\//, "")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Nav />
        <div className="flex items-center justify-center h-screen">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <Nav />

      {/* Email Modal */}
      {emailModal && selectedSession && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl">
            <div className="bg-gradient-to-r from-cyan-500 to-purple-600 p-6 rounded-t-3xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Send Message</h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  From (Your Email)
                </label>
                <input
                  type="email"
                  value={selectedSession?.user.email || ""}
                  disabled
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  To (Mentor Email)
                </label>
                <input
                  type="email"
                  value={selectedSession?.mentor?.user?.email || ""}
                  disabled
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) =>
                    setEmailData({ ...emailData, subject: e.target.value })
                  }
                  placeholder="Enter email subject..."
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Message
                </label>
                <textarea
                  value={emailData.message}
                  onChange={(e) =>
                    setEmailData({ ...emailData, message: e.target.value })
                  }
                  placeholder="Type your message here..."
                  rows="6"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 resize-none text-white placeholder-slate-500"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCloseModal}
                  disabled={sendingEmail}
                  className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendEmail}
                  disabled={sendingEmail}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingEmail ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Video Modal */}
      {videoModal && selectedSession && currentUser && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Top Bar - Compact */}
          <div className="bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 px-6 py-3 flex items-center justify-between shadow-lg z-20">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Video Session</h2>
                <p className="text-cyan-100 text-xs flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  {selectedSession?.mentor?.user?.username}
                </p>
              </div>
            </div>
            <button
              onClick={handleCloseVideoModal}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Video Content - Maximum Height */}
          <div className="flex-1 bg-black p-2 overflow-hidden">
            <div className="w-full h-full rounded-lg overflow-hidden">
              <JoinSession
                sessionId={selectedSession._id}
                userName={currentUser.username}
                showDebug={false}
                role="user"
              />
            </div>
          </div>

          {/* Bottom Controls - Compact */}
          <div className="bg-slate-900/95 px-6 py-3 flex items-center justify-between border-t border-cyan-500/10 z-20">
            <p className="text-slate-400 text-xs">
              ID: <span className="text-cyan-400 font-mono">{selectedSession._id.slice(-8)}</span>
            </p>
            
            <div className="flex items-center gap-4">
              {/* Mic Button */}
              <button className="p-3 bg-slate-700/80 hover:bg-slate-700 rounded-full transition-all duration-200 cursor-pointer">
                <Mic className="w-5 h-5 text-white" />
              </button>

              {/* End Call */}
              <button
                onClick={handleCloseVideoModal}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full font-semibold transition-all duration-200 shadow-lg hover:shadow-red-500/50 cursor-pointer"
              >
                <PhoneOff className="w-4 h-4" />
                End Call
              </button>

              {/* Video Button */}
              <button className="p-3 bg-slate-700/80 hover:bg-slate-700 rounded-full transition-all duration-200 cursor-pointer">
                <Video className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="w-20"></div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-24">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Your Sessions
            </h1>
            <p className="text-slate-400 text-lg">
              Manage and join your upcoming mentorship sessions
            </p>
          </div>
          <button
            onClick={() => {
              navigate("/dashboard");
              toast('Redirecting to dashboard...', { icon: '🏠', duration: 2000 }); // ✅ Navigation toast
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <Home className="w-5 h-5" />
            Home
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">
                  Total Sessions
                </p>
                <p className="text-3xl font-bold text-cyan-400">
                  {sessions.length}
                </p>
              </div>
              <div className="bg-cyan-500/20 p-3 rounded-xl border border-cyan-500/30">
                <Calendar className="w-8 h-8 text-cyan-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">
                  Total Spent
                </p>
                <p className="text-3xl font-bold text-purple-400">
                  ₹{sessions.reduce((acc, s) => acc + (s.amountPaid || 0), 0)}
                </p>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-xl border border-purple-500/30">
                <DollarSign className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-pink-500/50 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">
                  Mentors
                </p>
                <p className="text-3xl font-bold text-pink-400">
                  {uniqueMentors}
                </p>
              </div>
              <div className="bg-pink-500/20 p-3 rounded-xl border border-pink-500/30">
                <User className="w-8 h-8 text-pink-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-6">
          {sortedSessions.length > 0 ? (
            sortedSessions.map((session) => {
              const isJoinable =
                session.status === "upcoming" && canJoinSession(session);

              return (
                <div
                  key={session._id}
                  className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 overflow-hidden border border-slate-800 hover:border-cyan-500/50 group"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="flex items-start gap-4 flex-1">
                        <img
                          src={getProfileImageSrc(session?.mentor?.profileImage)}
                          alt={session.mentor?.name || "Mentor"}
                          className="w-16 h-16 rounded-xl object-cover ring-4 ring-slate-700 group-hover:ring-cyan-500 transition-all"
                        />
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-1">
                            {session.mentor.user.username}
                          </h3>
                          <p className="text-cyan-400 text-sm font-medium mb-2">
                            {session.mentor?.title ||
                              session.mentor?.skills?.[0] ||
                              "Mentor"}
                          </p>
                          <p className="text-white font-medium mb-3">
                            Session Price: ₹{session.amountPaid}
                          </p>

                          <div className="flex flex-wrap gap-4 text-sm">
                            {session.sessionTime?.[0] && (
                              <>
                                <div className="flex items-center gap-2 text-slate-400">
                                  <Calendar className="w-4 h-4 text-cyan-400" />
                                  <span>
                                    {formatDate(session.sessionTime[0].date)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400">
                                  <Clock className="w-4 h-4 text-purple-400" />
                                  <span>
                                    {formatTime(session.sessionTime[0].time)}
                                  </span>
                                </div>
                              </>
                            )}
                            <div className="flex items-center gap-2 text-slate-400">
                              <Video className="w-4 h-4 text-pink-400" />
                              <span>Video Call</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 lg:items-end">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                              statusStyles[session.status] ||
                              statusStyles["cancelled"]
                            }`}
                          >
                            {session.status.charAt(0).toUpperCase() +
                              session.status.slice(1)}
                          </span>

                       {isJoinable && (
  <span className="animate-pulse inline-flex items-center px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-[0_0_15px_rgba(239,68,68,0.8)] border-2 border-red-400">
    • LIVE NOW
  </span>
)}
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => handleMessageClick(session)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 cursor-pointer"
                          >
                            <MessageSquare className="w-4 h-4" />
                            Message
                          </button>

                          {session.status === "upcoming" && (
                            <button
                              disabled={!isJoinable}
                              onClick={() => handleJoinSession(session)}
                              className={`flex items-center gap-2 px-6 py-2 rounded-xl font-semibold shadow-lg transition-all duration-300 group ${
                                isJoinable
                                  ? "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white hover:shadow-purple-500/50 hover:scale-105 cursor-pointer"
                                  : "bg-slate-700 text-slate-500 cursor-not-allowed"
                              }`}
                            >
                              Join Session
                              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              );
            })
          ) : (
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-lg p-12 text-center">
              <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/30">
                <Calendar className="w-12 h-12 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                No Sessions Yet
              </h3>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                You don't have any scheduled sessions yet. Book a session with a
                mentor to get started!
              </p>
              <button
                onClick={() => {
                  navigate(`/mentors/${userData?.user?._id}`);
                  toast('Finding mentors for you...', { icon: '🔍', duration: 2000 }); // ✅ Navigation toast
                }}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                Browse Mentors
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.15; }
        }
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default Sessions;