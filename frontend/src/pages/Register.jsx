


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { Sparkles, User, Mail, Lock, UserCircle } from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const validateForm = () => {
        const newErrors = {};

        if (!username.trim()) {
            newErrors.username = 'Username is required';
        } else if (username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!role) {
            newErrors.role = 'Please select a role';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const result = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
                username,
                email,
                password,
                role
            }, { withCredentials: true });
            
            dispatch(setUserData(result.data));
            navigate('/');
        } catch (error) {
            console.log(error);
            setErrors({
                api: error.response?.data?.message || 'Registration failed. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        if (!role) {
            setErrors({ role: 'Please select a role before continuing with Google' });
            return;
        }

        setErrors({});

        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const googleName = user.displayName;
            const googleEmail = user.email;

            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/google`,
                { role, username: googleName, email: googleEmail },
                { withCredentials: true }
            );

            setUsername(googleName);
            setEmail(googleEmail);
            dispatch(setUserData(data));
            navigate('/');
        } catch (error) {
            console.error("Google auth error:", error.response?.data || error);
            setErrors({
                api: error.response?.data?.message || 'Google authentication failed. Please try again.'
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
                <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '4s'}}></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Logo/Brand */}
                <div className="flex items-center justify-center gap-2 mb-8 group">
                    <div className="relative">
                        <Sparkles className="w-10 h-10 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    </div>
                    <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        SkillMatch.AI
                    </span>
                </div>

                {/* Form Container */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            Create Account
                        </h1>
                        <p className="text-slate-400">Join thousands of learners today</p>
                    </div>

                    {errors.api && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
                            {errors.api}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Username Input */}
                        <div className="space-y-2">
                            <label htmlFor="username" className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <User className="w-4 h-4 text-cyan-400" />
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                className={`w-full bg-slate-800/50 border ${
                                    errors.username 
                                        ? 'border-red-500/50 focus:border-red-500' 
                                        : 'border-slate-700 focus:border-cyan-500'
                                } rounded-xl px-4 py-3 outline-none transition-all duration-300 placeholder-slate-500 focus:bg-slate-800/80 backdrop-blur-sm`}
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    if (errors.username) {
                                        setErrors(prev => ({ ...prev, username: '' }));
                                    }
                                }}
                            />
                            {errors.username && (
                                <p className="text-red-400 text-sm mt-1">{errors.username}</p>
                            )}
                        </div>

                        {/* Email Input */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-cyan-400" />
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className={`w-full bg-slate-800/50 border ${
                                    errors.email 
                                        ? 'border-red-500/50 focus:border-red-500' 
                                        : 'border-slate-700 focus:border-cyan-500'
                                } rounded-xl px-4 py-3 outline-none transition-all duration-300 placeholder-slate-500 focus:bg-slate-800/80 backdrop-blur-sm`}
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) {
                                        setErrors(prev => ({ ...prev, email: '' }));
                                    }
                                }}
                            />
                            {errors.email && (
                                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-cyan-400" />
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className={`w-full bg-slate-800/50 border ${
                                    errors.password 
                                        ? 'border-red-500/50 focus:border-red-500' 
                                        : 'border-slate-700 focus:border-cyan-500'
                                } rounded-xl px-4 py-3 outline-none transition-all duration-300 placeholder-slate-500 focus:bg-slate-800/80 backdrop-blur-sm`}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password) {
                                        setErrors(prev => ({ ...prev, password: '' }));
                                    }
                                }}
                            />
                            {errors.password && (
                                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-2">
                            <label htmlFor="role" className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <UserCircle className="w-4 h-4 text-cyan-400" />
                                I want to join as
                            </label>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => {
                                    setRole(e.target.value);
                                    if (errors.role) {
                                        setErrors(prev => ({ ...prev, role: '' }));
                                    }
                                }}
                                className={`w-full bg-slate-800/50 border ${
                                    errors.role 
                                        ? 'border-red-500/50 focus:border-red-500' 
                                        : 'border-slate-700 focus:border-cyan-500'
                                } rounded-xl px-4 py-3 outline-none transition-all duration-300 focus:bg-slate-800/80 backdrop-blur-sm cursor-pointer`}
                            >
                                <option className="bg-slate-800" value="user">
                                    Learner
                                </option>
                                <option className="bg-slate-800" value="mentor">
                                    Mentor
                                </option>
                            </select>
                            {errors.role && (
                                <p className="text-red-400 text-sm mt-1">{errors.role}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Creating Account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-slate-900/50 text-slate-400">OR</span>
                        </div>
                    </div>

                    {/* Google Auth Button */}
                    <button 
                        className="w-full bg-slate-800/50 border border-slate-700 text-white font-semibold py-3 rounded-xl hover:bg-slate-800 hover:border-slate-600 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 backdrop-blur-sm" 
                        onClick={handleGoogleAuth}
                    >
                        <FcGoogle size={24} />
                        Continue with Google
                    </button>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-slate-400">
                            Already have an account?{" "}
                            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

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

export default Register;