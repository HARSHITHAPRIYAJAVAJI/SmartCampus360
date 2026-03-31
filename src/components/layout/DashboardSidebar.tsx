import { useState } from "react";
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
  Award,
  UserCircle,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  url?: string;
  icon: any;
  children?: { title: string; url: string }[];
}

interface DashboardSidebarProps {
  userRole: string;
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function DashboardSidebar({ userRole, collapsed, onToggle, mobileOpen, onMobileClose }: DashboardSidebarProps) {
  const location = useLocation();

  const getNavigationItems = (): NavItem[] => {
    const commonItems: NavItem[] = [
      { title: "Dashboard", url: "/dashboard", icon: Home },
      { title: "My Profile", url: "/dashboard/profile", icon: UserCircle },
      { title: "Timetable", url: "/dashboard/timetable", icon: Calendar },
      { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
      { title: "Settings", url: "/dashboard/settings", icon: Settings },
    ];

    const roleSpecificItems: Record<string, NavItem[]> = {
      admin: [
        { title: "Faculty Management", url: "/dashboard/faculty-directory", icon: Users },
        { title: "Student Management", url: "/dashboard/students", icon: GraduationCap },
        { title: "Course Management", url: "/dashboard/manage-courses", icon: BookOpen },
        { title: "Room Management", url: "/dashboard/manage-rooms", icon: Home },
        { title: "Accreditation", url: "/dashboard/accreditation", icon: FileText },
        { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
      ],
      faculty: [
        { title: "My Classes", url: "/dashboard/classes", icon: BookOpen },
        { title: "Leave Management", url: "/dashboard/leave", icon: Clock },
        { title: "Student Records", url: "/dashboard/students", icon: Users },
      ],
      student: [
        { title: "Exam Time Tables", url: "/dashboard/timetable", icon: Calendar },
        {
          title: "Online Fee Payments",
          icon: Award,
          children: [
            { title: "Instructions", url: "/dashboard/student/fees/instructions" },
            { title: "Regular Fee Payment", url: "/dashboard/student/fees/regular" },
            { title: "Supply Fee Payment", url: "/dashboard/student/fees/supply" },
            { title: "Re-Evaluation Fee Payment", url: "/dashboard/student/fees/re-evaluation" },
            { title: "Script View Fee Payment", url: "/dashboard/student/fees/script-view" },
            { title: "Transcripts Fee Payment", url: "/dashboard/student/fees/transcripts" },
            { title: "Regular/Supply Fee Receipts", url: "/dashboard/student/fees/receipts-regular" },
            { title: "Re- Evaluation Fee Receipts", url: "/dashboard/student/fees/receipts-re-evaluation" },
            { title: "Script View Fee Receipts", url: "/dashboard/student/fees/receipts-script-view" },
            { title: "Transcripts Fee Receipts", url: "/dashboard/student/fees/receipts-transcripts" },
          ]
        },

        { title: "Marks Details", url: "/dashboard/grades", icon: BarChart3 },
        { title: "Downloads", url: "/dashboard/student/downloads", icon: FileText },

      ],
    };

    return [
      ...commonItems.slice(0, 3),
      ...(roleSpecificItems[userRole] || []),
      ...commonItems.slice(3),
    ];
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

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
              <SidebarItem
                key={item.title}
                item={item}
                collapsed={collapsed}
                mobileOpen={mobileOpen}
                onMobileClose={onMobileClose}
              />
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

function SidebarItem({ item, collapsed, mobileOpen, onMobileClose }: {
  item: NavItem;
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void
}) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const hasChildren = item.children && item.children.length > 0;
  const isChildActive = hasChildren && item.children!.some(child => location.pathname === child.url);
  const isActive = location.pathname === item.url || isChildActive;

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive
            ? "bg-primary/5 text-primary font-semibold"
            : "text-muted-foreground hover:bg-primary/5 hover:text-primary font-medium"
            }`}
        >
          <div className="flex items-center space-x-3">
            <item.icon className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110`} />
            {(!collapsed || mobileOpen) && <span className="lg:block text-left leading-tight">{item.title}</span>}
          </div>
          {(!collapsed || mobileOpen) && (
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          )}
        </button>

        {isOpen && (!collapsed || mobileOpen) && (
          <div className="pl-9 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {item.children!.map((child) => (
              <NavLink
                key={child.title}
                to={child.url}
                onClick={() => mobileOpen && onMobileClose()}
                className={({ isActive }) =>
                  `block px-3 py-1.5 rounded-lg text-xs transition-all duration-200 ${isActive
                    ? "text-primary font-bold bg-primary/10 border-l-2 border-primary pl-2"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5 font-medium border-l-2 border-transparent pl-2"
                  }`
                }
              >
                {child.title}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.url!}
      end={item.url === '/dashboard'}
      onClick={() => mobileOpen && onMobileClose()}
      className={({ isActive }) =>
        `group flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive
          ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md shadow-primary/25 font-semibold"
          : "text-muted-foreground hover:bg-primary/5 hover:text-primary font-medium"
        }`
      }
    >
      <item.icon className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110`} />
      {(!collapsed || mobileOpen) && <span className="lg:block text-left leading-tight">{item.title}</span>}
    </NavLink>
  );
}