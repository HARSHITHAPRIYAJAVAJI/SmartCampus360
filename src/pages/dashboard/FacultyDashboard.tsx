import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    Users,
    BookOpen,
    FileText,
    CheckCircle,
    Bell
} from "lucide-react";

import { useNavigate, useOutletContext } from "react-router-dom";
import { useMemo } from "react";
import { AIML_TIMETABLES, FACULTY_LOAD } from "@/data/aimlTimetable";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function FacultyDashboard() {
    const navigate = useNavigate();
    const { user } = useOutletContext<{ user: { name: string, id: string, role: string } }>();

    const stats = [
        { title: "My Classes", value: "8", icon: BookOpen, change: "Today", color: "text-primary" },
        { title: "Students", value: "156", icon: Users, change: "Total", color: "text-success" },
        { title: "Pending Grades", value: "23", icon: FileText, change: "Due Soon", color: "text-warning" },
        { title: "Attendance", value: "92%", icon: CheckCircle, change: "This Week", color: "text-accent" },
    ];

    const today = useMemo(() => format(new Date(), "EEEE"), []);
    const todayISO = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);

    const todaySchedule = useMemo(() => {
        const schedule: any[] = [];
        const facultyName = user.name;
        const facultyId = user.id;

        // 1. Get Base Schedule from static and published stores
        const publishedStoreStr = localStorage.getItem('published_timetables');
        const publishedTimetables = publishedStoreStr ? JSON.parse(publishedStoreStr) : {};
        const allTimetables = { ...AIML_TIMETABLES, ...publishedTimetables };

        Object.entries(allTimetables).forEach(([key, table]: [string, any]) => {
            const parts = key.split('-');
            
            // Format can be year-sem-sec (static) or dept-year-sem-sec (published)
            let dept = "AIML";
            let year, sem, section;

            if (parts.length === 4) {
                [dept, year, sem, section] = parts;
            } else {
                [year, sem, section] = parts;
                section = section || 'A';
            }

            const semKey = `${year}-${sem}`;
            const load = FACULTY_LOAD[semKey as keyof typeof FACULTY_LOAD] || [];
            
            Object.entries(table).forEach(([dayTime, session]: [string, any]) => {
                if (!session) return;
                const [day, time] = dayTime.split('-');
                if (day !== today) return;
                
                // Check assignment
                const isAssigned = session.faculty === facultyName || load.find(l => l.code === (session.courseCode || session.name) && l.faculty === facultyName);
                
                if (isAssigned) {
                    const hourStr = time.split(':')[0];
                    const hour = parseInt(hourStr);
                    const period = (hour >= 9 && hour < 12) ? "AM" : "PM";
                    
                    schedule.push({
                        id: `${key}-${dayTime}-${session.courseCode || session.name}`,
                        time: `${time} ${period}`,
                        rawTime: time,
                        title: `${session.courseCode || session.name} (Sec ${section})`,
                        room: session.room || "TBD",
                        type: (session.courseCode || session.name || '').toLowerCase().includes('lab') ? 'lab' : 'lecture',
                        isLive: !!publishedTimetables[key]
                    });
                }
            });
        });

        // 2. Apply Overrides (Swaps/Replacements)
        const savedRequests = localStorage.getItem('FACULTY_REQUESTS');
        if (savedRequests) {
            const requests = JSON.parse(savedRequests);
            const approvedForToday = requests.filter((r: any) => r.status === 'approved' && r.date === todayISO);

            approvedForToday.forEach((req: any) => {
                if (req.senderId === facultyId) {
                    const idx = schedule.findIndex(s => s.rawTime === req.period);
                    if (idx !== -1) {
                        schedule[idx].title = `${schedule[idx].title} (Handed to ${req.targetName})`;
                        schedule[idx].status = 'transferred';
                    }
                }
                
                if (req.targetId === facultyId) {
                    const hour = parseInt(req.period.split(':')[0]);
                    const period = (hour >= 9 && hour < 12) ? "AM" : "PM";
                    
                    schedule.push({
                        id: `swap-${req.id}`,
                        time: `${req.period} ${period}`,
                        rawTime: req.period,
                        title: `${req.type === 'swap' ? 'Swapped Class' : 'Replacement'}: ${req.senderName}`,
                        room: "See Original",
                        type: req.type,
                        isOverride: true
                    });
                }
            });
        }
        
        return schedule.sort((a, b) => a.time.localeCompare(b.time));
    }, [user.name, user.id, today, todayISO]);

    const quickActions = [
        { title: "Open Student Data", description: "Filter branches, view attendance, change grades", action: () => navigate('/dashboard/students') },
        { title: "Take Attendance", description: "Mark student attendance for today", action: () => navigate('/dashboard/students') },
        { title: "Grade Assignments", description: "Create or modify student grades", action: () => navigate('/dashboard/students') },
        { title: "Submit Leave Request", description: "Apply for leave or substitution", action: () => navigate('/dashboard/leave') },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-teal-600 to-emerald-800 rounded-lg p-6 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
                <p className="text-teal-100">
                    Track your classes, students, and academic responsibilities.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <span className="text-success">↗ {stat.change}</span>
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Frequently used features for Faculty</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {quickActions.map((action, index) => (
                                <div
                                    key={index}
                                    onClick={action.action}
                                    className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                                >
                                    <h3 className="font-medium mb-1">{action.title}</h3>
                                    <p className="text-sm text-muted-foreground">{action.description}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Bell className="h-5 w-5" />
                            <span>Recent Activity</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                            <div>
                                <p className="text-sm font-medium">New assignment posted</p>
                                <p className="text-xs text-muted-foreground">Data Structures - Due in 3 days</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                            <div>
                                <p className="text-sm font-medium">Grade published</p>
                                <p className="text-xs text-muted-foreground">Database Systems - 89/100</p>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full mt-4">
                            View All Notifications
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Today's Schedule Preview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5" />
                        <span>Today's Schedule</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {todaySchedule.map((item, index) => (
                            <div key={index} className={cn(
                                "flex items-center justify-between p-3 rounded-lg transition-all",
                                item.isOverride ? "bg-indigo-50 border border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800" : "bg-muted/30",
                                item.status === 'transferred' ? "opacity-50 grayscale" : ""
                            )}>
                                <div className="flex items-center space-x-3">
                                    <div className="text-sm font-mono text-muted-foreground">{item.time}</div>
                                    <div>
                                        <p className="font-medium flex items-center gap-2">
                                            {item.title}
                                            {item.isOverride && <Badge className="text-[10px] h-4 bg-indigo-500">New</Badge>}
                                        </p>
                                        <p className="text-sm text-muted-foreground">{item.room}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <Badge variant={item.type === "lecture" ? "default" : item.type === "lab" ? "secondary" : "outline"}>
                                        {item.type}
                                    </Badge>
                                    {item.status === 'transferred' && <span className="text-[10px] text-red-500 font-bold uppercase">Transferred</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/dashboard/timetable')}>
                        View Full Timetable
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
