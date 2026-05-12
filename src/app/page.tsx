'use client';

import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Workspace from '@/components/Workspace';
import AddDeviceModal from '@/components/AddDeviceModal';
import DeviceSelectorModal from '@/components/DeviceSelectorModal';
import { useStore } from '@/store/useStore';

export default function Home() {
  const { isFullscreen } = useStore();

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505]">
      {!isFullscreen && <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!isFullscreen && <Topbar />}
        <Workspace />
      </div>
      <AddDeviceModal />
      <DeviceSelectorModal />
    </div>
  );
}
