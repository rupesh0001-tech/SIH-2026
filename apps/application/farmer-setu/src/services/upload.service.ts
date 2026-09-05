import * as ImagePicker from 'expo-image-picker';
import { API_BASE_URL } from './api';
import type {
  ImageUploadResponse,
  PickAndUploadOptions,
  ImageUploadFolder,
} from '../interfaces';

/**
 * Request media library permissions and pick an image from device gallery,
 * then upload directly to backend ImageKit endpoint with designated folder.
 */
export const pickImageAndUpload = async (
  token: string,
  options: PickAndUploadOptions = {}
): Promise<ImageUploadResponse | null> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access photo gallery was denied.');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: options.allowsEditing ?? true,
    aspect: options.aspect ?? [1, 1],
    quality: options.quality ?? 0.8,
  });

  if (result.canceled || !result.assets || result.assets.length === 0) {
    return null;
  }

  const asset = result.assets[0];
  return uploadFileToImageKit(token, asset.uri, options.folder || 'farmer_avatars', asset.fileName);
};

/**
 * Request camera permissions and capture a live photo,
 * then upload to backend ImageKit endpoint with designated folder.
 */
export const takePhotoAndUpload = async (
  token: string,
  options: PickAndUploadOptions = {}
): Promise<ImageUploadResponse | null> => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access camera was denied.');
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: options.allowsEditing ?? true,
    aspect: options.aspect ?? [1, 1],
    quality: options.quality ?? 0.8,
  });

  if (result.canceled || !result.assets || result.assets.length === 0) {
    return null;
  }

  const asset = result.assets[0];
  return uploadFileToImageKit(token, asset.uri, options.folder || 'farmer_avatars', asset.fileName);
};

/**
 * Internal upload helper to stream file to /api/v1/upload/image
 */
export const uploadFileToImageKit = async (
  token: string,
  uri: string,
  folder: ImageUploadFolder = 'farmer_avatars',
  customFileName?: string | null
): Promise<ImageUploadResponse> => {
  const fileName = customFileName || `img_${Date.now()}.jpg`;
  const fileType = uri.endsWith('.png') ? 'image/png' : 'image/jpeg';

  const formData = new FormData();
  formData.append('image', {
    uri,
    name: fileName,
    type: fileType,
  } as unknown as Blob);
  formData.append('folder', folder);

  const response = await fetch(`${API_BASE_URL}/api/v1/upload/image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const json = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Failed to upload image to ImageKit');
  }

  return json.data as ImageUploadResponse;
};
