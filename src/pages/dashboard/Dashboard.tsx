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

interface DashboardProps {
  userRole: string;
}

export default function Dashboard({ userRole }: DashboardProps) {
  if (userRole === "admin") return <AdminDashboard />;
  if (userRole === "faculty") return <FacultyDashboard />;
  return <StudentDashboard />;
}