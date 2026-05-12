'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { 
  Plus, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Settings, 
  Crown
} from 'lucide-react';

export default function Sidebar() {
  const { workflows, currentWorkflowId, setAddDeviceModalOpen, setSelectedCategory } = useStore();
  
  const currentWorkflow = workflows.find(w => w.id === currentWorkflowId);
  const devices = currentWorkflow ? currentWorkflow.devices : [];

  const counts = {
    mobile: workflows.find(w => w.id === 'mobile')?.devices.length || 0,
    tablet: workflows.find(w => w.id === 'tablet')?.devices.length || 0,
    desktop: workflows.find(w => w.id === 'desktop')?.devices.length || 0,
    custom: workflows.filter(w => !['mobile', 'tablet', 'desktop'].includes(w.id)).reduce((acc, w) => acc + w.devices.length, 0)
  };

  return (
    <div className="w-64 h-screen bg-[#0c0c0e] border-r border-[#1f1f23] flex flex-col p-4 gap-6">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2">
        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-background font-bold text-lg">
          S
        </div>
        <span className="font-bold text-xl text-foreground">Screenora</span>
      </div>

      {/* Add Device Button */}
      <button 
        onClick={() => setAddDeviceModalOpen(true)}
        className="w-full bg-[#1a1a1e] hover:bg-[#252529] text-foreground border border-[#27272a] hover:border-accent/50 rounded-lg py-2.5 px-4 flex items-center justify-center gap-2 transition-all duration-200 group"
      >
        <Plus className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
        <span className="font-medium text-sm">Add Device</span>
      </button>

      {/* Navigation / Sections */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
        {/* Presets */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Presets</span>
          </div>
          <div className="flex flex-col gap-1">
            <button 
              onClick={() => setSelectedCategory('mobile')}
              className="flex items-center justify-between px-2 py-2 hover:bg-[#141417] rounded-md group text-left w-full"
            >
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">Mobile</span>
              </div>
              <span className="text-xs bg-[#1a1a1e] text-muted-foreground px-1.5 py-0.5 rounded-md">{counts.mobile}</span>
            </button>
            <button 
              onClick={() => setSelectedCategory('tablet')}
              className="flex items-center justify-between px-2 py-2 hover:bg-[#141417] rounded-md group text-left w-full"
            >
              <div className="flex items-center gap-2">
                <Tablet className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">Tablet</span>
              </div>
              <span className="text-xs bg-[#1a1a1e] text-muted-foreground px-1.5 py-0.5 rounded-md">{counts.tablet}</span>
            </button>
            <button 
              onClick={() => setSelectedCategory('desktop')}
              className="flex items-center justify-between px-2 py-2 hover:bg-[#141417] rounded-md group text-left w-full"
            >
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">Desktop</span>
              </div>
              <span className="text-xs bg-[#1a1a1e] text-muted-foreground px-1.5 py-0.5 rounded-md">{counts.desktop}</span>
            </button>
          </div>
        </div>

        {/* Active Devices */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active</span>
            <span className="text-xs bg-[#1a1a1e] text-muted-foreground px-1.5 py-0.5 rounded-md">{devices.length}</span>
          </div>
          {devices.length === 0 ? (
            <div className="text-sm text-muted-foreground px-2 py-3 bg-[#141417]/50 rounded-lg border border-[#1f1f23] border-dashed text-center">
              No active devices
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {devices.map(device => (
                <div key={device.id} className="flex items-center justify-between px-2 py-1.5 hover:bg-[#141417] rounded-md group cursor-pointer">
                  <div className="flex items-center gap-2">
                    {device.type === 'mobile' && <Smartphone className="w-4 h-4 text-muted-foreground" />}
                    {device.type === 'tablet' && <Tablet className="w-4 h-4 text-muted-foreground" />}
                    {device.type === 'desktop' && <Monitor className="w-4 h-4 text-muted-foreground" />}
                    <span className="text-sm text-foreground/90">{device.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground group-hover:text-accent transition-colors">{device.width}x{device.height}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inactive */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Inactive</span>
            <span className="text-xs bg-[#1a1a1e] text-muted-foreground px-1.5 py-0.5 rounded-md">0</span>
          </div>
          <div className="text-sm text-muted-foreground px-2 py-2 text-center bg-[#141417]/30 rounded-lg">
            No inactive devices
          </div>
        </div>

        {/* Mockups */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mockups</span>
              <span className="text-[10px] bg-accent/20 text-accent px-1 rounded font-bold">BETA</span>
            </div>
            <span className="text-xs bg-[#1a1a1e] text-muted-foreground px-1.5 py-0.5 rounded-md">0</span>
          </div>
          <div className="text-sm text-muted-foreground px-2 py-2 text-center bg-[#141417]/30 rounded-lg">
            No mockups added
          </div>
        </div>
      </div>

      {/* Upgrade Card */}
      <div className="bg-[#141417] border border-[#1f1f23] rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-accent" />
          <span className="font-bold text-sm text-foreground">Upgrade to Pro</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Unlock unlimited devices, custom backgrounds and more powerful features.
        </p>
        <button className="w-full bg-[#1a1a1e] hover:bg-accent hover:text-background border border-[#27272a] hover:border-accent rounded-lg py-2 text-xs font-semibold text-foreground transition-all duration-200">
          Upgrade Now
        </button>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-2 pt-2 border-t border-[#1f1f23]">
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Settings className="w-5 h-5" />
        </button>

        <div className="w-8 h-8 bg-[#1a1a1e] rounded-full flex items-center justify-center text-xs font-bold text-foreground border border-[#27272a]">
          JD
        </div>
      </div>
    </div>
  );
}
