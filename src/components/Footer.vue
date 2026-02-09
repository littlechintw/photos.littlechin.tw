<template>
  <footer class="footer">
    <div class="footer-content">
      <p class="footer-copyright">
        &copy; {{ currentYear }} {{ info.name || 'Photography Portfolio' }}. All rights reserved.
      </p>
      <nav class="footer-links" v-if="info.links && info.links.length">
        <a
          v-for="link in info.links"
          :key="link.name"
          :href="link.url"
          :title="link.name"
          target="_blank"
          rel="noopener noreferrer"
          class="footer-link"
        >
          {{ link.name }}
        </a>
      </nav>
    </div>
  </footer>
</template>

<script setup>
import { computed, defineProps } from 'vue'

defineProps({
  info: {
    type: Object,
    default: () => ({
      name: '',
      links: []
    })
  }
})

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.footer {
  margin-top: 5rem;
  padding: 3rem 2rem;
  background: linear-gradient(0deg, #000000 0%, #0a0a0a 100%);
  border-top: 1px solid #1a1a1a;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.footer-copyright {
  color: #999999;
  font-size: 0.9rem;
}

.footer-links {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.footer-link {
  color: #cccccc;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #ffffff;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
  }

  .footer-links {
    gap: 1rem;
  }
}
</style>
