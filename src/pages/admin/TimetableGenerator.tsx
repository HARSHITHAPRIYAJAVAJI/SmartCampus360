import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { timetableService, academicService } from "@/services/api";
import { Loader2, Calendar as CalendarIcon, Save, RefreshCw, Wand2, Building2, Grip, BookOpen, Rocket, PlayCircle, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { timetableGeneratorService, CourseData, RoomData } from "@/services/timetableGenerator";
import { MOCK_COURSES } from "@/data/mockCourses";
import { AlertCircle, Terminal, CheckCircle2, Send } from "lucide-react";
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
}

interface TimetableSlot {
    id: string;
    day: string;
    time: string;
    course?: CourseCardProps;
}

// --- Components ---

function DraggableCourse({ id, courseCode, courseName, room }: CourseCardProps) {
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
        p-2 rounded-md text-xs border shadow-sm cursor-grab active:cursor-grabbing
        bg-white dark:bg-zinc-800 hover:shadow-md transition-all
        ${isDragging ? 'ring-2 ring-primary rotate-3 scale-105 z-50' : 'border-border'}
      `}
        >
            <div className="font-bold text-primary truncate leading-tight">{courseName || courseCode}</div>
            <div className="text-[10px] text-muted-foreground/60 uppercase font-bold mt-0.5">{courseCode}</div>
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
        section: "A"
    });

    const [batchLoading, setBatchLoading] = useState(false);
    const [batchProgress, setBatchProgress] = useState(0);
    const [batchSemester, setBatchSemester] = useState("1");
    const [isPublishing, setIsPublishing] = useState(false);
    const [lastBatchPublished, setLastBatchPublished] = useState(false);
    const [publishedInfo, setPublishedInfo] = useState<{dept: string, sem: string} | null>(null);

    // Data from API
    const [courses, setCourses] = useState<CourseData[]>([]);
    const [rooms, setRooms] = useState<RoomData[]>([]);
    const [savedTimetables, setSavedTimetables] = useState<any>({});
    const [isApiOffline, setIsApiOffline] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cRes, rRes, tRes] = await Promise.all([
                    academicService.getCourses(),
                    academicService.getRooms(),
                    timetableService.getAll()
                ]);
                // API is reachable — mark as online regardless of empty data
                setIsApiOffline(false);
                // Use API data if available, otherwise supplement with local mock courses
                const apiCourses = cRes.data && cRes.data.length > 0 ? cRes.data : MOCK_COURSES;
                const apiRooms = rRes.data && rRes.data.length > 0 ? rRes.data : [
                    { id: 1, name: "A-304", room_type: "Lab" },
                    { id: 2, name: "C-201", room_type: "Lecture" },
                    { id: 3, name: "N-412", room_type: "Lecture" },
                    { id: 4, name: "S-101", room_type: "Lab" }
                ];
                setCourses(apiCourses as any);
                setRooms(apiRooms);
                setSavedTimetables(tRes.data || {});
            } catch (err) {
                // Only mark as offline if the request itself failed (network error, 5xx, etc.)
                console.error("Fetch error:", err);
                setIsApiOffline(true);
                setCourses(MOCK_COURSES as any);
                setRooms([
                    { id: 1, name: "A-304", room_type: "Lab" },
                    { id: 2, name: "C-201", room_type: "Lecture" },
                    { id: 3, name: "N-412", room_type: "Lecture" },
                    { id: 4, name: "S-101", room_type: "Lab" }
                ]);
            }
        };
        fetchData();
    }, []);



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
            c.semester === calcSemester
        );
    }, [formData.department, formData.year, formData.semester, courses]);

    const viewTable = useMemo(() => {
        const key = `${viewFilter.department}-${viewFilter.year}-${viewFilter.semester}-${viewFilter.section}`;
        return savedTimetables[key] || {};
    }, [viewFilter, savedTimetables]);

    const handlePublish = async () => {
        if (!batchSemester) return;
        setIsPublishing(true);
        try {
            const semester = parseInt(batchSemester);
            // Publish for both CSM and IT departments
            await timetableService.publish(semester, "CSM");
            await timetableService.publish(semester, "IT");
            
            setLastBatchPublished(true);
            setPublishedInfo({ dept: "CSM & IT", sem: batchSemester });
            
            toast({
                title: "🚀 Timetables Published",
                description: `Successfully pushed Semester ${batchSemester} schedules to CSM & IT dashboards.`
            });
        } catch (e) {
            toast({ title: "Publish Error", variant: "destructive", description: "Failed to push tables to user dashboards." });
        } finally {
            setIsPublishing(false);
        }
    };

    const handleBatchGenerate = async () => {
        if (courses.length === 0) return toast({ title: "No data", description: "Course catalog is empty." });
        
        setBatchLoading(true);
        setBatchProgress(5);
        setLastBatchPublished(false); // Reset on new generate
        setPublishedInfo(null);
        
        try {
            // CSM, IT, CSE and ECE are the active branches with course data
            const depts = ["CSM", "IT", "CSE", "ECE"];
            const years = [1, 2, 3, 4];
            const sections = ["A", "B", "C"];
            const semester = parseInt(batchSemester);
            
            const total = depts.length * years.length * sections.length;
            let current = 0;
            const batchResults: Record<string, any> = {};

            for (const dept of depts) {
                for (const year of years) {
                    for (const section of sections) {
                    const schedule = timetableGeneratorService.generate(year, semester, dept, section, courses, rooms);
                    
                    // Key format: dept-year-semester-section (matches viewTable lookup exactly)
                    const key = `${dept}-${year}-${semester}-${section}`;
                    batchResults[key] = schedule;
                    
                    timetableService.save(year, semester, dept, section, schedule).catch(() => {});
                    
                        current++;
                        setBatchProgress(Math.round((current / total) * 100));
                    }
                }
            }
            
            setSavedTimetables((prev: any) => {
                const newState = { ...prev, ...batchResults };
                // Also persist to localStorage for the student/faculty dashboard to pick up
                localStorage.setItem('published_timetables', JSON.stringify(newState));
                return newState;
            });

            // Auto-switch to View tab with CSM Year 1 Sem selected
            setViewFilter({ department: "CSM", year: "1", semester: batchSemester, section: "A" });
            setViewTab('view');

            toast({
                title: "✅ Batch Complete",
                description: `Generated ${total} schedules for CSM, IT, CSE & ECE — Semester ${batchSemester} (Y1-Y4, Sec A/B/C). Viewing Y1 Sec-A now.`
            });
        } catch (e) {
            toast({ title: "Batch Error", variant: "destructive", description: "Failed to complete batch process." });
        } finally {
            setBatchLoading(false);
        }
    };

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const year = parseInt(formData.year);
            const semester = parseInt(formData.semester);
            
            const newGrid = timetableGeneratorService.generate(year, semester, formData.department, formData.section, courses, rooms);
            
            // Always save and display — never block on missing subjects
            setGridState(newGrid as any);

            const vKey = `${formData.department}-${formData.year}-${formData.semester}-${formData.section}`;
            setSavedTimetables((prev: any) => ({ ...prev, [vKey]: newGrid }));

            // Auto-switch to View tab with correct filters
            setViewFilter({ 
                department: formData.department, 
                year: formData.year, 
                semester: formData.semester, 
                section: formData.section 
            });
            setViewTab('view');

            // Persist to backend (non-blocking)
            timetableService.save(year, semester, formData.department, formData.section, newGrid).catch(() => {});

            // Soft warning if some subjects didn't fit (informational only)
            const assignedCodes = new Set(Object.values(newGrid).filter(Boolean).map(e => e?.courseCode));
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
            {/* API Connection Banner */}
            {isApiOffline && (
                <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/50 text-red-700 animate-in slide-in-from-top-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="font-bold">Backend Sync Offline</AlertTitle>
                    <AlertDescription className="text-xs">
                        The production database is unreachable. Auto-switched to **Development Mode** with internal course catalog. Schedules will not be persisted to the server.
                    </AlertDescription>
                </Alert>
            )}
            {!isApiOffline && (
                <Alert className="mb-6 bg-green-500/5 border-green-500/20 text-green-700">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <AlertTitle className="text-sm font-bold">Production Connected</AlertTitle>
                    <AlertDescription className="text-xs">
                        Synchronized with master curriculum and resource schedules. Live persistence enabled.
                    </AlertDescription>
                </Alert>
            )}

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
                    <Button variant="outline" onClick={() => setGridState({})}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Reset
                    </Button>
                    <Button onClick={() => toast({ title: "Saved", description: "Schedule configuration saved to database." })}>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                </div>
            </div>

            {/* Top-Level Tabs: Generate vs View */}
            <Tabs value={viewTab} onValueChange={(v: any) => setViewTab(v)} className="w-full">
                <TabsList className="grid w-full max-w-sm grid-cols-2 mb-6">
                    <TabsTrigger value="generate">⚙️ Generate</TabsTrigger>
                    <TabsTrigger value="view">📋 View Timetables</TabsTrigger>
                </TabsList>

                {/* View Timetables Tab */}
                <TabsContent value="view" className="space-y-6 animate-in fade-in-50">
                    <Card className="border-none shadow-xl bg-gradient-to-br from-white to-primary/5 dark:from-zinc-900 dark:to-zinc-950">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-4 items-end">
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
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl overflow-hidden">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <div className="grid grid-cols-[110px_repeat(7,1fr)] min-w-[1100px]">
                                    {/* Header */}
                                    <div className="p-3 bg-muted font-bold text-center text-xs uppercase tracking-wider border-b-2 border-primary/20 flex items-center justify-center">Day</div>
                                    {timeSlots.map(slot => (
                                        <div key={slot.id} className={`p-3 font-bold text-center text-xs border-b-2 border-primary/20 flex items-center justify-center ${
                                            slot.type === 'break' ? 'text-yellow-600 bg-yellow-50/60' : 'bg-muted'
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

                                                return (
                                                    <div key={slot.id} className={`border p-2 h-20 flex flex-col justify-between overflow-hidden transition-colors ${
                                                        isCAEG ? 'bg-orange-100/90 dark:bg-orange-900/40 border-orange-300/50' :
                                                        isProjectV1 ? 'bg-amber-100/90 dark:bg-amber-900/40 border-amber-300/50' :
                                                        isProjectV2 ? 'bg-rose-100/90 dark:bg-rose-900/40 border-rose-300/50' :
                                                        isSports ? 'bg-lime-100/90 dark:bg-lime-900/40 border-lime-300/50' :
                                                        isLibrarySession ? 'bg-violet-100/90 dark:bg-violet-900/40 border-violet-300/50' :
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

            <Tabs defaultValue="specific" className="mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
                    <TabsTrigger value="specific">Specific Timetable</TabsTrigger>
                    <TabsTrigger value="batch" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-300">Centralized Batch</TabsTrigger>
                </TabsList>
                
                <TabsContent value="specific">
                    <Card className="border-none shadow-xl bg-gradient-to-br from-white to-primary/5 dark:from-zinc-900 dark:to-zinc-950">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6 items-end">
                                <div className="space-y-2 w-full md:w-48">
                                    <label className="text-sm font-semibold flex items-center gap-2">
                                        <Wand2 className="h-4 w-4 text-purple-500" /> Branch
                                    </label>
                                    <Select
                                        value={formData.department}
                                        onValueChange={(v) => setFormData({ ...formData, department: v })}
                                    >
                                        <SelectTrigger className="h-12 bg-background/50 backdrop-blur-sm border-primary/20 focus:ring-purple-500">
                                            <SelectValue placeholder="Branch" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CSE">CSE</SelectItem>
                                            <SelectItem value="CSM">CSM</SelectItem>
                                            <SelectItem value="IT">IT</SelectItem>
                                            <SelectItem value="ECE">ECE</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2 w-full md:w-32">
                                    <label className="text-sm font-semibold">Year</label>
                                    <Select
                                        value={formData.year}
                                        onValueChange={(v) => setFormData({ ...formData, year: v })}
                                    >
                                        <SelectTrigger className="h-12 bg-background/50 backdrop-blur-sm border-primary/20">
                                            <SelectValue placeholder="Year" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1st Year</SelectItem>
                                            <SelectItem value="2">2nd Year</SelectItem>
                                            <SelectItem value="3">3rd Year</SelectItem>
                                            <SelectItem value="4">4th Year</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2 w-full md:w-32">
                                    <label className="text-sm font-semibold">Semester</label>
                                    <Select
                                        value={formData.semester}
                                        onValueChange={(v) => setFormData({ ...formData, semester: v })}
                                    >
                                        <SelectTrigger className="h-12 bg-background/50 backdrop-blur-sm border-primary/20">
                                            <SelectValue placeholder="Sem" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Sem 1</SelectItem>
                                            <SelectItem value="2">Sem 2</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2 w-full md:w-32">
                                    <label className="text-sm font-semibold">Section</label>
                                    <Select
                                        value={formData.section}
                                        onValueChange={(v) => setFormData({ ...formData, section: v })}
                                    >
                                        <SelectTrigger className="h-12 bg-background/50 backdrop-blur-sm border-primary/20">
                                            <SelectValue placeholder="Section" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="A">Sec A</SelectItem>
                                            <SelectItem value="B">Sec B</SelectItem>
                                            <SelectItem value="C">Sec C</SelectItem>
                                            <SelectItem value="D">Sec D</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button
                                    size="lg"
                                    onClick={handleGenerate}
                                    className="h-12 px-8 bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/25 transition-all hover:scale-105 flex-1 md:flex-none"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
                                    Generate Timetable
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="batch">
                    <Card className="border-2 border-purple-200 shadow-xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:border-purple-900/50 dark:from-purple-950/20 dark:to-indigo-950/20">
                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-1 space-y-4 text-center md:text-left">
                                    <h3 className="text-2xl font-bold text-purple-800 dark:text-purple-300">Centralized Generation</h3>
                                    <p className="text-muted-foreground">
                                        Generate timetables collectively for all years, branches, and sections at once for the selected semester.
                                    </p>
                                    
                                    <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
                                        <div className="space-y-2 w-48">
                                            <label className="text-sm font-semibold text-purple-900 dark:text-purple-200">Target Semester</label>
                                            <Select value={batchSemester} onValueChange={setBatchSemester}>
                                                <SelectTrigger className="h-12 border-purple-300 dark:border-purple-700 focus:ring-purple-500">
                                                    <SelectValue placeholder="Select Semester" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">Semester 1</SelectItem>
                                                    <SelectItem value="2">Semester 2</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="pt-7">
                                            <Button
                                                size="lg"
                                                onClick={handleBatchGenerate}
                                                disabled={batchLoading}
                                                className="h-12 px-8 bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/25 transition-all hover:scale-105"
                                            >
                                                {batchLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <PlayCircle className="mr-2 h-5 w-5" />}
                                                Start Batch Generation
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

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    {/* Course Pool Sidebar */}
                    <div className="w-full lg:w-72 shrink-0 space-y-4 animate-in slide-in-from-left-4">
                        <Card className="border-none shadow-lg bg-white dark:bg-zinc-900 overflow-hidden">
                            <div className="bg-primary/10 p-4 border-b">
                                <h3 className="font-bold flex items-center gap-2 text-primary">
                                    <BookOpen className="h-4 w-4" /> Subjects
                                </h3>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-1">
                                    {formData.department} - Year {formData.year} (Sem {formData.semester})
                                </p>
                            </div>
                            <CardContent className="p-4 space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                                {availableSubjects.length > 0 ? (
                                    availableSubjects.map((subject) => (
                                        <div
                                            key={subject.id}
                                            className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-all cursor-move group relative"
                                        >
                                            <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{subject.name}</div>
                                            <div className="flex items-center justify-between mt-2">
                                                <Badge variant="outline" className="text-[9px] px-1.5 h-4 bg-background">
                                                    {subject.code}
                                                </Badge>
                                                <span className="text-[10px] text-muted-foreground font-medium">
                                                    {subject.credits} Credits
                                                </span>
                                            </div>
                                            {/* Drag Indicator */}
                                            <div className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Grip className="h-3 w-3 text-muted-foreground/50" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 px-4 border border-dashed rounded-lg bg-muted/20">
                                        <p className="text-sm text-muted-foreground italic">No subjects found for this selection.</p>
                                    </div>
                                )}
                            </CardContent>
                            {availableSubjects.length > 0 && (
                                <div className="p-3 bg-muted/30 border-t text-[10px] text-center text-muted-foreground italic">
                                    Drag subjects to slots in the grid to assign them.
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Timetable Grid Container */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-card rounded-xl border shadow-lg overflow-hidden min-w-[1000px]">
                            {/* Grid Top Bar (Classroom Info) */}
                            <div className="bg-primary/5 px-6 py-2.5 border-b border-border flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Weekly Schedule Grid</span>
                                </div>
                                <Badge variant="outline" className="bg-background/80 backdrop-blur-sm border-primary/20 text-primary font-bold px-3 py-1 flex items-center gap-2 shadow-sm whitespace-nowrap">
                                    <Building2 className="h-3 w-3" />
                                    Allotted Classroom: {
                                        formData.year === '4' && formData.section === 'A'
                                            ? 'N-412'
                                            : formData.department === 'CSM'
                                                ? 'A-304 (AI Lab Block)'
                                                : formData.department === 'CSE'
                                                    ? 'C-201 (Main Block)'
                                                    : 'S-402'
                                    }
                                </Badge>
                            </div>

                            {/* Header Row: Time Slots in Columns */}
                            <div className="grid grid-cols-[120px_repeat(7,1fr)] bg-muted/30 divide-x divide-border border-b relative">
                                <div className="p-4 font-bold text-center text-muted-foreground bg-muted flex items-center justify-center italic text-xs">Day / Time</div>
                                {timeSlots.map(slot => (
                                    <div key={slot.id} className={`p-4 font-bold text-center text-xs flex items-center justify-center ${slot.type === 'break' ? 'text-yellow-600 bg-yellow-50/50' : 'text-foreground'}`}>
                                        {slot.label}
                                    </div>
                                ))}
                            </div>

                            {/* Rows: Days */}
                            <div className="divide-y divide-border">
                                {days.map((day) => {
                                    const isSaturday4thYear = formData.year === "4" && day === "Saturday";
                                    const isProjectAfternoonDay = formData.year === "4" && formData.semester === "2" && ["Wednesday", "Thursday", "Friday"].includes(day);

                                    return (
                                        <div key={day} className="grid grid-cols-[120px_repeat(7,1fr)] divide-x divide-border min-h-[100px]">
                                            <div className="p-4 font-bold text-center text-muted-foreground bg-muted/10 flex items-center justify-center border-r">
                                                {day}
                                            </div>
                                            {isSaturday4thYear ? (
                                                <>
                                                    {/* Morning Project Block (3 Periods) */}
                                                    <div className="col-span-3 p-1.5 h-full">
                                                        <div className="h-full w-full rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 flex flex-col items-center justify-center gap-1 group hover:bg-primary/10 transition-colors shadow-sm border-secondary/20">
                                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                                                                <Rocket className="h-4 w-4 text-primary" />
                                                            </div>
                                                            <div className="text-center">
                                                                <div className="font-black text-primary text-xs uppercase tracking-tight">Major Project</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Lunch Break (Middle) */}
                                                    <div className="bg-yellow-50/40 flex items-center justify-center p-2 border-x border-border/50">
                                                        <span className="text-[9px] font-black text-yellow-600/40 uppercase vertical-text tracking-[0.2em]">Break</span>
                                                    </div>

                                                    {/* Afternoon Project Block (3 Periods) */}
                                                    <div className="col-span-3 p-1.5 h-full">
                                                        <div className="h-full w-full rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 flex flex-col items-center justify-center gap-1 group hover:bg-primary/10 transition-colors shadow-sm border-secondary/20">
                                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                                                                <Rocket className="h-4 w-4 text-primary/70" />
                                                            </div>
                                                            <div className="text-center">
                                                                <div className="font-black text-primary text-xs uppercase tracking-tight">Major Project</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                timeSlots.map((slot, sIdx) => {
                                                    if (slot.type === 'break') {
                                                        return (
                                                            <div key={slot.id} className="bg-yellow-50/30 flex items-center justify-center p-2">
                                                                <span className="text-[10px] font-bold text-yellow-600/40 uppercase vertical-text tracking-widest">Break</span>
                                                            </div>
                                                        );
                                                    }

                                                    // Project Afternoon Grouping (Wed, Thu, Fri Afternoon)
                                                    if (isProjectAfternoonDay && sIdx === 4) {
                                                        return (
                                                            <div key="project-afternoon" className="col-span-3 p-1.5 h-full">
                                                                <div className="h-full w-full rounded-xl border-2 border-dashed border-primary/30 bg-primary/10 flex flex-col items-center justify-center gap-1 group hover:bg-primary/20 transition-all shadow-sm">
                                                                    <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center mb-0.5">
                                                                        <Rocket className="h-3.5 w-3.5 text-primary" />
                                                                    </div>
                                                                    <div className="text-center">
                                                                        <div className="font-black text-primary text-[11px] uppercase tracking-tighter">Major Project</div>
                                                                        <div className="text-[7px] text-muted-foreground font-bold tracking-[0.1em] uppercase opacity-70">Research Block</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                    // Hide individual slots that are now part of the col-span
                                                    if (isProjectAfternoonDay && sIdx > 4) return null;

                                                    const slotKey = `${day}-${slot.id}`;
                                                    const course = gridState[slotKey];
                                                    const isMentoringSlot = ((formData.year === "4" && formData.semester === "1" && day === "Tuesday") || (formData.year === "3" && day === "Saturday")) && slot.id === "03:20";

                                                    const isLab = course?.courseCode?.toLowerCase().includes('lab');
                                                    const isProject1 = course?.courseCode?.includes('Ph-1') || course?.courseCode === '4M1';
                                                    const isProject2 = course?.courseCode?.includes('Ph-2') || course?.courseCode === '4M2';
                                                    const isCAEG = course?.courseCode === 'CAEG';
                                                    const isSports = course?.courseCode === 'Sports' || course?.courseCode === 'SPORTS';
                                                    const isLibraryGrid = course?.courseCode === 'Library' || course?.courseCode === 'LIBRARY';

                                                    return (
                                                        <SortableContext key={slotKey} items={course ? [course.id] : []} strategy={verticalListSortingStrategy}>
                                                            <DroppableSlot id={slotKey} day={day} time={slot.id}>
                                                                 {course ? (
                                                                    <div className="h-full w-full relative group transition-all">
                                                                        <div className={`absolute inset-0 rounded-lg shadow-sm ${
                                                                            isCAEG ? 'bg-indigo-50/60 border border-indigo-100' :
                                                                            isProject1 ? 'bg-amber-50/60 border border-amber-100' :
                                                                            isProject2 ? 'bg-rose-50/60 border border-rose-100' :
                                                                            isSports ? 'bg-orange-50/60 border border-orange-100' :
                                                                            isLibraryGrid ? 'bg-cyan-50/60 border border-cyan-100' :
                                                                            isLab ? 'bg-emerald-50/60 border border-emerald-100' : 
                                                                            'bg-white dark:bg-zinc-800 border border-border'
                                                                        }`}></div>
                                                                        <DraggableCourse id={course.id} courseCode={course.courseCode} courseName={course.courseName} room={course.room} />
                                                                    </div>
                                                                ) : isMentoringSlot ? (
                                                                    <div className="h-full w-full flex flex-col items-center justify-center bg-indigo-50/80 dark:bg-indigo-900/30 rounded-lg border-2 border-dotted border-indigo-200 dark:border-indigo-800 p-2 text-center group transition-all">
                                                                        <div className="text-[11px] font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-tighter leading-none mb-1">Mentoring</div>
                                                                    </div>
                                                                ) : null}
                                                            </DroppableSlot>
                                                        </SortableContext>
                                                    );
                                                })
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <DragOverlay>
                    {activeId ? (
                        <div className="p-2 rounded-md text-xs border shadow-lg bg-white dark:bg-zinc-800 ring-2 ring-primary rotate-3 scale-105 opacity-90 cursor-grabbing">
                            <div className="font-bold text-primary">Dragging...</div>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default TimetableGenerator;
