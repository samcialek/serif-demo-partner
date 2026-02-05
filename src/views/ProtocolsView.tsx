import { useState } from 'react'
import { motion } from 'framer-motion'
import { FlaskConical, Bell, Coffee, Moon, Activity, Zap, Clock, ChevronRight, AlertTriangle, CheckCircle, Stethoscope } from 'lucide-react'
import { PageLayout, Section, Grid } from '@/components/layout'
import { Card, Button, TabGroup, Badge, PatientSelector } from '@/components/common'
import { ProtocolList, WhatIfSimulator, ProtocolTimeline, DailyGoals, SafeguardsDrawer, getDemoSuppressedActions, PreVisitBrief } from '@/components/protocols'
import { SleepPredictionWaterfall } from '@/components/charts'
import { useProtocols, usePersona, useInsights } from '@/hooks'

// Live trigger notifications mock data
const liveTriggers = [
  {
    id: 1,
    type: 'action',
    icon: Coffee,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
    title: 'Last call for caffeine',
    message: 'Your personalized 2:15 PM cutoff is in 45 minutes',
    time: '1:30 PM',
    urgent: true,
  },
  {
    id: 2,
    type: 'recovery',
    icon: Activity,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    title: 'Recovery window open',
    message: 'HRV is elevated - good time for Zone 2 training',
    time: '10:00 AM',
    urgent: false,
  },
  {
    id: 3,
    type: 'metabolic',
    icon: Zap,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    title: 'Eating window closes soon',
    message: 'Last meal by 7:00 PM for optimal glucose response',
    time: '6:15 PM',
    urgent: false,
  },
  {
    id: 4,
    type: 'sleep',
    icon: Moon,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    title: 'Wind-down reminder',
    message: 'Screen cutoff in 30 minutes for 10:30 PM bedtime',
    time: '9:30 PM',
    urgent: false,
  },
]


// Timeline actions will be built from actual protocol data

// Causal model mock data
const causalDrivers = [
  { label: 'Baseline (traits)', value: 62, color: 'bg-gray-400' },
  { label: 'Actions (today)', value: 18, color: 'bg-primary-500' },
  { label: 'States (current)', value: 20, color: 'bg-purple-500' },
]

export function ProtocolsView() {
  const { activePersona } = usePersona()
  const {
    protocols,
    protocolsByStatus,
    category,
    setCategory,
    activeCount,
    suggestedCount,
  } = useProtocols()
  const { allInsights } = useInsights()

  const [activeTab, setActiveTab] = useState<'today' | 'active' | 'suggested' | 'simulator' | 'provider'>('today')
  const [showSimulator, setShowSimulator] = useState(false)

  // Build timeline actions from active protocols - include ALL actions (active and inactive)
  const timelineActions = protocolsByStatus.active.flatMap(protocol =>
    protocol.actions.map(action => ({
      id: action.id,
      label: action.label,
      category: action.category,
      isActive: action.isActive,
      impact: action.impact,
      time: action.time,
      actionType: action.actionType,
      startTime: action.startTime,
      endTime: action.endTime,
      linkedInsightId: action.linkedInsightId,
    }))
  )

  const tabs = [
    { value: 'today', label: "Today's Plan" },
    { value: 'active', label: 'Active', count: activeCount },
    { value: 'suggested', label: 'Suggested', count: suggestedCount },
    { value: 'simulator', label: 'What-If' },
    { value: 'provider', label: 'Provider Brief', icon: <Stethoscope className="w-4 h-4" /> },
  ]

  const handleProtocolAction = (protocolId: string, action: string) => {
    console.log('Protocol action:', protocolId, action)
    if (action === 'simulate') {
      setActiveTab('simulator')
    }
  }

  return (
    <PageLayout
      title="Your Protocols"
      subtitle="Personalized daily plans that adapt to your context"
      actions={
        <div className="flex items-center gap-3">
          <PatientSelector />
          <Button onClick={() => setActiveTab('simulator')}>
            <FlaskConical className="w-4 h-4 mr-2" />
            Try What-If
          </Button>
        </div>
      }
    >
      {/* Waterfall Decomposition */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <SleepPredictionWaterfall />
      </motion.div>

      {/* Safeguards Drawer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <SafeguardsDrawer suppressedActions={getDemoSuppressedActions()} />
      </motion.div>

      {/* Tabs */}
      <TabGroup
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(value) => setActiveTab(value as typeof activeTab)}
        variant="underline"
        className="mb-6"
      />

      <div className="flex gap-6">
        {/* Main content */}
        <div className="flex-1">
          {activeTab === 'today' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Full-width Protocol Timeline with duration bars and cutoff markers */}
              <ProtocolTimeline
                protocolName={activePersona?.name ? `${activePersona.name}'s Daily Protocol` : 'Daily Protocol'}
                actions={timelineActions}
                insights={allInsights}
                className="w-full"
              />

              {/* Daily Goals */}
              <DailyGoals actions={timelineActions} />

              {/* Live Triggers */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Live Triggers
                </h3>
                <div className="space-y-3">
                  {liveTriggers.map((trigger) => {
                    const Icon = trigger.icon
                    return (
                      <Card
                        key={trigger.id}
                        className={`p-4 ${trigger.urgent ? 'border-amber-200 bg-amber-50/50' : ''}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-lg ${trigger.bgColor}`}>
                            <Icon className={`w-5 h-5 ${trigger.color}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900">{trigger.title}</h4>
                              {trigger.urgent && (
                                <Badge variant="warning" size="sm">Soon</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{trigger.message}</p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            {trigger.time}
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Today's Protocol Summary */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Key Actions for Today
                </h3>
                <Grid columns={2} gap="md">
                  {protocolsByStatus.active.slice(0, 4).map((protocol) => (
                    <Card key={protocol.id} className="p-4 hover:border-primary-200 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{protocol.name}</h4>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{protocol.description || protocol.outcome}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" size="sm">{protocol.category}</Badge>
                        <span className="text-xs text-gray-500">{protocol.evidenceLevel ?? 80}% confidence</span>
                      </div>
                    </Card>
                  ))}
                </Grid>
              </div>
            </motion.div>
          )}

          {activeTab === 'active' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {protocolsByStatus.active.length > 0 ? (
                <ProtocolList
                  protocols={protocolsByStatus.active}
                  onProtocolAction={handleProtocolAction}
                />
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-gray-500 mb-4">
                    No active protocols. Check the suggested protocols to get started.
                  </p>
                  <Button onClick={() => setActiveTab('suggested')}>
                    View Suggestions
                  </Button>
                </Card>
              )}
            </motion.div>
          )}

          {activeTab === 'suggested' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {protocolsByStatus.suggested.length > 0 ? (
                <>
                  <Card className="p-4 mb-4 bg-gradient-to-r from-primary-50 to-white border-primary-100">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <Zap className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-900">Personalized Suggestions</h4>
                        <p className="text-sm text-primary-700">
                          These protocols are tailored to your unique patterns and thresholds.
                        </p>
                      </div>
                    </div>
                  </Card>
                  <ProtocolList
                    protocols={protocolsByStatus.suggested}
                    onProtocolAction={handleProtocolAction}
                  />
                </>
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-gray-500">
                    No new protocols suggested at this time. Keep tracking your data!
                  </p>
                </Card>
              )}
            </motion.div>
          )}

          {activeTab === 'simulator' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <WhatIfSimulator />
            </motion.div>
          )}

          {activeTab === 'provider' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <PreVisitBrief />
            </motion.div>
          )}
        </div>

        {/* Sidebar - Rolling state (for non-simulator and non-provider tabs) */}
        {activeTab !== 'simulator' && activeTab !== 'provider' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-72 flex-shrink-0"
          >
            <Card className="p-4 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4">Current State</h3>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Readiness</span>
                    <span className="font-medium text-green-600">High</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Recovery</span>
                    <span className="font-medium text-primary-600">Optimal</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Stress Load</span>
                    <span className="font-medium text-amber-600">Moderate</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Sleep Debt</span>
                    <span className="font-medium text-gray-600">-1.2 hrs</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-400 rounded-full" style={{ width: '30%' }} />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  States update in real-time based on your wearable data and logged activities.
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </PageLayout>
  )
}

export default ProtocolsView
