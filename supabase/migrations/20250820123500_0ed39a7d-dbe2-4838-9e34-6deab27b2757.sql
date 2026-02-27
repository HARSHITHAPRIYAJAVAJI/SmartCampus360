-- Create enum types for better data consistency
CREATE TYPE day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday');
CREATE TYPE session_type AS ENUM ('lecture', 'lab', 'tutorial', 'exam', 'seminar');
CREATE TYPE room_type AS ENUM ('classroom', 'laboratory', 'auditorium', 'seminar_hall', 'exam_hall');
CREATE TYPE timetable_type AS ENUM ('regular', 'exam');

-- Faculty table
CREATE TABLE public.faculty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    employee_id TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    designation TEXT NOT NULL,
    specialization TEXT[],
    max_hours_per_week INTEGER DEFAULT 20,
    availability JSONB DEFAULT '{}', -- Store weekly availability
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Subjects/Courses table
CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_code TEXT UNIQUE NOT NULL,
    subject_name TEXT NOT NULL,
    department TEXT NOT NULL,
    semester INTEGER NOT NULL,
    credits INTEGER NOT NULL,
    theory_hours INTEGER DEFAULT 0,
    lab_hours INTEGER DEFAULT 0,
    tutorial_hours INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Rooms/Classrooms table
CREATE TABLE public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_number TEXT UNIQUE NOT NULL,
    room_name TEXT NOT NULL,
    room_type room_type NOT NULL,
    capacity INTEGER NOT NULL,
    floor INTEGER,
    building TEXT,
    facilities TEXT[], -- ['projector', 'ac', 'whiteboard', 'computers']
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Time slots table
CREATE TABLE public.time_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slot_name TEXT NOT NULL, -- e.g., "Period 1", "Morning Session"
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Academic terms table
CREATE TABLE public.academic_terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    term_name TEXT NOT NULL, -- e.g., "Fall 2024", "Spring 2025"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Main timetable table
CREATE TABLE public.timetable (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    academic_term_id UUID REFERENCES public.academic_terms(id) ON DELETE CASCADE NOT NULL,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
    faculty_id UUID REFERENCES public.faculty(id) ON DELETE CASCADE NOT NULL,
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
    time_slot_id UUID REFERENCES public.time_slots(id) ON DELETE CASCADE NOT NULL,
    day_of_week day_of_week NOT NULL,
    session_type session_type NOT NULL,
    timetable_type timetable_type DEFAULT 'regular',
    student_group TEXT, -- e.g., "CSE-3A", "ECE-2B"
    notes TEXT,
    is_confirmed BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    -- Ensure no conflicts: same room, time slot, day combination
    UNIQUE(room_id, time_slot_id, day_of_week, academic_term_id, timetable_type)
);

-- Faculty subject assignments
CREATE TABLE public.faculty_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID REFERENCES public.faculty(id) ON DELETE CASCADE NOT NULL,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
    academic_term_id UUID REFERENCES public.academic_terms(id) ON DELETE CASCADE NOT NULL,
    can_teach_theory BOOLEAN DEFAULT true,
    can_teach_lab BOOLEAN DEFAULT false,
    preference_score INTEGER DEFAULT 5, -- 1-10 scale
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    UNIQUE(faculty_id, subject_id, academic_term_id)
);

-- Enable RLS on all tables
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_subjects ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Admin access for now, can be refined later)
CREATE POLICY "Allow authenticated users to view faculty" ON public.faculty FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to view subjects" ON public.subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to view rooms" ON public.rooms FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to view time_slots" ON public.time_slots FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to view academic_terms" ON public.academic_terms FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to view timetable" ON public.timetable FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to view faculty_subjects" ON public.faculty_subjects FOR SELECT TO authenticated USING (true);

-- Admin policies for INSERT, UPDATE, DELETE (you can refine these based on user roles)
CREATE POLICY "Allow authenticated users to insert faculty" ON public.faculty FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update faculty" ON public.faculty FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert subjects" ON public.subjects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update subjects" ON public.subjects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert rooms" ON public.rooms FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update rooms" ON public.rooms FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert time_slots" ON public.time_slots FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update time_slots" ON public.time_slots FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert academic_terms" ON public.academic_terms FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update academic_terms" ON public.academic_terms FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert timetable" ON public.timetable FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update timetable" ON public.timetable FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete timetable" ON public.timetable FOR DELETE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert faculty_subjects" ON public.faculty_subjects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update faculty_subjects" ON public.faculty_subjects FOR UPDATE TO authenticated USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_faculty_updated_at BEFORE UPDATE ON public.faculty FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON public.subjects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_academic_terms_updated_at BEFORE UPDATE ON public.academic_terms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_timetable_updated_at BEFORE UPDATE ON public.timetable FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for testing
-- Time slots
INSERT INTO public.time_slots (slot_name, start_time, end_time, duration_minutes) VALUES
('Period 1', '09:00', '09:50', 50),
('Period 2', '09:55', '10:45', 50),
('Period 3', '11:00', '11:50', 50),
('Period 4', '11:55', '12:45', 50),
('Period 5', '14:00', '14:50', 50),
('Period 6', '14:55', '15:45', 50),
('Period 7', '15:50', '16:40', 50),
('Period 8', '16:45', '17:35', 50);

-- Academic term
INSERT INTO public.academic_terms (term_name, start_date, end_date, is_current) VALUES
('Spring 2024', '2024-01-15', '2024-05-30', true);

-- Sample rooms
INSERT INTO public.rooms (room_number, room_name, room_type, capacity, floor, building, facilities) VALUES
('101', 'Classroom 101', 'classroom', 60, 1, 'Academic Block A', ARRAY['projector', 'whiteboard', 'ac']),
('102', 'Classroom 102', 'classroom', 50, 1, 'Academic Block A', ARRAY['projector', 'whiteboard']),
('L201', 'Computer Lab 1', 'laboratory', 30, 2, 'Academic Block A', ARRAY['computers', 'projector', 'ac']),
('L202', 'Physics Lab', 'laboratory', 25, 2, 'Academic Block A', ARRAY['lab_equipment', 'projector']),
('AUD1', 'Main Auditorium', 'auditorium', 200, 0, 'Administrative Block', ARRAY['projector', 'sound_system', 'ac']);

-- Sample subjects
INSERT INTO public.subjects (subject_code, subject_name, department, semester, credits, theory_hours, lab_hours) VALUES
('CSE101', 'Programming Fundamentals', 'Computer Science', 1, 4, 3, 2),
('CSE201', 'Data Structures', 'Computer Science', 3, 4, 3, 2),
('CSE301', 'Database Systems', 'Computer Science', 5, 3, 3, 0),
('PHY101', 'Engineering Physics', 'Physics', 1, 3, 3, 0),
('MATH101', 'Engineering Mathematics I', 'Mathematics', 1, 4, 4, 0);

-- Sample faculty (using placeholder user_ids)
INSERT INTO public.faculty (employee_id, department, designation, specialization, max_hours_per_week) VALUES
('FAC001', 'Computer Science', 'Professor', ARRAY['Programming', 'Algorithms'], 18),
('FAC002', 'Computer Science', 'Associate Professor', ARRAY['Database Systems', 'Data Mining'], 20),
('FAC003', 'Physics', 'Assistant Professor', ARRAY['Engineering Physics', 'Quantum Mechanics'], 22),
('FAC004', 'Mathematics', 'Professor', ARRAY['Calculus', 'Linear Algebra'], 16);

-- Create indexes for performance
CREATE INDEX idx_timetable_academic_term ON public.timetable(academic_term_id);
CREATE INDEX idx_timetable_day_time ON public.timetable(day_of_week, time_slot_id);
CREATE INDEX idx_timetable_room ON public.timetable(room_id);
CREATE INDEX idx_timetable_faculty ON public.timetable(faculty_id);
CREATE INDEX idx_faculty_subjects_faculty ON public.faculty_subjects(faculty_id);
CREATE INDEX idx_faculty_subjects_subject ON public.faculty_subjects(subject_id);