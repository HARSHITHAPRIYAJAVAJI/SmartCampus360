import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
    Calendar, 
    Clock, 
    MapPin, 
    Search, 
    Plus, 
    Filter,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const MOCK_EXAMS = [
    { id: 1, subject: "Machine Learning", code: "CSM-101", date: "2025-05-12", time: "10:00 AM - 01:00 PM", room: "Block A - 301", students: 120, status: "allocated" },
    { id: 2, subject: "Data Structures", code: "CSM-102", date: "2025-05-14", time: "02:00 PM - 05:00 PM", room: "Block B - 202", students: 156, status: "pending" },
    { id: 3, subject: "Database Systems", code: "CSM-103", date: "2025-05-16", time: "10:00 AM - 01:00 PM", room: "Block A - 105", students: 89, status: "allocated" },
    { id: 4, subject: "Web Technologies", code: "CSM-104", date: "2025-05-19", time: "10:00 AM - 01:00 PM", room: "Lab 1 & 2", students: 210, status: "pending" },
];

export default function ExamManagement() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);

    const filteredExams = MOCK_EXAMS.filter(exam => 
        exam.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAllocate = () => {
        setIsAddOpen(false);
        toast({
            title: "Success",
            description: "Exam schedule has been allocated successfully.",
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in-50 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Exam Schedule Allocation</h1>
                    <p className="text-muted-foreground">Manage and allocate seating for upcoming examinations.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate('/dashboard/admin')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> New Allocation
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Allocate Exam Seating</DialogTitle>
                                <DialogDescription>Create a new exam schedule and assign rooms.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subject</Label>
                                        <Select>
                                            <SelectTrigger id="subject">
                                                <SelectValue placeholder="Select subject" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ml">Machine Learning</SelectItem>
                                                <SelectItem value="ds">Data Structures</SelectItem>
                                                <SelectItem value="dbms">Database Systems</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Date</Label>
                                        <Input id="date" type="date" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="time">Time Slot</Label>
                                        <Select>
                                            <SelectTrigger id="time">
                                                <SelectValue placeholder="Select slot" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="morning">10:00 AM - 01:00 PM</SelectItem>
                                                <SelectItem value="afternoon">02:00 PM - 05:00 PM</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="room">Room / Block</Label>
                                        <Input id="room" placeholder="e.g. Block A - 301" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="students">Number of Students</Label>
                                    <Input id="students" type="number" placeholder="Total capacity" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                                <Button onClick={handleAllocate}>Allocate Now</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <CardTitle>Upcoming Examinations</CardTitle>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search exams..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredExams.map((exam) => (
                            <div key={exam.id} className="group p-4 border rounded-xl hover:bg-muted/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-lg ${exam.status === 'allocated' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        <Calendar className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-lg">{exam.subject}</h4>
                                            <Badge variant="outline" className="font-mono text-[10px]">{exam.code}</Badge>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5" /> {exam.date} | {exam.time}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-3.5 w-3.5" /> {exam.room}
                                            </span>
                                            <span className="flex items-center gap-1 font-medium">
                                                <Users className="h-3.5 w-3.5" /> {exam.students} Students
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between md:justify-end gap-3">
                                    <Badge variant={exam.status === 'allocated' ? "default" : "secondary"}>
                                        {exam.status === 'allocated' ? (
                                            <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Allocated</span>
                                        ) : (
                                            <span className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Pending Seating</span>
                                        )}
                                    </Badge>
                                    <Button variant="outline" size="sm">Modify</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-lg">Room Utilization</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Main Hall Capacity</span>
                                <span className="font-bold text-primary">85%</span>
                            </div>
                            <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Invigilator Available</span>
                                <span className="font-bold text-green-600">32/45</span>
                            </div>
                            <div className="h-2 w-full bg-green-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500" style={{ width: '71%' }}></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Allocation Priority</CardTitle>
                        <CardDescription>Courses with high student counts needing large halls first.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            <Badge className="py-2 px-4 text-sm bg-destructive/10 text-destructive hover:bg-destructive/20 cursor-default border-destructive/30">
                                1. Data Structures (156) - Hall A
                            </Badge>
                            <Badge className="py-2 px-4 text-sm bg-warning/10 text-warning hover:bg-warning/20 cursor-default border-warning/30">
                                2. Web Tech (210) - Labs 1,2,3
                            </Badge>
                            <Badge className="py-2 px-4 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-default border-blue-200">
                                3. Machine Learning (120) - Hall B
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
