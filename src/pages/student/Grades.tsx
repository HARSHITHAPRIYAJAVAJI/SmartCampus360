import { useOutletContext } from "react-router-dom";
import { useMemo } from "react";
import { MOCK_STUDENTS } from "@/data/mockStudents";
import { MOCK_COURSES, Course } from "@/data/mockCourses";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Award, BookOpen } from "lucide-react";
import { calculateAcademicMetrics } from "@/utils/academicCalculations";
import { academicService, CourseMarks } from "@/services/academicService";
import { useEffect, useState } from "react";

const Grades = () => {
    const { user } = useOutletContext<{ user: { name: string, id: string, role: string } }>();
    
    const [storageSyncStamp, setStorageSyncStamp] = useState(0);
    useEffect(() => {
        const handleUpdate = () => setStorageSyncStamp(s => s + 1);
        window.addEventListener('academic_records_updated', handleUpdate);
        return () => window.removeEventListener('academic_records_updated', handleUpdate);
    }, []);

    const studentData = useMemo(() => {
        const saved = localStorage.getItem('smartcampus_student_directory');
        const students = saved ? JSON.parse(saved) : MOCK_STUDENTS;
        return students.find((s: any) => 
            s.rollNumber.toUpperCase() === user.id.toUpperCase() ||
            s.email.toLowerCase() === user.name.toLowerCase()
        );
    }, [user.id, user.name, storageSyncStamp]);

    const branch = studentData?.branch || 'CSE';

    // Filter courses for student branch
    const branchCourses = MOCK_COURSES.filter(c => c.department === branch);
    
    // Group by semester - only show up to current year (2 semesters per year)
    const currentYear = studentData?.year || 4;
    const currentSemester = (currentYear * 2) - 1;
    const maxSemToShow = currentYear * 2;
    const semesters = Array.from({ length: maxSemToShow }, (_, i) => i + 1);

    const storedMarks = useMemo(() => {
        if (!studentData) return {};
        return academicService.getAllForStudent(studentData.id);
    }, [studentData, storageSyncStamp]);

    const resultsBySem = semesters.reduce((acc, sem) => {
        const semCourses = branchCourses.filter(c => c.semester === sem && c.credits > 0);
        const visibility = academicService.getVisibility(currentYear, sem);

        if (semCourses.length > 0) {

            acc[sem] = semCourses.map(c => {
                const realMarks = storedMarks[c.code];
                
                const isProject = c.name.toLowerCase().includes("project") && 
                                  (c.name.toLowerCase().includes("stage") || 
                                   c.name.toLowerCase().includes("phase"));
                const isLab = c.type === 'Lab';

                const dummy = academicService.getGeneratedMarks(studentData?.id || "unknown", c.code, c.name, isLab, isProject, c.credits, sem === currentSemester);
                
                // Merge real marks into dummy if they exist
                const finalMarks = {
                    mid1: realMarks?.mid1 ?? dummy.mid1,
                    assignment1: realMarks?.assignment1 ?? dummy.assignment1,
                    mid1_val: realMarks?.mid1 ?? dummy.mid1,
                    assgn1: realMarks?.assignment1 ?? dummy.assignment1,
                    mid2: realMarks?.mid2 ?? dummy.mid2,
                    assgn2: realMarks?.assignment2 ?? dummy.assignment2,
                    labInternal: realMarks?.labInternal ?? dummy.labInternal,
                    labExternal: realMarks?.labExternal ?? dummy.labExternal,
                    exam: realMarks?.examMark ?? dummy.exam,
                    total: (realMarks ? (Math.max(realMarks.mid1 || 0, realMarks.mid2 || 0) + (realMarks.assignment1 || 0) + (realMarks.assignment2 || 0) + (realMarks.examMark || 0)) : dummy.total)
                };

                return {
                    code: c.code,
                    subject: c.name,
                    ...finalMarks,
                    status: (finalMarks.total > 0 || c.credits === 0) ? (isProject ? "Project Review" : "Pass") : "Pending",
                    isNonCredit: c.credits === 0 || isProject,
                    isProject,
                    visibility
                };
            });
        }
        return acc;
    }, {} as Record<number, any[]>);

    const academicMetrics = useMemo(() => {
        if (!studentData) return { earnedCredits: 0, totalCredits: 160 };
        return calculateAcademicMetrics(branch, currentSemester);
    }, [studentData, branch]);

    return (
        <div className="space-y-6 animate-in fade-in-50">
            <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1 font-black tracking-widest uppercase text-[10px]">
                        Branch: {branch}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 px-3 py-1 font-black tracking-widest uppercase text-[10px]">
                        Semester: {currentSemester}
                    </Badge>
                    <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-100 px-3 py-1 font-black tracking-widest uppercase text-[10px]">
                        Section: {studentData?.section || 'A'}
                    </Badge>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Academic Performance</h1>
                <p className="text-muted-foreground font-medium">Verify your scholastic achievement and semester-wise results matrix.</p>
            </div>

            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-none shadow-md bg-gradient-to-br from-violet-50 to-white dark:from-violet-950/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Cumulative GPA</CardTitle>
                        <Award className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-primary">{studentData?.grade?.toFixed(2) || "0.00"}</div>
                        <p className="text-xs font-bold text-success mt-1">↑ 0.12 from last semester</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Semester GPA (SGPA)</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-blue-600">8.8{currentSemester}</div>
                        <p className="text-xs font-bold text-muted-foreground mt-1">Current Sem Performance</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Total Credits Earned</CardTitle>
                        <BookOpen className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">{academicMetrics.earnedCredits}</div>
                        <p className="text-xs font-bold text-muted-foreground mt-1">Out of {academicMetrics.totalCredits} required</p>
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
                    <Tabs defaultValue={String(currentSemester)} className="w-full">
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
                                                        <TableHead colSpan={3} className="text-center font-black border-r bg-green-50/50 dark:bg-green-900/10 text-green-700 text-sm uppercase tracking-widest">Practical/Lab (100M)</TableHead>
                                                        <TableHead colSpan={2} className="text-center font-black bg-amber-50/50 dark:bg-amber-900/10 text-amber-700 text-sm uppercase tracking-widest">SUMMARY</TableHead>
                                                    </TableRow>
                                                    <TableRow className="bg-slate-50/50 dark:bg-slate-900/20">
                                                        <TableHead className="text-center text-[11px] font-bold py-2 border-r uppercase tracking-tight">Mid 1+2</TableHead>
                                                        <TableHead className="text-center text-[11px] font-bold py-2 border-r uppercase tracking-tight">Assgn</TableHead>
                                                        <TableHead className="text-center text-[11px] font-black py-2 border-r bg-blue-100/30">Total</TableHead>
                                                        <TableHead className="text-center text-[11px] font-bold py-2 border-r uppercase tracking-tight">Int (40)</TableHead>
                                                        <TableHead className="text-center text-[11px] font-bold py-2 border-r uppercase tracking-tight">Ext (60)</TableHead>
                                                        <TableHead className="text-center text-[11px] font-black py-2 border-r bg-green-100/30">Total</TableHead>
                                                        <TableHead className="text-center text-[11px] font-bold py-2 border-r uppercase tracking-tight">SEMESTER</TableHead>
                                                        <TableHead className="text-center text-[11px] font-bold py-2 border-r uppercase tracking-tight">TOTAL</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody className="text-sm">
                                                    {resultsBySem[semNum].map((sub) => {
                                                        const internalTotal = sub.mid1 !== null ? (Math.max(sub.mid1 || 0, sub.mid2 || 0) + (sub.assgn1 || 0) + (sub.assgn2 || 0)) : 0;
                                                        const labTotal = (sub.labInternal || 0) + (sub.labExternal || 0);
                                                        const grandTotal = internalTotal + labTotal + (sub.exam || 0);

                                                        return (
                                                            <TableRow key={sub.code} className={`hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors border-b last:border-0 ${sub.isNonCredit ? 'bg-slate-50/50' : ''}`}>
                                                                <TableCell className="font-bold border-r font-mono text-xs text-muted-foreground">{sub.code}</TableCell>
                                                                <TableCell className="border-r font-bold text-slate-900 dark:text-slate-100">
                                                                    {sub.subject}
                                                                    {sub.isNonCredit && <Badge variant="outline" className="ml-2 text-[8px] font-black uppercase text-muted-foreground border-slate-200 bg-white">Non-Credit</Badge>}
                                                                </TableCell>
                                                                {sub.isNonCredit ? (
                                                                    <TableCell colSpan={9} className="text-center italic text-xs font-bold text-muted-foreground bg-muted/5 py-4">
                                                                        <div className="flex items-center justify-center gap-2">
                                                                            <BookOpen className="w-3 h-3" />
                                                                            Subject completed satisfactorily without quantitative assessment as per academic policy.
                                                                        </div>
                                                                    </TableCell>
                                                                ) : (
                                                                    <>
                                                                        <TableCell className="text-center border-r font-bold text-sm text-slate-700">
                                                                            {sub.visibility.showMid1 ? (sub.mid1 !== null ? sub.mid1 : '-') : '—'}
                                                                            /
                                                                            {sub.visibility.showMid2 ? (sub.mid2 !== null ? sub.mid2 : '-') : '—'}
                                                                        </TableCell>
                                                                        <TableCell className="text-center border-r font-bold text-sm text-slate-700">
                                                                            {sub.visibility.showAssgn1 ? (sub.assgn1 !== null ? sub.assgn1 : '-') : '—'}
                                                                            /
                                                                            {sub.visibility.showAssgn2 ? (sub.assgn2 !== null ? sub.assgn2 : '-') : '—'}
                                                                        </TableCell>
                                                                        <TableCell className="text-center border-r font-black bg-blue-50/30 dark:bg-blue-900/10 text-blue-700 text-sm">
                                                                            {sub.visibility.showMid1 ? internalTotal : 'Hidd.'}
                                                                        </TableCell>
                                                                        <TableCell className="text-center border-r font-bold text-sm text-slate-700">{sub.visibility.showMid1 ? (sub.labInternal || '-') : '—'}</TableCell>
                                                                        <TableCell className="text-center border-r font-bold text-sm text-slate-700">{sub.visibility.showMid2 ? (sub.labExternal || '-') : '—'}</TableCell>
                                                                        <TableCell className="text-center border-r font-black bg-green-50/30 dark:bg-green-900/10 text-green-700 text-sm">
                                                                            {sub.visibility.showMid2 ? (labTotal > 0 ? labTotal : '-') : 'Hidd.'}
                                                                        </TableCell>
                                                                        <TableCell className="text-center border-r font-bold text-sm text-slate-700">{sub.visibility.showExam ? (sub.exam || '-') : '—'}</TableCell>
                                                                        <TableCell className="text-center font-black text-slate-900 dark:text-white text-base">
                                                                            {sub.visibility.showMid1 ? grandTotal : 'In Prog.'}
                                                                        </TableCell>
                                                                    </>
                                                                )}
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </div>
                                        <div className="mt-8">
                                            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border flex flex-col gap-1 shadow-sm relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-6 opacity-10">
                                                    <Award className="w-16 h-16" />
                                                </div>
                                                <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Academic Standing</span>
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
