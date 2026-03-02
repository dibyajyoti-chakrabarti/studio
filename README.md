# MechHub ⚙️

MechHub is a modern, high-performance platform designed to bridge the gap between innovators and the managed manufacturing network. Built with cutting-edge web technologies, it features a robust authentication system, real-time database capabilities, and a polished user interface.

## 🚀 Tech Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
*   **UI Library**: [React 19](https://react.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Components**: [Shadcn UI](https://ui.shadcn.com/) & [Radix Primitives](https://www.radix-ui.com/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Authentication & Database**: [Firebase](https://firebase.google.com/) (Auth, Firestore, Admin SDK)
*   **Transactional Emails**: [Resend](https://resend.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)

## ✨ Key Features

*   **Custom Authentication Flow**: Secure email/password registration and login with stringent validation.
*   **Google OAuth Integration**: Restricted to pre-registered and verified users to maintain platform integrity.
*   **Email Verification**: Automated, beautifully branded HTML verification emails sent via Resend upon registration. Users are blocked from accessing the platform until their email is verified.
*   **Secure Password Reset**: End-to-end "Forgot Password" flow utilizing Firebase Admin secure tokens (`oobCode`) and custom Resend email templates.
*   **Role-Based Access Control**: Infrastructure in place for routing users based on their roles (`customer`, `vendor`, `admin`).
*   **Vercel-Ready Backends**: Serverless API routes meticulously configured to initialize Firebase Admin SDK flawlessly, avoiding common `DECODER routines` and `[DEFAULT] already exists` edge cases.

## 🛠️ Local Development Setup

### 1. Prerequisites

*   Node.js 18.x or newer
*   npm or yarn
*   A Firebase Project (with Authentication and Firestore enabled)
*   A Resend Account (API Key)

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-org/mechhub.git
cd mechhub/studio
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root of the `/studio` directory and populate it with your configuration credentials.

```env
# Firebase Project Configuration
FIREBASE_PROJECT_ID="your-project-id"

# Firebase Admin SDK Credentials (from Service Account JSON)
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvg...[your full key]...END PRIVATE KEY-----\n"

# Domain Configuration
NEXT_PUBLIC_APP_URL="http://localhost:9002"

# Resend Mail Configuration
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxx"
RESEND_FROM_EMAIL="MechHub Team <outreach@mechhub.in>"
```

### 4. Running the Development Server

Start the Next.js development server using Turbopack on port 9002:

```bash
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002).

## 📁 Project Structure

*   **/src/app**: Next.js App Router structure, including API routes (`/api/auth/*`), dynamic pages, and layouts.
*   **/src/components**: Reusable React components, organized by domain (UI primitives out of Shadcn, custom landing page sections).
*   **/src/lib**: Utility functions, including the robust Firebase Admin initialization wrapper.
*   **/src/firebase**: Client-side Firebase SDK initialization and custom React hooks (`useAuth`, document/collection hooks).

## 🚀 Deployment

MechHub is fully optimized for zero-config deployments to **Vercel**. 

When adding environment variables in the Vercel dashboard, simply paste your variables directly. The internal `getFirebaseAdmin` utility is actively designed to strip wrapping `"`, `'`, and safely reconstruct mangled `\n` characters from the `FIREBASE_PRIVATE_KEY` PEM structure to ensure OpenSSL compatibility.

## 📜 License

© 2026 MechHub Platform. All Rights Reserved.
