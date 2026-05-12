'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import DeviceFrame from './DeviceFrame';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function Workspace() {
  const { workflows, currentWorkflowId, setCurrentWorkflowId, addWorkflow, removeWorkflow, isGrid, globalZoom, isSyncScrollMode, globalScrollTop, setGlobalScrollTop, maxContentHeight } = useStore();
  
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, workflowId: string } | null>(null);

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

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

  const handleContextMenu = (e: React.MouseEvent, workflowId: string) => {
    e.preventDefault();
    if (['mobile', 'tablet', 'desktop'].includes(workflowId)) return;
    setContextMenu({ x: e.clientX, y: e.clientY, workflowId });
  };
  
  const currentWorkflow = workflows.find(w => w.id === currentWorkflowId);
  const devices = currentWorkflow ? currentWorkflow.devices : [];

  return (
    <div 
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
        if (isSyncScrollMode && e.deltaY !== 0) {
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
          <div className="bg-[#0c0c0e]/80 backdrop-blur-sm p-3 rounded-lg border border-[#1f1f23] w-full max-w-lg flex items-center gap-3">
            <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">Scroll Universal</span>
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
          transform: `scale(${globalZoom})`,
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
            <DeviceFrame key={device.id} device={device} />
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
    </div>
  );
}
