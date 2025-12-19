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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6"> {/* Changed: Added grid-cols-1 for mobile */}
      {/* Left Column - Profile & Stats */}
      <div className="lg:col-span-1 space-y-4 lg:space-y-6"> {/* Changed: Reduced space */}
        {/* Profile Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-4 lg:p-6"> {/* Changed: Reduced padding */}
          <div className="flex flex-col items-center gap-3 lg:gap-4"> {/* Changed: Reduced gap */}
            <div className="relative">
              {mentorData.profileImage ? (
                <div className="relative">
                  <img
                    src={getProfileImageSrc(mentorData.profileImage)}
                    alt="Profile"
                    className="h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover shadow-2xl ring-4 ring-cyan-500/30" // Changed: Smaller on mobile
                  />
                  <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg"> {/* Changed: Smaller */}
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                </div>
              ) : (
                <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center shadow-2xl ring-4 ring-slate-700">
                  <User size={40} className="text-slate-500" /> {/* Changed: Smaller icon */}
                </div>
              )}
            </div>
            
            <div className="text-center space-y-1 lg:space-y-2 w-full"> {/* Changed: Reduced space */}
              <h2 className="text-xl lg:text-2xl font-bold text-white break-words"> {/* Changed: Smaller text, added break-words */}
                {userData.user.username}
              </h2>
              <div className="flex items-center justify-center gap-1 lg:gap-2 text-slate-400 bg-slate-800/50 rounded-full px-2 py-1 lg:px-3 lg:py-2 text-xs lg:text-sm"> {/* Changed: Smaller */}
                <Mail className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" />
                <span className="truncate text-xs">{userData.user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hourly Fee Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-4 lg:p-6"> {/* Changed: Reduced padding */}
          <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4 pb-2 lg:pb-3 border-b border-slate-800"> {/* Changed: Adjusted */}
            <div className="p-1.5 lg:p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
              <DollarSign className="w-4 h-4 lg:w-5 lg:h-5 text-cyan-400" />
            </div>
            <h3 className="text-base lg:text-lg font-bold text-white">Hourly Fee</h3>
          </div>
          {mentorData.fee ? (
            <div className="flex items-center gap-1 lg:gap-2">
              <span className="text-2xl lg:text-3xl font-bold text-white">
                ₹{mentorData.fee}
              </span>
              <span className="text-sm lg:text-lg text-slate-400 font-medium">/hour</span>
            </div>
          ) : (
            <div className="text-slate-500 font-medium text-sm">No fee set</div>
          )}
        </div>
      </div>

      {/* Right Column - Details */}
      <div className="lg:col-span-2 space-y-4 lg:space-y-6"> {/* Changed: Reduced space */}
        {/* About Me Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-4 lg:p-6"> {/* Changed: Reduced padding */}
          <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4 pb-2 lg:pb-3 border-b border-slate-800">
            <div className="p-1.5 lg:p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
              <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-cyan-400" />
            </div>
            <h3 className="text-base lg:text-lg font-bold text-white">About Me</h3>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 lg:p-4 min-h-24 lg:min-h-32 max-h-32 lg:max-h-48 overflow-y-auto custom-scrollbar"> {/* Changed: Smaller heights */}
            <p className="text-slate-300 leading-relaxed text-sm lg:text-base"> {/* Changed: Smaller text */}
              {mentorData.bio || "No bio available."}
            </p>
          </div>
        </div>

        {/* Skills Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-4 lg:p-6"> {/* Changed: Reduced padding */}
          <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4 pb-2 lg:pb-3 border-b border-slate-800">
            <div className="p-1.5 lg:p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
              <Lightbulb className="w-4 h-4 lg:w-5 lg:h-5 text-cyan-400" />
            </div>
            <h3 className="text-base lg:text-lg font-bold text-white">Skills & Expertise</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {mentorData.skills && mentorData.skills.length > 0 ? (
              mentorData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 text-cyan-400 font-semibold rounded-full px-3 py-1 lg:px-4 lg:py-2 shadow-sm border border-cyan-500/30 transition-all duration-300 hover:scale-105 min-h-[32px]" // Changed: Smaller padding, added min-h
                >
                  <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full mr-1 lg:mr-2"></div>
                  <span className="text-xs lg:text-sm">{skill}</span>
                </div>
              ))
            ) : (
              <div className="w-full text-center py-4 lg:py-6 text-slate-500 bg-slate-800/30 rounded-xl border-2 border-dashed border-slate-700">
                <Lightbulb className="w-8 h-8 lg:w-10 lg:h-10 text-slate-600 mx-auto mb-2" />
                <p className="font-medium text-xs lg:text-sm">No skills added yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Available Slots Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-4 lg:p-6"> {/* Changed: Reduced padding */}
          <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4 pb-2 lg:pb-3 border-b border-slate-800">
            <div className="p-1.5 lg:p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
              <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-cyan-400" />
            </div>
            <h3 className="text-base lg:text-lg font-bold text-white">Available Time Slots</h3>
          </div>
          {mentorData.availableSlots && mentorData.availableSlots.length > 0 ? (
            <div className="grid gap-2 lg:gap-3 sm:grid-cols-2 max-h-48 lg:max-h-64 overflow-y-auto custom-scrollbar pr-2"> {/* Changed: Smaller max-h, added sm:grid-cols-2 */}
              {mentorData.availableSlots.map((slot, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 text-cyan-400 rounded-xl px-3 py-2 lg:px-4 lg:py-3 shadow-sm border border-cyan-500/30 transition-all duration-300 hover:scale-105 min-h-[40px]" // Changed: Added min-h, adjusted padding
                >
                  <div className="flex items-center gap-2 lg:gap-3">
                    <Calendar size={14} className="text-cyan-400 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-white text-xs lg:text-sm block"> {/* Changed: Smaller text */}
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
                  <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-green-400 rounded-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 lg:p-8 text-center text-slate-500 bg-slate-800/30"> {/* Changed: Adjusted padding */}
              <Calendar className="w-10 h-10 lg:w-12 lg:h-12 text-slate-600 mx-auto mb-3" />
              <h4 className="font-semibold text-slate-500 mb-1 text-sm lg:text-base"> {/* Changed: Smaller text */}
                No time slots available
              </h4>
              <p className="text-xs lg:text-sm text-slate-600">
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

      <div className="relative z-10 flex items-center flex-col p-4 sm:p-6 lg:p-10 gap-6 lg:gap-8 pt-20 lg:pt-24 overflow-hidden"> {/* Changed: Reduced padding on mobile */}
        {/* Header */}
        <div className="text-center max-w-2xl lg:max-w-3xl"> {/* Changed: Smaller max-w */}
          <div className="inline-flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl mb-3 lg:mb-4 shadow-xl shadow-purple-500/30"> {/* Changed: Smaller */}
            <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 lg:mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Mentor Dashboard
          </h1>
          <p className="text-base lg:text-lg text-slate-400 leading-relaxed max-w-xl lg:max-w-2xl mx-auto">
            Manage your profile, view sessions, and connect with mentees effectively
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-center w-full max-w-3xl lg:max-w-4xl">
          <div className="flex flex-wrap sm:flex-nowrap gap-1 lg:gap-2 bg-slate-900/50 backdrop-blur-xl rounded-2xl p-1 lg:p-2 shadow-lg border border-slate-800"> {/* Changed: Reduced gap and padding */}
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1 lg:gap-2 px-4 py-2 lg:px-6 lg:py-3 rounded-xl font-semibold transition-all duration-200 min-h-[40px] ${ /* Changed: Added min-h, adjusted padding */
                activeTab === "profile"
                  ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <User size={16} className="lg:w-5 lg:h-5" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("edit")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1 lg:gap-2 px-4 py-2 lg:px-6 lg:py-3 rounded-xl font-semibold transition-all duration-200 min-h-[40px] ${ /* Changed: Added min-h */
                activeTab === "edit"
                  ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Edit size={16} className="lg:w-5 lg:h-5" />
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab("sessions")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1 lg:gap-2 px-4 py-2 lg:px-6 lg:py-3 rounded-xl font-semibold transition-all duration-200 min-h-[40px] ${ /* Changed: Added min-h */
                activeTab === "sessions"
                  ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Calendar size={16} className="lg:w-5 lg:h-5" />
              Sessions
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full max-w-5xl lg:max-w-7xl"> {/* Changed: Smaller max-w on mobile */}
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