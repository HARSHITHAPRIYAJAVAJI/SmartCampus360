import { useOutletContext, useNavigate } from "react-router-dom";
import { MOCK_STUDENTS } from "@/data/mockStudents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Calendar, BookOpen, TrendingUp, Clock, Bell, Award, ChevronRight, CheckCircle2, CalendarDays, UploadCloud, MonitorPlay, LineChart, Star
} from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { format } from "date-fns";
import { AIML_TIMETABLES, getTimetable } from "@/data/aimlTimetable";
import { AttendanceHistory } from "@/components/dashboard/AttendanceHistory";

export default function StudentDashboard() {
    const { user } = useOutletContext<{ user: { name: string, id: string, role: string } }>();
    const navigate = useNavigate();
    
    const studentData = useMemo(() => {
        const saved = localStorage.getItem('smartcampus_student_directory');
        const students = saved ? JSON.parse(saved) : MOCK_STUDENTS;
        return students.find((s: any) => s.rollNumber.toUpperCase() === user.id.toUpperCase());
    }, [user.id]);

    const stats = [
        { title: "Current Courses", value: "6", icon: BookOpen, change: "Active this Sem", color: "text-blue-500", bg: "bg-blue-500/10" },
        { title: "Attendance", value: `${studentData?.attendance || 0}%`, icon: CheckCircle2, change: "Overall Avg", color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { title: "Assignments Due", value: "4", icon: Clock, change: "This Week", color: "text-amber-500", bg: "bg-amber-500/10" },
        { title: "Current GPA", value: studentData?.grade?.toFixed(1) || "0.0", icon: TrendingUp, change: "University Rating", color: "text-violet-500", bg: "bg-violet-500/10" },
    ];

    const quickActions = [
        { title: "View Timetable", description: "Check today's schedule", icon: CalendarDays, color: "text-blue-500", bg: "bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 hover:dark:bg-blue-900/50", path: "/dashboard/timetable" },
        { title: "Submit Assignment", description: "Upload pending work", icon: UploadCloud, color: "text-purple-500", bg: "bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 hover:dark:bg-purple-900/50", path: "/dashboard/courses" },
        { title: "Join Skill Training", description: "Enroll in new courses", icon: MonitorPlay, color: "text-emerald-500", bg: "bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 hover:dark:bg-emerald-900/50", path: "/dashboard/training" },
        { title: "Check Grades", description: "View latest feedback", icon: LineChart, color: "text-amber-500", bg: "bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 hover:dark:bg-amber-900/50", path: "/dashboard/grades" },
    ];

    const defaultSchedule = [
        { time: "09:00 AM", title: "Advanced Algorithms", room: "Room 301", type: "lecture", status: "completed" },
        { time: "11:00 AM", title: "Database Systems", room: "Lab 2", type: "lab", status: "current" },
        { time: "02:00 PM", title: "Software Engineering", room: "Room 205", type: "lecture", status: "upcoming" },
    ];

    const today = useMemo(() => format(new Date(), "EEEE"), []);

    const schedule = useMemo(() => {
        if (!studentData) return defaultSchedule;

        const currentSem = studentData.semester % 2 === 0 ? 2 : 1;
        
        // 1. Get Base Schedule from static and published stores
        const publishedStoreStr = localStorage.getItem('published_timetables');
        const publishedTimetables = publishedStoreStr ? JSON.parse(publishedStoreStr) : {};
        
        // Look for exact match in published store: Branch-Year-Sem-Section
        const publishedKey = `${studentData.branch}-${studentData.year}-${currentSem}-${studentData.section || 'A'}`;
        const liveTable = publishedTimetables[publishedKey];
        
        const table = liveTable || getTimetable(studentData.year, currentSem, studentData.section || 'A', studentData.branch);

        if (!table || Object.keys(table).length === 0) return defaultSchedule;

        const result: any[] = [];
        Object.entries(table).forEach(([dayTime, session]: [string, any]) => {
            if (!session) return;
            const [day, time] = dayTime.split('-');
            
            if (day === today) {
                const hour = parseInt(time.split(':')[0]);
                const period = (hour >= 9 && hour < 12) ? "AM" : "PM";
                
                const currentHour = new Date().getHours();
                const sessionStartHour = period === "PM" && hour !== 12 ? hour + 12 : hour;
                
                let status = "upcoming";
                if (currentHour > sessionStartHour) {
                    status = "completed";
                } else if (currentHour === sessionStartHour) {
                    status = "current";
                }

                result.push({
                    time: `${time} ${period}`,
                    title: session.courseCode || session.name,
                    room: session.room,
                    type: (session.courseCode || session.name || '').toLowerCase().includes('lab') ? 'lab' : 'lecture',
                    status: status,
                    isLive: !!liveTable
                });
            }
        });

        if (result.length === 0) return defaultSchedule;
        
        return result.sort((a, b) => a.time.localeCompare(b.time));
    }, [studentData, today]);

    return (
        <div className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-4">
            {/* Welcome Section */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-fuchsia-800 rounded-2xl p-8 text-white shadow-xl"
            >
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Star className="w-48 h-48 animate-spin-slow" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Welcome back, {user.name.split(' ')[0]}!</h1>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md px-3 font-bold">
                            {studentData?.branch || 'CSE'}
                        </Badge>
                        <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md px-3 font-bold">
                            Year {studentData?.year || 'IV'}
                        </Badge>
                        <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md px-3 font-bold">
                            Section {studentData?.section || 'A'}
                        </Badge>
                        <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md px-3 font-bold">
                            Sem {studentData?.semester || '7'}
                        </Badge>
                    </div>
                    <p className="text-violet-100 text-lg max-w-xl">
                        Stay on top of your courses, assignments, and academic progress. You are doing great this semester!
                    </p>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={index}
                        className="h-full"
                    >
                        <Card className="hover:shadow-lg transition-all border-none shadow-md overflow-hidden group h-full">
                            <CardContent className="p-6 h-full flex flex-col justify-between">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="space-y-2">
                                        <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">{stat.title}</p>
                                        <div className="text-4xl font-bold tracking-tight text-foreground">{stat.value}</div>
                                    </div>
                                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="pt-4 border-t flex items-center text-sm">
                                    <span className="text-muted-foreground font-medium">{stat.change}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="max-w-5xl mx-auto space-y-8 mb-8">
                <div className="space-y-8">
                    {/* Quick Actions */}
                    <Card className="border-none shadow-md">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <Award className="w-6 h-6 text-primary" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {quickActions.map((action, index) => (
                                    <motion.div
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        key={index}
                                        onClick={() => navigate(action.path)}
                                        className={`p-5 rounded-xl cursor-pointer transition-all border border-transparent hover:border-border/50 shadow-sm hover:shadow ${action.bg} group flex items-start gap-4`}
                                    >
                                        <div className={`p-3 rounded-lg bg-white dark:bg-black/40 ${action.color} shadow-sm group-hover:shadow transition-shadow`}>
                                            <action.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{action.title}</h3>
                                            <p className="text-sm text-muted-foreground">{action.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attendance Verification Section */}
                    <AttendanceHistory 
                        studentId={user.id} 
                        rollNumber={studentData?.rollNumber || ''} 
                    />


                </div>
            </div>
        </div>
    );
}
