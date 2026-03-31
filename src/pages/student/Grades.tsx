import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Award, BookOpen } from "lucide-react";

// Mock Data
// Mock Data with detailed components
const SEMESTER_RESULTS = {
    sem1: [
        { 
            code: "4E1AJ", 
            subject: "C Programming for Problem Solving", 
            mid1: 28, assgn1: 5, mid2: 25, assgn2: 4, 
            labInternal: null, labExternal: null,
            exam: 55, total: 100, status: "Pass" 
        },
        { 
            code: "4B1AA", 
            subject: "Linear Algebra and ODE", 
            mid1: 22, assgn1: 4, mid2: 20, assgn2: 5, 
            labInternal: null, labExternal: null,
            exam: 42, total: 100, status: "Pass" 
        },
        { 
            code: "4E112", 
            subject: "C Programming Lab", 
            mid1: null, assgn1: null, mid2: null, assgn2: null, 
            labInternal: 28, labExternal: 62,
            exam: null, total: 100, status: "Pass" 
        },
    ],
    sem2: [
        { 
            code: "4E2AQ", 
            subject: "Data Structures", 
            mid1: 27, assgn1: 5, mid2: 26, assgn2: 5, 
            labInternal: null, labExternal: null,
            exam: 58, total: 100, status: "Pass" 
        },
        { 
            code: "4B2AM", 
            subject: "Statistical Methods & Vector Calculus", 
            mid1: 24, assgn1: 4, mid2: 18, assgn2: 4, 
            labInternal: null, labExternal: null,
            exam: 45, total: 100, status: "Pass" 
        },
        { 
            code: "4E211", 
            subject: "Data Structures Lab", 
            mid1: null, assgn1: null, mid2: null, assgn2: null, 
            labInternal: 29, labExternal: 65,
            exam: null, total: 100, status: "Pass" 
        },
    ]
};

const Grades = () => {
    return (
        <div className="space-y-6 animate-in fade-in-50">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Academic Performance</h1>
                <p className="text-muted-foreground">View your grades and CGPA progression.</p>
            </div>

            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cumulative GPA</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">8.85</div>
                        <p className="text-xs text-muted-foreground">Consistently good!</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Credits Earned</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45</div>
                        <p className="text-xs text-muted-foreground">Out of 160 required</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Class Rank</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5th</div>
                        <p className="text-xs text-muted-foreground">Top 5% of class</p>
                    </CardContent>
                </Card>
            </div>

            {/* Semester Grades */}
            <Card>
                <CardHeader>
                    <CardTitle>Semester Results</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="sem2">
                        <TabsList className="mb-4">
                            <TabsTrigger value="sem2">Semester 2</TabsTrigger>
                            <TabsTrigger value="sem1">Semester 1</TabsTrigger>
                        </TabsList>

                        {Object.entries(SEMESTER_RESULTS).map(([key, results]) => (
                            <TabsContent key={key} value={key}>
                                <div className="rounded-xl border shadow-sm overflow-hidden bg-white">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-50/50">
                                                <TableHead rowSpan={2} className="w-[100px] font-bold border-r">Code</TableHead>
                                                <TableHead rowSpan={2} className="w-[200px] font-bold border-r">Subject</TableHead>
                                                <TableHead colSpan={3} className="text-center font-bold border-r bg-blue-50/30 text-blue-700">Internal Marks (35M)</TableHead>
                                                <TableHead colSpan={3} className="text-center font-bold border-r bg-green-50/30 text-green-700">Practical/Lab Marks</TableHead>
                                                <TableHead colSpan={3} className="text-center font-bold bg-amber-50/30 text-amber-700">Semester Summary</TableHead>
                                            </TableRow>
                                            <TableRow className="bg-slate-50/50">
                                                {/* Internal Headers */}
                                                <TableHead className="text-center text-[10px] uppercase tracking-wider py-1 border-r">Mid 1+2</TableHead>
                                                <TableHead className="text-center text-[10px] uppercase tracking-wider py-1 border-r">Assgn</TableHead>
                                                <TableHead className="text-center text-[10px] uppercase tracking-wider py-1 font-bold border-r bg-blue-50/50">Total</TableHead>
                                                
                                                {/* Lab Headers */}
                                                <TableHead className="text-center text-[10px] uppercase tracking-wider py-1 border-r">Int</TableHead>
                                                <TableHead className="text-center text-[10px] uppercase tracking-wider py-1 border-r">Ext</TableHead>
                                                <TableHead className="text-center text-[10px] uppercase tracking-wider py-1 font-bold border-r bg-green-50/50">Total</TableHead>

                                                {/* Final Headers */}
                                                <TableHead className="text-center text-[10px] uppercase tracking-wider py-1 border-r">Exam</TableHead>
                                                <TableHead className="text-center text-[10px] uppercase tracking-wider py-1 border-r">Grand</TableHead>
                                                <TableHead className="text-center text-[10px] uppercase tracking-wider py-1 font-bold bg-amber-50/50 underline decoration-amber-500/30 text-center">%</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="text-xs">
                                            {results.map((sub) => {
                                                const internalTotal = sub.mid1 !== null ? (Math.max(sub.mid1 || 0, sub.mid2 || 0) + (sub.assgn1 || 0) + (sub.assgn2 || 0)) : 0;
                                                const labTotal = (sub.labInternal || 0) + (sub.labExternal || 0);
                                                const semesterExam = sub.exam || 0;
                                                const grandTotal = internalTotal + labTotal + semesterExam;
                                                const percentage = grandTotal; // Simplified as total is likely 100

                                                return (
                                                    <TableRow key={sub.code} className="hover:bg-slate-50/80 transition-colors">
                                                        <TableCell className="font-medium border-r">{sub.code}</TableCell>
                                                        <TableCell className="border-r font-medium text-slate-700">{sub.subject}</TableCell>
                                                        
                                                        {/* Internals */}
                                                        <TableCell className="text-center border-r font-mono">{sub.mid1 !== null ? `${sub.mid1}/${sub.mid2}` : '-'}</TableCell>
                                                        <TableCell className="text-center border-r font-mono">{sub.assgn1 !== null ? `${sub.assgn1}/${sub.assgn2}` : '-'}</TableCell>
                                                        <TableCell className="text-center border-r font-bold bg-blue-50/20 text-blue-600">{sub.mid1 !== null ? internalTotal : '-'}</TableCell>

                                                        {/* Labs */}
                                                        <TableCell className="text-center border-r font-mono">{sub.labInternal || '-'}</TableCell>
                                                        <TableCell className="text-center border-r font-mono">{sub.labExternal || '-'}</TableCell>
                                                        <TableCell className="text-center border-r font-bold bg-green-50/20 text-green-600">{labTotal > 0 ? labTotal : '-'}</TableCell>

                                                        {/* Final */}
                                                        <TableCell className="text-center border-r font-mono">{sub.exam || '-'}</TableCell>
                                                        <TableCell className="text-center border-r font-bold text-slate-900">{grandTotal}</TableCell>
                                                        <TableCell className="text-center bg-amber-50/20 font-black text-amber-600">
                                                            {percentage}%
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="mt-6 flex justify-between items-center bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner">
                                    <div className="flex gap-12">
                                        <div className="space-y-1">
                                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Attendance</span>
                                            <span className="text-2xl font-black text-slate-900 block">94%</span>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">SGPA</span>
                                            <span className="text-2xl font-black text-primary block">{key === 'sem1' ? '8.92' : '8.85'}</span>
                                        </div>
                                    </div>
                                    <Badge className="px-6 py-2 rounded-full text-sm font-bold bg-green-600 shadow-sm">PASS / FIRST CLASS WITH DISTINCTION</Badge>
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default Grades;
