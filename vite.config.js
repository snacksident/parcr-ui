import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['435e-2603-8000-3300-e809-619e-38a0-f13b-6a2a.ngrok-free.app'], // Add your ngrok host here
  },
})
