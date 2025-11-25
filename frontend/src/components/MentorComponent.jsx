


import React, { useEffect, useState } from "react";
import {
  User,
  FileText,
  Lightbulb,
  Calendar,
  Edit,
  DollarSign,
  Video,
  X,
  Mail,
  CheckCircle,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Sparkles,
} from "lucide-react";
import { useDispatch } from "react-redux";
import useGetMentorData from "../hooks/useGetMentorData";
import { useSelector } from "react-redux";
import EditMentorData from "./EditMentorData";
import useGetCurrentUser from "../hooks/useGetCurrentUser";
import axios from "axios";
import JoinSession from "./JoinSession";
import MentorSessions from "./MentorSession";

const MentorComponent = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [activeSession, setActiveSession] = useState(null);
  const [joinMode, setJoinMode] = useState(false);

  const dispatch = useDispatch();
  useGetMentorData();
  useGetCurrentUser();
  const userData = useSelector((state) => state.user.userData);
  const mentorData = useSelector((state) => state.mentor.mentorData);

  const getProfileImageSrc = (profileImage) => {
    if (!profileImage) return null;
    if (/^https?:\/\//i.test(profileImage)) return profileImage;
    const base = (import.meta.env.VITE_IMAGE_URL || "").replace(/\/$/, "");
    return `${base}/${profileImage.replace(/\\/g, "/").replace(/^\//, "")}`;
  };

  const handleJoinSession = (session) => {
    setActiveSession(session);
    setJoinMode(true);
  };

  const handleCloseVideoModal = () => {
    setActiveSession(null);
    setJoinMode(false);
  };

  const renderProfileView = () => (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Left Column - Profile & Stats */}
      <div className="lg:col-span-1 space-y-6">
        {/* Profile Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {mentorData.profileImage ? (
                <div className="relative">
                  <img
                    src={getProfileImageSrc(mentorData.profileImage)}
                    alt="Profile"
                    className="h-32 w-32 lg:h-40 lg:w-40 rounded-full object-cover shadow-2xl ring-4 ring-cyan-500/30"
                  />
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
              ) : (
                <div className="h-32 w-32 lg:h-40 lg:w-40 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center shadow-2xl ring-4 ring-slate-700">
                  <User size={60} className="text-slate-500" />
                </div>
              )}
            </div>
            
            <div className="text-center space-y-2 w-full">
              <h2 className="text-2xl font-bold text-white break-words">
                {userData.user.username}
              </h2>
              <div className="flex items-center justify-center gap-2 text-slate-400 bg-slate-800/50 rounded-full px-3 py-2 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="truncate text-xs">{userData.user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hourly Fee Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
            <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
              <DollarSign className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Hourly Fee</h3>
          </div>
          {mentorData.fee ? (
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-white">
                ₹{mentorData.fee}
              </span>
              <span className="text-lg text-slate-400 font-medium">/hour</span>
            </div>
          ) : (
            <div className="text-slate-500 font-medium">No fee set</div>
          )}
        </div>
      </div>

      {/* Right Column - Details */}
      <div className="lg:col-span-2 space-y-6">
        {/* About Me Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
            <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
              <FileText className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white">About Me</h3>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 min-h-32 max-h-48 overflow-y-auto custom-scrollbar">
            <p className="text-slate-300 leading-relaxed">
              {mentorData.bio || "No bio available."}
            </p>
          </div>
        </div>

        {/* Skills Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
            <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
              <Lightbulb className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Skills & Expertise</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {mentorData.skills && mentorData.skills.length > 0 ? (
              mentorData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 text-cyan-400 font-semibold rounded-full px-4 py-2 shadow-sm border border-cyan-500/30 transition-all duration-300 hover:scale-105"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full mr-2"></div>
                  <span className="text-sm">{skill}</span>
                </div>
              ))
            ) : (
              <div className="w-full text-center py-6 text-slate-500 bg-slate-800/30 rounded-xl border-2 border-dashed border-slate-700">
                <Lightbulb className="mx-auto mb-2 text-slate-600" size={32} />
                <p className="font-medium">No skills added yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Available Slots Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
            <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
              <Calendar className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Available Time Slots</h3>
          </div>
          {mentorData.availableSlots && mentorData.availableSlots.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
              {mentorData.availableSlots.map((slot, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 text-cyan-400 rounded-xl px-4 py-3 shadow-sm border border-cyan-500/30 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-cyan-400 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-white text-sm block">
                        {new Date(slot.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <div className="text-xs text-cyan-400 font-medium">
                        {slot.time}
                      </div>
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center text-slate-500 bg-slate-800/30">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h4 className="font-semibold text-slate-500 mb-1">
                No time slots available
              </h4>
              <p className="text-sm text-slate-600">
                Add your available time slots to connect with mentees
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSessionsView = () => (
    <MentorSessions />
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white w-full relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 flex items-center flex-col p-6 sm:p-10 gap-8 pt-24 overflow-hidden">
        {/* Header */}
        <div className="text-center max-w-3xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl mb-4 shadow-xl shadow-purple-500/30">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Mentor Dashboard
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Manage your profile, view sessions, and connect with mentees effectively
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-center w-full max-w-4xl">
          <div className="flex flex-wrap sm:flex-nowrap gap-2 bg-slate-900/50 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-slate-800">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === "profile"
                  ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <User size={20} />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("edit")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === "edit"
                  ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Edit size={20} />
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab("sessions")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === "sessions"
                  ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Calendar size={18} />
              Sessions
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full max-w-7xl">
          {activeTab === "profile" && renderProfileView()}
          {activeTab === "edit" && (
            <div>
              <EditMentorData activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          )}
          {activeTab === "sessions" && renderSessionsView()}
        </div>

        {/* Video Call Modal */}
        {joinMode && activeSession && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50">
            <div className="relative w-full h-full">
              {/* Top Bar */}
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent p-4 flex items-center justify-between z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold">
                      {activeSession?.user?.username?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">
                      {activeSession?.user?.username}
                    </h3>
                    <p className="text-green-400 text-xs flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Connected
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseVideoModal}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200 cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Remote User Video - Full Screen */}
              <div className="w-full h-full">
                <JoinSession
                  sessionId={activeSession._id}
                  userName={userData?.user?.username}
                  isFullScreen={true}
                />
              </div>

              {/* Self View - Small Window */}
              <div className="absolute bottom-24 right-4 w-32 h-44 bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border-2 border-cyan-500/30 z-20">
                <div className="w-full h-full bg-gradient-to-br from-cyan-600 to-purple-700 flex items-center justify-center relative">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1">
                      <span className="text-xl text-white font-bold">
                        {userData?.user?.username?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-white text-xs">You</p>
                  </div>
                </div>
              </div>

              {/* Bottom Control Bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 z-20">
                <div className="flex items-center justify-center gap-6">
                  {/* Mute Button */}
                  <button className="p-4 bg-slate-700/80 hover:bg-slate-700 rounded-full transition-all duration-200 hover:scale-105 cursor-pointer">
                    <Mic className="w-6 h-6 text-white" />
                  </button>

                  {/* End Call Button */}
                  <button 
                    onClick={handleCloseVideoModal}
                    className="p-5 bg-red-600 hover:bg-red-700 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-red-500/50 cursor-pointer"
                  >
                    <PhoneOff className="w-7 h-7 text-white" />
                  </button>
                  
                  {/* Video Button */}
                  <button className="p-4 bg-slate-700/80 hover:bg-slate-700 rounded-full transition-all duration-200 hover:scale-105 cursor-pointer">
                    <Video className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.15; }
        }
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgb(51 65 85 / 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgb(6 182 212 / 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgb(6 182 212 / 0.5);
        }
      `}</style>
    </div>
  );
};

export default MentorComponent;