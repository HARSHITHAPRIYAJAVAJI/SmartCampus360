import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Clock, User } from "lucide-react";

// Mock Data
const COURSES = [
    { id: 1, name: "Advanced Algorithms", code: "CS401", instructor: "Dr. Alan Turing", progress: 65, totalLectures: 30, completedLectures: 20 },
    { id: 2, name: "Database Management Systems", code: "CS302", instructor: "Prof. Ada Lovelace", progress: 40, totalLectures: 25, completedLectures: 10 },
    { id: 3, name: "Software Engineering", code: "SE201", instructor: "Dr. Grace Hopper", progress: 85, totalLectures: 28, completedLectures: 24 },
    { id: 4, name: "Computer Networks", code: "CN305", instructor: "Prof. Tim Berners-Lee", progress: 20, totalLectures: 32, completedLectures: 6 },
];

const MyCourses = () => {
    return (
        <div className="space-y-6 animate-in fade-in-50">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
                <p className="text-muted-foreground">Continue your learning journey.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {COURSES.map((course) => (
                    <Card key={course.id} className="group hover:shadow-lg transition-all flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded">{course.code}</span>
                            </div>
                            <CardTitle className="mt-2 text-xl line-clamp-2">{course.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <User className="h-4 w-4" /> {course.instructor}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 flex-1">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Course Progress</span>
                                    <span className="font-medium">{course.progress}%</span>
                                </div>
                                <Progress value={course.progress} className="h-2" />
                            </div>
                            <div className="text-sm text-muted-foreground pt-2">
                                {course.completedLectures} / {course.totalLectures} Lectures Completed
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">
                                <BookOpen className="h-4 w-4 mr-2" /> Continue Learning
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default MyCourses;
