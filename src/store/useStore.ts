import { create } from 'zustand';

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

interface AppState {
  url: string;
  setUrl: (url: string) => void;
  devices: Device[];
  addDevice: (device: Omit<Device, 'id'>) => void;
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
  devices: [
    { id: '1', name: 'iPhone 15', width: 393, height: 852, type: 'mobile', isRotated: false, zoom: 1 },
    { id: '2', name: 'iPad Air', width: 820, height: 1180, type: 'tablet', isRotated: false, zoom: 1 },
    { id: '3', name: 'Desktop Full HD', width: 1920, height: 1080, type: 'desktop', isRotated: false, zoom: 1 },
  ],
  addDevice: (device) => set((state) => ({
    devices: [...state.devices, { ...device, id: Math.random().toString(36).substring(7), isRotated: false, zoom: 1 }]
  })),
  removeDevice: (id) => set((state) => ({
    devices: state.devices.filter((d) => d.id !== id)
  })),
  updateDevice: (id, updates) => set((state) => ({
    devices: state.devices.map((d) => d.id === id ? { ...d, ...updates } : d)
  })),
  globalZoom: 1,
  setGlobalZoom: (globalZoom) => set({ globalZoom }),
  isGrid: true,
  toggleGrid: () => set((state) => ({ isGrid: !state.isGrid })),
  isFullscreen: false,
  setFullscreen: (isFullscreen) => set({ isFullscreen }),
  isAddDeviceModalOpen: false,
  setAddDeviceModalOpen: (isOpen) => set({ isAddDeviceModalOpen: isOpen }),
}));
