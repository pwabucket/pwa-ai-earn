import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { PWARoutingProvider } from "@pwabucket/pwa-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";

/** Register Service Worker */
registerSW({ immediate: true });

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <PWARoutingProvider>
          <App />
        </PWARoutingProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
