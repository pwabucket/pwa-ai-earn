import { useMemo } from "react";
import { extractTgWebAppData } from "../lib/utils";
import useAppStore from "../store/useAppStore";

export const useUser = () => {
  const url = useAppStore((state) => state.url);
  return useMemo(() => {
    try {
      return url ? extractTgWebAppData(url).initDataUnsafe.user : null;
    } catch {
      return null;
    }
  }, [url]);
};
