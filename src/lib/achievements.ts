export interface AchievementDef {
  key: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  condition: (stats: AchievementStats) => boolean
}

export interface AchievementStats {
  totalTasks: number
  currentStreak: number
  maxStreak: number
  level: number
  totalXp: number
  tasksToday: number
  epicTasksDone: number
  bossesDefeated: number
  skillPointsSpent: number
  tagsUsed: number
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    key: 'first_task',
    name: 'First Step',
    description: 'Complete your first task',
    icon: '⚡',
    rarity: 'common',
    condition: s => s.totalTasks >= 1,
  },
  {
    key: 'ten_tasks',
    name: 'Getting Serious',
    description: 'Complete 10 tasks',
    icon: '🔥',
    rarity: 'common',
    condition: s => s.totalTasks >= 10,
  },
  {
    key: 'century_club',
    name: 'Century Club',
    description: 'Complete 100 tasks',
    icon: '💯',
    rarity: 'rare',
    condition: s => s.totalTasks >= 100,
  },
  {
    key: 'on_fire',
    name: 'On Fire',
    description: 'Reach a 3-day streak',
    icon: '🔥',
    rarity: 'common',
    condition: s => s.currentStreak >= 3,
  },
  {
    key: 'week_warrior',
    name: 'Week Warrior',
    description: 'Reach a 7-day streak',
    icon: '🗡️',
    rarity: 'rare',
    condition: s => s.currentStreak >= 7,
  },
  {
    key: 'unstoppable',
    name: 'Unstoppable',
    description: 'Reach a 30-day streak',
    icon: '🌪️',
    rarity: 'legendary',
    condition: s => s.currentStreak >= 30,
  },
  {
    key: 'level_5',
    name: 'Knight Rising',
    description: 'Reach level 5',
    icon: '⚔️',
    rarity: 'rare',
    condition: s => s.level >= 5,
  },
  {
    key: 'legend',
    name: 'Legend',
    description: 'Reach level 10',
    icon: '👑',
    rarity: 'legendary',
    condition: s => s.level >= 10,
  },
  {
    key: 'speed_runner',
    name: 'Speed Runner',
    description: 'Complete 5 tasks in one day',
    icon: '⚡',
    rarity: 'rare',
    condition: s => s.tasksToday >= 5,
  },
  {
    key: 'epic_slayer',
    name: 'Epic Slayer',
    description: 'Complete 10 Epic priority tasks',
    icon: '💎',
    rarity: 'epic',
    condition: s => s.epicTasksDone >= 10,
  },
  {
    key: 'boss_killer',
    name: 'Boss Killer',
    description: 'Defeat your first weekly boss',
    icon: '🐉',
    rarity: 'epic',
    condition: s => s.bossesDefeated >= 1,
  },
  {
    key: 'dragon_lord',
    name: 'Dragon Lord',
    description: 'Defeat 5 weekly bosses',
    icon: '🏰',
    rarity: 'legendary',
    condition: s => s.bossesDefeated >= 5,
  },
  {
    key: 'skill_learner',
    name: 'Skill Learner',
    description: 'Spend your first skill point',
    icon: '🌱',
    rarity: 'common',
    condition: s => s.skillPointsSpent >= 1,
  },
  {
    key: 'tagged_up',
    name: 'Tagged Up',
    description: 'Use tags on 5 tasks',
    icon: '🏷️',
    rarity: 'common',
    condition: s => s.tagsUsed >= 5,
  },
  {
    key: 'xp_hoarder',
    name: 'XP Hoarder',
    description: 'Earn 5000 total XP',
    icon: '💰',
    rarity: 'epic',
    condition: s => s.totalXp >= 5000,
  },
]
