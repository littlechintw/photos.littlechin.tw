<template>
  <div class="app">
    <Header :info="portfolioData.info" />
    <main class="main-content">
      <EventGallery :events="portfolioData.events" />
    </main>
    <Footer :info="portfolioData.info" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Header from './components/Header.vue'
import EventGallery from './components/EventGallery.vue'
import Footer from './components/Footer.vue'

const portfolioData = ref({
  info: {
    name: '',
    title: '',
    description: '',
    links: []
  },
  events: []
})

onMounted(async () => {
  try {
    const response = await fetch('/data/portfolio.json')
    portfolioData.value = await response.json()
  } catch (error) {
    console.error('Failed to load portfolio data:', error)
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #000000;
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app {
  min-height: 100vh;
  background-color: #000000;
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #000000;
}

::-webkit-scrollbar-thumb {
  background: #333333;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555555;
}
</style>
