// scripts/create_new_admin_manual.js
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env');
const envData = fs.readFileSync(envPath, 'utf8');
const env = {};
envData.split('\n').forEach(line => {
  const [k, v] = line.split('=');
  if (k && v) env[k.trim()] = v.trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.EXPO_PUBLIC_SUPABASE_URL, env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
    const email = 'admin.fix@myschool.app';
    const pwd = 'pass1234';
    
    console.log(`Creating ${email}...`);
    
    // 1. SignUp
    const { data: { user }, error: err } = await supabase.auth.signUp({
        email: email,
        password: pwd,
        options: {
            data: {
                full_name: 'Fixed Admin' // Metadata sometimes bypasses RLS if triggers use it?
            }
        }
    });

    if (err) {
        console.error('Signup Error:', err.message);
        return;
    }
    
    if (user) {
        console.log(`User created. ID: ${user.id}`);
        
        // 2. We can't update profile via anon key due to RLS usually.
        // BUT the trigger might have created it.
        // Let's check if profile exists.
        const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single();
        
        if (profile) {
            console.log('Profile auto-created by trigger.');
            console.log('Role is currently:', profile.role); 
            // Trigger defaults to 'teacher' usually.
            // We can't update it to 'admin' with anon key if RLS forbids it.
            // RLS for 'users' typically allows users to update their OWN profile.
            // BUT maybe not the 'role' column?
        } else {
            console.log('No profile found. Trigger failed?');
        }
        
    }
}
run();
