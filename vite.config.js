import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['ef42-2603-8000-3300-e809-649f-ca87-400a-deef.ngrok-free.app'], // Add your ngrok host here
  },
})
