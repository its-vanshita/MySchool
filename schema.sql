-- ══════════════════════════════════════════════════════════════
-- MySchool — Supabase PostgreSQL Schema
-- ══════════════════════════════════════════════════════════════
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor).
--
-- Tables prefixed with `ms_` to avoid conflicts with existing
-- ClassPulse / ParentPulse tables in the same Supabase project.
--
-- After running, enable Realtime for the relevant tables:
--   Dashboard → Database → Replication → Enable for:
--   users, timetable, classes, class_students,
--   ms_attendance, ms_notices, ms_announcements,
--   ms_leave_requests, ms_lesson_plans, ms_exams,
--   ms_calendar_events
-- ══════════════════════════════════════════════════════════════


-- ─── Users (Shared staff table) ──────────────────────────────
-- Stores teachers, admins, principals, and parents.
CREATE TABLE IF NOT EXISTS users (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  unique_id       TEXT UNIQUE NOT NULL,                    -- e.g. MS-2024-001
  email           TEXT UNIQUE NOT NULL,
  full_name       TEXT NOT NULL DEFAULT '',
  name            TEXT NOT NULL DEFAULT '',
  phone           TEXT DEFAULT '',
  role            TEXT CHECK (role IN ('teacher', 'admin', 'principal', 'parent')) NOT NULL DEFAULT 'teacher',
  subjects        TEXT[] DEFAULT '{}',
  avatar_url      TEXT DEFAULT '',
  school_id       TEXT DEFAULT '',
  is_first_login  BOOLEAN DEFAULT true,                    -- true until user sets own password
  created_at      TIMESTAMPTZ DEFAULT now()
);


-- ─── Classes ─────────────────────────────────────────────────
-- School classes (e.g. "Class 10-A")
CREATE TABLE IF NOT EXISTS classes (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  grade       TEXT DEFAULT '',
  section     TEXT DEFAULT '',
  school_id   TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now()
);


-- ─── Class ↔ Students join ───────────────────────────────────
CREATE TABLE IF NOT EXISTS class_students (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id    UUID REFERENCES classes(id) ON DELETE CASCADE,
  name        TEXT NOT NULL DEFAULT '',
  roll_number TEXT DEFAULT '',
  parent_email TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now()
);


-- ─── Timetable ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS timetable (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id  UUID REFERENCES users(id) ON DELETE CASCADE,
  subject     TEXT NOT NULL,
  class_name  TEXT NOT NULL DEFAULT '',
  room        TEXT DEFAULT '',
  start_time  TEXT NOT NULL DEFAULT '08:00',  -- HH:mm
  end_time    TEXT NOT NULL DEFAULT '08:45',  -- HH:mm
  day         TEXT CHECK (day IN (
                'monday','tuesday','wednesday','thursday','friday','saturday'
              )) NOT NULL,
  school_id   TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now()
);


-- ─── Attendance (MySchool) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS ms_attendance (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id    UUID REFERENCES classes(id) ON DELETE CASCADE,
  student_id  UUID REFERENCES class_students(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  status      TEXT CHECK (status IN ('present','absent','late','excused')) NOT NULL DEFAULT 'present',
  marked_by   UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (student_id, date)
);


-- ─── Notices (sent to students / classes) ────────────────────
CREATE TABLE IF NOT EXISTS ms_notices (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title           TEXT NOT NULL,
  message         TEXT DEFAULT '',
  class_id        UUID REFERENCES classes(id) ON DELETE SET NULL,
  class_name      TEXT DEFAULT '',
  attachment_url  TEXT DEFAULT '',
  type            TEXT CHECK (type IN ('general','urgent','event','holiday','exam'))
                    NOT NULL DEFAULT 'general',
  created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  creator_name    TEXT DEFAULT '',
  created_at      TIMESTAMPTZ DEFAULT now()
);


-- ─── Announcements (staff-wide broadcast) ────────────────────
CREATE TABLE IF NOT EXISTS ms_announcements (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  message     TEXT DEFAULT '',
  priority    TEXT CHECK (priority IN ('low','normal','high','urgent'))
                NOT NULL DEFAULT 'normal',
  created_by  UUID REFERENCES users(id) ON DELETE SET NULL,
  creator_name TEXT DEFAULT '',
  school_id   TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now()
);


-- ─── Leave Requests ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ms_leave_requests (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  teacher_name    TEXT DEFAULT '',
  from_date       DATE NOT NULL,
  to_date         DATE NOT NULL,
  reason          TEXT DEFAULT '',
  status          TEXT CHECK (status IN ('pending','approved','rejected'))
                    NOT NULL DEFAULT 'pending',
  approved_by     UUID REFERENCES users(id) ON DELETE SET NULL,
  approver_name   TEXT DEFAULT '',
  created_at      TIMESTAMPTZ DEFAULT now()
);


-- ─── Lesson Plans ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ms_lesson_plans (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id  UUID REFERENCES users(id) ON DELETE CASCADE,
  subject     TEXT NOT NULL,
  topic       TEXT NOT NULL,
  description TEXT DEFAULT '',
  file_url    TEXT DEFAULT '',
  class_name  TEXT DEFAULT '',
  uploaded_at TIMESTAMPTZ DEFAULT now()
);


-- ─── Exams / Datesheet ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS ms_exams (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  class_name  TEXT NOT NULL DEFAULT '',
  subject     TEXT NOT NULL,
  exam_date   DATE NOT NULL,
  start_time  TEXT DEFAULT '',
  end_time    TEXT DEFAULT '',
  room        TEXT DEFAULT '',
  school_id   TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now()
);


-- ─── Homework ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ms_homework (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id  UUID REFERENCES users(id) ON DELETE CASCADE,
  class_id    UUID REFERENCES classes(id) ON DELETE SET NULL,
  class_name  TEXT DEFAULT '',
  subject     TEXT NOT NULL,
  title       TEXT NOT NULL,
  description TEXT DEFAULT '',
  due_date    DATE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);


-- ─── Calendar Events ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ms_calendar_events (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  type        TEXT CHECK (type IN ('holiday','event','exam','meeting'))
                NOT NULL DEFAULT 'event',
  date        DATE NOT NULL,
  end_date    DATE,
  description TEXT DEFAULT '',
  school_id   TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now()
);


-- ══════════════════════════════════════════════════════════════
-- Storage Bucket (for lesson plan / notice attachments)
-- ══════════════════════════════════════════════════════════════
-- Create via Dashboard → Storage → New Bucket → "myschool-files"  (public)
-- Or uncomment below (requires service_role key in SQL Editor):
--
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('myschool-files', 'myschool-files', true)
-- ON CONFLICT DO NOTHING;


-- ══════════════════════════════════════════════════════════════
-- Row Level Security
-- ══════════════════════════════════════════════════════════════
-- For simplicity: authenticated users can read/write all rows.
-- In production, tighten policies per role & school_id.

ALTER TABLE users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes              ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_students       ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable            ENABLE ROW LEVEL SECURITY;
ALTER TABLE ms_attendance        ENABLE ROW LEVEL SECURITY;
ALTER TABLE ms_notices           ENABLE ROW LEVEL SECURITY;
ALTER TABLE ms_announcements     ENABLE ROW LEVEL SECURITY;
ALTER TABLE ms_leave_requests    ENABLE ROW LEVEL SECURITY;
ALTER TABLE ms_lesson_plans      ENABLE ROW LEVEL SECURITY;
ALTER TABLE ms_homework          ENABLE ROW LEVEL SECURITY;
ALTER TABLE ms_exams             ENABLE ROW LEVEL SECURITY;
ALTER TABLE ms_calendar_events   ENABLE ROW LEVEL SECURITY;

-- Authenticated-only access (read + write)
CREATE POLICY "auth_all" ON users              FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_all" ON classes             FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_all" ON class_students      FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_all" ON timetable           FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_all" ON ms_attendance       FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_all" ON ms_notices          FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_all" ON ms_announcements    FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_all" ON ms_leave_requests   FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_all" ON ms_lesson_plans     FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_all" ON ms_homework          FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_all" ON ms_exams            FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_all" ON ms_calendar_events  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- ══════════════════════════════════════════════════════════════
-- Enable Realtime (publication)
-- ══════════════════════════════════════════════════════════════
-- Supabase uses `supabase_realtime` publication.
-- Add MySchool tables so clients can subscribe to live changes.

ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE timetable;
ALTER PUBLICATION supabase_realtime ADD TABLE classes;
ALTER PUBLICATION supabase_realtime ADD TABLE class_students;
ALTER PUBLICATION supabase_realtime ADD TABLE ms_attendance;
ALTER PUBLICATION supabase_realtime ADD TABLE ms_notices;
ALTER PUBLICATION supabase_realtime ADD TABLE ms_announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE ms_leave_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE ms_lesson_plans;
ALTER PUBLICATION supabase_realtime ADD TABLE ms_homework;
ALTER PUBLICATION supabase_realtime ADD TABLE ms_exams;
ALTER PUBLICATION supabase_realtime ADD TABLE ms_calendar_events;


-- ══════════════════════════════════════════════════════════════
-- Helpful Indexes
-- ══════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_timetable_teacher  ON timetable(teacher_id);
CREATE INDEX IF NOT EXISTS idx_timetable_day      ON timetable(day);
CREATE INDEX IF NOT EXISTS idx_ms_attendance_date ON ms_attendance(date);
CREATE INDEX IF NOT EXISTS idx_ms_attendance_cls  ON ms_attendance(class_id);
CREATE INDEX IF NOT EXISTS idx_ms_notices_type    ON ms_notices(type);
CREATE INDEX IF NOT EXISTS idx_ms_leave_teacher   ON ms_leave_requests(teacher_id);
CREATE INDEX IF NOT EXISTS idx_ms_leave_status    ON ms_leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_ms_homework_teacher ON ms_homework(teacher_id);
CREATE INDEX IF NOT EXISTS idx_ms_homework_class   ON ms_homework(class_id);
CREATE INDEX IF NOT EXISTS idx_ms_homework_due     ON ms_homework(due_date);
CREATE INDEX IF NOT EXISTS idx_ms_exams_date      ON ms_exams(exam_date);
CREATE INDEX IF NOT EXISTS idx_ms_calendar_date   ON ms_calendar_events(date);
CREATE INDEX IF NOT EXISTS idx_ms_calendar_type   ON ms_calendar_events(type);


-- ══════════════════════════════════════════════════════════════
-- Optional: Seed data for testing
-- ══════════════════════════════════════════════════════════════

-- Example school classes
-- INSERT INTO classes (name, grade, section, school_id) VALUES
--   ('Class 10-A', '10', 'A', 'school-1'),
--   ('Class 10-B', '10', 'B', 'school-1'),
--   ('Class 9-A',  '9',  'A', 'school-1');

-- Example timetable entries (requires a valid teacher UUID)
-- INSERT INTO timetable (teacher_id, subject, class_name, room, start_time, end_time, day, school_id) VALUES
--   ('<teacher-uuid>', 'Mathematics', 'Class 10-A', '101', '08:00', '08:45', 'monday', 'school-1'),
--   ('<teacher-uuid>', 'Physics',     'Class 10-B', '102', '09:00', '09:45', 'monday', 'school-1');
