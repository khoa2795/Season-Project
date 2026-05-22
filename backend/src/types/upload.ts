export interface UploadImageFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

export interface CloudinaryImageUploadOptions {
  folder?: string;
}

export interface CloudinaryImageUploadResponse {
  url: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
}
