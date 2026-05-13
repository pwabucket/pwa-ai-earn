import type { Transaction } from "./app";

export type ProviderType = "default" | "leonardo" | "django";

export interface AccountStatus {
  status: string | number;
  data: Record<string, unknown>;
}

export interface TrackerProviderInstance {
  initialize(): Promise<void>;
  getAccountStatus(): Promise<AccountStatus>;
  getAccountInfo(): Promise<Record<string, unknown>>;
  getTransactions(): Promise<Transaction[]>;
}

export interface TrackerProvider {
  new (url: string): TrackerProviderInstance;
}
