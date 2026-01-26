# Firebase Firestore Rules Deployment

## Important: Manual Rule Deployment Required

Since this project doesn't have a `firebase.json` configuration file for Firebase CLI deployment, the Firestore security rules must be deployed manually through the Firebase Console.

## Steps to Deploy Firestore Rules

1. **Open Firebase Console**
   - Go to https://console.firebase.google.com/
   - Select your project

2. **Navigate to Firestore Rules**
   - Click on "Firestore Database" in the left sidebar
   - Click on the "Rules" tab

3. **Copy Updated Rules**
   - Open the `firestore.rules` file in this project
   - Copy the entire contents

4. **Paste and Publish**
   - Paste the rules into the Firebase Console editor
   - Click "Publish" button
   - Confirm the deployment

## Current Rules File Location
`firestore.rules`

## Critical Security Note
The updated rules include strict user isolation for the `shortlists` collection:
- Users can only read/write their own shortlist items
- All operations are filtered by `userId == request.auth.uid`
- This prevents users from accessing other users' favorites

**IMPORTANT**: Deploy these rules before users start using the shortlist feature to ensure data security!

## Verification
After deploying, you can test the rules in the Firebase Console:
1. Go to Rules tab
2. Click "Rules playground"
3. Test different scenarios:
   - Authenticated user reading their own shortlist ✅
   - Authenticated user reading another user's shortlist ❌
   - Unauthenticated user accessing shortlist ❌

## Alternative: Add Firebase Configuration (Future Enhancement)

To enable CLI deployment in the future, create a `firebase.json` file:

```json
{
  "firestore": {
    "rules": "firestore.rules"
  },
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

Then run:
```bash
firebase deploy --only firestore:rules
```
