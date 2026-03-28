import React, { useState } from 'react';
import { Tool } from './Dashboard';
import { processVideo } from '@/lib/ffmpeg';
import { Download, Play, AlertCircle } from 'lucide-react';

interface ToolPanelProps {
  tool: Tool;
  file: File | null;
  isProcessing: boolean;
  setIsProcessing: (val: boolean) => void;
  setProgress: (val: number) => void;
  setProcessedUrl: (url: string | null) => void;
  processedUrl: string | null;
}

export function ToolPanel({ tool, file, isProcessing, setIsProcessing, setProgress, setProcessedUrl, processedUrl }: ToolPanelProps) {
  const [quality, setQuality] = useState(23); // CRF value for compression
  const [format, setFormat] = useState('mp4');
  const [trimStart, setTrimStart] = useState('00:00:00');
  const [trimEnd, setTrimEnd] = useState('00:00:10');

  const handleProcess = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    setProcessedUrl(null);

    try {
      if (tool.isReal) {
        let command: string[] = [];
        let outputName = `output.${format}`;
        let mimeType = 'video/mp4';

        switch (tool.id) {
          case 'compress':
            command = ['-i', '{input}', '-vcodec', 'libx264', '-crf', quality.toString(), outputName];
            break;
          case 'convert':
            command = ['-i', '{input}', outputName];
            mimeType = `video/${format}`;
            break;
          case 'trim':
            command = ['-i', '{input}', '-ss', trimStart, '-to', trimEnd, '-c', 'copy', outputName];
            break;
          case 'extract-audio':
            outputName = 'output.mp3';
            command = ['-i', '{input}', '-vn', '-acodec', 'libmp3lame', outputName];
            mimeType = 'audio/mp3';
            break;
          case 'gif-maker':
            outputName = 'output.gif';
            command = ['-i', '{input}', '-vf', 'fps=10,scale=320:-1:flags=lanczos', outputName];
            mimeType = 'image/gif';
            break;
          default:
            command = ['-i', '{input}', outputName];
        }

        const resultBlob = await processVideo(file, command, outputName, setProgress, mimeType);
        const url = URL.createObjectURL(resultBlob);
        setProcessedUrl(url);
      } else {
        // Simulate processing for non-real tools
        for (let i = 0; i <= 100; i += 5) {
          setProgress(i);
          await new Promise(r => setTimeout(r, 100));
        }
        setProcessedUrl(URL.createObjectURL(file)); // Just show original as mock
      }
    } catch (error) {
      console.error('Processing failed:', error);
      alert('Processing failed. Please try a different file or settings.');
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };

  if (!file) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-4">
        <AlertCircle className="w-8 h-8 opacity-50" />
        <p className="text-sm text-center">Upload a video to configure settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tool-specific settings */}
      {tool.id === 'compress' && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-300">
            Compression Quality (CRF)
            <span className="block text-xs text-zinc-500 mt-1">Lower is better quality, higher is smaller size.</span>
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="51"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <span className="text-sm font-mono bg-zinc-800 px-2 py-1 rounded text-zinc-300">{quality}</span>
          </div>
        </div>
      )}

      {tool.id === 'convert' && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-300">Target Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          >
            <option value="mp4">MP4</option>
            <option value="avi">AVI</option>
            <option value="mov">MOV</option>
            <option value="webm">WebM</option>
            <option value="mkv">MKV</option>
          </select>
        </div>
      )}

      {tool.id === 'trim' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Start Time</label>
              <input
                type="text"
                value={trimStart}
                onChange={(e) => setTrimStart(e.target.value)}
                placeholder="HH:MM:SS"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">End Time</label>
              <input
                type="text"
                value={trimEnd}
                onChange={(e) => setTrimEnd(e.target.value)}
                placeholder="HH:MM:SS"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {tool.id === 'adjust' && (
        <div className="space-y-4">
          {['Brightness', 'Contrast', 'Saturation'].map(adj => (
            <div key={adj}>
              <label className="block text-sm font-medium text-zinc-300 mb-2">{adj}</label>
              <input type="range" min="-100" max="100" defaultValue="0" className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
            </div>
          ))}
        </div>
      )}

      {tool.id === 'watermark-add' && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-300">Watermark Text</label>
          <input type="text" placeholder="Enter text..." className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
          <label className="block text-sm font-medium text-zinc-300 mt-4">Position</label>
          <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none">
            <option>Bottom Right</option>
            <option>Bottom Left</option>
            <option>Top Right</option>
            <option>Top Left</option>
            <option>Center</option>
          </select>
        </div>
      )}

      {tool.id === 'speed' && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-300">Playback Speed</label>
          <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none">
            <option>0.25x (Slow Motion)</option>
            <option>0.5x (Slow Motion)</option>
            <option>0.75x</option>
            <option selected>1.0x (Normal)</option>
            <option>1.25x</option>
            <option>1.5x (Fast Forward)</option>
            <option>2.0x (Fast Forward)</option>
          </select>
        </div>
      )}

      {tool.id.startsWith('social-') && (
        <div className="space-y-4">
          <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
            <h4 className="text-sm font-medium text-zinc-200 mb-2">Preset Details</h4>
            <ul className="text-xs text-zinc-400 space-y-1">
              <li>• Aspect Ratio: 9:16</li>
              <li>• Resolution: 1080x1920</li>
              <li>• Max Duration: 60s</li>
              <li>• Format: MP4</li>
            </ul>
          </div>
        </div>
      )}

      {tool.id === 'bg-remove' && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-300">Background Replacement</label>
          <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none">
            <option>Transparent (Alpha Channel)</option>
            <option>Solid Color (Green Screen)</option>
            <option>Solid Color (Black)</option>
            <option>Solid Color (White)</option>
            <option>Custom Image...</option>
          </select>
        </div>
      )}

      {tool.id === 'subtitles' && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-300">Subtitle Source</label>
          <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none">
            <option>Auto-Generate (AI)</option>
            <option>Upload SRT File</option>
            <option>Upload VTT File</option>
          </select>
          <label className="block text-sm font-medium text-zinc-300 mt-4">Language</label>
          <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none">
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
            <option>Auto-Detect</option>
          </select>
        </div>
      )}

      {tool.id === 'size-estimator' && (
        <div className="space-y-4">
          <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
            <h4 className="text-sm font-medium text-zinc-200 mb-2">Current File</h4>
            <p className="text-xs text-zinc-400">Size: {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
          </div>
          <label className="block text-sm font-medium text-zinc-300 mt-4">Target Size (MB)</label>
          <input type="number" defaultValue={Math.max(1, Math.floor(file.size / (1024 * 1024) / 2))} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
          <p className="text-xs text-zinc-500 mt-2">We will adjust bitrate and resolution to hit this target.</p>
        </div>
      )}

      {tool.id === 'crop' && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-300">Aspect Ratio</label>
          <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none">
            <option>Freeform</option>
            <option>16:9 (Landscape)</option>
            <option>9:16 (Portrait)</option>
            <option>1:1 (Square)</option>
            <option>4:3</option>
          </select>
          <p className="text-xs text-zinc-500 mt-2">Use the handles on the video preview to crop.</p>
        </div>
      )}

      {tool.id === 'rotate' && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-300">Rotation</label>
          <div className="grid grid-cols-2 gap-2">
            <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-2 rounded-lg text-sm transition-colors">Rotate Left 90°</button>
            <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-2 rounded-lg text-sm transition-colors">Rotate Right 90°</button>
          </div>
          <label className="block text-sm font-medium text-zinc-300 mt-4">Flip</label>
          <div className="grid grid-cols-2 gap-2">
            <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-2 rounded-lg text-sm transition-colors">Flip Horizontal</button>
            <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-2 rounded-lg text-sm transition-colors">Flip Vertical</button>
          </div>
        </div>
      )}

      {tool.id === 'thumbnail' && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-300">Extract Frame At</label>
          <input type="text" defaultValue="00:00:05" placeholder="HH:MM:SS" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none font-mono" />
          <label className="block text-sm font-medium text-zinc-300 mt-4">Format</label>
          <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none">
            <option>JPEG</option>
            <option>PNG</option>
            <option>WebP</option>
          </select>
        </div>
      )}

      {tool.id === 'metadata' && (
        <div className="space-y-4">
          <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700 space-y-2">
            <h4 className="text-sm font-medium text-zinc-200 mb-2">Current Metadata</h4>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Title:</span>
              <span className="text-zinc-300">Unknown</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Author:</span>
              <span className="text-zinc-300">Unknown</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Copyright:</span>
              <span className="text-zinc-300">Unknown</span>
            </div>
          </div>
          <label className="block text-sm font-medium text-zinc-300 mt-4">New Title</label>
          <input type="text" placeholder="Enter title..." className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
      )}

      {!tool.isReal && (
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
          <p className="text-sm text-indigo-300">
            <strong>Simulation Mode:</strong> This tool is currently in simulation mode. In a production environment, this would require a dedicated backend processing server.
          </p>
        </div>
      )}

      <button
        onClick={handleProcess}
        disabled={isProcessing}
        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            Start Processing
          </>
        )}
      </button>

      {processedUrl && (
        <a
          href={processedUrl}
          download={`processed-${file.name}`}
          className="w-full py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 mt-4"
        >
          <Download className="w-4 h-4" />
          Download Result
        </a>
      )}
    </div>
  );
}
