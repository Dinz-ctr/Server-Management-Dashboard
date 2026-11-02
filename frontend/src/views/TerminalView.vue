
<script setup lang="ts">
import { ref } from 'vue'
import { Terminal, Server, Wifi, Lock, Play } from 'lucide-vue-next'

const host = ref('')
const port = ref(22)
const username = ref('')
const connectionStatus = ref('Not Connected')

function connectSSH() {
  if (!host.value || !username.value) {
    alert('Host dan Username wajib diisi!')
    return
  }

  connectionStatus.value = 'Ready to Connect'

  alert(
    'Form berhasil divalidasi. Koneksi SSH akan kita implementasikan melalui backend FastAPI pada tahap berikutnya.'
  )
}
</script>

<template>
  <section class="space-y-6">
    <!-- Page Header -->
    <div>
      <div class="flex items-center gap-3">
        <Terminal :size="26" class="text-blue-400" />

        <h1 class="text-2xl font-bold text-white">
          Terminal
        </h1>
      </div>

      <p class="mt-2 text-sm text-slate-400">
        Connect and manage your Linux servers through SSH.
      </p>
    </div>

    <!-- SSH Connection -->
    <div class="rounded-2xl border border-white/10 bg-[#111827] p-6">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="font-semibold text-white">
            SSH Connection
          </h2>

          <p class="mt-1 text-xs text-slate-400">
            Configure your remote server connection.
          </p>
        </div>

        <Server :size="22" class="text-blue-400" />
      </div>

      <form
        class="grid grid-cols-1 gap-5 md:grid-cols-2"
        @submit.prevent="connectSSH"
      >
        <!-- Host -->
        <div>
          <label class="mb-2 block text-sm text-slate-300">
            Host / IP Address
          </label>

          <input
            v-model="host"
            type="text"
            placeholder="192.168.1.100"
            class="w-full rounded-lg border border-white/10 bg-[#0b1220] px-4 py-3 text-sm text-white outline-none focus:border-blue-400"
          />
        </div>

        <!-- Port -->
        <div>
          <label class="mb-2 block text-sm text-slate-300">
            SSH Port
          </label>

          <input
            v-model.number="port"
            type="number"
            min="1"
            max="65535"
            placeholder="22"
            class="w-full rounded-lg border border-white/10 bg-[#0b1220] px-4 py-3 text-sm text-white outline-none focus:border-blue-400"
          />
        </div>

        <!-- Username -->
        <div>
          <label class="mb-2 block text-sm text-slate-300">
            Username
          </label>

          <input
            v-model="username"
            type="text"
            placeholder="root"
            class="w-full rounded-lg border border-white/10 bg-[#0b1220] px-4 py-3 text-sm text-white outline-none focus:border-blue-400"
          />
        </div>

        <!-- Authentication -->
        <div>
          <label class="mb-2 block text-sm text-slate-300">
            Authentication
          </label>

          <div class="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0b1220] px-4 py-3 text-sm text-slate-400">
            <Lock :size="16" />
            Password / SSH Key
            <span class="ml-auto text-xs text-yellow-400">
              Coming Soon
            </span>
          </div>
        </div>

        <!-- Button -->
        <div class="md:col-span-2">
          <button
            type="submit"
            class="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            <Wifi :size="17" />
            Configure Connection
          </button>
        </div>
      </form>
    </div>

    <!-- Terminal Window -->
    <div class="overflow-hidden rounded-2xl border border-white/10 bg-[#080d17]">
      <div class="flex items-center justify-between border-b border-white/10 bg-[#111827] px-5 py-4">
        <div class="flex items-center gap-2">
          <span class="h-3 w-3 rounded-full bg-red-500"></span>
          <span class="h-3 w-3 rounded-full bg-yellow-500"></span>
          <span class="h-3 w-3 rounded-full bg-emerald-500"></span>

          <span class="ml-3 text-sm text-slate-300">
            NEXUS Terminal
          </span>
        </div>

        <span class="text-xs text-slate-500">
          {{ connectionStatus }}
        </span>
      </div>

      <div class="min-h-[280px] p-5 font-mono text-sm">
        <p class="text-emerald-400">
          NEXUS Server Operations [Version 1.0]
        </p>

        <p class="mt-3 text-slate-400">
          Welcome to NEXUS Terminal.
        </p>

        <p class="mt-2 text-slate-500">
          Configure an SSH connection to get started.
        </p>

        <div class="mt-8 flex items-center gap-2 text-slate-500">
          <span class="text-emerald-400">nexus@server:~$</span>
          <span class="animate-pulse">_</span>
        </div>
      </div>

      <div class="border-t border-white/10 px-5 py-3">
        <p class="text-xs text-slate-500">
          <Play :size="12" class="mr-1 inline" />
          Terminal execution is not available yet.
        </p>
      </div>
    </div>
  </section>
</template>
