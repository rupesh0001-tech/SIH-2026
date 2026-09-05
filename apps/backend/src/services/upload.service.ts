import { getImageKitClient } from "../lib/imagekit.js";
import { env } from "../config/env.js";
import type {
  ImageUploadInput,
  ImageUploadResponse,
  ImageKitAuthResponse,
} from "../interfaces/index.js";

/**
 * Upload an image (base64 string, Buffer, or remote URL) to ImageKit under a designated folder.
 */
export const uploadToImageKit = async (
  input: ImageUploadInput
): Promise<ImageUploadResponse> => {
  const imagekit = getImageKitClient();
  const folderPath = input.folder ? `/${input.folder.replace(/^\//, "")}` : "/general";

  const response = await imagekit.upload({
    file: input.file,
    fileName: input.fileName,
    folder: folderPath,
    tags: input.tags || ["sih-2026"],
    useUniqueFileName: input.useUniqueFileName ?? true,
  });

  return {
    fileId: response.fileId,
    name: response.name,
    url: response.url,
    thumbnailUrl: response.thumbnailUrl || response.url,
    height: response.height,
    width: response.width,
    size: response.size,
    filePath: response.filePath,
    fileType: response.fileType,
  };
};

/**
 * Generate client-side authentication parameters for direct ImageKit client uploads.
 */
export const getImageKitAuth = (): ImageKitAuthResponse => {
  const imagekit = getImageKitClient();
  const authParams = imagekit.getAuthenticationParameters();

  return {
    token: authParams.token,
    expire: authParams.expire,
    signature: authParams.signature,
    publicKey: env.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: env.IMAGEKIT_URL_ENDPOINT,
  };
};

/**
 * Delete an uploaded file from ImageKit by fileId.
 */
export const deleteFromImageKit = async (fileId: string): Promise<boolean> => {
  const imagekit = getImageKitClient();
  await imagekit.deleteFile(fileId);
  return true;
};
