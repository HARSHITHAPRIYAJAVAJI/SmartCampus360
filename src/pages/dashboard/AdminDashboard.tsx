import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dataPersistence } from "@/utils/dataPersistence";
import { Button } from "@/components/ui/button";
import {
    Users,
    BookOpen,
    TrendingUp,
    Phone,
    ShieldCheck,
    Building2,
    FileText,
    PieChart,
    Settings2,
    RotateCw,
    GraduationCap,
    CalendarDays,
    ArrowUpRight,
    Search,
    ChevronRight,
    LayoutGrid,
    Sparkles
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MOCK_STUDENTS } from "@/data/mockStudents";
import { MOCK_FACULTY } from "@/data/mockFaculty";
import { MOCK_COURSES } from "@/data/mockCourses";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useOutletContext } from "react-router-dom";
import { Mail, Smartphone, MapPin, History, LayoutDashboard, UserCircle, LogOut, Bell } from "lucide-react";
import { alertService } from "@/services/alertService";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { user } = useOutletContext<{ user: { name: string, id: string, role: string } }>();
    const [selectedFaculty, setSelectedFaculty] = useState<any>(null);

    // Admin specific profile data
    const adminProfile = {
        name: user.name || "System Administrator",
        id: "INST_ADM_001",
        email: "admin.hq@smartcampus360.edu",
        dept: "Central Governance & Operations",
        location: "Admin Block - Level 4",
        phone: "+91 99887 76655",
        lastActivity: "2 mins ago (Audit Export)"
    };

    // Automated 4:30 PM Dispatcher Logic
    useEffect(() => {
        const checkTime = setInterval(() => {
            const now = new Date();
            // Check if it's 4:30 PM (16:30)
            if (now.getHours() === 16 && now.getMinutes() === 30) {
                const today = now.toISOString().split('T')[0];
                const key = `sent_attendance_summary_${today}`;
                if (!localStorage.getItem(key)) {
                    alertService.processDailyAttendanceSummary(today);
                    localStorage.setItem(key, 'true');
                    toast.success("Automated 4:30 PM Attendance Summary Dispatched.");
                }
            }
        }, 60000); // Check every minute
        return () => clearInterval(checkTime);
    }, []);

    // Real-time data counts
    const totalStudents = dataPersistence.getStudents().length.toLocaleString();
    const totalFaculty = dataPersistence.getFaculty().length.toLocaleString();
    const totalCourses = dataPersistence.getCourses().length.toLocaleString();

    const stats = [
        { 
            title: "Executive Faculty", 
            value: totalFaculty, 
            icon: Users, 
            color: "text-blue-600", 
            bg: "bg-blue-50", 
            border: "border-blue-500",
            trend: "+4 this month"
        },
        { 
            title: "Active Students", 
            value: totalStudents, 
            icon: GraduationCap, 
            color: "text-indigo-600", 
            bg: "bg-indigo-50", 
            border: "border-indigo-500",
            trend: "+124 current sem"
        },
        { 
            title: "Course Catalog", 
            value: totalCourses, 
            icon: BookOpen, 
            color: "text-rose-600", 
            bg: "bg-rose-50", 
            border: "border-rose-500",
            trend: "All blocks synced"
        },
        { 
            title: "Global Compliance", 
            value: "94%", 
            icon: ShieldCheck, 
            color: "text-emerald-600", 
            bg: "bg-emerald-50", 
            border: "border-emerald-500",
            trend: "NAAC Ready"
        },
    ];

    const quickActions = [
        {
            title: "Dispatch Daily Attendance",
            description: "Consolidate and send daily 4:30 PM alerts",
            icon: Bell,
            color: "bg-red-600",
            action: () => {
                const today = new Date().toISOString().split('T')[0];
                const count = alertService.processDailyAttendanceSummary(today);
                if (count > 0) {
                    toast.success(`Successfully dispatched consolidated alerts to ${count} students.`);
                } else {
                    toast.info("No absences recorded for today yet.");
                }
            }
        },
        {
            title: "Manage Student Records",
            description: "View the master student directory",
            icon: FileText,
            color: "bg-red-500",
            action: () => navigate('/dashboard/students')
        },
        {
            title: "Generate Reports",
            description: "Create accreditation reports",
            icon: PieChart,
            color: "bg-rose-600",
            action: () => navigate('/dashboard/accreditation')
        },
        {
            title: "Manage Courses",
            description: "Add or modify course catalog",
            icon: GraduationCap,
            color: "bg-rose-700",
            action: () => navigate('/dashboard/manage-courses')
        },
        {
            title: "Exam Seating Allocation",
            description: "Generate and manage exam tables",
            icon: CalendarDays,
            color: "bg-red-600",
            action: () => navigate('/dashboard/exams')
        },
        {
            title: "Leave & Requests",
            description: "Manage faculty leave and swaps",
            icon: Sparkles,
            color: "bg-rose-500",
            action: () => navigate('/dashboard/requests')
        },
        {
            title: "Institutional System Reset",
            description: "Wipe all local data and restart engine",
            icon: RotateCw,
            color: "bg-red-800",
            action: () => {
                if (window.confirm("⚠️ DANGER: This will PERMANENTLY DELETE all generated timetables, leave requests, exam schedules, and local directory changes. Are you sure?")) {
                    localStorage.removeItem('published_timetables');
                    localStorage.removeItem('FACULTY_REQUESTS');
                    localStorage.removeItem('EXAM_SCHEDULE');
                    localStorage.removeItem('EXAM_SEATING_PLAN');
                    localStorage.removeItem('INVIGILATION_LIST');
                    localStorage.removeItem('EXAM_TIMETABLES');
                    localStorage.removeItem('smartcampus_student_directory');
                    localStorage.removeItem('smartcampus_faculty_directory');
                    window.location.reload();
                }
            }
        },
        {
            title: "System Settings",
            description: "Configure platform settings",
            icon: Settings2,
            color: "bg-rose-400",
            action: () => navigate('/dashboard/settings')
        },
    ];

    return (
        <div className="space-y-2">
            {/* Combined Profile & Command Header */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Admin Persona Card */}
                <div className="xl:col-span-3 relative overflow-hidden bg-white dark:bg-slate-950 rounded-[2.5rem] p-6 shadow-premium border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between min-h-[260px]">
                    {/* Floating Decorative Elements */}
                    <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 pointer-events-none translate-x-1/4 -translate-y-1/4 text-primary">
                        <ShieldCheck className="w-80 h-80" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center gap-8 mb-6">
                            <div className="flex-1 space-y-2">
                                <div className="flex flex-wrap items-center gap-3 mb-1">
                                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-none px-3 font-black text-[9px] tracking-widest uppercase">
                                        EXECUTIVE LEVEL
                                    </Badge>
                                    <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-tighter flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        System Online
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-1 text-slate-900 dark:text-white uppercase">
                                    {adminProfile.name}
                                </h1>
                                <div className="flex items-center gap-2 text-slate-400 font-bold tracking-tight text-sm">
                                    <Building2 className="w-4 h-4 text-slate-300" />
                                    <p>{adminProfile.dept}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                            {[
                                { icon: Mail, label: "Institutional Email", value: adminProfile.email },
                                { icon: Smartphone, label: "Secure Line", value: adminProfile.phone },
                                { icon: MapPin, label: "Command Location", value: adminProfile.location },
                            ].map((item, i) => (
                                <div key={i} className="space-y-1">
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-slate-600 truncate">{item.label}</p>
                                    <div className="flex items-center gap-2 group cursor-pointer">
                                        <item.icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                                        <p className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors truncate">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2.5rem] overflow-hidden group bg-white dark:bg-slate-950">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                                {stat.title}
                            </CardTitle>
                            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                                <stat.icon className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white mb-1 group-hover:scale-110 transition-transform origin-left">{stat.value}</div>
                            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                                <div className="h-1 w-1 rounded-full bg-emerald-500" />
                                {stat.trend}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Executive Action Hub */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-600">
                        <LayoutGrid className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tighter uppercase italic">Quick Actions</h2>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Executive Control Hub</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {quickActions.map((action, index) => (
                        <Card
                            key={index}
                            className="bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl border-border/50 hover:border-primary/50 cursor-pointer transition-all duration-300 group rounded-[2rem] overflow-hidden relative"
                            onClick={action.action}
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                                <ArrowUpRight className="w-12 h-12" />
                            </div>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3.5 rounded-2xl ${action.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <action.icon className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-black text-sm tracking-tight group-hover:text-primary transition-colors uppercase leading-none mb-1">
                                                {action.title}
                                            </h3>
                                            <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </div>
                                        <p className="text-xs text-muted-foreground font-medium leading-tight">
                                            {action.description}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

        </div>
    );
}
