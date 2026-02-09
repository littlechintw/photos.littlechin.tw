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
          <span class="link-icon" v-html="getIcon(link.icon)"></span>
          <span class="sr-only">{{ link.name }}</span>
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
    instagram:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="1"/></svg>',
    email:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M4 6.5l8 6 8-6"/></svg>',
    website:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.5 2.6 2.5 14.4 0 17"/><path d="M12 3.5c-2.5 2.6-2.5 14.4 0 17"/></svg>',
    twitter:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.8 7.6c.01.15.01.3.01.45 0 4.6-3.5 9.9-9.9 9.9-2 0-3.8-.6-5.3-1.6.28.03.56.04.85.04 1.6 0 3.1-.55 4.3-1.48a3.5 3.5 0 0 1-3.26-2.42c.2.03.4.05.62.05.3 0 .6-.04.87-.12a3.5 3.5 0 0 1-2.8-3.44v-.05c.47.26 1.01.42 1.58.44a3.5 3.5 0 0 1-1.56-2.92c0-.65.17-1.25.48-1.77a9.9 9.9 0 0 0 7.2 3.65 3.95 3.95 0 0 1-.09-.8 3.5 3.5 0 0 1 6.05-2.39 7 7 0 0 0 2.22-.85 3.5 3.5 0 0 1-1.54 1.94 7 7 0 0 0 2-.55 7.5 7.5 0 0 1-1.74 1.8z"/></svg>',
    facebook:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 8.5h2V5.5h-2c-2 0-3.5 1.6-3.5 3.6v2.4H8.5v3h2.5v6h3v-6h2.4l.6-3H14v-2.3c0-.7.4-1.2 1-1.2z"/></svg>',
    linkedin:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="9" width="4" height="11" rx="1"/><circle cx="5.5" cy="5.5" r="1.5"/><path d="M10.5 20v-7.1c0-2 1.2-3.4 3.1-3.4 1.6 0 2.4.9 2.7 1.7V20h4v-7.6c0-3.4-2-5.4-4.9-5.4-2 0-3.3 1.1-3.9 2.2V9h-4v11z"/></svg>',
    github:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5a8.5 8.5 0 0 0-2.7 16.6c.4.07.55-.16.55-.38v-1.4c-2.25.5-2.7-1.1-2.7-1.1-.37-.95-.9-1.2-.9-1.2-.72-.5.05-.49.05-.49.8.05 1.22.82 1.22.82.71 1.22 1.87.87 2.33.66.07-.52.28-.87.5-1.08-1.8-.2-3.7-.9-3.7-4.05 0-.9.32-1.62.84-2.2-.08-.2-.37-1.02.08-2.13 0 0 .68-.22 2.25.84a7.8 7.8 0 0 1 4.1 0c1.56-1.06 2.24-.84 2.24-.84.45 1.11.16 1.93.08 2.13.52.58.84 1.3.84 2.2 0 3.16-1.91 3.85-3.72 4.05.29.25.55.74.55 1.5v2.22c0 .22.14.46.56.38A8.5 8.5 0 0 0 12 3.5z"/></svg>'
  }
  return (
    icons[iconName?.toLowerCase()] ||
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5.5a6.5 6.5 0 1 0 0 13c1.9 0 3.62-.82 4.82-2.12"/><path d="M16.8 5.8h3.7v3.7"/></svg>'
  )
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
  color: #eaeaea;
}

.link-item:hover {
  background-color: #2a2a2a;
  transform: scale(1.1);
  opacity: 1;
  color: #ffffff;
}

.link-icon {
  display: inline-flex;
  width: 20px;
  height: 20px;
}

.link-icon :deep(svg) {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
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
