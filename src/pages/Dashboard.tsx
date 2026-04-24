import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { motion } from 'framer-motion'
import { isToday } from 'date-fns'
import { useGameStore } from '../stores/gameStore'
import { useTasks, completeTask, deleteTask } from '../hooks/useTasks'
import { getWeekKey, BOSS_ROSTER } from '../lib/boss'
import XpBar from '../components/ui/XpBar'
import TaskCard from '../components/ui/TaskCard'
import BossHpBar from '../components/ui/BossHpBar'
import CreateTaskModal from '../components/ui/CreateTaskModal'
import db from '../db/database'
import type { Task } from '../db/database'

function StatRow({ icon, label, value, accent }: { icon: string; label: string; value: string | number; accent?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
      <span style={{ fontSize: 13, color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>{icon}</span>{label}
      </span>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 15,
        color: accent || 'var(--color-text)',
      }}>
        {value}
      </span>
    </div>
  )
}

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false)

  const tasks        = useTasks()
  const streak    = useGameStore(s => s.streak)
  const dailyGoal = useGameStore(s => s.dailyGoal)

  const todayLog = useLiveQuery(async () => {
    const today = new Date().toISOString().split('T')[0]
    return db.dailyLogs.where('date').equals(today).first()
  }, [])

  const weekBoss = useLiveQuery(async () => {
    const weekKey = getWeekKey()
    const record = await db.bossRecords.where('weekKey').equals(weekKey).first()
    if (!record) return null
    const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000))
    const def = BOSS_ROSTER[weekNum % BOSS_ROSTER.length]
    return { record, def }
  }, [])

  const completedToday = tasks.filter(t => t.completedAt && isToday(new Date(t.completedAt)))
  const activeTasks    = tasks.filter(t => !t.completedAt).slice(0, 6)
  const goalPct        = Math.min(1, completedToday.length / dailyGoal)

  async function handleComplete(task: Task) {
    await completeTask(task)
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 920, margin: '0 auto', width: '100%' }}>
      {/* XP bar */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 10,
          padding: '16px 20px',
          marginBottom: 28,
        }}
      >
        <XpBar />
      </motion.div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>

        {/* Left: Active missions */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 16,
              color: 'var(--color-text)',
              letterSpacing: '0.06em',
            }}>
              ACTIVE MISSIONS
              <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--color-muted)', fontWeight: 400 }}>
                ({activeTasks.length})
              </span>
            </h2>
            <button
              onClick={() => setModalOpen(true)}
              style={{
                padding: '7px 14px',
                borderRadius: 6,
                border: '1px solid var(--color-accent)',
                background: 'oklch(57% 0.19 264 / 0.1)',
                color: 'var(--color-accent)',
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: '0.06em',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'oklch(57% 0.19 264 / 0.2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'oklch(57% 0.19 264 / 0.1)')}
            >
              + NEW
            </button>
          </div>

          {activeTasks.length === 0 ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 10,
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✓</div>
              <p style={{ color: 'var(--color-muted)', fontSize: 14 }}>No active missions.</p>
              <p style={{ color: 'var(--color-faint)', fontSize: 12, marginTop: 4 }}>Add a task to begin your quest.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {activeTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={() => handleComplete(task)}
                  onDelete={() => deleteTask(task.id)}
                />
              ))}
            </div>
          )}

          {/* Completed today */}
          {completedToday.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 12,
                color: 'var(--color-faint)',
                letterSpacing: '0.08em',
                marginBottom: 10,
              }}>
                COMPLETED TODAY
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {completedToday.slice(0, 4).map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={() => {}}
                    onDelete={() => deleteTask(task.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Status panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Field report */}
          <div style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 10,
            padding: '16px',
          }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: '0.1em',
              color: 'var(--color-faint)',
              marginBottom: 8,
            }}>
              FIELD REPORT
            </div>
            <div style={{ borderTop: '1px solid var(--color-border)' }}>
              <StatRow icon="🔥" label="Streak"     value={`${streak}d`}          accent="var(--color-warn)" />
              <div style={{ height: 1, background: 'var(--color-border)' }} />
              <StatRow icon="✓"  label="Done today" value={completedToday.length} accent="var(--color-success)" />
              <div style={{ height: 1, background: 'var(--color-border)' }} />
              <StatRow icon="⚡" label="XP today"   value={`+${todayLog?.xpEarned ?? 0}`} accent="var(--color-gold)" />
            </div>
            {/* Daily goal progress */}
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  🎯 Daily Goal
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, color: goalPct >= 1 ? 'var(--color-success)' : 'var(--color-text)' }}>
                  {completedToday.length}/{dailyGoal}
                </span>
              </div>
              <div style={{ height: 5, background: 'var(--color-border)', borderRadius: 3, overflow: 'hidden' }}>
                <motion.div
                  animate={{ width: `${goalPct * 100}%` }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: '100%', background: goalPct >= 1 ? 'var(--color-success)' : 'var(--color-accent)', borderRadius: 3 }}
                />
              </div>
            </div>
          </div>

          {/* Weekly boss mini */}
          {weekBoss && (
            <div style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 10,
              padding: '16px',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: '0.1em',
                color: 'var(--color-faint)',
                marginBottom: 12,
              }}>
                WEEKLY ENEMY
              </div>
              <BossHpBar record={weekBoss.record} def={weekBoss.def} compact />
            </div>
          )}
        </div>
      </div>

      <CreateTaskModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
