# Google Authentication Setup Guide

## Option 1: Firebase Auth (Recommended - Current Setup)

### Firebase Console Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project `overthinkr-8a79c`
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Google** provider
5. Enable it and configure:
   - **Web SDK configuration** will be auto-generated
   - **Support email** (required)
   - **Project public-facing name**

### Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to **APIs & Services** → **Credentials**
4. Find the OAuth 2.0 client created by Firebase
5. Add authorized domains:
   - `localhost:3000` (development)
   - `v0.dev` (v0 preview)
   - `your-production-domain.com`

## Option 2: Custom OAuth (If using Vercel env vars)

### Vercel Environment Variables
Add these to your Vercel project:
\`\`\`
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
\`\`\`

### Google Cloud Console Setup
1. Create OAuth 2.0 credentials
2. Add authorized redirect URIs:
   - `https://overthinkr-8a79c.firebaseapp.com/__/auth/handler`
   - `http://localhost:3000` (development)
   - Your production domain

## Troubleshooting

### Error: "unauthorized_client"
- Check that your domain is in authorized domains
- Verify the client ID matches your Google Cloud project

### Error: "redirect_uri_mismatch"
- Add the exact redirect URI to Google Cloud Console
- For Firebase Auth, use: `https://overthinkr-8a79c.firebaseapp.com/__/auth/handler`

### Error: "access_blocked"
- Your app needs to be verified by Google for production use
- Add test users in Google Cloud Console for development

## Testing

1. **Development**: Test on `localhost:3000`
2. **v0 Preview**: Test on your v0.dev URL
3. **Production**: Test on your live domain

## Security Notes

- Never expose `GOOGLE_CLIENT_SECRET` in client-side code
- Use `NEXT_PUBLIC_` prefix only for client-side variables
- The client secret should only be used in server-side API routes
