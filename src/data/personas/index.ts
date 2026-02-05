import type { Persona, Insight, DailyMetrics, LabResult, Protocol, DailyPlan } from '@/types'
import type { PersonaData, PersonaRegistryEntry } from './types'

// Import all persona data
import {
  RyanPersona,
  RyanInsights,
  ryanMetrics,
  RyanLabs,
  RyanProtocols,
  RyanDailyPlan,
} from './ryan'

import {
  sarahPersona,
  sarahInsights,
  sarahMetrics,
  sarahLabs,
  sarahProtocols,
  sarahDailyPlan,
} from './sarah'

import {
  marcusPersona,
  marcusInsights,
  marcusMetrics,
  marcusLabs,
  marcusProtocols,
  marcusDailyPlan,
} from './marcus'

import {
  emmaPersona,
  emmaInsights,
  emmaMetrics,
  emmaLabs,
  emmaProtocols,
  emmaDailyPlan,
} from './emma'

// Export individual personas
export {
  RyanPersona,
  RyanInsights,
  ryanMetrics,
  RyanLabs,
  RyanProtocols,
  RyanDailyPlan,
  sarahPersona,
  sarahInsights,
  sarahMetrics,
  sarahLabs,
  sarahProtocols,
  sarahDailyPlan,
  marcusPersona,
  marcusInsights,
  marcusMetrics,
  marcusLabs,
  marcusProtocols,
  marcusDailyPlan,
  emmaPersona,
  emmaInsights,
  emmaMetrics,
  emmaLabs,
  emmaProtocols,
  emmaDailyPlan,
}

// Aggregated exports
export const personas: Persona[] = [
  RyanPersona,
  sarahPersona,
  marcusPersona,
  emmaPersona,
]

export const allInsights: Insight[] = [
  ...RyanInsights,
  ...sarahInsights,
  ...marcusInsights,
  ...emmaInsights,
]

export const allProtocols: Protocol[] = [
  ...RyanProtocols,
  ...sarahProtocols,
  ...marcusProtocols,
  ...emmaProtocols,
]

// Complete persona data bundles
export const personaDataMap: Record<string, PersonaData> = {
  Ryan: {
    persona: RyanPersona,
    insights: RyanInsights,
    metrics: ryanMetrics,
    labs: RyanLabs,
    protocols: RyanProtocols,
    dailyPlan: RyanDailyPlan,
  },
  sarah: {
    persona: sarahPersona,
    insights: sarahInsights,
    metrics: sarahMetrics,
    labs: sarahLabs,
    protocols: sarahProtocols,
    dailyPlan: sarahDailyPlan,
  },
  marcus: {
    persona: marcusPersona,
    insights: marcusInsights,
    metrics: marcusMetrics,
    labs: marcusLabs,
    protocols: marcusProtocols,
    dailyPlan: marcusDailyPlan,
  },
  emma: {
    persona: emmaPersona,
    insights: emmaInsights,
    metrics: emmaMetrics,
    labs: emmaLabs,
    protocols: emmaProtocols,
    dailyPlan: emmaDailyPlan,
  },
}

// Quick lookup registry
export const personaRegistry: PersonaRegistryEntry[] = personas.map(p => ({
  id: p.id,
  name: p.name,
  archetype: p.archetype,
  avatar: p.avatar,
  tags: p.tags,
}))

// Helper functions
export function getAllPersonas(): Persona[] {
  return personas
}

export function getPersonaById(id: string): Persona | undefined {
  return personas.find(p => p.id === id)
}

export function getPersonaData(id: string): PersonaData | undefined {
  return personaDataMap[id]
}

export function getInsightsForPersona(personaId: string): Insight[] {
  return allInsights.filter(i => i.personaId === personaId)
}

export function getProtocolsForPersona(personaId: string): Protocol[] {
  return allProtocols.filter(p => p.personaId === personaId)
}

export function getMetricsForPersona(personaId: string): DailyMetrics[] {
  return personaDataMap[personaId]?.metrics ?? []
}

export function getLabsForPersona(personaId: string): LabResult[] {
  return personaDataMap[personaId]?.labs ?? []
}

export function getDailyPlanForPersona(personaId: string): DailyPlan | undefined {
  return personaDataMap[personaId]?.dailyPlan
}

// Re-export types
export type { PersonaData, PersonaRegistryEntry } from './types'
