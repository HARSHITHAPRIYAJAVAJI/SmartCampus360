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

import AdminDashboard from "./AdminDashboard";
import FacultyDashboard from "./FacultyDashboard";
import StudentDashboard from "./StudentDashboard";
import { useParams } from "react-router-dom";

interface DashboardProps {
  userRole: string;
}

export default function Dashboard({ userRole }: DashboardProps) {
  const { id } = useParams();
  
  if (userRole === "admin" && !id) return <AdminDashboard />;
  
  // If we have an ID, we're likely an admin viewing a specific person's dashboard
  // Or a user viewing their own (though usually ID isn't in the base /dashboard route for them)
  
  if (userRole === "faculty" || (userRole === "admin" && window.location.pathname.includes('/faculty/'))) {
     return <FacultyDashboard facultyId={id} />;
  }
  
  return <StudentDashboard studentId={id} />;
}