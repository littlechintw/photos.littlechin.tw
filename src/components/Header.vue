<template>
  <header class="header">
    <div class="header-content">
      <h1 class="header-name">{{ info.name }}</h1>
      <nav class="header-links" v-if="info.links && info.links.length">
        <a
          v-for="link in info.links"
          :key="link.name"
          :href="link.url"
          :title="link.name"
          target="_blank"
          rel="noopener noreferrer"
          class="link-item"
        >
          <span class="link-icon">{{ getIcon(link.icon) }}</span>
        </a>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  info: {
    type: Object,
    default: () => ({
      name: '',
      links: []
    })
  }
})

const getIcon = (iconName) => {
  const icons = {
    instagram: '📷',
    email: '✉️',
    website: '🌐',
    twitter: '🐦',
    facebook: '👤',
    linkedin: '💼',
    github: '💻'
  }
  return icons[iconName?.toLowerCase()] || '🔗'
}
</script>

<style scoped>
.header {
  padding: 2rem 2rem 1.5rem;
  background: #000000;
  border-bottom: 1px solid #1a1a1a;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-name {
  font-size: 1.8rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #ffffff;
}

.header-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.link-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #1a1a1a;
  border-radius: 50%;
  transition: all 0.3s ease;
  border: 1px solid #2a2a2a;
}

.link-item:hover {
  background-color: #2a2a2a;
  transform: scale(1.1);
  opacity: 1;
}

.link-icon {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .header {
    padding: 1.5rem 1rem;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .header-name {
    font-size: 1.5rem;
  }

  .link-item {
    width: 36px;
    height: 36px;
  }
}
</style>
