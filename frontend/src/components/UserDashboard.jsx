import React, { useEffect, useState } from 'react'
import { FaCheckCircle } from "react-icons/fa";
import { MdWatchLater } from "react-icons/md";
import { GiStairsGoal } from "react-icons/gi";
import { FaUpload } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";
import Nav from './Nav.jsx'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BiLogoJoomla } from "react-icons/bi";
import axios from 'axios';
const UserDashboard = ({scrollToId}) => {
  const userData = useSelector((state) => state.user.userData)

  const [upcomingStatus, setUpcomingStatus] = useState([])
  const [completedSessions, setCompletedSessions] = useState([])


useEffect(() => {
  const fetchSessions = async () => {
    try {
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
    }
  };

  fetchSessions();
}, []);

  
  const navigate = useNavigate()
  return (
    <div id='home-top' className='min-h-screen w-full bg-gradient-to-br from-violet-50 via-indigo-50 to-indigo-100 overflow-x-hidden'>
      <Nav />
      
      {/* Hero Section with Enhanced Header */}
      <div className='pt-[120px] flex flex-col items-center gap-8'>
        <div className="text-center max-w-3xl px-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome Back!
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Continue your mentorship journey and track your progress
          </p>

           {scrollToId && (
           <div className="mt-6 flex justify-center">
  <button
    onClick={() => scrollToId('quick-actions')}
    className="px-6 sm:px-8 py-3 sm:py-3.5 
               bg-gradient-to-r from-violet-600 to-indigo-600 
               text-white font-semibold rounded-xl 
               shadow-md hover:shadow-lg 
               hover:from-violet-700 hover:to-indigo-700 
               active:scale-95 
               transition-all duration-200 
               flex items-center justify-center gap-2 cursor-pointer"
  >
    🚀 Jump to Quick Actions
  </button>
</div>
          )}

        </div>

        {/* Stats Cards  helper*/}
        <div className='flex flex-row items-center justify-center flex-wrap w-full max-w-4xl px-6'>
          <div className='relative bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl m-4 p-8 hover:scale-[1.02] transition-all hover:shadow-2xl duration-300 ease-in-out border border-white/20'>
            <div className='h-[100%] w-[3px] bg-gradient-to-b from-green-400 to-green-600 absolute left-0 top-0 rounded-l-2xl'></div>
            <div className='flex items-center gap-6'>
             <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl'>
                <FaCheckCircle size={32} className="text-green-600" />
             </div>
             <div className='flex flex-col items-start'>
               <h3 className='font-semibold text-gray-600 text-sm uppercase tracking-wide'>Completed Sessions</h3>
              <p className='font-bold text-3xl text-gray-800 mt-1'>{completedSessions.length}</p>
             </div>
            </div>
          </div>

          <div className='relative bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl m-4 p-8 hover:scale-[1.02] transition-all hover:shadow-2xl duration-300 ease-in-out border border-white/20'>
            <div className='h-[100%] w-[3px] bg-gradient-to-b from-violet-400 to-violet-600 absolute left-0 top-0 rounded-l-2xl'></div>
            <div className='flex items-center gap-6'>
             <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-100 to-violet-200 rounded-2xl'>
                <MdWatchLater size={32} className="text-violet-600" />
             </div>
             <div className='flex flex-col items-start'>
               <h3 className='font-semibold text-gray-600 text-sm uppercase tracking-wide'>Upcoming Sessions</h3>
              <p className='font-bold text-3xl text-gray-800 mt-1'>{upcomingStatus.length}</p>
             </div>
            </div>
          </div>
        </div>
      </div>

      {/* Journey Steps Section */}
      <div  id="journey" className='mt-20 w-full flex flex-col items-center px-6'>
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-violet-100 to-indigo-100 rounded-xl mb-4">
              <GiStairsGoal size={24} className='text-violet-600' />
            </div>
            <h2 className='font-bold text-3xl text-gray-800 mb-2'>Start Your Journey</h2>
            <p className="text-gray-600">Follow these simple steps to begin your mentorship experience</p>
          </div>

          <div className='mt-6 w-[90vw] md:w-[80vw] lg:w-[60vw] flex flex-col md:flex-row items-center justify-center gap-6'>
            <div className='relative bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-8 flex items-center gap-6 w-full hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl group'>
              <div className='h-[100%] w-[3px] bg-gradient-to-b from-indigo-400 to-indigo-600 absolute left-0 top-0 rounded-l-2xl'></div>
              <div className='flex items-center gap-6'>
                <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-2xl group-hover:scale-110 transition-transform duration-200'>
                  <FaUpload size={24} className="text-indigo-600" />
                </div>
                <div className='flex flex-col items-start'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='inline-flex items-center justify-center w-6 h-6 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-xs font-bold rounded-full'>1</span>
                    <h3 className='font-semibold text-gray-600 text-sm'>STEP 1</h3>
                  </div>
                  <p className='font-bold text-lg text-gray-800'>Upload Your Resume</p>
                </div>
              </div>
            </div>

            <div className='relative bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-8 flex items-center gap-6 w-full hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl group'>
              <div className='h-[100%] w-[3px] bg-gradient-to-b from-violet-400 to-violet-600 absolute left-0 top-0 rounded-l-2xl'></div>
              <div className='flex items-center gap-6'>
                <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-100 to-violet-200 rounded-2xl group-hover:scale-110 transition-transform duration-200'>
                  <IoPersonSharp size={24} className="text-violet-600" />
                </div>
                <div className='flex flex-col items-start'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='inline-flex items-center justify-center w-6 h-6 bg-gradient-to-r from-violet-500 to-violet-600 text-white text-xs font-bold rounded-full'>2</span>
                    <h3 className='font-semibold text-gray-600 text-sm'>STEP 2</h3>
                  </div>
                  <p className='font-bold text-lg text-gray-800'>Find Mentors</p>
                </div>
              </div>
            </div>

            <div className='relative bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-8 flex items-center gap-6 w-full hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl group'>
              <div className='h-[100%] w-[3px] bg-gradient-to-b from-green-400 to-green-600 absolute left-0 top-0 rounded-l-2xl'></div>
              <div className='flex items-center gap-6'>
                <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl group-hover:scale-110 transition-transform duration-200'>
                  <FaCalendarAlt size={24} className="text-green-600" />
                </div>
                <div className='flex flex-col items-start'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='inline-flex items-center justify-center w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold rounded-full'>3</span>
                    <h3 className='font-semibold text-gray-600 text-sm'>STEP 3</h3>
                  </div>
                  <p className='font-bold text-lg text-gray-800'>Book Sessions</p>
                </div>
              </div>
            </div>
          </div>
      </div>

      {/* Quick Actions Section */}
      <div id="quick-actions" className='mt-20 w-full min-h-[40vh] flex flex-col items-center px-6'>
        <div className='text-center mb-12'>
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-violet-100 to-indigo-100 rounded-xl mb-4">
            <svg className="w-6 h-6 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className='font-bold text-3xl text-gray-800 mb-2'>Quick Actions</h2>
          <p className="text-gray-600">Access your most used features instantly</p>
        </div>
        
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-4xl'>
          <div className='group bg-white/80 backdrop-blur-sm flex items-center flex-col shadow-xl rounded-2xl p-8 hover:scale-[1.02] transition-all hover:shadow-2xl duration-300 ease-in-out hover:cursor-pointer border border-white/20 relative'onClick={() => navigate(`/upload-resume/${userData.user._id}`)}>
            <div className='bg-gradient-to-b from-indigo-400 to-indigo-600 absolute left-0 top-0 h-full w-[3px] rounded-l-2xl'></div>
            <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-200'>
              <FaUpload size={24} className="text-indigo-600" />
            </div>
            <p className='font-semibold text-gray-800'>Upload Resume</p>
            <p className='text-sm text-gray-600 text-center mt-2'>Share your experience with mentors</p>
          </div>
          
          <div className='group bg-white/80 backdrop-blur-sm flex items-center flex-col shadow-xl rounded-2xl p-8 hover:scale-[1.02] transition-all hover:shadow-2xl duration-300 ease-in-out hover:cursor-pointer border border-white/20 relative'onClick={() => navigate(`/mentors/${userData.user._id}`)}>
            <div className='bg-gradient-to-b from-violet-400 to-violet-600 absolute left-0 top-0 h-full w-[3px] rounded-l-2xl'></div>
            <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-100 to-violet-200 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-200'>
              <IoPersonSharp size={24} className='text-violet-600'/>
            </div>
            <p className='font-semibold text-gray-800'>Find Mentors</p>
            <p className='text-sm text-gray-600 text-center mt-2'>Discover amazing mentors</p>
          </div>
          
          <div className='group bg-white/80 backdrop-blur-sm flex items-center flex-col shadow-xl rounded-2xl p-8 hover:scale-[1.02] transition-all hover:shadow-2xl duration-300 ease-in-out hover:cursor-pointer border border-white/20 relative'onClick={() => navigate(`/sessions/${userData.user._id}`)}>
            <div className='bg-gradient-to-b from-green-400 to-green-600 absolute left-0 top-0 h-full w-[3px] rounded-l-2xl'></div>
            <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-200'>
              <FaCalendarAlt size={24} className="text-green-600" />
            </div>
            <p className='font-semibold text-gray-800'>Scheduled Sessions</p>
            <p className='text-sm text-gray-600 text-center mt-2'>Manage your appointments</p>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className='w-full bg-gradient-to-r from-gray-900 via-violet-900 to-indigo-900 text-white mt-20 relative overflow-hidden'>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className='relative z-10 flex flex-col md:flex-row items-center justify-around py-8 px-6 gap-4'>
          <div className='text-white font-bold text-xl flex items-center gap-2'>
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <BiLogoJoomla className="text-violet-600 group-hover:rotate-12 transition-transform" size={40} />
            </div>
            skillMatch.AI
          </div>
          <div className='text-white font-semibold flex items-center gap-2'>
            Made With 
            <span className="text-red-400">❤</span> 
            by Team Tech Titans
          </div>
          <div className='text-white font-semibold text-sm'>
            © 2025 All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default UserDashboard