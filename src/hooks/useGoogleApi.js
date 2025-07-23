/* eslint-disable no-undef */
import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import useAppStore from "../store/useAppStore";
import { loadScript } from "../lib/googleDrive";

const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
];

const SCOPES = [
  "profile",
  "email",
  "https://www.googleapis.com/auth/drive.appdata",
].join(" ");

export default function useGoogleApi() {
  const [gapiInitialized, setGapiInitialized] = useState(false);
  const [gisInitialized, setGisInitialized] = useState(false);
  const loadingRef = useRef(false);

  /** @type {import("react").Ref<google.accounts.oauth2.CodeClient>} */
  const codeClientRef = useRef(null);
  const googleDriveAuthToken = useAppStore(
    (state) => state.googleDriveAuthToken
  );
  const setGoogleDriveAuthToken = useAppStore(
    (state) => state.setGoogleDriveAuthToken
  );
  const setGoogleDriveBackupFile = useAppStore(
    (state) => state.setGoogleDriveBackupFile
  );

  const isValidToken = Boolean(
    googleDriveAuthToken && googleDriveAuthToken["expires_at"] > Date.now()
  );
  const initialized = gapiInitialized && gisInitialized;
  const authorized = initialized && isValidToken;

  /** Callback to Initialize Gapi */
  const initializeGapi = useCallback(() => {
    gapi.load("client", async () => {
      await gapi.client.init({
        discoveryDocs: DISCOVERY_DOCS,
      });
      setGapiInitialized(true);
    });
  }, []);

  /** Callback to Initialize Gis */
  const initializeGis = useCallback(() => {
    codeClientRef.current = google.accounts.oauth2.initCodeClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: SCOPES,
      ux_mode: "popup",
      callback: "",
    });
    setGisInitialized(true);
  }, []);

  const parseToken = useCallback(
    (token) => ({
      ...token,
      ["expires_at"]: Date.now() + token["expires_in"] * 1000,
    }),
    []
  );

  /** Request Access Token */
  const requestAccessToken = useCallback(() => {
    return new Promise((resolve, reject) => {
      /** Success Callback */
      codeClientRef.current.callback = async (response) => {
        try {
          const data = await axios
            .post("https://oauth2.googleapis.com/token", {
              code: response.code,
              client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
              client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
              redirect_uri: location.origin,
              grant_type: "authorization_code",
            })
            .then((res) => res.data);

          resolve(parseToken(data));
        } catch (e) {
          reject(e);
        }
      };

      /** Error Callback */
      codeClientRef.current["error_callback"] = (e) => {
        reject(e);
      };

      codeClientRef.current.requestCode();
    });
  }, [parseToken]);

  /** Refetch Token */
  const refetchToken = useCallback(async () => {
    const data = await axios
      .post("https://oauth2.googleapis.com/token", {
        grant_type: "refresh_token",
        refresh_token: googleDriveAuthToken["refresh_token"],
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
      })
      .then((res) => res.data);

    /** Get New Token */
    const newToken = parseToken({
      ...googleDriveAuthToken,
      ...data,
    });

    /** Set New Token */
    setGoogleDriveAuthToken(newToken);

    /** Return New Token */
    return newToken;
  }, [googleDriveAuthToken, setGoogleDriveAuthToken, parseToken]);

  /** Get Valid Token */
  const getValidToken = useCallback(async () => {
    if (googleDriveAuthToken && isValidToken) {
      return googleDriveAuthToken["access_token"];
    }

    return refetchToken();
  }, [googleDriveAuthToken, isValidToken, refetchToken]);

  /** Get User Info */
  const getUserInfo = useCallback(
    () =>
      axios
        .get(`https://www.googleapis.com/oauth2/v2/userinfo`, {
          headers: {
            Authorization: `Bearer ${gapi.client.getToken()["access_token"]}`,
          },
        })
        .then((res) => res.data),
    []
  );

  /** Logout */
  const logout = useCallback(async () => {
    if (googleDriveAuthToken) {
      axios.post(
        `https://oauth2.googleapis.com/revoke?token=${googleDriveAuthToken["access_token"]}`
      );
    }
    gapi?.client?.setToken(null);
    setGoogleDriveAuthToken(null);
    setGoogleDriveBackupFile(null);
  }, [googleDriveAuthToken, setGoogleDriveAuthToken, setGoogleDriveBackupFile]);

  /** Initialize Google Scripts */
  useEffect(() => {
    if (loadingRef.current === false) {
      loadingRef.current = true;
      loadScript("https://apis.google.com/js/api.js").then(initializeGapi);
      loadScript("https://accounts.google.com/gsi/client").then(initializeGis);
    }
  }, [initializeGapi, initializeGis]);

  /** Restore Token */
  useEffect(() => {
    if (initialized && googleDriveAuthToken) {
      /** Refetch Interval */
      let interval;

      /** Refetch if Expiring */
      const refetchIfExpiring = () => {
        if (googleDriveAuthToken["expires_at"] < Date.now() - 5 * 60 * 1000) {
          refetchToken();
        }
      };

      if (googleDriveAuthToken["expires_at"] < Date.now()) {
        refetchToken();
      } else {
        /** Set GAPI Token */
        gapi.client.setToken(googleDriveAuthToken);

        /** Periodically Refetch Token */
        interval = setInterval(refetchIfExpiring, 60_000);
      }

      return () => {
        clearInterval(interval);
      };
    }
  }, [initialized, googleDriveAuthToken, refetchToken]);

  return useMemo(
    () => ({
      getUserInfo,
      refetchToken,
      getValidToken,
      requestAccessToken,
      logout,
      initialized,
      authorized,
    }),
    [
      getUserInfo,
      refetchToken,
      getValidToken,
      requestAccessToken,
      logout,
      initialized,
      authorized,
    ]
  );
}
