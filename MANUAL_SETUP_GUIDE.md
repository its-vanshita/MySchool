# How to Create Test Accounts in Supabase

This guide will show you how to instantly create **Admin, Teacher, Parent, and Student** profiles in your Supabase project without writing any code manually.

### Step 1: Log in to Supabase

1.  Open your web browser and go to [Supabase Dashboard](https://supabase.com/dashboard).
2.  Click **"Sign in"** (if not already logged in).
3.  Select your project (e.g., `MySchool` or `VidDarpan`).

### Step 2: Open the SQL Editor

1.  In the left sidebar menu, look for the **SQL Editor** icon.
    *   It looks like a terminal prompt: `>_`
    *   Hover over the icons if unsure.
2.  Click on it.
3.  Click the **"New Query"** button at the top left.
    *   A blank text editor will appear.

### Step 3: Run the Setup Script

1.  Copy the code below (click the copy button in VS Code):

```sql
---------- COPY FROM HERE ----------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
    v_admin_email    TEXT := 'admin.final@myschool.app';
    v_teacher_email  TEXT := 'teacher.final@myschool.app';
    v_parent_email   TEXT := 'parent.final@myschool.app';
    v_password       TEXT := 'securepass1234';
    v_encrypted_pw   TEXT := crypt(v_password, gen_salt('bf'));
    v_user_id        UUID;
BEGIN
    ---------- 1. ADMIN USER ----------
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_admin_email) THEN
        INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
        VALUES (gen_random_uuid(), 'authenticated', 'authenticated', v_admin_email, v_encrypted_pw, now(), '{"provider":"email","providers":["email"]}', '{}', now(), now())
        RETURNING id INTO v_user_id;

        UPDATE public.users SET role='admin', name='Principal Admin', unique_id='ADM001', school_id='demo-school' WHERE id=v_user_id;
    END IF;

    ---------- 2. TEACHER USER ----------
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_teacher_email) THEN
        INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
        VALUES (gen_random_uuid(), 'authenticated', 'authenticated', v_teacher_email, v_encrypted_pw, now(), '{"provider":"email","providers":["email"]}', '{}', now(), now())
        RETURNING id INTO v_user_id;

        UPDATE public.users SET role='teacher', name='Sarah Teacher', unique_id='TCH001', school_id='demo-school' WHERE id=v_user_id;
    END IF;

    ---------- 3. PARENT USER ----------
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_parent_email) THEN
        INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
        VALUES (gen_random_uuid(), 'authenticated', 'authenticated', v_parent_email, v_encrypted_pw, now(), '{"provider":"email","providers":["email"]}', '{}', now(), now())
        RETURNING id INTO v_user_id;

        UPDATE public.users SET role='parent', name='John Parent', unique_id='PAR001', school_id='demo-school' WHERE id=v_user_id;
    END IF;

    ---------- 4. STUDENT (Linked to Parent & Class) ----------
    -- Assumes a class exists, if not, creates one temporarily
    INSERT INTO public.classes (id, name, grade, section, school_id)
    VALUES (gen_random_uuid(), 'Class 10', '10', 'A', 'demo-school')
    ON CONFLICT DO NOTHING;

    INSERT INTO public.class_students (class_id, name, roll_number, parent_email, section)
    SELECT id, 'Rahul Student', '24', v_parent_email, 'A'
    FROM public.classes WHERE name='Class 10' LIMIT 1
    ON CONFLICT DO NOTHING;

END $$;
---------- END COPY ----------
```

2.  Paste this code into the SQL Editor in your browser.
3.  Click the **"Run"** button (bottom right of the query window).
    *   It should say "Success" or "No rows returned".

### Step 4: Verify & Login

Now you can open your app and log in with these credentials:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin.final@myschool.app` | `securepass1234` |
| **Teacher** | `teacher.final@myschool.app` | `securepass1234` |
| **Parent** | `parent.final@myschool.app` | `securepass1234` |

**Note:** The Student profile is linked to the **Parent account**. When you log in as the Parent, you will see "Rahul Student" in your dashboard.
