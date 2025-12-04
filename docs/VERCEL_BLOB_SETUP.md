# Vercel Blob Storage Setup Guide

This guide explains how to set up and use Vercel Blob storage for file uploads in the HEcUPPS application.

## What is Vercel Blob?

Vercel Blob is a cloud storage solution optimized for storing and serving files like images, videos, and documents. It provides:

- **Fast Global CDN** - Files are served from edge locations worldwide
- **Automatic Optimization** - Images are automatically optimized for web delivery
- **Simple API** - Easy-to-use JavaScript/TypeScript SDK
- **Generous Free Tier** - 100GB storage and 1TB bandwidth per month on free tier

---

## Getting Started

### 1. Create a Vercel Blob Store

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Storage** tab
3. Click **Create Database** → **Blob**
4. Give your store a name (e.g., "hecupps-media")
5. Click **Create**

### 2. Get Your Access Token

After creating your Blob store:

1. On the storage page, click on your newly created Blob store
2. Navigate to the **Settings** or **.env.local** tab
3. Copy the `BLOB_READ_WRITE_TOKEN` value
4. It should look like: `vercel_blob_rw_xxxxxxxxxx`

### 3. Configure Environment Variables

Add the following to your `.env` file:

```bash
# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxx"
```

> **Important**: Never commit your `.env` file to version control. The `.env.example` file already includes this variable for reference.

---

## Usage

### Uploading Files via Admin Panel

#### Option 1: Media Management Page

1. Navigate to `/admin/media`
2. Select a folder category (Images, Videos, or Digital Products)
3. Click **Upload Files** button
4. Select one or multiple files
5. Files are automatically uploaded to organized folders

#### Option 2: Product Creation

1. Navigate to `/admin/products/new`
2. In the **Product Images** section, click the upload area
3. Select multiple product images
4. Images are automatically uploaded and previewed
5. You can also manually enter image URLs if needed

### Uploading Files Programmatically

```typescript
import { uploadProductImage } from '@/lib/file-storage';

// Upload a product image
const imageUrl = await uploadProductImage(file);

// Upload a video
import { uploadProductVideo } from '@/lib/file-storage';
const videoUrl = await uploadProductVideo(videoFile);

// Upload a digital product
import { uploadDigitalProduct } from '@/lib/file-storage';
const fileUrl = await uploadDigitalProduct(pdfFile);
```

---

## API Endpoints

### Upload File

**POST** `/api/upload`

Upload a file to Vercel Blob storage.

**Request:**
```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('folder', 'products/images'); // Optional

const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
});
```

**Response:**
```json
{
    "url": "https://xxx.public.blob.vercel-storage.com/...",
    "fileName": "product.jpg",
    "size": 125600,
    "type": "image/jpeg",
    "category": "images",
    "uploadedAt": "2024-12-04T14:51:20.000Z"
}
```

**File Validation:**
- **Images**: Max 10MB, formats: JPEG, PNG, GIF, WebP, SVG
- **Videos**: Max 100MB, formats: MP4, WebM, OGG, QuickTime
- **Documents**: Max 50MB, formats: PDF, ZIP

### List Files

**GET** `/api/blob?folder=products/images&limit=100`

List all files in a specific folder.

**Response:**
```json
{
    "blobs": [
        {
            "url": "https://...",
            "pathname": "products/images/1234-abc-image.jpg",
            "size": 125600,
            "uploadedAt": "2024-12-04T14:51:20.000Z",
            "downloadUrl": "https://..."
        }
    ],
    "count": 1,
    "folder": "products/images"
}
```

### Delete File

**DELETE** `/api/blob?url=https://xxx.public.blob.vercel-storage.com/...`

Delete a specific file.

**Response:**
```json
{
    "message": "File deleted successfully",
    "url": "https://..."
}
```

---

## File Organization

Files are automatically organized into folders:

```
├── products/
│   ├── images/          # Product images
│   ├── videos/          # Product videos
│   └── digital/         # Digital products (PDFs, ZIPs)
└── uploads/             # Other files
```

Each uploaded file is automatically renamed with a timestamp and random string for uniqueness:

```
products/images/1733325080123-a3x9k2-product-hamper.jpg
```

---

## Security

### Authentication

All upload and management endpoints require admin authentication:
- **Allowed Roles**: `SUPER_ADMIN`, `PRODUCT_MANAGER`
- Authentication handled via NextAuth middleware

### File Validation

Uploaded files are validated for:
1. **File Type** - Only allowed MIME types are accepted
2. **File Size** - Maximum sizes enforced per category
3. **Filename Sanitization** - Special characters removed
4. **Access Control** - Only authenticated admins can upload/delete

---

## Best Practices

### Image Optimization

1. **Compress images** before uploading (use tools like TinyPNG, ImageOptim)
2. **Recommended dimensions**:
   - Product images: 800x800px to 1200x1200px
   - Thumbnails: 400x400px
3. **Use WebP format** when possible for better compression

### Storage Management

1. **Delete unused files** regularly via the media management page
2. **Monitor storage usage** in the Vercel dashboard
3. **Use appropriate folders** for better organization

### Performance

1. **Lazy load images** on product pages
2. **Use Vercel's automatic image optimization** via Next.js Image component:
   ```tsx
   import Image from 'next/image';
   
   <Image 
       src={product.imageUrl} 
       alt={product.name}
       width={800}
       height={800}
   />
   ```

---

## Troubleshooting

### "Storage configuration error"

**Problem**: Upload fails with token error

**Solution**:
1. Verify `BLOB_READ_WRITE_TOKEN` is set in `.env`
2. Ensure the token starts with `vercel_blob_rw_`
3. Check that the token hasn't expired
4. Restart your development server after adding the token

### "File size too large"

**Problem**: Upload rejected due to file size

**Solution**:
1. Check file size limits in `/app/api/upload/route.ts`
2. Compress the file before uploading
3. Consider adjusting `MAX_FILE_SIZES` if needed

### "Invalid file type"

**Problem**: File rejected due to unsupported format

**Solution**:
1. Check allowed types in `/app/api/upload/route.ts`
2. Convert file to supported format
3. Add new MIME type to `ALLOWED_FILE_TYPES` if needed

### Files not appearing in dashboard

**Problem**: Uploaded files don't show in Vercel Blob dashboard

**Solution**:
1. Ensure you're using the correct Blob store token
2. Check that upload was successful (200 response)
3. Refresh the Vercel dashboard
4. Verify the Blob store is linked to your project

---

## Migration from Legacy Storage

If you have existing images stored locally or on another CDN, use the migration script:

```bash
# Edit the script to update paths and configuration
node scripts/upload_legacy_media_to_blob.js
```

This will:
1. Find all products with legacy media paths
2. Upload files to Vercel Blob
3. Update database records with new URLs

---

## Cost Considerations

### Vercel Blob Pricing (as of 2024)

**Hobby Plan** (Free):
- 100 GB storage
- 1 TB bandwidth per month

**Pro Plan** ($20/month):
- 500 GB storage included
- Additional storage: $0.15/GB
- Bandwidth: $0.20/GB

### Optimization Tips

1. Delete old/unused files regularly
2. Use proper image compression
3. Implement caching headers
4. Consider using Next.js Image optimization

---

## Additional Resources

- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Vercel Blob SDK Reference](https://vercel.com/docs/storage/vercel-blob/using-blob-sdk)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)

---

## Support

For issues or questions:
1. Check this documentation first
2. Review Vercel Blob documentation
3. Check application logs for error details
4. Contact the development team
