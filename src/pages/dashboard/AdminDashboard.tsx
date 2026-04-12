import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    BookOpen,
    TrendingUp,
    Bell,
    Mail,
    Phone,
    ShieldCheck,
    Building2
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MOCK_STUDENTS } from "@/data/mockStudents";
import { MOCK_FACULTY } from "@/data/mockFaculty";
import { MOCK_COURSES } from "@/data/mockCourses";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [selectedFaculty, setSelectedFaculty] = useState<any>(null);
    
    // Real-time data counts
    const totalStudents = MOCK_STUDENTS.length.toLocaleString();
    const totalFaculty = MOCK_FACULTY.length.toLocaleString();
    const totalCourses = MOCK_COURSES.length;
    const completionRate = "94.2%"; // Static for now or can be derived if needed

    const stats = [
        { title: "Total Students", value: totalStudents, icon: Users, change: "+12%", color: "text-primary" },
        { title: "Faculty Members", value: totalFaculty, icon: Users, change: "+3%", color: "text-success" },
        { title: "Active Courses", value: totalCourses.toString(), icon: BookOpen, change: "+8%", color: "text-warning" },
        { title: "Completion Rate", value: completionRate, icon: TrendingUp, change: "+2.1%", color: "text-accent" },
    ];

    const quickActions = [
        { title: "Manage Student Records", description: "View the master student directory", action: () => navigate('/dashboard/students') },
        { title: "Generate Reports", description: "Create accreditation reports", action: () => navigate('/dashboard/accreditation') },
        { title: "Manage Courses", description: "Add or modify course catalog", action: () => navigate('/dashboard/manage-courses') },
        { title: "Exam Seating Allocation", description: "Generate and manage exam tables", action: () => navigate('/dashboard/exams') },
        { title: "Institutional System Reset", description: "Wipe all local data and restart engine", action: () => {
            if (window.confirm("⚠️ DANGER: This will PERMANENTLY DELETE all generated timetables, exam schedules, and local directory changes. Are you sure?")) {
                localStorage.removeItem('published_timetables');
                localStorage.removeItem('EXAM_SCHEDULE');
                localStorage.removeItem('EXAM_SEATING_PLAN');
                localStorage.removeItem('INVIGILATION_LIST');
                localStorage.removeItem('EXAM_TIMETABLES');
                localStorage.removeItem('smartcampus_student_directory');
                localStorage.removeItem('smartcampus_faculty_directory');
                window.location.reload();
            }
        }},
        { title: "System Settings", description: "Configure platform settings", action: () => navigate('/dashboard/settings') },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-900 rounded-lg p-6 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Welcome back, Administrator!</h1>
                <p className="text-indigo-100">
                    Manage your institution efficiently with our comprehensive tools.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <span className="text-success">↗ {stat.change}</span> from last period
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Departmental Leadership */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <Users className="h-5 w-5 text-indigo-600" />
                            Departmental Leadership (HODs)
                        </CardTitle>
                        <CardDescription>Academic heads for each institutional branch</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {MOCK_FACULTY.filter(f => f.designation.includes('HOD')).map((hod) => (
                                <div key={hod.id} className="p-4 border border-border rounded-xl bg-muted/20 flex flex-col items-center text-center">
                                    <div className="h-12 w-12 rounded-full border-2 border-primary/20 bg-primary/5 flex items-center justify-center mb-3">
                                        <Users className="h-6 w-6 text-primary" />
                                    </div>
                                    <h4 className="font-bold text-sm">{hod.name}</h4>
                                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-wider mt-1">{hod.department} HOD</p>
                                    <Button variant="link" size="sm" className="h-8 mt-2 text-primary" onClick={() => setSelectedFaculty(hod)}>View Profile</Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Frequently used features for Admins</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {quickActions.map((action, index) => (
                                <div
                                    key={index}
                                    onClick={action.action}
                                    className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                                >
                                    <h3 className="font-medium mb-1">{action.title}</h3>
                                    <p className="text-sm text-muted-foreground">{action.description}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* Faculty Info Dialog */}
            <Dialog open={!!selectedFaculty} onOpenChange={(open) => !open && setSelectedFaculty(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Faculty Information</DialogTitle>
                        <DialogDescription>
                            Professional contact and departmental details.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedFaculty && (
                        <div className="space-y-6 pt-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16 border-2 border-primary/20">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedFaculty.name}`} />
                                    <AvatarFallback>{selectedFaculty.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-lg font-bold">{selectedFaculty.name}</h3>
                                    <Badge variant="secondary" className="font-bold bg-primary/10 text-primary">
                                        {selectedFaculty.rollNumber}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Designation</p>
                                        <p className="font-semibold">{selectedFaculty.designation}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Building2 className="w-4 h-4 text-indigo-600" />
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Department</p>
                                        <p className="font-semibold">{selectedFaculty.department}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="w-4 h-4 text-indigo-600" />
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Institutional Email</p>
                                        <p className="font-semibold">{selectedFaculty.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone className="w-4 h-4 text-indigo-600" />
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Direct Phone</p>
                                        <p className="font-semibold">{selectedFaculty.phone}</p>
                                    </div>
                                </div>
                                {selectedFaculty.specialization && (
                                    <div className="flex items-start gap-3 text-sm">
                                        <BookOpen className="w-4 h-4 text-indigo-600 mt-1" />
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Specialization</p>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {selectedFaculty.specialization.map((s: string, i: number) => (
                                                    <Badge key={i} variant="outline" className="text-[9px] font-bold border-indigo-100 bg-indigo-50/30 text-indigo-700">
                                                        {s}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
