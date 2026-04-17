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
import { Check, X, ClipboardCheck, GraduationCap, ArrowLeft, MoreVertical, Book, RefreshCw, Layout, ExternalLink } from "lucide-react";
import { attendanceService } from "@/services/attendanceService";
import { MOCK_COURSES } from "@/data/mockCourses";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { academicService } from "@/services/academicService";

const StudentRecords = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
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
        const rawPercentage = Math.round((attended / total) * 100);
        
        // Mark it below 92 as requested
        const percentage = rawPercentage > 91 ? 91 : rawPercentage;
        
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
    const [hasManuallyReset, setHasManuallyReset] = useState(false);

    const [searchParams] = useSearchParams();

    // Handle search parameters from navigation
    useEffect(() => {
        const q = searchParams.get('q');
        const dept = searchParams.get('dept');
        const year = searchParams.get('year');
        const section = searchParams.get('section');
        const course = searchParams.get('course');
        const mode = searchParams.get('mode');

        if (q) {
            setSearchQuery(q);
            const student = MOCK_STUDENTS.find(s => 
                s.name.toLowerCase().includes(q.toLowerCase()) || 
                s.rollNumber.toLowerCase().includes(q.toLowerCase())
            );
            if (student) {
                setSelectedBranch(student.branch);
                setSelectedYear(student.year);
                setSelectedSection(student.section);
                setView('students');
            }
        } else if (dept && year && section) {
            setSelectedBranch(dept.toUpperCase());
            setSelectedYear(parseInt(year));
            setSelectedSection(section.toUpperCase());
            
            if (course) {
                setSelectedCourse(course);
                setView('students');
                if (mode === 'attendance') {
                    setActiveMode('attendance');
                } else if (mode === 'marks') {
                    setActiveMode('marks');
                }
            } else {
                setView('courses');
            }
        }
    }, [searchParams]);
    
    // Navigation State
    const [view, setView] = useState<'branches' | 'years' | 'sections' | 'courses' | 'students' | 'student-detail'>('branches');
    const [activeMode, setActiveMode] = useState<'view' | 'attendance' | 'marks'>('view');
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [selectedStudentProfile, setSelectedStudentProfile] = useState<Student | null>(null);

    // Attendance/Marks Session State
    const [currentPeriod, setCurrentPeriod] = useState("1");
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
    const [sessionAttendance, setSessionAttendance] = useState<Record<string, boolean | undefined>>({});
    const [isSyncing, setIsSyncing] = useState(false);
    const [attendanceSyncStamp, setAttendanceSyncStamp] = useState(0);
    const [sessionMarks, setSessionMarks] = useState<Record<string, { assignment1: number, mid1: number, assignment2: number, mid2: number, labInternal?: number, labExternal?: number }>>({});

    // Fetch attendance records from backend when filter changes
    useEffect(() => {
        // Only fetch if required conditions are met and NOT manually reset in this view
        if (selectedCourse && currentDate && currentPeriod && activeMode === 'attendance' && !hasManuallyReset) {
            const fetchAttendance = async () => {
                try {
                    const data = await attendanceService.getAttendance({
                        course_code: selectedCourse,
                        attendance_date: currentDate
                    });
                    
                    if (!data || !Array.isArray(data)) {
                        console.warn("No attendance array returned from server:", data);
                        return;
                    }
                    
                    // Filter for specific period
                    const periodData = data.filter((r: any) => String(r.period) === String(currentPeriod));
                    
                    // IF we have no data from server and we are just initializing (stamp 0), 
                    // then we can safely clear.
                    // BUT if we just saved (stamp > 0) and server returns empty (e.g. delay or DB mismatch),
                    // we should NOT clear the local markers to prevent the 'Pending' reset issue.
                    if (periodData.length === 0 && attendanceSyncStamp > 0) {
                        console.log("Preserving local markers: Server returned no data after save.");
                        return;
                    }

                    const mapped: Record<string, boolean> = {};
                    periodData.forEach((r: any) => {
                        // Intelligent mapping: Backend returns numeric student_id
                        // Match by stripping non-numeric chars from frontend IDs
                        const student = filteredStudents.find(s => {
                            const numericID = parseInt(s.id.replace(/\D/g, ''));
                            return numericID === r.student_id;
                        });
                        
                        if (student) {
                            mapped[student.id] = r.status === "Present";
                        } else {
                            // Fallback for direct stud-X mapping
                            mapped[`stud-${r.student_id}`] = r.status === "Present";
                        }
                    });

                    // Only update if we actually got something from backend
                    // This prevents overwriting our local optimistic state with 'Pending' if backend fetch is empty or delayed
                    if (Object.keys(mapped).length > 0) {
                        setSessionAttendance(mapped);
                    }
                } catch (error) {
                    console.error("Failed to fetch attendance:", error);
                }
            };
            fetchAttendance();
        } else if (activeMode !== 'attendance') {
            setSessionAttendance({});
        }
    }, [selectedCourse, currentDate, currentPeriod, activeMode, attendanceSyncStamp]);


    // Reset sync stamp and clear UI when core filters change
    // OPTIMIZATION: Pull from local students state if available for this specific slot
    useEffect(() => {
        setAttendanceSyncStamp(0);
        setHasManuallyReset(false);
        
        const slotKey = `${currentDate}-P${currentPeriod}-${selectedCourse}`;
        const localStatus: Record<string, boolean> = {};
        let hasLocalData = false;
        
        students.forEach(s => {
            if (s.periodAttendance && s.periodAttendance[slotKey] !== undefined) {
                localStatus[s.id] = s.periodAttendance[slotKey];
                hasLocalData = true;
            }
        });
        
        setSessionAttendance(localStatus);
    }, [selectedCourse, currentDate, currentPeriod]);

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
        attendance: 90,
        grade: 9.0
    });

    const registrationVisibility = useMemo(() => {
        if (!selectedYear || !selectedCourse) return { showMid1: true, showAssgn1: true, showMid2: false, showAssgn2: false, isHistorical: false };
        const course = MOCK_COURSES.find(c => c.code === selectedCourse);
        if (!course) return { showMid1: true, showAssgn1: true, showMid2: false, showAssgn2: false, isHistorical: false };
        return academicService.getVisibility(selectedYear, course.semester);
    }, [selectedYear, selectedCourse]);

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


    useEffect(() => {
        if (activeMode === 'marks' && selectedCourse) {
            const marksData: Record<string, any> = {};
            
            const course = MOCK_COURSES.find(c => c.code === selectedCourse);
            const isLab = course?.type === 'Lab' || false;
            const isProject = course?.name.toLowerCase().includes("project") || 
                           (course?.name.toLowerCase().includes("stage") || 
                            course?.name.toLowerCase().includes("phase")) || false;
            const credits = course?.credits || 0;

            filteredStudents.forEach(s => {
                const realMarks = academicService.getMarks(s.id, selectedCourse);
                const dummy = academicService.getGeneratedMarks(s.id, selectedCourse, course?.name || "", isLab, isProject, credits, true);

                marksData[s.id] = {
                    assignment1: realMarks?.assignment1 ?? dummy.assignment1 ?? 0,
                    mid1: realMarks?.mid1 ?? dummy.mid1 ?? 0,
                    assignment2: realMarks?.assignment2 ?? dummy.assignment2 ?? 0,
                    mid2: realMarks?.mid2 ?? dummy.mid2 ?? 0,
                    labInternal: realMarks?.labInternal ?? dummy.labInternal ?? 0,
                    labExternal: realMarks?.labExternal ?? dummy.labExternal ?? 0
                };
            });
            
            setSessionMarks(marksData);
        }
    }, [filteredStudents, activeMode, selectedCourse]);

    const branches = ["CSE", "CSM", "IT", "ECE"];
    const years = [1, 2, 3, 4];
    const sections = ["A", "B", "C"];

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
        setSelectedStudentProfile(null);
        setView('branches');
    };

    const goBack = () => {
        if (view === 'student-detail') {
            setSelectedStudentProfile(null);
            setView('students');
        } else if (view === 'students') {
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
            const records = filteredStudents
                .filter(s => sessionAttendance[s.id] !== undefined) // Only save students explicitly marked
                .map(s => {
                    // Robust ID parsing: Extract all digits to create a unique integer
                    // e.g. '22K91A6661' -> 22916661, 'stud-1' -> 1
                    const studentId = parseInt(s.id.replace(/\D/g, '')) || 0;
                    
                    // Fetch faculty metadata from session or default
                    const facultyId = localStorage.getItem('smartcampus_user_id') || "FAC-ADMIN";
                    
                    return {
                        student_id: studentId,
                        course_code: selectedCourse,
                        subject_id: selectedCourse, // Mapping course code to subject identity
                        faculty_id: facultyId,
                        attendance_date: currentDate,
                        period: parseInt(currentPeriod),
                        status: (sessionAttendance[s.id] ? "Present" : "Absent") as "Present" | "Absent"
                    };
                });
            
            if (records.length === 0) {
                toast({ title: "Nothing to Save", description: "Please mark at least one student as Present or Absent." });
                setIsSyncing(false);
                return;
            }

            await attendanceService.saveBulkAttendance(records);

            // Optimistically update local directory
            const slotKey = `${currentDate}-P${currentPeriod}-${selectedCourse}`;
            setStudents(prev => {
                const newStudents = prev.map(s => {
                    if (filteredStudents.some(fs => fs.id === s.id)) {
                        const isPresent = sessionAttendance[s.id] === true;
                        const baselineTotal = 240; 
                        const baselineAttended = Math.round((s.attendance / 100) * baselineTotal);
                        const newAttended = isPresent ? baselineAttended + 1 : baselineAttended;
                        const newTotal = baselineTotal + 1;
                        const newPct = Math.min(91, Math.round((newAttended / newTotal) * 100));

                        return {
                            ...s,
                            attendance: newPct,
                            periodAttendance: {
                                ...(s.periodAttendance || {}),
                                [slotKey]: isPresent
                            }
                        };
                    }
                    return s;
                });
                
                // CRITICAL: Sync with localStorage for student dashboard real-time reflection
                localStorage.setItem('smartcampus_student_directory', JSON.stringify(newStudents));
                return newStudents;
            });

            toast({ title: "Attendance Saved", description: `Attendance recorded for ${selectedCourse} on ${currentDate}.` });
            
            // Dispatch event for real-time sync with student dashboard and history components
            window.dispatchEvent(new CustomEvent('attendance_updated'));
            
            // Increment sync stamp to trigger the useEffect refetch from backend
            setAttendanceSyncStamp(prev => prev + 1);
            
            // Do NOT switch to 'view' mode automatically to allow faculty to verify the save state
            // setActiveMode('view'); 
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
        if (!selectedCourse) return;
        
        Object.entries(sessionMarks).forEach(([studentId, marks]) => {
            academicService.saveMarks(studentId, selectedCourse, {
                assignment1: marks.assignment1,
                mid1: marks.mid1,
                assignment2: marks.assignment2,
                mid2: marks.mid2,
                labInternal: marks.labInternal,
                labExternal: marks.labExternal
            });
        });

        // Generate Alerts for Marks Update
        const savedAlerts = JSON.parse(localStorage.getItem('STUDENT_ALERTS') || '[]');
        const marksAlerts = Object.entries(sessionMarks).map(([studentId, marks]) => {
            const s = students.find(fs => fs.id === studentId);
            return {
                id: Date.now() + Math.random(),
                title: "Academic Update",
                message: `New marks (Midterm/Assignment) have been uploaded for ${selectedCourse}.`,
                branch: s?.branch || "All",
                year: s?.year || 0,
                section: s?.section || "All",
                isRead: false,
                timestamp: new Date().toISOString()
            };
        });
        localStorage.setItem('STUDENT_ALERTS', JSON.stringify([...marksAlerts, ...savedAlerts].slice(0, 50)));
        window.dispatchEvent(new CustomEvent('student_alerts_updated'));

        toast({ title: "Marks Updated", description: "Assignment and Midterm marks saved successfully to academic vault." });
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
                ...(prev[studentId] || { assignment1: 0, mid1: 0, assignment2: 0, mid2: 0, labInternal: 0, labExternal: 0 }),
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
            email: `${newStudent.rollNumber.toLowerCase()}@smartcampus.com`,
            branch: newStudent.branch || "CSE",
            year: newStudent.year || 1,
            semester: (newStudent.year || 1) * 2 - 1, // Align with current Odd Semester policy
            section: newStudent.section || "A",
            phone: "+910000000000",
            attendance: Number(newStudent.attendance) || 100,
            grade: Number(newStudent.grade) || 10
        };

        setStudents([studentToAdd, ...students]);
        setIsAddOpen(false);
        setNewStudent({ branch: "CSE", year: 1, section: "A", attendance: 90, grade: 9.0 });
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
            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/30 p-2 rounded-xl border border-border/40 animate-in slide-in-from-left-2 duration-300 w-fit">
                <Button variant="ghost" size="sm" onClick={resetNavigation} className="h-7 px-2 hover:bg-background hover:text-primary transition-colors">
                    Records
                </Button>
                {selectedBranch && (
                    <>
                        <span className="mx-1 text-muted-foreground/50">-</span>
                        <Button variant="ghost" size="sm" onClick={() => { setView('years'); setSelectedYear(null); setSelectedSection(null); }} className="h-7 px-2 hover:bg-background hover:text-primary text-foreground font-bold transition-colors">
                            {selectedBranch}
                        </Button>
                    </>
                )}
                {selectedYear && (
                    <>
                        <span className="mx-1 text-muted-foreground/50">-</span>
                        <Button variant="ghost" size="sm" onClick={() => { setView('sections'); setSelectedSection(null); }} className="h-7 px-2 hover:bg-background hover:text-primary text-foreground font-bold transition-colors">
                            {selectedYear}{selectedYear === 1 ? 'st' : selectedYear === 2 ? 'nd' : selectedYear === 3 ? 'rd' : 'th'} Year
                        </Button>
                    </>
                )}
                {selectedSection && (
                    <>
                        <span className="mx-1 text-muted-foreground/50">-</span>
                        <Button variant="ghost" size="sm" onClick={() => { setView('courses'); setSelectedCourse(null); }} className="h-7 px-2 hover:bg-background hover:text-primary text-foreground font-bold transition-colors">
                            Section {selectedSection}
                        </Button>
                    </>
                )}
                {selectedCourse && (
                    <>
                        <span className="mx-1 text-muted-foreground/50">-</span>
                        <Button variant="ghost" size="sm" onClick={() => { setView('students'); setSelectedStudentProfile(null); }} className={`h-7 px-2 hover:bg-background hover:text-primary text-foreground font-black italic transition-colors ${!selectedStudentProfile ? 'text-primary' : ''}`}>
                             {MOCK_COURSES.find(c => c.code === selectedCourse)?.name || selectedCourse}
                        </Button>
                    </>
                )}
                {selectedStudentProfile && (
                    <>
                        <span className="mx-1 text-muted-foreground/50">-</span>
                        <span className="h-7 px-2 flex items-center text-primary font-black italic underline decoration-primary/30 decoration-2 underline-offset-4">
                            {selectedStudentProfile.name} Profile
                        </span>
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
                                        const course = MOCK_COURSES.find(c => c.code === selectedCourse);
                                        const isProject = course?.name.toLowerCase().includes("project") && 
                                                        (course?.name.toLowerCase().includes("stage") || 
                                                         course?.name.toLowerCase().includes("phase"));
                                        
                                        if (course?.credits === 0 || isProject) {
                                            toast({ 
                                                title: isProject ? "Project Subject" : "Non-Credit Subject", 
                                                description: isProject 
                                                    ? "Project Stage assessment is managed separately and doesn't have standard midterm/semester exams."
                                                    : "This subject does not require marks entry.",
                                                variant: "destructive"
                                            });
                                            return;
                                        }
                                        setActiveMode('marks');
                                        // Initialization will happen in useEffect
                                    }}
                                    className={`h-8 ${(MOCK_COURSES.find(c => c.code === selectedCourse)?.credits === 0 || 
                                                     (MOCK_COURSES.find(c => c.code === selectedCourse)?.name.toLowerCase().includes("project") && 
                                                      (MOCK_COURSES.find(c => c.code === selectedCourse)?.name.toLowerCase().includes("stage") || 
                                                       MOCK_COURSES.find(c => c.code === selectedCourse)?.name.toLowerCase().includes("phase")))) 
                                                     ? 'opacity-40 cursor-not-allowed grayscale' : ''}`}
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
                {view === 'student-detail' && selectedStudentProfile && (
                    <StudentDetailView student={selectedStudentProfile} onBack={goBack} />
                )}
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
                    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-300">
                        {[selectedYear! * 2 - 1, selectedYear! * 2].map(sem => {
                            const semCourses = MOCK_COURSES.filter(c => c.department === selectedBranch && c.semester === sem);
                            if (semCourses.length === 0) return null;

                            const currentActiveSem = (selectedYear! * 2) - 1;
                            const isInProgress = sem === currentActiveSem;
                            const isHistorical = sem < currentActiveSem;
                            const isFuture = sem > currentActiveSem;

                            return (
                                <div key={sem} className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                                            <Badge className={`h-8 w-8 rounded-full ${isInProgress ? 'bg-primary' : 'bg-slate-400'} text-white flex items-center justify-center p-0 text-lg`}>{sem}</Badge>
                                            Semester {sem}
                                            {isInProgress ? (
                                                <Badge variant="outline" className="ml-2 border-primary text-primary font-bold animate-pulse">In Progress (Active)</Badge>
                                            ) : isHistorical ? (
                                                <Badge variant="outline" className="ml-2 border-slate-300 text-slate-500 font-bold bg-slate-50">Completed (History)</Badge>
                                            ) : (
                                                <Badge variant="outline" className="ml-2 border-slate-200 text-slate-400 font-bold italic">Next Semester</Badge>
                                            )}
                                        </h3>
                                        <div className="h-px flex-1 bg-gradient-to-r from-muted to-transparent" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {semCourses.map((course) => (
                                            <Card key={course.code} className={`group hover:border-primary/50 cursor-pointer transition-all hover:shadow-lg overflow-hidden border-2 h-full ${course.type === 'Lab' ? 'bg-orange-50/20 border-orange-100/50' : 'bg-white'}`} onClick={() => handleCourseSelect(course.code)}>
                                                <CardHeader className="pb-2">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge variant="secondary" className="font-mono text-[10px]">{course.code}</Badge>
                                                        <Badge variant="outline" className="text-[10px] font-bold">{course.type || 'Theory'}</Badge>
                                                    </div>
                                                    <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem] leading-tight">
                                                        {course.name}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex justify-between items-center text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-2 border-t pt-4">
                                                        <span className="flex items-center gap-1">
                                                            <CheckCircle className="w-3 h-3 text-success" />
                                                            {course.credits} Credits
                                                        </span>
                                                        <span className="text-primary group-hover:translate-x-1 transition-transform">Select Subject →</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
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
                                    <div className="flex items-end gap-4">
                                        <div className="flex flex-col gap-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Attendance Date</Label>
                                            <Input 
                                                type="date" 
                                                className="h-9 w-44" 
                                                value={currentDate} 
                                                onChange={e => setCurrentDate(e.target.value)} 
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Select Academic Period</Label>
                                            <div className="flex items-center gap-1.5 bg-muted/50 p-1 rounded-2xl border border-border/40">
                                                {[1, 2, 3, 4, 5, 6].map(p => (
                                                    <button
                                                        key={p}
                                                        onClick={() => setCurrentPeriod(String(p))}
                                                        className={`h-7 w-9 rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center
                                                            ${currentPeriod === String(p) 
                                                                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105' 
                                                                : 'text-muted-foreground hover:bg-background hover:text-foreground'
                                                            }`}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
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
                                    {activeMode === 'attendance' && (
                                        <Button 
                                            variant="outline" 
                                            onClick={() => {
                                                setSessionAttendance({});
                                                setHasManuallyReset(true);
                                                toast({
                                                    title: "Session Reset",
                                                    description: "Attendance selection for this session has been cleared.",
                                                });
                                            }}
                                            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                        >
                                            <RefreshCw className="h-4 w-4 mr-2" /> Reset
                                        </Button>
                                    )}
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
                                                    {(() => {
                                                        const course = MOCK_COURSES.find(c => c.code === selectedCourse);
                                                        const isProject = course?.name.toLowerCase().includes("project") || 
                                                                        (course?.name.toLowerCase().includes("stage") || 
                                                                         course?.name.toLowerCase().includes("phase"));
                                                        
                                                        if (isProject) {
                                                            return (
                                                                <>
                                                                    <TableHead className="w-[100px] font-black text-[10px] uppercase text-indigo-600 text-center bg-indigo-50/30">Review 1 (25)</TableHead>
                                                                    <TableHead className="w-[100px] font-black text-[10px] uppercase text-indigo-600 text-center bg-indigo-50/30">Review 2 (25)</TableHead>
                                                                    <TableHead className="w-[100px] font-black text-[10px] uppercase text-indigo-600 text-center bg-indigo-50/30">Review 3 (25)</TableHead>
                                                                    <TableHead className="w-[100px] font-black text-[10px] uppercase text-indigo-600 text-center bg-indigo-50/30">Review 4 (25)</TableHead>
                                                                    <TableHead className="w-[100px] font-black text-[10px] uppercase text-indigo-700 text-center bg-indigo-100/50">Total (100)</TableHead>
                                                                </>
                                                            );
                                                        }

                                                        return course?.type === 'Lab' ? (
                                                            <>
                                                                <TableHead className="w-[150px] font-black text-xs uppercase text-primary text-center">Lab Internal (40M)</TableHead>
                                                                <TableHead className="w-[150px] font-black text-xs uppercase text-primary text-center opacity-70">Lab External (60M)</TableHead>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <TableHead className="w-[120px] font-black text-[10px] uppercase text-primary text-center">Assgn 1 (5M)</TableHead>
                                                                <TableHead className="w-[120px] font-black text-[10px] uppercase text-primary text-center">Mid 1 (30M)</TableHead>
                                                                <TableHead className="w-[120px] font-black text-[10px] uppercase text-primary text-center">Assgn 2 (5M)</TableHead>
                                                                <TableHead className="w-[120px] font-black text-[10px] uppercase text-primary text-center">Mid 2 (30M)</TableHead>
                                                                <TableHead className="w-[120px] font-black text-[10px] uppercase text-green-600 text-center bg-green-50/50">Total (40M)</TableHead>
                                                            </>
                                                        );
                                                    })()}
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
                                                                    <Button variant="outline" size="sm" title="View Student Dashboard" onClick={() => navigate(`/dashboard/student/${student.id}`)} className="hover:text-primary border-primary/20 text-primary">
                                                                        <Layout className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button variant="outline" size="sm" onClick={() => { setSelectedStudentProfile(student); setView('student-detail'); }} className="hover:text-primary border-primary/20 bg-primary/5">
                                                                        <BookOpen className="h-4 w-4" />
                                                                    </Button>
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
                                                            {(() => {
                                                                const course = MOCK_COURSES.find(c => c.code === selectedCourse);
                                                                const isProject = course?.name.toLowerCase().includes("project") || 
                                                                                (course?.name.toLowerCase().includes("stage") || 
                                                                                 course?.name.toLowerCase().includes("phase"));
                                                                
                                                                if (course?.credits === 0) {
                                                                    return (
                                                                        <TableCell colSpan={course?.type === 'Lab' ? 2 : 5} className="bg-muted/30 text-center">
                                                                            <div className="flex items-center justify-center gap-2 text-muted-foreground font-black uppercase text-[10px] tracking-widest italic opacity-50">
                                                                                <X className="h-3 w-3" /> No Marks Data Required (Non-Credit)
                                                                            </div>
                                                                        </TableCell>
                                                                    );
                                                                }

                                                                if (isProject) {
                                                                    return (
                                                                        <>
                                                                            <TableCell className="bg-indigo-50/20 text-center">
                                                                                <Input type="number" max={25} value={sessionMarks[student.id]?.assignment1 || 0} onChange={(e) => updateMark(student.id, 'assignment1', e.target.value)} className="h-8 w-16 mx-auto text-center" />
                                                                            </TableCell>
                                                                            <TableCell className="bg-indigo-50/20 text-center">
                                                                                <Input type="number" max={25} value={sessionMarks[student.id]?.mid1 || 0} onChange={(e) => updateMark(student.id, 'mid1', e.target.value)} className="h-8 w-16 mx-auto text-center" />
                                                                            </TableCell>
                                                                            <TableCell className="bg-indigo-50/20 text-center">
                                                                                <Input type="number" max={25} value={sessionMarks[student.id]?.assignment2 || 0} onChange={(e) => updateMark(student.id, 'assignment2', e.target.value)} className="h-8 w-16 mx-auto text-center" />
                                                                            </TableCell>
                                                                            <TableCell className="bg-indigo-50/20 text-center">
                                                                                <Input type="number" max={25} value={sessionMarks[student.id]?.mid2 || 0} onChange={(e) => updateMark(student.id, 'mid2', e.target.value)} className="h-8 w-16 mx-auto text-center" />
                                                                            </TableCell>
                                                                            <TableCell className="bg-indigo-100/30 text-center font-black text-indigo-700">
                                                                                {(sessionMarks[student.id]?.assignment1 || 0) + (sessionMarks[student.id]?.mid1 || 0) + (sessionMarks[student.id]?.assignment2 || 0) + (sessionMarks[student.id]?.mid2 || 0)}
                                                                            </TableCell>
                                                                        </>
                                                                    );
                                                                }

                                                                return course?.type === 'Lab' ? (
                                                                    <>
                                                                        <TableCell className="text-center">
                                                                            <Input 
                                                                                type="number" 
                                                                                max={40}
                                                                                placeholder="Int 40"
                                                                                value={sessionMarks[student.id]?.labInternal || 0} 
                                                                                onChange={(e) => updateMark(student.id, 'labInternal', e.target.value)} 
                                                                                className="h-8 w-24 text-center font-bold"
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell className="text-center">
                                                                            <Input 
                                                                                type="number" 
                                                                                max={60}
                                                                                placeholder="Ext 60"
                                                                                value={sessionMarks[student.id]?.labExternal || 0} 
                                                                                onChange={(e) => updateMark(student.id, 'labExternal', e.target.value)} 
                                                                                className="h-8 w-24 text-center font-bold bg-muted/20"
                                                                            />
                                                                        </TableCell>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <TableCell className="text-center">
                                                                            <Input 
                                                                                type="number" 
                                                                                max={5}
                                                                                placeholder="5M"
                                                                                value={sessionMarks[student.id]?.assignment1 || 0} 
                                                                                onChange={(e) => updateMark(student.id, 'assignment1', e.target.value)} 
                                                                                className="h-8 w-16 text-center mx-auto"
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell className="text-center">
                                                                            <Input 
                                                                                type="number" 
                                                                                max={30}
                                                                                placeholder="30M"
                                                                                value={sessionMarks[student.id]?.mid1 || 0} 
                                                                                onChange={(e) => updateMark(student.id, 'mid1', e.target.value)} 
                                                                                className="h-8 w-20 text-center mx-auto"
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell className="text-center">
                                                                            <Input 
                                                                                type="number" 
                                                                                max={5}
                                                                                placeholder="5M"
                                                                                value={sessionMarks[student.id]?.assignment2 || 0} 
                                                                                onChange={(e) => updateMark(student.id, 'assignment2', e.target.value)} 
                                                                                className="h-8 w-16 text-center mx-auto"
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell className="text-center">
                                                                            <Input 
                                                                                type="number" 
                                                                                max={30}
                                                                                placeholder="30M"
                                                                                value={sessionMarks[student.id]?.mid2 || 0} 
                                                                                onChange={(e) => updateMark(student.id, 'mid2', e.target.value)} 
                                                                                className="h-8 w-20 text-center mx-auto"
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell className="text-center bg-green-50/30">
                                                                            <div className="font-black text-green-700 text-sm">
                                                                                {(() => {
                                                                                    const m = sessionMarks[student.id] || { mid1: 0, mid2: 0, assignment1: 0, assignment2: 0 };
                                                                                    // Institutional Formula: Max(Mid1, Mid2) + Assignment1 + Assignment2 = 40M Total
                                                                                    return (Math.max(m.mid1, m.mid2) + m.assignment1 + m.assignment2);
                                                                                })()}
                                                                            </div>
                                                                        </TableCell>
                                                                    </>
                                                                );
                                                            })()}
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
                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Assignment 1 (5M)</Label>
                                            <Input 
                                                type="number" 
                                                max={5}
                                                className="h-9"
                                                value={editingStudent?.assignment1 || 0} 
                                                onChange={e => setEditingStudent(prev => prev ? {...prev, assignment1: parseInt(e.target.value) || 0} : null)} 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Midterm 1 (30M)</Label>
                                            <Input 
                                                type="number" 
                                                max={30}
                                                className="h-9"
                                                value={editingStudent?.mid1 || 0} 
                                                onChange={e => setEditingStudent(prev => prev ? {...prev, mid1: parseInt(e.target.value) || 0} : null)} 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Assignment 2 (5M)</Label>
                                            <Input 
                                                type="number" 
                                                max={5}
                                                className="h-9"
                                                value={editingStudent?.assignment2 || 0} 
                                                onChange={e => setEditingStudent(prev => prev ? {...prev, assignment2: parseInt(e.target.value) || 0} : null)} 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Midterm 2 (30M)</Label>
                                            <Input 
                                                type="number" 
                                                max={30}
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

// --- Detailed Student Profile Component ---
const StudentDetailView = ({ student, onBack }: { student: Student, onBack: () => void }) => {
    // Fetch real marks from academic service (Single Source of Truth)
    const storedMarks = useMemo(() => {
        return academicService.getAllForStudent(student.id);
    }, [student.id]);

    const getMarks = (courseCode: string, type: string, courseSem: number, currentSem: number, credits: number) => {
        const real = storedMarks[courseCode];
        const visibility = academicService.getVisibility(student.year, courseSem);
        
        // Logical Defaults (Seed-based for missing data to match student view's "realistic" base)
        const seed = courseCode.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const pseudoRandom = (min: number, max: number) => {
            const val = ((seed * 9301 + 49297) % 233280) / 233280;
            return Math.floor(min + val * (max - min));
        };

        const isProject = courseCode.toLowerCase().includes("pw") || 
                          (branchCourses.find(c => c.code === courseCode)?.name.toLowerCase().includes("project") && 
                           (branchCourses.find(c => c.code === courseCode)?.name.toLowerCase().includes("stage") || 
                            branchCourses.find(c => c.code === courseCode)?.name.toLowerCase().includes("phase")));

        if (credits === 0 || isProject) {
            return { 
                mid: 'N/A', 
                assgn: 'N/A', 
                total: 0, 
                status: isProject ? "Project" : "Non-Credit", 
                type, 
                isNonCredit: true,
                isProject: isProject
            };
        }

        const dummy = academicService.getGeneratedMarks(student.id, courseCode, branchCourses.find(c => c.code === courseCode)?.name || "", type === 'Lab', isProject, credits, courseSem === student.semester);
        
        const m1 = real?.mid1 ?? dummy.mid1;
        const m2 = real?.mid2 ?? dummy.mid2;
        const a1 = real?.assignment1 ?? dummy.assignment1;
        const a2 = real?.assignment2 ?? dummy.assignment2;
        const ex = real?.examMark ?? dummy.exam;
        const li = real?.labInternal ?? dummy.labInternal;
        const le = real?.labExternal ?? dummy.labExternal;

        if (type === 'Lab') {
            return {
                m1, m2, a1, a2, 
                total: li + le,
                status: "Processed", 
                type: 'Lab',
                labInt: li,
                labExt: le,
                visibility: { ...visibility, showMid1: true, showMid2: true, showAssgn1: true, showAssgn2: true, showExam: true, isHistorical: true }
            };
        } else {
            const internalTotal = Math.max(m1, m2) + a1 + a2;
            const finalTotal = internalTotal + ex;

            return {
                m1, m2, a1, a2,
                total: internalTotal,
                status: "Processed",
                type: 'Theory',
                ex: ex,
                finalTotal: finalTotal,
                visibility: { ...visibility, showMid1: true, showMid2: true, showAssgn1: true, showAssgn2: true, showExam: true, isHistorical: true }
            };
        }
    };

    const branchCourses = MOCK_COURSES.filter(c => c.department === student.branch);
    // Only show semesters up to the student's current semester
    const semesters = Array.from({ length: student.semester }, (_, i) => i + 1);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <Users className="w-8 h-8 text-primary" />
                        {student.name}
                    </h2>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs mt-1">
                        Roll: <span className="text-foreground font-black">{student.rollNumber}</span> • Branch: <span className="text-foreground font-black">{student.branch}</span> • CGPA: <span className="text-primary font-black underline">{student.grade.toFixed(2)}</span>
                    </p>
                </div>
                <Button variant="ghost" onClick={onBack} className="font-bold text-primary hover:bg-primary/5">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
                </Button>
            </div>

            <Card className="border-none shadow-xl overflow-hidden bg-white/50 backdrop-blur-xl border-t-4 border-t-primary">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <GraduationCap className="w-6 h-6 text-primary" />
                        Complete Academic Transcript
                    </CardTitle>
                    <CardDescription>Comprehensive semester-wise subject performance and internal scoring matrix.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <Tabs defaultValue={String(student.semester)} className="w-full">
                        <div className="overflow-x-auto pb-4">
                            <TabsList className="bg-muted/50 p-1 h-auto flex flex-nowrap w-max min-w-full">
                                {semesters.map(s => (
                                    <TabsTrigger 
                                        key={s} 
                                        value={s.toString()} 
                                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 font-black px-6 text-xs uppercase tracking-tighter"
                                    >
                                        Sem {s}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        {semesters.map(semNum => {
                            const semCourses = branchCourses.filter(c => c.semester === semNum);
                            const isActiveSem = student.semester === semNum;

                            return (
                                <TabsContent key={semNum} value={semNum.toString()} className="animate-in fade-in-50 zoom-in-95 duration-300 ring-offset-background focus-visible:outline-none">
                                    {semCourses.length > 0 ? (
                                        <div className="space-y-4">
                                            <div className="rounded-xl border shadow-sm overflow-hidden bg-white">
                                                <Table>
                                                    <TableHeader className="bg-slate-50">
                                                        <TableRow>
                                                            <TableHead rowSpan={2} className="font-bold text-xs uppercase text-muted-foreground w-[100px] border-r">Code</TableHead>
                                                            <TableHead rowSpan={2} className="font-bold text-xs uppercase text-muted-foreground border-r">Subject Name</TableHead>
                                                            <TableHead colSpan={(() => {
                                                                const course = branchCourses.find(c => c.credits > 0);
                                                                return 5; // Fixed span to handle project logic
                                                            })()} className="text-center font-black text-[10px] uppercase bg-blue-50/50 text-blue-700 border-r tracking-wider border-b">
                                                                Institutional Performance Matrix
                                                            </TableHead>
                                                            <TableHead colSpan={2} className="text-center font-black text-[10px] uppercase bg-amber-50/50 text-amber-700 tracking-wider border-b">Transcript Final</TableHead>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableHead className="text-center text-[9px] font-black uppercase text-muted-foreground border-r">Assessment 1 & 2</TableHead>
                                                            <TableHead className="text-center text-[9px] font-black uppercase text-muted-foreground border-r">Assessment 3 & 4</TableHead>
                                                            <TableHead className="text-center text-[9px] font-black uppercase text-primary border-r bg-blue-100/20 italic">Base Val</TableHead>
                                                            <TableHead className="text-center text-[9px] font-black uppercase text-primary border-r bg-blue-100/20 font-black">Total</TableHead>
                                                            <TableHead className="text-center text-[9px] font-black uppercase text-primary border-r bg-blue-100/20">Credits</TableHead>
                                                            <TableHead className="text-center text-[9px] font-black uppercase text-muted-foreground border-r">External</TableHead>
                                                            <TableHead className="text-center text-[10px] font-black uppercase bg-primary text-white">Grand Total</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {semCourses.map(course => {
                                                            const marks = getMarks(course.code, course.type, semNum, student.semester, course.credits);
                                                            
                                                            return (
                                                                <TableRow key={course.code} className={`hover:bg-slate-50/50 ${marks.isNonCredit ? 'bg-slate-50 opacity-80' : ''}`}>
                                                                    <TableCell className="font-mono font-bold text-[10px] border-r">{course.code}</TableCell>
                                                                    <TableCell className="font-bold border-r text-sm">
                                                                        {course.name}
                                                                        {marks.isNonCredit && !marks.isProject && <Badge variant="outline" className="ml-2 text-[8px] font-black uppercase text-muted-foreground border-slate-200 bg-white">Non-Credit</Badge>}
                                                                        {marks.isProject && <Badge variant="outline" className="ml-2 text-[8px] font-black uppercase text-indigo-600 border-indigo-200 bg-indigo-50/50">Project Review</Badge>}
                                                                    </TableCell>
                                                                    <TableCell className="text-center border-r font-medium">
                                                                        <div className="flex flex-col text-[10px]">
                                                                            <span className="text-blue-600 font-bold">{marks.isNonCredit ? '-' : marks.m1}</span>
                                                                            <span className="text-slate-400">{marks.isNonCredit ? '-' : marks.m2}</span>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="text-center border-r font-medium">
                                                                        <div className="flex flex-col text-[10px]">
                                                                            <span className="text-blue-600 font-bold">{marks.isNonCredit ? '-' : marks.a1}</span>
                                                                            <span className="text-slate-400">{marks.isNonCredit ? '-' : marks.a2}</span>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="text-center border-r font-medium text-[10px] text-slate-400">
                                                                        {marks.isNonCredit ? '-' : (marks.isProject ? 'Combined' : Math.max(marks.m1 || 0, marks.m2 || 0))}
                                                                    </TableCell>
                                                                    <TableCell className={`text-center border-r font-black ${marks.isNonCredit ? 'text-slate-300' : 'bg-blue-50/30 text-blue-700'}`}>
                                                                        {marks.isNonCredit ? '-' : (marks.isProject ? (marks.m1 + marks.m2 + marks.a1 + marks.a2) : marks.total)}
                                                                    </TableCell>
                                                                    <TableCell className="text-center border-r font-bold text-xs text-slate-500">
                                                                        {course.credits}
                                                                    </TableCell>
                                                                    <TableCell className="text-center border-r font-black text-slate-400 italic">
                                                                        {marks.isNonCredit ? '-' : (marks.isProject ? 'Viva Voce' : (marks.type === 'Lab' ? (marks as any).labExt : (marks as any).ex))}
                                                                    </TableCell>
                                                                    <TableCell className={`text-center font-black text-base ${marks.isNonCredit ? 'bg-slate-100 text-slate-400' : (isActiveSem ? 'bg-amber-50/50 text-amber-600' : 'bg-primary/10 text-primary')}`}>
                                                                        {marks.isNonCredit ? (
                                                                            <span className="text-[10px] uppercase font-black tracking-widest opacity-40">Satisfactory</span>
                                                                        ) : (
                                                                            isActiveSem ? (
                                                                                <span className="text-xs uppercase italic opacity-70">Awaiting External</span>
                                                                            ) : (
                                                                                marks.total + (marks.type === 'Lab' ? ((marks as any).labExt || 0) : ((marks as any).ex || 0))
                                                                            )
                                                                        )}
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed border-muted">
                                            <BookOpen className="w-12 h-12 text-muted-foreground/30 mb-2" />
                                            <p className="text-muted-foreground font-bold italic">Curriculum data for Semester {semNum} not found for this branch.</p>
                                        </div>
                                    )}
                                </TabsContent>
                            );
                        })}
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};


export default StudentRecords;
