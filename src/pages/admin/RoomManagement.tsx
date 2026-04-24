import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DoorClosed, Users, Plus, Edit, Trash2, Search, Building2, LayoutGrid, X, Briefcase } from "lucide-react";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

import { MOCK_ROOMS, Room } from '@/data/mockRooms';


const RoomManagement = () => {
    const { toast } = useToast();
    const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
    const [formData, setFormData] = useState<Partial<Room>>({});
    const [activeTab, setActiveTab] = useState("all");
    const [statusFilter, setStatusFilter] = useState<"all" | "available" | "inuse">("all");

    // Developer Tool: Simulation Time Override
    const [simulatedTime, setSimulatedTime] = useState<string>("live");

    const handleAdd = () => {
        if (!formData.name) {
            toast({ title: "Error", description: "Room name is required.", variant: "destructive" });
            return;
        }
        const newRoom: Room = {
            id: `room-${Date.now()}`,
            name: formData.name,
            capacity: Number(formData.capacity) || 60,
            type: formData.type || "Classroom",
            building: formData.building || "Main Block",
            dept: formData.dept || "ALL"
        };
        setRooms([...rooms, newRoom]);
        setIsAddOpen(false);
        setFormData({});
        toast({ title: "Room Added", description: `${newRoom.name} created.` });
    };

    const handleEdit = () => {
        if (!currentRoom) return;
        setRooms(rooms.map(r => r.id === currentRoom.id ? { ...r, ...formData } as Room : r));
        setIsEditOpen(false);
        setFormData({});
        toast({ title: "Room Updated", description: "Changes saved." });
    };

    const handleDelete = (id: string) => {
        setRooms(rooms.filter(r => r.id !== id));
        toast({ title: "Room Deleted", variant: "destructive" });
    };

    const [refreshKey, setRefreshKey] = useState(0);

    // Refresh occupancy every minute or on storage changes
    useEffect(() => {
        const interval = setInterval(() => setRefreshKey(prev => prev + 1), 30000);
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'published_timetables' || e.key === 'draft_timetables') {
                setRefreshKey(prev => prev + 1);
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', handleStorage);
        };
    }, []);

    // NEW: Real-Time Slot-Based Occupancy Logic (Synced with Scheduler Drafts)
    const currentOccupancy = useMemo(() => {
        const now = new Date();
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayName = days[now.getDay()];
        const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

        const slots = [
            { id: "09:40", start: "09:40", end: "10:40" },
            { id: "10:40", start: "10:40", end: "11:40" },
            { id: "11:40", start: "11:40", end: "12:40" },
            { id: "01:20", start: "13:20", end: "14:20" },
            { id: "02:20", start: "14:20", end: "15:20" },
            { id: "03:20", start: "15:20", end: "16:20" }
        ];

        let activeSlot;
        let activeDayName = dayName;

        if (simulatedTime !== "live") {
            const [simDay, simSlot] = simulatedTime.split('-');
            activeDayName = simDay;
            activeSlot = slots.find(s => s.id === simSlot);
        } else {
            activeSlot = slots.find(s => timeStr >= s.start && timeStr < s.end);
            if (activeDayName === 'Sunday') return {};
        }

        const publishedStoreStr = localStorage.getItem('published_timetables');
        const draftStoreStr = localStorage.getItem('draft_timetables');
        const examTimetablesStr = localStorage.getItem('EXAM_TIMETABLES');
        const examSeatingStr = localStorage.getItem('EXAM_SEATING_PLAN');

        const publishedTimetables = publishedStoreStr ? JSON.parse(publishedStoreStr) : {};
        const draftTimetables = draftStoreStr ? JSON.parse(draftStoreStr) : {};
        const examTimetables = examTimetablesStr ? JSON.parse(examTimetablesStr) as any[] : [];
        const examSeating = examSeatingStr ? JSON.parse(examSeatingStr) as any[] : [];

        const status: Record<string, { info: string; isDraft: boolean; subject: string; faculty: string; isExam?: boolean }> = {};

        // 1. Check EXAM Priority (Calendar Date Specific)
        const todayStr = format(now, "yyyy-MM-dd");
        const activeExams = examTimetables.filter(et => {
            if (todayStr >= et.startDate && todayStr <= et.endDate) {
                return et.slots.some((slot: any) => {
                    if (slot.date !== todayStr) return false;
                    const [h_start, m_start] = slot.startTime.split(' ')[0].split(':').map(Number);
                    const [h_end, m_end] = slot.endTime.split(' ')[0].split(':').map(Number);
                    const startMin = (slot.startTime.includes('PM') && h_start !== 12 ? h_start + 12 : h_start) * 60 + m_start;
                    const endMin = (slot.endTime.includes('PM') && h_end !== 12 ? h_end + 12 : h_end) * 60 + m_end;
                    const currentTotalMin = now.getHours() * 60 + now.getMinutes();

                    return currentTotalMin >= startMin && currentTotalMin <= endMin;
                });
            }
            return false;
        });

        if (activeExams.length > 0) {
            activeExams.forEach(et => {
                const relevantSeating = examSeating.filter(s => s.examId.includes(et.id) || s.examId === et.id);
                const roomsInUse = Array.from(new Set(relevantSeating.map(s => s.room)));

                roomsInUse.forEach(rName => {
                    status[rName] = {
                        info: et.type + " EXAM",
                        isDraft: false,
                        subject: et.title,
                        faculty: "Invigilators Assigned",
                        isExam: true
                    };
                });
            });
        }

        // 2. Check Academic Timetable (Weekly Schedule)
        if (activeSlot) {
            const slotKey = `${activeDayName}-${activeSlot.id}`;

            const allSources = [
                { data: publishedTimetables, isDraft: false },
                { data: draftTimetables, isDraft: true }
            ];

            allSources.forEach(({ data, isDraft }) => {
                Object.entries(data).forEach(([sectionId, entry]: [string, any]) => {
                    const grid = entry.grid || entry;
                    const sess = grid[slotKey];
                    if (sess && sess.room) {
                        const roomKey = sess.room.trim();
                        if (!status[roomKey] || (status[roomKey].isDraft && !isDraft)) {
                            status[roomKey] = {
                                info: sectionId,
                                isDraft,
                                subject: sess.courseName || sess.courseCode || sess.subject,
                                faculty: sess.faculty || "Faculty"
                            };
                        }
                    }
                });
            });
        }
        return status;
    }, [refreshKey, simulatedTime]);

    const filteredRooms = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return rooms.filter(r => {
            const occ = currentOccupancy[r.name];
            const matchesOccupancy = occ ? (
                occ.subject.toLowerCase().includes(query) ||
                occ.faculty.toLowerCase().includes(query) ||
                occ.info.toLowerCase().includes(query)
            ) : false;

            const matchesSearch =
                r.name.toLowerCase().includes(query) ||
                r.building.toLowerCase().includes(query) ||
                r.type.toLowerCase().includes(query) ||
                (r.dept && r.dept.toLowerCase().includes(query)) ||
                r.capacity.toString().includes(query) ||
                (r.subjects && r.subjects.some(s => s.toLowerCase().includes(query))) ||
                matchesOccupancy;

            const isOccupied = !!currentOccupancy[r.name];
            const matchesStatus = statusFilter === 'all' ? true :
                statusFilter === 'available' ? !isOccupied : isOccupied;

            if (!matchesStatus) return false;

            if (activeTab === 'all') return matchesSearch;
            if (activeTab === 'labs') return matchesSearch && r.type === 'Lab';
            if (activeTab === 'offices') return matchesSearch && r.type === 'Office';
            if (activeTab === 'aiml_csm') return matchesSearch && (r.dept === 'AIML' || r.dept === 'CSM');
            return matchesSearch && r.dept === activeTab.toUpperCase();
        });
    }, [rooms, searchQuery, activeTab, statusFilter, currentOccupancy]);

    const getDeptBadgeColor = (dept?: string) => {
        switch (dept) {
            case 'IT': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'ECE': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'CSE': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
            case 'AIML': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'CSM': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case 'CSD': return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'GEN': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'ALL': return 'bg-slate-200 text-slate-800 border-slate-300';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in-50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                        <Building2 className="h-8 w-8" />
                        Infrastructure Management
                    </h1>

                </div>
                <div className="flex gap-3">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search rooms, buildings, capacity..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-9 pr-9 h-11 shadow-sm border-primary/20 focus-visible:ring-primary/30"
                        />
                        {searchQuery && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                                onClick={() => setSearchQuery("")}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    <Select value={simulatedTime} onValueChange={setSimulatedTime}>
                        <SelectTrigger className="w-[180px] h-10 border-primary/20 bg-primary/5 text-primary font-bold">
                            <SelectValue placeholder="Live Time" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="live"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> Live Clock</div></SelectItem>
                            <SelectItem value="Monday-09:40">Simulate: Mon 09:40 AM</SelectItem>
                            <SelectItem value="Monday-01:20">Simulate: Mon 01:20 PM</SelectItem>
                            <SelectItem value="Tuesday-10:40">Simulate: Tue 10:40 AM</SelectItem>
                            <SelectItem value="Wednesday-11:40">Simulate: Wed 11:40 AM</SelectItem>
                        </SelectContent>
                    </Select>

                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild><Button className="h-10 px-4"><Plus className="mr-2 h-4 w-4" /> Add Room</Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Add New Room</DialogTitle></DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right font-bold">Room Name</Label>
                                    <Input placeholder="e.g. S-401" value={formData.name || ''} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right font-bold">Branch</Label>
                                    <Select onValueChange={v => setFormData(prev => ({ ...prev, dept: v as any }))}>
                                        <SelectTrigger className="col-span-3"><SelectValue placeholder="Select Branch" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="IT">IT Branch (South)</SelectItem>
                                            <SelectItem value="CSE">CSE Branch (Central)</SelectItem>
                                            <SelectItem value="ECE">ECE Branch (South)</SelectItem>
                                            <SelectItem value="AIML">AIML Branch (North)</SelectItem>
                                            <SelectItem value="GEN">1st Year (T-Block)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right font-bold">Building</Label>
                                    <Input value={formData.building || ''} onChange={e => setFormData(prev => ({ ...prev, building: e.target.value }))} className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right font-bold">Capacity</Label>
                                    <Input type="number" value={formData.capacity || ''} onChange={e => setFormData(prev => ({ ...prev, capacity: Number(e.target.value) }))} className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right font-bold">Type</Label>
                                    <Select onValueChange={v => setFormData(prev => ({ ...prev, type: v as any }))}>
                                        <SelectTrigger className="col-span-3"><SelectValue placeholder="Select Type" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Classroom">Classroom</SelectItem>
                                            <SelectItem value="Lab">Lab</SelectItem>
                                            <SelectItem value="Auditorium">Auditorium</SelectItem>
                                            <SelectItem value="Seminar Hall">Seminar Hall</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right font-bold text-xs">Mapped Subjects</Label>
                                    <Input placeholder="Comma separated subjects" onChange={e => setFormData(prev => ({ ...prev, subjects: e.target.value.split(',') }))} className="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter><Button onClick={handleAdd}>Confirm Add</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 bg-slate-100/50 p-1 rounded-lg border border-slate-200/50">
                    <Button
                        variant={statusFilter === 'all' ? 'secondary' : 'ghost'}
                        size="sm"
                        className={`h-8 rounded-md text-[11px] font-black uppercase tracking-wider ${statusFilter === 'all' ? 'bg-white shadow-sm' : ''}`}
                        onClick={() => setStatusFilter('all')}
                    >All Rooms</Button>
                    <Button
                        variant={statusFilter === 'available' ? 'secondary' : 'ghost'}
                        size="sm"
                        className={`h-8 rounded-md text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 ${statusFilter === 'available' ? 'bg-white shadow-sm text-emerald-600' : ''}`}
                        onClick={() => setStatusFilter('available')}
                    >
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" /> Available
                    </Button>
                    <Button
                        variant={statusFilter === 'inuse' ? 'secondary' : 'ghost'}
                        size="sm"
                        className={`h-8 rounded-md text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 ${statusFilter === 'inuse' ? 'bg-white shadow-sm text-rose-600' : ''}`}
                        onClick={() => setStatusFilter('inuse')}
                    >
                        <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" /> In Use
                    </Button>
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Real-Time Occupancy Tracking
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-slate-100/50 p-1 mb-6 overflow-x-auto justify-start border-b-none h-12 shadow-inner">
                    <TabsTrigger value="all" className="px-6 font-black uppercase text-[10px] tracking-widest">All Infrastructure</TabsTrigger>
                    <TabsTrigger value="labs" className="px-6 uppercase text-[10px] font-black tracking-widest bg-purple-100/50 data-[state=active]:bg-purple-600 data-[state=active]:text-white">Laboratories</TabsTrigger>
                    <TabsTrigger value="offices" className="px-6 uppercase text-[10px] font-black tracking-widest bg-amber-100/50 data-[state=active]:bg-amber-600 data-[state=active]:text-white">Offices</TabsTrigger>
                    <TabsTrigger value="it" className="px-6 uppercase text-[10px] font-black tracking-widest">IT (South)</TabsTrigger>
                    <TabsTrigger value="cse" className="px-6 uppercase text-[10px] font-black tracking-widest">CSE (Central)</TabsTrigger>
                    <TabsTrigger value="ece" className="px-6 uppercase text-[10px] font-black tracking-widest">ECE (South)</TabsTrigger>
                    <TabsTrigger value="aiml_csm" className="px-6 uppercase text-[10px] font-black tracking-widest bg-purple-50 hover:bg-purple-100 data-[state=active]:bg-purple-600 data-[state=active]:text-white">AIML/CSM (North)</TabsTrigger>

                    <TabsTrigger value="gen" className="px-6 uppercase text-[10px] font-black tracking-widest">1st Year</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0 animate-in fade-in-50 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredRooms.length > 0 ? (
                            filteredRooms.map(room => (
                                <RoomCard
                                    key={room.id}
                                    room={room}
                                    currentOccupancy={currentOccupancy}
                                    onEdit={() => { setCurrentRoom(room); setFormData(room); setIsEditOpen(true); }}
                                    onDelete={() => handleDelete(room.id)}
                                    getBadgeColor={getDeptBadgeColor}
                                />
                            ))
                        ) : (
                            <EmptyState searchQuery={searchQuery} onClear={() => setSearchQuery("")} />
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="labs" className="mt-0 animate-in slide-in-from-right-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredRooms.length > 0 ? (
                            filteredRooms.map(room => (
                                <RoomCard
                                    key={room.id}
                                    room={room}
                                    currentOccupancy={currentOccupancy}
                                    onEdit={() => { setCurrentRoom(room); setFormData(room); setIsEditOpen(true); }}
                                    onDelete={() => handleDelete(room.id)}
                                    getBadgeColor={getDeptBadgeColor}
                                />
                            ))
                        ) : (
                            <EmptyState searchQuery={searchQuery} onClear={() => setSearchQuery("")} />
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="offices" className="mt-0 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredRooms.length > 0 ? (
                            filteredRooms.map(room => (
                                <RoomCard
                                    key={room.id}
                                    room={room}
                                    currentOccupancy={currentOccupancy}
                                    onEdit={() => { setCurrentRoom(room); setFormData(room); setIsEditOpen(true); }}
                                    onDelete={() => handleDelete(room.id)}
                                    getBadgeColor={getDeptBadgeColor}
                                />
                            ))
                        ) : (
                            <EmptyState searchQuery={searchQuery} onClear={() => setSearchQuery("")} />
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="aiml_csm" className="mt-0 animate-in fade-in-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredRooms.length > 0 ? (
                            filteredRooms.map(room => (
                                <RoomCard
                                    key={room.id}
                                    room={room}
                                    currentOccupancy={currentOccupancy}
                                    onEdit={() => { setCurrentRoom(room); setFormData(room); setIsEditOpen(true); }}
                                    onDelete={() => handleDelete(room.id)}
                                    getBadgeColor={getDeptBadgeColor}
                                />
                            ))
                        ) : (
                            <EmptyState searchQuery={searchQuery} onClear={() => setSearchQuery("")} />
                        )}
                    </div>
                </TabsContent>

                {['it', 'cse', 'ece', 'csd', 'gen'].map(dept => (
                    <TabsContent key={dept} value={dept} className="mt-0 animate-in fade-in-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredRooms.length > 0 ? (
                                filteredRooms.map(room => (
                                    <RoomCard
                                        key={room.id}
                                        room={room}
                                        currentOccupancy={currentOccupancy}
                                        onEdit={() => { setCurrentRoom(room); setFormData(room); setIsEditOpen(true); }}
                                        onDelete={() => handleDelete(room.id)}
                                        getBadgeColor={getDeptBadgeColor}
                                    />
                                ))
                            ) : (
                                <EmptyState searchQuery={searchQuery} onClear={() => setSearchQuery("")} />
                            )}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Edit Room Details</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right font-bold">Name</Label>
                            <Input value={formData.name || ''} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right font-bold">Capacity</Label>
                            <Input type="number" value={formData.capacity || ''} onChange={e => setFormData(prev => ({ ...prev, capacity: Number(e.target.value) }))} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter><Button onClick={handleEdit}>Save Changes</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

// Sub-components for better organization
const RoomCard = ({ room, currentOccupancy, onEdit, onDelete, getBadgeColor }: {
    room: Room,
    currentOccupancy: Record<string, { info: string; isDraft: boolean; subject: string; faculty: string; isExam?: boolean }>,
    onEdit: () => void,
    onDelete: () => void,
    getBadgeColor: (dept?: string) => string
}) => (
    <Card className="group hover:border-primary/50 transition-all shadow-sm">
        <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
                <Badge className={`px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-widest border ${getBadgeColor(room.dept)}`}>
                    {room.dept}
                </Badge>
                <MenuActions onEdit={onEdit} onDelete={onDelete} />
            </div>

            <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${room.type === 'Lab' ? 'bg-purple-100 text-purple-600' :
                    room.type === 'Office' ? 'bg-amber-100 text-amber-600' :
                        'bg-slate-100 text-slate-600'
                    }`}>
                    {room.type === 'Office' ? <Briefcase className="h-5 w-5" /> : <DoorClosed className="h-5 w-5" />}
                </div>
                <div>
                    <h3 className="font-bold text-lg leading-tight">{room.name}</h3>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <LayoutGrid className="h-3 w-3" /> {room.building}
                    </p>
                </div>
            </div>

            {room.subjects && room.subjects.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                    {room.subjects.map((sub, idx) => (
                        <Badge key={idx} variant="outline" className="text-[9px] py-0 h-4 bg-primary/5 border-primary/10">
                            {sub}
                        </Badge>
                    ))}
                </div>
            )}

            <div className="mt-4 pt-3 border-t flex items-center justify-between">
                <div className="flex gap-2">
                    <Badge variant="secondary" className="h-5 text-[10px] gap-1 px-1.5 font-bold">
                        <Users className="h-2.5 w-2.5" /> {room.capacity}
                    </Badge>
                    <Badge variant="outline" className="h-5 text-[10px] px-1.5 font-medium border-slate-200">
                        {room.type}
                    </Badge>
                </div>
                {currentOccupancy[room.name] ? (
                    <div className="flex flex-col items-end w-full overflow-hidden ml-4">
                        <span className="text-[10px] font-black text-rose-600 uppercase tracking-tighter flex items-center gap-1.5 whitespace-nowrap">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> In Use
                        </span>
                        <div className="flex flex-col items-end max-w-full">
                            <span className="text-[10px] font-extrabold text-slate-900 truncate w-full text-right leading-none mb-0.5">
                                {currentOccupancy[room.name].subject}
                            </span>
                            <span className="text-[9px] font-medium text-slate-500 truncate w-full text-right leading-none">
                                {currentOccupancy[room.name].info} • {currentOccupancy[room.name].faculty}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">Available</span>
                        <span className="text-[8px] font-medium text-muted-foreground">Ready for use</span>
                    </div>
                )}
            </div>
        </CardContent>
    </Card>
);

const EmptyState = ({ searchQuery, onClear }: { searchQuery: string, onClear: () => void }) => (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <Search className="h-10 w-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-1">No rooms found</h3>
        <p className="text-slate-500 max-w-xs mx-auto text-sm">
            {searchQuery
                ? `We couldn't find any rooms matching "${searchQuery}" in this category.`
                : "No rooms are currently available in this category."}
        </p>
        <div className="mt-6 flex gap-3">
            {searchQuery && (
                <Button
                    variant="outline"
                    onClick={onClear}
                    className="font-bold border-slate-300"
                >
                    Clear Search
                </Button>
            )}
        </div>
    </div>
);

const MenuActions = ({ onEdit, onDelete }: { onEdit: () => void, onDelete: () => void }) => (
    <div className="flex gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}><Edit className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onDelete}><Trash2 className="h-4 w-4" /></Button>
    </div>
);

export default RoomManagement;
