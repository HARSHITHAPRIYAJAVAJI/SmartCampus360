import { useState, useMemo } from "react";
import { motion } from "framer-motion";
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
    Filter
} from "lucide-react";
import { 
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { MOCK_FACULTY } from "@/data/mockFaculty";
import { MOCK_STUDENTS } from "@/data/mockStudents";

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

const Analytics = () => {
    const [branch, setBranch] = useState("all");

    // Derived Data for Charts
    const branchStats = useMemo(() => {
        const students = branch === "all" ? MOCK_STUDENTS : MOCK_STUDENTS.filter(s => s.branch === branch);
        const faculty = branch === "all" ? MOCK_FACULTY : MOCK_FACULTY.filter(f => f.department === branch);

        // Faculty Workload (Classes per faculty - Mocked based on specialization count)
        const facultyWorkload = faculty.slice(0, 8).map(f => ({
            name: f.name.split(' ').slice(-1)[0],
            classes: f.specialization?.length || Math.floor(Math.random() * 5) + 2
        }));

        // Attendance Trends (Simulated)
        const attendanceTrends = [
            { week: 'W1', attendance: 82 },
            { week: 'W2', attendance: 85 },
            { week: 'W3', attendance: 88 },
            { week: 'W4', attendance: 84 },
            { week: 'W5', attendance: 91 },
            { week: 'W6', attendance: 89 },
        ];

        // GPA Trends (Simulated)
        const gpaTrends = [
            { sem: 'Sem 1', gpa: 7.2 },
            { sem: 'Sem 2', gpa: 7.5 },
            { sem: 'Sem 3', gpa: 7.8 },
            { sem: 'Sem 4', gpa: 7.6 },
            { sem: 'Sem 5', gpa: 8.1 },
            { sem: 'Sem 6', gpa: 8.4 },
        ];

        // Pass/Fail Ratio
        const passRate = 85 + Math.random() * 10;
        const passFailData = [
            { name: 'Pass', value: passRate },
            { name: 'Fail', value: 100 - passRate },
        ];

        // Room Utilization
        const roomUsage = [
            { name: 'Occupied', value: 72 },
            { name: 'Free', value: 28 },
        ];

        return {
            facultyWorkload,
            attendanceTrends,
            gpaTrends,
            passFailData,
            roomUsage,
            totalStudents: students.length,
            totalFaculty: faculty.length,
        };
    }, [branch]);

    return (
        <div className="space-y-8 pb-12 animate-in fade-in-50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Academic Analytics
                    </h1>
                    <p className="text-muted-foreground mt-1">Advanced insights and real-time campus performance metrics.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={branch} onValueChange={setBranch}>
                        <SelectTrigger className="w-[200px] bg-background/50 backdrop-blur-sm border-indigo-500/20 shadow-sm">
                            <Filter className="h-4 w-4 mr-2 text-indigo-500" />
                            <SelectValue placeholder="Filter Branch" />
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

            {/* Key Performance Indicators */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Total Students", value: branchStats.totalStudents, icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-500/10", trend: "+12%" },
                    { title: "Avg. Attendance", value: "88.4%", icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-500/10", trend: "+3.2%" },
                    { title: "Active Courses", value: "42", icon: Activity, color: "text-purple-600", bg: "bg-purple-500/10", trend: "Stable" },
                    { title: "System Health", value: "99.9%", icon: Monitor, color: "text-indigo-600", bg: "bg-indigo-500/10", trend: "Excellent" },
                ].map((kpi, i) => (
                    <motion.div
                        key={kpi.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-background/60 backdrop-blur-sm group">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{kpi.title}</CardTitle>
                                <div className={`${kpi.bg} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
                                    <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black tabular-nums">{kpi.value}</div>
                                <div className="text-xs font-medium text-emerald-600 mt-1 flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" /> {kpi.trend} from last month
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-muted/40 p-1 backdrop-blur-xl border border-white/5 w-fit">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="academic">Academic Trends</TabsTrigger>
                    <TabsTrigger value="faculty">Faculty & Rooms</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                        {/* Attendance Chart */}
                        <Card className="lg:col-span-4 border-none shadow-xl bg-background/40 backdrop-blur-md overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-indigo-500" /> Attendance Analytics
                                    </CardTitle>
                                    <CardDescription>Overall weekly student presence trends.</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={branchStats.attendanceTrends}>
                                            <defs>
                                                <linearGradient id="colorAttend" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                            <XAxis dataKey="week" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[70, 100]} />
                                            <Tooltip 
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Area type="monotone" dataKey="attendance" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAttend)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pass/Fail Pie */}
                        <Card className="lg:col-span-3 border-none shadow-xl bg-background/40 backdrop-blur-md overflow-hidden">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-emerald-500" /> Academic Success
                                </CardTitle>
                                <CardDescription>Pass vs Fail distribution (all sem).</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={branchStats.passFailData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={8}
                                                dataKey="value"
                                            >
                                                <Cell fill="#10b981" />
                                                <Cell fill="#f43f5e" />
                                            </Pie>
                                            <Tooltip />
                                            <Legend verticalAlign="bottom" height={36}/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4 text-center">
                                    <span className="text-2xl font-bold">{(branchStats.passFailData[0].value).toFixed(1)}%</span>
                                    <p className="text-xs text-muted-foreground">Average Pass Percentage</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="academic" className="space-y-6">
                    <Card className="border-none shadow-xl bg-background/40 backdrop-blur-md overflow-hidden">
                        <CardHeader>
                            <CardTitle>GPA Growth Trends</CardTitle>
                            <CardDescription>Average GPA progression across subsequent semesters.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={branchStats.gpaTrends}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                        <XAxis dataKey="sem" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[6, 10]} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="gpa" stroke="#a855f7" strokeWidth={4} dot={{ r: 6, fill: '#a855f7' }} activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="faculty" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Faculty Workload */}
                        <Card className="border-none shadow-xl bg-background/40 backdrop-blur-md overflow-hidden">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-blue-500" /> Faculty Workload
                                </CardTitle>
                                <CardDescription>Number of active course assignments per faculty member.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={branchStats.facultyWorkload} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.1} />
                                            <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis dataKey="name" type="category" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} width={80} />
                                            <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                                            <Bar dataKey="classes" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Room Utilization */}
                        <Card className="border-none shadow-xl bg-background/40 backdrop-blur-md overflow-hidden">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <LayoutDashboard className="h-5 w-5 text-orange-500" /> Room Utilization
                                </CardTitle>
                                <CardDescription>Daily classroom and laboratory slot occupancy.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={branchStats.roomUsage}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={110}
                                                paddingAngle={10}
                                                dataKey="value"
                                            >
                                                <Cell fill="#f97316" />
                                                <Cell fill="#e2e8f0" />
                                            </Pie>
                                            <Tooltip />
                                            <Legend verticalAlign="bottom" height={36}/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4 flex justify-around">
                                    <div className="text-center">
                                        <div className="text-xl font-bold">42/58</div>
                                        <p className="text-[10px] text-muted-foreground uppercase">Slots Occupied</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold">16</div>
                                        <p className="text-[10px] text-muted-foreground uppercase">Available Slots</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Performance Footer */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={branch}
                className="rounded-2xl p-6 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-indigo-500/10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative"
            >
                <div className="absolute top-0 right-0 p-2 opacity-5">
                    <Activity className="h-24 w-24 text-indigo-600" />
                </div>
                
                <div className="flex items-center gap-4 relative z-10">
                    <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
                        <AlertTriangle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg flex items-center gap-2">
                            Predictive Performance Alert
                            <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">AI Analysis</span>
                        </h4>
                        <p className="text-sm text-muted-foreground max-w-xl">
                            {branch === "all" && "Cross-departmental analysis suggests a 4.2% increase in overall technical proficiency across all 1st-year students next semester."}
                            {branch === "CSE" && "CSE Predictive Model: Semester 6 students show high aptitude for DevOps electives based on existing lab performance."}
                            {branch === "CSM" && "AI/ML Department Insight: Potential resource shortage in high-compute lab slots; 15% more GPU time required next month."}
                            {branch === "IT" && "Critical Trend: IT Semester 3 indicates a potential 8% dip in 'Database Systems' scores due to recent attendance gaps."}
                            {branch === "ECE" && "ECE Signal Analysis: Batch 2023 shows strong engagement with 'Embedded Systems'—88% likely to clear with distinction."}
                        </p>
                    </div>
                </div>
                <button 
                    onClick={() => {
                        import("sonner").then(({ toast }) => {
                            toast.info(`Generating ${branch === "all" ? "Campus-wide" : branch} Predictive Report...`, {
                                description: "Detailed AI analysis for proactively improving student academic outcome."
                            });
                        });
                    }}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/30 whitespace-nowrap relative z-10"
                >
                    Detailed Report
                </button>
            </motion.div>
        </div>
    );
};

export default Analytics;


