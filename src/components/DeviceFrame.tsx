'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Device, useStore } from '@/store/useStore';
import {
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
  const { url, setUrl, removeDevice, updateDevice, isExtendedMode, isSyncScrollMode, globalScrollTop, maxContentHeight, setMaxContentHeight, incrementLoadingCount, decrementLoadingCount, reloadKey } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [iframeHeight, setIframeHeight] = useState<number | null>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'NAVIGATE') {
        setUrl(event.data.url);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setUrl]);

  const isLoadingRef = useRef(isLoading);
  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    incrementLoadingCount();

    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      fetch(url)
        .then(res => res.text())
        .then(html => {
          const baseTag = `<base href="${url}">`;
          const scriptTag = `<script>
            const noop = () => {};
            try {
              window.history.pushState = noop;
              window.history.replaceState = noop;
            } catch (e) {}

            document.addEventListener('click', function(e) {
              const target = e.target.closest('a');
              if (target && target.href) {
                const href = target.href;
                const currentUrl = new URL(${JSON.stringify(url)});
                const clickedUrl = new URL(href, ${JSON.stringify(url)});
                
                if (currentUrl.origin === clickedUrl.origin && currentUrl.pathname === clickedUrl.pathname && clickedUrl.hash) {
                  return;
                }
                
                e.preventDefault();
                window.parent.postMessage({
                  type: 'NAVIGATE',
                  url: href
                }, '*');
              }
            });
          </script>`;
          let modifiedHtml = html;
          if (html.includes('<head>')) {
            modifiedHtml = html.replace('<head>', `<head>${baseTag}${scriptTag}`);
          } else {
            modifiedHtml = baseTag + scriptTag + html;
          }
          setHtmlContent(modifiedHtml);
        })
        .catch(err => {
          console.error('Fetch failed:', err);
          setHasError(true);
        });
    } else {
      setHtmlContent(null);
    }

    return () => {
      if (isLoadingRef.current) {
        decrementLoadingCount();
      }
    };
  }, [url, reloadKey]);

  useEffect(() => {
    if ((isExtendedMode || isSyncScrollMode) && !isLoading) {
      setTimeout(() => {
        const iframe = document.getElementById(`iframe-${device.id}`) as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
          try {
            const h = iframe.contentWindow.document.body.scrollHeight;
            setIframeHeight(h);
            if (h > maxContentHeight) {
              setMaxContentHeight(h);
            }
          } catch (e) {
            console.log("Failed to read height", e);
          }
        }
      }, 500);
    }
  }, [isExtendedMode, isSyncScrollMode, isLoading, device.id, maxContentHeight, setMaxContentHeight]);





  const reloadIframe = () => {
    setIsLoading(true);
    setHasError(false);
    // Force iframe reload
    const iframe = document.getElementById(`iframe-${device.id}`) as HTMLIFrameElement;
    if (iframe) iframe.src = url;
  };

  const width = device.isRotated ? device.height : device.width;
  const baseHeight = device.isRotated ? device.width : device.height;
  const height = (isExtendedMode && !isSyncScrollMode) ? (iframeHeight || maxContentHeight) : baseHeight;

  const percentage = globalScrollTop / maxContentHeight;
  const maxScroll = (iframeHeight || maxContentHeight) - baseHeight;
  const myTranslate = percentage * maxScroll;

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
          src={htmlContent ? undefined : `/api/proxy?url=${encodeURIComponent(url)}`}
          srcDoc={htmlContent || undefined}
          className={`w-full border-0 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          style={{
            height: isSyncScrollMode ? `${iframeHeight || maxContentHeight}px` : '100%',
            transform: isSyncScrollMode ? `translateY(-${myTranslate}px)` : 'none',
            pointerEvents: isSyncScrollMode ? 'none' : 'auto',
          }}
          onLoad={() => {
            if (isLoading) {
              setIsLoading(false);
              decrementLoadingCount();
            }

            // Try to attach click listener for navigation sync
            const iframe = document.getElementById(`iframe-${device.id}`) as HTMLIFrameElement;
            if (iframe && iframe.contentWindow) {
              try {
                iframe.contentWindow.document.addEventListener('click', (e) => {
                  const target = (e.target as HTMLElement).closest('a');
                  if (target && target.href) {
                    const href = target.href;
                    const currentUrl = new URL(url);
                    const clickedUrl = new URL(href, url);

                    if (currentUrl.origin === clickedUrl.origin && currentUrl.pathname === clickedUrl.pathname && clickedUrl.hash) {
                      return;
                    }

                    e.preventDefault();
                    setUrl(href);
                  }
                });
              } catch (e) {
                console.log("Failed to attach click listener (likely cross-origin)", e);
              }
            }

            if (isExtendedMode || isSyncScrollMode) {
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
            if (isLoading) {
              setIsLoading(false);
              decrementLoadingCount();
            }
            setHasError(true);
          }}
          sandbox="allow-scripts allow-same-origin"
          scrolling={(isExtendedMode || isSyncScrollMode) ? 'no' : 'auto'}
        />
      </div>
    </div>
  );
}
