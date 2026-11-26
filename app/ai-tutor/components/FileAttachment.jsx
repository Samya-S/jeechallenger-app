"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  FileText, 
  Image as ImageIcon, 
  FileSpreadsheet, 
  Download, 
  Eye, 
  X, 
  File 
} from "lucide-react";
import { FaSpinner } from "react-icons/fa";
import { API_ENDPOINTS } from "@/config/api-endpoints-config";

const FileAttachment = ({ file, onRemove, showRemove = false }) => {
  const previewImageLoader = ({ src }) => src;
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const getFileType = (mimeType = "", filename = "") => {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType === "application/pdf") return "pdf";
    if (mimeType.includes("word") || mimeType.includes("document")) return "document";
    if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return "spreadsheet";
    if (mimeType.includes("powerpoint") || mimeType.includes("presentation")) return "presentation";
    if (mimeType.startsWith("audio/")) return "audio";
    if (mimeType.startsWith("text/")) return "text";

    if (mimeType === "application/octet-stream" && filename) {
      const ext = filename.toLowerCase().split(".").pop();
      if (["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(ext)) return "image";
      if (ext === "pdf") return "pdf";
      if (["doc", "docx"].includes(ext)) return "document";
      if (["xls", "xlsx"].includes(ext)) return "spreadsheet";
      if (["ppt", "pptx"].includes(ext)) return "presentation";
      if (["mp3", "wav", "ogg", "m4a"].includes(ext)) return "audio";
      if (["txt", "csv", "json"].includes(ext)) return "text";
    }

    return "other";
  };

  const fileCategory = getFileType(file.mime_type, file.original_filename);

  const getFileIcon = () => {
    switch (fileCategory) {
      case "image":
        return <ImageIcon className="w-4 h-4 text-blue-500" />;
      case "pdf":
        return <FileText className="w-4 h-4 text-rose-500" />;
      case "document":
        return <FileText className="w-4 h-4 text-indigo-500" />;
      case "spreadsheet":
        return <FileSpreadsheet className="w-4 h-4 text-emerald-500" />;
      default:
        return <File className="w-4 h-4 text-slate-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handlePreview = async () => {
    if (fileCategory === "image") {
      setLoading(true);
      try {
        const response = await fetch(API_ENDPOINTS.FILES.GET(file.id), {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setPreviewUrl(data.download_url);
          setShowPreview(true);
        }
      } catch (error) {
        console.error("Error loading preview:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const response = await fetch(API_ENDPOINTS.FILES.GET(file.id), {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        window.open(data.download_url, "_blank");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setDownloading(false);
    }
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewUrl(null);
  };

  return (
    <>
      <div className="flex items-center gap-2.5 p-2 bg-slate-100/90 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/60 min-w-0 transition-colors">
        <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 shadow-2xs border border-slate-200/60 dark:border-slate-800">
          {getFileIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
            {file.original_filename}
          </p>
          <p className="text-[10px] text-slate-400 dark:text-slate-400">
            {formatFileSize(file.file_size)} • {fileCategory.toUpperCase()}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {fileCategory === "image" && (
            <button
              type="button"
              onClick={handlePreview}
              disabled={loading}
              className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
              title="Preview image"
              aria-label="Preview image"
            >
              {loading ? (
                <FaSpinner className="animate-spin text-xs text-blue-500" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            title="Download file"
            aria-label="Download file"
          >
            {downloading ? (
              <FaSpinner className="animate-spin text-xs text-emerald-500" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
          </button>

          {showRemove && onRemove && (
            <button
              type="button"
              onClick={() => onRemove(file.id)}
              className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
              title="Remove file"
              aria-label="Remove file"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {showPreview && previewUrl && (
        <div
          className="fixed inset-0 z-[10050] flex items-center justify-center bg-slate-900/80 dark:bg-black/85 backdrop-blur-sm p-4"
          onClick={closePreview}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closePreview();
            }}
            className="fixed top-5 right-5 z-[10060] text-white hover:text-slate-300 p-2 bg-slate-900/40 rounded-full backdrop-blur-md transition-colors"
            aria-label="Close preview"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[90vh] overflow-auto flex items-center justify-center">
            <Image
              src={previewUrl}
              alt={file.original_filename}
              width={1200}
              height={900}
              loader={previewImageLoader}
              unoptimized
              onClick={(e) => e.stopPropagation()}
              className="w-auto h-auto max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FileAttachment;
