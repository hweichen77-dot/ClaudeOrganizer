export type SkillTreeId = 'warrior' | 'scholar' | 'streakMaster' | 'tactician'

export interface SkillNode {
  id: string
  tree: SkillTreeId
  name: string
  description: string
  icon: string
  tier: number
  maxPoints: number
  requires?: string
}

export const SKILL_TREES: SkillNode[] = [
  // Warrior — bonus XP for high/epic tasks
  { id: 'warrior_1', tree: 'warrior', name: 'Battle Hardened', description: '+10% XP from High tasks per point', icon: '⚔️', tier: 1, maxPoints: 3 },
  { id: 'warrior_2', tree: 'warrior', name: 'Epic Slayer', description: '+15% XP from Epic tasks per point', icon: '🗡️', tier: 2, maxPoints: 3, requires: 'warrior_1' },
  { id: 'warrior_3', tree: 'warrior', name: 'Berserker', description: 'Double XP on 3+ Epic tasks/day (once/day)', icon: '💢', tier: 3, maxPoints: 1, requires: 'warrior_2' },

  // Scholar — bonus for early completion
  { id: 'scholar_1', tree: 'scholar', name: 'Prepared', description: '+10% XP when completed before due date per point', icon: '📚', tier: 1, maxPoints: 3 },
  { id: 'scholar_2', tree: 'scholar', name: 'Speed Reader', description: '+10% XP for tasks completed same day as created per point', icon: '⚡', tier: 2, maxPoints: 3, requires: 'scholar_1' },
  { id: 'scholar_3', tree: 'scholar', name: 'Prescient', description: 'Tasks with due dates award +50% bonus XP', icon: '🔮', tier: 3, maxPoints: 1, requires: 'scholar_2' },

  // Streak Master — streak bonuses
  { id: 'streak_1', tree: 'streakMaster', name: 'Momentum', description: '+5% XP per day of active streak per point (max 50%)', icon: '🔥', tier: 1, maxPoints: 3 },
  { id: 'streak_2', tree: 'streakMaster', name: 'Iron Will', description: 'Streak Shield: skip 1 day without breaking streak (1 charge/week)', icon: '🛡️', tier: 2, maxPoints: 1, requires: 'streak_1' },
  { id: 'streak_3', tree: 'streakMaster', name: 'Eternal Flame', description: 'Streak milestones (7/14/30) award bonus XP', icon: '♾️', tier: 3, maxPoints: 1, requires: 'streak_2' },

  // Tactician — tag/category bonuses
  { id: 'tac_1', tree: 'tactician', name: 'Organized', description: '+10% XP for tagged tasks per point', icon: '🏷️', tier: 1, maxPoints: 3 },
  { id: 'tac_2', tree: 'tactician', name: 'Categorist', description: '+15% XP when task has 2+ tags per point', icon: '📊', tier: 2, maxPoints: 3, requires: 'tac_1' },
  { id: 'tac_3', tree: 'tactician', name: 'Grand Strategist', description: 'Boss battles: tagged tasks deal +50% damage', icon: '♟️', tier: 3, maxPoints: 1, requires: 'tac_2' },
]

export type SkillPoints = Record<string, number>

export function getSkillLevel(points: SkillPoints, nodeId: string): number {
  return points[nodeId] ?? 0
}

export function canUnlock(points: SkillPoints, node: SkillNode): boolean {
  if (node.requires && !points[node.requires]) return false
  return (points[node.id] ?? 0) < node.maxPoints
}

export function totalPointsSpent(points: SkillPoints): number {
  return Object.values(points).reduce((sum, v) => sum + v, 0)
}

export function getTreeBonus(points: SkillPoints, tree: SkillTreeId): number {
  return SKILL_TREES.filter(n => n.tree === tree).reduce((sum, n) => sum + (points[n.id] ?? 0), 0)
}
