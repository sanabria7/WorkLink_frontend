import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Proxy de desarrollo: el navegador habla solo con localhost:5173 (mismo origen)
// y Vite reenvía cada prefijo al gateway por detrás → sin CORS y sin problema del
// cert autofirmado (secure:false lo ignora en el salto servidor-a-servidor).
// Es solo para dev; en producción el SPA se sirve bajo el mismo dominio del gateway.
const gateway = { target: "https://localhost", changeOrigin: true, secure: false };

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    proxy: {
      "/auth": gateway,
      "/profiles": gateway,
      "/offers": gateway,
      "/bookings": gateway,
      "/payments": gateway,
    },
  },
})
