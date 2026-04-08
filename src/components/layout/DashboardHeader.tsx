import { useState, useMemo, useRef, useEffect } from "react";
import { Bell, User, LogOut, Search, Menu, Book, Users, GraduationCap, X } from "lucide-react";
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

    // Search Pages (Navigation)
    const pages = [
      { name: "Timetable Generator", url: "/dashboard/timetable", sub: "Schedule Management" },
      { name: "Faculty Directory", url: "/dashboard/faculty-directory", sub: "Staff Management" },
      { name: "Course Management", url: "/dashboard/manage-courses", sub: "Academic Records" },
      { name: "Exam Management", url: "/dashboard/exams", sub: "Assessment Portal" },
      { name: "User Management", url: "/dashboard/users", sub: "System Access" },
      { name: "Compliance Dashboard", url: "/dashboard/analytics", sub: "Reporting" },
      { name: "Room Management", url: "/dashboard/manage-rooms", sub: "Infrastructure" },
      { name: "Student Records", url: "/dashboard/students", sub: "Registrar" },
    ];

    pages.forEach(p => {
      if (p.name.toLowerCase().includes(q)) {
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
          url: '/dashboard/manage-courses'
        });
      }
    });

    // Search Faculty
    MOCK_FACULTY.forEach(f => {
      if (f.name.toLowerCase().includes(q) || (f.rollNumber && f.rollNumber.toLowerCase().includes(q))) {
        results.push({
          type: 'faculty',
          id: f.id,
          name: f.name,
          code: f.rollNumber,
          sub: `${f.designation} | ${f.department}`,
          url: '/dashboard/faculty-directory'
        });
      }
    });

    // Search Students
    MOCK_STUDENTS.forEach(s => {
      if (s.name.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q)) {
        results.push({
          type: 'student',
          id: s.id,
          name: s.name,
          code: s.rollNumber,
          sub: `${s.branch} | Year ${s.year}`,
          url: '/dashboard/students'
        });
      }
    });

    return results.slice(0, 10); // Limit results for UI
  }, [searchQuery]);

  const [baseNotifications] = useState([
    { id: '1', title: "New assignment posted", type: "info", read: false },
    { id: '2', title: "Class rescheduled", type: "warning", read: false },
    { id: '3', title: "Grade updated", type: "success", read: true },
  ]);

  const notifications: any[] = [
    ...baseNotifications,
    ...(user.role === 'admin' ? MOCK_LEAVE_REQUESTS.filter(l => l.status === 'Pending').map(l => ({
      id: `leave-${l.id}`,
      title: `Leave request: ${l.facultyName}`,
      message: `${l.type} for ${l.days} days`,
      type: "warning",
      read: false,
      isLeave: true
    })) : [])
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

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
      <div className="flex items-center gap-6 flex-1 max-w-2xl">
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
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result.url)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-muted/60 transition-colors rounded-xl text-left group"
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
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                         <Search className="h-3 w-3 text-primary" />
                      </div>
                    </button>
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
            <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full hover:bg-muted/60 transition-colors">
              <Bell className="h-[22px] w-[22px] text-muted-foreground" />
              {unreadCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 h-[18px] w-[18px] rounded-full bg-red-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-2 ring-card"
                >
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
                <div className="flex w-full items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-medium">{notification.title}</span>
                    {notification.message && <span className="text-xs text-muted-foreground">{notification.message}</span>}
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
                {notification.isLeave && (
                    <Link to="/admin/faculty" className="text-[10px] text-primary mt-1 font-bold hover:underline">
                        Approve/Reject Requests →
                    </Link>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-primary">
              View all notifications
            </DropdownMenuItem>
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
              <Link to={user.role === 'student' ? "/dashboard/profile" : "#"} className="cursor-pointer w-full flex items-center">
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