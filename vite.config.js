import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['bba9-2603-8000-3300-e809-a92e-a787-be95-8c32.ngrok-free.app'], // Add your ngrok host here
  },
})
