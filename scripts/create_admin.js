// scripts/create_admin.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
  console.log('--- Creating Admin User (principal@myschool.app) ---');

  const email = 'principal@myschool.app';
  const password = 'securepass1234';

  let user = null;

  // 1. Try Login
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginData?.user) {
    console.log('✔ User already exists and login successful.');
    user = loginData.user;
  } else {
    // 2. Handle Login Failures
    if (loginError?.message === 'Email not confirmed') {
      console.error('❌ ERROR: User created but email NOT confirmed.');
      console.error('👉 ACTION REQUIRED: Go to Supabase Dashboard > Authentication > Users.');
      console.error('   Either manually Confirm the user, or delete the user and try again after disabling "Confirm Email".');
      return;
    }
    
    if (loginError?.message === 'Invalid login credentials') {
        console.log('ℹ️ User might exist with different password, or not exist at all.');
    }

    // 3. Try to Sign Up (if login failed/user missing)
    console.log('Attempting to create new user...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      if (signUpError.message.includes('rate limit')) {
        console.error('❌ ERROR: Rate limit exceeded (Too many signups from this IP).');
        console.error('👉 ACTION REQUIRED: Wait ~1 hour or create user manually in Supabase Dashboard.');
      } else if (signUpError.message.includes('User already registered')) {
        console.error('❌ ERROR: User already registered but login failed.');
        console.error('👉 ACTION REQUIRED: Check if user is confirmed in Dashboard, or try a different password.');
      } else {
        console.error(`❌ Signup Error: ${signUpError.message}`);
      }
      return;
    }

    if (signUpData?.user) {
      user = signUpData.user;
      console.log('✔ User created successfully.');
      
      // Check confirmation status immediately
      if (user.identities && user.identities[0]?.identity_data?.email_verified === false) {
          console.warn('⚠️ WARNING: Email confirmation is enabled in your Supabase project.');
          console.warn('   You won\'t be able to log in until you confirm the email or disable confirmation in dashboard.');
      }
    }
  }

  // 4. Update Profile to Admin Role
  if (user) {
    console.log(`Updating profile for User ID: ${user.id}...`);
    
    const updates = {
      role: 'admin',
      name: 'Principal Admin',
      unique_id: 'ADMIN01',
      school_id: 'demo-school',
      updated_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id);

    if (updateError) {
      console.error('⚠️ Update failed:', updateError.message);
      
      // Try Upsert as backup
      console.log('Trying UPSERT fallback...');
      const { error: upsertError } = await supabase
        .from('users')
        .upsert({
             id: user.id,
             email: email,
             ...updates
        });
        
      if (upsertError) {
          console.error('❌ Upsert also failed:', upsertError.message);
      } else {
          console.log('✔ Admin profile created (via Upsert).');
      }
    } else {
      console.log('✔ Admin role assigned successfully.');
    }

    console.log('\n--- Credentials ---');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  }
}

createAdmin();
