import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, User, BookOpen, MapPin } from "lucide-react";
import { DraggableResource } from "./DraggableResource";

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

interface ResourcePanelProps {
  faculty: Faculty[];
  subjects: Subject[];
  rooms: Room[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterDepartment: string;
  onFilterChange: (department: string) => void;
  departments: string[];
}

export function ResourcePanel({
  faculty,
  subjects,
  rooms,
  searchTerm,
  onSearchChange,
  filterDepartment,
  onFilterChange,
  departments
}: ResourcePanelProps) {
  const [activeTab, setActiveTab] = useState('faculty');

  const filterBySearch = <T extends { [key: string]: any }>(items: T[], searchFields: string[]) => {
    if (!searchTerm) return items;
    
    return items.filter(item => 
      searchFields.some(field => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], item);
        return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  };

  const filterByDepartment = <T extends { department: string }>(items: T[]) => {
    if (!filterDepartment) return items;
    return items.filter(item => item.department === filterDepartment);
  };

  const filteredFaculty = filterByDepartment(
    filterBySearch(faculty, ['employee_id', 'profiles.first_name', 'profiles.last_name', 'designation'])
  );

  const filteredSubjects = filterByDepartment(
    filterBySearch(subjects, ['subject_code', 'subject_name'])
  );

  const filteredRooms = filterBySearch(rooms, ['room_number', 'room_name', 'building']);

  const getFacultyName = (facultyMember: Faculty) => {
    if (facultyMember.profiles?.first_name || facultyMember.profiles?.last_name) {
      return `${facultyMember.profiles.first_name || ''} ${facultyMember.profiles.last_name || ''}`.trim();
    }
    return facultyMember.employee_id;
  };

  const getRoomTypeColor = (type: string) => {
    const colors = {
      classroom: 'bg-blue-100 text-blue-800',
      laboratory: 'bg-green-100 text-green-800',
      auditorium: 'bg-purple-100 text-purple-800',
      seminar_hall: 'bg-orange-100 text-orange-800',
      exam_hall: 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getSessionTypeColor = (type: string) => {
    const colors = {
      theory: 'bg-blue-100 text-blue-800',
      lab: 'bg-green-100 text-green-800',
      both: 'bg-purple-100 text-purple-800'
    };
    
    if (type === 'both') return colors.both;
    return colors[type as keyof typeof colors] || colors.theory;
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Resources
        </CardTitle>
        
        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterDepartment} onValueChange={onFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faculty" className="text-xs">
              <User className="h-3 w-3 mr-1" />
              Faculty
            </TabsTrigger>
            <TabsTrigger value="subjects" className="text-xs">
              <BookOpen className="h-3 w-3 mr-1" />
              Subjects
            </TabsTrigger>
            <TabsTrigger value="rooms" className="text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              Rooms
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faculty" className="space-y-2 mt-4">
            <div className="text-sm text-muted-foreground mb-2">
              {filteredFaculty.length} faculty members
            </div>
            {filteredFaculty.map(facultyMember => (
              <DraggableResource
                key={facultyMember.id}
                id={facultyMember.id}
                type="faculty"
                data={facultyMember}
              >
                <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-grab active:cursor-grabbing transition-colors">
                  <div className="font-medium text-sm">
                    {getFacultyName(facultyMember)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {facultyMember.employee_id} • {facultyMember.designation}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {facultyMember.department}
                  </div>
                  {facultyMember.specialization.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {facultyMember.specialization.slice(0, 2).map(spec => (
                        <Badge key={spec} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                      {facultyMember.specialization.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{facultyMember.specialization.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </DraggableResource>
            ))}
          </TabsContent>

          <TabsContent value="subjects" className="space-y-2 mt-4">
            <div className="text-sm text-muted-foreground mb-2">
              {filteredSubjects.length} subjects
            </div>
            {filteredSubjects.map(subject => (
              <DraggableResource
                key={subject.id}
                id={subject.id}
                type="subject"
                data={subject}
              >
                <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-grab active:cursor-grabbing transition-colors">
                  <div className="font-medium text-sm">
                    {subject.subject_code}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {subject.subject_name}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-muted-foreground">
                      Sem {subject.semester} • {subject.credits} credits
                    </div>
                    <Badge 
                      className="text-xs"
                      variant={subject.theory_hours && subject.lab_hours ? "default" : "secondary"}
                    >
                      {subject.theory_hours && subject.lab_hours ? 'Theory + Lab' : 
                       subject.lab_hours ? 'Lab' : 'Theory'}
                    </Badge>
                  </div>
                </div>
              </DraggableResource>
            ))}
          </TabsContent>

          <TabsContent value="rooms" className="space-y-2 mt-4">
            <div className="text-sm text-muted-foreground mb-2">
              {filteredRooms.length} rooms
            </div>
            {filteredRooms.map(room => (
              <DraggableResource
                key={room.id}
                id={room.id}
                type="room"
                data={room}
              >
                <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-grab active:cursor-grabbing transition-colors">
                  <div className="font-medium text-sm">
                    {room.room_number}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {room.room_name} • Capacity: {room.capacity}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {room.building} • Floor {room.floor}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <Badge className={`text-xs ${getRoomTypeColor(room.room_type)}`}>
                      {room.room_type.replace('_', ' ')}
                    </Badge>
                    {room.facilities.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        +{room.facilities.length} facilities
                      </div>
                    )}
                  </div>
                </div>
              </DraggableResource>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}