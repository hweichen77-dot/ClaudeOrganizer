import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore, type Notification } from '../../stores/gameStore'

const COLORS: Record<Notification['type'], { bg: string; border: string; text: string }> = {
  xp:          { bg: 'oklch(65% 0.17 162 / 0.12)', border: 'oklch(65% 0.17 162 / 0.4)', text: 'var(--color-success)' },
  levelup:     { bg: 'oklch(73% 0.155 68 / 0.12)',  border: 'oklch(73% 0.155 68 / 0.4)', text: 'var(--color-gold)' },
  achievement: { bg: 'oklch(57% 0.19 264 / 0.12)', border: 'oklch(57% 0.19 264 / 0.4)', text: 'var(--color-accent)' },
  boss:        { bg: 'oklch(58% 0.22 28 / 0.12)',  border: 'oklch(58% 0.22 28 / 0.4)',  text: 'var(--color-danger)' },
  streak:      { bg: 'oklch(68% 0.16 55 / 0.12)',  border: 'oklch(68% 0.16 55 / 0.4)',  text: 'var(--color-warn)' },
}

function Toast({ n }: { n: Notification }) {
  const dismiss = useGameStore(s => s.dismissNotification)
  const c = COLORS[n.type]

  useEffect(() => {
    const t = setTimeout(() => dismiss(n.id), 3000)
    return () => clearTimeout(t)
  }, [n.id, dismiss])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => dismiss(n.id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 14px',
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 8,
        cursor: 'pointer',
        backdropFilter: 'blur(8px)',
        minWidth: 180,
        maxWidth: 260,
      }}
    >
      {n.icon && <span style={{ fontSize: 16, lineHeight: 1 }}>{n.icon}</span>}
      <span style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: 13,
        color: c.text,
        letterSpacing: '0.03em',
      }}>
        {n.message}
      </span>
    </motion.div>
  )
}

export default function NotificationToast() {
  const notifications = useGameStore(s => s.notifications)

  return (
    <div style={{
      position: 'fixed',
      top: 16,
      right: 16,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      pointerEvents: 'none',
    }}>
      <AnimatePresence mode="popLayout">
        {notifications.slice(-5).map(n => (
          <div key={n.id} style={{ pointerEvents: 'auto' }}>
            <Toast n={n} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
