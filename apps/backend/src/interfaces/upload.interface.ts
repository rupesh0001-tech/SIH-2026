export type ImageUploadFolder =
  | "farmer_avatars"
  | "kyc_documents"
  | "mandi_photos"
  | "crop_listings"
  | "general";

export interface ImageUploadInput {
  file: string | Buffer; // base64 string, binary buffer, or remote URL
  fileName: string;
  folder?: ImageUploadFolder | string;
  tags?: string[];
  useUniqueFileName?: boolean;
}

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

export interface ImageKitAuthResponse {
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
  urlEndpoint: string;
}
