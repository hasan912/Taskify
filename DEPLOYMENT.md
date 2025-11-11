# 🚀 Taskify Deployment Guide

Complete deployment guide for Taskify application on Vercel with Firebase backend.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- ✅ Firebase project created and configured
- ✅ Firestore database initialized
- ✅ Firebase Authentication enabled (Email/Password)
- ✅ Gmail App Password generated (for email notifications)
- ✅ Code tested locally with `npm run dev`
- ✅ Production build successful with `npm run build`

---

## 🔥 Firebase Setup (Required)

### Step 1: Firebase Console Configuration

1. **Go to Firebase Console**: https://console.firebase.google.com
2. **Select your project** (taskify-addcd or create new)

### Step 2: Create Firestore Indexes

```bash
# Option 1: Using Firebase CLI
firebase login
firebase init firestore
firebase deploy --only firestore:indexes,firestore:rules

# Option 2: Manual (Firebase Console)
Go to: Firestore Database → Indexes → Composite Indexes
```

**Required Indexes:**

1. **Notifications Collection**
   - Collection ID: `notifications`
   - Fields:
     - `userId` (Ascending)
     - `createdAt` (Descending)

2. **Tasks Collection (Status)**
   - Collection ID: `tasks`
   - Fields:
     - `status` (Ascending)
     - `createdAt` (Descending)

3. **Tasks Collection (Assigned)**
   - Collection ID: `tasks`
   - Fields:
     - `assignedTo` (Ascending)
     - `createdAt` (Descending)

### Step 3: Deploy Firestore Rules

```bash
# Using CLI
firebase deploy --only firestore:rules

# Or copy from firestore.rules to Firebase Console → Firestore → Rules
```

---

## 🌐 Vercel Deployment

### Method 1: Deploy via Vercel CLI (Recommended)

```powershell
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
cd D:\Taskify
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? taskify
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

### Method 2: Deploy via Vercel Dashboard

1. **Push code to GitHub**
```powershell
git init
git add .
git commit -m "Initial commit - Taskify production ready"
git remote add origin https://github.com/yourusername/taskify.git
git push -u origin main
```

2. **Import to Vercel**
   - Go to: https://vercel.com/new
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: **Next.js**
     - Build Command: `npm run build`
     - Install Command: `npm install --legacy-peer-deps`
     - Output Directory: `.next`

3. **Add Environment Variables**

Go to: Project Settings → Environment Variables

Add these variables:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=taskify-addcd.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=taskify-addcd
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=taskify-addcd.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Gmail SMTP (Optional - for email notifications)
GMAIL_USER=muhammadhasanbaig123@gmail.com
GMAIL_APP_PASSWORD=vidstgwqmwapuvoa
```

**Where to find Firebase values:**
- Firebase Console → Project Settings → General → Your apps → Web app

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2 minutes)
   - ✅ Your app will be live at: `https://taskify-xxxx.vercel.app`

---

## 📧 Email Configuration (Optional)

### Gmail SMTP Setup

1. **Enable 2-Step Verification**
   - https://myaccount.google.com/security

2. **Generate App Password**
   - https://myaccount.google.com/apppasswords
   - App: Mail
   - Device: Other (Taskify)
   - Copy 16-digit password

3. **Add to Vercel**
   - Settings → Environment Variables
   - `GMAIL_USER`: your-email@gmail.com
   - `GMAIL_APP_PASSWORD`: 16-digit-password (no spaces)

**Note:** Email is optional. In-app notifications work without it.

---

## 🔒 Security Checklist

Before going live:

- ✅ Firestore security rules deployed
- ✅ Environment variables set in Vercel
- ✅ `.env.local` added to `.gitignore`
- ✅ Firebase API keys restricted (optional but recommended)
- ✅ CORS configured for your domain

### Restrict Firebase API Keys (Recommended)

Firebase Console → Project Settings → General:
- Click on API Key
- Application restrictions:
  - HTTP referrers: `https://your-domain.vercel.app/*`

---

## 🧪 Post-Deployment Testing

After deployment, test these features:

1. **Authentication**
   - Sign up new user
   - Login existing user
   - Logout

2. **Task Management**
   - Create task (admin)
   - View tasks (member)
   - Update task status
   - Delete task (admin)

3. **Notifications**
   - Check notification bell
   - Verify real-time updates
   - Test mark as read

4. **Email (if configured)**
   - Assign task to user
   - Check email inbox

---

## 📊 Production URLs

After successful deployment:

- **App URL**: `https://taskify-xxxx.vercel.app`
- **Dashboard**: `https://taskify-xxxx.vercel.app/dashboard`
- **API**: `https://taskify-xxxx.vercel.app/api/send-email`

---

## 🐛 Troubleshooting

### Build Errors

**Error: "Module not found"**
```powershell
# Clear cache and reinstall
rm -rf node_modules .next
npm install --legacy-peer-deps
npm run build
```

**Error: "Environment variable not found"**
- Check Vercel environment variables are set
- Redeploy after adding variables

### Firebase Errors

**Error: "Firestore permission denied"**
- Deploy firestore.rules
- Check user authentication

**Error: "Index required"**
- Click the index creation link in error
- Or deploy firestore.indexes.json

### Email Errors

**Error: "ECONNRESET"**
- Check Gmail App Password is correct
- Verify 2-Step Verification enabled
- Email is optional - in-app notifications work without it

---

## 🔄 Continuous Deployment

### Auto-Deploy from Git

Vercel automatically deploys when you push to main branch:

```powershell
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel will auto-deploy
```

### Manual Redeploy

```powershell
vercel --prod
```

---

## 📈 Performance Optimization

Already implemented:

- ✅ Next.js 16 with Turbopack (faster builds)
- ✅ Static page generation where possible
- ✅ Code splitting and lazy loading
- ✅ Image optimization (if using next/image)
- ✅ CSS optimization with TailwindCSS 4

---

## 🎯 Production Features

Your deployed app includes:

- ✅ Modern UI with dark/light theme
- ✅ Firebase Authentication
- ✅ Real-time Firestore database
- ✅ In-app notifications (real-time)
- ✅ Email notifications (optional)
- ✅ Task management (CRUD)
- ✅ Role-based access (Admin/Member)
- ✅ Beautiful charts and analytics
- ✅ Responsive design (mobile-friendly)
- ✅ Urdu language support

---

## 📝 Next Steps After Deployment

1. **Custom Domain (Optional)**
   - Vercel Dashboard → Domains → Add domain
   - Configure DNS records

2. **Analytics (Optional)**
   - Add Vercel Analytics
   - Or Google Analytics

3. **Monitoring**
   - Vercel provides automatic monitoring
   - Check Runtime Logs for errors

4. **Backup**
   - Export Firestore data regularly
   - Firebase Console → Firestore → Import/Export

---

## 🎉 Success!

Your Taskify app is now live and ready for production use! 🚀

**Share your deployment URL and start managing tasks!**

Need help? Check:
- Vercel Docs: https://vercel.com/docs
- Firebase Docs: https://firebase.google.com/docs
- Next.js Docs: https://nextjs.org/docs
