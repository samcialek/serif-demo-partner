import { motion } from 'framer-motion'
import {
  MousePointer,
  Target,
  TestTube,
  Activity,
  TrendingUp,
  Cloud,
  Shield,
  Database,
  CheckCircle,
  FileText,
  Watch,
  Thermometer,
  BarChart3,
} from 'lucide-react'
import { PageLayout, Grid } from '@/components/layout'
import { Card } from '@/components/common'

// ============================================================================
// DATA INGESTION PIPELINE VISUALIZATION
// ============================================================================

interface DataSource {
  id: string
  name: string
  icon: React.ElementType
  category: string
  ingestionPath: string[]
  cadence: string
  lastSync?: string
  status: 'live' | 'daily' | 'event' | 'quarterly'
  dataPoints: number
}

const dataSources: DataSource[] = [
  {
    id: 'labs',
    name: 'Laboratory / Blood Biomarkers',
    icon: TestTube,
    category: 'Markers',
    ingestionPath: ['Lab PDF/HL7', 'OCR Pipeline', 'Validation', 'BigQuery'],
    cadence: 'Event-based (Day 0, 90, 180)',
    lastSync: '3 days ago',
    status: 'event',
    dataPoints: 78,
  },
  {
    id: 'wearables',
    name: 'Digital Biomarkers – Wearables',
    icon: Watch,
    category: 'Physiology + Loads',
    ingestionPath: ['Terra API', 'Pub/Sub', 'Kafka', 'BigQuery'],
    cadence: 'Continuous → Daily summary',
    lastSync: '2 hours ago',
    status: 'live',
    dataPoints: 45,
  },
  {
    id: 'cgm',
    name: 'CGM (Continuous Glucose)',
    icon: Activity,
    category: 'Physiology',
    ingestionPath: ['LibreView Cloud', 'Terra Pull', 'Webhook', 'BigQuery'],
    cadence: '96 readings/day (15-min)',
    lastSync: '15 min ago',
    status: 'live',
    dataPoints: 12,
  },
  {
    id: 'devices',
    name: 'Connected Medical Devices',
    icon: Thermometer,
    category: 'Physiology',
    ingestionPath: ['Withings/Omron', 'Terra SDK', 'Webhook', 'BigQuery'],
    cadence: 'User-triggered events',
    lastSync: '1 day ago',
    status: 'event',
    dataPoints: 8,
  },
  {
    id: 'profile',
    name: 'Profile & Lifestyle Self-Report',
    icon: FileText,
    category: 'Choices',
    ingestionPath: ['Mobile App', 'Firestore', 'Cloud Function', 'BigQuery'],
    cadence: 'Baseline + weekly surveys',
    lastSync: '6 hours ago',
    status: 'daily',
    dataPoints: 25,
  },
  {
    id: 'interventions',
    name: 'Intervention Catalogue',
    icon: Target,
    category: 'Protocols',
    ingestionPath: ['Clinician CMS', 'PostgreSQL', 'REST API', 'BigQuery'],
    cadence: 'Event-based assignments',
    lastSync: '1 hour ago',
    status: 'event',
    dataPoints: 1200,
  },
  {
    id: 'compliance',
    name: 'Compliance & Behavior Logs',
    icon: CheckCircle,
    category: 'Outcomes',
    ingestionPath: ['Wearables + App', 'Compliance Service', 'BigQuery'],
    cadence: 'Daily scoring at 02:00',
    lastSync: '4 hours ago',
    status: 'daily',
    dataPoints: 15,
  },
  {
    id: 'environment',
    name: 'Environmental Context',
    icon: Cloud,
    category: 'Environment',
    ingestionPath: ['OpenWeatherMap', 'BreezoMeter', 'REST Pull', 'BigQuery'],
    cadence: 'Nightly refresh',
    lastSync: '8 hours ago',
    status: 'daily',
    dataPoints: 7,
  },
  {
    id: 'telemetry',
    name: 'Engagement & UX Telemetry',
    icon: BarChart3,
    category: 'Analytics',
    ingestionPath: ['Firebase Analytics', 'FCM', 'Export', 'BigQuery'],
    cadence: 'Real-time streaming',
    lastSync: 'Live',
    status: 'live',
    dataPoints: 20,
  },
]

const statusConfig = {
  live: { color: 'bg-emerald-500', label: 'LIVE', pulse: true },
  daily: { color: 'bg-blue-500', label: 'DAILY', pulse: false },
  event: { color: 'bg-amber-500', label: 'EVENT', pulse: false },
  quarterly: { color: 'bg-violet-500', label: 'QUARTERLY', pulse: false },
}

function DataIngestionPipeline() {
  return (
    <div className="space-y-3">
      {dataSources.map((source) => {
        const Icon = source.icon
        const status = statusConfig[source.status]
        return (
          <div
            key={source.id}
            className="flex items-center gap-4 p-3 bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors"
          >
            {/* Source Icon & Name */}
            <div className="flex items-center gap-3 w-64 flex-shrink-0">
              <div className="p-2 bg-black text-white">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-black truncate">{source.name}</div>
                <div className="text-xs text-gray-500">{source.category}</div>
              </div>
            </div>

            {/* Ingestion Path */}
            <div className="flex-1 flex items-center gap-1 overflow-x-auto">
              {source.ingestionPath.map((step, i) => (
                <div key={i} className="flex items-center gap-1">
                  <span className="px-2 py-1 bg-white border border-gray-200 text-xs font-mono text-gray-700 whitespace-nowrap">
                    {step}
                  </span>
                  {i < source.ingestionPath.length - 1 && (
                    <span className="text-gray-400">→</span>
                  )}
                </div>
              ))}
            </div>

            {/* Cadence */}
            <div className="w-44 flex-shrink-0 text-right">
              <div className="text-xs font-bold text-gray-600 uppercase">{source.cadence}</div>
              <div className="text-xs text-gray-400">{source.lastSync}</div>
            </div>

            {/* Status Badge */}
            <div className="w-20 flex-shrink-0 flex justify-end">
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 ${status.color} ${status.pulse ? 'animate-pulse' : ''}`} />
                <span className="text-xs font-bold uppercase text-gray-600">{status.label}</span>
              </div>
            </div>

            {/* Variables Tracked */}
            <div className="w-16 flex-shrink-0 text-right">
              <span className="text-sm font-mono font-bold text-black">{source.dataPoints}</span>
              <span className="text-xs text-gray-400 ml-1">var</span>
            </div>
          </div>
        )
      })}

      {/* Summary Stats */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-gray-600">3 Live Streams</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500" />
            <span className="text-xs font-bold text-gray-600">3 Daily Batches</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500" />
            <span className="text-xs font-bold text-gray-600">3 Event-Driven</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-black text-black">1,410</span>
          <span className="text-sm text-gray-500 ml-2">total variables tracked</span>
        </div>
      </div>
    </div>
  )
}

// COMPLE DAG Component - Renders the causal graph
function CausalDAG() {
  // Node positions - well-spaced for clarity
  const nodes = {
    E: { x: 100, y: 130, color: '#64748B', label: 'Environment', sublabel: 'Context' },
    C: { x: 280, y: 130, color: '#0EA5E9', label: 'Choices', sublabel: 'You Control' },
    P: { x: 520, y: 130, color: '#F59E0B', label: 'Physiology', sublabel: 'Fast Signals' },
    O: { x: 700, y: 130, color: '#10B981', label: 'Outcomes', sublabel: 'Optimize' },
    L: { x: 280, y: 310, color: '#8B5CF6', label: 'Loads', sublabel: 'Accumulated' },
    M: { x: 520, y: 310, color: '#EC4899', label: 'Markers', sublabel: 'Slow Biology' },
  }

  const nodeRadius = 40

  // Edge label component with background pill
  const EdgeLabel = ({ x, y, text, color = '#6366F1', italic = false }: { x: number; y: number; text: string; color?: string; italic?: boolean }) => (
    <g>
      <rect
        x={x - text.length * 3.2}
        y={y - 10}
        width={text.length * 6.4}
        height={16}
        rx="8"
        fill="white"
        fillOpacity="0.95"
      />
      <text
        x={x}
        y={y + 2}
        textAnchor="middle"
        fontSize="10"
        fontStyle={italic ? 'italic' : 'normal'}
        fontWeight="500"
        fill={color}
      >
        {text}
      </text>
    </g>
  )

  return (
    <div className="relative w-full overflow-x-auto">
      <svg viewBox="0 0 800 440" className="w-full min-w-[700px]" style={{ maxHeight: '480px' }}>
        <defs>
          {/* Arrow markers */}
          <marker id="arrowhead-learned" markerWidth="12" markerHeight="8" refX="10" refY="4" orient="auto">
            <polygon points="0 0, 12 4, 0 8" fill="#6366F1" />
          </marker>
          <marker id="arrowhead-fixed" markerWidth="12" markerHeight="8" refX="10" refY="4" orient="auto">
            <polygon points="0 0, 12 4, 0 8" fill="#64748B" />
          </marker>
          <marker id="arrowhead-modifier" markerWidth="12" markerHeight="8" refX="10" refY="4" orient="auto">
            <polygon points="0 0, 12 4, 0 8" fill="#F472B6" />
          </marker>
          {/* Subtle gradient for background */}
          <linearGradient id="safeguard-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDF2F8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FCE7F3" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Safeguards boundary */}
        <rect
          x="20"
          y="20"
          width="760"
          height="400"
          rx="16"
          fill="url(#safeguard-gradient)"
          stroke="#F9A8D4"
          strokeWidth="2"
          strokeDasharray="10 5"
        />
        <g transform="translate(40, 50)">
          <rect x="-8" y="-14" width="120" height="36" rx="8" fill="white" fillOpacity="0.9" />
          <text fontSize="13" fontWeight="600" fill="#DB2777">
            Safeguards (S)
          </text>
          <text y="16" fontSize="10" fill="#9CA3AF">
            FDA & Medical Bounds
          </text>
        </g>

        {/* Fixed effect arrows (gray) - E→C and C→L */}
        <path
          d={`M ${100 + nodeRadius + 5} 130 L ${280 - nodeRadius - 12} 130`}
          stroke="#64748B"
          strokeWidth="2.5"
          fill="none"
          markerEnd="url(#arrowhead-fixed)"
        />
        <path
          d={`M 280 ${130 + nodeRadius + 5} L 280 ${310 - nodeRadius - 12}`}
          stroke="#64748B"
          strokeWidth="2.5"
          fill="none"
          markerEnd="url(#arrowhead-fixed)"
        />

        {/* Learned effect arrows (indigo) */}
        {/* C → P */}
        <path
          d={`M ${280 + nodeRadius + 5} 130 L ${520 - nodeRadius - 12} 130`}
          stroke="#6366F1"
          strokeWidth="2.5"
          fill="none"
          markerEnd="url(#arrowhead-learned)"
        />
        <EdgeLabel x={400} y={115} text="effects & thresholds" />

        {/* P → O */}
        <path
          d={`M ${520 + nodeRadius + 5} 130 L ${700 - nodeRadius - 12} 130`}
          stroke="#6366F1"
          strokeWidth="2.5"
          fill="none"
          markerEnd="url(#arrowhead-learned)"
        />
        <EdgeLabel x={610} y={115} text="effects & thresholds" />

        {/* C → O (curved above) */}
        <path
          d={`M ${280 + 30} ${130 - 28} Q 490 30 ${700 - 30} ${130 - 28}`}
          stroke="#6366F1"
          strokeWidth="2.5"
          fill="none"
          markerEnd="url(#arrowhead-learned)"
        />
        <EdgeLabel x={490} y={55} text="direct effects" />

        {/* L → M */}
        <path
          d={`M ${280 + nodeRadius + 5} 310 L ${520 - nodeRadius - 12} 310`}
          stroke="#6366F1"
          strokeWidth="2.5"
          fill="none"
          markerEnd="url(#arrowhead-learned)"
        />
        <EdgeLabel x={400} y={295} text="effects & thresholds" />

        {/* O → M (curved right side) */}
        <path
          d={`M ${700 + 10} ${130 + 38} Q 750 220 ${520 + 38} ${310 - 10}`}
          stroke="#6366F1"
          strokeWidth="2.5"
          fill="none"
          markerEnd="url(#arrowhead-learned)"
        />
        <EdgeLabel x={720} y={230} text="accumulates" />

        {/* Modifier effect arrows (pink dashed) */}
        {/* L → O (curved modifier) */}
        <path
          d={`M ${280 + 35} ${310 - 20} Q 420 200 ${700 - 35} ${130 + 25}`}
          stroke="#F472B6"
          strokeWidth="2"
          strokeDasharray="8 4"
          fill="none"
          markerEnd="url(#arrowhead-modifier)"
          opacity="0.85"
        />
        <EdgeLabel x={440} y={215} text="modifies effects" color="#DB2777" italic />

        {/* Nodes */}
        {Object.entries(nodes).map(([key, node]) => (
          <g key={key}>
            {/* Shadow */}
            <circle
              cx={node.x + 2}
              cy={node.y + 3}
              r={nodeRadius}
              fill="black"
              fillOpacity="0.1"
            />
            {/* Node circle */}
            <circle
              cx={node.x}
              cy={node.y}
              r={nodeRadius}
              fill={node.color}
            />
            {/* Inner highlight */}
            <circle
              cx={node.x - 8}
              cy={node.y - 8}
              r={12}
              fill="white"
              fillOpacity="0.2"
            />
            {/* Letter label */}
            <text
              x={node.x}
              y={node.y + 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="22"
              fontWeight="bold"
              fill="white"
            >
              {key}
            </text>
            {/* Node name - positioned below with spacing */}
            <text
              x={node.x}
              y={node.y + nodeRadius + 22}
              textAnchor="middle"
              fontSize="13"
              fontWeight="600"
              fill="#1F2937"
            >
              {node.label}
            </text>
            {/* Sublabel */}
            <text
              x={node.x}
              y={node.y + nodeRadius + 38}
              textAnchor="middle"
              fontSize="11"
              fill="#6B7280"
            >
              {node.sublabel}
            </text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-8 mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <svg width="40" height="12">
            <line x1="0" y1="6" x2="32" y2="6" stroke="#6366F1" strokeWidth="2.5" />
            <polygon points="32,2 40,6 32,10" fill="#6366F1" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Learned Effect</span>
        </div>
        <div className="flex items-center gap-3">
          <svg width="40" height="12">
            <line x1="0" y1="6" x2="32" y2="6" stroke="#F472B6" strokeWidth="2" strokeDasharray="6 3" />
            <polygon points="32,2 40,6 32,10" fill="#F472B6" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Modifies Effect</span>
        </div>
        <div className="flex items-center gap-3">
          <svg width="40" height="12">
            <line x1="0" y1="6" x2="32" y2="6" stroke="#64748B" strokeWidth="2.5" />
            <polygon points="32,2 40,6 32,10" fill="#64748B" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Fixed Relation</span>
        </div>
      </div>
    </div>
  )
}

// COMPLE Framework category data
const compleCategories = [
  {
    id: 'choices',
    letter: 'C',
    name: 'Choices',
    description: 'Behavioral inputs you control',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    icon: MousePointer,
    variables: [
      'Caffeine intake (mg, time)',
      'Alcohol (units, time)',
      'Supplements taken',
      'Meal timing',
      'Exercise type & duration',
      'Screen time',
      'Meditation minutes',
    ],
  },
  {
    id: 'outcomes',
    letter: 'O',
    name: 'Outcomes',
    description: 'Health results we measure',
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    icon: Target,
    variables: [
      'Sleep efficiency %',
      'Deep sleep minutes',
      'REM sleep minutes',
      'Sleep latency',
      'Energy score',
      'Mood rating',
      'Cognitive performance',
    ],
  },
  {
    id: 'markers',
    letter: 'M',
    name: 'Markers',
    description: 'Lab values & biomarkers',
    color: 'from-violet-500 to-violet-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    textColor: 'text-violet-700',
    icon: TestTube,
    variables: [
      'Fasting glucose',
      'HbA1c',
      'Lipid panel (LDL, HDL, Trig)',
      'hsCRP',
      'Cortisol',
      'Testosterone',
      'Vitamin D',
      'Ferritin',
    ],
  },
  {
    id: 'physiology',
    letter: 'P',
    name: 'Physiology',
    description: 'Real-time body signals',
    color: 'from-rose-500 to-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-700',
    icon: Activity,
    variables: [
      'Heart rate variability (ms)',
      'Resting heart rate',
      'Body temperature',
      'Blood oxygen (SpO2)',
      'Respiratory rate',
      'Blood pressure',
    ],
  },
  {
    id: 'loads',
    letter: 'L',
    name: 'Loads',
    description: 'Stressors on the system',
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    icon: TrendingUp,
    variables: [
      'Training load score',
      'Strain score',
      'Steps count',
      'Active calories',
      'Work stress rating',
      'Travel (timezone shifts)',
      'Illness/recovery',
    ],
  },
  {
    id: 'environment',
    letter: 'E',
    name: 'Environment',
    description: 'External context factors',
    color: 'from-sky-500 to-sky-600',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    textColor: 'text-sky-700',
    icon: Cloud,
    variables: [
      'Ambient temperature (°C/°F)',
      'Bedroom temperature',
      'Humidity %',
      'Air quality index (AQI)',
      'PM2.5 / PM10 levels',
      'Pollen count',
      'Light exposure (lux)',
      'Barometric pressure (hPa)',
      'UV index',
      'Daylight hours',
      'Weather conditions',
      'Altitude / elevation',
    ],
  },
]

// ============================================================================
// ENGAGEMENT TELEMETRY DATA
// ============================================================================

interface TelemetryMetric {
  id: string
  name: string
  value: string | number
  change?: number
  changeLabel?: string
  status: 'good' | 'warning' | 'neutral'
}

const telemetryMetrics: TelemetryMetric[] = [
  { id: 'dau', name: 'Daily Active Users', value: '2,847', change: 12, changeLabel: 'vs last week', status: 'good' },
  { id: 'push_delivery', name: 'Push Delivery Rate', value: '94.2%', change: 1.3, changeLabel: 'vs last week', status: 'good' },
  { id: 'push_open', name: 'Push Open Rate', value: '38.7%', change: -2.1, changeLabel: 'vs last week', status: 'warning' },
  { id: 'avg_session', name: 'Avg Session Duration', value: '4m 23s', change: 8, changeLabel: 'vs last week', status: 'good' },
  { id: 'screens_per_session', name: 'Screens / Session', value: '6.2', change: 0.4, changeLabel: 'vs last week', status: 'neutral' },
  { id: 'protocol_completion', name: 'Protocol Completion', value: '73.8%', change: 5.2, changeLabel: 'vs last week', status: 'good' },
  { id: 'insight_views', name: 'Insight Card Views', value: '12,439', change: 18, changeLabel: 'vs last week', status: 'good' },
  { id: 'sync_rate', name: 'Device Sync Rate', value: '89.1%', change: -0.8, changeLabel: 'vs last week', status: 'neutral' },
]

interface EngagementEvent {
  event: string
  count: number
  trend: 'up' | 'down' | 'stable'
}

const recentEvents: EngagementEvent[] = [
  { event: 'app_open', count: 8432, trend: 'up' },
  { event: 'insight_viewed', count: 12439, trend: 'up' },
  { event: 'protocol_started', count: 892, trend: 'stable' },
  { event: 'protocol_completed', count: 658, trend: 'up' },
  { event: 'device_synced', count: 3201, trend: 'stable' },
  { event: 'lab_uploaded', count: 127, trend: 'up' },
  { event: 'coach_message_sent', count: 445, trend: 'down' },
  { event: 'notification_clicked', count: 1893, trend: 'up' },
]

function EngagementTelemetry() {
  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-4 gap-4">
        {telemetryMetrics.map((metric) => (
          <div
            key={metric.id}
            className="p-4 bg-gray-50 border border-gray-200"
          >
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              {metric.name}
            </div>
            <div className="text-2xl font-black text-black">{metric.value}</div>
            {metric.change !== undefined && (
              <div className={`text-xs font-bold mt-1 ${
                metric.change > 0 ? 'text-emerald-600' : metric.change < 0 ? 'text-rose-600' : 'text-gray-500'
              }`}>
                {metric.change > 0 ? '↑' : metric.change < 0 ? '↓' : '→'} {Math.abs(metric.change)}% {metric.changeLabel}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Event Stream */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Event Stream (Last 24h)</h4>
          <div className="space-y-2">
            {recentEvents.map((event) => (
              <div
                key={event.event}
                className="flex items-center justify-between p-2 bg-white border border-gray-100"
              >
                <span className="text-sm font-mono text-gray-700">{event.event}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-black">{event.count.toLocaleString()}</span>
                  <span className={`text-xs ${
                    event.trend === 'up' ? 'text-emerald-500' : event.trend === 'down' ? 'text-rose-500' : 'text-gray-400'
                  }`}>
                    {event.trend === 'up' ? '↑' : event.trend === 'down' ? '↓' : '→'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Data Pipeline Status</h4>
          <div className="space-y-3">
            <div className="p-3 bg-emerald-50 border border-emerald-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-emerald-800">Firebase → BigQuery Export</span>
                <span className="text-xs font-bold text-emerald-600 uppercase">Healthy</span>
              </div>
              <div className="text-xs text-emerald-600 mt-1">Last sync: 2 min ago • 0 errors</div>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-emerald-800">Terra Webhook Ingestion</span>
                <span className="text-xs font-bold text-emerald-600 uppercase">Healthy</span>
              </div>
              <div className="text-xs text-emerald-600 mt-1">Last event: 47 sec ago • 99.8% success</div>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-emerald-800">Lab OCR Pipeline</span>
                <span className="text-xs font-bold text-emerald-600 uppercase">Healthy</span>
              </div>
              <div className="text-xs text-emerald-600 mt-1">Last processed: 3 hrs ago • Queue: 0</div>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-amber-800">Weather API (BreezoMeter)</span>
                <span className="text-xs font-bold text-amber-600 uppercase">Degraded</span>
              </div>
              <div className="text-xs text-amber-600 mt-1">Rate limit reached • Next refresh: 2 hrs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DataView() {
  return (
    <PageLayout
      title="Data Categories (COMPLE)"
      subtitle="How we structure health data for causal learning"
    >
      {/* Header explanation - BRUTALIST */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card padding="none" className="overflow-hidden">
          <div className="px-6 py-3 bg-black text-white">
            <span className="text-xs font-bold uppercase tracking-wider">Framework Overview</span>
          </div>
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-black">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-black text-black uppercase tracking-tight mb-2">
                  The COMPLE Framework
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Serif organizes health data into six categories that enable causal inference.
                  <strong className="text-black font-bold"> Choices</strong> are what you control,
                  <strong className="text-black font-bold"> Outcomes</strong> are what you optimize for daily,
                  <strong className="text-black font-bold"> Markers</strong> are slow-changing biology,
                  <strong className="text-black font-bold"> Physiology</strong> tracks acute signals,
                  <strong className="text-black font-bold"> Loads</strong> accumulate over time, and
                  <strong className="text-black font-bold"> Environment</strong> provides context you can't control.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* COMPLE Categories Grid - BRUTALIST */}
      <Grid columns={3} gap="lg">
        {compleCategories.map((category, index) => {
          const Icon = category.icon
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card padding="none" className="h-full overflow-hidden">
                {/* Category Header - BRUTALIST color block */}
                <div className={`px-5 py-4 ${category.bgColor} border-b-2 border-black`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                      <span className="text-white font-black text-lg">{category.letter}</span>
                    </div>
                    <div>
                      <h3 className={`font-black uppercase tracking-tight ${category.textColor}`}>{category.name}</h3>
                      <p className="text-xs font-bold text-gray-500 uppercase">{category.description}</p>
                    </div>
                  </div>
                </div>

                {/* Variables List - BRUTALIST */}
                <div className="px-5 py-4">
                  <ul className="space-y-2">
                    {category.variables.map((variable, vIndex) => (
                      <li
                        key={vIndex}
                        className="flex items-center gap-2 text-sm text-gray-700"
                      >
                        <div className={`w-2 h-2 bg-gradient-to-br ${category.color}`} />
                        {variable}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </Grid>

      {/* Data Ingestion Pipeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <Card padding="none" className="overflow-hidden">
          <div className="px-6 py-4 bg-slate-800 text-white border-b-2 border-black">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight">
                  Data Ingestion Pipeline
                </h3>
                <p className="text-sm text-slate-300">
                  Source systems, ingestion paths, and native cadence
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <DataIngestionPipeline />
          </div>
        </Card>
      </motion.div>

      {/* Causal DAG Diagram */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8"
      >
        <Card padding="none" className="overflow-hidden">
          <div className="px-6 py-4 bg-indigo-600 text-white border-b-2 border-black">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight">
                  How Data Flows in Causal Learning
                </h3>
                <p className="text-sm text-indigo-100">
                  The COMPLE Directed Acyclic Graph
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <CausalDAG />
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600 leading-relaxed">
              <strong className="text-black font-black">KEY INSIGHT:</strong> Serif learns causal effects (blue arrows) from data while respecting
              the graph structure. <strong className="text-rose-600 font-bold">Physiology (P)</strong> is monitored for
              safety but excluded from outcome learning to prevent reverse causation. All learned effects
              operate within the <strong className="text-pink-600 font-bold">Safeguards (S)</strong> boundary.
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Engagement & Telemetry Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8"
      >
        <Card padding="none" className="overflow-hidden">
          <div className="px-6 py-4 bg-violet-600 text-white border-b-2 border-black">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight">
                  Engagement & UX Telemetry
                </h3>
                <p className="text-sm text-violet-200">
                  Real-time user engagement metrics and pipeline health
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <EngagementTelemetry />
          </div>
        </Card>
      </motion.div>
    </PageLayout>
  )
}

export default DataView
