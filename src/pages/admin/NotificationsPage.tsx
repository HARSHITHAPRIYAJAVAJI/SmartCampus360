import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Send, FileText, Clock, Trash2, Edit2, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { MOCK_NOTIFICATIONS, NOTIFICATION_TEMPLATES, Notification } from "@/data/mockNotifications";
import { format } from "date-fns";

const NotificationsPage = () => {
    const { toast } = useToast();
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
    const [activeTab, setActiveTab] = useState("all");
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<Notification>>({
        type: 'info',
        targetAudience: 'all',
        status: 'sent'
    });

    const handleCreate = () => {
        const newNotification: Notification = {
            id: `new-${Date.now()}`,
            title: formData.title || "Untitled Notification",
            message: formData.message || "",
            type: formData.type || 'info',
            targetAudience: formData.targetAudience || 'all',
            date: new Date().toISOString(),
            status: formData.status || 'sent',
            sender: 'Admin' // In a real app, get from current user
        };

        setNotifications([newNotification, ...notifications]);
        setIsCreateOpen(false);
        setFormData({ type: 'info', targetAudience: 'all', status: 'sent' });

        toast({
            title: newNotification.status === 'sent' ? "Notification Sent" : "Draft Saved",
            description: newNotification.status === 'sent' ? "Your message has been broadcasted." : "Saved to drafts."
        });
    };

    const handleDelete = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
        toast({ title: "Deleted", description: "Notification removed." });
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

    return (
        <div className="space-y-6 animate-in fade-in-50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Notification Center</h1>
                    <p className="text-muted-foreground">Manage announcements and automated alerts.</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Send className="h-4 w-4" /> Post New Notification
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Create Notification</DialogTitle>
                            <DialogDescription>
                                broadcast a message to students, faculty, or the entire campus.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Template</Label>
                                <Select onValueChange={loadTemplate}>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select a template (Optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {NOTIFICATION_TEMPLATES.map(t => (
                                            <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Title</Label>
                                <Input
                                    value={formData.title || ''}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="col-span-3"
                                    placeholder="e.g. Campus Closure"
                                />
                            </div>

                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label className="text-right pt-2">Message</Label>
                                <Textarea
                                    value={formData.message || ''}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    className="col-span-3 min-h-[100px]"
                                    placeholder="Type your message here..."
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Audience</Label>
                                <Select
                                    value={formData.targetAudience}
                                    onValueChange={v => setFormData({ ...formData, targetAudience: v as any })}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Entire Campus</SelectItem>
                                        <SelectItem value="students">Students Only</SelectItem>
                                        <SelectItem value="faculty">Faculty Only</SelectItem>
                                        <SelectItem value="staff">Staff Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Priority</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={v => setFormData({ ...formData, type: v as any })}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="info">Info (Blue)</SelectItem>
                                        <SelectItem value="success">Success (Green)</SelectItem>
                                        <SelectItem value="warning">Warning (Orange)</SelectItem>
                                        <SelectItem value="destructive">Urgent (Red)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Action</Label>
                                <div className="col-span-3 flex gap-2">
                                    <Button
                                        variant={formData.status === 'sent' ? 'default' : 'outline'}
                                        onClick={() => setFormData({ ...formData, status: 'sent' })}
                                        className="w-full"
                                    >
                                        Send Now
                                    </Button>
                                    <Button
                                        variant={formData.status === 'draft' ? 'default' : 'outline'}
                                        onClick={() => setFormData({ ...formData, status: 'draft' })}
                                        className="w-full"
                                    >
                                        Save Draft
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreate}>
                                {formData.status === 'sent' ? 'Broadcast Message' : 'Save as Draft'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="md:col-span-3">
                    <CardHeader>
                        <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
                            <div className="flex items-center justify-between mb-4">
                                <CardTitle>History</CardTitle>
                                <TabsList>
                                    <TabsTrigger value="all">Sent</TabsTrigger>
                                    <TabsTrigger value="drafts">Drafts</TabsTrigger>
                                    <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="all" className="space-y-4">
                                {/* Sent Notifications List */}
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
                                    onEdit={(item) => {
                                        setFormData(item);
                                        setIsCreateOpen(true);
                                    }}
                                />
                            </TabsContent>
                            <TabsContent value="scheduled" className="space-y-4">
                                <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg">
                                    No scheduled notifications.
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardHeader>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Templates</CardTitle>
                            <CardDescription>Use these for fast updates</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {NOTIFICATION_TEMPLATES.map(template => (
                                <Button
                                    key={template.id}
                                    variant="ghost"
                                    className="w-full justify-start h-auto py-3 px-4 border border-transparent hover:border-input hover:bg-background whitespace-normal text-left"
                                    onClick={() => {
                                        setFormData({
                                            title: template.title,
                                            message: template.message,
                                            type: template.type as any,
                                            targetAudience: 'all',
                                            status: 'sent'
                                        });
                                        setIsCreateOpen(true);
                                    }}
                                >
                                    <div className="flex flex-col items-start gap-1 w-full overflow-hidden">
                                        <span className="font-medium flex items-center gap-2">
                                            <FileText className="h-3 w-3 shrink-0" /> {template.title}
                                        </span>
                                        <span className="text-xs text-muted-foreground line-clamp-2 break-words">
                                            {template.message}
                                        </span>
                                    </div>
                                </Button>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Automated Alerts</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-blue-500" /> Attendance Low</span>
                                <Badge variant="outline">Active</Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-orange-500" /> Fee Due</span>
                                <Badge variant="secondary">Paused</Badge>
                            </div>
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
            <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg">
                No notifications found.
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {items.map((item: Notification) => (
                <div key={item.id} className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                    <div className="mt-1">{getIcon(item.type)}</div>
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{item.title}</h3>
                            <span className="text-xs text-muted-foreground">
                                {format(new Date(item.date), "MMM d, h:mm a")}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs capitalize">{item.targetAudience}</Badge>
                            {isDraft && <Badge variant="outline" className="text-xs">Draft</Badge>}
                        </div>
                    </div>
                    <div className="flex gap-1">
                        {isDraft && (
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(item)}>
                                <Edit2 className="h-4 w-4" />
                            </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => onDelete(item.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NotificationsPage;
