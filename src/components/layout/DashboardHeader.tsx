import { useState, useMemo, useRef, useEffect } from "react";
import { Bell, User, LogOut, Search, Menu, Book, Users, GraduationCap, X, AlertTriangle, CheckCircle2, Info, Inbox, Layout, Clock, Calendar, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MOCK_LEAVE_REQUESTS } from "@/data/mockLeaves";
import { MOCK_COURSES } from "@/data/mockCourses";
import { MOCK_FACULTY } from "@/data/mockFaculty";
import { MOCK_STUDENTS } from "@/data/mockStudents";
import { Link, useNavigate } from "react-router-dom";
import notificationService, { Notification as ApiNotification } from "@/services/notificationService";
import { useNotifications } from "@/hooks/useNotifications";

interface DashboardHeaderProps {
  user: {
    name: string;
    id: string;
    role: string;
  };
  onLogout: () => void;
  onToggleSidebar?: () => void;
}

export function DashboardHeader({ user, onLogout, onToggleSidebar }: DashboardHeaderProps) {
  const navigate = useNavigate();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults = useMemo(() => {
    if (searchQuery.trim().length < 2) return [];

    const q = searchQuery.toLowerCase();
    const results: { type: 'course' | 'student' | 'faculty' | 'page', id: string, name: string, code?: string, sub: string, url: string }[] = [];

    // Search Pages (Navigation) - Filtered by Role
    const allPages = [
      { name: "Timetable", url: "/dashboard/timetable", sub: "Class Schedule", roles: ['student', 'faculty', 'admin'] },
      { name: "Timetable Generator", url: "/dashboard/timetable", sub: "Schedule Management", roles: ['admin'] },
      { name: "Faculty Directory", url: "/dashboard/faculty-directory", sub: "Staff Management", roles: ['faculty', 'admin'] },
      { name: "Faculty Workload", url: "/dashboard/faculty-load", sub: "Load Analysis & Hours", roles: ['admin'] },
      { name: "Course Management", url: "/dashboard/manage-courses", sub: "Academic Catalog", roles: ['admin'] },
      { name: "Exam Management", url: "/dashboard/exams", sub: "Assessment Portal", roles: ['admin'] },
      { name: "User Management", url: "/dashboard/users", sub: "System Access", roles: ['admin'] },
      { name: "Compliance Dashboard", url: "/dashboard/analytics", sub: "Reporting", roles: ['admin'] },
      { name: "Room Management", url: "/dashboard/manage-rooms", sub: "Infrastructure", roles: ['admin'] },
      { name: "Student Records", url: "/dashboard/students", sub: "Registrar", roles: ['faculty', 'admin'] },
      { name: "My Grades & Marks", url: "/dashboard/grades", sub: "Academic Performance", roles: ['student'] },
      { name: "Learning Portal", url: "/dashboard/training", sub: "Skill Development", roles: ['student'] },
      { name: "Downloads", url: "/dashboard/student/downloads", sub: "Academic Resources", roles: ['student'] },
      { name: "Fee Payment", url: "/dashboard/student/fees/regular", sub: "Tuition & Dues", roles: ['student'] },
      { name: "My Leave Management", url: "/dashboard/leave", sub: "Request Replacements", roles: ['faculty'] },
      { name: "My Classes", url: "/dashboard/classes", sub: "Teaching Schedule", roles: ['faculty'] },
    ];

    allPages
      .filter(p => p.roles.includes(user.role))
      .forEach(p => {
        if (p.name.toLowerCase().includes(q) || p.sub.toLowerCase().includes(q)) {
          results.push({ type: 'page', id: p.url, name: p.name, sub: p.sub, url: p.url });
        }
      });

    // Search Courses
    MOCK_COURSES.forEach(c => {
      if (c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)) {
        results.push({
          type: 'course',
          id: c.id,
          name: c.name,
          code: c.code,
          sub: `${c.department} | Sem ${c.semester}`,
          url: user.role === 'admin' ? '/dashboard/manage-courses' : '/dashboard/courses'
        });
      }
    });

    // Search Faculty - Restricted for Students (Item 10)
    if (user.role !== 'student') {
        MOCK_FACULTY.forEach(f => {
            if (f.name.toLowerCase().includes(q) || (f.rollNumber && f.rollNumber.toLowerCase().includes(q))) {
                results.push({
                type: 'faculty',
                id: f.id,
                name: f.name,
                code: f.rollNumber,
                sub: `${f.designation} | ${f.department}`,
                url: `/dashboard/faculty-directory?q=${encodeURIComponent(f.name)}`
                });
            }
        });
    }

    // Search Students - Restricted for Students
    if (user.role !== 'student') {
        MOCK_STUDENTS.forEach(s => {
            if (s.name.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q)) {
                results.push({
                type: 'student',
                id: s.id,
                name: s.name,
                code: s.rollNumber,
                sub: `${s.branch} | Year ${s.year}`,
                url: `/dashboard/students?q=${encodeURIComponent(s.name)}`
                });
            }
        });
    }

    return results.slice(0, 10); // Limit results for UI
  }, [searchQuery, user.role]);

  const { toast } = useToast();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(user);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2); 
  };

  const getRoleBadgeClasses = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800";
      case "faculty":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800";
      case "student":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-800";
    }
  };

  const handleResultClick = (url: string) => {
    navigate(url);
    setSearchQuery("");
    setShowResults(false);
  };

  return (
    <header className="h-20 bg-card border-b border-border/60 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm backdrop-blur-md">
      {/* Sidebar Toggle & Search Bar */}
      <div className="flex items-center gap-6 flex-1">
        <div className="flex items-center gap-3 mr-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground hidden sm:block">Smart Campus</span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="lg:hidden h-10 w-10 hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <Menu className="h-6 w-6" />
        </Button>

        <div className="relative flex-1 hidden md:block" ref={searchContainerRef}>
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search students, faculty, courses or management pages..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              className="pl-10 h-11 bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 w-full transition-all rounded-xl font-medium"
            />
          </div>

          {/* Search Results Dropdown */}
          {showResults && searchQuery.trim().length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/60 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50 ring-1 ring-black/5">
              <div className="p-2 max-h-[480px] overflow-y-auto">
                <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/5 mb-1">
                  Top Results
                </div>
                {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <div key={`${result.type}-${result.id}`} className="flex items-center gap-1 p-1 pr-3 hover:bg-muted/60 transition-colors rounded-xl group">
                        <button
                          onClick={() => handleResultClick(result.url)}
                          className="flex-1 flex items-center gap-3 p-2 text-left"
                        >
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center transition-colors ${
                            result.type === 'page' ? 'bg-indigo-100 text-indigo-600' :
                            result.type === 'course' ? 'bg-green-100 text-green-600' :
                            result.type === 'faculty' ? 'bg-amber-100 text-amber-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {result.type === 'page' ? <Menu className="h-5 w-5" /> :
                             result.type === 'course' ? <Book className="h-5 w-5" /> :
                             result.type === 'faculty' ? <Users className="h-5 w-5" /> :
                             <GraduationCap className="h-5 w-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-foreground truncate">{result.name}</span>
                              {result.code && <Badge variant="outline" className="text-[10px] font-black uppercase border-muted h-5">{result.code}</Badge>}
                            </div>
                            <p className="text-[11px] text-muted-foreground font-medium truncate mt-0.5">{result.sub}</p>
                          </div>
                        </button>
                        
                        {(result.type === 'faculty' || result.type === 'student') && user.role === 'admin' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:bg-primary/10 rounded-lg"
                            title="Open Performance Dashboard"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResultClick(`/dashboard/${result.type}/${result.id}`);
                            }}
                          >
                            <Layout className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                           <Search className="h-3 w-3 text-muted-foreground/30" />
                        </div>
                      </div>
                    ))
                ) : (
                    <div className="p-8 text-center">
                        <X className="h-8 w-8 mx-auto mb-3 text-muted-foreground/30" />
                        <p className="text-sm font-bold text-muted-foreground">No matching results found</p>
                        <p className="text-[10px] text-muted-foreground/50 mt-1 uppercase tracking-widest">Try another search term</p>
                    </div>
                )}
              </div>
              <div className="p-3 bg-muted/30 border-t border-border/40 text-center">
                <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Quick Access Command Center</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full hover:bg-muted/60 transition-all active:scale-95 group">
              <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-[9px] font-black text-white shadow-lg ring-2 ring-card animate-pulse shadow-red-500/50">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[380px] p-0 rounded-2xl overflow-hidden shadow-2xl border-border/40 translate-y-1">
            <div className="bg-gradient-to-br from-primary/5 to-transparent px-5 py-4 flex items-center justify-between border-b border-border/50">
              <div className="flex items-center gap-2.5">
                <div className="bg-primary/10 p-2 rounded-xl">
                  <Bell className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-black text-sm tracking-tight">Notification Center</h3>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={async () => {
                  await markAllAsRead();
                  toast({
                    title: "Success",
                    description: "All notifications marked as read."
                  });
                }}
                className="h-8 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 rounded-lg"
              >
                Mark all as read
              </Button>
            </div>
            
            <div className="max-h-[420px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem 
                    key={notification.id} 
                    onClick={async () => {
                        await markAsRead(notification.id);
                        // Deep-link to the specific page if assigned (e.g. Requests/Leave/Grades)
                        if (notification.url && notification.url !== '/dashboard') {
                            navigate(notification.url);
                        } else {
                            navigate(`/dashboard/communications?tab=notifications&id=${notification.id}`);
                        }
                    }}
                    className="flex gap-4 p-4 border-b border-border/10 last:border-0 hover:bg-muted/40 transition-colors cursor-pointer group focus:bg-muted/40 items-start"
                  >
                    <div className={`mt-1 h-10 w-10 shrink-0 rounded-xl flex items-center justify-center transition-colors shadow-sm ${
                      notification.type === 'warning' || notification.type === 'attendance' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                      notification.type === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                      notification.type === 'destructive' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                      notification.type === 'fee' ? 'bg-rose-100 text-rose-600' :
                      notification.type === 'timetable' || notification.type === 'substitution' ? 'bg-blue-100 text-blue-600' :
                      'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                    }`}>
                      {notification.isRequest ? <Users className="h-5 w-5" /> : 
                       notification.type === 'attendance' ? <Clock className="h-5 w-5" /> :
                       notification.type === 'timetable' ? <Calendar className="h-5 w-5" /> :
                       notification.type === 'fee' ? <CreditCard className="h-5 w-5" /> :
                       notification.type === 'warning' ? <AlertTriangle className="h-5 w-5" /> :
                       notification.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> :
                       <Info className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm font-bold leading-none ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </span>
                        {!notification.read && <div className="h-2 w-2 rounded-full bg-primary shrink-0 animate-pulse" />}
                      </div>
                      <p className="text-[12px] text-muted-foreground font-medium leading-relaxed">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-bold text-muted-foreground opacity-60 uppercase tracking-tighter">
                          {notification.id.startsWith('api') ? 'Global' : 'System'} • Just now
                        </span>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="py-12 px-6 text-center space-y-3">
                  <div className="h-16 w-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto">
                    <Inbox className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-muted-foreground">Inbox is empty</p>
                    <p className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-black">All up to date!</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-3 bg-muted/20 text-center">
              <Link to="/dashboard/communications" className="text-[11px] font-black uppercase tracking-[0.15em] text-primary hover:text-primary/80 transition-colors">
                Open Communication Hub
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 px-2 py-1.5 h-auto hover:bg-muted/60 rounded-full md:rounded-lg">
              <Avatar className="h-10 w-10 border border-primary/20 shadow-sm transition-transform group-hover:scale-105">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold tracking-tight">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start text-left gap-1 ml-1">
                <span className="text-sm font-black text-foreground leading-tight tracking-tight">{user.name}</span>
                <span className={`text-[9px] font-black uppercase tracking-[0.1em] px-2.5 py-1 rounded-md leading-none border shadow-sm ${getRoleBadgeClasses(user.role)}`}>
                  {user.role}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.id}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={user.role === 'student' ? "/dashboard" : "/dashboard/profile"} className="cursor-pointer w-full flex items-center">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}