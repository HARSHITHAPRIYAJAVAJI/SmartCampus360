import { useState, useMemo, useEffect } from 'react';
import Layout from "@/components/common/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Mail, Phone, BookOpen, GraduationCap, Users, ArrowLeft, Building2, Plus, Edit, Trash2, LayoutGrid, List, Grip, X } from "lucide-react";
import { FACULTY_LOAD } from "@/data/aimlTimetable";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Types
interface FacultyMember {
    id: string;
    name: string;
    designation: string; // Inferred or generic
    department: string;
    subjects: string[];
    totalLoad: number;
    email?: string;
    phone?: string;
}

const FacultyManagement = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const [selectedDept, setSelectedDept] = useState<string | null>(null);

    const departments = [
        { id: "AIML", name: "Artificial Intelligence & Machine Learning", icon: Building2, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30", description: "Departement of AI & ML" },
        { id: "CSE", name: "Computer Science & Engineering", icon: Building2, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30", description: "Department of CSE" },
        { id: "ECE", name: "Electronics & Communication", icon: Building2, color: "text-green-600 bg-green-100 dark:bg-green-900/30", description: "Department of ECE" },
        { id: "EEE", name: "Electrical & Electronics", icon: Building2, color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30", description: "Department of EEE" },
        { id: "CIVIL", name: "Civil Engineering", icon: Building2, color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30", description: "Department of Civil Eng" },
        { id: "MECH", name: "Mechanical Engineering", icon: Building2, color: "text-red-600 bg-red-100 dark:bg-red-900/30", description: "Department of Mechanical Eng" },
    ];

    // Process FACULTY_LOAD to extract unique faculty members
    const { toast } = useToast();
    const [facultyList, setFacultyList] = useState<FacultyMember[]>([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentFaculty, setCurrentFaculty] = useState<FacultyMember | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');

    // Form State
    const [formData, setFormData] = useState<Partial<FacultyMember>>({});

    // Initialize Data
    useEffect(() => {
        if (!selectedDept) return;

        // This simulates fetching data from an API
        if (selectedDept === 'AIML' && facultyList.length === 0) {
            const facultyMap = new Map<string, FacultyMember>();
            const hodName = "Dr. B. Sunil Srinivas"; // Updated HOD

            Object.entries(FACULTY_LOAD).forEach(([semester, subjects]) => {
                subjects.forEach((subj) => {
                    const name = subj.faculty.trim();
                    if (!name || name === "Guest/Faculty" || name === "All Staff") return;

                    if (!facultyMap.has(name)) {
                        let designation = "Assistant Professor";
                        if (name.startsWith("Dr.")) designation = "Associate Professor";
                        if (name.includes("Prof.")) designation = "Professor";
                        if (name === hodName) designation = "Head of Department (HOD)";

                        facultyMap.set(name, {
                            id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                            name: name,
                            designation: designation,
                            department: "AIML",
                            subjects: [],
                            totalLoad: 0,
                            email: `${name.split(' ').pop()?.toLowerCase()}@smartcampus.edu`,
                            phone: "+91 98XXX XXXXX"
                        });
                    }

                    const member = facultyMap.get(name)!;
                    const subjectEntry = `${subj.code} (${semester})`;
                    if (!member.subjects.includes(subjectEntry)) {
                        member.subjects.push(subjectEntry);
                    }
                    member.totalLoad += 1;
                });
            });

            // Convert map to array
            const initialList = Array.from(facultyMap.values());
            setFacultyList(initialList);
        }
    }, [selectedDept]);

    const sortedFaculty = useMemo(() => {
        const hodName = "Dr. B. Sunil Srinivas";
        const list = [...facultyList];
        return list.sort((a, b) => {
            if (a.name === hodName) return -1;
            if (b.name === hodName) return 1;
            return a.name.localeCompare(b.name);
        });
    }, [facultyList]);

    const allSubjects = useMemo(() => {
        const subjects = new Set<string>();
        Object.values(FACULTY_LOAD).forEach(semData => {
            semData.forEach(item => subjects.add(item.code));
        });
        return Array.from(subjects).sort();
    }, []);

    // Handlers
    const handleAdd = () => {
        const newFaculty: FacultyMember = {
            id: `new-${Date.now()}`,
            name: formData.name || "New Faculty",
            designation: formData.designation || "Assistant Professor",
            department: selectedDept || "AIML",
            subjects: formData.subjects ? (typeof formData.subjects === 'string' ? (formData.subjects as string).split(',') : formData.subjects) : [],
            totalLoad: 0,
            email: formData.email,
            phone: formData.phone
        };
        setFacultyList([...facultyList, newFaculty]);
        setIsAddOpen(false);
        setFormData({});
        toast({ title: "Faculty Added", description: `${newFaculty.name} has been added.` });
    };

    const handleEdit = () => {
        if (!currentFaculty) return;

        const updatedList = facultyList.map(f =>
            f.id === currentFaculty.id ? { ...f, ...formData } : f
        );
        setFacultyList(updatedList as FacultyMember[]);
        setIsEditOpen(false);
        setCurrentFaculty(null);
        setFormData({});
        toast({ title: "Faculty Updated", description: "Details saved successfully." });
    };

    const handleDelete = (id: string) => {
        setFacultyList(facultyList.filter(f => f.id !== id));
        toast({ title: "Faculty Removed", variant: "destructive", description: "Faculty member has been removed." });
    };

    const openEdit = (faculty: FacultyMember) => {
        setCurrentFaculty(faculty);
        setFormData({ ...faculty });
        setIsEditOpen(true);
    };

    const filteredFaculty = sortedFaculty.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (!selectedDept) {
        return (
            <div className="space-y-8 animate-in fade-in-50">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight">Faculty Departments</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Select a department to view faculty members, teaching assignments, and contact information.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {departments.map((dept) => (
                        <Card
                            key={dept.id}
                            className="group hover:shadow-xl transition-all cursor-pointer border-muted/60 overflow-hidden"
                            onClick={() => setSelectedDept(dept.id)}
                        >
                            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${dept.color} group-hover:scale-110 transition-transform duration-300`}>
                                    <dept.icon className="h-8 w-8" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl mb-2">{dept.name}</h3>
                                    <p className="text-sm text-muted-foreground">{dept.description}</p>
                                </div>
                                <Button variant="ghost" className="group-hover:translate-x-1 transition-transform">
                                    View Faculty <Users className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in-50 slide-in-from-right-10">
            <Button variant="ghost" onClick={() => setSelectedDept(null)} className="mb-4 pl-0 hover:pl-2 transition-all">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Departments
            </Button>

            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        {departments.find(d => d.id === selectedDept)?.name}
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Faculty Directory & Resource Management
                    </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    {/* Search and Add Buttons */}
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search faculty..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add Faculty
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Faculty</DialogTitle>
                                <DialogDescription>Enter details for the new faculty member.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">Name</Label>
                                    <Input id="name" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="desig" className="text-right">Designation</Label>
                                    <Select onValueChange={(v) => setFormData({ ...formData, designation: v })}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select designation" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Professor">Professor</SelectItem>
                                            <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                                            <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="email" className="text-right">Email</Label>
                                    <Input id="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAdd}>Save Faculty</Button>
                            </DialogFooter>
                        </DialogContent>

                    </Dialog>

                    <div className="flex bg-muted p-1 rounded-lg border">
                        <Button
                            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => setViewMode('grid')}
                            title="Grid View"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => setViewMode('list')}
                            title="List View"
                        >
                            <List className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'compact' ? 'secondary' : 'ghost'}
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => setViewMode('compact')}
                            title="Compact View"
                        >
                            <Grip className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Edit Dialog (Hidden) */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Faculty Details</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">Name</Label>
                            <Input id="edit-name" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-desig" className="text-right">Designation</Label>
                            <Select value={formData.designation} onValueChange={(v) => setFormData({ ...formData, designation: v })}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select designation" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Professor">Professor</SelectItem>
                                    <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                                    <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                                    <SelectItem value="Head of Department (HOD)">Head of Department (HOD)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-email" className="text-right">Email</Label>
                            <Input id="edit-email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-phone" className="text-right">Phone</Label>
                            <Input id="edit-phone" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label className="text-right mt-2">Subjects</Label>
                            <div className="col-span-3 space-y-3">
                                <div className="flex flex-wrap gap-2">
                                    {formData.subjects?.map((subject, index) => (
                                        <Badge key={index} variant="secondary" className="flex items-center gap-1 cursor-default">
                                            {subject}
                                            <button
                                                onClick={() => {
                                                    const newSubjects = formData.subjects?.filter(s => s !== subject);
                                                    setFormData({ ...formData, subjects: newSubjects });
                                                }}
                                                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                            >
                                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                                <Select onValueChange={(value) => {
                                    if (formData.subjects?.includes(value)) return;
                                    setFormData({ ...formData, subjects: [...(formData.subjects || []), value] });
                                }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Add Subject..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {allSubjects.map(sub => <SelectItem key={sub} value={sub}>{sub}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleEdit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-none shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Faculty</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">{facultyList.length}</div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-none shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-purple-700 dark:text-purple-400">
                            {facultyList.reduce((acc, curr) => acc + curr.subjects.length, 0)}
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-none shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Load</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">100%</div>
                    </CardContent>
                </Card>
            </div>

            {/* Faculty Grid */}
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' :
                viewMode === 'list' ? 'grid-cols-1' :
                    'grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'
                }`}>
                {filteredFaculty.map((faculty) => (
                    <Card key={faculty.id} className={`group hover:shadow-lg transition-all border-muted/60 overflow-hidden ${faculty.designation.includes('HOD') ? 'ring-2 ring-primary relative' : ''
                        } ${viewMode === 'list' ? 'flex flex-row items-center' : ''}`}>

                        {/* HOD Label */}
                        {faculty.designation.includes('HOD') && (
                            <div className={`absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-xl z-20 shadow-md ${viewMode === 'list' ? 'rounded-tr-none' : ''}`}>
                                HOD
                            </div>
                        )}

                        <CardContent className={`p-0 w-full ${viewMode === 'list' ? 'flex items-center gap-6 p-4' : ''}`}>

                            {/* Avatar Section */}
                            <div className={`
                                ${viewMode === 'list' ? 'relative shrink-0' : 'bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative'}
                                ${viewMode === 'grid' ? 'h-24' : viewMode === 'compact' ? 'h-16' : ''}
                            `}>
                                <div className={`
                                    ${viewMode === 'grid' ? 'absolute -bottom-10 left-6 border-4 border-background rounded-full shadow-md' : ''}
                                    ${viewMode === 'compact' ? 'absolute -bottom-8 left-1/2 -translate-x-1/2 border-4 border-background rounded-full shadow-md' : ''}
                                    ${viewMode === 'list' ? 'border-2 border-background rounded-full shadow-sm' : ''}
                                `}>
                                    <Avatar className={`
                                        ${viewMode === 'grid' ? 'h-20 w-20' : ''}
                                        ${viewMode === 'compact' ? 'h-16 w-16' : ''}
                                        ${viewMode === 'list' ? 'h-14 w-14' : ''}
                                    `}>
                                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${faculty.name}`} />
                                        <AvatarFallback>{faculty.name.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className={`
                                ${viewMode === 'grid' ? 'pt-12 px-6 pb-6 space-y-4' : ''}
                                ${viewMode === 'compact' ? 'pt-10 px-3 pb-3 space-y-2 text-center' : ''}
                                ${viewMode === 'list' ? 'flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center' : ''}
                            `}>
                                {/* Name & Desig */}
                                <div className={viewMode === 'list' ? 'col-span-1' : ''}>
                                    <h3 className={`font-bold line-clamp-1 group-hover:text-primary transition-colors ${viewMode === 'compact' ? 'text-sm' : 'text-xl'}`}>{faculty.name}</h3>
                                    <p className={`text-sm text-muted-foreground flex items-center gap-2 font-medium ${viewMode === 'compact' ? 'justify-center text-xs' : ''}`}>
                                        {!viewMode.includes('compact') && <GraduationCap className="h-3 w-3" />} {faculty.designation}
                                    </p>
                                </div>

                                {/* Contact Details (Hidden in Compact) */}
                                {viewMode !== 'compact' && (
                                    <div className={`space-y-2 ${viewMode === 'list' ? 'col-span-1 border-l pl-4 space-y-1' : ''}`}>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Mail className="h-3 w-3" /> {faculty.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Phone className="h-3 w-3" /> {faculty.phone}
                                        </div>
                                    </div>
                                )}

                                {/* Subjects (Hidden in Compact) */}
                                {viewMode !== 'compact' && (
                                    <div className={`${viewMode === 'list' ? 'col-span-1 border-l pl-4' : 'pt-2'}`}>
                                        {viewMode === 'grid' && (
                                            <div className="text-xs font-semibold uppercase text-muted-foreground mb-2 flex items-center gap-2">
                                                <BookOpen className="h-3 w-3" /> Teaching Subjects
                                            </div>
                                        )}
                                        <div className="flex flex-wrap gap-1.5">
                                            {faculty.subjects.slice(0, viewMode === 'list' ? 3 : 5).map((subject, i) => (
                                                <Badge key={i} variant="secondary" className="px-2 py-0.5 text-xs font-normal">
                                                    {subject}
                                                </Badge>
                                            ))}
                                            {faculty.subjects.length > (viewMode === 'list' ? 3 : 5) && (
                                                <Badge variant="outline" className="text-xs">+{faculty.subjects.length - (viewMode === 'list' ? 3 : 5)}</Badge>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Load & Actions */}
                                <div className={`
                                    ${viewMode === 'grid' ? 'pt-4 mt-2 border-t flex justify-between items-center text-sm' : ''}
                                    ${viewMode === 'compact' ? 'pt-2 mt-2 border-t flex justify-center items-center text-xs' : ''}
                                    ${viewMode === 'list' ? 'col-span-1 flex justify-end gap-4 items-center' : ''}
                                `}>
                                    {viewMode !== 'compact' && <span className="text-muted-foreground">Total Classes:</span>}
                                    <Badge variant="outline" className="font-mono">{faculty.totalLoad}</Badge>

                                    <div className={`flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${viewMode === 'grid' ? '' : 'ml-2'}`}>
                                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openEdit(faculty); }} className="h-8 w-8 p-0">
                                            <Edit className="h-4 w-4 text-primary" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(faculty.id); }} className="h-8 w-8 p-0">
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {
                filteredFaculty.length === 0 && (
                    <div className="text-center py-12">
                        {selectedDept === 'AIML' ? (
                            <p className="text-muted-foreground">No faculty members found matching your search.</p>
                        ) : (
                            <div className="text-center space-y-4">
                                <p className="text-xl text-muted-foreground">No data available for this department yet.</p>
                                <p className="text-sm text-muted-foreground">Please select "Artificial Intelligence & Machine Learning" to view demo data.</p>
                            </div>
                        )}
                    </div>
                )
            }
        </div >
    );
};

export default FacultyManagement;
