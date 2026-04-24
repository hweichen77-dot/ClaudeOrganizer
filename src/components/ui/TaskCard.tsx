import { motion } from 'framer-motion'
import type { Task, Priority } from '../../db/database'

const PRIORITY_STYLE: Record<Priority, { label: string; color: string; bg: string }> = {
  low:    { label: 'LOW',    color: 'var(--color-muted)',   bg: 'oklch(52% 0.018 264 / 0.15)' },
  medium: { label: 'MED',   color: 'oklch(57% 0.19 220)',  bg: 'oklch(57% 0.19 220 / 0.15)' },
  high:   { label: 'HIGH',  color: 'var(--color-warn)',    bg: 'oklch(68% 0.16 55 / 0.15)' },
  epic:   { label: 'EPIC',  color: 'var(--color-accent)',  bg: 'oklch(57% 0.19 264 / 0.18)' },
}

interface Props {
  task: Task
  onComplete: () => void
  onDelete: () => void
}

export default function TaskCard({ task, onComplete, onDelete }: Props) {
  const done = !!task.completedAt
  const p = PRIORITY_STYLE[task.priority]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: done ? 0.55 : 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      whileHover={done ? {} : { scale: 1.005 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '12px 14px',
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 8,
      }}
    >
      {/* Complete button */}
      <button
        onClick={done ? undefined : onComplete}
        disabled={done}
        style={{
          width: 22,
          height: 22,
          borderRadius: 5,
          border: done ? 'none' : '1.5px solid var(--color-border)',
          background: done ? 'var(--color-success)' : 'transparent',
          cursor: done ? 'default' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: 1,
          transition: 'border-color 0.15s, background 0.15s',
          color: 'white',
          fontSize: 12,
        }}
        onMouseEnter={e => { if (!done) (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-success)' }}
        onMouseLeave={e => { if (!done) (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)' }}
      >
        {done ? '✓' : null}
      </button>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 14,
            color: done ? 'var(--color-faint)' : 'var(--color-text)',
            textDecoration: done ? 'line-through' : 'none',
            letterSpacing: '0.02em',
          }}>
            {task.title}
          </span>
          {/* Priority badge */}
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 10,
            letterSpacing: '0.08em',
            color: p.color,
            background: p.bg,
            padding: '1px 6px',
            borderRadius: 3,
          }}>
            {p.label}
          </span>
        </div>

        {/* Tags + meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5, flexWrap: 'wrap' }}>
          {task.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 11,
              color: 'var(--color-muted)',
              background: 'var(--color-elevated)',
              padding: '1px 7px',
              borderRadius: 10,
            }}>
              {tag}
            </span>
          ))}
          {task.dueDate && (
            <span style={{ fontSize: 11, color: 'var(--color-faint)' }}>
              Due {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      </div>

      {/* XP reward */}
      <div style={{ flexShrink: 0, textAlign: 'right' }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 13,
          color: done ? 'var(--color-faint)' : 'var(--color-gold)',
        }}>
          +{task.xpReward}
        </span>
        <span style={{ fontSize: 10, color: 'var(--color-faint)', marginLeft: 2 }}>XP</span>
      </div>

      {/* Delete */}
      <button
        onClick={onDelete}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-faint)',
          fontSize: 14,
          padding: '2px 4px',
          borderRadius: 4,
          flexShrink: 0,
          transition: 'color 0.15s',
          lineHeight: 1,
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-danger)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-faint)')}
        title="Delete task"
      >
        ✕
      </button>
    </motion.div>
  )
}
