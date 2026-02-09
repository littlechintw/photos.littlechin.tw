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
          v-for="(image, index) in event.images"
          :key="index"
          class="image-item"
          @click="openLightbox(event, index)"
        >
          <img
            :src="getImagePath(event.folder, image)"
            :alt="`${event.name} - Photo ${index + 1}`"
            loading="lazy"
            class="gallery-image"
          />
          <div class="image-overlay">
            <span class="zoom-icon">🔍</span>
          </div>
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

defineProps({
  events: {
    type: Array,
    default: () => []
  }
})

const lightbox = ref({
  open: false,
  currentIndex: 0,
  currentImage: '',
  eventName: '',
  images: []
})

const getImagePath = (folder, image) => {
  return `/imgs/${folder}/${image}`
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const openLightbox = (event, index) => {
  lightbox.value = {
    open: true,
    currentIndex: index,
    currentImage: getImagePath(event.folder, event.images[index]),
    eventName: event.name,
    images: event.images.map(img => getImagePath(event.folder, img))
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
