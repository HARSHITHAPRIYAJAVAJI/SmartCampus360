import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    Users,
    BookOpen,
    FileText,
    CheckCircle,
    Bell,
    Mail,
    Phone,
    MapPin,
    Smartphone,
    Award,
    CheckCircle2,
    TrendingUp,
    Briefcase,
    ShieldCheck,
    Building2,
    History,
    CalendarDays,
    Star,
    Smartphone as MobileIcon,
    Globe,
    UserCircle,
    User,
    Clock,
    Zap
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { YEAR_IN_CHARGES, CLASS_TEACHERS } from "@/data/mockHierarchy";

import { useNavigate, useOutletContext } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { FACULTY_LOAD, getTimetable, AIML_TIMETABLES } from "@/data/aimlTimetable";
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

    const facultyData = useMemo(() => {
        return MOCK_FACULTY.find(f => f.id === user.id || f.rollNumber === user.id || f.name === user.name);
    }, [user.id, user.name]);

    const profileData = {
        name: facultyData?.name || user.name,
        role: facultyData?.designation || (user.role === 'admin' ? "Administrator" : "Faculty"),
        id: facultyData?.rollNumber || user.id,
        dept: facultyData?.department || "N/A",
        email: facultyData?.email || "n/a",
        phone: facultyData?.phone || "n/a",
        imageType: "initials"
    };

    const classTeacherSection = facultyData ? CLASS_TEACHERS.filter(ct => ct.facultyId === facultyData.id) : [];
    const yearInChargeInfo = facultyData ? YEAR_IN_CHARGES.filter(yic => yic.facultyId === facultyData.id) : [];

    const infoCards = [
        { label: "Staff ID", value: profileData.id, icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Department", value: profileData.dept, icon: Building2, color: "text-indigo-600", bg: "bg-indigo-50" },
        { label: "Experience", value: "8+ Years", icon: History, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Join Date", value: "Aug 2018", icon: CalendarDays, color: "text-amber-600", bg: "bg-amber-50" },
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
        window.addEventListener('faculty_request_updated', handleCustomEvent);
        
        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('timetable_published', handleCustomEvent);
            window.removeEventListener('faculty_request_updated', handleCustomEvent);
        };
    }, []);

    const todayInvigilation = useMemo(() => {
        const invigilationStr = localStorage.getItem('INVIGILATION_LIST');
        if (!invigilationStr) return null;
        const allInvigs = JSON.parse(invigilationStr) as any[];
        const todayStr = format(new Date(), "yyyy-MM-dd");
        
        // Find if any duty is for today and for this faculty
        return allInvigs.find(duty => 
            duty.date === todayStr && 
            duty.facultyName.toLowerCase().includes(user.name.toLowerCase())
        );
    }, [user.name, storageSyncStamp]);

    const todaySchedule = useMemo(() => {
        const schedule: any[] = [];
        const nameToMatch = user.name;
        const idToMatch = user.id;

        // DYNAMIC SCAN: Check every single published key + base static keys
        const allTimetablesToProcess: Record<string, any> = {};
        
        // 1. Add static base timetables
        Object.keys(AIML_TIMETABLES).forEach(key => {
            allTimetablesToProcess[key] = AIML_TIMETABLES[key];
        });

        // 2. Override with published ones from localStorage
        const publishedStoreStr = localStorage.getItem('published_timetables');
        const publishedTimetables = publishedStoreStr ? JSON.parse(publishedStoreStr) : {};
        
        Object.keys(publishedTimetables).forEach(key => {
            const entry = publishedTimetables[key];
            if (entry) {
                allTimetablesToProcess[key] = entry.grid || entry;
            }
        });

        Object.entries(allTimetablesToProcess).forEach(([key, table]: [string, any]) => {
            const parts = key.split('-');
            const section = parts.length > 3 ? parts[3] : (parts.length > 2 ? parts[2] : 'A');
            const dept = parts.length > 0 ? (parts[0].includes('CSM') || parts[0].includes('CSE') ? parts[0] : 'CSM') : 'CSM';
            const yearStr = parts.length > 1 ? parts[1] : (parts.length > 0 ? parts[0] : '1');
            const semStr = parts.length > 2 ? parts[2] : (parts.length > 1 ? parts[1] : '1');

            const semKey = `${yearStr}-${semStr}`;
            const load = FACULTY_LOAD[semKey as keyof typeof FACULTY_LOAD] || [];
            
            // Create a map for course name lookup
            const courseNameMap: Record<string, string> = {};
            MOCK_COURSES.forEach(c => {
                courseNameMap[c.code] = c.name;
                courseNameMap[c.code.replace(' Lab', '').trim()] = c.name;
            });

            // Load Approved substitutions for today
            const savedRequests = localStorage.getItem('FACULTY_REQUESTS');
            const approvedRequests = savedRequests ? JSON.parse(savedRequests).filter((r: any) => 
                r.status === 'approved' && 
                r.date === format(new Date(), 'yyyy-MM-dd') &&
                (r.type === 'replacement' || r.type === 'swap')
            ) : [];

            Object.entries(table).forEach(([dayTime, session]: [string, any]) => {
                if (!session) return;
                let [day, time] = dayTime.split('-');
                if (day !== today) return;
                
                const normalizedTime = time;
                
                // 1. Check for a substitution/swap for this specific section, day, and time
                const substitution = approvedRequests.find((r: any) => {
                    return (r.period === normalizedTime || r.period?.startsWith(normalizedTime)) && r.section === key;
                });

                let isAssigned = false;
                let currentSessionFaculty = session.faculty || "Staff";
                let isSubstituted = !!substitution;

                if (isSubstituted && substitution) {
                   // If I am the substitute, I should see it
                   if (substitution.targetId === idToMatch || substitution.targetName === nameToMatch) {
                      isAssigned = true;
                      currentSessionFaculty = substitution.targetName;
                   }
                }

                // 2. ID-BASED MATCHING (including original faculty record)
                if (!isAssigned && session.facultyId && idToMatch) {
                    isAssigned = session.facultyId === idToMatch || session.originalFacultyId === idToMatch;
                }
                if (!isAssigned && session.facultyIds && session.facultyIds.includes(idToMatch)) {
                    isAssigned = true;
                }
                
                // 3. NAME-BASED MATCHING (Inclusive)
                if (!isAssigned) {
                    const normalizedFaculty = (session.faculty || "").toLowerCase();
                    const normalizedRoom = (session.room || "").toLowerCase(); // Check room field for static mock data
                    const normalizedTarget = nameToMatch.toLowerCase();

                    if (normalizedTarget && (
                        (normalizedFaculty && (normalizedFaculty.includes(normalizedTarget) || normalizedTarget.includes(normalizedFaculty))) ||
                        (session.originalFacultyName && session.originalFacultyName.toLowerCase().includes(normalizedTarget)) ||
                        (normalizedRoom && (normalizedRoom.includes(normalizedTarget) || normalizedTarget.includes(normalizedRoom)))
                    )) {
                        isAssigned = true;
                    }
                }

                // 4. LOAD-BASED FALLBACK (If grid is empty but load says they teach it)
                if (!isAssigned && !session.faculty && !session.facultyId) {
                    const cleanCode = (session.courseCode || session.name || '').split(' (')[0].trim();
                    const sessionLoadInfo = load.find(l => l.code === cleanCode);
                    if (sessionLoadInfo && (((sessionLoadInfo as any).id === idToMatch) || (sessionLoadInfo.faculty && sessionLoadInfo.faculty === nameToMatch))) {
                        isAssigned = true;
                    }
                }
                
                if (isAssigned) {
                    const hourStr = time.split(':')[0];
                    const hour = parseInt(hourStr);
                    const period = (hour >= 9 && hour < 12) ? "AM" : "PM";
                    
                    const cleanCode = (session.courseCode || session.name || '').split(' (')[0].trim();
                    const fullName = courseNameMap[cleanCode] || cleanCode;
                    const isTransferred = session.originalFacultyId === idToMatch && session.facultyId !== idToMatch;

                    schedule.push({
                        id: `${key}-${dayTime}-${session.courseCode || session.name}`,
                        time: `${time} ${period}`,
                        rawTime: time,
                        title: `${formatSubjectName(fullName)} (Sec ${section})`,
                        room: session.room && (session.room.includes("Mrs.") || session.room.includes("Dr.")) ? "TBD" : (session.room || "TBD"),
                        type: (fullName || '').toLowerCase().includes('lab') ? 'lab' : 'lecture',
                        isLive: !!publishedTimetables[key],
                        status: isTransferred ? 'transferred' : 'active',
                        isOverride: session.facultyId !== idToMatch && session.originalFacultyId !== idToMatch, // I am the substitute
                        dept,
                        year: yearStr,
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
                    const reqStart = req.period?.split('-')[0];
                    const idx = schedule.findIndex(s => 
                        s.rawTime === req.period || 
                        s.rawTime === reqStart
                    );
                    if (idx !== -1) {
                        schedule[idx].title = `${schedule[idx].title} (Handed to ${req.targetName})`;
                        schedule[idx].status = 'transferred';
                    }
                }
                
                if (req.targetId === idToMatch) {
                    const cleanTime = req.period?.split('-')[0] || req.period;
                    const hour = parseInt(cleanTime.split(':')[0]);
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
    }, [user.name, user.id, today, todayISO, storageSyncStamp]);

    const stats = useMemo(() => [
        { title: "My Classes", value: todaySchedule.length.toString(), icon: BookOpen, change: "Today", color: "text-primary" },
        { title: "Students", value: "156", icon: Users, change: "Total", color: "text-success" },
        { title: "Pending Grades", value: "23", icon: FileText, change: "Due Soon", color: "text-warning" },
        { title: "Attendance Balance", value: "92%", icon: CheckCircle, change: "This Week", color: "text-accent" },
    ], [todaySchedule.length]);

    const incomingRequests = useMemo(() => {
        const saved = localStorage.getItem('FACULTY_REQUESTS');
        if (!saved) return [];
        const all = JSON.parse(saved);
        
        // Multi-format ID support
        const facultyRec = MOCK_FACULTY.find(f => f.id === user.id || f.rollNumber === user.id);
        const possibleIds = [user.id, facultyRec?.id, facultyRec?.rollNumber].filter(Boolean);

        return all.filter((r: any) => 
            possibleIds.includes(r.targetId) && 
            r.status === 'pending' && 
            (r.type === 'swap' || r.type === 'replacement')
        ).sort((a: any, b: any) => b.timestamp - a.timestamp);
    }, [user.id, storageSyncStamp]);

    const quickActions = [
        { title: "Open Student Data", description: "Filter branches, view attendance, change grades", action: () => navigate('/dashboard/students') },
        { title: "Take Attendance", description: "Mark student attendance for today", action: () => navigate('/dashboard/students') },
        { title: "Grade Assignments", description: "Create or modify student grades", action: () => navigate('/dashboard/students') },
        { title: "Submit Leave Request", description: "Apply for leave or substitution", action: () => navigate('/dashboard/leave') },
    ];

    return (
        <div className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
            {/* Unified Header / Banner Profile (From Profile.tsx) */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-gradient-to-br from-[#0D9488] via-[#2563EB] to-[#4F46E5] rounded-[2.5rem] p-10 text-white shadow-[0_20px_50px_rgba(37,99,235,0.2)] flex flex-col justify-between min-h-[300px]"
            >
                {/* Floating Decorative Elements */}
                <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 pointer-events-none translate-x-1/4 -translate-y-1/4">
                    <Building2 className="w-80 h-80" />
                </div>
                <div className="absolute bottom-0 left-0 p-4 opacity-5 pointer-events-none -translate-x-1/4 translate-y-1/4">
                    <Zap className="w-64 h-64" />
                </div>

                <div className="relative z-10">
                    {isImpersonating && (
                        <div className="bg-amber-400 text-black text-[10px] font-black uppercase tracking-[0.2em] mb-6 py-1.5 px-4 rounded-full border border-white/20 w-fit flex items-center gap-2 shadow-lg">
                            <ShieldCheck className="w-3.5 h-3.5" /> Admin Viewing Mode
                        </div>
                    )}
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-8 mb-8">
                        {/* Avatar removed as per request */}
                        
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-3 mb-1">
                                <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-md px-3 font-black text-[10px] tracking-widest uppercase">
                                    STAFF ID: {profileData.id}
                                </Badge>
                                <span className="text-white/50 text-[10px] font-black uppercase tracking-tighter flex items-center gap-1.5">
                                    Active Session
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-1">
                                Welcome back, {profileData.name}!
                            </h1>
                            <div className="flex items-center gap-2 text-white/70 font-bold tracking-tight">
                                <Briefcase className="w-4 h-4 text-white/50" />
                                <p>{profileData.role === 'Student' ? `${profileData.dept} Department` : profileData.role}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                        {classTeacherSection.length > 0 && (
                            <Badge className="bg-emerald-400/20 hover:bg-emerald-400/30 text-emerald-100 border-emerald-400/30 backdrop-blur-3xl px-5 py-2 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:scale-105">
                                CLASS TEACHER: {classTeacherSection.map(ct => `${ct.year}-${ct.branch}-${ct.section}`).join(', ')}
                            </Badge>
                        )}
                        {yearInChargeInfo.length > 0 && (
                            <Badge className="bg-indigo-400/20 hover:bg-indigo-400/30 text-indigo-100 border-indigo-400/30 backdrop-blur-3xl px-5 py-2 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:scale-105">
                                YEAR IN-CHARGE: {yearInChargeInfo.map(yic => `${yic.branch} ${yic.year}${yic.year === 1 ? 'st' : yic.year === 2 ? 'nd' : yic.year === 3 ? 'rd' : 'th'} Year`).join(', ')}
                            </Badge>
                        )}
                        <Badge className="bg-white/10 hover:bg-white/20 text-white border-white/10 backdrop-blur-3xl px-5 py-2 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:scale-105">
                            {profileData.dept} DEPARTMENT
                        </Badge>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-end">
                    <div className="hidden md:flex items-center gap-4 text-white/50 text-xs font-black uppercase tracking-widest">
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            Session started at 08:30 AM
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column (Stats and Profiles) */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Quick Access Tiles */}
                    <div className="grid grid-cols-1 gap-4">
                        {quickActions.map((action, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.02, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={action.action}
                                className="p-5 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] shadow-sm hover:shadow-xl transition-all cursor-pointer group flex items-center gap-4"
                            >
                                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                    <Zap className="h-5 w-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <h3 className="font-black tracking-tight text-sm group-hover:text-primary transition-colors">{action.title}</h3>
                                    <p className="text-[10px] font-medium text-slate-500 line-clamp-1">{action.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact & Professional Info Cards */}
                    <Card className="border-none shadow-premium rounded-[2rem] overflow-hidden bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950">
                        <CardHeader className="bg-muted/30 border-b">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                Professional Identity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            {[
                                { label: "Institutional Email", value: profileData.email, icon: Mail },
                                { label: "Emergency Phone", value: profileData.phone, icon: MobileIcon },
                                { label: "Department", value: profileData.dept, icon: Building2 },
                                { label: "Work Location", value: "Faculty Block C, Room 402", icon: MapPin },
                            ].map((info, i) => (
                                <div key={i} className="flex items-center gap-4 group/item">
                                    <div className="p-2.5 rounded-xl bg-muted/50 text-muted-foreground group-hover/item:bg-primary/10 group-hover/item:text-primary transition-all duration-300">
                                        <info.icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{info.label}</span>
                                        <span className="text-sm font-semibold break-all">{info.value}</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-premium bg-gradient-to-br from-teal-500/5 to-transparent rounded-[2rem]">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Award className="w-5 h-5 text-amber-500" />
                                Academic Merits
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center bg-background/50 p-4 rounded-2xl border border-primary/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-sm">Punctuality</span>
                                </div>
                                <span className="font-black text-blue-600">98.4%</span>
                            </div>
                            <div className="flex justify-between items-center bg-background/50 p-4 rounded-2xl border border-primary/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-lg">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-sm">Research Papers</span>
                                </div>
                                <span className="font-black text-indigo-600">14</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* NEW: Institutional Records Grid (From Profile.tsx) */}
                    <Card className="border-none shadow-premium rounded-[2rem] overflow-hidden bg-white/50 dark:bg-slate-900/50">
                        <CardHeader className="bg-muted/10 border-b">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                Institutional Records
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 gap-4">
                                {infoCards.map((card, i) => (
                                    <div key={i} className={`p-4 rounded-2xl ${card.bg} border border-transparent hover:border-border transition-all group`}>
                                        <div className={`p-2 rounded-lg bg-white dark:bg-black/20 ${card.color} shadow-sm w-fit mb-2 group-hover:scale-110 transition-transform`}>
                                            <card.icon className="w-4 h-4" />
                                        </div>
                                        <div className="text-[8px] uppercase font-bold text-muted-foreground tracking-tighter mb-0.5">{card.label}</div>
                                        <div className="text-sm font-black text-slate-800 dark:text-slate-100">{card.value}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Subjects Taught Section */}
                    {facultyData?.specialization && (
                        <Card className="border-none shadow-premium rounded-[2rem]">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-indigo-500" />
                                    Specializations
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {facultyData.specialization.map((subject, idx) => (
                                        <Badge key={idx} variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100 font-bold px-3 py-1">
                                            {subject}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column (Dashboard Logic) */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Active Duties Notification */}
                    {todayInvigilation && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative group h-full"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <Card className="relative border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-950 border-l-[6px] border-l-amber-500">
                                <CardContent className="p-8">
                                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                        <div className="flex gap-5 items-center">
                                            <div className="h-16 w-16 rounded-[1.5rem] bg-amber-500/20 flex items-center justify-center shrink-0">
                                                <div className="relative">
                                                    <Users className="h-8 w-8 text-amber-600" />
                                                    <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-amber-600 border-2 border-white animate-ping" />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <Badge className="bg-amber-600 text-white border-none text-[8px] font-black uppercase tracking-[0.2em] px-3">Invigilation Duty ACTIVE</Badge>
                                                <h3 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
                                                    Exam Hall {todayInvigilation.room}
                                                </h3>
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Clock className="h-4 w-4" /> {todayInvigilation.date} • {todayInvigilation.time}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button variant="outline" className="rounded-2xl border-amber-200 text-amber-600 hover:bg-amber-50 font-black uppercase text-[10px] tracking-widest h-12 px-6">
                                                Roster
                                            </Button>
                                            <Button className="rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black uppercase text-[10px] tracking-widest h-12 px-8 shadow-xl shadow-amber-600/30">
                                                Check In
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat, index) => (
                            <motion.div 
                                key={index}
                                whileHover={{ y: -5 }}
                                className="group"
                            >
                                <Card className="border-none shadow- premium rounded-[2rem] overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl group-hover:shadow-xl transition-all h-full cursor-pointer" onClick={() => navigate(stat.title === "My Classes" ? '/dashboard/classes' : '/dashboard/students')}>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={cn("p-2 rounded-xl bg-muted/50 group-hover:bg-primary/10 transition-colors", stat.color)}>
                                                <stat.icon className="h-5 w-5" />
                                            </div>
                                            <span className="text-[10px] font-black text-emerald-500 uppercase">{stat.change}</span>
                                        </div>
                                        <div className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">{stat.value}</div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.title}</div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Incoming Requests Alert (Broadcast Awareness) */}
                    {incomingRequests.length > 0 && (
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-violet-700 p-6 shadow-2xl shadow-indigo-600/30"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                                <Bell className="h-32 w-32 text-white" />
                            </div>
                            
                            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="h-16 w-16 rounded-[1.5rem] bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                                        <ShieldCheck className="h-8 w-8 text-white animate-pulse" />
                                    </div>
                                    <div className="space-y-1">
                                        <Badge className="bg-white text-indigo-700 hover:bg-white border-none text-[9px] font-black uppercase tracking-widest px-4 h-6">
                                            {incomingRequests.length} New Broadcast Request{incomingRequests.length > 1 ? 's' : ''}
                                        </Badge>
                                        <h2 className="text-2xl font-black text-white tracking-tighter">
                                            Academic Support Required
                                        </h2>
                                        <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest opacity-80">
                                            Peers in your branch have requested swaps. Action needed.
                                        </p>
                                    </div>
                                </div>
                                <Button 
                                    onClick={() => navigate('/dashboard/leave')}
                                    className="bg-white text-indigo-600 hover:bg-indigo-50 font-black rounded-2xl h-14 px-10 shadow-xl shadow-black/10 transition-all active:scale-95 group-hover:px-12"
                                >
                                    Review & Respond
                                    <TrendingUp className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Today's Schedule (Large Format) */}
                    <Card className="border-none shadow-premium rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-2xl font-black tracking-tighter flex items-center gap-3">
                                        <Calendar className="h-6 w-6 text-primary" />
                                        Today's Academic Schedule
                                    </CardTitle>
                                    <CardDescription className="text-xs uppercase font-bold tracking-widest">{today}, {format(new Date(), "do MMMM")}</CardDescription>
                                </div>
                                <Button variant="outline" size="sm" className="rounded-xl font-bold text-xs" onClick={() => navigate('/dashboard/timetable')}>
                                    View Full Timetable
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-4">
                            <div className="space-y-4">
                                {todaySchedule.length > 0 ? todaySchedule.map((item, index) => (
                                    <motion.div 
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={cn(
                                            "flex flex-col md:flex-row items-center justify-between p-5 rounded-[2rem] transition-all border border-transparent hover:border-primary/20",
                                            item.isOverride ? "bg-indigo-50/50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800" : "bg-muted/30",
                                            item.status === 'transferred' ? "opacity-40 grayscale" : "hover:bg-white dark:hover:bg-slate-950 hover:shadow-lg"
                                        )}
                                    >
                                        <div className="flex items-center gap-5 w-full md:w-auto">
                                            <div className="h-14 w-14 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center font-black text-xs shadow-sm text-primary">
                                                {item.time.replace(' ', '\n')}
                                            </div>
                                            <div className="space-y-0.5">
                                                <div className="font-black text-lg tracking-tight flex items-center gap-2">
                                                    {item.title}
                                                    {item.isOverride && <Badge className="text-[8px] h-4 bg-indigo-500 uppercase tracking-tighter">Substitute</Badge>}
                                                </div>
                                                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Hall {item.room}</span>
                                                    <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {item.code}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4 mt-4 md:mt-0 w-full md:w-auto justify-end">
                                            <Badge variant={item.type === "lecture" ? "default" : "secondary"} className="rounded-full px-4 font-black text-[10px] uppercase">
                                                {item.type}
                                            </Badge>
                                            {item.status !== 'transferred' ? (
                                                <Button 
                                                    className="rounded-xl bg-primary/10 text-primary hover:bg-primary shadow-none hover:text-white font-black text-[10px] uppercase h-10 px-6 transition-all"
                                                    onClick={() => navigate(`/dashboard/students?dept=${item.dept}&year=${item.year}&section=${item.section}&course=${item.code}&mode=attendance`)}
                                                >
                                                    Mark Attendance
                                                </Button>
                                            ) : (
                                                <Badge variant="destructive" className="font-black text-[8px] uppercase px-4">Handed Over</Badge>
                                            )}
                                        </div>
                                    </motion.div>
                                )) : (
                                    <div className="flex flex-col items-center justify-center py-12 opacity-50 grayscale transition-all bg-muted/20 rounded-[2rem] border-2 border-dashed border-muted-foreground/20">
                                        <Calendar className="h-12 w-12 mb-4 text-muted-foreground" />
                                        <p className="font-black text-sm uppercase tracking-widest text-muted-foreground">No classes scheduled for today</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
