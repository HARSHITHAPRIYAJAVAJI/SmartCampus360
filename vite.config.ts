import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: true,
    cssMinify: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom') || id.includes('lucide-react') || id.includes('@radix-ui') || id.includes('clsx') || id.includes('tailwind-merge')) {
              return 'vendor';
            }
            if (id.includes('framer-motion')) {
              return 'framer';
            }
            if (id.includes('@tanstack') || id.includes('zod') || id.includes('react-hook-form')) {
              return 'complex-forms';
            }
          }
        }
      }
    }
  }
}));
