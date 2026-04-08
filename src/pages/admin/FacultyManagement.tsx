import { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Mail, Phone, BookOpen, GraduationCap, Users, User, ArrowLeft, Building2, Plus, Edit, Trash2, LayoutGrid, List, Grip, X, Clock, Check, X as XIcon, Upload } from "lucide-react";
import { FACULTY_LOAD } from "@/data/aimlTimetable";
import { MOCK_FACULTY } from "@/data/mockFaculty";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_LEAVE_REQUESTS, LeaveRequest } from "@/data/mockLeaves";

// Types
interface FacultyMember {
    id: string;
    name: string;
    rollNumber: string;
    designation: string;
    department: string;
    subjects: string[];
    totalLoad: number;
    email?: string;
    phone?: string;
}

interface FacultyManagementProps {
    userRole?: string;
}

const FacultyManagement = ({ userRole = 'admin' }: FacultyManagementProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDept, setSelectedDept] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const departments = useMemo(() => [
        { id: "CSM", name: "CSE (AI & Machine Learning)", icon: BookOpen, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30", description: "Department of AI & ML" },
        { id: "IT", name: "Information Technology", icon: Building2, color: "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30", description: "Department of IT" },
        { id: "CSE", name: "Computer Science & Engineering", icon: GraduationCap, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30", description: "Department of CSE" },
        { id: "ECE", name: "Electronics & Communication", icon: Clock, color: "text-green-600 bg-green-100 dark:bg-green-100/30", description: "Department of ECE" },
    ].map(dept => ({
        ...dept,
        count: MOCK_FACULTY.filter(f => f.department === dept.id).length
    })), []);

    const { toast } = useToast();
    const [facultyList, setFacultyList] = useState<FacultyMember[]>([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentFaculty, setCurrentFaculty] = useState<FacultyMember | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');
    const [formData, setFormData] = useState<Partial<FacultyMember>>({});

    // Leave Management State
    const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);

    const filteredLeaves = useMemo(() => {
        return pendingLeaves.filter(leave => {
            const faculty = MOCK_FACULTY.find(f => f.id === leave.facultyId || f.name === leave.facultyName);
            return faculty?.department === selectedDept;
        });
    }, [pendingLeaves, selectedDept]);

    const handleLeaveAction = (id: string, status: 'Approved' | 'Rejected') => {
        setPendingLeaves(prev => prev.map(l => l.id === id ? { ...l, status } : l));
        toast({
            title: `Leave ${status}`,
            description: `The request has been marked as ${status.toLowerCase()}.`,
            variant: status === 'Rejected' ? 'destructive' : 'default'
        });
    };

    useEffect(() => {
        if (!selectedDept) {
            setFacultyList([]);
            return;
        }

        const facultyMap = new Map<string, FacultyMember>();
        MOCK_FACULTY.filter(f => f.department === selectedDept).forEach(faculty => {
            facultyMap.set(faculty.name, {
                ...faculty,
                subjects: faculty.specialization || [],
                totalLoad: 0
            });
        });

        Object.entries(FACULTY_LOAD).forEach(([key, subjects]) => {
            const isMatch = (selectedDept === 'CSM' && (/^\d/.test(key) || key.startsWith('CSM-'))) || 
                           (key.startsWith(`${selectedDept}-`));
            
            if (isMatch) {
                subjects.forEach((subj) => {
                    const name = subj.faculty.trim();
                    if (!name || name === "Guest/Faculty" || name === "Staff" || name === "Guest Faculty") return;
                    if (facultyMap.has(name)) {
                        const f = facultyMap.get(name)!;
                        f.totalLoad += 3;
                    }
                });
            }
        });

        setFacultyList(Array.from(facultyMap.values()));
    }, [selectedDept]);

    const filteredFaculty = useMemo(() => {
        return facultyList.filter(f =>
            f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [facultyList, searchQuery]);

    const handleAdd = () => {
        if (!formData.name || !formData.rollNumber) {
            toast({ title: "Error", description: "Name and Staff ID are required", variant: "destructive" });
            return;
        }
        const newFaculty = {
            ...formData,
            id: Date.now().toString(),
            subjects: formData.subjects || [],
            totalLoad: 0,
            department: selectedDept || "CSM"
        } as FacultyMember;

        setFacultyList([newFaculty, ...facultyList]);
        setIsAddOpen(false);
        setFormData({});
        toast({ title: "Success", description: "Faculty member added successfully" });
    };

    const handleBulkUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const lines = text.split('\n');
            const newFacultyBatch: FacultyMember[] = [];
            
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                const [name, id, email, phone, designation] = line.split(',');
                if (name && id) {
                    newFacultyBatch.push({
                        id: `bulk-${Date.now()}-${i}`,
                        name: name.trim(),
                        rollNumber: id.trim(),
                        email: email?.trim(),
                        phone: phone?.trim(),
                        designation: designation?.trim() || 'Assistant Professor',
                        department: selectedDept || 'CSM',
                        subjects: [],
                        totalLoad: 0
                    });
                }
            }

            if (newFacultyBatch.length > 0) {
                setFacultyList([...newFacultyBatch, ...facultyList]);
                toast({ 
                    title: "Import Finished", 
                    description: `Added ${newFacultyBatch.length} faculty members to ${selectedDept}.` 
                });
            }
        };
        reader.readAsText(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleEdit = () => {
        if (!currentFaculty) return;
        setFacultyList(prev => prev.map(f => f.id === currentFaculty.id ? { ...f, ...formData } : f));
        setIsEditOpen(false);
        setCurrentFaculty(null);
        setFormData({});
        toast({ title: "Success", description: "Faculty record updated" });
    };

    const handleDelete = (id: string) => {
        setFacultyList(prev => prev.filter(f => f.id !== id));
        toast({ title: "Deleted", description: "Faculty member removed", variant: "destructive" });
    };

    if (!selectedDept) {
        return (
            <div className="space-y-8 animate-in fade-in-50 duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-primary">Departmental Faculty</h1>
                        <p className="text-muted-foreground mt-1">Select a department to manage staff and academic load.</p>
                    </div>
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
                                    <h3 className="font-bold text-xl mb-1">{dept.name}</h3>
                                    <Badge variant="secondary" className="font-bold bg-primary/10 text-primary">
                                        {dept.count} Faculty Members
                                    </Badge>
                                </div>
                                <Button variant="ghost">View Faculty <Users className="ml-2 h-4 w-4" /></Button>
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
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                        {departments.find(d => d.id === selectedDept)?.name}
                    </h1>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <input type="file" ref={fileInputRef} onChange={handleBulkUpload} accept=".csv" className="hidden" />
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search faculty..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
                    </div>

                    {userRole === 'admin' && (
                        <>
                            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                                <Upload className="mr-2 h-4 w-4" /> Import CSV
                            </Button>
                            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                                <DialogTrigger asChild>
                                    <Button><Plus className="mr-2 h-4 w-4" /> Add Faculty</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Add Faculty</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-6 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Full Name</Label>
                                                <Input onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Staff ID</Label>
                                                <Input onChange={e => setFormData({ ...formData, rollNumber: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Email</Label>
                                                <Input type="email" onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Phone</Label>
                                                <Input onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleAdd}>Save</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </>
                    )}
                </div>
            </div>

            <Tabs defaultValue="directory" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="directory">Active Directory</TabsTrigger>
                    <TabsTrigger value="leaves">Leaves</TabsTrigger>
                </TabsList>

                <TabsContent value="directory" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredFaculty.map((faculty) => (
                            <Card key={faculty.id} className="group hover:border-primary/50 transition-all border-muted/60">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-sm">
                                            <AvatarFallback className="bg-primary/5">
                                                <User className="h-6 w-6 text-primary/70" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setCurrentFaculty(faculty); setFormData(faculty); setIsEditOpen(true); }}><Edit className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => handleDelete(faculty.id)}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-start mt-4">
                                        <div>
                                            <CardTitle className="text-xl font-black text-foreground">{faculty.name}</CardTitle>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest text-primary border-primary/20 bg-primary/5">
                                                    ID: {faculty.rollNumber}
                                                </Badge>
                                                <span className="text-[10px] font-bold text-muted-foreground">• {faculty.designation}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground"><Mail className="h-4 w-4" /> {faculty.email}</div>
                                    
                                    {faculty.subjects && faculty.subjects.length > 0 && (
                                        <div className="space-y-1.5 mt-2">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Expertise</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {faculty.subjects.map((sub, idx) => (
                                                    <Badge key={idx} variant="outline" className="text-[10px] bg-primary/5 border-primary/20 text-primary font-bold">
                                                        {sub}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="border-t pt-2 mt-2">
                                        <div className="flex justify-between text-xs font-bold uppercase text-muted-foreground">
                                            <span>Weekly Load</span>
                                            <span className="text-primary">{faculty.totalLoad} hrs</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="leaves" className="mt-6">
                    {filteredLeaves.filter(l => l.status === 'Pending').length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground"><Check className="h-12 w-12 mx-auto mb-4 opacity-10" /><p>All requests cleared.</p></div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredLeaves.filter(l => l.status === 'Pending').map((leave) => (
                                <div key={leave.id} className="flex items-center justify-between p-4 border rounded-xl bg-card">
                                    <div><h4 className="font-bold">{leave.facultyName}</h4><p className="text-sm text-muted-foreground">{leave.reason}</p></div>
                                    <div className="flex gap-2">
                                        <Button size="sm" className="bg-green-600 text-white" onClick={() => handleLeaveAction(leave.id, 'Approved')}>Approve</Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleLeaveAction(leave.id, 'Rejected')}>Reject</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader><DialogTitle>Edit Faculty</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Name</Label><Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
                            <div className="space-y-2"><Label>Email</Label><Input value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} /></div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleEdit}>Update</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FacultyManagement;
