
import { ref, watch } from 'vue'

export interface AlertThreshold {
  warning: number
  critical: number
}

type ThresholdSettings = Record<string, AlertThreshold>

const STORAGE_KEY = 'nexus-alert-thresholds'

const defaultThresholds: ThresholdSettings = {
  cpu: { warning: 70, critical: 90 },
  memory: { warning: 80, critical: 90 },
  disk: { warning: 80, critical: 90 },
}

function loadSettings(): ThresholdSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (!saved) {
      return structuredClone(defaultThresholds)
    }

    const parsed = JSON.parse(saved)

    const result = structuredClone(defaultThresholds)

    for (const key of Object.keys(result)) {
      const item = parsed[key]

      if (
        item &&
        Number.isFinite(item.warning) &&
        Number.isFinite(item.critical) &&
        item.warning >= 1 &&
        item.critical <= 100 &&
        item.warning < item.critical
      ) {
        result[key] = {
          warning: item.warning,
          critical: item.critical,
        }
      }
    }

    return result
  } catch {
    return structuredClone(defaultThresholds)
  }
}

const thresholds = ref<ThresholdSettings>(loadSettings())

watch(
  thresholds,
  (newSettings) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(newSettings),
      )
    } catch (error) {
      console.error('Failed to save alert settings:', error)
    }
  },
  { deep: true },
)

function updateThreshold(
  resource: string,
  type: 'warning' | 'critical',
  value: number,
) {
  const setting = thresholds.value[resource]

  if (!setting || !Number.isFinite(value)) return

  const safeValue = Math.round(
    Math.min(100, Math.max(1, value)),
  )

  if (type === 'warning') {
    setting.warning = Math.min(safeValue, setting.critical - 1)
  } else {
    setting.critical = Math.max(safeValue, setting.warning + 1)
  }
}

function resetThresholds() {
  thresholds.value = structuredClone(defaultThresholds)
}

export function useAlertSettings() {
  return {
    thresholds,
    updateThreshold,
    resetThresholds,
  }
}
