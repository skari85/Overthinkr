# Complete OAuth Setup Guide

## Environment Variables in Vercel

You should now have these environment variables configured in your Vercel project:

### Required Variables
\`\`\`env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDElkoHboShTMRtY5w-RTRR4cmmZbdefdM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=overthinkr-8a79c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=overthinkr-8a79c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=overthinkr-8a79c.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=501719963551
NEXT_PUBLIC_FIREBASE_APP_ID=1:501719963551:web:55aa75df800461215f8faa

# Google OAuth (Client-side)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# Google OAuth (Server-side)
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth (Client-side)
NEXT_PUBLIC_GITHUB_CLIENT_ID=your-github-client-id

# GitHub OAuth (Server-side)
GITHUB_CLIENT_SECRET=your-github-client-secret

# AI Service
GROQ_API_KEY=your-groq-api-key

# Stripe (if using premium features)
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
\`\`\`

## Firebase Console Setup

### 1. Enable Authentication Providers
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project `overthinkr-8a79c`
3. Navigate to **Authentication** → **Sign-in method**
4. Enable these providers:
   - ✅ **Email/Password**
   - ✅ **Anonymous**
   - ✅ **Google**
   - ✅ **GitHub**
   - ✅ **Email Link** (passwordless)

### 2. Configure Google Provider
1. Click on **Google** in sign-in methods
2. Enable the provider
3. Add your **Web SDK configuration**:
   - Use the same client ID from your Vercel environment variables
   - Set support email
   - Set project public-facing name

### 3. Configure GitHub Provider
1. Click on **GitHub** in sign-in methods
2. Enable the provider
3. Add your GitHub OAuth app credentials:
   - Client ID: Same as `NEXT_PUBLIC_GITHUB_CLIENT_ID`
   - Client Secret: Same as `GITHUB_CLIENT_SECRET`

### 4. Add Authorized Domains
In Authentication → **Settings** → **Authorized domains**, add:
- `localhost` (development)
- `127.0.0.1` (development)
- `v0.dev` (v0 previews)
- `*.v0.dev` (v0 subdomains)
- Your production domain

## Google Cloud Console Setup

### 1. OAuth 2.0 Client Configuration
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 client ID
5. Add authorized redirect URIs:
   \`\`\`
   https://overthinkr-8a79c.firebaseapp.com/__/auth/handler
   http://localhost:3000/__/auth/handler
   https://your-v0-preview-url.v0.dev/__/auth/handler
   https://your-production-domain.com/__/auth/handler
   \`\`\`

### 2. Authorized JavaScript Origins
Add these origins:
\`\`\`
http://localhost:3000
https://v0.dev
https://your-v0-preview-url.v0.dev
https://your-production-domain.com
\`\`\`

## GitHub OAuth App Setup

### 1. Create GitHub OAuth App
1. Go to GitHub → **Settings** → **Developer settings** → **OAuth Apps**
2. Click **New OAuth App**
3. Configure:
   - **Application name**: Overthinkr
   - **Homepage URL**: Your production URL
   - **Authorization callback URL**: 
     \`\`\`
     https://overthinkr-8a79c.firebaseapp.com/__/auth/handler
     \`\`\`

### 2. Additional Callback URLs
For development and testing, you may need to create separate OAuth apps or add multiple callback URLs:
- `http://localhost:3000/__/auth/handler`
- `https://your-v0-preview-url.v0.dev/__/auth/handler`

## Testing Checklist

### Authentication Methods
- [ ] Email/Password signup ✅
- [ ] Email/Password login ✅
- [ ] Google OAuth login ✅
- [ ] GitHub OAuth login ✅
- [ ] Anonymous login ✅
- [ ] Email link authentication ✅
- [ ] Logout functionality ✅

### Error Handling
- [ ] Domain authorization errors handled gracefully
- [ ] Popup blocked errors handled
- [ ] Network errors handled
- [ ] Invalid credentials handled
- [ ] Account exists with different credential handled

### Data Persistence
- [ ] User data saves to Firestore
- [ ] Chat history persists
- [ ] Analytics data saves
- [ ] Premium status updates

## Common Issues & Solutions

### Issue: "unauthorized_client"
**Solution**: 
- Verify client IDs match between Vercel env vars and OAuth providers
- Check that redirect URIs are correctly configured

### Issue: "redirect_uri_mismatch"
**Solution**: 
- Add exact redirect URI to OAuth provider settings
- Use Firebase auth handler: `https://your-project.firebaseapp.com/__/auth/handler`

### Issue: "popup_blocked"
**Solution**: 
- User needs to allow popups for your domain
- Consider implementing redirect-based auth as fallback

### Issue: "access_blocked"
**Solution**: 
- For Google: App needs verification for production use
- Add test users in Google Cloud Console during development
- For GitHub: Check OAuth app settings and permissions

## Security Best Practices

1. **Environment Variables**:
   - Never expose client secrets in client-side code
   - Use `NEXT_PUBLIC_` prefix only for client-side variables
   - Keep server-side secrets secure

2. **OAuth Configuration**:
   - Use HTTPS in production
   - Restrict redirect URIs to your domains only
   - Regularly rotate client secrets

3. **Firebase Security**:
   - Configure proper Firestore security rules
   - Enable App Check for additional security
   - Monitor authentication logs

## Next Steps

1. **Test all authentication methods** on your current v0 preview
2. **Configure production domains** when ready to deploy
3. **Set up monitoring** for authentication errors
4. **Implement user profile management** features
5. **Add password reset functionality** if needed

Your OAuth setup is now complete and should work across all environments!
