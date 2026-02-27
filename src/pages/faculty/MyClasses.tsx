import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, MapPin, ChevronRight, BookOpen } from "lucide-react";

// Mock Data
const CLASSES = [
    { id: 1, name: "Advanced Algorithms", code: "CS401", time: "10:00 AM - 11:30 AM", days: "Mon, Wed", room: "LH-302", students: 45, semester: 6 },
    { id: 2, name: "Database Management Systems", code: "CS302", time: "02:00 PM - 03:30 PM", days: "Tue, Thu", room: "Lab-2", students: 38, semester: 4 },
    { id: 3, name: "Machine Learning", code: "AI501", time: "09:00 AM - 10:30 AM", days: "Fri", room: "LH-101", students: 60, semester: 8 },
];

const MyClasses = () => {
    return (
        <div className="space-y-6 animate-in fade-in-50">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Classes</h1>
                <p className="text-muted-foreground">Manage your assigned courses and view schedules.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {CLASSES.map((cls) => (
                    <Card key={cls.id} className="group hover:shadow-lg transition-all border-l-4 border-l-primary">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <Badge variant="outline" className="mb-2">{cls.code}</Badge>
                                    <CardTitle className="text-xl">{cls.name}</CardTitle>
                                </div>
                            </div>
                            <CardDescription className="flex items-center gap-2 mt-2">
                                <Users className="h-4 w-4" /> {cls.students} Students Enrolled
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col gap-2 text-sm">
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <span>{cls.time}</span>
                                </div>
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span>{cls.days}</span>
                                </div>
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <span>{cls.room}</span>
                                </div>
                            </div>

                            <div className="pt-2 border-t flex justify-between items-center">
                                <div className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded">
                                    Semester {cls.semester}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full gap-2 group-hover:bg-primary/90">
                                <BookOpen className="h-4 w-4" /> View Class Materials
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Sessions</CardTitle>
                    <CardDescription>Your schedule for today.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                            <div className="flex items-center gap-4">
                                <div className="bg-primary/10 p-3 rounded-lg text-primary font-bold text-center min-w-[60px]">
                                    10:00<div className="text-xs font-normal">AM</div>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Advanced Algorithms</h4>
                                    <p className="text-sm text-muted-foreground">Lecture Hall 302 • Semester 6</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm">Mark Attendance</Button>
                        </div>
                        <div className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                            <div className="flex items-center gap-4">
                                <div className="bg-orange-100 p-3 rounded-lg text-orange-600 font-bold text-center min-w-[60px]">
                                    02:00<div className="text-xs font-normal">PM</div>
                                </div>
                                <div>
                                    <h4 className="font-semibold">DBMS Lab</h4>
                                    <p className="text-sm text-muted-foreground">Computer Lab 2 • Semester 4</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm">Mark Attendance</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MyClasses;
