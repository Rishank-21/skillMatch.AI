



import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { BiLogoJoomla } from "react-icons/bi";
import { setUserData } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";

const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateForm = () => {
    const newErrors = {};

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
      const result = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
      navigate('/');
    } catch (error) {
      console.log(error);
      setErrors({
        api: error.response?.data?.message || 'Login failed. Please check your credentials and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    setErrors({});

    try {
      const result = await signInWithPopup(auth, provider);
      const { email, displayName } = result.user;

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/google`,
        { email, username: displayName },
        { withCredentials: true }
      );

      if (!data) {
        setErrors({ api: 'Invalid email. Please register first.' });
        return;
      }

      dispatch(setUserData(data));
      navigate('/');
    } catch (error) {
      console.error("Google login failed:", error);
      setErrors({
        api: error.response?.data?.message || 'Google login failed. Please try again.'
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen shadow-lg hover:shadow-2xl transition-shadow">
      <div className="w-96 p-6 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500">
        <div className="mb-4">
          <BiLogoJoomla className="text-violet-600" size={50} />
        </div>
        <div className="flex flex-row items-center justify-center m-auto p-auto mb-8">
          <h1 className="text-3xl font-bold mb-4">Login</h1>
        </div>

        {errors.api && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errors.api}
          </div>
        )}

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1">Email</label>
            <input
              type="email"
              id="email"
              className={`border p-2 rounded-lg outline-none focus:ring-2 ${
                errors.email 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
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
              <p className="text-red-500 text-sm mt-1 mb-3">{errors.email}</p>
            )}
          </div>

          <div className="flex flex-col mt-2">
            <label htmlFor="password" className="mb-1">Password</label>
            <input
              type="password"
              id="password"
              className={`border p-2 rounded-lg outline-none focus:ring-2 ${
                errors.password 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
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
              <p className="text-red-500 text-sm mt-1 mb-3">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white p-2 rounded-lg cursor-pointer mt-4 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="my-4">
          <p className="text-center my-4">OR</p>
        </div>

        <div className="flex flex-col gap-4">
          <button
            className="bg-gray-600 text-white p-2 rounded-lg w-full cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={handleGoogleAuth}
          >
            <FcGoogle className="inline mr-2" /> Continue with Google
          </button>
        </div>

        <div className="mt-4 flex items-baseline justify-center">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;