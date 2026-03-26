import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import AdminView from '@/views/AdminView.vue'
import UserView from '@/views/UserView.vue'


// ✅ route config
const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/admin', name: 'admin', component: AdminView },
  { path: '/user', name: 'user', component: UserView },
]

// ✅ create router FIRST
const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ export AFTER creation
export default router