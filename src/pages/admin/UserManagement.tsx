import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, MoreHorizontal, Mail, Phone, Shield, Trash2, Edit } from "lucide-react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Mock Data
const MOCK_USERS = [
    { id: '1', name: 'John Doe', email: 'john@campus.edu', role: 'Faculty', department: 'CSE', status: 'Active' },
    { id: '2', name: 'Jane Smith', email: 'jane@campus.edu', role: 'Admin', department: 'Administration', status: 'Active' },
    { id: '3', name: 'Robert Brown', email: 'robert@campus.edu', role: 'Student', department: 'ECE', status: 'Inactive' },
    { id: '4', name: 'Alice Johnson', email: 'alice@campus.edu', role: 'Faculty', department: 'AIML', status: 'Active' },
    { id: '5', name: 'Michael White', email: 'michael@campus.edu', role: 'Student', department: 'CSE', status: 'Active' },
];

const UserManagement = () => {
    const { toast } = useToast();
    const [users, setUsers] = useState(MOCK_USERS);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);

    // New User Form State
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Student', department: 'CSE' });

    const handleAddUser = () => {
        const user = {
            id: Date.now().toString(),
            ...newUser,
            status: 'Active'
        };
        setUsers([...users, user]);
        setIsAddOpen(false);
        setNewUser({ name: '', email: '', role: 'Student', department: 'CSE' });
        toast({ title: "User Created", description: `${user.name} has been added successfully.` });
    };

    const handleDeleteUser = (id: string) => {
        setUsers(users.filter(u => u.id !== id));
        toast({ title: "User Deleted", description: "User has been removed from the system.", variant: "destructive" });
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in-50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground">Manage user access, roles, and permissions.</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <UserPlus className="h-4 w-4" /> Add User
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New User</DialogTitle>
                            <DialogDescription>Create a new account for a student, faculty, or staff member.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Name</Label>
                                <Input value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Email</Label>
                                <Input value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Role</Label>
                                <Select value={newUser.role} onValueChange={v => setNewUser({ ...newUser, role: v })}>
                                    <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Student">Student</SelectItem>
                                        <SelectItem value="Faculty">Faculty</SelectItem>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                        <SelectItem value="Staff">Staff</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Dept</Label>
                                <Select value={newUser.department} onValueChange={v => setNewUser({ ...newUser, department: v })}>
                                    <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CSE">CSE</SelectItem>
                                        <SelectItem value="AIML">AIML</SelectItem>
                                        <SelectItem value="ECE">ECE</SelectItem>
                                        <SelectItem value="Administration">Administration</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAddUser}>Create Account</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>All Users</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{user.name}</span>
                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={
                                            user.role === 'Admin' ? 'border-red-200 bg-red-50 text-red-700' :
                                                user.role === 'Faculty' ? 'border-blue-200 bg-blue-50 text-blue-700' :
                                                    'border-green-200 bg-green-50 text-green-700'
                                        }>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{user.department}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                                            {user.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.email)}>
                                                    Copy Email
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteUser(user.id)}>
                                                    Delete User
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserManagement;
