import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend
} from 'recharts';
import { 
    Users, GraduationCap, TrendingUp, AlertTriangle, 
    Calendar, UserCheck, Activity, LayoutDashboard, Monitor,
    Filter, Download, Award, BookOpen, FileJson, FilePieChart,
    ChevronRight, CheckCircle, Search, ShieldCheck, Mail
} from "lucide-react";
import { 
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MOCK_FACULTY } from "@/data/mockFaculty";
import { MOCK_STUDENTS } from "@/data/mockStudents";
import { MOCK_COURSES } from "@/data/mockCourses";

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

const AnalyticsAccreditation = () => {
    const [branch, setBranch] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Unified Stats calculation
    const stats = useMemo(() => {
        const filteredFaculty = branch === "all" ? MOCK_FACULTY : MOCK_FACULTY.filter(f => f.department === branch);
        const filteredStudents = branch === "all" ? MOCK_STUDENTS : MOCK_STUDENTS.filter(s => s.branch === branch);
        const filteredCourses = branch === "all" ? MOCK_COURSES : MOCK_COURSES.filter(c => c.department === branch);

        const totalStudents = filteredStudents.length;
        const totalFaculty = filteredFaculty.length;
        const activeCourses = filteredCourses.length;
        
        // Completion rate simulated based on year distribution
        const completionRate = 92.5 + (filteredStudents.filter(s => s.year === 4).length / (totalStudents || 1) * 5);
        const avgAttendance = 88.4 + (Math.random() * 2 - 1); 
        const passPercentage = 85 + Math.random() * 10;

        // Faculty Workload
        const facultyWorkload = filteredFaculty.slice(0, 8).map(f => ({
            name: f.name.split(' ').slice(-1)[0],
            classes: f.specialization?.length || Math.floor(Math.random() * 5) + 2
        }));

        // Trends
        const attendanceTrends = [
            { week: 'W1', attendance: 82 },
            { week: 'W2', attendance: 85 },
            { week: 'W3', attendance: 88 },
            { week: 'W4', attendance: 84 },
            { week: 'W5', attendance: 91 },
            { week: 'W6', attendance: 89 },
        ];

        const gpaTrends = [
            { sem: 'S1', gpa: 7.2 },
            { sem: 'S2', gpa: 7.5 },
            { sem: 'S3', gpa: 7.8 },
            { sem: 'S4', gpa: 7.6 },
            { sem: 'S5', gpa: 8.1 },
            { sem: 'S6', gpa: 8.4 },
        ];

        return {
            totalStudents,
            totalFaculty,
            activeCourses,
            completionRate: completionRate.toFixed(1),
            avgAttendance: avgAttendance.toFixed(1),
            passPercentage: passPercentage.toFixed(1),
            facultyWorkload,
            attendanceTrends,
            gpaTrends,
            passFailData: [
                { name: 'Pass', value: passPercentage },
                { name: 'Fail', value: 100 - passPercentage },
            ],
            qualificationData: [
                { name: 'PhD', value: filteredFaculty.filter(f => f.name.includes("Dr.")).length },
                { name: 'Masters', value: filteredFaculty.filter(f => !f.name.includes("Dr.")).length },
            ]
        };
    }, [branch]);

    const handleDownload = (type: string, format: 'PDF' | 'CSV' | 'NAAC') => {
        toast.info(`Generating ${format} ${type} Report...`, {
            description: `Formatted according to ${format === 'NAAC' ? 'NAAC/NBA' : 'Standard'} requirements.`
        });
        
        // Simulation logic similar to ComplianceDashboard
        setTimeout(() => {
            const reportContent = `Accreditation Report - ${type}\nBranch: ${branch}\nDate: ${new Date().toLocaleDateString()}\nStatus: Verified`;
            const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `${format}_${type}_Report_${branch}.txt`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("Download complete");
        }, 1200);
    };

    return (
        <div className="space-y-8 pb-12 animate-in fade-in-50">
            {/* Header */}
            <div className="bg-card/30 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/20 shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Analytics & Accreditation
                        </h1>
                        <p className="text-muted-foreground font-medium flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" /> Unified Insight Hub for NAAC / NBA Compliance
                        </p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search audit data..." 
                                className="pl-9 bg-muted/40 border-none focus-visible:ring-primary/50"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={branch} onValueChange={setBranch}>
                            <SelectTrigger className="w-[180px] bg-primary/10 border-none text-primary font-bold">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Branch" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Departments</SelectItem>
                                <SelectItem value="CSE">CSE</SelectItem>
                                <SelectItem value="CSM">CSM</SelectItem>
                                <SelectItem value="IT">IT</SelectItem>
                                <SelectItem value="ECE">ECE</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* 1. Overview Section (Top Cards) */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Total Students", value: stats.totalStudents, icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-500/10" },
                    { title: "Faculty Members", value: stats.totalFaculty, icon: Users, color: "text-purple-600", bg: "bg-purple-500/10" },
                    { title: "Active Courses", value: stats.activeCourses, icon: BookOpen, color: "text-amber-600", bg: "bg-amber-500/10" },
                    { title: "Completion Rate", value: `${stats.completionRate}%`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-500/10" },
                ].map((kpi, i) => (
                    <motion.div
                        key={kpi.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-xl group hover:scale-[1.02] transition-all">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">{kpi.title}</CardTitle>
                                <div className={`${kpi.bg} p-2.5 rounded-xl group-hover:rotate-12 transition-transform`}>
                                    <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black">{kpi.value}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* 2. Academic Analytics Section (Left/Center) */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-2xl bg-card/40 backdrop-blur-md overflow-hidden">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Activity className="h-6 w-6 text-indigo-500" />
                                Attendance & Performance Trends
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="attendance" className="w-full">
                                <TabsList className="bg-muted/50 mb-6">
                                    <TabsTrigger value="attendance">Weekly Attendance</TabsTrigger>
                                    <TabsTrigger value="gpa">GPA Progression</TabsTrigger>
                                </TabsList>
                                <TabsContent value="attendance" className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={stats.attendanceTrends}>
                                            <defs>
                                                <linearGradient id="colorAttend" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                            <XAxis dataKey="week" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[70, 100]} />
                                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                                            <Area type="monotone" dataKey="attendance" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorAttend)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </TabsContent>
                                <TabsContent value="gpa" className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={stats.gpaTrends}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                            <XAxis dataKey="sem" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[6, 10]} />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="gpa" stroke="#a855f7" strokeWidth={4} dot={{ r: 6, fill: '#a855f7' }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    {/* 3. Accreditation Data Section (Table) */}
                    <Card className="border-none shadow-2xl bg-card/40 backdrop-blur-md overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-3">
                                    <Award className="h-6 w-6 text-amber-500" />
                                    Faculty & Qualification Records
                                </CardTitle>
                                <CardDescription>Data mapping for NAAC Criteria 2 (Teaching-Learning)</CardDescription>
                            </div>
                            <Badge variant="outline" className="border-amber-500/20 text-amber-600 bg-amber-500/5 px-4 h-8 font-black uppercase tracking-tighter">
                                Accreditation Verified
                            </Badge>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30">
                                        <TableHead className="font-black uppercase text-[10px]">Faculty Member</TableHead>
                                        <TableHead className="font-black uppercase text-[10px]">Qualification</TableHead>
                                        <TableHead className="font-black uppercase text-[10px]">Research Index</TableHead>
                                        <TableHead className="font-black uppercase text-[10px]">Exp.</TableHead>
                                        <TableHead className="font-black uppercase text-[10px]">Dept.</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(branch === "all" ? MOCK_FACULTY : MOCK_FACULTY.filter(f => f.department === branch))
                                        .slice(0, 10)
                                        .map((f) => (
                                            <TableRow key={f.id} className="hover:bg-primary/5 transition-colors">
                                                <TableCell className="font-bold underline decoration-primary/20 underline-offset-4">{f.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant={f.name.includes("Dr.") ? "default" : "outline"} className="text-[10px] font-bold">
                                                        {f.name.includes("Dr.") ? "PhD / Doctor of Phil." : "M.Tech / Post Grad"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-mono text-xs">{3 + Math.floor(Math.random()*5)} Pubs</TableCell>
                                                <TableCell className="text-xs">{8 + Math.floor(Math.random()*12)}y</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 font-bold border-none">
                                                        {f.department}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Sidebar Section */}
                <div className="space-y-8">
                    {/* Faculty Workload Chart */}
                    <Card className="border-none shadow-xl bg-card/40 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Monitor className="h-5 w-5 text-blue-500" />
                                Workload Balance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.facultyWorkload} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.1} />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" fontSize={10} width={80} axisLine={false} tickLine={false} />
                                        <Tooltip cursor={{fill: 'transparent'}} />
                                        <Bar dataKey="classes" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Faculty Distribution Pie */}
                    <Card className="border-none shadow-xl bg-card/40 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-purple-500" />
                                Qualification Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={stats.qualificationData}
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {stats.qualificationData.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 4. Reports Section (Unified Download) */}
                    <Card className="border-none shadow-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white overflow-hidden p-1">
                        <div className="bg-indigo-950/20 backdrop-blur-xl p-6 rounded-2xl h-full space-y-6">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-3">
                                    <Download className="h-6 w-6 text-indigo-300" />
                                    Accreditation Reports
                                </CardTitle>
                                <p className="text-indigo-100/60 text-xs font-medium">Export audit-ready documentation</p>
                            </div>

                            <div className="grid gap-3">
                                <Button 
                                    className="w-full h-12 bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold group" 
                                    onClick={() => handleDownload('NAAC', 'NAAC')}
                                >
                                    <FilePieChart className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
                                    Full NAAC SSR Report
                                </Button>
                                <Button 
                                    className="w-full h-12 bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold group" 
                                    onClick={() => handleDownload('FACULTY', 'CSV')}
                                >
                                    <FileJson className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
                                    Export Faculty CSV
                                </Button>
                                <Button 
                                    className="w-full h-12 bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold group" 
                                    onClick={() => handleDownload('STUDENT', 'CSV')}
                                >
                                    <FileJson className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
                                    Export Academic CSV
                                </Button>
                            </div>

                            <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100/40">Audit System Healthy</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Compliance Alert Footer */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl p-6 bg-red-500/5 border border-red-500/10 flex items-center justify-between group"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-500/10 rounded-xl group-hover:shake transition-all text-red-600">
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-red-800 dark:text-red-300">Compliance Warning</h4>
                        <p className="text-sm text-red-600/70">
                            {branch === 'all' 
                                ? "Current overall faculty-student ratio is 1:21.8 (Threshold 1:20 required for NBA Tier-1)." 
                                : `Department of ${branch} shows critical 15% missing research publication proofs for current audit cycle.`
                            }
                        </p>
                    </div>
                </div>
                <Button variant="ghost" className="text-red-700 hover:bg-red-100 font-bold">
                    View Audit Logs <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            </motion.div>
        </div>
    );
};

export default AnalyticsAccreditation;
