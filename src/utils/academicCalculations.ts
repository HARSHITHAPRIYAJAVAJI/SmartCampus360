import { MOCK_COURSES } from "@/data/mockCourses";

export const calculateAcademicMetrics = (branch: string, currentSemester: number) => {
    const branchCourses = MOCK_COURSES.filter(c => c.department === branch);
    
    const totalCredits = branchCourses.reduce((acc, c) => acc + c.credits, 0);
    
    const earnedCredits = branchCourses
        .filter(c => c.semester < currentSemester)
        .reduce((acc, c) => acc + c.credits, 0);
        
    return {
        totalCredits,
        earnedCredits,
        requiredCredits: 160 // Institutional standard
    };
};
