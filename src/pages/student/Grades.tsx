import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Award, BookOpen } from "lucide-react";

// Mock Data
const SEMESTER_GRADES = {
    sem1: [
        { code: "CS101", subject: "Programming Fundamentals", credits: 4, grade: "A", points: 9 },
        { code: "MA101", subject: "Engineering Mathematics I", credits: 4, grade: "B+", points: 8 },
        { code: "PH101", subject: "Engineering Physics", credits: 3, grade: "A-", points: 8.5 },
        { code: "EG101", subject: "Engineering Graphics", credits: 2, grade: "O", points: 10 },
    ],
    sem2: [
        { code: "CS102", subject: "Data Structures", credits: 4, grade: "A+", points: 9.5 },
        { code: "MA102", subject: "Engineering Mathematics II", credits: 4, grade: "A", points: 9 },
        { code: "EE101", subject: "Basic Electrical Engg", credits: 3, grade: "B", points: 7 },
        { code: "CS103", subject: "Digital Logic Design", credits: 3, grade: "A", points: 9 },
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

                        {Object.entries(SEMESTER_GRADES).map(([key, grades]) => (
                            <TabsContent key={key} value={key}>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Course Code</TableHead>
                                                <TableHead>Subject Name</TableHead>
                                                <TableHead className="text-center">Credits</TableHead>
                                                <TableHead className="text-center">Grade</TableHead>
                                                <TableHead className="text-right">Points</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {grades.map((subject) => (
                                                <TableRow key={subject.code}>
                                                    <TableCell className="font-medium">{subject.code}</TableCell>
                                                    <TableCell>{subject.subject}</TableCell>
                                                    <TableCell className="text-center">{subject.credits}</TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge variant={
                                                            subject.grade.startsWith('A') || subject.grade === 'O' ? "default" : "secondary"
                                                        }>
                                                            {subject.grade}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">{subject.points}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <div className="bg-muted p-4 rounded-lg flex gap-8">
                                        <div>
                                            <span className="text-sm text-muted-foreground block">SGPA</span>
                                            <span className="text-xl font-bold">{key === 'sem1' ? '8.9' : '8.8'}</span>
                                        </div>
                                    </div>
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
