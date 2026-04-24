
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Trash2, RefreshCcw, UserMinus, GraduationCap, BookOpen, Clock, ShieldCheck, AlertCircle } from "lucide-react";
import { dataPersistence } from "@/utils/dataPersistence";

const RecycleBin = () => {
    const { toast } = useToast();
    const [faculty, setFaculty] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);

    useEffect(() => {
        const load = () => {
            setFaculty(dataPersistence.getDeleted('DYNAMIC_FACULTY', []));
            setStudents(dataPersistence.getDeleted('DYNAMIC_STUDENTS', []));
            setCourses(dataPersistence.getDeleted('DYNAMIC_COURSES', []));
        };
        load();
        window.addEventListener('dynamic_data_updated', load);
        return () => window.removeEventListener('dynamic_data_updated', load);
    }, []);

    const handleRestore = (type: 'faculty' | 'student' | 'course', id: string) => {
        if (type === 'faculty') {
            const all = dataPersistence.getAllFaculty();
            dataPersistence.saveFaculty(all.map(f => f.id === id ? { ...f, is_active: true, deleted_at: null } : f));
        } else if (type === 'student') {
            const all = dataPersistence.getAllStudents();
            dataPersistence.saveStudents(all.map(s => s.id === id ? { ...s, is_active: true, deleted_at: null } : s));
        } else {
            const all = dataPersistence.getAllCourses();
            dataPersistence.saveCourses(all.map(c => c.id === id ? { ...c, is_active: true, deleted_at: null } : c));
        }
        toast({ title: "Restored", description: "The record has been returned to active directory." });
    };

    const handlePermanentDelete = (type: 'faculty' | 'student' | 'course', id: string) => {
        if (!confirm("Are you sure? This action is permanent and cannot be undone.")) return;

        if (type === 'faculty') {
            const all = dataPersistence.getAllFaculty();
            dataPersistence.saveFaculty(all.filter(f => f.id !== id));
        } else if (type === 'student') {
            const all = dataPersistence.getAllStudents();
            dataPersistence.saveStudents(all.filter(s => s.id !== id));
        } else {
            const all = dataPersistence.getAllCourses();
            dataPersistence.saveCourses(all.filter(c => c.id !== id));
        }
        toast({ title: "Deleted Permanently", variant: "destructive" });
    };

    return (
        <div className="space-y-8 animate-in fade-in-50 duration-500">
            <div>
                <h1 className="text-4xl font-black tracking-tight text-rose-600 flex items-center gap-3">
                    <Trash2 className="h-10 w-10" /> Recycle Bin
                </h1>
                <p className="text-muted-foreground mt-1 font-medium">Manage decommissioned records and institutional archives.</p>
            </div>

            <Tabs defaultValue="faculty" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-[600px] bg-slate-100 p-1 rounded-2xl h-14">
                    <TabsTrigger value="faculty" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-black text-xs uppercase tracking-widest gap-2">
                        <UserMinus className="h-4 w-4" /> Faculty ({faculty.length})
                    </TabsTrigger>
                    <TabsTrigger value="students" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-black text-xs uppercase tracking-widest gap-2">
                        <GraduationCap className="h-4 w-4" /> Students ({students.length})
                    </TabsTrigger>
                    <TabsTrigger value="courses" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-black text-xs uppercase tracking-widest gap-2">
                        <BookOpen className="h-4 w-4" /> Courses ({courses.length})
                    </TabsTrigger>
                </TabsList>

                <div className="mt-8">
                    <TabsContent value="faculty">
                        <TrashTable 
                            data={faculty} 
                            type="faculty" 
                            onRestore={handleRestore} 
                            onDelete={handlePermanentDelete} 
                            columns={["Staff ID", "Full Name", "Department"]}
                        />
                    </TabsContent>
                    <TabsContent value="students">
                        <TrashTable 
                            data={students} 
                            type="student" 
                            onRestore={handleRestore} 
                            onDelete={handlePermanentDelete} 
                            columns={["Roll Number", "Full Name", "Branch"]}
                        />
                    </TabsContent>
                    <TabsContent value="courses">
                        <TrashTable 
                            data={courses} 
                            type="course" 
                            onRestore={handleRestore} 
                            onDelete={handlePermanentDelete} 
                            columns={["Code", "Course Name", "Credits"]}
                        />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};

const TrashTable = ({ data, type, onRestore, onDelete, columns }: any) => {
    if (data.length === 0) {
        return (
            <Card className="border-dashed border-2 bg-slate-50/50">
                <CardContent className="h-64 flex flex-col items-center justify-center text-muted-foreground">
                    <RefreshCcw className="h-12 w-12 mb-4 opacity-10 rotate-12" />
                    <p className="font-bold uppercase tracking-widest text-xs">Nothing in Trash</p>
                    <p className="text-[10px]">Records deleted from the directory will appear here.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="rounded-[2rem] overflow-hidden border-none shadow-xl shadow-slate-200/50">
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            {columns.map((c: string) => <TableHead key={c} className="font-black uppercase text-[10px] tracking-widest text-slate-500 py-6 pl-8">{c}</TableHead>)}
                            <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500 text-center">Deleted On</TableHead>
                            <TableHead className="text-right pr-8 font-black uppercase text-[10px] tracking-widest text-slate-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item: any) => (
                            <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell className="pl-8 py-4 font-mono font-bold text-slate-400 text-xs">{item.rollNumber || item.code}</TableCell>
                                <TableCell className="font-black text-slate-700">{item.name}</TableCell>
                                <TableCell className="text-xs font-bold text-slate-500">{item.department || item.branch || `${item.credits} Credits`}</TableCell>
                                <TableCell className="text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter border-slate-200 bg-slate-100/50">
                                            <Clock className="h-3 w-3 mr-1" /> {item.deleted_at ? new Date(item.deleted_at).toLocaleDateString() : 'Unknown'}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                    <div className="flex justify-end gap-2">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="rounded-xl h-9 hover:bg-emerald-50 hover:text-emerald-600 font-bold gap-2 text-xs"
                                            onClick={() => onRestore(type, item.id)}
                                        >
                                            <RefreshCcw className="h-4 w-4" /> RESTORE
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="rounded-xl h-9 hover:bg-rose-50 hover:text-rose-600 font-bold gap-2 text-xs"
                                            onClick={() => onDelete(type, item.id)}
                                        >
                                            <Trash2 className="h-4 w-4" /> PURGE
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default RecycleBin;
