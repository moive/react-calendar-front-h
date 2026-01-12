import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react({
      include: /\.(jsx?|tsx?)$/,
      jsxRuntime: "automatic",
    }),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "public",
      filename: "sw.js",
      injectManifest: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff,woff2}"],
        globIgnores: ["**/node_modules/**/*"],
        maximumFileSizeToCacheInBytes: 5000000,
      },
      devOptions: {
        enabled: false,
        type: "classic",
      },
      registerType: "autoUpdate",
      workbox: {
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: "Calendar App",
        short_name: "Calendar",
        description: "React Calendar Application - Manage your events efficiently",
        theme_color: "#4285f4",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        scope: "/",
        orientation: "portrait-primary",

        // ✅ Usar los nombres que Chrome está buscando
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  server: {
    port: 3000,
    open: false,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    // ✅ Asegurar que se copien las carpetas de public/
    copyPublicDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "redux-vendor": ["react-redux", "@reduxjs/toolkit"],
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
});
