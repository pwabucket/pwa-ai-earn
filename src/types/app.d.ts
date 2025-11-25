export interface Transaction {
  id: string;
  amount: number;
  date: Date;
  type: "investment" | "withdrawal" | "exchange";
  isSimulated?: boolean;
}

export interface Account {
  id: string;
  title: string;
  url?: string;
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
