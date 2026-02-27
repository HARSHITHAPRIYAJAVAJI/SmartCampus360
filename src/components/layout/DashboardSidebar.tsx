import { NavLink, useLocation } from "react-router-dom";
import {
  Calendar,
  Users,
  FileText,
  BookOpen,
  Bell,
  Settings,
  GraduationCap,
  BarChart3,
  UserCheck,
  Clock,
  ChevronLeft,
  ChevronRight,
  Home,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardSidebarProps {
  userRole: string;
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;       // New prop for mobile state
  onMobileClose: () => void; // New prop to close on mobile
}

export function DashboardSidebar({ userRole, collapsed, onToggle, mobileOpen, onMobileClose }: DashboardSidebarProps) {
  const location = useLocation();

  const getNavigationItems = () => {
    const commonItems = [
      { title: "Dashboard", url: "/dashboard", icon: Home },
      { title: "Timetable", url: "/dashboard/timetable", icon: Calendar },
      { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
      { title: "Settings", url: "/dashboard/settings", icon: Settings },
    ];

    const roleSpecificItems = {
      admin: [
        { title: "Faculty Management", url: "/dashboard/faculty", icon: Users },
        { title: "Course Management", url: "/dashboard/manage-courses", icon: BookOpen },
        { title: "Room Management", url: "/dashboard/manage-rooms", icon: Home },
        { title: "Accreditation", url: "/dashboard/accreditation", icon: FileText },
        { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
        { title: "User Management", url: "/dashboard/users", icon: UserCheck },
      ],
      faculty: [
        { title: "My Classes", url: "/dashboard/classes", icon: BookOpen },
        { title: "Leave Management", url: "/dashboard/leave", icon: Clock },
        { title: "Student Records", url: "/dashboard/students", icon: Users },
        { title: "Accreditation", url: "/dashboard/accreditation", icon: FileText },
      ],
      student: [
        { title: "My Courses", url: "/dashboard/courses", icon: BookOpen },
        { title: "Skill Training", url: "/dashboard/training", icon: Award },
        { title: "Grades", url: "/dashboard/grades", icon: BarChart3 },
        { title: "Faculty", url: "/dashboard/faculty", icon: Users },
      ],
    };

    return [
      ...commonItems.slice(0, 2), // Dashboard and Timetable first
      ...(roleSpecificItems[userRole as keyof typeof roleSpecificItems] || []),
      ...commonItems.slice(2), // Notifications and Settings last
    ];
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 bg-card border-r border-border transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:flex lg:flex-col lg:h-full
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        ${collapsed ? "lg:w-16" : "lg:w-64"}
        w-64
      `}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className={`flex items-center space-x-2 ${collapsed ? "lg:justify-center lg:w-full" : ""}`}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            {(!collapsed || mobileOpen) && (
              <span className="font-semibold text-lg lg:block">Smart Campus</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0 hidden lg:flex"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileClose}
            className="h-8 w-8 p-0 lg:hidden"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                onClick={() => mobileOpen && onMobileClose()} // Close on navigation on mobile
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`
                }
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {(!collapsed || mobileOpen) && <span className="font-medium lg:block">{item.title}</span>}
              </NavLink>
            ))}
          </div>

          {(!collapsed || mobileOpen) && (
            <div className="mt-8">
              <div className="bg-primary/10 rounded-lg p-3">
                <div className="text-sm font-medium text-primary">Role: {userRole}</div>
                <div className="text-xs text-muted-foreground capitalize">
                  {userRole} Dashboard
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}