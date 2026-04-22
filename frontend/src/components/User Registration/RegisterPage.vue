<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['go-login', 'register-success'])

const fullName    = ref('')
const email       = ref('')
const password    = ref('')
const confirmPass = ref('')
const showPass    = ref(false)
const showConfirm = ref(false)
const isLoading   = ref(false)

// Password strength
const passwordStrength = computed(() => {
  const p = password.value
  if (!p) return 0
  let score = 0
  if (p.length >= 8)           score++
  if (/[A-Z]/.test(p))        score++
  if (/[0-9]/.test(p))        score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return score
})

const strengthLabel = computed(() => ['', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength.value])
const strengthColor = computed(() => ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e'][passwordStrength.value])

const passwordsMatch = computed(() =>
  confirmPass.value === '' || password.value === confirmPass.value
)

const formValid = computed(() =>
  fullName.value.trim() !== '' &&
  email.value.trim() !== '' &&
  password.value.length >= 8 &&
  passwordsMatch.value
)

const handleRegister = async () => {
  if (!formValid.value) return
  isLoading.value = true
  await new Promise((r) => setTimeout(r, 1800))
  isLoading.value = false
  // TODO: call register API — emitting success for prototype demo
  emit('register-success')
}
</script>


<template>
  <div class="page">

    <!-- LEFT PANEL -->
    <div class="panel-left">
      <div class="panel-content">
        <div class="badge">🌱 Join the Movement</div>
        <h1>Start saving<br />food today.</h1>
        <p>Create your free account and become part of a community fighting food waste — one plate at a time.</p>

        <ul class="steps-list">
          <li>
            <span class="step-num">01</span>
            <div>
              <strong>Create your account</strong>
              <span>Set up your profile in under a minute</span>
            </div>
          </li>
          <li>
            <span class="step-num">02</span>
            <div>
              <strong>Find surplus food</strong>
              <span>Discover restaurants offering rescue meals</span>
            </div>
          </li>
          <li>
            <span class="step-num">03</span>
            <div>
              <strong>Make an impact</strong>
              <span>Track how much food & CO₂ you've saved</span>
            </div>
          </li>
        </ul>

        <div class="stats">
          <div class="stat">
            <strong>12,480+</strong>
            <span>Meals Saved</span>
          </div>
          <div class="stat">
            <strong>3.2 tons</strong>
            <span>CO₂ Reduced</span>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT PANEL -->
    <div class="panel-right">
      <div class="form-card">

        <div class="logo">
          <img src="@/assets/Save Plate Logo.png" width="180" height="67" alt="SavePlate Logo" />
        </div>

        <h2>Create an account</h2>
        <p class="subtitle">Join SavePlate and start reducing food waste</p>

        <form @submit.prevent="handleRegister" novalidate>

          <!-- Full Name -->
          <div class="field">
            <label for="reg-name">Full Name</label>
            <input
              id="reg-name"
              type="text"
              v-model="fullName"
              placeholder="Your full name"
              autocomplete="name"
            />
          </div>

          <!-- Email -->
          <div class="field">
            <label for="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              v-model="email"
              placeholder="your@email.com"
              autocomplete="email"
            />
          </div>

          <!-- Password -->
          <div class="field">
            <label for="reg-password">Password</label>
            <div class="password-wrap">
              <input
                id="reg-password"
                :type="showPass ? 'text' : 'password'"
                v-model="password"
                placeholder="Min. 8 characters"
                autocomplete="new-password"
              />
              <button type="button" class="toggle-btn" @click="showPass = !showPass" :aria-label="showPass ? 'Hide password' : 'Show password'">
                <!-- Eye open -->
                <svg v-if="!showPass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <!-- Eye closed -->
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
            <!-- Strength bar -->
            <div v-if="password" class="strength-wrap">
              <div class="strength-bar">
                <div
                  class="strength-fill"
                  :style="{ width: (passwordStrength / 4 * 100) + '%', background: strengthColor }"
                ></div>
              </div>
              <span class="strength-label" :style="{ color: strengthColor }">{{ strengthLabel }}</span>
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="field">
            <label for="reg-confirm">Confirm Password</label>
            <div class="password-wrap">
              <input
                id="reg-confirm"
                :type="showConfirm ? 'text' : 'password'"
                v-model="confirmPass"
                placeholder="Repeat your password"
                autocomplete="new-password"
                :class="{ 'input-error': !passwordsMatch }"
              />
              <button type="button" class="toggle-btn" @click="showConfirm = !showConfirm" :aria-label="showConfirm ? 'Hide password' : 'Show password'">
                <!-- Eye open -->
                <svg v-if="!showConfirm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <!-- Eye closed -->
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
            <p v-if="!passwordsMatch" class="error-text">Passwords do not match</p>
          </div>

          <button type="submit" id="btn-register" class="btn-primary" :disabled="isLoading || !formValid">
            {{ isLoading ? 'Creating account...' : 'Create Account' }}
          </button>

        </form>

        <div class="divider"><span>OR</span></div>

        <button type="button" id="btn-go-login" class="btn-secondary" @click="emit('go-login')">
          Already have an account? <strong>Log in</strong>
        </button>

      </div>
    </div>

  </div>
</template>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ── Page layout ── */
.page {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  background-color: #f8fafc; /* Lighter background for the whole page */
}

/* ── Left panel ── */
.panel-left {
  flex: 1.2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: linear-gradient(135deg, #047857 0%, #15803d 100%); /* Clean, modern emerald gradient */
  color: white;
  position: relative;
  overflow: hidden;
}

/* Subtle background circles for a premium feel */
.panel-left::before, .panel-left::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
}
.panel-left::before {
  width: 500px;
  height: 500px;
  top: -150px;
  left: -150px;
}
.panel-left::after {
  width: 400px;
  height: 400px;
  bottom: -100px;
  right: -50px;
}

.panel-content {
  max-width: 440px;
  position: relative;
  z-index: 10;
}

.badge {
  display: inline-block;
  padding: 8px 16px;
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  backdrop-filter: blur(4px);
}

.panel-content h1 {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.25rem;
}

.panel-content p {
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 2.5rem;
}

/* Steps */
.steps-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
}

.steps-list li {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 12px 14px;
}

.step-num {
  min-width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.steps-list li div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.steps-list li strong {
  font-size: 0.95rem;
  font-weight: 700;
}

.steps-list li span {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
}

/* Stats */
.stats {
  display: flex;
  gap: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat strong {
  font-size: 1.4rem;
  font-weight: 800;
}

.stat span {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ── Right panel ── */
.panel-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem; /* Reduced padding from 2rem to give more vertical space */
}

.form-card {
  width: 100%;
  max-width: 440px;
  padding: 2.25rem 2.5rem; /* Reduced top/bottom padding to fit content better */
  background: #fff;
  border-radius: 24px; /* Softer, larger borders */
  box-shadow: 0 12px 32px rgba(0,0,0,0.05); /* Modern, subtle shadow */
}

.logo {
  display: flex;
  justify-content: center;
  margin-bottom: 1.25rem; /* Slightly reduced */
}

.form-card h2 {
  font-size: 1.6rem; /* Slightly smaller */
  font-weight: 800;
  color: #0f172a; /* Darker slate color */
  text-align: center;
  margin-bottom: 0.25rem;
}

.subtitle {
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 1.5rem; /* Reduced */
}

/* ── Fields ── */
.field {
  margin-bottom: 0.9rem; /* Reduced from 1.25rem to save vertical space */
}

.field label {
  display: block;
  margin-bottom: 4px; /* Reduced */
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
}

.field input,
.password-wrap input {
  width: 100%;
  padding: 12px 16px; /* Slightly reduced vertical padding */
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
  font-size: 0.95rem;
  font-family: 'Inter', sans-serif;
  color: #0f172a;
  outline: none;
  transition: all 0.2s ease;
}

.password-wrap input {
  padding-right: 48px;
}

.field input:focus,
.password-wrap input:focus {
  border-color: #10b981;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); /* Nice focus ring */
}

.input-error {
  border-color: #ef4444 !important;
}

/* ── Password with show/hide ── */
.password-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.toggle-btn {
  position: absolute;
  right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.2s, background 0.2s;
}

.toggle-btn:hover {
  color: #10b981;
  background: #f1f5f9;
}

.toggle-btn svg {
  width: 18px;
  height: 18px;
}

/* ── Strength bar ── */
.strength-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}

.strength-bar {
  flex: 1;
  height: 6px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s ease, background 0.3s ease;
}

.strength-label {
  font-size: 0.75rem;
  font-weight: 700;
  min-width: 40px;
  text-align: right;
}

/* ── Error text ── */
.error-text {
  margin-top: 6px;
  font-size: 0.8rem;
  color: #ef4444;
  font-weight: 500;
}

/* ── Buttons ── */
.btn-primary {
  width: 100%;
  padding: 14px;
  background: #10b981; /* Solid attractive green */
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
  transition: all 0.2s ease;
  margin-top: 0.5rem;
}

.btn-primary:hover:not(:disabled) {
  background: #059669; /* Darker green on hover */
  transform: translateY(-2px); /* Slight lift */
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #94a3b8;
  font-size: 0.85rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e2e8f0;
}

.divider span { padding: 0 12px; }

.btn-secondary {
  width: 100%;
  padding: 14px;
  background: #fff;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary strong { 
  color: #10b981; 
  font-weight: 600;
}

.btn-secondary:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .panel-left { display: none; }
  .page { background: #fff; }
  .panel-right { padding: 1rem; }
  .form-card { box-shadow: none; padding: 2rem 1rem; }
}
</style>
