import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Tool } from './Dashboard';
import { UploadCloud, FileVideo, X, Play, Pause, Settings2, FileAudio } from 'lucide-react';
import { ToolPanel } from './ToolPanel';

interface WorkspaceProps {
  activeTool: Tool;
}

export function Workspace({ activeTool }: WorkspaceProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setProcessedUrl(null);
      setProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.webm', '.mkv']
    },
    maxFiles: 1,
  });

  const clearFile = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (processedUrl) URL.revokeObjectURL(processedUrl);
    setProcessedUrl(null);
    setProgress(0);
  };

  return (
    <main className="flex-1 flex flex-col bg-zinc-950 overflow-hidden">
      <header className="h-16 border-b border-zinc-800 flex items-center px-8 justify-between bg-zinc-900/50">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
            <activeTool.icon className="w-5 h-5 text-indigo-400" />
            {activeTool.name}
          </h2>
          <p className="text-sm text-zinc-400">{activeTool.description}</p>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 p-8 overflow-y-auto flex flex-col items-center justify-center relative">
          {!file ? (
            <div
              {...getRootProps()}
              className={`w-full max-w-2xl aspect-video border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-12 transition-all cursor-pointer ${
                isDragActive
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="bg-zinc-800 p-4 rounded-full mb-6">
                <UploadCloud className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-medium text-zinc-200 mb-2">
                {isDragActive ? 'Drop video here' : 'Drag & drop video here'}
              </h3>
              <p className="text-zinc-500 text-center max-w-sm">
                Supports MP4, AVI, MOV, WebM, MKV up to 500MB.
              </p>
              <button className="mt-8 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
                Browse Files
              </button>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-4 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-500/20 p-2 rounded-lg">
                    <FileVideo className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200 truncate max-w-xs">{file.name}</p>
                    <p className="text-xs text-zinc-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={clearFile}
                  className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                  title="Remove file"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                {/* Original Preview */}
                <div className="flex flex-col bg-black rounded-xl overflow-hidden border border-zinc-800 relative group">
                  <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-md text-xs font-medium text-zinc-300 border border-white/10">
                    Original
                  </div>
                  <video
                    src={previewUrl!}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Processed Preview */}
                <div className="flex flex-col bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 relative items-center justify-center">
                  <div className="absolute top-4 left-4 z-10 bg-indigo-500/20 backdrop-blur-md px-3 py-1.5 rounded-md text-xs font-medium text-indigo-300 border border-indigo-500/30">
                    Result
                  </div>
                  
                  {isProcessing ? (
                    <div className="flex flex-col items-center justify-center w-full h-full p-8">
                      <div className="w-16 h-16 border-4 border-zinc-800 border-t-indigo-500 rounded-full animate-spin mb-6"></div>
                      <p className="text-zinc-300 font-medium mb-2">Processing...</p>
                      <div className="w-full max-w-xs bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="bg-indigo-500 h-2.5 rounded-full transition-all duration-300 ease-out" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-zinc-500 mt-2">{Math.round(progress)}%</p>
                    </div>
                  ) : processedUrl ? (
                    activeTool.id === 'extract-audio' ? (
                      <div className="flex flex-col items-center justify-center w-full h-full bg-zinc-900 p-8">
                        <FileAudio className="w-16 h-16 text-indigo-400 mb-6" />
                        <audio src={processedUrl} controls className="w-full max-w-md" />
                      </div>
                    ) : activeTool.id === 'gif-maker' ? (
                      <img src={processedUrl} alt="Generated GIF" className="w-full h-full object-contain bg-black" />
                    ) : (
                      <video
                        src={processedUrl}
                        controls
                        className="w-full h-full object-contain bg-black"
                      />
                    )
                  ) : (
                    <div className="flex flex-col items-center text-zinc-600">
                      <Settings2 className="w-12 h-12 mb-4 opacity-20" />
                      <p>Configure settings and process to preview</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Tool Settings */}
        <div className="w-80 bg-zinc-900 border-l border-zinc-800 flex flex-col h-full">
          <div className="p-4 border-b border-zinc-800">
            <h3 className="font-medium text-zinc-200 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-zinc-400" />
              Settings
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <ToolPanel 
              tool={activeTool} 
              file={file} 
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
              setProgress={setProgress}
              setProcessedUrl={setProcessedUrl}
              processedUrl={processedUrl}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
