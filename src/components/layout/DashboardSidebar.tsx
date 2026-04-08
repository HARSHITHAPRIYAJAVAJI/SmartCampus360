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
  ChevronDown,
  ShieldCheck
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
        { title: "Exam Management", url: "/dashboard/exams", icon: ShieldCheck },
        { title: "Faculty Management", url: "/dashboard/faculty-directory", icon: Users },
        { title: "Student Management", url: "/dashboard/students", icon: GraduationCap },
        { title: "Course Management", url: "/dashboard/manage-courses", icon: BookOpen },
        { title: "Room Management", url: "/dashboard/manage-rooms", icon: Home },
        { title: "Analytics & Accreditation", url: "/dashboard/analytics-accreditation", icon: BarChart3 },
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
          <div className={`flex items-center gap-3 transition-all duration-300 ${collapsed && !mobileOpen ? "lg:justify-center lg:w-full lg:px-0" : "px-1"}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20 transition-transform hover:scale-105 active:scale-95 duration-200">
              <GraduationCap className="h-6 w-6 text-primary-foreground drop-shadow-sm" />
            </div>
            {(!collapsed || mobileOpen) && (
              <span className="font-bold text-xl tracking-tight text-foreground bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">Smart Campus</span>
            )}
          </div>
          {!mobileOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-8 w-8 p-0 hidden lg:flex rounded-full hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          )}
          {mobileOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMobileClose}
              className="h-8 w-8 p-0 lg:hidden"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex-1 px-3 py-6 overflow-y-auto flex flex-col justify-between custom-scrollbar gap-8">
          <div className="space-y-2">
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
            <div className="mt-auto px-1">
              <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl p-4 border border-primary/10 shadow-sm backdrop-blur-md">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-2">Access Portal</div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-primary/10">
                    <UserCircle className="h-5 w-5 text-primary" />
                  </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">Accessing as</span>
                      <span className="text-xs font-black text-primary capitalize leading-none">{userRole}</span>
                    </div>
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

  const content = (
    <>
      <item.icon className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive && collapsed && !mobileOpen ? 'text-primary-foreground' : ''}`} />
      {(!collapsed || mobileOpen) && <span className="text-sm font-bold tracking-tight whitespace-nowrap">{item.title}</span>}
      {hasChildren && (!collapsed || mobileOpen) && (
        <ChevronDown className={`ml-auto h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      )}
    </>
  );

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${collapsed && !mobileOpen ? "justify-center" : ""} ${isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
            }`}
        >
          {content}
        </button>

        {isOpen && (!collapsed || mobileOpen) && (
          <div className="pl-11 pr-2 space-y-1 animate-in slide-in-from-top-2 duration-300">
            {item.children!.map((child) => (
              <NavLink
                key={child.title}
                to={child.url}
                onClick={() => mobileOpen && onMobileClose()}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 border-l-2 ${isActive
                    ? "text-primary bg-primary/5 border-primary"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5 border-transparent"
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
        `group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 shadow-none hover:shadow-lg hover:shadow-primary/5 ${collapsed && !mobileOpen ? "justify-center" : ""} ${isActive
          ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-xl shadow-primary/20 font-bold"
          : "text-muted-foreground hover:bg-primary/5 hover:text-primary font-medium"
        }`
      }
    >
      {content}
    </NavLink>
  );
}