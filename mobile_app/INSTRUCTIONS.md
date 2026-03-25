# MANUAL USER SETUP INSTRUCTIONS (Guaranteed Fix)

Since automatic scripts are blocked by Supabase Rate Limits and Email Confirmation settings, please follow these steps to manually create the 3 required users in less than 2 minutes.

### Step 1: Open SQL Editor
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open your project.
3. Click on the **SQL Editor** icon (looks like a terminal `>_`) in the left sidebar.
4. Click **New Query**.

### Step 2: Run the Setup Script
1. Copy the **entire content** of the file `BYPASS_SETUP_USERS.sql` from your project folder.
   *(You can find this file in the root of your workspace)*.
2. Paste it into the SQL Editor in your browser.
3. Click **Run** (bottom right).

*This script will:*
- Create `admin.final@myschool.app` with password `securepass1234`.
- Create `teacher.final@myschool.app` with password `securepass1234`.
- Create `parent.final@myschool.app` with password `securepass1234`.
- Automatically **confirm** their emails so you can log in immediately.
- Assign the correct **roles** (Admin, Teacher, Parent).

### Step 3: Login to the App
Use these credentials in your app:

**Admin:**
- Email: `admin.final@myschool.app`
- Password: `securepass1234`

**Teacher:**
- Email: `teacher.final@myschool.app`
- Password: `securepass1234`

**Parent:**
- Email: `parent.final@myschool.app`
- Password: `securepass1234`

---
**Note:** If you see any errors about "duplicate key value violates unique constraint", it means the users already exist. You can ignore it if you already ran the script successfully.
