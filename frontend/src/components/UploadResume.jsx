

import React, { useState } from "react";
import {
  FaUpload,
  FaFilePdf,
  FaFileWord,
  FaFileAlt,
  FaCheckCircle,
  FaTimes,
  FaCog,
} from "react-icons/fa";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import Nav from "./Nav";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setResumeData } from "../redux/userSlice";

const UploadResume = () => {
  const userData = useSelector((state) => state.user.userData);

  const dispatch = useDispatch();

  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [skills, setSkills] = useState([]);
  const [rawData, setRawData] = useState("");
  const navigate = useNavigate();

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  // Process selected files
  const handleFiles = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles);
    const validFiles = fileArray.filter((file) => {
      const fileType = file.type;
      return (
        fileType === "application/pdf" ||
        fileType === "application/msword" ||
        fileType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        fileType === "text/plain"
      );
    });

    if (validFiles.length > 0) {
      setFiles((prev) => [
        ...prev,
        ...validFiles.map((file) => ({
          file,
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2), // Size in MB
          type: file.type,
          id: Date.now() + Math.random(),
        })),
      ]);
    }
  };

  // Remove file
  const removeFile = (fileId) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  // Get file icon based on type
  const getFileIcon = (fileType) => {
    if (fileType === "application/pdf")
      return <FaFilePdf className="text-red-500" />;
    if (fileType.includes("word"))
      return <FaFileWord className="text-blue-500" />;
    return <FaFileAlt className="text-gray-500" />;
  };

  // Handle upload
  const handleUpload = async () => {
    if (files.length === 0) return;

    try {
      setUploading(true);

      // Create FormData
      const formData = new FormData();
      files.forEach((fileObj) => {
        formData.append("resume", fileObj.file); // "resume" is the field name
      });

      // Send to backend
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
      dispatch(setResumeData(result.data))
      // Auto-hide success message after 5 seconds (but keep the button visible)
      setTimeout(() => {
        setUploadSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploading(false);
    }
  };

  // Handle save skills navigation
  const handleSaveSkills = async () => {
    

    let result = await axios.post(
      `${import.meta.env.VITE_API_URL}/resume/save`,
      {
        raw: rawData, // match backend
        parsed: rawData, // you don’t have parsed text, so fallback to rawData
        extractedSkills: skills, // match backend helper
      },
      { withCredentials: true }
    );

    dispatch(setResumeData(result.data));
    
    navigate(`/mentors/${userData.user._id}`);
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-indigo-100 w-full">
      {/* Navigation placeholder - replace with your Nav component */}
      <Nav></Nav>

      <div className="flex items-center flex-col p-6 sm:p-10 gap-8 mt-10">
        {/* Header */}
        <div className="text-center max-w-3xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-2xl mb-4 shadow-lg">
            <FaUpload size={32} className="text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Upload Your Resume
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Share your experience with mentors by uploading your resume. We
            accept PDF, Word, and text documents.
          </p>
        </div>

        {/* Main Upload Area */}
        <div className="w-full max-w-4xl">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 sm:p-12">
            {/* Upload Zone */}
            <div
              className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
                dragActive
                  ? "border-violet-400 bg-violet-50 scale-105"
                  : "border-gray-300 hover:border-violet-300 hover:bg-violet-25"
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
                        ? "bg-gradient-to-r from-violet-500 to-indigo-500 scale-110"
                        : "bg-gradient-to-r from-violet-100 to-indigo-100"
                    }`}
                  >
                    <MdCloudUpload
                      size={48}
                      className={dragActive ? "text-white" : "text-violet-600"}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {dragActive
                      ? "Drop your files here"
                      : "Choose files or drag & drop"}
                  </h3>
                  <p className="text-gray-600">
                    Support for PDF, DOC, DOCX, and TXT files up to 10MB
                  </p>
                </div>

                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <FaFilePdf className="text-red-500" />
                    <span>PDF</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaFileWord className="text-blue-500" />
                    <span>DOC/DOCX</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaFileAlt className="text-gray-500" />
                    <span>TXT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-8 space-y-4">
                <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-violet-400 to-indigo-400 rounded-full"></div>
                  Selected Files ({files.length})
                </h4>

                <div className="space-y-3">
                  {files.map((fileObj) => (
                    <div
                      key={fileObj.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200 hover:border-violet-200 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">
                          {getFileIcon(fileObj.type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 truncate max-w-xs">
                            {fileObj.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {fileObj.size} MB
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFile(fileObj.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <MdDelete size={20} />
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
                  className={`group relative px-8 py-4 rounded-2xl font-semibold transition-all duration-200 ${
                    uploading
                      ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed"
                      : "bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white hover:scale-105 shadow-lg hover:shadow-xl"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {uploading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <FaUpload size={20} />
                        <span>Upload Resume{files.length > 1 ? "s" : ""}</span>
                      </>
                    )}
                  </div>

                  {/* Shimmer effect */}
                  {!uploading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 rounded-2xl"></div>
                  )}
                </button>
              </div>
            )}

            {/* Success Message and Save Skills Button */}
            {uploadSuccess && (
              <div className="mt-8 space-y-6">
                {/* Success Message */}
                <div className="flex justify-center">
                  <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
                    <FaCheckCircle className="text-green-500" size={24} />
                    <span className="text-green-700 font-semibold text-lg">
                      Resume uploaded successfully!
                    </span>
                  </div>
                </div>

                {/* Save Skills Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleSaveSkills}
                    className="group relative px-8 py-4 rounded-2xl font-semibold transition-all duration-200 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center gap-3">
                      <FaCog size={20} />
                      <span>Save Your Skills</span>
                    </div>

                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 rounded-2xl"></div>
                  </button>
                </div>
              </div>
            )}

            {/* Tips Section */}
            <div className="mt-12 p-6 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl border border-violet-100">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                Resume Upload Tips
              </h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full mt-2"></div>
                  <span>
                    Use a clean, professional format with clear sections
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full mt-2"></div>
                  <span>Include your most relevant experience and skills</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full mt-2"></div>
                  <span>Keep your resume updated with recent achievements</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full mt-2"></div>
                  <span>PDF format is recommended for best compatibility</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadResume;
