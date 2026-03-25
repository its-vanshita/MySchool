# How to Build Your Android APK

Since you don't have the heavy Android Development environment (Android Studio & SDK) installed on this computer, we will use **EAS Build** (Cloud Build) to generate the APK for you.

This process allows Expo's servers to build the app and give you a download link/QR code.

### Step 1: Login to Expo

Run this command in your terminal and log in with your Expo account credentials:

```powershell
npx eas-cli login
```

*(If you don't have an account, it will ask you to create one, or you can sign up at [expo.dev](https://expo.dev/signup))*

### Step 2: Configure the Project (First Time Only)

Run this to link your project to your Expo account:

```powershell
npx eas-cli build:configure
```

*   Select `Android` when asked.
*   It should say "Configured for EAS Build".

### Step 3: Build the APK

Run this command to start the build:

```powershell
npx eas-cli build --platform android --profile preview
```

### Step 4: Install on Your Phone

1.  The build will take **10-15 minutes** (in the cloud).
2.  When finished, the terminal will show a **QR Code**.
3.  Scan it with your Android phone camera or a QR scanner.
4.  Download the `.apk` file.
5.  Tap to **Install**. (You may need to allow "Install from Unknown Sources").

---

### Troubleshooting

*   **"Keystore" questions:** If asked about generating a new keystore, simply choose **"Generate new keystore"** (default).
*   **Gradel errors:** If the build fails, check the error link provided.
*   **Wait time:** Cloud builds can have a queue if you are on the free plan. Just keep the terminal open.
