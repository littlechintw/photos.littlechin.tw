<template>
  <div class="event-gallery">
    <div v-for="event in events" :key="event.id" class="event-section">
      <div class="event-header">
        <h2 class="event-name">{{ event.name }}</h2>
        <div class="event-meta">
          <span class="event-date">📅 {{ formatDate(event.date) }}</span>
          <span class="event-location">📍 {{ event.location }}</span>
        </div>
        <p v-if="event.description" class="event-description">
          {{ event.description }}
        </p>
      </div>
      
      <div class="images-grid">
        <div
          v-for="(image, index) in getDisplayImages(event)"
          :key="index"
          class="image-item"
          @click="openLightbox(event, index)"
          @mouseenter="loadExif($event, event.folder, image)"
          @mouseleave="hideExif"
        >
          <img
            :src="getImagePath(event.folder, image)"
            :alt="`${event.name} - Photo ${index + 1}`"
            loading="lazy"
            class="gallery-image"
            :ref="el => { if (el) imageRefs.set(getImagePath(event.folder, image), el) }"
          />
          <div class="image-overlay">
            <span class="zoom-icon">🔍</span>
          </div>
          <div v-if="exifData.visible && exifData.imagePath === getImagePath(event.folder, image)" 
               class="exif-tooltip">
            <div v-if="exifData.loading" class="exif-loading">Loading EXIF...</div>
            <div v-else-if="exifData.data" class="exif-content">
              <div v-if="exifData.data.camera" class="exif-item">
                📷 {{ exifData.data.camera }}
              </div>
              <div v-if="exifData.data.lens" class="exif-item">
                🔍 {{ exifData.data.lens }}
              </div>
              <div v-if="exifData.data.settings" class="exif-item">
                ⚙️ {{ exifData.data.settings }}
              </div>
              <div v-if="exifData.data.date" class="exif-item">
                📅 {{ exifData.data.date }}
              </div>
            </div>
            <div v-else class="exif-no-data">No EXIF data available</div>
          </div>
        </div>
      </div>

      <!-- View Full Album Button -->
      <div v-if="shouldShowAlbumLink(event)" class="album-link-container">
        <a 
          v-if="event.albumUrl"
          :href="event.albumUrl" 
          target="_blank" 
          rel="noopener noreferrer"
          class="album-link"
        >
          View Full Album ({{ event.images.length }} photos) →
        </a>
        <div v-else class="album-info">
          Showing {{ getDisplayImages(event).length }} of {{ event.images.length }} photos
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <div v-if="lightbox.open" class="lightbox" @click="closeLightbox">
      <button class="lightbox-close" @click="closeLightbox">&times;</button>
      <button 
        class="lightbox-nav lightbox-prev" 
        @click.stop="prevImage"
        v-if="lightbox.images.length > 1"
      >
        &#8249;
      </button>
      <div class="lightbox-content" @click.stop>
        <img
          :src="lightbox.currentImage"
          :alt="`${lightbox.eventName} - Photo ${lightbox.currentIndex + 1}`"
          class="lightbox-image"
        />
        <div class="lightbox-info">
          <h3>{{ lightbox.eventName }}</h3>
          <p>{{ lightbox.currentIndex + 1 }} / {{ lightbox.images.length }}</p>
        </div>
      </div>
      <button 
        class="lightbox-nav lightbox-next" 
        @click.stop="nextImage"
        v-if="lightbox.images.length > 1"
      >
        &#8250;
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import ExifReader from 'exifreader'

const props = defineProps({
  events: {
    type: Array,
    default: () => []
  },
  maxImages: {
    type: Number,
    default: 6
  }
})

const lightbox = ref({
  open: false,
  currentIndex: 0,
  currentImage: '',
  eventName: '',
  images: []
})

const exifData = ref({
  visible: false,
  loading: false,
  imagePath: '',
  data: null
})

const imageRefs = ref(new Map())

const getImagePath = (folder, image) => {
  return `/imgs/${folder}/${image}`
}

const getDisplayImages = (event) => {
  const max = event.maxImages || props.maxImages
  return event.images.slice(0, max)
}

const shouldShowAlbumLink = (event) => {
  const max = event.maxImages || props.maxImages
  return event.images.length > max
}

const formatDate = (date) => {
  if (!date) return '';
  
  // Handle date ranges (e.g., "2025-11-30 to 2025-12-01" or object with start/end)
  if (typeof date === 'object' && (date.start || date.end)) {
    const startFormatted = formatSingleDate(date.start, date.format);
    const endFormatted = formatSingleDate(date.end, date.format);
    
    if (date.start && date.end) {
      return `${startFormatted} - ${endFormatted}`;
    }
    return startFormatted || endFormatted;
  }
  
  // Handle string dates (could be range or single)
  if (typeof date === 'string') {
    // Check if it's a range
    if (date.includes(' to ') || date.includes(' - ')) {
      const separator = date.includes(' to ') ? ' to ' : ' - ';
      const [start, end] = date.split(separator).map(d => d.trim());
      return `${formatSingleDate(start)} - ${formatSingleDate(end)}`;
    }
    
    return formatSingleDate(date);
  }
  
  return '';
}

const formatSingleDate = (dateString, format) => {
  if (!dateString) return '';
  
  try {
    // Parse the date string
    const parts = dateString.split('-');
    
    // Determine format based on parts length or explicit format
    if (format === 'year' || parts.length === 1) {
      // Year only (e.g., "2025")
      return parts[0];
    } else if (format === 'year-month' || parts.length === 2) {
      // Year-month (e.g., "2025-11" -> "November 2025")
      const date = new Date(`${parts[0]}-${parts[1]}-01`);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long'
      });
    } else {
      // Full date (e.g., "2025-11-30" -> "November 30, 2025")
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return dateString;
  }
}

const loadExif = async (event, folder, image) => {
  const imagePath = getImagePath(folder, image)
  exifData.value = {
    visible: true,
    loading: true,
    imagePath,
    data: null
  }

  const imgElement = imageRefs.value.get(imagePath)
  if (!imgElement) {
    exifData.value.loading = false
    return
  }

  try {
    // Load EXIF data using ExifReader
    // ExifReader.load() supports URLs in browser context and will reuse cached images
    // See: https://github.com/mattiasw/ExifReader#let-exifreader-load-the-file-asynchronous-api
    const tags = await ExifReader.load(imgElement.src)
    
    const make = tags.Make?.description
    const model = tags.Model?.description
    const lens = tags.LensModel?.description
    const focalLength = tags.FocalLength?.description
    const fNumber = tags.FNumber?.description
    const iso = tags.ISOSpeedRatings?.description
    const exposureTime = tags.ExposureTime?.description
    const dateTime = tags.DateTimeOriginal?.description

    const hasData = make || model || lens || focalLength || fNumber || iso || exposureTime || dateTime

    if (hasData) {
      const data = {}
      
      if (make && model) {
        data.camera = `${make} ${model}`.trim()
      } else if (model) {
        data.camera = model
      }

      if (lens) {
        data.lens = lens
      }

      const settings = []
      if (focalLength) {
        // focalLength is already formatted as "50 mm" by ExifReader
        settings.push(focalLength.replace(' mm', 'mm'))
      }
      if (fNumber) {
        // fNumber is already formatted as "f/2.8" by ExifReader
        settings.push(fNumber)
      }
      if (exposureTime) {
        // exposureTime is already formatted like "1/100" by ExifReader
        settings.push(`${exposureTime}s`)
      }
      if (iso) {
        settings.push(`ISO ${iso}`)
      }
      if (settings.length > 0) {
        data.settings = settings.join(' · ')
      }

      if (dateTime) {
        data.date = dateTime
      }

      exifData.value = {
        ...exifData.value,
        loading: false,
        data
      }
    } else {
      exifData.value.loading = false
    }
  } catch (error) {
    console.error('Error reading EXIF data:', error)
    exifData.value.loading = false
  }
}

const hideExif = () => {
  exifData.value.visible = false
}

const openLightbox = (event, index) => {
  const displayImages = getDisplayImages(event)
  lightbox.value = {
    open: true,
    currentIndex: index,
    currentImage: getImagePath(event.folder, displayImages[index]),
    eventName: event.name,
    images: displayImages.map(img => getImagePath(event.folder, img))
  }
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightbox.value.open = false
  document.body.style.overflow = 'auto'
}

const nextImage = () => {
  lightbox.value.currentIndex = (lightbox.value.currentIndex + 1) % lightbox.value.images.length
  lightbox.value.currentImage = lightbox.value.images[lightbox.value.currentIndex]
}

const prevImage = () => {
  lightbox.value.currentIndex = 
    (lightbox.value.currentIndex - 1 + lightbox.value.images.length) % lightbox.value.images.length
  lightbox.value.currentImage = lightbox.value.images[lightbox.value.currentIndex]
}
</script>

<style scoped>
.event-gallery {
  width: 100%;
}

.event-section {
  margin-bottom: 5rem;
  animation: fadeIn 0.6s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.event-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #1a1a1a;
}

.event-name {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #ffffff;
  letter-spacing: -0.01em;
}

.event-meta {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.event-date,
.event-location {
  font-size: 1rem;
  color: #999999;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.event-description {
  font-size: 1.1rem;
  color: #cccccc;
  line-height: 1.6;
  margin-top: 1rem;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.image-item {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  background-color: #0a0a0a;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.image-item:hover .gallery-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-item:hover .image-overlay {
  opacity: 1;
}

.zoom-icon {
  font-size: 2rem;
  color: #ffffff;
}

/* EXIF Tooltip */
.exif-tooltip {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  color: #ffffff;
  padding: 0.75rem;
  font-size: 0.75rem;
  line-height: 1.4;
  z-index: 10;
  backdrop-filter: blur(10px);
}

.exif-loading,
.exif-no-data {
  color: #999999;
  font-style: italic;
}

.exif-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.exif-item {
  color: #cccccc;
}

/* Album Link */
.album-link-container {
  margin-top: 2rem;
  text-align: center;
}

.album-link {
  display: inline-block;
  padding: 0.75rem 2rem;
  background-color: #1a1a1a;
  color: #ffffff;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid #2a2a2a;
}

.album-link:hover {
  background-color: #2a2a2a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
}

.album-info {
  color: #999999;
  font-size: 0.9rem;
  font-style: italic;
}

/* Lightbox */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.lightbox-content {
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lightbox-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 4px;
}

.lightbox-info {
  margin-top: 1rem;
  text-align: center;
  color: #ffffff;
}

.lightbox-info h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.lightbox-info p {
  color: #999999;
  font-size: 0.9rem;
}

.lightbox-close {
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 3rem;
  cursor: pointer;
  z-index: 1001;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
}

.lightbox-close:hover {
  opacity: 0.7;
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #ffffff;
  font-size: 3rem;
  cursor: pointer;
  padding: 1rem 1.5rem;
  transition: background 0.3s ease;
  z-index: 1001;
}

.lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.2);
}

.lightbox-prev {
  left: 2rem;
}

.lightbox-next {
  right: 2rem;
}

@media (max-width: 768px) {
  .event-name {
    font-size: 2rem;
  }

  .event-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .exif-tooltip {
    font-size: 0.65rem;
    padding: 0.5rem;
  }

  .lightbox-nav {
    padding: 0.5rem 1rem;
    font-size: 2rem;
  }

  .lightbox-prev {
    left: 0.5rem;
  }

  .lightbox-next {
    right: 0.5rem;
  }

  .lightbox-close {
    top: 1rem;
    right: 1rem;
    font-size: 2rem;
  }
}
</style>
