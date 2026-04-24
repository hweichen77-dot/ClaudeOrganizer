import { motion } from 'framer-motion'
import { SKILL_TREES, canUnlock, getSkillLevel, type SkillTreeId } from '../lib/skillTree'
import { useGameStore } from '../stores/gameStore'

const TREE_META: Record<SkillTreeId, { label: string; icon: string; color: string }> = {
  warrior:     { label: 'Warrior',      icon: '⚔️', color: 'var(--color-danger)' },
  scholar:     { label: 'Scholar',      icon: '📚', color: 'oklch(57% 0.19 220)' },
  streakMaster:{ label: 'Streak Master',icon: '🔥', color: 'var(--color-warn)' },
  tactician:   { label: 'Tactician',    icon: '♟️', color: 'var(--color-accent)' },
}

const TREE_ORDER: SkillTreeId[] = ['warrior', 'scholar', 'streakMaster', 'tactician']

export default function SkillTree() {
  const skillPoints      = useGameStore(s => s.skillPoints)
  const skillPointsSpent = useGameStore(s => s.skillPointsSpent)
  const spendSkillPoint  = useGameStore(s => s.spendSkillPoint)

  const tiers = [1, 2, 3]

  return (
    <div style={{ padding: '28px 32px', maxWidth: 960, margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 22,
            color: 'var(--color-text)',
            letterSpacing: '0.05em',
          }}>
            SKILL TREE
          </h1>
          <p style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 2 }}>
            Invest points to unlock passive bonuses
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: skillPoints > 0 ? 'oklch(57% 0.19 264 / 0.15)' : 'var(--color-card)',
          border: `1px solid ${skillPoints > 0 ? 'oklch(57% 0.19 264 / 0.4)' : 'var(--color-border)'}`,
          borderRadius: 8,
          padding: '8px 14px',
        }}>
          <span style={{ fontSize: 16 }}>✦</span>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 22,
              color: skillPoints > 0 ? 'var(--color-accent)' : 'var(--color-muted)',
              lineHeight: 1,
            }}>
              {skillPoints}
            </div>
            <div style={{ fontSize: 10, color: 'var(--color-faint)', letterSpacing: '0.06em' }}>POINTS</div>
          </div>
        </div>
      </div>

      {/* Tree grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {TREE_ORDER.map(treeId => {
          const meta = TREE_META[treeId]
          const nodes = SKILL_TREES.filter(n => n.tree === treeId)

          return (
            <div key={treeId}>
              {/* Tree header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 12,
                padding: '10px 12px',
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
              }}>
                <span style={{ fontSize: 18 }}>{meta.icon}</span>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 13,
                  color: meta.color,
                  letterSpacing: '0.04em',
                }}>
                  {meta.label.toUpperCase()}
                </span>
              </div>

              {/* Nodes by tier */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {tiers.map((tier, ti) => {
                  const node = nodes.find(n => n.tier === tier)
                  if (!node) return null

                  const current   = getSkillLevel(skillPointsSpent, node.id)
                  const unlockable = canUnlock(skillPointsSpent, node) && skillPoints > 0
                  const maxed      = current >= node.maxPoints
                  const locked     = !!(node.requires && !skillPointsSpent[node.requires])

                  return (
                    <div key={node.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      {/* Connector */}
                      {ti > 0 && (
                        <div style={{
                          width: 1,
                          height: 16,
                          background: locked ? 'var(--color-border)' : meta.color,
                          opacity: locked ? 0.3 : 0.5,
                        }} />
                      )}

                      <motion.div
                        whileHover={unlockable ? { scale: 1.02 } : {}}
                        transition={{ duration: 0.15 }}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: maxed
                            ? `${meta.color}18`
                            : unlockable
                            ? 'var(--color-elevated)'
                            : 'var(--color-card)',
                          border: `1px solid ${maxed ? meta.color + '55' : unlockable ? 'var(--color-border)' : 'var(--color-border)'}`,
                          borderRadius: 8,
                          opacity: locked ? 0.4 : 1,
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 14 }}>{locked ? '🔒' : node.icon}</span>
                            <span style={{
                              fontFamily: 'var(--font-display)',
                              fontWeight: 700,
                              fontSize: 12,
                              color: maxed ? meta.color : 'var(--color-text)',
                              letterSpacing: '0.02em',
                            }}>
                              {node.name}
                            </span>
                          </div>
                          {/* Point pips */}
                          {node.maxPoints > 1 && (
                            <div style={{ display: 'flex', gap: 3 }}>
                              {Array.from({ length: node.maxPoints }).map((_, i) => (
                                <div key={i} style={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: '50%',
                                  background: i < current ? meta.color : 'var(--color-border)',
                                }} />
                              ))}
                            </div>
                          )}
                          {node.maxPoints === 1 && current === 1 && (
                            <span style={{ fontSize: 11, color: meta.color }}>✓</span>
                          )}
                        </div>

                        <p style={{ fontSize: 11, color: 'var(--color-muted)', lineHeight: 1.5, marginBottom: 8 }}>
                          {node.description}
                        </p>

                        {!maxed && !locked && (
                          <button
                            onClick={() => spendSkillPoint(node.id)}
                            disabled={!unlockable}
                            style={{
                              width: '100%',
                              padding: '5px',
                              borderRadius: 5,
                              border: `1px solid ${unlockable ? meta.color + '80' : 'var(--color-border)'}`,
                              background: unlockable ? `${meta.color}18` : 'transparent',
                              color: unlockable ? meta.color : 'var(--color-faint)',
                              cursor: unlockable ? 'pointer' : 'not-allowed',
                              fontFamily: 'var(--font-display)',
                              fontWeight: 700,
                              fontSize: 10,
                              letterSpacing: '0.08em',
                              transition: 'all 0.15s',
                            }}
                          >
                            {skillPoints === 0 ? 'NO POINTS' : 'INVEST'}
                          </button>
                        )}
                        {maxed && (
                          <div style={{
                            textAlign: 'center',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 700,
                            fontSize: 10,
                            letterSpacing: '0.08em',
                            color: meta.color,
                          }}>
                            MASTERED
                          </div>
                        )}
                      </motion.div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
