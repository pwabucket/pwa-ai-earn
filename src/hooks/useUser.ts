import { useMemo } from "react";
import { extractTgWebAppData } from "../lib/utils";
import useActiveAccount from "./useActiveAccount";

export const useUser = () => {
  const account = useActiveAccount();
  const url = account.url;
  return useMemo(() => {
    try {
      return url ? extractTgWebAppData(url).initDataUnsafe.user : null;
    } catch {
      return null;
    }
  }, [url]);
};
