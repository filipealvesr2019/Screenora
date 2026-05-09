'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import DeviceFrame from './DeviceFrame';
import { motion } from 'framer-motion';

export default function Workspace() {
  const { devices, isGrid, globalZoom } = useStore();

  return (
    <div 
      className={`flex-1 overflow-auto custom-scrollbar p-10 relative ${
        isGrid ? 'bg-grid' : 'bg-[#050505]'
      }`}
      style={{
        backgroundImage: isGrid 
          ? 'radial-gradient(circle at 1px 1px, #1f1f23 1px, transparent 0)' 
          : 'none',
        backgroundSize: '32px 32px',
      }}
    >
      <motion.div 
        className="flex gap-10 items-start"
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
    </div>
  );
}
