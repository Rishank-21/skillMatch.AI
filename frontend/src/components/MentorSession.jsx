


// import React, { useEffect, useState } from "react";
// import Nav from "./Nav";
// import { Calendar, Clock, Video, User, X, PhoneOff, Mic, MicOff, VideoOff } from "lucide-react";
// import axios from "axios";
// import JoinSession from "./JoinSession";
// import { useSelector } from "react-redux";

// const MentorSessions = () => {
//   const mentorData = useSelector((state) => state.mentor.mentorData);

//   const statusStyles = {
//     upcoming: "bg-green-500/20 text-green-400 border border-green-500/50",
//     completed: "bg-blue-500/20 text-blue-400 border border-blue-500/50",
//     cancelled: "bg-slate-700 text-slate-400 border border-slate-600",
//   };

//   const [sessions, setSessions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [videoModal, setVideoModal] = useState(false);
//   const [selectedSession, setSelectedSession] = useState(null);
//   const [currentUser, setCurrentUser] = useState(null);

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

//   const handleJoinSession = (session) => {
//     const status = session.status?.toLowerCase();
//     if (status !== "upcoming") return;
//     setSelectedSession(session);
//     setVideoModal(true);
//   };

//   const handleCloseVideoModal = () => {
//     setSelectedSession(null);
//     setVideoModal(false);
//   };

//   useEffect(() => {
//     if (mentorData) setCurrentUser(mentorData);
//   }, [mentorData]);

//   useEffect(() => {
//     const fetchSessions = async () => {
//       try {
//         const result = await axios.get(
//           `${import.meta.env.VITE_API_URL}/session/mentor-session`,
//           { withCredentials: true }
//         );
//         setSessions(result.data);
//       } catch (error) {
//         console.error("Error fetching mentor sessions:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSessions();
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => setSessions((prev) => [...prev]), 30000);
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

//   const sortedSessions = [...sessions].sort((a, b) => {
//     const aStatus = a.status?.toLowerCase();
//     const bStatus = b.status?.toLowerCase();
//     const aJoinable = aStatus === "upcoming" && canJoinSession(a);
//     const bJoinable = bStatus === "upcoming" && canJoinSession(b);

//     if (aJoinable && !bJoinable) return -1;
//     if (!aJoinable && bJoinable) return 1;

//     const order = ["upcoming", "completed", "cancelled"];
//     return order.indexOf(aStatus) - order.indexOf(bStatus);
//   });

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

//       {/* Full Screen Video Modal */}
//       {videoModal && selectedSession && currentUser && (
//         <div className="fixed inset-0 bg-black z-50 flex flex-col">
//           {/* Top Bar - Reduced Height */}
//           <div className="bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 px-6 py-3 flex items-center justify-between shadow-lg z-20">
//             <div className="flex items-center gap-3">
//               <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
//                 <Video className="w-5 h-5 text-white" />
//               </div>
//               <div>
//                 <h2 className="text-lg font-bold text-white">Mentoring Session</h2>
//                 <p className="text-cyan-100 text-xs flex items-center gap-2">
//                   <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
//                   {selectedSession?.user?.username}
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
//                 role="mentor"
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

//             <div className="w-20"></div> {/* Spacer for balance */}
//           </div>
//         </div>
//       )}

//       {/* Sessions List */}
//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
//             My Sessions
//           </h1>
//           <p className="text-slate-400 text-lg">View and join your mentorship sessions</p>
//         </div>

//         <div className="space-y-6">
//           {sortedSessions.length > 0 ? (
//             sortedSessions.map((session) => {
//               const status = session.status?.toLowerCase();
//               const isJoinable = status === "upcoming" && canJoinSession(session);

//               return (
//                 <div
//                   key={session._id}
//                   className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 overflow-hidden border border-slate-800 hover:border-cyan-500/50 group"
//                 >
//                   <div className="p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//                     <div className="flex items-start gap-4 flex-1">
//                       <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center ring-4 ring-cyan-500/10 border border-cyan-500/30">
//                         <User className="w-8 h-8 text-cyan-400" />
//                       </div>
//                       <div className="flex-1">
//                         <h3 className="text-xl font-bold text-white mb-1">
//                           {session.user?.username || "Unknown User"}
//                         </h3>
//                         <p className="text-slate-400 text-sm font-medium mb-3">
//                           {session.user?.email || "No email"}
//                         </p>
//                         {session.sessionTime?.[0] && (
//                           <div className="flex flex-wrap gap-4 text-sm">
//                             <div className="flex items-center gap-2 text-slate-400">
//                               <Calendar className="w-4 h-4 text-cyan-400" />
//                               <span>{formatDate(session.sessionTime[0].date)}</span>
//                             </div>
//                             <div className="flex items-center gap-2 text-slate-400">
//                               <Clock className="w-4 h-4 text-purple-400" />
//                               <span>{formatTime(session.sessionTime[0].time)}</span>
//                             </div>
//                             <div className="flex items-center gap-2 text-slate-400">
//                               <Video className="w-4 h-4 text-pink-400" />
//                               <span>Video Call</span>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     <div className="flex flex-col gap-3 lg:items-end">
//                       <div className="flex items-center gap-2">
//                         <span
//                           className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
//                             statusStyles[status] || statusStyles.cancelled
//                           }`}
//                         >
//                           {status.charAt(0).toUpperCase() + status.slice(1)}
//                         </span>

//                         {isJoinable && (
//                           <span className="animate-pulse inline-flex items-center px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-[0_0_15px_rgba(239,68,68,0.8)] border-2 border-red-400">
//                             • LIVE NOW
//                           </span>
//                         )}
//                       </div>

//                       {status === "upcoming" && (
//                         <button
//                           disabled={!isJoinable}
//                           onClick={() => handleJoinSession(session)}
//                           className={`flex items-center gap-2 px-6 py-2 rounded-xl font-semibold shadow-lg transition-all duration-300 ${
//                             isJoinable
//                               ? "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white hover:shadow-purple-500/50 hover:scale-105 cursor-pointer"
//                               : "bg-slate-700 text-slate-500 cursor-not-allowed"
//                           }`}
//                         >
//                           <Video className="w-4 h-4" />
//                           Join Session
//                         </button>
//                       )}
//                     </div>
//                   </div>

//                   <div className="h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
//                 </div>
//               );
//             })
//           ) : (
//             <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-12 text-center">
//               <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
//                 <Calendar className="text-cyan-400" size={28} />
//               </div>
//               <h3 className="font-semibold text-white mb-2">No sessions yet</h3>
//               <p className="text-sm text-slate-400">Your mentoring sessions will appear here</p>
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

// export default MentorSessions;

import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import { Calendar, Clock, Video, User, X, PhoneOff, Mic } from "lucide-react";
import axios from "axios";
import JoinSession from "./JoinSession";
import { useSelector } from "react-redux";
import toast from 'react-hot-toast'; // ✅ Import toast

const MentorSessions = () => {
  const mentorData = useSelector((state) => state.mentor.mentorData);

  const statusStyles = {
    upcoming: "bg-green-500/20 text-green-400 border border-green-500/50",
    completed: "bg-blue-500/20 text-blue-400 border border-blue-500/50",
    cancelled: "bg-slate-700 text-slate-400 border border-slate-600",
  };

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videoModal, setVideoModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

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

  const handleJoinSession = (session) => {
    const status = session.status?.toLowerCase();
    if (status !== "upcoming") {
      toast.error('This session is not available to join'); // ✅ Invalid status toast
      return;
    }

    if (!canJoinSession(session)) {
      toast.error('Session is not available yet. You can join 5 minutes before the scheduled time.'); // ✅ Timing error toast
      return;
    }

    setSelectedSession(session);
    setVideoModal(true);
    toast.success(`Starting session with ${session.user?.username}... 🎥`, { // ✅ Join success toast
      duration: 2000
    });
  };

  const handleCloseVideoModal = () => {
    setSelectedSession(null);
    setVideoModal(false);
    toast('Session ended', { icon: '👋', duration: 2000 }); // ✅ End session toast
  };

  useEffect(() => {
    if (mentorData) setCurrentUser(mentorData);
  }, [mentorData]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_API_URL}/session/mentor-session`,
          { withCredentials: true }
        );
        const uniqueSessions = Array.from(
          new Map(result.data.map((s) => [s._id, s])).values()
        );

        setSessions(uniqueSessions);

        
        // ✅ Toast for session count
        if (result.data.length > 0) {
          const upcoming = result.data.filter(s => s.status?.toLowerCase() === 'upcoming').length;
          if (upcoming > 0) {
            toast.success(`You have ${upcoming} upcoming session${upcoming > 1 ? 's' : ''}! 📅`, {
              duration: 3000,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching mentor sessions:", error);
        toast.error('Failed to load sessions. Please refresh the page.'); // ✅ Error toast
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setSessions((prev) => [...prev]), 30000);
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

  const sortedSessions = [...sessions].sort((a, b) => {
    const aStatus = a.status?.toLowerCase();
    const bStatus = b.status?.toLowerCase();
    const aJoinable = aStatus === "upcoming" && canJoinSession(a);
    const bJoinable = bStatus === "upcoming" && canJoinSession(b);

    if (aJoinable && !bJoinable) return -1;
    if (!aJoinable && bJoinable) return 1;

    const order = ["upcoming", "completed", "cancelled"];
    return order.indexOf(aStatus) - order.indexOf(bStatus);
  });

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

      {/* Full Screen Video Modal */}
      {videoModal && selectedSession && currentUser && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Top Bar - Reduced Height */}
          <div className="bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 px-6 py-3 flex items-center justify-between shadow-lg z-20">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Mentoring Session</h2>
                <p className="text-cyan-100 text-xs flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  {selectedSession?.user?.username}
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
                role="mentor"
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

            <div className="w-20"></div> {/* Spacer for balance */}
          </div>
        </div>
      )}

      {/* Sessions List */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            My Mentoring Sessions
          </h1>
          <p className="text-slate-400 text-lg">View and join your mentorship sessions</p>
        </div>

        {/* Stats Summary */}
        {sessions.length > 0 && (
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-4">
              <p className="text-slate-400 text-sm mb-1">Total Sessions</p>
              <p className="text-2xl font-bold text-cyan-400">{sessions.length}</p>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-4">
              <p className="text-slate-400 text-sm mb-1">Upcoming</p>
              <p className="text-2xl font-bold text-green-400">
                {sessions.filter(s => s.status?.toLowerCase() === 'upcoming').length}
              </p>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-4">
              <p className="text-slate-400 text-sm mb-1">Completed</p>
              <p className="text-2xl font-bold text-blue-400">
                {sessions.filter(s => s.status?.toLowerCase() === 'completed').length}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {sortedSessions.length > 0 ? (
            sortedSessions.map((session) => {
              const status = session.status?.toLowerCase();
              const isJoinable = status === "upcoming" && canJoinSession(session);

              return (
                <div
                  key={session._id}
                  className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 overflow-hidden border border-slate-800 hover:border-cyan-500/50 group"
                >
                  <div className="p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center ring-4 ring-cyan-500/10 border border-cyan-500/30">
                        <User className="w-8 h-8 text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">
                          {session.user?.username || "Unknown User"}
                        </h3>
                        <p className="text-slate-400 text-sm font-medium mb-3">
                          {session.user?.email || "No email"}
                        </p>
                        {session.sessionTime?.[0] && (
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2 text-slate-400">
                              <Calendar className="w-4 h-4 text-cyan-400" />
                              <span>{formatDate(session.sessionTime[0].date)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                              <Clock className="w-4 h-4 text-purple-400" />
                              <span>{formatTime(session.sessionTime[0].time)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                              <Video className="w-4 h-4 text-pink-400" />
                              <span>Video Call</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 lg:items-end">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                            statusStyles[status] || statusStyles.cancelled
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>

                        {isJoinable && (
                          <span className="animate-pulse inline-flex items-center px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-[0_0_15px_rgba(239,68,68,0.8)] border-2 border-red-400">
                            • LIVE NOW
                          </span>
                        )}
                      </div>

                      {status === "upcoming" && (
                        <button
                          disabled={!isJoinable}
                          onClick={() => handleJoinSession(session)}
                          className={`flex items-center gap-2 px-6 py-2 rounded-xl font-semibold shadow-lg transition-all duration-300 ${
                            isJoinable
                              ? "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white hover:shadow-purple-500/50 hover:scale-105 cursor-pointer"
                              : "bg-slate-700 text-slate-500 cursor-not-allowed"
                          }`}
                        >
                          <Video className="w-4 h-4" />
                          Join Session
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              );
            })
          ) : (
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-12 text-center">
              <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/30">
                <Calendar className="text-cyan-400 w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No Sessions Yet</h3>
              <p className="text-slate-400 max-w-md mx-auto">
                Your mentoring sessions will appear here once learners book time with you.
              </p>
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

export default MentorSessions;