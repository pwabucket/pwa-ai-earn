import Decimal from "decimal.js";
import { LeonardoProvider } from "./LeonardoProvider";
import type { Transaction } from "../types/app";

interface DjangoTypeConfig {
  type: Transaction["type"];
  duration?: number;
}

const DJANGO_TYPE_MAP: Record<string, DjangoTypeConfig> = {
  Registration: { type: "investment", duration: 7 },
  Deposit: { type: "investment" },
  Purchased: { type: "investment" },
  Withdrawal: { type: "withdrawal" },
  Reinvestment: { type: "exchange" },
  Commission: { type: "earnings" },
  Bonus: { type: "earnings" },
  ["Weekend Income"]: { type: "earnings" },
};

class DjangoProvider extends LeonardoProvider {
  async validate() {
    const data = await super.validate();
    const userInfo = data.userInfo;

    delete userInfo["interestList"];

    return { data: userInfo };
  }

  async getTransactions(): Promise<Transaction[]> {
    await this.initialize();
    const raw = await this.fetchTransactions();

    return raw.flatMap((item): Transaction[] => {
      const typeName = String(item.typeName);
      const config = DJANGO_TYPE_MAP[typeName];
      if (!config) return [];
      return [
        {
          id: String(item.id),
          date: new Date(String(item.create_time)),
          amount: new Decimal(item.amount as Decimal.Value),
          title: typeName,
          ...config,
        },
      ];
    });
  }
}

export { DjangoProvider };
