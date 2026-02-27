import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Filter, Users, BookOpen, Clock, Calendar, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

type Faculty = {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  status: 'active' | 'on_leave' | 'inactive';
  courses: string[];
};

export default function FacultyManagement() {
  // Mock data - replace with actual data from your API
  const facultyData: Faculty[] = [
    {
      id: 'FAC001',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@university.edu',
      phone: '+1 (555) 123-4567',
      department: 'Computer Science',
      designation: 'Professor',
      status: 'active',
      courses: ['CS101', 'CS301', 'CS450']
    },
    {
      id: '22K91A6664',
      name: 'Prof. Michael Chen',
      email: 'michael.chen@university.edu',
      phone: '+1 (555) 234-5678',
      department: 'Mathematics',
      designation: 'Associate Professor',
      status: 'active',
      courses: ['MATH201', 'MATH305']
    },
    {
      id: 'FAC003',
      name: 'Dr. Emily Wilson',
      email: 'emily.wilson@university.edu',
      phone: '+1 (555) 345-6789',
      department: 'Physics',
      designation: 'Assistant Professor',
      status: 'on_leave',
      courses: ['PHYS101', 'PHYS202']
    },
    {
      id: 'FAC004',
      name: 'Prof. David Kim',
      email: 'david.kim@university.edu',
      phone: '+1 (555) 456-7890',
      department: 'Computer Science',
      designation: 'Professor',
      status: 'active',
      courses: ['CS201', 'CS401', 'CS550']
    },
    {
      id: 'FAC005',
      name: 'Dr. Lisa Rodriguez',
      email: 'lisa.rodriguez@university.edu',
      phone: '+1 (555) 567-8901',
      department: 'Mathematics',
      designation: 'Associate Professor',
      status: 'inactive',
      courses: ['MATH101', 'MATH205']
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Faculty Management</h2>
          <p className="text-muted-foreground">
            Manage faculty members, their details, and course assignments
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Faculty
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search faculty..."
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="h-9">
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Faculty</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="on_leave">On Leave</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="space-y-4">
                {facultyData.map((faculty) => (
                  <Card key={faculty.id} className="overflow-hidden">
                    <div className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <div className="rounded-full bg-primary/10 p-3">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{faculty.name}</h3>
                            <p className="text-sm text-muted-foreground">{faculty.designation}</p>
                          </div>
                        </div>
                        <div className="flex flex-col md:items-end gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(faculty.status)}`}>
                            {faculty.status.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}
                          </span>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>{faculty.department}</span>
                            <span>•</span>
                            <span>{faculty.courses.length} courses</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{faculty.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{faculty.phone}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {faculty.courses.map((course) => (
                              <span key={course} className="px-2 py-1 bg-secondary rounded-md text-xs">
                                {course}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
