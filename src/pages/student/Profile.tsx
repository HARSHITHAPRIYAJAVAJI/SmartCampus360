import { useOutletContext } from "react-router-dom";
import { MOCK_STUDENTS } from "@/data/mockStudents";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
    User, Mail, Phone, MapPin, GraduationCap, 
    Calendar, BookOpen, Award, CheckCircle2, 
    Clock, Smartphone, Globe, Briefcase, Star,
    FileText, UserCircle, Users, TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";

export default function StudentProfile() {
    const { user } = useOutletContext<{ user: { name: string, id: string, role: string } }>();
    const studentData = MOCK_STUDENTS.find(s => s.rollNumber.toUpperCase() === user.id.toUpperCase());

    if (!studentData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
                <UserCircle className="w-16 h-16 mb-4 opacity-20" />
                <p>Student record not found. Please contact administration.</p>
            </div>
        );
    }

    const infoCards = [
        { label: "Roll Number", value: studentData.rollNumber, icon: UserCircle, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "Branch", value: studentData.branch, icon: Briefcase, color: "text-purple-500", bg: "bg-purple-50" },
        { label: "Academic Year", value: `${studentData.year}${studentData.year === 1 ? 'st' : studentData.year === 2 ? 'nd' : studentData.year === 3 ? 'rd' : 'th'} Year`, icon: GraduationCap, color: "text-emerald-500", bg: "bg-emerald-50" },
        { label: "Semester", value: studentData.semester, icon: BookOpen, color: "text-amber-500", bg: "bg-amber-50" },
        { label: "Section", value: `Section ${studentData.section}`, icon: Users, color: "text-cyan-500", bg: "bg-cyan-50" },
    ];

    const contactInfo = [
        { label: "Personal Email", value: studentData.email, icon: Mail },
        { label: "Phone Number", value: studentData.phone, icon: Smartphone },
        { label: "Nationality", value: "Indian", icon: Globe },
        { label: "Current City", value: "Hyderabad, India", icon: MapPin },
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
                        transition={{ type: "spring", stiffness: 100 }}
                        className="p-1.5 bg-background rounded-full shadow-2xl relative"
                    >
                        <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${studentData.name}`} />
                            <AvatarFallback className="text-4xl bg-muted">{studentData.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-4 right-4 bg-green-500 h-6 w-6 rounded-full border-4 border-background shadow-sm" title="Active Student" />
                    </motion.div>
                    
                    <div className="pb-4 flex-1">
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-1">{studentData.name}</h1>
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge variant="secondary" className="font-bold px-3 py-1 bg-primary/10 text-primary border-none">
                                {studentData.rollNumber}
                            </Badge>
                            <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                                <GraduationCap className="w-4 h-4" />
                                {studentData.branch} Department
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Personal Info & Contact */}
                <div className="space-y-6">
                    <Card className="border-none shadow-md overflow-hidden group">
                        <CardHeader className="bg-muted/30 border-b">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                Personal Records
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {contactInfo.map((info, i) => (
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

                    <Card className="border-none shadow-md bg-gradient-to-br from-primary/5 to-transparent">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Star className="w-5 h-5 text-amber-500" />
                                Key Highlights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center bg-background/50 p-4 rounded-2xl border border-primary/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-500/10 text-green-600 rounded-lg">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-sm">Attendance</span>
                                </div>
                                <span className="font-black text-green-600">{studentData.attendance}%</span>
                            </div>
                            <div className="flex justify-between items-center bg-background/50 p-4 rounded-2xl border border-primary/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg">
                                        <Award className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-sm">Overall Rank</span>
                                </div>
                                <span className="font-black text-blue-600">Top 5%</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Academic Details & Stats */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-md overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-primary" />
                                Academic Information
                            </CardTitle>
                            <Badge variant="outline" className="border-primary/20 text-primary font-bold">
                                {studentData.year}th Year - Sem {studentData.semester}
                            </Badge>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-none shadow-md overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <TrendingUp className="w-32 h-32" />
                            </div>
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">CGPA History</CardTitle>
                                <CardDescription>Consolidated GPA over terms</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center justify-center py-6">
                                <div className="text-center relative">
                                    <svg className="w-32 h-32">
                                        <circle
                                            className="text-muted/20"
                                            strokeWidth="8"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r="58"
                                            cx="64"
                                            cy="64"
                                        />
                                        <circle
                                            className="text-primary"
                                            strokeWidth="8"
                                            strokeDasharray={364}
                                            strokeDashoffset={364 - (364 * studentData.grade) / 10}
                                            strokeLinecap="round"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r="58"
                                            cx="64"
                                            cy="64"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl font-black text-primary">{studentData.grade.toFixed(2)}</span>
                                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Current</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md overflow-hidden">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-success flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5" />
                                    Active Status
                                </CardTitle>
                                <CardDescription>Current enrollment state</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground font-medium">Identity Verification</span>
                                    <Badge className="bg-green-500 text-white hover:bg-green-600">Verified</Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground font-medium">Library Access</span>
                                    <Badge className="bg-green-500 text-white hover:bg-green-600">Active</Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground font-medium">Hostel Boarder</span>
                                    <Badge variant="outline">No</Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground font-medium">Fee Standing</span>
                                    <Badge className="bg-green-500 text-white hover:bg-green-600">No Dues</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
