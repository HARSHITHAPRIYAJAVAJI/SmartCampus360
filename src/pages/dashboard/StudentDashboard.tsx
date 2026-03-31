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

export default function StudentDashboard() {
    const { user } = useOutletContext<{ user: { name: string, id: string, role: string } }>();
    const navigate = useNavigate();
    const studentData = MOCK_STUDENTS.find(s => s.rollNumber.toUpperCase() === user.id.toUpperCase());

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
        const table = getTimetable(studentData.year, currentSem, studentData.section || 'A');

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
                    title: session.courseCode,
                    room: session.room,
                    type: session.courseCode.toLowerCase().includes('lab') ? 'lab' : 'lecture',
                    status: status
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Actions & Activity) */}
                <div className="lg:col-span-2 space-y-8">
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

                    {/* Timeline / Recent Activity */}
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold flex items-center space-x-2">
                                <Bell className="h-6 w-6 text-primary" />
                                <span>Recent Updates</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6 pl-2 mt-2">
                                {/* Timeline Item 1 */}
                                <div className="relative pl-6 border-l-2 border-primary/20 pb-2">
                                    <div className="absolute -left-[11px] top-1 w-5 h-5 bg-primary rounded-full border-4 border-background flex items-center justify-center shadow-sm"></div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-bold text-foreground">New Assignment Posted</p>
                                            <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">2 hrs ago</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Data Structures - "Graph Traversal Implementation". Due in 3 days.</p>
                                    </div>
                                </div>
                                {/* Timeline Item 2 */}
                                <div className="relative pl-6 border-l-2 border-success/20 pb-2">
                                    <div className="absolute -left-[11px] top-1 w-5 h-5 bg-success rounded-full border-4 border-background shadow-sm"></div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-bold text-foreground">Grade Published</p>
                                            <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Yesterday</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Database Systems Midterm: <span className="text-success font-bold">89/100</span>. Great job!</p>
                                    </div>
                                </div>
                                <div className="relative pl-6">
                                    <div className="absolute -left-[11px] top-1 w-5 h-5 bg-warning rounded-full border-4 border-background shadow-sm"></div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-bold text-foreground">Class Rescheduled</p>
                                            <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Yesterday</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Advanced Algorithms moved to 2 PM in Room 205.</p>
                                    </div>
                                </div>
                            </div>
                            <Button 
                                variant="ghost" 
                                onClick={() => navigate("/dashboard/notifications")}
                                className="w-full mt-6 text-primary hover:bg-primary/5 hover:text-primary font-semibold"
                            >
                                View All Notifications <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column (Schedule) */}
                <div className="space-y-8 h-full">
                    <Card className="border-none shadow-md overflow-hidden relative h-full flex flex-col">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-purple-500 to-accent"></div>
                        <CardHeader className="pb-4 pt-6">
                            <CardTitle className="text-xl font-bold flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-6 w-6 text-primary" />
                                    <span>Today's Classes</span>
                                </div>
                                <Badge variant="secondary" className="font-bold px-2 py-0.5 text-xs">Mar 15</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-between">
                            <div className="space-y-4">
                                {schedule.map((item, index) => (
                                    <div key={index} 
                                        className={`relative p-5 rounded-xl border-l-4 transition-all duration-300 ${
                                            item.status === 'current' ? 'bg-primary/5 border-primary shadow-sm hover:shadow-md' : 
                                            item.status === 'completed' ? 'bg-muted/30 border-muted-foreground/30 opacity-70 hover:opacity-100' : 
                                            'bg-background border-border hover:bg-muted/30 shadow-sm hover:shadow-md'
                                        }`}>
                                        
                                        {item.status === 'current' && (
                                            <div className="absolute top-5 right-4 flex items-center gap-1.5">
                                                <span className="relative flex h-2.5 w-2.5">
                                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                                                </span>
                                                <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Now</span>
                                            </div>
                                        )}
                                        {item.status === 'completed' && (
                                            <div className="absolute top-5 right-4">
                                                <CheckCircle2 className="w-5 h-5 text-muted-foreground/50" />
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-1.5 pr-10">
                                            <div className="text-xs font-bold text-muted-foreground tracking-wide flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                {item.time}
                                            </div>
                                            <p className={`font-semibold text-lg leading-tight ${item.status === 'completed' ? 'text-muted-foreground' : 'text-foreground'}`}>
                                                {item.title}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge variant={item.type === "lecture" ? "default" : "secondary"} className="text-[10px] uppercase font-bold tracking-wider h-5 px-2">
                                                    {item.type}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                                                    📍 {item.room}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button 
                                onClick={() => navigate("/dashboard/timetable")}
                                className="w-full mt-8 shadow hover:shadow-lg transition-all border-none bg-primary text-primary-foreground font-semibold py-6"
                            >
                                View Full Timetable
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
