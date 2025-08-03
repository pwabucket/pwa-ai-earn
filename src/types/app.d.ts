export interface Investment {
  id: string;
  amount: number;
  date: Date;
  isSimulated?: boolean;
}

export interface Withdrawal {
  id: string;
  amount: number;
  date: Date;
  isSimulated?: boolean;
}

export interface GoogleApiToken extends google.accounts.oauth2.TokenResponse {
  expires_at: number;
  refresh_token?: string;
}

export type GoogleDriveBackupFile = gapi.client.drive.File;

export interface GoogleDriveBackupContent {
  updatedAt: number;
  data: {
    investments: Investment[];
    withdrawals: Withdrawal[];
  };
}
