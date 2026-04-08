import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Calendar, Clock, MapPin, Search, Plus, Filter, ArrowLeft, CheckCircle2, 
    AlertCircle, Users, Download, ShieldCheck, Printer, RefreshCw, UserCheck,
    Layers, School, Check, ChevronRight, Trash2, Brain, FileSpreadsheet, ListTodo
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

import { INITIAL_EXAMS, Exam, SeatingAssignment, InvigilationDuty, saveExams } from "../../data/examData";
import { allocateAdvancedExamSeating } from "../../utils/examAllocator";
import { MOCK_COURSES } from "../../data/mockCourses";
import { generateExamTimetable, ExamTimetable, EXAM_BRANCHES } from "../../utils/examTimetableGenerator";

export default function ExamManagement() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("schedule");
    const [userRole] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved).role : "admin";
    });
    
    const [selectedYears, setSelectedYears] = useState<number[]>([]);
    const [examType, setExamType] = useState<"Mid-1" | "Mid-2" | "Semester">("Mid-1");
    const [semester, setSemester] = useState("1");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("10:00");
    const [endTime, setEndTime] = useState("13:00");

    const [timetables, setTimetables] = useState<ExamTimetable[]>(() => {
        const saved = localStorage.getItem('EXAM_TIMETABLES');
        return saved ? JSON.parse(saved) : [];
    });
    
    const [isTimetableOpen, setIsTimetableOpen] = useState(false);
    const [autoCreateRosters, setAutoCreateRosters] = useState(true);

    const [exams, setExams] = useState<Exam[]>(() => {
        const saved = localStorage.getItem('EXAM_SCHEDULE');
        return saved ? JSON.parse(saved) : INITIAL_EXAMS;
    });
    
    const [seatingPlans, setSeatingPlans] = useState<SeatingAssignment[]>(() => {
        const saved = localStorage.getItem('EXAM_SEATING_PLAN');
        return saved ? JSON.parse(saved) : [];
    });
    
    const [invigilationList, setInvigilationList] = useState<InvigilationDuty[]>(() => {
        const saved = localStorage.getItem('INVIGILATION_LIST');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        // Migration: Remove legacy exams that don't have the 'years' property
        const validExams = exams.filter(e => e.years && Array.isArray(e.years));
        
        if (validExams.length !== exams.length) {
            setExams(validExams);
            return;
        }

        localStorage.setItem('EXAM_SCHEDULE', JSON.stringify(exams));
        localStorage.setItem('EXAM_SEATING_PLAN', JSON.stringify(seatingPlans));
        localStorage.setItem('INVIGILATION_LIST', JSON.stringify(invigilationList));
        localStorage.setItem('EXAM_TIMETABLES', JSON.stringify(timetables));
    }, [exams, seatingPlans, invigilationList, timetables]);

    const filteredExams = exams.filter(exam => 
        exam.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (exam.courseCodes && exam.courseCodes.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())))
    );

    const handleAddExam = () => {
        if (selectedYears.length === 0 || !date) {
            toast({ title: "Error", description: "Select year(s) and date.", variant: "destructive" });
            return;
        }
        const newExam: Exam = {
            id: `ex-${Date.now()}`,
            type: examType,
            years: selectedYears,
            courseCodes: [`SEM-${semester}-GENERAL`],
            date: date,
            startTime: startTime,
            endTime: endTime,
            status: "Pending"
        };
        setExams([...exams, newExam]);
        setIsAddOpen(false);
        setSelectedYears([]);
        setDate("");
        toast({ title: "Schedule Created" });
    };

    const handleGenerateAllocation = (examId: string) => {
        const exam = exams.find(e => e.id === examId);
        if (!exam) return;
        const { seating, invigilators } = allocateAdvancedExamSeating(exam);
        setSeatingPlans(prev => [...prev.filter(s => s.examId !== examId), ...seating]);
        setInvigilationList(prev => [...prev.filter(i => i.examId !== examId), ...invigilators]);
        setExams(prev => prev.map(e => e.id === examId ? { ...e, status: "Allocated" } : e));
        toast({ title: "Seating Generated" });
    };

    const handleReset = (examId: string) => {
        setSeatingPlans(prev => prev.filter(s => s.examId !== examId));
        setInvigilationList(prev => prev.filter(i => i.examId !== examId));
        setExams(prev => prev.map(e => e.id === examId ? { ...e, status: "Pending" } : e));
    };

    const handleDeleteRoster = (examId: string) => {
        setExams(prev => prev.filter(e => e.id !== examId));
        setSeatingPlans(prev => prev.filter(s => s.examId !== examId));
        setInvigilationList(prev => prev.filter(i => i.examId !== examId));
        toast({ title: "Roster Deleted", variant: "destructive" });
    };

    const handleGlobalReset = () => {
        if (window.confirm("⚠️ DANGER: This will PERMANENTLY DELETE all exam schedules, seating plans, invigilation duties, and timetables. This cannot be undone. Proceed?")) {
            localStorage.removeItem('EXAM_SCHEDULE');
            localStorage.removeItem('EXAM_SEATING_PLAN');
            localStorage.removeItem('INVIGILATION_LIST');
            localStorage.removeItem('EXAM_TIMETABLES');
            
            setExams([]);
            setSeatingPlans([]);
            setInvigilationList([]);
            setTimetables([]);
            
            toast({ 
                title: "Exam Database Cleared", 
                description: "All examination data has been wiped from local storage.",
                variant: "destructive" 
            });
        }
    };

    const handleCreateTimetable = () => {
        if (selectedYears.length === 0 || !date) {
            toast({ title: "Error", description: "Select year(s), date and semester.", variant: "destructive" });
            return;
        }
        const tt = generateExamTimetable(selectedYears, parseInt(semester), date, examType);
        setTimetables([...timetables, tt]);
        
        if (autoCreateRosters) {
            const newExams: Exam[] = tt.slots.map((slot, idx) => ({
                id: `EXT-${tt.id}-${idx}`,
                type: tt.type,
                years: tt.years,
                courseCodes: [...new Set(slot.subjects.map(s => s.courseCode))],
                date: slot.date,
                startTime: slot.startTime,
                endTime: slot.endTime,
                status: "Pending"
            }));
            setExams([...exams, ...newExams]);
            setActiveTab("schedule"); // Keep on schedule but show rosters
        }

        setIsTimetableOpen(false);
        setSelectedYears([]);
        setDate("");
        toast({ 
            title: "Timetable & Rosters Generated", 
            description: `Academic schedule created and ${tt.slots.length} execution rosters initialized.` 
        });
    };

    const handleDeleteTimetable = (id: string) => {
        setTimetables(prev => prev.filter(t => t.id !== id));
        toast({ title: "Timetable Deleted", variant: "destructive" });
    };

    const handlePublishTimetable = (id: string) => {
        setTimetables(prev => prev.map(t => 
            t.id === id ? { ...t, isPublished: !t.isPublished } : t
        ));
        const tt = timetables.find(t => t.id === id);
        toast({ 
            title: !tt?.isPublished ? "Published to Portal" : "Removed from Portal", 
            description: !tt?.isPublished ? "Students and faculty can now view this schedule." : "Schedule is now hidden."
        });
    };

    return (
        <div className="space-y-5 animate-in fade-in-50 duration-500 w-full p-4 lg:p-0">
            {/* Header section - Reduced padding and font size */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card/60 backdrop-blur-sm p-5 rounded-2xl border border-border/50 shadow-sm transition-all">
                <div className="space-y-1">
                    <h1 className="text-xl lg:text-2xl font-black text-foreground flex items-center gap-2">
                        <Layers className="h-6 w-6 text-primary" />
                        Exam Management
                    </h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[9px] opacity-70">
                        Institutional Seating & Duty Roster Engine
                    </p>
                </div>
                
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" size="sm" onClick={handleGlobalReset} className="text-destructive border-destructive/30 hover:bg-destructive/10 rounded-lg font-bold">
                        <RefreshCw className="mr-2 h-4 w-4" /> Reset Database
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-lg font-bold" onClick={() => navigate('/dashboard/admin')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    
                    <Dialog open={isTimetableOpen} onOpenChange={setIsTimetableOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="rounded-xl font-black h-10 px-6 transition-all hover:bg-muted/50 border-primary/20 text-primary">
                                <FileSpreadsheet className="mr-2 h-4 w-4" /> Generate Timetable
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-[2.5rem] border-border/40 shadow-2xl backdrop-blur-3xl bg-background/95">
                            <div className="bg-emerald-600 p-10 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12">
                                    <ListTodo className="h-32 w-32" />
                                </div>
                                <div className="relative z-10 space-y-2">
                                    <Badge className="bg-white/20 text-white border-none text-[8px] font-black tracking-widest uppercase">Academics Hub</Badge>
                                    <DialogTitle className="text-3xl font-black tracking-tighter">Exam Timetable Engine</DialogTitle>
                                    <p className="text-sm font-bold opacity-80 max-w-[80%]">Generate branch-wise subject schedules for the upcoming session.</p>
                                </div>
                            </div>
                            <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
                                <div className="space-y-4">
                                    <Label className="text-[11px] font-black uppercase text-emerald-600 tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-4 bg-emerald-600 rounded-full" />
                                        Target Year Cohorts
                                    </Label>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                        {[1, 2, 3, 4].map((year) => {
                                            const isSelected = selectedYears.includes(year);
                                            return (
                                                <div 
                                                    key={year} 
                                                    onClick={() => setSelectedYears(isSelected ? selectedYears.filter(y => y !== year) : [...selectedYears, year])}
                                                    className={`cursor-pointer group relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${isSelected ? 'border-emerald-600 bg-emerald-50 shadow-inner' : 'border-border/50 hover:border-emerald-600/30 hover:bg-muted/50'}`}
                                                >
                                                    <span className={`text-2xl font-black mb-1 transition-colors ${isSelected ? 'text-emerald-600' : 'text-muted-foreground'}`}>{year}</span>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? 'text-emerald-600' : 'text-muted-foreground'}`}>{year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year</span>
                                                    {isSelected && <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-black uppercase text-muted-foreground tracking-widest">Type</Label>
                                        <Select value={examType} onValueChange={(v: any) => setExamType(v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Mid-1">Mid Term 1</SelectItem>
                                                <SelectItem value="Mid-2">Mid Term 2</SelectItem>
                                                <SelectItem value="Semester">Semester Exam</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-black uppercase text-muted-foreground tracking-widest">Semester</Label>
                                        <Select value={semester} onValueChange={setSemester}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {Array.from({ length: 8 }, (_, i) => (
                                                    <SelectItem key={i+1} value={(i+1).toString()}>Sem {i+1}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-black uppercase text-muted-foreground tracking-widest">Start Date</Label>
                                        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 bg-emerald-600/5 p-4 rounded-2xl border border-emerald-600/10">
                                    <Checkbox 
                                        id="autoRoster" 
                                        checked={autoCreateRosters} 
                                        onCheckedChange={(v) => setAutoCreateRosters(!!v)}
                                        className="border-emerald-600 data-[state=checked]:bg-emerald-600"
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label htmlFor="autoRoster" className="text-sm font-black text-emerald-600 cursor-pointer">Auto-Initialize Execution Rosters</Label>
                                        <p className="text-[10px] font-bold text-muted-foreground opacity-70 italic">Create seating groups and invigilation slots for all generated dates automatically.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 bg-muted/30 border-t border-border/30 flex justify-end gap-3">
                                <Button variant="ghost" className="rounded-xl font-bold px-8 h-12" onClick={() => setIsTimetableOpen(false)}>Cancel</Button>
                                <Button className="rounded-xl font-black px-12 h-12 bg-emerald-600 text-white" onClick={handleCreateTimetable}>Generate Official Sheet</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="rounded-xl font-black shadow-lg shadow-primary/20 flex-1 md:flex-none h-10 px-6 transition-all hover:scale-105 active:scale-95 bg-primary group overflow-hidden relative">
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <Plus className="mr-2 h-4 w-4 relative z-10" /> 
                                <span className="relative z-10">New Institutional Roster</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-[2.5rem] border-border/40 shadow-2xl backdrop-blur-3xl bg-background/95">
                            <div className="bg-primary p-10 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12">
                                    <Brain className="h-32 w-32" />
                                </div>
                                <div className="relative z-10 space-y-2">
                                    <Badge className="bg-white/20 text-white border-none text-[8px] font-black tracking-widest uppercase">Institutional Hub</Badge>
                                    <DialogTitle className="text-3xl font-black tracking-tighter">Command Scheduler</DialogTitle>
                                    <p className="text-sm font-bold opacity-80 max-w-[80%]">Configure your next examination cycle with institutional-grade precision.</p>
                                </div>
                            </div>
                            <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="space-y-4">
                                    <Label className="text-[11px] font-black uppercase text-primary tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-4 bg-primary rounded-full" />
                                        Target Year Cohorts
                                    </Label>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                        {[1, 2, 3, 4].map((year) => {
                                            const isSelected = selectedYears.includes(year);
                                            return (
                                                <div 
                                                    key={year} 
                                                    onClick={() => setSelectedYears(isSelected ? selectedYears.filter(y => y !== year) : [...selectedYears, year])}
                                                    className={`cursor-pointer group relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${isSelected ? 'border-primary bg-primary/5 shadow-inner' : 'border-border/50 hover:border-primary/30 hover:bg-muted/50'}`}
                                                >
                                                    <span className={`text-2xl font-black mb-1 transition-colors ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>{year}</span>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>{year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year</span>
                                                    {isSelected && <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label className="text-[11px] font-black uppercase text-muted-foreground tracking-widest">Exam Category</Label>
                                            <Select value={examType} onValueChange={(v: any) => setExamType(v)}>
                                                <SelectTrigger className="h-12 rounded-xl border-border/50 font-bold bg-muted/20">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-border/50">
                                                    <SelectItem value="Mid-1" className="font-bold">Mid Term 1</SelectItem>
                                                    <SelectItem value="Mid-2" className="font-bold">Mid Term 2</SelectItem>
                                                    <SelectItem value="Semester" className="font-bold">Semester Exams</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[11px] font-black uppercase text-muted-foreground tracking-widest">Current Semester</Label>
                                            <Select value={semester} onValueChange={setSemester}>
                                                <SelectTrigger className="h-12 rounded-xl border-border/50 font-bold bg-muted/20">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-border/50">
                                                    {Array.from({ length: 8 }, (_, i) => (
                                                        <SelectItem key={i + 1} value={(i + 1).toString()} className="font-bold">Semester {i + 1}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label className="text-[11px] font-black uppercase text-muted-foreground tracking-widest">Execution Date</Label>
                                            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-12 rounded-xl border-border/50 font-bold bg-muted/20" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-[11px] font-black uppercase text-muted-foreground tracking-widest">Commencement</Label>
                                                <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="h-12 rounded-xl border-border/50 font-bold bg-muted/20" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[11px] font-black uppercase text-muted-foreground tracking-widest">Conclusion</Label>
                                                <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="h-12 rounded-xl border-border/50 font-bold bg-muted/20" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 bg-muted/30 border-t border-border/30 flex justify-end gap-3">
                                <Button variant="ghost" className="rounded-xl font-bold px-8 h-12" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                                <Button className="rounded-xl font-black px-12 h-12 bg-primary shadow-xl shadow-primary/30" onClick={handleAddExam}>Deploy Schedule</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-muted/30 p-1 rounded-xl h-11 mb-5">
                    <TabsTrigger value="schedule" className="px-6 rounded-lg text-xs font-bold transition-all gap-2">
                        <Calendar className="h-3.5 w-3.5" /> Roster
                    </TabsTrigger>
                    <TabsTrigger value="seating" className="px-6 rounded-lg text-xs font-bold transition-all gap-2">
                        <Users className="h-3.5 w-3.5" /> Seating
                    </TabsTrigger>
                    <TabsTrigger value="timetables" className="px-6 rounded-lg text-xs font-bold transition-all gap-2">
                        <FileSpreadsheet className="h-3.5 w-3.5" /> Exam Timetables
                    </TabsTrigger>
                    <TabsTrigger value="invigilation" className="px-6 rounded-lg text-xs font-bold transition-all gap-2">
                        <UserCheck className="h-3.5 w-3.5" /> Duties
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="schedule" className="space-y-4">
                    <Card className="border-border/40 shadow-sm rounded-2xl overflow-hidden">
                        <CardHeader className="bg-muted/10 border-b p-5">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <CardTitle className="text-lg font-bold">Active Rosters</CardTitle>
                                    <CardDescription className="text-xs">Manage examinee groups</CardDescription>
                                </div>
                                <div className="relative w-full md:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Filter rosters..." className="pl-9 h-9 text-xs rounded-lg" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                </div>
                            </div>
                        </CardHeader>
                        <div className="divide-y divide-border/30">
                            {filteredExams.map((exam) => (
                                <div key={exam.id} className="p-5 hover:bg-muted/5 transition-all">
                                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className={`p-3 rounded-xl ${exam.status === 'Allocated' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-primary/10 text-primary'}`}>
                                                <Calendar className="h-5 w-5" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-base font-bold">
                                                        {exam.years?.map(y => `${y}${y === 1 ? 'st' : y === 2 ? 'nd' : 'th'}`).join('+') || "Legacy"} Yr Exams
                                                    </h3>
                                                    <Badge variant="outline" className="text-[8px] h-4 uppercase">{exam.type}</Badge>
                                                </div>
                                                <div className="flex gap-4 text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-loose">
                                                    <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {exam.date}</span>
                                                    <span className="flex items-center gap-1.5"><School className="h-3 w-3" /> All Branches</span>
                                                    <span className={`flex items-center gap-1.5 ${exam.status === 'Allocated' ? 'text-emerald-600' : 'text-amber-500'}`}>
                                                        <div className={`h-1.5 w-1.5 rounded-full ${exam.status === 'Allocated' ? 'bg-emerald-500' : 'bg-amber-500'}`} /> {exam.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-full lg:w-auto">
                                            {exam.status === 'Pending' ? (
                                                <Button size="sm" className="font-bold flex-1" onClick={() => handleGenerateAllocation(exam.id)}>Generate Seats</Button>
                                            ) : (
                                                <>
                                                    <Button variant="outline" size="sm" className="px-3" onClick={() => handleReset(exam.id)}><RefreshCw className="h-3.5 w-3.5" /></Button>
                                                    <Button size="sm" variant="secondary" className="font-bold border border-border/10 px-6" onClick={() => setActiveTab('seating')}>View Tables</Button>
                                                </>
                                            )}
                                            <Button variant="outline" size="sm" className="px-3 text-destructive hover:bg-destructive/10 border-destructive/20" onClick={() => handleDeleteRoster(exam.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="timetables" className="space-y-8">
                    {timetables.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-20 bg-muted/20 border-2 border-dashed rounded-[3rem] opacity-50 space-y-4">
                            <FileSpreadsheet className="h-16 w-16 text-primary/40" />
                            <p className="font-black text-center text-sm">No official exam timetables generated yet.<br/><span className="text-xs font-bold opacity-60">Deploy the Timetable Engine to generate realistic schedules.</span></p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {timetables.map((tt) => (
                                <Card key={tt.id} className="border-border/40 shadow-2xl rounded-[2.5rem] overflow-hidden bg-card/60 backdrop-blur-md transition-all">
                                    <div className="p-8 border-b border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-transparent flex flex-wrap justify-between items-center gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-widest">{tt.type}</Badge>
                                                <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-primary/20">Sem {tt.semester}</Badge>
                                                <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest">Yrs: {tt.years.join(",")}</Badge>
                                                {tt.isPublished && (
                                                    <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[8px] font-black uppercase tracking-widest animate-pulse">
                                                        <CheckCircle2 className="h-2 w-2 mr-1" /> Published
                                                    </Badge>
                                                )}
                                            </div>
                                            <h3 className="text-2xl font-black tracking-tighter text-foreground">{tt.title}</h3>
                                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-70">
                                                Official Manifest | {tt.startDate.split('-').reverse().join('-')} to {tt.endDate.split('-').reverse().join('-')}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button 
                                                variant={tt.isPublished ? "secondary" : "default"} 
                                                size="sm" 
                                                className={`rounded-xl font-black h-10 px-6 transition-all ${tt.isPublished ? 'bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'}`}
                                                onClick={() => handlePublishTimetable(tt.id)}
                                            >
                                                {tt.isPublished ? <><Clock className="h-4 w-4 mr-2" /> Unpublish</> : <><CheckCircle2 className="h-4 w-4 mr-2" /> Publish to Portal</>}
                                            </Button>
                                            <Button variant="outline" size="sm" className="rounded-xl font-black h-10 px-6 bg-white dark:bg-zinc-900 border-border/50 hover:bg-primary/5 transition-all">
                                                <Printer className="h-4 w-4 mr-2 text-primary" /> Print PDF
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-destructive hover:bg-destructive/10" onClick={() => handleDeleteTimetable(tt.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto p-4 lg:p-8">
                                        <table className="w-full border-collapse rounded-3xl overflow-hidden shadow-2xl border border-border/20">
                                            <thead>
                                                <tr className="bg-muted/40 backdrop-blur-sm border-b border-border/50">
                                                    <th className="p-5 text-left text-[13px] font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap bg-muted/20 sticky left-0 z-20">Academic Branch</th>
                                                    {tt.slots.map((slot, sIdx) => (
                                                        <th key={sIdx} className="p-5 text-left border-l border-border/30 min-w-[220px]">
                                                            <div className="flex flex-col gap-1.5">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="font-black text-[15px] text-foreground">
                                                                        {slot.date.split('-').reverse().join('-')}
                                                                    </span>
                                                                    <Badge className={`${slot.session === 'FN' ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' : 'bg-orange-500/10 text-orange-600 border-orange-500/20'} text-[9px] font-black tracking-widest h-5`}>
                                                                        {slot.session}
                                                                    </Badge>
                                                                </div>
                                                                <span className="text-[11px] font-black text-primary/70 uppercase tracking-widest">{slot.day}</span>
                                                            </div>
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border/20 bg-card/40">
                                                {EXAM_BRANCHES.map((branch) => (
                                                    <tr key={branch} className="hover:bg-primary/[0.02] transition-colors group">
                                                        <td className="p-5 whitespace-nowrap bg-muted/30 sticky left-0 z-10 backdrop-blur-md border-r border-border/20">
                                                            <span className="font-black text-sm uppercase tracking-[0.1em] text-foreground/80">{branch}</span>
                                                        </td>
                                                        {tt.slots.map((slot, sIdx) => {
                                                            const subjectsInSlot = slot.subjects.filter(s => s.branch === branch);
                                                            return (
                                                                <td key={sIdx} className="p-5 border-l border-border/20 align-top">
                                                                    {subjectsInSlot.length > 0 ? (
                                                                        <div className="space-y-3">
                                                                            {subjectsInSlot.map((sub, subIdx) => (
                                                                                <div key={subIdx} className="relative p-5 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border border-border/40 shadow-sm group-hover:border-primary/30 transition-all hover:scale-[1.02] active:scale-95 duration-200">
                                                                                    <div className="flex justify-between items-start mb-2">
                                                                                        <div className="h-4 w-4 rounded-full bg-primary/5 flex items-center justify-center">
                                                                                            <ShieldCheck className="h-3 w-3 text-primary opacity-30" />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="font-black text-[14px] text-foreground leading-tight mb-2 line-clamp-2">{sub.courseName}</div>
                                                                                    <div className="font-mono text-[12px] font-black text-muted-foreground bg-muted/60 w-fit px-2 py-0.5 rounded-md uppercase tracking-tighter">
                                                                                        {sub.courseCode}
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="p-6 border border-dashed border-border/10 rounded-2xl flex flex-col items-center justify-center opacity-20">
                                                                            <Clock className="h-4 w-4 mb-2" />
                                                                            <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">No Exam</span>
                                                                        </div>
                                                                    )}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="seating">
                    <Card className="border-border/40 shadow-sm rounded-2xl overflow-hidden">
                        <CardHeader className="flex flex-row justify-between items-center p-5 border-b">
                            <CardTitle className="text-lg font-bold">Seating Map</CardTitle>
                            <Button size="sm" variant="outline" className="h-8 font-bold text-xs" onClick={() => toast({ title: "Exporting..." })}>
                                <Download className="h-3.5 w-3.5 mr-2" /> Export
                            </Button>
                        </CardHeader>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead className="bg-muted/10 font-black text-muted-foreground border-b uppercase tracking-widest text-[10px]">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Hall</th>
                                        <th className="px-6 py-4 text-left">Roll Number</th>
                                        {userRole === 'faculty' && <th className="px-6 py-4 text-left">Student Information</th>}
                                        <th className="px-6 py-4 text-center">Seat / Bench</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/20 bg-card/40">
                                    {seatingPlans.map((plan, idx) => (
                                        <tr key={idx} className="hover:bg-primary/[0.02] transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-foreground">{plan.room}</span>
                                                    <span className="text-[10px] text-muted-foreground opacity-60 font-black uppercase tracking-tighter">{plan.block}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-primary font-black uppercase tracking-tighter text-sm">{plan.rollNumber}</td>
                                            {userRole === 'faculty' && (
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-foreground">{plan.studentName}</span>
                                                        <span className="text-[10px] font-black uppercase text-muted-foreground/70">{plan.branch}</span>
                                                    </div>
                                                </td>
                                            )}
                                            <td className="px-6 py-4 text-center">
                                                <div className="bg-primary/10 text-primary border border-primary/20 h-9 w-10 mx-auto flex items-center justify-center rounded-xl font-black text-sm shadow-sm">{plan.seatNumber}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="invigilation">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {Array.from(new Set(invigilationList.map(i => i.room))).map((roomName) => {
                            const roomDuties = invigilationList.filter(i => i.room === roomName);
                            const firstDuty = roomDuties[0];
                            return (
                                <Card key={roomName} className="border-border/60 shadow-md rounded-[1.5rem] overflow-hidden bg-white hover:border-primary/40 transition-all duration-300">
                                    <CardHeader className="p-6 border-b border-border/40 bg-muted/20">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="space-y-1">
                                                <h4 className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">Institutional Hall</h4>
                                                <div className="text-2xl font-black tracking-tighter text-foreground">{roomName}</div>
                                            </div>
                                            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                                                <MapPin className="h-5 w-5 text-primary" />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground bg-white/50 w-fit px-3 py-1 rounded-full border border-border/20">
                                            <Clock className="h-3 w-3" />
                                            {firstDuty.date.split('-').reverse().join('-')} | {firstDuty.time}
                                        </div>
                                    </CardHeader>
                                    <div className="p-6 space-y-4">
                                        <h5 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Assigned Invigilators</h5>
                                        <div className="space-y-2">
                                            {roomDuties.map((duty, dIdx) => (
                                                <div key={dIdx} className="flex items-center gap-4 p-3 rounded-xl bg-muted/5 border border-border/10 transition-colors hover:bg-muted/10">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-black text-[10px] text-primary">
                                                        P{dIdx + 1}
                                                    </div>
                                                    <div className="text-sm font-bold text-foreground">
                                                        {duty.facultyName}
                                                    </div>
                                                </div>
                                            ))}
                                            {roomDuties.length < 2 && (
                                                <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-600">
                                                    <AlertCircle className="h-4 w-4" />
                                                    <span className="text-[10px] font-bold">Awaiting Second Proctor</span>
                                                </div>
                                            )}
                                        </div>
                                        <Button variant="outline" className="w-full rounded-xl font-black h-11 text-xs border-border/60 hover:bg-primary hover:text-white transition-all mt-2">
                                            <Printer className="h-3.5 w-3.5 mr-2" /> Print Hall Duty List
                                        </Button>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
