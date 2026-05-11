'use client';

import React, { useState, useEffect } from 'react';
import { Device, useStore } from '@/store/useStore';
import { 
  RotateCw, 
  Trash2, 
  Smartphone, 
  Tablet, 
  Monitor,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface DeviceFrameProps {
  device: Device;
}

export default function DeviceFrame({ device }: DeviceFrameProps) {
  const { url, removeDevice, updateDevice, isExtendedMode } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [iframeHeight, setIframeHeight] = useState<number | null>(null);

  useEffect(() => {
    if (isExtendedMode && !isLoading) {
      setTimeout(() => {
        const iframe = document.getElementById(`iframe-${device.id}`) as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
          try {
            const h = iframe.contentWindow.document.body.scrollHeight;
            setIframeHeight(h);
          } catch (e) {
            console.log("Failed to read height", e);
          }
        }
      }, 500);
    }
  }, [isExtendedMode, isLoading, device.id]);

  const toggleRotate = () => {
    updateDevice(device.id, { isRotated: !device.isRotated });
  };

  const reloadIframe = () => {
    setIsLoading(true);
    setHasError(false);
    // Force iframe reload
    const iframe = document.getElementById(`iframe-${device.id}`) as HTMLIFrameElement;
    if (iframe) iframe.src = url;
  };

  const width = device.isRotated ? device.height : device.width;
  const baseHeight = device.isRotated ? device.width : device.height;
  const height = isExtendedMode ? (iframeHeight || 3000) : baseHeight;

  return (
    <div className="flex-shrink-0 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <div>
          <div className="flex items-center gap-2">
            {device.type === 'mobile' && <Smartphone className="w-4 h-4 text-muted-foreground" />}
            {device.type === 'tablet' && <Tablet className="w-4 h-4 text-muted-foreground" />}
            {device.type === 'desktop' && <Monitor className="w-4 h-4 text-muted-foreground" />}
            <span className="font-semibold text-sm text-foreground">{device.name}</span>
          </div>
          <span className="text-xs text-muted-foreground">{width} × {height}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <button 
            onClick={toggleRotate}
            className="p-1.5 hover:bg-[#1a1a1e] rounded-md text-muted-foreground hover:text-foreground transition-colors"
            title="Rotate"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button 
            onClick={reloadIframe}
            className="p-1.5 hover:bg-[#1a1a1e] rounded-md text-muted-foreground hover:text-foreground transition-colors"
            title="Reload"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button 
            className="p-1.5 hover:bg-[#1a1a1e] rounded-md text-muted-foreground hover:text-foreground transition-colors"
            title="External Link"
            onClick={() => window.open(url, '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button 
            onClick={() => removeDevice(device.id)}
            className="p-1.5 hover:bg-[#1a1a1e] hover:text-red-500 rounded-md text-muted-foreground transition-colors"
            title="Remove"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div 
        className="relative bg-[#0c0c0e] rounded-xl border border-[#1f1f23] shadow-2xl overflow-hidden"
        style={{ 
          width: `${width}px`, 
          height: `${height}px`,
          transform: `scale(${device.zoom})`,
          transformOrigin: 'top left'
        }}
      >
        {/* Loading Skeleton */}
        {isLoading && (
          <div className="absolute inset-0 bg-[#141417] flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-[#1f1f23] border-t-accent rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">Loading preview...</span>
          </div>
        )}

        {/* Error State (Simulated since iframe error detection is hard due to CORS) */}
        {hasError && (
          <div className="absolute inset-0 bg-[#141417] flex flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center font-bold text-xl">!</div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Failed to load</h3>
              <p className="text-xs text-muted-foreground">This site might refuse to be displayed in an iframe (X-Frame-Options).</p>
            </div>
            <button 
              onClick={reloadIframe}
              className="text-xs text-accent font-semibold hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        <iframe
          id={`iframe-${device.id}`}
          src={url}
          className={`w-full h-full border-0 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => {
            setIsLoading(false);
            if (isExtendedMode) {
              setTimeout(() => {
                const iframe = document.getElementById(`iframe-${device.id}`) as HTMLIFrameElement;
                if (iframe && iframe.contentWindow) {
                  try {
                    const h = iframe.contentWindow.document.body.scrollHeight;
                    setIframeHeight(h);
                  } catch (e) {
                    console.log("Failed to read height", e);
                  }
                }
              }, 500); // Give it a bit of time to render
            }
          }}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          sandbox="allow-scripts allow-same-origin"
          scrolling={isExtendedMode ? 'no' : 'auto'}
        />
      </div>
    </div>
  );
}
