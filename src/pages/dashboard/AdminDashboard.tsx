import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    BookOpen,
    TrendingUp,
    Bell
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { MOCK_STUDENTS } from "@/data/mockStudents";
import { MOCK_FACULTY } from "@/data/mockFaculty";
import { MOCK_COURSES } from "@/data/mockCourses";

export default function AdminDashboard() {
    const navigate = useNavigate();
    
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

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Bell className="h-5 w-5" />
                            <span>Recent Activity</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                            <div>
                                <p className="text-sm font-medium">New assignment posted</p>
                                <p className="text-xs text-muted-foreground">Data Structures - Due in 3 days</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
                            <div>
                                <p className="text-sm font-medium">Class rescheduled</p>
                                <p className="text-xs text-muted-foreground">Advanced Algorithms moved to 2 PM</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                            <div>
                                <p className="text-sm font-medium">Grade published</p>
                                <p className="text-xs text-muted-foreground">Database Systems - 89/100</p>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full mt-4">
                            View All Notifications
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
