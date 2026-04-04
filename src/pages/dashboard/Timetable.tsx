import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Plus, Edit, Filter, BookOpen, User, Wand2 } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { AIML_TIMETABLES, FACULTY_LOAD, getTimetable } from "@/data/aimlTimetable";
import { MOCK_STUDENTS } from "@/data/mockStudents";

interface TimetableProps {
  userRole?: string;
}

export default function Timetable({ userRole: propRole }: TimetableProps) {
  const { user } = useOutletContext<{ user: { id: string, name: string, role: string } }>();
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

      const baseTable = liveTable || getTimetable(student.year, semNum, student.section);
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
          type: (session.courseName || session.courseCode).toLowerCase().includes('lab') ? 'lab' : 'lecture',
          duration: 1,
          isLive: !!liveTable
        };
      });
      return result;
    } else if (userRole === "faculty") {
      const result: any = {};
      const facultyName = user.name;

      // Also merge in published tables for faculty
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
          // Check if the faculty is assigned to this course
          const isAssigned = session.faculty === facultyName || load.find(l => l.code === (session.courseCode || session.name) && l.faculty === facultyName);
          
          if (isAssigned) {
            const [day, time] = dayTime.split('-');
            if (!result[day]) result[day] = {};
            result[day][time] = {
              subject: `${session.courseName || session.courseCode} (${dept}-${year}${section})`,
              room: session.room || "TBD",
              branch: `${dept} | Y${year} S${sem}`,
              type: (session.courseName || session.courseCode).toLowerCase().includes('lab') ? 'lab' : 'lecture',
              duration: 1,
              isLive: !!publishedTimetables[key]
            };
          }
        });
      });
      return result;
    }
    return {};
  }, [userRole, user.id, user.name]);

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
        <div className={`h-[84px] border border-border/30 bg-muted/5 flex items-center justify-center transition-colors`}>
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
          <div className={`font-extrabold text-[13px] tracking-tight text-center px-2 ${
            isProject ? 'text-violet-700 dark:text-violet-300' : 'text-slate-900 dark:text-slate-100'
          }`}>
            {session.subject}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            {userRole === 'student' ? session.faculty : session.branch}
          </div>
          <div className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-tighter ${
            isProject ? 'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-300' : 'bg-primary/10 text-primary dark:bg-primary/20'
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
        <div className="flex flex-col gap-0.5">
          <div className="font-extrabold text-[11px] leading-tight text-slate-900 dark:text-slate-100 truncate flex items-center gap-1">
            {session.subject}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate flex items-center gap-1">
             {userRole === 'student' ? session.faculty : session.branch}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
           <div className="text-[9px] font-mono bg-primary/10 text-primary dark:bg-primary/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Semester Timetable</h1>
          <p className="text-muted-foreground">
            {userRole === 'student' ? `Master Academic Schedule for ${user.id}` : `Consolidated Teaching Schedule for ${user.name}`}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="px-4 py-2 bg-primary/5 border-primary/20 text-primary font-semibold flex gap-2 items-center">
             <Calendar className="h-4 w-4" />
             Semester Session: 2024-25
          </Badge>

          {userRole !== 'student' && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adjust Schedule
            </Button>
          )}
        </div>
      </div>



      {/* Timetable Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between relative">
            <span>Semester Academic Schedule</span>
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
                // Build a merged slot list: detect consecutive identical sessions
                const mergedSlots: { time: string; span: number }[] = [];
                let i = 0;
                while (i < timeSlots.length) {
                  const time = timeSlots[i];
                  const session = timetableData[day as keyof typeof timetableData]?.[time];
                  const courseCode = session?.subject ?? null;

                  // Don't merge lunch or empty slots
                  if (time === "12:40" || !courseCode) {
                    mergedSlots.push({ time, span: 1 });
                    i++;
                    continue;
                  }

                  // Count how many following slots have the exact same subject
                  let span = 1;
                  while (
                    i + span < timeSlots.length &&
                    timeSlots[i + span] !== "12:40"
                  ) {
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


    </div>
  );
}
