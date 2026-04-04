import { useState } from "react";
import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { useTimetableAlerts } from "@/hooks/useTimetableAlerts";

interface DashboardLayoutProps {
  user: {
    name: string;
    id: string;
    role: string;
  };
  onLogout: () => void;
}

export function DashboardLayout({ user, onLogout }: DashboardLayoutProps) {
  // Activate global classroom alerts (Item 9 from checklist)
  useTimetableAlerts(user);
  
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
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
}