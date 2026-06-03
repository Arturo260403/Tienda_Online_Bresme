import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon-bresme.png", "logo-bresme.svg"],
      manifest: {
        name: "Bresme — Ferretería y maquinaria",
        short_name: "Bresme",
        description:
          "Catálogo de productos de ferretería y maquinaria de Bresme.",
        lang: "es",
        theme_color: "#e30613",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          { src: "/icono-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icono-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "/icono-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,jpg,ico,webmanifest}"],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});