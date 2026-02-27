import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const LEAVE_HISTORY = [
    { id: 1, type: "Sick Leave", from: "2025-02-10", to: "2025-02-12", days: 3, status: "Approved", reason: "Viral fever" },
    { id: 2, type: "Casual Leave", from: "2025-01-15", to: "2025-01-15", days: 1, status: "Rejected", reason: "Personal work" },
    { id: 3, type: "Academic Leave", from: "2024-12-05", to: "2024-12-06", days: 2, status: "Approved", reason: "Attended Conference" },
];

const LeaveManagement = () => {
    const { toast } = useToast();
    const [date, setDate] = useState<Date>();
    const [leaveType, setLeaveType] = useState("");
    const [reason, setReason] = useState("");

    const handleSubmit = () => {
        toast({
            title: "Leave Request Submitted",
            description: "Your HOD will review your request shortly.",
        });
        setLeaveType("");
        setReason("");
        setDate(undefined);
    };

    return (
        <div className="space-y-6 animate-in fade-in-50">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Leave Management</h1>
                <p className="text-muted-foreground">Apply for leave and track your application status.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Apply for Leave Form */}
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

                        <Button className="w-full" onClick={handleSubmit}>Submit Request</Button>
                    </CardContent>
                </Card>

                {/* Leave Balance & Stats */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Leave Balance</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg text-center">
                                <div className="text-3xl font-bold text-blue-600">8</div>
                                <div className="text-sm text-blue-800 font-medium">Casual Leaves</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg text-center">
                                <div className="text-3xl font-bold text-green-600">12</div>
                                <div className="text-sm text-green-800 font-medium">Sick Leaves</div>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg text-center col-span-2">
                                <div className="text-3xl font-bold text-purple-600">5</div>
                                <div className="text-sm text-purple-800 font-medium">Academic Leaves</div>
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

            {/* Leave History Table */}
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
                                <TableHead>Reason</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {LEAVE_HISTORY.map((leave) => (
                                <TableRow key={leave.id}>
                                    <TableCell className="font-medium">{leave.type}</TableCell>
                                    <TableCell>{leave.from} - {leave.to}</TableCell>
                                    <TableCell>{leave.days}</TableCell>
                                    <TableCell className="text-muted-foreground">{leave.reason}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            leave.status === 'Approved' ? 'default' :
                                                leave.status === 'Rejected' ? 'destructive' : 'secondary'
                                        } className={
                                            leave.status === 'Approved' ? 'bg-green-500 hover:bg-green-600' : ''
                                        }>
                                            {leave.status === 'Approved' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                            {leave.status === 'Rejected' && <XCircle className="h-3 w-3 mr-1" />}
                                            {leave.status === 'Pending' && <Clock className="h-3 w-3 mr-1" />}
                                            {leave.status}
                                        </Badge>
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

export default LeaveManagement;
