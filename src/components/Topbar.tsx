'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { 
  Loader2,
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
  const { url, setUrl, globalZoom, setGlobalZoom, isGrid, toggleGrid, setFullscreen, isFullscreen, isExtendedMode, toggleExtendedMode, isSyncScrollMode, toggleSyncScrollMode, globalScrollTop, setGlobalScrollTop, loadingCount } = useStore();
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
          {loadingCount > 0 ? (
            <Loader2 className="w-4 h-4 text-accent animate-spin" />
          ) : (
            <Globe className="w-4 h-4 text-muted-foreground" />
          )}
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
          <div className="absolute top-full right-0 mt-1 w-32 bg-[#0c0c0e] border border-[#1f1f23] rounded-lg shadow-xl py-1 hidden group-hover:block z-50">
            {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2].map((zoom) => (
              <button
                key={zoom}
                onClick={() => setGlobalZoom(zoom)}
                className={`w-full text-left px-4 py-1.5 text-sm hover:bg-[#141417] transition-colors ${
                  globalZoom === zoom ? 'text-accent font-semibold' : 'text-foreground'
                }`}
              >
                {Math.round(zoom * 100)}%
              </button>
            ))}
          </div>
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

        {/* Sync Scroll Toggle */}
        <button 
          onClick={toggleSyncScrollMode}
          className={`p-2 rounded-lg border transition-colors ${
            isSyncScrollMode 
              ? 'bg-accent/10 border-accent text-accent' 
              : 'bg-[#141417] border-[#1f1f23] text-muted-foreground hover:text-foreground'
          }`}
          title="Toggle Sync Scroll"
        >
          <ChevronsDown className="w-5 h-5" />
        </button>



        {/* Fullscreen */}
        <button 
          onClick={() => setFullscreen(!isFullscreen)}
          className={`p-2 rounded-lg border transition-colors ${
            isFullscreen 
              ? 'bg-accent/10 border-accent text-accent' 
              : 'bg-[#141417] border-[#1f1f23] text-muted-foreground hover:text-foreground'
          }`}
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
