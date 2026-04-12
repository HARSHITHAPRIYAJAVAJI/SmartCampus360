import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
    Users,
    BookOpen,
    Clock,
    GraduationCap,
    LayoutGrid,
    ArrowUpRight,
    TrendingUp,
    ShieldCheck,
    Search,
    FlaskConical,
    BarChart3,
    Layers,
    RefreshCw
} from "lucide-react";
import { MOCK_FACULTY } from "@/data/mockFaculty";
import { MOCK_COURSES } from "@/data/mockCourses";
import { SUBJECT_MAPPING } from "@/data/subjectMapping";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FacultyWorkloadRecord {
    facultyId: string;
    facultyName: string;
    department: string;
    designation: string;
    totalHours: number;
    theoryHours: number;
    labHours: number;
    theories: string[];  // course codes
    labs: string[];      // course codes
    sectionsAssigned: string[];
    loadPercent: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Map course code to a readable abbreviation */
function getAbbreviation(code: string): string {
    const course = MOCK_COURSES.find(c => c.code === code);
    if (!course) return code;

    const matchByName = Object.entries(SUBJECT_MAPPING).find(
        ([, fullName]) => fullName.toLowerCase() === course.name.toLowerCase()
    );
    if (matchByName) return matchByName[0];

    // Derive from name
    const stopWords = new Set(["and", "of", "for", "the", "in", "&", "a", "an", "through"]);
    const parts = course.name.split(' ').filter(p => p.length > 0 && !stopWords.has(p.toLowerCase()));
    if (parts.length >= 2) return parts.map(p => p[0]).join('').toUpperCase();
    return course.name;
}

/** Get full course name from code */
function getCourseName(code: string): string {
    return MOCK_COURSES.find(c => c.code === code)?.name || code;
}

// Max weekly load hours for progress display
const MAX_WEEKLY_HOURS = 25;

// ─── Real-Time Workload Builder ────────────────────────────────────────────

function buildWorkloadFromTimetables(publishedTimetables: Record<string, any>): FacultyWorkloadRecord[] {
    // Initialize records for ALL faculty
    const workloadMap: Record<string, FacultyWorkloadRecord> = {};

    MOCK_FACULTY.forEach(f => {
        if (!workloadMap[f.id] && !workloadMap[f.name]) {
            workloadMap[f.name] = {
                facultyId: f.id,
                facultyName: f.name,
                department: f.department,
                designation: f.designation,
                totalHours: 0,
                theoryHours: 0,
                labHours: 0,
                theories: [],
                labs: [],
                sectionsAssigned: [],
                loadPercent: 0
            };
        }
    });

    // Aggregate from published timetable slots
    Object.entries(publishedTimetables).forEach(([sectionKey, entry]: [string, any]) => {
        if (!entry) return;
        const grid = entry.grid || entry;
        if (!grid || typeof grid !== 'object') return;

        Object.values(grid).forEach((slot: any) => {
            if (!slot || !slot.faculty || slot.faculty === "Staff" || slot.faculty === "PET" || slot.faculty === "Librarian") return;

            const fName = slot.faculty;
            
            // Create record for any unknown faculty
            if (!workloadMap[fName]) {
                const found = MOCK_FACULTY.find(f => f.name.toLowerCase().trim() === fName.toLowerCase().trim());
                workloadMap[fName] = {
                    facultyId: found?.id || fName,
                    facultyName: fName,
                    department: found?.department || "Other",
                    designation: found?.designation || "Faculty",
                    totalHours: 0,
                    theoryHours: 0,
                    labHours: 0,
                    theories: [],
                    labs: [],
                    sectionsAssigned: [],
                    loadPercent: 0
                };
            }

            const record = workloadMap[fName];
            record.totalHours += 1;

            if (slot.type === 'Lab') {
                record.labHours += 1;
                if (!record.labs.includes(slot.courseCode)) {
                    record.labs.push(slot.courseCode);
                }
            } else {
                record.theoryHours += 1;
                if (!record.theories.includes(slot.courseCode)) {
                    record.theories.push(slot.courseCode);
                }
            }

            if (!record.sectionsAssigned.includes(sectionKey)) {
                record.sectionsAssigned.push(sectionKey);
            }
        });
    });

    // Calculate load percent
    Object.values(workloadMap).forEach(record => {
        record.loadPercent = Math.min(100, Math.round((record.totalHours / MAX_WEEKLY_HOURS) * 100));
    });

    return Object.values(workloadMap);
}

// ─── Component ────────────────────────────────────────────────────────────────

const FacultyLoadDashboard = () => {
    const [search, setSearch] = useState("");

    const publishedStoreStr = localStorage.getItem('published_timetables');
    
    // Use ONLY published institutional reality for the official load dashboard
    const officialTimetables: Record<string, any> = useMemo(() => {
        return publishedStoreStr ? JSON.parse(publishedStoreStr) : {};
    }, [publishedStoreStr]);

    // Build workload from OFFICIAL published data only
    const allWorkload = useMemo(() => buildWorkloadFromTimetables(officialTimetables), [officialTimetables]);

    // Group by department
    const byDept = useMemo(() => {
        const result: Record<string, FacultyWorkloadRecord[]> = {
            "CSM": [], "IT": [], "CSE": [], "ECE": [], "Other": []
        };
        allWorkload.forEach(record => {
            const dept = record.department.toUpperCase();
            if (result[dept]) {
                result[dept].push(record);
            } else {
                result["Other"].push(record);
            }
        });
        // Sort each dept by hours descending
        Object.keys(result).forEach(d => result[d].sort((a, b) => b.totalHours - a.totalHours));
        return result;
    }, [allWorkload]);

    // Department stats
    const deptStats = useMemo(() => {
        return Object.entries(byDept).map(([dept, records]) => ({
            dept,
            totalHours: records.reduce((s, r) => s + r.totalHours, 0),
            facultyCount: records.length,
            avgLoad: records.length > 0
                ? Math.round(records.reduce((s, r) => s + r.totalHours, 0) / records.length)
                : 0,
            maxLoad: Math.max(...records.map(r => r.totalHours), 0),
            overloaded: records.filter(r => r.totalHours > MAX_WEEKLY_HOURS).length,
            underutilized: records.filter(r => r.totalHours === 0).length
        }));
    }, [byDept]);

    const totalInstitutionalHours = allWorkload.reduce((s, r) => s + r.totalHours, 0);
    const totalFaculty = allWorkload.length;
    const activeFaculty = allWorkload.filter(r => r.totalHours > 0).length;

    // Filtered list for search
    const filteredByDept = useMemo(() => {
        if (!search.trim()) return byDept;
        
        const q = search.toLowerCase();
        const result: Record<string, FacultyWorkloadRecord[]> = {};
        Object.entries(byDept).forEach(([dept, records]) => {
            result[dept] = records.filter(r => 
                r.facultyName.toLowerCase().includes(q) ||
                r.theories.some(c => getAbbreviation(c).toLowerCase().includes(q)) ||
                r.labs.some(c => getAbbreviation(c).toLowerCase().includes(q))
            );
        });
        return result;
    }, [byDept, search]);

    const getLoadColor = (hours: number) => {
        if (hours > 20) return { text: 'text-red-500', bg: 'bg-red-50', border: 'border-l-red-500', badge: 'bg-red-100 text-red-700' };
        if (hours > 14) return { text: 'text-blue-500', bg: 'bg-blue-50', border: 'border-l-blue-500', badge: 'bg-blue-100 text-blue-700' };
        if (hours > 0)  return { text: 'text-green-500', bg: 'bg-green-50', border: 'border-l-green-500', badge: 'bg-green-100 text-green-700' };
        return { text: 'text-slate-400', bg: 'bg-slate-50', border: 'border-l-slate-300', badge: 'bg-slate-100 text-slate-500' };
    };

    const hasData = Object.keys(officialTimetables).length > 0;

    return (
        <div className="space-y-8 animate-in fade-in-50 duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
                            <TrendingUp className="h-5 w-5 text-green-400" />
                        </div>
                        <Badge variant="outline" className="text-[10px] border-white/20 text-white/70 uppercase tracking-widest font-black">
                            {hasData ? '● Live Tracking' : '○ No Data Published'}
                        </Badge>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Faculty Workload Dashboard</h1>
                    <p className="text-slate-300 font-medium max-w-xl">
                        Real-time specialization-aware workload analysis across all departments and sections.
                    </p>
                </div>

                <div className="flex gap-4 relative z-10 flex-wrap">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl min-w-[140px]">
                        <p className="text-white/50 text-[10px] font-black uppercase tracking-wider mb-1">Total Periods</p>
                        <p className="text-3xl font-black">{totalInstitutionalHours}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <ArrowUpRight className="h-3 w-3 text-green-400" />
                            <span className="text-[10px] font-bold text-green-400">All Dept.</span>
                        </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl min-w-[140px]">
                        <p className="text-white/50 text-[10px] font-black uppercase tracking-wider mb-1">Active Faculty</p>
                        <p className="text-3xl font-black">{activeFaculty}<span className="text-lg text-white/40">/{totalFaculty}</span></p>
                        <div className="flex items-center gap-2 mt-2">
                            <Users className="h-3 w-3 text-blue-400" />
                            <span className="text-[10px] font-bold text-blue-400">Assigned</span>
                        </div>
                    </div>
                </div>

                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-20%] left-[20%] w-48 h-48 bg-purple-500/20 rounded-full blur-[80px]" />
            </div>

            {/* No data warning */}
            {!hasData && (
                <div className="flex flex-col items-center justify-center py-16 bg-amber-50 border-2 border-dashed border-amber-200 rounded-[2.5rem]">
                    <RefreshCw className="h-12 w-12 text-amber-400 mb-4" />
                    <p className="text-xl font-black text-amber-800">No Published Timetables</p>
                    <p className="text-sm text-amber-600 mt-2">
                        Generate and publish timetables from the Smart Scheduler to see real-time workload analysis.
                    </p>
                </div>
            )}

            {hasData && (
                <>


                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-11 h-12 rounded-2xl border-slate-200 bg-white shadow-sm"
                            placeholder="Search faculty by name, subject code or abbreviation..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Branch Tabs */}
                    <Tabs defaultValue="CSM" className="w-full">
                        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-2 rounded-3xl border shadow-sm mb-8 gap-4">
                            <TabsList className="bg-slate-50 p-1 rounded-2xl h-14 w-full md:w-auto">
                                {["CSM", "IT", "CSE", "ECE"].map(dept => (
                                    <TabsTrigger
                                        key={dept}
                                        value={dept}
                                        className="rounded-xl px-7 h-full font-bold data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all"
                                    >
                                        {dept}
                                        <Badge className="ml-2 h-5 px-1.5 text-[9px] font-black bg-slate-100 text-slate-500 rounded-full">
                                            {filteredByDept[dept]?.length || 0}
                                        </Badge>
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                            <div className="flex items-center gap-3 px-4 py-2 border rounded-2xl bg-slate-50/50">
                                <BarChart3 className="h-4 w-4 text-slate-400" />
                                <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">Sorted by Utilization</span>
                            </div>
                        </div>

                        {["CSM", "IT", "CSE", "ECE"].map(dept => (
                            <TabsContent key={dept} value={dept} className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                {/* Dept summary strip */}
                                {(() => {
                                    const stat = deptStats.find(s => s.dept === dept);
                                    if (!stat) return null;
                                    return (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {[
                                                { label: "Total Faculty", value: stat.facultyCount, icon: <Users className="h-4 w-4" /> },
                                                { label: "Total Hours", value: stat.totalHours, icon: <Clock className="h-4 w-4" /> },
                                                { label: "Avg. Load/Faculty", value: `${stat.avgLoad} hrs`, icon: <TrendingUp className="h-4 w-4" /> },
                                                { label: "Zero Workload", value: stat.underutilized, icon: <Layers className="h-4 w-4" /> }
                                            ].map((item, i) => (
                                                <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                                                    <div className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                                                        {item.icon}
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{item.label}</p>
                                                        <p className="text-lg font-black text-slate-800">{item.value}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}

                                {/* Faculty cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {(filteredByDept[dept] || []).length > 0 ? (
                                        (filteredByDept[dept] || []).map((f, i) => {
                                            const colors = getLoadColor(f.totalHours);
                                            const allSubjects = [...new Set([...f.theories, ...f.labs])];
                                            return (
                                                <Card key={i} className={`rounded-3xl border shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden bg-white border-l-4 ${colors.border}`}>
                                                    <CardHeader className="pb-2">
                                                        <div className="flex justify-between items-start">
                                                            <div className="space-y-1 flex-1 min-w-0">
                                                                <CardTitle className={`text-base font-black tracking-tight group-hover:text-primary transition-colors truncate`}>
                                                                    {f.facultyName}
                                                                </CardTitle>
                                                                <CardDescription className="text-[10px] font-bold uppercase tracking-widest truncate">
                                                                    {f.designation}
                                                                </CardDescription>
                                                            </div>
                                                            <div className={`p-2 rounded-xl ${colors.bg} ml-2 shrink-0`}>
                                                                <Clock className={`h-4 w-4 ${colors.text}`} />
                                                            </div>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        {/* Load bar */}
                                                        <div>
                                                            <div className="flex justify-between text-xs font-bold mb-1.5">
                                                                <span className="text-muted-foreground uppercase tracking-tight">Weekly Utilization</span>
                                                                <span className={colors.text}>{f.totalHours} / {MAX_WEEKLY_HOURS} hrs</span>
                                                            </div>
                                                            <Progress value={f.loadPercent} className="h-2 rounded-full" />
                                                        </div>

                                                        {/* Theory + Lab counts */}
                                                        <div className="grid grid-cols-3 gap-2">
                                                            <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-center">
                                                                <div className="flex items-center justify-center gap-1 mb-1">
                                                                    <BookOpen className="h-3 w-3 text-indigo-500" />
                                                                    <span className="text-[8px] font-black uppercase tracking-wider text-slate-500">Theory</span>
                                                                </div>
                                                                <p className="font-black text-base">{f.theoryHours}</p>
                                                            </div>
                                                            <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-center">
                                                                <div className="flex items-center justify-center gap-1 mb-1">
                                                                    <FlaskConical className="h-3 w-3 text-emerald-500" />
                                                                    <span className="text-[8px] font-black uppercase tracking-wider text-slate-500">Lab</span>
                                                                </div>
                                                                <p className="font-black text-base">{f.labHours}</p>
                                                            </div>
                                                            <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-center">
                                                                <div className="flex items-center justify-center gap-1 mb-1">
                                                                    <Layers className="h-3 w-3 text-purple-500" />
                                                                    <span className="text-[8px] font-black uppercase tracking-wider text-slate-500">Secs</span>
                                                                </div>
                                                                <p className="font-black text-base">{f.sectionsAssigned.length}</p>
                                                            </div>
                                                        </div>

                                                        {/* Sections */}
                                                        {f.sectionsAssigned.length > 0 && (
                                                            <div>
                                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Sections Handling</p>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {f.sectionsAssigned.map((s, idx) => {
                                                                        const parts = s.split('-');
                                                                        const label = parts.length >= 4 ? `${parts[0]} Y${parts[1]}S${parts[2]}-${parts[3]}` : s;
                                                                        return (
                                                                            <Badge key={idx} variant="outline" className="text-[8px] font-black border-slate-200 text-slate-600 rounded-lg px-1.5">
                                                                                {label}
                                                                            </Badge>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Subjects */}
                                                        {allSubjects.length > 0 && (
                                                            <div>
                                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Assignment Overview</p>
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {f.theories.map((code, idx) => (
                                                                        <Badge
                                                                            key={`th-${idx}`}
                                                                            variant="secondary"
                                                                            title={`Theory: ${getCourseName(code)}`}
                                                                            className="bg-indigo-50 text-indigo-700 border-none text-[8px] font-black px-2 py-0.5 rounded-md"
                                                                        >
                                                                            {getAbbreviation(code)}
                                                                        </Badge>
                                                                    ))}
                                                                    {f.labs.map((code, idx) => (
                                                                        <Badge
                                                                            key={`lb-${idx}`}
                                                                            variant="secondary"
                                                                            title={`Lab: ${getCourseName(code)}`}
                                                                            className="bg-emerald-50 text-emerald-700 border-none text-[8px] font-black px-2 py-0.5 rounded-md"
                                                                        >
                                                                            {getAbbreviation(code)} Lab
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Zero workload warning */}
                                                        {f.totalHours === 0 && (
                                                            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 text-center">
                                                                <p className="text-[10px] font-black text-amber-600">⚠ No assignments yet</p>
                                                                <p className="text-[9px] text-amber-500 mt-0.5">Generate and publish a timetable to assign this faculty.</p>
                                                            </div>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            );
                                        })
                                    ) : (
                                        <div className="col-span-full py-20 text-center text-muted-foreground border-2 border-dashed rounded-[2.5rem] bg-slate-50/50">
                                            <Users className="h-16 w-16 mx-auto mb-4 opacity-10" />
                                            <p className="text-xl font-bold">
                                                {search ? "No results match your search" : "No Load Data Available"}
                                            </p>
                                            <p className="text-sm mt-1">
                                                {search ? "Try a different search term." : "Generate and publish a timetable for this branch."}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </>
            )}
        </div>
    );
};

export default FacultyLoadDashboard;
