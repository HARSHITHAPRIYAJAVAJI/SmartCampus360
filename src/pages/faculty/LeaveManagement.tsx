import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, CheckCircle2, XCircle, AlertCircle, RefreshCw, Send, Check, X, Trash2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useOutletContext } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_FACULTY } from "@/data/mockFaculty";
import { executeSwap } from "@/utils/timetableAdjuster";
import { pushStudentAlert } from "@/utils/studentNotifications";

interface FacultyRequest {
    id: string;
    senderId: string;
    senderName: string;
    targetId: string;
    targetName: string;
    type: "swap" | "replacement" | "leave";
    parentId?: string;
    category?: string;
    date: string;
    endDate?: string;
    duration?: number;
    reason?: string;
    proofUrl?: string;
    period?: string;
    subject?: string;
    section?: string;
    branch?: string;
    year?: string;
    sectionName?: string;
    room?: string;
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
    const [selectedFacultyIds, setSelectedFacultyIds] = useState<string[]>([]);
    const [duration, setDuration] = useState("1");
    const [proofUploaded, setProofUploaded] = useState(false);
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
        // Dispatch global event for real-time UI/Notification updates
        window.dispatchEvent(new Event('faculty_request_updated'));
    };

    const incomingRequests = useMemo(() => {
        const facultyRec = MOCK_FACULTY.find(f => f.id === user.id || f.rollNumber === user.id);
        const possibleIds = [user.id, facultyRec?.id, facultyRec?.rollNumber].filter(Boolean);
        
        return allRequests.filter(r => 
            possibleIds.includes(r.targetId) && r.status === 'pending'
        ).sort((a,b) => b.timestamp - a.timestamp);
    }, [allRequests, user.id]);

    const myRequests = useMemo(() => {
        const facultyRec = MOCK_FACULTY.find(f => f.id === user.id || f.rollNumber === user.id);
        const possibleIds = [user.id, facultyRec?.id, facultyRec?.rollNumber].filter(Boolean);

        return allRequests.filter(r => 
            possibleIds.includes(r.senderId)
        ).sort((a,b) => b.timestamp - a.timestamp);
    }, [allRequests, user.id]);

    const availableFaculty = useMemo(() => {
        if (!swapDate || !period) return [];
        const publishedStoreStr = localStorage.getItem('published_timetables');
        const publishedTimetables = publishedStoreStr ? JSON.parse(publishedStoreStr) : {};
        const day = format(swapDate, "EEEE");
        const startTime = period.split('-')[0];

        // 1. Find current user's department for filtering
        const currentUserProf = MOCK_FACULTY.find(f => f.id === user.id || f.rollNumber === user.id);
        const userDept = currentUserProf?.department;

        // 2. Calculate current workload for sorting
        const workloadMap: Record<string, number> = {};
        Object.values(publishedTimetables).forEach((table: any) => {
            const grid = table.grid || table;
            Object.values(grid).forEach((session: any) => {
                if (!session) return;
                const fid = session.facultyId;
                if (fid) workloadMap[fid] = (workloadMap[fid] || 0) + 1;
            });
        });

        const filtered = MOCK_FACULTY.map(f => {
            if (f.id === user.id) return null;
            
            const isRestricted = f.designation.includes('HOD') || 
                                f.designation.toLowerCase().includes('technical trainer') ||
                                f.name.toLowerCase().includes('technical trainer');
            if (isRestricted) return null;

            if (userDept && f.department !== userDept) return null;
            
            let currentClass: any = null;
            Object.values(publishedTimetables).forEach((table: any) => {
                const grid = table.grid || table;
                const session = grid[`${day}-${startTime}`];
                if (session) {
                    const sFac = session.faculty?.toLowerCase() || '';
                    const fName = f.name?.toLowerCase() || '';
                    const sId = session.facultyId;
                    const fId = f.id;

                    const isMatch = (sId && sId === fId) || 
                                    (sFac && (sFac.includes(fName) || fName.includes(sFac)));

                    if (isMatch) {
                        currentClass = session;
                    }
                }
            });

            // USER REQUEST: For "Swap", show busy faculty with their classes. 
            // For "Replacement", show free faculty.
            if (requestType === 'swap') {
                if (!currentClass) return null;
            } else {
                if (currentClass) return null;
            }

            return {
                ...f,
                currentClass,
                workload: workloadMap[f.id] || 0
            };
        }).filter(Boolean) as any[];

        return filtered
            .sort((a, b) => a.workload - b.workload);
    }, [swapDate, period, user.id, requestType]);
    const toggleFaculty = (id: string) => {
        if (selectedFacultyIds.includes(id)) {
            setSelectedFacultyIds(prev => prev.filter(fid => fid !== id));
        } else {
            if (selectedFacultyIds.length < 3) {
                setSelectedFacultyIds(prev => [...prev, id]);
            } else {
                toast({
                    title: "Selection Limit",
                    description: "You can only broadcast a request to a maximum of 3 colleagues at once.",
                    variant: "destructive"
                });
            }
        }
    };

    const handleLeaveSubmit = () => {
        if (!date || !leaveType || !reason) {
            toast({
                title: "Missing Information",
                description: "Please select a date, type, and provide a reason.",
                variant: "destructive"
            });
            return;
        }

        const days = parseInt(duration);
        if (days > 5 && !proofUploaded) {
            toast({
                title: "Proof Required",
                description: "Leaves longer than 5 days require a supporting document.",
                variant: "destructive"
            });
            return;
        }

        const newLeave: FacultyRequest = {
            id: `leave-${Date.now()}`,
            senderId: user.id || 'current-user-id',
            senderName: user.name || 'Current User',
            targetId: 'admin',
            targetName: 'Admin',
            type: "leave",
            category: leaveType,
            date: format(date, "yyyy-MM-dd"),
            duration: days,
            reason,
            proofUrl: proofUploaded ? "proof_attached.pdf" : undefined,
            status: "pending",
            timestamp: Date.now()
        };

        const updated = [...allRequests, newLeave];
        saveRequests(updated);

        toast({
            title: "Leave Request Submitted",
            description: "Your application has been sent to the Admin for approval. You will be notified once reviewed.",
        });
        
        // Form cleanup
        setLeaveType("");
        setReason("");
        setDate(undefined);
    };

    const handleSwapSubmit = () => {
        if (!requestType || !swapDate || selectedFacultyIds.length === 0 || !period) {
            toast({
                title: "Incomplete Form",
                description: "Please fill in all details and select at least one colleague.",
                variant: "destructive"
            });
            return;
        }

        const day = format(swapDate, "EEEE");
        const startTime = period.split('-')[0];
        
        const publishedStoreStr = localStorage.getItem('published_timetables');
        const publishedTimetables = publishedStoreStr ? JSON.parse(publishedStoreStr) : {};
        let senderClass: any = null;
        
        // Find what the SENDER is currently teaching at that time
        Object.entries(publishedTimetables).forEach(([sectionId, table]: [string, any]) => {
            const grid = (table as any).grid || table;
            const session = grid[`${day}-${startTime}`];
            if (session) {
                const sFac = session.faculty?.toLowerCase() || '';
                const uName = user.name?.toLowerCase() || '';
                const sId = session.facultyId;
                const uId = user.id;

                const isMatch = (sId && sId === uId) || 
                                (sFac && (sFac.includes(uName) || uName.includes(sFac)));

                if (isMatch) {
                    senderClass = { ...session, fullSection: sectionId };
                }
            }
        });

        const broadcastGroupId = `broadcast-${Date.now()}`;
        const newReqs: FacultyRequest[] = selectedFacultyIds.map(fid => {
            const target = MOCK_FACULTY.find(f => f.id === fid);
            const parts = senderClass?.fullSection?.split('-') || [];
            
            return {
                id: `req-${Date.now()}-${fid}`,
                senderId: user.id,
                senderName: user.name,
                targetId: fid,
                targetName: target?.name || 'Unknown Faculty',
                type: requestType,
                parentId: broadcastGroupId,
                date: format(swapDate, "yyyy-MM-dd"),
                period,
                subject: senderClass?.subject || senderClass?.courseName || senderClass?.courseCode || "Unspecified Duty",
                section: senderClass?.fullSection || "All Sections",
                branch: parts[0] || "N/A",
                year: parts[1] || "N/A",
                sectionName: parts[3] || "N/A",
                room: senderClass?.room || "TBD",
                status: "pending",
                timestamp: Date.now()
            };
        });

        saveRequests([...allRequests, ...newReqs]);

        toast({
            title: "Requests Broadcasted",
            description: `Your ${requestType} request has been sent to ${newReqs.length} colleagues.`,
            className: "bg-indigo-600 text-white"
        });

        // Form cleanup
        setSelectedFacultyIds([]);
        setPeriod("");
        setSwapDate(undefined);
    };

    const executeSwapInDB = (request: FacultyRequest) => {
        const publishedStoreStr = localStorage.getItem('published_timetables');
        if (!publishedStoreStr) return;
        
        const publishedTimetables = JSON.parse(publishedStoreStr);
        const { updatedTimetables, totalAdjustments, adjustments } = executeSwap(
            {
                senderId: request.senderId,
                targetId: request.targetId,
                date: request.date,
                period: request.period || ""
            },
            publishedTimetables
        );

        if (totalAdjustments > 0) {
            adjustments.forEach((adj: any) => {
                const [branch, year, sem, section] = adj.section.split('-');
                pushStudentAlert({
                    title: "Schedule Change: Period Swap",
                    message: `Your class ${adj.subject} on ${request.date} at ${adj.time} will now be taken by ${request.targetName} due to a periodic adjustment.`,
                    branch,
                    year: parseInt(year),
                    section,
                    type: 'swap'
                });
            });

            localStorage.setItem('published_timetables', JSON.stringify(updatedTimetables));
            window.dispatchEvent(new Event('timetable_published'));
        }
    };

    const handleAction = (id: string, status: "approved" | "rejected") => {
        const request = allRequests.find(r => r.id === id);
        if (!request) return;

        let updated = allRequests.map(r => r.id === id ? { ...r, status } : r);

        // BROADCAST LOGIC: Last Standing Assignment
        if (status === "rejected" && request.parentId && request.parentId.startsWith('broadcast-')) {
            const groupRequests = updated.filter(r => r.parentId === request.parentId);
            const pendingInGroup = groupRequests.filter(r => r.status === 'pending');
            
            // If only one remains pending, auto-assign it
            if (pendingInGroup.length === 1) {
                const autoTarget = pendingInGroup[0];
                updated = updated.map(r => r.id === autoTarget.id ? { ...r, status: 'approved' } : r);
                
                toast({
                    title: "Automatic Assignment Locked",
                    description: `Multiple rejections received. The period has been automatically assigned to ${autoTarget.targetName} as per broadcast policy.`,
                    className: "bg-indigo-600 text-white"
                });

                // We need to execute the swap for this auto-approved request too
                executeSwapInDB(autoTarget);
            }
        }

        saveRequests(updated);

        // If a SWAP or REPLACEMENT is approved by the colleague (manual or automatic), execute it
        if (status === "approved" && (request.type === "swap" || request.type === "replacement")) {
            executeSwapInDB(request);
        }
        
        // Final updates...
        
        toast({
            title: status === 'approved' ? "Request Approved" : "Request Rejected",
            description: status === 'approved' ? "The master timetable has been updated to reflect the change." : "The request has been dismissed."
        });

    };

    const handleDeleteRequest = (id: string) => {
        const updated = allRequests.filter(r => r.id !== id && r.parentId !== id);
        saveRequests(updated);
        toast({
            title: "Request Deleted",
            description: "The request and all associated timetable changes have been permanently removed. Original state restored.",
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in-50">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Requests & Replacements</h1>
                <p className="text-muted-foreground">Manage your leave applications and period swaps.</p>
            </div>

            {/* PRIORITY INBOX: INCOMING REQUESTS */}
            {incomingRequests.length > 0 && (
                <Card className="border-indigo-600 dark:border-indigo-400 bg-indigo-50/20 shadow-lg animate-in slide-in-from-top-4 duration-500 overflow-hidden">
                    <CardHeader className="bg-indigo-600 text-white p-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-xl font-black">Colleague Support Required</CardTitle>
                                <CardDescription className="text-indigo-100 font-bold uppercase tracking-wider text-[10px] mt-1">Pending Broadcasts For You</CardDescription>
                            </div>
                            <div className="bg-white/10 p-3 rounded-2xl">
                                <Users className="h-6 w-6" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-indigo-50/50">
                                <TableRow>
                                    <TableHead className="font-black uppercase text-[10px] pl-6 text-indigo-900">Requester</TableHead>
                                    <TableHead className="font-black uppercase text-[10px] text-indigo-900">Type</TableHead>
                                    <TableHead className="font-black uppercase text-[10px] text-indigo-900">Date & Slot</TableHead>
                                    <TableHead className="font-black uppercase text-[10px] text-indigo-900 text-right pr-6">Decision</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {incomingRequests.map((req) => (
                                    <TableRow key={req.id} className="hover:bg-indigo-50/30 transition-colors">
                                        <TableCell className="pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-sm">
                                                    {req.senderName[0]}
                                                </div>
                                                <p className="font-black text-slate-800">{req.senderName}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`font-black text-[9px] uppercase ${req.type === 'swap' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-indigo-200 bg-indigo-50 text-indigo-700'}`}>
                                                {req.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-0.5">
                                                <p className="font-bold text-slate-700 text-xs">{req.date}</p>
                                                <p className="text-[10px] text-indigo-600 font-black uppercase tracking-tighter">Slot: {req.period}</p>
                                                <div className="flex flex-wrap items-center gap-1 mt-1.5 max-w-[200px]">
                                                    <Badge variant="outline" className="text-[8px] font-black uppercase py-0 px-1 border-indigo-200 bg-indigo-50/50 text-indigo-700"> {req.subject} </Badge>
                                                    <Badge variant="outline" className="text-[8px] font-black uppercase py-0 px-1 border-emerald-200 bg-emerald-50 text-emerald-700"> Room: {req.room} </Badge>
                                                    <Badge variant="outline" className="text-[8px] font-black uppercase py-0 px-1 border-amber-200 bg-amber-50 text-amber-700"> {req.branch} - {req.year}Y </Badge>
                                                    <Badge variant="outline" className="text-[8px] font-black uppercase py-0 px-1 border-slate-200 bg-slate-50 text-slate-600"> SEC: {req.sectionName} </Badge>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex justify-end gap-2">
                                                <Button 
                                                    size="sm" 
                                                    className="bg-emerald-600 hover:bg-emerald-700 font-black h-8 px-4 rounded-lg" 
                                                    onClick={() => handleAction(req.id, 'approved')}
                                                >
                                                    <Check className="h-4 w-4 mr-1" /> APPROVE
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    variant="destructive" 
                                                    className="font-black h-8 px-4 rounded-lg"
                                                    onClick={() => handleAction(req.id, 'rejected')}
                                                >
                                                    <X className="h-4 w-4 mr-1" /> REJECT
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

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
                                    <Input 
                                        type="number" 
                                        placeholder="1" 
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        min="1"
                                    />
                                </div>

                                {parseInt(duration) > 5 && (
                                    <div className={cn(
                                        "p-4 border-2 border-dashed rounded-xl text-center space-y-2 transition-colors",
                                        proofUploaded ? "border-green-500 bg-green-50" : "border-amber-200 bg-amber-50"
                                    )}>
                                        <div className="flex flex-col items-center">
                                            <AlertCircle className={cn("w-6 h-6 mb-2", proofUploaded ? "text-green-600" : "text-amber-600")} />
                                            <p className="text-xs font-bold text-slate-600">Proof Required for {duration} Days</p>
                                        </div>
                                        <Button 
                                            size="sm" 
                                            variant={proofUploaded ? "secondary" : "default"}
                                            className="w-full"
                                            onClick={() => setProofUploaded(true)}
                                        >
                                            {proofUploaded ? "File Uploaded" : "Upload Supporting Document"}
                                        </Button>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label>Reason</Label>
                                    <Textarea
                                        placeholder="Please provide a reason for your leave..."
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                </div>

                                <Button className="w-full bg-primary font-bold shadow-lg h-12 rounded-xl" onClick={handleLeaveSubmit}>
                                    <Send className="w-4 h-4 mr-2" />
                                    Submit Request
                                </Button>
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
                                        <li>Approvals usually take 5-6 hours.</li>
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
                                        <TableHead className="text-right pr-6">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {myRequests.filter(r => r.type === 'leave').length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                                No leave applications found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        myRequests.filter(r => r.type === 'leave').map((leave) => (
                                            <TableRow key={leave.id}>
                                                <TableCell className="font-bold capitalize">{leave.category || 'Leave'} Application</TableCell>
                                                <TableCell>{leave.date}</TableCell>
                                                <TableCell>{leave.duration} Day(s)</TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        leave.status === 'approved' ? 'default' :
                                                            leave.status === 'rejected' ? 'destructive' : 'secondary'
                                                    } className={
                                                        leave.status === 'approved' ? 'bg-green-500 hover:bg-green-600 font-black' : 
                                                        leave.status === 'pending' ? 'bg-amber-100 text-amber-700 border-none' : ''
                                                    }>
                                                        {leave.status.toUpperCase()}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteRequest(leave.id)} className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
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
                                            <SelectItem value="09:30-10:30">09:40 AM - 10:40 AM</SelectItem>
                                            <SelectItem value="10:30-11:30">10:40 AM - 11:40 AM</SelectItem>
                                            <SelectItem value="11:40-12:40">11:40 AM - 12:40 PM</SelectItem>
                                            <SelectItem value="01:30-02:30">01:20 PM - 02:20 PM</SelectItem>
                                            <SelectItem value="02:30-03:30">02:20 PM - 03:20 PM</SelectItem>
                                            <SelectItem value="03:30-04:30">03:20 PM - 04:20 PM</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-4">
                                    <Label className="flex items-center justify-between">
                                        <span>Target Faculty Replacement Selection (Pick up to 3)</span>
                                        {availableFaculty.length > 0 && (
                                            <Badge variant="outline" className="text-[9px] font-black bg-indigo-50 text-indigo-600 border-indigo-200">
                                                {selectedFacultyIds.length}/3 Selected
                                            </Badge>
                                        )}
                                    </Label>
                                    
                                    {!swapDate || !period ? (
                                        <div className="p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center bg-muted/20 opacity-60">
                                            <Clock className="w-8 h-8 text-muted-foreground mb-2" />
                                            <p className="text-sm font-bold text-muted-foreground">Select date & period first to scan available faculty</p>
                                        </div>
                                    ) : availableFaculty.length === 0 ? (
                                        <div className="p-8 border-2 border-dashed border-amber-200 rounded-2xl flex flex-col items-center justify-center text-center bg-amber-50">
                                            <AlertCircle className="w-8 h-8 text-amber-600 mb-2" />
                                            <p className="text-sm font-bold text-amber-800">No free departmental colleagues found for this slot</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {availableFaculty.map(faculty => {
                                                const isSelected = selectedFacultyIds.includes(faculty.id);
                                                return (
                                                    <div 
                                                        key={faculty.id}
                                                        onClick={() => toggleFaculty(faculty.id)}
                                                        className={cn(
                                                            "p-3 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-center gap-2 group relative overflow-hidden",
                                                            isSelected 
                                                                ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 ring-2 ring-indigo-600/20" 
                                                                : "border-border hover:border-indigo-200 hover:bg-indigo-50/10 bg-card shadow-sm"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "h-12 w-12 rounded-full flex items-center justify-center text-sm font-black transition-colors",
                                                            isSelected ? "bg-indigo-600 text-white" : "bg-muted text-muted-foreground group-hover:bg-indigo-100 group-hover:text-indigo-600"
                                                        )}>
                                                            {faculty.name[0]}
                                                        </div>
                                                        <div className="text-center w-full px-2">
                                                            <p className="text-[11px] font-black leading-tight text-slate-900 dark:text-slate-100 truncate">{faculty.name}</p>
                                                            <p className="text-[9px] uppercase font-bold text-muted-foreground mt-0.5 truncate">{faculty.designation}</p>
                                                            {faculty.currentClass && (
                                                                <Badge variant="outline" className="mt-2 text-[8px] font-black uppercase text-indigo-700 bg-indigo-50 border-indigo-200 w-full justify-center">
                                                                    Busy: {faculty.currentClass.subject}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        
                                                        {isSelected && (
                                                            <div className="absolute top-1 right-1">
                                                                <CheckCircle2 className="h-4 w-4 text-indigo-600 fill-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {availableFaculty.length > 0 && (
                                        <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-tight ml-1 animate-pulse italic">
                                            Broadcast Mode: Showing all active duties for your branch. Request will be sent to up to 3 selected colleagues.
                                        </p>
                                    )}
                                </div>

                                <Button 
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl h-12 shadow-lg shadow-indigo-600/20" 
                                    onClick={handleSwapSubmit}
                                    disabled={selectedFacultyIds.length === 0}
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Send Swap Request
                                </Button>
                            </CardContent>
                        </Card>
                        
                        <div className="space-y-6">
                            <Card className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 border-indigo-100 dark:border-indigo-900 rounded-[2rem] shadow-sm overflow-hidden">
                                <CardHeader className="bg-indigo-600/5 p-6 border-b border-indigo-100/50">
                                    <CardTitle className="text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5" />
                                        Intelligent Swap Engine
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-indigo-700 dark:text-indigo-400 space-y-4 p-6 font-medium leading-relaxed">
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 shrink-0 rounded-xl bg-white border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                                            <Check className="h-5 w-5" />
                                        </div>
                                        <p><strong>Conflict Avoidance:</strong> Our system dynamically scans the master timetable to ensure you only request swaps with colleagues who are definitely free.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 shrink-0 rounded-xl bg-white border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                                            <Send className="h-5 w-5" />
                                        </div>
                                        <p><strong>Instant Sync:</strong> Once your colleague accepts, the master timetable for both faculty and their students is updated instantly across the campus network.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="grid gap-6">
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
                                            <TableHead className="text-right">Action</TableHead>
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
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm" onClick={() => handleDeleteRequest(req.id)} className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
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
