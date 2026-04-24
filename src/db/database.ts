import Dexie, { type EntityTable } from 'dexie'

export type Priority = 'low' | 'medium' | 'high' | 'epic'

export interface Task {
  id: string
  title: string
  description?: string
  priority: Priority
  tags: string[]
  dueDate?: string
  completedAt?: string
  createdAt: string
  xpReward: number
  isRecurring?: boolean
}

export interface Achievement {
  id: string
  key: string
  unlockedAt: string
}

export interface DailyLog {
  id: string
  date: string
  tasksCompleted: number
  xpEarned: number
}

export interface BossRecord {
  id: string
  weekKey: string
  bossName: string
  maxHp: number
  currentHp: number
  defeated: boolean
  defeatBonus: number
}

const db = new Dexie('ClaudeOrganizer') as Dexie & {
  tasks: EntityTable<Task, 'id'>
  achievements: EntityTable<Achievement, 'id'>
  dailyLogs: EntityTable<DailyLog, 'id'>
  bossRecords: EntityTable<BossRecord, 'id'>
}

db.version(1).stores({
  tasks: 'id, completedAt, dueDate, priority, createdAt',
  achievements: 'id, key, unlockedAt',
  dailyLogs: 'id, date',
  bossRecords: 'id, weekKey',
})

export default db
