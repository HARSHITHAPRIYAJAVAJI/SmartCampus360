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
        { title: "Faculty Management", url: "/dashboard/faculty-directory", icon: Users },
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
      ],
      student: [
        { title: "Basic Information", url: "/dashboard/student/basic-info", icon: UserCheck },
        { title: "Academic Information", url: "/dashboard/student/academic-info", icon: BookOpen },
        { title: "Exam Time Tables", url: "/dashboard/timetable", icon: Calendar },
        { title: "Online Fee Payments", url: "/dashboard/student/fees", icon: Award },
        { title: "Script Uploading", url: "/dashboard/student/scripts", icon: FileText },
        { title: "Marks Details", url: "/dashboard/grades", icon: BarChart3 },
        { title: "Downloads", url: "/dashboard/student/downloads", icon: FileText },
        { title: "Suggestions", url: "/dashboard/student/suggestions", icon: Bell },
        { title: "Contact Us", url: "/contact", icon: Users },
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

        <div className="flex-1 p-4 overflow-y-auto flex flex-col justify-between custom-scrollbar">
          <div className="space-y-1.5">
            {navigationItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                end={item.url === '/dashboard'}
                onClick={() => mobileOpen && onMobileClose()} // Close on navigation on mobile
                className={({ isActive }) =>
                  `group flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive
                    ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md shadow-primary/25 font-semibold"
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary font-medium"
                  }`
                }
              >
                <item.icon className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110`} />
                {(!collapsed || mobileOpen) && <span className="lg:block">{item.title}</span>}
              </NavLink>
            ))}
          </div>

          {(!collapsed || mobileOpen) && (
            <div className="mt-8 mb-2">
              <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl p-4 border border-primary/10 shadow-sm backdrop-blur-sm">
                <div className="text-sm font-bold text-primary flex items-center gap-2 mb-1">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Role: <span className="uppercase tracking-wider">{userRole}</span>
                </div>
                <div className="text-[11px] text-muted-foreground/80 font-bold uppercase tracking-widest pl-4">
                  {userRole} Portal UI
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}