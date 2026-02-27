import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Clock, Building2, Plus, Edit, Trash2, GraduationCap, ArrowLeft } from "lucide-react";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_COURSES, Course } from "@/data/mockCourses";

const CourseManagement = () => {
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
        { id: "AIML", name: "Artificial Intelligence & ML", icon: Building2, color: "text-blue-600 bg-blue-100" },
        { id: "CSE", name: "Computer Science", icon: Building2, color: "text-purple-600 bg-purple-100" },
        { id: "ECE", name: "Electronics & Comm", icon: Building2, color: "text-green-600 bg-green-100" },
    ];

    useEffect(() => {
        // Load mock data
        setCourses(MOCK_COURSES);
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
        const newCourse: Course = {
            id: `new-${Date.now()}`,
            name: formData.name || "New Course",
            code: formData.code?.toUpperCase() || "NEW101",
            credits: Number(formData.credits) || 3,
            type: formData.type || "Theory",
            department: selectedDept || formData.department || "AIML",
            semester: Number(formData.semester) || 1
        };
        setCourses([...courses, newCourse]);
        setIsAddOpen(false);
        setFormData({});
        toast({ title: "Course Added", description: `${newCourse.code} added successfully.` });
    };

    const handleEdit = () => {
        if (!currentCourse) return;
        const updatedList = courses.map(c => c.id === currentCourse.id ? { ...c, ...formData } as Course : c);
        setCourses(updatedList);
        setIsEditOpen(false);
        setCurrentCourse(null);
        setFormData({});
        toast({ title: "Course Updated", description: "Changes saved." });
    };

    const handleDelete = (id: string) => {
        setCourses(courses.filter(c => c.id !== id));
        toast({ title: "Course Deleted", variant: "destructive", description: "Course removed from catalog." });
    };

    const openEdit = (course: Course) => {
        setCurrentCourse(course);
        setFormData({ ...course });
        setIsEditOpen(true);
    };

    if (!selectedDept) {
        return (
            <div className="space-y-8 animate-in fade-in-50">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight">Course Catalog</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Manage academic courses, credits, and curriculum details by department.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {departments.map((dept) => (
                        <Card
                            key={dept.id}
                            className="group hover:shadow-xl transition-all cursor-pointer border-muted/60"
                            onClick={() => setSelectedDept(dept.id)}
                        >
                            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${dept.color} group-hover:scale-110 transition-transform`}>
                                    <dept.icon className="h-8 w-8" />
                                </div>
                                <h3 className="font-bold text-xl">{dept.name}</h3>
                                <Button variant="ghost">View Courses</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in-50 slide-in-from-right-10">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => setSelectedDept(null)} className="pl-0">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <h1 className="text-3xl font-bold text-primary">{departments.find(d => d.id === selectedDept)?.name}</h1>
            </div>

            <div className="flex justify-between items-center gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by code or name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Course
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Course</DialogTitle>
                            <DialogDescription>Define a new course for the curriculum.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Code</Label>
                                <Input value={formData.code || ''} onChange={e => setFormData({ ...formData, code: e.target.value })} className="col-span-3" placeholder="e.g. CS101" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Name</Label>
                                <Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="col-span-3" placeholder="e.g. Intro to CS" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Credits</Label>
                                <Input type="number" value={formData.credits || ''} onChange={e => setFormData({ ...formData, credits: Number(e.target.value) })} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Type</Label>
                                <Select onValueChange={v => setFormData({ ...formData, type: v as any })}>
                                    <SelectTrigger className="col-span-3"><SelectValue placeholder="Select Type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Theory">Theory</SelectItem>
                                        <SelectItem value="Lab">Lab</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Semester</Label>
                                <Select onValueChange={v => setFormData({ ...formData, semester: Number(v) })}>
                                    <SelectTrigger className="col-span-3"><SelectValue placeholder="Select Semester" /></SelectTrigger>
                                    <SelectContent>
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <SelectItem key={s} value={s.toString()}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter><Button onClick={handleAdd}>Add Course</Button></DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Year & Semester Organization */}
            <Tabs defaultValue="1" className="w-full">
                <div className="flex justify-between items-center mb-6">
                    <TabsList className="grid w-full grid-cols-4 md:w-[400px]">
                        <TabsTrigger value="1">Year 1</TabsTrigger>
                        <TabsTrigger value="2">Year 2</TabsTrigger>
                        <TabsTrigger value="3">Year 3</TabsTrigger>
                        <TabsTrigger value="4">Year 4</TabsTrigger>
                    </TabsList>
                </div>

                {[1, 2, 3, 4].map((year) => {
                    // Calculate semesters for this year (e.g., Year 1 -> [1, 2])
                    const semesters = [year * 2 - 1, year * 2];

                    return (
                        <TabsContent key={year} value={year.toString()} className="space-y-8 animate-in fade-in-50">
                            {semesters.map((sem) => {
                                const semesterCourses = filteredCourses.filter(c => c.semester === sem);

                                return (
                                    <div key={sem} className="space-y-4">
                                        <div className="flex items-center gap-2 pb-2 border-b">
                                            <h2 className="text-xl font-semibold text-primary">Semester {sem}</h2>
                                            <Badge variant="secondary" className="ml-2">{semesterCourses.length} Courses</Badge>
                                        </div>

                                        {semesterCourses.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                                {semesterCourses.map(course => (
                                                    <Card key={course.id} className="hover:shadow-md transition-all group">
                                                        <CardContent className="p-4 flex flex-col justify-between h-full gap-4">
                                                            <div className="flex items-start gap-3">
                                                                <div className={`p-2.5 rounded-lg shrink-0 ${course.type === 'Lab' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                                                    <BookOpen className="h-5 w-5" />
                                                                </div>
                                                                <div>
                                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                                        <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors">{course.name}</h3>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Badge variant="outline" className="text-xs">{course.code}</Badge>
                                                                        {course.type === 'Lab' && <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 hover:bg-orange-200">Lab</Badge>}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between pt-2 mt-auto border-t">
                                                                <div className="text-xs text-muted-foreground flex items-center gap-3">
                                                                    <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded"><GraduationCap className="h-3 w-3" /> {course.credits} Credits</span>
                                                                </div>
                                                                <div className="flex gap-1">
                                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-primary" onClick={() => openEdit(course)}>
                                                                        <Edit className="h-3.5 w-3.5" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-destructive" onClick={() => handleDelete(course.id)}>
                                                                        <Trash2 className="h-3.5 w-3.5" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-muted-foreground text-sm italic py-4 bg-muted/30 rounded-lg text-center border border-dashed">
                                                No courses found for Semester {sem}.
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </TabsContent>
                    );
                })}
            </Tabs>

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
