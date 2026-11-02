
<script setup lang="ts">
import { computed } from 'vue'
import { Server, Cpu, MemoryStick, HardDrive, RefreshCw } from 'lucide-vue-next'
import { useMetrics } from '../composables/useMetrics'

const {
  metrics,
  connectionStatus,
  errorMessage,
  fetchMetrics,
} = useMetrics()

const formatBytes = (bytes: number) => {
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`
}

const formatUptime = (seconds: number) => {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  return `${days}d ${hours}h ${minutes}m`
}

const serverStatus = computed(() =>
  connectionStatus.value === 'connected' ? 'Online' : 'Offline'
)
</script>

<template>
  <section class="space-y-6">
    <!-- Page Heading -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white">Servers</h1>
        <p class="mt-1 text-sm text-slate-400">
          Manage and monitor your connected servers.
        </p>
      </div>

      <button
        @click="fetchMetrics"
        class="flex items-center gap-2 rounded-lg border border-white/10 bg-[#111827] px-4 py-2 text-sm text-slate-300 transition hover:border-blue-400/40 hover:text-blue-400"
      >
        <RefreshCw :size="16" />
        Refresh
      </button>
    </div>

    <!-- Connection Error -->
    <div
      v-if="connectionStatus === 'error'"
      class="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400"
    >
      Tidak dapat terhubung ke server: {{ errorMessage }}
    </div>

    <!-- Loading -->
    <div
      v-else-if="!metrics"
      class="rounded-xl border border-white/10 bg-[#111827] p-8 text-center text-slate-400"
    >
      Loading server information...
    </div>

    <!-- Server Information -->
    <template v-else>
      <div class="overflow-hidden rounded-2xl border border-white/10 bg-[#111827]">
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-5">
          <div class="flex items-center gap-3">
            <div class="rounded-xl bg-blue-500/10 p-3 text-blue-400">
              <Server :size="22" />
            </div>

            <div>
              <h2 class="font-semibold text-white">
                {{ metrics.hostname }}
              </h2>
              <p class="text-xs text-slate-400">Local Monitoring Host</p>
            </div>
          </div>

          <span
            class="flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
            :class="
              connectionStatus === 'connected'
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-red-500/10 text-red-400'
            "
          >
            <span class="h-2 w-2 rounded-full bg-current"></span>
            {{ serverStatus }}
          </span>
        </div>

        <div class="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p class="text-xs text-slate-500">Operating System</p>
            <p class="mt-2 font-medium text-white">{{ metrics.platform }}</p>
          </div>

          <div>
            <p class="text-xs text-slate-500">Processor</p>
            <p class="mt-2 break-words text-sm text-white">
              {{ metrics.processor || 'Unknown' }}
            </p>
          </div>

          <div>
            <p class="text-xs text-slate-500">System Uptime</p>
            <p class="mt-2 font-medium text-white">
              {{ formatUptime(metrics.uptime_seconds) }}
            </p>
          </div>

          <div>
            <p class="text-xs text-slate-500">Physical Cores</p>
            <p class="mt-2 font-medium text-white">
              {{ metrics.cpu.cores_physical }}
            </p>
          </div>

          <div>
            <p class="text-xs text-slate-500">Logical Cores</p>
            <p class="mt-2 font-medium text-white">
              {{ metrics.cpu.cores_logical }}
            </p>
          </div>

          <div>
            <p class="text-xs text-slate-500">Last Updated</p>
            <p class="mt-2 font-medium text-white">
              {{ new Date(metrics.timestamp).toLocaleString('id-ID') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Resource Summary -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div class="rounded-xl border border-white/10 bg-[#111827] p-5">
          <div class="flex items-center gap-2 text-slate-400">
            <Cpu :size="18" />
            <span class="text-sm">CPU Usage</span>
          </div>
          <p class="mt-4 text-2xl font-bold text-white">
            {{ metrics.cpu.usage_percent.toFixed(1) }}%
          </p>
        </div>

        <div class="rounded-xl border border-white/10 bg-[#111827] p-5">
          <div class="flex items-center gap-2 text-slate-400">
            <MemoryStick :size="18" />
            <span class="text-sm">Memory Usage</span>
          </div>
          <p class="mt-4 text-2xl font-bold text-white">
            {{ metrics.memory.usage_percent.toFixed(1) }}%
          </p>
          <p class="mt-1 text-xs text-slate-500">
            {{ formatBytes(metrics.memory.used) }} /
            {{ formatBytes(metrics.memory.total) }}
          </p>
        </div>

        <div class="rounded-xl border border-white/10 bg-[#111827] p-5">
          <div class="flex items-center gap-2 text-slate-400">
            <HardDrive :size="18" />
            <span class="text-sm">Disk Usage</span>
          </div>
          <p class="mt-4 text-2xl font-bold text-white">
            {{ metrics.disk.usage_percent.toFixed(1) }}%
          </p>
          <p class="mt-1 text-xs text-slate-500">
            {{ formatBytes(metrics.disk.used) }} /
            {{ formatBytes(metrics.disk.total) }}
          </p>
        </div>
      </div>
    </template>
  </section>
</template>
