import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                about: resolve(__dirname, 'about.html'),
                contact: resolve(__dirname, 'contact.html'),
                pillars: resolve(__dirname, 'pillars.html'),
                resources: resolve(__dirname, 'resources.html'),
                notFound: resolve(__dirname, '404.html'),
            },
        },
    },
})
