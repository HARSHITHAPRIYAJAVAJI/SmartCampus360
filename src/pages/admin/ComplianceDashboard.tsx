import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FileText, CheckCircle, XCircle, TrendingUp, Users, Download, 
    GraduationCap, BookOpen, Clock, AlertCircle, Filter, Search,
    Award, BarChart4, ChevronRight, FileJson, FilePieChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { MOCK_FACULTY } from "@/data/mockFaculty";
import { MOCK_STUDENTS } from "@/data/mockStudents";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const AccreditationDashboard = () => {
    const [branch, setBranch] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Calculate dynamic stats from mock data
    const stats = useMemo(() => {
        const filteredFaculty = branch === "all" ? MOCK_FACULTY : MOCK_FACULTY.filter(f => f.department === branch);
        const filteredStudents = branch === "all" ? MOCK_STUDENTS : MOCK_STUDENTS.filter(s => s.branch === branch);

        // Faculty stats
        const totalFaculty = filteredFaculty.length;
        const phds = filteredFaculty.filter(f => f.designation.includes("Professor") || f.name.includes("Dr.")).length;
        const avgExp = 12.5; // Dummy logic for experience
        const publications = totalFaculty * 3; // Simulated publications

        // Student academic data
        const totalStudents = filteredStudents.length;
        const passPercentage = totalStudents > 0 ? 88.5 : 0;
        const avgGPA = totalStudents > 0 ? (filteredStudents.reduce((acc, s) => acc + s.grade, 0) / totalStudents).toFixed(2) : "0.00";
        const lowAttendance = filteredStudents.filter(s => s.attendance < 75).length;

        return {
            totalFaculty,
            phds,
            avgExp,
            publications,
            totalStudents,
            passPercentage,
            avgGPA,
            lowAttendance
        };
    }, [branch]);

    const handleDownload = (type: string, format: 'PDF' | 'CSV' | 'NAAC') => {
        const filteredFaculty = branch === "all" ? MOCK_FACULTY : MOCK_FACULTY.filter(f => f.department === branch);
        const filteredStudents = branch === "all" ? MOCK_STUDENTS : MOCK_STUDENTS.filter(s => s.branch === branch);

        if (format === 'CSV') {
            const dataToExport = type === 'Faculty' ? filteredFaculty : filteredStudents;
            if (dataToExport.length === 0) {
                toast.error("No data found for the selected branch.");
                return;
            }

            const headers = Object.keys(dataToExport[0]).join(",");
            const rows = dataToExport.map(item => 
                Object.values(item).map(val => `"${String(val).replace(/"/g, '""')}"`).join(",")
            ).join("\n");
            
            const csvContent = `${headers}\n${rows}`;
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            
            link.setAttribute("href", url);
            link.setAttribute("download", `${type}_Report_${branch}_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast.success(`${type} CSV downloaded successfully!`);
        } else {
            // Simulated NAAC/PDF Report
            const reportContent = `
==================================================
        SMART CAMPUS 360 - NAAC COMPLIANCE REPORT
==================================================
Date: ${new Date().toLocaleDateString()}
Branch: ${branch.toUpperCase()}
--------------------------------------------------

1. FACULTY SUMMARY:
-------------------
Total Faculty: ${stats.totalFaculty}
PhD Holders: ${stats.phds}
Avg. Experience: ${stats.avgExp} Years
Total Publications: ${stats.publications}

2. STUDENT ACADEMIC SUMMARY:
----------------------------
Total Students: ${stats.totalStudents}
Average GPA: ${stats.avgGPA}
Pass Percentage: ${stats.passPercentage}%
Critical Low Attendance Students: ${stats.lowAttendance}

3. CURRICULUM DISTRIBUTION:
---------------------------
Core Theory: 65%
Laboratory: 25%
Electives: 10%

4. PLACEMENT DATA (PROBATIONARY):
----------------------------------
Placement Rate: 92.4%
Avg Package: 7.2 LPA
Highest Package: 48 LPA

--------------------------------------------------
Report Generated by SmartCampus360 Accreditation System
==================================================
            `;

            const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            
            link.setAttribute("href", url);
            link.setAttribute("download", `NAAC_Report_${branch}_${new Date().toISOString().split('T')[0]}.txt`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.info(`Generating NAAC Format Report...`, {
                description: "The formatted text report has been downloaded for audit purposes."
            });
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="space-y-8 pb-12 animate-in fade-in-50">
            {/* Header with Glassmorphism */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-background/60 backdrop-blur-md sticky top-0 z-10 py-4 border-b border-white/10 px-1">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-blue-600 bg-clip-text text-transparent">
                        Accreditation Module
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <Award className="h-4 w-4 text-amber-500" /> NAAC / NBA Compliance & Audit Readiness
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search data..." 
                            className="pl-9 bg-muted/40 border-none focus-visible:ring-primary/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={branch} onValueChange={setBranch}>
                        <SelectTrigger className="w-[180px] bg-muted/40 border-none">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="All Branches" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Branches</SelectItem>
                            <SelectItem value="CSE">CSE</SelectItem>
                            <SelectItem value="CSM">CSM</SelectItem>
                            <SelectItem value="IT">IT</SelectItem>
                            <SelectItem value="ECE">ECE</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Top Summary Cards */}
            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <motion.div variants={item}>
                    <Card className="overflow-hidden border-none bg-gradient-to-br from-blue-500/10 to-purple-500/10 hover:shadow-lg transition-all border-l-4 border-l-blue-500">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <Users className="h-5 w-5 text-blue-500" />
                                <Badge variant="secondary">Faculty</Badge>
                            </div>
                            <CardTitle className="text-3xl font-bold mt-2">{stats.totalFaculty}</CardTitle>
                            <CardDescription>Total Strength</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2 mt-2">
                                <div className="text-xs px-2 py-1 bg-blue-500/20 text-blue-700 rounded-full font-medium">PhD: {stats.phds}</div>
                                <div className="text-xs px-2 py-1 bg-purple-500/20 text-purple-700 rounded-full font-medium">Exp: {stats.avgExp}y</div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="overflow-hidden border-none bg-gradient-to-br from-emerald-500/10 to-teal-500/10 hover:shadow-lg transition-all border-l-4 border-l-emerald-500">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <GraduationCap className="h-5 w-5 text-emerald-500" />
                                <Badge variant="secondary">Students</Badge>
                            </div>
                            <CardTitle className="text-3xl font-bold mt-2">{stats.totalStudents}</CardTitle>
                            <CardDescription>Enrollment Analytics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2 mt-2">
                                <div className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-700 rounded-full font-medium">Avg GPA: {stats.avgGPA}</div>
                                <div className="text-xs px-2 py-1 bg-teal-500/20 text-teal-700 rounded-full font-medium">Pass: {stats.passPercentage}%</div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="overflow-hidden border-none bg-gradient-to-br from-amber-500/10 to-orange-500/10 hover:shadow-lg transition-all border-l-4 border-l-amber-500">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <Clock className="h-5 w-5 text-amber-500" />
                                <Badge variant="secondary">Attendance</Badge>
                            </div>
                            <CardTitle className="text-3xl font-bold mt-2">86%</CardTitle>
                            <CardDescription>Average Presence</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2 mt-2">
                                <div className="text-xs px-2 py-1 bg-red-500/20 text-red-700 rounded-full font-medium flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> {stats.lowAttendance} Critical Low
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="overflow-hidden border-none bg-gradient-to-br from-indigo-500/10 to-blue-500/10 hover:shadow-lg transition-all border-l-4 border-l-indigo-500">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <TrendingUp className="h-5 w-5 text-indigo-500" />
                                <Badge variant="secondary">Research</Badge>
                            </div>
                            <CardTitle className="text-3xl font-bold mt-2">{stats.publications}</CardTitle>
                            <CardDescription>Publications Count</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2 mt-2">
                                <div className="text-xs px-2 py-1 bg-indigo-500/20 text-indigo-700 rounded-full font-medium">Index: 4.2</div>
                                <div className="text-xs px-2 py-1 bg-blue-500/20 text-blue-700 rounded-full font-medium">Patents: 8</div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            {/* Detailed Sections */}
            <Tabs defaultValue="faculty" className="space-y-6">
                <TabsList className="bg-muted/40 p-1 backdrop-blur-xl border border-white/5">
                    <TabsTrigger value="faculty" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Faculty Records</TabsTrigger>
                    <TabsTrigger value="students" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Student Performance</TabsTrigger>
                    <TabsTrigger value="curriculum" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Curriculum Data</TabsTrigger>
                    <TabsTrigger value="placements" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Placements</TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                    <TabsContent value="faculty" className="space-y-4">
                        <Card className="border-none shadow-md overflow-hidden">
                            <CardHeader className="bg-muted/30 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Faculty Data Tracking</CardTitle>
                                    <CardDescription>Detailed qualification and research metrics for accreditation audit.</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => handleDownload('Faculty', 'CSV')}>
                                        <Download className="h-4 w-4 mr-2" /> CSV
                                    </Button>
                                    <Button size="sm" className="bg-[#b91c1c] hover:bg-[#991b1b] text-white transition-all shadow-md" onClick={() => handleDownload('Faculty', 'NAAC')}>
                                        <FileJson className="h-4 w-4 mr-2" /> NAAC Format
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Faculty Name</TableHead>
                                            <TableHead>Designation</TableHead>
                                            <TableHead>Qual.</TableHead>
                                            <TableHead>Exp (Yrs)</TableHead>
                                            <TableHead>Publications</TableHead>
                                            <TableHead>Department</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(branch === "all" ? MOCK_FACULTY : MOCK_FACULTY.filter(f => f.department === branch))
                                            .slice(0, 10)
                                            .map((f, i) => (
                                                <TableRow key={f.id} className="hover:bg-muted/20">
                                                    <TableCell className="font-medium underline decoration-primary/30 underline-offset-4">{f.name}</TableCell>
                                                    <TableCell>{f.designation}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={f.name.includes("Dr.") ? "default" : "outline"} className="font-normal text-[10px]">
                                                            {f.name.includes("Dr.") ? "PhD / NET" : "M.Tech / MS"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{Math.floor(Math.random() * 20) + 5}</TableCell>
                                                    <TableCell>{Math.floor(Math.random() * 15) + 2}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10">
                                                            {f.department}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="students" className="space-y-4">
                        <Card className="border-none shadow-md overflow-hidden">
                            <CardHeader className="bg-muted/30 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Student Academic Data</CardTitle>
                                    <CardDescription>Aggregated performance metrics per semester and branch.</CardDescription>
                                </div>
                                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg" onClick={() => handleDownload('Academic', 'NAAC')}>
                                    <FilePieChart className="h-4 w-4 mr-2" /> Generate NBA Report
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Semester</TableHead>
                                            <TableHead>Total Students</TableHead>
                                            <TableHead>Pass Rate</TableHead>
                                            <TableHead>Average GPA</TableHead>
                                            <TableHead>Backlogs %</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[1, 2, 3, 4, 5, 6, 7].map(sem => (
                                            <TableRow key={sem}>
                                                <TableCell className="font-bold">Semester {sem}</TableCell>
                                                <TableCell>{Math.floor(Math.random() * 50) + 120}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                                            <div 
                                                                className="h-full bg-emerald-500" 
                                                                style={{ width: `${85 + Math.random() * 10}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs">{(85 + Math.random() * 10).toFixed(1)}%</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{(7.5 + Math.random() * 2).toFixed(2)}</TableCell>
                                                <TableCell className="text-red-500 font-medium">{(2 + Math.random() * 4).toFixed(1)}%</TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="curriculum" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-none shadow-md">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <BookOpen className="h-5 w-5 text-primary" /> Subject Distribution
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Core Theory Subjects</span>
                                            <span className="font-medium text-primary">65%</span>
                                        </div>
                                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-[65%]" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Laboratory / Practical</span>
                                            <span className="font-medium text-emerald-500">25%</span>
                                        </div>
                                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 w-[25%]" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Open Electives</span>
                                            <span className="font-medium text-purple-500">10%</span>
                                        </div>
                                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-purple-500 w-[10%]" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-md">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <BarChart4 className="h-5 w-5 text-indigo-500" /> Credit Structure
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-muted/40 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Badge className="h-6 w-6 rounded-full flex items-center justify-center p-0">C</Badge>
                                            <span className="text-sm font-medium">Total B.Tech Credits</span>
                                        </div>
                                        <span className="text-xl font-bold">160</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-muted/40 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Badge variant="secondary" className="h-6 w-6 rounded-full flex items-center justify-center p-0">L</Badge>
                                            <span className="text-sm font-medium">Lab Contact Hours</span>
                                        </div>
                                        <span className="text-xl font-bold">12/wk</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="placements" className="space-y-4">
                        <Card className="border-none shadow-md overflow-hidden bg-gradient-to-r from-background to-primary/5">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Placement & Performance</CardTitle>
                                    <CardDescription>Final year career outcomes and package distribution.</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className="text-center p-6 bg-background/50 rounded-xl border border-white/10">
                                        <div className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Placement Rate</div>
                                        <div className="text-4xl font-black text-emerald-500 uppercase tracking-tighter">92.4%</div>
                                        <div className="text-xs text-emerald-600 mt-2 font-medium">+4.1% from Batch 2023</div>
                                    </div>
                                    <div className="text-center p-6 bg-background/50 rounded-xl border border-white/10">
                                        <div className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Highest Package</div>
                                        <div className="text-4xl font-black text-indigo-500 uppercase tracking-tighter">48 LPA</div>
                                        <div className="text-xs text-muted-foreground mt-2 font-medium">Google, Microsoft (Off Campus)</div>
                                    </div>
                                    <div className="text-center p-6 bg-background/50 rounded-xl border border-white/10">
                                        <div className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Average Package</div>
                                        <div className="text-4xl font-black text-amber-500 uppercase tracking-tighter">7.2 LPA</div>
                                        <div className="text-xs text-muted-foreground mt-2 font-medium">Tier-1 IT Solutions</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-bold flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Recent Top Recruiters</h4>
                                    <div className="flex flex-wrap gap-4 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                                        {['amazon', 'google', 'microsoft', 'tcs', 'infosys', 'accenture', 'wipro'].map(brand => (
                                            <div key={brand} className="px-6 py-3 bg-muted rounded-lg font-bold text-muted-foreground uppercase tracking-widest text-xs border border-white/5">
                                                {brand}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </AnimatePresence>
            </Tabs>

            {/* Compliance Alerts Footer */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={branch}
            >
                <Card className="border-none bg-red-500/5 shadow-none border-l-4 border-l-red-500 mt-12 overflow-hidden shadow-sm">
                    <CardHeader className="py-4">
                        <CardTitle className="text-base flex items-center gap-2 text-red-700 font-bold uppercase tracking-wide">
                            <AlertCircle className="h-4 w-4" /> Compliance Intervention Required
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                        <ul className="text-sm text-red-600/80 space-y-2 list-none">
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                {branch === "all" ? "Institutional faculty-student ratio is 1:21.8 (threshold 1:20)." : `Ratio of faculty to students in ${branch} exceeds AICTE norms.`}
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                Review pending for {Math.floor(stats.totalFaculty * 0.15)} faculty members' research publication proofs.
                            </li>
                            {stats.lowAttendance > 0 && (
                                <li className="flex items-center gap-2 font-semibold">
                                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                                    Critical: {stats.lowAttendance} students flagged with attendance below 75% for audit period.
                                </li>
                            )}
                        </ul>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default AccreditationDashboard;

