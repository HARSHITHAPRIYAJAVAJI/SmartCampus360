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
    FileText, UserCircle, Users, TrendingUp,
    Shield, School, Award as Medal
} from "lucide-react";
import { motion } from "framer-motion";

export default function Profile() {
    const { user } = useOutletContext<{ user: { name: string, id: string, role: string } }>();
    
    // Role-based data fetching
    const studentData = user.role === 'student' ? MOCK_STUDENTS.find(s => s.rollNumber.toUpperCase() === user.id.toUpperCase()) : null;
    const facultyData = user.role === 'faculty' ? MOCK_FACULTY.find(f => f.id === user.id || f.rollNumber === user.id) : null;
    const isAdmin = user.role === 'admin';

    // 1. Student View
    if (user.role === 'student' && studentData) {
        const infoCards = [
            { label: "Roll Number", value: studentData.rollNumber, icon: UserCircle, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Branch", value: studentData.branch, icon: Briefcase, color: "text-purple-500", bg: "bg-purple-50" },
            { label: "Academic Year", value: `${studentData.year}${studentData.year === 1 ? 'st' : studentData.year === 2 ? 'nd' : studentData.year === 3 ? 'rd' : 'th'} Year`, icon: GraduationCap, color: "text-emerald-500", bg: "bg-emerald-50" },
            { label: "Semester", value: studentData.semester, icon: BookOpen, color: "text-amber-500", bg: "bg-amber-50" },
            { label: "Section", value: `Section ${studentData.section}`, icon: Users, color: "text-cyan-500", bg: "bg-cyan-50" },
        ];

        const contactInfo = [
            { label: "College Email", value: studentData.email, icon: Mail },
            { label: "Phone Number", value: studentData.phone, icon: Smartphone },
            { label: "Nationality", value: "Indian", icon: Globe },
            { label: "Home Base", value: "Hyderabad, India", icon: MapPin },
        ];

        return (
            <div className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
                {/* Header / Banner Profile */}
                <div className="relative">
                    <div className="h-48 w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-primary rounded-3xl shadow-lg relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <defs>
                                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                                    </pattern>
                                </defs>
                                <rect width="100" height="100" fill="url(#grid)" />
                            </svg>
                        </div>
                    </div>
                    
                    <div className="px-8 -mt-16 flex flex-col md:flex-row items-end gap-6 relative z-10">
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="p-1.5 bg-background rounded-full shadow-2xl relative"
                        >
                            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${studentData.name}`} />
                                <AvatarFallback className="text-4xl bg-muted">{studentData.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-4 right-4 bg-green-500 h-6 w-6 rounded-full border-4 border-background shadow-sm" />
                        </motion.div>
                        
                        <div className="pb-4 flex-1">
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-1">{studentData.name}</h1>
                            <div className="flex flex-wrap items-center gap-3">
                                <Badge variant="secondary" className="font-bold px-3 py-1 bg-primary/10 text-primary border-none">
                                    {studentData.rollNumber}
                                </Badge>
                                <div className="flex items-center gap-1.5 text-muted-foreground font-medium text-sm">
                                    <GraduationCap className="w-4 h-4" />
                                    {studentData.branch} Department
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="space-y-6">
                        <Card className="border-none shadow-md overflow-hidden">
                            <CardHeader className="bg-muted/30 border-b py-4">
                                <CardTitle className="text-md flex items-center gap-2">
                                    <User className="w-4 h-4 text-primary" />
                                    Student Credentials
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-5">
                                {contactInfo.map((info, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-muted text-muted-foreground"><info.icon className="w-4 h-4" /></div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest leading-none mb-1">{info.label}</span>
                                            <span className="text-sm font-semibold">{info.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-none shadow-md overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 py-4">
                                <CardTitle className="text-md flex items-center gap-2 font-bold">
                                    <BookOpen className="w-4 h-4 text-primary" />
                                    Academic Summary
                                </CardTitle>
                                <Badge variant="outline" className="font-bold">
                                    Active Enrollment
                                </Badge>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {infoCards.map((card, i) => (
                                        <div key={i} className={`p-5 rounded-2xl ${card.bg} border border-transparent`}>
                                            <div className={`p-2 rounded-lg bg-white dark:bg-black/20 ${card.color} shadow-sm w-fit mb-3`}>
                                                <card.icon className="w-4 h-4" />
                                            </div>
                                            <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest leading-none mb-1">{card.label}</div>
                                            <div className="text-lg font-black">{card.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Faculty View
    if (user.role === 'faculty' && facultyData) {
        const stats = [
            { label: "Teaching Experience", value: "12+ Years", icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Research Papers", value: "18 Published", icon: FileText, color: "text-purple-500", bg: "bg-purple-50" },
            { label: "Current Load", value: "4 Courses", icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-50" },
            { label: "Avg Feedback", value: "4.8/5.0", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
        ];

        return (
            <div className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
                {/* Faculty Header */}
                <div className="relative">
                    <div className="h-48 w-full bg-gradient-to-r from-red-600 via-rose-600 to-primary rounded-3xl shadow-lg relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                    </div>
                    
                    <div className="px-8 -mt-16 flex flex-col md:flex-row items-end gap-6 relative z-10">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                            <Avatar className="h-40 w-40 border-4 border-background shadow-2xl">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${facultyData.name}`} />
                                <AvatarFallback className="text-4xl bg-muted">{facultyData.name[0]}</AvatarFallback>
                            </Avatar>
                        </motion.div>
                        
                        <div className="pb-4 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">{facultyData.name}</h1>
                                <Badge className="bg-blue-500 text-white border-none py-0.5 px-2">Verified Expert</Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-medium">
                                <div className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {facultyData.designation}</div>
                                <div className="flex items-center gap-1.5"><School className="w-4 h-4" /> {facultyData.department} Dept.</div>
                                <div className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> ID: {facultyData.rollNumber}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="space-y-6">
                        <Card className="border-none shadow-md">
                            <CardHeader className="bg-muted/30 border-b py-4">
                                <CardTitle className="text-md font-bold text-primary">Contact Details</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4 hover:bg-muted/50 p-2 rounded-xl transition-colors">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Mail className="w-5 h-5" /></div>
                                        <div>
                                            <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest leading-none mb-1">Office Email</p>
                                            <p className="text-sm font-bold break-all">{facultyData.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 hover:bg-muted/50 p-2 rounded-xl transition-colors">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Phone className="w-5 h-5" /></div>
                                        <div>
                                            <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest leading-none mb-1">Phone</p>
                                            <p className="text-sm font-bold">{facultyData.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 hover:bg-muted/50 p-2 rounded-xl transition-colors">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><MapPin className="w-5 h-5" /></div>
                                        <div>
                                            <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest leading-none mb-1">Cabin Location</p>
                                            <p className="text-sm font-bold">{facultyData.department} Block, Room 302</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {stats.map((stat, i) => (
                                <Card key={i} className="border-none shadow-md overflow-hidden relative group">
                                    <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
                                        <stat.icon className="w-16 h-16" />
                                    </div>
                                    <CardContent className="p-6">
                                        <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} w-fit mb-3`}><stat.icon className="w-5 h-5" /></div>
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">{stat.label}</p>
                                        <p className="text-2xl font-black">{stat.value}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <Card className="border-none shadow-md overflow-hidden">
                            <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between">
                                <CardTitle className="text-md font-bold">Research & Interests</CardTitle>
                                <Users className="w-5 h-5 text-muted-foreground/30" />
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="p-4 bg-muted/20 rounded-2xl border border-dashed border-muted-foreground/20">
                                    <h4 className="font-bold text-sm mb-2 text-primary">Core Specialization</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Primary focus on {facultyData.specialization?.[0] || 'Advanced Research'} and {facultyData.specialization?.[1] || 'Academic Excellence'}.
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {(facultyData.specialization || ["Deep Learning", "Graph Theory", "Optimization", "Python"]).map((skill) => (
                                            <Badge key={skill} variant="secondary" className="bg-background border font-semibold">{skill}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    // 3. Admin View (Fallback)
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
            <UserCircle className="w-16 h-16 mb-4 opacity-20" />
            <h2 className="text-xl font-bold mb-2">System Administrator Profile</h2>
            <p className="max-w-md text-center">Admin profiles are managed via the System Control Center. High-priority security level active.</p>
            <Badge className="mt-4 bg-red-500">Root Access: {user.role.toUpperCase()}</Badge>
        </div>
    );
}
