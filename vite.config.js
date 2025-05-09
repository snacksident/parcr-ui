import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['6648-2603-8000-3300-e809-446f-884-dd05-eb19.ngrok-free.app'], // Add your ngrok host here
  },
})
