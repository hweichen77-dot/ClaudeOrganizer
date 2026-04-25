import { useLiveQuery } from 'dexie-react-hooks'
import { v4 as uuid } from 'uuid'
import db, { type Task } from '../db/database'
import { useGameStore, getSkillBonuses } from '../stores/gameStore'
import { calcXpReward } from '../lib/xp'
import { ACHIEVEMENTS, type AchievementStats } from '../lib/achievements'
import { damageFromPriority, getWeekKey } from '../lib/boss'
import { getEquippedBonuses } from '../lib/gear'
import { isToday, startOfDay } from 'date-fns'

export function useTasks() {
  const tasks = useLiveQuery(() => db.tasks.orderBy('createdAt').reverse().toArray(), [])
  return tasks ?? []
}

export function useCompletedToday() {
  const tasks = useLiveQuery(
    () => db.tasks.filter(t => !!t.completedAt && isToday(new Date(t.completedAt))).toArray(),
    []
  )
  return tasks ?? []
}

export async function createTask(data: Omit<Task, 'id' | 'createdAt' | 'xpReward'> & { skillBonuses?: ReturnType<typeof getSkillBonuses> }) {
  const { skillBonuses, ...rest } = data
  const bonuses = skillBonuses ?? { warrior: 0, scholar: 0, streakMaster: 0, tactician: 0 }
  const xpReward = calcXpReward(rest.priority, bonuses, rest.dueDate)
  const task: Task = { ...rest, id: uuid(), createdAt: new Date().toISOString(), xpReward }
  await db.tasks.add(task)
  return task
}

export async function completeTask(task: Task) {
  const completedAt = new Date().toISOString()
  await db.tasks.update(task.id, { completedAt })

  const store = useGameStore.getState()
  const bonuses = getSkillBonuses(store.skillPointsSpent)
  const gearBonuses = getEquippedBonuses(store.equippedGear)

  let xp = calcXpReward(task.priority, bonuses, task.dueDate)

  // Streak bonus
  if (bonuses.streakMaster > 0) {
    const pct = Math.min(0.5, store.streak * 0.05 * bonuses.streakMaster)
    xp = Math.round(xp * (1 + pct))
  }

  // Tactician bonus
  if (task.tags.length > 0 && bonuses.tactician > 0) {
    xp = Math.round(xp * (1 + bonuses.tactician * 0.1))
  }
  if (task.tags.length >= 2 && bonuses.tactician > 0) {
    xp = Math.round(xp * (1 + bonuses.tactician * 0.15))
  }

  // Gear XP bonus
  if (gearBonuses.xpBonus > 0) {
    xp = Math.round(xp * (1 + gearBonuses.xpBonus))
  }

  store.addNotification({ type: 'xp', message: `+${xp} XP`, xpAmount: xp, icon: '⚡' })
  store.addXp(xp)
  store.updateStreak()

  if (task.priority === 'epic') store.incrementEpicToday()

  // Boss damage
  const weekKey = getWeekKey()
  const boss = await db.bossRecords.where('weekKey').equals(weekKey).first()
  if (boss && !boss.defeated) {
    let dmg = damageFromPriority(task.priority)
    if (task.tags.length > 0) {
      const tacNode3 = store.skillPointsSpent['tac_3'] ?? 0
      if (tacNode3 > 0) dmg = Math.round(dmg * 1.5)
    }
    // Gear boss damage bonus
    if (gearBonuses.bossDamage > 0) {
      dmg = Math.round(dmg * (1 + gearBonuses.bossDamage))
    }
    const newHp = Math.max(0, boss.currentHp - dmg)
    const defeated = newHp === 0
    await db.bossRecords.update(boss.id, { currentHp: newHp, defeated })
    if (defeated) {
      store.addXp(boss.defeatBonus)
      store.addNotification({ type: 'boss', message: `Boss defeated! +${boss.defeatBonus} XP`, icon: '🐉' })
    }
  }

  // Update daily log
  const today = new Date().toISOString().split('T')[0]
  const existing = await db.dailyLogs.where('date').equals(today).first()
  if (existing) {
    await db.dailyLogs.update(existing.id, {
      tasksCompleted: existing.tasksCompleted + 1,
      xpEarned: existing.xpEarned + xp,
    })
  } else {
    await db.dailyLogs.add({ id: uuid(), date: today, tasksCompleted: 1, xpEarned: xp })
  }

  // Loot crate unlock: check if all of today's tasks are now complete
  const todayStart = startOfDay(new Date()).toISOString()
  const todayTasks = await db.tasks.filter(t => t.createdAt >= todayStart).toArray()
  const allDone = todayTasks.length > 0 && todayTasks.every(t => !!t.completedAt)
  if (allDone && store.lastLootCrateDate !== today) {
    store.markLootCrateAvailable()
    store.addNotification({ type: 'achievement', message: '📦 Loot Crate unlocked! All tasks complete!', icon: '📦' })
  }

  await checkAchievements()
}

export async function deleteTask(id: string) {
  await db.tasks.delete(id)
}

async function checkAchievements() {
  const store = useGameStore.getState()
  const allTasks = await db.tasks.toArray()
  const completedTasks = allTasks.filter(t => t.completedAt)
  const today = new Date().toISOString().split('T')[0]
  const todayTasks = completedTasks.filter(t => t.completedAt!.startsWith(today))
  const bosses = await db.bossRecords.filter(b => b.defeated).count()
  const tagged = allTasks.filter(t => t.tags.length > 0)

  const stats: AchievementStats = {
    totalTasks: completedTasks.length,
    currentStreak: store.streak,
    maxStreak: store.maxStreak,
    level: levelFromXpLocal(store.totalXp),
    totalXp: store.totalXp,
    tasksToday: todayTasks.length,
    epicTasksDone: completedTasks.filter(t => t.priority === 'epic').length,
    bossesDefeated: bosses,
    skillPointsSpent: Object.values(store.skillPointsSpent).reduce((a, b) => a + b, 0),
    tagsUsed: tagged.length,
  }

  const existing = await db.achievements.toArray()
  const existingKeys = new Set(existing.map(a => a.key))

  for (const def of ACHIEVEMENTS) {
    if (!existingKeys.has(def.key) && def.condition(stats)) {
      await db.achievements.add({ id: uuid(), key: def.key, unlockedAt: new Date().toISOString() })
      store.addNotification({ type: 'achievement', message: `${def.icon} ${def.name}`, icon: def.icon })
    }
  }
}

function levelFromXpLocal(xp: number): number {
  const thresholds = [0, 100, 250, 500, 900, 1400, 2100, 3000, 4200, 6000]
  let level = 1
  for (let i = 0; i < thresholds.length; i++) {
    if (xp >= thresholds[i]) level = i + 1
  }
  return level
}
