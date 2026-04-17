<script setup>
import { ref } from 'vue'
import LoginPage    from './components/User Registration/LoginPage.vue'
import RegisterPage from './components/User Registration/RegisterPage.vue'

// 'login' | 'register'
const currentPage = ref('login')
</script>

<template>
  <LoginPage
    v-if="currentPage === 'login'"
    @go-register="currentPage = 'register'"
  />
  <RegisterPage
    v-else
    @go-login="currentPage = 'login'"
  />
</template>
