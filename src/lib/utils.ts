import clsx, { type ClassValue } from "clsx";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";
import copy from "copy-to-clipboard";
import { format } from "date-fns";
import Decimal from "decimal.js";

/** Class Names Merge Utility */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format Currency */
export const formatCurrency = (amount: Decimal.Value, prefix = "") => {
  const formatted = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(new Decimal(amount).toDecimalPlaces(4).toNumber());

  return prefix ? `${prefix}${formatted}` : formatted;
};

/** Extract Telegram WebAppData */
export function extractTgWebAppData(url: string) {
  const parsedUrl = new URL(url);
  const params = new URLSearchParams(parsedUrl.hash.replace(/^#/, ""));
  const initData = params.get("tgWebAppData");
  const initDataUnsafe = getInitDataUnsafe(initData as string);

  return {
    platform: params.get("tgWebAppPlatform"),
    version: params.get("tgWebAppVersion"),
    initData,
    initDataUnsafe,
  };
}

export function extractInitDataUnsafe(initData: string) {
  return getInitDataUnsafe(initData);
}

/** Get Init Data Unsafe */
export function getInitDataUnsafe(initData: string) {
  const params = new URLSearchParams(initData);
  const data: {
    [key: string]: unknown;
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      photo_url?: string;
      language_code?: string;
    };
  } = {};

  for (const [key, value] of params.entries()) {
    try {
      data[key] = JSON.parse(value);
    } catch {
      data[key] = value;
    }
  }

  return data;
}

/** Copy to Clipboard with Toast Notification */
export function copyToClipboard(content: string) {
  copy(content);
  toast.success("Copied to clipboard!");
}

/** Generate Wallet Address Link */
export function walletAddressLink(address: string) {
  return `https://bscscan.com/address/${address}`;
}

/** Generate Transaction Hash Link */
export function transactionHashLink(txHash: string) {
  return `https://bscscan.com/tx/${txHash}`;
}

export function truncateDecimals(value: number, decimals: number = 8): string {
  /* Convert to string with extra precision to avoid scientific notation */
  const str = value.toFixed(Math.max(decimals + 5, 20));

  /* Find decimal point position */
  const dotIndex = str.indexOf(".");

  /* If no decimal point or decimals is 0, return integer part only */
  if (dotIndex === -1 || decimals === 0) {
    return Math.trunc(value).toString();
  }

  /* Slice string to desired decimal places (pure truncation, no rounding) */
  return str.slice(0, dotIndex + decimals + 1);
}

export function downloadFile(content: Blob | File, filename: string) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(content);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function downloadJsonFile(id: string, data: unknown) {
  const timestamp = format(new Date(), "yyyy-MM-dd_HH-mm-ss");
  const jsonBlob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  return downloadFile(jsonBlob, `tracker-${id}-${timestamp}.json`);
}
