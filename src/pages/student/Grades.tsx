import { useOutletContext } from "react-router-dom";
import { useMemo } from "react";
import { MOCK_STUDENTS } from "@/data/mockStudents";
import { MOCK_COURSES, Course } from "@/data/mockCourses";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Award, BookOpen } from "lucide-react";

// Helper to generate realistic dummy marks
const getMarks = (course: Course) => {
    const isLab = course.type === 'Lab';
    const seed = course.code.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const pseudoRandom = (min: number, max: number) => {
        const val = ((seed * 9301 + 49297) % 233280) / 233280;
        return Math.floor(min + val * (max - min));
    };

    if (isLab) {
        const labInt = pseudoRandom(25, 30);
        const labExt = pseudoRandom(55, 68);
        return {
            mid1: null, assgn1: null, mid2: null, assgn2: null,
            labInternal: labInt, labExternal: labExt,
            exam: null, total: labInt + labExt, status: "Pass"
        };
    } else {
        const m1 = pseudoRandom(22, 28);
        const m2 = pseudoRandom(20, 27);
        const a1 = 5;
        const a2 = 5;
        const ex = pseudoRandom(40, 60);
        return {
            mid1: m1, assgn1: a1, mid2: m2, assgn2: a2,
            labInternal: null, labExternal: null,
            exam: ex, total: Math.max(m1, m2) + a1 + a2 + ex, status: "Pass"
        };
    }
};

const Grades = () => {
    const { user } = useOutletContext<{ user: { name: string, id: string, role: string } }>();
    
    const studentData = useMemo(() => {
        return MOCK_STUDENTS.find((s: any) => 
            s.rollNumber.toUpperCase() === user.id.toUpperCase() ||
            s.email.toLowerCase() === user.name.toLowerCase()
        );
    }, [user.id, user.name]);

    const branch = studentData?.branch || 'CSE';

    // Filter courses for student branch
    const branchCourses = MOCK_COURSES.filter(c => c.department === branch);
    
    // Group by semester
    const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
    const resultsBySem = semesters.reduce((acc, sem) => {
        const semCourses = branchCourses.filter(c => c.semester === sem);
        if (semCourses.length > 0) {
            acc[sem] = semCourses.map(c => ({
                code: c.code,
                subject: c.name,
                ...getMarks(c)
            }));
        }
        return acc;
    }, {} as Record<number, any[]>);

    return (
        <div className="space-y-6 animate-in fade-in-50">
            <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1 font-black tracking-widest uppercase text-[10px]">
                        Branch: {branch}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 px-3 py-1 font-black tracking-widest uppercase text-[10px]">
                        Semester: {studentData?.semester || '7'}
                    </Badge>
                    <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-100 px-3 py-1 font-black tracking-widest uppercase text-[10px]">
                        Section: {studentData?.section || 'A'}
                    </Badge>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Academic Performance</h1>
                <p className="text-muted-foreground font-medium">Verify your scholastic achievement and semester-wise results matrix.</p>
            </div>

            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-none shadow-md bg-gradient-to-br from-violet-50 to-white dark:from-violet-950/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Cumulative GPA</CardTitle>
                        <Award className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-primary">8.85</div>
                        <p className="text-xs font-bold text-success mt-1">↑ 0.12 from last semester</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Total Credits Earned</CardTitle>
                        <BookOpen className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">124</div>
                        <p className="text-xs font-bold text-muted-foreground mt-1">Out of 160 required</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Class Rank</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">5th</div>
                        <p className="text-xs font-bold text-muted-foreground mt-1">Top 5% of class</p>
                    </CardContent>
                </Card>
            </div>

            {/* Semester Grades */}
            <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="bg-muted/30">
                    <CardTitle className="flex items-center gap-2">
                         <BookOpen className="w-5 h-5 text-primary" />
                         Semester Results Matrix
                    </CardTitle>
                    <CardDescription>Comprehensive breakdown of internal and external assessments.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <Tabs defaultValue={String(studentData?.semester || '7')} className="w-full">
                        <TabsList className="grid grid-cols-4 md:grid-cols-8 mb-8 bg-muted/50 p-1 h-auto">
                            {semesters.map(s => (
                                <TabsTrigger key={s} value={s.toString()} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 font-bold">
                                    Sem {s}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {semesters.map(semNum => (
                            <TabsContent key={semNum} value={semNum.toString()} className="animate-in fade-in-50 zoom-in-95 duration-300">
                                {resultsBySem[semNum] ? (
                                    <>
                                        <div className="rounded-xl border shadow-sm overflow-hidden bg-white dark:bg-slate-950">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-slate-50/80 dark:bg-slate-900/50">
                                                        <TableHead rowSpan={2} className="w-[100px] font-black border-r text-sm uppercase tracking-tighter">Code</TableHead>
                                                        <TableHead rowSpan={2} className="w-[250px] font-black border-r text-sm uppercase tracking-tighter">Subject</TableHead>
                                                        <TableHead colSpan={3} className="text-center font-black border-r bg-blue-50/50 dark:bg-blue-900/10 text-blue-700 text-sm uppercase tracking-widest">Internals (35M)</TableHead>
                                                        <TableHead colSpan={3} className="text-center font-black border-r bg-green-50/50 dark:bg-green-900/10 text-green-700 text-sm uppercase tracking-widest">Practical/Lab</TableHead>
                                                        <TableHead colSpan={3} className="text-center font-black bg-amber-50/50 dark:bg-amber-900/10 text-amber-700 text-sm uppercase tracking-widest">Summary</TableHead>
                                                    </TableRow>
                                                    <TableRow className="bg-slate-50/50 dark:bg-slate-900/20">
                                                        <TableHead className="text-center text-[11px] font-bold py-2 border-r uppercase tracking-tight">Mid 1+2</TableHead>
                                                        <TableHead className="text-center text-[11px] font-bold py-2 border-r uppercase tracking-tight">Assgn</TableHead>
                                                        <TableHead className="text-center text-[11px] font-black py-2 border-r bg-blue-100/30">Total</TableHead>
                                                        <TableHead className="text-center text-[11px] font-bold py-2 border-r uppercase tracking-tight">Int</TableHead>
                                                        <TableHead className="text-center text-[11px] font-bold py-2 border-r uppercase tracking-tight">Ext</TableHead>
                                                        <TableHead className="text-center text-[11px] font-black py-2 border-r bg-green-100/30">Total</TableHead>
                                                        <TableHead className="text-center text-[11px] font-bold py-2 border-r uppercase tracking-tight">Exam</TableHead>
                                                        <TableHead className="text-center text-[11px] font-bold py-2 border-r uppercase tracking-tight">Total</TableHead>
                                                        <TableHead className="text-center text-[11px] font-black py-2 bg-amber-100/30 text-amber-700">%</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody className="text-sm">
                                                    {resultsBySem[semNum].map((sub) => {
                                                        const internalTotal = sub.mid1 !== null ? (Math.max(sub.mid1 || 0, sub.mid2 || 0) + (sub.assgn1 || 0) + (sub.assgn2 || 0)) : 0;
                                                        const labTotal = (sub.labInternal || 0) + (sub.labExternal || 0);
                                                        const semesterExam = sub.exam || 0;
                                                        const grandTotal = internalTotal + labTotal + semesterExam;

                                                        return (
                                                            <TableRow key={sub.code} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors border-b last:border-0">
                                                                <TableCell className="font-bold border-r font-mono text-xs text-muted-foreground">{sub.code}</TableCell>
                                                                <TableCell className="border-r font-bold text-slate-900 dark:text-slate-100">{sub.subject}</TableCell>
                                                                <TableCell className="text-center border-r font-bold text-sm text-slate-700">{sub.mid1 !== null ? `${sub.mid1}/${sub.mid2}` : '-'}</TableCell>
                                                                <TableCell className="text-center border-r font-bold text-sm text-slate-700">{sub.assgn1 !== null ? `${sub.assgn1}/${sub.assgn2}` : '-'}</TableCell>
                                                                <TableCell className="text-center border-r font-black bg-blue-50/30 dark:bg-blue-900/10 text-blue-700 text-sm">{sub.mid1 !== null ? internalTotal : '-'}</TableCell>
                                                                <TableCell className="text-center border-r font-bold text-sm text-slate-700">{sub.labInternal || '-'}</TableCell>
                                                                <TableCell className="text-center border-r font-bold text-sm text-slate-700">{sub.labExternal || '-'}</TableCell>
                                                                <TableCell className="text-center border-r font-black bg-green-50/30 dark:bg-green-900/10 text-green-700 text-sm">{labTotal > 0 ? labTotal : '-'}</TableCell>
                                                                <TableCell className="text-center border-r font-bold text-sm text-slate-700">{sub.exam || '-'}</TableCell>
                                                                <TableCell className="text-center border-r font-black text-slate-900 dark:text-white text-base">{grandTotal}</TableCell>
                                                                <TableCell className="text-center bg-amber-50/30 dark:bg-amber-900/10 font-black text-amber-700 text-base">
                                                                    {grandTotal}%
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </div>
                                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border flex flex-col gap-1 shadow-sm">
                                                <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Attendance</span>
                                                <span className="text-2xl font-black text-slate-900 dark:text-white">92%</span>
                                            </div>
                                            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border flex flex-col gap-1 shadow-sm">
                                                <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">SGPA</span>
                                                <span className="text-2xl font-black text-primary">8.8{semNum}</span>
                                            </div>
                                            <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border flex flex-col gap-1 shadow-sm relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                                    <Award className="w-12 h-12" />
                                                </div>
                                                <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Status</span>
                                                <span className="text-xl font-bold text-success uppercase tracking-tight">PASS - First Class with Distinction</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 bg-muted/10 rounded-2xl border-2 border-dashed">
                                        <BookOpen className="w-12 h-12 text-muted-foreground/30 mb-4" />
                                        <p className="text-muted-foreground font-bold italic">No academic data published for Semester {semNum} yet.</p>
                                    </div>
                                )}
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default Grades;
