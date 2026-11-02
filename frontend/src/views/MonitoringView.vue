
<script setup lang="ts">
import { computed } from 'vue'
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Activity,
} from 'lucide-vue-next'

import { useMetrics } from '../composables/useMetrics'

const {
  metrics,
  connectionStatus,
  errorMessage,
  cpuHistory,
  memoryHistory,
  timeHistory,
  fetchMetrics,
} = useMetrics()

const resources = computed(() => {
  if (!metrics.value) return []

  return [
    {
      label: 'CPU Usage',
      value: metrics.value.cpu.usage_percent,
      detail: `${metrics.value.cpu.cores_logical} Logical Cores`,
      icon: Cpu,
      color: 'bg-blue-500',
      textColor: 'text-blue-400',
    },
    {
      label: 'Memory Usage',
      value: metrics.value.memory.usage_percent,
      detail: `${(metrics.value.memory.used / 1024 ** 3).toFixed(2)} GB Used`,
      icon: MemoryStick,
      color: 'bg-purple-500',
      textColor: 'text-purple-400',
    },
    {
      label: 'Disk Usage',
      value: metrics.value.disk.usage_percent,
      detail: `${(metrics.value.disk.used / 1024 ** 3).toFixed(2)} GB Used`,
      icon: HardDrive,
      color: 'bg-orange-500',
      textColor: 'text-orange-400',
    },
  ]
})

const historyBars = computed(() => {
  return cpuHistory.value.map((cpu, index) => ({
    cpu,
    memory: memoryHistory.value[index] ?? 0,
    time: timeHistory.value[index] ?? '',
  }))
})
</script>

<template>
  <section class="space-y-6">
    <!-- Heading -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white">Monitoring</h1>
        <p class="mt-1 text-sm text-slate-400">
          Real-time system resource monitoring.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <span
          class="flex items-center gap-2 text-xs"
          :class="connectionStatus === 'connected'
            ? 'text-emerald-400'
            : 'text-red-400'"
        >
          <span class="h-2 w-2 rounded-full bg-current"></span>
          {{ connectionStatus === 'connected' ? 'Connected' : 'Disconnected' }}
        </span>

        <button
          @click="fetchMetrics"
          class="rounded-lg border border-white/10 bg-[#111827] px-4 py-2 text-sm text-slate-300 hover:text-blue-400"
        >
          Refresh
        </button>
      </div>
    </div>

    <!-- Error -->
    <div
      v-if="connectionStatus === 'error'"
      class="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400"
    >
      {{ errorMessage }}
    </div>

    <!-- Loading -->
    <div
      v-else-if="!metrics"
      class="rounded-xl border border-white/10 bg-[#111827] p-8 text-center text-slate-400"
    >
      Loading monitoring data...
    </div>

    <template v-else>
      <!-- Resource Cards -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article
          v-for="resource in resources"
          :key="resource.label"
          class="rounded-2xl border border-white/10 bg-[#111827] p-5"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-slate-400">
              <component
                :is="resource.icon"
                :size="19"
                :class="resource.textColor"
              />
              <span class="text-sm">{{ resource.label }}</span>
            </div>

            <Activity :size="17" class="text-slate-600" />
          </div>

          <p class="mt-5 text-3xl font-bold text-white">
            {{ resource.value.toFixed(1) }}%
          </p>

          <div class="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="resource.color"
              :style="{ width: `${Math.min(100, Math.max(0, resource.value))}%` }"
            ></div>
          </div>

          <p class="mt-3 text-xs text-slate-500">
            {{ resource.detail }}
          </p>
        </article>
      </div>

      <!-- Resource History -->
      <div class="rounded-2xl border border-white/10 bg-[#111827] p-5">
        <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="font-semibold text-white">Resource History</h2>
            <p class="mt-1 text-xs text-slate-500">
              Last {{ historyBars.length }} recorded samples
            </p>
          </div>

          <div class="flex gap-4 text-xs">
            <span class="flex items-center gap-2 text-blue-400">
              <span class="h-2 w-2 rounded-full bg-blue-500"></span>
              CPU
            </span>
            <span class="flex items-center gap-2 text-purple-400">
              <span class="h-2 w-2 rounded-full bg-purple-500"></span>
              Memory
            </span>
          </div>
        </div>

        <div
          v-if="historyBars.length === 0"
          class="py-10 text-center text-sm text-slate-500"
        >
          Collecting resource history...
        </div>

        <div v-else class="flex h-52 items-end gap-2 overflow-x-auto pb-2">
          <div
            v-for="(sample, index) in historyBars"
            :key="index"
            class="flex h-full min-w-6 flex-1 flex-col items-center justify-end gap-1"
            :title="`${sample.time} | CPU ${sample.cpu}% | RAM ${sample.memory}%`"
          >
            <div class="flex h-full w-full items-end justify-center gap-1">
              <div
                class="w-2 rounded-t bg-blue-500"
                :style="{ height: `${Math.max(2, sample.cpu)}%` }"
              ></div>

              <div
                class="w-2 rounded-t bg-purple-500"
                :style="{ height: `${Math.max(2, sample.memory)}%` }"
              ></div>
            </div>
          </div>
        </div>

        <p class="mt-3 text-xs text-slate-500">
          Each bar represents one polling sample. New samples are collected every 3 seconds.
        </p>
      </div>

      <!-- System Information -->
      <div class="rounded-2xl border border-white/10 bg-[#111827] p-5">
        <h2 class="mb-4 font-semibold text-white">System Information</h2>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p class="text-xs text-slate-500">Hostname</p>
            <p class="mt-1 text-sm font-medium text-white">
              {{ metrics.hostname }}
            </p>
          </div>

          <div>
            <p class="text-xs text-slate-500">Operating System</p>
            <p class="mt-1 text-sm font-medium text-white">
              {{ metrics.platform }}
            </p>
          </div>

          <div>
            <p class="text-xs text-slate-500">Processor</p>
            <p class="mt-1 break-words text-sm font-medium text-white">
              {{ metrics.processor }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>
