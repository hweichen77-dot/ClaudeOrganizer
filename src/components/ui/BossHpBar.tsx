import { motion } from 'framer-motion'
import type { BossRecord } from '../../db/database'
import type { BossDef } from '../../lib/boss'

interface Props {
  record: BossRecord
  def: BossDef
  compact?: boolean
}

export default function BossHpBar({ record, def, compact = false }: Props) {
  const pct = record.maxHp > 0 ? record.currentHp / record.maxHp : 0

  if (compact) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: record.defeated ? 'var(--color-success)' : 'var(--color-danger)', letterSpacing: '0.03em' }}>
            {def.icon} {record.bossName}
          </span>
          <span style={{ fontSize: 11, color: 'var(--color-muted)' }}>
            {record.defeated ? 'DEFEATED' : `${record.currentHp} / ${record.maxHp}`}
          </span>
        </div>
        <div style={{ height: 4, background: 'var(--color-border)', borderRadius: 2, overflow: 'hidden' }}>
          <motion.div
            animate={{ width: record.defeated ? '0%' : `${pct * 100}%` }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: '100%', background: 'var(--color-danger)', borderRadius: 2 }}
          />
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      {record.defeated && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'oklch(65% 0.17 162 / 0.06)',
          border: '1px solid oklch(65% 0.17 162 / 0.3)',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 22,
            color: 'var(--color-success)',
            letterSpacing: '0.12em',
          }}>
            ✓ DEFEATED
          </span>
        </div>
      )}

      <div style={{
        padding: '20px 24px',
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 12,
        opacity: record.defeated ? 0.6 : 1,
      }}>
        {/* Boss header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 10,
            background: 'oklch(58% 0.22 28 / 0.1)',
            border: '1px solid oklch(58% 0.22 28 / 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            flexShrink: 0,
          }}>
            {def.icon}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 20,
              color: 'var(--color-text)',
              letterSpacing: '0.04em',
              marginBottom: 4,
            }}>
              {record.bossName}
            </h3>
            <p style={{ fontSize: 13, color: 'var(--color-muted)', fontStyle: 'italic' }}>
              {def.flavor}
            </p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--color-danger)', lineHeight: 1 }}>
              {record.currentHp}
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-faint)', letterSpacing: '0.06em' }}>/ {record.maxHp} HP</div>
          </div>
        </div>

        {/* HP bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 10, color: 'var(--color-faint)', letterSpacing: '0.08em' }}>HEALTH</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 10, color: 'var(--color-danger)', letterSpacing: '0.04em' }}>
              {Math.round(pct * 100)}%
            </span>
          </div>
          <div style={{ height: 10, background: 'var(--color-border)', borderRadius: 5, overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${pct * 100}%` }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ height: '100%', background: 'var(--color-danger)', borderRadius: 5 }}
            />
          </div>
        </div>

        {/* Defeat bonus */}
        {!record.defeated && (
          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'var(--color-gold)' }}>★</span>
            Defeat reward: <span style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>+{record.defeatBonus} XP</span>
          </div>
        )}
      </div>
    </div>
  )
}
