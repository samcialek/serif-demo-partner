import { create } from 'zustand'
import type { ProductModule, Device, DeviceId } from '@/types'

interface ConfigState {
  // Product modules
  modules: ProductModule[]

  // Available devices
  devices: Device[]

  // User count for pricing calculator
  userCount: number

  // Pricing tiers
  pricing: {
    starter: number
    growth: number
    enterprise: string
  }

  // Actions
  toggleModule: (moduleId: string) => void
  setUserCount: (count: number) => void
  setModulePrice: (moduleId: string, price: number) => void
  updateDevice: (deviceId: DeviceId, updates: Partial<Device>) => void

  // Computed
  getActiveModules: () => ProductModule[]
  getTotalPrice: () => number
  getPricePerUser: () => number
}

const defaultModules: ProductModule[] = [
  {
    id: 'insights',
    name: 'Insights as a Service',
    description: 'Causal insights that show each user what drives their progress toward any health outcome.',
    pricePerUser: 3.00,
    priceAtScale: 1.50,
    scaleThreshold: 2000,
    isActive: true,
    enabled: true,
    features: ['Certainty scoring', 'Causal chains', 'Personal thresholds'],
  },
  {
    id: 'protocols',
    name: 'Protocols as a Service',
    description: 'Daily personalized lifestyle plans that adapt to each user\'s context and health goals.',
    pricePerUser: 2.00,
    priceAtScale: 1.00,
    scaleThreshold: 2000,
    isActive: true,
    enabled: true,
    features: ['What-If simulator', 'Daily plans', 'Adaptive triggers'],
  },
  {
    id: 'life-lens',
    name: 'Monthly Life Lensâ„¢',
    description: 'Your monthly health wrapped. Discover your archetype.',
    pricePerUser: 1.00,
    priceAtScale: 0.50,
    scaleThreshold: 2000,
    isActive: false,
    enabled: false,
    features: ['Archetype analysis', 'Monthly trends', 'Shareable reports'],
  },
  {
    id: 'social',
    name: 'Social Dashboard',
    description: 'Anonymized and team-based cohort percentile comparisons & leaderboards.',
    pricePerUser: 1.00,
    priceAtScale: 0.50,
    scaleThreshold: 2000,
    isActive: false,
    enabled: false,
    features: ['Team comparisons', 'Leaderboards', 'Privacy controls'],
  },
  {
    id: 'coach',
    name: 'Coach Dashboard & Digest',
    description: 'Complete session prep for coaches based on each client\'s causal profile.',
    pricePerUser: 1.00,
    priceAtScale: 0.50,
    scaleThreshold: 2000,
    isActive: true,
    enabled: true,
    features: ['Session prep', 'Client roster', 'Weekly digest'],
  },
]

const defaultDevices: Device[] = [
  {
    id: 'oura',
    name: 'Oura Ring',
    icon: '/assets/devices/oura.svg',
    metrics: ['Sleep stages', 'HRV', 'Resting HR', 'Body temp', 'Activity'],
    dataTypes: ['sleep', 'hrv', 'heart_rate', 'activity'],
  },
  {
    id: 'fitbit',
    name: 'Fitbit',
    icon: '/assets/devices/fitbit.svg',
    metrics: ['Sleep stages', 'Heart rate', 'Steps', 'Active zone minutes'],
    dataTypes: ['sleep', 'heart_rate', 'steps', 'activity'],
  },
  {
    id: 'Vitals+-app',
    name: 'Vitals+ App',
    icon: '/assets/devices/Vitals+.svg',
    metrics: ['Diet logs', 'Supplements', 'Caffeine', 'Alcohol', 'Exercise timing'],
    dataTypes: ['choices', 'lifestyle', 'nutrition'],
  },
  {
    id: 'bloodwork',
    name: 'Bloodwork',
    icon: '/assets/devices/bloodwork.svg',
    metrics: ['Glucose', 'Lipids', 'Hormones', 'Inflammation', 'Vitamins'],
    dataTypes: ['labs', 'biomarkers'],
  },
  {
    id: 'weather',
    name: 'Weather',
    icon: '/assets/devices/weather.svg',
    metrics: ['Temperature', 'Humidity', 'Pressure', 'UV Index', 'Air Quality'],
    dataTypes: ['environment', 'context'],
  },
]

export const useConfigStore = create<ConfigState>((set, get) => ({
  modules: defaultModules,
  devices: defaultDevices,
  userCount: 350,
  pricing: {
    starter: 1.5,
    growth: 2.5,
    enterprise: 'Custom',
  },

  toggleModule: (moduleId) => set((s) => ({
    modules: s.modules.map(m =>
      m.id === moduleId ? { ...m, isActive: !m.isActive, enabled: !m.enabled } : m
    )
  })),

  setUserCount: (count) => set({ userCount: count }),

  setModulePrice: (moduleId, price) => set((s) => ({
    modules: s.modules.map(m =>
      m.id === moduleId ? { ...m, pricePerUser: price } : m
    )
  })),

  updateDevice: (deviceId, updates) => set((s) => ({
    devices: s.devices.map(d =>
      d.id === deviceId ? { ...d, ...updates } : d
    )
  })),

  getActiveModules: () => {
    return get().modules.filter(m => m.isActive)
  },

  getTotalPrice: () => {
    const { modules, userCount } = get()
    return modules
      .filter(m => m.isActive)
      .reduce((total, m) => {
        const price = userCount >= m.scaleThreshold ? m.priceAtScale : m.pricePerUser
        return total + (price * userCount)
      }, 0)
  },

  getPricePerUser: () => {
    const { modules, userCount } = get()
    return modules
      .filter(m => m.isActive)
      .reduce((total, m) => {
        const price = userCount >= m.scaleThreshold ? m.priceAtScale : m.pricePerUser
        return total + price
      }, 0)
  },
}))
