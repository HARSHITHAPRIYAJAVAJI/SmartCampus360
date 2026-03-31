import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Trash2, Edit, Plus, Users, Save, BookOpen, TrendingUp, FileText, CheckCircle, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MOCK_STUDENTS, Student } from "@/data/mockStudents";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, ClipboardCheck, GraduationCap, ArrowLeft, MoreVertical, Book } from "lucide-react";
import { attendanceService } from "@/services/attendanceService";
import { MOCK_COURSES } from "@/data/mockCourses";

const StudentRecords = () => {
    const { toast } = useToast();
    // Calculate dynamic attendance based on (Attended / Total) formula
    const getStudentAttendance = (student: Student) => {
        // We use a base of 240 classes for the semester baseline to keep numbers realistic
        const baselineTotal = 240; 
        const baselineAttended = Math.round((student.attendance / 100) * baselineTotal);
        
        // Add current session's live data
        const history = student.periodAttendance || {};
        const sessionTotal = Object.keys(history).length;
        const sessionAttended = Object.values(history).filter(v => v === true).length;
        
        const total = baselineTotal + sessionTotal;
        const attended = baselineAttended + sessionAttended;
        const percentage = Math.round((attended / total) * 100);
        
        return { attended, total, percentage };
    };

    const [students, setStudents] = useState<Student[]>(() => {
        const saved = localStorage.getItem('smartcampus_student_directory');
        return saved ? JSON.parse(saved) : MOCK_STUDENTS;
    });
    
    // Persist student directory changes
    useEffect(() => {
        localStorage.setItem('smartcampus_student_directory', JSON.stringify(students));
    }, [students]);

    const [searchQuery, setSearchQuery] = useState("");
    
    // Navigation State
    const [view, setView] = useState<'branches' | 'years' | 'sections' | 'courses' | 'students'>('branches');
    const [activeMode, setActiveMode] = useState<'view' | 'attendance' | 'marks'>('view');
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

    // Attendance/Marks Session State
    const [currentPeriod, setCurrentPeriod] = useState("1");
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
    const [sessionAttendance, setSessionAttendance] = useState<Record<string, boolean | undefined>>({});
    const [isSyncing, setIsSyncing] = useState(false);
    const [sessionMarks, setSessionMarks] = useState<Record<string, { assignment1: number, mid1: number, assignment2: number, mid2: number }>>({});

    // Fetch attendance records from backend when filter changes
    useEffect(() => {
        // Only fetch if required conditions are met
        if (selectedCourse && currentDate && currentPeriod && activeMode === 'attendance') {
            const fetchAttendance = async () => {
                try {
                    const data = await attendanceService.getAttendance({
                        course_code: selectedCourse,
                        attendance_date: currentDate
                    });
                    
                    if (!data || !Array.isArray(data)) {
                        console.warn("No attendance array returned from server:", data);
                        setSessionAttendance({});
                        return;
                    }
                    
                    // Filter for specific period and map to session state
                    const periodData = data.filter((r: any) => String(r.period) === String(currentPeriod));
                    const mapped: Record<string, boolean> = {};
                    periodData.forEach((r: any) => {
                        // Map pure numeric backend student_id back to frontend "stud-X" format
                        mapped[`stud-${r.student_id}`] = r.status === "Present";
                    });
                    setSessionAttendance(mapped);
                } catch (error) {
                    console.error("Failed to fetch attendance:", error);
                }
            };
            fetchAttendance();
        } else if (activeMode !== 'attendance') {
            // Clear session attendance when not in attendance mode to avoid leakage
            setSessionAttendance({});
        }
    }, [selectedCourse, currentDate, currentPeriod, activeMode]);


    // Dialogs State
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    
    // Edit flow
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [editAttendance, setEditAttendance] = useState("");
    const [editGrade, setEditGrade] = useState("");

    // Add flow
    const [newStudent, setNewStudent] = useState<Partial<Student>>({
        branch: "CSE",
        year: 1,
        section: "A",
        attendance: 100,
        grade: 10
    });

    const filteredStudents = useMemo(() => {
        return students.filter(s => {
            const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
            const matchBranch = !selectedBranch || s.branch === selectedBranch;
            const matchYear = !selectedYear || s.year === selectedYear;
            const matchSection = !selectedSection || s.section === selectedSection;
            return matchSearch && matchBranch && matchYear && matchSection;
        });
    }, [students, searchQuery, selectedBranch, selectedYear, selectedSection]);

    const branches = ["CSE", "CSM", "IT", "ECE", "MECH", "CIVIL"];
    const years = [1, 2, 3, 4];
    const sections = ["A", "B", "C", "D"];

    const handleBranchSelect = (branch: string) => {
        setSelectedBranch(branch);
        setView('years');
    };

    const handleYearSelect = (year: number) => {
        setSelectedYear(year);
        setView('sections');
    };

    const handleSectionSelect = (section: string) => {
        setSelectedSection(section);
        setView('courses');
    };

    const handleCourseSelect = (courseCode: string) => {
        setSelectedCourse(courseCode);
        setView('students');
    };

    const resetNavigation = () => {
        setSelectedBranch(null);
        setSelectedYear(null);
        setSelectedSection(null);
        setSelectedCourse(null);
        setView('branches');
    };

    const goBack = () => {
        if (view === 'students') {
            setSelectedCourse(null);
            setView('courses');
        } else if (view === 'courses') {
            setSelectedSection(null);
            setView('sections');
        } else if (view === 'sections') {
            setSelectedYear(null);
            setView('years');
        } else if (view === 'years') {
            setSelectedBranch(null);
            setView('branches');
        }
    };

    const handleDelete = (id: string) => {
        setStudents(prev => prev.filter(s => s.id !== id));
        toast({ title: "Student Deleted", description: "Record has been removed successfully.", variant: "destructive" });
    };

    const handleOpenEdit = (student: Student) => {
        setEditingStudent(student);
        setEditAttendance(student.attendance.toString());
        setEditGrade(student.grade.toString());
        setIsEditOpen(true);
    };

    const handleSaveEdit = () => {
        if (!editingStudent) return;
        setStudents(prev => prev.map(s => {
            if (s.id === editingStudent.id) {
                return {
                    ...s,
                    attendance: parseInt(editAttendance) || 0,
                    grade: parseFloat(editGrade) || 0,
                    assignment1: editingStudent.assignment1,
                    mid1: editingStudent.mid1,
                    assignment2: editingStudent.assignment2,
                    mid2: editingStudent.mid2
                };
            }
            return s;
        }));
        setIsEditOpen(false);
        toast({ title: "Record Updated", description: "Attendance and grade updated." });
    };

    const handleSaveBatchAttendance = async () => {
        // Enforce Indian Time Policy: 9:40 AM to 5:00 PM
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const currentTime = hour * 60 + minute;
        const startTime = 9 * 60 + 40; // 9:40 AM
        const endTime = 17 * 60; // 5:00 PM

        if (currentTime < startTime || currentTime > endTime) {
            toast({ 
                title: "Access Restricted", 
                description: "Attendance can only be marked between 9:40 AM and 5:00 PM (IST).", 
                variant: "destructive" 
            });
            return;
        }

        if (!selectedCourse) {
            toast({ title: "Error", description: "No course selected.", variant: "destructive" });
            return;
        }

        setIsSyncing(true);
        try {
            const records = filteredStudents.map(s => ({
                student_id: parseInt(s.id.replace('stud-', '')) || 0,
                course_code: selectedCourse,
                attendance_date: currentDate,
                period: parseInt(currentPeriod),
                status: (sessionAttendance[s.id] ? "Present" : "Absent") as "Present" | "Absent"
            }));

            await attendanceService.saveBulkAttendance(records);

            // Optimistically update local directory
            const slotKey = `${currentDate}-P${currentPeriod}-${selectedCourse}`;
            setStudents(prev => prev.map(s => {
                if (filteredStudents.some(fs => fs.id === s.id)) {
                    return {
                        ...s,
                        periodAttendance: {
                            ...(s.periodAttendance || {}),
                            [slotKey]: sessionAttendance[s.id] === true
                        }
                    };
                }
                return s;
            }));

            toast({ title: "Attendance Saved", description: `Attendance recorded for ${selectedCourse} on ${currentDate}.` });
            setActiveMode('view');
        } catch (error) {
            console.error("Attendance Backend Error:", error);
            toast({ 
                title: "Backend Sync Failed", 
                description: "Attendance saved locally, but server was unreachable or rejected data format (422).", 
                variant: "destructive" 
            });
            // Still update local state for better UX
            const slotKey = `${currentDate}-P${currentPeriod}-${selectedCourse}`;
            setStudents(prev => prev.map(s => {
                if (filteredStudents.some(fs => fs.id === s.id)) {
                    return {
                        ...s,
                        periodAttendance: {
                            ...(s.periodAttendance || {}),
                            [slotKey]: sessionAttendance[s.id] === true
                        }
                    };
                }
                return s;
            }));
        } finally {
            setIsSyncing(false);
        }
    };

    const handleSaveBatchMarks = () => {
        setStudents(prev => prev.map(s => {
            if (sessionMarks[s.id]) {
                return {
                    ...s,
                    ...sessionMarks[s.id]
                };
            }
            return s;
        }));
        toast({ title: "Marks Updated", description: "Assignment and Midterm marks saved successfully." });
        setActiveMode('view');
    };

    const toggleAttendance = (studentId: string) => {
        setSessionAttendance(prev => ({
            ...prev,
            [studentId]: !prev[studentId]
        }));
    };

    const updateMark = (studentId: string, field: string, value: string) => {
        const numVal = parseInt(value) || 0;
        setSessionMarks(prev => ({
            ...prev,
            [studentId]: {
                ...(prev[studentId] || { assignment1: 0, mid1: 0, assignment2: 0, mid2: 0 }),
                [field]: numVal
            }
        }));
    };

    const handleAddStudent = () => {
        if (!newStudent.name || !newStudent.rollNumber) {
            toast({ title: "Validation Error", description: "Name and Roll Number are required.", variant: "destructive" });
            return;
        }

        const studentToAdd: Student = {
            id: `stud-custom-${Date.now()}`,
            rollNumber: newStudent.rollNumber.toUpperCase(),
            name: newStudent.name,
            email: `${newStudent.rollNumber.toLowerCase()}@smartcampus.edu`,
            branch: newStudent.branch || "CSE",
            year: newStudent.year || 1,
            semester: ((newStudent.year || 1) - 1) * 2 + 1,
            section: newStudent.section || "A",
            phone: "+910000000000",
            attendance: Number(newStudent.attendance) || 100,
            grade: Number(newStudent.grade) || 10
        };

        setStudents([studentToAdd, ...students]);
        setIsAddOpen(false);
        setNewStudent({ branch: "CSE", year: 1, section: "A", attendance: 100, grade: 10 });
        toast({ title: "Student Added", description: `${studentToAdd.name} registered successfully.` });
    };

    const branchInfo: Record<string, { color: string, icon: any, desc: string }> = {
        "CSE": { color: "text-blue-500 bg-blue-50", icon: BookOpen, desc: "Computer Science & Engineering" },
        "CSM": { color: "text-purple-500 bg-purple-50", icon: TrendingUp, desc: "CSE (AI & Machine Learning)" },
        "IT": { color: "text-cyan-500 bg-cyan-50", icon: Users, desc: "Information Technology" },
        "ECE": { color: "text-orange-500 bg-orange-50", icon: FileText, desc: "Electronics & Communication" },
        "MECH": { color: "text-red-500 bg-red-50", icon: CheckCircle, desc: "Mechanical Engineering" },
        "CIVIL": { color: "text-green-500 bg-green-50", icon: Calendar, desc: "Civil Engineering" },
    };

    return (
        <div className="space-y-6 animate-in fade-in-50 duration-500">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Academic Records
                    </h1>
                    <p className="text-muted-foreground text-lg italic">Explore and manage student directories across all departments.</p>
                </div>
                
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90">
                            <Plus className="mr-2 h-4 w-4" /> Add Student
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Register New Student</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input placeholder="John Doe" onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Roll Number</Label>
                                    <Input placeholder="24K91A0501" onChange={e => setNewStudent({...newStudent, rollNumber: e.target.value})} />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Branch</Label>
                                    <Select value={newStudent.branch} onValueChange={v => setNewStudent({...newStudent, branch: v})}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CSE">CSE</SelectItem>
                                            <SelectItem value="CSM">CSM</SelectItem>
                                            <SelectItem value="IT">IT</SelectItem>
                                            <SelectItem value="ECE">ECE</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Year</Label>
                                    <Select value={String(newStudent.year)} onValueChange={v => setNewStudent({...newStudent, year: parseInt(v)})}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1st Year</SelectItem>
                                            <SelectItem value="2">2nd Year</SelectItem>
                                            <SelectItem value="3">3rd Year</SelectItem>
                                            <SelectItem value="4">4th Year</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Section</Label>
                                    <Select value={newStudent.section} onValueChange={v => setNewStudent({...newStudent, section: v})}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="A">Sec A</SelectItem>
                                            <SelectItem value="B">Sec B</SelectItem>
                                            <SelectItem value="C">Sec C</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                            <Button onClick={handleAddStudent}>Register Student</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Breadcrumbs / Navigation */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground animate-in slide-in-from-left-2 duration-300">
                <Button variant="ghost" size="sm" onClick={resetNavigation} className="h-7 px-2 hover:text-primary">
                    Records
                </Button>
                {selectedBranch && (
                    <>
                        <span>/</span>
                        <Button variant="ghost" size="sm" onClick={() => { setView('years'); setSelectedYear(null); setSelectedSection(null); }} className="h-7 px-2 hover:text-primary text-foreground font-medium">
                            {selectedBranch}
                        </Button>
                    </>
                )}
                {selectedYear && (
                    <>
                        <span>/</span>
                        <Button variant="ghost" size="sm" onClick={() => { setView('sections'); setSelectedSection(null); }} className="h-7 px-2 hover:text-primary text-foreground font-medium">
                            {selectedYear}{selectedYear === 1 ? 'st' : selectedYear === 2 ? 'nd' : selectedYear === 3 ? 'rd' : 'th'} Year
                        </Button>
                    </>
                )}
                {selectedSection && (
                    <>
                        <span>/</span>
                        <Button variant="ghost" size="sm" onClick={() => { setView('courses'); setSelectedCourse(null); }} className="h-7 px-2 hover:text-primary text-foreground font-medium">
                            Section {selectedSection}
                        </Button>
                    </>
                )}
                {selectedCourse && (
                    <>
                        <span>/</span>
                        <span className="h-7 px-2 flex items-center text-foreground font-bold italic">{selectedCourse}</span>
                    </>
                )}
                {view !== 'branches' && (
                    <div className="ml-auto flex items-center gap-2">
                         {view === 'students' && (
                             <div className="flex bg-muted rounded-lg p-1 mr-2">
                                <Button 
                                    variant={activeMode === 'view' ? "secondary" : "ghost"} 
                                    size="sm" 
                                    onClick={() => setActiveMode('view')}
                                    className="h-8"
                                >
                                    <Users className="h-4 w-4 mr-2" /> View
                                </Button>
                                <Button 
                                    variant={activeMode === 'attendance' ? "secondary" : "ghost"} 
                                    size="sm" 
                                    onClick={() => {
                                        setActiveMode('attendance');
                                        setSessionAttendance({});
                                    }}
                                    className="h-8"
                                >
                                    <ClipboardCheck className="h-4 w-4 mr-2" /> Attendance
                                </Button>
                                <Button 
                                    variant={activeMode === 'marks' ? "secondary" : "ghost"} 
                                    size="sm" 
                                    onClick={() => {
                                        setActiveMode('marks');
                                        const initial: Record<string, any> = {};
                                        filteredStudents.forEach(s => {
                                            initial[s.id] = {
                                                assignment1: s.assignment1 || 0,
                                                mid1: s.mid1 || 0,
                                                assignment2: s.assignment2 || 0,
                                                mid2: s.mid2 || 0
                                            };
                                        });
                                        setSessionMarks(initial);
                                    }}
                                    className="h-8"
                                >
                                    <GraduationCap className="h-4 w-4 mr-2" /> Marks
                                </Button>
                             </div>
                         )}
                        <Button variant="outline" size="sm" onClick={goBack} className="h-8">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back
                        </Button>
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            <div className="min-h-[400px]">
                {view === 'branches' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
                        {branches.map((branch) => {
                            const info = branchInfo[branch] || { color: "text-gray-500 bg-gray-50", icon: Users, desc: `${branch} Engineering` };
                            return (
                                <Card 
                                    key={branch} 
                                    className="group relative overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-card/50 backdrop-blur-sm hover:-translate-y-1" 
                                    onClick={() => handleBranchSelect(branch)}
                                >
                                    <div className={`absolute top-0 left-0 w-1.5 h-full opacity-70 group-hover:w-2 transition-all ${info.color.split(' ')[0].replace('text-', 'bg-')}`} />
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <div className={`p-4 rounded-xl transition-all duration-300 group-hover:scale-110 ${info.color}`}>
                                            <info.icon className="h-8 w-8" />
                                        </div>
                                        <Badge variant="secondary" className="font-mono text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                            {students.filter(s => s.branch === branch).length} Students
                                        </Badge>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <CardTitle className="text-3xl font-black mb-1 group-hover:text-primary transition-colors">{branch}</CardTitle>
                                        <CardDescription className="text-sm font-medium leading-relaxed italic">{info.desc}</CardDescription>
                                        <div className="mt-6 flex items-center text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                            VIEW DEPARTMENT RECORDS →
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {view === 'years' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in zoom-in-95 duration-300">
                        {years.map((year) => (
                            <Card key={year} className="group hover:border-primary/50 cursor-pointer transition-all hover:shadow-lg" onClick={() => handleYearSelect(year)}>
                                <CardHeader className="text-center pb-2">
                                    <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors mb-2">
                                        <span className="text-2xl font-bold">{year}</span>
                                    </div>
                                    <Badge variant="outline" className="w-fit mx-auto">
                                        {students.filter(s => s.branch === selectedBranch && s.year === year).length} Students
                                    </Badge>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <CardTitle className="text-xl">
                                        {year}{year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">Academic Year 2024-25</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {view === 'sections' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
                        {sections.map((section) => (
                            <Card key={section} className="group hover:border-primary/50 cursor-pointer transition-all hover:shadow-lg" onClick={() => handleSectionSelect(section)}>
                                <CardHeader className="text-center pb-2">
                                    <div className="mx-auto bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors mb-2">
                                        <span className="text-xl font-bold">{section}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <CardTitle>Section {section}</CardTitle>
                                    <Badge className="mt-2" variant="secondary">
                                        {students.filter(s => s.branch === selectedBranch && s.year === selectedYear && s.section === section).length} Students
                                    </Badge>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
                {view === 'courses' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
                        {MOCK_COURSES
                            .filter(c => c.department === selectedBranch && c.semester === (selectedYear! * 2 - 1))
                            .map((course) => (
                            <Card key={course.code} className="group hover:border-primary/50 cursor-pointer transition-all hover:shadow-lg overflow-hidden bg-white" onClick={() => handleCourseSelect(course.code)}>
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Book className="w-20 h-20" />
                                </div>
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="secondary" className="font-mono text-[10px]">{course.code}</Badge>
                                        <Badge variant="outline" className="text-[10px]">{course.type || 'Theory'}</Badge>
                                    </div>
                                    <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-1">{course.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-center text-xs text-muted-foreground font-bold uppercase tracking-wider">
                                        <span>{course.credits} Credits</span>
                                        <span className="text-primary group-hover:underline">Select Subject →</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
                {view === 'students' && (
                    <Card className="border-none shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <CardHeader className="bg-muted/30 pb-4 border-b flex flex-row items-center justify-between">
                            <div className="flex flex-col md:flex-row gap-4 items-center flex-1">
                                {activeMode === 'view' ? (
                                    <div className="relative flex-1 w-full max-w-sm">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search students..."
                                            className="pl-9 h-10 w-full bg-background"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                ) : activeMode === 'attendance' ? (
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Label className="whitespace-nowrap">Date:</Label>
                                            <Input 
                                                type="date" 
                                                className="h-9 w-40" 
                                                value={currentDate} 
                                                onChange={e => setCurrentDate(e.target.value)} 
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Label className="whitespace-nowrap">Period:</Label>
                                            <Select value={currentPeriod} onValueChange={setCurrentPeriod}>
                                                <SelectTrigger className="h-9 w-24">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {[1, 2, 3, 4, 5, 6].map(p => (
                                                        <SelectItem key={p} value={String(p)}>Period {p}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="h-5 w-5 text-primary" />
                                        <span className="font-bold">Academic Assessment Mode</span>
                                        <Badge variant="outline" className="ml-2">Assgn 1 & 2 / Mid 1 & 2</Badge>
                                    </div>
                                )}
                            </div>
                            
                            {activeMode !== 'view' && (
                                <div className="flex gap-2">
                                    <Button variant="ghost" onClick={() => setActiveMode('view')}>Cancel</Button>
                                    <Button 
                                        onClick={activeMode === 'attendance' ? handleSaveBatchAttendance : handleSaveBatchMarks}
                                        disabled={isSyncing}
                                        className="bg-green-600 hover:bg-green-700 text-white min-w-[120px]"
                                    >
                                        {isSyncing ? <Save className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                        {isSyncing ? "Saving..." : "Save All"}
                                    </Button>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="h-[600px] overflow-auto">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-background z-10 shadow-sm border-b">
                                        <TableRow>
                                            <TableHead className="w-[120px]">Roll No</TableHead>
                                            <TableHead>Student Name</TableHead>
                                            
                                            {activeMode === 'view' && (
                                                <>
                                                    <TableHead>Class</TableHead>
                                                    <TableHead>CGPA</TableHead>
                                                    <TableHead>Attendance</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </>
                                            )}

                                            {activeMode === 'attendance' && (
                                                <>
                                                    <TableHead className="text-center">Status</TableHead>
                                                    <TableHead className="text-right">Action</TableHead>
                                                </>
                                            )}

                                            {activeMode === 'marks' && (
                                                <>
                                                    <TableHead className="w-[100px]">Assign 1</TableHead>
                                                    <TableHead className="w-[100px]">Mid 1</TableHead>
                                                    <TableHead className="w-[100px]">Assign 2</TableHead>
                                                    <TableHead className="w-[100px]">Mid 2</TableHead>
                                                </>
                                            )}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredStudents.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={activeMode === 'marks' ? 6 : activeMode === 'attendance' ? 4 : 6} className="h-64 text-center">
                                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                        <Users className="h-12 w-12 mb-4 opacity-20" />
                                                        <p className="text-lg font-medium">No students found</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredStudents.map((student) => (
                                                <TableRow key={student.id} className="hover:bg-muted/10 transition-colors group">
                                                    <TableCell className="font-mono font-medium text-primary py-4">
                                                        {student.rollNumber}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-semibold">{student.name}</div>
                                                    </TableCell>
                                                    
                                                    {activeMode === 'view' && (
                                                        <>
                                                            <TableCell>
                                                                <div className="flex items-center gap-1 text-sm font-medium">
                                                                    <Badge variant="outline" className="bg-background">{student.branch}</Badge>
                                                                    <span className="text-muted-foreground">Yr {student.year}</span>
                                                                    <Badge variant="secondary" className="px-1.5 h-5">{student.section}</Badge>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className="font-bold underline decoration-primary/30 underline-offset-4">{student.grade.toFixed(2)}</span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-col gap-1.5">
                                                                    <div className="flex items-center justify-between">
                                                                         <span className={`text-xs font-black tracking-tight ${getStudentAttendance(student).percentage < 75 ? "text-red-600" : "text-green-700"}`}>
                                                                             {getStudentAttendance(student).percentage}%
                                                                         </span>
                                                                         <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-70">
                                                                             ({getStudentAttendance(student).attended}/{getStudentAttendance(student).total})
                                                                         </span>
                                                                    </div>
                                                                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden shadow-inner">
                                                                        <div 
                                                                            className={`h-full transition-all duration-500 rounded-full ${getStudentAttendance(student).percentage < 75 ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" : "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"}`} 
                                                                            style={{ width: `${getStudentAttendance(student).percentage}%` }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <Button variant="outline" size="sm" onClick={() => handleOpenEdit(student)} className="hover:text-primary border-primary/20">
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(student.id)} className="text-red-500">
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </>
                                                    )}

                                                    {activeMode === 'attendance' && (
                                                        <>
                                                            <TableCell className="text-center">
                                                                {sessionAttendance[student.id] === true && (
                                                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                                                                        <Check className="h-3 w-3 mr-1" /> Present
                                                                    </Badge>
                                                                )}
                                                                {sessionAttendance[student.id] === false && (
                                                                    <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">
                                                                        <X className="h-3 w-3 mr-1" /> Absent
                                                                    </Badge>
                                                                )}
                                                                {sessionAttendance[student.id] === undefined && (
                                                                    <Badge variant="outline" className="text-muted-foreground border-dashed">
                                                                        Pending
                                                                    </Badge>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <Button 
                                                                        variant={sessionAttendance[student.id] === true ? "default" : "outline"}
                                                                        size="sm"
                                                                        disabled={(new Date().getHours() * 60 + new Date().getMinutes()) < (9 * 60 + 40) || (new Date().getHours() * 60 + new Date().getMinutes()) > (17 * 60)}
                                                                        onClick={() => setSessionAttendance(prev => ({...prev, [student.id]: true}))}
                                                                        className={`h-8 w-10 p-0 ${sessionAttendance[student.id] === true ? 'bg-green-600 hover:bg-green-700' : ''}`}
                                                                    >
                                                                        P
                                                                    </Button>
                                                                    <Button 
                                                                        variant={sessionAttendance[student.id] === false ? "destructive" : "outline"}
                                                                        size="sm"
                                                                        disabled={(new Date().getHours() * 60 + new Date().getMinutes()) < (9 * 60 + 40) || (new Date().getHours() * 60 + new Date().getMinutes()) > (17 * 60)}
                                                                        onClick={() => setSessionAttendance(prev => ({...prev, [student.id]: false}))}
                                                                        className="h-8 w-10 p-0"
                                                                    >
                                                                        A
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </>
                                                    )}

                                                    {activeMode === 'marks' && (
                                                        <>
                                                            <TableCell>
                                                                <Input 
                                                                    type="number" 
                                                                    className="h-8 w-16" 
                                                                    value={sessionMarks[student.id]?.assignment1} 
                                                                    onChange={e => updateMark(student.id, 'assignment1', e.target.value)}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input 
                                                                    type="number" 
                                                                    className="h-8 w-16" 
                                                                    value={sessionMarks[student.id]?.mid1} 
                                                                    onChange={e => updateMark(student.id, 'mid1', e.target.value)}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input 
                                                                    type="number" 
                                                                    className="h-8 w-16" 
                                                                    value={sessionMarks[student.id]?.assignment2} 
                                                                    onChange={e => updateMark(student.id, 'assignment2', e.target.value)}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input 
                                                                    type="number" 
                                                                    className="h-8 w-16" 
                                                                    value={sessionMarks[student.id]?.mid2} 
                                                                    onChange={e => updateMark(student.id, 'mid2', e.target.value)}
                                                                />
                                                            </TableCell>
                                                        </>
                                                    )}
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Student Record</DialogTitle>
                        <DialogDescription>
                            Modifying grades and attendance for {editingStudent?.name} ({editingStudent?.rollNumber}).
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 opacity-70">
                                <Label>Overall Attendance (%)</Label>
                                <Input 
                                    type="number" 
                                    disabled
                                    className="bg-muted cursor-not-allowed font-bold"
                                    value={editAttendance} 
                                />
                                <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-tight">System Calculated</p>
                            </div>
                            <div className="space-y-2 opacity-70">
                                <Label>Cumulative CGPA</Label>
                                <Input 
                                    type="number" 
                                    disabled
                                    className="bg-muted cursor-not-allowed font-bold"
                                    value={editGrade} 
                                />
                                <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-tight">System Calculated</p>
                            </div>
                        </div>
                        
                        <div className="border-t pt-4 mt-2">
                            <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-primary">
                                <GraduationCap className="h-4 w-4" />
                                Internal Assessment Marks
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Assignment 1</Label>
                                    <Input 
                                        type="number" 
                                        className="h-9"
                                        value={editingStudent?.assignment1 || 0} 
                                        onChange={e => setEditingStudent(prev => prev ? {...prev, assignment1: parseInt(e.target.value) || 0} : null)} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Midterm 1</Label>
                                    <Input 
                                        type="number" 
                                        className="h-9"
                                        value={editingStudent?.mid1 || 0} 
                                        onChange={e => setEditingStudent(prev => prev ? {...prev, mid1: parseInt(e.target.value) || 0} : null)} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Assignment 2</Label>
                                    <Input 
                                        type="number" 
                                        className="h-9"
                                        value={editingStudent?.assignment2 || 0} 
                                        onChange={e => setEditingStudent(prev => prev ? {...prev, assignment2: parseInt(e.target.value) || 0} : null)} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Midterm 2</Label>
                                    <Input 
                                        type="number" 
                                        className="h-9"
                                        value={editingStudent?.mid2 || 0} 
                                        onChange={e => setEditingStudent(prev => prev ? {...prev, mid2: parseInt(e.target.value) || 0} : null)} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveEdit} className="bg-primary hover:bg-primary/90">
                            <Save className="h-4 w-4 mr-2" /> Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default StudentRecords;
