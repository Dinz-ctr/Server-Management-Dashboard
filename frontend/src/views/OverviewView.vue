
<script setup lang="ts">
import { computed } from 'vue'
import { Server, Activity, Cpu, Database } from 'lucide-vue-next'

import StatCard from '../components/cards/StatCard.vue'
import ResourceChart from '../components/charts/ResourceChart.vue'
import { useMetrics } from '../composables/useMetrics'

const { metrics, connectionStatus } = useMetrics()

const stats = computed(() => [
  {
    label: 'Total Servers',
    value: metrics.value ? '1' : '0',
    detail: 'Monitored hosts',
    icon: Server,
    color: 'text-blue-400',
  },
  {
    label: 'Online Servers',
    value: connectionStatus.value === 'connected' ? '1' : '0',
    detail: 'Active connections',
    icon: Activity,
    color: 'text-emerald-400',
  },
  {
    label: 'CPU Usage',
    value: metrics.value
      ? `${metrics.value.cpu.usage_percent.toFixed(1)}%`
      : '--',
    detail: 'Current utilization',
    icon: Cpu,
    color: 'text-purple-400',
  },
  {
    label: 'Memory Usage',
    value: metrics.value
      ? `${metrics.value.memory.usage_percent.toFixed(1)}%`
      : '--',
    detail: 'RAM utilization',
    icon: Database,
    color: 'text-orange-400',
  },
])
</script>

<template>
  <section class="overview-page">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white">Overview</h1>
      <p class="mt-1 text-sm text-slate-400">
        Monitor your infrastructure at a glance.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        v-for="stat in stats"
        :key="stat.label"
        :label="stat.label"
        :value="stat.value"
        :detail="stat.detail"
        :icon="stat.icon"
        :color="stat.color"
      />
    </div>

    <div class="mt-6">
      <ResourceChart />
    </div>
  </section>
</template>
