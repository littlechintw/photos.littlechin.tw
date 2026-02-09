import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMGS_DIR = path.join(__dirname, '..', 'imgs');
const METADATA_FILE = path.join(IMGS_DIR, '.compression-metadata.json');
const QUALITY = 85; // JPEG quality for compression
const MAX_DIMENSION = 2400; // Maximum width or height in pixels

/**
 * Load compression metadata
 */
function loadMetadata() {
  if (fs.existsSync(METADATA_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(METADATA_FILE, 'utf8'));
    } catch (error) {
      console.warn('Failed to load metadata file:', error.message);
      return {};
    }
  }
  return {};
}

/**
 * Save compression metadata
 */
function saveMetadata(metadata) {
  fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));
}

/**
 * Get file hash to detect changes
 */
function getFileHash(filePath) {
  const stats = fs.statSync(filePath);
  return `${stats.size}-${stats.mtimeMs}`;
}

/**
 * Check if image needs compression
 */
function needsCompression(filePath, metadata) {
  const hash = getFileHash(filePath);
  const relativePath = path.relative(IMGS_DIR, filePath);
  
  if (!metadata[relativePath]) {
    return true;
  }
  
  return metadata[relativePath].hash !== hash || !metadata[relativePath].compressed;
}

/**
 * Compress a single image
 */
async function compressImage(filePath, metadata) {
  const relativePath = path.relative(IMGS_DIR, filePath);
  
  if (!needsCompression(filePath, metadata)) {
    console.log(`✓ Skipping ${relativePath} (already compressed)`);
    return false;
  }
  
  console.log(`⚙ Compressing ${relativePath}...`);
  
  try {
    // Create backup of original (with .original extension)
    const backupPath = `${filePath}.original`;
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(filePath, backupPath);
      console.log(`  📦 Backup created: ${path.basename(backupPath)}`);
    }
    
    // Load image and get metadata
    const image = sharp(filePath);
    const imageMetadata = await image.metadata();
    
    // Calculate new dimensions if image is too large
    let width = imageMetadata.width;
    let height = imageMetadata.height;
    
    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      if (width > height) {
        height = Math.round((height / width) * MAX_DIMENSION);
        width = MAX_DIMENSION;
      } else {
        width = Math.round((width / height) * MAX_DIMENSION);
        height = MAX_DIMENSION;
      }
    }
    
    // Compress image with EXIF preservation
    await image
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({
        quality: QUALITY,
        mozjpeg: true
      })
      .withMetadata() // Preserve EXIF data
      .toFile(`${filePath}.tmp`);
    
    // Replace original with compressed version
    fs.renameSync(`${filePath}.tmp`, filePath);
    
    const originalSize = fs.statSync(backupPath).size;
    const compressedSize = fs.statSync(filePath).size;
    const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);
    
    console.log(`  ✓ Compressed from ${(originalSize / 1024 / 1024).toFixed(2)}MB to ${(compressedSize / 1024 / 1024).toFixed(2)}MB (${reduction}% reduction)`);
    
    // Update metadata
    metadata[relativePath] = {
      hash: getFileHash(filePath),
      compressed: true,
      compressedAt: new Date().toISOString(),
      originalSize,
      compressedSize,
      dimensions: `${width}x${height}`,
      quality: QUALITY
    };
    
    return true;
  } catch (error) {
    console.error(`  ✗ Failed to compress ${relativePath}:`, error.message);
    return false;
  }
}

/**
 * Find all image files in imgs directory
 */
function findImageFiles(dir) {
  const images = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      images.push(...findImageFiles(fullPath));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      // Skip backup files and metadata
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext) && !entry.name.endsWith('.original')) {
        images.push(fullPath);
      }
    }
  }
  
  return images;
}

/**
 * Main compression function
 */
async function compressAllImages() {
  console.log('🖼️  Starting image compression...\n');
  
  const metadata = loadMetadata();
  const imageFiles = findImageFiles(IMGS_DIR);
  
  console.log(`Found ${imageFiles.length} images to process\n`);
  
  let compressed = 0;
  let skipped = 0;
  let failed = 0;
  
  for (const filePath of imageFiles) {
    const result = await compressImage(filePath, metadata);
    if (result === true) {
      compressed++;
    } else if (result === false && needsCompression(filePath, metadata)) {
      failed++;
    } else {
      skipped++;
    }
  }
  
  // Save metadata
  saveMetadata(metadata);
  
  console.log('\n📊 Compression Summary:');
  console.log(`  ✓ Compressed: ${compressed}`);
  console.log(`  ⊘ Skipped: ${skipped}`);
  if (failed > 0) {
    console.log(`  ✗ Failed: ${failed}`);
  }
  console.log(`\n✓ Metadata saved to ${path.relative(process.cwd(), METADATA_FILE)}`);
}

// Run compression
compressAllImages().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
