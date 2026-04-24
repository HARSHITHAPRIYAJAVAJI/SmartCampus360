
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
    Calendar, 
    Clock, 
    CheckCircle2, 
    XCircle, 
    User, 
    FileText, 
    AlertCircle,
    ArrowRightCircle,
    Building2,
    Check,
    X,
    FileImage,
    LayoutGrid,
    Trash2
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { reallocateLeavePeriods, revertLeavePeriods, revertSpecificRequest } from "@/utils/timetableAdjuster";
import { alertService } from "@/services/alertService";
import { dataPersistence } from "@/utils/dataPersistence";

interface FacultyRequest {
    id: string;
    senderId: string;
    senderName: string;
    targetId: string;
    targetName: string;
    type: "swap" | "replacement" | "leave" | "resignation";
    parentId?: string;
    date: string;
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

const RequestsManagement = () => {
    const { toast } = useToast();
    const [allRequests, setAllRequests] = useState<FacultyRequest[]>([]);

    useEffect(() => {
        const loadRequests = () => {
            const saved = localStorage.getItem('FACULTY_REQUESTS');
            if (saved) {
                setAllRequests(JSON.parse(saved));
            }
        };
        loadRequests();
        window.addEventListener('faculty_request_updated', loadRequests);
        window.addEventListener('storage', loadRequests);
        return () => {
            window.removeEventListener('faculty_request_updated', loadRequests);
            window.removeEventListener('storage', loadRequests);
        };
    }, []);

    const saveRequests = (reqs: FacultyRequest[]) => {
        localStorage.setItem('FACULTY_REQUESTS', JSON.stringify(reqs));
        setAllRequests(reqs);
    };

    const leaveRequests = useMemo(() => 
        allRequests.filter(r => r.type === 'leave').sort((a,b) => b.timestamp - a.timestamp), 
    [allRequests]);

    const academicRequests = useMemo(() => 
        allRequests.filter(r => r.type === 'swap' || r.type === 'replacement').sort((a,b) => b.timestamp - a.timestamp),
    [allRequests]);

    const resignationRequests = useMemo(() => 
        allRequests.filter(r => r.type === 'resignation').sort((a,b) => b.timestamp - a.timestamp),
    [allRequests]);

    const handleLeaveAction = (requestId: string, status: "approved" | "rejected") => {
        const request = allRequests.find(r => r.id === requestId);
        if (!request) return;

        // 1. Update Request Status
        const updatedRequests = allRequests.map(r => r.id === requestId ? { ...r, status } : r);
        saveRequests(updatedRequests);

        // 2. If Approved, Trigger Timetable Adjustment
        if (status === "approved" && (request.type === "leave" || request.type === "resignation")) {
            // SPECIAL CASE: Resignation Soft Delete
            if (request.type === 'resignation') {
                const allFac = dataPersistence.getAllFaculty();
                const updatedFac = allFac.map(f => 
                    (f.id === request.senderId || f.rollNumber === request.senderId)
                        ? { ...f, is_active: false, deleted_at: new Date().toISOString() }
                        : f
                );
                dataPersistence.saveFaculty(updatedFac);
                
                toast({
                    title: "Faculty Decommissioned",
                    description: `${request.senderName} has been moved to the inactive registry.`,
                    variant: "destructive"
                });
            }

            const publishedStoreStr = localStorage.getItem('published_timetables');
            if (publishedStoreStr && request.type === "leave") {
                const publishedTimetables = JSON.parse(publishedStoreStr);
                
                const { newRequests, totalAdjustments, adjustments } = reallocateLeavePeriods(
                    request.senderId,
                    request.date,
                    request.duration || 1,
                    publishedTimetables,
                    request.id // Pass ID to link
                );

                if (totalAdjustments > 0) {
                    // Update Requests storage with the new automated substitutions
                    const updatedRequests = [...allRequests.map(r => r.id === request.id ? { ...r, status } : r), ...newRequests];
                    localStorage.setItem('FACULTY_REQUESTS', JSON.stringify(updatedRequests));
                    
                    // Group adjustments by section to send consolidated alerts to students
                    const sectionMap: Record<string, string[]> = {};
                    adjustments.forEach(adj => {
                        if (!sectionMap[adj.section]) sectionMap[adj.section] = [];
                        sectionMap[adj.section].push(`${adj.day} ${adj.time} (${adj.subject})`);
                    });

                    Object.entries(sectionMap).forEach(([sectionKey, details]) => {
                        const [branch, year, sem, section] = sectionKey.split('-');
                        // Find the substitute names from adjustments for this section
                        const substitutes = adjustments
                            .filter(adj => adj.section === sectionKey)
                            .map(adj => adj.newFaculty)
                            .filter((v, i, a) => a.indexOf(v) === i); // Unique names

                        alertService.sendAlert({
                            title: "Faculty Substitution: Assigned",
                            message: `Attention Students of ${branch}-${year}Y Sec ${section}: Due to absence of ${request.senderName}, your classes on ${request.date} will be taken by ${substitutes.join(", ")}. Please check your timetable for specifics.`,
                            branch,
                            year: parseInt(year),
                            section,
                            category: 'substitution',
                            type: 'priority',
                            targetAudience: 'students',
                            redirectUrl: '/dashboard/communications?tab=notifications'
                        });
                    });

                    // 4. ALSO notify the substitutes specifically
                    newRequests.forEach(nr => {
                        if (nr.type === 'replacement') {
                            alertService.sendAlert({
                                title: "Substitution Duty: Assigned",
                                message: `You have been assigned to take the ${nr.period} class for ${nr.section} on ${nr.date} as a replacement for ${request.senderName}.`,
                                category: 'substitution',
                                type: 'urgent',
                                targetAudience: 'faculty',
                                recipientId: nr.targetId,
                                redirectUrl: '/dashboard/faculty'
                            });
                        }
                    });

                    toast({
                        title: "Leave Approved & Substitutions Generated",
                        description: `Successfully assigned ${totalAdjustments} replacement sessions. Faculty and students have been notified via personal feeds.`,
                        className: "bg-emerald-600 text-white"
                    });
                    
                    window.dispatchEvent(new Event('faculty_request_updated'));
                    return; // Avoid double updating status below
                }
            }
        } else if (status === "rejected") {
            // If rejected, revert any potential previous reallocation for this faculty
            const publishedStoreStr = localStorage.getItem('published_timetables');
            if (publishedStoreStr) {
                const publishedTimetables = JSON.parse(publishedStoreStr);
                const { updatedTimetables } = revertLeavePeriods(request.senderId, publishedTimetables);
                localStorage.setItem('published_timetables', JSON.stringify(updatedTimetables));
                window.dispatchEvent(new Event('timetable_published'));
            }
            
            toast({
                title: `Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
                description: `The leave request from ${request.senderName} has been ${status}. Timeline restored.`,
                variant: "destructive"
            });
        }
    };

    const handleDeleteRequest = (id: string) => {
        const request = allRequests.find(r => r.id === id);
        
        // If it was an approved leave, REVERT all replacements before deleting
        if (request && request.status === 'approved' && request.type === 'leave') {
            const publishedStoreStr = localStorage.getItem('published_timetables');
            if (publishedStoreStr) {
                const { updatedTimetables } = revertLeavePeriods(request.senderId, JSON.parse(publishedStoreStr));
                localStorage.setItem('published_timetables', JSON.stringify(updatedTimetables));
                window.dispatchEvent(new Event('timetable_published'));
            }
        }

        const updated = allRequests.filter(r => r.id !== id && r.parentId !== id);
        saveRequests(updated);
        toast({
            title: "Record Deleted",
            description: "The request has been removed and all associated schedule changes restored.",
        });
        window.dispatchEvent(new Event('faculty_request_updated'));
    };

    const handleDeleteAcademicRequest = (requestId: string) => {
        const request = allRequests.find(r => r.id === requestId);
        if (!request) return;

        // If approved, REVERT the timetable changes
        if (request.status === 'approved') {
            const publishedStoreStr = localStorage.getItem('published_timetables');
            if (publishedStoreStr) {
                const updated = revertSpecificRequest(request, JSON.parse(publishedStoreStr));
                localStorage.setItem('published_timetables', JSON.stringify(updated));
                window.dispatchEvent(new Event('timetable_published'));
            }
        }

        // Remove from global requests
        const updatedRequests = allRequests.filter(r => r.id !== requestId);
        saveRequests(updatedRequests);
        window.dispatchEvent(new Event('faculty_request_updated'));

        toast({
            title: "Adjustment Reverted",
            description: `The ${request.type} request has been deleted and original duties restored.`
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in-50">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Leave & Replacement Manager</h1>
                    <p className="text-muted-foreground font-medium">Review and process faculty leave requests and automated replacements.</p>
                </div>
                <Badge variant="outline" className="h-10 px-4 border-primary/20 bg-primary/5 text-primary font-black uppercase tracking-widest">
                    Live Admin Control
                </Badge>
            </div>

            <div className="grid gap-8">
                {/* Formal Resignation Requests */}
                {resignationRequests.length > 0 && (
                    <Card className="border-none shadow-[0_20px_50px_rgba(239,68,68,0.15)] rounded-[2rem] overflow-hidden border-t-8 border-rose-600">
                        <CardHeader className="bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/20 p-8 border-b">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/20">
                                        <XCircle className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl font-black text-rose-600 tracking-tight">Pending Resignations</CardTitle>
                                        <CardDescription className="text-xs font-bold uppercase tracking-widest text-rose-500/70">Staff Exit Notices (High Priority)</CardDescription>
                                    </div>
                                </div>
                                <div className="animate-pulse bg-rose-100 text-rose-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-rose-200">
                                    Action Required
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-rose-50/30">
                                    <TableRow>
                                        <TableHead className="font-black uppercase text-[10px] pl-8 text-rose-900">Faculty Member</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] text-rose-900">Intended Last Day</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] text-rose-900">Notice Statement</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] text-rose-900 pr-8 text-right">Decision</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {resignationRequests.map((req) => (
                                        <TableRow key={req.id} className="hover:bg-rose-50/20 transition-colors border-b border-rose-100/50">
                                            <TableCell className="pl-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-11 w-11 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 font-black">
                                                        {req.senderName[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-800 text-base">{req.senderName}</p>
                                                        <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">{req.senderId}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2 text-sm font-black text-rose-700 bg-rose-100/50 w-fit px-3 py-1 rounded-lg border border-rose-200">
                                                        <Calendar className="h-4 w-4" /> {req.date}
                                                    </div>
                                                    <p className="text-[10px] text-muted-foreground font-bold uppercase pl-1">Target Relieving Date</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-[300px]">
                                                    <p className="text-sm font-medium text-slate-600 leading-relaxed italic">"{req.reason}"</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-8">
                                                <div className="flex justify-end gap-3">
                                                    <Button 
                                                        size="sm" 
                                                        className="rounded-2xl bg-rose-600 hover:bg-rose-700 font-black shadow-lg shadow-rose-600/20 h-10 px-6"
                                                        onClick={() => handleLeaveAction(req.id, 'approved')}
                                                    >
                                                        ACCEPT
                                                    </Button>
                                                    <Button 
                                                        size="sm" 
                                                        variant="ghost" 
                                                        className="rounded-2xl font-black text-slate-400 hover:text-slate-600 h-10"
                                                        onClick={() => handleLeaveAction(req.id, 'rejected')}
                                                    >
                                                        REJECT
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

                {/* Formal Leave Requests */}
                <Card className="border-none shadow-premium rounded-[2rem] overflow-hidden">
                    <CardHeader className="bg-slate-900 text-white p-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-2xl font-black">Pending Leave Requests</CardTitle>
                                <CardDescription className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mt-1">Institutional Oversight</CardDescription>
                            </div>
                            <div className="bg-white/10 p-3 rounded-2xl">
                                <AlertCircle className="h-6 w-6 text-amber-400" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="font-black uppercase text-[10px] pl-8">Faculty Member</TableHead>
                                    <TableHead className="font-black uppercase text-[10px]">Leave Period & Duration</TableHead>
                                    <TableHead className="font-black uppercase text-[10px]">Reason & Documentation</TableHead>
                                    <TableHead className="font-black uppercase text-[10px]">Status</TableHead>
                                    <TableHead className="text-right font-black uppercase text-[10px] pr-8">Decision</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leaveRequests.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                                            No pending leave requests found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    leaveRequests.map((req) => (
                                        <TableRow key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                            <TableCell className="pl-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                                                        <User className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-800">{req.senderName}</p>
                                                        <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">{req.senderId}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm font-black text-slate-700">
                                                        <Calendar className="h-3.5 w-3.5 text-primary" /> {req.date}
                                                    </div>
                                                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-none font-black text-[9px]">
                                                        {req.duration} DAYS
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-[200px] space-y-2">
                                                    <p className="text-xs text-muted-foreground line-clamp-2 italic">"{req.reason}"</p>
                                                    {req.proofUrl && (
                                                        <Button variant="outline" size="sm" className="h-7 text-[10px] font-black border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                                                            <FileImage className="h-3 w-3 mr-1" /> VIEW PROOF
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={
                                                    req.status === 'approved' ? 'bg-emerald-500 text-white' :
                                                    req.status === 'rejected' ? 'bg-rose-500 text-white' :
                                                    'bg-amber-100 text-amber-700 border-none'
                                                }>
                                                    {req.status.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-8">
                                                {req.status === 'pending' ? (
                                                    <div className="flex justify-end gap-2">
                                                        <Button 
                                                            size="sm" 
                                                            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 font-black shadow-lg shadow-emerald-600/20"
                                                            onClick={() => handleLeaveAction(req.id, 'approved')}
                                                        >
                                                            <Check className="h-4 w-4 mr-1" /> APPROVE
                                                        </Button>
                                                        <Button 
                                                            size="sm" 
                                                            variant="destructive" 
                                                            className="rounded-xl font-black shadow-lg shadow-rose-600/20"
                                                            onClick={() => handleLeaveAction(req.id, 'rejected')}
                                                        >
                                                            <X className="h-4 w-4 mr-1" /> REJECT
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-end items-center gap-4 text-muted-foreground italic text-xs text-nowrap">
                                                        <div className="flex items-center gap-1.5 ">
                                                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                            Processed
                                                        </div>
                                                        <Button variant="ghost" size="sm" onClick={() => handleDeleteRequest(req.id)} className="h-8 w-8 p-0 hover:text-destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Academic Swap Broadcasts */}
                <Card className="border-none shadow-premium rounded-[2rem] overflow-hidden">
                    <CardHeader className="bg-indigo-900 text-white p-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-2xl font-black">Active Swap & Replacement Broadcasts</CardTitle>
                                <CardDescription className="text-indigo-400 font-bold uppercase tracking-wider text-[10px] mt-1">Peer-to-Peer Academic Transitions</CardDescription>
                            </div>
                            <div className="bg-white/10 p-3 rounded-2xl">
                                <LayoutGrid className="h-6 w-6 text-indigo-300" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-indigo-50">
                                <TableRow>
                                    <TableHead className="font-black uppercase text-[10px] pl-8 text-indigo-900">Requester</TableHead>
                                    <TableHead className="font-black uppercase text-[10px] text-indigo-900">Category</TableHead>
                                    <TableHead className="font-black uppercase text-[10px] text-indigo-900">Target / Recipient</TableHead>
                                    <TableHead className="font-black uppercase text-[10px] text-indigo-900">Date & Slot</TableHead>
                                    <TableHead className="font-black uppercase text-[10px] text-indigo-900 text-right pr-8">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {academicRequests.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                                            No active academic swaps found in the system.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    academicRequests.map((req) => (
                                        <TableRow key={req.id} className="hover:bg-indigo-50/30 transition-colors">
                                            <TableCell className="pl-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs text-nowrap">
                                                        {req.senderName[0]}
                                                    </div>
                                                    <div className="text-nowrap">
                                                        <p className="font-black text-slate-800 text-sm">{req.senderName}</p>
                                                        <p className="text-[9px] text-muted-foreground font-bold tracking-widest uppercase">Requester ID: {req.senderId}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1.5 py-1">
                                                    <Badge className={`font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                                        req.type === 'swap' 
                                                            ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                                                            : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                                                    }`}>
                                                        {req.type}
                                                    </Badge>
                                                    
                                                    {req.subject && (
                                                        <p className="text-[11px] font-black text-slate-700 truncate max-w-[150px] leading-tight mt-1">
                                                            {req.subject}
                                                        </p>
                                                    )}

                                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                                        {(() => {
                                                            // For older requests or auto-generated ones, parse the sectionKey if fields are missing
                                                            const parts = req.section?.split('-') || [];
                                                            const branch = req.branch || parts[0] || "?";
                                                            const year = req.year || parts[1] || "?";
                                                            const sec = req.sectionName || parts[3] || "?";
                                                            const room = req.room || "TBD";

                                                            return (
                                                                <>
                                                                    <div className="flex items-center gap-1 bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[8px] font-black border border-slate-200 shadow-sm uppercase">
                                                                        <Building2 className="w-2.5 h-2.5" /> {room}
                                                                    </div>
                                                                    <div className="flex items-center gap-1 bg-primary/5 text-primary px-1.5 py-0.5 rounded text-[8px] font-black border border-primary/10 shadow-sm uppercase">
                                                                        {branch}-{year}Y
                                                                    </div>
                                                                    <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[8px] font-black border border-emerald-100 shadow-sm uppercase">
                                                                       SEC: {sec}
                                                                    </div>
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-nowrap">
                                                    <ArrowRightCircle className="h-4 w-4 text-slate-300" />
                                                    <div>
                                                        <p className="font-bold text-slate-700 text-sm">{req.targetName}</p>
                                                        <p className="text-[9px] text-muted-foreground font-black uppercase">Recipient</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-0.5 text-nowrap">
                                                    <p className="font-bold text-slate-700 text-xs">{req.date}</p>
                                                    <p className="text-[10px] text-indigo-600 font-black">Slot: {req.period}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="flex items-center justify-end gap-3">
                                                    <Badge className={
                                                        req.status === 'approved' ? 'bg-emerald-500 text-white' :
                                                        req.status === 'rejected' ? 'bg-rose-500 text-white' :
                                                        'bg-amber-100 text-amber-700 border-none'
                                                    }>
                                                        {req.status.toUpperCase()}
                                                    </Badge>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        onClick={() => handleDeleteAcademicRequest(req.id)}
                                                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all"
                                                        title="Delete & Revert Swap"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Automation Summary Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-none shadow-premium rounded-[2rem] bg-indigo-600 text-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ArrowRightCircle className="h-6 w-6" />
                                Intelligent Replacement Logic
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-indigo-100 text-sm">
                                When a leave is approved, the system automatically scans all {Object.keys(JSON.parse(localStorage.getItem('published_timetables') || '{}')).length} published section timetables.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                                    <Building2 className="h-5 w-5 mb-2 text-indigo-300" />
                                    <p className="text-[10px] font-black uppercase opacity-60">Priority 1</p>
                                    <p className="font-bold text-sm">Same Branch Faculty</p>
                                </div>
                                <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                                    <LayoutGrid className="h-5 w-5 mb-2 text-indigo-300" />
                                    <p className="text-[10px] font-black uppercase opacity-60">Priority 2</p>
                                    <p className="font-bold text-sm">Cross-Branch Slots</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-premium rounded-[2rem] bg-slate-50">
                        <CardHeader>
                            <CardTitle className="text-slate-800">Replacement Guidelines</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {[
                                    "No double bookings allowed (free slots only)",
                                    "Substituted periods are marked with a notification badge",
                                    "Affected students are alerted in their dashboards",
                                    "Substitutes receive instant assignment alerts"
                                ].map((rule, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-600">
                                        <div className="h-5 w-5 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                                            <span className="text-[10px] font-bold">{i+1}</span>
                                        </div>
                                        {rule}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default RequestsManagement;
