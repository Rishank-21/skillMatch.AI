import React, { useState, useEffect } from "react";
import { IoPersonOutline } from "react-icons/io5";
import { MdOutlineCameraAlt } from "react-icons/md";
import { CgFileDocument } from "react-icons/cg";
import { HiOutlineLightBulb } from "react-icons/hi";
import { FaPlus } from "react-icons/fa6";
import { BsCalendar3 } from "react-icons/bs";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMentorData } from "../redux/mentorSlice.js";
import useGetMentorData from "../hooks/useGetMentorData.jsx";
//helper
const EditMentorData = ({ activeTab, setActiveTab }) => {
  const dispatch = useDispatch();
  useGetMentorData();
  const mentorData = useSelector((state) => state.mentor.mentorData);

  const getProfileImageSrc = (profileImage) => {
    if (!profileImage) return null;
    if (/^https?:\/\//i.test(profileImage)) return profileImage;
    const base = (import.meta.env.VITE_IMAGE_URL || "").replace(/\/$/, "");
    return `${base}/${profileImage.replace(/\\/g, "/").replace(/^\//, "")}`;
  };

  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState([]);
  const [slots, setSlots] = useState([]);
  const [backendImage, setBackendImage] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [skillInput, setSkillInput] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    if (mentorData) {
      setBio(mentorData.bio || "");
      setSkills(mentorData.skills || []);
      setSlots(mentorData.availableSlots || []);
      if (mentorData.profileImage) {
        setFrontendImage(getProfileImageSrc(mentorData.profileImage));
      }
    }
  }, [mentorData]);

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
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

  const handleAddSlot = () => {
    if (!date || !time) return;
    const newSlot = { date, time };
    if (!slots.some((s) => s.date === newSlot.date && s.time === newSlot.time)) {
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
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedData = new FormData();

      if (bio && bio !== mentorData.bio) updatedData.append("bio", bio);
      if (JSON.stringify(skills) !== JSON.stringify(mentorData.skills))
        updatedData.append("skills", JSON.stringify(skills));
      if (JSON.stringify(slots) !== JSON.stringify(mentorData.availableSlots))
        updatedData.append("availableSlots", JSON.stringify(slots));
      if (backendImage) updatedData.append("profileImage", backendImage);

      if ([...updatedData.keys()].length === 0) {
        alert("No changes detected!");
        return;
      }

      const result = await axios.put(
        `${import.meta.env.VITE_API_URL}/mentor/update-mentor-data`,
        updatedData,
        { withCredentials: true }
      );

      dispatch(setMentorData(result.data.mentor));
      alert("Profile updated successfully ✅");
      setActiveTab("profile");
    } catch (error) {
      console.error("Submit error:", error?.response?.data || error.message);
      alert("Error updating profile");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 w-full">
      <div className="flex flex-col items-center p-6 sm:p-10 mt-20 gap-10">
        {/* Header */}
        <div className="text-center max-w-3xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-2xl mb-4 shadow-lg">
            <CgFileDocument size={32} className="text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Edit Your Profile
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Update your mentor profile to help students connect with you and understand your expertise better.
          </p>
        </div>

        {/* Profile Form */}
        <div className="space-y-8 flex flex-col items-center bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-10 md:p-12 w-full max-w-6xl mx-auto">
          {/* Profile Photo */}
          <div className="w-full space-y-6">
            <h3 className="flex items-center gap-3 text-xl font-bold text-gray-800 pb-2 border-b border-gray-100">
              <div className="p-2 bg-gradient-to-r from-violet-100 to-indigo-100 rounded-lg">
                <IoPersonOutline className="text-violet-600" size={20} />
              </div>
              Profile Photo
            </h3>

            <div className="flex flex-col items-center gap-6">
              <div className="relative group">
                {frontendImage ? (
                  <img
                    src={frontendImage}
                    alt="Profile"
                    className="h-40 w-40 rounded-full object-cover shadow-2xl ring-4 ring-white ring-offset-4 ring-offset-violet-100 group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="h-40 w-40 rounded-full bg-gray-200 flex items-center justify-center">
                    <MdOutlineCameraAlt size={48} className="text-gray-500" />
                  </div>
                )}
              </div>

              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImage}
                />
                <button className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-semibold rounded-2xl shadow-lg hover:from-violet-600 hover:to-indigo-600 transition-all duration-200">
                  <MdOutlineCameraAlt size={20} />
                  Choose Photo
                </button>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="w-full space-y-4">
            <h3 className="flex items-center gap-3 text-xl font-bold text-gray-800 pb-2 border-b border-gray-100">
              <div className="p-2 bg-gradient-to-r from-violet-100 to-indigo-100 rounded-lg">
                <CgFileDocument className="text-violet-600" size={20} />
              </div>
              About You
            </h3>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about your experience..."
              className="border-2 border-gray-200 rounded-2xl p-6 w-full outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 h-40 shadow-sm resize-none bg-gray-50 text-gray-700"
              maxLength={500}
            />
            <div className="text-sm text-gray-400 text-right">{bio.length}/500</div>
          </div>

          {/* Skills */}
          <div className="w-full space-y-4">
            <h3 className="flex items-center gap-3 text-xl font-bold text-gray-800 pb-2 border-b border-gray-100">
              <div className="p-2 bg-gradient-to-r from-violet-100 to-indigo-100 rounded-lg">
                <HiOutlineLightBulb className="text-violet-600" size={20} />
              </div>
              Skills & Expertise
            </h3>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Enter skill"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleInputKeyDown}
                className="border-2 border-gray-200 rounded-2xl p-4 w-full outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-xl hover:shadow-2xl font-bold flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base min-w-[120px] sm:min-w-[140px] whitespace-nowrap"
              >
                <FaPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Add Skill</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-3 mt-4">
              {skills.length > 0 ? (
                skills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-2 bg-indigo-50 text-indigo-700 font-semibold rounded-full px-5 py-2"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-red-400 hover:text-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center w-full">No skills added yet</p>
              )}
            </div>
          </div>

          {/* Available Slots */}
          <div className="w-full space-y-4">
            <h3 className="flex items-center gap-3 text-xl font-bold text-gray-800 pb-2 border-b border-gray-100">
              <div className="p-2 bg-gradient-to-r from-violet-100 to-indigo-100 rounded-lg">
                <BsCalendar3 className="text-violet-600" size={20} />
              </div>
              Available Time Slots
            </h3>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border-2 border-gray-200 rounded-2xl p-4 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="border-2 border-gray-200 rounded-2xl p-4 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
              <button
                type="button"
                onClick={handleAddSlot}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                <FaPlus className="w-5 h-5" />
                <span>Add Slot</span>
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {slots.map((slot, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-indigo-50 text-indigo-700 rounded-2xl px-6 py-4"
                >
                  <div>
                    <div className="font-semibold">{slot.date}</div>
                    <div className="text-sm">{slot.time}</div>
                  </div>
                  <button
                    onClick={() => handleRemoveSlot(i)}
                    className="text-red-400 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSubmit}
            className="mt-10 bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-bold rounded-2xl px-12 py-4 shadow-xl hover:scale-105 transition-all"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMentorData;
