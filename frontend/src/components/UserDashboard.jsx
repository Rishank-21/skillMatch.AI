
// import React, { useEffect, useState } from 'react';
// import { CheckCircle, Clock, Upload, Users, Calendar, Sparkles, Target, Zap, ArrowRight } from "lucide-react";
// import Nav from './Nav.jsx';
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import axios from 'axios';

// const UserDashboard = ({scrollToId}) => {
//   const userData = useSelector((state) => state.user.userData);
//   const [upcomingStatus, setUpcomingStatus] = useState([]);
//   const [completedSessions, setCompletedSessions] = useState([]);

//   useEffect(() => {
//     const fetchSessions = async () => {
//       try {
//         const result = await axios.get(
//           `${import.meta.env.VITE_API_URL}/session/all`,
//           { withCredentials: true }
//         );

//         const upcoming = result.data.filter(session => session.status === "upcoming");
//         const completed = result.data.filter(session => session.status === "completed");

//         setUpcomingStatus(upcoming);
//         setCompletedSessions(completed);

//       } catch (error) {
//         console.error("Failed to fetch sessions:", error);
//       }
//     };

//     fetchSessions();
//   }, []);

//   const navigate = useNavigate();

//   return (
//     <div id='home-top' className='min-h-screen w-full bg-slate-950 text-white overflow-x-hidden relative'>
//       {/* Animated Background */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
//         <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
//         <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '4s'}}></div>
//       </div>

//       <Nav />
      
//       {/* Hero Section */}
//       <div className='relative z-10 pt-[120px] flex flex-col items-center gap-8'>
//         <div className="text-center max-w-3xl px-6">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-purple-500/30">
//             <Sparkles className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
//             Welcome Back!
//           </h1>
//           <p className="text-lg text-slate-400 leading-relaxed">
//             Continue your mentorship journey and track your progress
//           </p>

//           {scrollToId && (
//             <div className="mt-6 flex justify-center">
//               <button
//                 onClick={() => scrollToId('quick-actions')}
//                 className="group px-6 sm:px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2 cursor-pointer"
//               >
//                 <Zap className="w-5 h-5" />
//                 Jump to Quick Actions
//                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Stats Cards */}
//         <div className='flex flex-row items-center justify-center flex-wrap w-full max-w-4xl px-6 gap-6'>
//           <div className='relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 hover:scale-[1.02] hover:border-green-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 min-w-[280px]'>
//             <div className='h-full w-1 bg-gradient-to-b from-green-400 to-green-600 absolute left-0 top-0 rounded-l-2xl'></div>
//             <div className='flex items-center gap-6'>
//               <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl border border-green-500/30'>
//                 <CheckCircle className="w-8 h-8 text-green-400" />
//               </div>
//               <div className='flex flex-col items-start'>
//                 <h3 className='font-semibold text-slate-400 text-sm uppercase tracking-wide'>Completed Sessions</h3>
//                 <p className='font-bold text-3xl text-white mt-1'>{completedSessions.length}</p>
//               </div>
//             </div>
//           </div>

//           <div className='relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 hover:scale-[1.02] hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 min-w-[280px]'>
//             <div className='h-full w-1 bg-gradient-to-b from-purple-400 to-purple-600 absolute left-0 top-0 rounded-l-2xl'></div>
//             <div className='flex items-center gap-6'>
//               <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl border border-purple-500/30'>
//                 <Clock className="w-8 h-8 text-purple-400" />
//               </div>
//               <div className='flex flex-col items-start'>
//                 <h3 className='font-semibold text-slate-400 text-sm uppercase tracking-wide'>Upcoming Sessions</h3>
//                 <p className='font-bold text-3xl text-white mt-1'>{upcomingStatus.length}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Journey Steps Section */}
//       <div id="journey" className='relative z-10 mt-20 w-full flex flex-col items-center px-6'>
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl mb-4 border border-cyan-500/30">
//             <Target className="w-6 h-6 text-cyan-400" />
//           </div>
//           <h2 className='font-bold text-3xl text-white mb-2'>Start Your Journey</h2>
//           <p className="text-slate-400">Follow these simple steps to begin your mentorship experience</p>
//         </div>

//         <div className='mt-6 w-[90vw] md:w-[80vw] lg:w-[60vw] flex flex-col md:flex-row items-center justify-center gap-6'>
//           <div className='relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 flex items-center gap-6 w-full hover:scale-[1.02] hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 group'>
//             <div className='h-full w-1 bg-gradient-to-b from-cyan-400 to-cyan-600 absolute left-0 top-0 rounded-l-2xl'></div>
//             <div className='flex items-center gap-6'>
//               <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-2xl border border-cyan-500/30 group-hover:scale-110 transition-transform duration-200'>
//                 <Upload className="w-6 h-6 text-cyan-400" />
//               </div>
//               <div className='flex flex-col items-start'>
//                 <div className='flex items-center gap-2 mb-1'>
//                   <span className='inline-flex items-center justify-center w-6 h-6 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-xs font-bold rounded-full'>1</span>
//                   <h3 className='font-semibold text-slate-400 text-sm'>STEP 1</h3>
//                 </div>
//                 <p className='font-bold text-lg text-white'>Upload Your Resume</p>
//               </div>
//             </div>
//           </div>

//           <div className='relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 flex items-center gap-6 w-full hover:scale-[1.02] hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 group'>
//             <div className='h-full w-1 bg-gradient-to-b from-purple-400 to-purple-600 absolute left-0 top-0 rounded-l-2xl'></div>
//             <div className='flex items-center gap-6'>
//               <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl border border-purple-500/30 group-hover:scale-110 transition-transform duration-200'>
//                 <Users className="w-6 h-6 text-purple-400" />
//               </div>
//               <div className='flex flex-col items-start'>
//                 <div className='flex items-center gap-2 mb-1'>
//                   <span className='inline-flex items-center justify-center w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold rounded-full'>2</span>
//                   <h3 className='font-semibold text-slate-400 text-sm'>STEP 2</h3>
//                 </div>
//                 <p className='font-bold text-lg text-white'>Find Mentors</p>
//               </div>
//             </div>
//           </div>

//           <div className='relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 flex items-center gap-6 w-full hover:scale-[1.02] hover:border-pink-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10 group'>
//             <div className='h-full w-1 bg-gradient-to-b from-pink-400 to-pink-600 absolute left-0 top-0 rounded-l-2xl'></div>
//             <div className='flex items-center gap-6'>
//               <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-2xl border border-pink-500/30 group-hover:scale-110 transition-transform duration-200'>
//                 <Calendar className="w-6 h-6 text-pink-400" />
//               </div>
//               <div className='flex flex-col items-start'>
//                 <div className='flex items-center gap-2 mb-1'>
//                   <span className='inline-flex items-center justify-center w-6 h-6 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs font-bold rounded-full'>3</span>
//                   <h3 className='font-semibold text-slate-400 text-sm'>STEP 3</h3>
//                 </div>
//                 <p className='font-bold text-lg text-white'>Book Sessions</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions Section */}
//       <div id="quick-actions" className='relative z-10 mt-20 w-full min-h-[40vh] flex flex-col items-center px-6 pb-20'>
//         <div className='text-center mb-12'>
//           <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl mb-4 border border-purple-500/30">
//             <Zap className="w-6 h-6 text-purple-400" />
//           </div>
//           <h2 className='font-bold text-3xl text-white mb-2'>Quick Actions</h2>
//           <p className="text-slate-400">Access your most used features instantly</p>
//         </div>
        
//         <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-4xl'>
//           <div 
//             className='group bg-slate-900/50 backdrop-blur-xl flex items-center flex-col border border-slate-800 rounded-2xl p-8 hover:scale-[1.02] hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 cursor-pointer relative'
//             onClick={() => navigate(`/upload-resume/${userData.user._id}`)}
//           >
//             <div className='bg-gradient-to-b from-cyan-400 to-cyan-600 absolute left-0 top-0 h-full w-1 rounded-l-2xl'></div>
//             <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-2xl border border-cyan-500/30 mb-4 group-hover:scale-110 transition-transform duration-200'>
//               <Upload className="w-6 h-6 text-cyan-400" />
//             </div>
//             <p className='font-semibold text-white'>Upload Resume</p>
//             <p className='text-sm text-slate-400 text-center mt-2'>Share your experience with mentors</p>
//           </div>
          
//           <div 
//             className='group bg-slate-900/50 backdrop-blur-xl flex items-center flex-col border border-slate-800 rounded-2xl p-8 hover:scale-[1.02] hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer relative'
//             onClick={() => navigate(`/mentors/${userData.user._id}`)}
//           >
//             <div className='bg-gradient-to-b from-purple-400 to-purple-600 absolute left-0 top-0 h-full w-1 rounded-l-2xl'></div>
//             <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl border border-purple-500/30 mb-4 group-hover:scale-110 transition-transform duration-200'>
//               <Users className="w-6 h-6 text-purple-400" />
//             </div>
//             <p className='font-semibold text-white'>Find Mentors</p>
//             <p className='text-sm text-slate-400 text-center mt-2'>Discover amazing mentors</p>
//           </div>
          
//           <div 
//             className='group bg-slate-900/50 backdrop-blur-xl flex items-center flex-col border border-slate-800 rounded-2xl p-8 hover:scale-[1.02] hover:border-pink-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10 cursor-pointer relative'
//             onClick={() => navigate(`/sessions/${userData.user._id}`)}
//           >
//             <div className='bg-gradient-to-b from-pink-400 to-pink-600 absolute left-0 top-0 h-full w-1 rounded-l-2xl'></div>
//             <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-2xl border border-pink-500/30 mb-4 group-hover:scale-110 transition-transform duration-200'>
//               <Calendar className="w-6 h-6 text-pink-400" />
//             </div>
//             <p className='font-semibold text-white'>Scheduled Sessions</p>
//             <p className='text-sm text-slate-400 text-center mt-2'>Manage your appointments</p>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className='relative z-10 w-full bg-slate-900/50 backdrop-blur-xl border-t border-slate-800 text-white mt-20'>
//         <div className='flex flex-col md:flex-row items-center justify-around py-8 px-6 gap-4'>
//           <div className='flex items-center gap-2'>
//             <Sparkles className="w-6 h-6 text-cyan-400" />
//             <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
//               SkillMatch.AI
//             </span>
//           </div>
//           <div className='text-slate-400 font-semibold flex items-center gap-2'>
//             Made With 
//             <span className="text-red-400">❤</span> 
//             by Team Tech Titans
//           </div>
//           <div className='text-slate-400 font-semibold text-sm'>
//             © 2025 All rights reserved.
//           </div>
//         </div>
//       </footer>

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

// export default UserDashboard;


import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, Upload, Users, Calendar, Sparkles, Target, Zap, ArrowRight } from "lucide-react";
import Nav from './Nav.jsx';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast'; // ✅ Import toast

const UserDashboard = ({scrollToId}) => {
  const userData = useSelector((state) => state.user.userData);
  const [upcomingStatus, setUpcomingStatus] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Add loading state

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const result = await axios.get(
          `${import.meta.env.VITE_API_URL}/session/all`,
          { withCredentials: true }
        );

        const upcoming = result.data.filter(session => session.status === "upcoming");
        const completed = result.data.filter(session => session.status === "completed");

        setUpcomingStatus(upcoming);
        setCompletedSessions(completed);

      } catch (error) {
        console.error("Failed to fetch sessions:", error);
        toast.error('Failed to load sessions. Please refresh the page.'); // ✅ Error toast
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const navigate = useNavigate();

  // ✅ Add click handlers with toast feedback
  const handleUploadResume = () => {
    navigate(`/upload-resume/${userData.user._id}`);
    toast.success('Opening resume upload...', { duration: 2000 });
  };

  const handleFindMentors = () => {
    navigate(`/mentors/${userData.user._id}`);
    toast.success('Finding mentors for you...', { duration: 2000 });
  };

  const handleViewSessions = () => {
    navigate(`/sessions/${userData.user._id}`);
    toast.success('Loading your sessions...', { duration: 2000 });
  };

  return (
    <div id='home-top' className='min-h-screen w-full bg-slate-950 text-white overflow-x-hidden relative'>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <Nav />
      
      {/* Hero Section */}
      <div className='relative z-10 pt-[120px] flex flex-col items-center gap-8'>
        <div className="text-center max-w-3xl px-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-purple-500/30">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Welcome Back, {userData?.user?.username || 'User'}! {/* ✅ Personalized greeting */}
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Continue your mentorship journey and track your progress
          </p>

          {scrollToId && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => scrollToId('quick-actions')}
                className="group px-6 sm:px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2 cursor-pointer"
              >
                <Zap className="w-5 h-5" />
                Jump to Quick Actions
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className='flex flex-row items-center justify-center flex-wrap w-full max-w-4xl px-6 gap-6'>
          <div className='relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 hover:scale-[1.02] hover:border-green-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 min-w-[280px]'>
            <div className='h-full w-1 bg-gradient-to-b from-green-400 to-green-600 absolute left-0 top-0 rounded-l-2xl'></div>
            <div className='flex items-center gap-6'>
              <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl border border-green-500/30'>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <div className='flex flex-col items-start'>
                <h3 className='font-semibold text-slate-400 text-sm uppercase tracking-wide'>Completed Sessions</h3>
                <p className='font-bold text-3xl text-white mt-1'>
                  {loading ? (
                    <span className="inline-block w-12 h-8 bg-slate-700 animate-pulse rounded"></span>
                  ) : (
                    completedSessions.length
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className='relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 hover:scale-[1.02] hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 min-w-[280px]'>
            <div className='h-full w-1 bg-gradient-to-b from-purple-400 to-purple-600 absolute left-0 top-0 rounded-l-2xl'></div>
            <div className='flex items-center gap-6'>
              <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl border border-purple-500/30'>
                <Clock className="w-8 h-8 text-purple-400" />
              </div>
              <div className='flex flex-col items-start'>
                <h3 className='font-semibold text-slate-400 text-sm uppercase tracking-wide'>Upcoming Sessions</h3>
                <p className='font-bold text-3xl text-white mt-1'>
                  {loading ? (
                    <span className="inline-block w-12 h-8 bg-slate-700 animate-pulse rounded"></span>
                  ) : (
                    upcomingStatus.length
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Journey Steps Section */}
      <div id="journey" className='relative z-10 mt-20 w-full flex flex-col items-center px-6'>
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl mb-4 border border-cyan-500/30">
            <Target className="w-6 h-6 text-cyan-400" />
          </div>
          <h2 className='font-bold text-3xl text-white mb-2'>Start Your Journey</h2>
          <p className="text-slate-400">Follow these simple steps to begin your mentorship experience</p>
        </div>

        <div className='mt-6 w-[90vw] md:w-[80vw] lg:w-[60vw] flex flex-col md:flex-row items-center justify-center gap-6'>
          <div className='relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 flex items-center gap-6 w-full hover:scale-[1.02] hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 group'>
            <div className='h-full w-1 bg-gradient-to-b from-cyan-400 to-cyan-600 absolute left-0 top-0 rounded-l-2xl'></div>
            <div className='flex items-center gap-6'>
              <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-2xl border border-cyan-500/30 group-hover:scale-110 transition-transform duration-200'>
                <Upload className="w-6 h-6 text-cyan-400" />
              </div>
              <div className='flex flex-col items-start'>
                <div className='flex items-center gap-2 mb-1'>
                  <span className='inline-flex items-center justify-center w-6 h-6 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-xs font-bold rounded-full'>1</span>
                  <h3 className='font-semibold text-slate-400 text-sm'>STEP 1</h3>
                </div>
                <p className='font-bold text-lg text-white'>Upload Your Resume</p>
              </div>
            </div>
          </div>

          <div className='relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 flex items-center gap-6 w-full hover:scale-[1.02] hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 group'>
            <div className='h-full w-1 bg-gradient-to-b from-purple-400 to-purple-600 absolute left-0 top-0 rounded-l-2xl'></div>
            <div className='flex items-center gap-6'>
              <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl border border-purple-500/30 group-hover:scale-110 transition-transform duration-200'>
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div className='flex flex-col items-start'>
                <div className='flex items-center gap-2 mb-1'>
                  <span className='inline-flex items-center justify-center w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold rounded-full'>2</span>
                  <h3 className='font-semibold text-slate-400 text-sm'>STEP 2</h3>
                </div>
                <p className='font-bold text-lg text-white'>Find Mentors</p>
              </div>
            </div>
          </div>

          <div className='relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 flex items-center gap-6 w-full hover:scale-[1.02] hover:border-pink-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10 group'>
            <div className='h-full w-1 bg-gradient-to-b from-pink-400 to-pink-600 absolute left-0 top-0 rounded-l-2xl'></div>
            <div className='flex items-center gap-6'>
              <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-2xl border border-pink-500/30 group-hover:scale-110 transition-transform duration-200'>
                <Calendar className="w-6 h-6 text-pink-400" />
              </div>
              <div className='flex flex-col items-start'>
                <div className='flex items-center gap-2 mb-1'>
                  <span className='inline-flex items-center justify-center w-6 h-6 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs font-bold rounded-full'>3</span>
                  <h3 className='font-semibold text-slate-400 text-sm'>STEP 3</h3>
                </div>
                <p className='font-bold text-lg text-white'>Book Sessions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div id="quick-actions" className='relative z-10 mt-20 w-full min-h-[40vh] flex flex-col items-center px-6 pb-20'>
        <div className='text-center mb-12'>
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl mb-4 border border-purple-500/30">
            <Zap className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className='font-bold text-3xl text-white mb-2'>Quick Actions</h2>
          <p className="text-slate-400">Access your most used features instantly</p>
        </div>
        
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-4xl'>
          <div 
            className='group bg-slate-900/50 backdrop-blur-xl flex items-center flex-col border border-slate-800 rounded-2xl p-8 hover:scale-[1.02] hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 cursor-pointer relative'
            onClick={handleUploadResume} // ✅ Updated with toast handler
          >
            <div className='bg-gradient-to-b from-cyan-400 to-cyan-600 absolute left-0 top-0 h-full w-1 rounded-l-2xl'></div>
            <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-2xl border border-cyan-500/30 mb-4 group-hover:scale-110 transition-transform duration-200'>
              <Upload className="w-6 h-6 text-cyan-400" />
            </div>
            <p className='font-semibold text-white'>Upload Resume</p>
            <p className='text-sm text-slate-400 text-center mt-2'>Share your experience with mentors</p>
          </div>
          
          <div 
            className='group bg-slate-900/50 backdrop-blur-xl flex items-center flex-col border border-slate-800 rounded-2xl p-8 hover:scale-[1.02] hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer relative'
            onClick={handleFindMentors} // ✅ Updated with toast handler
          >
            <div className='bg-gradient-to-b from-purple-400 to-purple-600 absolute left-0 top-0 h-full w-1 rounded-l-2xl'></div>
            <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl border border-purple-500/30 mb-4 group-hover:scale-110 transition-transform duration-200'>
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <p className='font-semibold text-white'>Find Mentors</p>
            <p className='text-sm text-slate-400 text-center mt-2'>Discover amazing mentors</p>
          </div>
          
          <div 
            className='group bg-slate-900/50 backdrop-blur-xl flex items-center flex-col border border-slate-800 rounded-2xl p-8 hover:scale-[1.02] hover:border-pink-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10 cursor-pointer relative'
            onClick={handleViewSessions} // ✅ Updated with toast handler
          >
            <div className='bg-gradient-to-b from-pink-400 to-pink-600 absolute left-0 top-0 h-full w-1 rounded-l-2xl'></div>
            <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-2xl border border-pink-500/30 mb-4 group-hover:scale-110 transition-transform duration-200'>
              <Calendar className="w-6 h-6 text-pink-400" />
            </div>
            <p className='font-semibold text-white'>Scheduled Sessions</p>
            <p className='text-sm text-slate-400 text-center mt-2'>Manage your appointments</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className='relative z-10 w-full bg-slate-900/50 backdrop-blur-xl border-t border-slate-800 text-white mt-20'>
        <div className='flex flex-col md:flex-row items-center justify-around py-8 px-6 gap-4'>
          <div className='flex items-center gap-2'>
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              SkillMatch.AI
            </span>
          </div>
          <div className='text-slate-400 font-semibold flex items-center gap-2'>
            Made With 
            <span className="text-red-400">❤</span> 
            by Team Tech Titans
          </div>
          <div className='text-slate-400 font-semibold text-sm'>
            © 2025 All rights reserved.
          </div>
        </div>
      </footer>

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

export default UserDashboard;