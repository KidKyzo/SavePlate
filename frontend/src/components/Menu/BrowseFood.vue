<script setup>
import { ref, computed } from 'vue'
import AppLayout from '@/components/Layout/AppLayout.vue'
import { useNotifications } from '@/composables/useNotifications'
import { useToast }         from '@/composables/useToast'

const emit = defineEmits(['navigate'])

const { unreadCount } = useNotifications()
const { showToast }   = useToast()

// ── Tab state ──
const activeTab = ref('browse') // 'browse' | 'inventory'

// ── Search & filter ──
const searchQuery  = ref('')
const sortBy       = ref('expiry')  // 'expiry' | 'name' | 'distance'
const showFilter   = ref(false)

// ── Sample claimable items ──
const allItems = ref([
  {
    id: 1,
    name: 'Homemade Banana Bread',
    qty: '1 loaf',
    address: 'Jl. Sudirman No. 12, Jakarta',
    expiry: '2026-04-19',
    daysLeft: 1,
    category: 'Bakery',
    icon: '🍞',
    bg: '#fffbeb',
    claimed: false,
  },
  {
    id: 2,
    name: 'Fresh Spinach Bunch',
    qty: '300g',
    address: 'Jl. Kebon Jeruk No. 5, Jakarta',
    expiry: '2026-04-20',
    daysLeft: 2,
    category: 'Vegetables',
    icon: '🥬',
    bg: '#f0faf0',
    claimed: false,
  },
  {
    id: 3,
    name: 'Greek Yogurt',
    qty: '2 cups (500g)',
    address: 'Jl. Melawai Raya No. 8, Jakarta',
    expiry: '2026-04-21',
    daysLeft: 3,
    category: 'Dairy',
    icon: '🍶',
    bg: '#eff6ff',
    claimed: false,
  },
  {
    id: 4,
    name: 'Cooked White Rice',
    qty: '4 portions',
    address: 'Jl. Cempaka Putih No. 3, Jakarta',
    expiry: '2026-04-19',
    daysLeft: 1,
    category: 'Grains',
    icon: '🍚',
    bg: '#f9f9f9',
    claimed: false,
  },
  {
    id: 5,
    name: 'Ripe Mangoes',
    qty: '6 pieces',
    address: 'Jl. Tebet Barat No. 20, Jakarta',
    expiry: '2026-04-21',
    daysLeft: 3,
    category: 'Fruits',
    icon: '🥭',
    bg: '#fff7ed',
    claimed: false,
  },
  {
    id: 6,
    name: 'Chicken Egg (Free Range)',
    qty: '12 eggs',
    address: 'Jl. Fatmawati No. 15, Jakarta',
    expiry: '2026-04-23',
    daysLeft: 5,
    category: 'Protein',
    icon: '🥚',
    bg: '#fffbeb',
    claimed: false,
  },
])

// ── My inventory items ──
const myInventory = ref([
  {
    id: 101,
    name: 'Fresh Milk',
    qty: '1L',
    address: 'My Home',
    expiry: '2026-04-19',
    daysLeft: 1,
    category: 'Dairy',
    icon: '🥛',
    bg: '#eff6ff',
    shared: true,
  },
  {
    id: 102,
    name: 'Sourdough Bread',
    qty: '1 loaf',
    address: 'My Home',
    expiry: '2026-04-20',
    daysLeft: 2,
    category: 'Bakery',
    icon: '🍞',
    bg: '#fffbeb',
    shared: false,
  },
  {
    id: 103,
    name: 'Strawberries',
    qty: '250g',
    address: 'My Home',
    expiry: '2026-04-21',
    daysLeft: 3,
    category: 'Fruits',
    icon: '🍓',
    bg: '#fef2f2',
    shared: false,
  },
])

// ── Filtered & sorted browse items ──
const filteredItems = computed(() => {
  let items = allItems.value.filter(item =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    item.address.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
  if (sortBy.value === 'expiry') items = [...items].sort((a, b) => a.daysLeft - b.daysLeft)
  if (sortBy.value === 'name')   items = [...items].sort((a, b) => a.name.localeCompare(b.name))
  return items
})

function urgencyColor(daysLeft) {
  if (daysLeft <= 1) return '#ef4444'
  if (daysLeft <= 2) return '#f59e0b'
  return '#22c55e'
}
function urgencyLabel(daysLeft) {
  if (daysLeft <= 0) return 'Expired'
  if (daysLeft === 1) return '1 day left'
  return `${daysLeft} days left`
}

// ── Claim flow ──
const claimedId   = ref(null)
const claimingId  = ref(null)

function claimItem(item) {
  claimingId.value = item.id
  setTimeout(() => {
    item.claimed   = true
    claimedId.value  = item.id
    claimingId.value = null
    showToast(`"${item.name}" claimed successfully! 🎉`, 'success', '✅')
  }, 800)
}

// ── Share toggle (inventory tab) ──
function toggleShare(item) {
  item.shared = !item.shared
  showToast(
    item.shared ? `"${item.name}" is now shared for claiming` : `"${item.name}" removed from sharing`,
    item.shared ? 'success' : 'warning',
    item.shared ? '🤝' : '📦'
  )
}
</script>

<template>
  <AppLayout current-page="browse" :unread-count="unreadCount" user-name="Adrienne Kayana" @navigate="emit('navigate', $event)">
    <div class="browse-page">

      <!-- ── Page Header ── -->
      <div class="page-header">
        <div class="header-text">
          <h1>🔍 Browse Food</h1>
          <p class="header-sub">Discover claimable food items near you</p>
        </div>
      </div>

      <!-- ── Search & Filter ── -->
      <div class="search-filter-section">
        <h2 class="section-label">Search &amp; Filter</h2>
        <div class="search-bar-row">
          <div class="search-wrap">
            <span class="search-icon">🔍</span>
            <input
              id="browse-search"
              v-model="searchQuery"
              class="search-input"
              type="text"
              placeholder="Search food, category, or location…"
              autocomplete="off"
            />
            <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">✕</button>
          </div>
          <div class="sort-wrap">
            <label class="sort-label" for="sort-select">Sort by</label>
            <select id="sort-select" v-model="sortBy" class="sort-select">
              <option value="expiry">Expiry Date</option>
              <option value="name">Name (A–Z)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- ── Tabs ── -->
      <div class="tab-bar">
        <button
          id="tab-browse"
          class="tab-btn"
          :class="{ active: activeTab === 'browse' }"
          @click="activeTab = 'browse'"
        >
          🛒 Browse Claimable Items
          <span v-if="allItems.filter(i => !i.claimed).length > 0" class="tab-count">
            {{ allItems.filter(i => !i.claimed).length }}
          </span>
        </button>
        <button
          id="tab-inventory"
          class="tab-btn"
          :class="{ active: activeTab === 'inventory' }"
          @click="activeTab = 'inventory'"
        >
          📦 My Inventory
        </button>
      </div>

      <!-- ── BROWSE TAB ── -->
      <template v-if="activeTab === 'browse'">
        <!-- Sorting info strip -->
        <div class="sort-strip">
          <span class="sort-badge">
            {{ sortBy === 'expiry' ? '📅 Sorted by Expiry Date' : '🔤 Sorted by Name' }}
          </span>
          <span class="results-count">{{ filteredItems.length }} items found</span>
        </div>

        <!-- Empty state -->
        <div v-if="filteredItems.length === 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No items found</h3>
          <p>Try adjusting your search query.</p>
        </div>

        <!-- Food cards grid -->
        <div v-else class="food-grid">
          <div
            v-for="item in filteredItems"
            :key="item.id"
            class="food-card"
            :class="{ 'is-claimed': item.claimed }"
            :style="{ '--card-bg': item.bg }"
          >
            <!-- Card top: icon + urgency badge -->
            <div class="card-top" :style="{ background: item.bg }">
              <span class="food-icon">{{ item.icon }}</span>
              <span
                class="urgency-chip"
                :style="{
                  background: urgencyColor(item.daysLeft) + '18',
                  color: urgencyColor(item.daysLeft),
                  borderColor: urgencyColor(item.daysLeft) + '40'
                }"
              >{{ urgencyLabel(item.daysLeft) }}</span>
            </div>

            <!-- Card body -->
            <div class="card-body">
              <div class="card-category">{{ item.category }}</div>
              <h3 class="card-name">{{ item.name }}</h3>

              <div class="card-meta-list">
                <div class="card-meta-row">
                  <span class="meta-icon">📦</span>
                  <span class="meta-text">{{ item.qty }}</span>
                </div>
                <div class="card-meta-row">
                  <span class="meta-icon">📍</span>
                  <span class="meta-text address">{{ item.address }}</span>
                </div>
                <div class="card-meta-row">
                  <span class="meta-icon">📅</span>
                  <span class="meta-text">Expires {{ item.expiry }}</span>
                </div>
              </div>
            </div>

            <!-- Claim button -->
            <div class="card-footer">
              <button
                v-if="!item.claimed"
                class="claim-btn"
                :class="{ loading: claimingId === item.id }"
                :disabled="claimingId === item.id"
                @click="claimItem(item)"
              >
                <span v-if="claimingId !== item.id">✅ Claim Item</span>
                <span v-else class="btn-spinner">⏳ Claiming…</span>
              </button>
              <div v-else class="claimed-badge">
                🎉 Claimed!
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- ── INVENTORY TAB ── -->
      <template v-else>
        <div class="sort-strip">
          <span class="sort-badge">📦 Your shared food items</span>
          <span class="results-count">{{ myInventory.length }} items</span>
        </div>

        <div class="food-grid">
          <div
            v-for="item in myInventory"
            :key="item.id"
            class="food-card"
            :style="{ '--card-bg': item.bg }"
          >
            <!-- Card top: icon + sharing state -->
            <div class="card-top" :style="{ background: item.bg }">
              <span class="food-icon">{{ item.icon }}</span>
              <span
                class="urgency-chip"
                :style="{
                  background: urgencyColor(item.daysLeft) + '18',
                  color: urgencyColor(item.daysLeft),
                  borderColor: urgencyColor(item.daysLeft) + '40'
                }"
              >{{ urgencyLabel(item.daysLeft) }}</span>
            </div>

            <!-- Card body -->
            <div class="card-body">
              <div class="card-category">{{ item.category }}</div>
              <h3 class="card-name">{{ item.name }}</h3>

              <div class="card-meta-list">
                <div class="card-meta-row">
                  <span class="meta-icon">📦</span>
                  <span class="meta-text">{{ item.qty }}</span>
                </div>
                <div class="card-meta-row">
                  <span class="meta-icon">📍</span>
                  <span class="meta-text">{{ item.address }}</span>
                </div>
                <div class="card-meta-row">
                  <span class="meta-icon">📅</span>
                  <span class="meta-text">{{ item.expiry }}</span>
                </div>
              </div>
            </div>

            <!-- Share toggle -->
            <div class="card-footer">
              <button
                class="share-btn"
                :class="{ shared: item.shared }"
                @click="toggleShare(item)"
              >
                {{ item.shared ? '🤝 Shared for Claiming' : '📤 Share for Claiming' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Add item CTA -->
        <div class="add-item-cta">
          <button class="add-btn" @click="emit('navigate', 'inventory')">
            ➕ Add Item to Inventory
          </button>
        </div>
      </template>

    </div>
  </AppLayout>
</template>

<style scoped>
/* ── Page shell ── */
.browse-page {
  padding: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

/* ── Header ── */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.page-header h1 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a1a1a;
  background: none;
  -webkit-text-fill-color: unset;
  margin-bottom: 3px;
  line-height: 1.2;
}
.header-sub { font-size: 0.78rem; color: #9aaa9a; }

/* ── Search & filter section ── */
.search-filter-section { display: flex; flex-direction: column; gap: 0.6rem; }
.section-label { font-size: 1rem; font-weight: 700; color: #1a1a1a; }

.search-bar-row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-wrap {
  position: relative;
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: 12px;
  font-size: 0.9rem;
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 10px 36px 10px 36px;
  border: 1.5px solid #e8ede8;
  border-radius: 10px;
  font-size: 0.88rem;
  font-family: 'Inter', sans-serif;
  color: #1a1a1a;
  background: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}
.search-input::placeholder { color: #b0bdb0; }
.search-input:focus {
  border-color: #2da12b;
  box-shadow: 0 0 0 3px rgba(45,161,43,0.1);
}
.search-clear {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: #9aaa9a;
  cursor: pointer;
  font-size: 0.8rem;
  padding: 4px;
  line-height: 1;
}
.search-clear:hover { color: #ef4444; }

.sort-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.sort-label { font-size: 0.78rem; color: #7a8a7a; font-weight: 600; }
.sort-select {
  padding: 9px 12px;
  border: 1.5px solid #e8ede8;
  border-radius: 10px;
  font-size: 0.83rem;
  font-family: 'Inter', sans-serif;
  color: #1a1a1a;
  background: #fff;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
}
.sort-select:focus { border-color: #2da12b; }

/* ── Tab bar ── */
.tab-bar {
  display: flex;
  background: #f0f4f0;
  border-radius: 12px;
  padding: 4px;
  gap: 4px;
}
.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  border-radius: 9px;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  background: transparent;
  color: #7a8a7a;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
}
.tab-btn:hover { background: #fff; color: #2da12b; }
.tab-btn.active {
  background: #fff;
  color: #2da12b;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}
.tab-count {
  background: #2da12b;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 99px;
  min-width: 18px;
  text-align: center;
}

/* ── Sort strip ── */
.sort-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.sort-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #f0f4f0;
  color: #5a6a5a;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 99px;
  border: 1px solid #e8ede8;
}
.results-count {
  font-size: 0.75rem;
  color: #9aaa9a;
  font-weight: 500;
}

/* ── Food cards grid ── */
.food-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

/* ── Food card ── */
.food-card {
  background: #fff;
  border: 1.5px solid #e8ede8;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}
.food-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(0,0,0,0.09);
  border-color: #c8dcc8;
}
.food-card.is-claimed {
  opacity: 0.65;
  pointer-events: none;
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1rem 0.75rem;
}
.food-icon { font-size: 2rem; line-height: 1; }
.urgency-chip {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 99px;
  border: 1px solid;
  white-space: nowrap;
}

.card-body {
  padding: 0 1rem 0.75rem;
  flex: 1;
}
.card-category {
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #2da12b;
  margin-bottom: 4px;
}
.card-name {
  font-size: 1rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 0.65rem;
  line-height: 1.25;
  background: none;
  -webkit-text-fill-color: unset;
}

.card-meta-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.card-meta-row {
  display: flex;
  align-items: flex-start;
  gap: 6px;
}
.meta-icon { font-size: 0.82rem; flex-shrink: 0; line-height: 1.5; }
.meta-text {
  font-size: 0.78rem;
  color: #5a6a5a;
  line-height: 1.45;
}
.meta-text.address {
  color: #7a8a7a;
  font-style: italic;
}

/* ── Card footer ── */
.card-footer {
  padding: 0 1rem 1rem;
}
.claim-btn {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #2da12b, #3dc43b);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
  min-height: 42px;
}
.claim-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
.claim-btn.loading { opacity: 0.7; cursor: wait; }
.btn-spinner { display: flex; align-items: center; justify-content: center; gap: 4px; }

.claimed-badge {
  width: 100%;
  padding: 10px;
  background: #f0faf0;
  border: 1.5px solid #c8e6c8;
  border-radius: 10px;
  color: #2da12b;
  font-size: 0.85rem;
  font-weight: 700;
  text-align: center;
}

/* Share button (inventory tab) */
.share-btn {
  width: 100%;
  padding: 10px;
  border: 1.5px solid #e8ede8;
  border-radius: 10px;
  background: #fff;
  color: #5a6a5a;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
  min-height: 42px;
}
.share-btn:hover { border-color: #2da12b; color: #2da12b; }
.share-btn.shared {
  background: #f0faf0;
  border-color: #2da12b;
  color: #2da12b;
}

/* ── Add item CTA ── */
.add-item-cta { display: flex; justify-content: center; padding: 0.5rem 0 0; }
.add-btn {
  padding: 12px 28px;
  background: linear-gradient(135deg, #2da12b, #3dc43b);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(45,161,43,0.25);
  transition: opacity 0.2s, transform 0.15s;
}
.add-btn:hover { opacity: 0.9; transform: translateY(-1px); }

/* ── Empty state ── */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #9aaa9a;
}
.empty-icon { font-size: 3rem; margin-bottom: 0.75rem; }
.empty-state h3 { font-size: 1rem; font-weight: 700; color: #5a6a5a; margin-bottom: 0.3rem; background: none; -webkit-text-fill-color: unset; }
.empty-state p  { font-size: 0.83rem; }

/* ── Responsive ── */
@media (max-width: 860px) {
  .browse-page { padding: 1rem; gap: 0.9rem; }
  .food-grid   { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
  .tab-btn     { font-size: 0.78rem; padding: 9px 10px; }
}

@media (max-width: 540px) {
  .food-grid      { grid-template-columns: 1fr; }
  .search-bar-row { flex-direction: column; }
  .sort-wrap      { width: 100%; }
  .sort-select    { flex: 1; }
}
</style>
