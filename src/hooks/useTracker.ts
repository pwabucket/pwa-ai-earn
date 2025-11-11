import { useMemo } from "react";
import useAppStore from "../store/useAppStore";
import { Tracker } from "../lib/Tracker";

export const useTracker = () => {
  const url = useAppStore((state) => state.url);
  const enabled = Boolean(url);
  const tracker = useMemo(() => {
    return url ? new Tracker(url) : null;
  }, [url]);
  return { tracker, enabled, url };
};
