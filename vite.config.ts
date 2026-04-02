import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

function sanitizeBranchName(rawBranchName?: string): string | undefined {
  if (!rawBranchName) return undefined

  // Trim whitespace
  let sanitized = rawBranchName.trim()

  // Replace any character that is not URL-safe (a-z, A-Z, 0-9, -, _, .) with '-'
  sanitized = sanitized.replace(/[^a-zA-Z0-9\-_.]+/g, "-")

  // Collapse multiple '-' into a single '-'
  sanitized = sanitized.replace(/-+/g, "-")

  // Remove leading dots and slashes to avoid path traversal or absolute paths
  sanitized = sanitized.replace(/^[/\\.]+/, "")

  // If nothing remains, treat as undefined so we fall back to the default base
  if (!sanitized) return undefined

  return sanitized
}

export default defineConfig(() => {
  const rawBranchName = process.env.GITHUB_REF_NAME || process.env.VITE_BRANCH_NAME
  const branchName = sanitizeBranchName(rawBranchName)

  const base = branchName && branchName !== "main"
    ? `/${branchName}/`
    : "/"

  return {
    plugins: [react(), tailwindcss()],
    base,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
