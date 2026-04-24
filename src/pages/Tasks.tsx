import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { v4 as uuid } from 'uuid'
import { useTasks, completeTask, deleteTask } from '../hooks/useTasks'
import { getWeekKey, getBossForWeek } from '../lib/boss'
import TaskCard from '../components/ui/TaskCard'
import CreateTaskModal from '../components/ui/CreateTaskModal'
import db from '../db/database'

type Filter = 'all' | 'active' | 'completed'

export default function Tasks() {
  const [filter, setFilter]   = useState<Filter>('active')
  const [modalOpen, setModal] = useState(false)
  const tasks = useTasks()

  // Init weekly boss on mount
  useEffect(() => {
    async function init() {
      const weekKey = getWeekKey()
      const existing = await db.bossRecords.where('weekKey').equals(weekKey).first()
      if (existing) return
      const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000))
      const def = getBossForWeek(weekKey, weekNum)
      await db.bossRecords.add({
        id: uuid(),
        weekKey,
        bossName: def.name,
        maxHp: def.baseHp,
        currentHp: def.baseHp,
        defeated: false,
        defeatBonus: def.defeatBonus,
      })
    }
    init()
  }, [])

  const filtered = tasks.filter(t => {
    if (filter === 'active')    return !t.completedAt
    if (filter === 'completed') return !!t.completedAt
    return true
  })

  const activeCount    = tasks.filter(t => !t.completedAt).length
  const completedCount = tasks.filter(t => !!t.completedAt).length

  const TABS: { key: Filter; label: string; count: number }[] = [
    { key: 'active',    label: 'Active',    count: activeCount },
    { key: 'completed', label: 'Completed', count: completedCount },
    { key: 'all',       label: 'All',       count: tasks.length },
  ]

  return (
    <div style={{ padding: '28px 32px', maxWidth: 720, margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 22,
            color: 'var(--color-text)',
            letterSpacing: '0.05em',
          }}>
            MISSION LOG
          </h1>
          <p style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 2 }}>
            {tasks.length} total missions
          </p>
        </div>
        <button
          onClick={() => setModal(true)}
          style={{
            padding: '9px 18px',
            borderRadius: 7,
            border: 'none',
            background: 'var(--color-accent)',
            color: 'white',
            cursor: 'pointer',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: '0.06em',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-accent-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-accent)')}
        >
          + NEW MISSION
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{
        display: 'flex',
        gap: 0,
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 8,
        padding: 3,
        marginBottom: 20,
        width: 'fit-content',
      }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: 'none',
              background: filter === tab.key ? 'var(--color-elevated)' : 'transparent',
              color: filter === tab.key ? 'var(--color-text)' : 'var(--color-muted)',
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              fontWeight: filter === tab.key ? 700 : 500,
              fontSize: 13,
              letterSpacing: '0.04em',
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {tab.label}
            <span style={{
              background: filter === tab.key ? 'oklch(57% 0.19 264 / 0.2)' : 'var(--color-border)',
              color: filter === tab.key ? 'var(--color-accent)' : 'var(--color-faint)',
              borderRadius: 10,
              fontSize: 10,
              padding: '1px 6px',
              fontWeight: 700,
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Task list */}
      {filtered.length === 0 ? (
        <div style={{
          padding: '60px 20px',
          textAlign: 'center',
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 10,
        }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>
            {filter === 'active' ? '⚔️' : filter === 'completed' ? '🏆' : '📋'}
          </div>
          <p style={{ color: 'var(--color-muted)', fontSize: 14 }}>
            {filter === 'active' ? 'No active missions. Add one to begin.' :
             filter === 'completed' ? 'No completed missions yet.' :
             'No missions found.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <AnimatePresence mode="popLayout">
            {filtered.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={() => completeTask(task)}
                onDelete={() => deleteTask(task.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <CreateTaskModal open={modalOpen} onClose={() => setModal(false)} />
    </div>
  )
}
