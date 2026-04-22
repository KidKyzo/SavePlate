<script setup>
import { ref } from 'vue'
import LoginPage    from '@/components/User Registration/LoginPage.vue'
import RegisterPage from '@/components/User Registration/RegisterPage.vue'
import Dashboard    from '@/components/Menu/Dashboard.vue'
import Inventory    from '@/components/Menu/Inventory.vue'
import Notification from '@/components/Menu/Notification.vue'
import MealPlanner  from '@/components/Menu/MealPlanner.vue'
import BrowseFood   from '@/components/Menu/BrowseFood.vue'
import Analytics    from '@/components/Menu/Analytics.vue'
import Settings     from '@/components/Menu/Settings.vue'
// Auth state
const isLoggedIn  = ref(false)
const currentPage = ref('dashboard')

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
  <div id="app-root">
    <!-- ── Authenticated app ── -->
    <template v-if="isLoggedIn">
    <Dashboard    v-if="currentPage === 'dashboard'"          @navigate="currentPage = $event" />
    <Inventory    v-else-if="currentPage === 'inventory'"     @navigate="currentPage = $event" />
    <Notification v-else-if="currentPage === 'notifications'" @navigate="currentPage = $event" />
    <MealPlanner  v-else-if="currentPage === 'meal-planner'"  @navigate="currentPage = $event" />
    <BrowseFood   v-else-if="currentPage === 'browse'"        @navigate="currentPage = $event" />
    <Analytics    v-else-if="currentPage === 'analytics'"     @navigate="currentPage = $event" />
    <Settings     v-else-if="currentPage === 'settings'"      @navigate="currentPage = $event" />

    <!-- Placeholder for pages not in Iteration 1 scope -->
    <div v-else class="placeholder-page">
      <div class="placeholder-card">
        <div class="ph-icon">🚧</div>
        <h2>{{ currentPage.replace(/-/g,' ') }}</h2>
        <p>This section is not in scope for Iteration 1.</p>
        <button @click="currentPage = 'dashboard'">← Back to Dashboard</button>
      </div>
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
  </div>
</template>

<style scoped>
.placeholder-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f0f4f0;
  font-family: 'Inter', sans-serif;
}
.placeholder-card {
  background: #fff;
  border: 1px solid #e8ede8;
  border-radius: 20px;
  padding: 3rem 2.5rem;
  text-align: center;
  max-width: 380px;
  width: 90%;
}
.ph-icon { font-size: 3rem; margin-bottom: 1rem; }
.placeholder-card h2 {
  font-size: 1.25rem;
  font-weight: 800;
  color: #1a1a1a;
  text-transform: capitalize;
  background: none;
  -webkit-text-fill-color: unset;
  margin-bottom: 0.5rem;
}
.placeholder-card p { font-size: 0.88rem; color: #7a8a7a; margin-bottom: 1.5rem; }
.placeholder-card button {
  padding: 11px 22px;
  background: linear-gradient(135deg, #2da12b, #3dc43b);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 4px 14px rgba(45,161,43,0.25);
}
</style>
