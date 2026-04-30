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
const AttendanceDetails = lazy(() => import("./pages/dashboard/AttendanceDetails"));
const NotificationsPage = lazy(() => import("./pages/admin/NotificationsPage"));
const Placements = lazy(() => import("./pages/Placements"));
const NotFound = lazy(() => import("./pages/NotFound"));
const TimetableGenerator = lazy(() => import("./pages/admin/TimetableGenerator"));
const ComplianceDashboard = lazy(() => import("./pages/admin/ComplianceDashboard"));
const LearningPortal = lazy(() => import("./pages/student/LearningPortal"));
const FacultyManagement = lazy(() => import("./pages/admin/FacultyManagement"));
const FacultyLoad = lazy(() => import("./pages/admin/FacultyLoadDashboard"));
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
const RegularFeePayment = lazy(() => import("./pages/student/RegularFeePayment"));
const Downloads = lazy(() => import("./pages/student/LearningPortal")); 
const CommunicationHub = lazy(() => import("./pages/dashboard/CommunicationHub"));


const RequestsManagement = lazy(() => import("./pages/admin/RequestsManagement"));
const RecycleBin = lazy(() => import("./pages/admin/RecycleBin"));
const TimetableGeneratorInfo = lazy(() => import("./pages/features/TimetableGeneratorInfo"));
const StudentRecordsInfo = lazy(() => import("./pages/features/StudentRecordsInfo"));
const FacultyManagementInfo = lazy(() => import("./pages/features/FacultyManagementInfo"));
const CampusLocator = lazy(() => import("./pages/CampusLocator"));
const Modules = lazy(() => import("./pages/Modules"));
const CampusLocatorInfo = lazy(() => import("./pages/features/CampusLocatorInfo"));
const AcademicPlanningInfo = lazy(() => import("./pages/features/AcademicPlanningInfo"));
const AdminControlInfo = lazy(() => import("./pages/features/AdminControlInfo"));


// Lazy load UI overlays to reduce initial bundle size
const Toaster = lazy(() => import("@/components/ui/toaster").then(mod => ({ default: mod.Toaster })));
const Sonner = lazy(() => import("@/components/ui/sonner").then(mod => ({ default: mod.Toaster })));
const DashboardLayout = lazy(() => import("./components/layout/DashboardLayout").then(module => ({ default: module.DashboardLayout })));
const Layout = lazy(() => import("./components/common/Layout"));

const queryClient = new QueryClient();

const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
);

const RoleGuard = ({
    allowedRoles,
    userRole,
    children
}: {
    allowedRoles: string[],
    userRole: string,
    children: React.ReactNode
}) => {
    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
};

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
              <Route path="/find-people" element={<CampusLocator />} />
              <Route path="/courses" element={<Layout><div className="container mx-auto py-8"><CourseManagement readOnly={true} /></div></Layout>} />
              <Route path="/placements" element={<Placements />} />
              <Route path="/features/timetable-generator" element={<TimetableGeneratorInfo />} />
              <Route path="/features/student-records" element={<StudentRecordsInfo />} />
              <Route path="/features/faculty-management" element={<FacultyManagementInfo />} />
              <Route path="/features/campus-locator" element={<CampusLocatorInfo />} />
              <Route path="/features/academic-planning" element={<AcademicPlanningInfo />} />
              <Route path="/features/admin-control" element={<AdminControlInfo />} />
              <Route path="/modules" element={<Modules />} />
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
                <Route path="admin" element={<RoleGuard allowedRoles={['admin']} userRole={user?.role || ''}><Dashboard userRole="admin" /></RoleGuard>} />
                <Route path="faculty" element={<RoleGuard allowedRoles={['faculty', 'admin']} userRole={user?.role || ''}><Dashboard userRole="faculty" /></RoleGuard>} />
                <Route path="faculty/:id" element={<RoleGuard allowedRoles={['admin']} userRole={user?.role || ''}><Dashboard userRole="faculty" /></RoleGuard>} />
                <Route path="student" element={<RoleGuard allowedRoles={['student', 'admin']} userRole={user?.role || ''}><Dashboard userRole="student" /></RoleGuard>} />
                <Route path="student/:id" element={<RoleGuard allowedRoles={['admin']} userRole={user?.role || ''}><Dashboard userRole="student" /></RoleGuard>} />
                
                <Route path="timetable" element={user?.role === 'admin' ? <TimetableGenerator /> : <Timetable userRole={user?.role || 'student'} />} />
                <Route path="faculty-directory" element={<RoleGuard allowedRoles={['faculty', 'admin']} userRole={user?.role || ''}><FacultyManagement userRole={user?.role || ''} /></RoleGuard>} />
                <Route path="faculty-load" element={<RoleGuard allowedRoles={['admin']} userRole={user?.role || ''}><FacultyLoad /></RoleGuard>} />
                
                {/* Admin Only Routes */}
                <Route path="manage-courses" element={<RoleGuard allowedRoles={['admin']} userRole={user?.role || ''}><CourseManagement /></RoleGuard>} />
                <Route path="manage-rooms" element={<RoleGuard allowedRoles={['admin']} userRole={user?.role || ''}><RoomManagement /></RoleGuard>} />
                <Route path="analytics" element={<RoleGuard allowedRoles={['admin']} userRole={user?.role || ''}><AnalyticsAccreditation /></RoleGuard>} />
                <Route path="accreditation" element={<RoleGuard allowedRoles={['admin']} userRole={user?.role || ''}><AnalyticsAccreditation /></RoleGuard>} />
                <Route path="analytics-accreditation" element={<RoleGuard allowedRoles={['admin']} userRole={user?.role || ''}><AnalyticsAccreditation /></RoleGuard>} />
                <Route path="exams" element={<RoleGuard allowedRoles={['admin']} userRole={user?.role || ''}><ExamManagement /></RoleGuard>} />
                <Route path="users" element={<RoleGuard allowedRoles={['admin']} userRole={user?.role || ''}><UserManagement /></RoleGuard>} />
                <Route path="trash" element={<RoleGuard allowedRoles={['admin']} userRole={user?.role || ''}><RecycleBin /></RoleGuard>} />
                
                {/* Faculty/Admin Routes */}
                <Route path="classes" element={<RoleGuard allowedRoles={['faculty', 'admin']} userRole={user?.role || ''}><MyClasses /></RoleGuard>} />
                <Route path="leave" element={<RoleGuard allowedRoles={['faculty', 'admin']} userRole={user?.role || ''}><LeaveManagement /></RoleGuard>} />
                <Route path="students" element={<RoleGuard allowedRoles={['faculty', 'admin']} userRole={user?.role || ''}><StudentRecords /></RoleGuard>} />
                
                {/* Student/Admin Common Routes */}
                <Route path="training" element={<LearningPortal />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="settings" element={<Settings />} />
                <Route path="profile" element={<Profile />} />
                <Route path="profile/:id" element={<Profile />} />
                
                {/* Student Specific Routes */}
                <Route path="courses" element={<RoleGuard allowedRoles={['student', 'admin']} userRole={user?.role || ''}><MyCourses /></RoleGuard>} />
                <Route path="grades" element={<RoleGuard allowedRoles={['student', 'admin']} userRole={user?.role || ''}><Grades /></RoleGuard>} />
                <Route path="student/fees/regular" element={<RoleGuard allowedRoles={['student', 'admin']} userRole={user?.role || ''}><RegularFeePayment /></RoleGuard>} />
                <Route path="student/fees/*" element={<RoleGuard allowedRoles={['student', 'admin']} userRole={user?.role || ''}><StudentFees /></RoleGuard>} />
                <Route path="student/downloads" element={<RoleGuard allowedRoles={['student', 'admin']} userRole={user?.role || ''}><Downloads /></RoleGuard>} />
                <Route path="attendance" element={<RoleGuard allowedRoles={['student', 'admin']} userRole={user?.role || ''}><AttendanceDetails /></RoleGuard>} />
                <Route path="requests" element={<RoleGuard allowedRoles={['admin']} userRole={user?.role || ''}><RequestsManagement /></RoleGuard>} />
                <Route path="communications" element={<CommunicationHub />} />
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
