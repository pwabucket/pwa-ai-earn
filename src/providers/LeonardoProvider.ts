import Decimal from "decimal.js";
import type { Transaction } from "../types/app";
import type {
  AccountStatus,
  TrackerProviderInstance,
} from "../types/tracker";

import { BaseTelegramProvider } from "./BaseTelegramProvider";

interface RawTransaction {
  id: number;
  tg: number;
  tp: string;
  type: string;
  create_time: string;
  status: string;
  hashId: string;
}

const TYPE_MAP: Record<string, Transaction["type"]> = {
  "Purchased TP": "investment",
  Withdrawals: "withdrawal",
  Exchange: "exchange",
};

class LeonardoProvider
  extends BaseTelegramProvider
  implements TrackerProviderInstance
{
  static customCodeMap = new Map<string, string>();
  static initializationPromises = new Map<string, Promise<void>>();

  constructor(url: string) {
    super(url);

    this.api.defaults.headers.common["Authorization"] =
      this.telegramWebApp.initData || "";
  }

  async initialize() {
    const origin = this.url.origin;

    if (LeonardoProvider.customCodeMap.has(origin)) {
      this.api.defaults.headers.common["custom"] =
        LeonardoProvider.customCodeMap.get(origin) || "";
      return;
    }

    if (LeonardoProvider.initializationPromises.has(origin)) {
      await LeonardoProvider.initializationPromises.get(origin);
      this.api.defaults.headers.common["custom"] =
        LeonardoProvider.customCodeMap.get(origin) || "";
      return;
    }

    const initPromise = (async () => {
      try {
        const html = await this.api.get(this.url.href).then((res) => res.data);

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const scriptTag = [...doc.scripts].find(
          (s) => s.type === "module" && s.getAttribute("src")?.includes("index")
        );

        if (scriptTag) {
          const scriptUrl = new URL(
            scriptTag.getAttribute("src") || "",
            origin
          );

          const scriptContent = await this.api
            .get(scriptUrl.href)
            .then((res) => res.data);

          const customHeader = scriptContent.match(
            /headers\.custom\s*=\s*["']([^"']+)["']/
          );

          if (customHeader && customHeader[1]) {
            this.api.defaults.headers.common["custom"] = customHeader[1];
            console.log("Custom Header Set:", customHeader[1]);
            LeonardoProvider.customCodeMap.set(origin, customHeader[1]);
          }
        }
      } finally {
        LeonardoProvider.initializationPromises.delete(origin);
      }
    })();

    LeonardoProvider.initializationPromises.set(origin, initPromise);
    await initPromise;
  }

  validate() {
    return this.api
      .post("/api/validate", {
        tgInfo: {
          ["invite"]: 0,
          ["language_code"]: "",
          ["initData"]: this.getInitData(),
          ["id"]: this.getUserId(),
        },
      })
      .then((res) => res.data.data);
  }

  async getAccountStatus(): Promise<AccountStatus> {
    await this.initialize();
    const result = await this.validate();
    return {
      status: result.data?.status,
      data: result.data || {},
    };
  }

  async getAccountInfo(): Promise<Record<string, unknown>> {
    await this.initialize();
    const result = await this.validate();
    return result.data || {};
  }

  async fetchTransactions(pageSize = 1000) {
    const results: RawTransaction[] = [];
    let page = 1;

    while (true) {
      const params = new URLSearchParams({
        ["tg_id"]: this.getTgId(),
        ["page"]: page.toString(),
        ["pageSize"]: pageSize.toString(),
      });

      const { data } = await this.api
        .get("/api/transactions?" + params.toString())
        .then((res) => res.data.data);

      results.push(...data.list);
      if (data.lastPage === page) {
        break;
      } else {
        page++;
      }
    }

    return results;
  }

  async getTransactions(): Promise<Transaction[]> {
    await this.initialize();
    const raw = await this.fetchTransactions();

    return raw.flatMap((item): Transaction[] => {
      const type = TYPE_MAP[item.type];
      if (!type) return [];
      return [
        {
          id: item.id.toString(),
          date: new Date(item.create_time),
          amount: new Decimal(item.tp),
          type,
        },
      ];
    });
  }
}

export { LeonardoProvider };
