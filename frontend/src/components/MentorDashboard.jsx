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
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8"> {/* Changed: Added grid-cols-1 for mobile stacking, reduced gap */}
//             {/* Left Column */}
//             <div className="space-y-4 lg:space-y-6"> {/* Changed: Reduced space-y for mobile */}
//               {/* Profile Photo Card */}
//               <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-4 lg:p-8"> {/* Changed: Reduced padding on mobile */}
//                 <div className="flex flex-col items-center gap-3 lg:gap-5"> {/* Changed: Reduced gap */}
//                   <div className="relative group">
//                     {frontendImage ? (
//                       <div className="relative">
//                         <img
//                           src={frontendImage}
//                           alt="Profile"
//                           className="h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 rounded-full object-cover shadow-2xl ring-4 ring-cyan-500/30" // Changed: Smaller sizes on mobile
//                         />
//                         <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
//                       </div>
//                     ) : (
//                       <div className="h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center hover:from-cyan-500/20 hover:to-purple-500/20 transition-all duration-300 shadow-xl ring-4 ring-slate-700 group border border-slate-700"> {/* Changed: Smaller sizes */}
//                         <Camera className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-slate-500 group-hover:text-cyan-400 transition-colors duration-300" /> {/* Changed: Smaller icons */}
//                       </div>
//                     )}
//                     <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50"> {/* Changed: Smaller camera button */}
//                       <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
//                     </div>
//                   </div>

//                   <div className="w-full">
//                     <label className="block">
//                       <input
//                         type="file"
//                         accept="image/*"
//                         className="block w-full text-sm text-slate-400
//                           file:mr-3 file:py-2 file:px-4 sm:file:mr-4 sm:file:py-2.5 sm:file:px-5
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
//               <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-4 lg:p-8"> {/* Changed: Reduced padding */}
//                 <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6 pb-3 lg:pb-4 border-b border-slate-800"> {/* Changed: Adjusted gaps and margins */}
//                   <div className="p-1.5 lg:p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30"> {/* Changed: Smaller padding */
//                     <DollarSign className="w-4 h-4 lg:w-5 lg:h-5 text-cyan-400" />
//                   </div>
//                   <h3 className="text-lg lg:text-xl font-bold text-white">Hourly Fee</h3> {/* Changed: Smaller title on mobile */}
//                 </div>
//                 <div className="relative">
//                   <div className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base lg:text-lg"> {/* Changed: Adjusted positioning */}
//                     ₹
//                   </div>
//                   <input
//                     type="number"
//                     className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-3 lg:p-4 w-full outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent shadow-sm pl-8 lg:pl-10 pr-16 lg:pr-20 text-white placeholder-slate-500 transition-all duration-300" // Changed: Adjusted padding and positioning
//                     placeholder="Enter your hourly rate"
//                     value={fee}
//                     onChange={(e) => setFee(e.target.value)}
//                     min="0"
//                   />
//                   <span className="absolute right-3 lg:right-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold text-sm lg:text-base"> {/* Changed: Adjusted positioning */}
//                     /hour
//                   </span>
//                 </div>
//                 <p className="text-xs lg:text-sm text-slate-500 mt-2 lg:mt-3"> {/* Changed: Smaller text */}
//                   Set a competitive rate based on your experience
//                 </p>
//               </div>

//               {/* Skills Card */}
//               <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-4 lg:p-8"> {/* Changed: Reduced padding */}
//                 <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6 pb-3 lg:pb-4 border-b border-slate-800"> {/* Changed: Adjusted */}
//                   <div className="p-1.5 lg:p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
//                     <Lightbulb className="w-4 h-4 lg:w-5 lg:h-5 text-cyan-400" />
//                   </div>
//                   <h3 className="text-lg lg:text-xl font-bold text-white">Skills & Expertise</h3>
//                 </div>

//                 <div className="flex flex-col sm:flex-row gap-2 mb-4"> {/* Changed: Stack on mobile */}
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
//                     className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-xl px-4 py-3 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50 transition-all duration-300 font-semibold whitespace-nowrap cursor-pointer min-h-[44px]" // Changed: Added min-h for touch
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
//                         className="group flex items-center bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 text-cyan-400 font-semibold rounded-full px-3 py-2 shadow-sm border border-cyan-500/30 transition-all duration-300 hover:scale-105 min-h-[36px]" // Changed: Smaller padding, added min-h
//                       >
//                         <span className="text-xs lg:text-sm">{skill}</span> {/* Changed: Smaller text */}
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
//                   <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 lg:p-6 text-center bg-slate-800/30"> {/* Changed: Reduced padding */}
//                     <Lightbulb className="w-8 h-8 lg:w-10 lg:h-10 text-slate-600 mx-auto mb-2" />
//                     <p className="text-xs lg:text-sm text-slate-500">No skills added yet</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Right Column */}
//             <div className="space-y-4 lg:space-y-6"> {/* Changed: Reduced space */}
//               {/* About You Card */}
//               <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-4 lg:p-8"> {/* Changed: Reduced padding */}
//                 <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6 pb-3 lg:pb-4 border-b border-slate-800">
//                   <div className="p-1.5 lg:p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
//                     <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-cyan-400" />
//                   </div>
//                   <h3 className="text-lg lg:text-xl font-bold text-white">About You</h3>
//                 </div>
//                 <div className="relative">
//                   <textarea
//                     name="bio"
//                     placeholder="Share your experience, expertise, and what makes you a great mentor..."
//                     className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-3 lg:p-4 w-full outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent h-32 lg:h-40 shadow-sm resize-none text-white placeholder-slate-500 transition-all duration-300" // Changed: Smaller height on mobile
//                     maxLength={500}
//                     value={bio}
//                     onChange={(e) => setBio(e.target.value)}
//                   ></textarea>
//                   <div className="absolute bottom-2 lg:bottom-3 right-2 lg:right-3 text-xs text-slate-500 font-medium">
//                     {bio.length}/500
//                   </div>
//                 </div>
//               </div>

//               {/* Time Slots Card */}
//               <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-4 lg:p-8"> {/* Changed: Reduced padding */}
//                 <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6 pb-3 lg:pb-4 border-b border-slate-800">
//                   <div className="p-1.5 lg:p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
//                     <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-cyan-400" />
//                   </div>
//                   <h3 className="text-lg lg:text-xl font-bold text-white">Available Time Slots</h3>
//                 </div>

//                 <div className="grid grid-cols-1 gap-3 mb-4"> {/* Changed: Single column on mobile */}
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
//                   className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-xl px-4 py-3 lg:px-5 lg:py-3 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50 transition-all duration-300 font-semibold mb-4 cursor-pointer min-h-[44px]" // Changed: Added min-h, adjusted padding
//                   onClick={handleAddSlot}
//                 >
//                   <Plus className="w-4 h-4" /> Add Time Slot
//                 </button>

//                 {slots.length === 0 ? (
//                   <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 lg:p-6 text-center bg-slate-800/30"> {/* Changed: Reduced padding */}
//                     <Calendar className="w-8 h-8 lg:w-10 lg:h-10 text-slate-600 mx-auto mb-2" />
//                     <p className="text-xs lg:text-sm text-slate-500">No time slots added yet</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-2 max-h-48 lg:max-h-64 overflow-y-auto pr-2 custom-scrollbar"> {/* Changed: Smaller max-h on mobile */}
//                     {slots.map((slot, index) => (
//                       <div
//                         key={index}
//                         className="group flex items-center justify-between bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 text-cyan-400 rounded-xl px-3 py-2 lg:px-4 lg:py-3 shadow-sm border border-cyan-500/30 transition-all duration-300 min-h-[44px]" // Changed: Added min-h, adjusted padding
//                       >
//                         <div className="flex items-center gap-2 lg:gap-3">
//                           <Calendar className="w-3 h-3 lg:w-4 lg:h-4 text-cyan-400" />
//                           <div>
//                             <span className="font-semibold text-white block text-xs lg:text-sm"> {/* Changed: Smaller text */}
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
//                           className="text-red-400 hover:text-red-300 font-bold text-lg transition-colors duration-200 cursor-pointer"
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
//           <div className="mt-6 lg:mt-8"> {/* Changed: Reduced margin */}
//             <button
//               className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-
