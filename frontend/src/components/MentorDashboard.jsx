
import React, { useState, useEffect } from "react";
import Nav from "./Nav.jsx";
import { IoPersonOutline } from "react-icons/io5";
import { MdOutlineCameraAlt } from "react-icons/md";
import { CgFileDocument } from "react-icons/cg";
import { HiOutlineLightBulb } from "react-icons/hi";
import { FaPlus } from "react-icons/fa6";
import { BsCalendar3 } from "react-icons/bs";
import MentorComponent from "./MentorComponent.jsx";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMentorData } from "../redux/mentorSlice.js";
import useGetMentorData from "../hooks/useGetMentorData.jsx";
import Footer from "./Footer.jsx";

function MentorDashboard() {
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState([]);

  const [backendImage, setBackendImage] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [bio, setBio] = useState("");
  const [fee, setFee] = useState("");

  const [sendEmail, setSendEmail] = useState(null);

  const dispatch = useDispatch();
  useGetMentorData();
  const mentorData = useSelector((state) => state.mentor.mentorData);
useEffect(() => {
  if (mentorData?.user?.email) {
    setSendEmail(mentorData.user.email);
  }
}, [mentorData]);

  // Skills handlers
  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("bio", bio);
      formData.append("skills", JSON.stringify(skills));
      formData.append("availableSlots", JSON.stringify(slots));
      formData.append("fee", fee);

      if (backendImage) {
        formData.append("profileImage", backendImage);
      }

      const result = await axios.post(
        `${import.meta.env.VITE_API_URL}/mentor/complete-profile`,
        formData,
        { withCredentials: true }
      );

     
      dispatch(setMentorData(result.data.mentor));
      
    } catch (error) {
      console.error("Submit error:", error?.response?.data || error.message);
    }
  };

  const handleRemoveSkill = (removeSkill) => {
    setSkills(skills.filter((skill) => skill !== removeSkill));
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // Slots handlers helper
  const handleAddSlot = () => {
    if (!date || !time) return;
    const newSlot = { date, time };
    if (
      !slots.some((s) => s.date === newSlot.date && s.time === newSlot.time)
    ) {
      setSlots((prev) => [...prev, newSlot]);
      setDate("");
      setTime("");
    }
  };

  const handleRemoveSlot = (index) => {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100 w-full pt-16 md:pt-20">
      <Nav />
      {!mentorData ? (
        <div className="flex items-center flex-col px-4 sm:px-6 md:px-10 py-6 md:py-10 gap-6 md:gap-10 overflow-hidden">
          {/* Header */}
          <div className="text-center max-w-3xl mt-4 md:mt-8">
            <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl mb-4 shadow-xl">
              <IoPersonOutline className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Complete Your Mentor Profile
            </h1>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed px-4">
              Help students connect with you and understand your expertise
            </p>
          </div>

          {/* Main Card */}
          <div className="w-full max-w-4xl">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
              <div className="p-6 sm:p-8 md:p-10 space-y-8 md:space-y-10">
                
                {/* Profile Photo Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="p-2.5 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-xl">
                      <IoPersonOutline className="w-6 h-6 text-violet-600" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                      Profile Photo
                    </h3>
                  </div>

                  <div className="flex flex-col items-center gap-5">
                    <div className="relative group">
                      {frontendImage ? (
                        <div className="relative">
                          <img
                            src={frontendImage}
                            alt="Profile"
                            className="h-32 w-32 md:h-40 md:w-40 rounded-full object-cover shadow-2xl ring-4 ring-violet-100 ring-offset-4"
                          />
                          <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                        </div>
                      ) : (
                        <div className="h-32 w-32 md:h-40 md:w-40 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center hover:from-violet-50 hover:to-indigo-50 transition-all duration-300 shadow-xl ring-4 ring-gray-100 ring-offset-4 group">
                          <MdOutlineCameraAlt className="w-12 h-12 md:w-16 md:h-16 text-gray-400 group-hover:text-violet-500 transition-colors duration-300" />
                        </div>
                      )}
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                        <MdOutlineCameraAlt className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    <div className="w-full max-w-md">
                      <label className="block">
                        <input
                          type="file"
                          accept="image/*"
                          className="block w-full text-sm text-gray-600
                            file:mr-4 file:py-3 file:px-6
                            file:rounded-xl file:border-0
                            file:text-sm file:font-semibold
                            file:bg-gradient-to-r file:from-violet-500 file:to-indigo-600
                            file:text-white file:shadow-lg
                            hover:file:from-violet-600 hover:file:to-indigo-700
                            file:cursor-pointer file:transition-all file:duration-300
                            cursor-pointer"
                          onChange={handleImage}
                        />
                      </label>
                      <p className="text-sm text-gray-500 text-center mt-3">
                        Upload a professional photo (JPG, PNG - Max 5MB)
                      </p>
                    </div>
                  </div>
                </div>

                {/* About You */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="p-2.5 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-xl">
                      <CgFileDocument className="w-6 h-6 text-violet-600" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                      About You
                    </h3>
                  </div>
                  <div className="relative">
                    <textarea
                      name="bio"
                      placeholder="Share your experience, expertise, and what makes you a great mentor..."
                      className="border-2 border-gray-200 rounded-2xl p-4 md:p-5 w-full outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent h-36 md:h-40 shadow-sm resize-none text-gray-700 placeholder-gray-400 transition-all duration-300"
                      maxLength={500}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    ></textarea>
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400 font-medium">
                      {bio.length}/500
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="p-2.5 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-xl">
                      <HiOutlineLightBulb className="w-6 h-6 text-violet-600" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                      Skills & Expertise
                    </h3>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      className="border-2 border-gray-200 rounded-xl p-3 md:p-4 flex-1 outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent shadow-sm text-gray-700 placeholder-gray-400 transition-all duration-300"
                      placeholder="e.g., React, Node.js, Python..."
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleInputKeyDown}
                    />
                    <button
                      type="button"
                      className="bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white rounded-xl px-6 py-3 md:py-4 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                      onClick={handleAddSkill}
                    >
                      <FaPlus className="w-4 h-4" /> Add Skill
                    </button>
                  </div>

                  {/* Skills Display */}
                  {skills.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {skills.map((skill) => (
                        <div
                          key={skill}
                          className="group flex items-center bg-gradient-to-r from-violet-50 to-indigo-50 hover:from-violet-100 hover:to-indigo-100 text-violet-700 font-semibold rounded-full px-5 py-2.5 shadow-sm border border-violet-200 transition-all duration-300 hover:scale-105"
                        >
                          <div className="w-2 h-2 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full mr-2"></div>
                          <span className="text-sm md:text-base">{skill}</span>
                          <button
                            type="button"
                            className="ml-3 text-red-500 hover:text-red-600 font-bold text-lg transition-colors duration-200"
                            onClick={() => handleRemoveSkill(skill)}
                            aria-label={`Remove ${skill}`}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
                      <HiOutlineLightBulb className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-400 font-medium">No skills added yet</p>
                      <p className="text-sm text-gray-400 mt-1">Add your skills above</p>
                    </div>
                  )}
                </div>

                {/* Hourly Fee */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="p-2.5 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-xl">
                      <span className="text-2xl">💰</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                      Hourly Fee
                    </h3>
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">
                      ₹
                    </div>
                    <input
                      type="number"
                      className="border-2 border-gray-200 rounded-xl p-4 md:p-5 w-full outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent shadow-sm pl-10 pr-20 text-gray-700 placeholder-gray-400 transition-all duration-300"
                      placeholder="Enter your hourly rate"
                      value={fee}
                      onChange={(e) => setFee(e.target.value)}
                      min="0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                      /hour
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 ml-1">
                    Set a competitive rate based on your experience
                  </p>
                </div>

                {/* Available Time Slots */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="p-2.5 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-xl">
                      <BsCalendar3 className="w-6 h-6 text-violet-600" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                      Available Time Slots
                    </h3>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="border-2 border-gray-200 rounded-xl p-3 md:p-4 outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent shadow-sm flex-1 text-gray-700 transition-all duration-300"
                    />
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="border-2 border-gray-200 rounded-xl p-3 md:p-4 outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent shadow-sm flex-1 text-gray-700 transition-all duration-300"
                    />
                    <button
                      type="button"
                      className="bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white rounded-xl px-6 py-3 md:py-4 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold whitespace-nowrap"
                      onClick={handleAddSlot}
                    >
                      <FaPlus className="w-4 h-4" /> Add Slot
                    </button>
                  </div>

                  {/* Slots Display */}
                  {slots.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 md:p-10 text-center">
                      <BsCalendar3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <h4 className="font-semibold text-gray-600 mb-2">No time slots added yet</h4>
                      <p className="text-sm text-gray-400">Add your available time slots above</p>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {slots.map((slot, index) => (
                        <div
                          key={index}
                          className="group flex items-center justify-between bg-gradient-to-r from-violet-50 to-indigo-50 hover:from-violet-100 hover:to-indigo-100 text-violet-700 rounded-xl px-5 py-4 shadow-sm border border-violet-200 transition-all duration-300 hover:scale-105"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              <BsCalendar3 className="w-4 h-4 text-violet-600" />
                            </div>
                            <div>
                              <span className="font-semibold text-gray-800 block text-sm md:text-base">
                                {new Date(slot.date).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                              <div className="text-sm text-violet-600 font-medium">
                                {slot.time}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-600 font-bold text-xl transition-colors duration-200"
                            onClick={() => handleRemoveSlot(index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Save Button */}
                <div className="pt-6">
                  <button
                    className="w-full bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white font-bold rounded-xl px-8 py-4 md:py-5 shadow-xl hover:shadow-2xl transition-all duration-300 text-base md:text-lg transform hover:scale-[1.02] active:scale-[0.98]"
                    onClick={handleSubmit}
                  >
                    Save & Complete Profile
                  </button>
                  <p className="text-center text-sm text-gray-500 mt-4">
                    You can update your profile anytime
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <MentorComponent />
      )}

      <Footer sendEmail={sendEmail} />
    </div>
  );
}

export default MentorDashboard;