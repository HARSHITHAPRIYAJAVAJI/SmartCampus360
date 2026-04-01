import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, XCircle, Clock, Calendar, BookOpen } from "lucide-react";
import { attendanceService, AttendanceRecord } from "@/services/attendanceService";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { MOCK_STUDENTS } from "@/data/mockStudents";

interface AttendanceHistoryProps {
    studentId: string;
    rollNumber: string;
}

export const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({ studentId, rollNumber }) => {
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        const fetchAttendance = async () => {
            setLoading(true);
            try {
                // Find matching student to get their numeric ID
                const student = MOCK_STUDENTS.find(s => 
                    s.rollNumber.toLowerCase() === studentId.toLowerCase() || 
                    s.id.toLowerCase() === studentId.toLowerCase() ||
                    s.rollNumber.toLowerCase() === rollNumber.toLowerCase()
                );
                
                const numericId = student ? parseInt(student.id.replace('stud-', '')) : 
                                  (parseInt(studentId.replace('stud-', '')) || 0);

                const data = await attendanceService.getAttendance({ 
                    student_id: numericId
                });
                setAttendance(data);
            } catch (error) {
                console.error("Failed to fetch student attendance:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, [studentId, rollNumber]);

    const periods = [1, 2, 3, 4, 5, 6];

    // Helper to get status for a specific day and period
    const getStatus = (date: Date, period: number) => {
        const record = attendance.find(r => 
            isSameDay(new Date(r.attendance_date), date) && 
            r.period === period
        );
        return record?.status;
    };

    // Current week range
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
        <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-primary/5 pb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <Clock className="w-6 h-6 text-primary" />
                            Attendance Verification
                        </CardTitle>
                        <CardDescription>Track your presence across all hourly sessions</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 bg-background p-1 rounded-lg border shadow-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground ml-2" />
                        <span className="text-sm font-semibold pr-2">Week of {format(weekStart, 'MMM d')}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead className="w-[150px] font-bold">Day / Date</TableHead>
                                {periods.map(p => (
                                    <TableHead key={p} className="text-center font-bold">Hour {p}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {days.map((day) => (
                                <TableRow key={day.toISOString()} className={isSameDay(day, new Date()) ? "bg-primary/5" : ""}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span className="font-bold">{format(day, 'EEEE')}</span>
                                            <span className="text-xs text-muted-foreground">{format(day, 'MMM d, yyyy')}</span>
                                        </div>
                                    </TableCell>
                                    {periods.map(p => {
                                        const status = getStatus(day, p);
                                        return (
                                            <TableCell key={p} className="text-center py-4">
                                                {status === 'Present' ? (
                                                    <div className="flex flex-col items-center gap-1">
                                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                        <span className="text-[10px] font-bold text-green-600 uppercase">P</span>
                                                    </div>
                                                ) : status === 'Absent' ? (
                                                    <div className="flex flex-col items-center gap-1">
                                                        <XCircle className="w-5 h-5 text-red-500" />
                                                        <span className="text-[10px] font-bold text-red-600 uppercase">A</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-1 opacity-20">
                                                        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">-</span>
                                                    </div>
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                
                <div className="p-4 bg-muted/20 border-t flex flex-wrap gap-6 items-center">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-xs font-semibold">Present</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-xs font-semibold">Absent</span>
                    </div>
                    <div className="flex items-center gap-2 border-l pl-4 border-border/50">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Empty slots indicate attendance not yet marked</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
