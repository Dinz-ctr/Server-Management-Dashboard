
<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  label: string
  value: string
  detail: string
  icon: Component
  color?: string
}>()
</script>

<template>
  <article
    class="rounded-2xl border border-white/10 bg-[#111827] p-5 transition duration-200 hover:border-blue-400/30 hover:bg-[#151e2d]"
  >
    <div class="flex items-center justify-between gap-3">
      <p class="text-sm text-slate-400">{{ label }}</p>
      <component :is="icon" :size="20" :class="color ?? 'text-blue-400'" />
    </div>

    <p class="mt-5 text-3xl font-bold tracking-tight text-white">
      {{ value }}
    </p>

    <p class="mt-2 text-xs text-slate-500">
      {{ detail }}
    </p>
  </article>
</template>
