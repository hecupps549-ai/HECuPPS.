# HECuPPS - Full-Stack eCommerce Platform

This project is a luxurious, elegant, and warm eCommerce website and a secure admin dashboard for 'HECuPPS', a premium gift hamper brand. It has been upgraded to a full-stack application using Next.js and Prisma.

## Table of Contents

1.  [Project Architecture](#1-project-architecture)
2.  [Getting Started](#2-getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Installation](#installation)
    -   [Environment Variables](#environment-variables)
3.  [Database Setup](#3-database-setup)
    -   [Using Railway](#using-railway)
    -   [Local Development](#local-development)
4.  [Running the Application](#4-running-the-application)
5.  [Deployment](#5-deployment)
    -   [Deploying to Vercel](#deploying-to-vercel)
    -   [Vercel Blob Storage](#vercel-blob-storage)
6.  [Testing the System](#6-testing-the-system)
7.  [Legacy Data Migration](#7-legacy-data-migration)
    -   [Overview](#overview)
    -   [Steps to Migrate](#steps-to-migrate)

---

## 1. Project Architecture

The backend is built with the Next.js App Router, providing a modern, robust foundation for API development.

-   **Framework**: Next.js 14 (App Router for API)
-   **ORM**: Prisma with a MySQL database.
-   **Database Hosting**: Railway (recommended) or any MySQL provider.
-   **File Storage**: Vercel Blob for permanent, secure file storage.
-   **Authentication**: JWT-based (Access + Refresh Tokens) with `bcrypt` for hashing.
-   **Authorization**: Role-Based Access Control (RBAC) for the admin panel.
-   **Caching**: In-memory TTL cache for performance optimization.
-   **Background Jobs**: Handled via scheduled cron jobs hitting specific API routes.
-   **Security**: Includes rate limiting, input validation (Zod), and a comprehensive audit trail for all admin actions.
-   **Email**: Provider-agnostic email delivery engine.

## 2. Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm, yarn, or pnpm
-   A MySQL database (local or hosted, e.g., on [Railway](https://railway.app/))
-   A Vercel account for Vercel Blob storage.

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
3.  Set up your environment variables (see below).
4.  Initialize the database:
    ```bash
    npx prisma migrate dev --name init
    ```

### Environment Variables

Create a `.env` file in the root of your project and populate it with the following variables. You can use `.env.example` as a template.

```env
# Database
DATABASE_URL="mysql://user:password@host:port/database"

# Vercel Blob Storage (create a store in your Vercel project)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# JWT Authentication
JWT_SECRET="your_strong_jwt_secret_key_for_access_tokens"
JWT_REFRESH_SECRET="your_strong_jwt_refresh_secret_key"

# Admin Master Credentials (for initial admin setup/recovery and bypassing normal auth)
ADMIN_MASTER_USERNAME="masteradmin"
ADMIN_MASTER_PASSWORD="a_very_secure_master_password_that_is_long_and_complex"

# Email Configuration
EMAIL_PROVIDER="resend" # or "sendgrid", "smtp"
EMAIL_API_KEY="your_email_provider_api_key"
FROM_EMAIL="HECuPPS <noreply@yourdomain.com>"

# Backend URL (for generating links in emails, webhooks, etc.)
BACKEND_URL="http://localhost:3001"
```

## 3. Database Setup

### Using Railway

1.  Create a new project on [Railway](https://railway.app/).
2.  Add a MySQL database service.
3.  Railway will provide you with a `DATABASE_URL`. Copy this into your `.env` file.
4.  When deploying, run the Prisma migration command to set up the schema:
    ```bash
    npx prisma migrate deploy
    ```

### Local Development

1.  Install MySQL on your local machine.
2.  Create a new database for the project.
3.  Construct your `DATABASE_URL` and add it to your `.env` file.
    -   Example: `mysql://root:password@localhost:3306/hecupps`
4.  Run the initial migration:
    ```bash
    npx prisma migrate dev --name init
    ```

## 4. Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3001`. The API routes will be accessible under `/api`.

## 5. Deployment

### Deploying to Vercel

1.  Push your code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Import the repository into your Vercel account.
3.  Configure the environment variables in the Vercel project settings. Ensure you use the production `DATABASE_URL` from Railway.
4.  Vercel will automatically detect the Next.js project and deploy it.

### Vercel Blob Storage

1.  In your Vercel project dashboard, go to the "Storage" tab.
2.  Create a new Blob store.
3.  Vercel will provide you with the `BLOB_READ_WRITE_TOKEN`. Add this to your project's environment variables.

## 6. Testing the System

You can use tools like Postman or Insomnia to test the API endpoints directly.

-   **Authentication**: First, hit `/api/auth/signup` to create a user or `/api/auth/admin-master` to get an initial admin token. Use the returned token in the `Authorization: Bearer <token>` header for protected routes.
-   **Product Creation**: Send a `POST` request to `/api/products` with product data. This requires an authenticated admin token.

## 7. Legacy Data Migration

### Overview

Three scripts are provided in the `/scripts` directory to help migrate data from a legacy PHP/MySQL or CSV-based system. These scripts are designed to be run locally via `node` after you have set up your environment and database connection.

### Steps to Migrate

1.  **Prepare your data**: Export your legacy data into `.csv` files (e.g., `users.csv`, `products.csv`, `orders.csv`) and place them in a `/data` directory at the project root.
2.  **Run the core migration script**: This script reads the CSV files and inserts the data into your new Prisma-managed database.
    ```bash
    node scripts/migrate_from_php.js
    ```
3.  **Upload legacy media**: This script reads product data from your new database, finds local paths to media, and uploads them to Vercel Blob, updating the database records with the new URLs.
    ```bash
    node scripts/upload_legacy_media_to_blob.js
    ```
4.  **Run data consistency checks**: This script can be customized to fix common issues found after migration, such as orphaned records or inconsistent enum values.
    ```bash
    node scripts/fix_inconsistent_data.js
    ```

**Note**: These scripts are templates and may need to be adjusted based on the specific structure of your legacy data. Always back up your database before running migration scripts.
