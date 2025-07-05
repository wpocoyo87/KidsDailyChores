# Cloudinary Setup Guide

## Environment Variables Required

Create a `.env.local` file in the frontend directory with the following variables:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_here
```

## How to Get These Values

### 1. Cloud Name

- Go to your Cloudinary Dashboard
- Your cloud name is displayed at the top of the dashboard
- It's usually in the format: `https://cloudinary.com/console` → Your cloud name

### 2. Upload Preset

- In your Cloudinary Dashboard, go to Settings → Upload
- Scroll down to "Upload presets"
- Create a new preset or use an existing one
- Set it to "Unsigned" for client-side uploads
- Copy the preset name

## Example Configuration

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=myapp123
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=ml_default
```

## Troubleshooting

1. **401 Unauthorized Error**: Check that your cloud name and upload preset are correct
2. **Upload Preset Not Found**: Make sure the preset is set to "Unsigned" in Cloudinary
3. **Environment Variables Not Loading**: Restart your Next.js development server after adding the `.env.local` file

## Security Note

- The upload preset should be set to "Unsigned" for client-side uploads
- Never expose your Cloudinary API secret in frontend code
- The upload preset provides limited permissions for uploading only
