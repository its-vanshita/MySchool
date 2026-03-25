// scripts/seed_data.js
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Manually parse .env (Expo uses EXPO_PUBLIC_ prefix, usually in .env)
const envPath = path.resolve(__dirname, '../.env');
let envData;
try {
  envData = fs.readFileSync(envPath, 'utf8');
} catch (e) {
  console.log('Could not find .env file at:', envPath);
  process.exit(1);
}

// Simple parser for KEY=VALUE
const env = {};
envData.split('\n').forEach(line => {
  const [k, v] = line.split('=');
  if (k && v) {
    env[k.trim()] = v.trim().replace(/^['"]|['"]$/g, '');
  }
});

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Supabase URL or Key missing in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  console.log('Seeding initial data...');

  // --- 1. Create a School ---
  const { data: school, error: schoolErr } = await supabase
    .from('schools')
    .insert({ name: 'My Global School', address: '123 Education Lane' })
    .select()
    .single();

  if (schoolErr) {
    console.error('Error creating school:', schoolErr);
    // If error, likely constraints or RLS, but for anon key usually fine if unauthenticated inserts allowed?
    // Wait, anon key has restrictions usually. Seed script often needs service_role key IF RLS is strict.
    // BUT we might be able to use signUp for users. Data insertion might fail if RLS is on.
    // If so, user needs to disable RLS temporarily or use service role key.
    // I don't have service role key in .env usually.
    // Let's assume user is admin or policies allow creation for testing.
    // If not, I will fail gracefully.
  }
  
  const schoolId = school ? school.id : 'demo-school'; 
  // If school creation failed (e.g. RLS), we might need to rely on existing data or public access.
  // Actually, for a *real production* setup, you'd want to use the dashboard SQL editor.
  // But let's try.

  // --- 2. Create Class ---
  const { data: cls, error: clsErr } = await supabase
    .from('classes')
    .insert({ name: 'Class 10', section: 'A', grade: '10', school_id: schoolId })
    .select()
    .single();

  if (clsErr) console.log('Class creation note:', clsErr.message);
  const classId = cls?.id;

  // --- 3. Create Teacher User ---
  const teacherEmail = 'teacher@myschool.app';
  const teacherPass = 'pass1234';
  
  let { data: tAuth, error: tErr } = await supabase.auth.signUp({
    email: teacherEmail,
    password: teacherPass,
  });

  if (tErr) console.log('Teacher Auth Note:', tErr.message);
  
  if (tAuth.user) {
    // Update profile
    const { error: upErr } = await supabase
      .from('users')
      .update({
        role: 'teacher',
        name: 'Sarah Teacher',
        unique_id: 'TEACHER01',
        school_id: schoolId,
        subjects: ['Mathematics', 'Science']
      })
      .eq('id', tAuth.user.id);
      
    if (upErr) console.log('Teacher Profile Update Error:', upErr.message);
    else console.log('Teacher created: teacher@myschool.app / pass1234');
  }

  // --- 4. Create Parent User ---
  const parentEmail = 'parent@myschool.app';
  const parentPass = 'pass1234';

  let { data: pAuth, error: pErr } = await supabase.auth.signUp({
    email: parentEmail,
    password: parentPass,
  });

  if (pErr) console.log('Parent Auth Note:', pErr.message);

  if (pAuth.user) {
    // Update profile
    const { error: upErr } = await supabase
      .from('users')
      .update({
        role: 'parent',
        name: 'Rajesh Parent',
        unique_id: 'PARENT01',
        school_id: schoolId
      })
      .eq('id', pAuth.user.id);

    if (upErr) console.log('Parent Profile Update Error:', upErr.message);
    else console.log('Parent created: parent@myschool.app / pass1234');
  }

  // --- 5. Create Student Record (Linked to Parent & Class) ---
  if (classId && pAuth.user) {
    const { error: sErr } = await supabase
      .from('class_students')
      .insert({
        name: 'Arjun Student',
        roll_number: '101',
        class_id: classId,
        parent_id: pAuth.user.id,
        parent_email: parentEmail,
        dob: '2010-01-01',
        section: 'A'
      });

    if (sErr) console.log('Student Creation Error:', sErr.message);
    else console.log('Student record created for Arjun, linked to Parent.');
  } else {
    console.log('Skipping student creation - missing class or parent.');
  }
}

main();
