import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa"; // <-- Import the plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Add the PWA plugin configuration
    VitePWA({
      registerType: "autoUpdate",
      // PWA manifest configuration
      manifest: {
        name: "Task Manager Pro",
        short_name: "Tasks",
        description: "A modern, feature-rich task manager application.",
        theme_color: "#1d4ed8", // A blue color
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
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
        ],
      },
    }),
  ],
});
