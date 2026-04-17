
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    const totalStudents = MOCK_STUDENTS.length.toLocaleString();
    const totalFaculty = MOCK_FACULTY.length.toLocaleString();
    const totalCourses = MOCK_COURSES.length.toLocaleString();

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
        <div className="space-y-6">
            {/* Combined Profile & Command Header */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Admin Persona Card */}
                <div className="xl:col-span-2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-[2.5rem] p-1 shadow-2xl border border-indigo-500/10">
                    <div className="bg-slate-950/40 backdrop-blur-3xl rounded-[2.4rem] p-8 h-full">
                        <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 pointer-events-none">
                            <ShieldCheck className="w-64 h-64 text-white" />
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                                <Avatar className="h-32 w-32 border-4 border-white/10 shadow-2xl relative z-10">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${adminProfile.name}`} />
                                    <AvatarFallback className="text-4xl font-black bg-indigo-600 text-white">{adminProfile.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-1 right-1 h-6 w-6 rounded-full bg-emerald-500 border-4 border-slate-900 shadow-lg z-20" />
                            </div>

                            <div className="flex-1 text-center md:text-left space-y-3">
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                    <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/20 px-3 py-1 rounded-full font-black tracking-widest text-[9px] uppercase">
                                        Executive Level Authority
                                    </Badge>
                                    <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-[9px] font-black uppercase">
                                        System Online
                                    </Badge>
                                </div>
                                <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
                                    {adminProfile.name}
                                </h1>
                                <p className="text-indigo-100/60 font-medium tracking-tight flex items-center justify-center md:justify-start gap-2">
                                    <Building2 className="w-4 h-4" /> {adminProfile.dept}
                                </p>
                            </div>

                            <div className="hidden lg:flex flex-col items-end gap-3 pr-4 border-l border-white/5 pl-8">
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300/60">Institutional ID</p>
                                    <p className="font-mono text-sm text-white font-bold tracking-widest uppercase">{adminProfile.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300/60">Last Event</p>
                                    <p className="text-sm text-indigo-100 font-bold italic">{adminProfile.lastActivity}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { icon: Mail, label: "Institutional Email", value: adminProfile.email },
                                { icon: Smartphone, label: "Encrypted Phone", value: adminProfile.phone },
                                { icon: MapPin, label: "Command Location", value: adminProfile.location },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 group px-4 py-2 hover:bg-white/5 rounded-2xl transition-colors">
                                    <item.icon className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-indigo-300/40">{item.label}</p>
                                        <p className="text-[11px] font-bold text-indigo-100 tracking-tight">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Governance Stats */}
                <div className="relative overflow-hidden bg-white dark:bg-slate-950 rounded-[2.5rem] p-8 shadow-xl border border-border/50 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-600">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-black text-sm tracking-tight">Personnel Analytics</h3>
                                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Across All Sub-systems</p>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4">
                            {[
                                { label: "Student Engagement", value: 92 },
                                { label: "Faculty Compliance", value: 88 },
                                { label: "System Uptime", value: 100 },
                            ].map((stat, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                                        <span>{stat.label}</span>
                                        <span>{stat.value}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-full"
                                            style={{ width: `${stat.value}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button variant="outline" className="w-full mt-6 rounded-2xl border-rose-100 hover:bg-rose-50 text-rose-600 font-black text-[10px] uppercase tracking-widest h-12">
                        View Detailed Audit Trail <ChevronRight className="w-3 h-3 ml-2" />
                    </Button>
                </div>
            </div>

            {/* Existing Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className={`border-none shadow-premium hover:shadow-2xl transition-all duration-300 rounded-[2rem] overflow-hidden group bg-white dark:bg-slate-950 border-t-4 ${stat.border.replace('border-', 'border-t-')}`}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60 group-hover:opacity-100 transition-opacity">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tracking-tighter mb-1">{stat.value}</div>
                            <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                                <TrendingUp className="h-3 w-3 text-emerald-500" />
                                {stat.trend}
                            </p>
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

            {/* Institutional Directory Drill-down (Simulation) */}
            <div className="mt-8">
                <Card className="border-none shadow-premium rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-950">
                    <CardHeader className="bg-slate-50 dark:bg-slate-900/50 p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl font-black tracking-tighter uppercase italic">Institutional Directory</CardTitle>
                                <CardDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Global personnel and asset search</CardDescription>
                            </div>
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search Roll ID, Faculty Code, or Name..." 
                                    className="pl-12 h-14 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-sm shadow-inner"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="p-8 text-center bg-slate-50/50 dark:bg-slate-900/20">
                            <div className="max-w-md mx-auto space-y-4">
                                <div className="h-20 w-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl flex items-center justify-center mx-auto text-indigo-600 mb-6">
                                    <Search className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-black tracking-tight uppercase">Ready for Analysis</h3>
                                <p className="text-sm text-muted-foreground font-medium italic">Use the search bar above to drill down into specific department performance or student cohorts.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
