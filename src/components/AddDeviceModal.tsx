'use client';

import React, { useState } from 'react';
import { useStore, DeviceType } from '@/store/useStore';
import { X, Smartphone, Tablet, Monitor, PenTool } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddDeviceModal() {
  const { isAddDeviceModalOpen, setAddDeviceModalOpen, addDevice } = useStore();
  
  const [name, setName] = useState('');
  const [width, setWidth] = useState(375);
  const [height, setHeight] = useState(812);
  const [type, setType] = useState<DeviceType>('mobile');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    
    addDevice({
      name,
      width,
      height,
      type,
    });
    
    // Reset and close
    setName('');
    setWidth(375);
    setHeight(812);
    setType('mobile');
    setAddDeviceModalOpen(false);
  };

  return (
    <AnimatePresence>
      {isAddDeviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAddDeviceModalOpen(false)}
          />

          {/* Modal */}
          <motion.div 
            className="bg-[#0c0c0e] border border-[#1f1f23] rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            <button 
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setAddDeviceModalOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-foreground mb-1">Add Custom Device</h2>
            <p className="text-sm text-muted-foreground mb-6">Create a new device frame for your workspace.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Device Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Custom Phone"
                  className="bg-[#141417] border border-[#1f1f23] focus:border-accent/50 rounded-lg px-3 py-2.5 text-sm text-foreground outline-none transition-colors"
                  required
                />
              </div>

              {/* Resolution */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Width (px)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
                    className="bg-[#141417] border border-[#1f1f23] focus:border-accent/50 rounded-lg px-3 py-2.5 text-sm text-foreground outline-none transition-colors"
                    required
                    min={100}
                    max={4000}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Height (px)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                    className="bg-[#141417] border border-[#1f1f23] focus:border-accent/50 rounded-lg px-3 py-2.5 text-sm text-foreground outline-none transition-colors"
                    required
                    min={100}
                    max={4000}
                  />
                </div>
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Category</label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('mobile')}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs transition-colors ${
                      type === 'mobile' 
                        ? 'bg-accent/10 border-accent text-accent' 
                        : 'bg-[#141417] border-[#1f1f23] text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Mobile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('tablet')}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs transition-colors ${
                      type === 'tablet' 
                        ? 'bg-accent/10 border-accent text-accent' 
                        : 'bg-[#141417] border-[#1f1f23] text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Tablet className="w-4 h-4" />
                    <span>Tablet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('desktop')}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs transition-colors ${
                      type === 'desktop' 
                        ? 'bg-accent/10 border-accent text-accent' 
                        : 'bg-[#141417] border-[#1f1f23] text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                    <span>Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('custom')}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs transition-colors ${
                      type === 'custom' 
                        ? 'bg-accent/10 border-accent text-accent' 
                        : 'bg-[#141417] border-[#1f1f23] text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <PenTool className="w-4 h-4" />
                    <span>Custom</span>
                  </button>
                </div>
              </div>

              {/* Live Preview */}
              <div className="bg-[#141417] rounded-lg p-3 border border-[#1f1f23] flex flex-col items-center gap-2">
                <span className="text-xs text-muted-foreground self-start uppercase font-semibold">Live Preview</span>
                <div 
                  className="bg-[#0c0c0e] border border-[#27272a] rounded shadow-inner"
                  style={{ 
                    width: '100%', 
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span className="text-xs text-muted-foreground">{width} × {height}</span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-background font-bold py-2.5 rounded-lg transition-colors mt-2"
              >
                Save Device
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
