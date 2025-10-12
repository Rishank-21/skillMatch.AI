import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import { Calendar, Clock, Video, User, X, PhoneOff } from "lucide-react";
import axios from "axios";
import JoinSession from "./JoinSession";
import { useSelector } from "react-redux";
const MentorSessions = () => {
  const mentorData = useSelector((state) => state.mentor.mentorData);

  const statusStyles = {
    upcoming:
      "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200",
    completed:
      "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200",
    cancelled:
      "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border border-yellow-200",
  };

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videoModal, setVideoModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);


  // Normalize status & check if session is joinable
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
    if (status !== "upcoming") return; // prevent joining non-upcoming sessions
    setSelectedSession(session);
    setVideoModal(true);
  };

  const handleCloseVideoModal = () => {
    setSelectedSession(null);
    setVideoModal(false);
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
        setSessions(result.data);
      } catch (error) {
        console.error("Error fetching mentor sessions:", error);
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

  // Sort sessions: joinable > upcoming > completed > cancelled
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
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
        <Nav />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-violet-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 mt-16">
      <Nav />

    
    
{videoModal && selectedSession && currentUser && (
  <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden border border-cyan-500/20 animate-scaleIn">
      {/* Header helper */}
      <div className="relative bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl shadow-lg">
              <Video className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Mentoring Session
              </h2>
              <p className="text-cyan-100 text-sm mt-1 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Connected with {selectedSession?.user?.username}
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseVideoModal}
            className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-xl transition-all duration-300 hover:rotate-90 hover:scale-110"
            aria-label="Close video call"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        
        {/* Decorative gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
      </div>

      {/* Video Content Area */}
      <div className="p-8 bg-gradient-to-b from-gray-900 to-black min-h-[600px]">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-inner border border-cyan-500/10">
          <JoinSession
            sessionId={selectedSession._id}
            userName={currentUser.username}
            showDebug={false}
            role="mentor"
          />
        </div>
      </div>

      {/* Footer with End Call Button */}
      <div className="bg-gray-900/80 backdrop-blur-sm px-8 py-4 border-t border-cyan-500/10 flex items-center justify-between">
        <p className="text-gray-400 text-sm">
          Session ID: <span className="text-cyan-400 font-mono">{selectedSession._id.slice(-8)}</span>
        </p>
        
        <button
          onClick={handleCloseVideoModal}
          className="group flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-500/50"
        >
          <PhoneOff className="w-5 h-5 group-hover:animate-bounce" />
          End Call
        </button>
      </div>
    </div>
  </div>
)}
      {/* Sessions List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            My Sessions
          </h1>
          <p className="text-gray-600 text-lg">View and join your mentorship sessions</p>
        </div>

        <div className="space-y-6">
          {sortedSessions.length > 0 ? (
            sortedSessions.map((session) => {
              const status = session.status?.toLowerCase();
              const isJoinable = status === "upcoming" && canJoinSession(session);

              return (
                <div
                  key={session._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group"
                >
                  <div className="p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center ring-4 ring-blue-50">
                        <User className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {session.user?.username || "Unknown User"}
                        </h3>
                        <p className="text-gray-600 text-sm font-medium mb-2">
                          {session.user?.email || "No email"}
                        </p>
                        {session.sessionTime?.[0] && (
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              <span>{formatDate(session.sessionTime[0].date)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="w-4 h-4 text-cyan-500" />
                              <span>{formatTime(session.sessionTime[0].time)}</span>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-600">
                          <Video className="w-4 h-4 text-indigo-500" />
                          <span>Video Call</span>
                        </div>
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
                          <span className="animate-pulse inline-flex items-center px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">
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
                              ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700 hover:shadow-xl hover:scale-105 cursor-pointer"
                              : "bg-gray-400 text-gray-700 cursor-not-allowed"
                          }`}
                        >
                          <Video className="w-4 h-4" />
                          Join Session
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
                <Calendar className="text-gray-400" size={28} />
              </div>
              <h3 className="font-semibold text-gray-600 mb-2">No sessions yet</h3>
              <p className="text-sm">Your mentoring sessions will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorSessions;

