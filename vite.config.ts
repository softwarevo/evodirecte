import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig(({ mode }) => {
  const branchName = process.env.GITHUB_REF_NAME || process.env.VITE_BRANCH_NAME;

  const base = branchName && branchName !== 'main' 
    ? `/${branchName}/` 
    : '/';

  return {
    plugins: [react(), tailwindcss()],
    base: base,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
