import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'



export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Quando o Front-end pedir por '/api', o Vite reescreve para a URL de destino
      '/api': {
        target: 'https://back-end-servicosja-api.onrender.com',
        changeOrigin: true, // Necessário para hospedar servidores virtuais
        secure: true, // Use 'true' pois o servidor é HTTPS
      },
    },
  },
})
