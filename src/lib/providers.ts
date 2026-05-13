import { DefaultProvider } from "../providers/DefaultProvider";
import { DjangoProvider } from "../providers/DjangoProvider";
import { LeonardoProvider } from "../providers/LeonardoProvider";
import type { ProviderType } from "../types/tracker";

export const PROVIDERS = {
  default: DefaultProvider,
  leonardo: LeonardoProvider,
  django: DjangoProvider,
};

export const PROVIDER_NAMES: Record<ProviderType, string> = {
  default: "Default",
  leonardo: "Leonardo",
  django: "Django",
};

export const DEFAULT_PROVIDER: ProviderType = "leonardo";
