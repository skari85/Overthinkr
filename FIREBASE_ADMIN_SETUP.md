# Firebase Admin SDK Setup

## 1. Get Your Private Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your **overthinkr-8a79c** project
3. Click the gear icon → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Download the JSON file

## 2. Environment Variables

Add these to your Vercel environment variables:

\`\`\`env
# Firebase Admin
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@overthinkr-8a79c.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
...your full private key here...
-----END PRIVATE KEY-----"

# Firebase Project
NEXT_PUBLIC_FIREBASE_PROJECT_ID=overthinkr-8a79c

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
\`\`\`

## 3. Important Notes

- **Copy the entire private key** including the BEGIN/END lines
- **Keep the quotes** around the private key
- **Don't remove the \n characters** - they're needed for line breaks
- **The client_email should match exactly**: firebase-adminsdk-fbsvc@overthinkr-8a79c.iam.gserviceaccount.com

## 4. Testing

After setting the environment variables, your checkout flow will:
1. Verify user authentication server-side
2. Create secure Stripe checkout sessions
3. Link payments to user accounts via metadata
4. Update user premium status via webhooks
