"use client";

import { useState, useRef, useCallback } from "react";
import { FaUpload, FaFile, FaImage, FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFileAudio, FaFileAlt, FaTimes, FaSpinner, FaCheck } from "react-icons/fa";
import { API_ENDPOINTS } from "@/lib/api-endpoints-config";
import { clearAuthData } from "@/lib/auth-utils";
import { googleLogout } from '@react-oauth/google';

const FileUpload = ({ onFilesUploaded, onClose, isVisible }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'image':
        return <FaImage className="text-blue-500" />;
      case 'pdf':
        return <FaFilePdf className="text-red-500" />;
      case 'document':
        return <FaFileWord className="text-blue-600" />;
      case 'spreadsheet':
        return <FaFileExcel className="text-green-600" />;
      case 'presentation':
        return <FaFilePowerpoint className="text-orange-600" />;
      case 'audio':
        return <FaFileAudio className="text-purple-500" />;
      case 'text':
        return <FaFileAlt className="text-gray-600" />;
      default:
        return <FaFile className="text-gray-500" />;
    }
  };

  const getFileType = (mimeType) => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'document';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'spreadsheet';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'presentation';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('text/')) return 'text';
    return 'other';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleLogout = () => {
    // Clear Google OAuth session
    googleLogout();

    // Reset all states to initial values
    setUploadedFiles([]);
    setError("");
    setUploading(false);

    // Clear all auth-related data from localStorage
    clearAuthData();
  };

  const handleFiles = async (files) => {
    setError("");
    setUploading(true);

    const token = localStorage.getItem('ai-tutor-token');
    if (!token) {
      handleLogout();
      setUploading(false);
      return;
    }

    // Test backend connection first
    try {
      console.log('Testing backend connection...');
      const testResponse = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Backend test response status:', testResponse.status);

      if (!testResponse.ok) {
        const testText = await testResponse.text();
        console.log('Backend test response:', testText);
      }
    } catch (testError) {
      console.error('Backend connection test failed:', testError);
      setError('Cannot connect to backend server. Please check if the server is running.');
      setUploading(false);
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });

    try {
      console.log('Uploading to:', API_ENDPOINTS.FILES.UPLOAD);
      const response = await fetch(API_ENDPOINTS.FILES.UPLOAD, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

        try {
          const errorData = await response.text();
          console.log('Error response body:', errorData);

          if (response.status === 429) {
            errorMessage = "You've reached your daily limit for file uploads. Please try again tomorrow or upgrade your plan for higher limits.";
          } else if (response.status === 413) {
            errorMessage = "File size too large. Please choose a smaller file or upgrade your plan for larger file uploads.";
          } else if (response.status === 400) {
            errorMessage = "Unsupported file type. Please check your plan's supported file types or upgrade for more options.";
          } else {
            // Try to parse as JSON
            try {
              const jsonError = JSON.parse(errorData);
              errorMessage = jsonError.detail || jsonError.message || errorMessage;
            } catch (jsonError) {
              // If not JSON, use the raw text
              errorMessage = errorData || errorMessage;
            }
          }
        } catch (textError) {
          console.error('Error reading response text:', textError);
        }

        throw new Error(errorMessage);
      }

      const responseText = await response.text();
      console.log('Success response body:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        throw new Error('Invalid JSON response from server');
      }

      setUploadedFiles(data.files || []);

      // Notify parent component about uploaded files
      if (onFilesUploaded) {
        onFilesUploaded(data.files || []);
      }
    } catch (error) {
      console.error('Upload error:', error);
      let displayError = 'Failed to upload files';
      if (typeof error.message === 'string' && (
        error.message.includes('limit') ||
        error.message.includes('File size') ||
        error.message.includes('Unsupported file type')
      )) {
        displayError = error.message;
      }
      setError(displayError);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const deleteFile = async (fileId) => {
    const token = localStorage.getItem('ai-tutor-token');
    if (!token) return;

    try {
      const response = await fetch(API_ENDPOINTS.FILES.DELETE(fileId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        removeFile(fileId);
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl mx-4 shadow-2xl border border-gray-200 dark:border-gray-700 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <FaUpload className="text-blue-600 dark:text-blue-400 text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Upload Files
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Upload files to analyze with AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <FaUpload className="mx-auto text-4xl text-gray-400" />
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                Drop files here or click to browse
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Supports images, documents, audio, and text files
              </p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Choose Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileInput}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv,.mp3,.wav,.ogg,.m4a"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <FaSpinner className="text-blue-600 animate-spin" />
              <span className="text-blue-700 dark:text-blue-300">Uploading files...</span>
            </div>
          </div>
        )}

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Uploaded Files ({uploadedFiles.length})
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 flex items-center justify-center">
                      {getFileIcon(getFileType(file.mime_type))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.original_filename}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.file_size)} • {getFileType(file.mime_type)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {file.is_processed && (
                      <FaCheck className="text-green-500 text-sm" />
                    )}
                    <button
                      onClick={() => deleteFile(file.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <FaTimes className="text-sm" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Close
          </button>
          {uploadedFiles.length > 0 && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Use Files in Chat
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload; 