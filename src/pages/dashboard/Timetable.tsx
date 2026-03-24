import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Plus, Edit, Filter, BookOpen, User } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { AIML_TIMETABLES, FACULTY_LOAD, getTimetable } from "@/data/aimlTimetable";
import { MOCK_STUDENTS } from "@/data/mockStudents";

interface TimetableProps {
  userRole?: string;
}

export default function Timetable({ userRole: propRole }: TimetableProps) {
  const { user } = useOutletContext<{ user: { id: string, name: string, role: string } }>();
  const userRole = propRole || user?.role || "student";
  
  const [selectedWeek, setSelectedWeek] = useState("current");
  const [viewMode, setViewMode] = useState("week");

  // Exactly 6 periods including lunch
  const timeSlots = ["09:40", "10:40", "11:40", "12:40", "01:20", "02:20", "03:20"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const processedData = useMemo(() => {
    if (userRole === "student") {
      const student = MOCK_STUDENTS.find(s => s.rollNumber.toUpperCase() === user.id.toUpperCase());
      if (!student) return {};

      const semNum = student.semester % 2 === 0 ? 2 : 1;
      const baseTable = getTimetable(student.year, semNum, student.section);
      const key = `${student.year}-${semNum}`;

      const result: any = {};
      Object.entries(baseTable).forEach(([dayTime, session]) => {
        if (!session) return;
        const [day, time] = dayTime.split('-');
        if (!result[day]) result[day] = {};

        // Find faculty for this session in FACULTY_LOAD
        const loadInfo = FACULTY_LOAD[key as keyof typeof FACULTY_LOAD]?.find(l => l.code === session.courseCode);

        result[day][time] = {
          subject: session.courseCode,
          room: loadInfo?.room || session.room,
          faculty: loadInfo?.faculty || "Staff",
          type: session.courseCode.toLowerCase().includes('lab') ? 'lab' : 'lecture',
          duration: 1
        };
      });
      return result;
    } else if (userRole === "faculty") {
      const result: any = {};
      const facultyName = user.name;

      Object.entries(AIML_TIMETABLES).forEach(([semKey, table]) => {
        const load = FACULTY_LOAD[semKey as keyof typeof FACULTY_LOAD] || [];
        
        Object.entries(table).forEach(([dayTime, session]) => {
          if (!session) return;
          const assigned = load.find(l => l.code === session.courseCode && l.faculty === facultyName);
          
          if (assigned) {
            const [day, time] = dayTime.split('-');
            if (!result[day]) result[day] = {};
            result[day][time] = {
              subject: session.courseCode,
              room: assigned.room,
              branch: semKey,
              type: session.courseCode.toLowerCase().includes('lab') ? 'lab' : 'lecture',
              duration: 1
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
        <div className="h-16 flex items-center justify-center bg-muted font-semibold text-sm border border-border/50">
          Lunch Break
        </div>
      );
    }

    const session = timetableData[day as keyof typeof timetableData]?.[time];
    if (!session) {
      return (
        <div className={`h-16 border border-border/50 ${userRole !== 'student' ? 'bg-muted/20 hover:bg-muted/40 cursor-pointer group' : 'bg-muted/10'} transition-colors flex items-center justify-center`}>
          {userRole !== 'student' && (
            <Plus className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      );
    }
    return (
      <div
        className={`relative h-16 border border-border/50 ${getSubjectColor(session.type)} hover:shadow-md transition-all cursor-pointer p-2 rounded-sm group overflow-hidden`}
        style={{ gridRowEnd: `span ${session.duration}` }}
      >
        <div className="flex flex-col h-full relative z-10">
          <div className="font-bold text-[10px] leading-tight flex items-center gap-1 mb-1">
            <Clock className="h-2 w-2" />
            {time}
          </div>
          <div className="font-bold text-xs truncate leading-tight">{session.subject}</div>
          <div className="text-[10px] opacity-90 mt-0.5 flex items-center gap-1 font-medium italic">
             {userRole === 'student' ? (
                <>
                  <User className="h-2.5 w-2.5" />
                  {session.faculty}
                </>
             ) : (
                <>
                  <BookOpen className="h-2.5 w-2.5" />
                  {session.branch}
                </>
             )}
          </div>
          <div className="text-[10px] bg-black/10 px-1 absolute bottom-0 right-0 rounded-tl-sm font-mono">
            {session.room}
          </div>
        </div>
        
        {/* Subtle Background Pattern */}
        <div className="absolute top-0 right-0 p-1 opacity-10 scale-150 rotate-12">
            <BookOpen className="h-8 w-8 text-black" />
        </div>

        {userRole === 'admin' && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 hover:bg-white/40 text-white"
          >
            <Edit className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Timetable</h1>
          <p className="text-muted-foreground">
            {userRole === 'student' ? `Class Schedule for ${user.id}` : `Teaching Schedule for ${user.name}`}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Select value={selectedWeek} onValueChange={setSelectedWeek}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Week</SelectItem>
              <SelectItem value="next">Next Week</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>

          {userRole !== 'student' && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Session
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
            <span>Weekly Timetable</span>
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
                  <div className="p-3 bg-muted/50 font-black text-center flex items-center justify-center border-r-2 border-muted h-full uppercase min-h-[100px]">
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
