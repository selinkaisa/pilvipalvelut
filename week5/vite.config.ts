import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/pilvipalvelut/week5/dist/',
  plugins: [react()],
})