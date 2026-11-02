
<script setup lang="ts">
import { useAlertSettings } from '../composables/useAlertSettings'

const {
  thresholds,
  updateThreshold,
  resetThresholds,
} = useAlertSettings()

const settings = [
  { key: 'cpu', label: 'CPU Usage', description: 'Processor utilization' },
  { key: 'memory', label: 'Memory Usage', description: 'RAM utilization' },
  { key: 'disk', label: 'Disk Usage', description: 'Storage utilization' },
]

function handleChange(
  resource: string,
  type: 'warning' | 'critical',
  event: Event,
) {
  const target = event.target as HTMLInputElement
  const value = Number(target.value)

  updateThreshold(resource, type, value)
}
</script>

<template>
  <section class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white">Settings</h1>
        <p class="mt-1 text-sm text-slate-400">
          Configure NEXUS monitoring preferences.
        </p>
      </div>

      <button
        @click="resetThresholds"
        class="rounded-lg border border-white/10 bg-[#111827] px-4 py-2 text-sm text-slate-300 hover:text-blue-400"
      >
        Reset Defaults
      </button>
    </div>

    <div class="rounded-2xl border border-white/10 bg-[#111827] p-5">
      <div class="mb-6">
        <h2 class="font-semibold text-white">Alert Configuration</h2>
        <p class="mt-1 text-xs text-slate-500">
          Set warning and critical thresholds for each resource.
        </p>
      </div>

      <div
        v-for="setting in settings"
        :key="setting.key"
        class="border-b border-white/5 py-6 last:border-0"
      >
        <div class="mb-5">
          <h3 class="font-medium text-white">{{ setting.label }}</h3>
          <p class="mt-1 text-xs text-slate-500">
            {{ setting.description }}
          </p>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <div class="mb-2 flex justify-between">
              <label class="text-sm text-yellow-400">Warning Threshold</label>
              <span class="text-sm font-semibold text-white">
                {{ thresholds[setting.key].warning }}%
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="99"
              :value="thresholds[setting.key].warning"
              @input="handleChange(setting.key, 'warning', $event)"
              class="w-full accent-yellow-400"
            />
          </div>

          <div>
            <div class="mb-2 flex justify-between">
              <label class="text-sm text-red-400">Critical Threshold</label>
              <span class="text-sm font-semibold text-white">
                {{ thresholds[setting.key].critical }}%
              </span>
            </div>

            <input
              type="range"
              min="2"
              max="100"
              :value="thresholds[setting.key].critical"
              @input="handleChange(setting.key, 'critical', $event)"
              class="w-full accent-red-400"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
      <p class="text-sm text-blue-300">
        Pengaturan ini langsung diterapkan pada sesi aplikasi saat ini.
        Penyimpanan permanen akan kita tambahkan kemudian.
      </p>
    </div>
  </section>
</template>
