import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['1957-2603-8000-3300-e809-483d-b0cf-ec0c-cc4f.ngrok-free.app'], // Add your ngrok host here
  },
})
