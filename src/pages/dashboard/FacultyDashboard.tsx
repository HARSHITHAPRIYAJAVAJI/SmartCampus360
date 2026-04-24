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
    Zap,
    Search,
    UserCheck,
    FileEdit,
    ExternalLink
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { YEAR_IN_CHARGES, CLASS_TEACHERS } from "@/data/mockHierarchy";

import { useNavigate, useOutletContext } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { FACULTY_LOAD, getTimetable, AIML_TIMETABLES } from "@/data/aimlTimetable";
import { MOCK_COURSES } from "@/data/mockCourses";
import { format } from "date-fns";
import { formatSubjectName, SUBJECT_MAPPING } from "@/data/subjectMapping";
import { cn } from "@/lib/utils";

import { MOCK_FACULTY } from "@/data/mockFaculty";
import { dataPersistence } from "@/utils/dataPersistence";

export default function FacultyDashboard({ facultyId: propFacultyId }: { facultyId?: string }) {
    const navigate = useNavigate();
    const { user: authUser } = useOutletContext<{ user: { name: string, id: string, role: string } }>();

    // If facultyId is provided (e.g. from admin view), use that faculty's data
    const impersonatedFaculty = useMemo(() => {
        const idToSearch = propFacultyId;
        if (!idToSearch) return null;
        const all = dataPersistence.getAllFaculty();
        return all.find(f => f.id === idToSearch || f.rollNumber === idToSearch);
    }, [propFacultyId]);

    const activeFacultyRecord = useMemo(() => {
        const idToSearch = propFacultyId || authUser?.id;
        if (!idToSearch) return null;
        const all = dataPersistence.getAllFaculty();
        return all.find(f => f.id === idToSearch || f.rollNumber === idToSearch);
    }, [propFacultyId, authUser]);

    // Check for soft delete
    useEffect(() => {
        if (activeFacultyRecord && activeFacultyRecord.is_active === false && !propFacultyId) {
            // If they are soft deleted and trying to access THEIR dashboard
            navigate('/unauthorized'); // Or some exit page
        }
    }, [activeFacultyRecord, propFacultyId, navigate]);

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

    const cleanSpecializations = useMemo(() => {
        if (!facultyData?.specialization) return [];
        // Deduplicate
        const raw = Array.from(new Set(facultyData.specialization));
        
        // Filter out abbreviations if full name is present
        const fullNames = raw.map(s => SUBJECT_MAPPING[s] || s);
        return Array.from(new Set(fullNames)).filter(s => s && s.trim() !== "");
    }, [facultyData?.specialization]);


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
        const facultyDuties = allInvigs.filter(duty => 
            duty.date === todayStr && 
            duty.facultyName.toLowerCase().includes(user.name.toLowerCase())
        );

        if (facultyDuties.length === 0) return null;

        const parseTimeStr = (tStr: string) => {
            const match = tStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
            if (!match) return new Date();
            let [_, hours, minutes, modifier] = match;
            let h = parseInt(hours);
            const m = parseInt(minutes);
            if (modifier.toUpperCase() === 'PM' && h < 12) h += 12;
            if (modifier.toUpperCase() === 'AM' && h === 12) h = 0;
            const d = new Date();
            d.setHours(h, m, 0, 0);
            return d;
        };

        const now = new Date();
        return facultyDuties.find(duty => {
            try {
                const parts = duty.time.split(' - ');
                const endTime = parseTimeStr(parts[1] || parts[0]);
                // Keep showing for 30 mins after end
                const expiry = new Date(endTime.getTime() + 30 * 60000);
                return now < expiry;
            } catch (e) {
                return true;
            }
        });
    }, [user.name, storageSyncStamp]);

    const isDutyActive = useMemo(() => {
        if (!todayInvigilation) return false;
        const parseTimeStr = (tStr: string) => {
            const match = tStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
            if (!match) return new Date();
            let [_, hours, minutes, modifier] = match;
            let h = parseInt(hours);
            const m = parseInt(minutes);
            if (modifier.toUpperCase() === 'PM' && h < 12) h += 12;
            if (modifier.toUpperCase() === 'AM' && h === 12) h = 0;
            const d = new Date();
            d.setHours(h, m, 0, 0);
            return d;
        };

        try {
            const parts = todayInvigilation.time.split(' - ');
            const startTime = parseTimeStr(parts[0]);
            const endTime = parseTimeStr(parts[1] || parts[0]);
            const now = new Date();
            return now >= startTime && now <= endTime;
        } catch (e) {
            return false;
        }
    }, [todayInvigilation]);

    const todaySchedule = useMemo(() => {
        const schedule: any[] = [];
        const nameToMatch = user.name;
        const idToMatch = user.id;

        const allTimetablesToProcess: Record<string, any> = {};
        Object.keys(AIML_TIMETABLES).forEach(key => {
            allTimetablesToProcess[key] = AIML_TIMETABLES[key];
        });

        const publishedStoreStr = localStorage.getItem('published_timetables');
        const publishedTimetables = publishedStoreStr ? JSON.parse(publishedStoreStr) : {};
        Object.keys(publishedTimetables).forEach(key => {
            const entry = publishedTimetables[key];
            if (entry) allTimetablesToProcess[key] = entry.grid || entry;
        });

        const savedRequests = localStorage.getItem('FACULTY_REQUESTS');
        const approvedRequests = savedRequests ? JSON.parse(savedRequests).filter((r: any) => 
            r.status === 'approved' && r.date === todayISO
        ) : [];

        const faculty = MOCK_FACULTY.find(f => f.id === user.id || f.rollNumber === user.id);
        const facultyDept = faculty?.department || "";

        const courseNameMap: Record<string, string> = {};
        MOCK_COURSES.forEach(c => {
            courseNameMap[c.code] = c.name;
            courseNameMap[c.code.replace(' Lab', '').trim()] = c.name;
        });

        Object.entries(allTimetablesToProcess).forEach(([key, table]: [string, any]) => {
            const parts = key.split('-');
            const dept = parts[0];
            const yearStr = parts[1];
            const semStr = parts[2];
            const section = parts.length > 3 ? parts[3] : 'A';

            const deptKey = `${dept}-${yearStr}-${semStr}`;
            const semKey = `${yearStr}-${semStr}`;
            const load = (FACULTY_LOAD[deptKey as keyof typeof FACULTY_LOAD] || 
                         FACULTY_LOAD[semKey as keyof typeof FACULTY_LOAD] || []) as any[];

            Object.entries(table).forEach(([dayTime, session]: [string, any]) => {
                if (!session) return;
                let [day, time] = dayTime.split('-');
                if (day !== today) return;
                if (semStr !== "1") return; // Current system term

                const amISubstituting = approvedRequests.find((r: any) => {
                   const rStartTime = r.period?.split('-')[0];
                   const isMatchingSlot = (r.period === time || r.period.startsWith(time) || rStartTime === time);
                   return isMatchingSlot && r.section === key && (r.targetId === idToMatch || r.targetName?.toLowerCase() === nameToMatch.toLowerCase());
                });

                const amIBeingReplaced = approvedRequests.find((r: any) => {
                   const rStartTime = r.period?.split('-')[0];
                   const isMatchingSlot = (r.period === time || r.period.startsWith(time) || rStartTime === time);
                   return isMatchingSlot && r.section === key && (r.senderId === idToMatch || r.senderName?.toLowerCase() === nameToMatch.toLowerCase());
                });

                let isMe = !!amISubstituting;
                let displayFaculty = session.faculty || "Staff";
                if (amISubstituting) displayFaculty = nameToMatch;
                else if (amIBeingReplaced) displayFaculty = amIBeingReplaced.targetName;

                if (!isMe) {
                    // 1. Strict ID Match
                    isMe = (session.facultyId === idToMatch) || 
                           (session.facultyIds && session.facultyIds.includes(idToMatch));
                    
                    if (!isMe) {
                        const normalizedTarget = nameToMatch.toLowerCase().replace('.', '').trim();
                        const normalizedFaculty = (session.faculty || "").toLowerCase().replace('.', '').trim();
                        
                        // 2. Strict Name Match (Full name only)
                        if (normalizedFaculty && (normalizedFaculty === normalizedTarget)) {
                            isMe = true;
                        } else if (session.room) {
                            const normalizedRoom = session.room.toLowerCase().replace('.', '').trim();
                            // Only match room if it's an exact match to faculty name (fallback for legacy data)
                            if (normalizedRoom === normalizedTarget) {
                                isMe = true;
                            }
                        }

                        // 3. FACULTY_LOAD Match (Specific to subject code)
                        if (!isMe) {
                            const rawSubject = session.courseName || session.courseCode || session.subject || "Unknown";
                            const cleanCode = rawSubject.split(' (')[0].trim();
                            const matchesLoad = load.some(l => 
                                l.code === cleanCode && 
                                (l.id === idToMatch || (l.faculty && l.faculty.toLowerCase().replace('.', '').trim() === normalizedTarget))
                            );
                            if (matchesLoad) isMe = true;
                        }
                    }
                }

                if (isMe) {
                    const rawSubject = session.courseName || session.courseCode || session.subject || "Unknown";
                    const cleanCode = rawSubject.split(' (')[0].trim();
                    const fullName = courseNameMap[cleanCode] || cleanCode;
                    const hourStr = time.split(':')[0];
                    const hour = parseInt(hourStr);
                    const period = (hour >= 9 && hour < 12) ? "AM" : "PM";
                    
                    schedule.push({
                        id: `${key}-${dayTime}`,
                        time: `${time} ${period}`,
                        rawTime: time,
                        title: amIBeingReplaced ? `${formatSubjectName(fullName)} (Sec ${section}) - Handed to ${amIBeingReplaced.targetName}` : 
                               (amISubstituting ? `${formatSubjectName(fullName)} (Sec ${section}) - Substitution` : 
                                `${formatSubjectName(fullName)} (Sec ${section})`),
                        room: (session.room && (session.room.includes("Mrs.") || session.room.includes("Dr."))) ? "TBD" : (session.room || "TBD"),
                        type: (fullName || '').toLowerCase().includes('lab') ? 'lab' : 'lecture',
                        status: amIBeingReplaced ? 'transferred' : 'active',
                        isOverride: !!amISubstituting || !!amIBeingReplaced,
                        dept, year: yearStr, section, code: cleanCode
                    });
                }
            });
        });

        // Add any approved requests as fallbacks
        approvedRequests.forEach(req => {
            if (req.targetId === idToMatch || req.targetName?.toLowerCase() === nameToMatch.toLowerCase()) {
                const cleanTime = req.period?.split('-')[0] || req.period;
                if (!schedule.find(s => s.rawTime === cleanTime)) {
                   const hour = parseInt(cleanTime.split(':')[0]);
                   schedule.push({
                       id: `req-${req.id}`, time: `${cleanTime} ${hour < 12 ? 'AM' : 'PM'}`, rawTime: cleanTime,
                       title: `${req.type === 'swap' ? 'Swapped' : 'Replacement'} Class`,
                       room: req.room || "TBD", type: 'lecture', status: 'active', isOverride: true,
                       dept: req.branch || 'N/A', year: req.year || 'N/A', section: req.sectionName || 'A', code: req.subject || 'SUB'
                   });
                }
            }
        });

        const mergedSchedule: any[] = [];
        const sortedTemp = schedule.sort((a, b) => {
            const getM = (s: string) => {
                const t = s.split(' ')[0];
                let [h, m] = t.split(':').map(Number);
                if (s.includes('PM') && h !== 12) h += 12;
                if (s.includes('AM') && h === 12) h = 0;
                return h * 60 + m;
            };
            return getM(a.time) - getM(b.time);
        });

        for (let i = 0; i < sortedTemp.length; i++) {
            const current = sortedTemp[i];
            const last = mergedSchedule[mergedSchedule.length - 1];
            if (last && last.code === current.code && last.section === current.section && last.dept === current.dept) {
                const getM = (s: string) => {
                    const t = s.split(' ')[0];
                    let [h, m] = t.split(':').map(Number);
                    if (s.includes('PM') && h !== 12) h += 12;
                    return h * 60 + m;
                };
                const lastEnd = getM(last.time.includes(' - ') ? last.time.split(' - ')[1] : last.time) + 60;
                const currentStart = getM(current.time);
                if (currentStart - lastEnd <= 1 || (last.rawTime.startsWith("11:40") && current.rawTime.startsWith("01:20"))) {
                    const [currTime, currAMPM] = current.time.split(' ');
                    const [curH, curM] = currTime.split(':').map(Number);
                    let endH = curH + 1;
                    if (endH > 12) endH -= 12;
                    last.time = `${last.time.split(' - ')[0]} - ${endH.toString().padStart(2, '0')}:${curM.toString().padStart(2, '0')} ${currAMPM}`;
                    continue;
                }
            }
            const [tOnly, amp] = current.time.split(' ');
            const [h, m] = tOnly.split(':').map(Number);
            let eH = h + 1;
            if (eH > 12) eH -= 12;
            current.time = `${tOnly} - ${eH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${amp}`;
            mergedSchedule.push(current);
        }
        return mergedSchedule;
    }, [user.name, user.id, today, todayISO, storageSyncStamp]);
    
    const currentSession = useMemo(() => {
        const now = new Date();
        const currentM = now.getHours() * 60 + now.getMinutes();
        
        return todaySchedule.find(s => {
            if (s.status === 'transferred') return false;
            // Parse time range like "09:40 - 11:40 AM"
            try {
                const [startPart, endFull] = s.time.split(' - ');
                const isPM = endFull.includes('PM');
                const [startH, startM] = startPart.split(':').map(Number);
                const [endPart, ampm] = endFull.split(' ');
                const [endH, endM] = endPart.split(':').map(Number);

                let sMin = startH * 60 + startM;
                let eMin = endH * 60 + endM;
                
                // Adjust for PM
                if (isPM) {
                    if (startH < 12) sMin += 720;
                    if (endH < 12) eMin += 720;
                }

                return currentM >= sMin && currentM <= eMin;
            } catch (e) { return false; }
        });
    }, [todaySchedule]);

    const stats = useMemo(() => {
        const allStudents = dataPersistence.getStudents();
        const myStudents = (classTeacherSection.length > 0 || yearInChargeInfo.length > 0)
            ? allStudents.filter(s => {
                const isClassStudent = classTeacherSection.some(ct => ct.year === s.year && ct.branch === s.branch && ct.section === s.section);
                const isYearStudent = yearInChargeInfo.some(yic => yic.year === s.year && yic.branch === s.branch);
                return isClassStudent || isYearStudent;
            })
            : [];

        // Dynamic Student Count
        const studentCount = myStudents.length || allStudents.length;
        
        // Logical "Pending Grades" calculation
        // Check if any course taught by this faculty has missing marks for the current semester
        // For simplicity in mock, we'll check if any 'CSM' student has missing Mid2
        const pendingCount = myStudents.filter(s => (s.attendance % 7 === 0)).length || 12;

        return [
            { title: "My Classes", value: todaySchedule.filter(s => s.status !== 'transferred').length.toString(), icon: BookOpen, change: "Today", color: "text-primary" },
            { title: "Students", value: studentCount.toString(), icon: Users, change: "Allocated", color: "text-success" },
            { title: "Pending Grades", value: pendingCount.toString(), icon: FileText, change: "Due Soon", color: "text-warning" },
            { title: "Attendance Balance", value: "92%", icon: CheckCircle, change: "This Week", color: "text-accent" },
        ];
    }, [todaySchedule, classTeacherSection, yearInChargeInfo]);

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
        { title: "Student Data", description: "Filter branches, view attendance", action: () => navigate('/dashboard/students'), icon: Search },
        { title: "Attendance", description: "Mark session presence", action: () => navigate('/dashboard/students'), icon: UserCheck },
        { title: "Grades", description: "Modify student marks", action: () => navigate('/dashboard/students'), icon: FileEdit },
        { title: "Leave Request", description: "Apply for substitution", action: () => navigate('/dashboard/leave'), icon: ExternalLink },
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

            {/* Top Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="group"
                    >
                        <Card className="border-none shadow-premium rounded-[2.5rem] overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl group-hover:shadow-2xl transition-all h-full cursor-pointer border border-white/50 dark:border-slate-800/50" onClick={() => navigate(stat.title === "My Classes" ? '/dashboard/classes' : '/dashboard/students')}>
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={cn("p-4 rounded-3xl bg-muted/50 group-hover:bg-primary group-hover:text-white transition-all duration-500", stat.color)}>
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <Badge variant="outline" className="text-[10px] font-black border-primary/20 text-primary uppercase px-3 py-1 rounded-full">{stat.change}</Badge>
                                    </div>
                                </div>
                                <div className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2">{stat.value}</div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.title}</div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column (Profiles & Identity) */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Quick Access Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {quickActions.map((action, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={action.action}
                                className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col items-start gap-4 h-full"
                            >
                                <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                    {action.icon && <action.icon className="h-5 w-5" />}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-black tracking-tight text-[11px] uppercase group-hover:text-primary transition-colors">{action.title}</h3>
                                    <p className="text-[9px] font-medium text-slate-500 leading-tight">{action.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Professional Identity */}
                    <Card className="border-none shadow-premium rounded-[2.5rem] overflow-hidden bg-white/50 dark:bg-slate-900/50 border border-white/20">
                        <CardHeader className="bg-muted/30 border-b p-7">
                            <CardTitle className="text-lg flex items-center gap-3 font-black tracking-tighter">
                                <UserCircle className="w-6 h-6 text-primary" />
                                Professional Identity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-7 space-y-6">
                            {[
                                { label: "Institutional Email", value: profileData.email, icon: Mail },
                                { label: "Emergency Phone", value: profileData.phone, icon: Smartphone },
                                { label: "Reporting To", value: "Dean Academic Affairs", icon: ShieldCheck },
                                { label: "Work Location", value: currentSession ? `Classroom ${currentSession.room}` : "Faculty Block C, Room 402", icon: MapPin },
                            ].map((info, i) => (
                                <div key={i} className="flex items-center gap-4 group/item">
                                    <div className="p-3 rounded-2xl bg-white dark:bg-black/20 text-muted-foreground group-hover/item:text-primary shadow-sm border border-slate-50 dark:border-slate-800 transition-all">
                                        <info.icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest opacity-70">{info.label}</span>
                                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{info.value}</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Expertise Area (Left Column Part) */}
                    {cleanSpecializations.length > 0 && (
                        <Card className="border-none shadow-premium rounded-[2.5rem] bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-100/50">
                            <CardHeader className="p-7">
                                <CardTitle className="text-lg font-black tracking-tighter flex items-center gap-3 text-indigo-600">
                                    <BookOpen className="w-6 h-6 " />
                                    Expertise Area
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-7 pt-0">
                                <div className="flex flex-wrap gap-2.5">
                                    {cleanSpecializations.map((subject, idx) => (
                                        <Badge key={idx} variant="secondary" className="bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 hover:bg-white border-none font-bold px-4 py-2 rounded-xl shadow-sm text-[10px] uppercase tracking-wide">
                                            {subject}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column (Core Dashboards) */}
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
                                <CardContent className="p-10">
                                    <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
                                        <div className="flex gap-6 items-center">
                                            <div className={`h-20 w-20 rounded-[2rem] ${isDutyActive ? 'bg-amber-500/20' : 'bg-blue-500/20'} flex items-center justify-center shrink-0`}>
                                                <div className="relative">
                                                    <Users className={`h-10 w-10 ${isDutyActive ? 'text-amber-600' : 'text-blue-600'}`} />
                                                    {isDutyActive && (
                                                        <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-600 border-4 border-white animate-ping" />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Badge className={`${isDutyActive ? 'bg-amber-600 animate-pulse' : 'bg-blue-600'} text-white border-none text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5`}>
                                                    Invigilation Duty {isDutyActive ? "ACTIVE" : "UPCOMING"}
                                                </Badge>
                                                <h3 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
                                                    Exam Hall {todayInvigilation.room}
                                                </h3>
                                                <div className="flex items-center gap-4 text-xs font-black text-slate-500 uppercase tracking-widest">
                                                    <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {todayInvigilation.date}</span>
                                                    <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {todayInvigilation.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 w-full lg:w-auto">
                                            <Button variant="outline" className={`flex-1 lg:flex-none rounded-2xl border-2 border-${isDutyActive ? 'amber' : 'blue'}-200 text-${isDutyActive ? 'amber' : 'blue'}-600 font-black uppercase text-[10px] tracking-widest h-14 px-8`}>
                                                Roster
                                            </Button>
                                            <Button className={`flex-1 lg:flex-none rounded-2xl ${isDutyActive ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'} text-white font-black uppercase text-[10px] tracking-widest h-14 px-10 shadow-2xl`}>
                                                {isDutyActive ? 'Check In' : 'View Details'}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Incoming Requests Alert */}
                    {incomingRequests.length > 0 && (
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative group overflow-hidden rounded-[3rem] bg-gradient-to-br from-indigo-600 to-violet-700 p-8 shadow-2xl shadow-indigo-600/30"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                                <Bell className="h-40 w-40 text-white" />
                            </div>
                            
                            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex items-center gap-8">
                                    <div className="h-20 w-20 rounded-[2rem] bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                                        <ShieldCheck className="h-10 w-10 text-white animate-pulse" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Badge className="bg-white text-indigo-700 hover:bg-white border-none text-[10px] font-black uppercase tracking-widest px-5 h-7">
                                            {incomingRequests.length} New Broadcast Request{incomingRequests.length > 1 ? 's' : ''}
                                        </Badge>
                                        <h2 className="text-3xl font-black text-white tracking-tighter">
                                            Academic Support Required
                                        </h2>
                                        <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest opacity-80">
                                            Peers in your branch have requested swaps. Action needed.
                                        </p>
                                    </div>
                                </div>
                                <Button 
                                    onClick={() => navigate('/dashboard/leave')}
                                    className="bg-white text-indigo-600 hover:bg-indigo-50 font-black rounded-2xl h-16 px-12 shadow-xl shadow-black/10 transition-all active:scale-95 group-hover:scale-105"
                                >
                                    Review & Respond
                                    <TrendingUp className="ml-2 h-5 w-5" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Today's Schedule Card */}
                    <Card className="border-none shadow-premium rounded-[3rem] overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-slate-100 dark:border-slate-800">
                        <CardHeader className="p-10 pb-6 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase px-4 py-1.5 rounded-full">Academic Schedule</Badge>
                                        {currentSession && <Badge className="bg-emerald-500 text-white animate-pulse border-none text-[9px] font-black uppercase px-4 py-1.5 rounded-full">In Session</Badge>}
                                    </div>
                                    <CardTitle className="text-3xl font-black tracking-tighter flex items-center gap-4">
                                        <Calendar className="h-8 w-8 text-primary" />
                                        Today's Academic Briefing
                                    </CardTitle>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">{today}, {format(new Date(), "do MMMM")}</p>
                                </div>
                                <Button 
                                    variant="outline"
                                    onClick={() => navigate('/dashboard/timetable')}
                                    className="rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] border-2 h-12 px-8 hover:bg-slate-50 transition-all"
                                >
                                    Master Schedule
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10 pt-8">
                            <div className="space-y-6">
                                {todaySchedule.length > 0 ? todaySchedule.map((item, index) => (
                                    <motion.div 
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={cn(
                                            "group flex flex-col md:flex-row items-center justify-between p-7 rounded-[2.5rem] transition-all border border-transparent",
                                            item.isOverride ? "bg-indigo-50/80 border-indigo-200/50 dark:bg-indigo-900/30" : "bg-slate-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl hover:scale-[1.02]",
                                            item.status === 'transferred' && "opacity-40 grayscale"
                                        )}
                                    >
                                        <div className="flex items-center gap-8 w-full md:w-auto">
                                            <div className="h-20 w-20 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center p-2 shadow-inner group-hover:scale-110 transition-transform">
                                                <span className="font-black text-[10px] text-primary leading-tight text-center">{item.time.replace(' ', '\n')}</span>
                                            </div>
                                            <div className="space-y-1.5 text-center md:text-left">
                                                <h3 className="font-black text-xl tracking-tighter flex flex-col md:flex-row items-center gap-3">
                                                    {item.title}
                                                    {item.isOverride && <Badge className="text-[9px] h-5 bg-indigo-500 text-white rounded-lg">Substitute Session</Badge>}
                                                </h3>
                                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/80 dark:bg-black/20 px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                                                        <MapPin className="h-3.5 w-3.5 text-primary" /> Hall {item.room}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/80 dark:bg-black/20 px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                                                        <BookOpen className="h-3.5 w-3.5 text-primary" /> {item.code}
                                                    </div>
                                                    <Badge variant={item.type === "lecture" ? "outline" : "secondary"} className="rounded-xl px-5 py-2 font-black text-[9px] uppercase tracking-widest border-2">
                                                        {item.type}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4 mt-6 md:mt-0 w-full md:w-auto flex-col md:flex-row">
                                            {item.status !== 'transferred' ? (
                                                <Button 
                                                    className="w-full md:w-auto rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-widest h-14 px-10 shadow-lg shadow-primary/20 transition-all hover:px-12"
                                                    onClick={() => navigate(`/dashboard/students?dept=${item.dept}&year=${item.year}&section=${item.section}&course=${item.code}&mode=attendance`)}
                                                >
                                                    Mark Attendance
                                                </Button>
                                            ) : (
                                                <Badge variant="destructive" className="font-black text-[9px] uppercase px-6 py-3 rounded-2xl">Handed Over</Badge>
                                            )}
                                        </div>
                                    </motion.div>
                                )) : (
                                    <div className="flex flex-col items-center justify-center py-20 bg-muted/10 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                                        <Calendar className="h-16 w-16 mb-6 text-muted-foreground/30" />
                                        <h3 className="font-black text-xl text-muted-foreground uppercase tracking-widest">No Scheduled Classes</h3>
                                        <p className="text-sm font-medium text-muted-foreground mt-2">Enjoy your teaching-free window!</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Multi-Column Grid for Reorganized Widgets */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Institutional Records (Moved to Right) */}
                        <Card className="border-none shadow-premium rounded-[2.5rem] overflow-hidden bg-white/50 dark:bg-slate-900/50 border border-white/20 h-full">
                            <CardHeader className="bg-muted/10 border-b p-7">
                                <CardTitle className="text-lg flex items-center gap-3 font-black tracking-tighter text-emerald-600">
                                    <History className="w-6 h-6" />
                                    Institutional History
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-7">
                                <div className="grid grid-cols-2 gap-4">
                                    {infoCards.map((card, i) => (
                                        <div key={i} className={`p-4 rounded-3xl ${card.bg} border border-transparent hover:border-black/5 transition-all group shrink-0`}>
                                            <div className={`p-2.5 rounded-xl bg-white dark:bg-black/20 ${card.color} shadow-sm w-fit mb-3 group-hover:scale-110 transition-transform`}>
                                                <card.icon className="w-4 h-4" />
                                            </div>
                                            <div className="text-[9px] uppercase font-black text-muted-foreground/60 tracking-tighter mb-1">{card.label}</div>
                                            <div className="text-xs font-black text-slate-900 dark:text-slate-100">{card.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Performing Students Widget */}
                        <Card className="border-none shadow-premium rounded-[2.5rem] overflow-hidden bg-white/50 dark:bg-slate-900/50 border border-white/20 flex flex-col">
                            <CardHeader className="bg-muted/10 border-b p-7">
                                <CardTitle className="text-lg flex items-center gap-3 font-black tracking-tighter text-amber-600">
                                    <Award className="w-6 h-6" />
                                    Student Performance
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-7 flex-1">
                                <div className="space-y-4">
                                     {dataPersistence.getStudents().filter(s => (classTeacherSection.length > 0 ? (classTeacherSection.some(ct => ct.year === s.year && ct.branch === s.branch && ct.section === s.section)) : (s.branch === profileData.dept))).slice(0, 4).sort((a,b) => b.grade - a.grade).map((s, idx) => (
                                         <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-black/20 rounded-2xl border border-black/5 hover:border-primary/20 transition-all cursor-pointer group/st" onClick={() => navigate(`/dashboard/students?q=${s.rollNumber}`)}>
                                             <div className="flex items-center gap-3">
                                                 <div className="h-10 w-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center font-black text-xs">
                                                     {s.name.charAt(0)}
                                                 </div>
                                                 <div>
                                                     <div className="text-[11px] font-black tracking-tight">{s.name}</div>
                                                     <div className="text-[9px] font-bold text-muted-foreground uppercase">{s.rollNumber}</div>
                                                 </div>
                                             </div>
                                             <div className="flex items-center gap-2">
                                                 <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-none font-black text-[10px]">
                                                     {s.grade.toFixed(2)}
                                                 </Badge>
                                             </div>
                                         </div>
                                     ))}
                                     <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 mt-2" onClick={() => navigate('/dashboard/students')}>
                                         View Full Analytics →
                                     </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Resource Hub (Full-Width) */}
                        <Card className="md:col-span-2 border-none shadow-premium rounded-[3rem] bg-slate-900 dark:bg-slate-950 p-10 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-700">
                                <Zap className="w-64 h-64" />
                            </div>
                            <CardContent className="p-0 flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                                <div className="space-y-4 text-center md:text-left">
                                    <Badge className="bg-white/10 text-white border-none text-[10px] font-black uppercase px-5 py-2 rounded-full">Academic Central</Badge>
                                    <h3 className="text-4xl font-black tracking-tighter">Institutional Resource Repository</h3>
                                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest leading-relaxed">Centralized access to question banks, lesson plans, research portals, and digital archives.</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                                    {[
                                        { label: "Syllabus Plan", icon: FileText, color: "bg-blue-500" },
                                        { label: "Question Bank", icon: BookOpen, color: "bg-emerald-500" },
                                        { label: "LMS Portal", icon: Globe, color: "bg-indigo-500" },
                                        { label: "Research Gate", icon: Zap, color: "bg-amber-500" }
                                    ].map((tool, i) => (
                                        <Button key={i} className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl h-24 w-full md:w-32 flex flex-col items-center justify-center gap-2 group/btn transition-all">
                                            <div className={cn("p-2 rounded-lg text-white", tool.color)}>
                                                <tool.icon className="w-5 h-5 group-hover/btn:scale-125 transition-transform" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-tighter">{tool.label}</span>
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
