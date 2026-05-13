import type {
  AccountStatus,
  TrackerProviderInstance,
} from "../types/tracker";
import type { Transaction } from "../types/app";
import { BaseProvider } from "./BaseProvider";

class DefaultProvider extends BaseProvider implements TrackerProviderInstance {
  async initialize(): Promise<void> {
    return;
  }

  async getAccountStatus(): Promise<AccountStatus> {
    return { status: "N/A", data: {} };
  }

  async getAccountInfo(): Promise<Record<string, unknown>> {
    return {};
  }

  async getTransactions(): Promise<Transaction[]> {
    return [];
  }
}

export { DefaultProvider };
