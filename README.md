# HECuPPS - Unified Full-Stack eCommerce Platform

This project is a luxurious, elegant, and warm eCommerce website and a secure admin dashboard for 'HECuPPS', a premium gift hamper brand, rebuilt as a unified full-stack application.

## 1. Project Architecture

The entire platform is built as a single Next.js project, leveraging the App Router for both frontend pages and backend API routes.

-   **Framework**: Next.js 14 (App Router)
-   **ORM**: Prisma with a MySQL database.
-   **Database Hosting**: Railway (recommended) or any MySQL provider.
-   **File Storage**: Vercel Blob for all media assets (product images, videos, etc.).
-   **Authentication**: JWT-based authentication for both users and administrators.
-   **Styling**: Tailwind CSS.
-   **Validation**: Zod for API input validation.
-   **Email**: Resend for transactional emails.

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

## 3. Environment Variables

Create a `.env` file in the root of your project with the following variables:

```env
# Database (Get this from your provider, e.g., Railway)
DATABASE_URL="mysql://user:password@host:port/database"

# Vercel Blob Storage (Create a store in your Vercel project dashboard)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# JWT Authentication
JWT_SECRET="your_strong_jwt_secret_key_for_access_tokens"
JWT_REFRESH_SECRET="your_strong_jwt_refresh_secret_key"

# Admin Master Credentials (For initial admin access via /master-key-login)
ADMIN_MASTER_USERNAME="masteradmin"
ADMIN_MASTER_PASSWORD="a_very_secure_master_password"

# Email Configuration (Using Resend)
EMAIL_API_KEY="re_..."
FROM_EMAIL="HECuPPS <noreply@yourdomain.com>"

# Frontend URL (Used for generating links, CORS, etc.)
# For local dev:
NEXT_PUBLIC_APP_URL="http://localhost:3000"
# For production:
# NEXT_PUBLIC_APP_URL="https://your-production-url.com"

# API URL - this is derived from the app url
# For local dev:
VITE_API_URL="http://localhost:3000"
# For production:
# VITE_API_URL="https://your-production-url.com"
```

## 4. Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 5. Deployment to Vercel

1.  Push your code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Import the repository into your Vercel account.
3.  Configure all the required environment variables in the Vercel project settings. Use your production `DATABASE_URL`.
4.  Vercel will automatically detect the Next.js project and deploy it. The build command (`npm run build`) will also run `prisma generate`.

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
