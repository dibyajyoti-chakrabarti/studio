# 🛠️ MechHub: Industrial Commerce Infrastructure

Welcome to the **MechHub** engineering repository. MechHub is a high-performance B2B industrial marketplace designed to bridge the gap between mechanical component manufacturers and industrial buyers.

Our platform handles complex procurement workflows, automated quoting, and multi-part manufacturing project management with a focus on speed, precision, and reliability.

---

## 🚀 Quick Start for Interns

Follow these steps to get your local environment running in under 5 minutes:

### 1. Prerequisites
- **Node.js**: Version 18.x or 20.x (LTS recommended)
- **NPM**: Version 9.x+

### 2. Clone and Install
```bash
git clone https://github.com/DivyanshuRanjanDynamic/studio.git
cd studio
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory and request the latest keys from your team lead.
> [!IMPORTANT]
> Never commit your `.env.local` file to version control.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:9002](http://localhost:9002) to see the application.

---

## 🏗️ Project Architecture

We follow a **Layered Service-Oriented Architecture** to ensure the codebase remains maintainable as we scale.

### Folder Structure
- **`src/app/`**: Next.js App Router. Contains page layouts and API route boundaries.
- **`src/services/`**: **Business Logic Layer.** All heavy lifting (price calculations, order logic) happens here.
- **`src/controllers/`**: **Request Handling.** Bridges the Gap between APIs and Services.
- **`src/components/`**: Modular UI components (organized by project area).
- **`src/utils/`**: Shared utilities (Financial math, shared constants).
- **`src/types/`**: Centralized TypeScript definitions and interfaces.
- **`src/firebase/`**: Client-side Firebase hooks and configuration.
- **`src/lib/`**: Server-side Admin SDK and core library initializations.

---

## 🤝 Contribution Guidelines

To maintain our high engineering standards, please follow these guidelines:

### 🌿 Git Workflow
1. **Branching**: Create a feature branch from `main`: `feat/your-feature-name` or `fix/issue-description`.
2. **Commit Messages**: Use conventional commits (e.g., `feat: add automated tax calculation`).
3. **Pull Requests**: Tag your team lead for review. Ensure all lint checks pass.

### 💻 Code Standards
- **TypeScript First**: Avoid using `any`. Define interfaces in `src/types/`.
- **Service Pattern**: If you're adding business logic, create a service. Don't put logic directly in API routes.
- **Aesthetics Matter**: We use a premium design language. Ensure your UI changes align with our "Studio" aesthetic.
- **Comments**: Write simple, beginner-friendly comments for complex logic (use the `calculateProjectFinances` utility as a reference).

---

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database/Auth**: Firebase (Firestore & Auth)
- **Payments**: Razorpay Integration
- **Infrastructure**: Vercel

---

## 📬 Contact & Author
**Divyanshu Ranjan**  
Founder & Lead Engineer — MechHub  
*Building the future of industrial procurement.*
