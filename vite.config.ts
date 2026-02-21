import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({ tsconfigPath: './tsconfig.app.json' }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'BrickPdf',
      formats: ['es', 'umd'],
      fileName: 'brick-pdf',
    },
    rollupOptions: {
      external: ['vue', 'sortablejs', '@vueuse/core', 'pdfmake', 'pdfmake/build/pdfmake', 'pdfmake/build/vfs_fonts'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          sortablejs: 'Sortable',
          '@vueuse/core': 'VueUse',
          pdfmake: 'pdfmake',
          'pdfmake/build/pdfmake': 'pdfMake',
          'pdfmake/build/vfs_fonts': 'pdfFonts',
        },
      },
    },
  },
})
