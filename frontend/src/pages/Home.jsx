


import React from 'react'
import { useSelector } from 'react-redux'
import useGetCurrentUser from '../hooks/useGetCurrentUser'
import useGetMentorData from '../hooks/useGetMentorData.jsx'
import UserDashboard from '../components/UserDashboard.jsx'
import MentorDashboard from '../components/MentorDashboard.jsx'
import { useNavigate } from 'react-router-dom'

function Home({ scrollToId }) {
  useGetCurrentUser()
  useGetMentorData()
  const navigate = useNavigate()

  const { userData } = useSelector(state => state.user)

  // If no userData, redirect to login
  if (!userData) navigate("/login")

  const role = userData?.user?.role

  return (
    <div className='w-screen min-h-screen flex flex-col items-center bg-slate-950 overflow-x-hidden relative'>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        {role === "user" && <UserDashboard scrollToId={scrollToId} />}
        {role === "mentor" && <MentorDashboard />}
      </div>
    </div>
  )
}

export default Home