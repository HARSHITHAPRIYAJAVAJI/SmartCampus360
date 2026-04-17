import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, XCircle, Clock, Calendar, ArrowRight } from "lucide-react";
import { attendanceService, AttendanceRecord } from "@/services/attendanceService";
import { format, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { MOCK_STUDENTS } from "@/data/mockStudents";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface AttendanceHistoryProps {
    studentId: string;
    rollNumber: string;
}

export const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({ studentId, rollNumber }) => {
    const navigate = useNavigate();
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = (isBackground = false) => {
            if (!isBackground) setLoading(true);
            const saved = localStorage.getItem('smartcampus_student_directory');
            const allStudents = saved ? JSON.parse(saved) : MOCK_STUDENTS;
            
            const student = allStudents.find((s: any) => 
                s.rollNumber.toLowerCase() === studentId.toLowerCase() || 
                s.id.toLowerCase() === studentId.toLowerCase() ||
                s.rollNumber.toLowerCase() === rollNumber.toLowerCase()
            );
            const numericId = student ? (parseInt(student.id?.replace(/\D/g, '') || '0') || 0) : (parseInt(studentId.replace(/\D/g, '')) || 0);

            attendanceService.getAttendance({ student_id: numericId }).then(data => {
                setAttendance(data);
            }).finally(() => setLoading(false));
        };

        fetchAttendance();
        
        // Listen for real-time broadcasts
        const unsubscribe = attendanceService.onUpdate(() => fetchAttendance(true));
        
        // Cross-tab sync: Trigger refresh when directory changes
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'smartcampus_student_directory' || e.key === 'smartcampus_attendance_cache') {
                fetchAttendance(true);
            }
        };
        window.addEventListener('storage', handleStorage);
        
        const pollInterval = setInterval(() => fetchAttendance(true), 15000);
        return () => {
            unsubscribe();
            window.removeEventListener('storage', handleStorage);
            clearInterval(pollInterval);
        };
    }, [studentId, rollNumber]);

    const periods = [1, 2, 3, 4, 5, 6];
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const getStatus = (date: Date, period: number) => {
        const targetDateStr = format(date, 'yyyy-MM-dd');
        const record = attendance.find(r => {
            const rDate = typeof r.attendance_date === 'string' ? r.attendance_date : format(new Date(r.attendance_date), 'yyyy-MM-dd');
            return rDate === targetDateStr && r.period === period;
        });
        return record?.status;
    };

    return (
        <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-slate-900">
            <CardHeader className="bg-primary/5 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg font-bold">Attendance Verification</CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/attendance')} className="text-primary hover:text-primary hover:bg-primary/10 font-bold group">
                        Full Log <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30">
                                <TableHead className="w-[120px] py-3 text-xs font-black uppercase tracking-widest">Day</TableHead>
                                {periods.map(p => (
                                    <TableHead key={p} className="text-center py-3 text-[10px] font-black">H{p}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {days.map((day) => (
                                <TableRow key={day.toISOString()} className={isSameDay(day, new Date()) ? "bg-primary/5" : ""}>
                                    <TableCell className="py-2">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black">{format(day, 'EEE')}</span>
                                            <span className="text-[9px] text-muted-foreground">{format(day, 'MMM d')}</span>
                                        </div>
                                    </TableCell>
                                    {periods.map(p => {
                                        const status = getStatus(day, p);
                                        return (
                                            <TableCell key={p} className="text-center py-2 px-1">
                                                {status === 'Present' ? (
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" strokeWidth={3} />
                                                ) : status === 'Absent' ? (
                                                    <XCircle className="w-4 h-4 text-rose-500 mx-auto" strokeWidth={3} />
                                                ) : (
                                                    <div className="w-2 h-2 rounded-full bg-slate-200 mx-auto" />
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};
