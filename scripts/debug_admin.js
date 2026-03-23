// scripts/debug_admin.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL, 
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function checkAdmin() {
    console.log('Checking Admin Account...');
    
    // 1. Direct Login with Email
    const { data: { user }, error: loginErr } = await supabase.auth.signInWithPassword({
        email: 'admin.final@myschool.app',
        password: 'securepass1234'
    });
    
    if (loginErr) {
        console.error('Login Error:', loginErr.message);
        return;
    }
    console.log(`Auth Success! User ID: ${user.id}`);
    
    // 2. Check Profile Table
    const { data: profile, error: profileErr } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
        
    if (profileErr) {
        console.error('Profile Fetch Error:', profileErr.message);
    } else {
        console.log('Profile Found:');
        console.log(`- Unique ID: '${profile.unique_id}'`);
        console.log(`- Role: ${profile.role}`);
        console.log(`- Is First Login: ${profile.is_first_login}`);
    }
}

checkAdmin();
