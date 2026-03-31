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

        // Find faculty for this session in FACULTY_LOAD
        const loadInfo = FACULTY_LOAD[key as keyof typeof FACULTY_LOAD]?.find(l => l.code === session.courseCode);

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

  const renderTimeSlot = (day: string, time: string) => {
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
            {isLab && <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />}
            {session.isLive && <Badge className="h-3 px-1 text-[8px] bg-amber-500 text-white border-none leading-none">Live</Badge>}
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

      {/* Weekly Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Total Sessions</p>
                <p className="text-2xl font-bold">{stats.totalSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Contact Hours</p>
                <p className="text-2xl font-bold">{stats.contactHours}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-yellow-500 rounded"></div>
              <div>
                <p className="text-sm font-medium">Free Slots</p>
                <p className="text-2xl font-bold">{stats.freeSlots}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timetable Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between relative">
            <span>Semester Academic Schedule</span>
            <div className="flex items-center space-x-2 mr-40">
              <Badge variant="outline" className="bg-primary text-primary-foreground">Lecture</Badge>
              <Badge variant="outline" className="bg-green-600 text-white">Lab</Badge>
              <Badge variant="outline" className="bg-yellow-500 text-black">Practical</Badge>
              <Badge variant="outline" className="bg-pink-500 text-white">Project</Badge>
            </div>
            
            {/* Section Classroom Info (Top Right) */}
            <div className="absolute right-0 top-0">
                <Badge className="bg-primary/10 border-primary/20 text-primary font-mono text-xs px-3 py-1.5 flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    Allotted Room: A-304
                </Badge>
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
              {days.map((day) => (
                <div key={day} className="contents text-xs">
                  <div className="p-3 bg-muted/50 font-black text-center flex items-center justify-center border-r-2 border-muted h-full uppercase min-h-[84px] tracking-widest text-[10px]">
                    {day}
                  </div>
                  {timeSlots.map((time) => (
                    <div key={`${day}-${time}`} className="h-full">
                      {renderTimeSlot(day, time)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Session Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-primary rounded"></div>
              <span className="text-sm">Lectures</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span className="text-sm">Laboratory</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm">Practical</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-pink-500 rounded"></div>
              <span className="text-sm">Projects</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
