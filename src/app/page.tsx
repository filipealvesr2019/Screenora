import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Workspace from '@/components/Workspace';
import AddDeviceModal from '@/components/AddDeviceModal';

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#050505]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <Workspace />
      </div>
      <AddDeviceModal />
    </div>
  );
}
