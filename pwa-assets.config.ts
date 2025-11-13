import {
  defineConfig,
  minimal2023Preset as preset,
} from "@vite-pwa/assets-generator/config";

const resizeOptions = { background: "#ffffff" };

export default defineConfig({
  headLinkOptions: {
    preset: "2023",
  },
  preset: {
    ...preset,
    apple: {
      ...preset.apple,
      resizeOptions,
    },
    maskable: {
      ...preset.maskable,
      resizeOptions,
    },
  },
  images: ["public/icon.svg"],
});
