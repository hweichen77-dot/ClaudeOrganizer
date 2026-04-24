import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createTask } from '../../hooks/useTasks'
import { useGameStore, getSkillBonuses } from '../../stores/gameStore'
import type { Priority } from '../../db/database'

interface Props {
  open: boolean
  onClose: () => void
}

const PRIORITIES: Priority[] = ['low', 'medium', 'high', 'epic']

const PRIORITY_XP: Record<Priority, number> = { low: 10, medium: 25, high: 50, epic: 100 }

export default function CreateTaskModal({ open, onClose }: Props) {
  const [title, setTitle]       = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [tags, setTags]         = useState('')
  const [dueDate, setDueDate]   = useState('')
  const [saving, setSaving]     = useState(false)

  const skillPointsSpent = useGameStore(s => s.skillPointsSpent)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    const skillBonuses = getSkillBonuses(skillPointsSpent)
    await createTask({
      title: title.trim(),
      priority,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      dueDate: dueDate || undefined,
      skillBonuses,
    })
    setTitle('')
    setPriority('medium')
    setTags('')
    setDueDate('')
    setSaving(false)
    onClose()
  }

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdrop}
          style={{
            position: 'fixed', inset: 0,
            background: 'oklch(0% 0 0 / 0.7)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: '0 0 32px',
          }}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'var(--color-elevated)',
              border: '1px solid var(--color-border)',
              borderRadius: 12,
              width: '100%',
              maxWidth: 480,
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--color-text)', letterSpacing: '0.04em' }}>
                NEW MISSION
              </h2>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Title */}
              <div>
                <label style={labelStyle}>Mission Title</label>
                <input
                  autoFocus
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  required
                  style={inputStyle}
                />
              </div>

              {/* Priority */}
              <div>
                <label style={labelStyle}>Priority</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {PRIORITIES.map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      style={{
                        flex: 1,
                        padding: '7px 4px',
                        borderRadius: 6,
                        border: `1px solid ${priority === p ? 'var(--color-accent)' : 'var(--color-border)'}`,
                        background: priority === p ? 'oklch(57% 0.19 264 / 0.15)' : 'transparent',
                        color: priority === p ? 'var(--color-accent)' : 'var(--color-muted)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: 11,
                        letterSpacing: '0.06em',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div>{p.toUpperCase()}</div>
                      <div style={{ fontWeight: 400, fontSize: 10, marginTop: 2, color: priority === p ? 'var(--color-gold)' : 'var(--color-faint)' }}>
                        +{PRIORITY_XP[p]}xp
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label style={labelStyle}>Tags <span style={{ color: 'var(--color-faint)', fontWeight: 400 }}>(comma-separated)</span></label>
                <input
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="work, health, learning"
                  style={inputStyle}
                />
              </div>

              {/* Due date */}
              <div>
                <label style={labelStyle}>Due Date <span style={{ color: 'var(--color-faint)', fontWeight: 400 }}>(optional)</span></label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  style={{ ...inputStyle, colorScheme: 'dark' }}
                />
              </div>

              <button
                type="submit"
                disabled={saving || !title.trim()}
                style={{
                  marginTop: 4,
                  padding: '11px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'var(--color-accent)',
                  color: 'white',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: '0.06em',
                  cursor: saving || !title.trim() ? 'not-allowed' : 'pointer',
                  opacity: saving || !title.trim() ? 0.5 : 1,
                  transition: 'opacity 0.15s',
                }}
              >
                {saving ? 'ADDING...' : 'ADD MISSION'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-display)',
  fontWeight: 600,
  fontSize: 11,
  letterSpacing: '0.08em',
  color: 'var(--color-muted)',
  marginBottom: 6,
  textTransform: 'uppercase',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  background: 'var(--color-card)',
  border: '1px solid var(--color-border)',
  borderRadius: 6,
  color: 'var(--color-text)',
  fontSize: 14,
  outline: 'none',
  transition: 'border-color 0.15s',
}
