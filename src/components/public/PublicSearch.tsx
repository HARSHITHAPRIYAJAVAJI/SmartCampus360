import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, User, Loader2, X, Building2, School, Clock, Navigation } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

// Import data for local search simulation
import { MOCK_FACULTY, Faculty } from '@/data/mockFaculty';
import { MOCK_ROOMS, Room } from '@/data/mockRooms';
import { AIML_TIMETABLES, FACULTY_LOAD } from '@/data/aimlTimetable';
import { MOCK_COURSES } from '@/data/mockCourses';

interface SearchResult {
  id: string;
  type: 'faculty' | 'location' | 'facility';
  name: string;
  location: string;
  block?: string;
  floor?: string;
  details?: string;
  status?: string;
  score: number;
}

const PublicSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Helper to determine current location logic for faculty
  const getFacultyCurrentLocation = (facultyName: string) => {
    const now = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = days[now.getDay()];
    if (dayName === "Sunday") return "Home / Weekend Off";

    const hours = now.getHours();
    const mins = now.getMinutes();
    const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

    const slots = [
      { id: "09:40", start: "09:40", end: "10:40" },
      { id: "10:40", start: "10:40", end: "11:40" },
      { id: "11:40", start: "11:40", end: "12:40" },
      { id: "01:20", start: "13:20", end: "14:20" },
      { id: "02:20", start: "14:20", end: "15:20" },
      { id: "03:20", start: "15:20", end: "16:20" }
    ];

    const currentSlot = slots.find(s => timeStr >= s.start && timeStr < s.end);
    if (!currentSlot) return "Staff Room";

    const slotKey = `${dayName}-${currentSlot.id}`;
    const cleanName = (n: string) => n.toLowerCase().replace(/^(dr|mrs|mr|prof)\.?\s+/i, '').replace(/\./g, ' ').trim();
    const searchName = cleanName(facultyName);
    
    // Scan all timetables
    for (const [sectionKey, sem] of Object.entries(AIML_TIMETABLES)) {
      const entry = sem[slotKey];
      if (!entry) continue;

      let isAssigned = false;

      // Check 1: Direct name match in room field
      if (cleanName(entry.room).includes(searchName) || searchName.includes(cleanName(entry.room))) {
          isAssigned = true;
      }

      // Check 2: Check FACULTY_LOAD for assigned teacher
      if (!isAssigned) {
          // Normalize sectionKey: CSM-1-1-B -> 1-1; 4-1-B -> 4-1
          const baseKey = sectionKey.replace(/^[A-Z]+-/, '').replace(/-[A-Z]$/, '');
          
          // Aggressive search: look in ALL FACULTY_LOAD entries that match this section
          const relevantLoadKeys = Object.keys(FACULTY_LOAD).filter(k => 
              k === sectionKey || 
              k === baseKey || 
              k.includes(`-${baseKey}`) || 
              (baseKey.length > 2 && k.includes(baseKey))
          );

          for (const loadKey of relevantLoadKeys) {
            const load = (FACULTY_LOAD as any)[loadKey];
            if (load && Array.isArray(load)) {
              const match = load.find((l: any) => 
                  l.code === entry.courseCode && 
                  (cleanName(l.faculty).includes(searchName) || searchName.includes(cleanName(l.faculty)))
              );
              if (match) {
                isAssigned = true;
                break;
              }
            }
          }
      }

      if (isAssigned) {
        const course = MOCK_COURSES.find(c => c.code === entry.courseCode);
        const courseName = course ? course.name : entry.courseCode;

        let physicalRoom = entry.room;
        let block = "Main Block";

        if (entry.room.length > 8 || entry.room.includes('.') || entry.courseCode === 'Sports') {
             if (entry.courseCode === 'Sports') {
                 physicalRoom = "Ground";
                 block = "Main Block";
             } else if (sectionKey.startsWith('1-')) {
                 physicalRoom = `T-40${Math.floor(Math.random() * 4) + 1}`;
                 block = "T-Block";
             } else if (sectionKey.includes('IT')) {
                 physicalRoom = "S-401";
                 block = "South Block";
             } else if (sectionKey.includes('AIML') || sectionKey.includes('CSM')) {
                 physicalRoom = "N-402";
                 block = "North Block";
             } else if (sectionKey.includes('ECE')) {
                 physicalRoom = "S-305";
                 block = "South Block";
             } else if (sectionKey.includes('CSE')) {
                 physicalRoom = "C-302";
                 block = "Central Block";
             } else {
                 physicalRoom = "Room 204";
                 block = "Block A";
             }
        } else {
            const roomMeta = MOCK_ROOMS.find(r => r.name === physicalRoom || r.id === physicalRoom);
            if (roomMeta) block = roomMeta.building;
            else if (physicalRoom.startsWith('S-')) block = "South Block";
            else if (physicalRoom.startsWith('N-')) block = "North Block";
            else if (physicalRoom.startsWith('C-')) block = "Central Block";
            else if (physicalRoom.startsWith('T-')) block = "T-Block";
        }

        return `Room ${physicalRoom}, ${block} - ${courseName} Class`;
      }
    }

    return "Staff Room";
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performFuzzySearch = (val: string) => {
    const q = val.toLowerCase().trim();
    if (q.length < 2) return [];

    const searchPool: SearchResult[] = [];

    // 1. Process Faculty
    MOCK_FACULTY.forEach(f => {
      let score = 0;
      const name = f.name.toLowerCase();
      const dept = f.department.toLowerCase();
      const desig = f.designation.toLowerCase();

      if (name === q) score += 100;
      else if (name.startsWith(q)) score += 80;
      else if (name.includes(q)) score += 60;
      else if (dept.includes(q) || desig.includes(q)) score += 40;

      if (f.specialization?.some(s => s.toLowerCase().includes(q))) score += 30;

      if (score > 0) {
        const locationStr = getFacultyCurrentLocation(f.name);
        searchPool.push({
          id: f.id,
          type: 'faculty',
          name: f.name,
          location: locationStr,
          status: locationStr.includes('Staff Room') ? 'Available' : 'Currently in Class',
          details: `${f.designation} • ${f.department} Dept`,
          score
        });
      }
    });

    // 2. Process Rooms/Places
    MOCK_ROOMS.forEach(r => {
      let score = 0;
      const name = r.name.toLowerCase();
      const bldg = r.building.toLowerCase();
      const type = r.type.toLowerCase();

      if (name === q) score += 100;
      else if (name.startsWith(q)) score += 80;
      else if (name.includes(q)) score += 70;
      else if (bldg.includes(q) || type.includes(q)) score += 50;

      if (r.subjects?.some(s => s.toLowerCase().includes(q))) score += 40;

      if (score > 0) {
        searchPool.push({
          id: r.id,
          type: r.type === 'Office' ? 'facility' : 'location',
          name: r.name,
          location: r.building,
          block: r.building.split(' ')[0],
          floor: r.building.includes('Floor') ? r.building.split('Floor ')[1].charAt(0) : undefined,
          details: `${r.type} ${r.dept ? `• ${r.dept}` : ''}`,
          score
        });
      }
    });

    // 3. Fallback: Related suggestions if results are low
    if (searchPool.length < 3) {
        // Add generic high-level entities if query matches broad terms
        if ("library".includes(q) || "books".includes(q)) {
            searchPool.push({ id: 'lib-1', type: 'location', name: 'Central Library', location: 'T-Block', floor: 'G', score: 20 });
        }
    }

    return searchPool.sort((a, b) => b.score - a.score).slice(0, 8);
  };

  const handleSearch = (val: string) => {
    setQuery(val);
    if (val.length < 1) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    setIsOpen(true);
    
    // Simulate async search for better UX
    setTimeout(() => {
        const searchResults = performFuzzySearch(val);
        setResults(searchResults);
        setLoading(false);
    }, 150);
  };

  const QuickButton = ({ label, icon: Icon }: { label: string, icon: any }) => (
    <Button 
      variant="outline" 
      size="sm" 
      className="rounded-full bg-white shadow-sm border-slate-200 text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
      onClick={() => handleSearch(label)}
    >
      <Icon className="w-3.5 h-3.5 mr-1.5" />
      {label}
    </Button>
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4" ref={searchRef}>
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 5px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(156, 163, 175, 0.2);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(156, 163, 175, 0.4);
          }
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(156, 163, 175, 0.2) transparent;
          }
        `}
      </style>
      <div className="relative max-w-3xl mx-auto">
        <div className={`relative flex items-center bg-white rounded-full transition-all duration-300 border ${query ? 'border-primary shadow-lg shadow-primary/10' : 'border-slate-200 shadow-sm hover:shadow-md'}`}>
          <div className="pl-6 text-slate-400">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className={`h-5 w-5 ${query ? 'text-primary' : ''}`} />}
          </div>
          <Input
            id="public-search"
            className="h-14 lg:h-16 pl-4 pr-12 text-lg lg:text-xl rounded-full border-none bg-transparent shadow-none focus-visible:ring-0 placeholder:text-slate-400 text-slate-800 font-medium"
            placeholder="Search faculty, labs, or offices..."
            value={query}
            autoComplete="off"
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
          />
          {query && (
            <button 
              onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
              className="absolute right-4 p-2 hover:bg-slate-100 rounded-full transition-colors group"
              aria-label="Clear search"
            >
              <X className="h-5 w-5 text-slate-400 group-hover:text-rose-500 transition-all" />
            </button>
          )}
        </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.98 }}
                className="absolute z-50 w-full left-0 mt-3 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
              >
                <Card className="border-none shadow-none bg-transparent">
                  <CardContent className="p-2 lg:p-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                        <p className="font-bold uppercase tracking-widest text-xs">Querying Unified Campus Database...</p>
                      </div>
                    ) : results.length > 0 ? (
                      <div className="space-y-2">
                        <div className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex justify-between items-center">
                            <span>Relevant Results Found ({results.length})</span>
                            <span className="text-primary italic">Live Location Active</span>
                        </div>
                        {results.map((result, idx) => (
                          <motion.div 
                            key={result.id} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="p-4 rounded-3xl hover:bg-slate-50 transition-all cursor-pointer group border border-transparent hover:border-slate-100 hover:shadow-sm"
                          >
                            <div className="flex items-start gap-4">
                              <div className={`p-4 rounded-2xl shadow-sm group-hover:scale-110 transition-transform ${
                                result.type === 'faculty' ? 'bg-indigo-50 text-indigo-600' : 
                                result.type === 'facility' ? 'bg-rose-50 text-rose-600' : 
                                'bg-amber-50 text-amber-600'
                              }`}>
                                {result.type === 'faculty' ? <User className="h-6 w-6" /> : 
                                 result.type === 'facility' ? <Building2 className="h-6 w-6" /> : 
                                 <MapPin className="h-6 w-6" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-black text-xl text-slate-900 group-hover:text-primary transition-colors">{result.name}</h4>
                                  <Badge variant="outline" className={`capitalize rounded-lg font-black text-[9px] uppercase tracking-tighter ${
                                    result.type === 'faculty' ? 'bg-indigo-50/50 border-indigo-100' : 
                                    'bg-slate-50/50 border-slate-100'
                                  }`}>
                                    {result.type}
                                  </Badge>
                                </div>
                                <div className="flex flex-wrap items-center gap-y-2 text-slate-500 font-bold text-sm">
                                  <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-slate-900 shadow-sm">
                                    <MapPin className="h-3.5 w-3.5 text-primary" />
                                    {result.location}
                                  </div>
                                  
                                  {result.block && (
                                    <>
                                        <span className="mx-2 opacity-20">|</span>
                                        <div className="flex items-center gap-1.5">
                                            <Building2 className="h-3.5 w-3.5 text-slate-400" />
                                            {result.block} Block 
                                            {result.floor && <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">{result.floor}F</span>}
                                        </div>
                                    </>
                                  )}

                                  {result.type === 'faculty' && (
                                    <>
                                        <span className="mx-2 opacity-20">|</span>
                                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                                            result.status === 'Available' 
                                            ? 'text-indigo-600 bg-indigo-50 border-indigo-100/50' 
                                            : 'text-emerald-600 bg-emerald-50 border-emerald-100/50'
                                        }`}>
                                            <Clock className="h-3.5 w-3.5" />
                                            {result.status}
                                        </div>
                                    </>
                                  )}
                                </div>
                                {result.details && (
                                  <p className="text-xs text-slate-400 mt-2 font-medium flex items-center gap-1.5 italic">
                                    {result.details}
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-20 text-center text-slate-400">
                        <div className="bg-slate-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                          <X className="h-10 w-10 text-slate-300" />
                        </div>
                        <p className="text-2xl font-black text-slate-900 mb-2">No exact match found</p>
                        <p className="text-slate-500 font-medium">Try searching for generic terms like 'HOD', 'Lab', or 'Block'</p>
                        
                        <div className="mt-8 flex flex-wrap justify-center gap-3 max-w-md mx-auto">
                           <Button variant="ghost" className="text-xs font-bold rounded-xl" onClick={() => handleSearch("Classroom")}>Browse Classrooms</Button>
                           <Button variant="ghost" className="text-xs font-bold rounded-xl" onClick={() => handleSearch("Professor")}>Find Professors</Button>
                           <Button variant="ghost" className="text-xs font-bold rounded-xl" onClick={() => handleSearch("Lab")}>Search Labs</Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
  );
};

export default PublicSearch;
