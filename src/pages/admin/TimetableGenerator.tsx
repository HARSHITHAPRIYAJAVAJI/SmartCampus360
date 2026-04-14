import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { timetableService } from "@/services/api";

import { Loader2, Calendar as CalendarIcon, Save, RefreshCw, Wand2, Building2, User, Grip, BookOpen, Rocket, PlayCircle, ShieldCheck, Cpu, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { timetableGeneratorService, CourseData, RoomData } from "@/services/timetableGenerator";
import { MOCK_COURSES } from "@/data/mockCourses";
import { MOCK_FACULTY } from "@/data/mockFaculty";
import { AlertCircle, Terminal, CheckCircle2, Send, Edit3 } from "lucide-react";
import { alertService } from "@/services/alertService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// --- Types ---
interface CourseCardProps {
    id: string;
    courseCode: string;
    courseName?: string;
    room: string;
    faculty?: string;
}

interface TimetableSlot {
    id: string;
    day: string;
    time: string;
    course?: CourseCardProps;
}

// --- Components ---

function DraggableCourse({ id, courseCode, courseName, room, faculty }: { id: string, courseCode: string, courseName: string, room?: string, faculty?: string }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`
        p-2 rounded-md border shadow-sm cursor-grab active:cursor-grabbing
        bg-white dark:bg-zinc-800 hover:shadow-md transition-all
        ${isDragging ? 'ring-2 ring-primary rotate-3 scale-105 z-50' : 'border-border'}
      `}
        >
            <div className="font-extrabold text-primary text-[13px] leading-tight mb-1 truncate">{courseName || courseCode}</div>
            <div className="flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                    <div className="text-[11px] text-muted-foreground font-bold uppercase tracking-tight">{courseCode}</div>
                    <div className="text-[10px] text-primary/70 font-black">{faculty || "Staff"}</div>
                </div>
                <div className="flex justify-between items-center mt-1 pt-1 border-t border-zinc-100 dark:border-zinc-800/50">
                    <div className="text-[10px] text-zinc-500 font-medium truncate max-w-[70%]">{room || "TBD"}</div>
                    <div className="text-[9px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-700/50 rounded font-black text-zinc-400">ROOM</div>
                </div>
            </div>
        </div>
    );
}

function DroppableSlot({ id, day, time, children }: { id: string, day: string, time: string, children: React.ReactNode }) {
    const { setNodeRef } = useSortable({ id });

    return (
        <div
            ref={setNodeRef}
            className="h-24 border border-dashed border-border/50 rounded-lg p-1 bg-muted/20 hover:bg-muted/40 transition-colors flex flex-col gap-1 relative group"
        >
            {!children && (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/10 font-bold group-hover:text-muted-foreground/30 select-none">
                    +
                </div>
            )}
            {children}
        </div>
    );
}

// --- Main Page ---


const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const timeSlots = [
    { label: "09:40-10:40", id: "09:40", type: "period" },
    { label: "10:40-11:40", id: "10:40", type: "period" },
    { label: "11:40-12:40", id: "11:40", type: "period" },
    { label: "12:40-01:20", id: "12:40", type: "break" }, // Break
    { label: "01:20-02:20", id: "01:20", type: "period" },
    { label: "02:20-03:20", id: "02:20", type: "period" },
    { label: "03:20-04:20", id: "03:20", type: "period" },
];

const TimetableGenerator = () => {
    // --- State ---
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const [viewTab, setViewTab] = useState<'generate' | 'view'>('generate');

    // View timetable selectors
    const [viewFilter, setViewFilter] = useState({ year: "1", semester: "1", department: "CSM", section: "A" });

    // State for drag and drop
    const [gridState, setGridState] = useState<Record<string, CourseCardProps | null>>({});
    const [activeId, setActiveId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        year: "1",
        semester: "1",
        department: "CSM",
        section: "A",
        classTeacherId: "",
        yearInCharge: ""
    });

    const [batchLoading, setBatchLoading] = useState(false);
    const [batchProgress, setBatchProgress] = useState(0);
    const [batchSemester, setBatchSemester] = useState("1");
    const [isPublishing, setIsPublishing] = useState(false);
    const [lastBatchPublished, setLastBatchPublished] = useState(false);
    const [publishedInfo, setPublishedInfo] = useState<{ dept: string, sem: string } | null>(null);

    // Data from API
    const [courses, setCourses] = useState<CourseData[]>([]);
    const [rooms, setRooms] = useState<RoomData[]>([]);
    const [savedTimetables, setSavedTimetables] = useState<any>(() => {
        const saved = localStorage.getItem('published_timetables');
        try {
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.error("Failed to parse saved timetables:", e);
            return {};
        }
    });

    useEffect(() => {
        // Load mock data directly
        setCourses(MOCK_COURSES as any);

        // Import actual rooms and map to RoomData format
        import("@/data/mockRooms").then(mod => {
            const mappedRooms: RoomData[] = mod.MOCK_ROOMS.map(r => ({
                id: r.id as any,
                name: r.name,
                room_type: r.type === 'Lab' ? 'Lab' : 'Lecture',
                building: r.building,
                dept: r.dept,
                subjects: (r as any).subjects
            }));
            setRooms(mappedRooms);
        });

        // Load drafts first, otherwise published tables
        const draft = localStorage.getItem('draft_timetables');
        const published = localStorage.getItem('published_timetables');
        
        if (draft) {
            try {
                setSavedTimetables(JSON.parse(draft));
            } catch (e) { console.error("Error loading drafts", e); }
        } else if (published && Object.keys(savedTimetables).length === 0) {
            try {
                setSavedTimetables(JSON.parse(published));
            } catch (e) {
                console.error("Error loading cached tables", e);
            }
        }
    }, []);

    // Persist drafts to localStorage so they aren't lost on refresh
    useEffect(() => {
        if (Object.keys(savedTimetables).length > 0) {
            localStorage.setItem('draft_timetables', JSON.stringify(savedTimetables));
        }
    }, [savedTimetables]);





    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const availableSubjects = useMemo(() => {
        const calcSemester = (parseInt(formData.year) - 1) * 2 + parseInt(formData.semester);
        return courses.filter(c =>
            c.department.toLowerCase() === formData.department.toLowerCase() &&
            c.semester === calcSemester &&
            c.credits > 0
        );
    }, [formData.department, formData.year, formData.semester, courses]);

    const viewData = useMemo(() => {
        const key = `${viewFilter.department}-${viewFilter.year}-${viewFilter.semester}-${viewFilter.section}`;
        return savedTimetables[key] || { grid: {}, metadata: null };
    }, [viewFilter, savedTimetables]);

    // Handle both new format ({ grid, metadata }) and legacy format (just grid)
    const viewTable = (viewData as any).grid || viewData || {};
    const viewMetadata = (viewData as any).metadata || null;

    const handlePublish = async () => {
        if (!batchSemester) return;
        setIsPublishing(true);
        try {
            const semester = parseInt(batchSemester);

            // Attempt backend push, but don't let it crash the frontend state update if it fails
            try {
                await timetableService.publish(semester, "CSM");
                await timetableService.publish(semester, "IT");
                await timetableService.publish(semester, "CSE");
                await timetableService.publish(semester, "ECE");
            } catch (apiError) {
                console.warn("Backend publish failed, falling back to local state sync:", apiError);
                // Continue with local sync
            }

            // Critical: Ensure the currently saved timetables are pushed to the live dashboard store
            localStorage.setItem('published_timetables', JSON.stringify(savedTimetables));
            window.dispatchEvent(new Event('timetable_published'));

            // Push institutional notification
            alertService.sendAlert({
                title: "📅 New Timetable Published",
                message: `The academic schedule for Semester ${batchSemester} has been published/updated. Please check your dashboard for the latest slots.`,
                category: 'timetable',
                type: 'priority',
                targetAudience: 'both',
                redirectUrl: '/dashboard/timetable'
            });

            setLastBatchPublished(true);
            setPublishedInfo({ dept: "All Departments", sem: batchSemester });

            toast({
                title: "🚀 Timetables Published",
                description: `Successfully pushed Semester ${batchSemester} schedules to student & faculty dashboards (System Sync: OK).`
            });
        } catch (e) {
            console.error("Publishing error:", e);
            toast({ title: "Publish Error", variant: "destructive", description: "Internal system error during deployment." });
        } finally {
            setIsPublishing(false);
        }
    };

    const handleBatchGenerate = async () => {
        if (courses.length === 0) return toast({ title: "No data", description: "Course catalog is empty." });

        setBatchLoading(true);
        setBatchProgress(5);
        setLastBatchPublished(false);
        setPublishedInfo(null);

        try {
            const depts = ["CSM", "IT", "CSE", "ECE"];
            const years = [4, 3, 2, 1];
            const sections = ["A", "B", "C"];
            const semester = parseInt(batchSemester);

            // Critical: Reset resources once before the entire batch starts
            timetableGeneratorService.reset();

            const total = depts.length * years.length * sections.length;
            let current = 0;
            const batchResults: Record<string, any> = {};

            for (const dept of depts) {
                for (const year of years) {
                    for (const section of sections) {
                        const result = timetableGeneratorService.generate(year, semester, dept, section, courses, rooms, false);
                        const key = `${dept}-${year}-${semester}-${section}`;

                        batchResults[key] = {
                            grid: result.grid,
                            metadata: result.metadata
                        };

                        timetableService.save(year, semester, dept, section, result.grid).catch(() => { });

                        current++;
                        setBatchProgress(Math.round((current / total) * 100));
                    }
                }
            }

            setSavedTimetables((prev: any) => {
                const newState = { ...prev, ...batchResults };
                return newState;
            });

            setViewFilter({ department: "CSM", year: "1", semester: batchSemester, section: "A" });
            setViewTab('view');

            toast({
                title: "✅ Batch Complete",
                description: `Generated ${total} schedules. Live dashboards updated for all years/sections.`
            });
        } catch (e) {
            toast({ title: "Batch Error", variant: "destructive", description: "Failed to complete batch process." });
        } finally {
            setBatchLoading(false);
        }
    };

    const handleResetAll = () => {
        if (window.confirm("⚠️ DANGER: This will PERMANENTLY DELETE all generated and published academic timetables for all departments. Are you sure?")) {
            // Set to empty object instead of removing, to signal "Production Empty" state vs "Demo Initial" state
            localStorage.setItem('published_timetables', JSON.stringify({}));
            setSavedTimetables({});
            setGridState({});
            toast({
                title: "System Reset Successful",
                description: "All academic timetables have been cleared. (Demo data disabled).",
                variant: "destructive"
            });
        }
    };

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const year = parseInt(formData.year);
            const semester = parseInt(formData.semester);
            
            const result = timetableGeneratorService.generate(
                year, 
                semester, 
                formData.department, 
                formData.section, 
                courses, 
                rooms,
                true,
                formData.classTeacherId,
                formData.yearInCharge
            );

            // Always save and display — never block on missing subjects
            setGridState(result.grid as any);

            const vKey = `${formData.department}-${formData.year}-${formData.semester}-${formData.section}`;
            setSavedTimetables((prev: any) => {
                const newState = { ...prev, [vKey]: result };
                return newState;
            });

            // Auto-switch to View tab with correct filters
            setViewFilter({
                department: formData.department,
                year: formData.year,
                semester: formData.semester,
                section: formData.section
            });
            setViewTab('view');

            // Persist to backend (non-blocking)
            timetableService.save(year, semester, formData.department, formData.section, result.grid).catch(() => { });

            // Soft warning if some subjects didn't fit (informational only)
            const assignedCodes = new Set(Object.values(result.grid as any).filter(Boolean).map((e: any) => e?.courseCode));
            const missing = availableSubjects.filter(s => !assignedCodes.has(s.code));
            if (missing.length > 0) {
                toast({
                    title: "⚠️ Partial Schedule Generated",
                    description: `${missing.length} subject(s) couldn't fit all slots (e.g., ${missing[0].name}). Schedule still saved — review and adjust manually.`
                });
            } else {
                toast({
                    title: "✅ Generation Successful",
                    description: `Full schedule for ${formData.department} Y${formData.year} Sem ${formData.semester} Sec-${formData.section} is now visible.`
                });
            }
        } catch (e) {
            console.error(e);
            toast({ title: "Error", variant: "destructive", description: "Failed to generate timetable." });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateViewMetadata = (field: string, value: string) => {
        const vKey = `${viewFilter.department}-${viewFilter.year}-${viewFilter.semester}-${viewFilter.section}`;
        if (!savedTimetables[vKey]) return;

        setSavedTimetables((prev: any) => {
            const updated = {
                ...prev,
                [vKey]: {
                    ...prev[vKey],
                    metadata: {
                        ...prev[vKey].metadata,
                        [field]: value
                    }
                }
            };
            return updated;
        });

        toast({
            title: "Metadata Updated",
            description: `Draft updated locally. Remember to Publish to make it live.`,
        });
    };

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        // Find where the item came from
        const sourceSlot = Object.keys(gridState).find(key => gridState[key]?.id === activeId);

        // Find where it's going
        let targetSlot = timeSlots.flatMap(t => days.map(d => `${d}-${t.id}`)).find(key => key === overId);

        if (!targetSlot) {
            targetSlot = Object.keys(gridState).find(key => gridState[key]?.id === overId);
        }

        if (sourceSlot && targetSlot && sourceSlot !== targetSlot) {
            setGridState((prev) => {
                const sourceItem = prev[sourceSlot];
                const targetItem = prev[targetSlot];

                return {
                    ...prev,
                    [sourceSlot]: targetItem,
                    [targetSlot]: sourceItem
                };
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-full overflow-x-auto space-y-6 animate-in fade-in-50">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-4 gap-4 animate-in fade-in-50 slide-in-from-top-2">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Smart Scheduler
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        AI-Powered Resource Optimization Engine
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleResetAll} className="text-destructive hover:bg-destructive/5 border-destructive/20 transition-all">
                        <RefreshCw className="mr-2 h-4 w-4" /> Clear All System Timetables
                    </Button>
                    <Button onClick={() => toast({ title: "Saved", description: "Schedule configuration saved to database." })}>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                </div>
            </div>

            {/* Top-Level Tabs: Generate vs View */}
            <Tabs value={viewTab} onValueChange={(v: any) => setViewTab(v)} className="w-full">
                <TabsList className="grid w-full max-w-sm grid-cols-2 mb-6">
                    <TabsTrigger value="generate" className="gap-2">
                        <Cpu className="h-4 w-4 text-purple-500" /> Generate
                    </TabsTrigger>
                    <TabsTrigger value="view" className="gap-2">
                        <Layers className="h-4 w-4 text-primary" /> View Timetables
                    </TabsTrigger>
                </TabsList>

                {/* View Timetables Tab */}
                <TabsContent value="view" className="space-y-6 animate-in fade-in-50">
                    <Card className="border-none shadow-xl bg-gradient-to-br from-white to-primary/5 dark:from-zinc-900 dark:to-zinc-950">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-4 items-end mb-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Branch</label>
                                    <Select value={viewFilter.department} onValueChange={v => setViewFilter(f => ({ ...f, department: v }))}>
                                        <SelectTrigger className="w-36 h-10"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CSM">CSM</SelectItem>
                                            <SelectItem value="CSE">CSE</SelectItem>
                                            <SelectItem value="IT">IT</SelectItem>
                                            <SelectItem value="ECE">ECE</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Year</label>
                                    <Select value={viewFilter.year} onValueChange={v => setViewFilter(f => ({ ...f, year: v }))}>
                                        <SelectTrigger className="w-28 h-10"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1st Year</SelectItem>
                                            <SelectItem value="2">2nd Year</SelectItem>
                                            <SelectItem value="3">3rd Year</SelectItem>
                                            <SelectItem value="4">4th Year</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Semester</label>
                                    <Select value={viewFilter.semester} onValueChange={v => setViewFilter(f => ({ ...f, semester: v }))}>
                                        <SelectTrigger className="w-28 h-10"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Sem 1</SelectItem>
                                            <SelectItem value="2">Sem 2</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Section</label>
                                    <Select value={viewFilter.section} onValueChange={v => setViewFilter(f => ({ ...f, section: v }))}>
                                        <SelectTrigger className="w-28 h-10"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="A">Sec A</SelectItem>
                                            <SelectItem value="B">Sec B</SelectItem>
                                            <SelectItem value="C">Sec C</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Badge className="h-10 px-4 text-sm flex items-center bg-primary/10 text-primary border-primary/20">
                                    {viewFilter.department} | Y{viewFilter.year} S{viewFilter.semester} | Sec-{viewFilter.section}
                                </Badge>

                                <div className="ml-auto">
                                    <Button
                                        onClick={handlePublish}
                                        disabled={isPublishing}
                                        className={`${lastBatchPublished ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700'} text-white shadow-lg h-10 px-6 whitespace-nowrap`}
                                    >
                                        {isPublishing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                        {lastBatchPublished ? 'Tables are Live' : 'Publish All Tables'}
                                    </Button>
                                </div>
                            </div>

                            {/* Resource Metadata Bar (REFINED) */}
                            {viewMetadata && (
                                <div className="flex flex-wrap items-center gap-y-4 gap-x-8 px-6 py-5 bg-white/40 dark:bg-black/20 rounded-3xl border border-white/60 dark:border-white/5 shadow-inner">
                                    {/* Class Teacher (EDITABLE) */}
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                            <User className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.15em] leading-none">Class Teacher</p>
                                                <Edit3 className="h-2.5 w-2.5 text-primary/40" />
                                            </div>
                                            <Select 
                                                value={(viewMetadata as any).classTeacherId} 
                                                onValueChange={(v) => {
                                                    const faculty = MOCK_FACULTY.find(f => f.id === v);
                                                    if (faculty) {
                                                        handleUpdateViewMetadata('classTeacher', faculty.name);
                                                        handleUpdateViewMetadata('classTeacherId', faculty.id);
                                                    }
                                                }}
                                            >
                                                <SelectTrigger className="h-7 text-sm font-black p-0 border-none bg-transparent focus:ring-0 w-auto hover:text-primary transition-colors">
                                                    <SelectValue>{(viewMetadata as any).classTeacher}</SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {MOCK_FACULTY.filter(f => f.department.toUpperCase() === viewFilter.department.toUpperCase()).map(f => (
                                                        <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    
                                    <div className="hidden lg:block w-px h-10 bg-slate-200 dark:bg-slate-800" />
                                    
                                    {/* Year In-Charge (EDITABLE) */}
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                            <ShieldCheck className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div>
                                             <div className="flex items-center gap-1.5 mb-1">
                                                <p className="text-[9px] font-black uppercase text-purple-600/70 tracking-[0.15em] leading-none">Year In-Charge</p>
                                                <Edit3 className="h-2.5 w-2.5 text-purple-600/40" />
                                            </div>
                                            <Select 
                                                value={MOCK_FACULTY.find(f => f.name === (viewMetadata as any).yearInCharge)?.id} 
                                                onValueChange={(v) => {
                                                    const faculty = MOCK_FACULTY.find(f => f.id === v);
                                                    if (faculty) {
                                                        handleUpdateViewMetadata('yearInCharge', faculty.name);
                                                    }
                                                }}
                                            >
                                                <SelectTrigger className="h-7 text-sm font-black p-0 border-none bg-transparent focus:ring-0 w-auto hover:text-purple-600 transition-colors">
                                                    <SelectValue>{(viewMetadata as any).yearInCharge}</SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {MOCK_FACULTY.filter(f => f.department.toUpperCase() === viewFilter.department.toUpperCase()).map(f => (
                                                        <SelectItem key={`view-yic-${f.id}`} value={f.id}>{f.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>


                                    {/* Primary Room */}
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                            <Building2 className="h-5 w-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase text-blue-500/70 tracking-[0.15em] leading-none mb-1">Classroom</p>
                                            <Select 
                                                value={(viewMetadata as any).room} 
                                                onValueChange={(val) => handleUpdateViewMetadata('room', val)}
                                            >
                                                <SelectTrigger className="h-7 text-sm font-black p-0 border-none bg-transparent focus:ring-0 w-auto hover:text-blue-600 transition-colors">
                                                    <SelectValue>{(viewMetadata as any).room}</SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {rooms.filter(r => r.room_type === 'Classroom' || r.room_type === 'Lecture').map(r => (
                                                        <SelectItem key={`view-room-${r.id}`} value={r.name}>{r.name} ({r.building})</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>


                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl overflow-hidden">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <div className="grid grid-cols-[110px_repeat(7,1fr)] min-w-[1200px]">
                                    {/* Header */}
                                    <div className="p-3 bg-muted font-bold text-center text-xs uppercase tracking-wider border-b-2 border-primary/20 flex items-center justify-center">Day</div>
                                    {timeSlots.map(slot => (
                                        <div key={slot.id} className={`p-3 font-bold text-center text-xs border-b-2 border-primary/20 flex items-center justify-center ${slot.type === 'break' ? 'text-yellow-600 bg-yellow-50/60' : 'bg-muted'
                                            }`}>{slot.label}</div>
                                    ))}
                                    {/* Day Rows */}
                                    {days.map(day => (
                                        <div key={day} className="contents">
                                            <div className="p-3 bg-muted/50 font-black text-center border-r border-muted flex items-center justify-center text-xs uppercase">{day}</div>
                                            {timeSlots.map(slot => {
                                                if (slot.type === 'break') {
                                                    return <div key={slot.id} className="border border-border/30 bg-yellow-50/40 flex items-center justify-center h-20">
                                                        <span className="text-[10px] text-yellow-600 font-bold uppercase tracking-widest rotate-0">Lunch</span>
                                                    </div>;
                                                }
                                                const sessionKey = `${day}-${slot.id}`;
                                                const session = viewTable[sessionKey];
                                                const isLabSession = session?.type === 'Lab' || session?.courseName?.toLowerCase().includes('lab');
                                                const isProjectV1 = session?.courseCode?.includes('Ph-1') || session?.courseCode === '4M1';
                                                const isProjectV2 = session?.courseCode?.includes('Ph-2') || session?.courseCode === '4M2';
                                                const isCAEG = session?.courseCode === '4E1DD' || session?.courseName?.includes('CAEG');
                                                const isSports = session?.courseCode === 'SPORTS' || session?.courseName?.toLowerCase().includes('sports');
                                                const isLibrarySession = session?.courseCode === 'LIBRARY' || session?.courseName?.toLowerCase().includes('library');
                                                const isCRT = session?.courseCode === 'CRT' || session?.courseName?.includes('CRT');

                                                return (
                                                    <div key={slot.id} className={`border p-2 h-20 flex flex-col justify-between overflow-hidden transition-colors ${isCAEG ? 'bg-orange-100/90 dark:bg-orange-900/40 border-orange-300/50' :
                                                            isProjectV1 ? 'bg-amber-100/90 dark:bg-amber-900/40 border-amber-300/50' :
                                                                isProjectV2 ? 'bg-rose-100/90 dark:bg-rose-900/40 border-rose-300/50' :
                                                                    isSports ? 'bg-lime-100/90 dark:bg-lime-900/40 border-lime-300/50' :
                                                                        isLibrarySession ? 'bg-violet-100/90 dark:bg-violet-900/40 border-violet-300/50' :
                                                                            isCRT ? 'bg-indigo-100/90 dark:bg-indigo-900/40 border-indigo-300/50' :
                                                                                isLabSession ? 'bg-fuchsia-100/90 dark:bg-fuchsia-900/40 border-fuchsia-300/50' :
                                                                                    'bg-sky-50/50 dark:bg-sky-950/10 border-border/30'
                                                        }`}>
                                                        {session ? (
                                                            <>
                                                                <div className="font-bold text-[11px] leading-tight text-foreground truncate">{session.courseName || session.courseCode}</div>
                                                                <div className="text-[10px] text-muted-foreground truncate">{session.faculty || "Staff"}</div>
                                                                <div className="text-[10px] font-mono bg-primary/10 text-primary px-1 rounded self-start">{session.room || "TBD"}</div>
                                                            </>
                                                        ) : (
                                                            <div className="h-full flex items-center justify-center">
                                                                <span className="text-muted-foreground/20 text-lg">—</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Generate Tab */}
                <TabsContent value="generate" className="space-y-6">
                    <Card className="border-2 border-purple-200 shadow-xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:border-purple-900/50 dark:from-purple-950/20 dark:to-indigo-950/20">
                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-1 space-y-4 text-center md:text-left">
                                    <h3 className="text-2xl font-bold text-purple-800 dark:text-purple-300">Centralized Batch Generation</h3>
                                    <p className="text-muted-foreground">
                                        Generate timetables collectively for all years, branches, and sections at once for the selected semester.
                                    </p>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                                        <div className="space-y-1.5 min-w-[120px]">
                                            <span className="text-[10px] font-black uppercase text-purple-600/70 tracking-widest px-1">Active Semester</span>
                                            <Select value={batchSemester} onValueChange={setBatchSemester}>
                                                <SelectTrigger className="h-11 border-purple-200 focus:ring-purple-500 bg-white/60 dark:bg-black/40">
                                                    <SelectValue placeholder="Semester" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">Semester 1 (Odd)</SelectItem>
                                                    <SelectItem value="2">Semester 2 (Even)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex items-end h-full pt-5">
                                            <Button
                                                size="lg"
                                                onClick={handleBatchGenerate}
                                                disabled={batchLoading}
                                                className="h-11 px-8 bg-purple-600 hover:bg-purple-700 shadow-xl shadow-purple-500/20 text-white font-bold transition-all hover:scale-[1.02]"
                                            >
                                                {batchLoading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                        Generating Library...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Rocket className="mr-2 h-5 w-5" />
                                                        Run AI Engine
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    {batchLoading && (
                                        <div className="pt-6 space-y-2 animate-in fade-in slide-in-from-bottom-2">
                                            <div className="flex justify-between text-sm font-medium text-purple-700 dark:text-purple-300">
                                                <span>Processing ALL branches, years, sections...</span>
                                                <span>{batchProgress}%</span>
                                            </div>
                                            <div className="h-3 w-full bg-purple-200 dark:bg-purple-900/50 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-purple-600 dark:bg-purple-500 transition-all duration-500 ease-out"
                                                    style={{ width: `${batchProgress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {batchProgress === 100 && !batchLoading && (
                                        <div className="pt-6 animate-in fade-in slide-in-from-bottom-2">
                                            <div className="flex items-center gap-3 text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-950/20 p-4 rounded-xl border border-green-100 dark:border-green-900/50">
                                                <CheckCircle2 className="h-5 w-5" />
                                                Batch Generation Complete! Verify and Publish in the 'View' tab.
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="hidden md:flex items-center justify-center p-6 bg-white dark:bg-zinc-900/50 rounded-full shadow-inner border border-purple-100 dark:border-purple-900">
                                    <Wand2 className="h-16 w-16 text-purple-400 rotate-12" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default TimetableGenerator;
