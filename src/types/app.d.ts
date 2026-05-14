import type Decimal from "decimal.js";
import type { ProviderType } from "./tracker";

export interface Transaction {
  id: string;
  amount: Decimal.Value;
  date: Date;
  type: "investment" | "withdrawal" | "exchange" | "earnings" | "profit";
  /** Original provider label, shown verbatim in the UI when present. */
  title?: string;
  /** Days this investment generates profit for. Falls back to the engine default. */
  duration?: number;
  pinned?: boolean;
  isSimulated?: boolean;
}

export interface Account {
  id: string;
  title: string;
  url?: string;
  provider?: ProviderType;
  enableLiveUpdates?: boolean;
  transactions: Transaction[];
}

export interface GoogleApiToken extends google.accounts.oauth2.TokenResponse {
  expires_at: number;
  refresh_token?: string;
}

export type GoogleDriveBackupFile = gapi.client.drive.File;

export interface GoogleDriveBackupContent {
  updatedAt: number;
  data: {
    accounts: Account[];
  };
}

export interface BackupData {
  version: string;
  timestamp: string;
  data: {
    accounts: Account[];
  };
}
