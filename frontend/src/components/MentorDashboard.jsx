

// import React, { useState, useEffect } from "react";
// import Nav from "./Nav.jsx";
// import { User, Camera, FileText, Lightbulb, Plus, Calendar, DollarSign, Check } from "lucide-react";
// import MentorComponent from "./MentorComponent.jsx";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { setMentorData } from "../redux/mentorSlice.js";
// import useGetMentorData from "../hooks/useGetMentorData.jsx";
// import Footer from "./Footer.jsx";

// function MentorDashboard() {
//   const [skillInput, setSkillInput] = useState("");
//   const [skills, setSkills] = useState([]);
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [slots, setSlots] = useState([]);
//   const [backendImage, setBackendImage] = useState(null);
//   const [frontendImage, setFrontendImage] = useState(null);
//   const [bio, setBio] = useState("");
//   const [fee, setFee] = useState("");
//   const [sendEmail, setSendEmail] = useState(null);

//   const dispatch = useDispatch();
//   useGetMentorData();
//   const mentorData = useSelector((state) => state.mentor.mentorData);

//   useEffect(() => {
//     if (mentorData?.user?.email) {
//       setSendEmail(mentorData.user.email);
//     }
//   }, [mentorData]);

//   const handleAddSkill = () => {
//     const trimmed = skillInput.trim();
//     if (trimmed && !skills.includes(trimmed)) {
//       setSkills([...skills, trimmed]);
//       setSkillInput("");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       formData.append("bio", bio);
//       formData.append("skills", JSON.stringify(skills));
//       formData.append("availableSlots", JSON.stringify(slots));
//       formData.append("fee", fee);

//       if (backendImage) {
//         formData.append("profileImage", backendImage);
//       }

//       const result = await axios.post(
//         `${import.meta.env.VITE_API_URL}/mentor/complete-profile`,
//         formData,
//         { withCredentials: true }
//       );

//       dispatch(setMentorData(result.data.mentor));
//     } catch (error) {
//       console.error("Submit error:", error?.response?.data || error.message);
//     }
//   };

//   const handleRemoveSkill = (removeSkill) => {
//     setSkills(skills.filter((skill) => skill !== removeSkill));
//   };

//   const handleInputKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleAddSkill();
//     }
//   };

//   const handleAddSlot = () => {
//     if (!date || !time) return;
//     const newSlot = { date, time };
//     if (!slots.some((s) => s.date === newSlot.date && s.time === newSlot.time)) {
//       setSlots((prev) => [...prev, newSlot]);
//       setDate("");
//       setTime("");
//     }
//   };

//   const handleRemoveSlot = (index) => {
//     setSlots((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleImage = (e) => {
//     const file = e.target.files[0];
//     setBackendImage(file);
//     setFrontendImage(URL.createObjectURL(file));
//   };

//   return (
//     <div className="min-h-screen bg-slate-950 text-white w-full pt-20 relative overflow-hidden">
//       {/* Animated Background */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
//         <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
//         <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '4s'}}></div>
//       </div>

//       <Nav />
//       {!mentorData ? (
//         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
//           {/* Header */}
//           <div className="text-center mb-8 lg:mb-12">
//             <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl mb-6 shadow-xl shadow-purple-500/30">
//               <User className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
//             </div>
//             <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
//               Complete Your Mentor Profile
//             </h1>
//             <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto">
//               Help students connect with you and understand your expertise
//             </p>
//           </div>

//           {/* Two Column Layout for Desktop */}
//           <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
//             {/* Left Column */}
//             <div className="space-y-6">
//               {/* Profile Photo Card */}
//               <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 lg:p-8">
//                 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
//                   <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
//                     <User className="w-5 h-5 text-cyan-400" />
//                   </div>
//                   <h3 className="text-xl font-bold text-white">Profile Photo</h3>
//                 </div>

//                 <div className="flex flex-col items-center gap-5">
//                   <div className="relative group">
//                     {frontendImage ? (
//                       <div className="relative">
//                         <img
//                           src={frontendImage}
//                           alt="Profile"
//                           className="h-32 w-32 lg:h-40 lg:w-40 rounded-full object-cover shadow-2xl ring-4 ring-cyan-500/30"
//                         />
//                         <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
//                       </div>
//                     ) : (
//                       <div className="h-32 w-32 lg:h-40 lg:w-40 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center hover:from-cyan-500/20 hover:to-purple-500/20 transition-all duration-300 shadow-xl ring-4 ring-slate-700 group border border-slate-700">
//                         <Camera className="w-12 h-12 lg:w-16 lg:h-16 text-slate-500 group-hover:text-cyan-400 transition-colors duration-300" />
//                       </div>
//                     )}
//                     <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50">
//                       <Camera className="w-5 h-5 text-white" />
//                     </div>
//                   </div>

//                   <div className="w-full">
//                     <label className="block">
//                       <input
//                         type="file"
//                         accept="image/*"
//                         className="block w-full text-sm text-slate-400
//                           file:mr-4 file:py-2.5 file:px-5
//                           file:rounded-xl file:border-0
//                           file:text-sm file:font-semibold
//                           file:bg-gradient-to-r file:from-cyan-500 file:to-purple-600
//                           file:text-white file:shadow-lg file:shadow-purple-500/30
//                           hover:file:from-cyan-600 hover:file:to-purple-700
//                           file:cursor-pointer file:transition-all file:duration-300
//                           cursor-pointer"
//                         onChange={handleImage}
//                       />
//                     </label>
//                     <p className="text-xs text-slate-500 text-center mt-2">
//                       JPG, PNG - Max 5MB
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Hourly Fee Card */}
//               <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 lg:p-8">
//                 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
//                   <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
//                     <DollarSign className="w-5 h-5 text-cyan-400" />
//                   </div>
//                   <h3 className="text-xl font-bold text-white">Hourly Fee</h3>
//                 </div>
//                 <div className="relative">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
//                     ₹
//                   </div>
//                   <input
//                     type="number"
//                     className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-4 w-full outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent shadow-sm pl-10 pr-20 text-white placeholder-slate-500 transition-all duration-300"
//                     placeholder="Enter your hourly rate"
//                     value={fee}
//                     onChange={(e) => setFee(e.target.value)}
//                     min="0"
//                   />
//                   <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">
//                     /hour
//                   </span>
//                 </div>
//                 <p className="text-sm text-slate-500 mt-3">
//                   Set a competitive rate based on your experience
//                 </p>
//               </div>

//               {/* Skills Card */}
//               <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 lg:p-8">
//                 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
//                   <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
//                     <Lightbulb className="w-5 h-5 text-cyan-400" />
//                   </div>
//                   <h3 className="text-xl font-bold text-white">Skills & Expertise</h3>
//                 </div>
                
//                 <div className="flex gap-2 mb-4">
//                   <input
//                     type="text"
//                     className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-3 flex-1 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent shadow-sm text-white placeholder-slate-500 transition-all duration-300"
//                     placeholder="e.g., React, Node.js..."
//                     value={skillInput}
//                     onChange={(e) => setSkillInput(e.target.value)}
//                     onKeyDown={handleInputKeyDown}
//                   />
//                   <button
//                     type="button"
//                     className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-xl px-5 py-3 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50 transition-all duration-300 font-semibold whitespace-nowrap cursor-pointer"
//                     onClick={handleAddSkill}
//                   >
//                     <Plus className="w-4 h-4" /> Add
//                   </button>
//                 </div>

//                 {skills.length > 0 ? (
//                   <div className="flex flex-wrap gap-2">
//                     {skills.map((skill) => (
//                       <div
//                         key={skill}
//                         className="group flex items-center bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 text-cyan-400 font-semibold rounded-full px-4 py-2 shadow-sm border border-cyan-500/30 transition-all duration-300 hover:scale-105"
//                       >
//                         <span className="text-sm">{skill}</span>
//                         <button
//                           type="button"
//                           className="ml-2 text-red-400 hover:text-red-300 font-bold text-lg transition-colors duration-200 cursor-pointer"
//                           onClick={() => handleRemoveSkill(skill)}
//                         >
//                           ×
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center bg-slate-800/30">
//                     <Lightbulb className="w-10 h-10 text-slate-600 mx-auto mb-2" />
//                     <p className="text-slate-500 text-sm">No skills added yet</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Right Column */}
//             <div className="space-y-6">
//               {/* About You Card */}
//               <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 lg:p-8">
//                 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
//                   <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
//                     <FileText className="w-5 h-5 text-cyan-400" />
//                   </div>
//                   <h3 className="text-xl font-bold text-white">About You</h3>
//                 </div>
//                 <div className="relative">
//                   <textarea
//                     name="bio"
//                     placeholder="Share your experience, expertise, and what makes you a great mentor..."
//                     className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-4 w-full outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent h-40 lg:h-48 shadow-sm resize-none text-white placeholder-slate-500 transition-all duration-300"
//                     maxLength={500}
//                     value={bio}
//                     onChange={(e) => setBio(e.target.value)}
//                   ></textarea>
//                   <div className="absolute bottom-3 right-3 text-xs text-slate-500 font-medium">
//                     {bio.length}/500
//                   </div>
//                 </div>
//               </div>

//               {/* Time Slots Card */}
//               <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 lg:p-8">
//                 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
//                   <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
//                     <Calendar className="w-5 h-5 text-cyan-400" />
//                   </div>
//                   <h3 className="text-xl font-bold text-white">Available Time Slots</h3>
//                 </div>
                
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
//                   <input
//                     type="date"
//                     value={date}
//                     onChange={(e) => setDate(e.target.value)}
//                     className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent shadow-sm text-white transition-all duration-300"
//                   />
//                   <input
//                     type="time"
//                     value={time}
//                     onChange={(e) => setTime(e.target.value)}
//                     className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent shadow-sm text-white transition-all duration-300"
//                   />
//                 </div>
//                 <button
//                   type="button"
//                   className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-xl px-5 py-3 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50 transition-all duration-300 font-semibold mb-4 cursor-pointer"
//                   onClick={handleAddSlot}
//                 >
//                   <Plus className="w-4 h-4" /> Add Time Slot
//                 </button>

//                 {slots.length === 0 ? (
//                   <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center bg-slate-800/30">
//                     <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
//                     <p className="text-slate-500 text-sm">No time slots added yet</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
//                     {slots.map((slot, index) => (
//                       <div
//                         key={index}
//                         className="group flex items-center justify-between bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 text-cyan-400 rounded-xl px-4 py-3 shadow-sm border border-cyan-500/30 transition-all duration-300"
//                       >
//                         <div className="flex items-center gap-3">
//                           <Calendar className="w-4 h-4 text-cyan-400" />
//                           <div>
//                             <span className="font-semibold text-white block text-sm">
//                               {new Date(slot.date).toLocaleDateString('en-US', { 
//                                 month: 'short', 
//                                 day: 'numeric',
//                                 year: 'numeric'
//                               })}
//                             </span>
//                             <div className="text-xs text-cyan-400 font-medium">
//                               {slot.time}
//                             </div>
//                           </div>
//                         </div>
//                         <button
//                           type="button"
//                           className="text-red-400 hover:text-red-300 font-bold text-xl transition-colors duration-200 cursor-pointer"
//                           onClick={() => handleRemoveSlot(index)}
//                         >
//                           ×
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Submit Button - Full Width at Bottom */}
//           <div className="mt-8">
//             <button
//               className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold rounded-xl px-8 py-5 shadow-xl hover:shadow-purple-500/50 transition-all duration-300 text-lg transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer"
//               onClick={handleSubmit}
//             >
//               <Check className="w-6 h-6" />
//               Save & Complete Profile
//             </button>
//             <p className="text-center text-sm text-slate-500 mt-4">
//               You can update your profile anytime
//             </p>
//           </div>
//         </div>
//       ) : (
//         <MentorComponent />
//       )}

//       <Footer sendEmail={sendEmail} />

//       <style>{`
//         @keyframes pulse {
//           0%, 100% { opacity: 0.1; }
//           50% { opacity: 0.15; }
//         }
//         .animate-pulse {
//           animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
//         }
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
// }

// export default MentorDashboard;










// import React, { useState, useEffect } from "react";
// import Nav from "./Nav.jsx";
// import { User, Camera, FileText, Lightbulb, Plus, Calendar, DollarSign, Check } from "lucide-react";
// import MentorComponent from "./MentorComponent.jsx";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { setMentorData } from "../redux/mentorSlice.js";
// import useGetMentorData from "../hooks/useGetMentorData.jsx";
// import Footer from "./Footer.jsx";
// import toast from 'react-hot-toast'; // ✅ Import toast

// function MentorDashboard() {
//   const [skillInput, setSkillInput] = useState("");
//   const [skills, setSkills] = useState([]);
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [slots, setSlots] = useState([]);
//   const [backendImage, setBackendImage] = useState(null);
//   const [frontendImage, setFrontendImage] = useState(null);
//   const [bio, setBio] = useState("");
//   const [fee, setFee] = useState("");
//   const [sendEmail, setSendEmail] = useState(null);
//   const [submitting, setSubmitting] = useState(false); // ✅ Add submitting state

//   const dispatch = useDispatch();
//   useGetMentorData();
//   const mentorData = useSelector((state) => state.mentor.mentorData);

//   useEffect(() => {
//     if (mentorData?.user?.email) {
//       setSendEmail(mentorData.user.email);
//     }
//   }, [mentorData]);

//   const handleAddSkill = () => {
//     const trimmed = skillInput.trim();
    
//     if (!trimmed) {
//       toast.error('Please enter a skill'); // ✅ Empty validation
//       return;
//     }
    
//     if (skills.includes(trimmed)) {
//       toast.error('This skill is already added'); // ✅ Duplicate validation
//       return;
//     }
    
//     setSkills([...skills, trimmed]);
//     setSkillInput("");
//     toast.success(`${trimmed} added to your skills! 🎯`, { duration: 2000 }); // ✅ Success toast
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // ✅ Comprehensive validation
//     if (!bio.trim()) {
//       toast.error('Please write something about yourself');
//       return;
//     }
    
//     if (bio.trim().length < 50) {
//       toast.error('Bio should be at least 50 characters');
//       return;
//     }
    
//     if (skills.length === 0) {
//       toast.error('Please add at least one skill');
//       return;
//     }
    
//     if (!fee || parseFloat(fee) <= 0) {
//       toast.error('Please set a valid hourly fee');
//       return;
//     }
    
//     if (slots.length === 0) {
//       toast.error('Please add at least one available time slot');
//       return;
//     }
    
//     if (!backendImage) {
//       toast.error('Please upload a profile photo');
//       return;
//     }

//     setSubmitting(true);
//     const submitToast = toast.loading('Completing your profile...'); // ✅ Loading toast

//     try {
//       const formData = new FormData();
//       formData.append("bio", bio);
//       formData.append("skills", JSON.stringify(skills));
//       formData.append("availableSlots", JSON.stringify(slots));
//       formData.append("fee", fee);

//       if (backendImage) {
//         formData.append("profileImage", backendImage);
//       }

//       const result = await axios.post(
//         `${import.meta.env.VITE_API_URL}/mentor/complete-profile`,
//         formData,
//         { withCredentials: true }
//       );

//       dispatch(setMentorData(result.data.mentor));
      
//       toast.dismiss(submitToast); // ✅ Dismiss loading
//       toast.success('Profile completed successfully! Welcome to the mentor community! 🎉', { // ✅ Success toast
//         duration: 5000,
//       });
//     } catch (error) {
//       console.error("Submit error:", error?.response?.data || error.message);
//       toast.dismiss(submitToast); // ✅ Dismiss loading
      
//       const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to complete profile';
//       toast.error(`Error: ${errorMessage}`); // ✅ Error toast
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleRemoveSkill = (removeSkill) => {
//     setSkills(skills.filter((skill) => skill !== removeSkill));
//     toast.success(`${removeSkill} removed`, { duration: 2000 }); // ✅ Remove toast
//   };

//   const handleInputKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleAddSkill();
//     }
//   };

//   const handleAddSlot = () => {
//     if (!date) {
//       toast.error('Please select a date'); // ✅ Date validation
//       return;
//     }
    
//     if (!time) {
//       toast.error('Please select a time'); // ✅ Time validation
//       return;
//     }

//     // ✅ Check if date is in the past
//     const selectedDate = new Date(date);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     if (selectedDate < today) {
//       toast.error('Cannot add slots for past dates');
//       return;
//     }

//     const newSlot = { date, time };
    
//     if (slots.some((s) => s.date === newSlot.date && s.time === newSlot.time)) {
//       toast.error('This time slot is already added'); // ✅ Duplicate slot validation
//       return;
//     }
    
//     setSlots((prev) => [...prev, newSlot]);
//     setDate("");
//     setTime("");
//     toast.success('Time slot added successfully! 📅', { duration: 2000 }); // ✅ Success toast
//   };

//   const handleRemoveSlot = (index) => {
//     const removedSlot = slots[index];
//     setSlots((prev) => prev.filter((_, i) => i !== index));
//     toast.success('Time slot removed', { duration: 2000 }); // ✅ Remove toast
//   };

//   const handleImage = (e) => {
//     const file = e.target.files[0];
    
//     if (!file) return;
    
//     // ✅ File size validation (5MB)
//     const maxSize = 5 * 1024 * 1024; // 5MB in bytes
//     if (file.size > maxSize) {
//       toast.error('Image size must be less than 5MB');
//       e.target.value = ''; // Clear the input
//       return;
//     }
    
//     // ✅ File type validation
//     const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
//     if (!allowedTypes.includes(file.type)) {
//       toast.error('Only JPG and PNG images are allowed');
//       e.target.value = ''; // Clear the input
//       return;
//     }
    
//     setBackendImage(file);
//     setFrontendImage(URL.createObjectURL(file));
//     toast.success('Profile photo uploaded! 📸', { duration: 2000 }); // ✅ Success toast
//   };

//   return (
//     <div className="min-h-screen bg-slate-950 text-white w-full pt-20 relative overflow-hidden">
//       {/* Animated Background */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
//         <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
//         <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '4s'}}></div>
//       </div>

//       <Nav />
//       {!mentorData ? (
//         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
//           {/* Header */}
//           <div className="text-center mb-8 lg:mb-12">
//             <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl mb-6 shadow-xl shadow-purple-500/30">
//               <User className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
//             </div>
//             <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
//               Complete Your Mentor Profile
//             </h1>
//             <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto">
//               Help students connect with you and understand your expertise
//             </p>
//           </div>

//           {/* Two Column Layout for Desktop */}
//           <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
//             {/* Left Column */}
//             <div className="space-y-6">
//               {/* Profile Photo Card */}
//               <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 lg:p-8">
//                 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
//                   <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
//                     <User className="w-5 h-5 text-cyan-400" />
//                   </div>
//                   <h3 className="text-xl font-bold text-white">Profile Photo</h3>
//                 </div>

//                 <div className="flex flex-col items-center gap-5">
//                   <div className="relative group">
//                     {frontendImage ? (
//                       <div className="relative">
//                         <img
//                           src={frontendImage}
//                           alt="Profile"
//                           className="h-32 w-32 lg:h-40 lg:w-40 rounded-full object-cover shadow-2xl ring-4 ring-cyan-500/30"
//                         />
//                         <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
//                       </div>
//                     ) : (
//                       <div className="h-32 w-32 lg:h-40 lg:w-40 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center hover:from-cyan-500/20 hover:to-purple-500/20 transition-all duration-300 shadow-xl ring-4 ring-slate-700 group border border-slate-700">
//                         <Camera className="w-12 h-12 lg:w-16 lg:h-16 text-slate-500 group-hover:text-cyan-400 transition-colors duration-300" />
//                       </div>
//                     )}
//                     <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50">
//                       <Camera className="w-5 h-5 text-white" />
//                     </div>
//                   </div>

//                   <div className="w-full">
//                     <label className="block">
//                       <input
//                         type="file"
//                         accept="image/*"
//                         className="block w-full text-sm text-slate-400
//                           file:mr-4 file:py-2.5 file:px-5
//                           file:rounded-xl file:border-0
//                           file:text-sm file:font-semibold
//                           file:bg-gradient-to-r file:from-cyan-500 file:to-purple-600
//                           file:text-white file:shadow-lg file:shadow-purple-500/30
//                           hover:file:from-cyan-600 hover:file:to-purple-700
//                           file:cursor-pointer file:transition-all file:duration-300
//                           cursor-pointer"
//                         onChange={handleImage}
//                       />
//                     </label>
//                     <p className="text-xs text-slate-500 text-center mt-2">
//                       JPG, PNG - Max 5MB
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Hourly Fee Card */}
//               <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 lg:p-8">
//                 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
//                   <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
//                     <DollarSign className="w-5 h-5 text-cyan-400" />
//                   </div>
//                   <h3 className="text-xl font-bold text-white">Hourly Fee</h3>
//                 </div>
//                 <div className="relative">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
//                     ₹
//                   </div>
//                   <input
//                     type="number"
//                     className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-4 w-full outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent shadow-sm pl-10 pr-20 text-white placeholder-slate-500 transition-all duration-300"
//                     placeholder="Enter your hourly rate"
//                     value={fee}
//                     onChange={(e) => setFee(e.target.value)}
//                     min="0"
//                   />
//                   <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">
//                     /hour
//                   </span>
//                 </div>
//                 <p className="text-sm text-slate-500 mt-3">
//                   Set a competitive rate based on your experience
//                 </p>
//               </div>

//               {/* Skills Card */}
//               <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 lg:p-8">
//                 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
//                   <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
//                     <Lightbulb className="w-5 h-5 text-cyan-400" />
//                   </div>
//                   <h3 className="text-xl font-bold text-white">Skills & Expertise</h3>
//                 </div>
                
//                 <div className="flex gap-2 mb-4">
//                   <input
//                     type="text"
//                     className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-3 flex-1 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent shadow-sm text-white placeholder-slate-500 transition-all duration-300"
//                     placeholder="e.g., React, Node.js..."
//                     value={skillInput}
//                     onChange={(e) => setSkillInput(e.target.value)}
//                     onKeyDown={handleInputKeyDown}
//                   />
//                   <button
//                     type="button"
//                     className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-xl px-5 py-3 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50 transition-all duration-300 font-semibold whitespace-nowrap cursor-pointer"
//                     onClick={handleAddSkill}
//                   >
//                     <Plus className="w-4 h-4" /> Add
//                   </button>
//                 </div>

//                 {skills.length > 0 ? (
//                   <div className="flex flex-wrap gap-2">
//                     {skills.map((skill) => (
//                       <div
//                         key={skill}
//                         className="group flex items-center bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 text-cyan-400 font-semibold rounded-full px-4 py-2 shadow-sm border border-cyan-500/30 transition-all duration-300 hover:scale-105"
//                       >
//                         <span className="text-sm">{skill}</span>
//                         <button
//                           type="button"
//                           className="ml-2 text-red-400 hover:text-red-300 font-bold text-lg transition-colors duration-200 cursor-pointer"
//                           onClick={() => handleRemoveSkill(skill)}
//                         >
//                           ×
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center bg-slate-800/30">
//                     <Lightbulb className="w-10 h-10 text-slate-600 mx-auto mb-2" />
//                     <p className="text-slate-500 text-sm">No skills added yet</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Right Column */}
//             <div className="space-y-6">
//               {/* About You Card */}
//               <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 lg:p-8">
//                 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
//                   <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
//                     <FileText className="w-5 h-5 text-cyan-400" />
//                   </div>
//                   <h3 className="text-xl font-bold text-white">About You</h3>
//                 </div>
//                 <div className="relative">
//                   <textarea
//                     name="bio"
//                     placeholder="Share your experience, expertise, and what makes you a great mentor..."
//                     className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-4 w-full outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent h-40 lg:h-48 shadow-sm resize-none text-white placeholder-slate-500 transition-all duration-300"
//                     maxLength={500}
//                     value={bio}
//                     onChange={(e) => setBio(e.target.value)}
//                   ></textarea>
//                   <div className="absolute bottom-3 right-3 text-xs text-slate-500 font-medium">
//                     {bio.length}/500
//                   </div>
//                 </div>
//               </div>

//               {/* Time Slots Card */}
//               <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 lg:p-8">
//                 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
//                   <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
//                     <Calendar className="w-5 h-5 text-cyan-400" />
//                   </div>
//                   <h3 className="text-xl font-bold text-white">Available Time Slots</h3>
//                 </div>
                
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
//                   <input
//                     type="date"
//                     value={date}
//                     onChange={(e) => setDate(e.target.value)}
//                     min={new Date().toISOString().split('T')[0]} // ✅ Prevent past dates in UI
//                     className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent shadow-sm text-white transition-all duration-300"
//                   />
//                   <input
//                     type="time"
//                     value={time}
//                     onChange={(e) => setTime(e.target.value)}
//                     className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent shadow-sm text-white transition-all duration-300"
//                   />
//                 </div>
//                 <button
//                   type="button"
//                   className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-xl px-5 py-3 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50 transition-all duration-300 font-semibold mb-4 cursor-pointer"
//                   onClick={handleAddSlot}
//                 >
//                   <Plus className="w-4 h-4" /> Add Time Slot
//                 </button>

//                 {slots.length === 0 ? (
//                   <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center bg-slate-800/30">
//                     <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
//                     <p className="text-slate-500 text-sm">No time slots added yet</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
//                     {slots.map((slot, index) => (
//                       <div
//                         key={index}
//                         className="group flex items-center justify-between bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 text-cyan-400 rounded-xl px-4 py-3 shadow-sm border border-cyan-500/30 transition-all duration-300"
//                       >
//                         <div className="flex items-center gap-3">
//                           <Calendar className="w-4 h-4 text-cyan-400" />
//                           <div>
//                             <span className="font-semibold text-white block text-sm">
//                               {new Date(slot.date).toLocaleDateString('en-US', { 
//                                 month: 'short', 
//                                 day: 'numeric',
//                                 year: 'numeric'
//                               })}
//                             </span>
//                             <div className="text-xs text-cyan-400 font-medium">
//                               {slot.time}
//                             </div>
//                           </div>
//                         </div>
//                         <button
//                           type="button"
//                           className="text-red-400 hover:text-red-300 font-bold text-xl transition-colors duration-200 cursor-pointer"
//                           onClick={() => handleRemoveSlot(index)}
//                         >
//                           ×
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Submit Button - Full Width at Bottom */}
//           <div className="mt-8">
//             <button
//               className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold rounded-xl px-8 py-5 shadow-xl hover:shadow-purple-500/50 transition-all duration-300 text-lg transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
//               onClick={handleSubmit}
//               disabled={submitting} // ✅ Disable while submitting
//             >
//               {submitting ? (
//                 <>
//                   <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                   Saving Profile...
//                 </>
//               ) : (
//                 <>
//                   <Check className="w-6 h-6" />
//                   Save & Complete Profile
//                 </>
//               )}
//             </button>
//             <p className="text-center text-sm text-slate-500 mt-4">
//               You can update your profile anytime
//             </p>
//           </div>
//         </div>
//       ) : (
//         <MentorComponent />
//       )}

//       <Footer sendEmail={sendEmail} />

//       <style>{`
//         @keyframes pulse {
//           0%, 100% { opacity: 0.1; }
//           50% { opacity: 0.15; }
//         }
//         .animate-pulse {
//           animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
//         }
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
// }

// export default MentorDashboard;



import React, { useState, useEffect } from "react";
import Nav from "./Nav.jsx";
import { User, Camera, FileText, Lightbulb, Plus, Calendar, DollarSign, Check } from "lucide-react";
import MentorComponent from "./MentorComponent.jsx";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMentorData } from "../redux/mentorSlice.js";
import useGetMentorData from "../hooks/useGetMentorData.jsx";
import Footer from "./Footer.jsx";
import toast from 'react-hot-toast'; // ✅ Import toast

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
  const [submitting, setSubmitting] = useState(false); // ✅ Add submitting state

  const dispatch = useDispatch();
  useGetMentorData();
  const mentorData = useSelector((state) => state.mentor.mentorData);

  useEffect(() => {
    if (mentorData?.user?.email) {
      setSendEmail(mentorData.user.email);
    }
  }, [mentorData]);

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    
    if (!trimmed) {
      toast.error('Please enter a skill'); // ✅ Empty validation
      return;
    }
    
    if (skills.includes(trimmed)) {
      toast.error('This skill is already added'); // ✅ Duplicate validation
      return;
    }
    
    setSkills([...skills, trimmed]);
    setSkillInput("");
    toast.success(`${trimmed} added to your skills! 🎯`, { duration: 2000 }); // ✅ Success toast
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ Comprehensive validation
    if (!bio.trim()) {
      toast.error('Please write something about yourself');
      return;
    }
    
    if (bio.trim().length < 50) {
      toast.error('Bio should be at least 50 characters');
      return;
    }
    
    if (skills.length === 0) {
      toast.error('Please add at least one skill');
      return;
    }
    
    if (!fee || parseFloat(fee) <= 0) {
      toast.error('Please set a valid hourly fee');
      return;
    }
    
    if (slots.length === 0) {
      toast.error('Please add at least one available time slot');
      return;
    }
    
    if (!backendImage) {
      toast.error('Please upload a profile photo');
      return;
    }

    setSubmitting(true);
    const submitToast = toast.loading('Completing your profile...'); // ✅ Loading toast

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
      
      toast.dismiss(submitToast); // ✅ Dismiss loading
      toast.success('Profile completed successfully! Welcome to the mentor community! 🎉', { // ✅ Success toast
        duration: 5000,
      });
    } catch (error) {
      console.error("Submit error:", error?.response?.data || error.message);
      toast.dismiss(submitToast); // ✅ Dismiss loading
      
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to complete profile';
      toast.error(`Error: ${errorMessage}`); // ✅ Error toast
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveSkill = (removeSkill) => {
    setSkills(skills.filter((skill) => skill !== removeSkill));
    toast.success(`${removeSkill} removed`, { duration: 2000 }); // ✅ Remove toast
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleAddSlot = () => {
    if (!date) {
      toast.error('Please select a date'); // ✅ Date validation
      return;
    }
    
    if (!time) {
      toast.error('Please select a time'); // ✅ Time validation
      return;
    }

    // ✅ Check if date is in the past
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast.error('Cannot add slots for past dates');
      return;
    }

    const newSlot = { date, time };
    
    if (slots.some((s) => s.date === newSlot.date && s.time === newSlot.time)) {
      toast.error('This time slot is already added'); // ✅ Duplicate slot validation
      return;
    }
    
    setSlots((prev) => [...prev, newSlot]);
    setDate("");
    setTime("");
    toast.success('Time slot added successfully! 📅', { duration: 2000 }); // ✅ Success toast
  };

  const handleRemoveSlot = (index) => {
    const removedSlot = slots[index];
    setSlots((prev) => prev.filter((_, i) => i !== index));
    toast.success('Time slot removed', { duration: 2000 }); // ✅ Remove toast
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // ✅ File size validation (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('Image size must be less than 5MB');
      e.target.value = ''; // Clear the input
      return;
    }
    
    // ✅ File type validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG and PNG images are allowed');
      e.target.value = ''; // Clear the input
      return;
    }
    
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
    toast.success('Profile photo uploaded! 📸', { duration: 2000 }); // ✅ Success toast
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white w-full pt-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none max-w-full">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <Nav />
      {!mentorData ? (
        <div className="z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 overflow-x-hidden">
          {/* Header */}
          <div className="text-center mb-8 lg:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl mb-6 shadow-xl shadow-purple-500/30">
              <User className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Complete Your Mentor Profile
            </h1>
            <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto">
              Help students connect with you and understand your expertise
            </p>
          </div>

          {/* Two Column Layout for Desktop */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Profile Photo Card */}
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 lg:p-8">
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
                          className="h-32 w-32 lg:h-40 lg:w-40 rounded-full object-cover shadow-2xl ring-4 ring-cyan-500/30"
                        />
                        <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                      </div>
                    ) : (
                      <div className="h-32 w-32 lg:h-40 lg:w-40 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center hover:from-cyan-500/20 hover:to-purple-500/20 transition-all duration-300 shadow-xl ring-4 ring-slate-700 group border border-slate-700">
                        <Camera className="w-12 h-12 lg:w-16 lg:h-16 text-slate-500 group-hover:text-cyan-400 transition-colors duration-300" />
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="block">
                      <input
                        type="file"
                        accept="image/*"
                        className="block w-full text-sm text-slate-400
                          file:mr-4 file:py-2.5 file:px-5
                          file:rounded-xl file:border-0
                          file:text-sm file:font-semibold
                          file:bg-gradient-to-r file:from-cyan-500 file:to-purple-600
                          file:text-white file:shadow-lg file:shadow-purple-500/30
                          hover:file:from-cyan-600 hover:file:to-purple-700
                          file:cursor-pointer file:transition-all file:duration-300
                          cursor-pointer"
                        onChange={handleImage}
                      />
                    </label>
                    <p className="text-xs text-slate-500 text-center mt-2">
                      JPG, PNG - Max 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Hourly Fee Card */}
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                  <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
                    <DollarSign className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Hourly Fee</h3>
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
                    ₹
                  </div>
                  <input
                    type="number"
                    className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-4 w-full outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent shadow-sm pl-10 pr-20 text-white placeholder-slate-500 transition-all duration-300"
                    placeholder="Enter your hourly rate"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    min="0"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">
                    /hour
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-3">
                  Set a competitive rate based on your experience
                </p>
              </div>

              {/* Skills Card */}
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                  <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
                    <Lightbulb className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Skills & Expertise</h3>
                </div>
                
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-3 flex-1 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent shadow-sm text-white placeholder-slate-500 transition-all duration-300"
                    placeholder="e.g., React, Node.js..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                  />
                  <button
                    type="button"
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-xl px-5 py-3 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50 transition-all duration-300 font-semibold whitespace-nowrap cursor-pointer"
                    onClick={handleAddSkill}
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>

                {skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <div
                        key={skill}
                        className="group flex items-center bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 text-cyan-400 font-semibold rounded-full px-4 py-2 shadow-sm border border-cyan-500/30 transition-all duration-300 hover:scale-105"
                      >
                        <span className="text-sm">{skill}</span>
                        <button
                          type="button"
                          className="ml-2 text-red-400 hover:text-red-300 font-bold text-lg transition-colors duration-200 cursor-pointer"
                          onClick={() => handleRemoveSkill(skill)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center bg-slate-800/30">
                    <Lightbulb className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">No skills added yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* About You Card */}
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                  <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
                    <FileText className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">About You</h3>
                </div>
                <div className="relative">
                  <textarea
                    name="bio"
                    placeholder="Share your experience, expertise, and what makes you a great mentor..."
                    className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-4 w-full outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent h-40 lg:h-48 shadow-sm resize-none text-white placeholder-slate-500 transition-all duration-300"
                    maxLength={500}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  ></textarea>
                  <div className="absolute bottom-3 right-3 text-xs text-slate-500 font-medium">
                    {bio.length}/500
                  </div>
                </div>
              </div>

              {/* Time Slots Card */}
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 lg:p-8">
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
                    min={new Date().toISOString().split('T')[0]} // ✅ Prevent past dates in UI
                    className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent shadow-sm text-white transition-all duration-300"
                  />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent shadow-sm text-white transition-all duration-300"
                  />
                </div>
                <button
                  type="button"
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-xl px-5 py-3 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50 transition-all duration-300 font-semibold mb-4 cursor-pointer"
                  onClick={handleAddSlot}
                >
                  <Plus className="w-4 h-4" /> Add Time Slot
                </button>

                {slots.length === 0 ? (
                  <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center bg-slate-800/30">
                    <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">No time slots added yet</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {slots.map((slot, index) => (
                      <div
                        key={index}
                        className="group flex items-center justify-between bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 text-cyan-400 rounded-xl px-4 py-3 shadow-sm border border-cyan-500/30 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-cyan-400" />
                          <div>
                            <span className="font-semibold text-white block text-sm">
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
                        <button
                          type="button"
                          className="text-red-400 hover:text-red-300 font-bold text-xl transition-colors duration-200 cursor-pointer"
                          onClick={() => handleRemoveSlot(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button - Full Width at Bottom */}
          <div className="mt-8">
            <button
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold rounded-xl px-8 py-5 shadow-xl hover:shadow-purple-500/50 transition-all duration-300 text-lg transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              onClick={handleSubmit}
              disabled={submitting} // ✅ Disable while submitting
            >
              {submitting ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving Profile...
                </>
              ) : (
                <>
                  <Check className="w-6 h-6" />
                  Save & Complete Profile
                </>
              )}
            </button>
            <p className="text-center text-sm text-slate-500 mt-4">
              You can update your profile anytime
            </p>
          </div>
        </div>
      ) : (
        <MentorComponent />
      )}

      <Footer sendEmail={sendEmail} />

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
}

export default MentorDashboard;