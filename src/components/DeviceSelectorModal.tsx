'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { allPresets } from '@/data/presets';
import { X, Smartphone, Tablet, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DeviceSelectorModal() {
  const { selectedCategory, setSelectedCategory, addDevice } = useStore();

  const filteredPresets = allPresets.filter(
    (preset) => preset.type === selectedCategory
  );

  const handleAddDevice = (preset: typeof allPresets[0]) => {
    addDevice({
      name: preset.name,
      width: preset.width,
      height: preset.height,
      type: preset.type,
    });
    setSelectedCategory(null);
  };

  const getTitle = () => {
    switch (selectedCategory) {
      case 'mobile': return 'Mobile Devices';
      case 'tablet': return 'Tablets';
      case 'desktop': return 'Desktop Screens';
      default: return 'Devices';
    }
  };

  const getIcon = () => {
    switch (selectedCategory) {
      case 'mobile': return <Smartphone className="w-5 h-5 text-accent" />;
      case 'tablet': return <Tablet className="w-5 h-5 text-accent" />;
      case 'desktop': return <Monitor className="w-5 h-5 text-accent" />;
      default: return null;
    }
  };

  return (
    <AnimatePresence>
      {selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCategory(null)}
          />

          {/* Modal */}
          <motion.div 
            className="bg-[#0c0c0e] border border-[#1f1f23] rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col relative z-10 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#1f1f23]">
              <div className="flex items-center gap-3">
                {getIcon()}
                <div>
                  <h2 className="text-xl font-bold text-foreground">{getTitle()}</h2>
                  <p className="text-sm text-muted-foreground">Select a preset to add to your workspace.</p>
                </div>
              </div>
              <button 
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setSelectedCategory(null)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {/* Group by Brand */}
              {['Apple', 'Google', 'Samsung', 'Amazon', 'Microsoft'].map((brand) => {
                const brandPresets = filteredPresets.filter(p => p.brand === brand);
                if (brandPresets.length === 0) return null;

                return (
                  <div key={brand} className="mb-6 last:mb-0">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{brand}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {brandPresets.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => handleAddDevice(preset)}
                          className="bg-[#141417] border border-[#1f1f23] hover:border-accent/50 rounded-xl p-4 flex flex-col gap-1 text-left transition-colors group"
                        >
                          <span className="font-semibold text-foreground group-hover:text-accent transition-colors">
                            {preset.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {preset.width} × {preset.height}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
