/**
 * Re-export Ryan's metrics from persona data
 * This file exists for organizational purposes and to add any
 * time-series specific utilities for Ryan's data
 */

import { ryanMetrics, RyanLabs } from '@/data/personas/ryan'
import type { DailyMetrics, LabResult } from '@/types'
import type { ChartDataPoint, MetricSummary, TimeRange } from './types'
import { METRIC_CONFIG, calculateTrend } from './types'

export { ryanMetrics, RyanLabs }

/**
 * Get metrics within a time range
 */
export function getryanMetricsInRange(range: TimeRange): DailyMetrics[] {
  return ryanMetrics.filter(m => m.date >= range.start && m.date <= range.end)
}

/**
 * Get chart data for a specific metric
 */
export function getRyanChartData(
  metricKey: keyof DailyMetrics,
  range?: TimeRange
): ChartDataPoint[] {
  let metrics = ryanMetrics

  if (range) {
    metrics = metrics.filter(m => m.date >= range.start && m.date <= range.end)
  }

  return metrics.map(m => ({
    date: m.date,
    value: m[metricKey] as number,
    event: m.events?.[0],
  }))
}

/**
 * Get metric summary for Ryan
 */
export function getryanMetricsummary(metricKey: keyof DailyMetrics): MetricSummary {
  const values = ryanMetrics
    .map(m => m[metricKey] as number)
    .filter(v => typeof v === 'number' && !isNaN(v))

  const config = METRIC_CONFIG[metricKey] || { label: metricKey, unit: '', decimals: 0, goodDirection: 'stable' }
  const current = values[values.length - 1] || 0
  const average = values.reduce((a, b) => a + b, 0) / values.length
  const trend = calculateTrend(values)

  // Calculate trend percent (last 7 days vs previous 7 days)
  const recent = values.slice(-7)
  const previous = values.slice(-14, -7)
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
  const previousAvg = previous.length > 0 ? previous.reduce((a, b) => a + b, 0) / previous.length : recentAvg
  const trendPercent = previousAvg !== 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0

  return {
    key: metricKey,
    label: config.label,
    unit: config.unit,
    current,
    average,
    min: Math.min(...values),
    max: Math.max(...values),
    trend,
    trendPercent,
  }
}

/**
 * Get sleep narrative data points for Ryan
 * (dates where sleep was notably affected)
 */
export function getRyanSleepNarrativePoints(): { date: string; event: string; sleepScore: number }[] {
  return ryanMetrics
    .filter(m => m.events && m.events.length > 0)
    .map(m => ({
      date: m.date,
      event: m.events![0],
      sleepScore: m.sleepScore,
    }))
}

/**
 * Get workout timing correlation data
 */
export function getRyanWorkoutSleepCorrelation(): { workoutTime: string | null; sleepLatency: number; date: string }[] {
  return ryanMetrics.map(m => ({
    date: m.date,
    workoutTime: m.workoutTime,
    sleepLatency: m.sleepLatency,
  }))
}

/**
 * Get lab trend data for visualization
 */
export function getRyanLabTrends(): { marker: string; data: { date: string; value: number }[] }[] {
  const markers = ['fastingGlucose', 'triglycerides', 'hdl', 'hsCrp', 'testosterone', 'vitaminD'] as const

  return markers.map(marker => ({
    marker,
    data: RyanLabs.map(lab => ({
      date: lab.date,
      value: lab[marker] as number,
    })).filter(d => d.value !== undefined),
  }))
}
