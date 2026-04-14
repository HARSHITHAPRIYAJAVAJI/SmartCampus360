import { useState, useMemo, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
// Force re-build to sync imports
import { MOCK_STUDENTS } from "@/data/mockStudents";
import { MOCK_COURSES, Course } from "@/data/mockCourses";
import { 
    Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { 
    Calendar, BookOpen, TrendingUp, Clock, Bell, Award, 
    ChevronRight, CheckCircle2, CalendarDays, UploadCloud, 
    MonitorPlay, LineChart, Star, Github, Linkedin, 
    Zap, Calculator, UserPlus, AlertCircle, Download, CreditCard, ShieldCheck,
    MessageSquare, X, Send, Bot, User, Minimize2, Maximize2, Sparkles, BrainCircuit, Building2,
    Mail, Smartphone, MapPin, Globe, Briefcase, FileText, UserCircle, GraduationCap, Users
} from "lucide-react";
import { formatSubjectName } from "@/data/subjectMapping";
import { motion, AnimatePresence } from "framer-motion";
import notificationService from "@/services/notificationService";
import { attendanceService } from "@/services/attendanceService";
import { YEAR_IN_CHARGES, CLASS_TEACHERS, getSectionCR } from "@/data/mockHierarchy";
import { MOCK_FACULTY } from "@/data/mockFaculty";
import { AttendanceHistory } from "@/components/dashboard/AttendanceHistory";
import { toast } from "sonner";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { calculateAcademicMetrics } from "@/utils/academicCalculations";
import { format } from "date-fns";
import { getTimetable } from "@/data/aimlTimetable";

export default function StudentDashboard({ studentId: propStudentId }: { studentId?: string }) {
    const { user: authUser } = useOutletContext<{ user: { name: string, id: string, role: string } }>();
    const navigate = useNavigate();
    
    // Resolve which student we are looking at
    const impersonatedStudent = useMemo(() => {
        if (!propStudentId) return null;
        const saved = localStorage.getItem('smartcampus_student_directory');
        const students = saved ? JSON.parse(saved) : MOCK_STUDENTS;
        return students.find((s: any) => s.id === propStudentId || s.rollNumber.toUpperCase() === propStudentId.toUpperCase());
    }, [propStudentId]);

    const user = impersonatedStudent ? {
        name: impersonatedStudent.name,
        id: impersonatedStudent.rollNumber,
        role: 'student'
    } : authUser;

    const isImpersonating = !!impersonatedStudent;
    
    const [gpaWhatIf, setGpaWhatIf] = useState<number | string>("");
    const [storageSyncStamp, setStorageSyncStamp] = useState(0);
    const [liveAttendancePct, setLiveAttendancePct] = useState<number | null>(null);
    const [liveAlerts, setLiveAlerts] = useState<any[]>([]);

    useEffect(() => {
        const loadAlerts = () => {
            const student = MOCK_STUDENTS.find(s => s.rollNumber === user.id);
            if (!student) return;
            const saved = localStorage.getItem('STUDENT_ALERTS');
            if (saved) {
                const parsed = JSON.parse(saved);
                setLiveAlerts(parsed.filter((a: any) => 
                    a.branch === student.branch && 
                    a.year === student.year && 
                    a.section === student.section
                ).slice(0, 3));
            }
        };

        loadAlerts();
        window.addEventListener('student_alerts_updated', loadAlerts);
        return () => window.removeEventListener('student_alerts_updated', loadAlerts);
    }, [user.id]);

    const studentData = useMemo(() => {
        if (impersonatedStudent) return impersonatedStudent;
        const saved = localStorage.getItem('smartcampus_student_directory');
        if (saved) {
            const students = JSON.parse(saved);
            const found = students.find((s: any) => s.rollNumber.toUpperCase() === user.id.toUpperCase());
            if (found) return found;
        }
        return MOCK_STUDENTS.find((s: any) => s.rollNumber.toUpperCase() === user.id.toUpperCase());
    }, [user.id, impersonatedStudent, storageSyncStamp]);

    // Advanced Stats: Attendance Buffer & Predictive GPA
    const academicMetrics = useMemo(() => {
        if (!studentData) return { buffer: 0, predictedGpa: 0, skillData: [], cr: null, ct: null, yic: null };
        
        // Attendance Buffer (Minimum 75% rule)
        const totalClasses = 100; // Simulated
        const currentAttended = (studentData.attendance / 100) * totalClasses;
        const requiredFor75 = 0.75 * totalClasses;
        const buffer = Math.floor(currentAttended - requiredFor75);

        // Skill Radar Data
        const skillData = [
            { subject: formatSubjectName('Python'), A: 85, B: 110, fullMark: 150 },
            { subject: formatSubjectName('DS'), A: 70, B: 130, fullMark: 150 },
            { subject: formatSubjectName('CC'), A: 90, B: 130, fullMark: 150 },
            { subject: formatSubjectName('AI/ML'), A: 75, B: 100, fullMark: 150 },
            { subject: formatSubjectName('DBMS'), A: 80, B: 90, fullMark: 150 },
        ];

        const metrics = calculateAcademicMetrics(studentData.branch || 'CSM', studentData.semester || 7);

        // Resolve which source of truth to use for Metadata
        const semNum = studentData.semester % 2 === 0 ? 2 : 1;
        const publishedStoreStr = localStorage.getItem('published_timetables');
        const allTimetables = publishedStoreStr ? JSON.parse(publishedStoreStr) : null;
        const publishedKey = `${(studentData.branch || "").toUpperCase()}-${studentData.year}-${semNum}-${studentData.section}`;
        const publishedEntry = allTimetables ? allTimetables[publishedKey] : null;
        const liveMetadata = publishedEntry?.metadata || null;

        // Hierarchy Data: Prioritize published metadata, fallback to static mapping
        const cr = getSectionCR(studentData.branch, studentData.year, studentData.section);
        
        let ct = null;
        if (liveMetadata?.classTeacher) {
            ct = { name: liveMetadata.classTeacher, designation: "Class Teacher" };
        } else {
            const ctAssignment = CLASS_TEACHERS.find(ct => 
                ct.branch === studentData.branch && 
                ct.year === studentData.year && 
                ct.section === studentData.section
            );
            ct = ctAssignment ? MOCK_FACULTY.find(f => f.id === ctAssignment.facultyId) : null;
        }
        
        let yic = null;
        if (liveMetadata?.yearInCharge) {
            yic = { name: liveMetadata.yearInCharge, designation: "Year In-Charge" };
        } else {
            const yicAssignment = YEAR_IN_CHARGES.find(y => 
                y.branch === studentData.branch && 
                y.year === studentData.year
            );
            yic = yicAssignment ? MOCK_FACULTY.find(f => f.id === yicAssignment.facultyId) : null;
        }

        return { buffer, skillData, cr, ct, yic, ...metrics };
    }, [studentData]);

    const today = useMemo(() => format(new Date(), "EEEE"), []);

    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'published_timetables' || e.key === 'smartcampus_student_directory') {
                setStorageSyncStamp(s => s + 1);
            }
        };
        window.addEventListener('storage', handleStorage);
        // Fallback custom event for same-tab routing overrides
        const handleCustomEvent = () => setStorageSyncStamp(s => s + 1);
        window.addEventListener('timetable_published', handleCustomEvent);
        window.addEventListener('attendance_updated', handleCustomEvent);
        
        // --- REAL-TIME DB POLLING SYNC ---
        const syncWithBackend = async () => {
            if (!studentData) return;
            try {
                // Use the ORIGINAL mock attendance as the fixed historical baseline
                // to avoid double-counting sessions updated in the current reactive window
                const originalStudent = MOCK_STUDENTS.find(s => s.rollNumber === user.id);
                const basePct = originalStudent?.attendance || studentData.attendance || 0;
                
                const numericId = parseInt(studentData.id.replace(/\D/g, '')) || 0;
                const records = await attendanceService.getAttendance({ student_id: numericId });
                
                if (records && Array.isArray(records)) {
                    // Calculate real-time percentage
                    // Baseline is 240 classes for the semester historically
                    const baselineTotal = 240;
                    const baselineAttended = Math.round((basePct / 100) * baselineTotal);
                    
                    const dbTotal = records.length;
                    const dbAttended = records.filter((r: any) => r.status === 'Present').length;
                    
                    const total = baselineTotal + dbTotal;
                    const attended = baselineAttended + dbAttended;
                    const finalPct = Math.min(91, Math.round((attended / total) * 100));
                    
                    setLiveAttendancePct(finalPct);
                }
            } catch (err) {
                console.error("Dashboard DB Sync Error:", err);
            }
        };

        syncWithBackend();
        const pollInterval = setInterval(syncWithBackend, 10000); // 10s for better real-time feel

        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('timetable_published', handleCustomEvent);
            window.removeEventListener('attendance_updated', handleCustomEvent);
            clearInterval(pollInterval);
        };
    }, [studentData, storageSyncStamp]);

    const todaySchedule = useMemo(() => {
        if (!studentData) return [];
        
        const semNum = studentData.semester % 2 === 0 ? 2 : 1;
        
        // Resolve which source of truth to use
        const publishedStoreStr = localStorage.getItem('published_timetables');
        const allTimetables = publishedStoreStr ? JSON.parse(publishedStoreStr) : null;
        const strictPublishedKey = `${(studentData.branch || "").toUpperCase()}-${studentData.year}-${semNum}-${studentData.section}`;
        
        let publishedEntry = allTimetables ? allTimetables[strictPublishedKey] : null;

        if (!publishedEntry && allTimetables) {
            const altSemNum = semNum === 1 ? 2 : 1;
            const altKey = `${(studentData.branch || "").toUpperCase()}-${studentData.year}-${altSemNum}-${studentData.section}`;
            if (allTimetables[altKey]) {
                publishedEntry = allTimetables[altKey];
            }
        }

        const useDemoData = publishedStoreStr === null;
        const liveTable = publishedEntry?.grid || 
                          (publishedEntry && !publishedEntry.metadata ? publishedEntry : {});
        
        // Load Live Replacements / Swaps for TODAY
        const savedRequests = localStorage.getItem('FACULTY_REQUESTS');
        const todayISO = format(new Date(), 'yyyy-MM-dd');
        const approvedReplacements = savedRequests ? JSON.parse(savedRequests).filter((r: any) => 
            r.status === 'approved' && 
            r.date === todayISO && 
            (r.type === 'replacement' || r.type === 'swap')
        ) : [];

        const schedule: any[] = [];
        Object.entries(liveTable).forEach(([dayTime, session]: [string, any]) => {
            if (!session) return;
            let [day, time] = dayTime.split('-');
            const timeMap: Record<string, string> = { "09:30": "09:40", "10:30": "10:40", "11:40": "11:40", "01:30": "01:20", "02:30": "02:20", "03:30": "03:20" };
            const normalizedTime = time;
            time = timeMap[time] || time;
            if (day !== today) return;

            // Check if this specific session has an override for TODAY & SECTION
            const override = approvedReplacements.find((r: any) => {
                const sameSlot = r.period === normalizedTime && r.section === strictPublishedKey;
                const matchesOriginalFaculty = r.senderId === session.facultyId || 
                                              (session.faculty && r.senderName && session.faculty.toLowerCase().includes(r.senderName.toLowerCase()));
                return sameSlot && matchesOriginalFaculty;
            });

            const hour = parseInt(time.split(':')[0]);
            const ampm = (hour >= 9 && hour < 12) ? "AM" : "PM";

            schedule.push({
                time: `${time} ${ampm}`,
                rawTime: time,
                title: formatSubjectName(session.courseName || session.courseCode),
                room: session.room || "TBD",
                faculty: override ? override.targetName : (session.faculty || "Staff"),
                isReplacement: !!override,
                type: (session.courseName || session.courseCode || "").toLowerCase().includes('lab') ? 'lab' : 'lecture'
            });
        });

        return schedule.sort((a, b) => {
            const getMinutes = (timeStr: string) => {
                const [time, period] = timeStr.split(' ');
                let [hours, minutes] = time.split(':').map(Number);
                if (period === 'PM' && hours !== 12) hours += 12;
                if (period === 'AM' && hours === 12) hours = 0;
                return hours * 60 + minutes;
            };
            return getMinutes(a.time) - getMinutes(b.time);
        });
    }, [studentData, today, storageSyncStamp]);

    const activeExamToday = useMemo(() => {
        if (!studentData) return null;
        const examTimetablesStr = localStorage.getItem('EXAM_TIMETABLES');
        const examSeatingStr = localStorage.getItem('EXAM_SEATING_PLAN');
        if (!examTimetablesStr) return null;

        const allTT = JSON.parse(examTimetablesStr) as any[];
        const todayStr = format(new Date(), "yyyy-MM-dd");
        
        // Find if any published exam is for today and for this student's year
        const todayExamTT = allTT.find(tt => 
            tt.isPublished && 
            tt.years.includes(studentData.year) &&
            tt.slots.some((s: any) => s.date === todayStr)
        );

        if (!todayExamTT) return null;

        const slot = todayExamTT.slots.find((s: any) => s.date === todayStr);
        const seating = examSeatingStr ? (JSON.parse(examSeatingStr) as any[]).find(s => s.examId.includes(todayExamTT.id) && s.rollNumber.toUpperCase() === user.id.toUpperCase()) : null;

        return {
            title: todayExamTT.title,
            type: todayExamTT.type,
            time: `${slot.startTime} - ${slot.endTime}`,
            slot: slot.session,
            room: seating?.room || "Check Seating Plan",
            block: seating?.block || "TBD",
            seat: seating?.seatNumber || "TBD"
        };
    }, [studentData, user.id, storageSyncStamp]);


    const stats = [
        { 
            title: "Attendance", 
            value: `${liveAttendancePct !== null ? liveAttendancePct : (Math.min(studentData?.attendance || 0, 91))}%`, 
            icon: CheckCircle2, 
            color: "text-emerald-500", 
            detail: "Safe to bunk: " + (academicMetrics as any).buffer + " slots",
            isLive: liveAttendancePct !== null,
            link: "/dashboard/attendance"
        },
        { title: "Current GPA", value: studentData?.grade?.toFixed(2) || "0.0", icon: TrendingUp, color: "text-violet-500", detail: "Top 5% in Branch" },
        { title: "Credits Earned", value: `${(academicMetrics as any).earnedCredits}/${(academicMetrics as any).totalCredits}`, icon: Award, color: "text-blue-500", detail: `${(academicMetrics as any).totalCredits - (academicMetrics as any).earnedCredits} more for Graduation` },
        { title: "Assignments", value: "4 Due", icon: Clock, color: "text-amber-500", detail: "Next: OS Lab - 2 days" },
    ];

    const handleAction = async (title: string) => {
        toast.info(`Launching ${title}...`, {
            description: "Redirecting to requested operational module."
        });
        
        // Example: Log analytics event or check for new alerts on action
        if (title === 'Notifications') {
            await notificationService.getNotifications();
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in-50 duration-700 pb-20">
            {/* 1. Welcome & Profile Summary Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-700 rounded-[2rem] p-8 text-white shadow-2xl flex flex-col justify-between min-h-[280px]"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 pointer-events-none">
                        <Star className="w-64 h-64" />
                    </div>
                    <div>
                        {isImpersonating && (
                            <div className="bg-amber-400 text-black text-[10px] font-black uppercase tracking-[0.2em] mb-4 py-1 px-3 rounded-full border border-white/20 w-fit flex items-center gap-2">
                                <ShieldCheck className="w-3 h-3" /> Admin Viewing Mode
                            </div>
                        )}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-14 w-14 rounded-full border-2 border-white/30 p-1 backdrop-blur-md">
                                <div className="h-full w-full rounded-full bg-white/20 flex items-center justify-center font-bold text-xl">
                                    {user.name.charAt(0)}
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-black tracking-tight leading-tight">
                                    {isImpersonating ? `Profile: ${user.name}` : `Welcome back, ${user.name.split(' ')[0]}!`}
                                </h1>
                                <p className="text-indigo-100/80 font-medium">Roll No: <span className="text-white">{studentData?.rollNumber}</span></p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {[
                                `B.Tech ${studentData?.year ? (studentData.year === 1 ? 'I' : studentData.year === 2 ? 'II' : studentData.year === 3 ? 'III' : 'IV') : 'IV'} Year`,
                                `Semester ${(studentData?.year || 4) * 2 - 1}`,
                                studentData?.branch || 'CSE',
                                `Section ${studentData?.section || 'A'}`
                            ].map((tag) => (
                                <Badge key={tag} className="bg-white/10 hover:bg-white/20 text-white border-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[10px]">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <div className="mt-8 flex gap-4">
                        <Button variant="ghost" className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-xl px-6 font-bold transition-all hover:scale-105 active:scale-95 shadow-none">
                            <Linkedin className="w-4 h-4 mr-2" /> Share Success
                        </Button>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-[2rem] p-8 shadow-xl flex flex-col justify-between"
                >
                    <div className="flex justify-between items-start">
                        <div className="bg-amber-500/10 p-3 rounded-2xl">
                            <Zap className="w-6 h-6 text-amber-600" />
                        </div>
                        <Badge variant="outline" className="bg-emerald-500/5 text-emerald-600 border-emerald-500/20">Active Session</Badge>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-black text-foreground/90 leading-tight">AI Study Planner</h3>
                        <p className="text-sm text-muted-foreground">Next 48h: Focus on <strong>{formatSubjectName('CNS')}</strong>. You have a mid-term in 6 days.</p>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                <span>Prep Progress</span>
                                <span>65%</span>
                            </div>
                            <Progress value={65} className="h-1.5" />
                        </div>
                    </div>
                    <Button variant="ghost" className="w-full mt-6 justify-between group hover:bg-primary/5">
                        Start Focus Session <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </motion.div>
            </div>

            {/* 2. Professional Stats Feed */}
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.1, delayChildren: 0.3 }
                    }
                }}
            >
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.title}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        onClick={() => (stat as any).link && navigate((stat as any).link)}
                        className={(stat as any).link ? "cursor-pointer" : ""}
                    >
                        <Card className={`border-none shadow-premium hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden group relative ${(stat as any).link ? 'hover:scale-[1.02] hover:ring-2 ring-primary/20' : ''}`}>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{stat.title}</p>
                                            {(stat as any).isLive && (
                                                <Badge className="bg-emerald-500/10 text-emerald-600 text-[8px] font-black h-4 px-1 border-none flex gap-1 items-center">
                                                    <span className="h-1 w-1 rounded-full bg-emerald-600 animate-pulse" /> LIVE
                                                </Badge>
                                            )}
                                        </div>
                                        <h4 className={`text-3xl font-black tracking-tighter transition-all duration-500 ${(stat as any).isLive ? 'text-emerald-600 animate-in zoom-in-95' : ''}`}>
                                            {stat.value}
                                        </h4>
                                    </div>
                                    <div className={`p-3 rounded-2xl ${stat.color} bg-current opacity-10 group-hover:opacity-20 transition-opacity`} />
                                    <stat.icon className={`w-6 h-6 ${stat.color} absolute top-6 right-6`} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-medium text-muted-foreground/80 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {stat.detail}
                                    </p>
                                    {(stat as any).link && (
                                        <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0" />
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* 3. Main Dashboard Layout - Two Column */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Side: Academic Monitoring */}
                <div className="lg:col-span-8 space-y-8">
                    {activeExamToday && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="relative group"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <Card className="relative border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-950 border-l-[6px] border-l-red-500">
                                <CardContent className="p-0">
                                    <div className="bg-red-500/5 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div className="flex gap-5 items-center">
                                            <div className="h-16 w-16 rounded-[1.5rem] bg-red-500/20 flex items-center justify-center shrink-0">
                                                <ShieldCheck className="h-8 w-8 text-red-600 animate-pulse" />
                                            </div>
                                            <div className="space-y-1">
                                                <Badge className="bg-red-600 text-white border-none text-[8px] font-black uppercase tracking-[0.2em] px-3">{activeExamToday.type} ACTIVE</Badge>
                                                <h3 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
                                                    {activeExamToday.title}
                                                </h3>
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Clock className="h-4 w-4" /> {activeExamToday.time} ({activeExamToday.slot === 'FN' ? 'Forenoon' : 'Afternoon'})
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-red-500/10 shadow-sm min-w-[150px]">
                                            <span className="text-[10px] font-black text-red-600 uppercase tracking-tighter">Your Location</span>
                                            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Hall {activeExamToday.room}</div>
                                            <Badge variant="outline" className="border-red-200 text-red-600 font-bold bg-red-50/50">Seat: {activeExamToday.seat}</Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Today's Schedule (NEW) */}
                    <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden">
                        <CardHeader className="bg-slate-50 dark:bg-slate-900/50">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-xl font-black flex items-center gap-2">
                                        <CalendarDays className="w-5 h-5 text-primary" /> Today's Schedule
                                    </CardTitle>
                                    <CardDescription className="text-xs font-bold uppercase tracking-widest">{today}, {format(new Date(), "do MMMM")}</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" className="text-primary font-bold gap-1" onClick={() => navigate('/dashboard/timetable')}>
                                    Full Timetable <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {todaySchedule.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {todaySchedule.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-border/50 hover:border-primary/20 transition-all group">
                                            <div className="flex flex-col items-center justify-center min-w-[70px] py-2 bg-background rounded-xl border border-border/50 shadow-sm">
                                                <span className="text-[10px] font-black text-muted-foreground uppercase">{item.time.split(' ')[1]}</span>
                                                <span className="text-base font-black text-primary leading-none mt-1">{item.time.split(' ')[0]}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h5 className="font-black text-sm truncate group-hover:text-primary transition-colors">{item.title}</h5>
                                                    <Badge variant="outline" className={`text-[8px] font-black uppercase px-1.5 h-4 ${item.type === 'lab' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-primary/5 text-primary border-primary/20'}`}>
                                                        {item.type}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-[11px] font-bold text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <User className="w-3 h-3 opacity-50" />
                                                        <span className={`truncate max-w-[100px] ${item.isReplacement ? 'text-accent font-black' : ''}`}>
                                                            {item.faculty}
                                                        </span>
                                                        {item.isReplacement && (
                                                            <Badge variant="outline" className="text-[7px] font-black bg-accent/10 border-accent/20 text-accent px-1 h-3 ml-1 animate-pulse">
                                                                SUBSTITUTE
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Building2 className="w-3 h-3 opacity-50" />
                                                        <span>{item.room}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 opacity-50">
                                    <Calendar className="w-12 h-12 text-muted-foreground" />
                                    <p className="font-bold text-sm">No classes scheduled for today.</p>
                                    <p className="text-[10px] uppercase tracking-widest">Enjoy your holiday or self-study time!</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Grade Matrix Card */}

                    {/* Operational Tasks Hub */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-none shadow-xl rounded-[2rem] bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden relative group">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <CreditCard className="w-6 h-6" /> Online Fee Payment
                                </CardTitle>
                                <CardDescription className="text-blue-100">Semester 8 Fee: <span className="font-bold text-white">₹42,500</span></CardDescription>
                            </CardHeader>
                            <CardContent className="relative z-10 flex justify-between items-center">
                                <Button className="bg-white text-blue-700 font-bold hover:bg-blue-50 rounded-xl" onClick={() => navigate('/dashboard/student/fees/regular')}>
                                    Pay Now
                                </Button>
                                <div className="text-[10px] text-blue-200 uppercase tracking-widest font-black text-right">
                                    Due in 14 Days<br/>Penalty: 0
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-xl rounded-[2rem] bg-card overflow-hidden">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Download className="w-6 h-6 text-primary" /> Downloads Hub
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {[
                                    { name: 'Semester 7 Hall Ticket', icon: Award },
                                    { name: 'Course Materials - ML', icon: BookOpen },
                                ].map((item) => (
                                    <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-all cursor-pointer group" onClick={() => handleAction('Download')}>
                                        <div className="flex items-center gap-3">
                                            <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                            <span className="text-sm font-bold">{item.name}</span>
                                        </div>
                                        <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Section Leadership & Hierarchy (New Requirement) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-none shadow-lg rounded-3xl bg-card/60 backdrop-blur-md border border-border/20 overflow-hidden">
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <User className="w-3 h-3" /> Class Representative
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">CR</div>
                                    <div>
                                        <p className="text-sm font-bold leading-none">{(academicMetrics as any).cr?.name || "Unassigned"}</p>
                                        <p className="text-[10px] text-muted-foreground mt-1">{(academicMetrics as any).cr?.rollNumber}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg rounded-3xl bg-card/60 backdrop-blur-md border border-border/20 overflow-hidden">
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Class Teacher
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-xs font-bold text-emerald-600">CT</div>
                                    <div>
                                        <p className="text-sm font-bold leading-none">{(academicMetrics as any).ct?.name || "Unassigned"}</p>
                                        <p className="text-[10px] text-muted-foreground mt-1">{(academicMetrics as any).ct?.designation || "Faculty"}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg rounded-3xl bg-card/60 backdrop-blur-md border border-border/20 overflow-hidden">
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <ShieldCheck className="w-3 h-3 text-violet-500" /> Year In-Charge
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-violet-500/10 flex items-center justify-center text-xs font-bold text-violet-600">YI</div>
                                    <div>
                                        <p className="text-sm font-bold leading-none">{(academicMetrics as any).yic?.name || "Unassigned"}</p>
                                        <p className="text-[10px] text-muted-foreground mt-1">Year Head</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Attendance Buffer & Academic Monitoring */}
                    <AttendanceHistory 
                        studentId={user.id} 
                        rollNumber={studentData?.rollNumber || ''} 
                    />
                </div>

                {/* Right Side: Advanced Professional Suite */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Contact Details Section (Moved from Profile) */}
                    <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden">
                        <CardHeader className="bg-muted/30 border-b py-5">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                Contact Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            {[
                                { label: "Institutional Email", value: studentData?.email || `${studentData?.rollNumber.toLowerCase()}@smartcampus.edu`, icon: Mail },
                                { label: "Emergency Phone", value: studentData?.phone || "+91 88888 88888", icon: Smartphone },
                                { label: "Reporting To", value: "HOD (AIML)", icon: Users },
                            ].map((info, i) => (
                                <div key={i} className="flex items-center gap-4 group/item">
                                    <div className="p-2.5 rounded-xl bg-muted text-muted-foreground group-hover/item:bg-primary/10 group-hover/item:text-primary transition-colors">
                                        <info.icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{info.label}</span>
                                        <span className="text-sm font-semibold break-all leading-tight">{info.value}</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Predictive Tools */}
                    <Card className="border-none shadow-xl rounded-[2rem]">
                        <CardHeader>
                            <CardTitle className="text-lg font-black flex items-center gap-2">
                                <Calculator className="w-5 h-5 text-indigo-500" /> GPA What-If Analysis
                            </CardTitle>
                            <CardDescription>Predict your new CGPA by targeting specific grades.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50">
                                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-2 uppercase tracking-tighter">Enter Target Grades</p>
                                <div className="flex gap-2">
                                    <input 
                                        type="number" 
                                        placeholder="Target Sem GPA" 
                                        className="bg-transparent border-b border-indigo-300 w-full text-lg font-black focus:outline-none placeholder:text-indigo-300"
                                        value={gpaWhatIf}
                                        onChange={(e) => setGpaWhatIf(e.target.value)}
                                    />
                                    <Button size="sm" className="bg-indigo-600 rounded-lg h-10 px-4">Recalculate</Button>
                                </div>
                                <div className="mt-4 pt-4 border-t border-indigo-100 dark:border-indigo-900/50 flex justify-between items-end">
                                    <div className="text-xs font-bold text-muted-foreground">Predicted CGPA</div>
                                    <div className="text-2xl font-black text-indigo-600">{gpaWhatIf ? (parseFloat(gpaWhatIf as string) * 0.2 + (studentData?.grade || 0) * 0.8).toFixed(2) : '--'}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Skill Progress Radar Graph */}
                    <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-lg font-black flex items-center gap-2">
                                <LineChart className="w-5 h-5 text-emerald-500" /> Real-World Skills
                            </CardTitle>
                            <CardDescription>Curriculum alignment to job-market skills.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={academicMetrics.skillData}>
                                        <PolarGrid stroke="#e2e8f0" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 700 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                        <Radar name="Skills" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Personal Portfolio Card */}
                    <Card className="border-none shadow-xl rounded-[2rem] bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden group">
                        <CardHeader>
                            <CardTitle className="text-lg font-black text-white flex items-center gap-2">
                                <UserPlus className="w-5 h-5 text-emerald-400" /> Professional Portfolio
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex gap-3">
                                <div 
                                    className="p-3 bg-white/10 rounded-2xl flex-1 flex items-center justify-center hover:bg-white/20 cursor-pointer transition-all border border-white/5" 
                                    onClick={() => window.open(`https://github.com`, '_blank')}
                                >
                                    <Github className="w-5 h-5" />
                                </div>
                                <div 
                                    className="p-3 bg-[#0a66c2]/10 rounded-2xl flex-1 flex items-center justify-center hover:bg-[#0a66c2]/20 cursor-pointer transition-all border border-[#0a66c2]/20" 
                                    onClick={() => window.open(`https://linkedin.com`, '_blank')}
                                >
                                    <Linkedin className="w-5 h-5 text-[#0a66c2]" />
                                </div>
                            </div>
                            <div 
                                className="bg-white p-4 rounded-2xl flex justify-between items-center group/btn cursor-pointer hover:bg-slate-100 transition-colors" 
                                onClick={() => window.open(`https://smartcampus.edu/portfolio/${studentData?.rollNumber.toLowerCase() || 'student'}`, '_blank')}
                            >
                                <span className="text-black font-black uppercase text-xs tracking-tighter">View Public Profile</span>
                                <ChevronRight className="w-4 h-4 text-black group-hover/btn:translate-x-1 transition-transform" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Exam Seating Alert (Real-time integration) */}
                    {(() => {
                        const seatingStr = localStorage.getItem('EXAM_SEATING_PLAN');
                        if (seatingStr) {
                            const seating = JSON.parse(seatingStr);
                            const mySeat = seating.find((s: any) => s.rollNumber.toUpperCase() === studentData?.rollNumber.toUpperCase());
                            if (mySeat) {
                                return (
                                    <Card className="border-2 border-primary/20 shadow-xl rounded-[2rem] bg-primary/5 overflow-hidden animate-in zoom-in-95 duration-500">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg font-black flex items-center gap-2 text-primary">
                                                <ShieldCheck className="w-5 h-5" /> Active Exam Allocation
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-background/80 rounded-2xl border border-primary/10">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Hall / Block</p>
                                                    <p className="text-xl font-black">{mySeat.room}</p>
                                                    <p className="text-xs font-bold text-muted-foreground">{mySeat.block}</p>
                                                </div>
                                                <div className="bg-primary text-white h-14 w-14 rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-primary/30">
                                                    <span className="text-[10px] font-black uppercase">Seat</span>
                                                    <span className="text-xl font-bold">{mySeat.seatNumber}</span>
                                                </div>
                                            </div>
                                            
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" className="w-full font-bold border-primary/20 hover:bg-primary/5 text-primary">
                                                        View Hall Seating Chart
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-md rounded-[2rem]">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-xl font-black">Hall {mySeat.room} Seating List</DialogTitle>
                                                        <DialogDescription className="font-bold text-[10px] uppercase tracking-widest">Institutional roll numbers assigned to this hall</DialogDescription>
                                                    </DialogHeader>
                                                    <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                                        <div className="grid grid-cols-2 gap-2 mt-4">
                                                            {seating.filter((s: any) => s.room === mySeat.room).map((other: any) => (
                                                                <div key={other.rollNumber} className={`p-3 rounded-xl border ${other.rollNumber === studentData?.rollNumber ? 'bg-primary/10 border-primary text-primary' : 'bg-muted/30 border-border/50'} flex justify-between items-center`}>
                                                                    <span className="text-xs font-mono font-black">{other.rollNumber}</span>
                                                                    <span className="text-[9px] font-black uppercase opacity-60 text-right">{other.seatNumber}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </CardContent>
                                    </Card>
                                );
                            }
                        }
                        return (
                            <Card className="border-none shadow-xl rounded-[2rem]">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg font-black flex items-center gap-2">
                                        <Bell className="w-5 h-5 text-rose-500" /> Smart Alerts
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[
                                        { title: 'Exam Registration', time: '2h ago', detail: 'Regular fee portal is closing in 48h.', type: 'urgent' },
                                        { title: 'New Lab Suggestion', time: '5h ago', detail: 'Prof. Anitha uploaded ML project code.', type: 'info' },
                                    ].map((note) => (
                                        <div key={note.title} className="flex gap-4 p-4 rounded-2xl bg-muted/20 hover:bg-muted/40 transition-colors">
                                            <div className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${note.type === 'urgent' ? 'bg-rose-500 animate-pulse' : 'bg-blue-500'}`} />
                                            <div className="space-y-1">
                                                <div className="flex justify-between items-center gap-4">
                                                    <h5 className="text-sm font-black text-foreground/90">{note.title}</h5>
                                                    <span className="text-[10px] font-bold text-muted-foreground">{note.time}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground leading-relaxed">{note.detail}</p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        );
                    })()}
                </div>

            </div>

        </div>
    );
}

