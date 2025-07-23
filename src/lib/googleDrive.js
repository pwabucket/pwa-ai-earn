import axios from "axios";
export const BACKUP_FILENAME = "backup.json";

/** Find Backup File */
export const findBackupFile = async () => {
  // eslint-disable-next-line no-undef
  const res = await gapi.client.drive.files.list({
    spaces: "appDataFolder",
    q: `name = '${BACKUP_FILENAME}' and trashed = false`,
    fields: "files(id, name, modifiedTime)",
  });

  return res.result.files?.[0] || null;
};

/** Fetch Backup Content */
export const fetchBackupContent = async (fileId, options) => {
  return axios
    .get(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      ...options,
      headers: {
        Authorization: `Bearer ${gapi.client.getToken()["access_token"]}`, // eslint-disable-line no-undef
      },
    })
    .then((res) => res.data);
};

/** Upload Backup */
export const uploadBackup = async (content) => {
  const file = await findBackupFile();
  const fileContent = JSON.stringify(content);

  const form = new FormData();
  const metadata = {
    name: BACKUP_FILENAME,
    parents: file === null ? ["appDataFolder"] : undefined,
  };

  form.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" })
  );

  form.append("file", new Blob([fileContent], { type: "application/json" }));

  const query = new URLSearchParams({
    uploadType: "multipart",
    fields: "id,name,modifiedTime",
  }).toString();

  const url = file
    ? `https://www.googleapis.com/upload/drive/v3/files/${file.id}?${query}`
    : `https://www.googleapis.com/upload/drive/v3/files?${query}`;

  const method = file ? "PATCH" : "POST";

  return axios
    .request({
      url,
      method,
      headers: {
        Authorization: `Bearer ${gapi.client.getToken()["access_token"]}`, // eslint-disable-line no-undef
      },
      data: form,
    })
    .then((res) => res.data);
};

/**
 * Loads a script
 * @param {string} src
 * @returns
 */
export function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.async = true;
    script.addEventListener("load", resolve);
    script.addEventListener("error", reject);

    document.body.appendChild(script);
  });
}
