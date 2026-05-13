export interface InitDataUnsafe {
  query_id?: string;
  user?: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    allows_write_to_pm?: boolean;
    photo_url?: string;
  };
  auth_date?: number;
  signature?: string;
  hash?: string;
  [key: string]: unknown;
}

export interface TelegramWebAppData {
  platform: string | null;
  version: string | null;
  initData: string | null;
  initDataUnsafe: InitDataUnsafe | null;
}
