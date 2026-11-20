import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { execSync } from "child_process";
import { componentTagger } from "lovable-tagger";

/** Build tag shown in the footer — git commit + build time, so stale cached
 * bundles are easy to spot. Falls back to build time only without git. */
const buildId = (() => {
  const date = new Date().toISOString().slice(0, 16).replace("T", " ");
  try {
    const hash = execSync("git rev-parse --short HEAD").toString().trim();
    return `${hash} · ${date}`;
  } catch {
    return date;
  }
})();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    __BUILD_ID__: JSON.stringify(buildId),
  },
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
}));
