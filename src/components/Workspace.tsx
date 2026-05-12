'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import DeviceFrame from './DeviceFrame';
import { motion } from 'framer-motion';
import { Plus, Minimize2 } from 'lucide-react';

export default function Workspace() {
  const { 
    workflows, 
    currentWorkflowId, 
    setCurrentWorkflowId, 
    addWorkflow, 
    removeWorkflow, 
    isGrid, 
    globalZoom, 
    setGlobalZoom, 
    isSyncScrollMode, 
    globalScrollTop, 
    setGlobalScrollTop, 
    maxContentHeight, 
    isFullscreen, 
    setFullscreen,
    url,
    reloadKey,
    incrementLoadingCount,
    decrementLoadingCount
  } = useStore();
  
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, workflowId: string } | null>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  useEffect(() => {
    if (!url) return;
    
    const fetchContent = async () => {
      incrementLoadingCount();
      try {
        let html = '';
        if (url.includes('localhost') || url.includes('127.0.0.1')) {
          const res = await fetch(url);
          html = await res.text();
          
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
          
          if (html.includes('<head>')) {
            html = html.replace('<head>', `<head>${baseTag}${scriptTag}`);
          } else {
            html = baseTag + scriptTag + html;
          }
        } else {
          const res = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
          html = await res.text();
        }
        setHtmlContent(html);
      } catch (error) {
        console.error('Failed to fetch content:', error);
        setHtmlContent(null);
      } finally {
        decrementLoadingCount();
      }
    };

    fetchContent();
  }, [url, reloadKey, incrementLoadingCount, decrementLoadingCount]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSyncScrollMode) return;
      
      const step = 50; // Amount to scroll per key press
      if (e.key === 'ArrowDown') {
        const newScrollTop = Math.min(globalScrollTop + step, maxContentHeight);
        setGlobalScrollTop(newScrollTop);
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        const newScrollTop = Math.max(globalScrollTop - step, 0);
        setGlobalScrollTop(newScrollTop);
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSyncScrollMode, globalScrollTop, maxContentHeight, setGlobalScrollTop]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.05 : -0.05;
        const newZoom = Math.min(Math.max(globalZoom + delta, 0.25), 2);
        setGlobalZoom(newZoom);
      }
    };
    const workspace = document.getElementById('workspace');
    if (workspace) {
      workspace.addEventListener('wheel', handleWheel, { passive: false });
      return () => workspace.removeEventListener('wheel', handleWheel);
    }
  }, [globalZoom, setGlobalZoom]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [setFullscreen]);

  useEffect(() => {
    if (isFullscreen) {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.log(err));
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.log(err));
      }
    }
  }, [isFullscreen]);

  const handleContextMenu = (e: React.MouseEvent, workflowId: string) => {
    e.preventDefault();
    if (['mobile', 'tablet', 'desktop'].includes(workflowId)) return;
    setContextMenu({ x: e.clientX, y: e.clientY, workflowId });
  };
  
  const currentWorkflow = workflows.find(w => w.id === currentWorkflowId);
  const devices = currentWorkflow ? currentWorkflow.devices : [];

  return (
    <div 
      id="workspace"
      className={`flex-1 overflow-auto custom-scrollbar p-10 relative flex flex-col ${
        isGrid ? 'bg-grid' : 'bg-[#050505]'
      }`}
      style={{
        backgroundImage: isGrid 
          ? 'radial-gradient(circle at 1px 1px, #1f1f23 1px, transparent 0)' 
          : 'none',
        backgroundSize: '32px 32px',
      }}
      onWheel={(e) => {
        if (isSyncScrollMode && e.deltaY !== 0 && !e.ctrlKey) {
          const newScrollTop = Math.min(Math.max(globalScrollTop + e.deltaY, 0), maxContentHeight);
          setGlobalScrollTop(newScrollTop);
        }
      }}
    >
      {/* Controls Row */}
      <div className="flex items-center gap-4 mb-6 z-10">
        {/* Workflow Tabs */}
        <div className="flex items-center gap-2 bg-[#0c0c0e]/80 backdrop-blur-sm p-1.5 rounded-lg border border-[#1f1f23] w-max">
          {workflows.map((wf) => (
            <button
              key={wf.id}
              onClick={() => setCurrentWorkflowId(wf.id)}
              onContextMenu={(e) => handleContextMenu(e, wf.id)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                currentWorkflowId === wf.id
                  ? 'bg-accent text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {wf.name}
            </button>
          ))}
          <button 
            onClick={() => {
              const name = prompt('Enter workflow name:');
              if (name) addWorkflow(name);
            }}
            className="p-1.5 hover:bg-[#141417] rounded-md text-muted-foreground hover:text-foreground transition-colors"
            title="Add Workflow"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {isSyncScrollMode && (
          <div className="bg-[#0c0c0e]/80 backdrop-blur-sm p-3 rounded-lg border border-[#1f1f23] w-full max-w-5xl flex items-center gap-3">
            <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">Universal Scroll</span>
            <input
              type="range"
              min={0}
              max={maxContentHeight}
              value={globalScrollTop}
              onChange={(e) => setGlobalScrollTop(Number(e.target.value))}
              className="flex-1 accent-accent h-1.5 bg-[#141417] rounded-full appearance-none cursor-pointer"
            />

          </div>
        )}
      </div>

      <motion.div 
        className={`flex gap-10 items-start ${isSyncScrollMode ? 'sticky top-10' : ''}`}
        style={{ 
          scale: globalZoom,
          transformOrigin: 'top left'
        }}
        layout
      >
        {devices.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-6">
            <div className="w-20 h-20 bg-[#141417] border border-[#1f1f23] rounded-2xl flex items-center justify-center text-4xl">
              📱
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">No devices active</h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                Add devices from the sidebar or click &quot;Add Device&quot; to start previewing.
              </p>
            </div>
          </div>
        ) : (
          devices.map((device) => (
            <DeviceFrame key={device.id} device={device} htmlContent={htmlContent} />
          ))
        )}
      </motion.div>

      {/* Removed dummy div for sync scroll */}

      {contextMenu && (
        <div 
          className="fixed bg-[#141417] border border-[#1f1f23] rounded-lg shadow-xl z-50 py-1 min-w-[100px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete workflow "${workflows.find(w => w.id === contextMenu.workflowId)?.name}"?`)) {
                removeWorkflow(contextMenu.workflowId);
              }
              setContextMenu(null);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[#1a1a1e] transition-colors"
          >
            Delete
          </button>
        </div>
      )}

      {isFullscreen && (
        <button 
          onClick={() => setFullscreen(false)}
          className="fixed top-4 right-4 bg-[#141417] border border-[#1f1f23] text-muted-foreground hover:text-foreground p-2 rounded-lg z-50 shadow-2xl transition-colors"
          title="Exit Fullscreen"
        >
          <Minimize2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
