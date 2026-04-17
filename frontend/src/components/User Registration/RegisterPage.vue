<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['go-login'])

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
  // TODO: call register API
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
}

/* ── Left panel ── */
.panel-left {
  flex: 1.3;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: linear-gradient(155deg, #0b3a0c 0%, #1b7320 50%, #29a830 100%);
  color: white;
}

.panel-content {
  max-width: 420px;
}

.badge {
  display: inline-block;
  padding: 6px 16px;
  margin-bottom: 1.75rem;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.panel-content h1 {
  font-size: 2.8rem;
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin-bottom: 1rem;
}

.panel-content p {
  font-size: 0.95rem;
  line-height: 1.7;
  color: rgba(255,255,255,0.7);
  margin-bottom: 2rem;
}

/* Steps */
.steps-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 2rem;
}

.steps-list li {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 10px 12px;
  border-radius: 12px;
  transition: background 0.2s;
}

.steps-list li:hover {
  background: rgba(255,255,255,0.08);
}

.step-num {
  min-width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  flex-shrink: 0;
}

.steps-list li div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.steps-list li strong {
  font-size: 0.9rem;
  font-weight: 700;
}

.steps-list li span {
  font-size: 0.78rem;
  color: rgba(255,255,255,0.55);
}

/* Stats */
.stats {
  display: flex;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255,255,255,0.12);
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat strong {
  font-size: 1.2rem;
  font-weight: 800;
}

.stat span {
  font-size: 0.72rem;
  color: rgba(255,255,255,0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ── Right panel ── */
.panel-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #f6f8f6;
  overflow-y: auto;
}

.form-card {
  width: 100%;
  max-width: 420px;
  padding: 2.5rem 2rem;
  background: #fff;
  border: 1px solid #e8ede8;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
}

.logo {
  display: flex;
  justify-content: center;
  margin-bottom: 1.25rem;
}

.form-card h2 {
  font-size: 1.55rem;
  font-weight: 800;
  color: #1a1a1a;
  text-align: center;
  margin-bottom: 0.35rem;
}

.subtitle {
  text-align: center;
  color: #7a8a7a;
  font-size: 0.88rem;
  margin-bottom: 1.75rem;
}

/* ── Fields ── */
.field {
  margin-bottom: 1rem;
}

.field label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.83rem;
  font-weight: 600;
  color: #4a5a4a;
}

.field input,
.password-wrap input {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid #e0e8e0;
  border-radius: 10px;
  background: #f3f6f3;
  font-size: 0.93rem;
  font-family: 'Inter', sans-serif;
  color: #1a1a1a;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.password-wrap input {
  padding-right: 44px;
}

.field input:focus,
.password-wrap input:focus {
  border-color: #2da12b;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(45,161,43,0.1);
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
  right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #9aaa9a;
  cursor: pointer;
  transition: color 0.2s;
}

.toggle-btn:hover {
  color: #2da12b;
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
  margin-top: 7px;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: #e8ede8;
  border-radius: 99px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.3s, background 0.3s;
}

.strength-label {
  font-size: 0.72rem;
  font-weight: 700;
  min-width: 36px;
  text-align: right;
}

/* ── Error text ── */
.error-text {
  margin-top: 5px;
  font-size: 0.78rem;
  color: #ef4444;
  font-weight: 500;
}

/* ── Buttons ── */
.btn-primary {
  width: 100%;
  padding: 13px;
  background: linear-gradient(135deg, #2da12b, #3dc43b);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.97rem;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(45,161,43,0.3);
  transition: opacity 0.2s, transform 0.15s;
  margin-top: 0.5rem;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.92;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.divider {
  display: flex;
  align-items: center;
  margin: 1.4rem 0 1.2rem;
  color: #c0ccc0;
  font-size: 0.8rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e8ede8;
}

.divider span { padding: 0 12px; }

.btn-secondary {
  width: 100%;
  padding: 12px;
  background: transparent;
  color: #4a5a4a;
  border: 1.5px solid #e0e8e0;
  border-radius: 10px;
  font-size: 0.9rem;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.btn-secondary strong { color: #2da12b; }

.btn-secondary:hover {
  border-color: #2da12b;
  background: rgba(45,161,43,0.04);
}

/* ── Responsive ── */
@media (max-width: 860px) {
  .panel-left { display: none; }
  .panel-right { background: #fff; }
}

@media (max-width: 480px) {
  .form-card { padding: 2rem 1.25rem; border-radius: 16px; }
}
</style>