import { useState, useMemo, useEffect, useRef } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
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
    Briefcase, FileText, LayoutDashboard, Paperclip, Download, Eye, FileDigit, FileSignature, UserPlus,
    Smile, UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_NOTIFICATIONS,
    Message, Conversation, InstitutionalNotification
} from "@/data/mockCommunications";
import { MOCK_STUDENTS } from "@/data/mockStudents";
import { MOCK_FACULTY } from "@/data/mockFaculty";
import { YEAR_IN_CHARGES, CLASS_TEACHERS, getSectionCR } from "@/data/mockHierarchy";
import { alertService } from "@/services/alertService";
import { toast } from "sonner";

const MESSAGE_TEMPLATES = [
    { label: 'College Event', content: 'Exciting news! We are hosting a [Event Name] on [Date]. All students and faculty are invited to join. Location: [Venue].' },
    { label: 'Mid-Term Exam', content: 'Attention Students: The Mid-Term examinations for [Semester] are scheduled to begin from [Date]. Please check the official timetable for hall tickets.' },
    { label: 'Scholarship Renewal', content: 'Reminder: The deadline for Scholarship Renewal for the academic year [Year] is [Date]. Please submit all required documents to the administrative office.' },
    { label: 'Event Payment', content: 'Wait-list for [Event Name] payment is now open. Fee: ₹[Amount]. Last date of payment: [Date]. Pay at the counter or via online portal.' },
    { label: 'Semester Fee', content: 'Urgent: Semester Fee payment for [Semester] is due by [Date]. A late fee of ₹500 will be applicable after the deadline.' },
    { label: 'Attendance Warning', content: 'Critical: Your attendance has fallen below 75%. This is a final warning before mandatory counseling and parent-teacher meeting.' },
    { label: 'Faculty Meeting', content: 'Faculty Notice: A departmental meeting is scheduled for [Time] today at [Venue]. Agenda: [Current Month] curriculum review and NAAC prep.' },
    { label: 'Assignment Submission', content: 'Notice: The submission link for [Subject Name] - [Assignment Title] is now active. Please upload your documents in PDF format by [Deadline].' }
];

export default function CommunicationHub() {
    const { user } = useOutletContext<{ user: { name: string, id: string, role: string } }>();
    const [searchParams, setSearchParams] = useSearchParams();
    
    // -- Primary States (TOP LEVEL) --
    const [selectedGroup, setSelectedGroup] = useState<Conversation | null>(null);
    const [selectedAlert, setSelectedAlert] = useState<InstitutionalNotification | null>(null);
    const [isPostingAlert, setIsPostingAlert] = useState(false);
    const [alertForm, setAlertForm] = useState({
        title: "",
        message: "",
        category: "general" as any,
        type: "normal" as any,
        targetAudience: "both" as 'students' | 'faculty' | 'both',
        targetBranch: "All",
        targetYear: "All"
    });
    
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"channels" | "notifications">("channels");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAttaching, setIsAttaching] = useState(false);
    const [showGroupInfo, setShowGroupInfo] = useState(false);
    const [memberManageId, setMemberManageId] = useState("");
    const [customParticipants, setCustomParticipants] = useState<Record<string, string[]>>(() => {
        const saved = localStorage.getItem('smartcampus_custom_participants');
        return saved ? JSON.parse(saved) : {};
    });
    const [showTemplates, setShowTemplates] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [allMessages, setAllMessages] = useState<Record<string, Message[]>>(() => {
        const saved = localStorage.getItem('smartcampus_messages');
        return saved ? JSON.parse(saved) : MOCK_MESSAGES;
    });

    // REAL-TIME SYNC ENGINE (Cross-Tab & Broadcast)
    useEffect(() => {
        const syncMessages = (e: StorageEvent) => {
            if (e.key === 'smartcampus_messages' && e.newValue) {
                setAllMessages(JSON.parse(e.newValue));
            }
        };
        const handleInternalSync = () => {
            const saved = localStorage.getItem('smartcampus_messages');
            if (saved) setAllMessages(JSON.parse(saved));
        };

        window.addEventListener('storage', syncMessages);
        window.addEventListener('messages_updated', handleInternalSync);
        
        return () => {
            window.removeEventListener('storage', syncMessages);
            window.removeEventListener('messages_updated', handleInternalSync);
        };
    }, []);
    const studentData = useMemo(() => {
        if (user.role !== 'student') return null;
        return MOCK_STUDENTS.find(s => s.rollNumber.toUpperCase() === user.id.toUpperCase());
    }, [user.id, user.role]);

    const facultyData = useMemo(() => {
        if (user.role !== 'faculty') return null;
        return MOCK_FACULTY.find(f => f.id === user.id);
    }, [user.id, user.role]);

    const [notifications, setNotifications] = useState<InstitutionalNotification[]>(() => {
        const saved = localStorage.getItem('STUDENT_ALERTS');
        const allAlerts: InstitutionalNotification[] = saved ? JSON.parse(saved) : [];
        
        // Filter based on Role and Profile
        return allAlerts.filter(a => {
            // Admin sees everything
            if (user.role === 'admin') return true;

            // Direct recipient match (e.g. for substituted faculty)
            if (a.recipientId && a.recipientId !== 'all' && a.recipientId !== 'targeted') {
                return a.recipientId === user.id;
            }

            // Student targeting
            if (user.role === 'student' && studentData) {
                const targetBranch = (a as any).branch || 'All';
                const targetYear = (a as any).year || 0;
                const targetSection = (a as any).section || 'All';

                const branchMatch = targetBranch === 'All' || targetBranch === studentData.branch;
                const yearMatch = targetYear === 0 || targetYear === studentData.year;
                const sectionMatch = targetSection === 'All' || targetSection === studentData.section;

                return branchMatch && yearMatch && sectionMatch;
            }

            // Faculty targeting (general notices)
            if (user.role === 'faculty') {
                const targetBranch = (a as any).branch || 'All';
                return targetBranch === 'All' || targetBranch === facultyData?.department;
            }

            return a.recipientId === 'all';
        });
    });

    useEffect(() => {
        // Sync notifications when user changes or alerts are updated
        const refresh = () => {
            const saved = localStorage.getItem('STUDENT_ALERTS');
            const allAlerts: InstitutionalNotification[] = saved ? JSON.parse(saved) : [];
            const filtered = allAlerts.filter(a => {
                if (user.role === 'admin') return true;
                if (a.recipientId && a.recipientId !== 'all' && a.recipientId !== 'targeted') {
                    return a.recipientId === user.id;
                }
                if (user.role === 'student' && studentData) {
                    const targetBranch = (a as any).branch || 'All';
                    const targetYear = (a as any).year || 0;
                    const targetSection = (a as any).section || 'All';
                    return (targetBranch === 'All' || targetBranch === studentData.branch) &&
                           (targetYear === 0 || targetYear === studentData.year) &&
                           (targetSection === 'All' || targetSection === studentData.section);
                }
                if (user.role === 'faculty') {
                    const targetBranch = (a as any).branch || 'All';
                    return targetBranch === 'All' || targetBranch === facultyData?.department;
                }
                return a.recipientId === 'all';
            });
            setNotifications(filtered);
        };
        window.addEventListener('student_alerts_updated', refresh);
        return () => window.removeEventListener('student_alerts_updated', refresh);
    }, [user.id, user.role, studentData, facultyData]);

    const isYI = useMemo(() => YEAR_IN_CHARGES.some(y => y.facultyId === user.id), [user.id]);
    const isCR = useMemo(() => {
        if (!studentData) return false;
        return getSectionCR(studentData.branch, studentData.year, studentData.section)?.id === studentData.id;
    }, [studentData]);

    const isAuthorized = useMemo(() => {
        if (user.role === 'admin') return true;
        if (user.role !== 'faculty') return false;

        const saved = localStorage.getItem('published_timetables');
        if (!saved) return isYI; 

        try {
            const timetables = JSON.parse(saved);
            const leaderNames = new Set<string>();
            
            Object.values(timetables).forEach((v: any) => {
                const meta = v.metadata;
                if (!meta) return;
                // Add both Name and ID to the authorized set (lowercase for matching)
                if (meta.classTeacher) leaderNames.add(meta.classTeacher.toLowerCase());
                if (meta.classTeacherId) leaderNames.add(meta.classTeacherId.toLowerCase());
                if (meta.yearInCharge) leaderNames.add(meta.yearInCharge.toLowerCase());
                if (meta.yearInChargeId) leaderNames.add(meta.yearInChargeId.toLowerCase());
            });

            return leaderNames.has(user.name.toLowerCase()) || leaderNames.has(user.id.toLowerCase()) || isYI;
        } catch (e) {
            return isYI;
        }
    }, [user.name, user.id, user.role, isYI]);

    const handleInjectMockTable = () => {
        const sample = {
            [`${studentData?.branch || 'CSE'}-${studentData?.year || 4}-1-${studentData?.section || 'A'}`]: {
                grid: {
                    '1-1': { subject: 'Machine Learning', faculty: 'Dr. Ram', facultyId: 'fac-001' },
                    '1-2': { subject: 'DBMS', faculty: 'Dr. Ali', facultyId: 'fac-002' }
                },
                metadata: {
                    classTeacher: 'Dr. Ram',
                    classTeacherId: 'fac-001',
                    yearInCharge: 'Prof. Sarah',
                    yearInChargeId: 'fac-yi-01'
                }
            }
        };
        const current = JSON.parse(localStorage.getItem('published_timetables') || '{}');
        localStorage.setItem('published_timetables', JSON.stringify({ ...current, ...sample }));
        toast.success("Sample Section Data Injected", { description: "Dynamic Roster is now active." });
        setTimeout(() => window.location.reload(), 1000);
    };

    // Handle deep-linking from notifications
    useEffect(() => {
        const tab = searchParams.get('tab');
        const alertId = searchParams.get('id');
        
        if (tab === 'notifications') {
            setActiveTab('notifications');
            if (alertId) {
                const found = notifications.find(n => n.id === alertId);
                if (found) setSelectedAlert(found);
            }
        }
    }, [searchParams, notifications]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab as any);
        setSelectedGroup(null);
        setSelectedAlert(null);
        // Clear params to avoid sticky state
        setSearchParams({});
    };

    const normalizedRole = useMemo(() => {
        if (user.role === 'admin') return 'Admin';
        if (isYI) return 'Year In-Charge';
        if (isCR) return 'CR';
        return user.role.charAt(0).toUpperCase() + user.role.slice(1) as any;
    }, [user.role, isYI, isCR]);

    // FILTER CONVERSATIONS BY TAB AND ROLE
    const filteredConversations = useMemo(() => {
        // 1. Get Base Conversations
        let baseList = [...MOCK_CONVERSATIONS];

        // 2. DYNAMICALLY GENERATE SECTION GROUPS FROM PUBLISHED TIMETABLES
        const saved = localStorage.getItem('published_timetables');
        if (saved) {
            try {
                const timetables = JSON.parse(saved);
                Object.keys(timetables).forEach(key => {
                    // Key format: BRANCH-YEAR-SEM-SECTION (e.g. CSM-1-1-A)
                    const [branch, year, sem, section] = key.split('-');
                    
                    // Check if a group already exists for this section to avoid duplicates
                    const exists = baseList.some(c => c.branch === branch && c.year === Number(year) && c.section === section);
                    
                    if (!exists) {
                        baseList.push({
                            id: `dynamic-${key}`,
                            name: `${branch} ${year} Year - Sec ${section} (Official)`,
                            type: 'section_group',
                            branch: branch,
                            year: Number(year),
                            section: section,
                            participants: ['faculty', 'student'],
                            allowedSenders: ['Faculty', 'Year In-Charge', 'Student', 'CR'],
                            updatedAt: new Date().toISOString()
                        });
                    }
                });
            } catch (e) {
                console.error("Error generating dynamic groups", e);
            }
        }

        return baseList.filter(conv => {
            // Tab filtering
            if (activeTab === 'notifications') return false;

            // Role & Hierarchy filtering
            if (user.role === 'admin') {
                return ['admin_broadcast', 'admin_to_yi', 'cr_coordination', 'faculty_only', 'placement_cell', 'section_group', 'year_group'].includes(conv.type);
            }
            if (user.role === 'faculty') {
                if (conv.type === 'admin_to_yi') return isYI;
                if (conv.type === 'yi_to_faculty') return true;
                
                // CRITICAL: Filter section groups to only those this faculty member TEACHES or LEADS
                if (conv.type === 'section_group') {
                    const saved = localStorage.getItem('published_timetables');
                    if (!saved) return true; // Standard fallback
                    try {
                        const timetables = JSON.parse(saved);
                        // Scan for any timetable where this faculty is mentioned for this section
                        const tKeys = Object.keys(timetables).filter(k => k.startsWith(`${conv.branch}-${conv.year}-`) && k.endsWith(`-${conv.section}`));
                        
                        let isRelevant = false;
                        for (const key of tKeys) {
                            const table = timetables[key];
                            // 1. Check Metadata (CT/YI)
                            if (table.metadata?.classTeacher === user.name || table.metadata?.yearInCharge === user.name) {
                                isRelevant = true;
                                break;
                            }
                            // 2. Check Grid (Subject Teacher)
                            const gridSlots = Object.values(table.grid || {});
                            if (gridSlots.some((s: any) => s.faculty === user.name)) {
                                isRelevant = true;
                                break;
                            }
                        }
                        return isRelevant;
                    } catch (e) { return true; }
                }

                if (conv.type === 'year_group') return true;
                if (conv.type === 'subject_specific') return true;
                if (conv.type === 'faculty_only') return !conv.branch || conv.branch === facultyData?.department;
                if (conv.type === 'admin_broadcast') return true;
                if (conv.type === 'cr_coordination') return true; 
                return false;
            }
            if (user.role === 'student' && studentData) {
                if (conv.type === 'admin_broadcast') return true;
                if (conv.type === 'section_group') return conv.branch === studentData.branch && conv.year === studentData.year && conv.section === studentData.section;
                if (conv.type === 'year_group') return conv.branch === studentData.branch && conv.year === studentData.year;
                if (conv.type === 'subject_specific') return true; 
                if (conv.type === 'cr_coordination') return isCR;
                if (conv.type === 'placement_cell') return studentData.year >= 3;
                return false;
            }
            return false;
        }).filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [activeTab, user.role, studentData, isCR, isYI, searchQuery, facultyData?.department]);

    // PERMISSION CHECK: Can the current user send messages in this group?
    const canSendMessage = useMemo(() => {
        if (!selectedGroup) return false;
        // Admins and Faculty (including Incharges) can ALWAYS send messages everywhere
        if (user.role === 'admin' || user.role === 'faculty') return true;
        
        return selectedGroup.allowedSenders.includes(normalizedRole);
    }, [selectedGroup, normalizedRole, user.role]);

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
            window.dispatchEvent(new CustomEvent('messages_updated'));
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
        
        // Broadcast for real-time sync across other components/tabs
        window.dispatchEvent(new CustomEvent('messages_updated'));
        
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
        window.dispatchEvent(new CustomEvent('messages_updated'));
        toast.success("Message deleted");
    };

    const startEditing = (msg: Message) => {
        setEditingId(msg.id);
        setNewMessage(msg.content);
    };

    const handleReaction = (messageId: string, emoji: string) => {
        if (!selectedGroup) return;

        const updatedMessages = {
            ...allMessages,
            [selectedGroup.id]: allMessages[selectedGroup.id].map(msg => {
                if (msg.id !== messageId) return msg;

                const reactions = { ...(msg.reactions || {}) };
                const currentReactors = reactions[emoji] || [];

                if (currentReactors.includes(user.name)) {
                    // Remove reaction
                    reactions[emoji] = currentReactors.filter(u => u !== user.name);
                    if (reactions[emoji].length === 0) delete reactions[emoji];
                } else {
                    // Add reaction
                    reactions[emoji] = [...currentReactors, user.name];
                }

                return { ...msg, reactions };
            })
        };

        setAllMessages(updatedMessages);
        localStorage.setItem('smartcampus_messages', JSON.stringify(updatedMessages));
        window.dispatchEvent(new CustomEvent('messages_updated'));
    };

    const handlePostAlert = () => {
        if (!alertForm.title || !alertForm.message) {
            toast.error("Title and message are required");
            return;
        }

        const newAlert = alertService.sendAlert({
            title: alertForm.title,
            message: alertForm.message,
            category: alertForm.category,
            type: alertForm.type,
            targetAudience: alertForm.targetAudience,
            branch: alertForm.targetBranch,
            year: alertForm.targetYear === "All" ? 0 : parseInt(alertForm.targetYear),
        });

        if (newAlert) {
            setNotifications(prev => [newAlert as any, ...prev]);
        }

        setIsPostingAlert(false);
        setAlertForm({
            title: "",
            message: "",
            category: "general" as any,
            type: "normal" as any,
            targetAudience: "both",
            targetBranch: "All",
            targetYear: "All"
        });
        toast.success("Alert posted successfully", { description: "Notice pushed to target audience." });
    };

    const handleDeleteAlert = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const saved = localStorage.getItem('STUDENT_ALERTS');
        const allAlerts: InstitutionalNotification[] = saved ? JSON.parse(saved) : [];
        const updated = allAlerts.filter(a => a.id !== id);
        
        localStorage.setItem('STUDENT_ALERTS', JSON.stringify(updated));
        setNotifications(prev => prev.filter(a => a.id !== id));
        if (selectedAlert?.id === id) setSelectedAlert(null);
        
        window.dispatchEvent(new CustomEvent('student_alerts_updated'));
        toast.success("Alert removed from your feed.");
    };

    const handleAddMember = (groupId: string) => {
        if (!memberManageId.trim()) return;
        
        // Logical check: exists in mock data?
        const found = MOCK_STUDENTS.find(s => s.rollNumber === memberManageId) || 
                      MOCK_FACULTY.find(f => f.id === memberManageId || f.rollNumber === memberManageId);

        if (!found) {
            toast.error("User not found", { description: "Double check the Unique ID." });
            return;
        }

        const updated = {
            ...customParticipants,
            [groupId]: [...(customParticipants[groupId] || []), found.id || (found as any).rollNumber]
        };

        setCustomParticipants(updated);
        localStorage.setItem('smartcampus_custom_participants', JSON.stringify(updated));
        setMemberManageId("");
        toast.success(`${found.name} added to group`);
        window.dispatchEvent(new Event('storage'));
    };

    const handleRemoveMember = (groupId: string, userId: string) => {
        const updated = {
            ...customParticipants,
            [groupId]: (customParticipants[groupId] || []).filter(id => id !== userId)
        };
        setCustomParticipants(updated);
        localStorage.setItem('smartcampus_custom_participants', JSON.stringify(updated));
        toast.success("Member removed from group");
        window.dispatchEvent(new Event('storage'));
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
                    <Tabs value={activeTab} onValueChange={(v: any) => handleTabChange(v)} className="bg-slate-100 p-1 rounded-xl shadow-sm border border-slate-200">
                        <TabsList className="bg-transparent">
                            <TabsTrigger value="channels" className="rounded-lg font-bold px-4 text-xs">Channels</TabsTrigger>
                            <TabsTrigger value="notifications" className="rounded-lg font-bold px-4 text-xs relative">
                                Alerts
                                {(() => {
                                    const count = notifications.filter(n => !n.isRead).length;
                                    return count > 0 && (
                                        <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-rose-500 text-[8px] font-black text-white flex items-center justify-center shadow-lg animate-in zoom-in-50">
                                            {count}
                                        </span>
                                    );
                                })()}
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                    {user.role === 'admin' && (
                        <Button
                            variant="outline"
                            onClick={handleInjectMockTable}
                            className="h-10 px-4 border-dashed border-primary/40 text-primary hover:bg-primary/5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all gap-2"
                        >
                            <Zap className="w-4 h-4 animate-pulse" /> Sync Roster
                        </Button>
                    )}
                    {isAuthorized && (
                        <Button
                            onClick={() => setIsPostingAlert(true)}
                            className="h-10 px-4 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:shadow-lg transition-all gap-2"
                        >
                            <Bell className="w-4 h-4" /> Post Alert
                        </Button>
                    )}
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
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-sm ${selectedGroup?.id === conv.id
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
                                        <div className="text-left flex-1 min-w-0 flex items-center justify-between gap-2">
                                            <div className="min-w-0 truncate">
                                                <p className={`text-sm font-black truncate leading-tight ${selectedGroup?.id === conv.id ? 'text-primary' : 'text-slate-800'}`}>
                                                    {conv.name}
                                                </p>
                                                <p className="text-[9px] text-muted-foreground font-black truncate uppercase tracking-widest opacity-60 mt-0.5">
                                                    {conv.type === 'admin_broadcast' ? 'Announcement' : conv.type.replace(/_/g, ' ')}
                                                </p>
                                            </div>
                                            {(() => {
                                                const count = (allMessages[conv.id] || []).filter(msg => 
                                                    msg.senderId !== user.id && !msg.readBy?.includes(user.name)
                                                ).length;
                                                return count > 0 && selectedGroup?.id !== conv.id ? (
                                                    <span className="h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-lg animate-in zoom-in-50">
                                                        {count}
                                                    </span>
                                                ) : null;
                                            })()}
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
                                notifications.filter(notif => notif.title.toLowerCase().includes(searchQuery.toLowerCase()) || notif.message.toLowerCase().includes(searchQuery.toLowerCase())).map(notif => (
                                    <div 
                                        key={notif.id} 
                                        onClick={() => {
                                            setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
                                            setSelectedAlert(notif);
                                            // Sync with localStorage
                                            const updated = notifications.map(n => n.id === notif.id ? { ...n, isRead: true } : n);
                                            localStorage.setItem('STUDENT_ALERTS', JSON.stringify(updated.slice(0, 50)));
                                            window.dispatchEvent(new CustomEvent('student_alerts_updated'));
                                        }}
                                        className={`p-4 rounded-2xl border transition-all cursor-pointer mb-2 relative group overflow-hidden ${
                                            selectedAlert?.id === notif.id ? 'bg-primary/5 border-primary/40 ring-1 ring-primary/20' : 
                                            notif.isRead ? 'bg-white border-slate-100 opacity-60' : 'bg-white border-primary/10 shadow-sm'
                                        }`}
                                    >
                                        {(selectedAlert?.id === notif.id || !notif.isRead) && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${notif.type === 'urgent' ? 'bg-rose-50 text-rose-500' :
                                                notif.category === 'attendance' ? 'bg-amber-50 text-amber-500' : 'bg-primary/5 text-primary'
                                                }`}>
                                                 {notificationIcons[notif.category]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[11px] font-black uppercase tracking-widest text-slate-800 truncate">{notif.title}</p>
                                                <p className="text-[9px] text-muted-foreground font-bold uppercase">{new Date(notif.timestamp).toLocaleTimeString()}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {notif.type === 'urgent' && <Badge className="bg-rose-500 h-4 px-1 text-[8px] animate-pulse">URGENT</Badge>}
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-6 w-6 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all"
                                                    onClick={(e) => handleDeleteAlert(notif.id, e)}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                        <p className="text-xs font-semibold text-slate-600 line-clamp-2 leading-relaxed mb-3">{notif.message}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{notif.category} system</span>
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
                                        <Info className="w-5 h-5" />
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
                                                        <div className={`p-4 rounded-2xl shadow-sm text-sm font-semibold border relative group/msg ${msg.senderId === user.id ? 'bg-[#128c7e] text-white border-[#128c7e] rounded-tr-none' : 'bg-white text-slate-800 border-slate-100 rounded-tl-none'
                                                            }`}>
                                                            {/* Reaction Picker and Actions (Hover) */}
                                                            <div className={`absolute ${msg.senderId === user.id ? '-left-[13.5rem]' : '-right-[9rem]'} top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-0 group-hover/msg:opacity-100 transition-all duration-200 z-20`}>
                                                                <div className="flex gap-1 bg-white border border-slate-100 p-1 rounded-full shadow-2xl backdrop-blur-sm">
                                                                    {['👍', '❤️', '😂', '😮', '😢', '🙏'].map(emoji => (
                                                                        <button
                                                                            key={emoji}
                                                                            onClick={() => handleReaction(msg.id, emoji)}
                                                                            className={`h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-50 transition-all text-sm active:scale-95 ${msg.reactions?.[emoji]?.includes(user.name) ? 'bg-primary/10 scale-110' : ''}`}
                                                                        >
                                                                            {emoji}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                                {msg.senderId === user.id && (
                                                                    <div className="flex gap-1.5 items-center">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-8 w-8 rounded-full bg-white border border-slate-100 text-slate-400 hover:text-primary hover:bg-primary/5 shadow-lg active:scale-90 transition-all"
                                                                            onClick={() => startEditing(msg)}
                                                                        >
                                                                            <Pencil className="w-3.5 h-3.5" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-8 w-8 rounded-full bg-white border border-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50 shadow-lg active:scale-90 transition-all"
                                                                            onClick={() => handleDeleteMessage(msg.id)}
                                                                        >
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {msg.category && (
                                                                <div className="flex items-center gap-2 mb-2 p-1.5 rounded bg-black/5 text-[9px] font-black uppercase tracking-widest">
                                                                    <Info className="w-3 h-3" /> {msg.category}
                                                                </div>
                                                            )}
                                                            <p className="leading-relaxed">{msg.content}</p>

                                                            {/* Actual Reactions (Hanging at bottom) */}
                                                            {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                                                                <div className={`absolute -bottom-3 ${msg.senderId === user.id ? 'right-4' : 'left-4'} flex flex-wrap gap-1 z-10`}>
                                                                    <div className="flex items-center gap-0.5 bg-white border border-white/50 shadow-md rounded-full px-1.5 py-0.5 backdrop-blur-md ring-1 ring-black/5">
                                                                        {Object.entries(msg.reactions).map(([emoji, users]) => (
                                                                            <button
                                                                                key={emoji}
                                                                                onClick={() => handleReaction(msg.id, emoji)}
                                                                                className={`flex items-center gap-1 transition-all hover:scale-110 active:scale-90 ${
                                                                                    users.includes(user.name) ? 'scale-105' : ''
                                                                                }`}
                                                                            >
                                                                                <span className="text-[12px]">{emoji}</span>
                                                                                {Object.keys(msg.reactions || {}).length === 1 && (
                                                                                    <span className="text-[9px] font-black text-slate-500 ml-0.5">{users.length}</span>
                                                                                )}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Attachments UI */}
                                                            {msg.attachments && msg.attachments.length > 0 && (
                                                                <div className="mt-3 space-y-2">
                                                                    {msg.attachments.map((file, idx) => (
                                                                        <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${msg.senderId === user.id
                                                                            ? 'bg-white/10 border-white/20 text-white'
                                                                            : 'bg-slate-50 border-slate-100 text-slate-700'
                                                                            }`}>
                                                                            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${msg.senderId === user.id ? 'bg-white/20' : 'bg-primary/10 text-primary'
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

                                                        {(user.role === 'admin' || isYI) && (
                                                            <div className="relative inline-block ml-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className={`h-11 w-11 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-600 transition-all shadow-sm ${showTemplates ? 'ring-2 ring-amber-500 ring-offset-2' : ''}`}
                                                                    onClick={() => setShowTemplates(!showTemplates)}
                                                                >
                                                                    <FileText className="w-5 h-5" />
                                                                </Button>

                                                                <AnimatePresence>
                                                                    {showTemplates && (
                                                                        <motion.div
                                                                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                                                            className="absolute bottom-full mb-3 left-0 bg-white border border-slate-200 shadow-2xl rounded-2xl p-3 flex flex-col gap-2 min-w-[320px] max-h-[400px] overflow-y-auto z-50 scrollbar-hide"
                                                                        >
                                                                            <div className="pb-2 border-b border-slate-100 mb-1">
                                                                                <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 px-2">Institutional Drafts</p>
                                                                            </div>
                                                                            {MESSAGE_TEMPLATES.map((tmpl, idx) => (
                                                                                <button
                                                                                    key={idx}
                                                                                    onClick={() => {
                                                                                        setNewMessage(tmpl.content);
                                                                                        setShowTemplates(false);
                                                                                        toast.success("Template Loaded", { description: "You can now customize the bracketed [details]." });
                                                                                    }}
                                                                                    className="flex flex-col items-start gap-1 p-3 rounded-xl hover:bg-amber-50 transition-all text-left group border border-transparent hover:border-amber-100"
                                                                                >
                                                                                    <span className="text-[11px] font-black text-slate-900 group-hover:text-amber-700 transition-colors">{tmpl.label}</span>
                                                                                    <span className="text-[9px] font-bold text-slate-400 line-clamp-1">{tmpl.content}</span>
                                                                                </button>
                                                                            ))}
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        )}

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
                                                        <div className="flex items-center justify-between px-2 mb-3">
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Members</p>
                                                            <Badge className="bg-primary/10 text-primary border-none text-[8px] h-4">
                                                                {(() => {
                                                                    if (!selectedGroup) return 0;
                                                                    if (selectedGroup.type === 'section_group') {
                                                                        const studentCount = MOCK_STUDENTS.filter(s => s.branch === selectedGroup.branch && s.year === selectedGroup.year && s.section === selectedGroup.section).length;
                                                                        return studentCount + 2; // Teacher + YI
                                                                    }
                                                                    if (selectedGroup.type === 'admin_to_yi') {
                                                                        return YEAR_IN_CHARGES.length + 1; // All YIs + Admin
                                                                    }
                                                                    if (selectedGroup.type === 'year_group') {
                                                                        const studentCount = MOCK_STUDENTS.filter(s => s.branch === selectedGroup.branch && s.year === selectedGroup.year).length;
                                                                        return studentCount + 1; // YI + Students
                                                                    }
                                                                    if (selectedGroup.type === 'faculty_only') {
                                                                        const facCount = MOCK_FACULTY.filter(f => f.department === selectedGroup.branch).length;
                                                                        return facCount + 1; // Faculty + Admin
                                                                    }
                                                                    if (selectedGroup.id === 'all-crs-chain') {
                                                                        return 12; // Simulated: 4 branches * 3 sections each
                                                                    }
                                                                    return (selectedGroup.participants || []).length;
                                                                })()}
                                                            </Badge>
                                                        </div>
                                                        <div className="space-y-1">
                                                            {/* Resolver for actual people */}
                                                            {(() => {
                                                                const people: { name: string, role: string, sub: string, extra?: string }[] = [];

                                                                if (selectedGroup.type === 'admin_to_yi') {
                                                                    people.push({ name: 'Institutional Admin', role: 'ADMIN', sub: 'Hub Control' });
                                                                    YEAR_IN_CHARGES.forEach(yi => {
                                                                        const f = MOCK_FACULTY.find(fac => fac.id === yi.facultyId);
                                                                        if (f) people.push({ name: f.name, role: 'Faculty', sub: `${yi.branch} Year-${yi.year} In-Charge`, extra: 'YI' });
                                                                    });
                                                                } else if (selectedGroup.type === 'faculty_only') {
                                                                    people.push({ name: 'Institutional Admin', role: 'ADMIN', sub: 'Moderator' });
                                                                    MOCK_FACULTY.filter(f => f.department === selectedGroup.branch).forEach(f => {
                                                                        people.push({ name: f.name, role: 'Faculty', sub: f.designation });
                                                                    });
                                                                } else if (selectedGroup.id === 'all-crs-chain') {
                                                                    people.push({ name: 'Academic Admin', role: 'ADMIN', sub: 'Coordination Control' });
                                                                    // Show a representative list of CRs for all branches
                                                                    ['CSE', 'CSM', 'IT', 'ECE'].forEach(b => {
                                                                        people.push({ name: `${b} Year-4 CR`, role: 'Student', sub: `CR Section-A`, extra: 'Lead' });
                                                                        people.push({ name: `${b} Year-3 CR`, role: 'Student', sub: `CR Section-B` });
                                                                    });
                                                                } else if (selectedGroup.type === 'section_group' || selectedGroup.type === 'year_group' || selectedGroup.type === 'subject_specific') {
                                                                    // Add Class Teacher / YI
                                                                    const ct = CLASS_TEACHERS.find(c => c.branch === selectedGroup.branch && c.year === selectedGroup.year && c.section === selectedGroup.section);
                                                                    const yi = YEAR_IN_CHARGES.find(y => y.branch === selectedGroup.branch && y.year === selectedGroup.year);

                                                                    if (yi) {
                                                                        const f = MOCK_FACULTY.find(fac => fac.id === yi.facultyId);
                                                                        if (f) people.push({ name: f.name, role: 'Faculty', sub: 'Year In-Charge', extra: 'Moderator' });
                                                                    }
                                                                    if (ct) {
                                                                        const f = MOCK_FACULTY.find(fac => fac.id === ct.facultyId);
                                                                        if (f) people.push({ name: f.name, role: 'Faculty', sub: 'Class Teacher' });
                                                                    }

                                                                    // Students (Full Roster)
                                                                    const students = MOCK_STUDENTS.filter(s => 
                                                                        s.branch === selectedGroup.branch && 
                                                                        s.year === selectedGroup.year && 
                                                                        (selectedGroup.type === 'section_group' ? s.section === selectedGroup.section : true)
                                                                    );

                                                                    const cr = getSectionCR(selectedGroup.branch || '', selectedGroup.year || 1, selectedGroup.section || 'A');
                                                                    
                                                                    students.forEach(s => {
                                                                        const isCR = cr?.id === s.id;
                                                                        people.push({ 
                                                                            name: s.name, 
                                                                            role: 'Student', 
                                                                            sub: s.rollNumber, 
                                                                            extra: isCR ? 'CR' : undefined 
                                                                        });
                                                                    });

                                                                    // DEEP TIMETABLE SYNC: Scan ALL Semesters for this Section
                                                                    const saved = localStorage.getItem('published_timetables');
                                                                    if (saved && selectedGroup.type === 'section_group') {
                                                                        try {
                                                                            const timetables = JSON.parse(saved);
                                                                            // Find all keys matching this section across any semester (e.g. CSM-4-*-A)
                                                                            const sectionKeys = Object.keys(timetables).filter(k => 
                                                                                k.startsWith(`${selectedGroup.branch}-${selectedGroup.year}-`) && 
                                                                                k.endsWith(`-${selectedGroup.section}`)
                                                                            );

                                                                            sectionKeys.forEach(key => {
                                                                                const activeTable = timetables[key];
                                                                                if (!activeTable) return;

                                                                                // 1. Get CT and YI from metadata
                                                                                const meta = activeTable.metadata;
                                                                                if (meta?.classTeacher && !people.some(p => p.name === meta.classTeacher)) {
                                                                                    people.push({ name: meta.classTeacher, role: 'Faculty', sub: 'Class Teacher', extra: 'Moderator' });
                                                                                }
                                                                                if (meta?.yearInCharge && !people.some(p => p.name === meta.yearInCharge)) {
                                                                                    people.push({ name: meta.yearInCharge, role: 'Faculty', sub: 'Year In-Charge', extra: 'Moderator' });
                                                                                }

                                                                                // 2. Scan whole grid for Subject + Faculty Pairs
                                                                                const grid = activeTable.grid || {};
                                                                                Object.values(grid).forEach((slot: any) => {
                                                                                    if (slot?.faculty) {
                                                                                        const existing = people.find(p => p.name === slot.faculty);
                                                                                        if (!existing) {
                                                                                            people.push({ 
                                                                                                name: slot.faculty, 
                                                                                                role: 'Faculty', 
                                                                                                sub: slot.subject || 'Subject Teacher'
                                                                                            });
                                                                                        } else if (existing.sub === 'Subject Teacher' && slot.subject) {
                                                                                            // Improve existing entry with actual subject name
                                                                                            existing.sub = slot.subject;
                                                                                        }
                                                                                    }
                                                                                });
                                                                            });
                                                                        } catch(e) { console.error("Deep roster sync error"); }
                                                                    }
                                                                } else {
                                                                    // Fallback for admin/broadcast groups
                                                                    selectedGroup.participants.forEach(p => {
                                                                        people.push({
                                                                            name: p === 'admin' ? 'Institutional Admin' : p.charAt(0).toUpperCase() + p.slice(1),
                                                                            role: p.toUpperCase(),
                                                                            sub: 'Channel Audience'
                                                                        });
                                                                    });
                                                                }

                                                                // Manual Participants Injection
                                                                const manualIds = customParticipants[selectedGroup.id] || [];
                                                                manualIds.forEach(id => {
                                                                    const s = MOCK_STUDENTS.find(sm => sm.rollNumber === id || sm.id === id);
                                                                    const f = MOCK_FACULTY.find(fm => fm.id === id || fm.rollNumber === id);
                                                                    if (s) people.push({ name: s.name, role: 'Student', sub: s.rollNumber, extra: 'Manual' });
                                                                    if (f) people.push({ name: f.name, role: 'Faculty', sub: f.designation, extra: 'Manual' });
                                                                });

                                                                // Deduplicate by Unique ID (sub)
                                                                const uniquePeople = people.filter((v, i, a) => a.findIndex(t => (t.sub === v.sub)) === i);

                                                                return (
                                                                    <div className="space-y-6">
                                                                        {/* Member Management (Admin/YI only) */}
                                                                        {isAuthorized && (
                                                                            <div className="space-y-3">
                                                                                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-1">Administrative Control</h4>
                                                                                <div className="bg-slate-50 border border-slate-100 p-4 rounded-3xl space-y-4">
                                                                                    <div className="space-y-2">
                                                                                        <label className="text-[10px] font-bold text-slate-500 px-1">Add Member by ID</label>
                                                                                        <div className="flex gap-2">
                                                                                            <Input 
                                                                                                placeholder="Roll No / ID" 
                                                                                                className="h-9 bg-white border-slate-200 text-xs font-bold rounded-xl"
                                                                                                value={memberManageId}
                                                                                                onChange={(e) => setMemberManageId(e.target.value)}
                                                                                            />
                                                                                            <Button 
                                                                                                className="h-9 px-4 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
                                                                                                onClick={() => handleAddMember(selectedGroup.id)}
                                                                                            >Add</Button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        <div className="space-y-3">
                                                                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-1">Participants</h4>
                                                                            <div className="space-y-2 pb-6">
                                                                                {uniquePeople.map((person, idx) => (
                                                                                    <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-default group">
                                                                                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 border border-white shadow-sm group-hover:border-primary/20 group-hover:text-primary transition-colors overflow-hidden">
                                                                                            {person.name.charAt(0)}
                                                                                        </div>
                                                                                        <div className="flex-1 min-w-0">
                                                                                            <div className="flex items-center gap-2">
                                                                                                <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight truncate">
                                                                                                    {person.name}
                                                                                                </p>
                                                                                                {person.extra && (
                                                                                                    <Badge className="h-3 text-[6px] px-1 bg-emerald-100 text-emerald-600 border-none font-black uppercase">
                                                                                                        {person.extra}
                                                                                                    </Badge>
                                                                                                )}
                                                                                            </div>
                                                                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                                                                <Badge className={`h-3.5 text-[7px] border-none uppercase font-black px-1 tracking-tighter ${person.role === 'Faculty' ? 'bg-amber-100 text-amber-600' :
                                                                                                    person.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'
                                                                                                    }`}>
                                                                                                    {person.role}
                                                                                                </Badge>
                                                                                                <span className="text-[9px] font-bold text-muted-foreground truncate">{person.sub}</span>
                                                                                            </div>
                                                                                        </div>
                                                                                        {isAuthorized && manualIds.includes(person.sub) && (
                                                                                            <Button 
                                                                                                variant="ghost" 
                                                                                                size="icon" 
                                                                                                className="h-8 w-8 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 rounded-lg"
                                                                                                onClick={() => handleRemoveMember(selectedGroup.id, person.sub)}
                                                                                            >
                                                                                                <X className="w-3.5 h-3.5" />
                                                                                            </Button>
                                                                                        )}
                                                                                        {!manualIds.includes(person.sub) && person.extra === 'Moderator' && (
                                                                                             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                                                                        )}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })()}
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
                        <div className="flex-1 flex flex-col items-center justify-center h-full overflow-hidden">
                            {!selectedAlert ? (
                                <div className="flex flex-col items-center justify-center p-12 text-center bg-[#f8f9fa] h-full w-full">
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
                            ) : activeTab === 'notifications' && (
                                <div className="flex-1 flex flex-col h-full w-full bg-slate-50/50">
                                    {/* Alert Header */}
                                    <div className="p-4 px-8 flex items-center justify-between bg-white border-b border-slate-100 shadow-sm shrink-0">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg ${
                                                selectedAlert.type === 'urgent' ? 'bg-rose-500 text-white' : 'bg-primary text-white'
                                            }`}>
                                                <Bell className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-slate-900 leading-tight">{selectedAlert.title}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-slate-50 border-slate-200">
                                                        {selectedAlert.category} System
                                                    </Badge>
                                                    <span className="text-[10px] text-muted-foreground font-bold">
                                                        {new Date(selectedAlert.timestamp).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setSelectedAlert(null)}>
                                            <X className="w-5 h-5" />
                                        </Button>
                                    </div>

                                    <ScrollArea className="flex-1 p-12">
                                        <div className="max-w-2xl mx-auto space-y-8">
                                            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
                                                <CardContent className="p-8 pb-10">
                                                    <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                            <ShieldCheck className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Authenticated Notice</p>
                                                            <p className="text-xs font-bold text-slate-600">This alert was generated by the {selectedAlert.category} department.</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-6">
                                                        <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-tight">
                                                            {selectedAlert.title}
                                                        </h1>
                                                        
                                                        <div className="prose prose-slate max-w-none">
                                                            <p className="text-lg font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">
                                                                {selectedAlert.message}
                                                            </p>
                                                        </div>

                                                        {selectedAlert.type === 'urgent' && (
                                                            <div className="flex items-center gap-4 p-5 rounded-3xl bg-rose-50 border border-rose-100">
                                                                <div className="h-10 w-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center animate-pulse">
                                                                    <AlertTriangle className="w-6 h-6" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-rose-500 leading-none mb-1">Immediate Action Required</p>
                                                                    <p className="text-xs font-bold text-rose-700">Please acknowledge this notice or visit the relevant department immediately.</p>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="pt-8 flex items-center border-t border-slate-50">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 border border-white">
                                                                    S
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-none">Smart Campus</p>
                                                                    <p className="text-[9px] font-bold text-muted-foreground uppercase mt-0.5">Automated System</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <div className="text-center italic text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                                                Secure Campus Communication • End-to-End Encrypted
                                            </div>
                                        </div>
                                    </ScrollArea>
                                </div>
                            )}
                        </div>
                    )}
                </Card>
            </div>

            {/* Alert Posting Modal */ }
    <AnimatePresence>
        {isPostingAlert && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    onClick={() => setIsPostingAlert(false)}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl relative z-10 overflow-hidden border border-slate-100"
                >
                    <div className="p-8 pb-4 flex justify-between items-center border-b border-slate-50">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                                <Megaphone className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black tracking-tight text-slate-900">Broadcast Official Alert</h2>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Targeted Campus Notifications</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsPostingAlert(false)} className="rounded-full">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Target Audience</label>
                                <div className="flex bg-slate-50 p-1.5 rounded-2xl">
                                    <button
                                        onClick={() => setAlertForm({ ...alertForm, targetAudience: 'students' })}
                                        className={`flex-1 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all gap-2 flex items-center justify-center ${alertForm.targetAudience === 'students' ? 'bg-white text-primary shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        <GraduationCap className="w-3.5 h-3.5" /> Students
                                    </button>
                                    <button
                                        onClick={() => setAlertForm({ ...alertForm, targetAudience: 'faculty' })}
                                        className={`flex-1 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all gap-2 flex items-center justify-center ${alertForm.targetAudience === 'faculty' ? 'bg-white text-primary shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        <UserCheck className="w-3.5 h-3.5" /> Faculty
                                    </button>
                                    <button
                                        onClick={() => setAlertForm({ ...alertForm, targetAudience: 'both' })}
                                        className={`flex-1 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all gap-2 flex items-center justify-center ${alertForm.targetAudience === 'both' ? 'bg-white text-primary shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        Both
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Target Branch</label>
                                    <select
                                        className="w-full h-11 bg-slate-50 border-none rounded-xl px-4 text-sm font-bold text-slate-800"
                                        value={alertForm.targetBranch}
                                        onChange={(e) => setAlertForm({ ...alertForm, targetBranch: e.target.value })}
                                    >
                                        <option value="All">All Branches</option>
                                        <option value="CSE">Computer Science (CSE)</option>
                                        <option value="CSM">AI & ML (CSM)</option>
                                        <option value="IT">Information Tech (IT)</option>
                                        <option value="ECE">Electronics (ECE)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Target Year</label>
                                    <select
                                        className="w-full h-11 bg-slate-50 border-none rounded-xl px-4 text-sm font-bold text-slate-800"
                                        value={alertForm.targetYear}
                                        onChange={(e) => setAlertForm({ ...alertForm, targetYear: e.target.value })}
                                    >
                                        <option value="All">All Years</option>
                                        <option value="4">4th Year</option>
                                        <option value="3">3rd Year</option>
                                        <option value="2">2nd Year</option>
                                        <option value="1">1st Year</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Alert Title</label>
                                <Input
                                    placeholder="e.g., Fee Deadline Extended, Holiday Announcement"
                                    className="h-11 bg-slate-50 border-none rounded-xl px-4 font-bold text-slate-800 placeholder:text-slate-300"
                                    value={alertForm.title}
                                    onChange={(e) => setAlertForm({ ...alertForm, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Alert Message</label>
                                <textarea
                                    placeholder="Enter the detailed notice for the specific audience..."
                                    className="w-full min-h-[120px] bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 placeholder:text-slate-300 outline-none ring-0 focus-visible:ring-1 focus-visible:ring-primary/20"
                                    value={alertForm.message}
                                    onChange={(e) => setAlertForm({ ...alertForm, message: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Priority</label>
                                    <div className="flex bg-slate-50 p-1 rounded-xl">
                                        <button
                                            onClick={() => setAlertForm({ ...alertForm, type: 'normal' })}
                                            className={`flex-1 h-8 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${alertForm.type === 'normal' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}
                                        >Normal</button>
                                        <button
                                            onClick={() => setAlertForm({ ...alertForm, type: 'urgent' })}
                                            className={`flex-1 h-8 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${alertForm.type === 'urgent' ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' : 'text-slate-400'}`}
                                        >Urgent</button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Action Type</label>
                                    <select
                                        className="w-full h-11 bg-slate-50 border-none rounded-xl px-4 text-xs font-bold text-slate-600"
                                        value={alertForm.category}
                                        onChange={(e) => setAlertForm({ ...alertForm, category: e.target.value as any })}
                                    >
                                        <option value="general">General Broadcast</option>
                                        <option value="exam">Examination Updates</option>
                                        <option value="fee">Fee Payments</option>
                                        <option value="timetable">Schedule Changes</option>
                                        <option value="attendance">Attendance Policy</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-slate-50">
                            <Button
                                variant="ghost"
                                className="flex-1 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400"
                                onClick={() => setIsPostingAlert(false)}
                            >
                                Discard
                            </Button>
                            <Button
                                className="flex-[2] h-12 rounded-2xl bg-gradient-to-r from-primary to-indigo-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20"
                                onClick={handlePostAlert}
                            >
                                Confirm & Broadcast
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
        </div>
    );
}
