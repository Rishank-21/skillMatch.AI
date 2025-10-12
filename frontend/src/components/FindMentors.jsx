import React, { useState, useMemo } from "react";
import {
  Search,
  MapPin,
  Star,
  Users,
  Clock,
  Filter,
  ChevronDown,
  X,
  CreditCard,
  Lock,
  Calendar,
  DollarSign,
} from "lucide-react";
import Nav from "./Nav";
import { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
// helper: if profileImage is a full URL use it, otherwise prepend VITE_IMAGE_URL
const getProfileImageSrc = (profileImage) => {
  if (!profileImage) return "/placeholder-avatar.png"; // optional fallback
  if (/^https?:\/\//i.test(profileImage)) return profileImage;
  const base = (import.meta.env.VITE_IMAGE_URL || "").replace(/\/$/, "");
  return `${base}/${profileImage.replace(/\\/g, "/").replace(/^\//, "")}`;
};
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import { setResumeData } from "../redux/userSlice";
import { useDispatch } from "react-redux";
// const PaymentModal = ({ isOpen, onClose, mentor }) => {
//   const [paymentMethod, setPaymentMethod] = useState("card");
//   const [cardNumber, setCardNumber] = useState("");
//   const [expiryDate, setExpiryDate] = useState("");
//   const [cvv, setCvv] = useState("");
//   const [selectedSlot, setSelectedSlot] = useState("");
//   const userData = useSelector((state) => state.user.userData);
//   const resumeData = useSelector((state) => state.user.resumeData)
//   if (!isOpen) return null;
//   const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
//   const handlePayment = async () => {

//     const userId = userData?.user?._id;
//   const mentorId = mentor?._id || mentor?.id;
//   if (!userId || !mentorId || !selectedSlot) {
//     console.error("Missing user, mentor, or selected slot!");
//     return;
//   }

//   const [datePart, timePart] = selectedSlot.split(" ");
//   const sessionTimeArray = [{ date: datePart, time: timePart }];
//   const price = parseFloat(mentor.price.replace(/[^0-9.]/g, "")); // convert "₹80" -> 80

//   try {
//     const { data } = await axios.post(
//       `${import.meta.env.VITE_API_URL}/session/create-session`,
//       { userId, mentorId, sessionTime: sessionTimeArray, amountInCents: price * 100 }
//     );

//     const stripe = await stripePromise;
//     if (!stripe) return console.error("Stripe failed to load!");

// Redirect to Stripe Checkout
//     window.location.href = data.url;
//   } catch (error) {
//     console.error("Payment Error:", error.response?.data || error.message);
//   }

//   onClose();
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//       <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         {/* Modal Header */}
//         <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-3xl">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-2xl font-bold">Book Your Session</h2>
//               <p className="text-blue-100 mt-1">
//                 Complete your booking with {mentor?.name}
//               </p>
//             </div>
//             <button
//               onClick={onClose}
//               className="p-2 hover:bg-white/20 rounded-full transition-colors"
//             >
//               <X className="h-6 w-6" />
//             </button>
//           </div>
//         </div>

//         {/* Modal Content */}
//         <div className="p-6">
//           {/* Mentor Info */}
//           <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 mb-6 border border-blue-100">
//             <div className="flex items-center space-x-4">
//               <img
//                 src={mentor?.image}
//                 alt={mentor?.name}
//                 className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-200"
//               />
//               <div className="flex-1">
//                 <h3 className="text-lg font-bold text-gray-900">
//                   {mentor?.name}
//                 </h3>
//                 <p className="text-sm text-blue-600">{mentor?.title}</p>
//                 <div className="flex items-center space-x-3 mt-1">
//                   <div className="flex items-center space-x-1">
//                     <Star className="h-4 w-4 text-yellow-400 fill-current" />
//                     <span className="text-sm font-medium text-gray-700">
//                       {mentor?.rating}
//                     </span>
//                   </div>
//                   <span className="text-2xl font-bold text-green-600">
//                     {mentor?.price}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Available Slots */}
//           {mentor?.sessions?.length > 0 && (
//             <div className="mb-6">
//               <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
//                 <Calendar className="h-4 w-4 mr-2 text-blue-600" />
//                 Select Available Time Slot
//               </label>
//               <div className="grid grid-cols-1 gap-2">
//                 {mentor.sessions.slice(0, 5).map((slot, index) => (
//                   <label
//                     key={index}
//                     className="flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50"
//                     style={{
//                       borderColor:
//                         selectedSlot === slot ? "#3B82F6" : "#E5E7EB",
//                       backgroundColor:
//                         selectedSlot === slot ? "#EFF6FF" : "white",
//                     }}
//                   >
//                     <input
//                       type="radio"
//                       name="slot"
//                       value={slot}
//                       checked={selectedSlot === slot}
//                       onChange={(e) => setSelectedSlot(e.target.value)}
//                       className="mr-3 text-blue-600 focus:ring-blue-500"
//                     />
//                     <Clock className="h-4 w-4 text-blue-600 mr-2" />
//                     <span className="text-sm font-medium text-gray-700">
//                       {slot}
//                     </span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Payment Method Selection */}
//           <div className="mb-6">
//             <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
//               <DollarSign className="h-4 w-4 mr-2 text-blue-600" />
//               Payment Method
//             </label>
//             <div className="grid grid-cols-2 gap-3">
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod("card")}
//                 className={`p-4 rounded-xl border-2 transition-all ${
//                   paymentMethod === "card"
//                     ? "border-blue-500 bg-blue-50"
//                     : "border-gray-200 hover:border-blue-300"
//                 }`}
//               >
//                 <CreditCard className="h-6 w-6 mx-auto mb-2 text-blue-600" />
//                 <p className="text-sm font-medium text-gray-700">Credit Card</p>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod("paypal")}
//                 className={`p-4 rounded-xl border-2 transition-all ${
//                   paymentMethod === "paypal"
//                     ? "border-blue-500 bg-blue-50"
//                     : "border-gray-200 hover:border-blue-300"
//                 }`}
//               >
//                 <DollarSign className="h-6 w-6 mx-auto mb-2 text-blue-600" />
//                 <p className="text-sm font-medium text-gray-700">PayPal</p>
//               </button>
//             </div>
//           </div>

//           {/* Payment Form */}
//           {paymentMethod === "card" && (
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Card Number
//                 </label>
//                 <input
//                   type="text"
//                   value={cardNumber}
//                   onChange={(e) => setCardNumber(e.target.value)}
//                   placeholder="1234 5678 9012 3456"
//                   className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Expiry Date
//                   </label>
//                   <input
//                     type="text"
//                     value={expiryDate}
//                     onChange={(e) => setExpiryDate(e.target.value)}
//                     placeholder="MM/YY"
//                     className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     CVV
//                   </label>
//                   <input
//                     type="text"
//                     value={cvv}
//                     onChange={(e) => setCvv(e.target.value)}
//                     placeholder="123"
//                     maxLength="3"
//                     className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                   />
//                 </div>
//               </div>

//               {/* Security Notice */}
//               <div className="flex items-start space-x-2 p-3 bg-green-50 rounded-xl border border-green-200">
//                 <Lock className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
//                 <p className="text-xs text-green-800">
//                   Your payment information is encrypted and secure. We never
//                   store your card details.
//                 </p>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex space-x-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={onClose}
//                   className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handlePayment}
//                   className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold transition-all shadow-lg hover:shadow-xl"
//                 >
//                   Confirm Payment
//                 </button>
//               </div>
//             </div>
//           )}

//           {paymentMethod === "paypal" && (
//             <div className="space-y-4">
//               <div className="p-8 text-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
//                 <DollarSign className="h-12 w-12 mx-auto mb-4 text-blue-600" />
//                 <p className="text-gray-600 mb-4">
//                   You will be redirected to PayPal to complete your payment
//                 </p>
//                 <button
//                   type="button"
//                   onClick={handlePayment}
//                   className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold transition-all shadow-lg hover:shadow-xl"
//                 >
//                   Continue to PayPal
//                 </button>
//               </div>
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="w-full px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

const PaymentModal = ({ isOpen, onClose, mentor }) => {
  const [selectedSlot, setSelectedSlot] = useState("");
  const userData = useSelector((state) => state.user.userData);

  if (!isOpen) return null;

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  const handlePayment = async () => {
    const userId = userData?.user?._id;
    const mentorId = mentor?._id || mentor?.id;
    if (!userId || !mentorId || !selectedSlot) {
      console.error("Missing user, mentor, or selected slot!");
      return;
    }

    const [datePart, timePart] = selectedSlot.split(" ");
    const sessionTimeArray = [{ date: datePart, time: timePart }];
    const price = parseFloat(mentor.price.replace(/[^0-9.]/g, "")); // convert "₹80" -> 80

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/session/create-session`,
        {
          userId,
          mentorId,
          sessionTime: sessionTimeArray,
          amountInCents: price * 100,
        }
      );

      const stripe = await stripePromise;
      if (!stripe) return console.error("Stripe failed to load!");
      window.location.href = data.url; // Redirect to Stripe Checkout
    } catch (error) {
      console.error("Payment Error:", error.response?.data || error.message);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Book Your Session</h2>
              <p className="text-blue-100 mt-1">
                Complete your booking with {mentor?.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Available Slots */}
          {mentor?.sessions?.length > 0 && (
            <div className="mb-6">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                Select Available Time Slot
              </label>
              <div className="grid grid-cols-1 gap-2">
                {mentor.sessions.slice(0, 5).map((slot, index) => (
                  <label
                    key={index}
                    className="flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50"
                    style={{
                      borderColor:
                        selectedSlot === slot ? "#3B82F6" : "#E5E7EB",
                      backgroundColor:
                        selectedSlot === slot ? "#EFF6FF" : "white",
                    }}
                  >
                    <input
                      type="radio"
                      name="slot"
                      value={slot}
                      checked={selectedSlot === slot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="mr-3 text-blue-600 focus:ring-blue-500"
                    />
                    <Clock className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">
                      {slot}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePayment}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              Book & Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FindMentors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [mentors, setMentors] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const userData = useSelector((state) => state.user.userData);
  const resumeData = useSelector((state) => state.user.resumeData);
  useEffect(() => {
    const fetchResume = async () => {
      try {
        if (!resumeData) {
          const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/resume/me`,
            {
              withCredentials: true,
            }
          );
          if (data) dispatch(setResumeData(data));
        }
      } catch (err) {
        console.error("Failed to fetch resume:", err);
      }
    };

    fetchResume();
  }, []);
 

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_API_URL}/skills/mentor`,
          { withCredentials: true }
        );
      
        // Map backend response to frontend mentor structure helper
        const mappedMentors = (result.data.mentors || []).map(
          (item, index) => ({
            key: index,
            id: item.mentor._id,
            name: item.mentor.user.username,
            expertise: item.mentor.skills,
            rating: item.matchScore,
            sessions:
              item.mentor?.availableSlots?.map(
                (slot) =>
                  `${new Date(slot.date).toLocaleDateString()} ${slot.time}`
              ) || [],
            location: "Remote",
            price: item.mentor?.fee ? `₹${item.mentor.fee}/hour` : "₹80/hour",
            image: getProfileImageSrc(item.mentor.profileImage),
            description: item.mentor.bio,
            category: "technology",
          })
        );

        setMentors(mappedMentors);
      } catch (err) {
        console.error("Error fetching mentors:", err);
      }
    };

    fetchMentors();
  }, []);

  const searchMentors = async () => {
    const result = await axios.post(
      `${import.meta.env.VITE_API_URL}/search`,
      searchTerm,
      { withCredentials: true }
    );
   
  };

  // Filter mentors based on search and filters
  const filteredMentors = useMemo(() => {
    return mentors.filter((mentor) => {
      const matchesSearch =
        searchTerm === "" ||
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.expertise.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "all" || mentor.category === selectedCategory;

      const matchesLocation =
        selectedLocation === "all" ||
        mentor.location
          .toLowerCase()
          .includes(selectedLocation.replace("-", " ")) ||
        (selectedLocation === "remote" &&
          mentor.location.toLowerCase() === "remote");

      const matchesPrice =
        priceRange === "all" ||
        (priceRange === "0-80" && mentor.priceValue <= 80) ||
        (priceRange === "81-100" &&
          mentor.priceValue >= 81 &&
          mentor.priceValue <= 100) ||
        (priceRange === "101+" && mentor.priceValue > 100);

      return (
        matchesSearch && matchesCategory && matchesLocation && matchesPrice
      );
    });
  }, [searchTerm, selectedCategory, selectedLocation, priceRange, mentors]);

  const handleBookSession = (mentor) => {
    setSelectedMentor(mentor);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Nav />

      {!resumeData ? (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Upload Your Resume
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              AI will parse your skills from your resume, and then you’ll be
              able to find mentors that match your expertise.
            </p>
          </div>
          <button
            onClick={() => navigate(`/upload-resume/${userData?.user?._id}`)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-colors duration-200"
          >
            Add Your Resume
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-12 pt-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
              Find Your Perfect
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Mentor
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with industry experts and accelerate your career growth
              with personalized mentorship
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      searchMentors(); // your search function
                    }
                  }}
                  type="text"
                  placeholder="Search by name, skills, company, or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Filters */}

            {/* Results Count */}
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                Showing{" "}
                <span className="font-semibold text-blue-600">
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
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                {/* Mentor Header */}
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-100 group-hover:ring-blue-300 transition-all duration-300"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                      {mentor.name}
                    </h3>
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {mentor.title}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {mentor.company}
                    </p>
                  </div>
                </div>

                {/* Rating and Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">
                      {mentor.rating}
                    </span>
                  </div>
                  <div className="flex flex-col items-end text-gray-500 text-sm">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{mentor.sessions?.length || 0} sessions</span>
                    </div>
                    {mentor.sessions?.length > 0 && (
                      <span className="text-xs text-gray-400">
                        Next: {mentor.sessions[0]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Location and Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm truncate">{mentor.location}</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {mentor.price}
                  </span>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {mentor.expertise.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {mentor.expertise.length > 3 && (
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                        +{mentor.expertise.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {mentor.description}
                </p>

                {/* Book Session Button */}
                <button
                  onClick={() => handleBookSession(mentor)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group-hover:scale-105 cursor-pointer"
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
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No mentors found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search criteria or filters to find more
                  mentors.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setSelectedLocation("all");
                    setPriceRange("all");
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
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
    </div>
  );
};

export default FindMentors;
