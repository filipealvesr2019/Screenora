'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { 
  Globe, 
  ChevronDown, 
  LayoutGrid, 
  Maximize2, 
  Moon,
  Zap,
  ChevronsDown,
  Link
} from 'lucide-react';

export default function Topbar() {
  const { url, setUrl, globalZoom, isGrid, toggleGrid, setFullscreen, isExtendedMode, toggleExtendedMode, isSyncScrollMode, toggleSyncScrollMode } = useStore();
  const [inputUrl, setInputUrl] = useState(url);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const urlParam = searchParams.get('url');
    if (urlParam) {
      setUrl(urlParam);
      setInputUrl(urlParam);
    }
  }, [setUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add https:// if missing
    let formattedUrl = inputUrl;
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }
    setUrl(formattedUrl);
  };

  return (
    <div className="h-16 bg-[#0c0c0e] border-b border-[#1f1f23] flex items-center justify-between px-6 gap-4">
      {/* URL Input */}
      <form onSubmit={handleSubmit} className="flex-1 max-w-2xl flex items-center gap-2">
        <div className="flex-1 bg-[#141417] border border-[#1f1f23] focus-within:border-accent/50 rounded-lg flex items-center px-3 gap-2 transition-colors">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Enter URL (e.g. https://example.com)"
            className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground py-2.5"
          />
        </div>
        <button 
          type="submit"
          className="bg-accent hover:bg-accent/90 text-background font-semibold text-sm py-2.5 px-4 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
        >
          <Zap className="w-4 h-4 fill-current" />
          Load Preview
        </button>
      </form>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Zoom */}
        <div className="relative group">
          <button className="bg-[#141417] border border-[#1f1f23] hover:border-[#27272a] rounded-lg px-3 py-2 text-sm text-foreground flex items-center gap-2 transition-colors">
            <span>{Math.round(globalZoom * 100)}%</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
          {/* Dropdown would go here */}
        </div>

        {/* Grid Toggle */}
        <button 
          onClick={toggleGrid}
          className={`p-2 rounded-lg border transition-colors ${
            isGrid 
              ? 'bg-accent/10 border-accent text-accent' 
              : 'bg-[#141417] border-[#1f1f23] text-muted-foreground hover:text-foreground'
          }`}
          title="Toggle Grid"
        >
          <LayoutGrid className="w-5 h-5" />
        </button>



        {/* Fullscreen */}
        <button 
          onClick={() => setFullscreen(true)}
          className="p-2 bg-[#141417] border border-[#1f1f23] hover:border-[#27272a] text-muted-foreground hover:text-foreground rounded-lg transition-colors"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-5 h-5" />
        </button>

        {/* Theme (Quick toggle) */}
        <button 
          className="p-2 bg-[#141417] border border-[#1f1f23] hover:border-[#27272a] text-muted-foreground hover:text-foreground rounded-lg transition-colors"
          title="Theme"
        >
          <Moon className="w-5 h-5 fill-current" />
        </button>
      </div>
    </div>
  );
}
