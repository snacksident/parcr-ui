import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['ffad-2603-8000-3300-e809-8aa-3de8-a7-a245.ngrok-free.app'], // Add your ngrok host here
  },
})
