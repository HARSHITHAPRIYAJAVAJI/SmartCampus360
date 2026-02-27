import { useState } from "react";
import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";

interface DashboardLayoutProps {
  user: {
    name: string;
    id: string;
    role: string;
  };
  onLogout: () => void;
}

export function DashboardLayout({ user, onLogout }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobile = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar
        userRole={user.role}
        collapsed={sidebarCollapsed}
        onToggle={toggleCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          user={user}
          onLogout={onLogout}
          onToggleSidebar={toggleMobile}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}