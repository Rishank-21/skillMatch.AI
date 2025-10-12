
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiLogoJoomla } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { setUserData, clearUserData } from "../redux/userSlice"; // example Redux actions

const Nav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // fallback values helper
  const username = userData?.user?.username || "Guest";
  const role = userData?.user?.role || "user";

  // Check auth on page load
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, { withCredentials: true });
        dispatch(setUserData(res.data.user)); // store user in Redux
      } catch (error) {
        dispatch(clearUserData());
        navigate("/login");
      } finally {
        setLoadingAuth(false);
      }
    };

    if (!userData) fetchCurrentUser();
    else setLoadingAuth(false);
  }, [dispatch, navigate, userData]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`, {}, { withCredentials: true });
      dispatch(clearUserData());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loadingAuth) return null; // or a loading spinner

  return (
    <header className="w-full h-[64px] fixed top-0 left-0 bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-center z-50 ">
      <nav className="flex justify-between items-center w-[92%] max-w-[1200px]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <BiLogoJoomla className="text-violet-600 group-hover:rotate-12 transition-transform" size={40} />
          <h2 className="text-2xl font-extrabold text-gray-800 tracking-wide">
            SkillMatch<span className="text-violet-600">.AI</span>
          </h2>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Role Info */}
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-gray-800 font-semibold">{username}</span>
            <span className="text-sm text-violet-600 uppercase font-medium">{role}</span>
          </div>

          {/* Avatar */}
          <div className="relative cursor-pointer" onClick={() => setModalOpen(!modalOpen)}>
            <div className="rounded-full w-11 h-11 bg-violet-600 flex items-center justify-center text-white font-bold hover:scale-105 transition-transform">
              {username[0]?.toUpperCase()}
            </div>

            {/* Dropdown */}
            <AnimatePresence>
              {modalOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-800">{username}</p>
                    <p className="text-sm text-gray-500 capitalize">{role}</p>
                  </div>
                  <button
                    className="w-full text-left px-4 py-2 text-red-600 font-medium hover:bg-red-50 transition"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
