

// import React, { useState, useEffect, useMemo } from "react";
// import { Search, Star, Users, MapPin, Clock, Calendar, X, Upload } from "lucide-react";
// import Nav from "./Nav";
// import axios from "axios";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { setResumeData } from "../redux/userSlice";
// import { loadStripe } from "@stripe/stripe-js";

// const getProfileImageSrc = (profileImage) => {
//   if (!profileImage) return "/default-avatar.png";
//   if (profileImage.startsWith("http")) return profileImage;
//   return `${import.meta.env.VITE_API_URL}${profileImage}`;
// };

// const PaymentModal = ({ isOpen, onClose, mentor }) => {
//   const [selectedSlot, setSelectedSlot] = useState("");
//   const userData = useSelector((state) => state.user.userData);

//   if (!isOpen) return null;

//   const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

//   const handlePayment = async () => {
//     const userId = userData?.user?._id;
//     const mentorId = mentor?._id || mentor?.id;
//     if (!userId || !mentorId || !selectedSlot) {
//       console.error("Missing user, mentor, or selected slot!");
//       return;
//     }

//     const [datePart, timePart] = selectedSlot.split(" ");
//     const sessionTimeArray = [{ date: datePart, time: timePart }];
//     const price = parseFloat(mentor.price.replace(/[^0-9.]/g, ""));

//     try {
//       const { data } = await axios.post(
//         `${import.meta.env.VITE_API_URL}/session/create-session`,
//         {
//           userId,
//           mentorId,
//           sessionTime: sessionTimeArray,
//           amountInCents: price * 100,
//         }
//       );

//       const stripe = await stripePromise;
//       if (!stripe) return console.error("Stripe failed to load!");
//       window.location.href = data.url;
//     } catch (error) {
//       console.error("Payment Error:", error.response?.data || error.message);
//     }

//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
//       <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         {/* Modal Header */}
//         <div className="sticky top-0 bg-gradient-to-r from-cyan-500 to-purple-600 text-white p-6 rounded-t-3xl">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-2xl font-bold">Book Your Session</h2>
//               <p className="text-cyan-100 mt-1">
//                 Complete your booking with {mentor?.name}
//               </p>
//             </div>
//             <button
//               onClick={onClose}
//               className="p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
//             >
//               <X className="h-6 w-6" />
//             </button>
//           </div>
//         </div>

//         {/* Modal Content */}
//         <div className="p-6">
//           {/* Available Slots */}
//           {mentor?.sessions?.length > 0 && (
//             <div className="mb-6">
//               <label className="flex items-center text-sm font-semibold text-white mb-3">
//                 <Calendar className="h-4 w-4 mr-2 text-cyan-400" />
//                 Select Available Time Slot
//               </label>
//               <div className="grid grid-cols-1 gap-2">
//                 {mentor.sessions.slice(0, 5).map((slot, index) => (
//                   <label
//                     key={index}
//                     className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
//                       selectedSlot === slot
//                         ? "border-cyan-500 bg-cyan-500/10"
//                         : "border-slate-700 bg-slate-800/50 hover:border-cyan-500/50 hover:bg-slate-800"
//                     }`}
//                   >
//                     <input
//                       type="radio"
//                       name="slot"
//                       value={slot}
//                       checked={selectedSlot === slot}
//                       onChange={(e) => setSelectedSlot(e.target.value)}
//                       className="mr-3 text-cyan-500 focus:ring-cyan-500"
//                     />
//                     <Clock className="h-4 w-4 text-cyan-400 mr-2" />
//                     <span className="text-sm font-medium text-white">
//                       {slot}
//                     </span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex space-x-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-6 py-3 rounded-xl border-2 border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={handlePayment}
//               className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold transition-all shadow-lg hover:shadow-purple-500/50 cursor-pointer"
//             >
//               Book & Pay
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const FindMentors = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [selectedLocation, setSelectedLocation] = useState("all");
//   const [priceRange, setPriceRange] = useState("all");
//   const [mentors, setMentors] = useState([]);
//   const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
//   const [selectedMentor, setSelectedMentor] = useState(null);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const userData = useSelector((state) => state.user.userData);
//   const resumeData = useSelector((state) => state.user.resumeData);

//   useEffect(() => {
//     const fetchResume = async () => {
//       try {
//         if (!resumeData) {
//           const { data } = await axios.get(
//             `${import.meta.env.VITE_API_URL}/resume/me`,
//             { withCredentials: true }
//           );
//           if (data) dispatch(setResumeData(data));
//         }
//       } catch (err) {
//         console.error("Failed to fetch resume:", err);
//       }
//     };

//     fetchResume();
//   }, []);

//   useEffect(() => {
//     const fetchMentors = async () => {
//       try {
//         const result = await axios.get(
//           `${import.meta.env.VITE_API_URL}/skills/mentor`,
//           { withCredentials: true }
//         );

//         const mappedMentors = (result.data.mentors || []).map((item, index) => ({
//           key: index,
//           id: item.mentor._id,
//           name: item.mentor.user.username,
//           expertise: item.mentor.skills,
//           rating: item.matchScore,
//           sessions:
//             item.mentor?.availableSlots?.map(
//               (slot) => `${new Date(slot.date).toLocaleDateString()} ${slot.time}`
//             ) || [],
//           location: "Remote",
//           price: item.mentor?.fee ? `₹${item.mentor.fee}/hour` : "₹80/hour",
//           image: getProfileImageSrc(item.mentor.profileImage),
//           description: item.mentor.bio,
//           category: "technology",
//         }));

//         setMentors(mappedMentors);
//       } catch (err) {
//         console.error("Error fetching mentors:", err);
//       }
//     };

//     fetchMentors();
//   }, []);

//   const searchMentors = async () => {
//     const result = await axios.post(
//       `${import.meta.env.VITE_API_URL}/search`,
//       searchTerm,
//       { withCredentials: true }
//     );
//   };

//   const filteredMentors = useMemo(() => {
//     return mentors.filter((mentor) => {
//       const matchesSearch =
//         searchTerm === "" ||
//         mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         mentor.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         mentor.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         mentor.expertise.some((skill) =>
//           skill.toLowerCase().includes(searchTerm.toLowerCase())
//         );

//       const matchesCategory =
//         selectedCategory === "all" || mentor.category === selectedCategory;

//       const matchesLocation =
//         selectedLocation === "all" ||
//         mentor.location.toLowerCase().includes(selectedLocation.replace("-", " ")) ||
//         (selectedLocation === "remote" && mentor.location.toLowerCase() === "remote");

//       const matchesPrice =
//         priceRange === "all" ||
//         (priceRange === "0-80" && mentor.priceValue <= 80) ||
//         (priceRange === "81-100" && mentor.priceValue >= 81 && mentor.priceValue <= 100) ||
//         (priceRange === "101+" && mentor.priceValue > 100);

//       return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
//     });
//   }, [searchTerm, selectedCategory, selectedLocation, priceRange, mentors]);

//   const handleBookSession = (mentor) => {
//     setSelectedMentor(mentor);
//     setIsPaymentModalOpen(true);
//   };

//   return (
//     <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
//       {/* Animated Background */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
//         <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
//         <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '4s'}}></div>
//       </div>

//       <Nav />

//       {!resumeData ? (
//         <div className="relative z-10 min-h-[60vh] flex flex-col items-center justify-center text-center px-4 mt-24">
//           <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-12 max-w-md">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
//               <Upload className="w-8 h-8 text-white" />
//             </div>
//             <h2 className="text-2xl font-bold text-white mb-3">
//               Upload Your Resume
//             </h2>
//             <p className="text-slate-400 mb-6">
//               AI will parse your skills from your resume, and then you'll be able to find mentors that match your expertise.
//             </p>
//             <button
//               onClick={() => navigate(`/upload-resume/${userData?.user?._id}`)}
//               className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all duration-200 hover:scale-105 cursor-pointer"
//             >
//               Add Your Resume
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-24">
//           {/* Header Section */}
//           <div className="text-center mb-12">
//             <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
//               Find Your Perfect
//               <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
//                 {" "}Mentor
//               </span>
//             </h1>
//             <p className="text-xl text-slate-400 max-w-3xl mx-auto">
//               Connect with industry experts and accelerate your career growth with personalized mentorship
//             </p>
//           </div>

//           {/* Search and Filter Section */}
//           <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-800 p-6 mb-8">
//             {/* Search Bar */}
//             <div className="mb-6">
//               <div className="relative max-w-2xl mx-auto">
//                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
//                 <input
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       searchMentors();
//                     }
//                   }}
//                   type="text"
//                   placeholder="Search by name, skills, company, or expertise..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl bg-slate-800/50 border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-slate-500"
//                 />
//               </div>
//             </div>

//             {/* Results Count */}
//             <div className="mt-4 text-center">
//               <p className="text-slate-400">
//                 Showing{" "}
//                 <span className="font-semibold text-cyan-400">
//                   {filteredMentors.length}
//                 </span>{" "}
//                 mentor{filteredMentors.length !== 1 ? "s" : ""}
//               </p>
//             </div>
//           </div>

//           {/* Mentors Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredMentors.map((mentor) => (
//               <div
//                 key={mentor.id}
//                 className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-800 p-6 hover:shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-500/50 transition-all duration-300 hover:scale-[1.02] group"
//               >
//                 {/* Mentor Header */}
//                 <div className="flex items-start space-x-4 mb-4">
//                   <img
//                     src={mentor.image}
//                     alt={mentor.name}
//                     className="w-16 h-16 rounded-full object-cover ring-2 ring-slate-700 group-hover:ring-cyan-400 transition-all duration-300"
//                   />
//                   <div className="flex-1 min-w-0">
//                     <h3 className="text-lg font-bold text-white truncate">
//                       {mentor.name}
//                     </h3>
//                     <p className="text-sm font-medium text-cyan-400 truncate">
//                       {mentor.title}
//                     </p>
//                     <p className="text-sm text-slate-400 truncate">
//                       {mentor.company}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Rating and Stats */}
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center space-x-1">
//                     <Star className="h-4 w-4 text-yellow-400 fill-current" />
//                     <span className="text-sm font-medium text-white">
//                       {mentor.rating}
//                     </span>
//                   </div>
//                   <div className="flex flex-col items-end text-slate-400 text-sm">
//                     <div className="flex items-center space-x-1">
//                       <Users className="h-4 w-4" />
//                       <span>{mentor.sessions?.length || 0} sessions</span>
//                     </div>
//                     {mentor.sessions?.length > 0 && (
//                       <span className="text-xs text-slate-500">
//                         Next: {mentor.sessions[0]}
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Location and Price */}
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center space-x-1 text-slate-400">
//                     <MapPin className="h-4 w-4" />
//                     <span className="text-sm truncate">{mentor.location}</span>
//                   </div>
//                   <span className="text-lg font-bold text-green-400">
//                     {mentor.price}
//                   </span>
//                 </div>

//                 {/* Skills */}
//                 <div className="mb-4">
//                   <div className="flex flex-wrap gap-1">
//                     {mentor.expertise.slice(0, 3).map((skill, index) => (
//                       <span
//                         key={index}
//                         className="px-2 py-1 text-xs font-medium bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30"
//                       >
//                         {skill}
//                       </span>
//                     ))}
//                     {mentor.expertise.length > 3 && (
//                       <span className="px-2 py-1 text-xs font-medium bg-slate-800 text-slate-400 rounded-full border border-slate-700">
//                         +{mentor.expertise.length - 3} more
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Description */}
//                 <p className="text-sm text-slate-400 mb-4 line-clamp-2">
//                   {mentor.description}
//                 </p>

//                 {/* Book Session Button */}
//                 <button
//                   onClick={() => handleBookSession(mentor)}
//                   className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group-hover:scale-105 shadow-lg hover:shadow-purple-500/50 cursor-pointer"
//                 >
//                   <Clock className="h-4 w-4" />
//                   <span>Book Session</span>
//                 </button>
//               </div>
//             ))}
//           </div>

//           {/* No Results */}
//           {filteredMentors.length === 0 && (
//             <div className="text-center py-12">
//               <div className="max-w-md mx-auto bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-12">
//                 <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Search className="h-12 w-12 text-slate-600" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-white mb-2">
//                   No mentors found
//                 </h3>
//                 <p className="text-slate-400 mb-4">
//                   Try adjusting your search criteria or filters to find more mentors.
//                 </p>
//                 <button
//                   onClick={() => {
//                     setSearchTerm("");
//                     setSelectedCategory("all");
//                     setSelectedLocation("all");
//                     setPriceRange("all");
//                   }}
//                   className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 cursor-pointer"
//                 >
//                   Clear Filters
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Payment Modal */}
//       <PaymentModal
//         isOpen={isPaymentModalOpen}
//         onClose={() => setIsPaymentModalOpen(false)}
//         mentor={selectedMentor}
//       />

//       <style>{`
//         @keyframes pulse {
//           0%, 100% { opacity: 0.1; }
//           50% { opacity: 0.15; }
//         }
//         .animate-pulse {
//           animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default FindMentors;



import React, { useState, useEffect, useMemo } from "react";
import { Search, Star, Users, MapPin, Clock, Calendar, X, Upload, Home } from "lucide-react";
import Nav from "./Nav";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setResumeData } from "../redux/userSlice";
import { loadStripe } from "@stripe/stripe-js";
import toast from 'react-hot-toast'; // Import toast

// Helper function (defined outside component for clean memoization)
const getProfileImageSrc = (profileImage) => {
  if (!profileImage) return "/default-avatar.png";
  // NOTE: Assuming VITE_API_URL includes the base URL for images
  if (profileImage.startsWith("http")) return profileImage;
  return `${import.meta.env.VITE_API_URL}${profileImage}`;
};

// --- Payment Modal Component ---
const PaymentModal = ({ isOpen, onClose, mentor }) => {
  const [selectedSlot, setSelectedSlot] = useState("");
  const userData = useSelector((state) => state.user.userData);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedSlot("");
    }
  }, [isOpen]);

  if (!isOpen || !mentor) return null;

  // NOTE: Stripe key retrieval logic should handle environment variables safely
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  const handlePayment = async () => {
    if (!selectedSlot) {
      toast.error("Please select an available time slot first.");
      return;
    }

    const userId = userData?.user?._id;
    const mentorId = mentor?._id || mentor?.id;
    
    if (!userId || !mentorId) {
      toast.error("Authentication error. Please log in again.");
      return;
    }

    const [datePart, timePart] = selectedSlot.split(" ");
    const sessionTimeArray = [{ date: datePart, time: timePart }];
    // Remove non-numeric characters before parsing price
    const price = parseFloat(mentor.price.replace(/[^0-9.]/g, "")); 
    
    // Use toast.promise for API call management
     const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/session/create-session`,
        {
          userId,
           mentorId,
           sessionTime: sessionTimeArray,
           amountInCents: price * 100,
         }
       );

    toast.promise(paymentPromise, {
      loading: 'Initiating payment...',
      success: async (response) => {
        onClose(); // Close modal immediately
        
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error("Stripe library failed to load.");
        }

        // Redirect user to the Stripe checkout page
        window.location.href = response.data.url;
        return "Redirecting to payment gateway..."; // This message is unlikely to be seen due to redirect
      },
      error: (error) => {
        console.error("Payment Error:", error.response?.data || error.message);
        return error.response?.data?.message || "Failed to initiate payment session. Try again.";
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-cyan-500 to-purple-600 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Book Your Session</h2>
              <p className="text-cyan-100 mt-1">
                Complete your booking with {mentor?.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Available Slots */}
          {mentor?.sessions?.length > 0 ? (
            <div className="mb-6">
              <label className="flex items-center text-sm font-semibold text-white mb-3">
                <Calendar className="h-4 w-4 mr-2 text-cyan-400" />
                Select Available Time Slot
              </label>
              <div className="grid grid-cols-1 gap-2">
                {mentor.sessions.slice(0, 5).map((slot, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedSlot === slot
                        ? "border-cyan-500 bg-cyan-500/10"
                        : "border-slate-700 bg-slate-800/50 hover:border-cyan-500/50 hover:bg-slate-800"
                    }`}
                  >
                    <input
                      type="radio"
                      name="slot"
                      value={slot}
                      checked={selectedSlot === slot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="mr-3 text-cyan-500 focus:ring-cyan-500"
                    />
                    <Clock className="h-4 w-4 text-cyan-400 mr-2" />
                    <span className="text-sm font-medium text-white">
                      {slot}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl text-center text-slate-400">
              This mentor has no available slots right now. Check back soon!
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePayment}
              disabled={!selectedSlot} // Disable if no slot is selected
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold transition-all shadow-lg hover:shadow-purple-500/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Book & Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
const FindMentors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [mentors, setMentors] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [loadingMentors, setLoadingMentors] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.user.userData);
  const resumeData = useSelector((state) => state.user.resumeData);

  // 1. Fetch Resume Data (if missing)
  useEffect(() => {
    const fetchResume = async () => {
      try {
        if (!resumeData) {
          const resumePromise = axios.get(
            `${import.meta.env.VITE_API_URL}/resume/me`,
            { withCredentials: true }
          );

          toast.promise(resumePromise, {
            loading: 'Checking for your saved resume...',
            success: (response) => {
              if (response.data) {
                dispatch(setResumeData(response.data));
                return 'Resume found. Ready to match mentors!';
              }
              return 'No saved resume found. Please upload one for best matches.';
            },
            error: (err) => {
              return 'Failed to load resume data.';
            },
          });
        }
      } catch (err) {
        console.error("Failed to fetch resume:", err);
      }
    };

    fetchResume();
  }, [resumeData, dispatch]);

  // 2. Fetch Mentors
  useEffect(() => {
    const fetchMentors = async () => {
      setLoadingMentors(true);

      const mentorsPromise = axios.get(
        `${import.meta.env.VITE_API_URL}/skills/mentor`,
        { withCredentials: true }
      );

      toast.promise(mentorsPromise, {
        loading: 'Finding your mentor matches...',
        success: (result) => {
          const mappedMentors = (result.data.mentors || []).map((item, index) => ({
            key: index,
            id: item.mentor._id,
            name: item.mentor.user.username,
            expertise: item.mentor.skills,
            rating: item.matchScore,
            sessions:
              item.mentor?.availableSlots?.map(
                (slot) => `${slot.date} ${slot.time}` // Format slots as 'YYYY-MM-DD HH:MM'
              ) || [],
            location: "Remote",
            price: item.mentor?.fee ? `₹${item.mentor.fee}/hour` : "₹80/hour",
            priceValue: item.mentor?.fee ? parseFloat(item.mentor.fee) : 80,
            image: getProfileImageSrc(item.mentor.profileImage),
            description: item.mentor.bio,
            category: "technology", // Default category or derive from skills
          }));

          setMentors(mappedMentors);
          setLoadingMentors(false);
          return `${mappedMentors.length} mentor matches found!`;
        },
        error: (err) => {
          setLoadingMentors(false);
          return err.response?.data?.message || 'Failed to load mentor list.';
        },
      });
    };

    if (userData) { // Only fetch if user is logged in (handled by router, but safe check)
      fetchMentors();
    }
  }, [userData]);

  const searchMentors = async () => {
    // Note: This function was previously performing an API call but was undefined.
    // If the intention is to filter locally, the useMemo below handles it.
    // If the intention is a backend search, uncomment and correct the API logic here:
    /*
    try {
      const searchPromise = axios.post(
        `${import.meta.env.VITE_API_URL}/search`,
        { searchTerm },
        { withCredentials: true }
      );
      // Handle promise resolution here...
      toast.promise(searchPromise, {...});
    } catch (err) {
      toast.error("Search failed.");
    }
    */
    toast.info(`Filtering results for "${searchTerm}"...`);
    // Re-run filtering logic via state update, which triggers useMemo
    setMentors([...mentors]); 
  };


  const filteredMentors = useMemo(() => {
    return mentors.filter((mentor) => {
      const priceValue = mentor.priceValue;

      const matchesSearch =
        searchTerm === "" ||
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.expertise.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "all" || mentor.category === selectedCategory;

      const matchesLocation =
        selectedLocation === "all" ||
        mentor.location.toLowerCase().includes(selectedLocation.replace("-", " "));

      const matchesPrice =
        priceRange === "all" ||
        (priceRange === "0-80" && priceValue <= 80) ||
        (priceRange === "81-100" && priceValue >= 81 && priceValue <= 100) ||
        (priceRange === "101+" && priceValue > 100);

      return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
    });
  }, [searchTerm, selectedCategory, selectedLocation, priceRange, mentors]);

  const handleBookSession = (mentor) => {
    // Check if mentor has any slots available before opening modal
    if (!mentor.sessions || mentor.sessions.length === 0) {
      toast.error(`${mentor.name} currently has no open slots.`);
      return;
    }
    
    setSelectedMentor(mentor);
    setIsPaymentModalOpen(true);
  };

  // Render spinner if loading mentors initially
  if (loadingMentors) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Nav />
        <div className="flex items-center justify-center h-screen">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <Nav />

      {!resumeData || !resumeData.extractedSkills || resumeData.extractedSkills.length === 0 ? (
        <div className="relative z-10 min-h-[60vh] flex flex-col items-center justify-center text-center px-4 mt-24">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-12 max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Upload Your Resume
            </h2>
            <p className="text-slate-400 mb-6">
              AI will parse your skills from your resume, and then you'll be able to find mentors that match your expertise.
            </p>
            <button
              onClick={() => navigate(`/upload-resume/${userData?.user?._id}`)}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all duration-200 hover:scale-105 cursor-pointer"
            >
              Add Your Resume
            </button>
          </div>
        </div>
      ) : (
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-24">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
              Find Your Perfect
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}Mentor
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Connect with industry experts and accelerate your career growth with personalized mentorship
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-800 p-6 mb-8">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      searchMentors();
                    }
                  }}
                  type="text"
                  placeholder="Search by name, skills, company, or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl bg-slate-800/50 border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-slate-500"
                />
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-center">
              <p className="text-slate-400">
                Showing{" "}
                <span className="font-semibold text-cyan-400">
                  {filteredMentors.length}
                </span>{" "}
                mentor{filteredMentors.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-800 p-6 hover:shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-500/50 transition-all duration-300 hover:scale-[1.02] group"
              >
                {/* Mentor Header */}
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-slate-700 group-hover:ring-cyan-400 transition-all duration-300"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white truncate">
                      {mentor.name}
                    </h3>
                    <p className="text-sm font-medium text-cyan-400 truncate">
                      {mentor.title}
                    </p>
                    <p className="text-sm text-slate-400 truncate">
                      {mentor.company}
                    </p>
                  </div>
                </div>

                {/* Rating and Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-white">
                      {mentor.rating}
                    </span>
                  </div>
                  <div className="flex flex-col items-end text-slate-400 text-sm">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{mentor.sessions?.length || 0} sessions</span>
                    </div>
                    {mentor.sessions?.length > 0 && (
                      <span className="text-xs text-slate-500">
                        Next: {mentor.sessions[0]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Location and Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1 text-slate-400">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm truncate">{mentor.location}</span>
                  </div>
                  <span className="text-lg font-bold text-green-400">
                    {mentor.price}
                  </span>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {mentor.expertise.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-medium bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30"
                      >
                        {skill}
                      </span>
                    ))}
                    {mentor.expertise.length > 3 && (
                      <span className="px-2 py-1 text-xs font-medium bg-slate-800 text-slate-400 rounded-full border border-slate-700">
                        +{mentor.expertise.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                  {mentor.description}
                </p>

                {/* Book Session Button */}
                <button
                  onClick={() => handleBookSession(mentor)}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group-hover:scale-105 shadow-lg hover:shadow-purple-500/50 cursor-pointer"
                >
                  <Clock className="h-4 w-4" />
                  <span>Book Session</span>
                </button>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredMentors.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-12">
                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-12 w-12 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No mentors found
                </h3>
                <p className="text-slate-400 mb-4">
                  Try adjusting your search criteria or filters to find more mentors.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setSelectedLocation("all");
                    setPriceRange("all");
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        mentor={selectedMentor}
      />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.15; }
        }
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default FindMentors;