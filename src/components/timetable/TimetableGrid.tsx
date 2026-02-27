import { useDroppable } from "@dnd-kit/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, User, X } from "lucide-react";
import { TimetableSession } from "./TimetableSession";

interface TimeSlot {
  id: string;
  slot_name: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
}

interface TimetableEntry {
  id?: string;
  academic_term_id: string;
  subject_id: string;
  faculty_id: string;
  room_id: string;
  time_slot_id: string;
  day_of_week: string;
  session_type: string;
  timetable_type: 'regular' | 'exam';
  student_group?: string;
  notes?: string;
  is_confirmed: boolean;
  subject?: any;
  faculty?: any;
  room?: any;
  time_slot?: any;
}

interface TimetableGridProps {
  timeSlots: TimeSlot[];
  days: string[];
  timetableEntries: TimetableEntry[];
  onDeleteEntry: (entryId: string) => void;
  isExamMode?: boolean;
}

interface DroppableSlotProps {
  day: string;
  timeSlot: TimeSlot;
  entry?: TimetableEntry;
  onDeleteEntry: (entryId: string) => void;
  isExamMode?: boolean;
}

function DroppableSlot({ day, timeSlot, entry, onDeleteEntry, isExamMode }: DroppableSlotProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${day}-${timeSlot.id}`,
    data: {
      type: 'time-slot',
      day,
      timeSlotId: timeSlot.id,
      timeSlot
    }
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-20 border-2 border-dashed rounded-lg p-2 transition-all duration-200
        ${isOver 
          ? 'border-primary bg-primary/10 shadow-md' 
          : entry 
            ? 'border-transparent bg-card' 
            : 'border-muted hover:border-muted-foreground/30 hover:bg-muted/50'
        }
      `}
    >
      {entry ? (
        <TimetableSession
          entry={entry}
          onDelete={() => entry.id && onDeleteEntry(entry.id)}
          isExamMode={isExamMode}
        />
      ) : (
        <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
          {isOver ? 'Drop here' : 'Available'}
        </div>
      )}
    </div>
  );
}

export function TimetableGrid({ 
  timeSlots, 
  days, 
  timetableEntries, 
  onDeleteEntry, 
  isExamMode = false 
}: TimetableGridProps) {
  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const capitalizeDay = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const getEntryForSlot = (day: string, timeSlotId: string) => {
    return timetableEntries.find(
      entry => entry.day_of_week === day && entry.time_slot_id === timeSlotId
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {isExamMode ? 'Exam Schedule' : 'Class Timetable'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-8 gap-2 min-w-[800px]">
            {/* Header Row */}
            <div className="font-semibold text-sm text-center py-2">Time</div>
            {days.map(day => (
              <div key={day} className="font-semibold text-sm text-center py-2">
                {capitalizeDay(day)}
              </div>
            ))}

            {/* Time Slot Rows */}
            {timeSlots.map(timeSlot => (
              <div key={timeSlot.id} className="contents">
                {/* Time Column */}
                <div className="flex flex-col items-center justify-center p-2 bg-muted/50 rounded text-xs">
                  <div className="font-medium">{timeSlot.slot_name}</div>
                  <div className="text-muted-foreground">
                    {formatTime(timeSlot.start_time)} - {formatTime(timeSlot.end_time)}
                  </div>
                </div>

                {/* Day Columns */}
                {days.map(day => {
                  const entry = getEntryForSlot(day, timeSlot.id);
                  return (
                    <DroppableSlot
                      key={`${day}-${timeSlot.id}`}
                      day={day}
                      timeSlot={timeSlot}
                      entry={entry}
                      onDeleteEntry={onDeleteEntry}
                      isExamMode={isExamMode}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h4 className="font-medium mb-2">Legend:</h4>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Lecture</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Lab</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span>Tutorial</span>
            </div>
            {isExamMode && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Exam</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}