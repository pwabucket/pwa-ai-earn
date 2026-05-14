import type Decimal from "decimal.js";
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
  /** Provider-owned daily profit rate strategy, keyed off the active amount. */
  getPercentage(amount: Decimal.Value): Decimal;
}
