# ImageKit Cloud Storage Integration

## 1. Overview
ImageKit is used for managing and transforming media assets (such as Farmer KYC avatars, APMC Mandi operating certificates, crop listing photos, and weighbridge verification receipts) across the SIH platform.

---

## 2. Configuration

Configured in `apps/backend/.env` and `apps/backend/src/config/env.ts`:

```env
IMAGEKIT_PUBLIC_KEY="public_DiSN/3jBr6w41xXQPGp2LHdAcxI="
IMAGEKIT_PRIVATE_KEY="private_UqO8ObeEL9BH77qUnJNEXyx9f4U="
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/frbjdpcvl"
```

---

## 3. Storage Folder Hierarchy
Uploaded images are organized into dedicated folders in ImageKit:
- `/farmer_avatars`: Farmer profile pictures and KYC headshots.
- `/kyc_documents`: Identity verification cards (Aadhaar, PAN, Driving License).
- `/mandi_photos`: APMC gate, yard, and infrastructure photos.
- `/crop_listings`: Farmer auction lot commodity images.
- `/general`: General fallback uploads.

---

## 4. API Endpoints

### Direct Upload via Backend
- **Endpoint**: `POST /api/v1/upload/image`
- **Auth**: Bearer JWT (`authenticate`)
- **Body**:
  - `multipart/form-data`: `image` (binary file) + `folder` (string)
  - OR `application/json`: `{ file: "data:image/jpeg;base64,...", fileName: "photo.jpg", folder: "farmer_avatars" }`
- **Response**:
```json
{
  "success": true,
  "data": {
    "fileId": "file_ik_12345",
    "name": "photo_1725557300.jpg",
    "url": "https://ik.imagekit.io/frbjdpcvl/farmer_avatars/photo_1725557300.jpg",
    "thumbnailUrl": "https://ik.imagekit.io/frbjdpcvl/tr:n-media_library_thumbnail/farmer_avatars/photo_1725557300.jpg",
    "filePath": "/farmer_avatars/photo_1725557300.jpg"
  },
  "message": "Image uploaded successfully to ImageKit"
}
```

### Client-Side Direct Upload Token
- **Endpoint**: `GET /api/v1/upload/auth`
- **Auth**: Public
- **Response**: `{ success: true, data: { token, expire, signature, publicKey, urlEndpoint } }`

### Delete Asset
- **Endpoint**: `DELETE /api/v1/upload/image/:fileId`
- **Auth**: Bearer JWT (`authenticate`)
- **Response**: `{ success: true, message: "Image deleted successfully from ImageKit" }`

---

## 5. Mobile Application Integration (`farmer-setu`)
- **Service**: [upload.service.ts](file:///Users/rupeshjagtap/projects/SIH/apps/application/farmer-setu/src/services/upload.service.ts)
- **Functions**:
  - `pickImageAndUpload(token, options)`: Prompts gallery selection via `expo-image-picker` and uploads directly to ImageKit.
  - `takePhotoAndUpload(token, options)`: Prompts camera capture and uploads directly to ImageKit.
- **UI Integration**: Integrated into [ProfileCompletionModal.tsx](file:///Users/rupeshjagtap/projects/SIH/apps/application/farmer-setu/src/components/dashboard/ProfileCompletionModal.tsx) with live preview and photo removal capabilities.
