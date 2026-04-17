import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, FileText, ChevronLeft, ArrowLeft, Download, Filter } from "lucide-react";
import { attendanceService, AttendanceRecord } from "@/services/attendanceService";
import { format, isSameDay, subDays } from 'date-fns';
import { MOCK_STUDENTS } from "@/data/mockStudents";
import { formatSubjectName } from "@/data/subjectMapping";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const AttendanceDetails = () => {
    const navigate = useNavigate();
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [historyRange, setHistoryRange] = useState(30); // Default to 30 days for full page

    // Get current user from localStorage
    const userRole = localStorage.getItem('smartcampus_role');
    const user = JSON.parse(localStorage.getItem('smartcampus_user') || '{}');
    const studentRollNumber = user.id;

    useEffect(() => {
        const fetchAttendance = (isBackground = false) => {
            if (!isBackground) setLoading(true);
            
            const saved = localStorage.getItem('smartcampus_student_directory');
            const allStudents = saved ? JSON.parse(saved) : MOCK_STUDENTS;
            
            const student = allStudents.find((s: any) => 
                s.rollNumber.toLowerCase() === studentRollNumber.toLowerCase() ||
                s.id.toLowerCase() === studentRollNumber.toLowerCase()
            );
            
            const numericId = student ? (parseInt(student.id?.replace(/\D/g, '') || '0') || 0) : 0;

            attendanceService.getAttendance({ 
                student_id: numericId
            }).then(data => {
                const sorted = [...data].sort((a, b) => 
                    new Date(b.attendance_date).getTime() - new Date(a.attendance_date).getTime()
                );
                setAttendance(sorted);
            }).catch(error => {
                console.error("Failed to fetch student attendance:", error);
            }).finally(() => {
                setLoading(false);
            });
        };

        fetchAttendance();
        
        // Listen for real-time broadcasts (Same origin, multi-tab)
        const unsubscribe = attendanceService.onUpdate(() => fetchAttendance(true));
        
        // Cross-tab sync fallback
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'smartcampus_student_directory' || e.key === 'smartcampus_attendance_cache') {
                fetchAttendance(true);
            }
        };
        window.addEventListener('storage', handleStorage);

        const pollInterval = setInterval(() => fetchAttendance(true), 10000);
        
        return () => {
            unsubscribe();
            window.removeEventListener('storage', handleStorage);
            clearInterval(pollInterval);
        };
    }, [studentRollNumber]);

    const displayDays = useMemo(() => {
        const days = [];
        const today = new Date();
        for (let i = 0; i < historyRange; i++) {
            days.push(subDays(today, i));
        }
        return days;
    }, [historyRange]);

    const timeSlots = [
        { label: "09.40 am to 10.40 am", period: 1 },
        { label: "10.40 am to 11.40 am", period: 2 },
        { label: "11.40 am to 12.40 pm", period: 3 },
        { label: "01.20 pm to 02.20 pm", period: 4 },
        { label: "02.20 pm to 03.20 pm", period: 5 },
        { label: "03.20 pm to 04.20 pm", period: 6 },
    ];

    const getRecord = (date: Date, period: number) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return attendance.find(r => {
            const rDate = typeof r.attendance_date === 'string' ? r.attendance_date : format(new Date(r.attendance_date), 'yyyy-MM-dd');
            return rDate === dateStr && r.period === period;
        });
    };

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => navigate('/dashboard')} className="rounded-xl h-12 w-12 border-slate-200">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter">Detailed Attendance Log</h1>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl font-bold h-12 border-slate-200">
                        <Download className="mr-2 h-4 w-4" /> Export PDF
                    </Button>
                    <Button className="rounded-xl font-bold h-12 bg-primary">
                        <Filter className="mr-2 h-4 w-4" /> Date Filter
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-950">
                <CardHeader className="bg-slate-50 dark:bg-slate-900/50 p-8 border-b">
                    <div className="flex justify-between items-center">
                        <div className="space-y-1">
                            <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary" />
                                Daywise Verification
                            </CardTitle>
                            <CardDescription className="font-bold text-xs uppercase tracking-widest text-muted-foreground">
                                Detailed Hourly Statistics
                            </CardDescription>
                        </div>
                        <Badge variant="outline" className="rounded-lg py-1 px-3 bg-white dark:bg-slate-900 font-black italic border-slate-200">
                            Viewing Last {historyRange} Days
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table className="border-collapse">
                            <TableHeader>
                                <TableRow className="bg-slate-50 dark:bg-slate-900">
                                    <TableHead className="border font-black text-center text-slate-900 dark:text-slate-100 uppercase text-[10px] tracking-widest py-6">Date / Day</TableHead>
                                    {timeSlots.map(slot => (
                                        <TableHead key={slot.period} className="border font-black text-center text-slate-900 dark:text-slate-100 uppercase text-[10px] tracking-tighter leading-tight py-4 px-2 min-w-[140px]">
                                            {slot.label}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {displayDays.map((day) => (
                                    <TableRow key={day.toISOString()} className={`hover:bg-slate-50/50 transition-colors ${isSameDay(day, new Date()) ? 'bg-primary/5' : ''}`}>
                                        <TableCell className="border font-bold text-center text-xs py-4 text-slate-600">
                                            <div className="flex flex-col">
                                                <span>{format(day, 'dd-MM-yyyy')}</span>
                                                <span className="text-[10px] font-black uppercase text-muted-foreground opacity-60 mt-0.5">{format(day, 'EEEE')}</span>
                                            </div>
                                        </TableCell>
                                        {timeSlots.map(slot => {
                                            const record = getRecord(day, slot.period);
                                            const isAbsent = record?.status === 'Absent';
                                            const isPresent = record?.status === 'Present';
                                            const subject = record ? formatSubjectName(record.course_code || record.subject_id || "Sub") : "-";
                                            
                                            return (
                                                <TableCell key={slot.period} className="border text-center py-4 px-1">
                                                    {record ? (
                                                        <div className="space-y-1">
                                                            <div className={`text-[11px] font-black uppercase tracking-tighter ${isAbsent ? 'text-rose-600' : 'text-blue-600'}`}>
                                                                {record.status}
                                                            </div>
                                                            <div className="text-[9px] font-bold text-muted-foreground bg-muted/50 py-0.5 rounded px-1 w-fit mx-auto">
                                                                {subject}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-300">-</span>
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    
                    <div className="p-8 flex justify-center border-t border-slate-100 italic font-medium text-slate-400">
                        <Button variant="ghost" className="hover:bg-primary/5 hover:text-primary rounded-xl font-black text-xs uppercase" onClick={() => setHistoryRange(prev => prev + 30)}>
                            Load 30 More Days of Logs
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AttendanceDetails;
