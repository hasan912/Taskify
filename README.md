# 🎯 Taskify - Modern Team Task Management

A modern, beautiful task management system with real-time collaboration and email notifications. Built with Next.js, Firebase, and TailwindCSS.

## ✨ Features

- 🎨 **Modern UI Design** - Beautiful gradient-based design with glass morphism effects
- 👥 **Role-Based Access** - Admin and Member roles with different permissions
- 📧 **Email Notifications** - Automatic email notifications when tasks are assigned
- 📊 **Analytics Dashboard** - Visual charts and task distribution metrics
- 🔄 **Real-time Updates** - Live task updates using Firebase Firestore
- 🌙 **Dark Mode** - Full dark mode support
- 🔐 **Secure Authentication** - Firebase Authentication with email/password

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm package manager (or npm/yarn)
- Firebase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Taskify
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup Firebase**
   - Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Copy your Firebase config to `lib/firebase.ts`

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📧 Email Notifications Setup

The app includes email notification functionality when admins assign tasks to team members.

### Option 1: Using Resend (Recommended)

1. Sign up at [https://resend.com](https://resend.com)
2. Get your API key
3. Install the Resend package:
   ```bash
   pnpm add resend
   ```
4. Update `app/api/send-email/route.ts` with your API key:
   ```typescript
   import { Resend } from 'resend';
   const resend = new Resend(process.env.RESEND_API_KEY);
   ```

### Option 2: Using SendGrid

1. Sign up at [https://sendgrid.com](https://sendgrid.com)
2. Install the SendGrid package:
   ```bash
   pnpm add @sendgrid/mail
   ```
3. Update the API route accordingly

### Option 3: Using Nodemailer

1. Install nodemailer:
   ```bash
   pnpm add nodemailer
   ```
2. Configure with your SMTP settings

## 🎨 UI Customization

The app uses a modern purple-pink gradient theme. To customize:

1. Edit `app/globals.css` to change color variables
2. Update gradient classes in components
3. Modify the color palette in Tailwind config

### Current Color Scheme

- **Primary**: Purple (#8B5CF6)
- **Secondary**: Pink (#EC4899)
- **Accent**: Blue
- **Background**: Gradient from purple to pink

## 👤 User Roles

### Admin
- Create and assign tasks to team members
- Delete tasks
- View all tasks
- Access analytics dashboard

### Member
- View assigned tasks
- Update task status (Pending → In Progress → Completed)
- View analytics for assigned tasks

## 🏗️ Project Structure

```
Taskify/
├── app/
│   ├── api/
│   │   └── send-email/          # Email API endpoint
│   ├── dashboard/               # Dashboard page
│   ├── login/                   # Login page
│   ├── signup/                  # Signup page
│   └── page.tsx                 # Landing page
├── components/
│   ├── create-task-dialog.tsx   # Task creation dialog
│   ├── task-card.tsx            # Task card component
│   ├── stats-cards.tsx          # Statistics cards
│   └── ui/                      # UI components
├── lib/
│   ├── firebase.ts              # Firebase configuration
│   ├── auth-context.tsx         # Authentication context
│   └── email-service.ts         # Email service
└── public/                      # Static assets
```

## 🔧 Configuration

### Firebase Rules

Add these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    match /tasks/{taskId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow update, delete: if request.auth != null && 
                            get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 📱 Features in Detail

### Task Assignment with Email
- Admin creates a task and assigns it to a team member
- Team member receives an instant email notification
- Email includes task details and a link to the dashboard

### Real-time Collaboration
- All changes sync in real-time across all users
- Status updates reflect immediately
- Live task count and statistics

### Analytics Dashboard
- Visual representation of task distribution
- Pie charts showing task status breakdown
- Statistics cards with key metrics

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

The app can be deployed to:
- Netlify
- Railway
- AWS Amplify
- Any platform supporting Next.js

## 🛠️ Technologies Used

- **Framework**: Next.js 16
- **UI Library**: React 19
- **Styling**: TailwindCSS 4
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Charts**: Recharts
- **Notifications**: Sonner
- **Icons**: Lucide React

## 📝 License

MIT License - feel free to use this project for your own purposes!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Made with ❤️ using Next.js and Firebase
