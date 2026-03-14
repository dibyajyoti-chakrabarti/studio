# MechHub

Industrial commerce infrastructure for mechanical components.

## Overview
MechHub is a modern, high-performance platform designed to bridge the gap between innovators and the managed manufacturing network. Built with cutting-edge web technologies, it features a robust authentication system, real-time database capabilities, and a polished user interface.

## Problem
Procuring precise mechanical components and hardware for industrial, laboratory, and prototyping use is often plagued by opaque pricing, unreliable inventory data, and cumbersome vendor communication. Innovators and engineers need a streamlined, high-trust system to source parts efficiently without the typical friction of manual quoting processes.

## Solution
MechHub solves this by providing a unified, real-time industrial commerce marketplace. We offer transparent pricing, automated inventory guards, comprehensive technical datasheets, and an optimized, mobile-responsive procurement flow. It acts as the definitive infrastructure connecting engineering needs with verified manufacturing capabilities.

## Features
- **Custom Authentication Flow:** Secure email/password login, verified Google OAuth, and end-to-end "Forgot Password" functionality via Firebase Admin secure tokens (`oobCode`).
- **Real-Time Procurement:** Dynamic price calculations based on volume, real-time inventory guards (preventing over-ordering), and synchronized cart states.
- **Role-Based Access Control:** Infrastructure for routing users based on clear hierarchies (`customer`, `vendor`, `admin`).
- **Interactive Component Catalog:** High-density, mobile-optimized component listing with dynamic search, filtering, and instant "Add to Procurement" actions.
- **Detailed Technical Profiles:** Auto-generated printable datasheets, comprehensive FAQs, specification tables, and compatibility matrices.
- **Transactional Communications:** Branded, automated HTML verification and notification emails via Resend.

## Demo
> Live Demo: [https://mechhub.in](https://mechhub.in) 

## Architecture
MechHub follows a modern serverless architecture utilizing Next.js App Router for both SSR (Server-Side Rendering) and API routes. The frontend communicates with Firebase for real-time state and authentication. Serverless API routes (Node.js) handle secure operations like administrative bypassing, custom email triggers through Resend, and specialized Firebase Admin SDK invocations.

## Tech Stack
*   **Framework**: Next.js 15 (App Router, Turbopack)
*   **UI Library / Rendering**: React 19
*   **Styling**: Tailwind CSS, Shadcn UI, Radix Primitives
*   **Animations**: Framer Motion
*   **Auth & Database**: Firebase (Client SDK & Firebase Admin SDK), Firestore
*   **Transactional Emails**: Resend
*   **Icons**: Lucide React

## Project Structure
```text
/src
  ├── /app           # Next.js App Router (pages, layouts, API routes)
  ├── /components    # Reusable React components (UI primitives, complex views)
  ├── /context       # Global React context (CartContext, AuthContext)
  ├── /firebase      # Client-side Firebase initialization and custom hooks
  └── /lib           # Utility functions, helpers, and Firebase Admin setup
/public              # Static assets and images
```

## Getting Started

### 1. Prerequisites
- Node.js 18.x or newer
- npm or yarn
- A Firebase Project (with Authentication and Firestore enabled)
- A Resend Account (API Key)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-org/mechhub.git
cd mechhub/studio
npm install
```

### 3. Run Development Server
Start the Next.js development server using Turbopack on port 9002:
```bash
npm run dev
```

## Environment Variables
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

## API Reference
- **`POST /api/v1/auth/send-verification`**: Triggers a custom validation email using Resend and Firebase Admin custom tokens.
- **`POST /api/v1/auth/verify-action`**: Handles operations for password resets and email verification using `oobCode`.
- **`GET /api/v1/admin/products/*`**: Admin-only REST routes for managing component registry via the server.
- **`POST /api/v1/admin/products/upload`**: Secure endpoint for uploading product assets to AWS S3 / R2 stores.

## Scalability
The platform scales horizontally by leveraging Vercel's Edge Network and Serverless Functions. Firestore acts as a real-time NoSQL document database, allowing massive read throughput. Heavy reads (like product catalogs) are mitigated using Next.js static generation and ISR (Incremental Static Regeneration) where applicable.

## Performance
- **Image Optimization**: Utilization of `next/image` ensures automatic compression, WebP conversion, and lazy loading.
- **Debounced Interactions**: Cart state changes and search queries are debounced to reduce excessive Firestore writes/reads.
- **Flicker-Free Transitions**: State hydration logic (e.g., `useDoc` hooks) initializes defensively to prevent UI layout shifts and "Not Found" flashes before Firebase yields data.

## Security
- **Secure Token Handling**: Sensitive Firebase operations run server-side using the Admin SDK.
- **Private Key Parsing**: Built-in regex guards to safely parse `FIREBASE_PRIVATE_KEY` PEM formats, circumventing environment variable truncation.
- **Route Protection**: Middleware and higher-order components enforce strict role-based access (`/admin`, `/checkout`).
- **Client-Side Guarding**: Input sanitization and inventory capping at both Context and UI layers.

## Deployment
MechHub is fully optimized for zero-config deployments to **Vercel**. 

When adding environment variables in the Vercel dashboard, paste your variables directly. The internal `getFirebaseAdmin` utility is actively designed to strip wrapping `"`, `'`, and safely reconstruct mangled `\n` characters from the `FIREBASE_PRIVATE_KEY` PEM structure to ensure OpenSSL compatibility.

## Testing
- **Manual QA**: Comprehensive responsive layout checks and e2e cart interaction matrices defined in project artifacts.
- *(Planned)*: Integration of Jest for unit testing context providers and Cypress for end-to-end checkout flows.

## Roadmap
- [x] Phase 1: Core Commerce Engine & Authentication
- [x] Phase 2: Dynamic Pricing & Real-Time Inventory Guards
- [ ] Phase 3: Vendor Registration Dashboard
- [ ] Phase 4: Integration with ERP systems (SAP/Oracle)

## Contributing
We welcome contributions! Please follow standard fork-and-pull-request workflows. Ensure that your code adheres to standard ESLint configurations. Submit an issue discussing proposed architecture changes before opening a PR.

## License
© 2026 MechHub Platform. All Rights Reserved.

## Maintainers
- **Divyanshu** - Lead Architect & Developer

## Design Decisions
- **Firebase over PostgreSQL**: Chose NoSQL (Firestore) for real-time capabilities crucial for inventory locking and live cart updates.
- **Custom Auth over NextAuth**: While NextAuth.js is popular, implementing arbitrary role assignments (`vendors`, `admins`) and deep hooks into Firestore required a bespoke Firebase Admin wrapper for greater control.

## Tradeoffs
- **Serverless Cold Starts**: Using Vercel Serverless Functions for API routes introduces minor cold starts, accepted in exchange for zero infra maintenance.
- **Client-Heavy State**: Cart context state resides heavily on the client (React Context) vs server-side sessions, prioritizing instant UI response over absolute server authority up until checkout validation.

## System Limitations
- Currently relies on external webhook integrations for complex payment state coordination.
- Maximum document writes to a single Firestore document is limited to 1/sec per official constraints, which might require sharding if a single product sees ultra-high velocity concurrent purchases.

## Monitoring
- Errors caught during serverless execution and permission errors in hooks are emitted to a central logging tracker (currently stubbed via `errorEmitter`).
- Client-side renders use standard React Error Boundaries to prevent total application crashes.

## Observability
- All authentication events trigger discrete logging points.
- Firestore security rules are structured to silently drop malicious reads, which can be monitored via GCP Audit Logs.

## Future Improvements
- Migration from standard React Context to a more robust state machine structure as global state complexity scales.
- Implementation of Redis-based rate limiting for public API routes.
- Stricter compile-time type-safety across Firestore boundaries using enforced schemas.
