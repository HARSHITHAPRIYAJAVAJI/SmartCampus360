import { useState, useMemo } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { MOCK_STUDENTS } from "@/data/mockStudents";
import { 
    Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { 
    Calendar, BookOpen, TrendingUp, Clock, Bell, Award, 
    ChevronRight, CheckCircle2, CalendarDays, UploadCloud, 
    MonitorPlay, LineChart, Star, Github, Linkedin, 
    Zap, Calculator, UserPlus, AlertCircle, Download, CreditCard, ShieldCheck,
    MessageSquare, X, Send, Bot, User, Minimize2, Maximize2, Sparkles, BrainCircuit
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { getTimetable } from "@/data/aimlTimetable";
import { AttendanceHistory } from "@/components/dashboard/AttendanceHistory";
import { toast } from "sonner";
import notificationService from "@/services/notificationService";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";

export default function StudentDashboard() {
    const { user } = useOutletContext<{ user: { name: string, id: string, role: string } }>();
    const navigate = useNavigate();
    
    const [gpaWhatIf, setGpaWhatIf] = useState<number | string>("");

    const studentData = useMemo(() => {
        const saved = localStorage.getItem('smartcampus_student_directory');
        const students = saved ? JSON.parse(saved) : MOCK_STUDENTS;
        return students.find((s: any) => s.rollNumber.toUpperCase() === user.id.toUpperCase());
    }, [user.id]);

    // Advanced Stats: Attendance Buffer & Predictive GPA
    const academicMetrics = useMemo(() => {
        if (!studentData) return { buffer: 0, predictedGpa: 0, skillData: [] };
        
        // Attendance Buffer (Minimum 75% rule)
        const totalClasses = 100; // Simulated
        const currentAttended = (studentData.attendance / 100) * totalClasses;
        const requiredFor75 = 0.75 * totalClasses;
        const buffer = Math.floor(currentAttended - requiredFor75);

        // Skill Radar Data
        const skillData = [
            { subject: 'Python', A: 85, B: 110, fullMark: 150 },
            { subject: 'DSA', A: 70, B: 130, fullMark: 150 },
            { subject: 'Cloud', A: 90, B: 130, fullMark: 150 },
            { subject: 'AI/ML', A: 75, B: 100, fullMark: 150 },
            { subject: 'Database', A: 80, B: 90, fullMark: 150 },
        ];

        return { buffer, skillData };
    }, [studentData]);

    const stats = [
        { title: "Attendance", value: `${studentData?.attendance || 0}%`, icon: CheckCircle2, color: "text-emerald-500", detail: "Safe to bunk: " + academicMetrics.buffer + " slots" },
        { title: "Current GPA", value: studentData?.grade?.toFixed(2) || "0.0", icon: TrendingUp, color: "text-violet-500", detail: "Top 5% in Branch" },
        { title: "Credits Earned", value: "112/160", icon: Award, color: "text-blue-500", detail: "32 more for Graduation" },
        { title: "Assignments", value: "4 Due", icon: Clock, color: "text-amber-500", detail: "Next: OS Lab - 2 days" },
    ];

    const handleAction = async (title: string) => {
        toast.info(`Launching ${title}...`, {
            description: "Redirecting to requested operational module."
        });
        
        // Example: Log analytics event or check for new alerts on action
        if (title === 'Notifications') {
            await notificationService.getNotifications();
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in-50 duration-700 pb-20">
            {/* 1. Welcome & Profile Summary Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-700 rounded-[2rem] p-8 text-white shadow-2xl flex flex-col justify-between min-h-[280px]"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 pointer-events-none">
                        <Star className="w-64 h-64" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-14 w-14 rounded-full border-2 border-white/30 p-1 backdrop-blur-md">
                                <div className="h-full w-full rounded-full bg-white/20 flex items-center justify-center font-bold text-xl">
                                    {user.name.charAt(0)}
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-black tracking-tight leading-tight">Welcome back, {user.name.split(' ')[0]}!</h1>
                                <p className="text-indigo-100/80 font-medium">Roll No: <span className="text-white">{studentData?.rollNumber}</span></p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {['B.Tech IV Year', 'Semester 7', studentData?.branch || 'CSE', 'Section A'].map((tag) => (
                                <Badge key={tag} className="bg-white/10 hover:bg-white/20 text-white border-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[10px]">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <div className="mt-8 flex gap-4">
                        <Button className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold rounded-xl px-6" onClick={() => navigate('/dashboard/profile')}>
                            Detailed Profile
                        </Button>
                        <Button variant="ghost" className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-xl px-6 font-bold transition-all hover:scale-105 active:scale-95 shadow-none">
                            <Linkedin className="w-4 h-4 mr-2" /> Share Success
                        </Button>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-[2rem] p-8 shadow-xl flex flex-col justify-between"
                >
                    <div className="flex justify-between items-start">
                        <div className="bg-amber-500/10 p-3 rounded-2xl">
                            <Zap className="w-6 h-6 text-amber-600" />
                        </div>
                        <Badge variant="outline" className="bg-emerald-500/5 text-emerald-600 border-emerald-500/20">Active Session</Badge>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-black text-foreground/90 leading-tight">AI Study Planner</h3>
                        <p className="text-sm text-muted-foreground">Next 48h: Focus on <strong>Network Security</strong>. You have a mid-term in 6 days.</p>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                <span>Prep Progress</span>
                                <span>65%</span>
                            </div>
                            <Progress value={65} className="h-1.5" />
                        </div>
                    </div>
                    <Button variant="ghost" className="w-full mt-6 justify-between group hover:bg-primary/5">
                        Start Focus Session <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </motion.div>
            </div>

            {/* 2. Professional Stats Feed */}
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.1, delayChildren: 0.3 }
                    }
                }}
            >
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.title}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                    >
                        <Card className="border-none shadow-premium hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden group relative">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="space-y-1">
                                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{stat.title}</p>
                                        <h4 className="text-3xl font-black tracking-tighter">{stat.value}</h4>
                                    </div>
                                    <div className={`p-3 rounded-2xl ${stat.color} bg-current opacity-10 group-hover:opacity-20 transition-opacity`} />
                                    <stat.icon className={`w-6 h-6 ${stat.color} absolute top-6 right-6`} />
                                </div>
                                <p className="text-xs font-medium text-muted-foreground/80 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {stat.detail}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* 3. Main Dashboard Layout - Two Column */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Side: Academic Monitoring */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Grade Matrix Card */}
                    <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden">
                        <CardHeader className="bg-muted/30 pb-4">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-xl font-black flex items-center gap-2">
                                    <Award className="w-6 h-6 text-primary" /> Grade Matrix (Sem 7)
                                </CardTitle>
                                <Button variant="outline" size="sm" className="rounded-full font-bold" onClick={() => handleAction('Grades')}>View All</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <table className="w-full">
                                <thead className="bg-muted/10 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Subject</th>
                                        <th className="px-6 py-4 text-center">Internal</th>
                                        <th className="px-6 py-4 text-center">External</th>
                                        <th className="px-6 py-4 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {[
                                        { name: 'Machine Learning', int: '28/30', ext: '-', status: 'Ongoing', color: 'bg-emerald-500' },
                                        { name: 'Cloud Computing', int: '25/30', ext: '62/70', status: 'Cleared', color: 'bg-blue-500' },
                                        { name: 'Cyber Security', int: '29/30', ext: '-', status: 'Ongoing', color: 'bg-purple-500' },
                                        { name: 'Professional Ethics', int: '30/30', ext: '68/70', status: 'Gold Medal', color: 'bg-amber-500' },
                                    ].map((sub) => (
                                        <tr key={sub.name} className="hover:bg-muted/5 transition-colors">
                                            <td className="px-6 py-4 text-sm font-bold text-foreground/90">{sub.name}</td>
                                            <td className="px-6 py-4 text-center text-sm font-medium">{sub.int}</td>
                                            <td className="px-6 py-4 text-center text-sm font-medium">{sub.ext}</td>
                                            <td className="px-6 py-4 text-right">
                                                <Badge className={`${sub.color} text-white border-none text-[10px] font-black px-3`}>{sub.status}</Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>

                    {/* Operational Tasks Hub */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-none shadow-xl rounded-[2rem] bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden relative group">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <CreditCard className="w-6 h-6" /> Online Fee Payment
                                </CardTitle>
                                <CardDescription className="text-blue-100">Semester 8 Fee: <span className="font-bold text-white">₹42,500</span></CardDescription>
                            </CardHeader>
                            <CardContent className="relative z-10 flex justify-between items-center">
                                <Button className="bg-white text-blue-700 font-bold hover:bg-blue-50 rounded-xl" onClick={() => navigate('/dashboard/student/fees/regular')}>
                                    Pay Now
                                </Button>
                                <div className="text-[10px] text-blue-200 uppercase tracking-widest font-black text-right">
                                    Due in 14 Days<br/>Penalty: 0
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-xl rounded-[2rem] bg-card overflow-hidden">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Download className="w-6 h-6 text-primary" /> Downloads Hub
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {[
                                    { name: 'Semester 7 Hall Ticket', icon: Award },
                                    { name: 'Course Materials - ML', icon: BookOpen },
                                ].map((item) => (
                                    <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-all cursor-pointer group" onClick={() => handleAction('Download')}>
                                        <div className="flex items-center gap-3">
                                            <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                            <span className="text-sm font-bold">{item.name}</span>
                                        </div>
                                        <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Attendance Buffer & Academic Monitoring */}
                    <AttendanceHistory 
                        studentId={user.id} 
                        rollNumber={studentData?.rollNumber || ''} 
                    />
                </div>

                {/* Right Side: Advanced Professional Suite */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Predictive Tools */}
                    <Card className="border-none shadow-xl rounded-[2rem]">
                        <CardHeader>
                            <CardTitle className="text-lg font-black flex items-center gap-2">
                                <Calculator className="w-5 h-5 text-indigo-500" /> GPA What-If Analysis
                            </CardTitle>
                            <CardDescription>Predict your new CGPA by targeting specific grades.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50">
                                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-2 uppercase tracking-tighter">Enter Target Grades</p>
                                <div className="flex gap-2">
                                    <input 
                                        type="number" 
                                        placeholder="Target Sem GPA" 
                                        className="bg-transparent border-b border-indigo-300 w-full text-lg font-black focus:outline-none placeholder:text-indigo-300"
                                        value={gpaWhatIf}
                                        onChange={(e) => setGpaWhatIf(e.target.value)}
                                    />
                                    <Button size="sm" className="bg-indigo-600 rounded-lg h-10 px-4">Recalculate</Button>
                                </div>
                                <div className="mt-4 pt-4 border-t border-indigo-100 dark:border-indigo-900/50 flex justify-between items-end">
                                    <div className="text-xs font-bold text-muted-foreground">Predicted CGPA</div>
                                    <div className="text-2xl font-black text-indigo-600">{gpaWhatIf ? (parseFloat(gpaWhatIf as string) * 0.2 + (studentData?.grade || 0) * 0.8).toFixed(2) : '--'}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Skill Progress Radar Graph */}
                    <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-lg font-black flex items-center gap-2">
                                <LineChart className="w-5 h-5 text-emerald-500" /> Real-World Skills
                            </CardTitle>
                            <CardDescription>Curriculum alignment to job-market skills.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={academicMetrics.skillData}>
                                        <PolarGrid stroke="#e2e8f0" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 700 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                        <Radar name="Skills" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Personal Portfolio Card */}
                    <Card className="border-none shadow-xl rounded-[2rem] bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden group">
                        <CardHeader>
                            <CardTitle className="text-lg font-black text-white flex items-center gap-2">
                                <UserPlus className="w-5 h-5 text-emerald-400" /> Professional Portfolio
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex gap-3">
                                <div className="p-3 bg-white/10 rounded-2xl flex-1 flex items-center justify-center group-hover:bg-white/20 cursor-pointer transition-all border border-white/5" onClick={() => handleAction('GitHub')}>
                                    <Github className="w-5 h-5" />
                                </div>
                                <div className="p-3 bg-[#0a66c2]/10 rounded-2xl flex-1 flex items-center justify-center group-hover:bg-[#0a66c2]/20 cursor-pointer transition-all border border-[#0a66c2]/20" onClick={() => handleAction('LinkedIn')}>
                                    <Linkedin className="w-5 h-5 text-[#0a66c2]" />
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl flex justify-between items-center group/btn cursor-pointer" onClick={() => handleAction('Portfolio')}>
                                <span className="text-black font-black uppercase text-xs tracking-tighter">View Public Profile</span>
                                <ChevronRight className="w-4 h-4 text-black group-hover/btn:translate-x-1 transition-transform" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Exam Seating Alert (Real-time integration) */}
                    {(() => {
                        const seatingStr = localStorage.getItem('EXAM_SEATING_PLAN');
                        if (seatingStr) {
                            const seating = JSON.parse(seatingStr);
                            const mySeat = seating.find((s: any) => s.rollNumber.toUpperCase() === studentData?.rollNumber.toUpperCase());
                            if (mySeat) {
                                return (
                                    <Card className="border-2 border-primary/20 shadow-xl rounded-[2rem] bg-primary/5 overflow-hidden animate-in zoom-in-95 duration-500">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg font-black flex items-center gap-2 text-primary">
                                                <ShieldCheck className="w-5 h-5" /> Active Exam Allocation
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-background/80 rounded-2xl border border-primary/10">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Hall / Block</p>
                                                    <p className="text-xl font-black">{mySeat.room}</p>
                                                    <p className="text-xs font-bold text-muted-foreground">{mySeat.block}</p>
                                                </div>
                                                <div className="bg-primary text-white h-14 w-14 rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-primary/30">
                                                    <span className="text-[10px] font-black uppercase">Seat</span>
                                                    <span className="text-xl font-bold">{mySeat.seatNumber}</span>
                                                </div>
                                            </div>
                                            
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" className="w-full font-bold border-primary/20 hover:bg-primary/5 text-primary">
                                                        View Hall Seating Chart
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-md rounded-[2rem]">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-xl font-black">Hall {mySeat.room} Seating List</DialogTitle>
                                                        <DialogDescription className="font-bold text-[10px] uppercase tracking-widest">Institutional roll numbers assigned to this hall</DialogDescription>
                                                    </DialogHeader>
                                                    <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                                        <div className="grid grid-cols-2 gap-2 mt-4">
                                                            {seating.filter((s: any) => s.room === mySeat.room).map((other: any) => (
                                                                <div key={other.rollNumber} className={`p-3 rounded-xl border ${other.rollNumber === studentData?.rollNumber ? 'bg-primary/10 border-primary text-primary' : 'bg-muted/30 border-border/50'} flex justify-between items-center`}>
                                                                    <span className="text-xs font-mono font-black">{other.rollNumber}</span>
                                                                    <span className="text-[9px] font-black uppercase opacity-60 text-right">{other.seatNumber}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </CardContent>
                                    </Card>
                                );
                            }
                        }
                        return (
                            <Card className="border-none shadow-xl rounded-[2rem]">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg font-black flex items-center gap-2">
                                        <Bell className="w-5 h-5 text-rose-500" /> Smart Alerts
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[
                                        { title: 'Exam Registration', time: '2h ago', detail: 'Regular fee portal is closing in 48h.', type: 'urgent' },
                                        { title: 'New Lab Suggestion', time: '5h ago', detail: 'Prof. Anitha uploaded ML project code.', type: 'info' },
                                    ].map((note) => (
                                        <div key={note.title} className="flex gap-4 p-4 rounded-2xl bg-muted/20 hover:bg-muted/40 transition-colors">
                                            <div className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${note.type === 'urgent' ? 'bg-rose-500 animate-pulse' : 'bg-blue-500'}`} />
                                            <div className="space-y-1">
                                                <div className="flex justify-between items-center gap-4">
                                                    <h5 className="text-sm font-black text-foreground/90">{note.title}</h5>
                                                    <span className="text-[10px] font-bold text-muted-foreground">{note.time}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground leading-relaxed">{note.detail}</p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        );
                    })()}
                </div>

            </div>

            {/* 4. Scheduling Section */}
            <Card className="border-none shadow-xl rounded-[3rem] overflow-hidden">
                <CardHeader className="bg-muted/30 p-8 border-b border-border/50">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle className="text-2xl font-black">Daily Schedule Matrix</CardTitle>
                            <CardDescription className="text-sm font-bold uppercase tracking-widest mt-1">Current Day: {format(new Date(), "EEEE, MMM do")}</CardDescription>
                        </div>
                        <div className="flex gap-2 bg-muted/50 p-1 rounded-xl border border-border/50">
                            <Button size="sm" variant="ghost" className="rounded-lg font-bold" onClick={() => handleAction('Timeline')}>Daily</Button>
                            <Button size="sm" variant="outline" className="rounded-lg font-bold bg-background shadow-sm border-border/50" onClick={() => handleAction('Weekly')}>Weekly</Button>
                            <Button size="sm" variant="ghost" className="rounded-lg font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleAction('Seating')}>Exam Seating</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {[
                            { time: '09:40', name: 'Machine Learning', room: 'R301', status: 'done', color: 'bg-emerald-500/10 text-emerald-600' },
                            { time: '10:40', name: 'Cyber Security', room: 'R301', status: 'done', color: 'bg-emerald-500/10 text-emerald-600' },
                            { time: '11:40', name: 'Professional Ethics', room: 'R211', status: 'current', color: 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' },
                            { time: '01:30', name: 'Lunch Break', room: 'Cafeteria', status: 'next', color: 'bg-muted/50 text-muted-foreground' },
                            { time: '02:30', name: 'ML Lab (A1)', room: 'L402', status: 'next', color: 'bg-amber-500/10 text-amber-600' },
                        ].map((item, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + idx * 0.1 }}
                                className={`rounded-[2rem] p-6 flex flex-col justify-between min-h-[140px] group ${item.color} border border-transparent transition-all hover:scale-105`}
                            >
                                <div className="text-lg font-black tracking-tight">{item.time}</div>
                                <div>
                                    <div className="font-black text-sm uppercase leading-tight mb-1">{item.name}</div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">{item.room}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

