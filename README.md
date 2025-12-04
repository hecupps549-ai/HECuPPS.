# HECuPPS - Unified Full-Stack eCommerce Platform

This project is a luxurious, elegant, and warm eCommerce website and a secure admin dashboard for 'HECuPPS', a premium gift hamper brand, rebuilt as a unified full-stack application.

## 1. Project Architecture

The entire platform is built as a single Next.js project, leveraging the App Router for both frontend pages and backend API routes.

-   **Framework**: Next.js 14 (App Router)
-   **ORM**: Prisma with a MySQL database.
-   **Database Hosting**: Railway (recommended) or any MySQL provider.
-   **File Storage**: Vercel Blob for all media assets with built-in media management.
-   **Authentication**: JWT-based authentication for both users and administrators.
-   **Styling**: Tailwind CSS.
-   **Validation**: Zod for API input validation.
-   **Email**: Elastic Email for transactional emails.

## 2. Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm, yarn, or pnpm
-   A MySQL database (local or hosted, e.g., on [Railway](https://railway.app/))
-   A Vercel account for deployment and Vercel Blob storage.

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-repo-url>
    cd hecupps-gift-hamper
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up your environment variables by creating a `.env` file (use `.env.example` as a template).
4.  Initialize the database schema:
    ```bash
    npx prisma migrate dev --name init
    ```

### Vercel Blob Storage

HECuPPS uses Vercel Blob for storing all media assets (product images, videos, and digital products).

**Setup Instructions:**

1. Create a Blob store in your [Vercel Dashboard](https://vercel.com/dashboard) under Storage
2. Copy the `BLOB_READ_WRITE_TOKEN` from the store settings
3. Add it to your `.env` file

```env
# Vercel Blob Storage (Create a store in your Vercel project dashboard)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```

📚 **For detailed setup instructions, usage examples, and troubleshooting**, see [Vercel Blob Setup Guide](./docs/VERCEL_BLOB_SETUP.md)

### Email

Create a `.env` file in the root of your project with the following variables:

### Elastic Email

HECuPPS uses Elastic Email for transactional emails (order confirmations, password resets, etc.).

**Setup Instructions:**

1. Create account at [Elastic Email](https://elasticemail.com/)
2. Verify your sending domain
3. Generate an API key
4. Add to your `.env` file

```env
# Elastic Email (Get API key from elasticemail.com/account#/settings/new/create-api)
ELASTICEMAIL_API_KEY="your_api_key_here"
EMAIL_FROM="HECuPPS <noreply@hecupps.com>"
```

📚 **For detailed setup instructions and troubleshooting**, see [Elastic Email Setup Guide](./docs/ELASTIC_EMAIL_SETUP.md)

### Other Environment Variables

```env
# Database (Get this from your provider, e.g., Railway)
DATABASE_URL="mysql://user:password@host:port/database"

# Vercel Blob Storage (Create a store in your Vercel project dashboard)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# JWT Authentication
# JWT Authentication
JWT_SECRET="your_strong_jwt_secret_key_for_access_tokens"
JWT_REFRESH_SECRET="your_strong_jwt_refresh_secret_key"

# Frontend URL (Used for generating links, CORS, etc.)
# For local dev:
NEXT_PUBLIC_APP_URL="http://localhost:3000"
# For production:
# NEXT_PUBLIC_APP_URL="https://your-production-url.com"
```

## 4. Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 5. Deployment

### Quick Deploy to Vercel + Railway

HEcUPPS is designed to deploy seamlessly to:
- **Vercel** - Next.js application + Blob storage
- **Railway** - MySQL database

📚 **Follow the complete step-by-step guide:** [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)

**Quick Overview:**

1. **Set up Database (Railway)**
   - Create MySQL database
   - Get `DATABASE_URL`

2. **Set up Application (Vercel)**
   - Import GitHub repository
   - Configure environment variables
   - Create Blob storage

3. **Run Migrations**
   ```bash
   DATABASE_URL="your-railway-url" npx prisma migrate deploy
   npm run db:seed
   ```

4. **Deploy & Test**
   - Automatic deployment on push
   - Access admin at `/admin/login`

For detailed instructions, troubleshooting, and production checklist, see the [full deployment guide](./docs/DEPLOYMENT_GUIDE.md).

## 6. Legacy Data Migration

Scripts are provided in the `/scripts` directory to help migrate data from a legacy system (e.g., CSV files).

1.  **Prepare your data**: Place your legacy data in `.csv` files inside a `/data` directory at the project root.
2.  **Run the core migration script**:
    ```bash
    node scripts/migrate_from_php.js
    ```
3.  **Upload legacy media**: This script uploads local media files referenced in the database to Vercel Blob.
    ```bash
    node scripts/upload_legacy_media_to_blob.js
    ```
4.  **Run data consistency checks**:
    ```bash
    node scripts/fix_inconsistent_data.js
    ```

**Note**: Always back up your database before running any migration scripts.
