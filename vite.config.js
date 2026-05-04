import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf-8'))

// GitHub Pages: https://<user>.github.io/<repo>/ — set BASE_PATH in CI (see .github/workflows)
const base = process.env.BASE_PATH?.trim() || '/'

/** BASE_PATH가 /repo/일 때 요청은 /repo/api/... 로 가므로, 그 경로도 3001의 /api/... 로 넘긴다 */
function buildApiProxy() {
  const proxy = {
    '/api': {
      target: 'http://127.0.0.1:3001',
      changeOrigin: true,
    },
  }
  const envBase = process.env.BASE_PATH?.trim()
  if (envBase && envBase !== '/') {
    const prefix = `${envBase.replace(/\/?$/, '')}/api`
    if (prefix !== '/api') {
      proxy[prefix] = {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        rewrite: (path) => '/api' + path.slice(prefix.length),
      }
    }
  }
  return proxy
}

const apiProxy = buildApiProxy()

export default defineConfig({
  base,
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: apiProxy,
  },
  preview: {
    port: 5173,
    strictPort: true,
    proxy: apiProxy,
  },
})
