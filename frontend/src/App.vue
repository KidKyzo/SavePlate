<script setup>
import { ref } from 'vue'

const apiMessage = ref(null)
const error = ref(null)
const loading = ref(false)

const testApi = async () => {
  loading.value = true
  apiMessage.value = null
  error.value = null
  
  try {
    const response = await fetch('http://localhost:3000/api')
    if (!response.ok) throw new Error('Network response was not ok')
    const data = await response.json()
    apiMessage.value = data.message
  } catch (err) {
    error.value = err.message || 'Failed to connect to backend API'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="card">
    <h1>SavePlate</h1>
    <p>Your MEVN Stack setup is ready. Build beautiful Vue applications powered by Node.js and MongoDB.</p>
    
    <button class="btn" @click="testApi" :disabled="loading">
      {{ loading ? 'Connecting...' : 'Test Backend Connection' }}
    </button>
    
    <div v-if="apiMessage" class="api-response">
      <h3>Success</h3>
      {{ apiMessage }}
    </div>
    
    <div v-if="error" class="api-response error">
      <h3>Error</h3>
      {{ error }}
    </div>
  </div>
</template>

<style>
/* Global styles are imported via style.css inside main.js */
</style>
