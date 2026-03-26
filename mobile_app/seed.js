/**
 * SCHOOL MANAGEMENT SYSTEM - DATABASE SEED SCRIPT
 * ------------------------------------------------
 * Populates Supabase with:
 *   - 1 Principal / Admin
 *   - 10 Teachers (1 class teacher + 3 subject teachers per class, across 4 classes)
 *   - 4 Classes
 *   - 20 Students per class (80 total)
 *   - Realistic supporting data (timetable, homework, attendance, announcements, etc.)
 *
 * Run with:  node seed.js
 * Requires:  npm install @supabase/supabase-js
 */

const { createClient } = require("@supabase/supabase-js");

// ─── CONFIG ──────────────────────────────────────────────────────────────────
// The anon key cannot bypass RLS. This script requires the SERVICE ROLE key.
//
// How to get it:
//   Supabase Dashboard → Project Settings → API → "service_role" key (secret)
//
// ⚠️  Never expose the service role key in client-side / React Native code.
//     It is safe to use here because this is a local Node.js seed script only.

const SUPABASE_URL = "https://gebghhwidcvqrlvfnqen.supabase.co";

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "PASTE_YOUR_SERVICE_ROLE_KEY_HERE";

if (SERVICE_ROLE_KEY === "PASTE_YOUR_SERVICE_ROLE_KEY_HERE") {
  console.error(
    "\n❌  Please set your service role key before running:\n" +
    "    Either:\n" +
    "      SUPABASE_SERVICE_ROLE_KEY=your_key node seed.js\n" +
    "    Or paste the key directly into SERVICE_ROLE_KEY in this file.\n" +
    "\n    Find it at: Supabase Dashboard → Project Settings → API → service_role\n"
  );
  process.exit(1);
}

// auth: { autoRefreshToken, persistSession } disabled — not needed in a seed script
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const SCHOOL_ID = "SCH001"; // Used as text school_id across tables
const ACADEMIC_YEAR = "2025-26";

// ─── HELPER UTILITIES ─────────────────────────────────────────────────────────
function pad(n) {
  return String(n).padStart(2, "0");
}

function randomDate(start, end) {
  const d = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function log(msg) {
  console.log(`[SEED] ${msg}`);
}

function logError(context, err) {
  console.error(`[ERROR] ${context}:`, err?.message || err);
}

// ─── MASTER DATA ─────────────────────────────────────────────────────────────

const PRINCIPAL = {
  email: "principal@springdalesch.edu",
  password: "Principal@123",
  full_name: "Dr. Rajendra Kumar Sharma",
  name: "Dr. R.K. Sharma",
  phone: "9810001001",
  role: "principal",
  designation: "Principal",
  unique_id: "EMP001",
  subjects: [],
};

const TEACHERS = [
  {
    email: "amit.verma@springdalesch.edu",
    password: "Teacher@123",
    full_name: "Amit Kumar Verma",
    name: "Amit Verma",
    phone: "9810001002",
    role: "teacher",
    designation: "Senior Teacher",
    unique_id: "EMP002",
    subjects: ["Mathematics"],
  },
  {
    email: "priya.singh@springdalesch.edu",
    password: "Teacher@123",
    full_name: "Priya Singh",
    name: "Priya Singh",
    phone: "9810001003",
    role: "teacher",
    designation: "Teacher",
    unique_id: "EMP003",
    subjects: ["English"],
  },
  {
    email: "suresh.gupta@springdalesch.edu",
    password: "Teacher@123",
    full_name: "Suresh Chandra Gupta",
    name: "Suresh Gupta",
    phone: "9810001004",
    role: "teacher",
    designation: "Senior Teacher",
    unique_id: "EMP004",
    subjects: ["Science"],
  },
  {
    email: "meena.joshi@springdalesch.edu",
    password: "Teacher@123",
    full_name: "Meena Kumari Joshi",
    name: "Meena Joshi",
    phone: "9810001005",
    role: "teacher",
    designation: "Teacher",
    unique_id: "EMP005",
    subjects: ["Hindi"],
  },
  {
    email: "rakesh.pandey@springdalesch.edu",
    password: "Teacher@123",
    full_name: "Rakesh Pandey",
    name: "Rakesh Pandey",
    phone: "9810001006",
    role: "teacher",
    designation: "Teacher",
    unique_id: "EMP006",
    subjects: ["Social Science"],
  },
  {
    email: "kavita.mishra@springdalesch.edu",
    password: "Teacher@123",
    full_name: "Kavita Mishra",
    name: "Kavita Mishra",
    phone: "9810001007",
    role: "teacher",
    designation: "PGT Teacher",
    unique_id: "EMP007",
    subjects: ["Mathematics"],
  },
  {
    email: "deepak.yadav@springdalesch.edu",
    password: "Teacher@123",
    full_name: "Deepak Yadav",
    name: "Deepak Yadav",
    phone: "9810001008",
    role: "teacher",
    designation: "Teacher",
    unique_id: "EMP008",
    subjects: ["Computer Science"],
  },
  {
    email: "sunita.sharma@springdalesch.edu",
    password: "Teacher@123",
    full_name: "Sunita Sharma",
    name: "Sunita Sharma",
    phone: "9810001009",
    role: "teacher",
    designation: "Teacher",
    unique_id: "EMP009",
    subjects: ["English"],
  },
  {
    email: "vijay.tiwari@springdalesch.edu",
    password: "Teacher@123",
    full_name: "Vijay Kumar Tiwari",
    name: "Vijay Tiwari",
    phone: "9810001010",
    role: "teacher",
    designation: "PGT Teacher",
    unique_id: "EMP010",
    subjects: ["Physics", "Science"],
  },
  {
    email: "anita.rao@springdalesch.edu",
    password: "Teacher@123",
    full_name: "Anita Rao",
    name: "Anita Rao",
    phone: "9810001011",
    role: "teacher",
    designation: "Teacher",
    unique_id: "EMP011",
    subjects: ["Biology", "Science"],
  },
];

// 4 classes; each gets 1 class teacher + 3 subject teachers (indices into TEACHERS array, 0-based)
const CLASSES_DEF = [
  {
    name: "Class 6 - A",
    grade: "6",
    section: "A",
    classTeacherIdx: 0, // Amit Verma
    subjectTeacherIdxs: [1, 2, 3], // Priya, Suresh, Meena
  },
  {
    name: "Class 7 - B",
    grade: "7",
    section: "B",
    classTeacherIdx: 4, // Rakesh Pandey
    subjectTeacherIdxs: [5, 6, 7], // Kavita, Deepak, Sunita
  },
  {
    name: "Class 8 - A",
    grade: "8",
    section: "A",
    classTeacherIdx: 8, // Vijay Tiwari
    subjectTeacherIdxs: [9, 0, 1], // Anita, Amit, Priya
  },
  {
    name: "Class 9 - C",
    grade: "9",
    section: "C",
    classTeacherIdx: 6, // Deepak Yadav
    subjectTeacherIdxs: [2, 3, 4], // Suresh, Meena, Rakesh
  },
];

const FIRST_NAMES = [
  "Aarav","Aditya","Ananya","Ankita","Arjun","Ayesha","Bhavya","Chirag",
  "Divya","Gaurav","Ishaan","Kavya","Krish","Lakshmi","Manav","Neha",
  "Nikhil","Pooja","Rahul","Ritika","Rohit","Sakshi","Sanya","Shivam",
  "Shruti","Siddharth","Simran","Sneha","Tanvi","Varun",
];

const LAST_NAMES = [
  "Agarwal","Chauhan","Dubey","Gupta","Jain","Joshi","Kumar","Mehta",
  "Mishra","Pandey","Patel","Rao","Saxena","Sharma","Singh","Srivastava",
  "Tiwari","Tripathi","Verma","Yadav",
];

function generateStudents(classIndex, count = 20) {
  const students = [];
  const usedNames = new Set();
  for (let i = 0; i < count; i++) {
    let firstName, lastName, fullName;
    do {
      firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      fullName = `${firstName} ${lastName}`;
    } while (usedNames.has(fullName));
    usedNames.add(fullName);

    const rollNumber = `${2025}${pad(classIndex + 1)}${pad(i + 1)}`;
    const dob = randomDate(new Date("2010-01-01"), new Date("2014-12-31"));
    const parentEmail = `parent.${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`;

    students.push({
      name: fullName,
      roll_number: rollNumber,
      parent_email: parentEmail,
      dob,
      section: CLASSES_DEF[classIndex].section,
    });
  }
  return students;
}


// ─── CLEANUP (wipe previous seed data — makes the script safely re-runnable) ──

async function deleteAllRows(table) {
  const { error } = await supabase
    .from(table)
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (error) log(`  ⚠  Could not clean ${table}: ${error.message}`);
  else log(`  ✓  Cleared ${table}`);
}

async function cleanup() {
  log("Cleaning up previous seed data...");

  // ── STEP 1: Delete auth users FIRST (before clearing public.users)
  // We look them up by email in public.users to get their UUID,
  // AND also try a direct admin lookup by email as a fallback for orphaned auth users.
  log("  Removing seed auth users...");
  const seedEmails = [PRINCIPAL.email, ...TEACHERS.map((t) => t.email)];

  for (const email of seedEmails) {
    // Try to find the id in public.users
    const { data: row } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (row?.id) {
      // Delete profile row first, then auth user
      await supabase.from("users").delete().eq("id", row.id);
      const { error: delErr } = await supabase.auth.admin.deleteUser(row.id);
      if (delErr) log(`  ⚠  Could not delete auth user ${email}: ${delErr.message}`);
      else log(`  ✓  Deleted user: ${email}`);
    } else {
      // No profile row — auth user may still exist as an orphan (e.g. from a previous failed seed).
      // listUsers supports an email filter via the 'filter' option in newer SDK versions;
      // fall back to fetching page 1 and scanning for the email.
      const { data: page } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
      const orphan = page?.users?.find((u) => u.email === email);
      if (orphan?.id) {
        const { error: delErr } = await supabase.auth.admin.deleteUser(orphan.id);
        if (delErr) log(`  ⚠  Could not delete orphaned auth user ${email}: ${delErr.message}`);
        else log(`  ✓  Deleted orphaned auth user: ${email}`);
      } else {
        log(`  –  No existing user for ${email}, skipping`);
      }
    }
  }

  // ── STEP 2: Clear all data tables in FK-safe order (children before parents)

  // Tables that have a school_id column
  const bySchoolId = [
    "ms_fee_payments",
    "ms_marks",
    "ms_exam_duties",
    "ms_student_documents",
    "ms_fee_structure",
    "ms_announcements",
    "ms_calendar_events",
    "timetable",
    "ms_exams",
  ];

  // Tables without school_id — delete all rows
  const allRows = [
    "ms_attendance",
    "ms_homework",
    "ms_lesson_plans",
    "ms_leave_requests",
    "ms_notices",
    "class_students",
    "classes",
  ];

  for (const table of bySchoolId) {
    const { error } = await supabase.from(table).delete().eq("school_id", SCHOOL_ID);
    if (error) log(`  ⚠  Could not clean ${table}: ${error.message}`);
    else log(`  ✓  Cleared ${table}`);
  }

  for (const table of allRows) {
    await deleteAllRows(table);
  }

  log("Cleanup complete.\n");
}

// ─── SEED FUNCTIONS ───────────────────────────────────────────────────────────

async function createAuthUser(userData) {
  // Try to create; if the auth user already exists (orphan from a failed run), reuse it.
  const { data, error } = await supabase.auth.admin.createUser({
    email: userData.email,
    password: userData.password,
    email_confirm: true,
    user_metadata: { full_name: userData.full_name },
  });

  if (!error) return data.user;

  // If it's a duplicate, find the existing auth user via listUsers and return it
  if (error.message.toLowerCase().includes("already") || error.message.toLowerCase().includes("duplicate")) {
    log(`  ↻  Auth user already exists for ${userData.email}, reusing...`);
    const { data: page } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const existing = page?.users?.find((u) => u.email === userData.email);
    if (existing) return existing;
  }

  throw new Error(`Auth signup failed for ${userData.email}: ${error.message}`);
}

async function insertUserProfile(authId, userData) {
  const { error } = await supabase.from("users").upsert({
    id: authId,
    unique_id: userData.unique_id,
    email: userData.email,
    full_name: userData.full_name,
    name: userData.name,
    phone: userData.phone,
    role: userData.role,
    subjects: userData.subjects,
    designation: userData.designation,
    school_id: SCHOOL_ID,
    is_first_login: false,
  });
  if (error) throw new Error(`Profile insert failed for ${userData.email}: ${error.message}`);
}

async function seedUsersAndGetIds() {
  log("Creating principal...");
  const principalAuth = await createAuthUser(PRINCIPAL);
  await insertUserProfile(principalAuth.id, PRINCIPAL);
  log(`  ✓ Principal: ${PRINCIPAL.email}`);

  const teacherIds = [];
  log("Creating 10 teachers...");
  for (const t of TEACHERS) {
    const auth = await createAuthUser(t);
    await insertUserProfile(auth.id, t);
    teacherIds.push(auth.id);
    log(`  ✓ Teacher: ${t.email}`);
    await new Promise((r) => setTimeout(r, 300)); // avoid rate limit
  }

  return { principalId: principalAuth.id, teacherIds };
}

async function seedClasses() {
  log("Creating 4 classes...");
  const classIds = [];
  for (const cls of CLASSES_DEF) {
    const { data, error } = await supabase
      .from("classes")
      .insert({
        name: cls.name,
        grade: cls.grade,
        section: cls.section,
        school_id: SCHOOL_ID,
      })
      .select("id")
      .single();
    if (error) throw new Error(`Class insert failed: ${error.message}`);
    classIds.push(data.id);
    log(`  ✓ Class: ${cls.name} → ${data.id}`);
  }
  return classIds;
}

async function seedStudents(classIds) {
  log("Creating 20 students per class (80 total)...");
  const allStudentIds = [];
  for (let ci = 0; ci < classIds.length; ci++) {
    const classId = classIds[ci];
    const students = generateStudents(ci);
    const toInsert = students.map((s) => ({ ...s, class_id: classId }));

    const { data, error } = await supabase
      .from("class_students")
      .insert(toInsert)
      .select("id");
    if (error) throw new Error(`Student insert failed for class ${ci + 1}: ${error.message}`);
    allStudentIds.push(data.map((d) => d.id));
    log(`  ✓ Class ${CLASSES_DEF[ci].name}: ${data.length} students inserted`);
  }
  return allStudentIds;
}

async function seedTimetable(classIds, teacherIds) {
  log("Creating timetable entries...");
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const periods = [
    { start_time: "08:00", end_time: "08:45" },
    { start_time: "08:45", end_time: "09:30" },
    { start_time: "09:45", end_time: "10:30" },
    { start_time: "10:30", end_time: "11:15" },
    { start_time: "11:30", end_time: "12:15" },
    { start_time: "12:15", end_time: "13:00" },
  ];

  const classSubjects = [
    ["Mathematics", "English", "Science", "Hindi", "Social Science", "Computer Science"],
    ["Mathematics", "English", "Science", "Hindi", "Social Science", "Computer Science"],
    ["Physics", "English", "Biology", "Mathematics", "Social Science", "Computer Science"],
    ["Physics", "English", "Biology", "Mathematics", "Social Science", "Computer Science"],
  ];

  const entries = [];
  for (let ci = 0; ci < classIds.length; ci++) {
    const cls = CLASSES_DEF[ci];
    const teacherPool = [
      teacherIds[cls.classTeacherIdx],
      ...cls.subjectTeacherIdxs.map((i) => teacherIds[i]),
    ];
    const subjects = classSubjects[ci];

    for (const day of days) {
      for (let pi = 0; pi < periods.length; pi++) {
        entries.push({
          teacher_id: teacherPool[pi % teacherPool.length],
          subject: subjects[pi % subjects.length],
          class_name: CLASSES_DEF[ci].name,
          room: `Room ${101 + ci}`,
          start_time: periods[pi].start_time,
          end_time: periods[pi].end_time,
          day,
          school_id: SCHOOL_ID,
        });
      }
    }
  }

  const { error } = await supabase.from("timetable").insert(entries);
  if (error) throw new Error(`Timetable insert failed: ${error.message}`);
  log(`  ✓ ${entries.length} timetable entries inserted`);
}

async function seedAttendance(classIds, allStudentIds, teacherIds) {
  log("Creating attendance records (last 5 school days)...");
  const today = new Date();
  const dates = [];
  for (let i = 7; i >= 1; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dayName = d.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
    if (dayName !== "sunday") {
      dates.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
    }
    if (dates.length === 5) break;
  }

  const statuses = ["present", "present", "present", "present", "absent", "late"];
  const entries = [];

  for (let ci = 0; ci < classIds.length; ci++) {
    const teacherId = teacherIds[CLASSES_DEF[ci].classTeacherIdx];
    for (const studentId of allStudentIds[ci]) {
      for (const date of dates) {
        entries.push({
          class_id: classIds[ci],
          student_id: studentId,
          date,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          marked_by: teacherId,
        });
      }
    }
  }

  // Insert in batches of 200
  for (let i = 0; i < entries.length; i += 200) {
    const batch = entries.slice(i, i + 200);
    const { error } = await supabase.from("ms_attendance").insert(batch);
    if (error) throw new Error(`Attendance insert failed: ${error.message}`);
  }
  log(`  ✓ ${entries.length} attendance records inserted`);
}

async function seedHomework(classIds, teacherIds) {
  log("Creating homework entries...");
  const homeworks = [
    { subject: "Mathematics", title: "Chapter 5 Exercises", description: "Complete exercises 5.1 to 5.4 from NCERT textbook.", daysAgo: 2 },
    { subject: "English", title: "Essay Writing", description: "Write a 300-word essay on 'My Favourite Season'.", daysAgo: 1 },
    { subject: "Science", title: "Lab Report", description: "Prepare lab report on the photosynthesis experiment.", daysAgo: 3 },
    { subject: "Hindi", title: "पाठ 3 प्रश्नोत्तर", description: "पाठ 3 के सभी प्रश्नों के उत्तर लिखें।", daysAgo: 1 },
    { subject: "Social Science", title: "Map Work", description: "Mark the major rivers of India on the outline map.", daysAgo: 4 },
  ];

  const entries = [];
  for (let ci = 0; ci < classIds.length; ci++) {
    const cls = CLASSES_DEF[ci];
    for (const hw of homeworks) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 3);
      const teacherId =
        ci % 2 === 0
          ? teacherIds[cls.classTeacherIdx]
          : teacherIds[cls.subjectTeacherIdxs[0]];
      entries.push({
        teacher_id: teacherId,
        class_id: classIds[ci],
        class_name: CLASSES_DEF[ci].name,
        subject: hw.subject,
        title: hw.title,
        description: hw.description,
        due_date: `${dueDate.getFullYear()}-${pad(dueDate.getMonth() + 1)}-${pad(dueDate.getDate())}`,
      });
    }
  }

  const { error } = await supabase.from("ms_homework").insert(entries);
  if (error) throw new Error(`Homework insert failed: ${error.message}`);
  log(`  ✓ ${entries.length} homework entries inserted`);
}

async function seedAnnouncements(principalId) {
  log("Creating announcements...");
  const announcements = [
    {
      title: "Annual Sports Day 2025",
      message: "Annual Sports Day will be held on 15th April 2025. All students must participate in at least one event. Registration forms are available at the school office.",
      priority: "high",
    },
    {
      title: "Half-Yearly Exam Schedule Released",
      message: "The half-yearly examination schedule has been released. Please check the school notice board or visit the school website for details.",
      priority: "urgent",
    },
    {
      title: "Parent-Teacher Meeting",
      message: "Parent-Teacher Meeting is scheduled for 5th April 2025. All parents are requested to attend and discuss their ward's academic progress.",
      priority: "normal",
    },
    {
      title: "School Closed - Holi",
      message: "The school will remain closed on 14th March 2025 on account of Holi. School will reopen on 17th March 2025.",
      priority: "normal",
    },
    {
      title: "New Library Books Arrival",
      message: "We are pleased to announce that over 200 new books have been added to the school library. Students can borrow books from Monday onwards.",
      priority: "low",
    },
  ];

  const { error } = await supabase.from("ms_announcements").insert(
    announcements.map((a) => ({
      ...a,
      created_by: principalId,
      creator_name: PRINCIPAL.name,
      school_id: SCHOOL_ID,
    }))
  );
  if (error) throw new Error(`Announcements insert failed: ${error.message}`);
  log(`  ✓ ${announcements.length} announcements inserted`);
}

async function seedNotices(classIds, teacherIds, principalId) {
  log("Creating notices...");
  const notices = [
    { title: "Uniform Policy Reminder", message: "All students must wear proper school uniform every day. Violators will be sent home.", type: "urgent", classIdx: null },
    { title: "Science Exhibition", message: "Inter-class science exhibition will be held on 20th April. Start preparing your projects.", type: "event", classIdx: 0 },
    { title: "Holiday - Ram Navami", message: "School will be closed on 6th April on account of Ram Navami.", type: "holiday", classIdx: null },
    { title: "Mathematics Olympiad", message: "Registration open for Mathematics Olympiad. Last date: 31st March.", type: "exam", classIdx: 1 },
    { title: "Class Trip Permission Slips", message: "Please submit signed permission slips for the upcoming educational trip to the class teacher.", type: "general", classIdx: 2 },
  ];

  const entries = notices.map((n, i) => ({
    title: n.title,
    message: n.message,
    type: n.type,
    class_id: n.classIdx !== null ? classIds[n.classIdx] : null,
    class_name: n.classIdx !== null ? CLASSES_DEF[n.classIdx].name : "",
    created_by: i % 3 === 0 ? principalId : teacherIds[i % teacherIds.length],
    creator_name: i % 3 === 0 ? PRINCIPAL.name : TEACHERS[i % TEACHERS.length].name,
  }));

  const { error } = await supabase.from("ms_notices").insert(entries);
  if (error) throw new Error(`Notices insert failed: ${error.message}`);
  log(`  ✓ ${entries.length} notices inserted`);
}

async function seedCalendarEvents() {
  log("Creating calendar events...");
  const events = [
    { title: "Holi", type: "holiday", date: "2025-03-14", end_date: "2025-03-14", description: "School closed for Holi celebration." },
    { title: "Ram Navami", type: "holiday", date: "2025-04-06", end_date: "2025-04-06", description: "School closed on account of Ram Navami." },
    { title: "Annual Sports Day", type: "event", date: "2025-04-15", end_date: "2025-04-15", description: "Annual Sports Day - All students must participate." },
    { title: "Parent-Teacher Meeting", type: "meeting", date: "2025-04-05", end_date: "2025-04-05", description: "PTM for all classes." },
    { title: "Half-Yearly Exams", type: "exam", date: "2025-09-01", end_date: "2025-09-15", description: "Half-yearly examination for all classes." },
    { title: "Annual Day Celebration", type: "event", date: "2025-12-20", end_date: "2025-12-20", description: "Annual Day function and prize distribution." },
    { title: "Winter Vacation", type: "holiday", date: "2025-12-25", end_date: "2026-01-05", description: "Winter vacation period." },
    { title: "Republic Day", type: "holiday", date: "2025-01-26", end_date: "2025-01-26", description: "Republic Day celebration at school ground." },
  ];

  const { error } = await supabase.from("ms_calendar_events").insert(
    events.map((e) => ({ ...e, school_id: SCHOOL_ID }))
  );
  if (error) throw new Error(`Calendar events insert failed: ${error.message}`);
  log(`  ✓ ${events.length} calendar events inserted`);
}

async function seedExamsAndMarks(classIds, allStudentIds, principalId) {
  log("Creating exams...");
  const examDefs = [
    { subject: "Mathematics", exam_type: "unit-test", exam_date: "2025-02-10", start_time: "09:00", end_time: "10:30" },
    { subject: "English", exam_type: "unit-test", exam_date: "2025-02-12", start_time: "09:00", end_time: "10:30" },
    { subject: "Science", exam_type: "unit-test", exam_date: "2025-02-14", start_time: "09:00", end_time: "10:30" },
  ];

  const examIds = [];
  for (let ci = 0; ci < classIds.length; ci++) {
    for (const ed of examDefs) {
      const { data, error } = await supabase
        .from("ms_exams")
        .insert({
          class_name: CLASSES_DEF[ci].name,
          subject: ed.subject,
          exam_date: ed.exam_date,
          start_time: ed.start_time,
          end_time: ed.end_time,
          room: `Hall ${ci + 1}`,
          exam_type: ed.exam_type,
          school_id: SCHOOL_ID,
        })
        .select("id")
        .single();
      if (error) throw new Error(`Exam insert failed: ${error.message}`);
      examIds.push({ examId: data.id, classIdx: ci });
    }
  }
  log(`  ✓ ${examIds.length} exams inserted`);

  log("Creating marks for exams...");
  const marksEntries = [];
  for (const { examId, classIdx } of examIds) {
    for (const studentId of allStudentIds[classIdx]) {
      const obtained = Math.floor(Math.random() * 41) + 60; // 60–100
      marksEntries.push({
        student_id: studentId,
        exam_id: examId,
        subject: "General",
        marks_obtained: obtained,
        max_marks: 100,
        grade: obtained >= 90 ? "A+" : obtained >= 75 ? "A" : obtained >= 60 ? "B" : "C",
        entered_by: principalId,
        school_id: SCHOOL_ID,
      });
    }
  }

  for (let i = 0; i < marksEntries.length; i += 200) {
    const batch = marksEntries.slice(i, i + 200);
    const { error } = await supabase.from("ms_marks").insert(batch);
    if (error) throw new Error(`Marks insert failed: ${error.message}`);
  }
  log(`  ✓ ${marksEntries.length} mark entries inserted`);
}

async function seedFeeStructure(classIds) {
  log("Creating fee structures...");
  const feeTypes = [
    { fee_type: "tuition", amount: 2500, frequency: "monthly" },
    { fee_type: "transport", amount: 800, frequency: "monthly" },
    { fee_type: "library", amount: 500, frequency: "yearly" },
    { fee_type: "lab", amount: 1000, frequency: "yearly" },
    { fee_type: "exam", amount: 300, frequency: "quarterly" },
  ];

  const entries = [];
  for (let ci = 0; ci < classIds.length; ci++) {
    for (const ft of feeTypes) {
      entries.push({
        class_id: classIds[ci],
        class_name: CLASSES_DEF[ci].name,
        ...ft,
        academic_year: ACADEMIC_YEAR,
        school_id: SCHOOL_ID,
      });
    }
  }

  const { data, error } = await supabase.from("ms_fee_structure").insert(entries).select("id");
  if (error) throw new Error(`Fee structure insert failed: ${error.message}`);
  log(`  ✓ ${data.length} fee structure entries inserted`);
  return data.map((d) => d.id);
}

async function seedFeePayments(allStudentIds, feeStructureIds, teacherIds) {
  log("Creating fee payment records...");
  const methods = ["cash", "upi", "bank_transfer", "online"];
  const entries = [];
  let receiptNum = 1001;

  for (let ci = 0; ci < allStudentIds.length; ci++) {
    // Pay tuition fee for each student
    for (const studentId of allStudentIds[ci]) {
      const paid = Math.random() > 0.15; // 85% paid
      entries.push({
        student_id: studentId,
        fee_structure_id: feeStructureIds[ci * 5], // tuition for this class
        amount_paid: paid ? 2500 : 1250,
        payment_date: randomDate(new Date("2025-03-01"), new Date("2025-03-20")),
        payment_method: methods[Math.floor(Math.random() * methods.length)],
        receipt_number: `RCP${receiptNum++}`,
        status: paid ? "paid" : "partial",
        collected_by: teacherIds[CLASSES_DEF[ci].classTeacherIdx],
        school_id: SCHOOL_ID,
      });
    }
  }

  for (let i = 0; i < entries.length; i += 100) {
    const batch = entries.slice(i, i + 100);
    const { error } = await supabase.from("ms_fee_payments").insert(batch);
    if (error) throw new Error(`Fee payments insert failed: ${error.message}`);
  }
  log(`  ✓ ${entries.length} fee payment records inserted`);
}

async function seedLeaveRequests(teacherIds, principalId) {
  log("Creating leave requests...");
  const leaves = [
    { teacherIdx: 0, from_date: "2025-03-10", to_date: "2025-03-11", reason: "Medical appointment", status: "approved" },
    { teacherIdx: 2, from_date: "2025-03-18", to_date: "2025-03-18", reason: "Family function", status: "approved" },
    { teacherIdx: 5, from_date: "2025-03-25", to_date: "2025-03-26", reason: "Personal work", status: "pending" },
    { teacherIdx: 7, from_date: "2025-04-02", to_date: "2025-04-02", reason: "Child's school event", status: "rejected" },
    { teacherIdx: 9, from_date: "2025-04-08", to_date: "2025-04-09", reason: "Health issues", status: "pending" },
  ];

  const { error } = await supabase.from("ms_leave_requests").insert(
    leaves.map((l) => ({
      teacher_id: teacherIds[l.teacherIdx],
      teacher_name: TEACHERS[l.teacherIdx].name,
      from_date: l.from_date,
      to_date: l.to_date,
      reason: l.reason,
      status: l.status,
      approved_by: l.status !== "pending" ? principalId : null,
      approver_name: l.status !== "pending" ? PRINCIPAL.name : "",
    }))
  );
  if (error) throw new Error(`Leave requests insert failed: ${error.message}`);
  log(`  ✓ ${leaves.length} leave requests inserted`);
}

async function seedLessonPlans(teacherIds) {
  log("Creating lesson plans...");
  const plans = [
    { teacherIdx: 0, subject: "Mathematics", topic: "Linear Equations", class_name: "Class 6 - A", description: "Introduction to linear equations in one variable with examples." },
    { teacherIdx: 1, subject: "English", topic: "The Tempest - Act 1", class_name: "Class 6 - A", description: "Reading and analysis of Act 1 of Shakespeare's The Tempest." },
    { teacherIdx: 2, subject: "Science", topic: "Photosynthesis", class_name: "Class 7 - B", description: "Process of photosynthesis, light and dark reactions, significance." },
    { teacherIdx: 4, subject: "Social Science", topic: "French Revolution", class_name: "Class 7 - B", description: "Causes, events, and impact of the French Revolution." },
    { teacherIdx: 8, subject: "Physics", topic: "Laws of Motion", class_name: "Class 8 - A", description: "Newton's three laws of motion with real-world applications." },
    { teacherIdx: 6, subject: "Computer Science", topic: "Python Basics", class_name: "Class 9 - C", description: "Introduction to Python programming: variables, loops, and functions." },
  ];

  const { error } = await supabase.from("ms_lesson_plans").insert(
    plans.map((p) => ({
      teacher_id: teacherIds[p.teacherIdx],
      subject: p.subject,
      topic: p.topic,
      class_name: p.class_name,
      description: p.description,
    }))
  );
  if (error) throw new Error(`Lesson plans insert failed: ${error.message}`);
  log(`  ✓ ${plans.length} lesson plans inserted`);
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=".repeat(60));
  console.log(" SPRINGDALE SCHOOL - DATABASE SEED SCRIPT");
  console.log("=".repeat(60));

  try {
    await cleanup();
    const { principalId, teacherIds } = await seedUsersAndGetIds();
    const classIds = await seedClasses();
    const allStudentIds = await seedStudents(classIds);
    await seedTimetable(classIds, teacherIds);
    await seedAttendance(classIds, allStudentIds, teacherIds);
    await seedHomework(classIds, teacherIds);
    await seedAnnouncements(principalId);
    await seedNotices(classIds, teacherIds, principalId);
    await seedCalendarEvents();
    await seedExamsAndMarks(classIds, allStudentIds, principalId);
    const feeStructureIds = await seedFeeStructure(classIds);
    await seedFeePayments(allStudentIds, feeStructureIds, teacherIds);
    await seedLeaveRequests(teacherIds, principalId);
    await seedLessonPlans(teacherIds);

    console.log("=".repeat(60));
    console.log(" ✅ SEED COMPLETE - All data inserted successfully!");
    console.log("=".repeat(60));
  } catch (err) {
    console.error("\n❌ SEED FAILED:", err.message);
    process.exit(1);
  }
}

main();
