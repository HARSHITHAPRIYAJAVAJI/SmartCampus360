import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Send, FileText, Clock, Trash2, Edit2, CheckCircle2, AlertTriangle, Info, Inbox, Loader2 } from "lucide-react";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { NOTIFICATION_TEMPLATES } from "@/data/mockNotifications";
import notificationService from '@/services/notificationService';
import { format } from "date-fns";
import { useOutletContext } from 'react-router-dom';

const NotificationsPage = () => {
    const { user } = useOutletContext<{ user: { role: string; name: string } }>();
    const isAdmin = user?.role === 'admin';
    const userAudience = user?.role === 'student' ? 'students' : user?.role === 'faculty' ? 'faculty' : 'all';
    const { toast } = useToast();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState<any>({
        type: 'info',
        target_audience: 'all',
        status: 'sent'
    });

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationService.getNotifications();
            setNotifications(data);
        } catch (error) {
            toast({ title: "Error", description: "Failed to load notifications.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            const newNote = await notificationService.createNotification({
                title: formData.title || "Untitled",
                message: formData.message || "",
                type: formData.type || 'info',
                target_audience: formData.target_audience || 'all',
                status: formData.status || 'sent',
                target_uids: formData.target_uids
            });

            setNotifications([newNote, ...notifications]);
            setIsCreateOpen(false);
            setFormData({ type: 'info', target_audience: 'all', status: 'sent' });

            toast({
                title: newNote.status === 'sent' ? "Notification Broadcasted" : "Draft Saved",
                description: newNote.status === 'sent' ? "Message sent through campus network." : "Saved to server drafts."
            });
        } catch (error) {
            toast({ title: "Error", description: "Failed to post notification.", variant: "destructive" });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await notificationService.deleteNotification(id);
            setNotifications(notifications.filter(n => n.id !== id));
            toast({ title: "Deleted", description: "Notification removed permanently." });
        } catch (error) {
            toast({ title: "Error", description: "Could not delete notification.", variant: "destructive" });
        }
    };

    const loadTemplate = (templateId: string) => {
        const template = NOTIFICATION_TEMPLATES.find(t => t.id === templateId);
        if (template) {
            setFormData({
                ...formData,
                title: template.title,
                message: template.message,
                type: template.type as any
            });
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'warning': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
            case 'destructive': return <AlertTriangle className="h-5 w-5 text-red-500" />;
            case 'success': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            default: return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (activeTab === 'all') return n.status === 'sent';
        if (activeTab === 'drafts') return n.status === 'draft';
        if (activeTab === 'scheduled') return n.status === 'scheduled';
        return true;
    });

    const myNotifications = isAdmin
        ? filteredNotifications
        : notifications.filter(n => n.status === 'sent'); // Backend already filters for non-admins

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium animate-pulse">Synchronizing Notification Center...</p>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="space-y-6 animate-in fade-in-50">
                <div className="flex justify-between items-center bg-card p-6 rounded-2xl border shadow-sm">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                            <Bell className="h-8 w-8 text-primary" /> My Notifications
                        </h1>
                        <p className="text-muted-foreground mt-1">Updates specific to your {user?.role} status and campus life.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {myNotifications.length === 0 ? (
                        <div className="p-20 text-center text-muted-foreground border-2 border-dashed rounded-3xl bg-secondary/10">
                            <Bell className="h-16 w-16 mx-auto mb-4 opacity-10" />
                            <p className="text-xl font-bold">Inbox is empty</p>
                            <p className="text-sm">You are fully up to date with campus announcements.</p>
                        </div>
                    ) : (
                        myNotifications.map(item => (
                            <div key={item.id} className={`group flex items-start gap-4 p-6 rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 relative overflow-hidden ${
                                item.type === 'destructive' ? 'border-red-200 bg-gradient-to-br from-red-50/50 to-transparent' :
                                item.type === 'warning' ? 'border-amber-200 bg-gradient-to-br from-amber-50/50 to-transparent' :
                                item.type === 'success' ? 'border-green-200 bg-gradient-to-br from-green-50/50 to-transparent' : ''
                            }`}>
                                <div className="mt-1 shrink-0 bg-background p-2 rounded-xl border shadow-sm">{getIcon(item.type)}</div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{item.title}</h3>
                                        <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full whitespace-nowrap">
                                            {format(new Date(item.created_at), "MMM d, h:mm a")}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{item.message}</p>
                                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-dashed">
                                        <Badge variant="outline" className="text-[10px] uppercase tracking-tighter bg-background">{item.target_audience}</Badge>
                                        <span className="text-xs font-semibold text-primary/70">Verified Admin Announcement</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in-50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-primary/5 p-8 rounded-3xl border border-primary/10">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-primary">Notification Dashboard</h1>
                    <p className="text-muted-foreground font-medium">Broadcast announcements and mission-critical alerts to the campus.</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 h-12 px-6 shadow-lg shadow-primary/20 rounded-xl">
                            <Send className="h-5 w-5" /> Post New Update
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[650px] rounded-3xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Compose Update</DialogTitle>
                            <DialogDescription>
                                Prepare a broadcast message for the campus infrastructure.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-6 py-6">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-bold">Template</Label>
                                <Select onValueChange={loadTemplate}>
                                    <SelectTrigger className="col-span-3 rounded-xl">
                                        <SelectValue placeholder="Quick start with a template" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {NOTIFICATION_TEMPLATES.map(t => (
                                            <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-bold">Title</Label>
                                <Input
                                    value={formData.title || ''}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="col-span-3 rounded-xl h-11"
                                    placeholder="e.g. Semester Exams: Phase 1"
                                />
                            </div>

                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label className="text-right pt-2 font-bold">Message</Label>
                                <Textarea
                                    value={formData.message || ''}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    className="col-span-3 min-h-[120px] rounded-xl"
                                    placeholder="Detail your announcement here..."
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-bold">Audience</Label>
                                <Select
                                    value={formData.target_audience}
                                    onValueChange={v => setFormData({ ...formData, target_audience: v as any })}
                                >
                                    <SelectTrigger className="col-span-3 rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Entire Campus (Public)</SelectItem>
                                        <SelectItem value="students">Students Only</SelectItem>
                                        <SelectItem value="faculty">Faculty Only</SelectItem>
                                        <SelectItem value="staff">Staff Only</SelectItem>
                                        <SelectItem value="specific">Targeted (UID List)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-bold">Priority</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={v => setFormData({ ...formData, type: v as any })}
                                >
                                    <SelectTrigger className="col-span-3 rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="info">General Info (Blue)</SelectItem>
                                        <SelectItem value="success">Success / Achievement (Green)</SelectItem>
                                        <SelectItem value="warning">Important Alert (Orange)</SelectItem>
                                        <SelectItem value="destructive">Emergency / Urgent (Red)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <DialogFooter className="gap-2">
                            <Button variant="ghost" className="rounded-xl" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button onClick={() => setFormData({...formData, status: 'sent'})} className="rounded-xl" variant="outline">Schedule Later</Button>
                            <Button onClick={handleCreate} className="rounded-xl px-8">Dispatch Notification</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="md:col-span-3 rounded-3xl shadow-sm border-slate-200">
                    <CardHeader>
                        <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
                            <div className="flex items-center justify-between mb-6">
                                <CardTitle className="text-2xl font-black">History</CardTitle>
                                <TabsList className="bg-slate-100 p-1 rounded-xl">
                                    <TabsTrigger value="all" className="rounded-lg">Published</TabsTrigger>
                                    <TabsTrigger value="drafts" className="rounded-lg">Drafts</TabsTrigger>
                                    <TabsTrigger value="scheduled" className="rounded-lg">Scheduled</TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="all" className="space-y-4">
                                <NotificationList
                                    items={filteredNotifications}
                                    onDelete={handleDelete}
                                    getIcon={getIcon}
                                />
                            </TabsContent>
                            <TabsContent value="drafts" className="space-y-4">
                                <NotificationList
                                    items={filteredNotifications}
                                    onDelete={handleDelete}
                                    getIcon={getIcon}
                                    isDraft={true}
                                />
                            </TabsContent>
                            <TabsContent value="scheduled" className="space-y-4 p-12 text-center text-muted-foreground border border-dashed rounded-3xl">
                                No scheduled automation found.
                            </TabsContent>
                        </Tabs>
                    </CardHeader>
                </Card>

                <div className="space-y-6">
                    <Card className="rounded-3xl shadow-sm border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">Broadcast Templates</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {NOTIFICATION_TEMPLATES.map(template => (
                                <Button
                                    key={template.id}
                                    variant="ghost"
                                    className="w-full justify-start h-auto py-4 px-5 border bg-slate-50/50 hover:bg-white hover:border-primary/50 transition-all rounded-2xl text-left"
                                    onClick={() => {
                                        setFormData({
                                            title: template.title,
                                            message: template.message,
                                            type: template.type as any,
                                            target_audience: 'all',
                                            status: 'sent'
                                        });
                                        setIsCreateOpen(true);
                                    }}
                                >
                                    <div className="flex flex-col items-start gap-1 w-full overflow-hidden">
                                        <span className="font-bold text-sm text-slate-800 flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-primary" /> {template.title}
                                        </span>
                                        <span className="text-xs text-muted-foreground line-clamp-2">
                                            {template.message}
                                        </span>
                                    </div>
                                </Button>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="rounded-3xl shadow-sm border-slate-200 bg-gradient-to-br from-blue-50 to-transparent">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">Dynamic Automation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-white rounded-xl border shadow-sm">
                                <span className="flex items-center gap-3 text-sm font-semibold"><Clock className="h-5 w-5 text-blue-500" /> Timetable Sync</span>
                                <Badge className="bg-green-500">Live</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white rounded-xl border shadow-sm">
                                <span className="flex items-center gap-3 text-sm font-semibold"><Clock className="h-5 w-5 text-orange-500" /> Attendance Bot</span>
                                <Badge variant="secondary">Configuring</Badge>
                            </div>
                            <p className="text-[10px] text-center text-muted-foreground font-medium italic">FCM real-time push services active</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const NotificationList = ({ items, onDelete, getIcon, isDraft, onEdit }: any) => {
    if (items.length === 0) {
        return (
            <div className="p-12 text-center text-muted-foreground border-2 border-dashed rounded-3xl bg-slate-50/50">
                <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="text-lg font-bold">No history available</p>
                <p className="text-sm">Broadcasted messages will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {items.map((item: any) => (
                <div key={item.id} className="flex items-start gap-4 p-6 rounded-2xl border bg-card hover:border-primary/20 hover:shadow-md transition-all duration-300">
                    <div className="mt-1 bg-secondary p-2 rounded-xl">{getIcon(item.type)}</div>
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg">{item.title}</h3>
                            <span className="text-xs font-semibold text-muted-foreground">
                                {format(new Date(item.created_at), "MMM d, h:mm a")}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.message}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                            <Badge variant="secondary" className="text-[10px] uppercase font-black tracking-widest">{item.target_audience}</Badge>
                            {isDraft && <Badge variant="destructive" className="text-[10px] uppercase">Draft Mode</Badge>}
                            <span className="text-[10px] font-bold text-slate-400">UID: #{item.id}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {isDraft && (
                            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl" onClick={() => onEdit(item)}>
                                <Edit2 className="h-4 w-4" />
                            </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors" onClick={() => onDelete(item.id)}>
                            <Trash2 className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NotificationsPage;
