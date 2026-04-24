import { motion } from 'framer-motion'
import { useGameStore, levelFromXp } from '../../stores/gameStore'
import { xpProgressInLevel, getRankForXp, getNextRank } from '../../lib/xp'

export default function XpBar() {
  const totalXp = useGameStore(s => s.totalXp)
  const level   = levelFromXp(totalXp)
  const rank    = getRankForXp(totalXp)
  const next    = getNextRank(level)
  const { current, needed, pct } = xpProgressInLevel(totalXp)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {/* Level badge */}
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 8,
        background: 'oklch(57% 0.19 264 / 0.15)',
        border: '1px solid oklch(57% 0.19 264 / 0.3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 9, fontWeight: 700, color: 'var(--color-accent)', letterSpacing: '0.08em', lineHeight: 1 }}>LVL</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--color-accent)', lineHeight: 1.1 }}>{level}</span>
      </div>

      {/* Bar section */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--color-text)', letterSpacing: '0.03em' }}>
            {rank.name}
          </span>
          {next ? (
            <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>
              {current.toLocaleString()} / {needed.toLocaleString()} XP
            </span>
          ) : (
            <span style={{ fontSize: 12, color: 'var(--color-gold)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>MAX RANK</span>
          )}
        </div>
        <div style={{ height: 6, background: 'var(--color-border)', borderRadius: 3, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct * 100}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: '100%', background: 'var(--color-accent)', borderRadius: 3 }}
          />
        </div>
        {next && (
          <div style={{ marginTop: 4, fontSize: 11, color: 'var(--color-faint)' }}>
            → {next.name} at {next.minXp.toLocaleString()} XP
          </div>
        )}
      </div>

      {/* Total XP */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--color-gold)', lineHeight: 1 }}>
          {totalXp.toLocaleString()}
        </div>
        <div style={{ fontSize: 10, color: 'var(--color-muted)', letterSpacing: '0.06em', marginTop: 2 }}>TOTAL XP</div>
      </div>
    </div>
  )
}
