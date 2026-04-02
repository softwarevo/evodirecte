import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const branchName = process.env.VITE_BRANCH_NAME;

const base = branchName && branchName !== 'main' 
  ? `/${branchName}/` 
  : '/';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: base,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
