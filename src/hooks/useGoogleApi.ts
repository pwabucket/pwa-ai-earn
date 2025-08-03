import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import useAppStore from "../store/useAppStore";
import type { GoogleApiToken } from "../types/app";
import { loadScript } from "../lib/googleDrive";

interface ExtendedCodeClient extends google.accounts.oauth2.CodeClient {
  callback?: (response: google.accounts.oauth2.CodeResponse) => void;
  error_callback?: (error: { error: string }) => void;
}

// Constants
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
];

const SCOPES = [
  "profile",
  "email",
  "https://www.googleapis.com/auth/drive.appdata",
].join(" ");

const GOOGLE_OAUTH_API_BASE = "https://oauth2.googleapis.com";
const GOOGLE_API_BASE = "https://www.googleapis.com";
const TOKEN_REFRESH_INTERVAL = 60_000; // 1 minute
const TOKEN_REFRESH_BUFFER = 5 * 60 * 1000; // 5 minutes before expiry

// API URLs
const OAUTH_TOKEN_URL = `${GOOGLE_OAUTH_API_BASE}/token`;
const OAUTH_REVOKE_URL = `${GOOGLE_OAUTH_API_BASE}/revoke`;
const USERINFO_URL = `${GOOGLE_API_BASE}/oauth2/v2/userinfo`;

/**
 * Validates environment variables required for Google API
 * @throws If required environment variables are missing
 */
const validateEnvironment = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing required Google API credentials in environment variables"
    );
  }

  return { clientId, clientSecret };
};

/**
 * Calculates token expiration timestamp
 * @param token - Token object with expires_in property
 * @returns Token with expires_at timestamp
 */
const parseTokenExpiration = (
  token: google.accounts.oauth2.TokenResponse
): GoogleApiToken => ({
  ...token,
  expires_at: Date.now() + parseInt(token.expires_in) * 1000,
});

/**
 * Checks if a token is valid and not expired
 * @param token - Token object
 * @returns True if token is valid and not expired
 */
const isTokenValid = (token: GoogleApiToken | null) => {
  return Boolean(token?.expires_at && token.expires_at > Date.now());
};

/**
 * Custom hook for managing Google API authentication and operations
 * @returns Google API utilities and state
 */
export default function useGoogleApi() {
  const [gapiInitialized, setGapiInitialized] = useState(false);
  const [gisInitialized, setGisInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<Error | null>(
    null
  );
  const loadingRef = useRef(false);
  const refreshIntervalRef = useRef<null | ReturnType<typeof setInterval>>(
    null
  );

  const codeClientRef = useRef<ExtendedCodeClient | null>(null);

  // Store selectors
  const googleDriveAuthToken = useAppStore(
    (state) => state.googleDriveAuthToken
  );
  const setGoogleDriveAuthToken = useAppStore(
    (state) => state.setGoogleDriveAuthToken
  );
  const setGoogleDriveBackupFile = useAppStore(
    (state) => state.setGoogleDriveBackupFile
  );

  // Computed values
  const isValidToken = useMemo(
    () => isTokenValid(googleDriveAuthToken),
    [googleDriveAuthToken]
  );
  const initialized = useMemo(
    () => gapiInitialized && gisInitialized,
    [gapiInitialized, gisInitialized]
  );
  const authorized = useMemo(
    () => initialized && isValidToken,
    [initialized, isValidToken]
  );

  /**
   * Initializes the Google API client
   */
  const initializeGapi = useCallback(() => {
    try {
      gapi.load("client", async () => {
        try {
          await gapi.client.init({
            discoveryDocs: DISCOVERY_DOCS,
          });
          setGapiInitialized(true);
          setInitializationError(null);
        } catch (error) {
          console.error("Failed to initialize GAPI client:", error);
          setInitializationError(error as Error);
        }
      });
    } catch (error) {
      console.error("Failed to load GAPI:", error);
      setInitializationError(error as Error);
    }
  }, []);

  /**
   * Initializes the Google Identity Services client
   */
  const initializeGis = useCallback(() => {
    try {
      const { clientId } = validateEnvironment();

      codeClientRef.current = google.accounts.oauth2.initCodeClient({
        client_id: clientId,
        scope: SCOPES,
        ux_mode: "popup",
      });

      setGisInitialized(true);
      setInitializationError(null);
    } catch (error) {
      console.error("Failed to initialize GIS client:", error);
      setInitializationError(error as Error);
    }
  }, []);

  /**
   * Requests an access token from Google OAuth
   * @returns  The parsed token object
   * @throws If the authorization fails
   */
  const requestAccessToken = useCallback((): Promise<GoogleApiToken> => {
    if (!codeClientRef.current) {
      return Promise.reject(
        new Error("Google Identity Services not initialized")
      );
    }

    return new Promise((resolve, reject) => {
      const { clientId, clientSecret } = validateEnvironment();

      if (!codeClientRef.current)
        return reject(new Error("Code client not initialized"));

      /** Success Callback */
      codeClientRef.current.callback = async (
        response: google.accounts.oauth2.CodeResponse
      ) => {
        try {
          const { data } = await axios.post(OAUTH_TOKEN_URL, {
            code: response.code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: location.origin,
            grant_type: "authorization_code",
          });

          resolve(parseTokenExpiration(data));
        } catch (error) {
          console.error("Failed to exchange authorization code:", error);
          reject(
            new Error(`Token exchange failed: ${(error as Error).message}`)
          );
        }
      };

      /** Error Callback */
      codeClientRef.current.error_callback = (error) => {
        console.error("Authorization error:", error);
        reject(new Error(`Authorization failed: ${error.error || error}`));
      };

      try {
        codeClientRef.current.requestCode();
      } catch (error) {
        reject(
          new Error(
            `Failed to request authorization code: ${(error as Error).message}`
          )
        );
      }
    });
  }, []);

  /**
   * Refreshes the access token using the refresh token
   * @returns {Promise<Object>} The new token object
   * @throws {Error} If the refresh fails
   */
  const refetchToken = useCallback(async () => {
    if (!googleDriveAuthToken?.refresh_token) {
      throw new Error("No refresh token available");
    }

    try {
      const { clientId, clientSecret } = validateEnvironment();

      const { data } = await axios.post(OAUTH_TOKEN_URL, {
        grant_type: "refresh_token",
        refresh_token: googleDriveAuthToken.refresh_token,
        client_id: clientId,
        client_secret: clientSecret,
      });

      // Preserve the refresh token if not returned
      const newToken = parseTokenExpiration({
        ...googleDriveAuthToken,
        ...data,
        refresh_token: data.refresh_token || googleDriveAuthToken.refresh_token,
      });

      setGoogleDriveAuthToken(newToken);
      return newToken;
    } catch (error) {
      console.error("Failed to refresh token:", error);

      // If refresh fails, clear the token
      setGoogleDriveAuthToken(null);
      throw new Error(`Token refresh failed: ${(error as Error).message}`);
    }
  }, [googleDriveAuthToken, setGoogleDriveAuthToken]);

  /**
   * Gets a valid access token, refreshing if necessary
   * @returns {Promise<string>} Valid access token
   * @throws {Error} If unable to get a valid token
   */
  const getValidToken = useCallback(async () => {
    if (!googleDriveAuthToken) {
      throw new Error("No authentication token available");
    }

    if (isTokenValid(googleDriveAuthToken)) {
      return googleDriveAuthToken.access_token;
    }

    try {
      const newToken = await refetchToken();
      return newToken.access_token;
    } catch (error) {
      throw new Error(`Unable to get valid token: ${(error as Error).message}`);
    }
  }, [googleDriveAuthToken, refetchToken]);

  /**
   * Gets user information from Google API
   * @returns {Promise<Object>} User information object
   * @throws {Error} If unable to fetch user info
   */
  const getUserInfo = useCallback(async () => {
    try {
      const token = gapi?.client?.getToken();
      if (!token?.access_token) {
        throw new Error("No access token available");
      }

      const { data } = await axios.get(USERINFO_URL, {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      });

      return data;
    } catch (error) {
      console.error("Failed to get user info:", error);
      throw new Error(`Failed to get user info: ${(error as Error).message}`);
    }
  }, []);

  /**
   * Logs out the user and revokes tokens
   * @returns {Promise<void>}
   */
  const logout = useCallback(async () => {
    try {
      // Revoke the token if available
      if (googleDriveAuthToken?.access_token) {
        try {
          await axios.post(
            `${OAUTH_REVOKE_URL}?token=${googleDriveAuthToken.access_token}`
          );
        } catch (error) {
          console.warn("Failed to revoke token:", error);
          // Continue with logout even if revocation fails
        }
      }

      // Clear GAPI token
      if (typeof gapi !== "undefined" && gapi?.client) {
        gapi.client.setToken(null);
      }

      // Clear stored tokens and data
      setGoogleDriveAuthToken(null);
      setGoogleDriveBackupFile(null);

      // Clear refresh interval
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    } catch (error) {
      console.error("Error during logout:", error);
      // Still clear local state even if logout partially fails
      setGoogleDriveAuthToken(null);
      setGoogleDriveBackupFile(null);
    }
  }, [googleDriveAuthToken, setGoogleDriveAuthToken, setGoogleDriveBackupFile]);

  /**
   * Initialize Google Scripts with error handling
   */
  useEffect(() => {
    if (loadingRef.current) return;

    loadingRef.current = true;

    const initializeScripts = async () => {
      try {
        await Promise.all([
          loadScript("https://apis.google.com/js/api.js").then(initializeGapi),
          loadScript("https://accounts.google.com/gsi/client").then(
            initializeGis
          ),
        ]);
      } catch (error) {
        console.error("Failed to initialize Google scripts:", error);
        setInitializationError(error as Error);
        loadingRef.current = false; // Allow retry
      }
    };

    initializeScripts();
  }, [initializeGapi, initializeGis]);

  /**
   * Manage token lifecycle and refresh intervals
   */
  useEffect(() => {
    if (!initialized || !googleDriveAuthToken) return;

    const setupTokenRefresh = () => {
      // Clear existing interval
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }

      // Check if token needs immediate refresh
      if (googleDriveAuthToken.expires_at < Date.now()) {
        refetchToken().catch(console.error);
        return;
      }

      // Set GAPI token for immediate use
      if (typeof gapi !== "undefined" && gapi?.client) {
        gapi.client.setToken(googleDriveAuthToken);
      }

      // Setup periodic refresh check
      const checkAndRefreshToken = () => {
        if (
          googleDriveAuthToken.expires_at <
          Date.now() + TOKEN_REFRESH_BUFFER
        ) {
          refetchToken().catch(console.error);
        }
      };

      refreshIntervalRef.current = setInterval(
        checkAndRefreshToken,
        TOKEN_REFRESH_INTERVAL
      );
    };

    setupTokenRefresh();

    // Cleanup function
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [initialized, googleDriveAuthToken, refetchToken]);

  // Memoized return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      // State
      initialized,
      authorized,
      initializationError,

      // Methods
      requestAccessToken,
      refetchToken,
      getValidToken,
      getUserInfo,
      logout,
    }),
    [
      initialized,
      authorized,
      initializationError,
      requestAccessToken,
      refetchToken,
      getValidToken,
      getUserInfo,
      logout,
    ]
  );
}
