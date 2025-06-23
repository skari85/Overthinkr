# Firebase Setup Instructions - Updated Project

## New Project Details
- **Project ID**: `overthinkr-8a79c`
- **Project Number**: `501719963551`
- **Auth Domain**: `overthinkr-8a79c.firebaseapp.com`

## Required Firebase Console Setup

### 1. Enable Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project `overthinkr-8a79c`
3. Navigate to **Authentication** → **Get Started**
4. Go to **Sign-in method** tab
5. Enable the following providers:
   - ✅ **Email/Password**
   - ✅ **Anonymous**
   - ✅ **Google** (optional)
   - ✅ **GitHub** (optional)
   - ✅ **Email Link** (passwordless)

### 2. Configure Authorized Domains
1. In Authentication → **Settings** → **Authorized domains**
2. Add these domains:
   - `localhost` (for local development)
   - `127.0.0.1` (for local development)
   - `v0.dev` (for v0 previews)
   - `*.v0.dev` (for v0 subdomains)
   - `overthinkr.xyz` (production domain)
   - `www.overthinkr.xyz` (production www)

### 3. Create Firestore Database
1. Navigate to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location (preferably close to your users)

### 4. Enable Storage
1. Navigate to **Storage**
2. Click **Get started**
3. Choose **Start in test mode**
4. Select the same location as Firestore

### 5. Configure Security Rules

**Firestore Rules** (Database → Rules):
\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own conversations
    match /conversations/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own analytics
    match /analytics/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own achievements
    match /achievements/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
\`\`\`

**Storage Rules** (Storage → Rules):
\`\`\`javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can upload/read their own files
    match /uploads/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /what-if-analysis/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
\`\`\`

## Environment Variables

Update your `.env.local` file:

\`\`\`env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDElkoHboShTMRtY5w-RTRR4cmmZbdefdM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=overthinkr-8a79c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=overthinkr-8a79c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=overthinkr-8a79c.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=501719963551
NEXT_PUBLIC_FIREBASE_APP_ID=1:501719963551:web:55aa75df800461215f8faa
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-53EM1RDJL2

# Other API Keys
GROQ_API_KEY=your-groq-key-here
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
\`\`\`

## Testing Checklist

After setup, test these features:

### Authentication
- [ ] Email/Password signup
- [ ] Email/Password login
- [ ] Anonymous login
- [ ] Google login (if enabled)
- [ ] GitHub login (if enabled)
- [ ] Email link authentication
- [ ] Logout functionality

### Data Persistence
- [ ] Chat messages save to Firestore
- [ ] Analytics data saves
- [ ] Achievements save
- [ ] User profile data saves

### File Upload
- [ ] Files upload to Storage
- [ ] File validation works
- [ ] File deletion works

### Premium Features
- [ ] Stripe integration works
- [ ] Premium status updates in Firestore
- [ ] What If explorer unlocks for premium users

## Common Setup Issues

### Issue: "Firebase project not found"
**Solution**: Verify the project ID is correct in the config

### Issue: "Permission denied" errors
**Solution**: Check Firestore and Storage security rules

### Issue: "Auth domain not authorized"
**Solution**: Add your domain to authorized domains list

### Issue: "Storage bucket not found"
**Solution**: Enable Storage in Firebase Console

## Next Steps

1. **Deploy the updated configuration**
2. **Test authentication flows**
3. **Verify data persistence**
4. **Test file uploads**
5. **Configure Stripe webhooks** (if using premium features)

## Support

If you encounter issues:
1. Check the browser console for detailed errors
2. Verify all Firebase services are enabled
3. Ensure security rules are properly configured
4. Check that all required APIs are enabled in Google Cloud Console
