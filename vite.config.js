import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['2c33-2603-8000-3300-e809-4ddf-993f-cedd-b4c.ngrok-free.app'], // Add your ngrok host here
  },
})
