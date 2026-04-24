import { useOutletContext, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    CalendarDays, Clock, Users, MapPin, BookOpen, 
    Video, FileText, CheckCircle2, Star, 
    ArrowRight, Info, LayoutDashboard, GraduationCap
} from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { format } from "date-fns";
import { AIML_TIMETABLES, FACULTY_LOAD } from "@/data/aimlTimetable";
import { MOCK_COURSES } from "@/data/mockCourses";

export default function MyClasses() {
    const { user } = useOutletContext<{ user: { name: string, id: string, role: string } }>();
    const navigate = useNavigate();
    const today = useMemo(() => format(new Date(), "EEEE"), []);
    const todayISO = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);

    const [storageSyncStamp, setStorageSyncStamp] = useState(0);
    useEffect(() => {
        const handleCustomEvent = () => setStorageSyncStamp(s => s + 1);
        window.addEventListener('timetable_published', handleCustomEvent);
        window.addEventListener('faculty_request_updated', handleCustomEvent);
        return () => {
            window.removeEventListener('timetable_published', handleCustomEvent);
            window.removeEventListener('faculty_request_updated', handleCustomEvent);
        };
    }, []);

    // 1. Resolve Faculty Classes
    const facultyClasses = useMemo(() => {
        const results: any[] = [];
        const seenCourses = new Set();
        const facultyId = user.id;
        const facultyName = user.name;

        // Scan all timetables (published + static) for this faculty
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
        
        // Load Approved substitutions
        const savedRequests = localStorage.getItem('FACULTY_REQUESTS');
        const approvedRequests = savedRequests ? JSON.parse(savedRequests).filter((r: any) => 
          r.status === 'approved' && 
          (r.type === 'replacement' || r.type === 'swap')
        ) : [];

        Object.entries(allTimetablesToProcess).forEach(([key, table]: [string, any]) => {
            const parts = key.split('-');
            const section = parts.length > 3 ? parts[3] : (parts.length > 2 ? parts[2] : 'A');
            const dept = parts.length > 0 ? parts[0] : 'AIML';
            const year = parts.length > 1 ? parts[1] : '1';
            const sem = parts.length > 2 ? parts[2] : '1';

            Object.entries(table).forEach(([dayTime, session]: [string, any]) => {
                if (!session) return;
                const [day, time] = dayTime.split('-');
                
                // Substitution logic
                const amISubstituting = approvedRequests.find((r: any) => {
                   const rDate = new Date(r.date);
                   const rDayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][rDate.getDay()];
                   const rStartTime = r.period?.split('-')[0] || r.period;
                   
                   const isMatchingSlot = rDayName === day && (r.period === time || r.period.startsWith(time) || rStartTime === time);
                   const isMatchingSection = r.section === key;
                   const isMeTarget = r.targetId === facultyId || (r.targetName && r.targetName.toLowerCase() === facultyName.toLowerCase());
                   
                   return isMatchingSlot && isMatchingSection && isMeTarget;
                });

                const amIBeingReplaced = approvedRequests.find((r: any) => {
                   const rDate = new Date(r.date);
                   const rDayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][rDate.getDay()];
                   const rStartTime = r.period?.split('-')[0] || r.period;
                   
                   const isMatchingSlot = rDayName === day && (r.period === time || r.period.startsWith(time) || rStartTime === time);
                   const isMatchingSection = r.section === key;
                   const isMeSender = r.senderId === facultyId || (r.senderName && (session.faculty?.toLowerCase()?.includes(r.senderName.toLowerCase())));
                   
                   return isMatchingSlot && isMatchingSection && isMeSender;
                });

                // Semester Filter: Only show what matches the current view's semester
                // Note: Assuming semester-1 is '1' and semester-2 is '2' in keys
                const isCorrectSemester = sem === "1"; // Defaulting to 1 for sync with screenshot

                let isAssigned = !!amISubstituting;
                
                if (!isAssigned && !amIBeingReplaced && isCorrectSemester) {
                    const normalizedTarget = facultyName.toLowerCase();
                    const normalizedTargetId = facultyId?.toLowerCase();

                    // 1. Faculty ID
                    if (session.facultyId) {
                        isAssigned = session.facultyId === facultyId || session.facultyId === normalizedTargetId;
                    } 
                    if (!isAssigned && session.facultyIds && Array.isArray(session.facultyIds)) {
                        isAssigned = session.facultyIds.some((fid: string) => fid === facultyId || fid === normalizedTargetId);
                    }
                    
                    // 2. Faculty Name Match
                    if (!isAssigned && session.faculty) {
                        const normalizedFaculty = session.faculty.toLowerCase();
                        isAssigned = normalizedFaculty === normalizedTarget || 
                                     normalizedFaculty.includes(normalizedTarget) || 
                                     normalizedTarget.includes(normalizedFaculty);
                    }

                    // 3. Room-based match (ONLY if room string explicitly contains faculty titles)
                    if (!isAssigned && session.room) {
                        const normalizedRoom = session.room.toLowerCase();
                        const hasTitle = normalizedRoom.includes('dr.') || normalizedRoom.includes('mrs.') || 
                                       normalizedRoom.includes('mr.') || normalizedRoom.includes('prof.');
                        
                        if (hasTitle && (normalizedRoom.includes(normalizedTarget) || normalizedTarget.includes(normalizedRoom))) {
                            isAssigned = true;
                        }
                    }

                    // 4. Load-based Fallback (Mock Support)
                    if (!isAssigned && !session.faculty && !session.facultyId) {
                        const semKey = `${year}-${sem}`;
                        const load = FACULTY_LOAD[semKey as keyof typeof FACULTY_LOAD] || [];
                        const cleanCode = (session.courseCode || session.name || session.subject || '').split(' (')[0].trim();
                        
                        const sessionLoadInfo = load.find(l => 
                            l.code === cleanCode && (
                                ((l as any).id === facultyId) || 
                                (l.faculty && l.faculty.toLowerCase() === normalizedTarget)
                            )
                        );
                        if (sessionLoadInfo) isAssigned = true;
                    }
                }

                if (isAssigned) {
                    const courseCode = session.courseCode || session.name || session.subject;
                    const compositeKey = `${courseCode}-${dept}-${year}-${section}`;
                    
                    if (!seenCourses.has(compositeKey)) {
                        const courseInfo = MOCK_COURSES.find(c => c.code === courseCode);
                        results.push({
                            id: compositeKey,
                            code: courseCode,
                            name: courseInfo?.name || courseCode,
                            dept,
                            year,
                            sem,
                            section,
                            room: (session.room && (session.room.includes("Mrs.") || session.room.includes("Dr.")) ? "TBD" : session.room) || "TBD",
                            students: 60,
                            type: (courseInfo?.type || (courseCode.toLowerCase().includes('lab') ? 'Lab' : 'Theory')) as string,
                            schedule: []
                        });
                        seenCourses.add(compositeKey);
                    }
                    
                    const courseIdx = results.findIndex(r => r.id === compositeKey);
                    if (courseIdx !== -1) {
                        results[courseIdx].schedule.push({ 
                            day, 
                            time,
                            isSubstituted: !!amIBeingReplaced || !!amISubstituting,
                            displayFaculty: amISubstituting ? facultyName : (amIBeingReplaced ? amIBeingReplaced.targetName : (session.faculty || facultyName))
                        });
                    }
                }
            });
        });

        return results;
    }, [user.name, user.id, today, todayISO, storageSyncStamp]);

    // 2. Today's Schedule
    const todaySchedule = useMemo(() => {
        const schedule: any[] = [];
        const facultyId = user.id;
        const facultyName = user.name;
        
        // Load Approved requests for today
        const savedRequests = localStorage.getItem('FACULTY_REQUESTS');
        const approvedRequests = savedRequests ? JSON.parse(savedRequests).filter((r: any) => 
            r.status === 'approved' && 
            r.date === todayISO
        ) : [];

        facultyClasses.forEach(cls => {
            cls.schedule.forEach((s: any) => {
                if (s.day === today) {
                    const substitution = approvedRequests.find((r: any) => {
                        const rStart = r.period?.split('-')[0] || r.period;
                        return (rStart === s.time || r.period === s.time) && r.section.includes(cls.dept) && r.section.includes(cls.section);
                    });

                    let status = "upcoming";
                    let isTransferred = false;
                    let displayFaculty = s.displayFaculty;

                    if (substitution) {
                        if (substitution.senderId === facultyId || (substitution.senderName && substitution.senderName.toLowerCase() === facultyName.toLowerCase())) {
                            isTransferred = true;
                            status = "transferred";
                            displayFaculty = substitution.targetName;
                        }
                    }

                    schedule.push({
                        ...cls,
                        time: s.time,
                        displayFaculty: displayFaculty,
                        isSubstituted: s.isSubstituted,
                        isTransferred: isTransferred,
                        status: status
                    });
                }
            });
        });

        // Add ad-hoc replacements where I am the target but it wasn't in my regular facultyClasses
        approvedRequests.forEach((req: any) => {
            if (req.targetId === facultyId || req.targetName?.toLowerCase() === facultyName.toLowerCase()) {
                const alreadyAdded = schedule.find(s => s.time === req.period && s.code === req.subject);
                if (!alreadyAdded) {
                    const parts = req.section?.split('-') || [];
                    schedule.push({
                        id: `adhoc-${req.id}`,
                        code: req.subject || "SUB",
                        name: req.subject || "Replacement Class",
                        dept: req.branch || parts[0] || "N/A",
                        year: req.year || parts[1] || "N/A",
                        section: req.sectionName || parts[3] || "A",
                        time: req.period,
                        displayFaculty: facultyName,
                        isSubstituted: true,
                        isTransferred: false,
                        status: "upcoming",
                        room: req.room || "TBD"
                    });
                }
            }
        });

        return schedule.sort((a, b) => a.time.localeCompare(b.time));
    }, [facultyClasses, today, todayISO, storageSyncStamp, user.id, user.name]);

    return (
        <div className="space-y-8 pb-10 animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-600">
                        Academic Workload
                    </h1>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        Manage your assigned sections and real-time class delivery.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 shadow-sm border-primary/20">
                        <CalendarDays className="w-4 h-4" />
                        Sem Calendar
                    </Button>
                    <Button className="gap-2 shadow-md hover:shadow-lg transition-all">
                        <LayoutDashboard className="w-4 h-4" />
                        Generate Lesson Plan
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Today's Timeline */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-none shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <Clock className="w-32 h-32" />
                        </div>
                        <CardHeader className="relative z-10">
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                Today's Delivery
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                {format(new Date(), "MMMM do, yyyy")} • {today}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="relative z-10 space-y-6">
                            {todaySchedule.length > 0 ? (
                                todaySchedule.map((session, idx) => (
                                    <div key={idx} className="flex gap-4 group">
                                        <div className="flex flex-col items-center">
                                            <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20 group-hover:scale-125 transition-transform" />
                                            {idx !== todaySchedule.length - 1 && <div className="w-0.5 h-full bg-slate-700 my-1" />}
                                        </div>
                                        <div className="flex-1 pb-6">
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-mono text-primary font-bold uppercase tracking-wider">{session.time}</span>
                                                    {session.isTransferred && (
                                                        <Badge variant="outline" className="mt-1 border-amber-500/50 text-amber-400 bg-amber-500/5 caps-lock text-[8px] h-4 py-0 px-1 font-black">
                                                            Transferred
                                                        </Badge>
                                                    )}
                                                    {session.id?.startsWith('adhoc-') && (
                                                        <Badge variant="outline" className="mt-1 border-indigo-500/50 text-indigo-400 bg-indigo-500/5 caps-lock text-[8px] h-4 py-0 px-1 font-black">
                                                            Substitute
                                                        </Badge>
                                                    )}
                                                </div>
                                                <Badge className="bg-white/10 hover:bg-white/20 text-[10px] border-none text-white px-1.5 py-0">
                                                    {session.room}
                                                </Badge>
                                            </div>
                                            <h4 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                                                {session.name}
                                                {session.isTransferred && <span className="text-xs text-slate-500 block">Covered by {session.displayFaculty}</span>}
                                            </h4>
                                            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">
                                                Section {session.dept}-{session.year}{session.section}
                                            </p>
                                            <div className="mt-3 flex gap-2">
                                                {!session.isTransferred && (
                                                    <Button 
                                                        size="sm" 
                                                        variant="secondary" 
                                                        className="h-7 text-[10px] font-bold bg-white/10 hover:bg-white/20 border-none text-white transition-all hover:scale-105 active:scale-95"
                                                        onClick={() => navigate(`/dashboard/students?dept=${session.dept}&year=${session.year}&section=${session.section}&course=${session.code}&mode=attendance`)}
                                                    >
                                                        Attendance
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 space-y-4">
                                    <div className="bg-white/5 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                                    </div>
                                    <p className="text-slate-400 text-sm">No scheduled classes for today.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border p-6 space-y-4 bg-primary/5 border-primary/10">
                        <div className="flex items-start gap-4">
                            <Info className="w-5 h-5 text-primary mt-1" />
                            <div>
                                <h4 className="font-bold">Teaching Resource</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Your syllabus compliance for this semester is at 84%. Next submission due by Friday.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Course Cards */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold tracking-tight">Active Course Load</h3>
                        <Badge variant="outline" className="px-3 py-1 font-mono">
                            {facultyClasses.length} SECTIONS ASSIGNED
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {facultyClasses.map((cls, idx) => (
                            <motion.div
                                key={cls.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Card className="group hover:shadow-2xl transition-all duration-300 border-none shadow-lg overflow-hidden flex flex-col h-full bg-card">
                                    <div className={`h-2 w-full ${idx % 2 === 0 ? 'bg-primary' : 'bg-violet-600'}`} />
                                    <CardHeader className="pb-4">
                                        <div className="flex justify-between items-start">
                                            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none font-bold">
                                                {cls.code}
                                            </Badge>
                                            <div className="flex items-center text-xs text-muted-foreground gap-1 font-semibold">
                                                <Users className="w-3 h-3" />
                                                {cls.students}
                                            </div>
                                        </div>
                                        <CardTitle className="text-xl font-bold mt-3 group-hover:text-primary transition-colors line-clamp-1">
                                            {cls.name}
                                        </CardTitle>
                                        <CardDescription className="uppercase font-bold text-[10px] tracking-widest pt-1">
                                            Department of {cls.dept} • Year {cls.year} • Section {cls.section}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 flex-grow">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Assigned Hours</p>
                                                <p className="text-sm font-bold flex items-center gap-1">
                                                    <Clock className="w-3 h-3 text-primary" />
                                                    {cls.schedule.length} Hrs/Week
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Location</p>
                                                <p className="text-sm font-bold flex items-center gap-1">
                                                    <MapPin className="w-3 h-3 text-primary" />
                                                    {cls.room}
                                                </p>
                                            </div>
                                        </div>

                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
