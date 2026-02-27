import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DoorClosed, Users, Plus, Edit, Trash2, ArrowLeft, Search } from "lucide-react";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Room {
    id: string;
    name: string;
    capacity: number;
    type: 'Classroom' | 'Lab' | 'Auditorium';
    building: string;
}

const MOCK_ROOMS: Room[] = [
    // T-Block (1st Year)
    { id: "t101", name: "T-101", capacity: 60, type: "Classroom", building: "T Block (1st Year)" },
    { id: "t102", name: "T-102", capacity: 60, type: "Classroom", building: "T Block (1st Year)" },
    { id: "t103", name: "T-103", capacity: 60, type: "Classroom", building: "T Block (1st Year)" },
    { id: "t201", name: "Drawing Hall", capacity: 80, type: "Lab", building: "T Block (1st Year)" },

    // North Block (AIML Dept - 4th Floor)
    { id: "n401", name: "N-401 (AIML)", capacity: 60, type: "Classroom", building: "North Block" },
    { id: "n402", name: "N-402 (AIML)", capacity: 60, type: "Classroom", building: "North Block" },
    { id: "n403", name: "N-403 (AIML)", capacity: 60, type: "Classroom", building: "North Block" },
    { id: "n404", name: "N-404 (AI Lab)", capacity: 40, type: "Lab", building: "North Block" },

    // Other Blocks
    { id: "s201", name: "S-201", capacity: 60, type: "Classroom", building: "South Block" },
    { id: "c101", name: "C-101", capacity: 120, type: "Auditorium", building: "Central Block" },
];

const RoomManagement = () => {
    const { toast } = useToast();
    const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
    const [formData, setFormData] = useState<Partial<Room>>({});

    const handleAdd = () => {
        const newRoom: Room = {
            id: `room-${Date.now()}`,
            name: formData.name || "New Room",
            capacity: Number(formData.capacity) || 60,
            type: formData.type || "Classroom",
            building: formData.building || "Main Block"
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

    const filteredRooms = rooms.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-6 animate-in fade-in-50">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-primary">Room Management</h1>
                <div className="flex gap-4">
                    <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search rooms..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Add Room</Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Add New Room</DialogTitle></DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Name</Label>
                                    <Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Capacity</Label>
                                    <Input type="number" value={formData.capacity || ''} onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })} className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Type</Label>
                                    <Select onValueChange={v => setFormData({ ...formData, type: v as any })}>
                                        <SelectTrigger className="col-span-3"><SelectValue placeholder="Select Type" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Classroom">Classroom</SelectItem>
                                            <SelectItem value="Lab">Lab</SelectItem>
                                            <SelectItem value="Auditorium">Auditorium</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Building</Label>
                                    <Input value={formData.building || ''} onChange={e => setFormData({ ...formData, building: e.target.value })} className="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter><Button onClick={handleAdd}>Save</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map(room => (
                    <Card key={room.id} className="hover:shadow-md transition-all">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-lg ${room.type === 'Lab' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'}`}>
                                    <DoorClosed className="h-6 w-6" />
                                </div>
                                <MenuActions onEdit={() => { setCurrentRoom(room); setFormData(room); setIsEditOpen(true); }} onDelete={() => handleDelete(room.id)} />
                            </div>
                            <h3 className="font-bold text-xl mb-1">{room.name}</h3>
                            <p className="text-sm text-muted-foreground mb-4">{room.building}</p>
                            <div className="flex gap-2">
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    <Users className="h-3 w-3" /> {room.capacity}
                                </Badge>
                                <Badge variant="outline">{room.type}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Edit Room Details</DialogTitle></DialogHeader>
                    {/* Simplified for brevity - assume similar inputs */}
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Name</Label>
                            <Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Capacity</Label>
                            <Input type="number" value={formData.capacity || ''} onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })} className="col-span-3" />
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
