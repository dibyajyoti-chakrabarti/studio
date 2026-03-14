# MechHub

Industrial Commerce Infrastructure for Mechanical Components.

MechHub is a scalable B2B industrial marketplace that connects manufacturers,
suppliers, and buyers for mechanical components such as bearings, fasteners,
CNC parts, and custom manufacturing services.

The platform provides a modern procurement workflow with product discovery,
supplier management, and secure order processing.

---

## Product Vision

Industrial supply chains are still fragmented and inefficient.

Manufacturers struggle to reach buyers.  
Buyers struggle to discover trusted suppliers.

MechHub aims to become the digital infrastructure layer for
industrial component commerce.

---

## Key Features

### Product Marketplace
- Industrial component catalog
- Advanced product filtering
- Detailed technical specifications

### Supplier Platform
- Product listing dashboard
- Inventory management
- Order processing

### Buyer Experience
- Product discovery
- Secure checkout
- Order tracking

### Platform Infrastructure
- Real-time messaging
- Image CDN delivery
- Scalable serverless architecture

---

## System Architecture

High-level architecture of the platform:

```mermaid
flowchart LR
    User([User]) --> CDN[Vercel Edge / CDN]
    CDN --> API[API Gateway]
    API --> Services[Application Services]
    Services --> DB[(Database / Firestore)]
    Services --> Storage[Object Storage]
```

### Request Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant CDN
    participant API
    participant Auth
    participant DB

    User->>Browser: Search Components
    Browser->>CDN: Request App Runtime
    CDN->>Browser: Serve Static Assets
    
    Browser->>API: GET /api/v1/products
    
    API->>Auth: Validate JWT/oobCode
    Auth->>API: Token Verified
    
    API->>DB: Query Firestore (indexed)
    DB->>API: Return Document Snapshots
    
    API->>Browser: JSON Response
    Browser->>User: Render High-Density Grid
```

### Frontend

- React 19
- Next.js 15
- TailwindCSS

### Backend

- Node.js
- Next.js Edge / Serverless API Routes
- TypeScript

### Data Layer

- Firestore (NoSQL Document Store)
- Firebase Storage (Object Storage)

### Infrastructure

- Vercel
- Resend (Transactional Email provider)

## Repository Structure

mechhub/
  studio/
    src/
      app/          # Next.js app router and API boundaries
      components/   # Modular React components and UI primitives
      context/      # Global state management
      firebase/     # Client authentication and database hooks
      lib/          # Server utilities and Admin SDK initialization

---

## Local Development

Clone the repository

git clone https://github.com/DivyanshuRanjanDynamic/studio.git

Navigate to the application directory

cd studio

Install dependencies

npm install

Start development server

npm run dev

---

## Environment Variables

Create a `.env.local` file inside the `/studio` directory.

FIREBASE_PROJECT_ID=

FIREBASE_CLIENT_EMAIL=

FIREBASE_PRIVATE_KEY=

NEXT_PUBLIC_APP_URL=

RESEND_API_KEY=

RESEND_FROM_EMAIL=

RAZORPAY_KEY_ID=

RAZORPAY_KEY_SECRET=

AWS_ACCESS_KEY_ID=

AWS_SECRET_ACCESS_KEY=

AWS_REGION=

AWS_S3_BUCKET=

---

## API Overview

Product APIs

GET /api/v1/admin/products  
POST /api/v1/admin/products/upload  
POST /api/v1/admin/products/upload/delete  

Authentication APIs

POST /api/v1/auth/send-verification  
POST /api/v1/auth/verify-action  

---

## Database Schema (Firestore)

A high-level overview of our NoSQL document structures and relationships:

```mermaid
erDiagram
    users {
        string uid PK
        string email
        string displayName
        string role "customer | vendor | admin"
        timestamp createdAt
    }
    
    products {
        string id PK
        string name
        number basePrice
        number salePrice
        number inventory
        string categoryId
        array technicalSpecs
    }
    
    orders {
        string id PK
        string userId FK
        string status "pending | shipped | fulfilled"
        number totalAmount
        timestamp createdAt
    }
    
    payments {
        string id PK
        string orderId FK
        string status
        number amount
        timestamp processedAt
    }
    
    rfqs {
        string id PK
        string userId FK
        string status
        string requirements
        timestamp createdAt
    }
    
    quotations {
        string id PK
        string rfqId FK
        string vendorId FK
        number price
        string status
    }
    
    blog_stats {
        string slug PK
        number Likes
        array LikedBy
    }
    
    consultationRequests {
        string id PK
        string email
        string companyName
        string status
    }
    
    newsletter_subscribers {
        string email PK
        timestamp subscribedAt
    }
    
    verification_tokens {
        string token PK
        string email
        timestamp expiresAt
    }
    
    rate_limits {
        string ip PK
        number count
        timestamp resetAt
    }
    
    users ||--o{ orders : places
    users ||--o{ rfqs : submits
    orders ||--o{ products : contains
    orders ||--o| payments : requires
    rfqs ||--o{ quotations : receives
```

---

## Scalability Design

The platform is designed to support large scale industrial catalogs.

Strategies used:

- Vercel Edge caching layer
- Image CDN for component galleries
- Horizontal serverless scaling
- NoSQL document indexing
- Lazy image and component loading

---

## Performance

- Next/image optimization for WebP delivery
- Edge network static asset delivery
- Debounced database transactions
- Local caching & optimistic UI updates
- Incremental Static Regeneration (ISR)

---

## Security

Security practices implemented:

- Firebase JWT authentication
- Role-based access control (Admin, Vendor, Customer)
- Secure token validation (oobCode integrations)
- Client-side input sanitization
- Absolute environment variable segregation

---

## Deployment Architecture

 MechHub utilizes a tiered deployment strategy optimized for zero-config global scaling.

```mermaid
flowchart TD
    User([Global User]) --> Route53[DNS Routing]
    Route53 --> VercelEdge[Vercel Edge Network]
    
    VercelEdge --> NextJS[Next.js Serverless Functions]
    VercelEdge --> Static[Static Asset CDN]
    
    NextJS --> FBAuth[Firebase Authentication]
    NextJS --> Firestore[(Firestore NoSQL)]
    NextJS --> Resend[Resend Email API]
    
    Static --> User
```

Deploy using Vercel CLI:

```bash
vercel deploy --prod
```

Ensure environment variables are configured in the Vercel dashboard prior to deployment.
Private keys are automatically parsed and sanitized for OpenSSL compatibility.

---

## Roadmap

Upcoming platform improvements:

- AI powered product recommendation
- Supplier verification system
- RFQ marketplace
- Logistics integration
- International supplier onboarding

---

## Contributing

Contributions are welcome.

Steps:

1 Fork the repository  
2 Create a new branch  
3 Commit your changes  
4 Submit a pull request  

---

## License

MIT License

---

## Author

Divyanshu Ranjan

Software Engineer  
Founder — MechHub

---

## Acknowledgements

Inspired by modern developer platforms and industrial infrastructure systems.
