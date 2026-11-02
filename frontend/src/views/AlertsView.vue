
<script setup lang="ts">
import { computed } from 'vue'
import {
  Cpu,
  MemoryStick,
  HardDrive,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-vue-next'

import { useMetrics } from '../composables/useMetrics'
import { useAlertSettings } from '../composables/useAlertSettings'

const { metrics, connectionStatus, errorMessage } = useMetrics()
const { thresholds } = useAlertSettings()

const alerts = computed(() => {
  if (!metrics.value) return []

  const rules = [
    {
      name: 'CPU Usage',
      value: metrics.value.cpu.usage_percent,
      threshold: thresholds.value.cpu,
      icon: Cpu,
    },
    {
      name: 'Memory Usage',
      value: metrics.value.memory.usage_percent,
      threshold: thresholds.value.memory,
      icon: MemoryStick,
    },
    {
      name: 'Disk Usage',
      value: metrics.value.disk.usage_percent,
      threshold: thresholds.value.disk,
      icon: HardDrive,
    },
  ]

  return rules.map((rule) => {
    let severity = 'Normal'
    let message = 'Resource usage is within normal limits.'

    if (rule.value >= rule.threshold.critical) {
      severity = 'Critical'
      message = 'Resource usage has exceeded the critical threshold.'
    } else if (rule.value >= rule.threshold.warning) {
      severity = 'Warning'
      message = 'Resource usage is approaching its critical limit.'
    }

    return {
      ...rule,
      severity,
      message,
    }
  })
})

const criticalCount = computed(
  () => alerts.value.filter(item => item.severity === 'Critical').length
)

const warningCount = computed(
  () => alerts.value.filter(item => item.severity === 'Warning').length
)

const normalCount = computed(
  () => alerts.value.filter(item => item.severity === 'Normal').length
)
</script>

<template>
  <section class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-white">Alerts</h1>
      <p class="mt-1 text-sm text-slate-400">
        Monitor system health and resource thresholds.
      </p>
    </div>

    <div
      v-if="connectionStatus === 'error'"
      class="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400"
    >
      Backend connection error: {{ errorMessage }}
    </div>

    <div
      v-else-if="!metrics"
      class="rounded-xl border border-white/10 bg-[#111827] p-8 text-center text-slate-400"
    >
      Loading alert information...
    </div>

    <template v-else>
      <!-- Summary -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
          <p class="text-sm text-red-400">Critical</p>
          <p class="mt-2 text-3xl font-bold text-white">
            {{ criticalCount }}
          </p>
        </div>

        <div class="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5">
          <p class="text-sm text-yellow-400">Warning</p>
          <p class="mt-2 text-3xl font-bold text-white">
            {{ warningCount }}
          </p>
        </div>

        <div class="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <p class="text-sm text-emerald-400">Normal</p>
          <p class="mt-2 text-3xl font-bold text-white">
            {{ normalCount }}
          </p>
        </div>
      </div>

      <!-- Alert List -->
      <div class="overflow-hidden rounded-2xl border border-white/10 bg-[#111827]">
        <div class="border-b border-white/10 p-5">
          <h2 class="font-semibold text-white">Resource Alerts</h2>
          <p class="mt-1 text-xs text-slate-500">
            Evaluated using your configured thresholds.
          </p>
        </div>

        <div
          v-for="alert in alerts"
          :key="alert.name"
          class="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 p-5 last:border-0"
        >
          <div class="flex items-center gap-3">
            <div class="rounded-lg bg-white/5 p-3">
              <component :is="alert.icon" :size="20" class="text-slate-300" />
            </div>

            <div>
              <h3 class="text-sm font-medium text-white">
                {{ alert.name }}
              </h3>
              <p class="mt-1 text-xs text-slate-500">
                {{ alert.message }}
              </p>
              <p class="mt-1 text-xs text-slate-600">
                Warning: {{ alert.threshold.warning }}% |
                Critical: {{ alert.threshold.critical }}%
              </p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <span class="font-semibold text-white">
              {{ alert.value.toFixed(1) }}%
            </span>

            <span
              class="rounded-full px-3 py-1 text-xs font-medium"
              :class="{
                'bg-red-500/10 text-red-400': alert.severity === 'Critical',
                'bg-yellow-500/10 text-yellow-400': alert.severity === 'Warning',
                'bg-emerald-500/10 text-emerald-400': alert.severity === 'Normal',
              }"
            >
              {{ alert.severity }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>
