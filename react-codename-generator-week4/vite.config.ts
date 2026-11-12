import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/pilvipalvelut/react-codename-generator-week4/dist/',
  plugins: [react()],
})