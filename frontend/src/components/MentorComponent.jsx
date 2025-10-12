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
  const [mentorSessions, setMentorSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState(null);
  const [joinMode, setJoinMode] = useState(false);

  const dispatch = useDispatch();
  useGetMentorData();
  useGetCurrentUser();
  const userData = useSelector((state) => state.user.userData);
  const mentorData = useSelector((state) => state.mentor.mentorData);

  // helper to return correct image src (handles full URLs from Cloudinary or server-relative paths) helper
  const getProfileImageSrc = (profileImage) => {
    if (!profileImage) return null;
    if (/^https?:\/\//i.test(profileImage)) return profileImage;
    const base = (import.meta.env.VITE_IMAGE_URL || "").replace(/\/$/, "");
    return `${base}/${profileImage.replace(/\\/g, "/").replace(/^\//, "")}`;
  };

  const [formData, setFormData] = useState({
    name: mentorData?.name || "",
    bio: mentorData?.bio || "",
    expertise: mentorData?.expertise || "",
    availableSlots: mentorData?.availableSlots || [],
  });

  useEffect(() => {
    const fetchMentorSessions = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/session/mentor-session`,
          { withCredentials: true }
        );
        setMentorSessions(res.data);
      } catch (error) {
        console.error("Error fetching mentor sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorSessions();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "upcoming":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
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
    <div className="space-y-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 sm:p-12 ">
      {/* Profile Image & Name */}
      <div className="flex flex-col items-center gap-6 relative">
        <div className="relative flex items-center justify-center">
          {mentorData.profileImage ? (
            <div className="relative">
              <img
                src={getProfileImageSrc(mentorData.profileImage)}
                alt="Profile"
                className="h-40 w-40 rounded-full object-cover shadow-2xl ring-4 ring-white ring-offset-4 ring-offset-violet-100"
              />
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          ) : (
            <div className="h-40 w-40 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-2xl ring-4 ring-white ring-offset-4 ring-offset-violet-100">
              <User size={60} className="text-gray-400" />
            </div>
          )}
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-800">
            {userData.user.username}
          </h2>
          <div className="flex items-center gap-2 text-gray-600 bg-gray-50 rounded-full px-4 py-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
            </svg>
            {userData.user.email}
          </div>
        </div>
      </div>

      {/* About Me */}
      <div className="w-full space-y-4">
        <h3 className="flex items-center gap-3 text-xl font-bold text-gray-800 pb-2 border-b border-gray-100">
          <div className="p-2 bg-gradient-to-r from-violet-100 to-indigo-100 rounded-lg">
            <FileText className="text-violet-600" size={20} />
          </div>
          About Me
        </h3>
        <div className="relative">
          <p className="border border-gray-200 rounded-2xl p-6 w-full min-h-32 bg-gradient-to-br from-gray-50 to-white text-gray-700 shadow-sm leading-relaxed text-base overflow-y-auto max-h-40">
            {mentorData.bio || "No bio available."}
          </p>
          <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-violet-400 to-indigo-400 rounded-full"></div>
        </div>
      </div>

      {/* Skills */}
      <div className="w-full space-y-4">
        <h3 className="flex items-center gap-3 text-xl font-bold text-gray-800 pb-2 border-b border-gray-100">
          <div className="p-2 bg-gradient-to-r from-violet-100 to-indigo-100 rounded-lg">
            <Lightbulb className="text-violet-600" size={20} />
          </div>
          Skills & Expertise
        </h3>
        <div className="flex flex-wrap gap-3 mt-4">
          {mentorData.skills && mentorData.skills.length > 0 ? (
            mentorData.skills.map((skill, index) => (
              <div
                key={skill}
                className="group flex items-center bg-gradient-to-r from-indigo-50 to-violet-50 hover:from-indigo-100 hover:to-violet-100 text-indigo-700 font-semibold rounded-full px-6 py-3 shadow-sm border border-indigo-100 hover:border-indigo-200 transition-all duration-200 hover:scale-105 cursor-default"
              >
                <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-violet-400 rounded-full mr-3 group-hover:scale-110 transition-transform duration-200"></div>
                {skill}
              </div>
            ))
          ) : (
            <div className="w-full text-center py-8 text-gray-500 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <Lightbulb className="mx-auto mb-2 text-gray-400" size={32} />
              <p className="font-medium">No skills added yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Hourly Fee */}
      <div className="w-full space-y-4">
        <h3 className="flex items-center gap-3 text-xl font-bold text-gray-800 pb-2 border-b border-gray-100">
          <div className="p-2 bg-gradient-to-r from-violet-100 to-indigo-100 rounded-lg">
            <DollarSign className="text-violet-600" size={20} />
          </div>
          Hourly Fee
        </h3>
        <div className="relative">
          <div className="border border-gray-200 rounded-2xl p-6 w-full bg-gradient-to-br from-gray-50 to-white shadow-sm">
            {mentorData.fee ? (
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-gray-800">
                  ₹{mentorData.fee}
                </span>
                <span className="text-lg text-gray-500 font-medium">/hour</span>
              </div>
            ) : (
              <div className="text-gray-500 font-medium">No fee set</div>
            )}
          </div>
          <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-violet-400 to-indigo-400 rounded-full"></div>
        </div>
      </div>

      {/* Available Slots */}
      <div className="w-full space-y-4">
        <h3 className="flex items-center gap-3 text-xl font-bold text-gray-800 pb-2 border-b border-gray-100">
          <div className="p-2 bg-gradient-to-r from-violet-100 to-indigo-100 rounded-lg">
            <Calendar className="text-violet-600" size={20} />
          </div>
          Available Time Slots
        </h3>
        {mentorData.availableSlots && mentorData.availableSlots.length > 0 ? (
          <div className="grid gap-3 mt-4 sm:grid-cols-2">
            {mentorData.availableSlots.map((slot, index) => (
              <div
                key={index}
                className="group flex items-center justify-between bg-gradient-to-r from-indigo-50 to-violet-50 hover:from-indigo-100 hover:to-violet-100 text-indigo-700 rounded-2xl px-6 py-4 shadow-sm border border-indigo-100 hover:border-indigo-200 transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200">
                    <Calendar size={16} className="text-indigo-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">
                      {slot.date}
                    </span>
                    <div className="text-sm text-indigo-600 font-medium">
                      {slot.time}
                    </div>
                  </div>
                </div>
                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full shadow-sm"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-500 bg-gradient-to-br from-gray-50 to-white">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
              <Calendar className="text-gray-400" size={28} />
            </div>
            <h4 className="font-semibold text-gray-600 mb-2">
              No time slots available
            </h4>
            <p className="text-sm">
              Add your available time slots to connect with mentees
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderSessionsView = () => (
    <MentorSessions />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-indigo-100 w-full">
      <div className="flex items-center flex-col p-6 sm:p-10 gap-8 pt-20 overflow-hidden">
        {/* Header */}
        <div className="text-center max-w-3xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-2xl mb-4 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Mentor Dashboard
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Manage your profile, view sessions, and connect with mentees
            effectively.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-center w-full max-w-4xl">
          <div className="flex flex-wrap sm:flex-nowrap gap-2 bg-white/60 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === "profile"
                  ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-md"
                  : "text-gray-600 hover:text-violet-600 hover:bg-white/50"
              }`}
            >
              <User size={20} />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("edit")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === "edit"
                  ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-md"
                  : "text-gray-600 hover:text-violet-600 hover:bg-white/50"
              }`}
            >
              <Edit size={20} />
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab("sessions")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === "sessions"
                  ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-md"
                  : "text-gray-600 hover:text-violet-600 hover:bg-white/50"
              }`}
            >
              <Calendar size={18} />
              Sessions
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full max-w-4xl">
          {activeTab === "profile" && renderProfileView()}
          {activeTab === "edit" && (
            <div className="space-y-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 sm:p-12">
              <EditMentorData activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          )}
          {activeTab === "sessions" && renderSessionsView()}
        </div>

       
      

        {joinMode && activeSession && (
          <div className="fixed inset-0 bg-black z-50">
            {/* Main Video Container - Full Screen */}
            <div className="relative w-full h-full">
              
              {/* Top Bar */}
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent p-4 flex items-center justify-between z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {activeSession?.user?.username?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">
                      {activeSession?.user?.username}
                    </h3>
                    <p className="text-gray-300 text-xs">Connected</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseVideoModal}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Remote User Video - Full Screen (Student's Video) */}
              <div className="w-full h-full">
                <JoinSession
                  sessionId={activeSession._id}
                  userName={userData?.user?.username}
                  isFullScreen={true}
                />
              </div>

              {/* Self View - Small Window (Bottom Right) - Mentor's Own Video */}
              <div className="absolute bottom-24 right-4 w-32 h-44 bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border-2 border-white border-opacity-30 z-20">
                <div className="w-full h-full bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center relative">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-1">
                      <span className="text-xl">{userData?.user?.username?.[0]?.toUpperCase()}</span>
                    </div>
                    <p className="text-white text-xs">You</p>
                  </div>
                  
                  {/* Camera flip button */}
                  <button className="absolute top-2 right-2 bg-black bg-opacity-40 p-1.5 rounded-full hover:bg-opacity-60 transition-all">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 002-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Bottom Control Bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 z-20">
                <div className="flex items-center justify-center gap-6">
                  
                  {/* Mute/Unmute Button */}
                  <button
                    className="p-4 bg-gray-700 bg-opacity-80 hover:bg-opacity-100 rounded-full transition-all duration-200 hover:scale-105"
                    aria-label="Toggle microphone"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>

                  {/* End Call Button */}
                  <button 
                    onClick={handleCloseVideoModal}
                    className="p-5 bg-red-500 hover:bg-red-600 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg"
                    aria-label="End call"
                  >
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
                    </svg>
                  </button>
                  
                  {/* Video On/Off Button */}
                  <button 
                    className="p-4 bg-gray-700 bg-opacity-80 hover:bg-opacity-100 rounded-full transition-all duration-200 hover:scale-105"
                    aria-label="Toggle video"
                  >
                    <Video className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorComponent;