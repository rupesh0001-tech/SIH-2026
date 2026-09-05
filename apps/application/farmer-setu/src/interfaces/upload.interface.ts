export type ImageUploadFolder =
  | 'farmer_avatars'
  | 'kyc_documents'
  | 'mandi_photos'
  | 'crop_listings'
  | 'general';

export interface ImageUploadResponse {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  height?: number;
  width?: number;
  size?: number;
  filePath: string;
  fileType: string;
}

export interface PickAndUploadOptions {
  folder?: ImageUploadFolder;
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
}
