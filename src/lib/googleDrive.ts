import axios, { type AxiosRequestConfig } from "axios";
import type { GoogleDriveBackupContent } from "../types/app";

// Constants
export const BACKUP_FILENAME = "backup.json";
export const CONFIG_FILENAME = "config.json";
const GOOGLE_DRIVE_API_BASE = "https://www.googleapis.com/drive/v3";
const GOOGLE_DRIVE_UPLOAD_BASE = "https://www.googleapis.com/upload/drive/v3";
const APP_DATA_FOLDER = "appDataFolder";
const JSON_CONTENT_TYPE = "application/json";

/**
 * Gets the current Google API access token
 * @returns The access token
 * @throws If gapi is not available or token is invalid
 */
const getAccessToken = () => {
  if (typeof gapi === "undefined" || !gapi.client) {
    throw new Error("Google API client is not initialized");
  }

  const token = gapi.client.getToken();
  if (!token?.access_token) {
    throw new Error("No valid access token available");
  }

  return token.access_token;
};

/**
 * Creates authorization headers for Google API requests
 * @returns Headers object with authorization
 */
const createAuthHeaders = () => ({
  Authorization: `Bearer ${getAccessToken()}`,
});

/**
 * Finds the remote file in Google Drive's appDataFolder
 * @returns The remote file object or null if not found
 * @throws If the API request fails
 */
export const findRemoteFile = async (fileName: string) => {
  try {
    const response = await gapi.client.drive.files.list({
      spaces: APP_DATA_FOLDER,
      q: `name = '${fileName}' and trashed = false`,
      fields: "files(id, name, modifiedTime)",
    });

    const file = response.result.files?.[0] || null;

    return file;
  } catch (error) {
    console.error("Failed to find remote file:", error);
    throw new Error(`Failed to find remote file: ${(error as Error).message}`);
  }
};

/**
 * Finds the backup file in Google Drive's appDataFolder
 * @returns The backup file object or null if not found
 * @throws If the API request fails
 */
export const findBackupFile = async () => {
  return findRemoteFile(BACKUP_FILENAME);
};

/**
 * Finds the config file in Google Drive's appDataFolder
 * @returns The config file object or null if not found
 * @throws If the API request fails
 */
export const findConfigFile = async () => {
  return findRemoteFile(CONFIG_FILENAME);
};

/**
 * Fetches the content of a backup file from Google Drive
 * @param fileId - The ID of the file to fetch
 * @param options - Additional axios options
 * @returns The parsed backup content
 * @throws If the file ID is invalid or fetch fails
 */
export const fetchBackupContent = async (
  fileId: string,
  options: AxiosRequestConfig = {}
) => {
  if (!fileId || typeof fileId !== "string") {
    throw new Error("Invalid file ID provided");
  }

  try {
    const response = await axios.get<GoogleDriveBackupContent>(
      `${GOOGLE_DRIVE_API_BASE}/files/${fileId}?alt=media`,
      {
        ...options,
        headers: {
          ...createAuthHeaders(),
          ...options.headers,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to fetch backup content:", error);
      throw new Error(`Failed to fetch backup content: ${error.message}`);
    }
  }
};

/**
 * Creates a FormData object for file upload
 * @param metadata - File metadata
 * @param fileContent - Stringified file content
 * @returns The constructed form data
 */
const createUploadFormData = (metadata: object, fileContent: string) => {
  const form = new FormData();

  form.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: JSON_CONTENT_TYPE })
  );

  form.append("file", new Blob([fileContent], { type: JSON_CONTENT_TYPE }));

  return form;
};

/**
 * Constructs the upload URL for Google Drive API
 * @param existingFile - The existing file object or null for new file
 * @returns The complete upload URL
 */
const buildUploadUrl = (
  existingFile: gapi.client.drive.File | null | undefined
) => {
  const query = new URLSearchParams({
    uploadType: "multipart",
    fields: "id,name,modifiedTime",
  }).toString();

  const baseUrl = existingFile
    ? `${GOOGLE_DRIVE_UPLOAD_BASE}/files/${existingFile.id}`
    : `${GOOGLE_DRIVE_UPLOAD_BASE}/files`;

  return `${baseUrl}?${query}`;
};

/**
 * Uploads or updates a backup file to Google Drive
 * @param content - The content to backup (will be JSON stringified)
 * @returns The uploaded file information
 * @throws If content is invalid or upload fails
 */
export const uploadBackup = async (content: object) => {
  if (content === undefined || content === null) {
    throw new Error("Content cannot be null or undefined");
  }

  try {
    const existingFile = await findBackupFile();
    const fileContent = JSON.stringify(content);

    const metadata = {
      name: BACKUP_FILENAME,
      ...(existingFile === null && { parents: [APP_DATA_FOLDER] }),
    };

    const formData = createUploadFormData(metadata, fileContent);
    const url = buildUploadUrl(existingFile);
    const method = existingFile ? "PATCH" : "POST";

    const response = await axios.request({
      url,
      method,
      headers: createAuthHeaders(),
      data: formData,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to upload backup:", error);
    throw new Error(`Failed to upload backup: ${(error as Error).message}`);
  }
};

/**
 * Dynamically loads a script and returns a promise that resolves when loaded
 * @param src - The URL of the script to load
 * @returns Promise that resolves when script loads successfully
 * @throws If src is invalid or script fails to load
 */
export const loadScript = (src: string) => {
  if (!src || typeof src !== "string") {
    return Promise.reject(new Error("Invalid script source provided"));
  }

  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      resolve(new Event("load"));
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.async = true;

    const handleLoad = (event: Event) => {
      cleanup();
      resolve(event);
    };

    const handleError = () => {
      cleanup();
      reject(new Error(`Failed to load script: ${src}`));
    };

    const cleanup = () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };

    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);

    document.body.appendChild(script);
  });
};
