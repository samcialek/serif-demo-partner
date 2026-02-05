import { useState } from 'react'
import { motion } from 'framer-motion'
import { Filter, LayoutGrid, List, Sparkles, Clock, TrendingUp, Target, Info, User, Calendar, Activity, Droplets, ChevronDown, SlidersHorizontal } from 'lucide-react'
import { PageLayout, Section, Grid } from '@/components/layout'
import { Card, Button, Toggle, Badge, Tooltip, PatientSelector, CertaintySlider } from '@/components/common'
import { InsightCard, InsightGrid } from '@/components/insights'
import { CertaintyIndicator, EvidenceWeight } from '@/components/charts'
import { useInsights, useInsightCategories, usePersona } from '@/hooks'
import { cn } from '@/utils/classNames'
import { INSIGHT_VARIABLE_TYPE_META } from '@/data/insights/types'
import type { InsightVariableType } from '@/types'

export function InsightsView() {
  const { activePersona } = usePersona()
  const {
    insights,
    allInsights,
    minCertainty,
    setMinCertainty,
    variableTypes,
    toggleVariableType,
    categories,
    toggleCategory,
    actionableOnly,
    setActionableOnly,
    totalCount,
    filteredCount,
    resetFilters,
    categoryStats,
  } = useInsights()

  const insightCategories = useInsightCategories()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showMoreFilters, setShowMoreFilters] = useState(false)

  // Get category counts for filter
  const categoryCounts = categoryStats.reduce((acc, stat) => {
    acc[stat.category] = stat.count
    return acc
  }, {} as Record<string, number>)

  // Get variable type counts from ALL insights (not filtered)
  const variableTypeCounts = allInsights.reduce((acc, insight) => {
    const type = insight.variableType
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Get top insights for hero section
  const topInsights = insights.slice(0, 3)

  const handleInsightAction = (insightId: string, action: string) => {
    console.log('Insight action:', insightId, action)
  }

  // Variable type icons
  const variableTypeIcons: Record<InsightVariableType, React.ReactNode> = {
    outcome: <Target className="w-5 h-5" />,
    load: <TrendingUp className="w-5 h-5" />,
    marker: <Activity className="w-5 h-5" />,
  }

  // Category config for pills
  const categoryConfig: Record<string, { label: string; emoji: string }> = {
    sleep: { label: 'Sleep', emoji: '😴' },
    metabolic: { label: 'Metabolic', emoji: '🔥' },
    recovery: { label: 'Recovery', emoji: '💪' },
    cognitive: { label: 'Cognitive', emoji: '🧠' },
    cardio: { label: 'Cardio', emoji: '❤️' },
    activity: { label: 'Activity', emoji: '🏃' },
    stress: { label: 'Stress', emoji: '🧘' },
    nutrition: { label: 'Nutrition', emoji: '🥗' },
  }

  const hasActiveFilters = variableTypes.length > 0 || categories.length > 0 || minCertainty > 0

  return (
    <PageLayout
      title="Your Insights"
      subtitle="Personalized discoveries powered by causal AI"
      actions={
        <div className="flex items-center gap-3">
          <PatientSelector />
          <div className="flex items-center border-2 border-black">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 border-l-2 border-black ${viewMode === 'list' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      }
    >
      {/* Persona Profile Card - BRUTALIST */}
      {activePersona && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card padding="none" className="overflow-hidden">
            {/* Color block header */}
            <div className="px-6 py-3 bg-black text-white">
              <span className="text-xs font-bold uppercase tracking-wider">Active Profile</span>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-6">
                {/* Profile Photo - BRUTALIST: square with border */}
                <div className="flex-shrink-0">
                  <img
                    src={activePersona.avatar}
                    alt={activePersona.name}
                    className="w-24 h-24 object-cover border-2 border-black"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-black text-black uppercase tracking-tight">{activePersona.name}</h2>
                    <Badge variant="outline">{activePersona.age} YRS</Badge>
                  </div>
                  <p className="text-lg font-bold text-emerald-600 uppercase tracking-wide mb-2">{activePersona.archetype}</p>
                  <p className="text-gray-600 mb-4">{activePersona.narrative}</p>

                  {/* Quick Stats - BRUTALIST: blocks */}
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 border-2 border-gray-200">
                      <Calendar className="w-4 h-4 text-black" />
                      <span className="text-sm font-bold text-black uppercase">{activePersona.daysOfData} Days</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 border-2 border-gray-200">
                      <Activity className="w-4 h-4 text-black" />
                      <span className="text-sm font-bold text-black uppercase">{activePersona.devices?.length || 0} Devices</span>
                    </div>
                    {activePersona.hasBloodwork && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-rose-50 border-2 border-rose-200">
                        <Droplets className="w-4 h-4 text-rose-600" />
                        <span className="text-sm font-bold text-rose-700 uppercase">{activePersona.labDraws} Lab Draws</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Variable Type Filter - Sticky Header - BRUTALIST */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="sticky top-0 z-20 -mx-6 px-6 py-4 bg-white border-b-2 border-black mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-black uppercase tracking-wider">Filter by Variable Type</h3>
            <Tooltip content="COMPLE Framework: Filter insights by the type of health variable they affect">
              <Info className="w-4 h-4 text-gray-400 cursor-help" />
            </Tooltip>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-black text-black">{filteredCount}</span>
            <span className="text-gray-500">of {totalCount} insights</span>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="ml-2 px-2 py-1 bg-black text-white text-xs font-bold uppercase hover:bg-gray-800"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Variable Type Cards - BRUTALIST */}
        <div className="grid grid-cols-3 gap-3">
          {(['outcome', 'load', 'marker'] as InsightVariableType[]).map((type) => {
            const meta = INSIGHT_VARIABLE_TYPE_META[type]
            const isSelected = variableTypes.length === 0 || variableTypes.includes(type)
            const count = variableTypeCounts[type] || 0

            return (
              <button
                key={type}
                onClick={() => toggleVariableType(type)}
                className={cn(
                  'relative flex items-center gap-3 p-3 text-left transition-all border-2',
                  isSelected
                    ? 'bg-white border-black'
                    : 'bg-gray-100 border-gray-200 opacity-50 hover:opacity-75'
                )}
              >
                <div
                  className="p-2 border-2"
                  style={{
                    backgroundColor: isSelected ? meta.color : '#F3F4F6',
                    borderColor: isSelected ? meta.color : '#E5E7EB'
                  }}
                >
                  <span className={isSelected ? 'text-white' : 'text-gray-400'}>
                    {variableTypeIcons[type]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn('font-bold uppercase tracking-wide text-sm', isSelected ? 'text-black' : 'text-gray-500')}>
                      {meta.label}
                    </span>
                    <span
                      className={cn(
                        'px-2 py-0.5 text-xs font-bold',
                        isSelected ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
                      )}
                    >
                      {count}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{meta.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* Featured Insight - BRUTALIST */}
      {topInsights[0] && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <Card padding="none" className="overflow-hidden">
            <div className="bg-black text-white">
              <div className="px-6 py-3 border-b-2 border-emerald-500">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Top Discovery</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black uppercase tracking-tight mb-2">{topInsights[0].title}</h3>
                <p className="text-gray-300 mb-4">{topInsights[0].summary || topInsights[0].headline}</p>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-2 bg-white/20 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${topInsights[0].certainty * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-emerald-400">{Math.round(topInsights[0].certainty * 100)}%</span>
                  </div>

                  {topInsights[0].recommendation && (
                    <div className="px-3 py-1.5 border-2 border-white/30 text-sm font-bold uppercase">
                      {topInsights[0].recommendation}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Secondary Filters Row - BRUTALIST */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Card padding="none">
          <div className="p-4 flex items-center justify-between flex-wrap gap-4">
            {/* Category Pills - BRUTALIST */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-1">Domain:</span>
              {insightCategories.map((cat) => {
                const config = categoryConfig[cat.category] || { label: cat.category, emoji: '📊' }
                const isSelected = categories.includes(cat.category)
                const count = categoryCounts[cat.category] || 0

                return (
                  <button
                    key={cat.category}
                    onClick={() => toggleCategory(cat.category)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-all border-2',
                      isSelected
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-black'
                    )}
                  >
                    <span>{config.emoji}</span>
                    <span>{config.label}</span>
                    <span className={cn(
                      'px-1.5 py-0.5 text-xs',
                      isSelected ? 'bg-white text-black' : 'bg-gray-100'
                    )}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* More Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowMoreFilters(!showMoreFilters)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-all border-2',
                  showMoreFilters
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-black'
                )}
              >
                <SlidersHorizontal className="w-4 h-4" />
                More Filters
                <ChevronDown className={cn('w-4 h-4 transition-transform', showMoreFilters && 'rotate-180')} />
              </button>
            </div>
          </div>

          {/* Expanded Filters - BRUTALIST */}
          {showMoreFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t-2 border-black"
            >
              <div className="grid grid-cols-2">
                {/* Certainty Slider */}
                <div className="p-4 border-r-2 border-black">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Min Certainty</label>
                    <span className="text-sm font-black text-black">{Math.round(minCertainty * 100)}%</span>
                  </div>
                  <CertaintySlider
                    value={Math.round(minCertainty * 100)}
                    onChange={(val) => setMinCertainty(val / 100)}
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    {minCertainty >= 0.7
                      ? 'High-confidence only'
                      : minCertainty >= 0.4
                      ? 'Moderate certainty'
                      : 'Including exploratory'}
                  </p>
                </div>

                {/* Actionable Toggle */}
                <div className="p-4 flex items-start gap-3">
                  <Toggle
                    label="Actionable only"
                    description="Show only insights with recommended actions"
                    checked={actionableOnly}
                    onToggle={setActionableOnly}
                    size="sm"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </Card>
      </motion.div>

      {/* Insights Grid - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        {insights.length > 0 ? (
          viewMode === 'grid' ? (
            <InsightGrid
              insights={insights}
              onInsightAction={handleInsightAction}
              variant="detailed"
            />
          ) : (
            <div className="space-y-3">
              {insights.map((insight) => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  variant="compact"
                  onAction={(action) => handleInsightAction(insight.id, action)}
                />
              ))}
            </div>
          )
        ) : (
          <Card padding="none" className="text-center">
            <div className="px-6 py-3 bg-gray-100 border-b-2 border-black">
              <span className="text-xs font-bold uppercase tracking-wider">No Results</span>
            </div>
            <div className="p-12">
              <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-500 mb-4 font-bold uppercase">
                No insights match your current filters.
              </p>
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </Card>
        )}
      </motion.div>
    </PageLayout>
  )
}

export default InsightsView
