import type { Request, Response, NextFunction } from "express";
import { uploadToImageKit, getImageKitAuth, deleteFromImageKit } from "../services/upload.service.js";
import type { ImageUploadFolder } from "../interfaces/index.js";

/**
 * Handle image upload from multipart form or JSON base64 body.
 */
export const uploadImageHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const folder = (req.body.folder as ImageUploadFolder) || "general";
    const tags = req.body.tags ? (Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags]) : [];

    let fileContent: string | Buffer;
    let fileName: string;

    if (req.file) {
      fileContent = req.file.buffer;
      fileName = req.file.originalname || `upload_${Date.now()}`;
    } else if (req.body.file) {
      fileContent = req.body.file;
      fileName = req.body.fileName || `upload_${Date.now()}`;
    } else {
      res.status(400).json({
        success: false,
        code: "NO_FILE_PROVIDED",
        message: "Please provide a file buffer (multipart) or a base64/URL string in the request body.",
      });
      return;
    }

    const uploadResult = await uploadToImageKit({
      file: fileContent,
      fileName,
      folder,
      tags: [...tags, `user_${req.user?.userId || "anon"}`],
    });

    res.status(201).json({
      success: true,
      data: uploadResult,
      message: "Image uploaded successfully to ImageKit",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle ImageKit client authentication parameters request.
 */
export const getImageKitAuthHandler = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authData = getImageKitAuth();
    res.status(200).json({
      success: true,
      data: authData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle image deletion from ImageKit.
 */
export const deleteImageHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { fileId } = req.params;
    if (!fileId) {
      res.status(400).json({
        success: false,
        code: "MISSING_FILE_ID",
        message: "fileId parameter is required",
      });
      return;
    }

    await deleteFromImageKit(fileId);

    res.status(200).json({
      success: true,
      message: "Image deleted successfully from ImageKit",
    });
  } catch (error) {
    next(error);
  }
};
