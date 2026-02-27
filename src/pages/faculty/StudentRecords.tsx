import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText, Mail, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MOCK_STUDENTS = [
    { id: "S101", name: "Alice Johnson", rollNo: "2021CS001", sem: 6, cgpa: 8.9, attendance: "92%" },
    { id: "S102", name: "Bob Smith", rollNo: "2021CS002", sem: 6, cgpa: 7.5, attendance: "85%" },
    { id: "S103", name: "Charlie Brown", rollNo: "2021CS003", sem: 6, cgpa: 9.2, attendance: "96%" },
    { id: "S104", name: "David Wilson", rollNo: "2021CS004", sem: 6, cgpa: 6.8, attendance: "78%" },
    { id: "S105", name: "Eva Davis", rollNo: "2021CS005", sem: 6, cgpa: 8.1, attendance: "88%" },
];

const StudentRecords = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredStudents = MOCK_STUDENTS.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in-50">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Student Records</h1>
                <p className="text-muted-foreground">Access academic records and performance details of students.</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                            <CardTitle>Directory</CardTitle>
                            <CardDescription>View all students assigned to your department/classes.</CardDescription>
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or roll number..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Roll No</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Semester</TableHead>
                                <TableHead>CGPA</TableHead>
                                <TableHead>Attendance</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-mono">{student.rollNo}</TableCell>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>{student.sem}</TableCell>
                                    <TableCell>
                                        <Badge variant={student.cgpa >= 9 ? "default" : student.cgpa >= 7 ? "secondary" : "outline"}>
                                            {student.cgpa}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className={
                                            parseInt(student.attendance) < 75 ? "text-red-500 font-bold" : "text-green-600"
                                        }>
                                            {student.attendance}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">
                                            <FileText className="h-4 w-4 mr-1" /> View Profile
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default StudentRecords;
