import { extractTgWebAppData } from "../lib/utils";
import type { TelegramWebAppData } from "../types/telegram";
import { BaseProvider } from "./BaseProvider";

abstract class BaseTelegramProvider extends BaseProvider {
  protected telegramWebApp: TelegramWebAppData;

  constructor(url: string) {
    super(url);

    this.telegramWebApp = extractTgWebAppData(url);
  }

  getUserId() {
    return this.telegramWebApp.initDataUnsafe?.user?.id || null;
  }

  getTgId() {
    return this.getUserId()?.toString() || "";
  }

  getInitData() {
    return this.telegramWebApp.initData || "";
  }
}

export { BaseTelegramProvider };
