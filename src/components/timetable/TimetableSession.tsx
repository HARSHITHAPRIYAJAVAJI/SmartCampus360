import { useDraggable } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Clock, User, MapPin, BookOpen } from "lucide-react";

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

interface TimetableSessionProps {
  entry: TimetableEntry;
  onDelete: () => void;
  isExamMode?: boolean;
}

export function TimetableSession({ entry, onDelete, isExamMode = false }: TimetableSessionProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `session-${entry.id}`,
    data: {
      type: 'timetable-entry',
      ...entry
    }
  });

  const getSessionTypeColor = (type: string) => {
    const colors = {
      lecture: 'bg-blue-500 text-white',
      lab: 'bg-green-500 text-white',
      tutorial: 'bg-purple-500 text-white',
      exam: 'bg-red-500 text-white',
      seminar: 'bg-orange-500 text-white'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500 text-white';
  };

  const getFacultyName = (faculty: any) => {
    if (faculty?.profiles?.first_name || faculty?.profiles?.last_name) {
      return `${faculty.profiles.first_name || ''} ${faculty.profiles.last_name || ''}`.trim();
    }
    return faculty?.employee_id || 'Unknown Faculty';
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        relative bg-card border rounded-lg p-2 shadow-sm cursor-grab active:cursor-grabbing
        hover:shadow-md transition-all duration-200
        ${isDragging ? 'opacity-50 rotate-3 scale-105' : ''}
        ${!entry.is_confirmed ? 'border-dashed border-orange-300' : ''}
      `}
    >
      {/* Delete Button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute -top-1 -right-1 h-6 w-6 p-0 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <X className="h-3 w-3" />
      </Button>

      {/* Session Type Badge */}
      <div className="mb-2">
        <Badge className={`text-xs ${getSessionTypeColor(entry.session_type)}`}>
          {entry.session_type.toUpperCase()}
        </Badge>
        {!entry.is_confirmed && (
          <Badge variant="outline" className="ml-2 text-xs">
            DRAFT
          </Badge>
        )}
      </div>

      {/* Subject */}
      <div className="space-y-1">
        <div className="flex items-start gap-1">
          <BookOpen className="h-3 w-3 mt-0.5 text-muted-foreground flex-shrink-0" />
          <div className="min-w-0">
            <div className="font-medium text-xs truncate">
              {entry.subject?.subject_code || 'Unknown Subject'}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {entry.subject?.subject_name}
            </div>
          </div>
        </div>

        {/* Faculty */}
        <div className="flex items-center gap-1">
          <User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          <div className="text-xs text-muted-foreground truncate">
            {getFacultyName(entry.faculty)}
          </div>
        </div>

        {/* Room */}
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          <div className="text-xs text-muted-foreground truncate">
            {entry.room?.room_number} - {entry.room?.room_name}
          </div>
        </div>

        {/* Student Group */}
        {entry.student_group && (
          <div className="text-xs text-muted-foreground">
            Group: {entry.student_group}
          </div>
        )}

        {/* Notes */}
        {entry.notes && (
          <div className="text-xs text-muted-foreground italic truncate">
            {entry.notes}
          </div>
        )}
      </div>
    </div>
  );
}