# Supabase Setup Troubleshooting Guide

If the setup scripts are failing (looping, `email rate limit exceeded`, or `Email not confirmed`), follow these steps in your Supabase Dashboard to unblock development:

## 1. Disable Email Confirmation

By default, Supabase requires email verification for new signups. This blocks scripts from logging in immediately after creating users.

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project.
3. In the left sidebar, click **Authentication** (icon looks like a person/lock).
4. Under "Configuration", click **Providers**.
5. Click **Email**.
6. **Toggle OFF** "Confirm email".
7. Click **Save**.

**New users will now be auto-confirmed.**

## 2. Fix Existing "Unconfirmed" Users

If you already ran the scripts and see `Email not confirmed` errors:

1. Go to **Authentication > Users**.
2. Look for `teacher@myschool.app`, `parent@myschool.app`, `principal@myschool.app`.
3. If their status is "Waiting for confirmation":
   - Click the three dots `...` next to the user.
   - select **Confirm user**.
   - OR simply **Delete user** and run the scripts again.

## 3. Handle "Rate Limit Exceeded"

If you see `Sign-up failed: email rate limit exceeded`, you have made too many signups from your IP address in a short time.

**Solution:**
- Wait 1 hour for the limit to reset.
- OR Manually instantiate users in the Dashboard:
  - Go to **Authentication > Users**.
  - Click **Add User** -> **Create New User**.
  - Email: `principal@myschool.app`
  - Password: `securepass1234`
  - (Repeat for `teacher@myschool.app` / `securepass1234` if needed).
  - After creating manually, run `node scripts/create_admin.js` again. The script will detect the existing user and update their role to Admin.

## 4. Verify Database Connection
Ensure your `.env` file has the correct `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

---
**Run Scripts:**

Once fixed:
```bash
node scripts/create_admin.js
```
