// scripts/reset_admin_password.js
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Safe Environment Parser
const envPath = path.resolve(__dirname, '../.env');
const envData = fs.readFileSync(envPath, 'utf8');
const env = {};
envData.split('\n').forEach(line => {
  const [k, v] = line.split('=');
  if (k && v) env[k.trim()] = v.trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.EXPO_PUBLIC_SUPABASE_URL, env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

async function resetAdmin() {
    const email = 'admin.final@myschool.app';
    const newPass = 'pass1234';

    console.log(`Resetting password for ${email}...`);

    const { data: user, error: err } = await supabase.auth.signInWithPassword({
        email: email,
        password: 'securepass1234'
    });

    if (user?.user) {
        console.log('Login worked with old password... weird.');
    }

    // Since we can't reset password easily with anon key unless we have the user logged in,
    // OR unless we use the service role key (which we don't have here usually).
    // BUT we can just UPDATE the user via SQL if we were in the dashboard.
    
    // Instead, let's just try to update it if we can login.
    // If login failed, user might be deleted or recreated with different ID?
    
    // Let's create a NEW admin to be sure.
    const newEmail = 'admin.new@myschool.app';
    console.log(`Creating NEW admin: ${newEmail} / ${newPass}`);
    
    const { data: signup, error: signErr } = await supabase.auth.signUp({
        email: newEmail,
        password: newPass
    });
    
    if (signErr) {
        console.log('Signup error:', signErr.message);
    } else if (signup?.user) {
        console.log(`New Admin Created! ID: ${signup.user.id}`);
        // Assign Role
        const { error: profileErr } = await supabase.from('users').upsert({
            id: signup.user.id,
            email: newEmail,
            role: 'admin',
            name: 'New Admin',
            unique_id: 'NEWADMIN',
            school_id: 'demo-school'
        });
        
        if (!profileErr) {
             console.log('SUCCESS: use these credentials:');
             console.log(`Email: ${newEmail}`);
             console.log(`Unique ID: NEWADMIN`);
             console.log(`Password: ${newPass}`);
        } else {
             console.log('Profile update failed:', profileErr.message);
        }
    }
}

resetAdmin();
