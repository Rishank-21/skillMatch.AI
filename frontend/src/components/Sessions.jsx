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
} from "lucide-react";
import { LuIndianRupee } from "react-icons/lu";
import axios from "axios";
import JoinSession from "./JoinSession";
import { useSelector } from "react-redux";
import { PhoneOff } from "lucide-react";
const Sessions = () => {
  const userData = useSelector((state) => state.user.userData);
  const statusStyles = {
    upcoming:
      "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200",
    completed:
      "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200",
    cancelled:
      "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border border-gray-200",
  };

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailModal, setEmailModal] = useState(false);
  const [videoModal, setVideoModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [emailData, setEmailData] = useState({
    subject: "",
    message: "",
  });
  const [currentUser, setCurrentUser] = useState(null);
//helper
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
  };

  const handleCloseVideoModal = () => {
    setSelectedSession(null);
    setVideoModal(false);
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
        setSessions(result.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sessions:", error);
        setLoading(false);
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
  };

  const handleCloseModal = () => {
    setEmailModal(false);
    setSelectedSession(null);
    setEmailData({ subject: "", message: "" });
  };

  // Sort sessions based on joinability and status
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
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_API_URL}/session/send-mail`,
        {
          to: selectedSession?.mentor?.user?.email,
          from: selectedSession?.user?.email,
          subject: emailData.subject,
          message: emailData.message,
        },
        { withCredentials: true }
      );
    
      handleCloseModal();
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  // helper: if profileImage is a full URL use it, otherwise prepend VITE_IMAGE_URL
  const getProfileImageSrc = (profileImage) => {
    if (!profileImage) return "/placeholder-avatar.png"; // optional fallback image in public folder
    if (/^https?:\/\//i.test(profileImage)) return profileImage;
    const base = (import.meta.env.VITE_IMAGE_URL || "").replace(/\/$/, "");
    return `${base}/${profileImage.replace(/\\/g, "/").replace(/^\//, "")}`;
  };

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

      {/* Email Modal */}
      {emailModal && selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100">
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-6 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Send Message</h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  From (Your Email)
                </label>
                <input
                  type="email"
                  value={selectedSession?.user.email || ""}
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  To (Mentor Email)
                </label>
                <input
                  type="email"
                  value={selectedSession?.mentor?.user?.email || ""}
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) =>
                    setEmailData({ ...emailData, subject: e.target.value })
                  }
                  placeholder="Enter email subject..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={emailData.message}
                  onChange={(e) =>
                    setEmailData({ ...emailData, message: e.target.value })
                  }
                  placeholder="Type your message here..."
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 resize-none"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendEmail}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Call Modal */}
      {/* {videoModal && selectedSession && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 h-screen w-screen">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-auto">
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-4 rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <Video className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">
                  Video Call with {selectedSession?.mentor?.user?.username}
                </h2>
              </div>
              <button
                onClick={handleCloseVideoModal}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <JoinSession
                sessionId={selectedSession._id}
                userName={currentUser.username}
              />
            </div>
          </div>
        </div>
      )} */}

      {videoModal && selectedSession && currentUser && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden border border-violet-500/20 animate-scaleIn">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                    <Video className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                      Video Session
                    </h2>
                    <p className="text-violet-100 text-sm mt-1 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Connected with {selectedSession?.mentor?.user?.username}
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
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-inner border border-violet-500/10">
                <JoinSession
                  sessionId={selectedSession._id}
                  userName={currentUser.username}
                  showDebug={false}
                  role="user"
                />
              </div>
            </div>

            {/* Footer with End Call Button */}
            <div className="bg-gray-900/80 backdrop-blur-sm px-8 py-4 border-t border-violet-500/10 flex items-center justify-between">
              <p className="text-gray-400 text-sm">
                Session ID:{" "}
                <span className="text-violet-400 font-mono">
                  {selectedSession._id.slice(-8)}
                </span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Your Sessions
            </h1>
            <p className="text-gray-600 text-lg">
              Manage and join your upcoming mentorship sessions
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <Home className="w-5 h-5" />
            Home
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-violet-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  Total Sessions
                </p>
                <p className="text-3xl font-bold text-violet-600">
                  {sessions.length}
                </p>
              </div>
              <div className="bg-violet-100 p-3 rounded-xl">
                <Calendar className="w-8 h-8 text-violet-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  Total Spent
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  ₹{sessions.reduce((acc, s) => acc + (s.amountPaid || 0), 0)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <LuIndianRupee className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  Mentors
                </p>
                <p className="text-3xl font-bold text-indigo-600">
                  {uniqueMentors}
                </p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-xl">
                <User className="w-8 h-8 text-indigo-600" />
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
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="flex items-start gap-4 flex-1">
                        <img
                          src={getProfileImageSrc(
                            session?.mentor?.profileImage
                          )}
                          alt={session.mentor?.name || "Mentor"}
                          className="w-16 h-16 rounded-xl object-cover ring-4 ring-violet-100"
                        />
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {session.mentor.user.username}
                          </h3>
                          <p className="text-violet-600 text-sm font-medium mb-2">
                            {session.mentor?.title ||
                              session.mentor?.skills?.[0] ||
                              "Mentor"}
                          </p>
                          <p className="text-gray-700 font-medium mb-3">
                            Session Price: ₹{session.amountPaid}
                          </p>

                          <div className="flex flex-wrap gap-4 text-sm">
                            {session.sessionTime?.[0] && (
                              <>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Calendar className="w-4 h-4 text-violet-500" />
                                  <span>
                                    {formatDate(session.sessionTime[0].date)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Clock className="w-4 h-4 text-purple-500" />
                                  <span>
                                    {formatTime(session.sessionTime[0].time)}
                                  </span>
                                </div>
                              </>
                            )}
                            <div className="flex items-center gap-2 text-gray-600">
                              <Video className="w-4 h-4 text-indigo-500" />
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
                            <span className="animate-pulse inline-flex items-center px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                              • LIVE NOW
                            </span>
                          )}
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => handleMessageClick(session)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-300 hover:scale-105 cursor-pointer"
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
                                  ? "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white hover:shadow-xl hover:scale-105 cursor-pointer"
                                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
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

                  <div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="bg-gradient-to-br from-violet-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-12 h-12 text-violet-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Sessions Yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You don't have any scheduled sessions yet. Book a session with a
                mentor to get started!
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-8 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Browse Mentors
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sessions;
