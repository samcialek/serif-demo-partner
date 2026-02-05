import { useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Watch, Droplets, Cloud, Smartphone } from 'lucide-react'
import { PageLayout, Section, Grid } from '@/components/layout'
import { Card, Button, Badge, PatientSelector } from '@/components/common'
import { useSyncStatus, usePersona } from '@/hooks'
import { useConfigStore } from '@/stores/configStore'
import type { PersonaDeviceConnection } from '@/types'

const deviceIcons: Record<string, React.ElementType> = {
  oura: Watch,
  fitbit: Watch,
  'Vitals+-app': Smartphone,
  bloodwork: Droplets,
  weather: Cloud,
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatTime = (dateStr?: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export function IntegrationView() {
  const { activePersona } = usePersona()
  const { devices } = useConfigStore()
  const { deviceStates, syncDevice, syncAllDevices, isSyncing } = useSyncStatus()
  const [hoveredDevice, setHoveredDevice] = useState<string | null>(null)

  const getDeviceStatus = (deviceId: string) => {
    return deviceStates.find(d => d.deviceId === deviceId)
  }

  const getDeviceConnection = (deviceId: string): PersonaDeviceConnection | undefined => {
    return activePersona?.deviceConnections?.find(dc => dc.deviceId === deviceId)
  }

  const syncBtnClasses = isSyncing ? 'animate-spin' : ''

  return (
    <PageLayout
      title="Data Integration"
      subtitle="Connect your wearables and health data sources"
      actions={
        <div className="flex items-center gap-3">
          <PatientSelector />
          <Button onClick={syncAllDevices} loading={isSyncing}>
            <RefreshCw className={'w-4 h-4 mr-2 ' + syncBtnClasses} />
            Sync All Devices
          </Button>
        </div>
      }
    >
      {/* Connected Devices */}
      <Section title="Connected Devices" subtitle={activePersona ? 'Data sources for ' + activePersona.name : 'Data sources'}>
        <Grid columns={4} gap="md" data-tour="device-grid">
          {devices.map((device) => {
            const status = getDeviceStatus(device.id)
            const Icon = deviceIcons[device.id] || Watch
            const connection = getDeviceConnection(device.id)
            const isActiveDevice = connection?.isActive ?? false
            const wasEverConnected = !!connection
            
            const bgColor = isActiveDevice ? 'bg-[#89ccf0]/20' : wasEverConnected ? 'bg-gray-200' : 'bg-gray-100'
            const iconColor = isActiveDevice ? 'text-[#89ccf0]' : wasEverConnected ? 'text-gray-500' : 'text-gray-300'
            const borderColor = isActiveDevice ? 'border-2 border-[#89ccf0]' : ''

            return (
              <div 
                key={device.id} 
                className="relative"
                onMouseEnter={() => setHoveredDevice(device.id)}
                onMouseLeave={() => setHoveredDevice(null)}
              >
                <Card className={'p-4 ' + borderColor}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={'p-2 rounded-lg ' + bgColor}>
                        <Icon className={'w-5 h-5 ' + iconColor} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{device.name}</h4>
                        <p className="text-xs text-gray-500">{device.metrics?.length ?? 0} metrics</p>
                      </div>
                    </div>
                    {isActiveDevice ? (
                      <div className="w-2 h-2 rounded-full bg-[#89ccf0] animate-pulse" />
                    ) : wasEverConnected ? (
                      <div className="w-2 h-2 rounded-full bg-gray-400" />
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {device.metrics?.slice(0, 3).map((metric) => (
                      <Badge key={metric} variant="outline" size="sm">
                        {metric}
                      </Badge>
                    ))}
                    {(device.metrics?.length ?? 0) > 3 && (
                      <Badge variant="outline" size="sm">
                        +{(device.metrics?.length ?? 0) - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    {isActiveDevice ? (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#89ccf0] font-medium">Connected</span>
                          <Button size="xs" variant="ghost" onClick={() => syncDevice(device.id)}>
                            <RefreshCw className="w-3 h-3" />
                          </Button>
                        </div>
                        <span className="text-xs text-gray-400">Last synced: 4:30am</span>
                      </div>
                    ) : wasEverConnected ? (
                      <span className="text-xs text-gray-500">Previously connected</span>
                    ) : (
                      <Button size="sm" variant="outline" fullWidth>Connect</Button>
                    )}
                  </div>
                </Card>

                {/* Hover Tooltip */}
                {hoveredDevice === device.id && wasEverConnected && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50"
                  >
                    <div className="bg-navy-900 text-white px-3 py-2 rounded-lg shadow-lg text-xs whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div>
                          <span className="text-gray-400">First connected: </span>
                          <span>{formatDate(connection?.firstConnected)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Last refreshed: </span>
                          <span>{formatDate(connection?.lastRefreshed)} {formatTime(connection?.lastRefreshed)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Status: </span>
                          <span className={isActiveDevice ? 'text-[#89ccf0]' : 'text-gray-400'}>
                            {isActiveDevice ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                        <div className="border-8 border-transparent border-t-navy-900" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )
          })}
        </Grid>
      </Section>

      {/* Data Pipeline Architecture */}
      <Section title="Data Pipeline Architecture" subtitle="How Serif processes your health data" className="mt-8">
        <div className="space-y-6">
          {/* Fast Loop */}
          <Card className="p-6 bg-gradient-to-r from-emerald-50 to-cyan-50 border-2 border-emerald-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">FAST LOOP</div>
              <span className="text-sm text-emerald-700 font-medium">Daily Inference Pipeline</span>
              <span className="text-xs text-emerald-600 ml-auto">Runs every 24 hours</span>
            </div>
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
              {[
                { name: 'ETL', desc: 'Extract & Transform', color: 'bg-slate-100 border-slate-300' },
                { name: 'COMPLE', desc: 'Categorize Data', color: 'bg-violet-100 border-violet-300' },
                { name: 'Causal Structure', desc: 'Build DAG', color: 'bg-blue-100 border-blue-300' },
                { name: 'BCEL Inference', desc: 'Generate Insights', color: 'bg-emerald-100 border-emerald-300' },
                { name: 'Safeguards', desc: 'Validate Safety', color: 'bg-amber-100 border-amber-300' },
                { name: 'Plan Publisher', desc: 'Deliver to User', color: 'bg-cyan-100 border-cyan-300' },
              ].map((step, i, arr) => (
                <div key={step.name} className="flex items-center gap-2 flex-shrink-0">
                  <div className={`px-4 py-3 rounded-lg border-2 ${step.color} text-center min-w-[100px]`}>
                    <div className="text-xs font-bold text-slate-800">{step.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{step.desc}</div>
                  </div>
                  {i < arr.length - 1 && (
                    <span className="text-emerald-400 text-lg font-bold">â†’</span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Slow Loop */}
          <Card className="p-6 bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 bg-violet-500 text-white text-xs font-bold rounded-full">SLOW LOOP</div>
              <span className="text-sm text-violet-700 font-medium">Weekly Learning Pipeline</span>
              <span className="text-xs text-violet-600 ml-auto">Runs every 7 days</span>
            </div>
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
              {[
                { name: '60-Day History', desc: 'Aggregate Data', color: 'bg-slate-100 border-slate-300' },
                { name: 'Backdoor Features', desc: 'Control Confounders', color: 'bg-rose-100 border-rose-300' },
                { name: 'BCEL Learn', desc: 'Update Parameters', color: 'bg-violet-100 border-violet-300' },
                { name: 'Validation', desc: 'Calibration Check', color: 'bg-purple-100 border-purple-300' },
                { name: 'Model Update', desc: 'Deploy to Fast Loop', color: 'bg-indigo-100 border-indigo-300' },
              ].map((step, i, arr) => (
                <div key={step.name} className="flex items-center gap-2 flex-shrink-0">
                  <div className={`px-4 py-3 rounded-lg border-2 ${step.color} text-center min-w-[110px]`}>
                    <div className="text-xs font-bold text-slate-800">{step.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{step.desc}</div>
                  </div>
                  {i < arr.length - 1 && (
                    <span className="text-violet-400 text-lg font-bold">â†’</span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Architecture Summary */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">24h</div>
              <div className="text-xs text-slate-500">Insight Refresh</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-violet-600">7-10 days</div>
              <div className="text-xs text-slate-500">Individual Calibration</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-cyan-600">128</div>
              <div className="text-xs text-slate-500">Bayesian Worlds/Run</div>
            </Card>
          </div>
        </div>
      </Section>

      {/* COMPLE Framework */}
      <Section title="Data Categories (COMPLE)" subtitle="How we structure health data" className="mt-8">
        <Grid columns={3} gap="md">
          {[
            {
              letter: 'C',
              name: 'Choices',
              desc: 'Behavioral inputs you control',
              color: { bg: 'bg-violet-50', border: 'border-violet-200', letter: 'bg-violet-100 text-violet-700', badge: 'bg-violet-100 text-violet-600' },
              datafields: ['Caffeine intake (mg, time)', 'Alcohol (units, time)', 'Supplements taken', 'Meal timing', 'Exercise type & duration', 'Screen time', 'Meditation minutes']
            },
            {
              letter: 'O',
              name: 'Outcomes',
              desc: 'Health results we measure',
              color: { bg: 'bg-emerald-50', border: 'border-emerald-200', letter: 'bg-emerald-100 text-emerald-700', badge: 'bg-emerald-100 text-emerald-600' },
              datafields: ['Sleep efficiency %', 'Deep sleep minutes', 'REM sleep minutes', 'Sleep latency', 'Energy score', 'Mood rating', 'Cognitive performance']
            },
            {
              letter: 'M',
              name: 'Markers',
              desc: 'Lab values & biomarkers',
              color: { bg: 'bg-rose-50', border: 'border-rose-200', letter: 'bg-rose-100 text-rose-700', badge: 'bg-rose-100 text-rose-600' },
              datafields: ['Fasting glucose', 'HbA1c', 'Lipid panel (LDL, HDL, Trig)', 'hsCRP', 'Cortisol', 'Testosterone', 'Vitamin D', 'Ferritin']
            },
            {
              letter: 'P',
              name: 'Physiology',
              desc: 'Real-time body signals',
              color: { bg: 'bg-cyan-50', border: 'border-cyan-200', letter: 'bg-cyan-100 text-cyan-700', badge: 'bg-cyan-100 text-cyan-600' },
              datafields: ['Heart rate variability (ms)', 'Resting heart rate', 'Body temperature', 'Blood oxygen (SpO2)', 'Respiratory rate', 'Blood pressure']
            },
            {
              letter: 'L',
              name: 'Loads',
              desc: 'Stressors on the system',
              color: { bg: 'bg-amber-50', border: 'border-amber-200', letter: 'bg-amber-100 text-amber-700', badge: 'bg-amber-100 text-amber-600' },
              datafields: ['Training load score', 'Strain score', 'Steps count', 'Active calories', 'Work stress rating', 'Travel (timezone shifts)', 'Illness/recovery']
            },
            {
              letter: 'E',
              name: 'Environment',
              desc: 'External context factors',
              color: { bg: 'bg-sky-50', border: 'border-sky-200', letter: 'bg-sky-100 text-sky-700', badge: 'bg-sky-100 text-sky-600' },
              datafields: ['Ambient temperature', 'Bedroom temperature', 'Humidity %', 'Air quality index', 'Light exposure (lux)', 'Barometric pressure', 'UV index']
            },
          ].map((item) => (
            <Card key={item.letter} className={`p-4 ${item.color.bg} border ${item.color.border}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${item.color.letter} rounded-lg flex items-center justify-center font-bold text-lg`}>
                  {item.letter}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {item.datafields.map((field) => (
                  <span key={field} className={`px-2 py-1 rounded-md text-xs font-medium ${item.color.badge}`}>
                    {field}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </Grid>
      </Section>
    </PageLayout>
  )
}

export default IntegrationView
