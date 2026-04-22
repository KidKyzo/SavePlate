<script setup>
import { ref, computed } from 'vue'
import AppLayout from '@/components/Layout/AppLayout.vue'

const emit = defineEmits(['navigate'])

// ── Week navigation ──
const weekOffset    = ref(0)
const selectedDayIdx = ref(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1) // Mon=0

const weekDays = computed(() => {
  const today = new Date()
  const mon = new Date(today)
  mon.setDate(today.getDate() - ((today.getDay() + 6) % 7) + weekOffset.value * 7)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon)
    d.setDate(mon.getDate() + i)
    return {
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      iso:  d.toISOString().slice(0, 10),
      isToday: d.toDateString() === today.toDateString(),
    }
  })
})

const weekLabel = computed(() => {
  const days = weekDays.value
  return `${days[0].date} – ${days[6].date}`
})

const SLOTS = ['Breakfast', 'Lunch', 'Dinner']

// ── Meal plan (keyed by "iso-slot") ──
const mealPlan = ref({
  [`${weekDays.value[0].iso}-Breakfast`]: [{ name: 'Avocado Toast', ingredient: 'Bread, Avocado' }],
  [`${weekDays.value[1].iso}-Lunch`]:     [{ name: 'Spinach Salad', ingredient: 'Spinach' }],
  [`${weekDays.value[2].iso}-Dinner`]:    [{ name: 'Pasta Pomodoro', ingredient: 'Tomatoes, Pasta' }],
})

const isPlanConfirmed = ref(false)
const confirmToast    = ref(false)

function getMeals(dayIso, slot) {
  return mealPlan.value[`${dayIso}-${slot}`] || []
}

// ── Inventory panel (sorted by expiry urgency) ──
const inventory = ref([
  { id: 1, name: 'Fresh Milk',    qty: '1L',    daysLeft: 1, category: 'Dairy'    },
  { id: 2, name: 'Spinach',       qty: '200g',  daysLeft: 2, category: 'Veggies'  },
  { id: 3, name: 'Greek Yogurt',  qty: '500g',  daysLeft: 3, category: 'Dairy'    },
  { id: 4, name: 'Tomatoes',      qty: '4 pcs', daysLeft: 4, category: 'Veggies'  },
  { id: 5, name: 'Chicken Thigh', qty: '300g',  daysLeft: 5, category: 'Protein'  },
  { id: 6, name: 'Brown Rice',    qty: '500g',  daysLeft: 7, category: 'Grains'   },
  { id: 7, name: 'Cheddar',       qty: '150g',  daysLeft: 9, category: 'Dairy'    },
])

function urgencyColor(days) {
  if (days <= 2) return { color: '#ef4444', bg: '#fef2f2' }
  if (days <= 4) return { color: '#f59e0b', bg: '#fffbeb' }
  return { color: '#22c55e', bg: '#f0fdf4' }
}

// ── Add meal modal ──
const modalOpen  = ref(false)
const modalDay   = ref(null)
const modalSlot  = ref(null)
const modalTab   = ref('manual')   // 'manual' | 'recipe'
const mealName   = ref('')
const selectedIngredients = ref([])

const recipeSuggestions = computed(() => [
  { name: 'Spinach Smoothie',    uses: ['Spinach'],               daysLeft: 2 },
  { name: 'Milk Oatmeal',        uses: ['Fresh Milk'],            daysLeft: 1 },
  { name: 'Greek Yogurt Bowl',   uses: ['Greek Yogurt'],          daysLeft: 3 },
  { name: 'Tomato Omelette',     uses: ['Tomatoes'],              daysLeft: 4 },
  { name: 'Chicken & Rice',      uses: ['Chicken Thigh', 'Brown Rice'], daysLeft: 5 },
])

function openModal(dayIso, slot) {
  modalDay.value  = dayIso
  modalSlot.value = slot
  modalTab.value  = 'manual'
  mealName.value  = ''
  selectedIngredients.value = []
  modalOpen.value = true
}

function closeModal() { modalOpen.value = false }

function toggleIngredient(name) {
  const idx = selectedIngredients.value.indexOf(name)
  if (idx === -1) selectedIngredients.value.push(name)
  else selectedIngredients.value.splice(idx, 1)
}

function addMeal() {
  const name = mealName.value.trim()
  if (!name) return
  const key = `${modalDay.value}-${modalSlot.value}`
  if (!mealPlan.value[key]) mealPlan.value[key] = []
  mealPlan.value[key].push({
    name,
    ingredient: selectedIngredients.value.join(', ') || '—',
  })
  closeModal()
}

function addRecipe(rec) {
  const key = `${modalDay.value}-${modalSlot.value}`
  if (!mealPlan.value[key]) mealPlan.value[key] = []
  mealPlan.value[key].push({ name: rec.name, ingredient: rec.uses.join(', ') })
  closeModal()
}

function addInventoryToDay(item) {
  // Quick-add to today's first empty slot
  const today = weekDays.value.find(d => d.isToday) || weekDays.value[0]
  const emptySlot = SLOTS.find(s => getMeals(today.iso, s).length === 0)
  if (!emptySlot) return
  const key = `${today.iso}-${emptySlot}`
  if (!mealPlan.value[key]) mealPlan.value[key] = []
  mealPlan.value[key].push({ name: `Meal with ${item.name}`, ingredient: item.name })
}

function removeMeal(dayIso, slot, idx) {
  const key = `${dayIso}-${slot}`
  if (mealPlan.value[key]) mealPlan.value[key].splice(idx, 1)
}

function confirmPlan() {
  isPlanConfirmed.value = true
  confirmToast.value = true
  setTimeout(() => { confirmToast.value = false }, 3500)
}
</script>

<template>
  <AppLayout current-page="meal-planner" :unread-count="5" user-name="Adrienne Kayana" @navigate="emit('navigate', $event)">

    <div class="planner-page">

      <!-- ── Page Header ── -->
      <div class="planner-header">
        <div class="header-top">
          <div>
            <h1>Meal Planner</h1>
            <p class="planner-sub">Plan meals · reduce waste</p>
          </div>
          <button class="btn-confirm" :class="{ confirmed: isPlanConfirmed }" @click="confirmPlan">
            {{ isPlanConfirmed ? '✓ Confirmed' : 'Confirm Plan' }}
          </button>
        </div>
        <div class="week-nav">
          <button class="nav-arrow" @click="weekOffset--">‹</button>
          <span class="week-label">{{ weekLabel }}</span>
          <button class="nav-arrow" @click="weekOffset++">›</button>
        </div>
      </div>

      <!-- ── MOBILE: Day pill selector ── -->
      <div class="day-pills-wrap">
        <div class="day-pills">
          <button
            v-for="(day, i) in weekDays" :key="day.iso"
            class="day-pill"
            :class="{ active: selectedDayIdx === i, today: day.isToday }"
            @click="selectedDayIdx = i"
          >
            <span class="pill-name">{{ day.name }}</span>
            <span class="pill-date">{{ day.date.split(' ')[1] }}</span>
          </button>
        </div>
      </div>

      <!-- ── Main layout: calendar + inventory ── -->
      <div class="planner-body">

        <!-- DESKTOP: 7-col calendar -->
        <div class="calendar-wrap desktop-cal">
          <div class="calendar-grid">
            <div v-for="day in weekDays" :key="day.iso" class="day-col" :class="{ today: day.isToday }">
              <div class="day-header">
                <span class="day-name">{{ day.name }}</span>
                <span class="day-date" :class="{ today: day.isToday }">{{ day.date }}</span>
              </div>
              <div v-for="slot in SLOTS" :key="slot" class="slot-cell">
                <div class="slot-label">{{ slot }}</div>
                <div class="slot-meals">
                  <div v-for="(meal, idx) in getMeals(day.iso, slot)" :key="idx" class="meal-chip" :title="'Ingredients: ' + meal.ingredient">
                    <span class="meal-chip-name">{{ meal.name }}</span>
                    <button class="chip-remove" @click="removeMeal(day.iso, slot, idx)">✕</button>
                  </div>
                </div>
                <button class="add-btn" @click="openModal(day.iso, slot)">+ Add</button>
              </div>
            </div>
          </div>
        </div>

        <!-- MOBILE: Single selected day view -->
        <div class="mobile-day-view">
          <div class="mobile-day-slots">
            <div v-for="slot in SLOTS" :key="slot" class="mobile-slot">
              <div class="mobile-slot-header">
                <span class="mobile-slot-label">{{ slot }}</span>
                <button class="mobile-add-btn" @click="openModal(weekDays[selectedDayIdx].iso, slot)">
                  + Add
                </button>
              </div>
              <div class="mobile-slot-meals">
                <div v-if="getMeals(weekDays[selectedDayIdx].iso, slot).length === 0" class="mobile-empty">
                  No meal planned
                </div>
                <div
                  v-for="(meal, idx) in getMeals(weekDays[selectedDayIdx].iso, slot)"
                  :key="idx"
                  class="mobile-meal-chip"
                >
                  <div class="mobile-meal-info">
                    <span class="mobile-meal-name">{{ meal.name }}</span>
                    <span class="mobile-meal-ing">{{ meal.ingredient }}</span>
                  </div>
                  <button class="mobile-chip-remove" @click="removeMeal(weekDays[selectedDayIdx].iso, slot, idx)">✕</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Inventory sidebar -->
        <div class="inventory-panel">
          <div class="inv-head">
            <h2>🥦 Available Inventory</h2>
            <span class="inv-hint">Sorted by expiry</span>
          </div>
          <div class="inv-list">
            <div v-for="item in inventory" :key="item.id" class="inv-row">
              <div class="inv-info">
                <span class="inv-name">{{ item.name }}</span>
                <span class="inv-meta">{{ item.category }} · {{ item.qty }}</span>
              </div>
              <div class="inv-right">
                <span class="exp-chip" :style="{ background: urgencyColor(item.daysLeft).bg, color: urgencyColor(item.daysLeft).color }">
                  {{ item.daysLeft }}d
                </span>
                <button class="inv-add-btn" @click="addInventoryToDay(item)" title="Quick-add to today">＋</button>
              </div>
            </div>
          </div>
          <p class="inv-tip">💡 Items with fewer days left are shown first. Tap ＋ to quick-add to today.</p>
        </div>

      </div>
    </div>

    <!-- ── Add Meal Modal ── -->
    <Teleport to="body">
      <div v-if="modalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-card">
          <div class="modal-head">
            <div>
              <h2>Add Meal</h2>
              <p class="modal-sub">
                {{ weekDays.find(d => d.iso === modalDay)?.name }},
                {{ weekDays.find(d => d.iso === modalDay)?.date }} · {{ modalSlot }}
              </p>
            </div>
            <button class="modal-close" @click="closeModal">✕</button>
          </div>
          <div class="modal-tabs">
            <button class="modal-tab" :class="{ active: modalTab === 'manual' }" @click="modalTab = 'manual'">✏️ Manual</button>
            <button class="modal-tab" :class="{ active: modalTab === 'recipe' }" @click="modalTab = 'recipe'">🍳 Suggestions</button>
          </div>
          <div v-if="modalTab === 'manual'" class="modal-body">
            <div class="field">
              <label for="meal-name">Meal Name</label>
              <input id="meal-name" v-model="mealName" type="text" placeholder="e.g. Spinach Omelette" @keydown.enter="addMeal" />
            </div>
            <div class="field">
              <label>Ingredients from Inventory</label>
              <div class="ingredient-chips">
                <button v-for="item in inventory" :key="item.id" class="ing-chip" :class="{ selected: selectedIngredients.includes(item.name) }" @click="toggleIngredient(item.name)">
                  {{ item.name }}
                  <span class="ing-dot" :style="{ background: urgencyColor(item.daysLeft).color }"></span>
                </button>
              </div>
            </div>
            <button class="btn-add-meal" :disabled="!mealName.trim()" @click="addMeal">Add to Plan</button>
          </div>
          <div v-if="modalTab === 'recipe'" class="modal-body">
            <p class="recipe-hint">Based on your inventory, sorted by soonest expiry:</p>
            <div class="recipe-list">
              <div v-for="rec in recipeSuggestions" :key="rec.name" class="recipe-card" @click="addRecipe(rec)">
                <div class="recipe-icon">🍳</div>
                <div class="recipe-info">
                  <div class="recipe-name">{{ rec.name }}</div>
                  <div class="recipe-uses">Uses: {{ rec.uses.join(', ') }}</div>
                </div>
                <div class="recipe-urgency" :style="{ color: urgencyColor(rec.daysLeft).color }">{{ rec.daysLeft }}d left</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <Transition name="toast">
        <div v-if="confirmToast" class="toast">
          ✅ Meal plan confirmed! Items reserved and reminders scheduled.
        </div>
      </Transition>
    </Teleport>

  </AppLayout>
</template>

<style scoped>
.planner-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 1.75rem 1.5rem;
  gap: 1.25rem;
}

/* ── Header ── */
.planner-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.planner-header h1 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a1a1a;
  background: none;
  -webkit-text-fill-color: unset;
}

.planner-sub { font-size: 0.82rem; color: #9aaa9a; margin-top: 4px; }

.header-right { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }

.week-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #e8ede8;
  border-radius: 10px;
  padding: 6px 10px;
}

.nav-arrow {
  background: none; border: none; font-size: 1.1rem; cursor: pointer;
  color: #5a6a5a; width: 24px; display: flex; align-items: center; justify-content: center;
  transition: color 0.15s;
}
.nav-arrow:hover { color: #2da12b; }

.week-label { font-size: 0.82rem; font-weight: 700; color: #2a2a2a; min-width: 140px; text-align: center; }

.btn-confirm {
  padding: 9px 18px;
  background: linear-gradient(135deg, #2da12b, #3dc43b);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(45,161,43,0.25);
  transition: opacity 0.2s;
}
.btn-confirm:hover { opacity: 0.9; }
.btn-confirm.confirmed { background: #e8f5e9; color: #2da12b; box-shadow: none; }

/* ── Body layout ── */
.planner-body {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  flex: 1;
}

/* ── Calendar ── */
.calendar-wrap {
  flex: 1;
  min-width: 0;
  background: #fff;
  border: 1px solid #e8ede8;
  border-radius: 16px;
  overflow: hidden;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  min-width: 0;
}

.day-col {
  border-right: 1px solid #f0f4f0;
  min-width: 0;
}
.day-col:last-child { border-right: none; }
.day-col.today { background: #f6fdf6; }

.day-header {
  padding: 10px 8px;
  text-align: center;
  border-bottom: 1px solid #f0f4f0;
  background: #fafcfa;
}
.day-col.today .day-header { background: #f0faf0; }

.day-name { display: block; font-size: 0.72rem; font-weight: 700; color: #5a6a5a; text-transform: uppercase; }
.day-date {
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 600;
  color: #2a2a2a;
  margin-top: 3px;
  padding: 2px 6px;
  border-radius: 99px;
}
.day-date.today { background: #2da12b; color: #fff; }

.slot-cell {
  padding: 8px 6px;
  border-bottom: 1px solid #f0f4f0;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.slot-cell:last-child { border-bottom: none; }

.slot-label {
  font-size: 0.62rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #9aaa9a;
}

.slot-meals { display: flex; flex-direction: column; gap: 3px; flex: 1; }

.meal-chip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  background: linear-gradient(135deg, rgba(45,161,43,0.1), rgba(61,196,59,0.06));
  border: 1px solid rgba(45,161,43,0.2);
  border-radius: 6px;
  padding: 4px 6px;
  font-size: 0.7rem;
}

.meal-chip-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #1a4a1a;
  font-weight: 600;
}

.chip-remove {
  background: none; border: none; font-size: 0.6rem; cursor: pointer;
  color: #9aaa9a; flex-shrink: 0; line-height: 1;
}
.chip-remove:hover { color: #ef4444; }

.add-btn {
  background: none;
  border: 1px dashed #c8d8c8;
  border-radius: 6px;
  color: #9aaa9a;
  font-size: 0.68rem;
  font-family: 'Inter', sans-serif;
  padding: 3px 0;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
  width: 100%;
}
.add-btn:hover { border-color: #2da12b; color: #2da12b; }

/* ── Inventory panel ── */
.inventory-panel {
  width: 230px;
  flex-shrink: 0;
  background: #fff;
  border: 1px solid #e8ede8;
  border-radius: 16px;
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
}

.inv-head { display: flex; align-items: baseline; justify-content: space-between; }
.inv-head h2 { font-size: 0.88rem; font-weight: 800; color: #1a1a1a; }
.inv-hint { font-size: 0.68rem; color: #9aaa9a; }

.inv-list { display: flex; flex-direction: column; gap: 0.5rem; }

.inv-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  background: #f9fbf9;
  border-radius: 10px;
  border: 1px solid #f0f4f0;
}

.inv-info { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.inv-name { font-size: 0.8rem; font-weight: 700; color: #1a1a1a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.inv-meta { font-size: 0.68rem; color: #9aaa9a; }

.inv-right { display: flex; align-items: center; gap: 5px; flex-shrink: 0; }

.exp-chip {
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 99px;
}

.inv-add-btn {
  background: none; border: 1px solid #e0e8e0; border-radius: 6px;
  font-size: 0.9rem; cursor: pointer; width: 24px; height: 24px;
  display: flex; align-items: center; justify-content: center; color: #5a6a5a;
  transition: border-color 0.15s, color 0.15s;
}
.inv-add-btn:hover { border-color: #2da12b; color: #2da12b; }

.inv-tip { font-size: 0.72rem; color: #9aaa9a; line-height: 1.5; border-top: 1px solid #f0f4f0; padding-top: 0.75rem; }

/* ── Add Meal Modal ── */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 1rem;
}

.modal-card {
  background: #fff;
  border-radius: 20px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.18);
  overflow: hidden;
}

.modal-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 0;
}
.modal-head h2 { font-size: 1.1rem; font-weight: 800; color: #1a1a1a; }
.modal-sub { font-size: 0.78rem; color: #9aaa9a; margin-top: 3px; }

.modal-close {
  background: none; border: none; font-size: 1rem; cursor: pointer;
  color: #9aaa9a; width: 30px; height: 30px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}
.modal-close:hover { background: #f0f4f0; }

.modal-tabs {
  display: flex;
  padding: 1rem 1.5rem 0;
  gap: 0;
  border-bottom: 1px solid #e8ede8;
}

.modal-tab {
  padding: 8px 16px;
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  color: #7a8a7a;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}
.modal-tab.active { color: #2da12b; border-bottom-color: #2da12b; }

.modal-body { padding: 1.25rem 1.5rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; }

.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: 0.82rem; font-weight: 700; color: #4a5a4a; }
.field input {
  padding: 11px 14px;
  border: 1.5px solid #e0e8e0;
  border-radius: 10px;
  background: #f3f6f3;
  font-size: 0.9rem;
  font-family: 'Inter', sans-serif;
  color: #1a1a1a;
  outline: none;
  transition: border-color 0.2s;
}
.field input:focus { border-color: #2da12b; background: #fff; }

.ingredient-chips { display: flex; flex-wrap: wrap; gap: 6px; }

.ing-chip {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border: 1.5px solid #e0e8e0;
  border-radius: 99px;
  background: #f9fbf9;
  font-size: 0.78rem;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  color: #4a5a4a;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.ing-chip.selected { border-color: #2da12b; background: rgba(45,161,43,0.08); color: #2da12b; }

.ing-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

.btn-add-meal {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #2da12b, #3dc43b);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(45,161,43,0.28);
  transition: opacity 0.2s;
}
.btn-add-meal:hover:not(:disabled) { opacity: 0.9; }
.btn-add-meal:disabled { opacity: 0.45; cursor: not-allowed; }

/* Recipe suggestions */
.recipe-hint { font-size: 0.78rem; color: #9aaa9a; }

.recipe-list { display: flex; flex-direction: column; gap: 0.5rem; }

.recipe-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1.5px solid #e8ede8;
  border-radius: 12px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.15s;
}
.recipe-card:hover { border-color: #2da12b; background: rgba(45,161,43,0.04); }

.recipe-icon { font-size: 1.3rem; }
.recipe-info { flex: 1; }
.recipe-name { font-size: 0.88rem; font-weight: 700; color: #1a1a1a; }
.recipe-uses { font-size: 0.73rem; color: #9aaa9a; margin-top: 2px; }
.recipe-urgency { font-size: 0.75rem; font-weight: 700; flex-shrink: 0; }

/* ── Toast ── */
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: #1a3a1a;
  color: #fff;
  padding: 14px 22px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
  z-index: 2000;
  max-width: 90vw;
  text-align: center;
}
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(20px); }

/* ── Responsive ── */
@media (max-width: 1100px) {
  .inventory-panel { width: 190px; }
}

/* Mobile — day pills show, desktop cal hidden */
.day-pills-wrap  { display: none; }
.mobile-day-view { display: none; }

@media (max-width: 860px) {
  .planner-page  { padding: 0.9rem; gap: 0.85rem; }

  /* Header: stack vertically, full-width confirm */
  .planner-header { gap: 0.6rem; }
  .header-top {
    display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75rem;
  }
  .planner-header h1   { font-size: 1.2rem; }
  .planner-sub         { font-size: 0.72rem; }
  .btn-confirm         { padding: 10px 14px; font-size: 0.82rem; white-space: nowrap; }
  .week-nav            { width: 100%; justify-content: center; }
  .week-label          { min-width: 0; flex: 1; }

  /* Show day pills */
  .day-pills-wrap {
    display: block;
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
    margin: 0 -0.9rem;
    padding: 0 0.9rem;
  }
  .day-pills-wrap::-webkit-scrollbar { display: none; }
  .day-pills {
    display: flex;
    gap: 0.5rem;
    padding-bottom: 2px;
    width: 100%;
    justify-content: center;
  }
  .day-pill {
    display: flex; flex-direction: column; align-items: center;
    padding: 8px 14px;
    border: 1.5px solid #e8ede8; border-radius: 12px;
    background: #fff; cursor: pointer; font-family: 'Inter', sans-serif;
    transition: border-color 0.15s, background 0.15s; gap: 2px; min-width: 54px;
  }
  .day-pill.active  { border-color: #2da12b; background: rgba(45,161,43,0.06); }
  .day-pill.today   { border-color: #2da12b; }
  .pill-name { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: #7a8a7a; }
  .pill-date { font-size: 0.8rem; font-weight: 700; color: #1a1a1a; }
  .day-pill.active .pill-name,
  .day-pill.active .pill-date,
  .day-pill.today  .pill-date { color: #2da12b; }

  /* Body layout */
  .planner-body { flex-direction: column; }

  /* Hide desktop calendar */
  .desktop-cal { display: none; }

  /* Show mobile single-day view */
  .mobile-day-view {
    display: block;
    background: #fff;
    border: 1px solid #e8ede8;
    border-radius: 16px;
    overflow: hidden;
    width: 100%;
  }

  .mobile-slot {
    padding: 1rem;
    border-bottom: 1px solid #f0f4f0;
  }
  .mobile-slot:last-child { border-bottom: none; }

  .mobile-slot-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 0.6rem;
  }
  .mobile-slot-label {
    font-size: 0.78rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.06em; color: #5a6a5a;
  }
  .mobile-add-btn {
    padding: 7px 14px;
    background: rgba(45,161,43,0.08); color: #2da12b;
    border: 1.5px dashed #2da12b; border-radius: 8px;
    font-size: 0.8rem; font-weight: 700; font-family: 'Inter', sans-serif;
    cursor: pointer; min-height: 36px;
  }

  .mobile-slot-meals { display: flex; flex-direction: column; gap: 0.4rem; }
  .mobile-empty { font-size: 0.78rem; color: #b0c0b0; font-style: italic; padding: 4px 0; }

  .mobile-meal-chip {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 12px;
    background: linear-gradient(135deg, rgba(45,161,43,0.07), rgba(61,196,59,0.04));
    border: 1px solid rgba(45,161,43,0.18);
    border-radius: 10px;
    gap: 8px;
  }
  .mobile-meal-info { display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0; }
  .mobile-meal-name { font-size: 0.88rem; font-weight: 700; color: #1a2a1a; }
  .mobile-meal-ing  { font-size: 0.7rem; color: #9aaa9a; }
  .mobile-chip-remove {
    background: none; border: none; color: #c0ccc0; cursor: pointer;
    font-size: 0.85rem; width: 28px; height: 28px; border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: color 0.15s, background 0.15s;
  }
  .mobile-chip-remove:hover { color: #ef4444; background: #fef2f2; }

  /* Inventory full width */
  .inventory-panel { width: 100%; max-height: none; }
  .inv-add-btn { width: 36px; height: 36px; font-size: 1.1rem; border-radius: 8px; }

  /* Toast above bottom tab bar */
  .toast { bottom: 80px; }

  /* Modal full bottom sheet on mobile */
  .modal-overlay { align-items: flex-end; padding: 0; }
  .modal-card {
    border-radius: 20px 20px 0 0;
    max-width: 100%;
    max-height: 85vh;
    overflow-y: auto;
  }
}
</style>
