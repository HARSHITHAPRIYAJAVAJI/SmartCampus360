import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, CheckCircle2, XCircle, AlertCircle, RefreshCw, Send, Check, X, Trash2, Users, ShieldCheck, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useOutletContext } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_FACULTY } from "@/data/mockFaculty";
import { executeSwap, revertSpecificRequest, revertLeavePeriods } from "@/utils/timetableAdjuster";
import { alertService } from "@/services/alertService";

interface FacultyRequest {
    id: string;
    senderId: string;
    senderName: string;
    targetId: string;
    targetName: string;
    type: "swap" | "replacement" | "leave" | "resignation";
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

    // Resignation State
    const [noticePeriod, setNoticePeriod] = useState("3");
    const [resignationReason, setResignationReason] = useState("");
    const [lastWorkingDate, setLastWorkingDate] = useState<Date>();

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

    const leaveBalances = useMemo(() => {
        // INSTITUTIONAL UPDATE: Total 12 personal leaves per semester (6 CL, 6 Sick)
        const totals = { casual: 6, sick: 6 }; 
        myRequests.forEach(req => {
            if (req.type === 'leave' && req.status === 'approved') {
                const cat = req.category as keyof typeof totals;
                if (totals[cat] !== undefined) {
                    totals[cat] -= (req.duration || 0);
                }
            }
        });
        return totals;
    }, [myRequests]);

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

            // USER REQUEST: Always show faculty details to allow requester to choose
            // We provide the currentClass info so they know if it's a Swap or Replacement opportunity
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
        
        // Balance Check
        const currentBalance = leaveBalances[leaveType as keyof typeof leaveBalances] || 0;
        if (days > currentBalance) {
            toast({
                title: "Insufficient Balance",
                description: `You only have ${currentBalance} day(s) left for ${leaveType} leave.`,
                variant: "destructive"
            });
            return;
        }

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
        // Find what the SENDER is currently teaching at that time
        // We look for all potential matches and prioritize non-lab sessions to avoid false-positive restrictions
        const matchingSessions: any[] = [];
        
        Object.entries(publishedTimetables).forEach(([sectionId, table]: [string, any]) => {
            const grid = (table as any).grid || table;
            const session = grid[`${day}-${startTime}`];
            if (session) {
                const sFac = session.faculty?.toLowerCase() || '';
                const uName = user.name?.toLowerCase() || '';
                const sId = session.facultyId;
                const uId = user.id;

                const isMatch = (uId && sId === uId) || 
                                (uName && (sFac && (sFac.includes(uName) || uName.includes(sFac))));

                if (isMatch) {
                    matchingSessions.push({ ...session, fullSection: sectionId });
                }
            }
        });

        // Pick the most relevant session (prefer non-lab if available)
        let senderClass = matchingSessions.find(s => {
            const sbj = (s.subject || s.courseName || s.courseCode || "").toUpperCase();
            return !sbj.includes("LAB") && !sbj.includes("PROJECT") && !sbj.includes("WORKSHOP");
        }) || matchingSessions[0];

        if (senderClass) {
            const subject = (senderClass.subject || senderClass.courseName || senderClass.courseCode || "").toUpperCase();
            // Stricter check for Lab/Project to avoid blocking subjects with "Lab" in name if they are theories
            // Here we look for " LAB" or "-LAB" or "LAB " or exact match "LAB"
            const isLabOrProject = subject === "LAB" || 
                                   subject.includes(" LAB") || 
                                   subject.includes("-LAB") || 
                                   subject.includes("LAB ") ||
                                   subject.includes("PROJECT") || 
                                   subject.includes("WORKSHOP");

            if (isLabOrProject) {
                toast({
                    title: "Action Restricted",
                    description: "Lab and Project sessions do not require rescheduling. The co-faculty member will handle the session.",
                    variant: "destructive"
                });
                return;
            }
        }

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

        newReqs.forEach(req => {
            alertService.sendAlert({
                title: `${requestType === 'swap' ? 'Swap' : 'Replacement'}: ${user.name}`,
                message: `${req.date} | ${req.period}`,
                category: 'substitution',
                type: 'urgent',
                targetAudience: 'faculty',
                recipientId: req.targetId,
                redirectUrl: '/dashboard/leave'
            });
        });

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

    const handleResignationSubmit = () => {
        if (!resignationReason || !lastWorkingDate) {
            toast({
                title: "Incomplete Request",
                description: "Please provide a reason and select your intended last working date.",
                variant: "destructive"
            });
            return;
        }

        const newReq: FacultyRequest = {
            id: `resign-${Date.now()}`,
            senderId: user.id,
            senderName: user.name,
            targetId: 'admin',
            targetName: 'Admin',
            type: "resignation",
            category: "Resignation",
            date: format(lastWorkingDate, "yyyy-MM-dd"),
            reason: resignationReason,
            status: "pending",
            timestamp: Date.now()
        };

        saveRequests([...allRequests, newReq]);
        
        // Notify Admin
        alertService.sendAlert({
            title: "🛑 Resignation Submitted",
            message: `${user.name} has submitted a formal resignation request.`,
            category: 'general',
            type: 'urgent',
            targetAudience: 'admin',
            redirectUrl: '/dashboard/requests'
        });

        toast({
            title: "Resignation Submitted",
            description: "Your request has been forwarded to the HR & Registry department for review.",
        });

        setResignationReason("");
        setLastWorkingDate(undefined);
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
                alertService.sendAlert({
                    title: "Schedule Change: Period Swap",
                    message: `Your class ${adj.subject} on ${request.date} at ${adj.time} will now be taken by ${request.targetName} due to a periodic adjustment.`,
                    branch,
                    year: parseInt(year),
                    section,
                    category: 'timetable',
                    type: 'normal',
                    targetAudience: 'students',
                    redirectUrl: '/dashboard/student'
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
        const request = allRequests.find(r => r.id === id);
        
        // If it was an approved swap/replacement, REVERT IT before deleting
        if (request && request.status === 'approved') {
            const publishedStoreStr = localStorage.getItem('published_timetables');
            if (publishedStoreStr) {
                let updatedTimetables = JSON.parse(publishedStoreStr);
                
                if (request.type === 'leave') {
                    // Revert all replacements linked to this leave
                    const { updatedTimetables: reverted } = revertLeavePeriods(request.senderId, updatedTimetables);
                    updatedTimetables = reverted;
                } else if (request.type === 'swap' || request.type === 'replacement') {
                    // Revert specific swap/replacement
                    updatedTimetables = revertSpecificRequest(request, updatedTimetables);
                }
                
                localStorage.setItem('published_timetables', JSON.stringify(updatedTimetables));
                window.dispatchEvent(new Event('timetable_published'));
            }
        }

        const updated = allRequests.filter(r => r.id !== id && r.parentId !== id);
        saveRequests(updated);
        toast({
            title: "Request Deleted",
            description: "The request has been removed and original duties have been restored.",
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
                <TabsList className="grid w-full md:w-[600px] grid-cols-3">
                    <TabsTrigger value="leave">Leave Request</TabsTrigger>
                    <TabsTrigger value="swap">Period Swap / Replace</TabsTrigger>
                    <TabsTrigger value="resignation" className="text-destructive hover:bg-destructive/5">Resignation</TabsTrigger>
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
                                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{leaveBalances.casual}</div>
                                        <div className="text-sm text-blue-800 dark:text-blue-300 font-medium">Casual Leaves</div>
                                    </div>
                                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">{leaveBalances.sick}</div>
                                        <div className="text-sm text-green-800 dark:text-green-300 font-medium">Sick/Medical Leaves</div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-muted/30">
                                <CardHeader>
                                    <CardTitle className="text-base uppercase font-black text-slate-800">TKR Leave Policy Guidelines</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-[11px] list-disc pl-4 space-y-2 text-muted-foreground font-bold leading-relaxed">
                                        <li><span className="text-slate-900">Semester Quota:</span> Total 12 personal leaves allowed per semester (CL + Sick combined).</li>
                                        <li><span className="text-slate-900">Casual Leave (CL):</span> 6 days per semester. Max 2 consecutive days without HOD approval.</li>
                                        <li><span className="text-slate-900">Medical Leave (ML):</span> 6 days per semester. Medical certificate required for more than 2 days.</li>
                                        <li><span className="text-slate-900">Loss of Pay (LOP):</span> Applicable once the 12-day semester quota is exhausted.</li>
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
                                            <SelectItem value="09:40-10:40">09:40 AM - 10:40 AM</SelectItem>
                                            <SelectItem value="10:40-11:40">10:40 AM - 11:40 AM</SelectItem>
                                            <SelectItem value="11:40-12:40">11:40 AM - 12:40 PM</SelectItem>
                                            <SelectItem value="01:20-02:20">01:20 PM - 02:20 PM</SelectItem>
                                            <SelectItem value="02:20-03:20">02:20 PM - 03:20 PM</SelectItem>
                                            <SelectItem value="03:20-04:20">03:20 PM - 04:20 PM</SelectItem>
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
                                            <p className="text-sm font-bold text-amber-800">No {requestType === 'swap' ? 'faculty with classes' : 'free colleagues'} found for this slot</p>
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

                {/* RESIGNATION TAB */}
                <TabsContent value="resignation" className="mt-6 space-y-6 animate-in fade-in-50 duration-500">
                    <div className="grid gap-8 lg:grid-cols-12">
                        <div className="lg:col-span-7 space-y-6">
                            <Card className="border-none shadow-[0_20px_50px_rgba(239,68,68,0.15)] rounded-[2rem] overflow-hidden overflow-visible relative">
                                {/* Decorative Gradient Overlay */}
                                <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                                    <XCircle className="w-64 h-64 rotate-12" />
                                </div>

                                <CardHeader className="bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/10 border-b p-8">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="h-12 w-12 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-black tracking-tight bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">Formal Resignation</CardTitle>
                                            <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-70">Notice Submission & Exit Processing</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                
                                <CardContent className="p-8 space-y-8">
                                    {/* Policy Alert */}
                                    <div className="p-5 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-200/50 flex gap-4 items-start shadow-sm">
                                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-amber-900 dark:text-amber-400 leading-none">Standard Notice Period Policy</p>
                                            <p className="text-[12px] font-medium text-amber-700/80 dark:text-amber-500/80 leading-relaxed">
                                                A minimum notice period of <span className="font-black text-rose-600 underline underline-offset-4">3 months (90 days)</span> is required to ensure academic continuity and proper handover of responsibilities.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid gap-6">
                                        <div className="space-y-3">
                                            <Label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                                <CalendarIcon className="w-3.5 h-3.5" /> Intended Last Working Date
                                            </Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full justify-start text-left font-bold h-14 rounded-2xl border-slate-200 hover:border-rose-300 hover:bg-rose-50/50 transition-all text-base",
                                                            !lastWorkingDate && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {lastWorkingDate ? format(lastWorkingDate, "PPP") : <span>Select your final date...</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 rounded-2xl shadow-2xl border-none">
                                                    <Calendar
                                                        mode="single"
                                                        selected={lastWorkingDate}
                                                        onSelect={setLastWorkingDate}
                                                        disabled={(date) => date < new Date()}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5" /> Notice Duration
                                            </Label>
                                            <Select value={noticePeriod} onValueChange={setNoticePeriod}>
                                                <SelectTrigger className="h-14 rounded-2xl border-slate-200 font-bold text-base hover:border-rose-300 focus:ring-rose-500/20">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl shadow-2xl border-none">
                                                    <SelectItem value="1" className="font-medium p-3">1 Month (Short Notice / Emergency)</SelectItem>
                                                    <SelectItem value="2" className="font-medium p-3">2 Months (Standard Transition)</SelectItem>
                                                    <SelectItem value="3" className="font-medium p-3 font-black text-rose-600">3 Months (Standard Institutional Policy)</SelectItem>
                                                    <SelectItem value="6" className="font-medium p-3">6 Months (End of Academic Session)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                                <FileText className="h-3.5 w-3.5" /> Statement of Intent / Reason
                                            </Label>
                                            <Textarea
                                                placeholder="Please provide a brief reason for your resignation..."
                                                className="rounded-2xl min-h-[140px] border-slate-200 font-medium p-4 focus:ring-rose-500/20 text-base"
                                                value={resignationReason}
                                                onChange={(e) => setResignationReason(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <Button 
                                        className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black h-16 rounded-2xl shadow-xl shadow-rose-600/30 transition-all hover:scale-[1.01] active:scale-95 text-lg" 
                                        onClick={handleResignationSubmit}
                                    >
                                        <Send className="w-5 h-5 mr-3" />
                                        Submit Formal Notice
                                    </Button>

                                    <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        This action will trigger an official notification to HR and the Registry.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-5 space-y-6">
                            <Card className="bg-slate-900 text-white border-none shadow-2xl rounded-[2rem] overflow-hidden">
                                <CardHeader className="border-b border-white/10 p-8 bg-white/[0.02]">
                                    <CardTitle className="text-xl font-black flex items-center gap-3">
                                        <ShieldCheck className="h-6 w-6 text-emerald-400" />
                                        Institutional Exit Protocol
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 space-y-8">
                                    <div className="flex gap-5 group">
                                        <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                                            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-black text-sm uppercase tracking-tight">Clearance Certificate</h4>
                                            <p className="text-xs text-slate-400 font-medium leading-relaxed">Verification of all equipment, library assets, and internal marks completion is mandatory.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-5 group">
                                        <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                                            <ShieldCheck className="h-6 w-6 text-blue-400" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-black text-sm uppercase tracking-tight">Benefit Settlement</h4>
                                            <p className="text-xs text-slate-400 font-medium leading-relaxed">Gratuity and PF settlements are initiated upon successful verification of your last working day.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-5 group">
                                        <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                                            <Send className="h-6 w-6 text-purple-400" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-black text-sm uppercase tracking-tight">Experience Letter</h4>
                                            <p className="text-xs text-slate-400 font-medium leading-relaxed">Official relieving letters and experience certificates are issued on your final day of service.</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden">
                                <CardHeader className="bg-slate-50 dark:bg-slate-900/50 p-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle className="text-lg font-black tracking-tight">Active Request Tracking</CardTitle>
                                            <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">HR & Registry Decision Status</CardDescription>
                                        </div>
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <Users className="h-5 w-5" />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {myRequests.filter(r => r.type === 'resignation').length === 0 ? (
                                        <div className="py-12 text-center opacity-30 border-2 border-dashed rounded-3xl">
                                            <AlertCircle className="h-10 w-10 mx-auto mb-3" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">No active resignation requests</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {myRequests.filter(r => r.type === 'resignation').map(req => (
                                                <div key={req.id} className="p-5 rounded-2xl border border-rose-100 bg-rose-50/20 flex justify-between items-center group hover:border-rose-200 transition-all">
                                                    <div className="space-y-1">
                                                        <h5 className="font-black text-sm uppercase text-slate-800">Formal Resignation</h5>
                                                        <div className="flex items-center gap-2">
                                                            <CalendarIcon className="w-3 h-3 text-slate-400" />
                                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Last Day: <span className="text-rose-600 font-black">{req.date}</span></p>
                                                        </div>
                                                    </div>
                                                    <Badge className={
                                                        req.status === 'approved' ? 'bg-emerald-500 font-black px-3 py-1 text-[10px] rounded-lg' : 
                                                        req.status === 'pending' ? 'bg-amber-100 text-amber-700 border-none font-black px-3 py-1 text-[10px] rounded-lg animate-pulse' : 'bg-rose-500 font-black px-3 py-1 text-[10px] rounded-lg'
                                                    }>
                                                        {req.status.toUpperCase()}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default LeaveManagement;
