import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Plus, Edit, Filter, BookOpen, User, Wand2, FileText, ShieldCheck, Printer } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EXAM_BRANCHES, ExamTimetable } from "@/utils/examTimetableGenerator";
import { useOutletContext } from "react-router-dom";
import { AIML_TIMETABLES, FACULTY_LOAD, getTimetable } from "@/data/aimlTimetable";
import { MOCK_STUDENTS } from "@/data/mockStudents";
import { MOCK_COURSES } from "@/data/mockCourses";

interface TimetableProps {
  userRole?: string;
}

export default function Timetable({ userRole: propRole }: TimetableProps) {
  const { user } = useOutletContext<{ user: { id: string, name: string, role: string } }>();
  const [activeTab, setActiveTab] = useState('academic');
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const userRole = propRole || user?.role || "student";
  
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const timeSlots = ["09:40", "10:40", "11:40", "12:40", "01:20", "02:20", "03:20"];

  const processedData = useMemo(() => {
    if (userRole === "student") {
      const student = MOCK_STUDENTS.find(s => s.rollNumber.toUpperCase() === user.id.toUpperCase());
      if (!student) return {};

      const semNum = student.semester % 2 === 0 ? 2 : 1;
      
      // Look for a live published table first
      const publishedStoreStr = localStorage.getItem('published_timetables');
      const publishedTimetables = publishedStoreStr ? JSON.parse(publishedStoreStr) : {};
      const publishedKey = `${student.branch}-${student.year}-${semNum}-${student.section}`;
      const liveTable = publishedTimetables[publishedKey];

      const baseTable = liveTable || getTimetable(student.year, semNum, student.section, student.branch);
      const key = `${student.year}-${semNum}`;

      const result: any = {};
      Object.entries(baseTable).forEach(([dayTime, session]: [string, any]) => {
        if (!session) return;
        const [day, time] = dayTime.split('-');
        if (!result[day]) result[day] = {};

        // Find faculty for this session: Try branch-specific load first, then generic load
        const facultyLoadKey = `${student.branch}-${student.year}-${semNum}`;
        const genericLoadKey = `${student.year}-${semNum}`;
        const currentLoad = (FACULTY_LOAD[facultyLoadKey as keyof typeof FACULTY_LOAD] || 
                           FACULTY_LOAD[genericLoadKey as keyof typeof FACULTY_LOAD]) as any[];
        
        const loadInfo = currentLoad?.find(l => l.code === session.courseCode);

        result[day][time] = {
          subject: session.courseName || session.courseCode,
          room: session.room || loadInfo?.room || "TBD",
          faculty: session.faculty || loadInfo?.faculty || "Staff",
          type: (session.courseName || session.courseCode || "").toLowerCase().includes('lab') ? 'lab' : 'lecture',
          duration: 1,
          isLive: !!liveTable
        };
      });
      return result;
    } else if (userRole === "faculty") {
      const result: any = {};
      const facultyName = user.name;
      const facultyId = user.id;

      // Create a map for course name lookup to avoid confusing codes
      const courseNameMap: Record<string, string> = {};
      MOCK_COURSES.forEach(c => {
        courseNameMap[c.code] = c.name;
        courseNameMap[c.code.replace(' Lab', '').trim()] = c.name;
      });

      // Merge in published and static tables
      const publishedStoreStr = localStorage.getItem('published_timetables');
      const publishedTimetables = publishedStoreStr ? JSON.parse(publishedStoreStr) : {};
      const allTimetables = { ...AIML_TIMETABLES, ...publishedTimetables };

      Object.entries(allTimetables).forEach(([key, table]: [string, any]) => {
        const parts = key.split('-');
        let dept, year, sem, section;

        if (parts.length === 4) {
          [dept, year, sem, section] = parts;
        } else {
          [year, sem, section] = parts;
          dept = "AIML";
          section = section || 'A';
        }

        const semKey = `${year}-${sem}`;
        const load = FACULTY_LOAD[semKey as keyof typeof FACULTY_LOAD] || [];
        
        Object.entries(table).forEach(([dayTime, session]: [string, any]) => {
          if (!session) return;
          
          let isAssigned = false;
          
          // PRIORITY 1: ID-BASED MATCHING (Most secure)
          if (session.facultyId && facultyId) {
            isAssigned = session.facultyId === facultyId;
          } 
          
          // PRIORITY 2: NAME-BASED MATCHING (Fallback for legacy/static data)
          if (!isAssigned) {
            if (session.faculty) {
              isAssigned = session.faculty.trim().toLowerCase() === facultyName.trim().toLowerCase();
            } else if (session.room && (session.room.includes("Mrs.") || session.room.includes("Dr."))) {
              isAssigned = session.room.trim().toLowerCase() === facultyName.trim().toLowerCase();
            }
          }

          // PRIORITY 3: GENERIC ROUND-ROBIN (Fallback if no faculty assigned yet)
          if (!isAssigned && !session.faculty && (!session.room || (!session.room.includes("Mrs.") && !session.room.includes("Dr.")))) {
            const courseCode = session.courseCode || (session.subject?.split(' (')[0]);
            const eligibleFaculty = (load as any[])
              .filter(l => l.code === courseCode)
              .map(l => ({ name: l.faculty, id: l.id }));

            if (eligibleFaculty.length > 0) {
              const sectionIndex = section.charCodeAt(0) - 'A'.charCodeAt(0);
              const assignedIndex = sectionIndex % eligibleFaculty.length;
              const assignedFaculty = eligibleFaculty[assignedIndex];
              
              isAssigned = assignedFaculty.id === facultyId || 
                           assignedFaculty.name?.trim().toLowerCase() === facultyName.trim().toLowerCase();
            }
          }

          // PRIORITY 4: FILTER BY SEMESTER
          const isSameSemester = sem === selectedSemester.toString();
          if (!isSameSemester) isAssigned = false;
          
          if (isAssigned) {
            const [day, time] = dayTime.split('-');
            if (!result[day]) result[day] = {};
            
            const rawSubject = session.courseName || session.courseCode || session.subject || "Unknown";
            const cleanCode = rawSubject.split(' (')[0].trim();
            const fullName = courseNameMap[cleanCode] || cleanCode;
            const subjectDisplay = `${fullName} (${dept}-${year}${section})`;

            result[day][time] = {
              subject: subjectDisplay,
              room: session.room && (session.room.includes("Mrs.") || session.room.includes("Dr.")) ? "TBD" : (session.room || "TBD"),
              branch: `${dept} | Y${year} S${sem} - Sec ${section}`,
              type: (fullName || "").toLowerCase().includes('lab') ? 'lab' : 'lecture',
              duration: 1,
              isLive: !!publishedTimetables[key]
            };
          }
        });
      });
      return result;
    }
    return {};
  }, [userRole, user.id, user.name, selectedSemester]);

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
  }, [userRole, user.id]);

  const timetableData = processedData;

  const stats = useMemo(() => {
    let totalSessions = 0;
    days.forEach(day => {
      if (timetableData[day]) {
        totalSessions += Object.keys(timetableData[day]).length;
      }
    });

    const totalPossibleSlots = (timeSlots.length - 1) * days.length; // Excluding lunch
    const freeSlots = totalPossibleSlots - totalSessions;

    return { totalSessions, freeSlots, contactHours: totalSessions };
  }, [timetableData]);

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

    // Merged / spanned cell (3 consecutive identical sessions)
    if (span > 1) {
      return (
        <div
          className={`relative h-[84px] border border-border/30 flex flex-col items-center justify-center gap-1 overflow-hidden group transition-all duration-200 border-l-4 ${
            isProject
              ? 'bg-violet-50/80 dark:bg-violet-950/20 border-l-violet-500'
              : isLab
              ? 'bg-green-50/80 dark:bg-green-950/20 border-l-green-500'
              : 'bg-primary/5 dark:bg-primary/10 border-l-primary'
          }`}
        >
          <div className={`font-black text-[15px] tracking-tight text-center px-2 ${
            isProject ? 'text-violet-700 dark:text-violet-300' : 'text-slate-900 dark:text-slate-100'
          }`}>
            {session.subject}
          </div>
          <div className="text-[12px] text-slate-500 dark:text-slate-400 font-bold opacity-80 mb-1">
            {userRole === 'student' ? session.faculty : session.branch}
          </div>
          <div className={`text-[11px] font-mono px-3 py-1 rounded-md font-black uppercase tracking-tighter border ${
            isProject ? 'bg-violet-100 border-violet-200 text-violet-600 dark:bg-violet-900/40 dark:text-violet-300' : 'bg-primary/10 border-primary/10 text-primary dark:bg-primary/20'
          }`}>
            {session.room}
          </div>
        </div>
      );
    }

    return (
      <div
        className={`relative h-[84px] border border-border/30 ${
          isLab ? 'bg-green-50/80 dark:bg-green-950/20' : 'bg-primary/5 dark:bg-primary/10'
        } p-2 flex flex-col justify-between overflow-hidden group transition-all duration-200 border-l-4 ${
          isLab ? 'border-l-green-500' : 'border-l-primary'
        }`}
      >
        <div className="flex flex-col gap-1">
          <div className="font-black text-[13px] lg:text-[14px] leading-tight text-slate-900 dark:text-slate-100 line-clamp-2 flex items-center gap-1 group-hover:text-primary transition-colors">
            {session.subject}
          </div>
          <div className="text-[11px] lg:text-[12px] text-slate-500 dark:text-slate-400 font-bold truncate flex items-center gap-1.5 border-t border-border/10 pt-1 mt-1">
             <User className="h-2.5 w-2.5 opacity-50" />
             {userRole === 'student' ? session.faculty : session.branch}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
           <div className="text-[10px] lg:text-[11px] font-mono bg-primary/10 text-primary dark:bg-primary/20 px-2 py-0.5 rounded-sm font-black uppercase tracking-tighter shadow-sm border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
             {session.room}
           </div>
           <div className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest group-hover:text-primary transition-colors">
             {time}
           </div>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Semester Academic Schedule</span>
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
                    while (i < timeSlots.length) {
                      const time = timeSlots[i];
                      const session = timetableData[day as keyof typeof timetableData]?.[time];
                      const courseCode = session?.subject ?? null;

                      if (time === "12:40" || !courseCode) {
                        mergedSlots.push({ time, span: 1 });
                        i++;
                        continue;
                      }

                      let span = 1;
                      while (i + span < timeSlots.length && timeSlots[i + span] !== "12:40") {
                        const nextSession = timetableData[day as keyof typeof timetableData]?.[timeSlots[i + span]];
                        if (nextSession?.subject === courseCode) {
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
        </TabsContent>

        <TabsContent value="exams" className="space-y-6">
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
                        <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-primary/20">Sem {tt.semester}</Badge>
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
                                        <div className="text-[11px] font-black text-foreground">{sub.courseName}</div>
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
