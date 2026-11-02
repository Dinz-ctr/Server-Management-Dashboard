
<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'
import { use } from 'echarts/core'

import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components'

import { useMetrics } from '../../composables/useMetrics'

use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
])

// Shared monitoring data
const {
  metrics,
  connectionStatus,
  errorMessage,
  cpuHistory,
  memoryHistory,
  timeHistory,
  fetchMetrics,
} = useMetrics()

// Format bytes into readable units
function formatBytes(bytes: number) {
  if (bytes >= 1024 ** 3) {
    return `${(bytes / 1024 ** 3).toFixed(2)} GB`
  }

  return `${(bytes / 1024 ** 2).toFixed(2)} MB`
}

// Format uptime
const formattedUptime = computed(() => {
  const seconds = metrics.value?.uptime_seconds ?? 0

  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  return `${days}d ${hours}h ${minutes}m`
})

// Resource health
function getStatus(value: number) {
  if (value >= 90) return 'Critical'
  if (value >= 75) return 'Warning'
  return 'Normal'
}

function statusClass(value: number) {
  if (value >= 90) return 'bg-red-400/10 text-red-400'
  if (value >= 75) return 'bg-amber-400/10 text-amber-400'
  return 'bg-emerald-400/10 text-emerald-400'
}

// Chart configuration
const chartOption = computed<EChartsOption>(() => ({
  backgroundColor: 'transparent',

  tooltip: {
    trigger: 'axis',
    backgroundColor: '#111827',
    borderColor: '#334155',
    textStyle: {
      color: '#e2e8f0',
    },
  },

  legend: {
    top: 0,
    right: 10,
    textStyle: {
      color: '#94a3b8',
    },
  },

  grid: {
    left: '3%',
    right: '4%',
    top: 45,
    bottom: 35,
    containLabel: true,
  },

  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: timeHistory.value,
    axisLabel: {
      color: '#94a3b8',
    },
    axisLine: {
      lineStyle: {
        color: '#334155',
      },
    },
  },

  yAxis: {
    type: 'value',
    min: 0,
    max: 100,
    axisLabel: {
      color: '#94a3b8',
      formatter: '{value}%',
    },
    splitLine: {
      lineStyle: {
        color: '#334155',
        type: 'dashed',
      },
    },
  },

  series: [
    {
      name: 'CPU Usage',
      type: 'line',
      smooth: true,
      data: cpuHistory.value,
      showSymbol: true,
      symbolSize: 6,
      lineStyle: {
        width: 3,
        color: '#3b82f6',
      },
      itemStyle: {
        color: '#3b82f6',
      },
      areaStyle: {
        opacity: 0.08,
      },
    },
    {
      name: 'Memory Usage',
      type: 'line',
      smooth: true,
      data: memoryHistory.value,
      showSymbol: true,
      symbolSize: 6,
      lineStyle: {
        width: 3,
        color: '#a3e635',
      },
      itemStyle: {
        color: '#a3e635',
      },
      areaStyle: {
        opacity: 0.08,
      },
    },
  ],
}))
</script>

<template>
  <div class="space-y-6">

    <!-- Connection Status -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <span
          class="h-2.5 w-2.5 rounded-full"
          :class="{
            'bg-emerald-400': connectionStatus === 'connected',
            'bg-amber-400 animate-pulse': connectionStatus === 'connecting',
            'bg-red-400': connectionStatus === 'error',
          }"
        ></span>

        <span
          class="text-sm font-medium"
          :class="{
            'text-emerald-400': connectionStatus === 'connected',
            'text-amber-400': connectionStatus === 'connecting',
            'text-red-400': connectionStatus === 'error',
          }"
        >
          {{
            connectionStatus === 'connected'
              ? 'CONNECTED TO REAL SERVER'
              : connectionStatus === 'connecting'
                ? 'CONNECTING...'
                : 'CONNECTION ERROR'
          }}
        </span>
      </div>

      <span class="text-xs text-slate-500">
        Polling interval: 3 seconds
      </span>
    </div>

    <!-- Error Message -->
    <div
      v-if="connectionStatus === 'error'"
      class="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-400"
    >
      Unable to connect to FastAPI: {{ errorMessage }}

      <button
        class="ml-2 underline"
        @click="fetchMetrics"
      >
        Retry
      </button>
    </div>

    <!-- Loading -->
    <div
      v-if="!metrics && connectionStatus === 'connecting'"
      class="rounded-xl border border-white/10 bg-[#0d1422] p-8 text-center text-slate-400"
    >
      Loading real server metrics...
    </div>

    <template v-if="metrics">

      <!-- Server Information -->
      <div class="rounded-xl border border-white/10 bg-[#0d1422] p-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-xs text-slate-500">MONITORED HOST</p>

            <h4 class="mt-1 font-semibold text-white">
              {{ metrics.hostname }}
            </h4>

            <p class="mt-1 text-xs text-slate-400">
              {{ metrics.platform }} · {{ metrics.processor }}
            </p>
          </div>

          <div class="text-right">
            <p class="text-xs text-slate-500">System Uptime</p>

            <p class="mt-1 font-semibold text-white">
              {{ formattedUptime }}
            </p>
          </div>
        </div>
      </div>

      <!-- CPU and Memory -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">

        <!-- CPU -->
        <div class="rounded-xl border border-white/10 bg-[#0d1422] p-4">
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-400">CPU Usage</span>

            <span class="text-xs text-blue-400">
              {{ metrics.cpu.cores_logical }} Logical Cores
            </span>
          </div>

          <div class="mt-3 flex items-end justify-between">
            <span class="text-3xl font-bold text-white">
              {{ metrics.cpu.usage_percent.toFixed(1) }}%
            </span>

            <span
              class="rounded-full px-2.5 py-1 text-xs font-medium"
              :class="statusClass(metrics.cpu.usage_percent)"
            >
              {{ getStatus(metrics.cpu.usage_percent) }}
            </span>
          </div>

          <div class="mt-4 h-2 overflow-hidden rounded-full bg-slate-700">
            <div
              class="h-full rounded-full bg-blue-400 transition-all duration-500"
              :style="{ width: `${metrics.cpu.usage_percent}%` }"
            ></div>
          </div>
        </div>

        <!-- Memory -->
        <div class="rounded-xl border border-white/10 bg-[#0d1422] p-4">
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-400">Memory Usage</span>

            <span class="text-xs text-violet-400">RAM</span>
          </div>

          <div class="mt-3 flex items-end justify-between">
            <span class="text-3xl font-bold text-white">
              {{ metrics.memory.usage_percent.toFixed(1) }}%
            </span>

            <span
              class="rounded-full px-2.5 py-1 text-xs font-medium"
              :class="statusClass(metrics.memory.usage_percent)"
            >
              {{ getStatus(metrics.memory.usage_percent) }}
            </span>
          </div>

          <div class="mt-4 h-2 overflow-hidden rounded-full bg-slate-700">
            <div
              class="h-full rounded-full bg-violet-400 transition-all duration-500"
              :style="{ width: `${metrics.memory.usage_percent}%` }"
            ></div>
          </div>

          <p class="mt-2 text-xs text-slate-500">
            {{ formatBytes(metrics.memory.used) }}
            used of {{ formatBytes(metrics.memory.total) }}
          </p>
        </div>

      </div>

      <!-- Disk Information -->
      <div class="rounded-xl border border-white/10 bg-[#0d1422] p-4">
        <div class="flex items-center justify-between">
          <span class="text-sm text-slate-400">Disk Usage</span>

          <span
            class="rounded-full px-2.5 py-1 text-xs font-medium"
            :class="statusClass(metrics.disk.usage_percent)"
          >
            {{ getStatus(metrics.disk.usage_percent) }}
          </span>
        </div>

        <div class="mt-3 flex items-end justify-between">
          <span class="text-2xl font-bold text-white">
            {{ metrics.disk.usage_percent.toFixed(1) }}%
          </span>

          <span class="text-xs text-slate-500">
            {{ formatBytes(metrics.disk.free) }} free
          </span>
        </div>

        <div class="mt-4 h-2 overflow-hidden rounded-full bg-slate-700">
          <div
            class="h-full rounded-full bg-amber-400 transition-all duration-500"
            :style="{ width: `${metrics.disk.usage_percent}%` }"
          ></div>
        </div>
      </div>

      <!-- Resource History Chart -->
      <div class="rounded-xl border border-white/10 bg-[#0d1422] p-4">
        <div class="mb-4">
          <h4 class="font-semibold text-white">Resource History</h4>

          <p class="mt-1 text-xs text-slate-500">
            Actual CPU and memory utilization
          </p>
        </div>

        <div class="h-80 w-full">
          <VChart
            :option="chartOption"
            autoresize
            class="h-full w-full"
          />
        </div>
      </div>

      <!-- Last Update -->
      <p class="text-right text-xs text-slate-500">
        Last update:
        {{ new Date(metrics.timestamp).toLocaleString('id-ID') }}
      </p>

    </template>
  </div>
</template>
