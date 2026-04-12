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
import { useMemo } from "react";
import { format } from "date-fns";
import { AIML_TIMETABLES, FACULTY_LOAD } from "@/data/aimlTimetable";
import { MOCK_COURSES } from "@/data/mockCourses";

export default function MyClasses() {
    const { user } = useOutletContext<{ user: { name: string, id: string, role: string } }>();
    const navigate = useNavigate();
    const today = useMemo(() => format(new Date(), "EEEE"), []);
    const currentTime = new Date();

    // 1. Resolve Faculty Classes
    const facultyClasses = useMemo(() => {
        const results: any[] = [];
        const seenCourses = new Set();

        // Scan all timetables (published + static) for this faculty
        const publishedStoreStr = localStorage.getItem('published_timetables');
        const publishedTimetables = publishedStoreStr ? JSON.parse(publishedStoreStr) : {};
        const allTimetables = { ...AIML_TIMETABLES, ...publishedTimetables };

        Object.entries(allTimetables).forEach(([key, table]: [string, any]) => {
            const parts = key.split('-');
            let dept = "CSM", year, sem, section = "A";
            
            if (parts.length === 4) [dept, year, sem, section] = parts;
            else if (parts.length === 3) [year, sem, section] = parts;
            else [year, sem] = parts;

            Object.entries(table).forEach(([dayTime, session]: [string, any]) => {
                if (!session) return;
                
                // Match faculty name
                const isAssigned = session.faculty === user.name || session.room === user.name;
                
                if (isAssigned) {
                    const [day, time] = dayTime.split('-');
                    const courseCode = session.courseCode || session.name;
                    const compositeKey = `${courseCode}-${dept}-${year}-${section}`;
                    
                    if (!seenCourses.has(compositeKey)) {
                        const courseInfo = MOCK_COURSES.find(c => c.code === courseCode);
                        const resolvedSem = courseInfo?.semester || parseInt(sem);
                        const resolvedYear = Math.ceil(resolvedSem / 2);
                        
                        results.push({
                            id: compositeKey,
                            code: courseCode,
                            name: courseInfo?.name || courseCode,
                            dept,
                            year: resolvedYear || year,
                            sem: resolvedSem || sem,
                            section,
                            room: session.room && session.room !== user.name ? session.room : "TBD",
                            students: 60, // Mock student count
                            type: (courseInfo?.type || 'Theory') as string,
                            schedule: []
                        });
                        seenCourses.add(compositeKey);
                    }
                    
                    const courseIdx = results.findIndex(r => r.id === compositeKey);
                    if (courseIdx !== -1) {
                        results[courseIdx].schedule.push({ day, time });
                    }
                }
            });
        });

        return results;
    }, [user.name]);

    // 2. Today's Schedule
    const todaySchedule = useMemo(() => {
        const schedule: any[] = [];
        facultyClasses.forEach(cls => {
            cls.schedule.forEach((s: any) => {
                if (s.day === today) {
                    schedule.push({
                        ...cls,
                        time: s.time,
                        status: "upcoming"
                    });
                }
            });
        });
        return schedule.sort((a, b) => a.time.localeCompare(b.time));
    }, [facultyClasses, today]);

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
                                                <span className="text-xs font-mono text-primary font-bold uppercase tracking-wider">{session.time}</span>
                                                <Badge className="bg-white/10 hover:bg-white/20 text-[10px] border-none text-white px-1.5 py-0">
                                                    {session.room}
                                                </Badge>
                                            </div>
                                            <h4 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{session.name}</h4>
                                            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">
                                                Section {session.dept}-{session.year}{session.section}
                                            </p>
                                            <div className="mt-3 flex gap-2">
                                                <Button 
                                                    size="sm" 
                                                    variant="secondary" 
                                                    className="h-7 text-[10px] font-bold bg-white/10 hover:bg-white/20 border-none text-white transition-all hover:scale-105 active:scale-95"
                                                    onClick={() => navigate(`/dashboard/students?dept=${session.dept}&year=${session.year}&section=${session.section}&course=${session.code}&mode=attendance`)}
                                                >
                                                    Attendance
                                                </Button>
                                                <Button size="sm" variant="secondary" className="h-7 text-[10px] font-bold bg-white/10 hover:bg-white/20 border-none text-white">
                                                    Quiz
                                                </Button>
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

                                        <div className="pt-4 border-t border-border/50 flex flex-wrap gap-2">
                                            <Badge variant="outline" className="text-[10px] bg-secondary/50 border-none font-bold">
                                                {cls.type}
                                            </Badge>
                                            <Badge variant="outline" className="text-[10px] bg-secondary/50 border-none font-bold">
                                                L-T-P: 3-0-0
                                            </Badge>
                                        </div>
                                    </CardContent>
                                    <div className="p-4 bg-muted/30 mt-auto flex gap-2">
                                        <Button variant="ghost" size="sm" className="flex-1 gap-2 text-xs font-bold hover:bg-primary hover:text-white transition-all">
                                            <FileText className="w-3.5 h-3.5" />
                                            Syllabus
                                        </Button>
                                        <Button variant="ghost" size="sm" className="flex-1 gap-2 text-xs font-bold hover:bg-primary hover:text-white transition-all">
                                            <Video className="w-3.5 h-3.5" />
                                            Digital Lab
                                        </Button>
                                        <Button size="sm" className="w-10 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-white transition-all p-0">
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
