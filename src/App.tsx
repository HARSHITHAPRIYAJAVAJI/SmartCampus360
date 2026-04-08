import { useState, lazy, Suspense } from "react";
// Toaster and Sonner are lazy loaded
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import ScrollToTop from "./components/common/ScrollToTop";

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));
const Admissions = lazy(() => import("./pages/Admissions"));
const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const AdminDashboard = lazy(() => import("./pages/dashboard/AdminDashboard"));
const FacultyDashboard = lazy(() => import("./pages/dashboard/FacultyDashboard"));
const StudentDashboard = lazy(() => import("./pages/dashboard/StudentDashboard"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Timetable = lazy(() => import("./pages/dashboard/Timetable"));
const NotificationsPage = lazy(() => import("./pages/admin/NotificationsPage"));
const Placements = lazy(() => import("./pages/Placements"));
const NotFound = lazy(() => import("./pages/NotFound"));
const TimetableGenerator = lazy(() => import("./pages/admin/TimetableGenerator"));
const ComplianceDashboard = lazy(() => import("./pages/admin/ComplianceDashboard"));
const LearningPortal = lazy(() => import("./pages/student/LearningPortal"));
const FacultyManagement = lazy(() => import("./pages/admin/FacultyManagement"));
const CourseManagement = lazy(() => import("./pages/admin/CourseManagement"));
const RoomManagement = lazy(() => import("./pages/admin/RoomManagement"));
const AnalyticsAccreditation = lazy(() => import("./pages/admin/AnalyticsAccreditation"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const MyClasses = lazy(() => import("./pages/faculty/MyClasses"));
const LeaveManagement = lazy(() => import("./pages/faculty/LeaveManagement"));
const StudentRecords = lazy(() => import("./pages/faculty/StudentRecords"));
const MyCourses = lazy(() => import("./pages/student/MyCourses"));
const Grades = lazy(() => import("./pages/student/Grades"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Library = lazy(() => import("./pages/academics/Library"));
const Departments = lazy(() => import("./pages/academics/Departments"));
const CampusLife = lazy(() => import("./pages/about/CampusLife"));
const Contact = lazy(() => import("./pages/Contact"));
const Programs = lazy(() => import("./pages/academics/Programs"));
const Vision = lazy(() => import("./pages/about/Vision"));
const Leadership = lazy(() => import("./pages/about/Leadership"));
const ExamManagement = lazy(() => import("./pages/admin/ExamManagement"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const StudentFees = lazy(() => import("./pages/student/StudentFees"));
const Downloads = lazy(() => import("./pages/student/LearningPortal")); // Use LearningPortal as placeholder for downloads


// Lazy load UI overlays to reduce initial bundle size
const Toaster = lazy(() => import("@/components/ui/toaster").then(mod => ({ default: mod.Toaster })));
const Sonner = lazy(() => import("@/components/ui/sonner").then(mod => ({ default: mod.Toaster })));
const DashboardLayout = lazy(() => import("./components/layout/DashboardLayout").then(module => ({ default: module.DashboardLayout })));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Loader2 className="h-12 w-12 animate-spin text-primary" />
  </div>
);

const App = () => {
  const [user, setUser] = useState<{ name: string; id: string; role: string } | null>(() => {
    try {
      const savedUser = localStorage.getItem('smartcampus_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error("Failed to parse saved user:", e);
      return null;
    }
  });

  const handleLogin = (userData: { id: string; role: string; name: string }) => {
    setUser(userData);
    localStorage.setItem('smartcampus_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('smartcampus_user');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Suspense fallback={null}>
          <Toaster />
          <Sonner />
        </Suspense>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admissions" element={<Admissions />} />
              <Route path="/admissions/apply" element={<Admissions />} />
              <Route path="/academics/library" element={<Library />} />
              <Route path="/academics/departments" element={<Departments />} />
              <Route path="/academics/programs" element={<Programs />} />
              <Route path="/about/campus-life" element={<CampusLife />} />
              <Route path="/about/vision" element={<Vision />} />
              <Route path="/about/leadership" element={<Leadership />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/placements" element={<Placements />} />
              <Route path="/login">
                <Route
                  index
                  element={
                    user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login/student" replace />
                  }
                />
                <Route
                  path="student"
                  element={
                    user ? <Navigate to="/dashboard" replace /> : <Login userType="student" onLogin={handleLogin} />
                  }
                />
                <Route
                  path="staff"
                  element={
                    user ? <Navigate to="/dashboard" replace /> : <Login userType="faculty" onLogin={handleLogin} />
                  }
                />
                <Route
                  path="admin"
                  element={
                    user ? <Navigate to="/dashboard" replace /> : <Login userType="admin" onLogin={handleLogin} />
                  }
                />
              </Route>
              <Route
                path="signup"
                element={
                  user ? <Navigate to="/dashboard" replace /> : <Signup onSignup={handleLogin} />
                }
              />
              <Route
                path="forgot-password"
                element={
                  user ? <Navigate to="/dashboard" replace /> : <ForgotPassword />
                }
              />
              <Route
                path="reset-password"
                element={
                  user ? <Navigate to="/dashboard" replace /> : <ResetPassword />
                }
              />

              {/* Protected Dashboard Routes */}
              <Route
                path="/dashboard"
                element={
                  user ? (
                    <DashboardLayout user={user} onLogout={handleLogout} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              >
                <Route index element={<Dashboard userRole={user?.role || ''} />} />
                <Route path="admin" element={<Dashboard userRole="admin" />} />
                <Route path="faculty" element={<Dashboard userRole="faculty" />} />
                <Route path="student" element={<Dashboard userRole="student" />} />
                <Route path="timetable" element={user?.role === 'admin' ? <TimetableGenerator /> : <Timetable userRole={user?.role || 'student'} />} />
                <Route path="faculty-directory" element={<FacultyManagement userRole={user?.role || 'student'} />} />
                <Route path="manage-courses" element={<CourseManagement />} />
                <Route path="manage-rooms" element={<RoomManagement />} />
                <Route path="analytics" element={<AnalyticsAccreditation />} />
                <Route path="accreditation" element={<AnalyticsAccreditation />} />
                <Route path="exams" element={<ExamManagement />} />
                <Route path="training" element={<LearningPortal />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="settings" element={<Settings />} />
                {/* Role-specific routes */}
                <Route path="classes" element={<MyClasses />} />
                <Route path="leave" element={<LeaveManagement />} />
                <Route path="students" element={<StudentRecords />} />
                <Route path="courses" element={<MyCourses />} />
                <Route path="grades" element={<Grades />} />
                <Route path="profile" element={<Profile />} />
                <Route path="analytics-accreditation" element={<AnalyticsAccreditation />} />
                <Route path="users" element={<UserManagement />} />
                
                {/* Fee Routes */}
                <Route path="student/fees/*" element={<StudentFees />} />
                <Route path="student/downloads" element={<Downloads />} />
              </Route>

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
