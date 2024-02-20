import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardView from '../views/DashboardView.vue'

// Furnizeaza planul pe care router il foloseste pentru a naviga prin aplicatie
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView // Cand utilizatorul navigheaza la ruta '/dashboard' aceasta va incarca componenta DashboardView
  }
];

// Instanta Vue Router care utilizeaza configuratia de mai sus pentru a gestiona navigarea in aplicatie
const router = createRouter({
  history: createWebHashHistory(),
  routes // Folosesc lista de rute definita mai sus
});

export default router
