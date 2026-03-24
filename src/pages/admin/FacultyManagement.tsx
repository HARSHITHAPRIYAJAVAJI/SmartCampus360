import { useState, useMemo, useEffect } from 'react';
import Layout from "@/components/common/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Mail, Phone, BookOpen, GraduationCap, Users, ArrowLeft, Building2, Plus, Edit, Trash2, LayoutGrid, List, Grip, X, Clock, Check, X as XIcon } from "lucide-react";
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

    const departments = [
        { id: "CSM", name: "CSE (AI & Machine Learning)", icon: BookOpen, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30", description: "Department of AI & ML" },
        { id: "IT", name: "Information Technology", icon: Building2, color: "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30", description: "Department of IT" },
        { id: "CSE", name: "Computer Science & Engineering", icon: GraduationCap, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30", description: "Department of CSE" },
        { id: "ECE", name: "Electronics & Communication", icon: Clock, color: "text-green-600 bg-green-100 dark:bg-green-100/30", description: "Department of ECE" },
    ];

    const { toast } = useToast();
    const [facultyList, setFacultyList] = useState<FacultyMember[]>([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentFaculty, setCurrentFaculty] = useState<FacultyMember | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');
    const [formData, setFormData] = useState<Partial<FacultyMember>>({});

    // Leave Management State
    const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);

    // Swap/Replacement Requests from localStorage
    interface SwapRequest { id: string; senderName: string; targetName: string; type: string; date: string; period: string; status: string; }
    const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('FACULTY_REQUESTS');
        if (saved) setSwapRequests(JSON.parse(saved));
    }, []);

    const handleSwapAction = (id: string, status: 'approved' | 'rejected') => {
        const updated = swapRequests.map(r => r.id === id ? { ...r, status } : r);
        setSwapRequests(updated);
        localStorage.setItem('FACULTY_REQUESTS', JSON.stringify(updated));
        toast({
            title: status === 'approved' ? 'Swap Approved' : 'Swap Rejected',
            description: status === 'approved' ? 'The timetable override has been applied.' : 'The request has been dismissed.',
            variant: status === 'rejected' ? 'destructive' : 'default'
        });
    };

    const handleLeaveAction = (id: string, status: 'Approved' | 'Rejected') => {
        setPendingLeaves(prev => prev.map(l => l.id === id ? { ...l, status } : l));
        toast({
            title: `Leave ${status}`,
            description: `The request has been marked as ${status.toLowerCase()}.`,
            variant: status === 'Rejected' ? 'destructive' : 'default'
        });
    };

    useEffect(() => {
        if (!selectedDept) return;

        if (selectedDept === 'CSM' && facultyList.length === 0) {
            const facultyMap = new Map<string, FacultyMember>();
            const hodName = "Dr. B. Sunil Srinivas";

            MOCK_FACULTY.forEach(faculty => {
                facultyMap.set(faculty.name, {
                    ...faculty,
                    subjects: [],
                    totalLoad: 0
                });
            });

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
                            rollNumber: `F-${Math.floor(1000 + Math.random() * 9000)}`,
                            designation: designation,
                            department: "CSM",
                            subjects: [],
                            totalLoad: 0,
                            email: `${name.split(' ').pop()?.toLowerCase()}@smartcampus.edu`,
                            phone: "+91 98XXX XXXXX"
                        });
                    }

                    const f = facultyMap.get(name)!;
                    if (!f.subjects.includes(subj.code)) {
                        f.subjects.push(subj.code);
                        f.totalLoad += 3;
                    }
                });
            });

            setFacultyList(Array.from(facultyMap.values()));
        }
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
            subjects: [],
            totalLoad: 0,
            department: selectedDept || "CSM"
        } as FacultyMember;

        setFacultyList([newFaculty, ...facultyList]);
        setIsAddOpen(false);
        setFormData({});
        toast({ title: "Success", description: "Faculty member added successfully" });
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
                    {userRole === 'admin' && (
                        <div className="flex bg-muted p-1 rounded-xl shadow-inner">
                            <Button variant={viewMode === 'grid' ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode('grid')} className="rounded-lg h-9 w-9 p-0">
                                <LayoutGrid className="h-4 w-4" />
                            </Button>
                            <Button variant={viewMode === 'list' ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode('list')} className="rounded-lg h-9 w-9 p-0">
                                <List className="h-4 w-4" />
                            </Button>
                            <Button variant={viewMode === 'compact' ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode('compact')} className="rounded-lg h-9 w-9 p-0">
                                <Grip className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
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
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search faculty..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    {userRole === 'admin' && (
                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" /> Add Faculty
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Faculty Member</DialogTitle>
                                    <DialogDescription>Enter the professional details to register staff.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2 text-left">
                                            <Label>Full Name</Label>
                                            <Input placeholder="Dr. John Doe" onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                        </div>
                                        <div className="space-y-2 text-left">
                                            <Label>Staff ID (Roll Number)</Label>
                                            <Input placeholder="22F91F6601" onChange={e => setFormData({ ...formData, rollNumber: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-left">
                                        <Label>Email</Label>
                                        <Input type="email" placeholder="john.doe@smartcampus.edu" onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                    </div>
                                    <div className="space-y-2 text-left">
                                        <Label>Designation</Label>
                                        <Select onValueChange={v => setFormData({ ...formData, designation: v })}>
                                            <SelectTrigger><SelectValue placeholder="Select designation" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Professor">Professor</SelectItem>
                                                <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                                                <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                                                <SelectItem value="Adjunct Faculty">Adjunct Faculty</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                                    <Button onClick={handleAdd}>Save Member</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>

            <Tabs defaultValue="directory" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-[560px]">
                    <TabsTrigger value="directory">Active Directory</TabsTrigger>
                    <TabsTrigger value="leaves">
                        Leave Requests
                        {pendingLeaves.filter(l => l.status === 'Pending').length > 0 && (
                            <Badge className="ml-2 bg-destructive text-white h-5 w-5 flex items-center justify-center p-0 rounded-full">
                                {pendingLeaves.filter(l => l.status === 'Pending').length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="swaps">
                        Swap Requests
                        {swapRequests.filter(r => r.status === 'pending').length > 0 && (
                            <Badge className="ml-2 bg-indigo-600 text-white h-5 w-5 flex items-center justify-center p-0 rounded-full">
                                {swapRequests.filter(r => r.status === 'pending').length}
                            </Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="directory" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredFaculty.map((faculty) => (
                            <Card key={faculty.id} className="group hover:border-primary/50 transition-all hover:shadow-lg overflow-hidden border-muted/60">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${faculty.name}`} />
                                            <AvatarFallback>{faculty.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => { setCurrentFaculty(faculty); setFormData(faculty); setIsEditOpen(true); }}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(faculty.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <CardTitle className="text-xl font-black">{faculty.name}</CardTitle>
                                        <CardDescription className="text-primary font-bold">{faculty.designation}</CardDescription>
                                        <div className="text-[10px] text-muted-foreground mt-1 font-mono uppercase tracking-tighter opacity-70">
                                            Staff ID: {faculty.rollNumber}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <Mail className="h-4 w-4 text-primary/60" />
                                        <span className="truncate">{faculty.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <Phone className="h-4 w-4 text-primary/60" />
                                        {faculty.phone}
                                    </div>
                                    <div className="space-y-2 pt-2 border-t border-muted/40">
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            <span>Current Load</span>
                                            <span className="text-primary">{faculty.totalLoad} hrs/week</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-1.5">
                                            <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min((faculty.totalLoad / 20) * 100, 100)}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 pt-2">
                                        {faculty.subjects.map((sub, i) => (
                                            <Badge key={i} variant="secondary" className="px-1.5 py-0 text-[10px] bg-primary/5 text-primary border-primary/10">
                                                {sub}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="leaves" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Leave Approval Queue</CardTitle>
                            <CardDescription>Review and manage faculty leave requests.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {pendingLeaves.filter(l => l.status === 'Pending').length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <Check className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                        <p>No pending leave requests.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {pendingLeaves.filter(l => l.status === 'Pending').map((leave) => (
                                            <div key={leave.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                                                <div className="flex items-start gap-4">
                                                    <div className="mt-1">
                                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                            {leave.facultyName.charAt(0)}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-bold">{leave.facultyName}</h4>
                                                            <Badge variant="outline" className="text-[10px]">{leave.type}</Badge>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground line-clamp-1 italic">"{leave.reason}"</p>
                                                        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3.5 w-3.5" />
                                                                {leave.fromDate} to {leave.toDate} ({leave.days} days)
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 mt-4 md:mt-0 ml-14 md:ml-0">
                                                    <Button 
                                                        size="sm" 
                                                        className="bg-green-600 hover:bg-green-700 text-white"
                                                        onClick={() => handleLeaveAction(leave.id, 'Approved')}
                                                    >
                                                        <Check className="h-4 w-4 mr-2" /> Approve
                                                    </Button>
                                                    <Button 
                                                        size="sm" 
                                                        variant="destructive"
                                                        onClick={() => handleLeaveAction(leave.id, 'Rejected')}
                                                    >
                                                        <XIcon className="h-4 w-4 mr-2" /> Reject
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="swaps" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Period Swap & Replacement Requests</CardTitle>
                            <CardDescription>Faculty-submitted swap/replacement requests requiring admin oversight.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {swapRequests.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Check className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                    <p>No swap or replacement requests found.</p>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {swapRequests.map((req) => (
                                        <div key={req.id} className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-xl transition-colors ${
                                            req.status === 'pending' ? 'bg-indigo-50/50 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-900' :
                                            req.status === 'approved' ? 'bg-green-50/30 border-green-200 dark:bg-green-950/10' :
                                            'bg-muted/20 opacity-60'
                                        }`}>
                                            <div className="flex items-start gap-4">
                                                <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-sm shrink-0">
                                                    {req.senderName.charAt(0)}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h4 className="font-bold">{req.senderName}</h4>
                                                        <span className="text-muted-foreground text-sm">→</span>
                                                        <h4 className="font-bold text-indigo-600 dark:text-indigo-400">{req.targetName}</h4>
                                                        <Badge variant="outline" className="text-[10px] capitalize border-indigo-200 text-indigo-700 dark:text-indigo-300">{req.type}</Badge>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            {req.date} &bull; {req.period}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mt-4 md:mt-0 ml-14 md:ml-0 shrink-0">
                                                {req.status === 'pending' ? (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            className="bg-green-600 hover:bg-green-700 text-white"
                                                            onClick={() => handleSwapAction(req.id, 'approved')}
                                                        >
                                                            <Check className="h-4 w-4 mr-1" /> Approve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleSwapAction(req.id, 'rejected')}
                                                        >
                                                            <XIcon className="h-4 w-4 mr-1" /> Reject
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Badge variant={req.status === 'approved' ? 'default' : 'destructive'} className={req.status === 'approved' ? 'bg-green-500' : ''}>
                                                        {req.status}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Faculty Details</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Staff ID</Label>
                                <Input value={formData.rollNumber || ''} onChange={e => setFormData({ ...formData, rollNumber: e.target.value })} />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleEdit}>Update Record</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FacultyManagement;
