-- ══════════════════════════════════════════════════════════════
-- COMPLETE TEST ENVIRONMENT SETUP
-- ══════════════════════════════════════════════════════════════
-- This script sets up a fully functioning school environment with:
-- 1. Three authenticated Users (Admin, Teacher, Parent)
-- 2. One School Record
-- 3. One Class (Class 10-A)
-- 4. One Student (Linked to Parent & Class)
-- ══════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
    -- IDs
    v_school_id      UUID := gen_random_uuid();
    v_class_id       UUID := gen_random_uuid();
    v_student_id     UUID := gen_random_uuid();
    v_admin_id       UUID;
    v_teacher_id     UUID;
    v_parent_id      UUID;
    
    -- Emails
    v_admin_email    TEXT := 'admin.final@myschool.app';
    v_teacher_email  TEXT := 'teacher.final@myschool.app';
    v_parent_email   TEXT := 'parent.final@myschool.app';
    v_password       TEXT := 'securepass1234';
    v_encrypted_pw   TEXT;
BEGIN
    -- Encrypt Password
    v_encrypted_pw := crypt(v_password, gen_salt('bf'));

    ----------------------------------------------------------------
    -- 1. Create School (if not exists)
    ----------------------------------------------------------------
    -- We'll just insert a new one or use an existing one to keep it simple
    IF NOT EXISTS (SELECT 1 FROM schools LIMIT 1) THEN
        INSERT INTO schools (id, name, address) 
        VALUES (v_school_id, 'My Global School', '123 Test Lane');
    ELSE
        SELECT id INTO v_school_id FROM schools LIMIT 1;
    END IF;

    ----------------------------------------------------------------
    -- 2. Create Class (Class 10-A)
    ----------------------------------------------------------------
    IF NOT EXISTS (SELECT 1 FROM classes WHERE name = 'Class 10') THEN
        INSERT INTO classes (id, name, grade, section, school_id)
        VALUES (v_class_id, 'Class 10', '10', 'A', v_school_id::text);
    ELSE
        SELECT id INTO v_class_id FROM classes WHERE name = 'Class 10' LIMIT 1;
    END IF;

    ----------------------------------------------------------------
    -- 3. Create AUTH Users (Admin, Teacher, Parent)
    ----------------------------------------------------------------
    
    -- ADMIN
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_admin_email) THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, 
            email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', v_admin_email, v_encrypted_pw, 
            now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()
        ) RETURNING id INTO v_admin_id;
        
        -- Update Public Profile
        UPDATE public.users SET role='admin', name='Principal Admin', unique_id='ADM001', school_id='demo-school' WHERE id=v_admin_id;
    ELSE
        SELECT id INTO v_admin_id FROM auth.users WHERE email = v_admin_email;
    END IF;

    -- TEACHER
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_teacher_email) THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, 
            email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', v_teacher_email, v_encrypted_pw, 
            now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()
        ) RETURNING id INTO v_teacher_id;
        
        UPDATE public.users SET role='teacher', name='Sarah Teacher', unique_id='TCH001', school_id='demo-school' WHERE id=v_teacher_id;
    ELSE
         SELECT id INTO v_teacher_id FROM auth.users WHERE email = v_teacher_email;
    END IF;

    -- PARENT
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_parent_email) THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, 
            email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', v_parent_email, v_encrypted_pw, 
            now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()
        ) RETURNING id INTO v_parent_id;
        
        UPDATE public.users SET role='parent', name='John Parent', unique_id='PAR001', school_id='demo-school' WHERE id=v_parent_id;
    ELSE
         SELECT id INTO v_parent_id FROM auth.users WHERE email = v_parent_email;
    END IF;

    ----------------------------------------------------------------
    -- 4. Create STUDENT (Linked to Parent & Class)
    ----------------------------------------------------------------
    IF NOT EXISTS (SELECT 1 FROM class_students WHERE parent_email = v_parent_email) THEN
        INSERT INTO class_students (id, class_id, name, roll_number, parent_email, parent_id, section)
        VALUES (
            v_student_id, 
            v_class_id, 
            'Rahul Student', 
            '24', 
            v_parent_email, 
            v_parent_id,
            'A'
        );
    END IF;

END $$;
