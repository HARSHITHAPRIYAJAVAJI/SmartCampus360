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
import { Progress } from "@/components/ui/progress";
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
    const [activeTab, setActiveTab] = useState("attendance");
    const [compareMode, setCompareMode] = useState(false);
    const [selectedDrillDown, setSelectedDrillDown] = useState<{title: string, data: any[]} | null>(null);
    const [evidenceModal, setEvidenceModal] = useState<{criterionId: string, title: string} | null>(null);

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

        // Predictive Sustainability logic
        const dropoutRisk = filteredStudents.filter(s => s.attendance < 65).length / (totalStudents || 1) * 100;
        const estimatedRevenue = totalStudents * 75000; // Mock average fee
        const revenueLeakage = filteredStudents.filter(s => s.attendance < 65).length * 75000;

        // --- REAL WORLD WORKLOAD CALCULATION ---
        const publishedStoreStr = localStorage.getItem('published_timetables');
        const allTimetables = publishedStoreStr ? JSON.parse(publishedStoreStr) : {};
        const facultyHourMap: Record<string, number> = {};

        // Aggregate hours from all published grids
        Object.values(allTimetables).forEach((entry: any) => {
            const grid = entry.grid || entry;
            if (grid && typeof grid === 'object') {
                Object.values(grid).forEach((session: any) => {
                    if (session && (session.faculty || session.facultyId)) {
                        const key = session.faculty || session.facultyId;
                        facultyHourMap[key] = (facultyHourMap[key] || 0) + 1; // Assuming 1 hour per slot
                    }
                });
            }
        });

        const facultyWorkload = filteredFaculty.slice(0, 10).map(f => {
            // Check for matches in the hour map (by full name or ID)
            const hours = facultyHourMap[f.name] || facultyHourMap[f.id] || 0;
            return {
                name: f.name.split(' ').slice(-1)[0],
                fullName: f.name,
                classes: hours,
                isCompliant: hours >= 12 && hours <= 28 
            };
        }).sort((a, b) => b.classes - a.classes);

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

        let riskStudents = filteredStudents.filter(s => s.attendance < 75).slice(0, 5).map(s => {
            const variance = 75 - s.attendance;
            const riskProbability = Math.min(99, Math.round(50 + (variance * 3)));
            return {
                name: s.name,
                rollNumber: s.rollNumber,
                attendance: s.attendance,
                gpa: s.grade || 0,
                riskScore: riskProbability,
                status: riskProbability > 80 ? 'Critical' : 'Warning'
            };
        });

        // Ensure visible data for audit demo if mock list is too 'perfect'
        if (riskStudents.length === 0) {
            riskStudents = [
                { name: 'Rahul Sharma', rollNumber: '21031A0502', attendance: 62, gpa: 6.8, riskScore: 89, status: 'Critical' },
                { name: 'Priya Singh', rollNumber: '21031A0544', attendance: 71, gpa: 7.2, riskScore: 62, status: 'Warning' },
            ];
        }

        // Real-time Ratio & Compliance Audit
        const facultyStudentRatio = (totalStudents / (totalFaculty || 1)).toFixed(1);
        const isRatioCompliant = parseFloat(facultyStudentRatio) <= 20.0;

        return {
            totalStudents,
            totalFaculty,
            activeCourses,
            facultyStudentRatio,
            isRatioCompliant,
            syllabusCoverage: 88.5 + (Math.random() * 5),
            completionRate: completionRate.toFixed(1),
            avgAttendance: avgAttendance.toFixed(1),
            passPercentage: passPercentage.toFixed(1),
            facultyWorkload,
            riskStudents,
            estimatedRevenue,
            revenueLeakage,
            dropoutRisk,
            attendanceTrends,
            gpaTrends,
            historicalTrends: [
                { year: '2022', pass: 82, intake: 480 },
                { year: '2023', pass: 85, intake: 520 },
                { year: '2024', pass: 84, intake: 560 },
                { year: '2025', pass: 89, intake: 600 },
                { year: '2026', pass: 91, intake: 640 },
            ],
            passFailData: [
                { name: 'Distinction (>80%)', value: 25 },
                { name: 'First Class (60-80%)', value: 45 },
                { name: 'Second Class (50-60%)', value: 20 },
                { name: 'Fail / Remedial', value: 10 },
            ],
            internalVsExternal: [
                { category: 'Mid-Term 1', internal: 78, external: 0 },
                { category: 'Mid-Term 2', internal: 82, external: 0 },
                { category: 'Sem Final', internal: 74, external: 71 },
                { category: 'Lab Internal', internal: 92, external: 88 },
            ],
            qualificationData: [
                { name: 'PhD', value: filteredFaculty.filter(f => f.name.includes("Dr.")).length },
                { name: 'Masters', value: filteredFaculty.filter(f => !f.name.includes("Dr.")).length },
            ],
            riskMetrics: [
                { type: 'Critical', label: 'Attendance < 75%', count: filteredStudents.filter(s => s.attendance < 75).length, color: 'text-red-600', bg: 'bg-red-50' },
                { type: 'Warning', label: 'Low Pass % Subjects', count: 3, color: 'text-amber-600', bg: 'bg-amber-50' },
                { type: 'Alert', label: 'Overloaded Faculty', count: 4, color: 'text-purple-600', bg: 'bg-purple-50' },
            ]
        };
    }, [branch]);

    const handleDownload = (type: string, format: 'PDF' | 'CSV' | 'NAAC') => {
        toast.info(`Generating ${format} ${type} Report...`, {
            description: `Compiling institutional data for ${branch === 'all' ? 'All Departments' : branch}...`
        });
        
        let content = "";
        let fileName = "";

        if (format === 'CSV') {
            if (type === 'FACULTY') {
                content = "Faculty Name,Designation,Department,Qualification,Workload (Hrs),Research Index\n";
                const list = branch === "all" ? MOCK_FACULTY : MOCK_FACULTY.filter(f => f.department === branch);
                list.forEach(f => {
                    const hours = stats.facultyWorkload.find(w => w.fullName === f.name)?.classes || 0;
                    const qual = f.name.includes("Dr.") ? "PhD" : "Masters";
                    content += `${f.name},${f.designation},${f.department},${qual},${hours},${3 + Math.floor(Math.random()*5)} Pubs\n`;
                });
                fileName = `Faculty_Audit_${branch}_${new Date().toISOString().split('T')[0]}.csv`;
            } else {
                content = "Metric,Value,Status\n";
                content += `Total Students,${stats.totalStudents},Verified\n`;
                content += `Pass Percentage,${stats.passPercentage}%,Optimal\n`;
                content += `Average Attendance,${stats.avgAttendance}%,Satisfactory\n`;
                content += `Graduation Rate,${stats.completionRate}%,Active\n`;
                fileName = `Academic_Summary_${branch}.csv`;
            }
        } else if (format === 'NAAC') {
            content = `==========================================================\n`;
            content += `      INSTITUTIONAL SELF-STUDY REPORT (SSR) - 2026\n`;
            content += `==========================================================\n\n`;
            content += `Audit Branch: ${branch.toUpperCase()}\n`;
            content += `Generated On: ${new Date().toLocaleString()}\n`;
            content += `Compliance Status: AUDIT READY\n\n`;
            
            content += `CRITERION 1: CURRICULAR ASPECTS\n`;
            content += `----------------------------------------------------------\n`;
            content += `- Active Courses: ${stats.activeCourses}\n`;
            content += `- Curriculum Coverage: 94.2% (Estimated)\n\n`;

            content += `CRITERION 2: TEACHING-LEARNING & EVALUATION\n`;
            content += `----------------------------------------------------------\n`;
            content += `- Total Faculty: ${stats.totalFaculty}\n`;
            content += `- Student-Faculty Ratio: 1:${(stats.totalStudents / stats.totalFaculty).toFixed(1)}\n`;
            content += `- Average Pass Percentage: ${stats.passPercentage}%\n\n`;

            content += `CRITERION 3: RESEARCH, INNOVATIONS & EXTENSION\n`;
            content += `----------------------------------------------------------\n`;
            content += `- PhD Holders: ${stats.qualificationData.find(q => q.name === 'PhD')?.value || 0}\n`;
            content += `- Research Output: Verified via Institutional Repository\n\n`;

            content += `OVERALL QUALITY SUMMARY\n`;
            content += `----------------------------------------------------------\n`;
            content += `Institutional performance reflects a strong alignment with NAAC Cycle 2 requirements. \n`;
            content += `Areas for improvement: Faculty-Student Ratio in ${branch === 'all' ? 'Specific Branches' : branch}.\n\n`;
            
            fileName = `NAAC_SSR_Draft_${branch}.txt`;
        }

        const blob = new Blob([content], { type: format === 'CSV' ? 'text/csv;charset=utf-8;' : 'text/plain;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Report Generated Successfully");
    };

    const handleIssueWarning = (studentName: string, rollNumber: string) => {
        toast.success(`Broadcasting Tri-Level Warning`, {
            description: `Alerts sent to ${studentName}, Class Teacher, and Year In-Charge via Communication Hub.`,
        });

        // Simulating the audit log entry for this intervention
        console.log(`[AUDIT] Intervention Initiated: Low Attendance Warning for ${studentName} (${rollNumber})`);
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
                        <Button 
                            variant="outline" 
                            className={`rounded-xl px-4 h-12 gap-2 font-bold transition-all ${compareMode ? 'bg-amber-500 text-white border-amber-500' : 'bg-background hover:bg-muted'}`}
                            onClick={() => setCompareMode(!compareMode)}
                        >
                            <TrendingUp className={`h-4 w-4 ${compareMode ? 'animate-bounce' : ''}`} />
                            {compareMode ? 'Historical Mode ON' : 'Compare vs Prev Cycle'}
                        </Button>
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
                    { title: "Total Students", value: stats.totalStudents, icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-500/10", delta: "+4.2%" },
                    { title: "Faculty Members", value: stats.totalFaculty, icon: Users, color: "text-purple-600", bg: "bg-purple-500/10", delta: "+2.1%" },
                    { title: "Syllabus Coverage", value: `${stats.syllabusCoverage.toFixed(1)}%`, icon: BookOpen, color: "text-amber-600", bg: "bg-amber-500/10", delta: "+8.5%" },
                    { title: "Completion Rate", value: `${stats.completionRate}%`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-500/10", delta: "+1.2%" },
                ].map((kpi, i) => (
                    <motion.div
                        key={kpi.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-xl group hover:scale-[1.02] transition-all overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">{kpi.title}</CardTitle>
                                <div className="flex items-center gap-2">
                                    {compareMode && (
                                        <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[8px] animate-in slide-in-from-right-2">
                                            {kpi.delta}
                                        </Badge>
                                    )}
                                    <div className={`${kpi.bg} p-2.5 rounded-xl group-hover:rotate-12 transition-transform`}>
                                        <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                                    </div>
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
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="bg-muted/50 mb-6 flex flex-wrap h-auto p-1">
                                    <TabsTrigger value="attendance" className="font-bold">Attendance Trends</TabsTrigger>
                                    <TabsTrigger value="gpa" className="font-bold">GPA Progression</TabsTrigger>
                                    <TabsTrigger value="performance" className="font-bold">Grade Distribution</TabsTrigger>
                                    <TabsTrigger value="internal" className="font-bold">Internal vs External</TabsTrigger>
                                    <TabsTrigger value="accreditation" className="font-bold bg-indigo-500/10 text-indigo-600">Accreditation Mapping</TabsTrigger>
                                    <TabsTrigger value="career" className="font-bold">Career Outcomes</TabsTrigger>
                                    <TabsTrigger value="audit" className="font-bold text-amber-600"><ShieldCheck className="h-3 w-3 mr-1" /> Audit Logs</TabsTrigger>
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
                                <TabsContent value="performance" className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={stats.passFailData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={80}
                                                outerRadius={120}
                                                paddingAngle={5}
                                                dataKey="value"
                                                onClick={(datum) => {
                                                    const rawList = datum.name === 'Fail / Remedial' 
                                                        ? stats.riskStudents 
                                                        : MOCK_STUDENTS.slice(0, 10);
                                                    setSelectedDrillDown({ title: `Student List: ${datum.name}`, data: rawList });
                                                }}
                                                className="cursor-pointer"
                                            >
                                                {stats.passFailData.map((_, i) => (
                                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend verticalAlign="bottom" height={36}/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </TabsContent>
                                <TabsContent value="internal" className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats.internalVsExternal}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                            <XAxis dataKey="category" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis domain={[0, 100]} fontSize={12} tickLine={false} axisLine={false} />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="internal" name="Internal Assessment" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="external" name="External University" fill="#ec4899" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </TabsContent>

                                <TabsContent value="accreditation" className="min-h-[400px]">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { id: 'C1', title: 'Curricular Aspects', progress: 85, evidence: [
                                                { name: 'Syllabus_2026.pdf', v: 'v2', status: 'Verified' },
                                                { name: 'Academic_Calendar.pdf', v: 'v1', status: 'Pending' }
                                            ] },
                                            { id: 'C2', title: 'Teaching-Learning & Evaluation', progress: 92, evidence: [
                                                { name: 'Faculty_Matrix.xlsx', v: 'v4', status: 'Verified' }
                                            ] },
                                            { id: 'C3', title: 'Research, Innovations & Extension', progress: 65, evidence: [] },
                                            { id: 'C4', title: 'Infrastructure & Learning Resources', progress: 88, evidence: [] },
                                            { id: 'C5', title: 'Student Support & Progression', progress: 78, evidence: [] },
                                            { id: 'C6', title: 'Governance, Leadership & Management', progress: 82, evidence: [] },
                                            { id: 'C7', title: 'Institutional Values & Best Practices', progress: 70, evidence: [] },
                                        ].map((criteria) => (
                                            <div key={criteria.id} className="p-4 rounded-2xl bg-muted/20 border border-border/50 hover:border-primary/30 transition-all group relative overflow-hidden">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">{criteria.id}</span>
                                                        <h4 className="font-bold text-sm mt-1">{criteria.title}</h4>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <Button variant="ghost" size="sm" className="h-7 text-[10px] font-black px-2 hover:bg-primary hover:text-white transition-all underline" onClick={() => setEvidenceModal({criterionId: criteria.id, title: criteria.title})}>
                                                            {criteria.evidence.length} EVIDENCE <ChevronRight className="ml-1 h-3 w-3" />
                                                        </Button>
                                                        <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter">Syllabus: 92%</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground tracking-tighter">
                                                        <span>Ready for Audit</span>
                                                        <span>{criteria.progress}%</span>
                                                    </div>
                                                    <Progress value={criteria.progress} className="h-1.5" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="career" className="h-[350px]">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                                         <div className="h-full">
                                             <p className="text-[10px] font-black uppercase text-muted-foreground mb-4">Placement vs package trend</p>
                                             <ResponsiveContainer width="100%" height="80%">
                                                 <AreaChart data={[
                                                     { year: '2021', placement: 68, high: 12 },
                                                     { year: '2022', placement: 75, high: 18 },
                                                     { year: '2023', placement: 82, high: 24 },
                                                     { year: '2024', placement: 91, high: 42 },
                                                     { year: '2025', placement: 94, high: 48 },
                                                 ]}>
                                                     <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                                     <XAxis dataKey="year" fontSize={10} />
                                                     <YAxis fontSize={10} />
                                                     <Tooltip />
                                                     <Area type="monotone" dataKey="placement" name="Placement %" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                                                     <Area type="monotone" dataKey="high" name="Highest Package (LPA)" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
                                                 </AreaChart>
                                             </ResponsiveContainer>
                                         </div>
                                         <div className="h-full bg-indigo-50/50 dark:bg-indigo-500/5 p-4 rounded-[2rem] border border-indigo-100 dark:border-indigo-500/20 flex flex-col justify-center text-center">
                                             <Activity className="h-10 w-10 text-indigo-500 mx-auto mb-4" />
                                             <h4 className="text-2xl font-black text-indigo-900 dark:text-indigo-100">₹{(stats.estimatedRevenue / 10000000).toFixed(2)} Cr</h4>
                                             <p className="text-[10px] font-black text-indigo-600 tracking-widest uppercase">Estimated Annual Revenue</p>
                                             <div className="mt-6 flex justify-between px-8">
                                                <div className="text-center border-r pr-8 border-indigo-100/50">
                                                    <p className="text-xl font-black text-red-600">₹{(stats.revenueLeakage / 100000).toFixed(1)}L</p>
                                                    <p className="text-[8px] font-black text-muted-foreground uppercase">Leakage Risk</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xl font-black text-emerald-600">{stats.dropoutRisk.toFixed(1)}%</p>
                                                    <p className="text-[8px] font-black text-muted-foreground uppercase">Retention Stability</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="audit" className="min-h-[400px]">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-black uppercase text-xs tracking-widest text-muted-foreground">Recent Audit Activity</h3>
                                            <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50">TAMPER-PROOF LOGS</Badge>
                                        </div>
                                        {[
                                            { action: 'Evidence Uploaded', meta: 'Criterion 2.1 - Faculty Matrix v4', user: 'HOD_CSE', time: '12 mins ago', type: 'system' },
                                            { action: 'Threshold Modification', meta: 'Attendance Alert set to 75%', user: 'ADMIN_SUPER', time: '2 hours ago', type: 'security' },
                                            { action: 'Bulk Result Export', meta: 'Semester 6 Final Results', user: 'EXAM_CELL', time: '5 hours ago', type: 'data' },
                                            { action: 'Faculty Workload Adjusted', meta: 'Dr. Srinivas (CSE) -> 22h', user: 'DEAN_ACADEMICS', time: '1 day ago', type: 'system' },
                                        ].map((log, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/50 hover:bg-white/40 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${log.type === 'security' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                                        <Activity className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm">{log.action}</p>
                                                        <p className="text-[10px] text-muted-foreground uppercase font-black">{log.meta}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-slate-700">{log.user}</p>
                                                    <p className="text-[10px] text-muted-foreground font-black">{log.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                        <Button variant="ghost" className="w-full text-[10px] font-black uppercase text-muted-foreground mt-4 hover:text-primary">
                                            View Full Data Lineage Trail <ChevronRight className="h-3 w-3 ml-2" />
                                        </Button>
                                    </div>
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
                                                <TableCell className="font-bold underline decoration-primary/20 underline-offset-4 flex items-center gap-2">
                                                    {f.name}
                                                    {f.designation.includes('HOD') && (
                                                        <Badge className="text-[8px] h-4 bg-indigo-600 border-none px-1.5 font-black uppercase">HOD</Badge>
                                                    )}
                                                </TableCell>
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
                                        <Tooltip 
                                            cursor={{fill: 'transparent'}} 
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    return (
                                                        <div className="bg-white p-3 rounded-lg shadow-xl border border-muted text-xs">
                                                            <p className="font-bold">{data.name}</p>
                                                            <p>Workload: {data.classes}h / Week</p>
                                                            <p className={data.isCompliant ? "text-emerald-600 font-bold" : "text-red-600 font-bold"}>
                                                                {data.isCompliant ? "✓ Compliant" : "⚠ Overloaded"}
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Bar 
                                            dataKey="classes" 
                                            radius={[0, 4, 4, 0]}
                                        >
                                            {stats.facultyWorkload.map((entry, index) => (
                                                <Cell key={index} fill={entry.isCompliant ? '#10b981' : '#f43f5e'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 5. Smart Risk Engine Panel (NEW) */}
                    <Card className="border-none shadow-xl bg-card/40 backdrop-blur-md overflow-hidden">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-red-500" />
                                    Smart Risk Engine
                                </div>
                                <Badge className="bg-red-500/10 text-red-600 border-none font-bold text-[10px]">REAL-TIME</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {stats.riskMetrics.map((risk, i) => (
                                <div 
                                    key={i} 
                                    className={`p-4 rounded-2xl ${risk.bg} border border-black/5 flex items-center justify-between group cursor-pointer hover:scale-[1.02] transition-all`}
                                    onClick={() => {
                                        if (risk.type === 'Alert') setActiveTab('audit');
                                        else if (risk.type === 'Critical') {
                                            const element = document.getElementById('risk-table');
                                            element?.scrollIntoView({ behavior: 'smooth' });
                                        }
                                        else setSelectedDrillDown({ title: risk.label, data: stats.riskStudents });
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`h-1.5 w-1.5 rounded-full ${risk.color.replace('text', 'bg')} animate-pulse`} />
                                        <div>
                                            <p className={`text-[10px] font-black uppercase tracking-[0.1em] ${risk.color}`}>{risk.type}</p>
                                            <p className="text-sm font-bold text-slate-800">{risk.label}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className={`text-xl font-black ${risk.color}`}>{risk.count}</div>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-6 text-[8px] font-black bg-white/50 hover:bg-white group-hover:opacity-100 opacity-0 transition-opacity"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toast.success(`Escalation Workflow Triggered`, {
                                                    description: `Dean notified via Communication Hub regarding ${risk.label}.`,
                                                });
                                            }}
                                        >
                                            ESCALATE
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary">
                                Launch Full Risk Audit <ChevronRight className="h-3 w-3 ml-2" />
                            </Button>
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

            {/* At-Risk Student Monitoring Table */}
            <Card id="risk-table" className="border-none shadow-2xl bg-card/40 backdrop-blur-md overflow-hidden scroll-mt-8">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-xl flex items-center gap-3">
                            <AlertTriangle className="h-6 w-6 text-red-500" />
                            At-Risk Student Monitoring (Critically Low Attendance)
                        </CardTitle>
                        <CardDescription>Automated detection of students requiring immediate counseling/intervention</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-red-500/5 hover:bg-red-500/5">
                                <TableHead className="font-black uppercase text-[10px] text-red-600">Student Profile</TableHead>
                                <TableHead className="font-black uppercase text-[10px] text-red-600 text-center">Current Attendance</TableHead>
                                <TableHead className="font-black uppercase text-[10px] text-red-600 text-center">Academic GPA</TableHead>
                                <TableHead className="font-black uppercase text-[10px] text-red-600 text-center">Bunker Probability</TableHead>
                                <TableHead className="right font-black uppercase text-[10px] text-red-600 text-right pr-8">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stats.riskStudents.map((s, i) => (
                                <TableRow key={i} className="hover:bg-red-500/5 transition-colors group">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center font-bold text-red-600">
                                                {s.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm leading-none">{s.name}</p>
                                                <p className="text-[10px] text-muted-foreground mt-1 uppercase font-black">{s.rollNumber}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center font-black text-red-600">
                                        <div className="flex flex-col items-center gap-1">
                                            {s.attendance}%
                                            <Progress value={s.attendance} className="h-1 w-16" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center font-bold font-mono text-sm">{s.gpa.toFixed(2)}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className={`font-black text-[9px] ${s.status === 'Critical' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                                            {s.status === 'Critical' ? `CRITICAL (${s.riskScore}%)` : `HIGH (${s.riskScore}%)`}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-red-100 hover:text-red-600">
                                                <Mail className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                className="h-8 text-[10px] font-black uppercase tracking-tighter text-red-600 hover:bg-red-50"
                                                onClick={() => handleIssueWarning(s.name, s.rollNumber)}
                                            >
                                                Issue Warning
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* 14. Evidence Management Modal */}
            <AnimatePresence>
                {evidenceModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-card border shadow-2xl rounded-[2.5rem] w-full max-w-2xl overflow-hidden"
                        >
                            <div className="p-8 space-y-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge className="bg-primary/10 text-primary border-none">{evidenceModal.criterionId}</Badge>
                                            <h2 className="text-2xl font-black">{evidenceModal.title}</h2>
                                        </div>
                                        <p className="text-muted-foreground text-sm font-medium">Verify and Manage Accreditation Evidence Tools</p>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => setEvidenceModal(null)} className="rounded-full">✕</Button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <Button className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest gap-2">
                                            <Download className="h-5 w-5" /> Upload New Proof
                                        </Button>
                                        <Button variant="outline" className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest gap-2">
                                            <Search className="h-5 w-5" /> Link Existing doc
                                        </Button>
                                    </div>

                                    <div className="rounded-[2rem] border border-border/50 bg-muted/5 p-2">
                                        {[
                                            { name: 'SSR_Draft_V2.pdf', date: '2026-04-10', user: 'Admin', status: 'Verified' },
                                            { name: 'Dept_Committee_MOM.docx', date: '2026-04-12', user: 'HOD', status: 'Pending' },
                                        ].map((doc, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/10 transition-colors group">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                        <FileJson className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm tracking-tight">{doc.name}</p>
                                                        <p className="text-[10px] text-muted-foreground uppercase font-black">{doc.date} • {doc.user}</p>
                                                    </div>
                                                </div>
                                                <Badge className={doc.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-600 border-none' : 'bg-amber-500/10 text-amber-600 border-none'}>
                                                    {doc.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 15. Drill-Down Detail Modal */}
            <AnimatePresence>
                {selectedDrillDown && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
                        <motion.div 
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="bg-card border shadow-2xl rounded-[3rem] w-full max-w-4xl max-h-[85vh] overflow-hidden"
                        >
                            <div className="p-8 space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-3xl font-black tracking-tight underline decoration-primary/30 underline-offset-8">
                                        {selectedDrillDown.title}
                                    </h2>
                                    <Button variant="ghost" onClick={() => setSelectedDrillDown(null)} className="rounded-full h-12 w-12 hover:bg-muted">✕</Button>
                                </div>
                                
                                <div className="rounded-[2.5rem] border border-border/50 bg-muted/10 overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-muted/30">
                                            <TableRow>
                                                <TableHead className="font-black text-[10px] uppercase">Identity</TableHead>
                                                <TableHead className="font-black text-[10px] uppercase text-center">Score / Metric</TableHead>
                                                <TableHead className="font-black text-[10px] uppercase text-right pr-8">Audit Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="max-h-[50vh] overflow-y-auto">
                                            {selectedDrillDown.data.map((item: any, i: number) => (
                                                <TableRow key={i} className="hover:bg-primary/5 transition-all group">
                                                    <TableCell className="py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                                {item.name?.charAt(0) || 'U'}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-sm leading-tight text-slate-800">{item.name}</p>
                                                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter">{item.rollNumber || item.department || 'INTERNAL'}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <span className="font-black text-sm text-primary">
                                                            {item.attendance ? `${item.attendance}% Attendance` : item.designation || 'ACTIVE'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-8">
                                                        <Badge variant="outline" className="font-black text-[9px] border-emerald-200 text-emerald-700 bg-emerald-50">VERIFIED</Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Compliance Alert Footer */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl p-6 bg-red-500/5 border border-red-500/10 flex items-center justify-between group"
            >
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl group-hover:shake transition-all ${stats.isRatioCompliant ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                        {stats.isRatioCompliant ? <CheckCircle className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
                    </div>
                    <div>
                        <h4 className={`font-bold ${stats.isRatioCompliant ? 'text-emerald-800 dark:text-emerald-300' : 'text-red-800 dark:text-red-300'}`}>
                            {stats.isRatioCompliant ? 'NBA/NAAC Compliance Healthy' : 'Compliance Warning'}
                        </h4>
                        <p className={`text-sm ${stats.isRatioCompliant ? 'text-emerald-600/70' : 'text-red-600/70'}`}>
                            {branch === 'all' 
                                ? `Current overall faculty-student ratio is 1:${stats.facultyStudentRatio}. (Required Threshold 1:20 for Tier-1).` 
                                : `Department of ${branch} shows 1:${stats.facultyStudentRatio} ratio. ${stats.isRatioCompliant ? 'Target met for current audit cycle.' : 'Critical resource gap detected.'}`
                            }
                        </p>
                    </div>
                </div>
                <Button 
                    variant="ghost" 
                    className="text-red-700 hover:bg-red-100 font-bold"
                    onClick={() => {
                        setActiveTab('audit');
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                >
                    View Audit Logs <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            </motion.div>
        </div>
    );
};

export default AnalyticsAccreditation;
