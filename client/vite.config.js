import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteMinifyPlugin } from 'vite-plugin-minify'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), ViteMinifyPlugin({})],
    server: {
        port: 3000
    },
    resolve: {
        alias: {
            '@app': path.resolve(__dirname, 'src/app'),
            '@common': path.resolve(__dirname, 'src/common'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@pages': path.resolve(__dirname, 'src/pages'),
            '@redux': path.resolve(__dirname, 'src/redux'),
            '@routes': path.resolve(__dirname, 'src/routes'),
            '@theme': path.resolve(__dirname, 'src/theme'),
            '@utils': path.resolve(__dirname, 'src/utils')
        }
    }
})
