'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Workspace } from './Workspace';

export type ToolCategory = 'Core' | 'Editing' | 'Social' | 'Advanced' | 'Utility';

export interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
  icon: React.ElementType;
  description: string;
  isReal?: boolean;
}

import { 
  Minimize, DropletOff, FileType, Scissors, Crop, RotateCw, 
  Sliders, Type, FastForward, Music, Instagram, Video, 
  Image as ImageIcon, FileAudio, FileImage, VolumeX, Activity,
  Calculator, Layers, Columns, UploadCloud, Info, MousePointer2
} from 'lucide-react';

export const TOOLS: Tool[] = [
  { id: 'compress', name: 'Compress Video', category: 'Core', icon: Minimize, description: 'Reduce file size with adjustable quality.', isReal: true },
  { id: 'watermark-remove', name: 'Remove Watermark', category: 'Core', icon: DropletOff, description: 'Simulated watermark removal.' },
  { id: 'convert', name: 'Format Converter', category: 'Core', icon: FileType, description: 'Convert to MP4, AVI, MOV, WebM, MKV.', isReal: true },
  
  { id: 'trim', name: 'Trim & Cut', category: 'Editing', icon: Scissors, description: 'Cut and merge video clips.', isReal: true },
  { id: 'crop', name: 'Crop & Resize', category: 'Editing', icon: Crop, description: 'Crop video frame.' },
  { id: 'rotate', name: 'Rotate & Flip', category: 'Editing', icon: RotateCw, description: 'Rotate or flip video.' },
  { id: 'adjust', name: 'Adjustments', category: 'Editing', icon: Sliders, description: 'Brightness, contrast, saturation.' },
  { id: 'watermark-add', name: 'Add Watermark', category: 'Editing', icon: Type, description: 'Add text or image watermark.' },
  { id: 'speed', name: 'Speed Control', category: 'Editing', icon: FastForward, description: 'Slow-mo or fast-forward.' },
  { id: 'extract-audio', name: 'Extract Audio', category: 'Editing', icon: Music, description: 'Convert video to MP3.', isReal: true },

  { id: 'social-ig', name: 'IG Reels Preset', category: 'Social', icon: Instagram, description: 'Auto-crop for Instagram Reels.' },
  { id: 'social-tiktok', name: 'TikTok Preset', category: 'Social', icon: Video, description: 'Auto-crop for TikTok.' },
  { id: 'social-yt', name: 'YT Shorts Preset', category: 'Social', icon: Video, description: 'Auto-crop for YouTube Shorts.' },
  
  { id: 'bg-remove', name: 'Remove Background', category: 'Advanced', icon: ImageIcon, description: 'AI background removal.' },
  { id: 'subtitles', name: 'Subtitles', category: 'Advanced', icon: Type, description: 'Auto-generate or upload SRT.' },
  { id: 'gif-maker', name: 'GIF Maker', category: 'Advanced', icon: FileImage, description: 'Convert video to GIF.', isReal: true },
  { id: 'thumbnail', name: 'Thumbnail Extractor', category: 'Advanced', icon: ImageIcon, description: 'Extract frame as image.' },
  { id: 'noise', name: 'Noise Reduction', category: 'Advanced', icon: VolumeX, description: 'Reduce audio noise.' },
  { id: 'stabilize', name: 'Stabilization', category: 'Advanced', icon: Activity, description: 'Stabilize shaky video.' },

  { id: 'size-estimator', name: 'Size Estimator', category: 'Utility', icon: Calculator, description: 'Estimate size before compression.' },
  { id: 'batch', name: 'Batch Processing', category: 'Utility', icon: Layers, description: 'Process multiple files.' },
  { id: 'compare', name: 'Side-by-Side', category: 'Utility', icon: Columns, description: 'Before/after preview.' },
  { id: 'metadata', name: 'Metadata Viewer', category: 'Utility', icon: Info, description: 'View and edit metadata.' },
];

export function Dashboard() {
  const [activeToolId, setActiveToolId] = useState<string>('compress');
  
  const activeTool = TOOLS.find(t => t.id === activeToolId) || TOOLS[0];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeToolId={activeToolId} onSelectTool={setActiveToolId} />
      <Workspace activeTool={activeTool} />
    </div>
  );
}
