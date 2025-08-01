import path from "path";
import process from "process";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import version from "vite-plugin-package-version";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { loadEnv } from "vite";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  /** Env */
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      /** Plugins */
      version(),
      VitePWA({
        registerType: "autoUpdate",
        workbox: {
          globPatterns: ["**/*.*"],
          maximumFileSizeToCacheInBytes: 5 * 1024 ** 2,
        },
        manifest: {
          name: env.VITE_APP_NAME,
          short_name: env.VITE_APP_NAME,
          description: env.VITE_APP_DESCRIPTION,
          theme_color: "#171717",
          background_color: "#ffffff",
          icons: [
            {
              src: "pwa-64x64.png",
              sizes: "64x64",
              type: "image/png",
            },
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "maskable-icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
          screenshots: [
            {
              src: "screenshot-mobile-1.jpg",
              sizes: "1080x1920",
              type: "image/jpg",
            },
            {
              src: "screenshot-mobile-2.jpg",
              sizes: "1080x1920",
              type: "image/jpg",
            },
            {
              src: "screenshot-mobile-3.jpg",
              sizes: "1080x1920",
              type: "image/jpg",
            },
          ],
        },
      }),
      ViteEjsPlugin(env),
      tailwindcss(),
      react(),
    ],
  };
});
