import { MOCK_FACULTY } from "@/data/mockFaculty";
import { getTimetable } from "@/data/aimlTimetable";

/**
 * Calculate current teaching load for all faculty.
 */
function getWorkloadMap(publishedTimetables: Record<string, any>) {
    const workload: Record<string, number> = {};
    
    Object.values(publishedTimetables).forEach((table: any) => {
        const grid = table.grid || table;
        Object.values(grid).forEach((session: any) => {
            if (!session) return;
            const fid = session.facultyId;
            if (fid) {
                workload[fid] = (workload[fid] || 0) + 1;
            }
        });
    });
    
    return workload;
}

/**
 * Automatically find a replacement for a faculty's period.
 * Priority: Lowest Workload -> Same branch -> Other branch.
 * Constraints: No double bookings, No HODs.
 */
export function findReplacementFaculty(
    branch: string,
    year: number,
    section: string,
    day: string,
    time: string,
    originalFacultyId: string,
    publishedTimetables: Record<string, any>
) {
    const workloadMap = getWorkloadMap(publishedTimetables);
    
    // 1. Filter out HODs and the person on leave
    const eligibleFaculty = MOCK_FACULTY.filter(f => 
        !f.designation.includes('HOD') && 
        f.id !== originalFacultyId
    );
    
    // 2. Sort candidates:
    // First by branch (same branch prioritized), then by workload (lowest first)
    const candidates = [...eligibleFaculty].sort((a, b) => {
        // Direct branch match is a strong bonus
        const aSameBranch = a.department === branch;
        const bSameBranch = b.department === branch;
        
        if (aSameBranch !== bSameBranch) {
            return aSameBranch ? -1 : 1;
        }
        
        // Then by workload (lowest first)
        const aLoad = workloadMap[a.id] || 0;
        const bLoad = workloadMap[b.id] || 0;
        return aLoad - bLoad;
    });

    for (const faculty of candidates) {
        // Double check availability
        let isAvailable = true;
        for (const [key, table] of Object.entries(publishedTimetables)) {
            const grid = table.grid || table;
            const session = grid[`${day}-${time}`];
            
            if (session) {
                // Check by ID or Name
                if (session.facultyId === faculty.id || 
                   (session.faculty && session.faculty.toLowerCase().includes(faculty.name.toLowerCase()))) {
                    isAvailable = false;
                    break;
                }
            }
        }

        if (isAvailable) {
            return faculty;
        }
    }

    return null; // No one available
}

/**
 * Handle Leave Approval: Reallocate all periods for the faculty during leave.
 */
export function reallocateLeavePeriods(
    facultyId: string, 
    startDate: string, 
    duration: number,
    publishedTimetables: Record<string, any>,
    leaveRequestId: string // Added to link replacements to the parent leave
) {
    const newRequests: any[] = [];
    let totalAdjustments = 0;
    const adjustments: any[] = [];

    // All possible dates for the leave
    const leaveDates: string[] = [];
    const baseDate = new Date(startDate);
    for (let i = 0; i < duration; i++) {
        const d = new Date(baseDate);
        d.setDate(baseDate.getDate() + i);
        // Skip Sundays
        if (d.getDay() !== 0) {
            leaveDates.push(d.toISOString().split('T')[0]);
        }
    }

    const targetFaculty = MOCK_FACULTY.find(f => f.id === facultyId || f.rollNumber === facultyId);
    if (!targetFaculty) return { newRequests, totalAdjustments: 0, adjustments: [] };

    // For each date of the leave, find what this person taught based on the weekly grid
    leaveDates.forEach(date => {
        const dObj = new Date(date);
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayName = dayNames[dObj.getDay()];

        Object.entries(publishedTimetables).forEach(([sectionKey, entry]: [string, any]) => {
            const grid = entry.grid || entry;
            
            Object.entries(grid).forEach(([dayTime, session]: [string, any]) => {
                if (!session) return;
                const [sDay, sTime] = dayTime.split('-');
                
                if (sDay === dayName) {
                    const isMatch = session.facultyId === targetFaculty.id || 
                                   session.facultyId === targetFaculty.rollNumber ||
                                   (session.faculty && targetFaculty.name && session.faculty.toLowerCase().includes(targetFaculty.name.toLowerCase()));

                    if (isMatch) {
                        const [dept, year, sem, section] = sectionKey.split('-');
                        const replacement = findReplacementFaculty(
                            dept, parseInt(year), section, sDay, sTime, facultyId, publishedTimetables
                        );

                        if (replacement) {
                            newRequests.push({
                                id: `leave-adj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                                type: 'replacement',
                                status: 'approved',
                                senderId: facultyId,
                                senderName: targetFaculty.name,
                                targetId: replacement.id,
                                targetName: replacement.name,
                                date: date,
                                period: sTime,
                                section: sectionKey, // STRICT SECTION TARGETING
                                branch: dept,
                                year: year,
                                sectionName: section,
                                room: session.room || "TBD",
                                parentId: leaveRequestId,
                                reason: 'Automated substitution during leave',
                                timestamp: Date.now()
                            });
                            
                            totalAdjustments++;
                            adjustments.push({
                                section: sectionKey,
                                day: sDay,
                                time: sTime,
                                subject: session.subject || session.name || session.courseCode,
                                oldFaculty: targetFaculty.name,
                                newFaculty: replacement.name
                            });
                        }
                    }
                }
            });
        });
    });

    return { newRequests, totalAdjustments, adjustments };
}

/**
 * Handle Period Swap: Exchange periods between two faculty members.
 */
export function executeSwap(
    req: { senderId: string, targetId: string, date: string, period: string },
    publishedTimetables: Record<string, any>
) {
    const updatedTimetables = { ...publishedTimetables };
    let totalAdjustments = 0;
    const adjustments: any[] = [];
    const [startTime] = req.period.split('-');
    
    // Period format in DB might be different, let's normalize
    const timeMap: Record<string, string> = { 
        "09:30": "09:30", "09:40": "09:30",
        "10:30": "10:30", "10:40": "10:30", 
        "11:40": "11:40",
        "13:30": "01:30", "01:30": "01:30", "01:20": "01:30",
        "14:30": "02:30", "02:30": "02:30", "02:20": "02:30",
        "15:30": "03:30", "03:30": "03:30", "03:20": "03:30"
    };
    const dObj = new Date(req.date);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const targetDay = dayNames[dObj.getDay()];
    const targetTime = timeMap[startTime] || startTime;

    Object.entries(updatedTimetables).forEach(([sectionKey, entry]: [string, any]) => {
        const grid = { ...(entry.grid || entry) };
        let entryModified = false;

        Object.entries(grid).forEach(([dayTime, session]: [string, any]) => {
            if (!session) return;
            const [day, time] = dayTime.split('-');
            
            // If this is the specific slot at the specific time AND DAY
            if (day === targetDay && time === targetTime) {
                const sender = MOCK_FACULTY.find(f => f.id === req.senderId);
                const target = MOCK_FACULTY.find(f => f.id === req.targetId);

                // If sender was assigned, give to target
                if (session.facultyId === req.senderId || (session.faculty && session.faculty.toLowerCase().includes(sender?.name.toLowerCase() || ''))) {
                    grid[dayTime] = {
                        ...session,
                        facultyId: req.targetId,
                        faculty: target?.name || req.targetId,
                        originalFacultyId: session.facultyId || req.senderId,
                        originalFacultyName: session.faculty || sender?.name || req.senderId,
                        isSwap: true
                    };
                    entryModified = true;
                    totalAdjustments++;
                    adjustments.push({
                        section: sectionKey,
                        day,
                        time,
                        subject: session.subject || session.name || session.courseCode
                    });
                }
            }
        });

        if (entryModified) {
            if (entry.grid) {
                updatedTimetables[sectionKey] = { ...entry, grid };
            } else {
                updatedTimetables[sectionKey] = grid;
            }
        }
    });

    return { updatedTimetables, totalAdjustments, adjustments };
}

/**
 * Undo Leave Reallocation: Restore original faculty to their periods.
 */
export function revertLeavePeriods(facultyId: string, publishedTimetables: Record<string, any>) {
    const updatedTimetables = { ...publishedTimetables };
    let totalRestored = 0;

    Object.entries(updatedTimetables).forEach(([sectionKey, entry]: [string, any]) => {
        const grid = { ...(entry.grid || entry) };
        let entryModified = false;

        Object.entries(grid).forEach(([dayTime, session]: [string, any]) => {
            if (!session) return;
            
            if (session.originalFacultyId) {
                // If this session was modified for THIS faculty (either they were replaced OR they were the substitute)
                // But specifically for Leave, we revert things where originalFacultyId is the one returning
                if (session.originalFacultyId === facultyId) {
                    grid[dayTime] = {
                        ...session,
                        facultyId: session.originalFacultyId,
                        faculty: session.originalFacultyName || session.faculty,
                        isReplacement: false,
                        isSwap: false
                    };
                    delete grid[dayTime].originalFacultyId;
                    delete grid[dayTime].originalFacultyName;
                    entryModified = true;
                    totalRestored++;
                }
            }
        });

        if (entryModified) {
            if (entry.grid) {
                updatedTimetables[sectionKey] = { ...entry, grid };
            } else {
                updatedTimetables[sectionKey] = grid;
            }
        }
    });

    return { updatedTimetables, totalRestored };
}

/**
 * Specifically revert a single swap/replacement request.
 */
export function revertSpecificRequest(req: any, publishedTimetables: Record<string, any>) {
    const updatedTimetables = { ...publishedTimetables };
    const [startTime] = (req.period || "").split('-');
    
    const timeMap: Record<string, string> = { 
        "09:30": "09:30", "09:40": "09:30",
        "10:30": "10:30", "10:40": "10:30", 
        "11:40": "11:40",
        "13:30": "01:30", "01:30": "01:30", "01:20": "01:30",
        "14:30": "02:30", "02:30": "02:30", "02:20": "02:30",
        "15:30": "03:30", "03:30": "03:30", "03:20": "03:30"
    };
    const targetTime = timeMap[startTime] || startTime;
    const dObj = new Date(req.date);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const targetDay = dayNames[dObj.getDay()];

    Object.entries(updatedTimetables).forEach(([sectionKey, entry]: [string, any]) => {
        const grid = { ...(entry.grid || entry) };
        let entryModified = false;

        Object.entries(grid).forEach(([dayTime, session]: [string, any]) => {
            if (!session) return;
            const [day, time] = dayTime.split('-');
            
            if (day === targetDay && time === targetTime) {
                // If this session is currently held by the targetId AND was originally held by senderId
                if (session.facultyId === req.targetId && session.originalFacultyId === req.senderId) {
                    grid[dayTime] = {
                        ...session,
                        facultyId: session.originalFacultyId,
                        faculty: session.originalFacultyName || session.faculty,
                        isSwap: false,
                        isReplacement: false
                    };
                    delete grid[dayTime].originalFacultyId;
                    delete grid[dayTime].originalFacultyName;
                    entryModified = true;
                }
            }
        });

        if (entryModified) {
            if (entry.grid) {
                updatedTimetables[sectionKey] = { ...entry, grid };
            } else {
                updatedTimetables[sectionKey] = grid;
            }
        }
    });

    return updatedTimetables;
}


