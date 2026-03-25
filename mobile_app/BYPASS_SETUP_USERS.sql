-- ══════════════════════════════════════════════════════════════
-- MANUAL USER SETUP (Bypassing Rate Limits & Confirmation)
-- ══════════════════════════════════════════════════════════════
-- Copy and Paste the code below completely into your Supabase SQL Editor.
-- This will create 3 users with "securepass1234" and auto-confirm them.
-- ══════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
    -- Define credential variables
    v_admin_email    TEXT := 'admin.final@myschool.app';
    v_teacher_email  TEXT := 'teacher.final@myschool.app';
    v_parent_email   TEXT := 'parent.final@myschool.app';
    v_password       TEXT := 'securepass1234';
    v_encrypted_pw   TEXT;
    v_user_id        UUID;
BEGIN
    -- Pre-calculate hash
    v_encrypted_pw := crypt(v_password, gen_salt('bf'));

    ----------------------------------------------------
    -- 1. ADMIN USER
    ----------------------------------------------------
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_admin_email) THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, 
            email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
            confirmation_token, recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', v_admin_email, v_encrypted_pw, 
            now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), 
            '', ''
        ) RETURNING id INTO v_user_id;

        -- We rely on the trigger for public.users creation, but we must update the role
        -- Sleep slightly or just update? Update usually works immediately in same transaction (trigger fires first)
        UPDATE public.users 
        SET role = 'admin', name = 'Principal Admin', unique_id = 'ADMIN_FINAL', school_id='demo-school' 
        WHERE id = v_user_id;
    END IF;

    ----------------------------------------------------
    -- 2. TEACHER USER
    ----------------------------------------------------
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_teacher_email) THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, 
            email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', v_teacher_email, v_encrypted_pw, 
            now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()
        ) RETURNING id INTO v_user_id;

        UPDATE public.users 
        SET role = 'teacher', name = 'Sarah Teacher', unique_id = 'TEACHER_FINAL', school_id='demo-school' 
        WHERE id = v_user_id;
    END IF;

    ----------------------------------------------------
    -- 3. PARENT USER
    ----------------------------------------------------
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_parent_email) THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, 
            email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', v_parent_email, v_encrypted_pw, 
            now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()
        ) RETURNING id INTO v_user_id;

        UPDATE public.users 
        SET role = 'parent', name = 'John Parent', unique_id = 'PARENT_FINAL', school_id='demo-school' 
        WHERE id = v_user_id;
    END IF;

END $$;
