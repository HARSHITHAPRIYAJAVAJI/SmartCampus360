import { useState, useEffect } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Calendar, Clock, Users, MapPin, Search, Filter, Plus } from "lucide-react";
import { TimetableGrid } from "@/components/timetable/TimetableGrid";
import { ResourcePanel } from "@/components/timetable/ResourcePanel";
import { TimetableSession } from "@/components/timetable/TimetableSession";

interface Faculty {
  id: string;
  employee_id: string;
  department: string;
  designation: string;
  specialization: string[];
  max_hours_per_week: number;
  profiles?: {
    first_name: string;
    last_name: string;
  };
}

interface Subject {
  id: string;
  subject_code: string;
  subject_name: string;
  department: string;
  semester: number;
  credits: number;
  theory_hours: number;
  lab_hours: number;
}

interface Room {
  id: string;
  room_number: string;
  room_name: string;
  room_type: string;
  capacity: number;
  floor: number;
  building: string;
  facilities: string[];
}

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
  subject?: Subject;
  faculty?: Faculty;
  room?: Room;
  time_slot?: TimeSlot;
}

interface AcademicTerm {
  id: string;
  term_name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const SESSION_TYPES = ['lecture', 'lab', 'tutorial', 'exam', 'seminar'];

export function TimetableManager() {
  const [timetableType, setTimetableType] = useState<'regular' | 'exam'>('regular');
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [academicTerms, setAcademicTerms] = useState<AcademicTerm[]>([]);
  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>([]);
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedTerm) {
      loadTimetableData();
    }
  }, [selectedTerm, timetableType]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [facultyRes, subjectsRes, roomsRes, timeSlotsRes, termsRes] = await Promise.all([
        supabase.from('faculty').select('*'),
        supabase.from('subjects').select('*'),
        supabase.from('rooms').select('*'),
        supabase.from('time_slots').select('*').order('start_time'),
        supabase.from('academic_terms').select('*').order('is_current', { ascending: false })
      ]);

      if (facultyRes.error) throw facultyRes.error;
      if (subjectsRes.error) throw subjectsRes.error;
      if (roomsRes.error) throw roomsRes.error;
      if (timeSlotsRes.error) throw timeSlotsRes.error;
      if (termsRes.error) throw termsRes.error;

      // Transform faculty data to match our interface
      const facultyData = facultyRes.data?.map(f => ({
        ...f,
        profiles: undefined // We'll fetch profile data separately if needed
      })) || [];

      setFaculty(facultyData);
      setSubjects(subjectsRes.data || []);
      setRooms(roomsRes.data || []);
      setTimeSlots(timeSlotsRes.data || []);
      setAcademicTerms(termsRes.data || []);
      
      // Set current term as default
      const currentTerm = termsRes.data.find(term => term.is_current);
      if (currentTerm) {
        setSelectedTerm(currentTerm.id);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadTimetableData = async () => {
    if (!selectedTerm) return;

    try {
      const { data, error } = await supabase
        .from('timetable')
        .select(`
          *,
          subject:subjects(*),
          faculty:faculty(*),
          room:rooms(*),
          time_slot:time_slots(*)
        `)
        .eq('academic_term_id', selectedTerm)
        .eq('timetable_type', timetableType);

      if (error) throw error;
      setTimetableEntries((data || []) as TimetableEntry[]);
    } catch (error) {
      console.error('Error loading timetable:', error);
      toast.error('Failed to load timetable');
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setDraggedItem(active.data.current);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedItem(null);

    if (!over || !active.data.current) return;

    const draggedData = active.data.current;
    const dropTarget = over.data.current;

    // Handle dropping resources onto timetable slots
    if (dropTarget?.type === 'time-slot' && draggedData?.type === 'resource') {
      await handleResourceDrop(draggedData, dropTarget);
    }
    
    // Handle moving existing timetable entries
    if (dropTarget?.type === 'time-slot' && draggedData?.type === 'timetable-entry') {
      await handleTimetableMove(draggedData, dropTarget);
    }
  };

  const handleResourceDrop = async (resource: any, slot: any) => {
    // Validate required fields first
    if (!selectedTerm) {
      toast.error('Please select an academic term');
      return;
    }

    // Create new timetable entry with proper typing
    const newEntry = {
      academic_term_id: selectedTerm,
      subject_id: resource.resourceType === 'subject' ? resource.id : '',
      faculty_id: resource.resourceType === 'faculty' ? resource.id : '',
      room_id: resource.resourceType === 'room' ? resource.id : '',
      time_slot_id: slot.timeSlotId,
      day_of_week: slot.day as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday',
      session_type: 'lecture' as const,
      timetable_type: timetableType,
      is_confirmed: false
    };

    // Validate required fields
    if (!newEntry.subject_id || !newEntry.faculty_id || !newEntry.room_id) {
      toast.error('Please ensure subject, faculty, and room are all assigned');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('timetable')
        .insert(newEntry)
        .select(`
          *,
          subject:subjects(*),
          faculty:faculty(*),
          room:rooms(*),
          time_slot:time_slots(*)
        `)
        .single();

      if (error) throw error;

      setTimetableEntries(prev => [...prev, data as TimetableEntry]);
      toast.success('Session added to timetable');
    } catch (error: any) {
      console.error('Error adding session:', error);
      if (error.code === '23505') {
        toast.error('Time slot conflict: Room is already occupied');
      } else {
        toast.error('Failed to add session');
      }
    }
  };

  const handleTimetableMove = async (entry: any, newSlot: any) => {
    try {
      const { error } = await supabase
        .from('timetable')
        .update({
          time_slot_id: newSlot.timeSlotId,
          day_of_week: newSlot.day
        })
        .eq('id', entry.id);

      if (error) throw error;

      // Update local state
      setTimetableEntries(prev => 
        prev.map(item => 
          item.id === entry.id 
            ? { ...item, time_slot_id: newSlot.timeSlotId, day_of_week: newSlot.day }
            : item
        )
      );

      toast.success('Session moved successfully');
    } catch (error: any) {
      console.error('Error moving session:', error);
      if (error.code === '23505') {
        toast.error('Cannot move: Target slot is already occupied');
      } else {
        toast.error('Failed to move session');
      }
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('timetable')
        .delete()
        .eq('id', entryId);

      if (error) throw error;

      setTimetableEntries(prev => prev.filter(entry => entry.id !== entryId));
      toast.success('Session removed from timetable');
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('Failed to remove session');
    }
  };

  const departments = [...new Set([...faculty.map(f => f.department), ...subjects.map(s => s.department)])];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading timetable data...</p>
        </div>
      </div>
    );
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Timetable Manager</h1>
            <p className="text-muted-foreground">Drag & drop resource allocation and optimization</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={selectedTerm} onValueChange={setSelectedTerm}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Academic Term" />
              </SelectTrigger>
              <SelectContent>
                {academicTerms.map(term => (
                  <SelectItem key={term.id} value={term.id}>
                    {term.term_name} {term.is_current && '(Current)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Generate AI Schedule
            </Button>
          </div>
        </div>

        {/* Timetable Type Tabs */}
        <Tabs value={timetableType} onValueChange={(value) => setTimetableType(value as 'regular' | 'exam')}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="regular">Regular Timetable</TabsTrigger>
            <TabsTrigger value="exam">Exam Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="regular" className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Resource Panel */}
              <div className="lg:col-span-1">
                <ResourcePanel
                  faculty={faculty}
                  subjects={subjects}
                  rooms={rooms}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  filterDepartment={filterDepartment}
                  onFilterChange={setFilterDepartment}
                  departments={departments}
                />
              </div>

              {/* Timetable Grid */}
              <div className="lg:col-span-3">
                <TimetableGrid
                  timeSlots={timeSlots}
                  days={DAYS}
                  timetableEntries={timetableEntries}
                  onDeleteEntry={handleDeleteEntry}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="exam" className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Resource Panel for Exams */}
              <div className="lg:col-span-1">
                <ResourcePanel
                  faculty={faculty}
                  subjects={subjects}
                  rooms={rooms}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  filterDepartment={filterDepartment}
                  onFilterChange={setFilterDepartment}
                  departments={departments}
                />
              </div>

              {/* Exam Schedule Grid */}
              <div className="lg:col-span-3">
                <TimetableGrid
                  timeSlots={timeSlots}
                  days={DAYS}
                  timetableEntries={timetableEntries}
                  onDeleteEntry={handleDeleteEntry}
                  isExamMode={true}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Drag Overlay */}
        <DragOverlay>
          {draggedItem && (
            <div className="bg-primary/10 border border-primary rounded-lg p-3 shadow-lg">
              <div className="font-medium text-sm">
                {draggedItem.resourceType === 'subject' && `${draggedItem.subject_code} - ${draggedItem.subject_name}`}
                {draggedItem.resourceType === 'faculty' && `${draggedItem.employee_id} - ${draggedItem.designation}`}
                {draggedItem.resourceType === 'room' && `${draggedItem.room_number} - ${draggedItem.room_name}`}
                {draggedItem.type === 'timetable-entry' && 'Moving Session...'}
              </div>
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
}