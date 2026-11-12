import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/pilvipalvelut/react-codename-generator/dist/',
  plugins: [react()],
})