import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs'
import { join, dirname } from 'path'

// Plugin to copy imgs directory to dist
function copyImgsPlugin() {
  return {
    name: 'copy-imgs',
    closeBundle() {
      const copyDir = (src, dest) => {
        mkdirSync(dest, { recursive: true })
        const entries = readdirSync(src, { withFileTypes: true })
        
        for (const entry of entries) {
          const srcPath = join(src, entry.name)
          const destPath = join(dest, entry.name)
          
          if (entry.isDirectory()) {
            copyDir(srcPath, destPath)
          } else if (entry.isFile()) {
            // Skip backup files and metadata
            if (!entry.name.endsWith('.original') && entry.name !== '.compression-metadata.json') {
              copyFileSync(srcPath, destPath)
            }
          }
        }
      }
      
      try {
        copyDir('imgs', 'dist/imgs')
        console.log('✓ Copied imgs directory to dist/imgs')
      } catch (error) {
        console.error('Failed to copy imgs directory:', error)
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), copyImgsPlugin()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
