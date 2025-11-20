


import React, { useState } from "react";
import { Upload, FileText, File, CheckCircle, X, Settings, CloudUpload, Info, Sparkles } from "lucide-react";
import Nav from "./Nav";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setResumeData } from "../redux/userSlice";

const UploadResume = () => {
  const userData = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [skills, setSkills] = useState([]);
  const [rawData, setRawData] = useState("");

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles);
    const validFiles = fileArray.filter((file) => {
      const fileType = file.type;
      return (
        fileType === "application/pdf" ||
        fileType === "application/msword" ||
        fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        fileType === "text/plain"
      );
    });

    if (validFiles.length > 0) {
      setFiles((prev) => [
        ...prev,
        ...validFiles.map((file) => ({
          file,
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2),
          type: file.type,
          id: Date.now() + Math.random(),
        })),
      ]);
    }
  };

  const removeFile = (fileId) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const getFileIcon = (fileType) => {
    if (fileType === "application/pdf") return <FileText className="text-red-400 w-6 h-6" />;
    if (fileType.includes("word")) return <File className="text-blue-400 w-6 h-6" />;
    return <File className="text-slate-400 w-6 h-6" />;
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    try {
      setUploading(true);

      const formData = new FormData();
      files.forEach((fileObj) => {
        formData.append("resume", fileObj.file);
      });

      const result = await axios.post(
        `${import.meta.env.VITE_API_URL}/resume/parse`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setSkills(result.data.extractedSkills);
      setRawData(result.data.fallbackText);
      setUploading(false);
      setUploadSuccess(true);
      dispatch(setResumeData(result.data));

      setTimeout(() => {
        setUploadSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploading(false);
    }
  };

  const handleSaveSkills = async () => {
    let result = await axios.post(
      `${import.meta.env.VITE_API_URL}/resume/save`,
      {
        raw: rawData,
        parsed: rawData,
        extractedSkills: skills,
      },
      { withCredentials: true }
    );

    dispatch(setResumeData(result.data));
    navigate(`/mentors/${userData.user._id}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white w-full relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <Nav />

      <div className="relative z-10 flex items-center flex-col p-6 sm:p-10 gap-8 mt-24">
        {/* Header */}
        <div className="text-center max-w-3xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-purple-500/30">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Upload Your Resume
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Share your experience with mentors by uploading your resume. We accept PDF, Word, and text documents.
          </p>
        </div>

        {/* Main Upload Area */}
        <div className="w-full max-w-4xl">
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800 p-8 sm:p-12">
            {/* Upload Zone */}
            <div
              className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
                dragActive
                  ? "border-cyan-400 bg-cyan-500/10 scale-105 shadow-xl shadow-cyan-500/20"
                  : "border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="space-y-6">
                <div className="flex items-center justify-center">
                  <div
                    className={`w-24 h-24 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      dragActive
                        ? "bg-gradient-to-r from-cyan-500 to-purple-600 scale-110 shadow-lg shadow-purple-500/50"
                        : "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30"
                    }`}
                  >
                    <CloudUpload
                      className={`w-12 h-12 ${dragActive ? "text-white" : "text-cyan-400"}`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">
                    {dragActive ? "Drop your files here" : "Choose files or drag & drop"}
                  </h3>
                  <p className="text-slate-400">
                    Support for PDF, DOC, DOCX, and TXT files up to 10MB
                  </p>
                </div>

                <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <FileText className="text-red-400 w-5 h-5" />
                    <span>PDF</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <File className="text-blue-400 w-5 h-5" />
                    <span>DOC/DOCX</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <File className="text-slate-400 w-5 h-5" />
                    <span>TXT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-8 space-y-4">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"></div>
                  Selected Files ({files.length})
                </h4>

                <div className="space-y-3">
                  {files.map((fileObj) => (
                    <div
                      key={fileObj.id}
                      className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-cyan-500/50 transition-all duration-200 group backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">
                          {getFileIcon(fileObj.type)}
                        </div>
                        <div>
                          <p className="font-medium text-white truncate max-w-xs">
                            {fileObj.name}
                          </p>
                          <p className="text-sm text-slate-400">
                            {fileObj.size} MB
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFile(fileObj.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Button */}
            {files.length > 0 && !uploadSuccess && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className={`group relative px-8 py-4 rounded-2xl font-semibold transition-all duration-200 overflow-hidden ${
                    uploading
                      ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white hover:scale-105 shadow-lg hover:shadow-purple-500/50"
                  }`}
                >
                  <div className="flex items-center gap-3 relative z-10">
                    {uploading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span>Upload Resume{files.length > 1 ? "s" : ""}</span>
                      </>
                    )}
                  </div>

                  {!uploading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  )}
                </button>
              </div>
            )}

            {/* Success Message and Save Skills Button */}
            {uploadSuccess && (
              <div className="mt-8 space-y-6">
                {/* Success Message */}
                <div className="flex justify-center">
                  <div className="flex items-center gap-3 px-6 py-4 bg-green-500/10 border border-green-500/50 rounded-2xl backdrop-blur-sm">
                    <CheckCircle className="text-green-400 w-6 h-6" />
                    <span className="text-green-400 font-semibold text-lg">
                      Resume uploaded successfully!
                    </span>
                  </div>
                </div>

                {/* Save Skills Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleSaveSkills}
                    className="group relative px-8 py-4 rounded-2xl font-semibold transition-all duration-200 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white hover:scale-105 shadow-lg hover:shadow-green-500/50 overflow-hidden"
                  >
                    <div className="flex items-center gap-3 relative z-10">
                      <Settings className="w-5 h-5" />
                      <span>Save Your Skills</span>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  </button>
                </div>
              </div>
            )}

            {/* Tips Section */}
            <div className="mt-12 p-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl border border-cyan-500/30 backdrop-blur-sm">
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Info className="w-3 h-3 text-white" />
                </div>
                Resume Upload Tips
              </h4>
              <ul className="text-sm text-slate-400 space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2"></div>
                  <span>Use a clean, professional format with clear sections</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2"></div>
                  <span>Include your most relevant experience and skills</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2"></div>
                  <span>Keep your resume updated with recent achievements</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2"></div>
                  <span>PDF format is recommended for best compatibility</span>
                </li>
              </ul>
            </div>
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

export default UploadResume;