import { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DoorClosed, Users, Plus, Edit, Trash2, Search, Building2, LayoutGrid } from "lucide-react";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Room {
    id: string;
    name: string;
    capacity: number;
    type: 'Classroom' | 'Lab' | 'Auditorium';
    building: string;
    dept?: 'IT' | 'ECE' | 'AIML' | 'GEN' | 'ALL';
}

const MOCK_ROOMS: Room[] = [
    // T-Block (1st Year)
    ...Array.from({ length: 4 }, (_, i) => ({
        id: `t10${i+1}`, name: `T-10${i+1}`, capacity: 60, type: "Classroom" as const, building: "T Block", dept: "GEN" as const
    })),

    // South Block (IT Dept)
    ...Array.from({ length: 12 }, (_, i) => ({
        id: `s4${(i+1).toString().padStart(2, '0')}`, 
        name: `S-4${(i+1).toString().padStart(2, '0')}`, 
        capacity: 60, 
        type: i % 3 === 0 ? "Lab" as const : "Classroom" as const, 
        building: "South Block", dept: "IT" as const
    })),
    // Additional IT (S301-312)
    ...Array.from({ length: 6 }, (_, i) => ({
        id: `s3${(i+1).toString().padStart(2, '0')}`, 
        name: `S-3${(i+1).toString().padStart(2, '0')}`, 
        capacity: 70, type: "Classroom" as const, building: "South Block (Overflow)", dept: "IT" as const
    })),

    // Central Block (ECE Dept)
    ...Array.from({ length: 12 }, (_, i) => ({
        id: `c4${(i+1).toString().padStart(2, '0')}`, 
        name: `C-4${(i+1).toString().padStart(2, '0')}`, 
        capacity: 65, type: "Classroom" as const, building: "Central Block", dept: "ECE" as const
    })),

    // North Block (AIML Dept)
    ...Array.from({ length: 12 }, (_, i) => ({
        id: `n4${(i+1).toString().padStart(2, '0')}`, 
        name: `N-4${(i+1).toString().padStart(2, '0')}`, 
        capacity: 60, type: "Classroom" as const, building: "North Block", dept: "AIML" as const
    })),
];

const RoomManagement = () => {
    const { toast } = useToast();
    const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
    const [formData, setFormData] = useState<Partial<Room>>({});
    const [activeTab, setActiveTab] = useState("all");

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

    const filteredRooms = useMemo(() => {
        return rooms.filter(r => {
            const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 r.building.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTab = activeTab === 'all' || r.dept === activeTab.toUpperCase();
            return matchesSearch && matchesTab;
        });
    }, [rooms, searchQuery, activeTab]);

    const getDeptBadgeColor = (dept?: string) => {
        switch(dept) {
            case 'IT': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'ECE': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'AIML': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'GEN': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
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
                    <p className="text-muted-foreground text-sm">Managing branch-wise classroom and lab allocation (IT, ECE, AIML)</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search rooms or buildings..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-9 h-10 shadow-sm"
                        />
                    </div>
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
                                            <SelectItem value="ECE">ECE Branch (Central)</SelectItem>
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
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter><Button onClick={handleAdd}>Confirm Add</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-slate-100/50 p-1 mb-6">
                    <TabsTrigger value="all" className="px-6">All Blocks</TabsTrigger>
                    <TabsTrigger value="it" className="px-6 bg-blue-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white">IT (South)</TabsTrigger>
                    <TabsTrigger value="ece" className="px-6 bg-amber-50 data-[state=active]:bg-amber-600 data-[state=active]:text-white">ECE (Central)</TabsTrigger>
                    <TabsTrigger value="aiml" className="px-6 bg-purple-50 data-[state=active]:bg-purple-600 data-[state=active]:text-white">AIML (North)</TabsTrigger>
                    <TabsTrigger value="gen" className="px-6">1st Year</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredRooms.map(room => (
                            <Card key={room.id} className="group hover:border-primary/50 transition-all shadow-sm">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <Badge className={`px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-widest border ${getDeptBadgeColor(room.dept)}`}>
                                            {room.dept}
                                        </Badge>
                                        <MenuActions 
                                            onEdit={() => { setCurrentRoom(room); setFormData(room); setIsEditOpen(true); }} 
                                            onDelete={() => handleDelete(room.id)} 
                                        />
                                    </div>
                                    
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`p-2 rounded-lg ${room.type === 'Lab' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'}`}>
                                            <DoorClosed className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg leading-tight">{room.name}</h3>
                                            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                <LayoutGrid className="h-3 w-3" /> {room.building}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t flex items-center justify-between">
                                        <div className="flex gap-2">
                                            <Badge variant="secondary" className="h-5 text-[10px] gap-1 px-1.5 font-bold">
                                                <Users className="h-2.5 w-2.5" /> {room.capacity}
                                            </Badge>
                                            <Badge variant="outline" className="h-5 text-[10px] px-1.5 font-medium border-slate-200">
                                                {room.type}
                                            </Badge>
                                        </div>
                                        <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-tighter">Available</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
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

const MenuActions = ({ onEdit, onDelete }: { onEdit: () => void, onDelete: () => void }) => (
    <div className="flex gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}><Edit className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onDelete}><Trash2 className="h-4 w-4" /></Button>
    </div>
);

export default RoomManagement;
