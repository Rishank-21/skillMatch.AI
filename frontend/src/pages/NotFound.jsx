import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, AlertCircle } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 mb-6 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border-2 border-cyan-500/30 backdrop-blur-sm">
            <AlertCircle className="w-16 h-16 text-cyan-400 animate-pulse" />
          </div>
          
          <h1 className="text-8xl sm:text-9xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
            404
          </h1>
          
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full mx-auto mb-6"></div>
        </div>

        {/* Content */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800 p-8 sm:p-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Page Not Found
          </h2>
          
          <p className="text-lg text-slate-400 mb-8 leading-relaxed">
            Oops! The page you're looking for seems to have wandered off into the digital void. 
            Don't worry, we'll help you find your way back.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Go Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="group relative px-8 py-4 rounded-2xl font-semibold transition-all duration-200 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 overflow-hidden"
            >
              <div className="flex items-center gap-3 relative z-10">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                <span>Go Back</span>
              </div>
            </button>

            {/* Home Button */}
            <button
              onClick={() => navigate('/')}
              className="group relative px-8 py-4 rounded-2xl font-semibold transition-all duration-200 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white hover:scale-105 shadow-lg hover:shadow-purple-500/50 overflow-hidden"
            >
              <div className="flex items-center gap-3 relative z-10">
                <Home className="w-5 h-5" />
                <span>Go to Home</span>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </button>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-slate-800">
            <p className="text-sm text-slate-500 mb-4">
              Looking for something specific?
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-sm bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-all duration-200 text-slate-300 hover:text-white"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/mentors/me')}
                className="px-4 py-2 text-sm bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-all duration-200 text-slate-300 hover:text-white"
              >
                Find Mentors
              </button>
              <button
                onClick={() => navigate('/sessions/me')}
                className="px-4 py-2 text-sm bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-all duration-200 text-slate-300 hover:text-white"
              >
                My Sessions
              </button>
            </div>
          </div>
        </div>

        {/* Fun Error Code */}
        <div className="mt-8 text-xs text-slate-600 font-mono">
          ERROR_CODE: PAGE_NOT_FOUND_404
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

export default NotFound;