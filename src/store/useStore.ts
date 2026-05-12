import { create } from 'zustand';
import { allPresets } from '@/data/presets';

export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'custom';

export interface Device {
  id: string;
  name: string;
  width: number;
  height: number;
  type: DeviceType;
  isRotated: boolean;
  zoom: number;
}

export interface Workflow {
  id: string;
  name: string;
  devices: Device[];
}

interface AppState {
  url: string;
  setUrl: (url: string) => void;
  workflows: Workflow[];
  currentWorkflowId: string;
  setCurrentWorkflowId: (id: string) => void;
  addWorkflow: (name: string) => void;
  removeWorkflow: (id: string) => void;
  addDevice: (device: Omit<Device, 'id' | 'isRotated' | 'zoom'>) => void;
  removeDevice: (id: string) => void;
  updateDevice: (id: string, updates: Partial<Device>) => void;
  globalZoom: number;
  setGlobalZoom: (zoom: number) => void;
  isGrid: boolean;
  toggleGrid: () => void;
  isFullscreen: boolean;
  setFullscreen: (isFullscreen: boolean) => void;
  isAddDeviceModalOpen: boolean;
  setAddDeviceModalOpen: (isOpen: boolean) => void;
  isExtendedMode: boolean;
  toggleExtendedMode: () => void;
  selectedCategory: DeviceType | null;
  setSelectedCategory: (category: DeviceType | null) => void;
  isSyncScrollMode: boolean;
  toggleSyncScrollMode: () => void;
  globalScrollTop: number;
  setGlobalScrollTop: (top: number) => void;
  maxContentHeight: number;
  setMaxContentHeight: (height: number) => void;
}

export const presets: Omit<Device, 'id' | 'isRotated' | 'zoom'>[] = [
  { name: 'iPhone 15', width: 393, height: 852, type: 'mobile' },
  { name: 'Galaxy S24', width: 360, height: 780, type: 'mobile' },
  { name: 'iPad Mini', width: 768, height: 1024, type: 'tablet' },
  { name: 'iPad Air', width: 820, height: 1180, type: 'tablet' },
  { name: 'MacBook Air', width: 1280, height: 800, type: 'desktop' },
  { name: 'Surface Pro', width: 1440, height: 960, type: 'desktop' },
  { name: 'Desktop Full HD', width: 1920, height: 1080, type: 'desktop' },
];

export const useStore = create<AppState>((set) => ({
  url: 'https://vercel.com',
  setUrl: (url) => set({ url }),
  workflows: [
    { 
      id: 'mobile', 
      name: 'mobile', 
      devices: allPresets
        .filter(p => p.type === 'mobile')
        .map((p, index) => ({ id: `mobile-${index}`, name: p.name, width: p.width, height: p.height, type: p.type, isRotated: false, zoom: 1 }))
    },
    { 
      id: 'tablet', 
      name: 'tablet', 
      devices: allPresets
        .filter(p => p.type === 'tablet')
        .map((p, index) => ({ id: `tablet-${index}`, name: p.name, width: p.width, height: p.height, type: p.type, isRotated: false, zoom: 1 }))
    },
    { 
      id: 'desktop', 
      name: 'desktop', 
      devices: allPresets
        .filter(p => p.type === 'desktop')
        .map((p, index) => ({ id: `desktop-${index}`, name: p.name, width: p.width, height: p.height, type: p.type, isRotated: false, zoom: 1 }))
    },
  ],
  currentWorkflowId: 'mobile',
  setCurrentWorkflowId: (id) => set({ currentWorkflowId: id }),
  addWorkflow: (name) => set((state) => ({
    workflows: [...state.workflows, { id: Math.random().toString(36).substring(7), name, devices: [] }]
  })),
  removeWorkflow: (id) => set((state) => {
    const newWorkflows = state.workflows.filter((w) => w.id !== id);
    const newCurrentId = state.currentWorkflowId === id 
      ? (newWorkflows[0]?.id || '') 
      : state.currentWorkflowId;
    return {
      workflows: newWorkflows,
      currentWorkflowId: newCurrentId
    };
  }),
  addDevice: (device) => set((state) => ({
    workflows: state.workflows.map((w) => 
      w.id === state.currentWorkflowId 
        ? { ...w, devices: [...w.devices, { ...device, id: Math.random().toString(36).substring(7), isRotated: false, zoom: 1 }] }
        : w
    )
  })),
  removeDevice: (id) => set((state) => ({
    workflows: state.workflows.map((w) => 
      w.id === state.currentWorkflowId 
        ? { ...w, devices: w.devices.filter((d) => d.id !== id) }
        : w
    )
  })),
  updateDevice: (id, updates) => set((state) => ({
    workflows: state.workflows.map((w) => 
      w.id === state.currentWorkflowId 
        ? { ...w, devices: w.devices.map((d) => d.id === id ? { ...d, ...updates } : d) }
        : w
    )
  })),
  globalZoom: 1,
  setGlobalZoom: (globalZoom) => set({ globalZoom }),
  isGrid: true,
  toggleGrid: () => set((state) => ({ isGrid: !state.isGrid })),
  isFullscreen: false,
  setFullscreen: (isFullscreen) => set({ isFullscreen }),
  isAddDeviceModalOpen: false,
  setAddDeviceModalOpen: (isOpen) => set({ isAddDeviceModalOpen: isOpen }),
  isExtendedMode: false,
  toggleExtendedMode: () => set((state) => ({ isExtendedMode: !state.isExtendedMode })),
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  isSyncScrollMode: false,
  toggleSyncScrollMode: () => set((state) => ({ isSyncScrollMode: !state.isSyncScrollMode })),
  globalScrollTop: 0,
  setGlobalScrollTop: (globalScrollTop) => set({ globalScrollTop }),
  maxContentHeight: 10000,
  setMaxContentHeight: (height) => set({ maxContentHeight: height }),
}));
