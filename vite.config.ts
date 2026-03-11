import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

const env = loadEnv('dev', process.cwd())

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: env.VITE_API_URL,
        changeOrigin: true
      },
      '/nominatim': {
        target: env.VITE_NOMINATIM_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/nominatim/, '')
      },
      '/osrm': {
        target: env.VITE_OSRM_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/osrm/, '')
      }
    }
  }
})
