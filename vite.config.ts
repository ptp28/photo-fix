import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor': ['react', 'react-dom'],
                    'mantine': ['@mantine/core'],
                    'chart': ['chart.js', 'react-chartjs-2']
                }
            }
        }
    }
})