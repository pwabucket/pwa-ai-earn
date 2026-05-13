import axios, { type AxiosInstance } from "axios";

abstract class BaseProvider {
  protected url: URL;
  protected api: AxiosInstance;

  constructor(url: string) {
    this.url = new URL(url);

    this.api = axios.create({
      baseURL: this.url.origin,
    });

    this.configureLlamaInterceptor();
  }

  configureLlamaInterceptor() {
    this.api.interceptors.request.use((config) => {
      if (!import.meta.env.VITE_LLAMA_URL) {
        return config;
      }

      const baseURL = config.baseURL || this.url.origin;
      const fullURL = new URL(config.url || "", baseURL);
      for (const [key, value] of Object.entries(config.params || {})) {
        fullURL.searchParams.append(key, String(value));
      }

      const llamaURL = new URL(import.meta.env.VITE_LLAMA_URL);
      llamaURL.searchParams.set("url", fullURL.href);

      config.url = llamaURL.href;
      config.baseURL = undefined;
      delete config.params;

      return config;
    });
  }
}

export { BaseProvider };
