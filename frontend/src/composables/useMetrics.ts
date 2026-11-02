
import { ref, onMounted, onBeforeUnmount } from 'vue'

export interface SystemMetrics {
  hostname: string
  platform: string
  processor: string
  cpu: {
    usage_percent: number
    cores_physical: number
    cores_logical: number
  }
  memory: {
    total: number
    used: number
    available: number
    usage_percent: number
  }
  disk: {
    total: number
    used: number
    free: number
    usage_percent: number
  }
  uptime_seconds: number
  timestamp: string
}

const API_URL = 'http://localhost:8000/api/metrics'

const metrics = ref<SystemMetrics | null>(null)
const connectionStatus = ref<'connecting' | 'connected' | 'error'>('connecting')
const errorMessage = ref('')

const cpuHistory = ref<number[]>([])
const memoryHistory = ref<number[]>([])
const timeHistory = ref<string[]>([])

let pollingInterval: ReturnType<typeof setInterval> | undefined
let isFetching = false
let subscribers = 0

async function fetchMetrics() {
  if (isFetching) return

  isFetching = true

  try {
    const response = await fetch(API_URL)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data: SystemMetrics = await response.json()

    metrics.value = data
    connectionStatus.value = 'connected'
    errorMessage.value = ''

    cpuHistory.value.push(data.cpu.usage_percent)
    memoryHistory.value.push(data.memory.usage_percent)

    timeHistory.value.push(
      new Date(data.timestamp).toLocaleTimeString('id-ID')
    )

    if (cpuHistory.value.length > 20) {
      cpuHistory.value.shift()
      memoryHistory.value.shift()
      timeHistory.value.shift()
    }
  } catch (error) {
    connectionStatus.value = 'error'
    errorMessage.value =
      error instanceof Error ? error.message : 'Connection failed'
  } finally {
    isFetching = false
  }
}

function startPolling() {
  subscribers++

  if (subscribers === 1) {
    fetchMetrics()
    pollingInterval = setInterval(fetchMetrics, 3000)
  }
}

function stopPolling() {
  subscribers = Math.max(0, subscribers - 1)

  if (subscribers === 0 && pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = undefined
  }
}

export function useMetrics() {
  onMounted(startPolling)
  onBeforeUnmount(stopPolling)

  return {
    metrics,
    connectionStatus,
    errorMessage,
    cpuHistory,
    memoryHistory,
    timeHistory,
    fetchMetrics,
  }
}
