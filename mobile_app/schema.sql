-- ══════════════════════════════════════════════════════════════
-- VidDarpan – Complete Supabase Schema
-- ══════════════════════════════════════════════════════════════
-- Run this in Supabase → SQL Editor  (in one go).
-- All tables use UUID PKs, created_at timestamps, and have
-- RLS enabled with role-aware policies.
--
-- DEPENDENCY ORDER:
--   1. users             (standalone — auth.users FK)
--   2. schools           (standalone)
--   3. classes           (FK → schools)
--   4. class_students    (FK → classes, users)
--   5. timetable         (FK → users)
--   6. ms_attendance     (FK → classes, class_students, users)
--   7. ms_notices        (FK → classes, users)
--   8. ms_announcements  (FK → users)
--   9. ms_leave_requests (FK → users)
--  10. ms_lesson_plans   (FK → users)
--  11. ms_exams          (standalone)
--  12. ms_exam_duties    (FK → users, ms_exams)
--  13. ms_homework       (FK → users, classes)
--  14. ms_calendar_events(standalone)
--  15. ms_fee_structure  (FK → classes)
--  16. ms_fee_payments   (FK → class_students, ms_fee_structure, users)
--  17. ms_marks          (FK → class_students, ms_exams, users)
--  18. ms_student_documents (FK → class_students, users)
-- ══════════════════════════════════════════════════════════════


-- ┌─────────────────────────────────────────────────────────────┐
-- │  HELPER: updated_at trigger function                       │
-- └─────────────────────────────────────────────────────────────┘
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ┌─────────────────────────────────────────────────────────────┐
-- │  HELPER: auto-create user profile on auth.users insertion  │
-- └─────────────────────────────────────────────────────────────┘
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, unique_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(split_part(NEW.email, '@', 1), 'User'),
    UPPER(REPLACE(NEW.id::TEXT, '-', ''))  -- temporary unique_id from UUID
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ══════════════════════════════════════════════════════════════
-- 1. USERS  (staff / teachers / admins / parents / super_admin)
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.users (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  unique_id       TEXT UNIQUE NOT NULL,
  email           TEXT UNIQUE NOT NULL,
  full_name       TEXT NOT NULL DEFAULT '',
  name            TEXT NOT NULL DEFAULT '',
  phone           TEXT DEFAULT '',
  role            TEXT NOT NULL DEFAULT 'teacher'
                    CHECK (role IN ('teacher','admin','principal','parent','super_admin')),
  subjects        TEXT[] DEFAULT '{}',
  designation     TEXT DEFAULT '',
  avatar_url      TEXT DEFAULT '',
  school_id       TEXT DEFAULT '',
  is_first_login  BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile row when a new user signs up via Supabase Auth
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();


-- ══════════════════════════════════════════════════════════════
-- 2. SCHOOLS
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.schools (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  address     TEXT DEFAULT '',
  logo_url    TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER trg_schools_updated_at
  BEFORE UPDATE ON public.schools
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ══════════════════════════════════════════════════════════════
-- 3. CLASSES
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.classes (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  grade       TEXT DEFAULT '',
  section     TEXT DEFAULT '',
  school_id   TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER trg_classes_updated_at
  BEFORE UPDATE ON public.classes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ══════════════════════════════════════════════════════════════
-- 4. CLASS_STUDENTS  (student roster per class)
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.class_students (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id     UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  name         TEXT NOT NULL DEFAULT '',
  roll_number  TEXT DEFAULT '',
  parent_email TEXT DEFAULT '',
  dob          DATE,
  section      TEXT DEFAULT '',
  photo_url    TEXT DEFAULT '',
  parent_id    UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER trg_class_students_updated_at
  BEFORE UPDATE ON public.class_students
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ══════════════════════════════════════════════════════════════
-- 5. TIMETABLE
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.timetable (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id  UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subject     TEXT NOT NULL,
  class_name  TEXT NOT NULL DEFAULT '',
  room        TEXT DEFAULT '',
  start_time  TEXT NOT NULL DEFAULT '08:00',
  end_time    TEXT NOT NULL DEFAULT '08:45',
  day         TEXT NOT NULL
                CHECK (day IN ('monday','tuesday','wednesday','thursday','friday','saturday')),
  school_id   TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER trg_timetable_updated_at
  BEFORE UPDATE ON public.timetable
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ══════════════════════════════════════════════════════════════
-- 6. ATTENDANCE
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.ms_attendance (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id    UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id  UUID NOT NULL REFERENCES public.class_students(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  status      TEXT NOT NULL DEFAULT 'present'
                CHECK (status IN ('present','absent','late','excused')),
  marked_by   UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (student_id, date)
);


-- ══════════════════════════════════════════════════════════════
-- 7. NOTICES  (to students / parents)
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.ms_notices (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title           TEXT NOT NULL,
  message         TEXT DEFAULT '',
  class_id        UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  class_name      TEXT DEFAULT '',
  attachment_url  TEXT DEFAULT '',
  type            TEXT NOT NULL DEFAULT 'general'
                    CHECK (type IN ('general','urgent','event','holiday','exam')),
  created_by      UUID REFERENCES public.users(id) ON DELETE SET NULL,
  creator_name    TEXT DEFAULT '',
  created_at      TIMESTAMPTZ DEFAULT now()
);


-- ══════════════════════════════════════════════════════════════
-- 8. ANNOUNCEMENTS  (staff-wide internal broadcast)
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.ms_announcements (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title        TEXT NOT NULL,
  message      TEXT DEFAULT '',
  priority     TEXT NOT NULL DEFAULT 'normal'
                 CHECK (priority IN ('low','normal','high','urgent')),
  created_by   UUID REFERENCES public.users(id) ON DELETE SET NULL,
  creator_name TEXT DEFAULT '',
  school_id    TEXT DEFAULT '',
  created_at   TIMESTAMPTZ DEFAULT now()
);


-- ══════════════════════════════════════════════════════════════
-- 9. LEAVE REQUESTS
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.ms_leave_requests (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  teacher_name   TEXT DEFAULT '',
  from_date      DATE NOT NULL,
  to_date        DATE NOT NULL,
  reason         TEXT DEFAULT '',
  status         TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','approved','rejected')),
  approved_by    UUID REFERENCES public.users(id) ON DELETE SET NULL,
  approver_name  TEXT DEFAULT '',
  created_at     TIMESTAMPTZ DEFAULT now()
);


-- ══════════════════════════════════════════════════════════════
-- 10. LESSON PLANS
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.ms_lesson_plans (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id  UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subject     TEXT NOT NULL,
  topic       TEXT NOT NULL,
  description TEXT DEFAULT '',
  file_url    TEXT DEFAULT '',
  class_name  TEXT DEFAULT '',
  uploaded_at TIMESTAMPTZ DEFAULT now()
);


-- ══════════════════════════════════════════════════════════════
-- 11. EXAMS / DATESHEET
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.ms_exams (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  class_name  TEXT NOT NULL DEFAULT '',
  subject     TEXT NOT NULL,
  exam_date   DATE NOT NULL,
  start_time  TEXT DEFAULT '',
  end_time    TEXT DEFAULT '',
  room        TEXT DEFAULT '',
  exam_type   TEXT DEFAULT 'other'
                CHECK (exam_type IN ('half-yearly','annual','unit-test','pre-board','practical','other')),
  school_id   TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now()
);


-- ══════════════════════════════════════════════════════════════
-- 12. EXAM DUTIES  (invigilation / duty roster)
--     Matches the ExamDuty TypeScript interface
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.ms_exam_duties (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id  UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  exam_id     UUID REFERENCES public.ms_exams(id) ON DELETE SET NULL,
  exam_date   DATE NOT NULL,
  room        TEXT DEFAULT '',
  start_time  TEXT DEFAULT '',
  end_time    TEXT DEFAULT '',
  class_name  TEXT DEFAULT '',
  exam_type   TEXT DEFAULT 'other'
                CHECK (exam_type IN ('half-yearly','annual','unit-test','pre-board','practical','other')),
  school_id   TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now()
);


-- ══════════════════════════════════════════════════════════════
-- 13. HOMEWORK
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.ms_homework (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id  UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  class_id    UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  class_name  TEXT DEFAULT '',
  subject     TEXT NOT NULL,
  title       TEXT NOT NULL,
  description TEXT DEFAULT '',
  due_date    DATE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);


-- ══════════════════════════════════════════════════════════════
-- 14. CALENDAR EVENTS
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.ms_calendar_events (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  type        TEXT NOT NULL DEFAULT 'event'
                CHECK (type IN ('holiday','event','exam','meeting')),
  date        DATE NOT NULL,
  end_date    DATE,
  description TEXT DEFAULT '',
  school_id   TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now()
);


-- ══════════════════════════════════════════════════════════════
-- 15. FEE STRUCTURE
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.ms_fee_structure (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id      UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  class_name    TEXT DEFAULT '',
  fee_type      TEXT NOT NULL DEFAULT 'tuition'
                  CHECK (fee_type IN ('tuition','transport','library','lab','exam','sports','other')),
  amount        NUMERIC(10,2) NOT NULL DEFAULT 0,
  frequency     TEXT NOT NULL DEFAULT 'monthly'
                  CHECK (frequency IN ('monthly','quarterly','half_yearly','yearly','one_time')),
  academic_year TEXT DEFAULT '',
  school_id     TEXT DEFAULT '',
  created_at    TIMESTAMPTZ DEFAULT now()
);


-- ══════════════════════════════════════════════════════════════
-- 16. FEE PAYMENTS
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.ms_fee_payments (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id       UUID NOT NULL REFERENCES public.class_students(id) ON DELETE CASCADE,
  fee_structure_id UUID REFERENCES public.ms_fee_structure(id) ON DELETE SET NULL,
  amount_paid      NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_date     DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method   TEXT NOT NULL DEFAULT 'cash'
                     CHECK (payment_method IN ('cash','upi','bank_transfer','cheque','online')),
  receipt_number   TEXT DEFAULT '',
  status           TEXT NOT NULL DEFAULT 'paid'
                     CHECK (status IN ('paid','partial','pending','overdue')),
  remarks          TEXT DEFAULT '',
  collected_by     UUID REFERENCES public.users(id) ON DELETE SET NULL,
  school_id        TEXT DEFAULT '',
  created_at       TIMESTAMPTZ DEFAULT now()
);


-- ══════════════════════════════════════════════════════════════
-- 17. STUDENT MARKS / RESULTS
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.ms_marks (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id      UUID NOT NULL REFERENCES public.class_students(id) ON DELETE CASCADE,
  exam_id         UUID NOT NULL REFERENCES public.ms_exams(id) ON DELETE CASCADE,
  subject         TEXT NOT NULL,
  marks_obtained  NUMERIC(5,2) NOT NULL DEFAULT 0,
  max_marks       NUMERIC(5,2) NOT NULL DEFAULT 100,
  grade           TEXT DEFAULT '',
  remarks         TEXT DEFAULT '',
  entered_by      UUID REFERENCES public.users(id) ON DELETE SET NULL,
  school_id       TEXT DEFAULT '',
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE (student_id, exam_id, subject)
);


-- ══════════════════════════════════════════════════════════════
-- 18. STUDENT DOCUMENTS
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.ms_student_documents (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id  UUID NOT NULL REFERENCES public.class_students(id) ON DELETE CASCADE,
  doc_type    TEXT NOT NULL DEFAULT 'other'
                CHECK (doc_type IN ('birth_certificate','transfer_certificate','marksheet','aadhaar','photo','medical','other')),
  file_url    TEXT NOT NULL,
  file_name   TEXT DEFAULT '',
  uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  school_id   TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now()
);


-- ══════════════════════════════════════════════════════════════
-- STORAGE BUCKETS
-- ══════════════════════════════════════════════════════════════
-- Bucket 1: lesson plans + notice attachments (public read)
INSERT INTO storage.buckets (id, name, public)
  VALUES ('myschool-files', 'myschool-files', true)
  ON CONFLICT (id) DO NOTHING;

-- Bucket 2: student documents (private — requires auth)
INSERT INTO storage.buckets (id, name, public)
  VALUES ('student-documents', 'student-documents', false)
  ON CONFLICT (id) DO NOTHING;

-- Bucket 3: user avatars (public read)
INSERT INTO storage.buckets (id, name, public)
  VALUES ('avatars', 'avatars', true)
  ON CONFLICT (id) DO NOTHING;

-- Storage policies — authenticated users can upload/read
CREATE POLICY "auth_upload" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id IN ('myschool-files','student-documents','avatars'));

CREATE POLICY "auth_update" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id IN ('myschool-files','student-documents','avatars'));

CREATE POLICY "auth_read" ON storage.objects FOR SELECT
  TO authenticated USING (bucket_id IN ('myschool-files','student-documents','avatars'));

CREATE POLICY "public_read" ON storage.objects FOR SELECT
  TO anon USING (bucket_id IN ('myschool-files','avatars'));

CREATE POLICY "auth_delete" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id IN ('myschool-files','student-documents','avatars'));


-- ══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY — ENABLE ON ALL TABLES
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_students      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ms_attendance       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ms_notices          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ms_announcements    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ms_leave_requests   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ms_lesson_plans     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ms_exams            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ms_exam_duties      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ms_homework         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ms_calendar_events  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ms_fee_structure    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ms_fee_payments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ms_marks            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ms_student_documents ENABLE ROW LEVEL SECURITY;


-- ══════════════════════════════════════════════════════════════
-- RLS POLICIES
-- ══════════════════════════════════════════════════════════════
-- Helper: get current user's role from the users table
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ── USERS ───────────────────────────────────────────────────
-- All authenticated users can read the users table (needed for lookups)
CREATE POLICY "users_select" ON public.users FOR SELECT
  TO authenticated USING (true);
-- Users can update their own row
CREATE POLICY "users_update_self" ON public.users FOR UPDATE
  TO authenticated USING (id = auth.uid());
-- Admins/principals/super_admin can insert & update any user
CREATE POLICY "users_admin_insert" ON public.users FOR INSERT
  TO authenticated WITH CHECK (public.get_my_role() IN ('admin','principal','super_admin'));
CREATE POLICY "users_admin_update" ON public.users FOR UPDATE
  TO authenticated USING (public.get_my_role() IN ('admin','principal','super_admin'));

-- ── SCHOOLS ─────────────────────────────────────────────────
CREATE POLICY "schools_select" ON public.schools FOR SELECT TO authenticated USING (true);
CREATE POLICY "schools_admin_all" ON public.schools FOR ALL
  TO authenticated USING (public.get_my_role() IN ('admin','principal','super_admin'))
  WITH CHECK (public.get_my_role() IN ('admin','principal','super_admin'));

-- ── CLASSES ─────────────────────────────────────────────────
CREATE POLICY "classes_select" ON public.classes FOR SELECT TO authenticated USING (true);
CREATE POLICY "classes_admin_all" ON public.classes FOR ALL
  TO authenticated USING (public.get_my_role() IN ('admin','principal','super_admin'))
  WITH CHECK (public.get_my_role() IN ('admin','principal','super_admin'));

-- ── CLASS_STUDENTS ──────────────────────────────────────────
CREATE POLICY "students_select" ON public.class_students FOR SELECT TO authenticated USING (true);
CREATE POLICY "students_admin_all" ON public.class_students FOR ALL
  TO authenticated USING (public.get_my_role() IN ('admin','principal','super_admin'))
  WITH CHECK (public.get_my_role() IN ('admin','principal','super_admin'));

-- ── TIMETABLE ───────────────────────────────────────────────
CREATE POLICY "timetable_select" ON public.timetable FOR SELECT TO authenticated USING (true);
CREATE POLICY "timetable_admin_all" ON public.timetable FOR ALL
  TO authenticated USING (public.get_my_role() IN ('admin','principal','super_admin'))
  WITH CHECK (public.get_my_role() IN ('admin','principal','super_admin'));

-- ── ATTENDANCE ──────────────────────────────────────────────
CREATE POLICY "attendance_select" ON public.ms_attendance FOR SELECT TO authenticated USING (true);
-- Teachers can mark attendance (insert/update)
CREATE POLICY "attendance_teacher_write" ON public.ms_attendance FOR INSERT
  TO authenticated WITH CHECK (public.get_my_role() IN ('teacher','admin','principal','super_admin'));
CREATE POLICY "attendance_teacher_update" ON public.ms_attendance FOR UPDATE
  TO authenticated USING (public.get_my_role() IN ('teacher','admin','principal','super_admin'));

-- ── NOTICES ─────────────────────────────────────────────────
CREATE POLICY "notices_select" ON public.ms_notices FOR SELECT TO authenticated USING (true);
CREATE POLICY "notices_write" ON public.ms_notices FOR INSERT
  TO authenticated WITH CHECK (public.get_my_role() IN ('teacher','admin','principal','super_admin'));
CREATE POLICY "notices_delete" ON public.ms_notices FOR DELETE
  TO authenticated USING (created_by = auth.uid() OR public.get_my_role() IN ('admin','principal','super_admin'));

-- ── ANNOUNCEMENTS ───────────────────────────────────────────
CREATE POLICY "announcements_select" ON public.ms_announcements FOR SELECT TO authenticated USING (true);
CREATE POLICY "announcements_write" ON public.ms_announcements FOR INSERT
  TO authenticated WITH CHECK (public.get_my_role() IN ('admin','principal','super_admin'));
CREATE POLICY "announcements_delete" ON public.ms_announcements FOR DELETE
  TO authenticated USING (created_by = auth.uid() OR public.get_my_role() IN ('admin','principal','super_admin'));

-- ── LEAVE REQUESTS ──────────────────────────────────────────
-- Teachers see their own; admins see all
CREATE POLICY "leave_select_own" ON public.ms_leave_requests FOR SELECT
  TO authenticated USING (teacher_id = auth.uid() OR public.get_my_role() IN ('admin','principal','super_admin'));
CREATE POLICY "leave_insert" ON public.ms_leave_requests FOR INSERT
  TO authenticated WITH CHECK (teacher_id = auth.uid());
CREATE POLICY "leave_update" ON public.ms_leave_requests FOR UPDATE
  TO authenticated USING (teacher_id = auth.uid() OR public.get_my_role() IN ('admin','principal','super_admin'));

-- ── LESSON PLANS ────────────────────────────────────────────
CREATE POLICY "lesson_plans_select" ON public.ms_lesson_plans FOR SELECT TO authenticated USING (true);
CREATE POLICY "lesson_plans_write" ON public.ms_lesson_plans FOR INSERT
  TO authenticated WITH CHECK (teacher_id = auth.uid() OR public.get_my_role() IN ('admin','principal','super_admin'));
CREATE POLICY "lesson_plans_delete" ON public.ms_lesson_plans FOR DELETE
  TO authenticated USING (teacher_id = auth.uid() OR public.get_my_role() IN ('admin','principal','super_admin'));

-- ── EXAMS ───────────────────────────────────────────────────
CREATE POLICY "exams_select" ON public.ms_exams FOR SELECT TO authenticated USING (true);
CREATE POLICY "exams_admin_all" ON public.ms_exams FOR ALL
  TO authenticated USING (public.get_my_role() IN ('admin','principal','super_admin'))
  WITH CHECK (public.get_my_role() IN ('admin','principal','super_admin'));

-- ── EXAM DUTIES ─────────────────────────────────────────────
CREATE POLICY "duties_select" ON public.ms_exam_duties FOR SELECT TO authenticated USING (true);
CREATE POLICY "duties_admin_all" ON public.ms_exam_duties FOR ALL
  TO authenticated USING (public.get_my_role() IN ('admin','principal','super_admin'))
  WITH CHECK (public.get_my_role() IN ('admin','principal','super_admin'));

-- ── HOMEWORK ────────────────────────────────────────────────
CREATE POLICY "homework_select" ON public.ms_homework FOR SELECT TO authenticated USING (true);
CREATE POLICY "homework_write" ON public.ms_homework FOR INSERT
  TO authenticated WITH CHECK (teacher_id = auth.uid() OR public.get_my_role() IN ('admin','principal','super_admin'));
CREATE POLICY "homework_delete" ON public.ms_homework FOR DELETE
  TO authenticated USING (teacher_id = auth.uid() OR public.get_my_role() IN ('admin','principal','super_admin'));

-- ── CALENDAR EVENTS ─────────────────────────────────────────
CREATE POLICY "calendar_select" ON public.ms_calendar_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "calendar_admin_all" ON public.ms_calendar_events FOR ALL
  TO authenticated USING (public.get_my_role() IN ('admin','principal','super_admin'))
  WITH CHECK (public.get_my_role() IN ('admin','principal','super_admin'));

-- ── FEE STRUCTURE ───────────────────────────────────────────
CREATE POLICY "fee_struct_select" ON public.ms_fee_structure FOR SELECT TO authenticated USING (true);
CREATE POLICY "fee_struct_admin_all" ON public.ms_fee_structure FOR ALL
  TO authenticated USING (public.get_my_role() IN ('admin','principal','super_admin'))
  WITH CHECK (public.get_my_role() IN ('admin','principal','super_admin'));

-- ── FEE PAYMENTS ────────────────────────────────────────────
CREATE POLICY "fee_pay_select" ON public.ms_fee_payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "fee_pay_admin_all" ON public.ms_fee_payments FOR ALL
  TO authenticated USING (public.get_my_role() IN ('admin','principal','super_admin'))
  WITH CHECK (public.get_my_role() IN ('admin','principal','super_admin'));

-- ── MARKS ───────────────────────────────────────────────────
CREATE POLICY "marks_select" ON public.ms_marks FOR SELECT TO authenticated USING (true);
CREATE POLICY "marks_write" ON public.ms_marks FOR INSERT
  TO authenticated WITH CHECK (public.get_my_role() IN ('teacher','admin','principal','super_admin'));
CREATE POLICY "marks_update" ON public.ms_marks FOR UPDATE
  TO authenticated USING (public.get_my_role() IN ('teacher','admin','principal','super_admin'));
CREATE POLICY "marks_delete" ON public.ms_marks FOR DELETE
  TO authenticated USING (public.get_my_role() IN ('admin','principal','super_admin'));

-- ── STUDENT DOCUMENTS ───────────────────────────────────────
CREATE POLICY "docs_select" ON public.ms_student_documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "docs_admin_all" ON public.ms_student_documents FOR ALL
  TO authenticated USING (public.get_my_role() IN ('admin','principal','super_admin'))
  WITH CHECK (public.get_my_role() IN ('admin','principal','super_admin'));


-- ══════════════════════════════════════════════════════════════
-- INDEXES  (on frequently queried columns found in service layer)
-- ══════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_users_unique_id      ON public.users(unique_id);
CREATE INDEX IF NOT EXISTS idx_users_email          ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role           ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_school_id      ON public.users(school_id);

CREATE INDEX IF NOT EXISTS idx_classes_school_id    ON public.classes(school_id);

CREATE INDEX IF NOT EXISTS idx_class_students_class ON public.class_students(class_id);
CREATE INDEX IF NOT EXISTS idx_class_students_parent ON public.class_students(parent_id);

CREATE INDEX IF NOT EXISTS idx_timetable_teacher    ON public.timetable(teacher_id);
CREATE INDEX IF NOT EXISTS idx_timetable_day        ON public.timetable(day);
CREATE INDEX IF NOT EXISTS idx_timetable_teacher_day ON public.timetable(teacher_id, day);

CREATE INDEX IF NOT EXISTS idx_attendance_class     ON public.ms_attendance(class_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date      ON public.ms_attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_student   ON public.ms_attendance(student_id);

CREATE INDEX IF NOT EXISTS idx_notices_type         ON public.ms_notices(type);
CREATE INDEX IF NOT EXISTS idx_notices_created_by   ON public.ms_notices(created_by);
CREATE INDEX IF NOT EXISTS idx_notices_class_id     ON public.ms_notices(class_id);

CREATE INDEX IF NOT EXISTS idx_announcements_created ON public.ms_announcements(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_leave_teacher        ON public.ms_leave_requests(teacher_id);
CREATE INDEX IF NOT EXISTS idx_leave_status         ON public.ms_leave_requests(status);

CREATE INDEX IF NOT EXISTS idx_lesson_plans_teacher ON public.ms_lesson_plans(teacher_id);

CREATE INDEX IF NOT EXISTS idx_exams_date           ON public.ms_exams(exam_date);
CREATE INDEX IF NOT EXISTS idx_exams_school         ON public.ms_exams(school_id);

CREATE INDEX IF NOT EXISTS idx_exam_duties_teacher  ON public.ms_exam_duties(teacher_id);
CREATE INDEX IF NOT EXISTS idx_exam_duties_exam     ON public.ms_exam_duties(exam_id);

CREATE INDEX IF NOT EXISTS idx_homework_teacher     ON public.ms_homework(teacher_id);
CREATE INDEX IF NOT EXISTS idx_homework_class       ON public.ms_homework(class_id);
CREATE INDEX IF NOT EXISTS idx_homework_due         ON public.ms_homework(due_date);

CREATE INDEX IF NOT EXISTS idx_calendar_date        ON public.ms_calendar_events(date);
CREATE INDEX IF NOT EXISTS idx_calendar_type        ON public.ms_calendar_events(type);

CREATE INDEX IF NOT EXISTS idx_fee_struct_class     ON public.ms_fee_structure(class_id);
CREATE INDEX IF NOT EXISTS idx_fee_pay_student      ON public.ms_fee_payments(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_pay_status       ON public.ms_fee_payments(status);

CREATE INDEX IF NOT EXISTS idx_marks_student        ON public.ms_marks(student_id);
CREATE INDEX IF NOT EXISTS idx_marks_exam           ON public.ms_marks(exam_id);
CREATE INDEX IF NOT EXISTS idx_marks_student_exam   ON public.ms_marks(student_id, exam_id);

CREATE INDEX IF NOT EXISTS idx_docs_student         ON public.ms_student_documents(student_id);


-- ══════════════════════════════════════════════════════════════
-- REALTIME  (add tables to Supabase realtime publication)
-- ══════════════════════════════════════════════════════════════
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.timetable;
ALTER PUBLICATION supabase_realtime ADD TABLE public.classes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.class_students;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ms_attendance;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ms_notices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ms_announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ms_leave_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ms_lesson_plans;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ms_homework;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ms_exams;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ms_exam_duties;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ms_calendar_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ms_fee_structure;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ms_fee_payments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ms_marks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ms_student_documents;


-- ══════════════════════════════════════════════════════════════
-- DONE — VidDarpan schema is ready.
-- ══════════════════════════════════════════════════════════════
