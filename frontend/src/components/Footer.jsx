import React, { use } from 'react'
import axios from 'axios';
import { useEffect } from 'react';
const Footer = ({ sendEmail }) => {
  const [email, setEmail] = React.useState('');
   const handleSendEmail = async () => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/mentor/send-feedback`,
      {
        from: sendEmail, // the sender email from input
        message: `This user (${email}) subscribed via footer to receive updates.`,
      },
      { withCredentials: true }
    );
    alert("✅ Email sent successfully!");
    setEmail(''); // Clear the input field after successful submission
  } catch (err) {
    alert("❌ Failed to send feedback:", err.response?.data || err.message);
  }
};


  return (
    <div className="w-full bg-gradient-to-r from-gray-900 via-violet-900 to-indigo-900 text-white relative overflow-hidden">
  {/* Decorative background elements */}
  <div className="absolute inset-0">
    <div className="absolute top-0 left-0 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 right-0 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl"></div>
  </div>
  
  <div className="relative z-10">
    {/* Main Footer Content helper */}
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.84L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.84l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold">SkillMatch.AI</h3>
              <p className="text-gray-300 text-sm">Connecting minds, building futures</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Empowering students and professionals through meaningful mentorship connections.
          </p>
          
          {/* Social Media Links */}
          <div className="flex items-center gap-4">
            <a href="#" className="w-8 h-8 bg-white/10 hover:bg-violet-500 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="#" className="w-8 h-8 bg-white/10 hover:bg-violet-500 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="#" className="w-8 h-8 bg-white/10 hover:bg-violet-500 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>
        
        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Quick Links</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-gray-400 hover:text-violet-400 transition-colors duration-200 text-sm">Find a Mentor</a></li>
            <li><a href="#" className="text-gray-400 hover:text-violet-400 transition-colors duration-200 text-sm">Become a Mentor</a></li>
            <li><a href="#" className="text-gray-400 hover:text-violet-400 transition-colors duration-200 text-sm">How it Works</a></li>
            <li><a href="#" className="text-gray-400 hover:text-violet-400 transition-colors duration-200 text-sm">Success Stories</a></li>
            <li><a href="#" className="text-gray-400 hover:text-violet-400 transition-colors duration-200 text-sm">Pricing</a></li>
          </ul>
        </div>
        
        {/* Support */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Support</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-gray-400 hover:text-violet-400 transition-colors duration-200 text-sm">Help Center</a></li>
            <li><a href="#" className="text-gray-400 hover:text-violet-400 transition-colors duration-200 text-sm">Contact Us</a></li>
            <li><a href="#" className="text-gray-400 hover:text-violet-400 transition-colors duration-200 text-sm">Privacy Policy</a></li>
            <li><a href="#" className="text-gray-400 hover:text-violet-400 transition-colors duration-200 text-sm">Terms of Service</a></li>
            <li><a href="#" className="text-gray-400 hover:text-violet-400 transition-colors duration-200 text-sm">Cookie Policy</a></li>
          </ul>
        </div>
        
        {/* Newsletter */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Stay Updated</h4>
          <p className="text-gray-400 text-sm">Subscribe to get the latest mentorship tips and opportunities.</p>
          <div className="space-y-3">
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-l-lg text-white placeholder-gray-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 text-sm"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 rounded-r-lg transition-all duration-200 hover:scale-105" onClick={handleSendEmail}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Bottom Bar */}
    <div className="border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <p className="text-gray-400 text-sm">
              © 2024 SkillMatch.AI. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Secure Platform</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <svg className="w-4 h-4 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  )
}

export default Footer
