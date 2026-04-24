import { useLiveQuery } from 'dexie-react-hooks'
import { motion } from 'framer-motion'
import db from '../db/database'

interface AchievementMeta {
  key: string
  name: string
  icon: string
  description: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

const ACHIEVEMENT_META: AchievementMeta[] = [
  { key: 'first_task',   name: 'First Blood',     icon: '⚔️', description: 'Complete your first task',               rarity: 'common' },
  { key: 'ten_tasks',    name: 'Veteran',          icon: '🪖', description: 'Complete 10 tasks',                      rarity: 'common' },
  { key: 'century_club', name: 'Century Club',     icon: '💯', description: 'Complete 100 tasks',                     rarity: 'rare' },
  { key: 'on_fire',      name: 'On Fire',          icon: '🔥', description: 'Maintain a 3-day streak',                rarity: 'common' },
  { key: 'week_warrior', name: 'Week Warrior',     icon: '📅', description: 'Maintain a 7-day streak',                rarity: 'rare' },
  { key: 'unstoppable',  name: 'Unstoppable',      icon: '♾️', description: 'Maintain a 30-day streak',               rarity: 'legendary' },
  { key: 'level_5',      name: 'Hardened',         icon: '🛡️', description: 'Reach level 5',                         rarity: 'common' },
  { key: 'legend',       name: 'Legend',           icon: '👑', description: 'Reach max level (10)',                   rarity: 'legendary' },
  { key: 'speed_runner', name: 'Speed Runner',     icon: '⚡', description: 'Complete 5 tasks in a single day',      rarity: 'rare' },
  { key: 'epic_slayer',  name: 'Epic Slayer',      icon: '🗡️', description: 'Complete 10 epic-priority tasks',       rarity: 'epic' },
  { key: 'boss_killer',  name: 'Boss Killer',      icon: '🐉', description: 'Defeat your first weekly boss',         rarity: 'epic' },
  { key: 'dragon_lord',  name: 'Dragon Lord',      icon: '🏰', description: 'Defeat 5 weekly bosses',                rarity: 'legendary' },
  { key: 'skill_learner',name: 'Skill Learner',    icon: '🌳', description: 'Spend your first skill point',          rarity: 'common' },
  { key: 'tagged_up',    name: 'Organised',        icon: '🏷️', description: 'Tag at least 5 tasks',                 rarity: 'rare' },
  { key: 'xp_hoarder',   name: 'XP Hoarder',       icon: '💰', description: 'Earn 1000 total XP',                    rarity: 'epic' },
]

const RARITY_STYLE: Record<string, { label: string; color: string; bg: string; border: string }> = {
  common:    { label: 'Common',    color: 'var(--color-muted)',   bg: 'var(--color-card)',     border: 'var(--color-border)' },
  rare:      { label: 'Rare',      color: 'oklch(57% 0.19 220)',  bg: 'oklch(57% 0.19 220 / 0.08)', border: 'oklch(57% 0.19 220 / 0.3)' },
  epic:      { label: 'Epic',      color: 'var(--color-accent)',  bg: 'oklch(57% 0.19 264 / 0.08)', border: 'oklch(57% 0.19 264 / 0.3)' },
  legendary: { label: 'Legendary', color: 'var(--color-gold)',    bg: 'oklch(73% 0.155 68 / 0.08)', border: 'oklch(73% 0.155 68 / 0.35)' },
}

export default function AchievementsPage() {
  const unlocked = useLiveQuery(() => db.achievements.toArray(), []) ?? []
  const unlockedKeys = new Set(unlocked.map(a => a.key))
  const unlockedCount = unlocked.length

  return (
    <div style={{ padding: '28px 32px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
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
            ACHIEVEMENTS
          </h1>
          <p style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 2 }}>
            {unlockedCount} / {ACHIEVEMENT_META.length} unlocked
          </p>
        </div>
        {/* Progress bar */}
        <div style={{ width: 160 }}>
          <div style={{ height: 4, background: 'var(--color-border)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(unlockedCount / ACHIEVEMENT_META.length) * 100}%`,
              background: 'var(--color-gold)',
              borderRadius: 2,
              transition: 'width 0.6s ease',
            }} />
          </div>
          <div style={{ fontSize: 10, color: 'var(--color-faint)', marginTop: 4, textAlign: 'right' }}>
            {Math.round((unlockedCount / ACHIEVEMENT_META.length) * 100)}% complete
          </div>
        </div>
      </div>

      {/* Grid — varied by rarity */}
      {(['legendary', 'epic', 'rare', 'common'] as const).map(rarity => {
        const items = ACHIEVEMENT_META.filter(a => a.rarity === rarity)
        const style = RARITY_STYLE[rarity]

        return (
          <div key={rarity} style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: '0.1em',
                color: style.color,
              }}>
                {style.label.toUpperCase()}
              </span>
              <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 10,
            }}>
              {items.map(achievement => {
                const isUnlocked = unlockedKeys.has(achievement.key)
                const unlockedAt = unlocked.find(u => u.key === achievement.key)?.unlockedAt

                return (
                  <motion.div
                    key={achievement.key}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      padding: '14px',
                      background: isUnlocked ? style.bg : 'var(--color-card)',
                      border: `1px solid ${isUnlocked ? style.border : 'var(--color-border)'}`,
                      borderRadius: 8,
                      opacity: isUnlocked ? 1 : 0.45,
                      filter: isUnlocked ? 'none' : 'grayscale(0.5)',
                      transition: 'opacity 0.3s, filter 0.3s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>
                        {isUnlocked ? achievement.icon : '🔒'}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: 'var(--font-display)',
                          fontWeight: 700,
                          fontSize: 13,
                          color: isUnlocked ? style.color : 'var(--color-muted)',
                          letterSpacing: '0.02em',
                          marginBottom: 3,
                        }}>
                          {achievement.name}
                        </div>
                        <p style={{ fontSize: 11, color: 'var(--color-faint)', lineHeight: 1.5 }}>
                          {achievement.description}
                        </p>
                        {isUnlocked && unlockedAt && (
                          <div style={{ fontSize: 10, color: style.color, marginTop: 5, opacity: 0.7 }}>
                            Unlocked {new Date(unlockedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
