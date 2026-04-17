<script setup>
import { ref } from 'vue'
import LoginPage    from '@/components/User Registration/LoginPage.vue'
import RegisterPage from '@/components/User Registration/RegisterPage.vue'
import Dashboard    from '@/components/Menu/Dashboard.vue'
import Notification from '@/components/Menu/Notification.vue'
import MealPlanner  from '@/components/Menu/MealPlanner.vue'

// Auth state
const isLoggedIn  = ref(false)
const currentPage = ref('dashboard')   // page shown inside the app shell

// Public routes
const authView = ref('login')  // 'login' | 'register'

function onLogin() {
  isLoggedIn.value  = true
  currentPage.value = 'dashboard'
}

function onRegister() {
  isLoggedIn.value  = true
  currentPage.value = 'dashboard'
}
</script>

<template>
  <!-- ── Authenticated app ── -->
  <template v-if="isLoggedIn">
    <Dashboard    v-if="currentPage === 'dashboard'"     @navigate="currentPage = $event" />
    <Notification v-else-if="currentPage === 'notifications'" @navigate="currentPage = $event" />
    <MealPlanner  v-else-if="currentPage === 'meal-planner'"  @navigate="currentPage = $event" />

    <!-- Placeholder shells for other pages (not in scope for Iteration 1) -->
    <div v-else class="placeholder-page">
      <h2>{{ currentPage.charAt(0).toUpperCase() + currentPage.slice(1) }}</h2>
      <p>This page is not in scope for Iteration 1.</p>
      <button @click="currentPage = 'dashboard'">← Back to Dashboard</button>
    </div>
  </template>

  <!-- ── Public auth pages ── -->
  <template v-else>
    <LoginPage
      v-if="authView === 'login'"
      @go-register="authView = 'register'"
      @login-success="onLogin"
    />
    <RegisterPage
      v-else
      @go-login="authView = 'login'"
      @register-success="onRegister"
    />
  </template>
</template>

<style scoped>
.placeholder-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 1rem;
  font-family: 'Inter', sans-serif;
  color: #4a5a4a;
}
.placeholder-page h2 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a1a1a;
  background: none;
  -webkit-text-fill-color: unset;
}
.placeholder-page button {
  padding: 10px 20px;
  background: #2da12b;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
}
</style>
