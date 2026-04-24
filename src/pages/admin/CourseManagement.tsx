import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_COURSES, Course } from "@/data/mockCourses";
import { formatSubjectName } from "@/data/subjectMapping";
import { dataPersistence } from "@/utils/dataPersistence";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface CourseManagementProps {
    readOnly?: boolean;
}

const CourseManagement = ({ readOnly = false }: CourseManagementProps) => {
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDept, setSelectedDept] = useState<string | null>(null);

    // State
    const [courses, setCourses] = useState<Course[]>([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
    const [formData, setFormData] = useState<Partial<Course>>({});

    const departments = [
        { id: "CSE", name: "Computer Science", color: "text-blue-600 bg-blue-50" },
        { id: "CSM", name: "CSE (AI & ML)", color: "text-purple-600 bg-purple-50" },
        { id: "IT", name: "Information Technology", color: "text-cyan-600 bg-cyan-50" },
        { id: "ECE", name: "Electronics & Comm", color: "text-orange-600 bg-orange-50" },
    ];

    useEffect(() => {
        const load = () => setCourses(dataPersistence.getCourses());
        load();
        window.addEventListener('dynamic_data_updated', load);
        return () => window.removeEventListener('dynamic_data_updated', load);
    }, []);

    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const matchesDept = selectedDept ? course.department === selectedDept : true;
            const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.code.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesDept && matchesSearch;
        });
    }, [courses, selectedDept, searchQuery]);

    // Handlers
    const handleAdd = () => {
        if (!formData.code || !formData.name) {
            toast({ title: "Error", description: "Course code and name are required.", variant: "destructive" });
            return;
        }

        const exists = courses.some(c => c.code.toUpperCase() === formData.code?.toUpperCase());
        if (exists) {
            toast({ title: "Duplicate Entry", description: `Course code ${formData.code} already exists.`, variant: "destructive" });
            return;
        }

        const newCourse: Course = {
            id: `course-${Date.now()}`,
            name: formData.name || "New Course",
            code: formData.code?.toUpperCase() || "NEW101",
            credits: Number(formData.credits) || 3,
            type: formData.type || "Theory",
            department: selectedDept || formData.department || "CSM",
            semester: Number(formData.semester) || 1,
            is_active: true,
            deleted_at: null
        } as any;
        
        const all = dataPersistence.getAllCourses();
        dataPersistence.saveCourses([newCourse, ...all]);
        setIsAddOpen(false);
        setFormData({});
        toast({ title: "Course Added", description: `${newCourse.code} added successfully.` });
    };

    const handleEdit = () => {
        if (!currentCourse) return;
        const all = dataPersistence.getAllCourses();
        const updated = all.map(c => c.id === currentCourse.id ? { ...c, ...formData } : c);
        dataPersistence.saveCourses(updated);
        setIsEditOpen(false);
        setCurrentCourse(null);
        setFormData({});
        toast({ title: "Course Updated", description: "Changes saved." });
    };

    const handleDelete = (id: string) => {
        const all = dataPersistence.getAllCourses();
        const updated = all.map(c => c.id === id ? { ...c, is_active: false, deleted_at: new Date().toISOString() } : c);
        dataPersistence.saveCourses(updated);
        toast({ title: "Moved to Trash", variant: "destructive", description: "Course moved to Recycle Bin." });
    };

    const openEdit = (course: Course) => {
        setCurrentCourse(course);
        setFormData({ ...course });
        setIsEditOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in-50 slide-in-from-right-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Course Catalog</h1>
                    <p className="text-muted-foreground">Manage and organize all curriculum subjects across branches.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Enter subject code or name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    {!readOnly && (
                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-primary hover:bg-primary/90 shadow-sm border-b-2 border-primary-foreground/20">
                                    <Plus className="mr-2 h-4 w-4" /> New Subject
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Subject</DialogTitle>
                                    <DialogDescription>Enter the details for the new curriculum entry.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right font-medium">Code</Label>
                                        <Input value={formData.code || ''} onChange={e => setFormData({ ...formData, code: e.target.value })} className="col-span-3" placeholder="e.g. 4B1AA" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right font-medium">Name</Label>
                                        <Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="col-span-3" placeholder="Subject Title" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right font-medium">Dept</Label>
                                        <Select onValueChange={v => setFormData({ ...formData, department: v })}>
                                            <SelectTrigger className="col-span-3"><SelectValue placeholder="Select Branch" /></SelectTrigger>
                                            <SelectContent>
                                                {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.id}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right font-medium">Credits</Label>
                                        <Input type="number" value={formData.credits || ''} onChange={e => setFormData({ ...formData, credits: Number(e.target.value) })} className="col-span-3" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right font-medium">Type</Label>
                                        <Select onValueChange={v => setFormData({ ...formData, type: v as any })}>
                                            <SelectTrigger className="col-span-3"><SelectValue placeholder="Select Type" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Theory">Theory</SelectItem>
                                                <SelectItem value="Lab">Lab</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right font-medium">Sem</Label>
                                        <Select onValueChange={v => setFormData({ ...formData, semester: Number(v) })}>
                                            <SelectTrigger className="col-span-3"><SelectValue placeholder="Semester" /></SelectTrigger>
                                            <SelectContent>
                                                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <SelectItem key={s} value={s.toString()}>{s}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter><Button onClick={handleAdd}>Add Entry</Button></DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>

            <div className="flex gap-2 p-1 bg-muted/30 rounded-xl w-fit">
                <Button 
                    variant={selectedDept === null ? "default" : "ghost"} 
                    size="sm" 
                    onClick={() => setSelectedDept(null)}
                    className="rounded-lg h-8 px-4"
                >
                    All
                </Button>
                {departments.map((dept) => (
                    <Button 
                        key={dept.id} 
                        variant={selectedDept === dept.id ? "default" : "ghost"} 
                        size="sm" 
                        onClick={() => setSelectedDept(dept.id)}
                        className="rounded-lg h-8 px-4 whitespace-nowrap"
                    >
                        {dept.id}
                    </Button>
                ))}
            </div>

            <Card className="border-border/60 shadow-sm overflow-hidden">
                <Tabs defaultValue="1" className="w-full">
                    <TabsList className="w-full justify-start rounded-none border-b h-12 bg-muted/10 p-0">
                        <TabsTrigger value="1" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 h-full">Year 1</TabsTrigger>
                        <TabsTrigger value="2" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 h-full">Year 2</TabsTrigger>
                        <TabsTrigger value="3" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 h-full">Year 3</TabsTrigger>
                        <TabsTrigger value="4" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 h-full">Year 4</TabsTrigger>
                    </TabsList>

                    {[1, 2, 3, 4].map((year) => {
                        const semesters = [year * 2 - 1, year * 2];
                        return (
                            <TabsContent key={year} value={year.toString()} className="m-0 p-0">
                                {semesters.map((sem) => {
                                    const semesterCourses = filteredCourses.filter(c => c.semester === sem);

                                    return (
                                        <div key={sem} className="border-b last:border-0 overflow-x-auto">
                                            <div className="px-6 py-3 bg-muted/5 flex items-center gap-3">
                                                <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Semester {sem}</h2>
                                                <Badge variant="outline" className="bg-background font-mono text-[10px]">{semesterCourses.length}</Badge>
                                            </div>

                                            <Table>
                                                <TableHeader className="bg-muted/30">
                                                    <TableRow className="hover:bg-transparent border-border/40">
                                                        <TableHead className="w-[100px] font-bold">Code</TableHead>
                                                        <TableHead className="font-bold">Subject Name</TableHead>
                                                        <TableHead className="w-[100px] font-bold text-center">Type</TableHead>
                                                        <TableHead className="w-[100px] font-bold text-center">Dept</TableHead>
                                                        <TableHead className="w-[80px] font-bold text-center">Credits</TableHead>
                                                        {!readOnly && <TableHead className="w-[100px] text-right font-bold">Actions</TableHead>}
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {semesterCourses.length > 0 ? (
                                                        semesterCourses.map((course) => (
                                                            <TableRow key={course.id} className="hover:bg-primary/5 transition-colors group">
                                                                <TableCell className="font-mono text-xs font-bold text-primary">{course.code}</TableCell>
                                                                <TableCell>
                                                                    <div className="flex flex-col">
                                                                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{formatSubjectName(course.name)}</span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="text-center">
                                                                    <Badge variant={course.type === 'Lab' ? 'secondary' : 'outline'} className={`text-[10px] uppercase font-black tracking-tighter ${course.type === 'Lab' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                                                        {course.type}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="text-center">
                                                                    <span className="text-[10px] font-bold opacity-60">{course.department}</span>
                                                                </TableCell>
                                                                <TableCell className="text-center">
                                                                    <span className="font-mono font-bold text-muted-foreground">{course.credits}</span>
                                                                </TableCell>
                                                                {!readOnly && (
                                                                    <TableCell className="text-right">
                                                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => openEdit(course)}>
                                                                                <Edit className="h-4 w-4" />
                                                                            </Button>
                                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(course.id)}>
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>
                                                                    </TableCell>
                                                                )}
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell colSpan={readOnly ? 5 : 6} className="h-24 text-center text-muted-foreground italic">
                                                                No courses defined for Semester {sem}.
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    );
                                })}
                            </TabsContent>
                        );
                    })}
                </Tabs>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Course</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Code</Label>
                            <Input value={formData.code || ''} onChange={e => setFormData({ ...formData, code: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Name</Label>
                            <Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Credits</Label>
                            <Input type="number" value={formData.credits || ''} onChange={e => setFormData({ ...formData, credits: Number(e.target.value) })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Type</Label>
                            <Select value={formData.type} onValueChange={v => setFormData({ ...formData, type: v as any })}>
                                <SelectTrigger className="col-span-3"><SelectValue placeholder="Select Type" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Theory">Theory</SelectItem>
                                    <SelectItem value="Lab">Lab</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Semester</Label>
                            <Select value={formData.semester?.toString()} onValueChange={v => setFormData({ ...formData, semester: Number(v) })}>
                                <SelectTrigger className="col-span-3"><SelectValue placeholder="Select Semester" /></SelectTrigger>
                                <SelectContent>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <SelectItem key={s} value={s.toString()}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleEdit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CourseManagement;
