import { useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { motion } from 'framer-motion'
import { v4 as uuid } from 'uuid'
import { getWeekKey, BOSS_ROSTER, getBossForWeek } from '../lib/boss'
import BossHpBar from '../components/ui/BossHpBar'
import db from '../db/database'
import { isThisWeek } from 'date-fns'

export default function BossPage() {
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

  const weekKey = getWeekKey()
  const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000))
  const currentDef = BOSS_ROSTER[weekNum % BOSS_ROSTER.length]

  const bossRecord = useLiveQuery(() =>
    db.bossRecords.where('weekKey').equals(weekKey).first(),
    [weekKey]
  )

  const attackLog = useLiveQuery(async () => {
    const all = await db.tasks.filter(t => !!t.completedAt).toArray()
    return all
      .filter(t => {
        try { return isThisWeek(new Date(t.completedAt!), { weekStartsOn: 0 }) }
        catch { return false }
      })
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
      .slice(0, 8)
  }, [])

  const PRIORITY_DMG: Record<string, number> = { low: 10, medium: 20, high: 35, epic: 60 }
  const PRIORITY_COLOR: Record<string, string> = {
    low: 'var(--color-faint)',
    medium: 'oklch(57% 0.19 220)',
    high: 'var(--color-warn)',
    epic: 'var(--color-accent)',
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 720, margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 22,
          color: 'var(--color-text)',
          letterSpacing: '0.05em',
        }}>
          WEEKLY ENCOUNTER
        </h1>
        <p style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 2 }}>
          Complete tasks to damage the boss. Defeat it before the week ends.
        </p>
      </div>

      {/* Boss card */}
      {bossRecord ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 24 }}
        >
          <BossHpBar record={bossRecord} def={currentDef} />
        </motion.div>
      ) : (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 12,
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
          <p style={{ color: 'var(--color-muted)', fontSize: 14 }}>Summoning this week's boss...</p>
        </div>
      )}

      {/* Damage reference */}
      <div style={{
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 10,
        padding: '16px',
        marginBottom: 20,
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: '0.1em',
          color: 'var(--color-faint)',
          marginBottom: 12,
        }}>
          DAMAGE TABLE
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {Object.entries(PRIORITY_DMG).map(([p, dmg]) => (
            <div key={p} style={{
              padding: '10px 8px',
              background: 'var(--color-elevated)',
              borderRadius: 6,
              textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: PRIORITY_COLOR[p] }}>
                {dmg}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 10, color: 'var(--color-faint)', letterSpacing: '0.06em', marginTop: 2 }}>
                {p.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attack log */}
      {attackLog && attackLog.length > 0 && (
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
            ATTACK LOG
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {attackLog.map((task, i) => (
              <div key={task.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderTop: i > 0 ? '1px solid var(--color-border)' : undefined,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 10,
                    color: PRIORITY_COLOR[task.priority],
                    background: `${PRIORITY_COLOR[task.priority]}22`,
                    padding: '2px 6px',
                    borderRadius: 3,
                    flexShrink: 0,
                    letterSpacing: '0.06em',
                  }}>
                    {task.priority.toUpperCase()}
                  </span>
                  <span style={{
                    fontSize: 13,
                    color: 'var(--color-text)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {task.title}
                  </span>
                </div>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 13,
                  color: 'var(--color-danger)',
                  flexShrink: 0,
                  marginLeft: 12,
                }}>
                  -{PRIORITY_DMG[task.priority]} HP
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
