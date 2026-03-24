import { useState } from "react";
import { Bell, User, LogOut, Search, Menu } from "lucide-react";
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
import { Link } from "react-router-dom";

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
      .slice(0, 2); // Prevent 3 letters like "DSH" crowding the avatar
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

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6">
      {/* Left section */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="hidden md:flex items-center space-x-2 bg-muted rounded-lg px-3 py-2 min-w-[300px]">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses, faculty, students..."
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          />
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
              <div className="hidden md:flex flex-col items-start text-left">
                <span className="text-sm font-bold text-foreground leading-none mb-1.5">{user.name}</span>
                <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full leading-none shadow-sm ${getRoleBadgeClasses(user.role)}`}>
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
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
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