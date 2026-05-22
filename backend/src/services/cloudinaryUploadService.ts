import path from "path";
import type { UploadApiResponse } from "cloudinary";
import { getCloudinaryClient } from "../config/cloudinary.js";
import type {
  CloudinaryImageUploadOptions,
  CloudinaryImageUploadResponse,
  UploadImageFile,
} from "../types/upload.js";

const ALLOWED_IMAGE_EXTENSIONS = new Set([".jpg", ".png", ".webp"]);
const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export class CloudinaryUploadServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "CloudinaryUploadServiceError";
    this.statusCode = statusCode;
  }
}

export function validateUploadImageFile(file: UploadImageFile): void {
  const extension = path.extname(file.originalname).toLowerCase();

  if (
    ALLOWED_IMAGE_EXTENSIONS.has(extension) === false ||
    ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype) === false
  ) {
    throw new CloudinaryUploadServiceError(
      "Only .jpg, .png, and .webp images are allowed",
      400,
    );
  }

  if (Buffer.isBuffer(file.buffer) === false || file.buffer.length === 0) {
    throw new CloudinaryUploadServiceError(
      "Uploaded image file is empty or missing its buffer",
      400,
    );
  }
}

function uploadImageBuffer(
  file: UploadImageFile,
  options: CloudinaryImageUploadOptions,
): Promise<UploadApiResponse> {
  const cloudinary = getCloudinaryClient();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        ...(options.folder === undefined ? {} : { folder: options.folder }),
      },
      (error, result) => {
        if (error !== undefined && error !== null) {
          reject(error);
          return;
        }

        if (result === undefined) {
          reject(new Error("Cloudinary upload did not return a result"));
          return;
        }

        resolve(result);
      },
    );

    uploadStream.end(file.buffer);
  });
}

export async function uploadImageToCloudinary(
  file: UploadImageFile,
  options: CloudinaryImageUploadOptions = {},
): Promise<CloudinaryImageUploadResponse> {
  validateUploadImageFile(file);

  try {
    const uploadedImage = await uploadImageBuffer(file, options);

    if (
      uploadedImage.secure_url === undefined ||
      uploadedImage.secure_url.trim() === ""
    ) {
      throw new Error("Cloudinary upload response is missing secure_url");
    }

    return {
      url: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
      format: uploadedImage.format,
      width: uploadedImage.width,
      height: uploadedImage.height,
    };
  } catch (error) {
    if (error instanceof CloudinaryUploadServiceError) {
      throw error;
    }

    throw new CloudinaryUploadServiceError(
      error instanceof Error ? error.message : "Cloudinary image upload failed",
      502,
    );
  }
}
