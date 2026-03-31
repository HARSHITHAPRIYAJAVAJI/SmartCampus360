import { useOutletContext } from "react-router-dom";
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

export default function Profile() {
    const { user } = useOutletContext<{ user: { name: string, id: string, role: string } }>();
    const isStudent = user.role === 'student';
    const isFaculty = user.role === 'faculty';
    const isAdmin = user.role === 'admin';

    // Data lookup
    const studentData = isStudent ? MOCK_STUDENTS.find(s => s.rollNumber.toUpperCase() === user.id.toUpperCase()) : null;
    const facultyData = (isFaculty || isAdmin) ? MOCK_FACULTY.find(f => f.id === user.id || f.name === user.name) : null;

    const profileData = isStudent ? {
        name: studentData?.name || user.name,
        role: "Student",
        id: studentData?.rollNumber || user.id,
        dept: studentData?.branch || "N/A",
        email: studentData?.email || "n/a",
        phone: studentData?.phone || "n/a",
        imageType: "avataaars"
    } : {
        name: facultyData?.name || user.name,
        role: facultyData?.designation || (isAdmin ? "Administrator" : "Faculty"),
        id: facultyData?.rollNumber || user.id,
        dept: facultyData?.department || "Administration",
        email: facultyData?.email || "n/a",
        phone: facultyData?.phone || "n/a",
        imageType: "initials"
    };

    const infoCards = isStudent ? [
        { label: "Roll Number", value: profileData.id, icon: UserCircle, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "Branch", value: profileData.dept, icon: Briefcase, color: "text-purple-500", bg: "bg-purple-50" },
        { label: "Level", value: `${studentData?.year || 1}th Year`, icon: GraduationCap, color: "text-emerald-500", bg: "bg-emerald-50" },
        { label: "Semester", value: studentData?.semester || 1, icon: BookOpen, color: "text-amber-500", bg: "bg-amber-50" },
    ] : [
        { label: "Staff ID", value: profileData.id, icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Department", value: profileData.dept, icon: Building2, color: "text-indigo-600", bg: "bg-indigo-50" },
        { label: "Experience", value: "8+ Years", icon: History, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Join Date", value: "Aug 2018", icon: CalendarDays, color: "text-amber-600", bg: "bg-amber-50" },
    ];

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
                                        <span className="text-sm font-semibold truncate max-w-[200px]">{info.value}</span>
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
                                <span className={`font-black ${isStudent ? 'text-green-600' : 'text-blue-600'}`}>{isStudent ? `${studentData?.attendance}%` : '98.4%'}</span>
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
                    <Card className="border-none shadow-md overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                Institutional Records
                            </CardTitle>
                            <Badge variant="outline" className={`font-bold ${isStudent ? 'text-primary' : 'text-teal-600'}`}>
                                Active Profile
                            </Badge>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {infoCards.map((card, i) => (
                                    <div key={i} className={`p-6 rounded-2xl ${card.bg} border border-transparent hover:border-border transition-all group`}>
                                        <div className={`p-3 rounded-xl bg-white dark:bg-black/20 ${card.color} shadow-sm w-fit mb-4 group-hover:scale-110 transition-transform`}>
                                            <card.icon className="w-6 h-6" />
                                        </div>
                                        <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">{card.label}</div>
                                        <div className="text-xl font-black text-slate-800 dark:text-slate-100">{card.value}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {isFaculty && (
                        <Card className="border-none shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">Research & Specialization</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 bg-muted/30 rounded-xl">
                                    <h4 className="font-bold text-sm mb-2 uppercase text-muted-foreground">Expertise</h4>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="secondary">Distributed Systems</Badge>
                                        <Badge variant="secondary">Big Data Analytics</Badge>
                                        <Badge variant="secondary">Machine Learning</Badge>
                                        <Badge variant="secondary">Cloud Computing</Badge>
                                    </div>
                                </div>
                                <div className="p-4 bg-muted/30 rounded-xl">
                                    <h4 className="font-bold text-sm mb-2 uppercase text-muted-foreground">Recent Publication</h4>
                                    <p className="text-sm italic">"Optimization of Load Balancing in Hybrid Clouds using Genetic Algorithms", IEEE 2024</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="border-none shadow-md overflow-hidden bg-muted/20">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-green-600" />
                                Credentials & Security
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 border rounded-xl bg-background">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <span className="text-sm font-medium">Single Sign-On (SSO) Status</span>
                                </div>
                                <Badge className="bg-green-500">Connected</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-xl bg-background">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <span className="text-sm font-medium">Digital Identity Verification</span>
                                </div>
                                <Badge className="bg-green-500">E-Verified</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
