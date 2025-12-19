
// import React, { useState, useEffect } from "react";
// import {
//   User,
//   Camera,
//   FileText,
//   Lightbulb,
//   Plus,
//   Calendar,
//   Save,
//   X,
// } from "lucide-react";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { setMentorData } from "../redux/mentorSlice";
// import useGetMentorData from "../hooks/useGetMentorData";

// const EditMentorData = ({ activeTab, setActiveTab }) => {
//   const dispatch = useDispatch();
//   useGetMentorData();

//   const mentorData = useSelector((state) => state.mentor.mentorData);
//   const token = localStorage.getItem("token");

//   const getProfileImageSrc = (profileImage) => {
//     if (!profileImage) return null;
//     if (/^https?:\/\//i.test(profileImage)) return profileImage;
//     const base = (import.meta.env.VITE_IMAGE_URL || "").replace(/\/$/, "");
//     return `${base}/${profileImage.replace(/\\/g, "/").replace(/^\//, "")}`;
//   };

//   const [bio, setBio] = useState("");
//   const [skills, setSkills] = useState([]);
//   const [slots, setSlots] = useState([]);
//   const [backendImage, setBackendImage] = useState(null);
//   const [frontendImage, setFrontendImage] = useState(null);
//   const [skillInput, setSkillInput] = useState("");
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");

//   useEffect(() => {
//     if (mentorData) {
//       setBio(mentorData.bio || "");
//       setSkills(mentorData.skills || []);
//       setSlots(mentorData.availableSlots || []);

//       if (mentorData.profileImage) {
//         setFrontendImage(getProfileImageSrc(mentorData.profileImage));
//       }
//     }
//   }, [mentorData]);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setBackendImage(file);
//     setFrontendImage(URL.createObjectURL(file));
//   };

//   const handleAddSkill = () => {
//     if (!skillInput.trim()) return;
//     if (skills.includes(skillInput.trim())) return;
//     setSkills([...skills, skillInput.trim()]);
//     setSkillInput("");
//   };

//   const handleInputKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleAddSkill();
//     }
//   };

//   const removeSkill = (i) => {
//     setSkills(skills.filter((_, idx) => idx !== i));
//   };

//   const handleAddSlot = () => {
//     if (!date || !time) return;
//     const newSlot = { date, time };
//     if (slots.some((s) => s.date === newSlot.date && s.time === newSlot.time)) return;
//     setSlots([...slots, newSlot]);
//     setDate("");
//     setTime("");
//   };

//   const removeSlot = (i) => {
//     setSlots(slots.filter((_, idx) => idx !== i));
//   };

//   const handleSave = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("bio", bio);
//       formData.append("skills", JSON.stringify(skills));
//       formData.append("availableSlots", JSON.stringify(slots));

//       if (backendImage) {
//         formData.append("profileImage", backendImage);
//       }
//       const token = localStorage.getItem("token");
//       const { data } = await axios.put(
//         `${import.meta.env.VITE_API_URL}/mentor/update-mentor-data`,
//         formData,
//        {withCredentials : true}
//       );

//       dispatch(setMentorData(data.mentor));
//       alert("Profile updated successfully!");
//       setActiveTab("profile");
//     } catch (error) {
//       console.error(error);
//       alert("Failed to update mentor profile");
//     }
//   };

//   return (
//     <div className="w-full">
//       {/* grid: note the 'isolate' to prevent backdrop-bleed between columns */}
//       <div className="grid lg:grid-cols-2 lg:gap-x-10 gap-y-10 isolate">

//         {/* Left Column */}
//         <div className="space-y-10">

//           {/* Profile Photo Card */}
//           <div
//             className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 overflow-hidden"
//             // inline styles to force a new stacking context and remove seams
//             style={{ isolation: "isolate" }}
//           >
//             <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
//               <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
//                 <User className="w-5 h-5 text-cyan-400" />
//               </div>
//               <h3 className="text-xl font-bold text-white">Profile Photo</h3>
//             </div>

//             <div className="flex flex-col items-center gap-5">
//               <div className="relative group">
//                 {frontendImage ? (
//                   <div className="relative">
//                     <img
//                       src={frontendImage}
//                       alt="Profile"
//                       className="h-32 w-32 lg:h-40 lg:w-40 rounded-full object-cover shadow-2xl ring-4 ring-cyan-500/30 group-hover:scale-105 transition-transform duration-300"
//                     />
//                     <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
//                   </div>
//                 ) : (
//                   <div className="h-32 w-32 lg:h-40 lg:w-40 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center transition-all duration-300 shadow-xl ring-4 ring-slate-700 border border-slate-700">
//                     <Camera className="w-12 h-12 lg:w-16 lg:h-16 text-slate-500" />
//                   </div>
//                 )}
//                 <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform duration-200">
//                   <Camera className="w-5 h-5 text-white" />
//                   <input
//                     type="file"
//                     className="hidden"
//                     accept="image/*"
//                     onChange={handleImageChange}
//                   />
//                 </label>
//               </div>
//               <p className="text-xs text-slate-500 text-center">
//                 Click the camera icon to upload<br />JPG, PNG - Max 5MB
//               </p>
//             </div>
//           </div>

//           {/* Skills Card */}
//           <div
//             className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 overflow-hidden"
//             style={{ isolation: "isolate" }}
//           >
//             <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
//               <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
//                 <Lightbulb className="w-5 h-5 text-cyan-400" />
//               </div>
//               <h3 className="text-xl font-bold text-white">Skills & Expertise</h3>
//             </div>

//             <div className="flex gap-2 mb-4">
//               <input
//                 type="text"
//                 placeholder="e.g., React, Node.js..."
//                 value={skillInput}
//                 onChange={(e) => setSkillInput(e.target.value)}
//                 onKeyDown={handleInputKeyDown}
//                 className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-3 flex-1 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent shadow-sm text-white placeholder-slate-500 transition-all duration-300"
//               />
//               <button
//                 type="button"
//                 onClick={handleAddSkill}
//                 className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl px-5 py-3 flex items-center justify-center gap-2 shadow-lg font-semibold hover:scale-105 transition duration-300 cursor-pointer"
//               >
//                 <Plus className="w-4 h-4" /> Add
//               </button>
//             </div>

//             <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
//               {skills.length > 0 ? (
//                 skills.map((skill, i) => (
//                   <div
//                     key={i}
//                     className="flex items-center gap-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full px-4 py-2 shadow-sm border border-cyan-500/30 transition-all duration-300"
//                   >
//                     <span className="text-sm text-white">{skill}</span>
//                     <button
//                       onClick={() => removeSkill(i)}
//                       className="text-red-400 hover:text-red-300 cursor-pointer"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ))
//               ) : (
//                 <div className="w-full text-center py-6 text-slate-500 bg-slate-800/30 rounded-xl border-2 border-dashed border-slate-700">
//                   <Lightbulb className="w-10 h-10 text-slate-600 mx-auto mb-2" />
//                   <p className="text-sm">No skills added yet</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Right Column */}
//         <div className="space-y-10">

//           {/* Bio Card */}
//           <div
//             className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 overflow-hidden"
//             style={{ isolation: "isolate" }}
//           >
//             <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
//               <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
//                 <FileText className="w-5 h-5 text-cyan-400" />
//               </div>
//               <h3 className="text-xl font-bold text-white">About You</h3>
//             </div>

//             <div className="relative">
//               <textarea
//                 value={bio}
//                 onChange={(e) => setBio(e.target.value)}
//                 placeholder="Share your experience..."
//                 className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-4 w-full outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent h-40 lg:h-48 shadow-sm resize-none text-white placeholder-slate-500 transition-all duration-300"
//                 maxLength={500}
//               />
//               <div className="absolute bottom-3 right-3 text-xs text-slate-500 font-medium">
//                 {bio.length}/500
//               </div>
//             </div>
//           </div>

//           {/* Time Slots Card */}
//           <div
//             className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 overflow-hidden"
//             style={{ isolation: "isolate" }}
//           >
//             <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
//               <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
//                 <Calendar className="w-5 h-5 text-cyan-400" />
//               </div>
//               <h3 className="text-xl font-bold text-white">Available Time Slots</h3>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
//               <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-cyan-500 text-white"
//               />
//               <input
//                 type="time"
//                 value={time}
//                 onChange={(e) => setTime(e.target.value)}
//                 className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-cyan-500 text-white"
//               />
//             </div>

//             <button
//               type="button"
//               onClick={handleAddSlot}
//               className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl px-5 py-3 flex items-center justify-center gap-2 shadow-lg font-semibold hover:scale-[1.02] transition duration-300 mb-4 cursor-pointer"
//             >
//               <Plus className="w-4 h-4" /> Add Time Slot
//             </button>

//             <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
//               {slots.length > 0 ? (
//                 slots.map((slot, i) => (
//                   <div
//                     key={i}
//                     className="flex items-center justify-between bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl px-4 py-3 shadow-sm border border-cyan-500/30 transition"
//                   >
//                     <div className="flex items-center gap-3">
//                       <Calendar className="w-4 h-4 text-cyan-400" />
//                       <div>
//                         <div className="font-semibold text-white text-sm">
//                           {new Date(slot.date).toLocaleDateString("en-US", {
//                             month: "short",
//                             day: "numeric",
//                             year: "numeric",
//                           })}
//                         </div>
//                         <div className="text-xs text-cyan-400">{slot.time}</div>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => removeSlot(i)}
//                       className="text-red-400 hover:text-red-300 cursor-pointer"
//                     >
//                       <X className="w-5 h-5" />
//                     </button>
//                   </div>
//                 ))
//               ) : (
//                 <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center text-slate-500 bg-slate-800/30">
//                   <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
//                   <p className="text-sm">No time slots added yet</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Save Button */}
//       <div className="mt-8">
//         <button
//           onClick={handleSave}
//           className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl px-8 py-5 shadow-xl text-lg flex items-center justify-center gap-3 hover:scale-[1.01] transition cursor-pointer"
//         >
//           <Save className="w-6 h-6" />
//           Save Profile Changes
//         </button>
//         <p className="text-center text-sm text-slate-500 mt-4">
//           Your changes will be visible to all mentees
//         </p>
//       </div>

//       <style>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 6px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: rgb(51 65 85 / 0.3);
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: rgb(6 182 212 / 0.3);
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: rgb(6 182 212 / 0.5);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default EditMentorData;






// import React, { useState, useEffect } from "react";
// import {
//   User,
//   Camera,
//   FileText,
//   Lightbulb,
//   Plus,
//   Calendar,
//   Save,
//   X,
// } from "lucide-react";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { setMentorData } from "../redux/mentorSlice";
// import useGetMentorData from "../hooks/useGetMentorData";
// import toast from 'react-hot-toast'; // Import toast

// const EditMentorData = ({ activeTab, setActiveTab }) => {
//   const dispatch = useDispatch();
//   // NOTE: Assuming the hook fetches mentor data and updates Redux
//   useGetMentorData(); 

//   // NOTE: Assuming redux dependencies resolve correctly in the user's project
//   const mentorData = useSelector((state) => state.mentor.mentorData);

//   const getProfileImageSrc = (profileImage) => {
//     if (!profileImage) return null;
//     if (/^https?:\/\//i.test(profileImage)) return profileImage;
//     const base = (import.meta.env.VITE_IMAGE_URL || "").replace(/\/$/, "");
//     return `${base}/${profileImage.replace(/\\/g, "/").replace(/^\//, "")}`;
//   };

//   const [bio, setBio] = useState("");
//   const [skills, setSkills] = useState([]);
//   const [slots, setSlots] = useState([]);
//   const [backendImage, setBackendImage] = useState(null);
//   const [frontendImage, setFrontendImage] = useState(null);
//   const [skillInput, setSkillInput] = useState("");
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [isSaving, setIsSaving] = useState(false);

//   useEffect(() => {
//     if (mentorData) {
//       setBio(mentorData.bio || "");
//       setSkills(mentorData.skills || []);
//       setSlots(mentorData.availableSlots || []);

//       if (mentorData.profileImage) {
//         setFrontendImage(getProfileImageSrc(mentorData.profileImage));
//       }
//     }
//   }, [mentorData]);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const maxFileSize = 5 * 1024 * 1024; // 5MB
//     if (file.size > maxFileSize) {
//       toast.error("Image file size must be less than 5MB.");
//       e.target.value = null;
//       return;
//     }

//     const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
//     if (!validTypes.includes(file.type)) {
//       toast.error("Only JPG, JPEG, and PNG formats are supported.");
//       e.target.value = null;
//       return;
//     }

//     setBackendImage(file);
//     setFrontendImage(URL.createObjectURL(file));
//     toast.success("Profile image selected.");
//   };

//   const handleAddSkill = () => {
//     const trimmed = skillInput.trim();
//     if (!trimmed) {
//       toast.error("Skill cannot be empty.");
//       return;
//     }
//     if (skills.includes(trimmed)) {
//       toast.error(`Skill "${trimmed}" is already added.`);
//       return;
//     }
//     setSkills([...skills, trimmed]);
//     setSkillInput("");
//   };

//   const handleInputKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleAddSkill();
//     }
//   };

//   const removeSkill = (i) => {
//     setSkills(skills.filter((_, idx) => idx !== i));
//   };

//   const handleAddSlot = () => {
//     if (!date || !time) {
//       toast.error("Please select both date and time.");
//       return;
//     }
//     const newSlot = { date, time };
//     if (slots.some((s) => s.date === newSlot.date && s.time === newSlot.time)) {
//       toast.error("This time slot is already added.");
//       return;
//     }
//     setSlots([...slots, newSlot]);
//     setDate("");
//     setTime("");
//   };

//   const removeSlot = (i) => {
//     setSlots(slots.filter((_, idx) => idx !== i));
//   };

//   const handleSave = async () => {
//     setIsSaving(true);
//     
//     const formData = new FormData();
//     formData.append("bio", bio);
//     formData.append("skills", JSON.stringify(skills));
//     formData.append("availableSlots", JSON.stringify(slots));

//     if (backendImage) {
//       formData.append("profileImage", backendImage);
//     }

//     const updatePromise = axios.put(
//       `${import.meta.env.VITE_API_URL}/mentor/update-mentor-data`,
//       formData,
//      {
//         withCredentials : true,
//         headers: { "Content-Type": "multipart/form-data" }
//      }
//     );

//     toast.promise(updatePromise, {
//       loading: 'Saving profile updates...',
//       success: (response) => {
//         dispatch(setMentorData(response.data.mentor));
//         setIsSaving(false);
//         // Switch to profile view after successful save
//         setActiveTab("profile"); 
//         return "Profile updated successfully!";
//       },
//       error: (error) => {
//         setIsSaving(false);
//         console.error("Update failed:", error);
//         return error.response?.data?.message || "Failed to update mentor profile.";
//       }
//     });
//   };

//   return (
//     <div className="w-full">
//       {/* grid: note the 'isolate' to prevent backdrop-bleed between columns */}
//       <div className="grid lg:grid-cols-2 lg:gap-x-10 gap-y-10 isolate">

//         {/* Left Column */}
//         <div className="space-y-10">

//           {/* Profile Photo Card */}
//           <div
//             className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 overflow-hidden"
//             // inline styles to force a new stacking context and remove seams
//             style={{ isolation: "isolate" }}
//           >
//             <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
//               <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
//                 <User className="w-5 h-5 text-cyan-400" />
//               </div>
//               <h3 className="text-xl font-bold text-white">Profile Photo</h3>
//             </div>

//             <div className="flex flex-col items-center gap-5">
//               <div className="relative group">
//                 {frontendImage ? (
//                   <div className="relative">
//                     <img
//                       src={frontendImage}
//                       alt="Profile"
//                       className="h-32 w-32 lg:h-40 lg:w-40 rounded-full object-cover shadow-2xl ring-4 ring-cyan-500/30 group-hover:scale-105 transition-transform duration-300"
//                     />
//                     <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
//                   </div>
//                 ) : (
//                   <div className="h-32 w-32 lg:h-40 lg:w-40 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center transition-all duration-300 shadow-xl ring-4 ring-slate-700 border border-slate-700">
//                     <Camera className="w-12 h-12 lg:w-16 lg:h-16 text-slate-500" />
//                   </div>
//                 )}
//                 <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform duration-200">
//                   <Camera className="w-5 h-5 text-white" />
//                   <input
//                     type="file"
//                     className="hidden"
//                     accept="image/*"
//                     onChange={handleImageChange}
//                   />
//                 </label>
//               </div>
//               <p className="text-xs text-slate-500 text-center">
//                 Click the camera icon to upload<br />JPG, PNG - Max 5MB
//               </p>
//             </div>
//           </div>

//           {/* Skills Card */}
//           <div
//             className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 overflow-hidden"
//             style={{ isolation: "isolate" }}
//           >
//             <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
//               <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
//                 <Lightbulb className="w-5 h-5 text-cyan-400" />
//               </div>
//               <h3 className="text-xl font-bold text-white">Skills & Expertise</h3>
//             </div>

//             <div className="flex gap-2 mb-4">
//               <input
//                 type="text"
//                 placeholder="e.g., React, Node.js..."
//                 value={skillInput}
//                 onChange={(e) => setSkillInput(e.target.value)}
//                 onKeyDown={handleInputKeyDown}
//                 className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-3 flex-1 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent shadow-sm text-white placeholder-slate-500 transition-all duration-300"
//                 disabled={isSaving}
//               />
//               <button
//                 type="button"
//                 onClick={handleAddSkill}
//                 className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl px-5 py-3 flex items-center justify-center gap-2 shadow-lg font-semibold hover:scale-105 transition duration-300 cursor-pointer disabled:opacity-50"
//                 disabled={isSaving}
//               >
//                 <Plus className="w-4 h-4" /> Add
//               </button>
//             </div>

//             <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
//               {skills.length > 0 ? (
//                 skills.map((skill, i) => (
//                   <div
//                     key={i}
//                     className="flex items-center gap-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full px-4 py-2 shadow-sm border border-cyan-500/30 transition-all duration-300"
//                   >
//                     <span className="text-sm text-white">{skill}</span>
//                     <button
//                       onClick={() => removeSkill(i)}
//                       className="text-red-400 hover:text-red-300 cursor-pointer"
//                       disabled={isSaving}
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ))
//               ) : (
//                 <div className="w-full text-center py-6 text-slate-500 bg-slate-800/30 rounded-xl border-2 border-dashed border-slate-700">
//                   <Lightbulb className="w-10 h-10 text-slate-600 mx-auto mb-2" />
//                   <p className="text-sm">No skills added yet</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Right Column */}
//         <div className="space-y-10">

//           {/* Bio Card */}
//           <div
//             className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 overflow-hidden"
//             style={{ isolation: "isolate" }}
//           >
//             <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
//               <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
//                 <FileText className="w-5 h-5 text-cyan-400" />
//               </div>
//               <h3 className="text-xl font-bold text-white">About You</h3>
//             </div>

//             <div className="relative">
//               <textarea
//                 value={bio}
//                 onChange={(e) => setBio(e.target.value)}
//                 placeholder="Share your experience..."
//                 className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-4 w-full outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent h-40 lg:h-48 shadow-sm resize-none text-white placeholder-slate-500 transition-all duration-300"
//                 maxLength={500}
//                 disabled={isSaving}
//               />
//               <div className="absolute bottom-3 right-3 text-xs text-slate-500 font-medium">
//                 {bio.length}/500
//               </div>
//             </div>
//           </div>

//           {/* Time Slots Card */}
//           <div
//             className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 overflow-hidden"
//             style={{ isolation: "isolate" }}
//           >
//             <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
//               <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
//                 <Calendar className="w-5 h-5 text-cyan-400" />
//               </div>
//               <h3 className="text-xl font-bold text-white">Available Time Slots</h3>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
//               <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-cyan-500 text-white"
//                 disabled={isSaving}
//               />
//               <input
//                 type="time"
//                 value={time}
//                 onChange={(e) => setTime(e.target.value)}
//                 className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-cyan-500 text-white"
//                 disabled={isSaving}
//               />
//             </div>

//             <button
//               type="button"
//               onClick={handleAddSlot}
//               className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl px-5 py-3 flex items-center justify-center gap-2 shadow-lg font-semibold hover:scale-[1.02] transition duration-300 mb-4 cursor-pointer disabled:opacity-50"
//               disabled={isSaving}
//             >
//               <Plus className="w-4 h-4" /> Add Time Slot
//             </button>

//             <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
//               {slots.length > 0 ? (
//                 slots.map((slot, i) => (
//                   <div
//                     key={i}
//                     className="flex items-center justify-between bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl px-4 py-3 shadow-sm border border-cyan-500/30 transition"
//                   >
//                     <div className="flex items-center gap-3">
//                       <Calendar className="w-4 h-4 text-cyan-400" />
//                       <div>
//                         <div className="font-semibold text-white text-sm">
//                           {new Date(slot.date).toLocaleDateString("en-US", {
//                             month: "short",
//                             day: "numeric",
//                             year: "numeric",
//                           })}
//                         </div>
//                         <div className="text-xs text-cyan-400">{slot.time}</div>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => removeSlot(i)}
//                       className="text-red-400 hover:text-red-300 cursor-pointer"
//                       disabled={isSaving}
//                     >
//                       <X className="w-5 h-5" />
//                     </button>
//                   </div>
//                 ))
//               ) : (
//                 <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center text-slate-500 bg-slate-800/30">
//                   <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
//                   <p className="text-sm">No time slots added yet</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Save Button */}
//       <div className="mt-8">
//         <button
//           onClick={handleSave}
//           disabled={isSaving}
//           className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl px-8 py-5 shadow-xl text-lg flex items-center justify-center gap-3 hover:scale-[1.01] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {isSaving ? (
//             <span className="flex items-center justify-center gap-2">
//               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//               Saving Changes...
//             </span>
//           ) : (
//             <>
//               <Save className="w-6 h-6" />
//               Save Profile Changes
//             </>
//           )}
//         </button>
//         <p className="text-center text-sm text-slate-500 mt-4">
//           Your changes will be visible to all mentees
//         </p>
//       </div>

//       <style>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 6px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: rgb(51 65 85 / 0.3);
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: rgb(6 182 212 / 0.3);
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: rgb(6 182 212 / 0.5);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default EditMentorData;




import React, { useState, useEffect } from "react";
import {
  User,
  Camera,
  FileText,
  Lightbulb,
  Plus,
  Calendar,
  Save,
  X,
} from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMentorData } from "../redux/mentorSlice";
import useGetMentorData from "../hooks/useGetMentorData";
import toast from 'react-hot-toast'; // Import toast

const EditMentorData = ({ activeTab, setActiveTab }) => {
  const dispatch = useDispatch();
  useGetMentorData();

  const mentorData = useSelector((state) => state.mentor.mentorData);
  const token = localStorage.getItem("token");

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
  const [isSaving, setIsSaving] = useState(false);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxFileSize) {
      toast.error("Image file size must be less than 5MB.");
      e.target.value = null;
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPG, JPEG, and PNG formats are supported.");
      e.target.value = null;
      return;
    }

    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
    toast.success("Profile image selected.");
  };

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) {
      toast.error("Skill cannot be empty.");
      return;
    }
    if (skills.includes(trimmed)) {
      toast.error(`Skill "${trimmed}" is already added.`);
      return;
    }
    setSkills([...skills, trimmed]);
    setSkillInput("");
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const removeSkill = (i) => {
    setSkills(skills.filter((_, idx) => idx !== i));
  };

  const handleAddSlot = () => {
    if (!date || !time) {
      toast.error("Please select both date and time.");
      return;
    }
    const newSlot = { date, time };
    if (slots.some((s) => s.date === newSlot.date && s.time === newSlot.time)) {
      toast.error("This time slot is already added.");
      return;
    }
    setSlots([...slots, newSlot]);
    setDate("");
    setTime("");
  };

  const removeSlot = (i) => {
    setSlots(slots.filter((_, idx) => idx !== i));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    const formData = new FormData();
    formData.append("bio", bio);
    formData.append("skills", JSON.stringify(skills));
    formData.append("availableSlots", JSON.stringify(slots));

    if (backendImage) {
      formData.append("profileImage", backendImage);
    }

    const updatePromise = axios.put(
      `${import.meta.env.VITE_API_URL}/mentor/update-mentor-data`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      }
    );

    toast.promise(updatePromise, {
      loading: 'Saving profile updates...',
      success: (response) => {
        dispatch(setMentorData(response.data.mentor));
        setIsSaving(false);
        setActiveTab("profile");
        return "Profile updated successfully!";
      },
      error: (error) => {
        setIsSaving(false);
        console.error("Update failed:", error);
        return error.response?.data?.message || "Failed to update mentor profile.";
      }
    });
  };

  return (
    <div className="w-full">
      {/* grid: note the 'isolate' to prevent backdrop-bleed between columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10 gap-y-10 isolate max-w-full overflow-x-hidden">

        {/* Left Column */}
        <div className="space-y-10">

          {/* Profile Photo Card */}
          <div
            className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 overflow-hidden"
            // inline styles to force a new stacking context and remove seams
            style={{ isolation: "isolate" }}
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
                <User className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Profile Photo</h3>
            </div>

            <div className="flex flex-col items-center gap-5">
              <div className="relative group">
                {frontendImage ? (
                  <div className="relative">
                    <img
                      src={frontendImage}
                      alt="Profile"
                      className="h-32 w-32 lg:h-40 lg:w-40 rounded-full object-cover shadow-2xl ring-4 ring-cyan-500/30 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                  </div>
                ) : (
                  <div className="h-32 w-32 lg:h-40 lg:w-40 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center transition-all duration-300 shadow-xl ring-4 ring-slate-700 border border-slate-700">
                    <Camera className="w-12 h-12 lg:w-16 lg:h-16 text-slate-500" />
                  </div>
                )}
                <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform duration-200">
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <p className="text-xs text-slate-500 text-center">
                Click the camera icon to upload<br />JPG, PNG - Max 5MB
              </p>
            </div>
          </div>

          {/* Skills Card */}
          <div
            className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 overflow-hidden"
            style={{ isolation: "isolate" }}
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
                <Lightbulb className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Skills & Expertise</h3>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="e.g., React, Node.js..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleInputKeyDown}
                className="bg-slate-800/50 border-2 border-slate-700 w-full max-w-full min-w-0
 rounded-xl p-3 flex-1 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent shadow-sm text-white placeholder-slate-500 transition-all duration-300"
                disabled={isSaving}
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl px-5 py-3 flex items-center justify-center gap-2 shadow-lg font-semibold hover:scale-105 transition duration-300 cursor-pointer disabled:opacity-50"
                disabled={isSaving}
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
              {skills.length > 0 ? (
                skills.map((skill, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full px-4 py-2 shadow-sm border border-cyan-500/30 transition-all duration-300"
                  >
                    <span className="text-sm text-white">{skill}</span>
                    <button
                      onClick={() => removeSkill(i)}
                      className="text-red-400 hover:text-red-300 cursor-pointer"
                      disabled={isSaving}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-6 text-slate-500 bg-slate-800/30 rounded-xl border-2 border-dashed border-slate-700">
                  <Lightbulb className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm">No skills added yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-10">

          {/* Bio Card */}
          <div
            className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 overflow-hidden"
            style={{ isolation: "isolate" }}
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
                <FileText className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white">About You</h3>
            </div>

            <div className="relative">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your experience..."
                className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-4 w-full outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent h-40 lg:h-48 shadow-sm resize-none text-white placeholder-slate-500 transition-all duration-300"
                maxLength={500}
                disabled={isSaving}
              />
              <div className="absolute bottom-3 right-3 text-xs text-slate-500 font-medium">
                {bio.length}/500
              </div>
            </div>
          </div>

          {/* Time Slots Card */}
          <div
            className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 overflow-hidden"
            style={{ isolation: "isolate" }}
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
                <Calendar className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Available Time Slots</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                disabled={isSaving}
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                disabled={isSaving}
              />
            </div>

            <button
              type="button"
              onClick={handleAddSlot}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl px-5 py-3 flex items-center justify-center gap-2 shadow-lg font-semibold hover:scale-[1.02] transition duration-300 mb-4 cursor-pointer disabled:opacity-50"
              disabled={isSaving}
            >
              <Plus className="w-4 h-4" /> Add Time Slot
            </button>

            <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
              {slots.length > 0 ? (
                slots.map((slot, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl px-4 py-3 shadow-sm border border-cyan-500/30 transition"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      <div>
                        <div className="font-semibold text-white text-sm">
                          {new Date(slot.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-xs text-cyan-400">{slot.time}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeSlot(i)}
                      className="text-red-400 hover:text-red-300 cursor-pointer"
                      disabled={isSaving}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center text-slate-500 bg-slate-800/30">
                  <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm">No time slots added yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl px-8 py-5 shadow-xl text-lg flex items-center justify-center gap-3 hover:scale-[1.01] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Saving Changes...
            </span>
          ) : (
            <>
              <Save className="w-6 h-6" />
              Save Profile Changes
            </>
          )}
        </button>
        <p className="text-center text-sm text-slate-500 mt-4">
          Your changes will be visible to all mentees
        </p>
      </div>

      <style>{`
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

export default EditMentorData;