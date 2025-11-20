


import axios from "axios";
import React, { useEffect, useState } from "react";
import { Sparkles, LogOut, User, ChevronDown } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { setUserData, clearUserData } from "../redux/userSlice";

const Nav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const username = userData?.user?.username || "Guest";
  const role = userData?.user?.role || "user";

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, { withCredentials: true });
        dispatch(setUserData(res.data.user));
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

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`, {}, { withCredentials: true });
      dispatch(clearUserData());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loadingAuth) return null;

  return (
    <header className="w-full h-[72px] fixed top-0 left-0 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 flex items-center justify-center z-50 shadow-lg">
      <nav className="flex justify-between items-center w-[92%] max-w-[1400px]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="relative">
            <Sparkles className="w-8 h-8 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              SkillMatch
            </span>
            <span className="text-white">.AI</span>
          </h2>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Role Badge */}
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700 backdrop-blur-sm">
            <div className="flex flex-col text-right">
              <span className="text-white font-semibold text-sm">{username}</span>
              <span className="text-xs text-cyan-400 uppercase font-medium">
                {role === "user" ? "Learner" : "Mentor"}
              </span>
            </div>
          </div>

          {/* Avatar Dropdown */}
          <div className="relative">
            <button
              onClick={() => setModalOpen(!modalOpen)}
              className="group flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 rounded-full border border-slate-700 hover:border-cyan-500/50 transition-all duration-300"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-105 transition-transform">
                  {username[0]?.toUpperCase()}
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${modalOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {modalOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 mt-3 w-64 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 overflow-hidden"
                >
                  {/* User Info */}
                  <div className="px-4 py-4 border-b border-slate-800 bg-gradient-to-r from-cyan-500/5 to-purple-500/5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                        {username[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{username}</p>
                        <p className="text-sm text-cyan-400 capitalize">
                          {role === "user" ? "Learner" : "Mentor"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      className="w-full text-left px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200 flex items-center gap-3 group"
                      onClick={() => {
                        setModalOpen(false);
                        // Add profile navigation if needed
                      }}
                    >
                      <User className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">View Profile</span>
                    </button>
                    
                    <button
                      className="w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 flex items-center gap-3 group"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
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