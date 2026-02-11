import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
    plugins: [
        tailwindcss(),
    ],
    build: {
        rollupOptions: {
            input: {
                main: resolve(import.meta.dirname, 'index.html'),
                about: resolve(import.meta.dirname, 'about.html'),
                contact: resolve(import.meta.dirname, 'contact.html'),
                pillars: resolve(import.meta.dirname, 'pillars.html'),
                resources: resolve(import.meta.dirname, 'resources.html'),
                success: resolve(import.meta.dirname, 'success.html'),
                notFound: resolve(import.meta.dirname, '404.html'),
            },
        },
    },
})
