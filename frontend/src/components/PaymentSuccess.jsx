// import { useLocation, useNavigate } from "react-router-dom";
// import { useEffect } from "react";
// import React from "react";
// import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// const PaymentSuccess = () => {

// const location = useLocation();
//   const navigate = useNavigate();
//   const userData = useSelector((state) => state.user.userData);

//   const sessionId = new URLSearchParams(location.search).get("session_id");

//   useEffect(() => {
//     if (!sessionId) return;

//     const sendSessionToBackend = async () => {
//       try {
//         const { data } = await axios.post(
//           `${import.meta.env.VITE_API_URL}/session/verify-payment`,
//           { sessionId }
//         );
        
//       } catch (error) {
//         console.error(
//           "Error sending session to backend:",
//           error.response?.data || error.message
//         );
//       }
//     };

//     sendSessionToBackend();
//   }, [sessionId]);


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
//       <div className="max-w-md w-full">
//         {/* Success Animation Container helper */}
//         <div className="bg-white rounded-3xl shadow-2xl p-8 transform transition-all duration-500 hover:scale-105">
//           {/* Icon Section */}
//           <div className="relative mb-6">
//             <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-500 blur-3xl opacity-20 rounded-full"></div>
//             <div className="relative bg-gradient-to-br from-violet-500 to-purple-600 w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-lg">
//               <CheckCircle className="w-14 h-14 text-white animate-pulse" />
//             </div>
//             <div className="absolute top-0 right-1/4 animate-bounce">
//               <Sparkles className="w-6 h-6 text-violet-400" />
//             </div>
//             <div className="absolute bottom-0 left-1/4 animate-bounce delay-100">
//               <Sparkles className="w-5 h-5 text-purple-400" />
//             </div>
//           </div>

//           {/* Text Content */}
//           <div className="text-center space-y-4 mb-8">
//             <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
//               Payment Successful!
//             </h2>
//             <p className="text-gray-600 text-lg leading-relaxed">
//               Your mentorship session has been booked successfully.
//             </p>
            
//             {sessionId && (
//               <div className="mt-6 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-200">
//                 <p className="text-sm text-gray-500 mb-1">Session ID</p>
//                 <p className="text-xs font-mono text-violet-600 break-all">{sessionId}</p>
//               </div>
//             )}
//           </div>

//           {/* Action Button */}
//           <button className="w-full group relative bg-gradient-to-r from-violet-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden cursor-pointer" onClick={() => navigate(`/sessions/${userData.user._id}`)}>
//             <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
//             <span className="relative flex items-center justify-center gap-2">
//               Go To See Session
//               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
//             </span>
//           </button>

//           {/* Decorative Bottom Border */}
//           <div className="mt-6 pt-6 border-t border-gray-100">
//             <p className="text-center text-sm text-gray-400">
//               You'll receive a confirmation email shortly
//             </p>
//           </div>
//         </div>

//         {/* Floating Decoration Elements */}
//         <div className="absolute top-20 left-10 w-20 h-20 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
//         <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-700"></div>
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccess;

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import React from "react";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from 'react-hot-toast'; // ✅ Import toast

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.user.userData);

    const sessionId = new URLSearchParams(location.search).get("session_id");

    useEffect(() => {
        // ✅ Enhanced: Ensure user data is available before proceeding
        

        if (!sessionId) {
            toast.error("Error: Missing session ID for verification."); // ✅ Already present
            setTimeout(() => {
                navigate('/dashboard'); // ✅ Redirect to dashboard if no session ID
            }, 2000);
            return;
        }

        const sendSessionToBackend = async () => {
            const verificationPromise = axios.post(
                `${import.meta.env.VITE_API_URL}/session/verify-payment`,
                { sessionId },
                { withCredentials: true } // ✅ Add credentials for consistency
            );

            toast.promise(verificationPromise, {
                loading: 'Verifying payment and booking session...', // ✅ Already present
                success: (response) => {
                    // Navigate after successful verification
                    // Delay navigation slightly to let the toast be seen
                    setTimeout(() => {
                        navigate(`/sessions/${userData.user._id}`);
                    }, 1500); // ✅ Increased delay slightly for better UX
                    
                    return 'Payment verified! Your session is officially booked. 🎉'; // ✅ Added emoji
                },
                error: (error) => {
                    console.error(
                        "Error sending session to backend:",
                        error.response?.data || error.message
                    );
                    const errorMessage = error.response?.data?.message || 'Payment verification failed. Please contact support.';
                    
                    // ✅ Redirect to support or sessions page on error
                    setTimeout(() => {
                        navigate(`/sessions/${userData.user._id}`);
                    }, 3000);
                    
                    return `Verification failed: ${errorMessage}`;
                },
            }, {
                // ✅ Custom toast options for this specific promise
                success: {
                    duration: 4000,
                    icon: '✅',
                },
                error: {
                    duration: 5000,
                    icon: '❌',
                },
            });
        };

        sendSessionToBackend();
    }, [sessionId, navigate, userData]); // ✅ Fixed: Use entire userData object in deps

    // ✅ Loading state while userData is being fetched
    if (!userData || !userData.user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Success Animation Container */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 transform transition-all duration-500 hover:scale-105">
                    {/* Icon Section */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-500 blur-3xl opacity-20 rounded-full"></div>
                        <div className="relative bg-gradient-to-br from-violet-500 to-purple-600 w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-lg">
                            <CheckCircle className="w-14 h-14 text-white animate-pulse" />
                        </div>
                        <div className="absolute top-0 right-1/4 animate-bounce">
                            <Sparkles className="w-6 h-6 text-violet-400" />
                        </div>
                        <div className="absolute bottom-0 left-1/4 animate-bounce delay-100">
                            <Sparkles className="w-5 h-5 text-purple-400" />
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="text-center space-y-4 mb-8">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                            Payment Successful!
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Your mentorship session has been booked successfully.
                        </p>
                        
                        {sessionId && (
                            <div className="mt-6 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-200">
                                <p className="text-sm text-gray-500 mb-1">Session ID</p>
                                <p className="text-xs font-mono text-violet-600 break-all">{sessionId}</p>
                            </div>
                        )}
                    </div>

                    {/* Action Button */}
                    <button 
                        className="w-full group relative bg-gradient-to-r from-violet-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden cursor-pointer" 
                        onClick={() => {
                            navigate(`/sessions/${userData.user._id}`);
                            toast.success('Redirecting to your sessions...', { // ✅ Added feedback toast
                                icon: '📅',
                                duration: 2000
                            });
                        }}
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        <span className="relative flex items-center justify-center gap-2">
                            View Your Session
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                    </button>

                    {/* Decorative Bottom Border */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <p className="text-center text-sm text-gray-400">
                            You'll receive a confirmation email shortly 📧
                        </p>
                    </div>
                </div>

                {/* Floating Decoration Elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-700"></div>
            </div>
        </div>
    );
};

export default PaymentSuccess;