export interface BossDef {
  name: string
  icon: string
  flavor: string
  baseHp: number
  defeatBonus: number
}

export const BOSS_ROSTER: BossDef[] = [
  { name: 'The Procrastinator', icon: '🦥', flavor: 'A sluggish beast that feeds on delay', baseHp: 200, defeatBonus: 150 },
  { name: 'Chaos Drake', icon: '🐉', flavor: 'Spews disorder into your schedule', baseHp: 300, defeatBonus: 200 },
  { name: 'The Overwhelmer', icon: '🌊', flavor: 'Drowns you in tasks before you begin', baseHp: 400, defeatBonus: 250 },
  { name: 'Distraction Demon', icon: '👾', flavor: 'Steals your focus one ping at a time', baseHp: 350, defeatBonus: 225 },
  { name: 'The Burnout', icon: '💀', flavor: 'Ancient and exhausted — but still dangerous', baseHp: 500, defeatBonus: 350 },
]

export function getWeekKey(date = new Date()): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - d.getDay())
  return d.toISOString().split('T')[0]
}

export function getBossForWeek(_weekKey: string, weekNumber: number): BossDef {
  return BOSS_ROSTER[weekNumber % BOSS_ROSTER.length]
}

export function damageFromPriority(priority: string): number {
  const dmg: Record<string, number> = { low: 10, medium: 20, high: 35, epic: 60 }
  return dmg[priority] ?? 10
}

export function bossHpForWeek(baseBossHp: number, weeksSinceStart: number): number {
  return Math.round(baseBossHp * (1 + weeksSinceStart * 0.1))
}
