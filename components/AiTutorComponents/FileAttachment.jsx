"use client";

import { useState } from "react";
import { FaFile, FaImage, FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFileAudio, FaFileAlt, FaDownload, FaEye, FaTimes } from "react-icons/fa";
import { API_ENDPOINTS } from "@/lib/api-endpoints-config";

const FileAttachment = ({ file, onRemove, showRemove = false }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const getFileType = (mimeType, filename = '') => {
    // First try mime type
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'document';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'spreadsheet';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'presentation';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('text/')) return 'text';

    // If mime type is generic (octet-stream), try file extension
    if (mimeType === 'application/octet-stream' && filename) {
      const extension = filename.toLowerCase().split('.').pop();

      if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(extension)) {
        return 'image';
      }
      if (extension === 'pdf') return 'pdf';
      if (['doc', 'docx'].includes(extension)) return 'document';
      if (['xls', 'xlsx'].includes(extension)) return 'spreadsheet';
      if (['ppt', 'pptx'].includes(extension)) return 'presentation';
      if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension)) return 'audio';
      if (['txt', 'csv', 'json'].includes(extension)) return 'text';
    }

    return 'other';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handlePreview = async () => {
    if (file.file_type === 'image') {
      setLoading(true);
      try {
        const token = localStorage.getItem('ai-tutor-token');
        const response = await fetch(API_ENDPOINTS.FILES.GET(file.id), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setPreviewUrl(url);
          setShowPreview(true);
        }
      } catch (error) {
        console.error('Error loading preview:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('ai-tutor-token');
      const response = await fetch(API_ENDPOINTS.FILES.GET(file.id), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.original_filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const closePreview = () => {
    setShowPreview(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <>
      <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <div className="w-10 h-10 flex items-center justify-center">
          {getFileIcon(getFileType(file.mime_type, file.original_filename))}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {file.original_filename}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatFileSize(file.file_size)} • {getFileType(file.mime_type, file.original_filename)}
          </p>
          {/* Extracted text display - commented out
           {file.extracted_text && (
             <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
               {file.extracted_text.substring(0, 100)}...
             </p>
           )}
           */}
        </div>
        <div className="flex items-center space-x-1">
          {file.file_type === 'image' && (
            <button
              onClick={handlePreview}
              disabled={loading}
              className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"
              title="Preview"
              aria-label="Preview image"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaEye className="text-sm" />
              )}
            </button>
          )}
          <button
            onClick={handleDownload}
            className="p-1.5 text-gray-400 hover:text-green-500 transition-colors"
            title="Download"
            aria-label="Download file"
          >
            <FaDownload className="text-sm" />
          </button>
          {showRemove && onRemove && (
            <button
              onClick={() => onRemove(file.id)}
              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
              title="Remove"
              aria-label="Remove file"
            >
              <FaTimes className="text-sm" />
            </button>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {showPreview && previewUrl && (
        <div className="fixed inset-0 !m-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-[90vh] mx-4">
            <button
              onClick={closePreview}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Close preview"
            >
              <FaTimes className="text-2xl" />
            </button>
            <img
              src={previewUrl}
              alt={file.original_filename}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FileAttachment; 