import React from 'react'

import { useState, useEffect } from 'react';
import { Sparkles, Users, Target, Zap, ArrowRight, Brain, Calendar, TrendingUp, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const navigate = useNavigate()
  const { userData } = useSelector(state => state.user)
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

    const handleGetStarted = () => {
    if (userData) {
      navigate('/dashboard');
    } else {
      navigate('/login'); // or '/register' if you prefer
    }
  };

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Matching",
      description: "Our advanced AI analyzes your skills and goals to connect you with the perfect mentor"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Flexible Scheduling",
      description: "Book sessions at your convenience with integrated calendar management"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Track Your Growth",
      description: "Monitor your progress and see tangible improvements in your skills"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Mentors",
      description: "Learn from industry professionals with proven track records"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "500+", label: "Expert Mentors" },
    { number: "50K+", label: "Sessions Completed" },
    { number: "4.9/5", label: "Average Rating" }
  ];

  return (
    <div className="bg-slate-950 text-white min-h-screen overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4 border-b border-slate-800 backdrop-blur-xl bg-slate-950/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              SkillMatch.AI
            </span>
          </div>
          <div className="flex items-center gap-4">
            
            <button onClick={handleGetStarted} className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 font-semibold cursor-pointer">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-20 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8" style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            opacity: 1 - scrollY / 500
          }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700 backdrop-blur-sm animate-fade-in">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-slate-300">AI-Powered Career Growth Platform</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                Match. Learn.
              </span>
              <br />
              <span className="text-white">Grow Together.</span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Connect with expert mentors who understand your goals. Get personalized guidance powered by AI to accelerate your career growth.
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              <button onClick={handleGetStarted} className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2 cursor-pointer">
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a href="#features" className="px-8 py-4 border-2 border-slate-700 rounded-full font-semibold text-lg hover:border-cyan-500 hover:bg-slate-800/50 transition-all duration-300">
                Learn More
              </a>
            </div>

            {/* Floating Cards Animation */}
            <div className="relative h-64 mt-16">
              <div className="absolute top-0 left-1/4 w-48 h-32 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-2xl backdrop-blur-sm border border-cyan-500/30 p-4 animate-float">
                <Target className="w-8 h-8 text-cyan-400 mb-2" />
                <p className="text-sm font-semibold">Perfect Match</p>
                <p className="text-xs text-slate-400">AI finds your ideal mentor</p>
              </div>
              <div className="absolute top-8 right-1/4 w-48 h-32 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-2xl backdrop-blur-sm border border-purple-500/30 p-4 animate-float" style={{animationDelay: '1s'}}>
                <Users className="w-8 h-8 text-purple-400 mb-2" />
                <p className="text-sm font-semibold">Expert Network</p>
                <p className="text-xs text-slate-400">500+ industry leaders</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-6 py-20 border-y border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-slate-400 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-slate-400 text-xl">Everything you need to succeed in your career journey</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-slate-900/50 rounded-3xl border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-2 backdrop-blur-sm"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-cyan-400 group-hover:text-purple-400 transition-colors">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 px-6 py-32 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-slate-400 text-xl">Get started in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Upload Your Resume", desc: "Let our AI analyze your skills and experience" },
              { step: "02", title: "Get Matched", desc: "Discover mentors perfectly aligned with your goals" },
              { step: "03", title: "Start Learning", desc: "Book sessions and accelerate your growth" }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-8xl font-bold text-slate-800 mb-4">{item.step}</div>
                <div className="relative z-10 -mt-16">
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-slate-400">{item.desc}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 -right-4 w-8">
                    <ArrowRight className="text-slate-700 w-8 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl p-12 border border-slate-800 backdrop-blur-sm">
            <h2 className="text-5xl font-bold mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-slate-400 mb-8">
              Join thousands of professionals already growing with SkillMatch.AI
            </p>
            <button onClick={handleGetStarted} className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 cursor-pointer">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              SkillMatch.AI
            </span>
          </div>
          <p>© 2025 SkillMatch.AI. All rights reserved.</p>
          <p> Developed By Rishank Rawat</p>
        </div>
      </footer>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}