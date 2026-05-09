'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import DeviceFrame from './DeviceFrame';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function Workspace() {
  const { workflows, currentWorkflowId, setCurrentWorkflowId, addWorkflow, isGrid, globalZoom } = useStore();
  
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
    >
      {/* Workflow Tabs */}
      <div className="flex items-center gap-2 mb-6 bg-[#0c0c0e]/80 backdrop-blur-sm p-1.5 rounded-lg border border-[#1f1f23] w-max z-10">
        {workflows.map((wf) => (
          <button
            key={wf.id}
            onClick={() => setCurrentWorkflowId(wf.id)}
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
