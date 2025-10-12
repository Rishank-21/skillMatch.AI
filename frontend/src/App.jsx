
import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import useGetCurrentUser from './hooks/useGetCurrentUser.jsx';
import { useSelector } from 'react-redux';
import Home from './pages/Home.jsx';
import useGetMentorData from './hooks/useGetMentorData.jsx';
import UploadResume from './components/UploadResume.jsx';
import FindMentors from './components/FindMentors.jsx';
import PaymentSuccess from './components/PaymentSuccess.jsx';
import Sessions from './components/Sessions.jsx';
const App = () => {
  useGetCurrentUser()
  useGetMentorData()
  const {userData} = useSelector((state) => state.user);
  const {mentorData} = useSelector((state) => state.mentor);

  const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};
  //helper
  return (
      <Routes>
        <Route path="/" element={userData ? <Home scrollToId = {scrollToId} /> : <Navigate to={"/login"}/> }/>
        <Route path="/register" element={!userData ? <Register /> : <Navigate to={"/"} />} />
        <Route path="/login" element={!userData ? <Login /> : <Navigate to={"/"} />} />
        <Route path="/upload-resume/:userId" element={ !userData ? <Login /> : <UploadResume />}/>
        <Route path='/mentors/:userId' element = {!userData ? <Login/> : <FindMentors/>}/>
        <Route path='/payment-success' element = {<PaymentSuccess/>}/>
        <Route path='/sessions/:userId' element = {<Sessions/>}/>
      </Routes>

  )
}

export default App;
