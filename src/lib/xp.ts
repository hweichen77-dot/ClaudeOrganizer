import type { Priority } from '../db/database'

export const RANKS = [
  { level: 1, name: 'Novice', minXp: 0 },
  { level: 2, name: 'Apprentice', minXp: 100 },
  { level: 3, name: 'Journeyman', minXp: 250 },
  { level: 4, name: 'Warrior', minXp: 500 },
  { level: 5, name: 'Knight', minXp: 900 },
  { level: 6, name: 'Veteran', minXp: 1400 },
  { level: 7, name: 'Champion', minXp: 2100 },
  { level: 8, name: 'Master', minXp: 3000 },
  { level: 9, name: 'Grandmaster', minXp: 4200 },
  { level: 10, name: 'Legend', minXp: 6000 },
]

export const XP_REWARDS: Record<Priority, number> = {
  low: 10,
  medium: 25,
  high: 50,
  epic: 100,
}

export function getRankForXp(xp: number) {
  let rank = RANKS[0]
  for (const r of RANKS) {
    if (xp >= r.minXp) rank = r
  }
  return rank
}

export function getNextRank(level: number) {
  return RANKS.find(r => r.level === level + 1) ?? null
}

export function xpProgressInLevel(totalXp: number): { current: number; needed: number; pct: number } {
  const rank = getRankForXp(totalXp)
  const next = getNextRank(rank.level)
  if (!next) return { current: 0, needed: 0, pct: 1 }
  const current = totalXp - rank.minXp
  const needed = next.minXp - rank.minXp
  return { current, needed, pct: current / needed }
}

export function calcXpReward(priority: Priority, skillBonuses: SkillBonuses, dueDate?: string): number {
  let base = XP_REWARDS[priority]
  if ((priority === 'high' || priority === 'epic') && skillBonuses.warrior > 0) {
    base = Math.round(base * (1 + skillBonuses.warrior * 0.1))
  }
  if (dueDate) {
    const now = new Date()
    const due = new Date(dueDate)
    if (now <= due && skillBonuses.scholar > 0) {
      base = Math.round(base * (1 + skillBonuses.scholar * 0.1))
    }
  }
  return base
}

export interface SkillBonuses {
  warrior: number
  scholar: number
  streakMaster: number
  tactician: number
}
