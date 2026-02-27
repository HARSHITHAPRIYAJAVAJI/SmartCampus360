import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  BookOpen,
  TrendingUp,
  Clock,
  Bell,
  FileText,
  Award,
  AlertCircle,
  CheckCircle
} from "lucide-react";

interface DashboardProps {
  userRole: string;
}

export default function Dashboard({ userRole }: DashboardProps) {
  const getStats = () => {
    switch (userRole) {
      case "admin":
        return [
          { title: "Total Students", value: "2,847", icon: Users, change: "+12%", color: "text-primary" },
          { title: "Faculty Members", value: "156", icon: Users, change: "+3%", color: "text-success" },
          { title: "Active Courses", value: "89", icon: BookOpen, change: "+8%", color: "text-warning" },
          { title: "Completion Rate", value: "94.2%", icon: TrendingUp, change: "+2.1%", color: "text-accent" },
        ];
      case "faculty":
        return [
          { title: "My Classes", value: "8", icon: BookOpen, change: "Today", color: "text-primary" },
          { title: "Students", value: "156", icon: Users, change: "Total", color: "text-success" },
          { title: "Pending Grades", value: "23", icon: FileText, change: "Due Soon", color: "text-warning" },
          { title: "Attendance", value: "92%", icon: CheckCircle, change: "This Week", color: "text-accent" },
        ];
      case "student":
        return [
          { title: "Current Courses", value: "6", icon: BookOpen, change: "Active", color: "text-primary" },
          { title: "Credits Earned", value: "42", icon: Award, change: "/ 120", color: "text-success" },
          { title: "Assignments Due", value: "4", icon: Clock, change: "This Week", color: "text-warning" },
          { title: "GPA", value: "8.8", icon: TrendingUp, change: "+0.2", color: "text-accent" },
        ];
      default:
        return [];
    }
  };

  const getQuickActions = () => {
    switch (userRole) {
      case "admin":
        return [
          { title: "Add New User", description: "Register new students or faculty" },
          { title: "Generate Reports", description: "Create accreditation reports" },
          { title: "Manage Courses", description: "Add or modify course catalog" },
          { title: "System Settings", description: "Configure platform settings" },
        ];
      case "faculty":
        return [
          { title: "Take Attendance", description: "Mark student attendance for today" },
          { title: "Grade Assignments", description: "Review and grade pending submissions" },
          { title: "Schedule Office Hours", description: "Set availability for student meetings" },
          { title: "Submit Leave Request", description: "Apply for leave or substitution" },
        ];
      case "student":
        return [
          { title: "View Timetable", description: "Check today's class schedule" },
          { title: "Submit Assignment", description: "Upload pending assignments" },
          { title: "Join Skill Training", description: "Enroll in new skill courses" },
          { title: "Check Grades", description: "View latest grades and feedback" },
        ];
      default:
        return [];
    }
  };

  const stats = getStats();
  const quickActions = getQuickActions();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg p-6 text-primary-foreground">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {userRole === "student" ? "Student" : userRole === "faculty" ? "Professor" : "Administrator"}!
        </h1>
        <p className="text-primary-foreground/80">
          {userRole === "admin"
            ? "Manage your institution efficiently with our comprehensive tools."
            : userRole === "faculty"
              ? "Track your classes, students, and academic responsibilities."
              : "Stay on top of your courses, assignments, and academic progress."
          }
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
            <CardDescription>Frequently used features for {userRole}s</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <div
                  key={index}
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

      {/* Today's Schedule Preview - Hidden for Admin */}
      {userRole !== 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Today's Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: "09:00 AM", title: "Advanced Algorithms", room: "Room 301", type: "lecture" },
                { time: "11:00 AM", title: "Database Systems", room: "Lab 2", type: "lab" },
                { time: "02:00 PM", title: "Software Engineering", room: "Room 205", type: "lecture" },
                { time: "04:00 PM", title: "Faculty Meeting", room: "Conference Room", type: "meeting" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-mono text-muted-foreground">{item.time}</div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.room}</p>
                    </div>
                  </div>
                  <Badge variant={item.type === "lecture" ? "default" : item.type === "lab" ? "secondary" : "outline"}>
                    {item.type}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View Full Timetable
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}