import { useState, useMemo, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { 
    Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    MessageSquare, Send, Users, ShieldCheck, 
    Bell, Search, Megaphone, User,
    Clock, CheckCheck, MoreVertical,
    AlertTriangle, Info, Lock, Share2, 
    Zap, Calendar, GraduationCap, Wallet, BookOpen, X, Pencil, Trash2,
    Briefcase, FileText, LayoutDashboard, Paperclip, Download, Eye, FileDigit, FileSignature, UserPlus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_NOTIFICATIONS,
    Message, Conversation, InstitutionalNotification 
} from "@/data/mockCommunications";
import { MOCK_STUDENTS } from "@/data/mockStudents";
import { MOCK_FACULTY } from "@/data/mockFaculty";
import { YEAR_IN_CHARGES, CLASS_TEACHERS, getSectionCR } from "@/data/mockHierarchy";
import { toast } from "sonner";

export default function CommunicationHub() {
    const { user } = useOutletContext<{ user: { name: string, id: string, role: string } }>();
    const [selectedGroup, setSelectedGroup] = useState<Conversation | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"channels" | "announcements" | "notifications">("channels");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAttaching, setIsAttaching] = useState(false);
    const [showGroupInfo, setShowGroupInfo] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Message & Notification Store
    const [allMessages, setAllMessages] = useState<Record<string, Message[]>>(() => {
        const saved = localStorage.getItem('smartcampus_messages');
        return saved ? JSON.parse(saved) : MOCK_MESSAGES;
    });
    const [notifications, setNotifications] = useState<InstitutionalNotification[]>(MOCK_NOTIFICATIONS);

    // Profile Hydration
    const studentData = useMemo(() => {
        if (user.role !== 'student') return null;
        return MOCK_STUDENTS.find(s => s.rollNumber.toUpperCase() === user.id.toUpperCase());
    }, [user.id, user.role]);

    const facultyData = useMemo(() => {
        if (user.role !== 'faculty') return null;
        return MOCK_FACULTY.find(f => f.id === user.id);
    }, [user.id, user.role]);

    const isYI = useMemo(() => YEAR_IN_CHARGES.some(y => y.facultyId === user.id), [user.id]);
    const isCR = useMemo(() => {
        if (!studentData) return false;
        return getSectionCR(studentData.branch, studentData.year, studentData.section)?.id === studentData.id;
    }, [studentData]);

    const normalizedRole = useMemo(() => {
        if (user.role === 'admin') return 'Admin';
        if (isYI) return 'Year In-Charge';
        if (isCR) return 'CR';
        return user.role.charAt(0).toUpperCase() + user.role.slice(1) as any;
    }, [user.role, isYI, isCR]);

    // FILTER CONVERSATIONS BY TAB AND ROLE
    const filteredConversations = useMemo(() => {
        return MOCK_CONVERSATIONS.filter(conv => {
            // Tab filtering
            if (activeTab === 'announcements' && conv.type !== 'admin_broadcast') return false;
            if (activeTab === 'channels' && conv.type === 'admin_broadcast') return false;
            if (activeTab === 'notifications') return false;

            // Role & Hierarchy filtering
            if (user.role === 'admin') {
                return ['admin_broadcast', 'admin_to_yi', 'cr_coordination', 'faculty_only', 'placement_cell'].includes(conv.type);
            }
            if (user.role === 'faculty') {
                if (conv.type === 'admin_to_yi') return isYI;
                if (conv.type === 'yi_to_faculty') return true;
                if (conv.type === 'section_group' || conv.type === 'year_group') return true; // class teachers or faculty teaching there
                if (conv.type === 'subject_specific') return true;
                if (conv.type === 'faculty_only') return true;
                if (conv.type === 'admin_broadcast') return true;
                return false;
            }
            if (user.role === 'student' && studentData) {
                if (conv.type === 'admin_broadcast') return true;
                if (conv.type === 'section_group') return conv.branch === studentData.branch && conv.year === studentData.year && conv.section === studentData.section;
                if (conv.type === 'year_group') return conv.branch === studentData.branch && conv.year === studentData.year;
                if (conv.type === 'subject_specific') return true; // Enrolled subjects
                if (conv.type === 'cr_coordination') return isCR;
                if (conv.type === 'placement_cell') return studentData.year >= 3;
                return false;
            }
            return false;
        }).filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [activeTab, user.role, studentData, isCR, isYI, searchQuery]);

    // PERMISSION CHECK: Can the current user send messages in this group?
    const canSendMessage = useMemo(() => {
        if (!selectedGroup) return false;
        return selectedGroup.allowedSenders.includes(normalizedRole);
    }, [selectedGroup, normalizedRole]);

    // Automatically mark as read when selecting a group
    useEffect(() => {
        if (selectedGroup) {
            setAllMessages(prev => ({
                ...prev,
                [selectedGroup.id]: (prev[selectedGroup.id] || []).map(msg => 
                    msg.senderId !== user.id && !msg.readBy?.includes(user.name)
                    ? { ...msg, readBy: [...(msg.readBy || []), user.name] }
                    : msg
                )
            }));
        }
    }, [selectedGroup?.id, user.id, user.name]);

    const handleSendMessage = (attachmentData?: Message['attachments']) => {
        if ((!newMessage.trim() && !attachmentData) || !selectedGroup || !canSendMessage) return;
        
        if (editingId) {
            // Update existing message
            const updatedMessages = {
                ...allMessages,
                [selectedGroup.id]: allMessages[selectedGroup.id].map(msg => 
                    msg.id === editingId ? { ...msg, content: newMessage, isEdited: true, timestamp: new Date().toISOString() } : msg
                )
            };
            setAllMessages(updatedMessages);
            localStorage.setItem('smartcampus_messages', JSON.stringify(updatedMessages));
            setEditingId(null);
            setNewMessage("");
            toast.success("Message updated");
            return;
        }

        const msg: Message = {
            id: `msg-${Date.now()}`,
            senderId: user.id,
            senderName: user.name,
            senderRole: normalizedRole,
            content: newMessage,
            timestamp: new Date().toISOString(),
            type: normalizedRole === 'Admin' ? 'priority' : 'text',
            attachments: attachmentData,
            readBy: [user.name]
        };

        const updatedMessages = {
            ...allMessages,
            [selectedGroup.id]: [...(allMessages[selectedGroup.id] || []), msg]
        };
        
        setAllMessages(updatedMessages);
        localStorage.setItem('smartcampus_messages', JSON.stringify(updatedMessages));
        setNewMessage("");
        toast.info("Message sent", { description: "Delivered to " + selectedGroup.name });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isImage = file.type.startsWith('image/');
        const reader = new FileReader();

        reader.onload = () => {
            const attachment: Message['attachments'] = [{
                name: file.name,
                url: isImage ? reader.result as string : '#',
                type: isImage ? 'image' : 'pdf',
                size: (file.size / (1024 * 1024)).toFixed(1) + ' MB'
            }];
            handleSendMessage(attachment);
            setIsAttaching(false);
        };

        if (isImage) {
            reader.readAsDataURL(file);
        } else {
            // For non-images, just send name/size for mock display
            const attachment: Message['attachments'] = [{
                name: file.name,
                url: '#',
                type: 'pdf',
                size: (file.size / (1024 * 1024)).toFixed(1) + ' MB'
            }];
            handleSendMessage(attachment);
            setIsAttaching(false);
        }
    };

    const handleDeleteMessage = (id: string) => {
        if (!selectedGroup) return;
        const updatedMessages = {
            ...allMessages,
            [selectedGroup.id]: allMessages[selectedGroup.id].filter(msg => msg.id !== id)
        };
        setAllMessages(updatedMessages);
        localStorage.setItem('smartcampus_messages', JSON.stringify(updatedMessages));
        toast.success("Message deleted");
    };

    const startEditing = (msg: Message) => {
        setEditingId(msg.id);
        setNewMessage(msg.content);
    };

    const notificationIcons = {
        fee: <Wallet className="h-4 w-4" />,
        exam: <BookOpen className="h-4 w-4" />,
        attendance: <Clock className="h-4 w-4" />,
        timetable: <Calendar className="h-4 w-4" />,
        mention: <MessageSquare className="h-4 w-4" />
    };

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col space-y-4 animate-in fade-in-50 duration-500 overflow-hidden">
            {/* Main Header */}
            <div className="flex justify-between items-center py-2">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                        <Share2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter text-slate-900 leading-none mb-1">Campus Hub</h1>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Secure Organizational Network
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Tabs value={activeTab} onValueChange={(v: any) => { setActiveTab(v); setSelectedGroup(null); }} className="bg-slate-100 p-1 rounded-xl shadow-sm border border-slate-200">
                        <TabsList className="bg-transparent">
                            <TabsTrigger value="channels" className="rounded-lg font-bold px-4 text-xs">Channels</TabsTrigger>
                            <TabsTrigger value="announcements" className="rounded-lg font-bold px-4 text-xs">Broadcasts</TabsTrigger>
                            <TabsTrigger value="notifications" className="rounded-lg font-bold px-4 text-xs">Alerts</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            <div className="flex-1 flex gap-4 overflow-hidden mb-2 relative">
                {/* Master Sidebar */}
                <Card className={`w-full lg:w-80 flex-shrink-0 flex flex-col border-none shadow-premium rounded-[2rem] overflow-hidden bg-white border border-slate-100 transition-all duration-300 lg:flex ${selectedGroup ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-slate-50">
                        <div className="relative group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input 
                                placeholder={activeTab === 'notifications' ? "Search alerts..." : "Search channels..."} 
                                className="pl-10 h-10 bg-slate-50 border-none rounded-xl font-medium focus-visible:ring-1 focus-visible:ring-primary/20"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="p-2 space-y-1">
                            {activeTab !== 'notifications' ? (
                                filteredConversations.map(conv => (
                                    <button
                                        key={conv.id}
                                        onClick={() => setSelectedGroup(conv)}
                                        className={`w-full flex items-center gap-3 p-3.5 rounded-[1.25rem] transition-all relative group ${selectedGroup?.id === conv.id ? 'bg-primary/5 shadow-sm' : 'hover:bg-slate-50'}`}
                                    >
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-sm ${
                                            selectedGroup?.id === conv.id 
                                            ? 'bg-gradient-to-br from-primary to-indigo-600 text-white shadow-lg shadow-primary/20 scale-105' 
                                            : 'bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-primary group-hover:shadow-md'
                                        }`}>
                                            {conv.type === 'admin_broadcast' && <Megaphone className="w-6 h-6" />}
                                            {conv.type === 'admin_to_yi' && <ShieldCheck className="w-6 h-6" />}
                                            {conv.type === 'section_group' && <LayoutDashboard className="w-6 h-6" />}
                                            {conv.type === 'year_group' && <GraduationCap className="w-6 h-6" />}
                                            {conv.type === 'placement_cell' && <Briefcase className="w-6 h-6" />}
                                            {conv.type === 'cr_coordination' && <Users className="w-6 h-6" />}
                                            {conv.type === 'faculty_only' && <Lock className="w-6 h-6" />}
                                            {conv.type === 'subject_specific' && <BookOpen className="w-6 h-6" />}
                                            {conv.type === 'yi_to_faculty' && <Zap className="w-6 h-6" />}
                                            {!['admin_broadcast', 'admin_to_yi', 'section_group', 'year_group', 'placement_cell', 'cr_coordination', 'faculty_only', 'subject_specific', 'yi_to_faculty'].includes(conv.type) && <MessageSquare className="w-6 h-6" />}
                                        </div>
                                        <div className="text-left flex-1 min-w-0">
                                            <p className={`text-sm font-black truncate leading-tight ${selectedGroup?.id === conv.id ? 'text-primary' : 'text-slate-800'}`}>
                                                {conv.name}
                                            </p>
                                            <p className="text-[9px] text-muted-foreground font-black truncate uppercase tracking-widest opacity-60 mt-0.5">
                                                {conv.type.replace(/_/g, ' ')}
                                            </p>
                                        </div>
                                        {selectedGroup?.id === conv.id && (
                                            <motion.div 
                                                layoutId="active-pill"
                                                className="absolute right-3 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" 
                                            />
                                        )}
                                    </button>
                                ))
                            ) : (
                                notifications.map(notif => (
                                    <div 
                                        key={notif.id} 
                                        onClick={() => {
                                            setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
                                            toast.info(`Opening ${notif.title}`, { description: "Redirecting to relevant module..." });
                                        }}
                                        className={`p-4 rounded-2xl border transition-all cursor-pointer mb-2 relative group overflow-hidden ${
                                            notif.isRead ? 'bg-white border-slate-100 opacity-60' : 'bg-white border-primary/20 shadow-sm ring-1 ring-primary/10'
                                        }`}
                                    >
                                        {!notif.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                                                notif.type === 'urgent' ? 'bg-rose-50 text-rose-500' : 
                                                notif.category === 'attendance' ? 'bg-amber-50 text-amber-500' : 'bg-primary/5 text-primary'
                                            }`}>
                                                {notificationIcons[notif.category]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[11px] font-black uppercase tracking-widest text-slate-800 truncate">{notif.title}</p>
                                                <p className="text-[9px] text-muted-foreground font-bold uppercase">{new Date(notif.timestamp).toLocaleTimeString()}</p>
                                            </div>
                                            {notif.type === 'urgent' && <Badge className="bg-rose-500 h-4 px-1 text-[8px] animate-pulse">URGENT</Badge>}
                                        </div>
                                        <p className="text-xs font-semibold text-slate-600 line-clamp-2 leading-relaxed mb-3">{notif.message}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{notif.category} system</span>
                                            <Button variant="ghost" size="sm" className="h-6 text-[10px] font-black text-primary hover:bg-primary/5 p-0 px-2 uppercase tracking-widest">
                                                Action <Send className="w-2.5 h-2.5 ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                    
                    {/* Sidebar Footer */}
                    <div className="p-4 bg-slate-50 border-t border-slate-100 italic text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                        <ShieldCheck className="w-3 h-3" /> Encrypted Organizational Network
                    </div>
                </Card>

                {/* Main Viewport */}
                <Card className={`flex-1 flex flex-col border-none shadow-premium rounded-[2rem] overflow-hidden bg-white border border-slate-100 relative transition-all duration-300 ${!selectedGroup && activeTab !== 'notifications' ? 'hidden lg:flex' : 'flex'}`}>
                    {selectedGroup ? (
                        <div className="flex-1 flex flex-col h-full bg-[#f8f9fa]">
                            {/* Chat Header */}
                            <div className="p-4 px-6 flex items-center justify-between bg-white border-b border-slate-100 shadow-sm z-10">
                                <div className="flex items-center gap-4">
                                    <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8" onClick={() => setSelectedGroup(null)}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-indigo-600 text-white flex items-center justify-center shadow-md">
                                        {selectedGroup.type === 'admin_broadcast' && <Megaphone className="w-5 h-5" />}
                                        {selectedGroup.type === 'admin_to_yi' && <ShieldCheck className="w-5 h-5" />}
                                        {selectedGroup.type === 'section_group' && <LayoutDashboard className="w-5 h-5" />}
                                        {selectedGroup.type === 'year_group' && <GraduationCap className="w-5 h-5" />}
                                        {selectedGroup.type === 'placement_cell' && <Briefcase className="w-5 h-5" />}
                                        {selectedGroup.type === 'cr_coordination' && <Users className="w-5 h-5" />}
                                        {selectedGroup.type === 'faculty_only' && <Lock className="w-5 h-5" />}
                                        {selectedGroup.type === 'subject_specific' && <BookOpen className="w-5 h-5" />}
                                        {selectedGroup.type === 'yi_to_faculty' && <Zap className="w-5 h-5" />}
                                        {!['admin_broadcast', 'admin_to_yi', 'section_group', 'year_group', 'placement_cell', 'cr_coordination', 'faculty_only', 'subject_specific', 'yi_to_faculty'].includes(selectedGroup.type) && <MessageSquare className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h3 className="text-base font-black tracking-tight text-slate-900 leading-tight">{selectedGroup.name}</h3>
                                        <p className="text-[9px] text-emerald-600 font-black uppercase tracking-tighter flex items-center gap-1.5 mt-0.5">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Official Channel
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-slate-200 bg-slate-50 text-slate-500 hidden sm:inline-flex">{selectedGroup.type.replace(/_/g, ' ')}</Badge>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className={`h-9 w-9 rounded-xl transition-all ${showGroupInfo ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                                        onClick={() => setShowGroupInfo(!showGroupInfo)}
                                    >
                                        <Users className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex-1 flex overflow-hidden relative">
                                <div className="flex-1 flex flex-col overflow-hidden">
                                    {/* Message Feed */}
                                    <ScrollArea className="flex-1 p-6">
                                <div className="space-y-4">
                                    {(allMessages[selectedGroup.id] || []).map((msg) => (
                                        <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] flex flex-col ${msg.senderId === user.id ? 'items-end' : 'items-start'}`}>
                                                <div className="flex items-center gap-2 mb-1 px-2">
                                                    <span className="text-[10px] font-bold text-slate-800">{msg.senderName}</span>
                                                    <Badge className="text-[8px] h-3.5 bg-slate-100 text-slate-500 border-none px-1.5 uppercase font-black">{msg.senderRole}</Badge>
                                                </div>
                                                <div className={`p-4 rounded-2xl shadow-sm text-sm font-semibold border relative group/msg ${
                                                    msg.senderId === user.id ? 'bg-[#128c7e] text-white border-[#128c7e] rounded-tr-none' : 'bg-white text-slate-800 border-slate-100 rounded-tl-none'
                                                }`}>
                                                    {/* Message Actions (Edit/Delete) */}
                                                    {msg.senderId === user.id && (
                                                        <div className="absolute -left-20 top-0 bottom-0 flex items-center gap-1 opacity-0 group-hover/msg:opacity-100 transition-opacity pr-4">
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                className="h-7 w-7 rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-primary"
                                                                onClick={() => startEditing(msg)}
                                                            >
                                                                <Pencil className="w-3.5 h-3.5" />
                                                            </Button>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                className="h-7 w-7 rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-rose-500"
                                                                onClick={() => handleDeleteMessage(msg.id)}
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </div>
                                                    )}

                                                    {msg.category && (
                                                        <div className="flex items-center gap-2 mb-2 p-1.5 rounded bg-black/5 text-[9px] font-black uppercase tracking-widest">
                                                            <Info className="w-3 h-3" /> {msg.category}
                                                        </div>
                                                    )}
                                                    <p className="leading-relaxed">{msg.content}</p>
                                                    
                                                    {/* Attachments UI */}
                                                    {msg.attachments && msg.attachments.length > 0 && (
                                                        <div className="mt-3 space-y-2">
                                                            {msg.attachments.map((file, idx) => (
                                                                <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                                                    msg.senderId === user.id 
                                                                    ? 'bg-white/10 border-white/20 text-white' 
                                                                    : 'bg-slate-50 border-slate-100 text-slate-700'
                                                                }`}>
                                                                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                                                                        msg.senderId === user.id ? 'bg-white/20' : 'bg-primary/10 text-primary'
                                                                    }`}>
                                                                        {file.type === 'image' ? <Paperclip className="w-5 h-5" /> : <FileDigit className="w-5 h-5" />}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-[11px] font-black truncate uppercase tracking-tighter">{file.name}</p>
                                                                        <p className="text-[9px] font-bold opacity-60 uppercase tracking-widest">{file.size || '0.5 MB'} • {file.type}</p>
                                                                    </div>
                                                                    {file.type === 'image' && file.url !== '#' && (
                                                                        <div className="h-10 w-10 rounded-lg overflow-hidden border border-white/20">
                                                                            <img src={file.url} alt="preview" className="h-full w-full object-cover" />
                                                                        </div>
                                                                    )}
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-black/5">
                                                                        <Download className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div className={`mt-2 text-[9px] font-bold opacity-60 flex justify-end gap-2 items-center`}>
                                                        {msg.isEdited && <span className="italic">edited</span>}
                                                        
                                                        {/* Read Receipts Popover */}
                                                        {msg.readBy && msg.readBy.length > 0 && (
                                                            <div className="flex items-center gap-1 group/receipts relative cursor-help">
                                                                <Eye className="w-3 h-3" />
                                                                <span>{msg.readBy.length}</span>
                                                                <div className="absolute bottom-full mb-2 right-0 bg-slate-900 text-white p-2 rounded-lg text-[8px] font-bold opacity-0 group-hover/receipts:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl border border-white/10">
                                                                    <p className="uppercase tracking-widest text-primary mb-1">Seen By</p>
                                                                    {msg.readBy.join(', ')}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        {msg.senderId === user.id && <CheckCheck className="w-3 h-3" />}
                                                    </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>

                                    {/* Input Controlled by Role */}
                                    <div className="p-4 px-6 bg-white border-t border-slate-100 shadow-sm z-10">
                                        {canSendMessage ? (
                                            <div className="flex flex-col gap-2">
                                                {/* Editing Indicator */}
                                                {editingId && (
                                                    <div className="flex items-center justify-between bg-primary/5 px-4 py-2 rounded-xl border border-primary/10">
                                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                                            <Pencil className="w-3.5 h-3.5" /> Updating your official message
                                                        </p>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="h-6 text-[9px] font-black uppercase tracking-widest px-3 bg-white"
                                                            onClick={() => {
                                                                setEditingId(null);
                                                                setNewMessage("");
                                                            }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                )}
                                                <div className="flex gap-3">
                                                    <div className="relative">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-11 w-11 rounded-full bg-slate-50 hover:bg-primary/10 text-slate-400 hover:text-primary transition-all shadow-sm"
                                                            onClick={() => setIsAttaching(!isAttaching)}
                                                        >
                                                            <Paperclip className="w-5 h-5" />
                                                        </Button>
                                                        
                                                        <AnimatePresence>
                                                            {isAttaching && (
                                                                <motion.div 
                                                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                                                    className="absolute bottom-full mb-3 left-0 bg-white border border-slate-100 shadow-2xl rounded-2xl p-2 flex flex-col gap-1 min-w-[200px] z-50"
                                                                >
                                                                    {(user.role === 'admin' || user.role === 'faculty') && (
                                                                        <button 
                                                                            onClick={() => fileInputRef.current?.click()} 
                                                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 transition-colors text-left group"
                                                                        >
                                                                            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                                <UserPlus className="w-4 h-4" />
                                                                            </div>
                                                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Upload from Device</span>
                                                                        </button>
                                                                    )}
                                                                    <div className="h-px bg-slate-50 my-1" />
                                                                    <button onClick={() => { handleSendMessage([{ name: 'Unit-3_ML_Notes.pdf', url: '#', type: 'pdf', size: '1.2 MB' }]); setIsAttaching(false); }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group">
                                                                        <div className="h-8 w-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                            <FileDigit className="w-4 h-4" />
                                                                        </div>
                                                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Quick PDF Note</span>
                                                                    </button>
                                                                    <button onClick={() => { handleSendMessage([{ name: 'Lab_Assignment_1.docx', url: '#', type: 'assignment', size: '0.8 MB' }]); setIsAttaching(false); }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group">
                                                                        <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                            <FileSignature className="w-4 h-4" />
                                                                        </div>
                                                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Assignment</span>
                                                                    </button>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>

                                                    <input 
                                                        type="file" 
                                                        ref={fileInputRef} 
                                                        className="hidden" 
                                                        onChange={handleFileChange}
                                                        accept="application/pdf,image/*,.doc,.docx"
                                                    />

                                                    <Input 
                                                        placeholder={editingId ? "Update your message..." : "Type an institutional message..."} 
                                                        className="flex-1 h-11 bg-slate-50 border-none rounded-full px-6 font-semibold shadow-inner focus-visible:ring-1 focus-visible:ring-primary/20"
                                                        value={newMessage}
                                                        onChange={(e) => setNewMessage(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                                    />
                                                    <Button 
                                                        onClick={() => handleSendMessage()}
                                                        className="h-11 w-11 rounded-full bg-gradient-to-br from-[#128c7e] to-emerald-600 hover:shadow-lg transition-all p-0 group"
                                                    >
                                                        <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-11 flex items-center justify-center bg-slate-50 rounded-xl text-muted-foreground text-xs font-bold uppercase tracking-widest gap-2">
                                                <Lock className="w-3.5 h-3.5" /> Read-Only Academic Channel
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Group Info Sidebar */}
                                <AnimatePresence>
                                    {showGroupInfo && (
                                        <motion.div 
                                            initial={{ x: '100%' }}
                                            animate={{ x: 0 }}
                                            exit={{ x: '100%' }}
                                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                            className="w-full lg:w-72 bg-white border-l border-slate-100 flex flex-col h-full z-20 absolute lg:relative right-0"
                                        >
                                            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Channel Roster</h4>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => setShowGroupInfo(false)}>
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <ScrollArea className="flex-1 p-4">
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 mb-3">Participants</p>
                                                        <div className="space-y-1">
                                                            {selectedGroup.participants.map((role, idx) => (
                                                                <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-default group">
                                                                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 border border-white shadow-sm group-hover:border-primary/20 group-hover:text-primary transition-colors">
                                                                        {role.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight truncate">
                                                                            {role === 'admin' ? 'Institutional Admin' : 
                                                                             role === 'faculty' ? 'Session Faculty' : 
                                                                             role === 'cr' ? 'Class Representative' : 
                                                                             role === 'student' ? 'Enrolled Student' : role}
                                                                        </p>
                                                                        <Badge className="h-3.5 text-[8px] bg-slate-100 text-slate-500 border-none uppercase font-black px-1 tracking-tighter">
                                                                            {role}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100/50">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                                            <span className="text-[10px] font-black text-emerald-900 uppercase tracking-widest">Privacy Protocol</span>
                                                        </div>
                                                        <p className="text-[10px] font-bold text-emerald-700/80 leading-snug">This channel is monitored for academic integrity. Only authorized roles can initiate broadcasts.</p>
                                                    </div>
                                                </div>
                                            </ScrollArea>
                                            <div className="p-4 border-t border-slate-50 bg-slate-50/50">
                                                <Button className="w-full h-10 rounded-xl bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:border-rose-200 hover:text-rose-500 shadow-sm transition-all">
                                                    Report Channel
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-[#f8f9fa]">
                            {activeTab === 'notifications' ? (
                                <>
                                    <div className="h-32 w-32 rounded-[3rem] bg-white flex items-center justify-center mb-8 shadow-2xl relative">
                                        <Bell className="w-12 h-12 text-slate-200" />
                                        <div className="absolute -top-2 -right-2 h-10 w-10 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 text-white flex items-center justify-center shadow-lg ring-4 ring-white">
                                            <Bell className="h-5 w-5 animate-bounce" />
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Personal Alerts Feed</h2>
                                    <p className="text-slate-500 max-w-sm text-sm font-medium leading-relaxed">Stay updated with academic alerts, fee deadlines, and timetable changes tailored for you.</p>
                                </>
                            ) : (
                                <>
                                    <div className="h-32 w-32 rounded-[3rem] bg-white flex items-center justify-center mb-8 shadow-2xl relative">
                                        <MessageSquare className="w-12 h-12 text-slate-200" />
                                        <div className="absolute -top-2 -right-2 h-10 w-10 rounded-full bg-gradient-to-br from-primary to-indigo-600 text-white flex items-center justify-center shadow-lg ring-4 ring-white">
                                            <Zap className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Campus Communication</h2>
                                    <p className="text-slate-500 max-w-sm text-sm font-medium leading-relaxed">Select a channel from the sidebar to engage with your peers and faculty members.</p>
                                </>
                            )}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
