import { useMemo } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { MOCK_STUDENTS } from "@/data/mockStudents";
import { MOCK_FACULTY } from "@/data/mockFaculty";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
    User, Mail, Phone, MapPin, GraduationCap, 
    Calendar, BookOpen, Award, CheckCircle2, 
    Clock, Smartphone, Globe, Briefcase, Star,
    FileText, UserCircle, Users, TrendingUp, Building2,
    ShieldCheck, CalendarDays, History
} from "lucide-react";
import { motion } from "framer-motion";
import { YEAR_IN_CHARGES, CLASS_TEACHERS, getSectionCR } from "@/data/mockHierarchy";

export default function Profile() {
    const { user } = useOutletContext<{ user: { name: string, id: string, role: string } }>();
    const { id: paramId } = useParams();

    // Data lookup: prefer paramId if provided, otherwise use logged-in user's ID
    const targetId = paramId || user.id;

    // Determine target data based on identification
    // Handle both ID, Roll Number, and Name (as fallback for current user)
    const facultyData = MOCK_FACULTY.find(f => 
        f.id === targetId || 
        f.rollNumber === targetId || 
        (!paramId && f.name === user.name)
    );
    
    const studentData = useMemo(() => {
        if (facultyData) return null;
        const saved = localStorage.getItem('smartcampus_student_directory');
        if (saved) {
            const students = JSON.parse(saved);
            const found = students.find((s: any) => 
                s.id === targetId || 
                s.rollNumber.toUpperCase() === targetId.toUpperCase()
            );
            if (found) return found;
        }
        return MOCK_STUDENTS.find(s => 
            s.id === targetId || 
            s.rollNumber.toUpperCase() === targetId.toUpperCase()
        );
    }, [targetId, facultyData]);

    const isStudent = !!studentData;
    const isFaculty = !!facultyData;
    const isAdmin = user.role === 'admin';

    const profileData = isStudent ? {
        name: studentData?.name || "Student",
        role: "Student",
        id: studentData?.rollNumber || targetId,
        dept: studentData?.branch || "N/A",
        email: studentData?.email || "n/a",
        phone: studentData?.phone || "n/a",
        imageType: "avataaars"
    } : {
        name: facultyData?.name || (isAdmin && !paramId ? user.name : "Faculty Member"),
        role: facultyData?.designation || (isAdmin && !paramId ? "Administrator" : "Faculty"),
        id: facultyData?.rollNumber || targetId,
        dept: facultyData?.department || (isAdmin && !paramId ? "Administration" : "N/A"),
        email: facultyData?.email || "n/a",
        phone: facultyData?.phone || "n/a",
        imageType: "initials"
    };

    // Role-specific hierarchy checks
    const isCR = isStudent && studentData && getSectionCR(studentData.branch, studentData.year, studentData.section)?.id === studentData.id;
    
    const classTeacherSection = isFaculty && facultyData ? CLASS_TEACHERS.filter(ct => ct.facultyId === facultyData.id) : [];
    const yearInChargeInfo = isFaculty && facultyData ? YEAR_IN_CHARGES.filter(yic => yic.facultyId === facultyData.id) : [];



    return (
        <div className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
            {/* Header / Banner Profile */}
            <div className="relative">
                <div className={`h-48 w-full bg-gradient-to-r ${isStudent ? 'from-violet-600 via-indigo-600 to-primary' : 'from-teal-600 via-blue-700 to-indigo-900'} rounded-3xl shadow-lg relative overflow-hidden text-white p-8`}>
                    <div className="absolute inset-0 opacity-10">
                        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                            </pattern>
                            <rect width="100" height="100" fill="url(#grid)" />
                        </svg>
                    </div>
                </div>
                
                <div className="px-8 -mt-16 flex flex-col md:flex-row items-end gap-6 relative z-10">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="p-1.5 bg-background rounded-full shadow-2xl relative"
                    >
                        <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background">
                            <AvatarImage src={`https://api.dicebear.com/7.x/${profileData.imageType}/svg?seed=${profileData.name}`} />
                            <AvatarFallback className="text-4xl bg-muted">{profileData.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute bottom-4 right-4 h-6 w-6 rounded-full border-4 border-background shadow-sm ${isStudent ? 'bg-green-500' : 'bg-blue-500'}`} />
                    </motion.div>
                    
                    <div className="pb-4 flex-1">
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-1">{profileData.name}</h1>
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge variant="secondary" className={`font-bold px-3 py-1 border-none ${isStudent ? 'bg-primary/10 text-primary' : 'bg-teal-100 text-teal-800'}`}>
                                {profileData.id}
                            </Badge>
                            <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                                {isStudent ? <GraduationCap className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                                {profileData.role === 'Student' ? `${profileData.dept} Department` : profileData.role}
                            </div>
                            {isCR && (
                                <Badge className="bg-amber-100 text-amber-700 border-amber-200 font-black px-3 ml-2">
                                    <Star className="w-3 h-3 mr-1 fill-amber-500" /> CLASS REPRESENTATIVE
                                </Badge>
                            )}
                            {classTeacherSection.length > 0 && (
                                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 font-black px-3 ml-2">
                                    CLASS TEACHER: {classTeacherSection.map(ct => `${ct.year}-${ct.section}`).join(', ')}
                                </Badge>
                            )}
                            {yearInChargeInfo.length > 0 && (
                                <Badge className="bg-violet-100 text-violet-700 border-violet-200 font-black px-3 ml-2">
                                    YEAR IN-CHARGE: {yearInChargeInfo.map(yic => `${yic.year}${yic.year === 1 ? 'st' : yic.year === 2 ? 'nd' : yic.year === 3 ? 'rd' : 'th'} Year`).join(', ')}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                    <Card className="border-none shadow-md overflow-hidden">
                        <CardHeader className="bg-muted/30 border-b">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                Contact Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {[
                                { label: "Institutional Email", value: profileData.email, icon: Mail },
                                { label: "Emergency Phone", value: profileData.phone, icon: Smartphone },
                                { label: "Work Location", value: isStudent ? "Hostel Block A" : "Faculty Block C", icon: MapPin },
                                { label: "Reporting To", value: isStudent ? "HOD (AIML)" : "Dean Academic", icon: Users },
                            ].map((info, i) => (
                                <div key={i} className="flex items-center gap-4 group/item">
                                    <div className="p-2.5 rounded-xl bg-muted text-muted-foreground group-hover/item:bg-primary/10 group-hover/item:text-primary transition-colors">
                                        <info.icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{info.label}</span>
                                        <span className="text-sm font-semibold break-all">{info.value}</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className={`border-none shadow-md ${isStudent ? 'bg-gradient-to-br from-primary/5 to-transparent' : 'bg-gradient-to-br from-teal-500/5 to-transparent'}`}>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Award className="w-5 h-5 text-amber-500" />
                                Academic Merits
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center bg-background/50 p-4 rounded-2xl border border-primary/5">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${isStudent ? 'bg-green-500/10 text-green-600' : 'bg-blue-500/10 text-blue-600'}`}>
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-sm">{isStudent ? 'Attendance' : 'Punctuality'}</span>
                                </div>
                                <span className={`font-black ${isStudent ? 'text-green-600' : 'text-blue-600'}`}>
                                    {isStudent ? (Math.min(studentData?.attendance || 0, 91)) + '%' : '91%'}
                                </span>
                            </div>
                            {isStudent ? (
                                <div className="flex justify-between items-center bg-background/50 p-4 rounded-2xl border border-primary/5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg">
                                            <TrendingUp className="w-5 h-5" />
                                        </div>
                                        <span className="font-bold text-sm">CGPA</span>
                                    </div>
                                    <span className="font-black text-blue-600">{studentData?.grade.toFixed(2)}</span>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center bg-background/50 p-4 rounded-2xl border border-primary/5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-lg">
                                            <BookOpen className="w-5 h-5" />
                                        </div>
                                        <span className="font-bold text-sm">Research Papers</span>
                                    </div>
                                    <span className="font-black text-indigo-600">14</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-6">


                    {isFaculty && (
                        <Card className="border-none shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-indigo-500" />
                                    Academic Specializations
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 bg-muted/30 rounded-xl">
                                    <h4 className="font-bold text-xs mb-3 uppercase text-muted-foreground tracking-widest">Subjects Taught</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {facultyData?.specialization && facultyData.specialization.length > 0 ? (
                                            facultyData.specialization.map((subject, idx) => (
                                                <Badge key={idx} variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100 font-bold px-3 py-1">
                                                    {subject}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-xs text-muted-foreground italic">No specialized subjects listed</span>
                                        )}
                                    </div>
                                </div>

                            </CardContent>
                        </Card>
                    )}

                </div>
            </div>
        </div>
    );
}
