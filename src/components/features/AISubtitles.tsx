import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, Play, Pause, Captions, Download, Settings, FileVideo } from 'lucide-react';

interface AISubtitlesProps {
  onClose: () => void;
}

const AISubtitles: React.FC<AISubtitlesProps> = ({ onClose }) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [subtitles, setSubtitles] = useState<Array<{timestamp: string, text: string}>>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      generateSubtitles();
    }
  };

  const generateSubtitles = () => {
    setIsProcessing(true);
    
    // Simulate AI subtitle generation
    setTimeout(() => {
      const mockSubtitles = [
        { timestamp: '00:00', text: 'Welcome to our presentation today.' },
        { timestamp: '00:05', text: 'We will be discussing accessibility features.' },
        { timestamp: '00:12', text: 'These tools help deaf and mute users communicate.' },
        { timestamp: '00:18', text: 'Real-time captioning is one of our key features.' },
        { timestamp: '00:25', text: 'AI technology makes this possible.' },
        { timestamp: '00:30', text: 'Thank you for watching this demonstration.' }
      ];
      setSubtitles(mockSubtitles);
      setIsProcessing(false);
    }, 3000);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const getCurrentSubtitle = () => {
    const current = subtitles.find((sub, index) => {
      const nextSub = subtitles[index + 1];
      const currentSeconds = parseTimeToSeconds(sub.timestamp);
      const nextSeconds = nextSub ? parseTimeToSeconds(nextSub.timestamp) : Infinity;
      return currentTime >= currentSeconds && currentTime < nextSeconds;
    });
    return current?.text || '';
  };

  const parseTimeToSeconds = (timeStr: string) => {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  const downloadSubtitles = () => {
    const srtContent = subtitles.map((sub, index) => {
      const nextSub = subtitles[index + 1];
      const endTime = nextSub ? nextSub.timestamp : '00:35';
      return `${index + 1}\n${sub.timestamp},000 --> ${endTime},000\n${sub.text}\n`;
    }).join('\n');
    
    const blob = new Blob([srtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subtitles.srt';
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={onClose}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mr-6"
          aria-label="Go back to deaf portal"
        >
          <ArrowLeft size={24} aria-hidden="true" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <Captions size={24} className="text-indigo-600" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Subtitles</h1>
            <p className="text-gray-600">Generate automatic subtitles for videos</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Video Upload & Player */}
        <div className="space-y-6">
          {/* Upload Area */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Video</h2>
            
            {!videoFile ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors duration-200"
              >
                <FileVideo size={48} className="mx-auto mb-4 text-gray-400" aria-hidden="true" />
                <p className="text-lg font-medium text-gray-700 mb-2">Upload Video File</p>
                <p className="text-gray-500">Drag and drop or click to select</p>
                <p className="text-sm text-gray-400 mt-2">Supports MP4, WebM, AVI formats</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileVideo size={20} className="text-indigo-600" aria-hidden="true" />
                    <span className="font-medium text-indigo-900">{videoFile.name}</span>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Change
                  </button>
                </div>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className="hidden"
              aria-label="Upload video file"
            />
          </div>

          {/* Video Player */}
          {videoUrl && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="relative">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  onTimeUpdate={handleTimeUpdate}
                  className="w-full aspect-video bg-black"
                  controls={false}
                  aria-label="Video player with AI-generated subtitles"
                />
                
                {/* Subtitle Overlay */}
                {getCurrentSubtitle() && (
                  <div className="absolute bottom-4 left-4 right-4 bg-black/80 text-white p-3 rounded-lg text-center">
                    <p className="text-lg font-medium">{getCurrentSubtitle()}</p>
                  </div>
                )}
              </div>
              
              {/* Custom Controls */}
              <div className="p-4 bg-gray-50">
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={togglePlayPause}
                    className="w-12 h-12 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  >
                    {isPlaying ? <Pause size={20} aria-hidden="true" /> : <Play size={20} aria-hidden="true" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Subtitles Panel */}
        <div className="space-y-6">
          {/* Processing Status */}
          {isProcessing && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating Subtitles</h3>
                <p className="text-gray-600">AI is analyzing your video and creating captions...</p>
              </div>
            </div>
          )}

          {/* Subtitles List */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Generated Subtitles</h2>
                {subtitles.length > 0 && (
                  <button
                    onClick={downloadSubtitles}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                    aria-label="Download subtitles file"
                  >
                    <Download size={16} aria-hidden="true" />
                    <span>Download SRT</span>
                  </button>
                )}
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {subtitles.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Captions size={48} className="mx-auto mb-4 opacity-30" aria-hidden="true" />
                  <p>No subtitles generated yet</p>
                  <p className="text-sm">Upload a video to get started</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {subtitles.map((subtitle, index) => (
                    <div 
                      key={index} 
                      className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${
                        getCurrentSubtitle() === subtitle.text ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {subtitle.timestamp}
                        </span>
                        <p className="text-gray-900 flex-1">{subtitle.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Subtitle Settings</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="subtitle-language" className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select 
                  id="subtitle-language"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="subtitle-accuracy" className="block text-sm font-medium text-gray-700 mb-2">
                  Accuracy Level
                </label>
                <select 
                  id="subtitle-accuracy"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="standard">Standard</option>
                  <option value="high">High Accuracy</option>
                  <option value="realtime">Real-time</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-indigo-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-indigo-900 mb-3">How AI Subtitles Work</h3>
        <ul className="space-y-2 text-indigo-800" role="list">
          <li>• Upload your video file or provide a video URL</li>
          <li>• AI analyzes the audio track and generates accurate captions</li>
          <li>• Subtitles are synchronized with the video timeline</li>
          <li>• Download subtitles in SRT format for use in other players</li>
          <li>• Supports multiple languages and dialects</li>
          <li>• Real-time processing for live video streams</li>
        </ul>
      </div>
    </div>
  );
};

export default AISubtitles;