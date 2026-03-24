import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, CheckCircle2, XCircle, AlertCircle, RefreshCw, Send, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useOutletContext } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_FACULTY } from "@/data/mockFaculty";

interface FacultyRequest {
    id: string;
    senderId: string;
    senderName: string;
    targetId: string;
    targetName: string;
    type: "swap" | "replacement";
    date: string;
    period: string;
    status: "pending" | "approved" | "rejected";
    timestamp: number;
}

const LeaveManagement = () => {
    const { toast } = useToast();
    const { user } = useOutletContext<{ user: any }>();
    const [date, setDate] = useState<Date>();
    const [leaveType, setLeaveType] = useState("");
    const [reason, setReason] = useState("");

    // Swap State
    const [swapDate, setSwapDate] = useState<Date>();
    const [requestType, setRequestType] = useState<"swap" | "replacement">("swap");
    const [targetFacultyId, setTargetFacultyId] = useState("");
    const [period, setPeriod] = useState("");

    // Persistent Requests
    const [allRequests, setAllRequests] = useState<FacultyRequest[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('FACULTY_REQUESTS');
        if (saved) {
            setAllRequests(JSON.parse(saved));
        }
    }, []);

    const saveRequests = (reqs: FacultyRequest[]) => {
        localStorage.setItem('FACULTY_REQUESTS', JSON.stringify(reqs));
        setAllRequests(reqs);
    };

    const myRequests = useMemo(() => 
        allRequests.filter(r => r.senderId === user.id).sort((a,b) => b.timestamp - a.timestamp), 
    [allRequests, user.id]);

    const incomingRequests = useMemo(() => 
        allRequests.filter(r => r.targetId === user.id).sort((a,b) => b.timestamp - a.timestamp), 
    [allRequests, user.id]);

    const handleLeaveSubmit = () => {
        if (!leaveType || !date || !reason) {
            toast({
                title: "Incomplete Form",
                description: "Please fill in all details before submitting.",
                variant: "destructive"
            });
            return;
        }

        toast({
            title: "Leave Request Submitted",
            description: "Your application has been sent to the Admin for approval. You will be notified once reviewed.",
            variant: "default"
        });
        
        // Form cleanup
        setLeaveType("");
        setReason("");
        setDate(undefined);
    };

    const handleSwapSubmit = () => {
        if (!requestType || !swapDate || !targetFacultyId || !period) {
            toast({
                title: "Incomplete Form",
                description: "Please fill in all details for the replacement request.",
                variant: "destructive"
            });
            return;
        }

        const target = MOCK_FACULTY.find(f => f.id === targetFacultyId);
        
        const newReq: FacultyRequest = {
            id: `req-${Date.now()}`,
            senderId: user.id || 'current-user-id',
            senderName: user.name || 'Current User',
            targetId: targetFacultyId,
            targetName: target?.name || 'Unknown Faculty',
            type: requestType,
            date: format(swapDate, "yyyy-MM-dd"),
            period,
            status: "pending",
            timestamp: Date.now()
        };

        saveRequests([...allRequests, newReq]);

        toast({
            title: "Request Sent",
            description: `Your ${requestType} request has been sent to ${newReq.targetName}.`,
            className: "bg-indigo-600 text-white"
        });

        // Form cleanup
        setTargetFacultyId("");
        setPeriod("");
        setSwapDate(undefined);
    };

    const handleAction = (id: string, status: "approved" | "rejected") => {
        const updated = allRequests.map(r => r.id === id ? { ...r, status } : r);
        saveRequests(updated);
        
        toast({
            title: status === 'approved' ? "Request Approved" : "Request Rejected",
            description: status === 'approved' ? "The timetable will reflect this change shortly." : "The request has been dismissed."
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in-50">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Requests & Replacements</h1>
                <p className="text-muted-foreground">Manage your leave applications and period swaps.</p>
            </div>

            <Tabs defaultValue="leave" className="w-full">
                <TabsList className="grid w-full md:w-[400px] grid-cols-2">
                    <TabsTrigger value="leave">Leave Request</TabsTrigger>
                    <TabsTrigger value="swap">Period Swap / Replace</TabsTrigger>
                </TabsList>
                
                {/* LEAVE TAB */}
                <TabsContent value="leave" className="mt-6 space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Apply for Leave</CardTitle>
                                <CardDescription>Submit a new leave request.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Leave Type</Label>
                                    <Select value={leaveType} onValueChange={setLeaveType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sick">Sick Leave</SelectItem>
                                            <SelectItem value="casual">Casual Leave</SelectItem>
                                            <SelectItem value="academic">Academic Leave</SelectItem>
                                            <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Start Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="space-y-2">
                                    <Label>Duration (Days)</Label>
                                    <Input type="number" placeholder="1" />
                                </div>

                                <div className="space-y-2">
                                    <Label>Reason</Label>
                                    <Textarea
                                        placeholder="Please provide a reason for your leave..."
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                </div>

                                <Button className="w-full" onClick={handleLeaveSubmit}>Submit Request</Button>
                            </CardContent>
                        </Card>

                        {/* Leave Balance & Stats */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Leave Balance</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">8</div>
                                        <div className="text-sm text-blue-800 dark:text-blue-300 font-medium">Casual Leaves</div>
                                    </div>
                                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">12</div>
                                        <div className="text-sm text-green-800 dark:text-green-300 font-medium">Sick Leaves</div>
                                    </div>
                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center col-span-2">
                                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">5</div>
                                        <div className="text-sm text-purple-800 dark:text-purple-300 font-medium">Academic Leaves</div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-muted/30">
                                <CardHeader>
                                    <CardTitle className="text-base">Note</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-sm list-disc pl-4 space-y-1 text-muted-foreground">
                                        <li>Approvals usually take 24-48 hours.</li>
                                        <li>In case of emergency, contact HR directly.</li>
                                        <li>Medical certificate required for &gt;3 days sick leave.</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Leave History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Dates</TableHead>
                                        <TableHead>Days</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[
                                        { id: 1, type: "Sick Leave", from: "2025-02-10", to: "2025-02-12", days: 3, status: "Approved" },
                                        { id: 2, type: "Casual Leave", from: "2025-01-15", to: "2025-01-15", days: 1, status: "Rejected" },
                                        { id: 3, type: "Academic Leave", from: "2024-12-05", to: "2024-12-06", days: 2, status: "Approved" },
                                    ].map((leave) => (
                                        <TableRow key={leave.id}>
                                            <TableCell className="font-medium">{leave.type}</TableCell>
                                            <TableCell>{leave.from} - {leave.to}</TableCell>
                                            <TableCell>{leave.days}</TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    leave.status === 'Approved' ? 'default' :
                                                        leave.status === 'Rejected' ? 'destructive' : 'secondary'
                                                } className={
                                                    leave.status === 'Approved' ? 'bg-green-500 hover:bg-green-600 font-bold' : ''
                                                }>
                                                    {leave.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SWAP & REPLACEMENT TAB */}
                <TabsContent value="swap" className="mt-6 space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Request Period Swap / Replacement</CardTitle>
                                <CardDescription>Ask a colleague to cover your class or swap a period.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Request Type</Label>
                                    <Select value={requestType} onValueChange={(value) => setRequestType(value as "swap" | "replacement")}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="swap">Period Swap (Mutually beneficial)</SelectItem>
                                            <SelectItem value="replacement">Class Replacement (Substitute)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Date of Origin Class</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !swapDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {swapDate ? format(swapDate, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={swapDate}
                                                onSelect={setSwapDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="space-y-2">
                                    <Label>Select Time Period</Label>
                                    <Select value={period} onValueChange={setPeriod}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select period to swap/replace" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="09:40-10:40">09:40 AM - 10:40 AM</SelectItem>
                                            <SelectItem value="10:40-11:40">10:40 AM - 11:40 AM</SelectItem>
                                            <SelectItem value="11:40-12:40">11:40 AM - 12:40 PM</SelectItem>
                                            <SelectItem value="13:20-14:20">01:20 PM - 02:20 PM</SelectItem>
                                            <SelectItem value="14:20-15:20">02:20 PM - 03:20 PM</SelectItem>
                                            <SelectItem value="15:20-16:20">03:20 PM - 04:20 PM</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Select Target Faculty</Label>
                                    <Select value={targetFacultyId} onValueChange={setTargetFacultyId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select faculty to request" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {MOCK_FACULTY.filter(f => f.name !== user?.name).map(faculty => (
                                                <SelectItem key={faculty.id} value={faculty.id}>
                                                    {faculty.name} ({faculty.department})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleSwapSubmit}>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Send Request
                                </Button>
                            </CardContent>
                        </Card>
                        
                        <div className="space-y-6">
                            <Card className="bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900">
                                <CardHeader>
                                    <CardTitle className="text-indigo-800 dark:text-indigo-300">How it works</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-indigo-700 dark:text-indigo-400 space-y-3">
                                    <p><strong>Period Swap:</strong> You take one of their classes, they take yours. You must agree on the replacement period offline or through chat.</p>
                                    <p><strong>Class Replacement:</strong> The target faculty will substitute your class. Typically used for short leaves or emergencies.</p>
                                    <p>Once the target faculty <strong>Approves</strong> the request, the master timetable is dynamically updated for the specified date.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {incomingRequests.length > 0 && (
                            <Card className="border-indigo-200 bg-indigo-50/10 dark:border-indigo-900/50">
                                <CardHeader>
                                    <CardTitle>Incoming Requests (Received)</CardTitle>
                                    <CardDescription>Colleagues asking for your help or a swap.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>From</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Date & Time</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {incomingRequests.map((req) => (
                                                <TableRow key={req.id}>
                                                    <TableCell className="font-bold">{req.senderName}</TableCell>
                                                    <TableCell className="capitalize">{req.type}</TableCell>
                                                    <TableCell>{req.date} <br/> <span className="text-xs text-muted-foreground">{req.period}</span></TableCell>
                                                    <TableCell>
                                                        <Badge variant={req.status === 'approved' ? 'default' : req.status === 'rejected' ? 'destructive' : 'secondary'}>
                                                            {req.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {req.status === 'pending' ? (
                                                            <div className="flex justify-end gap-2">
                                                                <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700" onClick={() => handleAction(req.id, 'approved')}>
                                                                    <Check className="h-4 w-4 mr-1" /> Approve
                                                                </Button>
                                                                <Button size="sm" variant="destructive" onClick={() => handleAction(req.id, 'rejected')}>
                                                                    <X className="h-4 w-4 mr-1" /> Reject
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground italic">Processed</span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle>My Requests (Sent)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Target Faculty</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Date & Time</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {myRequests.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                                    No requests sent yet.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            myRequests.map((req) => (
                                                <TableRow key={req.id}>
                                                    <TableCell className="font-medium text-indigo-600 dark:text-indigo-400">{req.targetName}</TableCell>
                                                    <TableCell className="capitalize">{req.type}</TableCell>
                                                    <TableCell>{req.date} <br/> <span className="text-xs text-muted-foreground">{req.period}</span></TableCell>
                                                    <TableCell>
                                                        <Badge variant={
                                                            req.status === 'approved' ? 'default' :
                                                                req.status === 'rejected' ? 'destructive' : 'secondary'
                                                        } className={
                                                            req.status === 'approved' ? 'bg-green-500 hover:bg-green-600' : ''
                                                        }>
                                                            {req.status === 'approved' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                                            {req.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                                                            {req.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                                                            {req.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default LeaveManagement;
