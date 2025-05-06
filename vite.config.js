import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['14d7-2603-8000-3300-e809-9db7-ee7a-3626-f867.ngrok-free.app'], // Add your ngrok host here
  },
})
