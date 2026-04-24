import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
// Force re-build to fix ReferenceErrors
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
  ShieldCheck,
  MessageSquare,
  Link,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  url?: string;
  icon: any;
  badge?: string | number;
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
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Poll for global unread count
  useEffect(() => {
    const checkUnread = () => {
      const count = localStorage.getItem('smartcampus_unread_count');
      setUnreadCount(count ? parseInt(count) : 0);
    };
    checkUnread();
    const interval = setInterval(checkUnread, 2000);
    window.addEventListener('storage', checkUnread);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkUnread);
    };
  }, []);

  const getNavigationItems = (): NavItem[] => {
    const commonItems: NavItem[] = [
      { title: "Dashboard", url: "/dashboard", icon: Home },
      { title: "My Profile", url: "/dashboard/profile", icon: UserCircle },
      { title: "Timetable", url: "/dashboard/timetable", icon: Calendar },
      { title: "Communication Hub", url: "/dashboard/communications", icon: MessageSquare, badge: unreadCount > 0 ? unreadCount : undefined },
      { title: "Settings", url: "/dashboard/settings", icon: Settings },
    ];

    const roleSpecificItems: Record<string, NavItem[]> = {
      admin: [
        { title: "Exam Management", url: "/dashboard/exams", icon: ShieldCheck },
        { title: "Faculty Management", url: "/dashboard/faculty-directory", icon: Users },
        { title: "Faculty Workload", url: "/dashboard/faculty-load", icon: BarChart3 },
        { title: "Academic Requests", url: "/dashboard/requests", icon: FileText },
        { title: "Student Management", url: "/dashboard/students", icon: GraduationCap },
        { title: "Course Management", url: "/dashboard/manage-courses", icon: BookOpen },
        { title: "Room Management", url: "/dashboard/manage-rooms", icon: Home },
        { title: "Analytics & Accreditation", url: "/dashboard/analytics-accreditation", icon: BarChart3 },
        { title: "Recycle Bin", url: "/dashboard/trash", icon: Trash2 },
      ],
      faculty: [
        { title: "My Classes", url: "/dashboard/classes", icon: BookOpen },
        { title: "Leave Management", url: "/dashboard/leave", icon: Clock },
        { title: "Student Records", url: "/dashboard/students", icon: Users },
      ],
      student: [
        { title: "Exam Time Tables", url: "/dashboard/timetable", icon: Calendar },
        { title: "Detailed Attendance", url: "/dashboard/attendance", icon: FileText },
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

    const navigationItems = [
      ...commonItems.slice(0, 1),
      ...commonItems.slice(2, 3), // Skip index 1 (My Profile)
      ...(roleSpecificItems[userRole] || []),
      ...commonItems.slice(3),
    ];

    return navigationItems;
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
        {mobileOpen && (
          <div className="p-4 border-b border-border flex justify-end lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMobileClose}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        )}

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
            <div className="mt-auto px-1 space-y-4">
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
              
              <div className="pt-2 border-t border-border/50">
                   <Button
                      variant="ghost"
                      size="icon"
                      onClick={onToggle}
                      className="h-10 w-10 p-0 hidden lg:flex rounded-xl hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20 mx-auto"
                    >
                      {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                    </Button>
              </div>
            </div>
          )}
          {collapsed && !mobileOpen && (
              <div className="mt-auto flex flex-col items-center gap-4 pb-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggle}
                    className="h-10 w-10 p-0 hidden lg:flex rounded-xl hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
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
      {item.badge && (
        <div className={`
          ${collapsed && !mobileOpen ? 'absolute top-0 right-0 -translate-y-1 translate-x-1 scale-90' : 'ml-auto'}
          bg-emerald-500 text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40 ring-2 ring-white animate-in zoom-in duration-300
        `}>
          {item.badge}
        </div>
      )}
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