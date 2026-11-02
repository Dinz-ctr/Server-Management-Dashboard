import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'overview',
      component: () => import('../views/OverviewView.vue'),
    },
    {
      path: '/servers',
      name: 'servers',
      component: () => import('../views/ServersView.vue'),
    },
    {
      path: '/monitoring',
      name: 'monitoring',
      component: () => import('../views/MonitoringView.vue'),
    },
    {
        path: '/alerts',
        name: 'alerts',
        component: () => import('../views/AlertsView.vue'),
    },
    {
        path: '/settings',
        name: 'settings',
        component: () => import('../views/SettingsView.vue'),
    },
    {
        path: '/terminal',
        name: 'terminal',
        component: () => import('../views/TerminalView.vue'),
    },
  ],
})

export default router