import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Plus, Edit, Filter, BookOpen, User, Building2, Wand2, FileText, ShieldCheck, UserCheck, Printer, Mail, Phone, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EXAM_BRANCHES, ExamTimetable } from "@/utils/examTimetableGenerator";
import { SeatingAssignment, InvigilationDuty } from "@/data/examData";
import { useOutletContext } from "react-router-dom";
import { AIML_TIMETABLES, FACULTY_LOAD, getTimetable } from "@/data/aimlTimetable";
import { MOCK_STUDENTS } from "@/data/mockStudents";
import { MOCK_FACULTY } from "@/data/mockFaculty";
import { MOCK_COURSES } from "@/data/mockCourses";
import { formatSubjectName, getSubjectAbbreviation } from "@/data/subjectMapping";

interface TimetableProps {
  userRole?: string;
}

export default function Timetable({ userRole: propRole }: TimetableProps) {
  const { user } = useOutletContext<{ user: { id: string, name: string, role: string } }>();
  const [activeTab, setActiveTab] = useState('academic');
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const userRole = propRole || user?.role || "student";

  const [storageSyncStamp, setStorageSyncStamp] = useState(0);
  useEffect(() => {
      const handleStorage = (e: StorageEvent) => {
          const keys = ['published_timetables', 'EXAM_TIMETABLES', 'EXAM_SEATING_PLAN', 'INVIGILATION_LIST', 'EXAM_SCHEDULE'];
          if (keys.includes(e.key || '')) {
              setStorageSyncStamp(s => s + 1);
          }
      };
      window.addEventListener('storage', handleStorage);
      const handleCustomEvent = () => setStorageSyncStamp(s => s + 1);
      window.addEventListener('timetable_published', handleCustomEvent);
      window.addEventListener('exams_updated', handleCustomEvent);
      window.addEventListener('faculty_request_updated', handleCustomEvent);
      
      return () => {
          window.removeEventListener('storage', handleStorage);
          window.removeEventListener('timetable_published', handleCustomEvent);
          window.removeEventListener('faculty_request_updated', handleCustomEvent);
      };
  }, []);
  
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const timeSlots = ["09:40", "10:40", "11:40", "12:40", "01:20", "02:20", "03:20"];

  const student = useMemo(() => MOCK_STUDENTS.find(s => s.rollNumber.toUpperCase() === user.id.toUpperCase()), [user.id]);

  const processedData = useMemo(() => {
    if (userRole === "student") {
      if (!student) return {};

      const semNum = selectedSemester % 2 === 0 ? 2 : 1;
      
      // Resolve which source of truth to use
      const publishedStoreStr = localStorage.getItem('published_timetables');
      const allTimetables = publishedStoreStr ? JSON.parse(publishedStoreStr) : null;
      const strictPublishedKey = `${(student.branch || "").toUpperCase()}-${student.year}-${semNum}-${student.section}`;
      
      let publishedEntry = allTimetables ? allTimetables[strictPublishedKey] : null;

      // Logic: Prioritize the specific published entry, fallback to institutional defaults ONLY on initial boot before any publishing happens.
      const useDemoData = publishedStoreStr === null;
      const liveTable = publishedEntry?.grid || 
                        (publishedEntry && !publishedEntry.metadata ? publishedEntry : {});
      const liveMetadata = publishedEntry?.metadata || null;

      const result: any = { slots: {}, metadata: liveMetadata };
      Object.entries(liveTable).forEach(([dayTime, session]: [string, any]) => {
        if (!session) return;
        let [day, time] = dayTime.split('-');
        const timeMap: Record<string, string> = { "09:30": "09:40", "10:30": "10:40", "11:40": "11:40", "01:30": "01:20", "02:30": "02:20", "03:30": "03:20" };
        time = timeMap[time] || time;
        if (!result.slots[day]) result.slots[day] = {};

        // Find faculty for this session
        const facultyLoadKey = `${student.branch}-${student.year}-${semNum}`;
        const genericLoadKey = `${student.year}-${semNum}`;
        const currentLoad = (FACULTY_LOAD[facultyLoadKey as keyof typeof FACULTY_LOAD] || 
                           FACULTY_LOAD[genericLoadKey as keyof typeof FACULTY_LOAD]) as any[];
        
        const loadInfo = currentLoad?.find(l => l.code === session.courseCode);

        const fullName = formatSubjectName(session.courseName || session.courseCode);
        const abbrev = getSubjectAbbreviation(session.courseName || session.courseCode);

        // Check for a substitution for this specific date/time for the student's section
        const savedRequests = localStorage.getItem('FACULTY_REQUESTS');
        const approvedRequests = savedRequests ? JSON.parse(savedRequests).filter((r: any) => 
          r.status === 'approved' && 
          (r.type === 'replacement' || r.type === 'swap')
        ) : [];

        const currentSubstitution = approvedRequests.find((r: any) => {
           const rDate = new Date(r.date);
           const rDayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][rDate.getDay()];
           const rStartTime = r.period?.split('-')[0];
           const revMap: any = { "09:40": "09:30", "10:40": "10:30", "11:40": "11:40", "01:20": "01:30", "02:20": "02:30", "03:20": "03:30" };
           return rDayName === day && (r.period === time || rStartTime === (revMap[time] || time));
        });

        const displayFaculty = currentSubstitution ? currentSubstitution.targetName : (session.faculty || loadInfo?.faculty || "Staff");

        const isCRT = (session.courseName || session.courseCode || "").toLowerCase().includes('crt');

        result.slots[day][time] = {
          subject: abbrev,
          fullName: fullName,
          courseCode: session.courseCode,
          room: session.room || loadInfo?.room || "TBD",
          faculty: displayFaculty,
          isSubstituted: !!currentSubstitution,
          type: isCRT ? 'crt' : (session.courseName || session.courseCode || "").toLowerCase().includes('lab') ? 'lab' : 'lecture',
          duration: 1,
          isLive: !!publishedEntry
        };
      });
      return result;
    } else if (userRole === "faculty") {
      const facultyName = user.name;
      const facultyId = user.id;

      // Create a map for course name lookup to avoid confusing codes
      const courseNameMap: Record<string, string> = {};
      MOCK_COURSES.forEach(c => {
        courseNameMap[c.code] = c.name;
        courseNameMap[c.code.replace(' Lab', '').trim()] = c.name;
      });

      // Resolve which source of truth to use - dynamically fetch all 4 branches without overlapping duplicates
      const publishedStoreStr = localStorage.getItem('published_timetables');
      const publishedTimetables = publishedStoreStr ? JSON.parse(publishedStoreStr) : {};
      
      const allTimetablesToProcess: Record<string, any> = {};
      const branches = ["CSM", "CSE", "IT", "ECE"];
      const years = [1, 2, 3, 4];
      const sections = ["A", "B", "C"];
      
      branches.forEach(branch => {
          years.forEach(year => {
              sections.forEach(section => {
                  const publishedKey = `${branch}-${year}-${selectedSemester}-${section}`;
                  const publishedEntry = publishedTimetables[publishedKey];
                  if (publishedEntry) {
                      allTimetablesToProcess[publishedKey] = publishedEntry.grid || publishedEntry;
                  }
              });
          });
      });

      const facultyResult: any = { slots: {}, metadata: null };

      Object.entries(allTimetablesToProcess).forEach(([key, table]: [string, any]) => {
        const [dept, year, sem, section] = key.split('-');

        const semKey = `${year}-${sem}`;
        const load = (FACULTY_LOAD[semKey as keyof typeof FACULTY_LOAD] || []) as any[];
        // Load Approved Substitutions/Swaps
        const savedRequests = localStorage.getItem('FACULTY_REQUESTS');
        const approvedRequests = savedRequests ? JSON.parse(savedRequests).filter((r: any) => 
          r.status === 'approved' && 
          (r.type === 'replacement' || r.type === 'swap')
        ) : [];
        
        Object.entries(table).forEach(([dayTime, session]: [string, any]) => {
          if (!session) return;
          const [day, time] = dayTime.split('-');
          
          // Check for a substitution ONLY IF this session's faculty matches the leave-taker
          const currentSubstitution = approvedRequests.find((r: any) => {
             const rDate = new Date(r.date);
             const rDayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][rDate.getDay()];
             const isMatchingSlot = rDayName === day && r.period === time && r.section === key;
             const isReplacingThisFaculty = r.senderId === session.facultyId || 
                                           (session.faculty && r.senderName && session.faculty.toLowerCase().includes(r.senderName.toLowerCase()));
             return isMatchingSlot && isReplacingThisFaculty;
          });

          let isAssigned = false;
          let displayFaculty = session.faculty || "Staff";
          let isSubstituted = !!currentSubstitution;

          if (isSubstituted && currentSubstitution) {
             displayFaculty = currentSubstitution.targetName;
          }

          // 1. ID-BASED MATCHING ONLY for the viewer (if they are the leave-taking faculty)
          if (!isAssigned && session.facultyId && facultyId) {
            isAssigned = session.facultyId === facultyId || session.originalFacultyId === facultyId;
          } 
          if (!isAssigned && session.facultyIds && session.facultyIds.includes(facultyId)) {
              isAssigned = true;
          }

          // 2. NAME-BASED MATCHING (More inclusive matching for multi-departmental support)
          if (!isAssigned) {
            const normalizedFaculty = (session.faculty || "").toLowerCase();
            const normalizedTarget = facultyName.toLowerCase();

            if (normalizedTarget && (
                (normalizedFaculty && (normalizedFaculty.includes(normalizedTarget) || normalizedTarget.includes(normalizedFaculty))) ||
                (session.originalFacultyName && session.originalFacultyName.toLowerCase().includes(normalizedTarget))
            )) {
              isAssigned = true;
            }
          }

          if (!isAssigned && !session.faculty && !session.facultyId) {
              const cleanCode = (session.courseName || session.courseCode || session.subject || "Unknown").split(' (')[0].trim();
              const sessionLoadInfo = load.find(l => l.code === cleanCode);
              if (sessionLoadInfo && (((sessionLoadInfo as any).id === facultyId) || (sessionLoadInfo.faculty && sessionLoadInfo.faculty === facultyName))) {
                  isAssigned = true;
              }
          }

          const isSameSemester = sem === selectedSemester.toString();
          if (!isSameSemester) isAssigned = false;
          
          if (isAssigned) {
            let [d, t] = dayTime.split('-');
            const timeMap: Record<string, string> = { "09:30": "09:40", "10:30": "10:40", "11:40": "11:40", "01:30": "01:20", "02:30": "02:20", "03:30": "03:20" };
            t = timeMap[t] || t;
            if (!facultyResult.slots[d]) facultyResult.slots[d] = {};
            
            const rawSubject = session.courseName || session.courseCode || session.subject || "Unknown";
            const cleanCode = rawSubject.split(' (')[0].trim();
            const fullName = courseNameMap[cleanCode] || cleanCode;
            const abbrev = getSubjectAbbreviation(fullName);

            const isCRT = (fullName || "").toLowerCase().includes('crt');

            facultyResult.slots[d][t] = {
              subject: abbrev,
              fullName: `${fullName} (${dept}-${year}${section})`,
              room: session.room && (session.room.includes("Mrs.") || session.room.includes("Dr.")) ? "TBD" : (session.room || "TBD"),
              branch: `${dept} | Y${year} S${sem} - Sec ${section}`,
              faculty: displayFaculty,
              isSubstituted: isSubstituted,
              type: isCRT ? 'crt' : (fullName || "").toLowerCase().includes('lab') ? 'lab' : 'lecture',
              duration: 1,
              isLive: true
            };
          }
        });
      });
      return facultyResult;
    }
    return { slots: {}, metadata: null };
  }, [userRole, student, user.id, user.name, selectedSemester, storageSyncStamp]);

  const publishedExamTimetables = useMemo(() => {
    const saved = localStorage.getItem('EXAM_TIMETABLES');
    if (!saved) return [];
    const all = JSON.parse(saved) as ExamTimetable[];
    
    // Filter for published ones
    const published = all.filter(tt => tt.isPublished);

    if (userRole === "student") {
      const student = MOCK_STUDENTS.find(s => s.rollNumber.toUpperCase() === user.id.toUpperCase());
      if (!student) return [];
      // Filter for student's year
      return published.filter(tt => tt.years.includes(student.year));
    }
    
    return published; // Faculty see all published for now
  }, [userRole, user.id, storageSyncStamp]);

  const studentSeating = useMemo(() => {
    if (userRole !== "student") return [];
    const savedPlans = localStorage.getItem('EXAM_SEATING_PLAN');
    const savedExams = localStorage.getItem('EXAM_SCHEDULE');
    if (!savedPlans || !savedExams) return [];
    
    const allPlans = JSON.parse(savedPlans) as SeatingAssignment[];
    const allExams = JSON.parse(savedExams) as any[];
    
    const mySeats = allPlans.filter(s => s.rollNumber.toUpperCase() === user.id.toUpperCase());
    if (mySeats.length === 0) return [];

    // CRITICAL: Filter for TODAY only per institutional requirement
    const today = new Date().toISOString().split('T')[0];
    const todaysExamIds = allExams
        .filter(e => e.date === today)
        .map(e => e.id);
        
    const activeSeat = mySeats.find(s => todaysExamIds.includes(s.examId));
    if (!activeSeat) return [];

    // Filter all students in that specific room for the current active exam session
    return allPlans.filter(s => s.room === activeSeat.room && s.examId === activeSeat.examId);
  }, [userRole, user.id, storageSyncStamp]);

  const facultyDuties = useMemo(() => {
    if (userRole !== "faculty") return [];
    const saved = localStorage.getItem('INVIGILATION_LIST');
    if (!saved) return [];
    const all = JSON.parse(saved) as InvigilationDuty[];
    return all.filter(duty => duty.facultyName.toLowerCase().includes(user.name.toLowerCase()));
  }, [userRole, user.name, storageSyncStamp]);

  const timetableData = (processedData as any).slots || {};

  const stats = useMemo(() => {
    let totalSessions = 0;
    const slots = (processedData as any).slots || {};
    days.forEach(day => {
      if (slots[day]) {
        totalSessions += Object.keys(slots[day]).length;
      }
    });

    const totalPossibleSlots = (timeSlots.length - 1) * days.length; // Excluding lunch
    const freeSlots = totalPossibleSlots - totalSessions;

    return { totalSessions, freeSlots, contactHours: totalSessions };
  }, [processedData]);

  const subjectFacultyMapping = useMemo(() => {
    const mapping: Record<string, any> = {};
    const slots = (processedData as any).slots || {};
    Object.values(slots).forEach((daySlots: any) => {
      Object.values(daySlots).forEach((session: any) => {
        const title = session.fullName || session.subject;
        if (title && session.faculty && !isSpecialSession(title)) {
          if (!mapping[title]) {
            const facultyDetails = MOCK_FACULTY.find(f => 
              f.name.toLowerCase().trim() === session.faculty.toLowerCase().trim()
            );
            mapping[title] = {
              name: session.faculty,
              email: facultyDetails?.email || "N/A",
              phone: facultyDetails?.phone || "N/A"
            };
          }
        }
      });
    });
    return Object.entries(mapping);
  }, [processedData]);

  function isSpecialSession(name: string) {
    const n = name.toLowerCase();
    return n.includes('sports') || n.includes('library') || n.includes('lunch') || n.includes('break');
  }

  const getSubjectColor = (type: string) => {
    switch (type) {
      case "lecture":
        return "bg-primary text-primary-foreground";
      case "lab":
        return "bg-green-600 text-white";
      case "practical":
        return "bg-yellow-500 text-black";
      case "project":
        return "bg-pink-500 text-white";
      case "crt":
        return "bg-indigo-600 text-white";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const renderTimeSlot = (day: string, time: string, span: number = 1) => {
    // Lunch break special case
    if (time === "12:40") {
      return (
        <div className="h-[84px] border border-border/30 bg-yellow-50/40 dark:bg-yellow-900/10 flex items-center justify-center relative overflow-hidden group">
          <span className="text-[10px] text-yellow-600 dark:text-yellow-500 font-black uppercase tracking-[0.3em] font-mono transform -rotate-0 transition-transform duration-500 group-hover:scale-110">
            Lunch
          </span>
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>
      );
    }

    const session = timetableData[day as keyof typeof timetableData]?.[time];
    if (!session) {
      return (
        <div className="h-[84px] border border-border/30 bg-muted/5 flex items-center justify-center transition-colors">
           <span className="text-muted-foreground/10 text-xl font-bold">—</span>
        </div>
      );
    }

    const isLab = session.type === 'lab' || session.subject?.toLowerCase().includes('lab');
    const isProject = session.subject?.toLowerCase().includes('project');
    const isCRT = session.type === 'crt' || session.subject?.toLowerCase().includes('crt');

    // Merged / spanned cell (3 consecutive identical sessions)
    if (span > 1) {
      return (
        <div
          className={`relative h-[84px] border border-border/30 flex flex-col items-center justify-center gap-1 overflow-hidden group transition-all duration-200 border-l-4 ${
            isProject
              ? 'bg-violet-50/80 dark:bg-violet-950/20 border-l-violet-500'
              : isCRT
              ? 'bg-indigo-50/80 dark:bg-indigo-950/20 border-l-indigo-500'
              : isLab
              ? 'bg-green-50/80 dark:bg-green-950/20 border-l-green-500'
              : 'bg-primary/5 dark:bg-primary/10 border-l-primary'
          }`}
        >
          <div className={`font-black text-[14px] tracking-tight text-center px-2 ${
            isProject ? 'text-violet-700 dark:text-violet-300' : 'text-slate-900 dark:text-slate-100'
          }`}>
            {session.subject}
          </div>
          <div className={`text-[12px] font-bold opacity-80 mb-1 flex items-center gap-2 ${session.isSubstituted ? 'text-accent font-black' : 'text-slate-500 dark:text-slate-400'}`}>
            {userRole === 'student' ? session.faculty : session.branch}
            {session.isSubstituted && (
              <Badge className="text-[7px] h-3.5 px-1 bg-accent/20 text-accent border-accent/30 animate-pulse font-black">SUBSTITUTE</Badge>
            )}
          </div>
          {(isLab || session.room) && session.room !== "TBD" && (
            <div className={`text-[11px] font-mono px-3 py-1 rounded-md font-black uppercase tracking-tighter border ${
              isProject ? 'bg-violet-100 border-violet-200 text-violet-600 dark:bg-violet-900/40 dark:text-violet-300' : 
              isCRT ? 'bg-indigo-100 border-indigo-200 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300' :
              'bg-primary/10 border-primary/10 text-primary dark:bg-primary/20'
            }`}>
              {session.room}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        className={`relative h-[84px] border border-border/30 ${
          isCRT ? 'bg-indigo-50/80 dark:bg-indigo-950/20' :
          isLab ? 'bg-green-50/80 dark:bg-green-950/20' : 'bg-primary/5 dark:bg-primary/10'
        } p-2 flex flex-col justify-between overflow-hidden group transition-all duration-200 border-l-4 ${
          isCRT ? 'border-l-indigo-500' :
          isLab ? 'border-l-green-500' : 'border-l-primary'
        }`}
      >
        <div className="flex flex-col gap-1">
          <div className="font-black text-[12px] lg:text-[13px] leading-tight text-slate-900 dark:text-slate-100 line-clamp-2 flex items-center gap-1 group-hover:text-primary transition-colors">
            {session.subject}
          </div>
          <div className={`text-[11px] lg:text-[12px] font-bold truncate flex items-center gap-1.5 border-t border-border/10 pt-1 mt-1 ${session.isSubstituted ? 'text-accent font-black' : 'text-slate-500 dark:text-slate-400'}`}>
             <User className="h-2.5 w-2.5 opacity-50" />
             {userRole === 'student' ? session.faculty : session.branch}
             {session.isSubstituted && (
               <Badge className="text-[6px] h-3 px-1 bg-accent/20 text-accent border-accent/30 animate-pulse font-black ml-auto">SUBSTITUTE</Badge>
             )}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          {session.room && session.room !== "TBD" ? (
            <div className="text-[10px] lg:text-[11px] font-mono bg-primary/10 text-primary dark:bg-primary/20 px-2 py-0.5 rounded-sm font-black uppercase tracking-tighter shadow-sm border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
              {session.room}
            </div>
          ) : (
            <div className="w-1 h-1" /> // Spacer
          )}
        </div>

        {/* Decorative corner accent */}
        <div className={`absolute top-0 right-0 p-1 opacity-5 scale-150 rotate-12 transition-transform duration-500 group-hover:scale-[2] group-hover:opacity-10`}>
            {isLab ? <Wand2 className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
        </div>
      </div>
    );
  };

  return (
      <Tabs defaultValue="academic" className="w-full">
        <TabsList className="bg-muted/40 p-1 rounded-xl h-12 mb-6">
          <TabsTrigger value="academic" className="px-8 rounded-lg text-xs font-bold transition-all gap-2">
            <Clock className="h-4 w-4" /> Academic Schedule
          </TabsTrigger>
          <TabsTrigger value="exams" className="px-8 rounded-lg text-xs font-bold transition-all gap-2">
            <FileText className="h-4 w-4" /> Exam Schedules
            {publishedExamTimetables.length > 0 && (
              <Badge className="ml-2 bg-primary text-white text-[8px] h-4 min-w-[16px] p-0 flex items-center justify-center rounded-full">
                {publishedExamTimetables.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="academic" className="space-y-6">
          {/* Section Metadata Header (NEW) */}
          {(processedData as any).metadata && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in-50 duration-500">
                {/* Class Teacher */}
                <Card className="border-none shadow-premium rounded-3xl bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/10">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
                            <User className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase text-purple-400 tracking-widest leading-none mb-1">Class Teacher</p>
                            <p className="text-base font-black text-slate-800 dark:text-slate-100 italic">{(processedData as any).metadata.classTeacher}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Year In-Charge */}
                <Card className="border-none shadow-premium rounded-3xl bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/10">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase text-indigo-400 tracking-widest leading-none mb-1">Year In-Charge</p>
                            <p className="text-base font-black text-slate-800 dark:text-slate-100">{(processedData as any).metadata.yearInCharge || "N/A"}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Class Representative */}
                <Card className="border-none shadow-premium rounded-3xl bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/10">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                            <UserCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase text-orange-400 tracking-widest leading-none mb-1">Class Rep (CR)</p>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{(processedData as any).metadata.classRepresentative || "TBD"}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Classroom */}
                <Card className="border-none shadow-premium rounded-3xl bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/10">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase text-blue-400 tracking-widest leading-none mb-1">Primary Classroom</p>
                            <p className="text-base font-black text-slate-800 dark:text-slate-100">{(processedData as any).metadata.room}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black tracking-tight">{userRole === 'student' ? 'My Schedule' : 'Teaching Schedule'}</span>
                  <Badge variant="outline" className="rounded-full border-primary/20 text-primary uppercase text-[8px] font-black tracking-widest">Official Release</Badge>
                  {userRole === 'student' && student && (
                      <Badge className="ml-2 bg-primary/10 border-primary/30 text-primary font-black uppercase text-[10px]">
                          {student.branch} | Y{student.year} | S{student.semester} | Sec {student.section}
                      </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground mr-2">Displaying:</span>
                  <div className="flex bg-muted p-1 rounded-lg">
                    <button 
                      onClick={() => setSelectedSemester(1)}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${selectedSemester === 1 ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      Semester 1
                    </button>
                    <button 
                      onClick={() => setSelectedSemester(2)}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${selectedSemester === 2 ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      Semester 2
                    </button>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className={`grid grid-cols-8 gap-1 min-w-[1200px]`}>
                  {/* Header Row */}
                  <div className="p-3 bg-muted font-bold text-center border-b-2 border-primary/20 uppercase tracking-wider text-xs flex items-center justify-center">
                    Day
                  </div>
                  {timeSlots.map((time) => (
                    <div key={time} className="p-3 bg-muted font-bold text-center border-b-2 border-primary/20 uppercase tracking-wider text-xs">
                      {time}
                    </div>
                  ))}

                  {/* Day Rows */}
                    {days.map((day) => {
                      const mergedSlots: { time: string; span: number }[] = [];
                      let i = 0;
                      const slots = (processedData as any).slots || {};
                      
                      while (i < timeSlots.length) {
                        const time = timeSlots[i];
                        const session = slots[day as keyof typeof slots]?.[time];
                        const courseCode = session?.subject ?? null;

                        if (time === "12:40" || !courseCode) {
                          mergedSlots.push({ time, span: 1 });
                          i++;
                          continue;
                        }

                        let span = 1;
                        while (i + span < timeSlots.length && timeSlots[i + span] !== "12:40") {
                          const nextSession = slots[day as keyof typeof slots]?.[timeSlots[i + span]];
                          if (nextSession?.subject === courseCode && nextSession?.branch === session?.branch) {
                            span++;
                          } else {
                            break;
                          }
                        }

                        mergedSlots.push({ time, span });
                        i += span;
                      }

                      return (
                        <div key={day} className="contents text-xs">
                          <div className="p-3 bg-muted/50 font-black text-center flex items-center justify-center border-r-2 border-muted h-full uppercase min-h-[84px] tracking-widest text-[10px]">
                            {day}
                          </div>
                          {mergedSlots.map(({ time, span }) => (
                            <div
                              key={`${day}-${time}`}
                              className="h-full"
                              style={{ gridColumn: span > 1 ? `span ${span}` : undefined }}
                            >
                              {renderTimeSlot(day, time, span)}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subject-Faculty Mapping Module */}
            {subjectFacultyMapping.length > 0 && (
                <Card className="border-none shadow-premium rounded-[2.5rem] overflow-hidden mt-8 animate-in slide-in-from-bottom-4 duration-500">
                    <CardHeader className="bg-slate-50 dark:bg-slate-900/50 p-6 border-b">
                        <CardTitle className="text-lg font-black flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary" /> Instructional Mapping & Directory
                        </CardTitle>
                        <CardDescription className="text-xs font-medium">Full Subject-to-Faculty assignments with institutional contact details.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50 dark:bg-transparent">
                                    <TableHead className="font-black uppercase tracking-widest text-[10px] pl-8">Course Subject</TableHead>
                                    <TableHead className="font-black uppercase tracking-widest text-[10px]">Instructional Faculty</TableHead>
                                    <TableHead className="font-black uppercase tracking-widest text-[10px]">Contact Email</TableHead>
                                    <TableHead className="font-black uppercase tracking-widest text-[10px] pr-8 text-right">Office Number</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subjectFacultyMapping.map(([subject, details]: [string, any]) => (
                                    <TableRow key={subject} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="font-bold text-sm pl-8 text-slate-800 dark:text-slate-100">{subject}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">FT</div>
                                                <span className="text-sm font-black text-slate-600 dark:text-slate-400">{details.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-muted-foreground group">
                                                <Mail className="h-3 w-3 opacity-40 group-hover:text-primary transition-colors" />
                                                <span className="text-xs font-medium cursor-pointer hover:text-primary">{details.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-8">
                                            <div className="flex items-center justify-end gap-2 text-muted-foreground group">
                                                <Phone className="h-3 w-3 opacity-40 group-hover:text-primary transition-colors" />
                                                <span className="text-xs font-black tracking-tighter cursor-pointer hover:text-primary">{details.phone}</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </TabsContent>

        <TabsContent value="exams" className="space-y-6">
          {userRole === "student" && studentSeating.length > 0 && (
            <Card className="border-border/40 shadow-sm rounded-2xl overflow-hidden bg-primary/5">
              <CardHeader className="p-5 border-b border-border/20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-black text-primary">Your Seating Allocation</CardTitle>
                    <CardDescription className="text-xs font-bold uppercase tracking-widest">Hall {studentSeating[0].room} | {studentSeating[0].block}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <div className="p-5">
                <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-3">Roll Numbers Assigned to this Room</h4>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                  {studentSeating.map((seat, idx) => (
                    <Badge key={idx} variant={seat.rollNumber.toUpperCase() === user.id.toUpperCase() ? "default" : "outline"} className={`font-mono font-bold ${seat.rollNumber.toUpperCase() === user.id.toUpperCase() ? 'bg-primary text-white shadow-lg animate-pulse' : 'bg-white text-muted-foreground'}`}>
                      {seat.rollNumber} {seat.rollNumber.toUpperCase() === user.id.toUpperCase() && "(You)"}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {userRole === "faculty" && facultyDuties.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {facultyDuties.map((duty, idx) => (
                <Card key={idx} className="border-border/40 shadow-md rounded-2xl overflow-hidden hover:border-primary/40 transition-all border-l-4 border-l-amber-500">
                  <div className="p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <Badge className="bg-amber-500/10 text-amber-600 border-none text-[8px] font-black uppercase tracking-widest">Invigilation Duty</Badge>
                        <h4 className="text-xl font-black tracking-tighter">Hall {duty.room}</h4>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <UserCheck className="h-4 w-4 text-amber-600" />
                      </div>
                    </div>
                    <div className="space-y-2 bg-muted/20 p-3 rounded-xl border border-border/50">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" /> {duty.date.split('-').reverse().join('-')}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" /> {duty.time}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {publishedExamTimetables.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 bg-muted/20 border-2 border-dashed rounded-[3rem] opacity-50 space-y-4">
              <ShieldCheck className="h-16 w-16 text-primary/40" />
              <p className="font-black text-center text-sm italic">No official exam timetables have been published for your cohort yet.<br/><span className="text-[10px] opacity-70 font-bold uppercase tracking-widest">Check back once the administration releases the schedule.</span></p>
            </div>
          ) : (
            <div className="space-y-8">
              {publishedExamTimetables.map((tt) => (
                <Card key={tt.id} className="border-border/40 shadow-2xl rounded-[2.5rem] overflow-hidden bg-card/60 backdrop-blur-md">
                  <div className="p-8 border-b border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-transparent flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-widest">{tt.type}</Badge>
                        <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-primary/20">{tt.semesterGroup === 1 ? 'Odd' : 'Even'} Semesters</Badge>
                      </div>
                      <h3 className="text-2xl font-black tracking-tighter text-foreground">{tt.title}</h3>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-70">
                        Official Release | {tt.startDate} to {tt.endDate}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl font-black h-10 px-6 bg-white dark:bg-zinc-900 border-border/50">
                      <Printer className="h-3 w-3 mr-2" /> Download Official Sheet
                    </Button>
                  </div>
                  <div className="p-4 lg:p-8 overflow-x-auto">
                    <table className="w-full border-collapse border border-border/20 rounded-2xl overflow-hidden shadow-inner">
                      <thead>
                        <tr className="bg-muted/40 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/20">
                          <th className="p-4 text-left">Date & Day</th>
                          <th className="p-4 text-left">Session</th>
                          <th className="p-4 text-left">Time</th>
                          <th className="p-4 text-left">Your Subject Schedule</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/10">
                        {tt.slots.map((slot, sIdx) => {
                          // For student, filter subjects by their branch and year
                          const student = MOCK_STUDENTS.find(s => s.rollNumber.toUpperCase() === user.id.toUpperCase());
                          const relevantSubjects = slot.subjects.filter(s => 
                            userRole === "faculty" || (s.branch === student?.branch && s.year === student?.year)
                          );

                          return (
                            <tr key={sIdx} className="hover:bg-primary/[0.02] transition-colors group">
                              <td className="p-4 whitespace-nowrap">
                                <span className="font-black text-xs text-foreground block">{slot.date}</span>
                                <span className="text-[9px] font-bold text-primary/60 uppercase">{slot.day}</span>
                              </td>
                              <td className="p-4">
                                <Badge variant="outline" className={`text-[8px] font-bold ${slot.session === 'FN' ? 'bg-indigo-50/50 text-indigo-600 border-indigo-200' : 'bg-orange-50/50 text-orange-600 border-orange-200'}`}>
                                  {slot.session === 'FN' ? 'Forenoon' : 'Afternoon'}
                                </Badge>
                              </td>
                              <td className="p-4 text-[10px] font-mono font-bold text-muted-foreground">{slot.startTime} - {slot.endTime}</td>
                              <td className="p-4 min-w-[300px]">
                                <div className="space-y-2">
                                  {relevantSubjects.map((sub, subIdx) => (
                                    <div key={subIdx} className="p-3 rounded-xl bg-muted/30 border border-border/40 group-hover:border-primary/20 transition-all flex justify-between items-center gap-4">
                                      <div className="space-y-1">
                                        <div className="text-[11px] font-black text-foreground">{formatSubjectName(sub.courseName)}</div>
                                        <div className="text-[9px] font-mono font-bold text-muted-foreground opacity-60 uppercase">{sub.courseCode} | {sub.branch} (Year {sub.year})</div>
                                      </div>
                                      <Badge variant="outline" className="text-[8px] font-black uppercase border-primary/20 text-primary">Theo-II</Badge>
                                    </div>
                                  ))}
                                  {relevantSubjects.length === 0 && (
                                    <span className="text-[10px] font-bold text-muted-foreground opacity-30 italic">No exams scheduled for your cohort in this slot.</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
  );
}
