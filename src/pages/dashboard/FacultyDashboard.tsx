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
import { useMemo, useState, useEffect } from "react";
import { FACULTY_LOAD, getTimetable } from "@/data/aimlTimetable";
import { MOCK_COURSES } from "@/data/mockCourses";
import { format } from "date-fns";
import { formatSubjectName } from "@/data/subjectMapping";
import { cn } from "@/lib/utils";

import { MOCK_FACULTY } from "@/data/mockFaculty";

export default function FacultyDashboard({ facultyId: propFacultyId }: { facultyId?: string }) {
    const navigate = useNavigate();
    const { user: authUser } = useOutletContext<{ user: { name: string, id: string, role: string } }>();

    // If facultyId is provided (e.g. from admin view), use that faculty's data
    const impersonatedFaculty = useMemo(() => {
        if (!propFacultyId) return null;
        return MOCK_FACULTY.find(f => f.id === propFacultyId || f.rollNumber === propFacultyId);
    }, [propFacultyId]);

    const user = impersonatedFaculty ? { 
        name: impersonatedFaculty.name, 
        id: impersonatedFaculty.id, 
        role: 'faculty' 
    } : authUser;

    const isImpersonating = !!impersonatedFaculty;

    const stats = [
        { title: "My Classes", value: "8", icon: BookOpen, change: "Today", color: "text-primary" },
        { title: "Students", value: "156", icon: Users, change: "Total", color: "text-success" },
        { title: "Pending Grades", value: "23", icon: FileText, change: "Due Soon", color: "text-warning" },
        { title: "Attendance", value: "92%", icon: CheckCircle, change: "This Week", color: "text-accent" },
    ];

    const today = useMemo(() => format(new Date(), "EEEE"), []);
    const todayISO = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);

    const [storageSyncStamp, setStorageSyncStamp] = useState(0);
    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'published_timetables') {
                setStorageSyncStamp(s => s + 1);
            }
        };
        window.addEventListener('storage', handleStorage);
        const handleCustomEvent = () => setStorageSyncStamp(s => s + 1);
        window.addEventListener('timetable_published', handleCustomEvent);
        
        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('timetable_published', handleCustomEvent);
        };
    }, []);

    const todaySchedule = useMemo(() => {
        const schedule: any[] = [];
        const nameToMatch = user.name;
        const idToMatch = user.id;

        // 1. Get Base Schedule from static and published stores
        const publishedStoreStr = localStorage.getItem('published_timetables');
        const useDemoData = publishedStoreStr === null;
        const publishedTimetables = publishedStoreStr ? JSON.parse(publishedStoreStr) : {};
        
        const allTimetablesToProcess: Record<string, any> = {};
        const branches = ["CSM", "CSE", "IT", "ECE"];
        const years = [1, 2, 3, 4];
        const sections = ["A", "B", "C"];
        
        branches.forEach(branch => {
            years.forEach(year => {
                [1, 2].forEach(sem => {
                    sections.forEach(section => {
                        const publishedKey = `${branch}-${year}-${sem}-${section}`;
                        const publishedEntry = publishedTimetables[publishedKey];
                        if (publishedEntry) {
                            allTimetablesToProcess[publishedKey] = publishedEntry.grid || publishedEntry;
                        } else if (useDemoData) {
                            // Check fallback generic keys synchronously
                            const fallback = getTimetable(year, sem, section, branch);
                            if (Object.keys(fallback).length > 0) {
                                allTimetablesToProcess[publishedKey] = fallback;
                            }
                        }
                    });
                });
            });
        });

        Object.entries(allTimetablesToProcess).forEach(([key, table]: [string, any]) => {
            const [dept, year, sem, section] = key.split('-');

            const semKey = `${year}-${sem}`;
            const load = FACULTY_LOAD[semKey as keyof typeof FACULTY_LOAD] || [];
            
            // Create a map for course name lookup
            const courseNameMap: Record<string, string> = {};
            MOCK_COURSES.forEach(c => {
                courseNameMap[c.code] = c.name;
                courseNameMap[c.code.replace(' Lab', '').trim()] = c.name;
            });

            Object.entries(table).forEach(([dayTime, session]: [string, any]) => {
                if (!session) return;
                let [day, time] = dayTime.split('-');
                if (day !== today) return;
                
                const timeMap: Record<string, string> = { "09:30": "09:40", "10:30": "10:40", "11:40": "11:40", "01:30": "01:20", "02:30": "02:20", "03:30": "03:20" };
                time = timeMap[time] || time;
                
                let isAssigned = false;
                
                // PRIORITY 1: ID-BASED MATCHING
                if (session.facultyId && idToMatch) {
                    isAssigned = session.facultyId === idToMatch;
                }
                if (!isAssigned && session.facultyIds && session.facultyIds.includes(idToMatch)) {
                    isAssigned = true;
                }
                
                // PRIORITY 2: NAME-BASED MATCHING
                if (!isAssigned) {
                    if (session.faculty) {
                        isAssigned = session.faculty.trim().toLowerCase() === nameToMatch.trim().toLowerCase();
                    } else if (session.room && (session.room.includes("Mrs.") || session.room.includes("Dr."))) {
                        isAssigned = session.room.trim().toLowerCase() === nameToMatch.trim().toLowerCase();
                    }
                }

                // PRIORITY 3: GENERIC ROUND-ROBIN fallback
                if (!isAssigned && !session.faculty && (!session.room || (!session.room.includes("Mrs.") && !session.room.includes("Dr.")))) {
                    const courseCode = session.courseCode || (session.subject?.split(' (')[0]);
                    const eligibleFaculty = (load as any[])
                        .filter(l => l.code === courseCode)
                        .map(l => ({ name: l.faculty, id: l.id }));

                    if (eligibleFaculty.length > 0) {
                        const sectionIndex = section.charCodeAt(0) - 'A'.charCodeAt(0);
                        const assignedIndex = sectionIndex % eligibleFaculty.length;
                        const assignedFaculty = eligibleFaculty[assignedIndex];
                        
                        isAssigned = assignedFaculty.id === idToMatch || 
                                     assignedFaculty.name?.trim().toLowerCase() === nameToMatch.trim().toLowerCase();
                    }
                }
                
                if (isAssigned) {
                    const hourStr = time.split(':')[0];
                    const hour = parseInt(hourStr);
                    const period = (hour >= 9 && hour < 12) ? "AM" : "PM";
                    
                    const cleanCode = (session.courseCode || session.name || '').split(' (')[0].trim();
                    const fullName = courseNameMap[cleanCode] || cleanCode;

                    schedule.push({
                        id: `${key}-${dayTime}-${session.courseCode || session.name}`,
                        time: `${time} ${period}`,
                        rawTime: time,
                        title: `${formatSubjectName(fullName)} (Sec ${section})`,
                        room: session.room && (session.room.includes("Mrs.") || session.room.includes("Dr.")) ? "TBD" : (session.room || "TBD"),
                        type: (fullName || '').toLowerCase().includes('lab') ? 'lab' : 'lecture',
                        isLive: !!publishedTimetables[key],
                        dept,
                        year,
                        section,
                        code: cleanCode
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
                if (req.senderId === idToMatch) {
                    const idx = schedule.findIndex(s => s.rawTime === req.period);
                    if (idx !== -1) {
                        schedule[idx].title = `${schedule[idx].title} (Handed to ${req.targetName})`;
                        schedule[idx].status = 'transferred';
                    }
                }
                
                if (req.targetId === idToMatch) {
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
    }, [user.name, user.id, today, todayISO, storageSyncStamp]);

    const quickActions = [
        { title: "Open Student Data", description: "Filter branches, view attendance, change grades", action: () => navigate('/dashboard/students') },
        { title: "Take Attendance", description: "Mark student attendance for today", action: () => navigate('/dashboard/students') },
        { title: "Grade Assignments", description: "Create or modify student grades", action: () => navigate('/dashboard/students') },
        { title: "Submit Leave Request", description: "Apply for leave or substitution", action: () => navigate('/dashboard/leave') },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className={cn(
                "rounded-lg p-6 text-white shadow-lg",
                isImpersonating ? "bg-gradient-to-r from-slate-700 to-slate-900" : "bg-gradient-to-r from-teal-600 to-emerald-800"
            )}>
                {isImpersonating && (
                    <div className="bg-amber-500/20 text-amber-200 text-[10px] font-black uppercase tracking-[0.2em] mb-4 py-1 px-3 rounded-full border border-amber-500/30 w-fit">
                        Admin Viewing Mode
                    </div>
                )}
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
                <p className="text-teal-100 italic">
                    {isImpersonating ? "Viewing academic profile and schedule as Administrator." : "Track your classes, students, and academic responsibilities."}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card 
                        key={index} 
                        className="hover:shadow-md transition-all cursor-pointer hover:border-primary/50"
                        onClick={() => navigate(stat.title === "My Classes" ? '/dashboard/classes' : '/dashboard/students')}
                    >
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
                                        {item.status !== 'transferred' && (
                                            <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                className="h-6 text-[10px] font-black text-primary hover:bg-primary/10 px-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/dashboard/students?dept=${item.dept}&year=${item.year}&section=${item.section}&course=${item.code}&mode=attendance`);
                                                }}
                                            >
                                                Mark Attendance
                                            </Button>
                                        )}
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
        </div>
    );
}
