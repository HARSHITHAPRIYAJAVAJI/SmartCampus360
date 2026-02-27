import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Plus, Edit, Filter } from "lucide-react";

export default function Timetable() {
  const [selectedWeek, setSelectedWeek] = useState("current");
  const [viewMode, setViewMode] = useState("week");

  // Exactly 6 periods including lunch
  const timeSlots = ["09:40-10:39", "10:40-11:39", "11:40", "12:40", "1:20", "2:20", "3:20"];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const timetableData = {
    Monday: {
      "09:40": { subject: "Advanced Algorithms", room: "Room 301", type: "lecture", duration: 2 },
      "2:20": { subject: "Database Systems", room: "Lab 2", type: "lab", duration: 2 },
    },
    Tuesday: {
      "10:40": { subject: "Software Engineering", room: "Room 205", type: "lecture", duration: 1 },
      "3:20": { subject: "Web Development", room: "Lab 1", type: "practical", duration: 2 },
    },
    Wednesday: {
      "09:40": { subject: "Data Structures", room: "Room 102", type: "lecture", duration: 1 },
      "10:40": { subject: "Computer Networks", room: "Room 303", type: "lecture", duration: 2 },
      "2:20": { subject: "Mini Project", room: "Room 402", type: "project", duration: 2 },
    },
    Thursday: {
      "09:40": { subject: "Operating Systems", room: "Room 201", type: "lecture", duration: 2 },
      "2:20": { subject: "AI & ML", room: "Lab 3", type: "practical", duration: 2 },
    },
    Friday: {
      "10:40": { subject: "Computer Graphics", room: "Lab 4", type: "practical", duration: 2 },
      "3:20": { subject: "Project Work", room: "Room 401", type: "project", duration: 2 },
    },
    Saturday: {
      "09:40": { subject: "Seminar", room: "Hall A", type: "lecture", duration: 1 },
      "11:40": { subject: "Hackathon Prep", room: "Lab 5", type: "lab", duration: 2 },
    }
  };

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
        <div className="h-16 border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer flex items-center justify-center group">
          <Plus className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      );
    }

    return (
      <div
        className={`relative h-16 border border-border/50 ${getSubjectColor(session.type)} hover:opacity-90 transition-opacity cursor-pointer p-2`}
        style={{ gridRowEnd: `span ${session.duration}` }}
      >
        <div className="flex flex-col h-full">
          <div className="font-medium text-sm truncate">{session.subject}</div>
          <div className="text-xs opacity-90 truncate">{session.room}</div>
          <div className="text-xs opacity-75 mt-auto">{session.type}</div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 hover:opacity-100 transition-opacity"
        >
          <Edit className="h-3 w-3" />
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Timetable</h1>
          <p className="text-muted-foreground">Manage your weekly schedule</p>
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
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Session
          </Button>
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
                <p className="text-2xl font-bold">26</p>
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
                <p className="text-2xl font-bold">38</p>
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
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timetable Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Weekly Timetable</span>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-primary text-primary-foreground">Lecture</Badge>
              <Badge variant="outline" className="bg-green-600 text-white">Lab</Badge>
              <Badge variant="outline" className="bg-yellow-500 text-black">Practical</Badge>
              <Badge variant="outline" className="bg-pink-500 text-white">Project</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-7 gap-1 min-w-[1000px]">
              {/* Header Row */}
              <div className="p-3 bg-muted font-medium text-center">Time</div>
              {days.map((day) => (
                <div key={day} className="p-3 bg-muted font-medium text-center">
                  {day}
                </div>
              ))}
              
              {/* Time Slots */}
              {timeSlots.map((time) => (
                <div key={time} className="contents">
                  <div className="p-3 bg-muted/50 font-mono text-sm text-center flex items-center justify-center border border-border/50">
                    {time}
                  </div>
                  {days.map((day) => (
                    <div key={`${day}-${time}`}>
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
