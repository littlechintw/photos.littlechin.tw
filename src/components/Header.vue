<template>
  <header class="header">
    <div class="header-content">
      <div class="header-info">
        <h1 class="header-name">{{ info.name }}</h1>
        <p class="header-title">{{ info.title }}</p>
        <p class="header-description">{{ info.description }}</p>
      </div>
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
          <span class="link-name">{{ link.name }}</span>
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
      title: '',
      description: '',
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
  padding: 4rem 2rem;
  text-align: center;
  background: linear-gradient(180deg, #000000 0%, #0a0a0a 100%);
  border-bottom: 1px solid #1a1a1a;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.header-info {
  margin-bottom: 2rem;
}

.header-name {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-title {
  font-size: 1.5rem;
  color: #999999;
  margin-bottom: 1rem;
  font-weight: 300;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.header-description {
  font-size: 1.1rem;
  color: #cccccc;
  line-height: 1.6;
  font-weight: 300;
}

.header-links {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.link-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #1a1a1a;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid #2a2a2a;
}

.link-item:hover {
  background-color: #2a2a2a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
  opacity: 1;
}

.link-icon {
  font-size: 1.2rem;
}

.link-name {
  font-size: 0.95rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .header {
    padding: 3rem 1rem;
  }

  .header-name {
    font-size: 2.5rem;
  }

  .header-title {
    font-size: 1.2rem;
  }

  .header-description {
    font-size: 1rem;
  }

  .header-links {
    gap: 1rem;
  }

  .link-item {
    padding: 0.6rem 1.2rem;
  }
}
</style>
