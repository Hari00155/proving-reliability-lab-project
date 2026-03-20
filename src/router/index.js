import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import EnvironmentView from '@/views/EnvironmentView.vue'
import StudentFormView from '@/views/StudentFormView.vue'
import DepartFormView from '@/views/DepartmentFormView.vue'
import ListView from '@/views/ListView.vue'
import UpdateStudentFormView from '@/views/students/UpdateStudentFormView.vue'
import UpdateStaffFormView from '@/views/staffs/UpdateStaffFormView.vue'
import UpdateDepartmentFormView from '@/views/departments/UpdateDepartmentFormView.vue'
import BlogView from '@/views/BlogView.vue'
import ContactView from '@/views/ContactView.vue'
import UserManualView from '@/views/UserManualView.vue'

// route config
const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/about', name: 'about', component: AboutView },
  { path: '/Environment', name: 'Environment-view', component: EnvironmentView },
  { path: '/student-form', name: 'student-form', component: StudentFormView },
  { path: '/Department-form', name: 'Department-form', component: DepartFormView },
  { path: '/List-form', name: 'List-form', component: ListView },
  { path: '/students/update', name: 'Update Student Form', component: UpdateStudentFormView },
  { path: '/staffs/update', name: 'Update Staff Form', component: UpdateStaffFormView },
  {path: '/departments/update',name: 'Update Department Form', component: UpdateDepartmentFormView, },
  { path: '/Blog', name: 'Blog', component: BlogView },
  { path: '/Contact', name: 'Contact', component: ContactView },
  {path: '/UserManual', name:'Usermanual', component: UserManualView}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
