import ImageKit from "imagekit";
import { env } from "../config/env.js";

let imagekitInstance: ImageKit | null = null;

export const getImageKitClient = (): ImageKit => {
  if (!imagekitInstance) {
    imagekitInstance = new ImageKit({
      publicKey: env.IMAGEKIT_PUBLIC_KEY,
      privateKey: env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: env.IMAGEKIT_URL_ENDPOINT,
    });
  }
  return imagekitInstance;
};
