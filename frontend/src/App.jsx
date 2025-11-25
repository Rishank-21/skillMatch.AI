
// import React from 'react'
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import Register from './pages/Register.jsx';
// import Login from './pages/Login.jsx';
// import useGetCurrentUser from './hooks/useGetCurrentUser.jsx';
// import { useSelector } from 'react-redux';
// import Home from './pages/Home.jsx';
// import useGetMentorData from './hooks/useGetMentorData.jsx';
// import UploadResume from './components/UploadResume.jsx';
// import FindMentors from './components/FindMentors.jsx';
// import PaymentSuccess from './components/PaymentSuccess.jsx';
// import Sessions from './components/Sessions.jsx';
// import LandingPage from './pages/LandingPage.jsx';
// const App = () => {
//   useGetCurrentUser()
//   useGetMentorData()
//   const {userData} = useSelector((state) => state.user);
//   const {mentorData} = useSelector((state) => state.mentor);

//   const scrollToId = (id) => {
//   const el = document.getElementById(id);
//   if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
// };
 
//   return (
    
//       <Routes>
//       <Route path="/" element={<LandingPage />} />
//       <Route path="/dashboard" element={userData ? <Home scrollToId={scrollToId} /> : <Navigate to="/login" />} />
//       <Route path="/register" element={!userData ? <Register /> : <Navigate to="/dashboard" />} />
//       <Route path="/login" element={!userData ? <Login /> : <Navigate to="/dashboard" />} />
//       <Route path="/upload-resume/:userId" element={!userData ? <Login /> : <UploadResume />} />
//       <Route path='/mentors/:userId' element={!userData ? <Login /> : <FindMentors />} />
//       <Route path='/payment-success' element={<PaymentSuccess />} />
//       <Route path='/sessions/:userId' element={<Sessions />} />
//       </Routes>

//   )
// }

// export default App;
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // ✅ Import Toaster
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
import LandingPage from './pages/LandingPage.jsx';
import NotFound from './pages/NotFound.jsx'; // ✅ Import 404 page

const App = () => {
  useGetCurrentUser();
  useGetMentorData();
  const { userData } = useSelector((state) => state.user);
  const { mentorData } = useSelector((state) => state.mentor);

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
 
  return (
    <>
      {/* ✅ Add Toaster component - Place it once at the root level */}
      <Toaster 
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          // Default options for all toasts
          duration: 4000,
          style: {
            background: '#1e293b', // slate-800
            color: '#fff',
            borderRadius: '12px',
            border: '1px solid #334155', // slate-700
            padding: '16px',
            fontSize: '14px',
          },
          // Success toast style
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981', // green-500
              secondary: '#fff',
            },
            style: {
              border: '1px solid #10b981',
            },
          },
          // Error toast style
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444', // red-500
              secondary: '#fff',
            },
            style: {
              border: '1px solid #ef4444',
            },
          },
          // Loading toast style
          loading: {
            iconTheme: {
              primary: '#3b82f6', // blue-500
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/dashboard" 
          element={userData ? <Home scrollToId={scrollToId} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/register" 
          element={!userData ? <Register /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/login" 
          element={!userData ? <Login /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/upload-resume/:userId" 
          element={userData ? <UploadResume /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/mentors/:userId" 
          element={userData ? <FindMentors /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/payment-success" 
          element={userData ? <PaymentSuccess /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/sessions/:userId" 
          element={userData ? <Sessions /> : <Navigate to="/login" />} 
        />
        {/* ✅ 404 Not Found Route - Must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;