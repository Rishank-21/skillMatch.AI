

// import React, { useState } from 'react';
// import axios from 'axios';
// import { Sparkles, Send, Twitter, Linkedin, Instagram, Shield, Clock } from 'lucide-react';

// const Footer = ({ sendEmail }) => {
//   const [email, setEmail] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSendEmail = async () => {
//     if (!email.trim()) {
//       alert("Please enter your email");
//       return;
//     }

//     setLoading(true);
//     try {
//       const { data } = await axios.post(
//         `${import.meta.env.VITE_API_URL}/mentor/send-feedback`,
//         {
//           from: sendEmail,
//           message: `This user (${email}) subscribed via footer to receive updates.`,
//         },
//         { withCredentials: true }
//       );
//       alert("✅ Subscribed successfully!");
//       setEmail('');
//     } catch (err) {
//       alert("❌ Failed to subscribe. Please try again.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSendEmail();
//     }
//   };

//   return (
//     <footer className="relative w-full bg-slate-900/50 backdrop-blur-xl border-t border-slate-800 text-white overflow-hidden">
//       {/* Decorative background elements */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute top-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
//         <div className="absolute bottom-0 right-0 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl"></div>
//       </div>
      
//       <div className="relative z-10">
//         {/* Main Footer Content */}
//         <div className="max-w-7xl mx-auto px-6 py-12">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
//             {/* Brand Section */}
//             <div className="space-y-4">
//               <div className="flex items-center gap-2">
//                 <div className="relative">
//                   <Sparkles className="w-8 h-8 text-cyan-400" />
//                   <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-50"></div>
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
//                     SkillMatch.AI
//                   </h3>
//                   <p className="text-slate-400 text-xs">Building futures together</p>
//                 </div>
//               </div>
//               <p className="text-slate-400 text-sm leading-relaxed">
//                 Empowering students and professionals through meaningful mentorship connections.
//               </p>
              
//               {/* Social Media Links */}
//               <div className="flex items-center gap-3">
//                 <a 
//                   href="#" 
//                   className="w-9 h-9 bg-slate-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
//                   aria-label="Twitter"
//                 >
//                   <Twitter className="w-4 h-4 text-slate-400 group-hover:text-white" />
//                 </a>
//                 <a 
//                   href="#" 
//                   className="w-9 h-9 bg-slate-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
//                   aria-label="LinkedIn"
//                 >
//                   <Linkedin className="w-4 h-4 text-slate-400 group-hover:text-white" />
//                 </a>
//                 <a 
//                   href="#" 
//                   className="w-9 h-9 bg-slate-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
//                   aria-label="Instagram"
//                 >
//                   <Instagram className="w-4 h-4 text-slate-400 group-hover:text-white" />
//                 </a>
//               </div>
//             </div>
            
//             {/* Quick Links */}
//             <div className="space-y-4">
//               <h4 className="text-lg font-semibold text-white">Quick Links</h4>
//               <ul className="space-y-2">
//                 <li>
//                   <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center group">
//                     <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
//                     Find a Mentor
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center group">
//                     <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
//                     Become a Mentor
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center group">
//                     <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
//                     How it Works
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center group">
//                     <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
//                     Success Stories
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center group">
//                     <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
//                     Pricing
//                   </a>
//                 </li>
//               </ul>
//             </div>
            
//             {/* Support */}
//             <div className="space-y-4">
//               <h4 className="text-lg font-semibold text-white">Support</h4>
//               <ul className="space-y-2">
//                 <li>
//                   <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center group">
//                     <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
//                     Help Center
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center group">
//                     <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
//                     Contact Us
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center group">
//                     <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
//                     Privacy Policy
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center group">
//                     <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
//                     Terms of Service
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center group">
//                     <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
//                     Cookie Policy
//                   </a>
//                 </li>
//               </ul>
//             </div>
            
//             {/* Newsletter */}
//             <div className="space-y-4">
//               <h4 className="text-lg font-semibold text-white">Stay Updated</h4>
//               <p className="text-slate-400 text-sm">Subscribe to get the latest mentorship tips and opportunities.</p>
//               <div className="space-y-3">
//                 <div className="relative">
//                   <input 
//                     type="email" 
//                     placeholder="Enter your email" 
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     onKeyPress={handleKeyPress}
//                     disabled={loading}
//                     className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-sm transition-all duration-200 pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
//                   />
//                   <button 
//                     onClick={handleSendEmail}
//                     disabled={loading}
//                     className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
//                     aria-label="Subscribe"
//                   >
//                     {loading ? (
//                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                     ) : (
//                       <Send className="w-4 h-4 text-white" />
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {/* Bottom Bar */}
//         <div className="border-t border-slate-800">
//           <div className="max-w-7xl mx-auto px-6 py-6">
//             <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//               <p className="text-slate-400 text-sm">
//                 © 2025 SkillMatch.AI. All rights reserved.
//               </p>
              
//               <div className="flex items-center gap-6">
//                 <div className="flex items-center gap-2 text-slate-400 text-sm">
//                   <Shield className="w-4 h-4 text-green-400" />
//                   <span>Secure Platform</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-slate-400 text-sm">
//                   <Clock className="w-4 h-4 text-cyan-400" />
//                   <span>24/7 Support</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;







// import React, { useState } from 'react';
// import axios from 'axios';
// import { Sparkles, Send, Twitter, Linkedin, Instagram, Shield, Clock } from 'lucide-react';
// import toast from 'react-hot-toast'; // Import toast

// const Footer = ({ sendEmail }) => {
//     const [email, setEmail] = useState('');
//     const [loading, setLoading] = useState(false);

//     const handleSendEmail = async () => {
//         if (!email.trim()) {
//             toast.error("Please enter your email address to subscribe.");
//             return;
//         }

//         setLoading(true);

//         const subscribePromise = axios.post(
//             `${import.meta.env.VITE_API_URL}/mentor/send-feedback`,
//             {
//                 // Assuming sendEmail holds the mentor's email or a default system email
//                 from: sendEmail, 
//                 message: `This user (${email}) subscribed via footer to receive updates.`,
//             },
//             { withCredentials: true }
//         );

//         toast.promise(subscribePromise, {
//             loading: 'Subscribing you to updates...',
//             success: () => {
//                 setEmail('');
//                 return "✅ Subscribed successfully! Check your inbox for confirmation.";
//             },
//             error: (err) => {
//                 console.error(err);
//                 return "❌ Failed to subscribe. Please check your network and try again.";
//             },
//         })
//         .finally(() => {
//             setLoading(false);
//         });
//     };

//     const handleKeyPress = (e) => {
//         if (e.key === 'Enter') {
//             handleSendEmail();
//         }
//     };

//     return (
//         <footer className="relative w-full bg-slate-900/50 backdrop-blur-xl border-t border-slate-800 text-white overflow-hidden">
//             {/* Decorative background elements */}
//             <div className="absolute inset-0 pointer-events-none">
//                 <div className="absolute top-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
//                 <div className="absolute bottom-0 right-0 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl"></div>
//             </div>
            
//             <div className="relative z-10">
//                 {/* Main Footer Content */}
//                 <div className="max-w-7xl mx-auto px-6 py-12">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        
//                         {/* Brand Section */}
//                         <div className="space-y-4">
//                             <div className="flex items-center gap-2">
//                                 <div className="relative">
//                                     <Sparkles className="w-8 h-8 text-cyan-400" />
//                                     <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-50"></div>
//                                 </div>
//                                 <div>
//                                     <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
//                                         SkillMatch.AI
//                                     </h3>
//                                     <p className="text-slate-400 text-xs">Building futures together</p>
//                                 </div>
//                             </div>
//                             <p className="text-slate-400 text-sm leading-relaxed">
//                                 Empowering students and professionals through meaningful mentorship connections.
//                             </p>
                            
//                             {/* Social Media Links */}
//                             <div className="flex items-center gap-3">
//                                 <a 
//                                     href="#" 
//                                     className="w-9 h-9 bg-slate-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
//                                     aria-label="Twitter"
//                                 >
//                                     <Twitter className="w-4 h-4 text-slate-400 group-hover:text-white" />
//                                 </a>
//                                 <a 
//                                     href="#" 
//                                     className="w-9 h-9 bg-slate-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
//                                     aria-label="LinkedIn"
//                                 >
//                                     <Linkedin className="w-4 h-4 text-slate-400 group-hover:text-white" />
//                                 </a>
//                                 <a 
//                                     href="#" 
//                                     className="w-9 h-9 bg-slate-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
//                                     aria-label="Instagram"
//                                 >
//                                     <Instagram className="w-4 h-4 text-slate-400 group-hover:text-white" />
//                                 </a>
//                             </div>
//                         </div>
                        
//                         {/* Quick Links */}
//                         <div className="space-y-4">
//                             <h4 className="text-lg font-semibold text-white">Quick Links</h4>
//                             <ul className="space-y-2">
//                                 <li>
//                                     <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center group">
//                                         <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
//                                         Find a Mentor
//                                     </a>
//                                 </li>
//                                 <li>
//                                     <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center group">
//                                         <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
//                                         Become a Mentor
//                                     </a>
//                                 </li>
//                                 <li>
//                                     <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center group">
//                                         <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
//                                         How it Works
//                                     </a>
//                                 </li>
//                                 <li>
//                                     <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center group">
//                                         <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
//                                         Success Stories
//                                     </a>
//                                 </li>
//                                 <li>
//                                     <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center group">
//                                         <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
//                                         Pricing
//                                     </a>
//                                 </li>
//                             </ul>
//                         </div>
                        
//                         {/* Support */}
//                         <div className="space-y-4">
//                             <h4 className="text-lg font-semibold text-white">Support</h4>
//                             <ul className="space-y-2">
//                                 <li>
//                                     <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center group">
//                                         <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
//                                         Help Center
//                                     </a>
//                                 </li>
//                                 <li>
//                                     <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center group">
//                                         <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
//                                         Contact Us
//                                     </a>
//                                 </li>
//                                 <li>
//                                     <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center group">
//                                         <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
//                                         Privacy Policy
//                                     </a>
//                                 </li>
//                                 <li>
//                                     <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center group">
//                                         <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
//                                         Terms of Service
//                                     </a>
//                                 </li>
//                                 <li>
//                                     <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center group">
//                                         <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
//                                         Cookie Policy
//                                     </a>
//                                 </li>
//                             </ul>
//                         </div>
                        
//                         {/* Newsletter */}
//                         <div className="space-y-4">
//                             <h4 className="text-lg font-semibold text-white">Stay Updated</h4>
//                             <p className="text-slate-400 text-sm">Subscribe to get the latest mentorship tips and opportunities.</p>
//                             <div className="space-y-3">
//                                 <div className="relative">
//                                     <input 
//                                         type="email" 
//                                         placeholder="Enter your email" 
//                                         value={email}
//                                         onChange={(e) => setEmail(e.target.value)}
//                                         onKeyPress={handleKeyPress}
//                                         disabled={loading}
//                                         className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-sm transition-all duration-200 pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
//                                     />
//                                     <button 
//                                         onClick={handleSendEmail}
//                                         disabled={loading}
//                                         className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
//                                         aria-label="Subscribe"
//                                     >
//                                         {loading ? (
//                                             <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                                         ) : (
//                                             <Send className="w-4 h-4 text-white" />
//                                         )}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
                
//                 {/* Bottom Bar */}
//                 <div className="border-t border-slate-800">
//                     <div className="max-w-7xl mx-auto px-6 py-6">
//                         <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//                             <p className="text-slate-400 text-sm">
//                                 © 2025 SkillMatch.AI. All rights reserved.
//                             </p>
                            
//                             <div className="flex items-center gap-6">
//                                 <div className="flex items-center gap-2 text-slate-400 text-sm">
//                                     <Shield className="w-4 h-4 text-green-400" />
//                                     <span>Secure Platform</span>
//                                 </div>
//                                 <div className="flex items-center gap-2 text-slate-400 text-sm">
//                                     <Clock className="w-4 h-4 text-cyan-400" />
//                                     <span>24/7 Support</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </footer>
//     );
// };

// export default Footer;





import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, Send, Twitter, Linkedin, Instagram, Shield, Clock } from 'lucide-react';
import toast from 'react-hot-toast'; // Import toast

const Footer = ({ sendEmail }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendEmail = async () => {
        if (!email.trim()) {
            toast.error("Please enter your email address to subscribe.");
            return;
        }

        // ✅ Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            toast.error("Please enter a valid email address.");
            return;
        }

        setLoading(true);

        const subscribePromise = axios.post(
            `${import.meta.env.VITE_API_URL}/mentor/send-feedback`,
            {
                from: sendEmail, 
                message: `This user (${email}) subscribed via footer to receive updates.`,
            },
            { withCredentials: true }
        );

        toast.promise(subscribePromise, {
            loading: 'Subscribing you to updates...',
            success: () => {
                setEmail('');
                setLoading(false);
                return "✅ Subscribed successfully! Check your inbox for confirmation.";
            },
            error: (err) => {
                setLoading(false);
                console.error(err);
                return err.response?.data?.message || "❌ Failed to subscribe. Please check your network and try again.";
            },
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendEmail();
        }
    };

    return (
        <footer className="relative w-full bg-slate-900/50 backdrop-blur-xl border-t border-slate-800 text-white overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
                {/* Main Footer Content */}
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        
                        {/* Brand Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Sparkles className="w-8 h-8 text-cyan-400" />
                                    <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-50"></div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                        SkillMatch.AI
                                    </h3>
                                    <p className="text-slate-400 text-xs">Building futures together</p>
                                </div>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Empowering students and professionals through meaningful mentorship connections.
                            </p>
                            
                            {/* Social Media Links */}
                            <div className="flex items-center gap-3">
                                <a 
                                    href="#" 
                                    className="w-9 h-9 bg-slate-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                                    aria-label="Twitter"
                                >
                                    <Twitter className="w-4 h-4 text-slate-400 group-hover:text-white" />
                                </a>
                                <a 
                                    href="#" 
                                    className="w-9 h-9 bg-slate-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                                    aria-label="LinkedIn"
                                >
                                    <Linkedin className="w-4 h-4 text-slate-400 group-hover:text-white" />
                                </a>
                                <a 
                                    href="#" 
                                    className="w-9 h-9 bg-slate-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                                    aria-label="Instagram"
                                >
                                    <Instagram className="w-4 h-4 text-slate-400 group-hover:text-white" />
                                </a>
                            </div>
                        </div>
                        
                        {/* Quick Links */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                                        Find a Mentor
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                                        Become a Mentor
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                                        How it Works
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                                        Success Stories
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                                        Pricing
                                    </a>
                                </li>
                            </ul>
                        </div>
                        
                        {/* Support */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-white">Support</h4>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                                        Help Center
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                                        Contact Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                                        Terms of Service
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                                        Cookie Policy
                                    </a>
                                </li>
                            </ul>
                        </div>
                        
                        {/* Newsletter */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-white">Stay Updated</h4>
                            <p className="text-slate-400 text-sm">Subscribe to get the latest mentorship tips and opportunities.</p>
                            <div className="space-y-3">
                                <div className="relative">
                                    <input 
                                        type="email" 
                                        placeholder="Enter your email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        disabled={loading}
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-sm transition-all duration-200 pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                    <button 
                                        onClick={handleSendEmail}
                                        disabled={loading}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
                                        aria-label="Subscribe"
                                    >
                                        {loading ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <Send className="w-4 h-4 text-white" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Bottom Bar */}
                <div className="border-t border-slate-800">
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-slate-400 text-sm">
                                © 2025 SkillMatch.AI. All rights reserved.
                            </p>
                            
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <Shield className="w-4 h-4 text-green-400" />
                                    <span>Secure Platform</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <Clock className="w-4 h-4 text-cyan-400" />
                                    <span>24/7 Support</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;