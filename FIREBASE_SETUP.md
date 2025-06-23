# Firebase Setup Instructions

## Fixing the "auth/unauthorized-domain" Error

The `auth/unauthorized-domain` error occurs when the current domain is not authorized in your Firebase project. Here's how to fix it:

### 1. Go to Firebase Console
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`overthinkr-ae885`)

### 2. Navigate to Authentication Settings
1. Click on **Authentication** in the left sidebar
2. Go to the **Settings** tab
3. Scroll down to **Authorized domains**

### 3. Add Your Domains
Add the following domains to your authorized domains list:

**For Local Development:**
- `localhost`
- `127.0.0.1`

**For v0.dev Preview:**
- `v0.dev`
- `*.v0.dev` (if wildcard is supported)
- The specific preview URL you're using

**For Production:**
- `overthinkr.xyz`
- `www.overthinkr.xyz`
- Any other production domains

### 4. Save Changes
Click **Save** after adding the domains.

### 5. Wait for Propagation
Changes may take a few minutes to propagate. Try logging in again after 2-3 minutes.

## Alternative Solutions

### Option 1: Use Email/Password Authentication
If you can't modify Firebase settings, use the email/password login which doesn't require domain authorization.

### Option 2: Test with Anonymous Login
Anonymous authentication should work without domain restrictions.

### Option 3: Use Email Link Authentication
Email link authentication may work as an alternative to social login.

## Firebase Configuration Checklist

- [ ] Project created in Firebase Console
- [ ] Authentication enabled
- [ ] Email/Password provider enabled
- [ ] Google provider enabled (if using Google login)
- [ ] GitHub provider enabled (if using GitHub login)
- [ ] Authorized domains configured
- [ ] Firestore database created
- [ ] Storage bucket created
- [ ] Security rules configured

## Environment Variables

Make sure your `.env.local` file has the correct Firebase configuration:

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyASioCZ7-tEynXFVQA5DB8XqkHqKq9OaV0
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=overthinkr-ae885.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=overthinkr-ae885
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=overthinkr-ae885.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=976828352294
NEXT_PUBLIC_FIREBASE_APP_ID=1:976828352294:web:4175693776ad102d6523e7
\`\`\`

## Testing Authentication

1. **Email/Password**: Should work immediately
2. **Anonymous**: Should work immediately  
3. **Email Link**: Should work immediately
4. **Google/GitHub**: Requires domain authorization

## Common Issues

### Issue: "auth/popup-blocked"
**Solution**: Allow popups in your browser for the current domain.

### Issue: "auth/popup-closed-by-user"
**Solution**: Complete the authentication flow without closing the popup.

### Issue: "auth/account-exists-with-different-credential"
**Solution**: Use the same authentication method you used to create the account.

## Support

If you continue to have issues:
1. Check the browser console for detailed error messages
2. Verify Firebase project settings
3. Ensure all required APIs are enabled in Google Cloud Console
4. Contact Firebase support if needed
