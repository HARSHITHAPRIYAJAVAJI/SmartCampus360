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
    Zap, Calculator, UserPlus, AlertCircle, Download, CreditCard, ShieldCheck, Info,
    MessageSquare, X, Send, Bot, User, Minimize2, Maximize2, Sparkles, BrainCircuit, Building2,
    Inbox, Mail, Smartphone, MapPin, Globe, Briefcase, FileText, UserCircle, GraduationCap, Users
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
import { getTimetable, FACULTY_LOAD } from "@/data/aimlTimetable";
import { useNotifications } from "@/hooks/useNotifications";
import { academicService } from "@/services/academicService";

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

    const { notifications, unreadCount, markAsRead } = useNotifications(user);

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
            if (e.key === 'published_timetables' || e.key === 'smartcampus_student_directory' || e.key === 'smartcampus_attendance_cache') {
                setStorageSyncStamp(s => s + 1);
            }
        };
        window.addEventListener('storage', handleStorage);
        
        // Listen for real-time broadcasts
        const unsubscribe = attendanceService.onUpdate(() => {
            setStorageSyncStamp(s => s + 1);
            syncWithBackend(); 
        });

        // Fallback custom event for same-tab routing overrides
        const handleCustomEvent = () => {
            setStorageSyncStamp(s => s + 1);
            syncWithBackend(); // Force immediate update
        };
        window.addEventListener('timetable_published', handleCustomEvent);
        
        // --- REAL-TIME DB POLLING SYNC ---
        const syncWithBackend = async () => {
            if (!studentData) return;
            try {
                // Use the ORIGINAL mock attendance as the fixed historical baseline
                // to avoid double-counting sessions updated in the current reactive window
                const originalStudent = MOCK_STUDENTS.find(s => s.rollNumber.toUpperCase() === user.id.toUpperCase());
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
            unsubscribe();
            clearInterval(pollInterval);
        };
    }, [studentData, storageSyncStamp]);

    const todaySchedule = useMemo(() => {
        if (!studentData) return [];
        
        const semNum = studentData.semester % 2 === 0 ? 2 : 1;
        const strictPublishedKey = `${(studentData.branch || "").toUpperCase()}-${studentData.year}-${semNum}-${studentData.section}`;
        
        // Resolve which source of truth to use
        const publishedStoreStr = localStorage.getItem('published_timetables');
        const allTimetables = publishedStoreStr ? JSON.parse(publishedStoreStr) : null;
        let publishedEntry = allTimetables ? allTimetables[strictPublishedKey] : null;

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

        // Faculty Load fallback (same as Timetable.tsx)
        const facultyLoadKey = `${studentData.branch}-${studentData.year}-${semNum}`;
        const genericLoadKey = `${studentData.year}-${semNum}`;
        const currentLoad = (FACULTY_LOAD[facultyLoadKey as keyof typeof FACULTY_LOAD] || 
                           FACULTY_LOAD[genericLoadKey as keyof typeof FACULTY_LOAD]) as any[];

        const schedule: any[] = [];
        Object.entries(liveTable).forEach(([dayTime, session]: [string, any]) => {
            if (!session) return;
            const [day, time] = dayTime.split('-');
            if (day !== today) return;

            // Find subject match in load for faculty fallback
            const loadInfo = currentLoad?.find(l => l.code === session.courseCode);

            // Check if this specific session has an override for TODAY & SECTION
            const override = approvedReplacements.find((r: any) => {
                const rDate = new Date(r.date);
                const rDayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][rDate.getDay()];
                const rStartTime = r.period?.split('-')[0];
                
                const isSlotMatch = rDayName === today && (r.period === time || rStartTime === time);
                const isSectionMatch = r.section === strictPublishedKey;
                
                return isSlotMatch && isSectionMatch;
            });

            const hour = parseInt(time.split(':')[0]);
            const ampm = (hour >= 9 && hour < 12) ? "AM" : "PM";

            schedule.push({
                time: `${time} ${ampm}`,
                rawTime: time,
                title: formatSubjectName(session.courseName || session.courseCode),
                room: session.room || loadInfo?.room || "TBD",
                faculty: override ? override.targetName : (session.faculty || loadInfo?.faculty || "Staff"),
                isReplacement: !!override,
                type: (session.courseName || session.courseCode || "").toLowerCase().includes('crt') ? 'crt' : 
                      (session.courseName || session.courseCode || "").toLowerCase().includes('lab') ? 'lab' : 'lecture'
            });
        });

        // Add sorting by time to ensure it matches Timetable view order
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
        
        // Find if any published exam is for today and for this student's year and contains credit-bearing subjects
        const todayExamTT = allTT.find(tt => 
            tt.isPublished && 
            tt.years.includes(studentData.year) &&
            tt.slots.some((s: any) => {
                if (s.date !== todayStr) return false;
                const relevantSubjects = s.subjects.filter((sub: any) => 
                    (sub.branch === studentData.branch && sub.year === studentData.year)
                );
                return relevantSubjects.some((sub: any) => {
                    const course = MOCK_COURSES.find(c => c.code === sub.courseCode);
                    return course ? course.credits > 0 : true;
                });
            })
        );

        if (!todayExamTT) return null;

        const slot = todayExamTT.slots.find((s: any) => s.date === todayStr);
        const seating = examSeatingStr ? (JSON.parse(examSeatingStr) as any[]).find(s => s.examId.includes(todayExamTT.id) && s.rollNumber.toUpperCase() === user.id.toUpperCase()) : null;

        const format12Hour = (timeStr: string) => {
            if (!timeStr) return '';
            const [hoursStr, minutesStr] = timeStr.replace(/\s*(AM|PM)\s*/i, '').split(':');
            let hours = parseInt(hoursStr, 10);
            if (isNaN(hours)) return timeStr;
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            return `${hours.toString().padStart(2, '0')}:${minutesStr || '00'} ${ampm}`;
        };

        return {
            title: todayExamTT.title,
            type: todayExamTT.type,
            time: `${format12Hour(slot.startTime)} - ${format12Hour(slot.endTime)}`,
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
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-3 relative overflow-hidden bg-gradient-to-br from-[#4F46E5] via-[#8B5CF6] to-[#DB2777] rounded-[2.5rem] p-10 text-white shadow-[0_20px_50px_rgba(139,92,246,0.3)] flex flex-col justify-between min-h-[300px]"
                >
                    {/* Floating Decorative Elements */}
                    <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 pointer-events-none translate-x-1/4 -translate-y-1/4">
                        <Star className="w-80 h-80" />
                    </div>
                    <div className="absolute bottom-0 left-0 p-4 opacity-5 pointer-events-none -translate-x-1/4 translate-y-1/4">
                    <Sparkles className="w-64 h-64" />
                    </div>

                    <div className="relative z-10">
                        {isImpersonating && (
                            <div className="bg-amber-400 text-black text-[10px] font-black uppercase tracking-[0.2em] mb-6 py-1.5 px-4 rounded-full border border-white/20 w-fit flex items-center gap-2 shadow-lg">
                                <ShieldCheck className="w-3.5 h-3.5" /> Admin Viewing Mode
                            </div>
                        )}
                        
                        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                            <div className="relative">
                                <div className="h-20 w-20 rounded-full border-2 border-white/30 p-1 backdrop-blur-xl shadow-2xl">
                                    <div className="h-full w-full rounded-full bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center font-black text-3xl shadow-inner">
                                        {user.name.charAt(0)}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
                                    {isImpersonating ? `Profile: ${user.name}` : `Welcome back, ${user.name.split(' ')[0]}!`}
                                </h1>
                                <div className="flex items-center gap-2 text-white/70 font-bold tracking-tight">
                                    <div className="h-1 w-1 rounded-full bg-white/40" />
                                    <p>Roll No: <span className="text-white font-black">{studentData?.rollNumber}</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2.5">
                            {[
                                `B.Tech ${studentData?.year ? (studentData.year === 1 ? 'I' : studentData.year === 2 ? 'II' : studentData.year === 3 ? 'III' : 'IV') : 'IV'} Year`,
                                `Semester ${(studentData?.year || 4) * 2 - 1}`,
                                studentData?.branch || 'CSE',
                                `Section ${studentData?.section || 'A'}`
                            ].map((tag) => (
                                <Badge key={tag} className="bg-white/15 hover:bg-white/25 text-white border-white/10 backdrop-blur-3xl px-5 py-2 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:scale-105">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-end">
                        <div className="hidden md:flex items-center gap-4 text-white/50 text-xs font-black uppercase tracking-widest">
                            <div className="flex items-center gap-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                Verified Profile
                            </div>
                        </div>
                    </div>
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

                    {/* Academic Portfolio: Subject-wise Performance */}
                    <Card className="border-none shadow-premium rounded-[2.5rem] overflow-hidden bg-white/50 dark:bg-slate-900/50 border border-white/20">
                        <CardHeader className="p-8 pb-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-2xl font-black tracking-tighter flex items-center gap-3">
                                        <BookOpen className="w-6 h-6 text-primary" />
                                        Academic Portfolio
                                    </CardTitle>
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mt-1">INTERNAL ASSESSMENTS - SEMESTER {studentData?.semester}</p>
                                </div>
                                <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black px-4 py-1.5 h-8">
                                    CURRENT SEMESTER
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border/50">
                                            <th className="py-4 text-left text-[10px] font-black uppercase text-muted-foreground tracking-widest">Course Title</th>
                                            <th className="py-4 text-center text-[10px] font-black uppercase text-muted-foreground tracking-widest w-24">Code</th>
                                            <th className="py-4 text-center text-[10px] font-black uppercase text-muted-foreground tracking-widest w-20">Assgn 1</th>
                                            <th className="py-4 text-center text-[10px] font-black uppercase text-muted-foreground tracking-widest w-20">Mid 1</th>
                                            <th className="py-4 text-center text-[10px] font-black uppercase text-muted-foreground tracking-widest w-20">Assgn 2</th>
                                            <th className="py-4 text-center text-[10px] font-black uppercase text-muted-foreground tracking-widest w-20">Mid 2</th>
                                            <th className="py-4 text-right text-[10px] font-black uppercase text-green-600 tracking-widest w-24">Total (40)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/30 text-slate-800 dark:text-slate-200">
                                        {MOCK_COURSES.filter(c => c.department === (studentData?.branch || 'CSM') && c.semester === (studentData?.semester || 1)).map((c) => {
                                            const realMarks = academicService.getMarks(studentData?.id || '', c.code);
                                            const dummy = academicService.getGeneratedMarks(studentData?.id || '', c.code, c.name, c.type === 'Lab', false, c.credits, true);
                                            
                                            const m = {
                                                assignment1: realMarks?.assignment1 ?? dummy.assignment1 ?? 0,
                                                mid1: realMarks?.mid1 ?? dummy.mid1 ?? 0,
                                                assignment2: realMarks?.assignment2 ?? dummy.assignment2 ?? 0,
                                                mid2: realMarks?.mid2 ?? dummy.mid2 ?? 0,
                                            };
                                            
                                            const total = (Math.max(m.mid1, m.mid2) + m.assignment1 + m.assignment2);

                                            return (
                                                <tr key={c.id} className="group hover:bg-primary/5 transition-colors">
                                                    <td className="py-4">
                                                        <div className="text-xs font-black group-hover:text-primary transition-colors">{c.name}</div>
                                                        <div className="text-[10px] text-muted-foreground font-bold">{c.type} • {c.credits} Credits</div>
                                                    </td>
                                                    <td className="py-4 text-center font-bold text-[10px] text-muted-foreground">{c.code}</td>
                                                    <td className="py-4 text-center text-xs font-black">{m.assignment1}</td>
                                                    <td className="py-4 text-center text-xs font-black">{m.mid1}</td>
                                                    <td className="py-4 text-center text-xs font-black">{m.assignment2}</td>
                                                    <td className="py-4 text-center text-xs font-black">{m.mid2}</td>
                                                    <td className="py-4 text-right">
                                                        <span className="text-sm font-black text-green-600">{total}</span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

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
                    {/* Exam Seating Alert (Real-time integration) */}
                    {(() => {
                        const seatingStr = localStorage.getItem('EXAM_SEATING_PLAN');
                        const examScheduleStr = localStorage.getItem('EXAM_SCHEDULE');
                        if (!seatingStr || !examScheduleStr) return null;

                        const seating = JSON.parse(seatingStr);
                        const schedule = JSON.parse(examScheduleStr);
                        const todayISO = format(new Date(), 'yyyy-MM-dd');
                        
                        // Find exams scheduled for TODAY
                        const todaysExams = schedule.filter((e: any) => e.date === todayISO).map((e: any) => e.id);
                        
                        // Find the seat for this student that matches today's exam(s)
                        const mySeat = seating.find((s: any) => 
                            s.rollNumber.toUpperCase() === (studentData?.rollNumber || "").toUpperCase() &&
                            todaysExams.includes(s.examId)
                        );
                        
                        // Use top 3 relevant notifications
                        const displayAlerts = notifications.slice(0, 3);

                        return (
                            <div className="space-y-6">
                                {mySeat && (
                                    <div className="relative group">
                                         <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-[2.5rem] blur opacity-10 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                                        <Card className="relative border-2 border-primary/20 shadow-xl rounded-[2rem] bg-primary/5 overflow-hidden animate-in zoom-in-95 duration-500">
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
                                                        <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar mt-4">
                                                            {/* Your Seat Highlight */}
                                                            <div className="mb-6 p-4 rounded-2xl bg-primary text-white shadow-lg shadow-primary/30">
                                                                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Your Assignment</p>
                                                                <div className="flex justify-between items-end">
                                                                    <div>
                                                                        <h4 className="text-xl font-black">{studentData?.rollNumber}</h4>
                                                                        <p className="text-xs font-bold opacity-90">{studentData?.name}</p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <span className="text-3xl font-black">{mySeat.seatNumber}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest border-b pb-2">Full Room List (Hall {mySeat.room})</h4>
                                                                <div className="grid grid-cols-2 gap-2 mt-4">
                                                                    {seating.filter((s: any) => s.room === mySeat.room && s.examId === mySeat.examId).map((other: any) => (
                                                                        <div key={other.rollNumber} className={`p-3 rounded-xl border ${other.rollNumber === studentData?.rollNumber ? 'bg-primary/10 border-primary text-primary' : 'bg-muted/30 border-border/50'} flex justify-between items-center`}>
                                                                            <span className="text-xs font-mono font-black">{other.rollNumber}</span>
                                                                            <span className="text-[9px] font-black uppercase opacity-60 text-right">{other.seatNumber}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}

                                <Card className="border-none shadow-xl rounded-[2rem]">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-lg font-black flex items-center gap-2">
                                                <Bell className="w-5 h-5 text-rose-500" /> Smart Alerts
                                            </CardTitle>
                                            {unreadCount > 0 && <Badge className="bg-rose-500 text-white animate-pulse">{unreadCount} New</Badge>}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {displayAlerts.length > 0 ? displayAlerts.map((note) => (
                                            <div 
                                                key={note.id} 
                                                onClick={async () => {
                                                    await markAsRead(note.id);
                                                    navigate(note.url);
                                                }}
                                                className={`flex gap-4 p-4 rounded-2xl transition-all cursor-pointer border ${!note.read ? 'bg-primary/5 border-primary/10 shadow-sm' : 'bg-muted/20 border-transparent opacity-70 hover:opacity-100 hover:bg-muted/40'}`}
                                            >
                                                <div className={`mt-1 h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${
                                                    note.type === 'attendance' ? 'bg-amber-100 text-amber-600' :
                                                    note.type === 'fee' ? 'bg-rose-100 text-rose-600' :
                                                    note.type === 'timetable' ? 'bg-blue-100 text-blue-600' :
                                                    'bg-indigo-100 text-indigo-600'
                                                }`}>
                                                    {note.type === 'attendance' ? <Clock className="w-4 h-4" /> :
                                                     note.type === 'fee' ? <CreditCard className="w-4 h-4" /> :
                                                     note.type === 'timetable' ? <Calendar className="w-4 h-4" /> :
                                                     <Info className="w-4 h-4" />}
                                                </div>
                                                <div className="space-y-1 flex-1">
                                                    <div className="flex justify-between items-center gap-4">
                                                        <h5 className="text-sm font-black text-foreground/90">{note.title}</h5>
                                                        {!note.read && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{note.message}</p>
                                                    <div className="pt-1 flex justify-between items-center">
                                                        <span className="text-[9px] font-black uppercase text-muted-foreground opacity-60">
                                                            {note.senderName}
                                                        </span>
                                                        <ChevronRight className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100" />
                                                    </div>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-10 opacity-30">
                                                <Inbox className="w-10 h-10 mx-auto mb-2" />
                                                <p className="text-xs font-bold uppercase">No Active Alerts</p>
                                            </div>
                                        )}
                                        {notifications.length > 3 && (
                                            <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5" onClick={() => navigate('/dashboard/communications')}>
                                                View All Notifications
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>

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
                            </div>
                        );
                    })()}

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


                </div>

            </div>

        </div>
    );
}

