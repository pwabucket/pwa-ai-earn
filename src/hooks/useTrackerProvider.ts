import { useCallback } from "react";
import type { ProviderType } from "../types/tracker";
import { DEFAULT_PROVIDER, PROVIDERS } from "../lib/providers";

const useTrackerProvider = () => {
  const getProvider = useCallback(
    (provider: ProviderType = DEFAULT_PROVIDER) => PROVIDERS[provider],
    []
  );

  const createProvider = useCallback(
    (provider: ProviderType = DEFAULT_PROVIDER, url: string) => {
      const Provider = getProvider(provider);
      return new Provider(url);
    },
    [getProvider]
  );

  return { getProvider, createProvider };
};

export { useTrackerProvider };
