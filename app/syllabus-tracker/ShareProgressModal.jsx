'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as htmlToImage from 'html-to-image';

/**
 * ShareProgressModal - Modal component for generating and sharing progress report
 */
const ShareProgressModal = ({ isOpen, onClose, progressData, overallStats, syllabusData }) => {
  const reportRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  // Generate image when modal opens
  useEffect(() => {
    if (isOpen && !generatedImage) {
      generateImage();
    }
  }, [isOpen]);

  // Calculate subject-wise progress
  const getSubjectProgress = () => {
    const subjects = {
      physics: { name: 'Physics', color: '#3B82F6', completed: 0, total: 0 },
      chemistry: { name: 'Chemistry', color: '#22C55E', completed: 0, total: 0 },
      mathematics: { name: 'Mathematics', color: '#A855F7', completed: 0, total: 0 }
    };

    // Iterate through ALL chapters in syllabus, not just progressData
    Object.entries(syllabusData).forEach(([subject, subjectData]) => {
      if (subjects[subject]) {
        const subjectProgressData = progressData[subject] || {};
        
        subjectData.chapters.forEach((chapter) => {
          const chapterProgress = subjectProgressData[chapter.id] || {
            theory: false,
            pyqs: false,
            revision: false
          };
          
          const tasks = ['theory', 'pyqs', 'revision'];
          tasks.forEach(task => {
            subjects[subject].total++;
            if (chapterProgress[task]) subjects[subject].completed++;
          });
        });
      }
    });

    return Object.values(subjects).map(subject => ({
      ...subject,
      percentage: subject.total > 0 ? Math.round((subject.completed / subject.total) * 100) : 0
    }));
  };

  // Generate image from HTML
  const generateImage = async () => {
    if (!reportRef.current) return;
    
    setIsGenerating(true);
    try {
      // Wait for fonts and all styles to fully load
      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use html-to-image for better CSS support
      const imageData = await htmlToImage.toPng(reportRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        width: 600,
        height: 600,
        cacheBust: true,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      });
      
      setGeneratedImage(imageData);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Share image
  const handleShare = async () => {
    if (!generatedImage) return;

    try {
      // Convert base64 to blob
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const file = new File([blob], 'jee-progress-report.png', { type: 'image/png' });

      // Check if Web Share API is supported
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My JEE Syllabus Progress',
          text: `I've completed ${overallStats.percentage}% of my JEE syllabus! 🎯\n\nTrack your progress at https://jeechallenger.vercel.app/syllabus-tracker`
        });
      } else {
        // Fallback: Download the image
        handleDownload();
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
        // Fallback to download
        handleDownload();
      }
    }
  };

  // Download image
  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.download = `jee-progress-${new Date().toISOString().split('T')[0]}.png`;
    link.href = generatedImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Close modal and reset
  const handleClose = () => {
    setGeneratedImage(null);
    onClose();
  };

  if (!isOpen) return null;

  const subjectProgress = getSubjectProgress();
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-2xl w-fit shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="hidden xs:inline">Share Your Progress</span>
            <span className="xs:hidden">Share</span>
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Report Card */}
        <div className="mb-4 sm:mb-6 flex justify-center overflow-hidden">
          <div 
            style={{
              width: '300px',
              height: '300px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden'
            }}
          >
            <div 
              ref={reportRef}
              className="shadow-2xl"
              style={{ 
                width: '600px',
                height: '600px',
                minWidth: '600px',
                minHeight: '600px',
                maxWidth: '600px',
                maxHeight: '600px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)',
                borderRadius: '16px',
                padding: '20px',
                transform: 'scale(0.5)',
                transformOrigin: 'center center',
                boxSizing: 'border-box'
              }}
            >
            {/* Report Content */}
            <div 
              style={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '20px 24px',
                boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
                boxSizing: 'border-box',
                overflow: 'hidden'
              }}
            >
              {/* Header */}
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '56px',
                    height: '56px',
                    background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                    borderRadius: '50%',
                    marginBottom: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '28px', height: '28px', color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                </div>
                <h1 style={{
                  fontSize: '22px',
                  fontWeight: '800',
                  color: '#111827',
                  marginBottom: '4px',
                  letterSpacing: '-0.5px',
                  lineHeight: '1.2'
                }}>JEE Progress Report</h1>
                <p style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#4B5563'
                }}>{currentDate}</p>
              </div>

              {/* Overall Progress */}
              <div style={{ margin: '12px 0', flexShrink: 0 }}>
                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                  <div style={{ 
                    fontSize: '54px',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '4px',
                    lineHeight: '1'
                  }}>
                    {overallStats.percentage}%
                  </div>
                  <p style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#1F2937'
                  }}>Overall Completion</p>
                </div>
                
                {/* Overall Progress Bar */}
                <div style={{
                  width: '100%',
                  backgroundColor: '#D1D5DB',
                  borderRadius: '9999px',
                  height: '14px',
                  overflow: 'hidden',
                  boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
                }}>
                  <div
                    style={{ 
                      height: '100%',
                      width: `${overallStats.percentage}%`,
                      background: 'linear-gradient(90deg, #10B981 0%, #3B82F6 50%, #8B5CF6 100%)',
                      borderRadius: '9999px',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                    }}
                  ></div>
                </div>
              </div>

              {/* Subject Breakdown */}
              <div style={{ padding: '0 8px', flexShrink: 0 }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: '800',
                  color: '#111827',
                  textAlign: 'center',
                  marginBottom: '12px',
                  letterSpacing: '-0.3px'
                }}>Subject-wise Progress</h3>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
                  {subjectProgress.map((subject) => {
                    const radius = 45;
                    const strokeWidth = 6;
                    const normalizedRadius = radius - strokeWidth / 2;
                    const circumference = normalizedRadius * 2 * Math.PI;
                    const strokeDashoffset = circumference - (subject.percentage / 100) * circumference;
                    
                    return (
                      <div key={subject.name} style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {/* Circular Progress */}
                        <div style={{ position: 'relative', width: '90px', height: '90px' }}>
                          <svg
                            height={radius * 2}
                            width={radius * 2}
                            style={{
                              transform: 'rotate(-90deg)',
                              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                            }}
                          >
                            {/* Background circle */}
                            <circle
                              stroke="#E5E7EB"
                              fill="transparent"
                              strokeWidth={strokeWidth}
                              r={normalizedRadius}
                              cx={radius}
                              cy={radius}
                            />
                            {/* Progress circle */}
                            <circle
                              stroke={subject.color}
                              fill="transparent"
                              strokeWidth={strokeWidth}
                              strokeDasharray={circumference + ' ' + circumference}
                              strokeDashoffset={strokeDashoffset}
                              strokeLinecap="round"
                              r={normalizedRadius}
                              cx={radius}
                              cy={radius}
                              style={{
                                transition: 'stroke-dashoffset 0.5s ease'
                              }}
                            />
                          </svg>
                          {/* Percentage in center */}
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: '18px',
                            fontWeight: '800',
                            color: subject.color
                          }}>
                            {subject.percentage}%
                          </div>
                        </div>
                        {/* Subject name */}
                        <div style={{
                          fontSize: '12px',
                          fontWeight: '700',
                          color: '#111827',
                          textAlign: 'center'
                        }}>
                          {subject.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div style={{
                textAlign: 'center',
                paddingTop: '10px',
                borderTop: '2px solid #D1D5DB',
                flexShrink: 0
              }}>
                <p style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#1F2937',
                  marginBottom: '5px',
                  lineHeight: '1.3'
                }}>
                  🎯 Making progress every day towards JEE success!
                </p>
                <p style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#374151',
                  lineHeight: '1.3'
                }}>
                  Track your progress at <span style={{ fontWeight: '800', color: '#2563EB' }}>jeechallenger.vercel.app</span>
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Loading State */}
        {isGenerating && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Generating your report...</p>
          </div>
        )}

        {/* Action Buttons */}
        {generatedImage && (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4">
            <button
              onClick={handleShare}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span className="hidden xs:inline">Share Progress</span>
              <span className="xs:hidden">Share</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
          </div>
        )}

        {/* Info Text */}
        <p className="text-[10px] xs:text-xs text-center text-gray-500 dark:text-gray-400 mt-3 sm:mt-4 px-2">
          💡 Tip: Share your progress with friends to stay motivated and inspire others!
        </p>
      </div>
    </div>
  );
};

export default ShareProgressModal;
