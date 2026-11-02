<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()

const navigation = [
  { name: 'Overview', path: '/', icon: '◈' },
  { name: 'Servers', path: '/servers', icon: '▣' },
  { name: 'Monitoring', path: '/monitoring', icon: '⌁' },
  { name: 'Terminal', path: '/terminal', icon: '›_' },
  { name: 'Databases', path: '/databases', icon: '▤' },
  { name: 'Alerts', path: '/alerts', icon: '♧' },
  { name: 'Settings', path: '/settings', icon: '⚙' },
]
</script>

<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-icon">N</div>
        <div>
          <h2>NEXUS</h2>
          <span>SERVER OPERATIONS</span>
        </div>
      </div>

      <div class="nav-label">WORKSPACE</div>

      <nav class="navigation">
        <RouterLink
          v-for="item in navigation"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: route.path === item.path }"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span>{{ item.name }}</span>
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <span class="status-dot"></span>
        <span>System Operational</span>
      </div>
    </aside>

    <main class="main-content">
      <header class="topbar">
        <div>
          <span class="breadcrumb">NEXUS / WORKSPACE</span>
        </div>
        <div class="topbar-status">
          <span class="status-dot"></span>
          Local Environment
        </div>
      </header>

      <div class="page-content">
        <RouterView />
      </div>
    </main>
  </div>
</template>