# 🏫 MySchool

A cross-platform **school management mobile app** built with **React Native (Expo)** and **Supabase**. Designed for teachers, admins, principals, and parents to manage day-to-day school operations — attendance, timetables, notices, homework, leave requests, lesson plans, and more.

---

## ✨ Features

| Module | Description |
|---|---|
| **Dashboard** | Today's schedule, quick actions, recent homework at a glance |
| **Attendance** | Mark & track daily student attendance (present / absent / late / excused) |
| **Timetable** | View weekly class schedule per teacher |
| **Notices** | Send notices to specific classes (general, urgent, event, holiday, exam) |
| **Announcements** | Staff-wide broadcast announcements with priority levels |
| **Leave Management** | Teachers apply for leave; admins/principals approve or reject |
| **Lesson Plans** | Upload and manage lesson plans per subject & class |
| **Homework** | Assign homework with due dates for classes |
| **Datesheet** | Exam schedule viewer |
| **Calendar** | School-wide events, holidays, exams, meetings |
| **My Class** | View students in assigned classes |
| **Student Performance** | Track marks and performance |
| **Profile** | View and edit user profile |
| **Notifications** | In-app notification center |
| **Demo Mode** | Try the app without a Supabase account (dummy data) |

### Role-Based Access

- **Teacher** — Dashboard, attendance, timetable, homework, lesson plans, leave, notices
- **Admin** — All teacher features + leave approvals, announcements, class management
- **Principal** — Full access to all features
- **Parent** — View homework, notices, attendance, datesheet

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Expo](https://expo.dev) (SDK 54) + [React Native](https://reactnative.dev) 0.81 |
| Routing | [Expo Router](https://docs.expo.dev/router/introduction/) v6 (file-based) |
| Navigation | Drawer + Bottom Tabs (React Navigation 7) |
| Backend | [Supabase](https://supabase.com) (PostgreSQL, Auth, Storage, Realtime) |
| Language | TypeScript 5.9 |
| State | React Context (AuthContext, UserContext) |
| UI | Custom components with Ionicons |

---

## 📁 Project Structure

```
MySchool/
├── app/                        # Expo Router screens (file-based routing)
│   ├── _layout.tsx             # Root layout (providers)
│   ├── login.tsx               # Login screen
│   ├── add-homework.tsx        # Add homework form
│   ├── add-lesson-plan.tsx     # Add lesson plan form
│   ├── apply-leave.tsx         # Leave application form
│   ├── class-students.tsx      # View students in a class
│   ├── create-announcement.tsx # Create staff announcement
│   ├── create-notice.tsx       # Create class notice
│   ├── leave-approvals.tsx     # Admin leave approval screen
│   ├── mark-attendance.tsx     # Mark daily attendance
│   ├── notifications.tsx       # Notification center
│   ├── student-performance.tsx # Student marks/performance
│   └── (drawer)/               # Drawer navigation group
│       ├── _layout.tsx         # Drawer layout + custom sidebar
│       ├── calendar.tsx        # School calendar
│       ├── datesheet.tsx       # Exam datesheet
│       ├── lesson-plans.tsx    # Lesson plans list
│       ├── profile.tsx         # User profile
│       ├── settings.tsx        # App settings
│       ├── timetable.tsx       # Weekly timetable
│       └── (tabs)/             # Bottom tab navigation
│           ├── _layout.tsx     # Tab bar configuration
│           ├── index.tsx       # Dashboard (home)
│           ├── attendance.tsx  # Attendance overview
│           ├── leave.tsx       # Leave requests
│           ├── marks.tsx       # Marks entry
│           ├── myclass.tsx     # My class view
│           └── notices.tsx     # Notices list
├── src/
│   ├── config/
│   │   └── supabase.ts        # Supabase client initialization
│   ├── context/
│   │   ├── AuthContext.tsx     # Authentication state & methods
│   │   └── UserContext.tsx     # User profile, role & permissions
│   ├── hooks/                  # Custom React hooks (data fetching)
│   │   ├── useAnnouncements.ts
│   │   ├── useAttendance.ts
│   │   ├── useCalendar.ts
│   │   ├── useDatesheet.ts
│   │   ├── useHomework.ts
│   │   ├── useLeaveRequests.ts
│   │   ├── useLessonPlans.ts
│   │   ├── useNotices.ts
│   │   └── useTimetable.ts
│   ├── services/
│   │   └── supabaseService.ts  # All Supabase DB queries & mutations
│   ├── theme/
│   │   ├── colors.ts           # App color palette
│   │   └── spacing.ts          # Spacing, font sizes, border radii
│   └── types/
│       └── index.ts            # TypeScript interfaces & types
├── assets/                     # Images, icons, splash screen
├── schema.sql                  # Full Supabase database schema
├── app.json                    # Expo configuration
├── package.json                # Dependencies & scripts
└── tsconfig.json               # TypeScript config
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** or **yarn**
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npx expo` works out of the box)
- A **Supabase** project (free tier is fine) — [supabase.com](https://supabase.com)
- **Expo Go** app on your phone (iOS / Android) for testing, or an emulator

### 1. Clone the Repository

```bash
git clone https://github.com/its-vanshitaaa/MySchool.git
cd MySchool
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com/dashboard).
2. Go to **SQL Editor** and run the contents of [`schema.sql`](schema.sql) to create all tables.
3. Enable **Realtime** for these tables (Dashboard → Database → Replication):
   - `users`, `timetable`, `classes`, `class_students`
   - `ms_attendance`, `ms_notices`, `ms_announcements`
   - `ms_leave_requests`, `ms_lesson_plans`, `ms_exams`
   - `ms_calendar_events`
4. Create a **Storage bucket** named `myschool-files` (set to public) for attachments.
5. Copy your **Project URL** and **anon public key** from Dashboard → Settings → API.

### 4. Configure Supabase Credentials

Open `src/config/supabase.ts` and replace the placeholder values:

```ts
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### 5. Seed Initial Data

Insert at least one user into the `users` table via the Supabase Table Editor or SQL:

```sql
-- Create a teacher account
INSERT INTO users (unique_id, email, full_name, name, role)
VALUES ('MS-2024-001', 'teacher@myschool.app', 'Jane Smith', 'Jane Smith', 'teacher');
```

Then sign them up in Supabase Auth (Dashboard → Authentication → Users → Add User) with the same email and a password.

### 6. Run the App

```bash
# Start the Expo dev server
npx expo start

# Or target a specific platform:
npx expo start --android
npx expo start --ios
npx expo start --web
```

Scan the QR code with **Expo Go** on your phone, or press `a` for Android emulator / `i` for iOS simulator.

### 🎮 Demo Mode

Don't want to set up Supabase? The app has a **Demo Mode** on the login screen that lets you explore the full UI with sample data — no backend required.

---

## 🗄️ Database Schema

The full SQL schema is in [`schema.sql`](schema.sql). Key tables:

| Table | Purpose |
|---|---|
| `users` | Teachers, admins, principals, parents |
| `classes` | School classes (e.g. "Class 10-A") |
| `class_students` | Students belonging to each class |
| `timetable` | Weekly schedule per teacher |
| `ms_attendance` | Daily attendance records |
| `ms_notices` | Class-specific notices |
| `ms_announcements` | Staff-wide announcements |
| `ms_leave_requests` | Teacher leave applications |
| `ms_lesson_plans` | Uploaded lesson plans |
| `ms_homework` | Homework assignments |
| `ms_exams` | Exam datesheet entries |
| `ms_calendar_events` | School calendar events |

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start the Expo dev server |
| `npm run android` | Start on Android emulator/device |
| `npm run ios` | Start on iOS simulator/device |
| `npm run web` | Start in web browser |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** this repository.
2. **Clone** your fork:
   ```bash
   git clone https://github.com/<your-username>/MySchool.git
   cd MySchool
   ```
3. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Install dependencies** and set up Supabase (see [Getting Started](#-getting-started)).
5. **Make your changes** and test thoroughly.
6. **Commit** with a clear message:
   ```bash
   git commit -m "feat: add student report card generation"
   ```
7. **Push** to your fork and open a **Pull Request**.

### Contribution Guidelines

- Follow the existing code style (TypeScript, functional components, hooks).
- Place new screens in `app/` following Expo Router conventions.
- Add new DB queries to `src/services/supabaseService.ts`.
- Create custom hooks in `src/hooks/` for data fetching.
- Use colors from `src/theme/colors.ts` — do not hardcode color values.
- Test on both Android and iOS (or at minimum, use Expo Go on one device + web).

### Ideas for Contributions

- 📊 Student report card / grade export (PDF)
- 💬 In-app chat between teachers and parents
- 📱 Push notifications (Expo Notifications)
- 🌙 Dark mode support
- 🌐 Multi-language / i18n support
- 📈 Analytics dashboard for principals
- 🧪 Unit & integration tests

---

## 📄 License

This project is open source and available for educational and personal use.

---

## 🙏 Acknowledgements

- [Expo](https://expo.dev) — Universal React Native platform
- [Supabase](https://supabase.com) — Open-source Firebase alternative
- [React Navigation](https://reactnavigation.org) — Routing & navigation
- [Ionicons](https://ionic.io/ionicons) — Beautiful icon set

---

**Built with ❤️ for schools everywhere.**
