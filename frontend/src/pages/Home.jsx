import React from 'react'
//helper

import { useSelector } from 'react-redux'
import useGetCurrentUser from '../hooks/useGetCurrentUser'
import UserDashboard from '../components/UserDashboard.jsx'
import MentorDashboard from '../components/MentorDashboard.jsx'
import useGetMentorData from '../hooks/useGetMentorData.jsx'

function Home({scrollToId}) {
     useGetCurrentUser()
     useGetMentorData()
  const { userData } = useSelector(state => state.user)
  return (
    <div className='w-[100vw] min-h-[100vh]  flex flex-col items-center bg-[#fff9f6] overflow-x-hidden'>
      {userData.user.role === "user" &&  <UserDashboard scrollToId = {scrollToId}/>}
       {userData.user.role === "mentor" &&  <MentorDashboard/>}
       
    </div>
  )
}

export default Home
