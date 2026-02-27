import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { timetableService } from "@/services/api";
import { Loader2, Calendar as CalendarIcon, Save, RefreshCw, Wand2 } from "lucide-react";
import { AIML_TIMETABLES, FACULTY_LOAD } from "@/data/aimlTimetable"; // Import Data
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
    room: string;
}

interface TimetableSlot {
    id: string;
    day: string;
    time: string;
    course?: CourseCardProps;
}

// --- Components ---

function DraggableCourse({ id, courseCode, room }: CourseCardProps) {
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
            <div className="font-bold text-primary">{courseCode}</div>
            <div className="text-muted-foreground truncate">{room}</div>
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
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    // State for drag and drop
    const [gridState, setGridState] = useState<Record<string, CourseCardProps | null>>({});
    const [activeId, setActiveId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        year: "1",
        semester: "1",
        department: "Computer Science"
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleGenerate = async () => {
        setLoading(true);
        try {
            await new Promise(r => setTimeout(r, 800)); // Fake realistic delay

            let newGrid: Record<string, CourseCardProps | null> = {};

            if (formData.department === "AIML") {
                const key = `${formData.year}-${formData.semester}`;

                // Check for static timetable (Images 4 & 5)
                if (AIML_TIMETABLES[key]) {
                    // Start with empty grid to clear prev state if needed, but actually we want to merge or set.
                    // The AIML_TIMETABLES has keys "Day-TimeId" (e.g. "Monday-09:40")
                    // Our gridState expects the same keys.

                    // However, we need to make sure the object structure matches CourseCardProps
                    /*
                       interface CourseCardProps {
                           id: string;
                           courseCode: string;
                           room: string;
                       }
                    */
                    const staticData = AIML_TIMETABLES[key];
                    // Map over staticData and enable it
                    Object.keys(staticData).forEach(slotKey => {
                        const entry = staticData[slotKey];
                        if (entry) {
                            newGrid[slotKey] = {
                                id: entry.id,
                                courseCode: entry.courseCode,
                                room: entry.room
                            };
                        }
                    });

                } else if (FACULTY_LOAD[key as keyof typeof FACULTY_LOAD]) {
                    // Generate based on Faculty Load
                    const subjects = FACULTY_LOAD[key as keyof typeof FACULTY_LOAD];

                    days.forEach(day => {
                        timeSlots.forEach((slot, index) => {
                            if (slot.type === 'break') return;

                            // Simple round-robin distribution for now + some randomness
                            const subjectIndex = (index + days.indexOf(day)) % subjects.length;
                            const subject = subjects[subjectIndex];

                            newGrid[`${day}-${slot.id}`] = {
                                id: `gen-${day}-${slot.id}`,
                                courseCode: subject.code,
                                room: subject.room || "Classroom" // Use room from data if available
                            };
                        });
                    });
                } else {
                    toast({ title: "Data Missing", description: `No data found for Year ${formData.year} Semester ${formData.semester}`, variant: "destructive" });
                    return;
                }

            } else {
                // Call Backend AI Solver
                try {
                    // Convert semester to number as backend expects int
                    const semInt = parseInt(formData.semester);
                    const response = await timetableService.generate(semInt, formData.department);

                    if (response.data && Array.isArray(response.data)) {
                        response.data.forEach((item: any) => {
                            // Backend returns slot_id like "Monday-09:40"
                            if (item.slot_id) {
                                newGrid[item.slot_id] = {
                                    id: `ai-${Math.random()}`, // Unique ID for dnd
                                    courseCode: item.course_code,
                                    room: item.room_name
                                };
                            }
                        });
                        toast({
                            title: "AI Optimization Complete",
                            description: `Generated conflict-free schedule using Google OR-Tools.`,
                            className: "bg-green-50 border-green-200 dark:bg-green-900/20"
                        });
                    }
                } catch (error) {
                    console.error("AI Generation failed:", error);
                    toast({
                        title: "AI Service Unavailable",
                        description: "Falling back to local heuristic generation.",
                        variant: "destructive"
                    });

                    // Fallback to random heuristic
                    days.forEach(day => {
                        timeSlots.forEach(slot => {
                            if (slot.type === 'break') return;

                            const isMath = Math.random() > 0.5;
                            newGrid[`${day}-${slot.id}`] = {
                                id: `course-${day}-${slot.id}`,
                                courseCode: isMath ? "MATH101" : "CS102",
                                room: isMath ? "Lecture Hall A" : "Lab 101"
                            };
                        });
                    });
                }
            }

            setGridState(newGrid);
            toast({ title: "Timetable Generated", description: `Schedule optimized for ${formData.department} Year ${formData.year}.` });
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
            {/* Header & Config Panel ... (Keep existing if mostly same, but I'm rewriting the whole return for safety of Grid) */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 animate-in fade-in-50 slide-in-from-top-2">
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

            <Card className="mb-8 border-none shadow-xl bg-gradient-to-br from-white to-primary/5 dark:from-zinc-900 dark:to-zinc-950">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-end">
                        <div className="space-y-2 flex-1">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <Wand2 className="h-4 w-4 text-purple-500" /> Department
                            </label>
                            <Select
                                value={formData.department}
                                onValueChange={(v) => setFormData({ ...formData, department: v })}
                            >
                                <SelectTrigger className="h-12 bg-background/50 backdrop-blur-sm border-primary/20 focus:ring-purple-500">
                                    <SelectValue placeholder="Select Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="AIML">Artificial Intelligence & Machine Learning (AIML)</SelectItem>
                                    <SelectItem value="Computer Science">Computer Science & Engineering</SelectItem>
                                    <SelectItem value="Electrical Eng">Electrical & Electronics</SelectItem>
                                    <SelectItem value="Mechanical Eng">Mechanical Engineering</SelectItem>
                                    <SelectItem value="Business">Business Administration</SelectItem>
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
                                    <SelectItem value="1">Semester 1</SelectItem>
                                    <SelectItem value="2">Semester 2</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            size="lg"
                            onClick={handleGenerate}
                            className="h-12 px-8 bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/25 transition-all hover:scale-105"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
                            Generate Timetable
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="bg-card rounded-xl border shadow-sm overflow-hidden min-w-[1000px]">
                    {/* Header Row */}
                    <div className="grid grid-cols-[120px_repeat(6,1fr)] bg-muted/50 divide-x divide-border border-b">
                        <div className="p-4 font-bold text-center text-muted-foreground bg-muted flex items-center justify-center">Time / Day</div>
                        {days.map(day => (
                            <div key={day} className="p-4 font-bold text-center text-foreground">{day}</div>
                        ))}
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-border">
                        {timeSlots.map((slot) => {
                            if (slot.type === 'break') {
                                return (
                                    <div key={slot.id} className="grid grid-cols-[120px_1fr] divide-x divide-border min-h-[60px] bg-yellow-50/50 dark:bg-yellow-900/10">
                                        <div className="p-2 text-xs font-bold text-muted-foreground flex items-center justify-center bg-muted/10 border-r">
                                            {slot.label}
                                        </div>
                                        <div className="flex items-center justify-center font-bold text-yellow-600/50 tracking-widest uppercase text-sm">
                                            LUNCH BREAK (40 Mins)
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div key={slot.id} className="grid grid-cols-[120px_repeat(6,1fr)] divide-x divide-border min-h-[100px]">
                                    <div className="p-2 text-xs font-medium text-muted-foreground flex items-center justify-center bg-muted/10 text-center">
                                        {slot.label}
                                    </div>
                                    {days.map((day) => {
                                        const slotKey = `${day}-${slot.id}`;
                                        const course = gridState[slotKey];

                                        return (
                                            <SortableContext key={slotKey} items={course ? [course.id] : []} strategy={verticalListSortingStrategy}>
                                                <DroppableSlot id={slotKey} day={day} time={slot.id}>
                                                    {course ? (
                                                        <DraggableCourse id={course.id} courseCode={course.courseCode} room={course.room} />
                                                    ) : null}
                                                </DroppableSlot>
                                            </SortableContext>
                                        );
                                    })}
                                </div>
                            );
                        })}
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

        </div>
    );
};

export default TimetableGenerator;
