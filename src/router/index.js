import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import AdminView from '@/views/AdminView.vue'
import AboutView from '@/views/AboutView.vue'
import EnvironmentView from '@/views/EnvironmentView.vue'
import AlternatorView from '@/views/AlternatorView.vue'
import WiperView from '@/views/WiperView.vue'
import StarterView from '@/views/StarterView.vue'

import UpdateStudentFormView from '@/views/students/UpdateStudentFormView.vue'
import UpdateStaffFormView from '@/views/staffs/UpdateStaffFormView.vue'
import UpdateDepartmentFormView from '@/views/departments/UpdateDepartmentFormView.vue'

import BlogView from '@/views/BlogView.vue'
import ContactView from '@/views/ContactView.vue'
import UserManualView from '@/views/UserManualView.vue'

// ✅ route config
const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/admin', name: 'admin', component: AdminView },

  { path: '/about', name: 'about', component: AboutView },
  { path: '/environment', name: 'environment', component: EnvironmentView },
  { path: '/alternator', name: 'alternator', component: AlternatorView },
  { path: '/wiper', name: 'wiper', component: WiperView },
  { path: '/starter', name: 'starter', component: StarterView },

  { path: '/students/update', name: 'update-student', component: UpdateStudentFormView },
  { path: '/staffs/update', name: 'update-staff', component: UpdateStaffFormView },
  { path: '/departments/update', name: 'update-department', component: UpdateDepartmentFormView },

  { path: '/blog', name: 'blog', component: BlogView },
  { path: '/contact', name: 'contact', component: ContactView },
  { path: '/user-manual', name: 'user-manual', component: UserManualView }
]

// ✅ create router FIRST
const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ export AFTER creation
export default router