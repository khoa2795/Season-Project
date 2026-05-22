import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_URL } from "./constants.js";

let isCloudinaryConfigured = false;

function parseCloudinaryUrl(cloudinaryUrl: string): {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
} {
  const parsedUrl = new URL(cloudinaryUrl);

  if (
    parsedUrl.hostname === "" ||
    parsedUrl.username === "" ||
    parsedUrl.password === ""
  ) {
    throw new Error("CLOUDINARY_URL is invalid");
  }

  return {
    cloudName: parsedUrl.hostname,
    apiKey: decodeURIComponent(parsedUrl.username),
    apiSecret: decodeURIComponent(parsedUrl.password),
  };
}

export function getCloudinaryClient(): typeof cloudinary {
  if (isCloudinaryConfigured === true) {
    return cloudinary;
  }

  if (CLOUDINARY_URL === undefined || CLOUDINARY_URL.trim() === "") {
    throw new Error("CLOUDINARY_URL is required");
  }

  const cloudinaryCredentials = parseCloudinaryUrl(CLOUDINARY_URL);

  cloudinary.config({
    cloud_name: cloudinaryCredentials.cloudName,
    api_key: cloudinaryCredentials.apiKey,
    api_secret: cloudinaryCredentials.apiSecret,
    secure: true,
  });
  isCloudinaryConfigured = true;

  return cloudinary;
}
