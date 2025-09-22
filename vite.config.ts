import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-redux'],
          'wallet-vendor': ['wagmi', '@rainbow-me/rainbowkit', 'viem'],
          'chart-vendor': ['chart.js', 'react-chartjs-2'],
          'redux-vendor': ['@reduxjs/toolkit'],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-redux',
      '@reduxjs/toolkit',
      'wagmi',
      '@rainbow-me/rainbowkit',
      'viem',
      'chart.js',
      'react-chartjs-2',
    ],
  },
})
