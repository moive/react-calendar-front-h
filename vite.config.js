import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: /\.(jsx?|tsx?)$/,
    }),
  ],
  server: {
    port: 3000,
    open: false,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
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
