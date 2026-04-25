import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SkillPoints } from '../lib/skillTree'
import { getTreeBonus } from '../lib/skillTree'
import type { GearItem, GearSlot } from '../lib/gear'

export interface Notification {
  id: string
  type: 'xp' | 'levelup' | 'achievement' | 'boss' | 'streak'
  message: string
  icon?: string
  xpAmount?: number
}

interface GameState {
  totalXp: number
  skillPoints: number
  skillPointsSpent: SkillPoints
  streak: number
  maxStreak: number
  lastActiveDate: string | null
  streakShieldAvailable: boolean
  streakShieldUsedThisWeek: boolean
  dailyGoal: number
  username: string
  onboardingDone: boolean
  notifications: Notification[]
  epicTasksDoneToday: number
  berserkerUsedToday: boolean
  equippedGear: Partial<Record<GearSlot, GearItem>>
  lootCrateAvailable: boolean
  lastLootCrateDate: string | null

  addXp: (amount: number) => void
  spendSkillPoint: (nodeId: string) => void
  updateStreak: () => void
  useStreakShield: () => void
  resetDailyState: () => void
  setDailyGoal: (goal: number) => void
  setUsername: (name: string) => void
  completeOnboarding: () => void
  addNotification: (n: Omit<Notification, 'id'>) => void
  dismissNotification: (id: string) => void
  incrementEpicToday: () => void
  equipGear: (item: GearItem) => void
  unequipGear: (slot: GearSlot) => void
  markLootCrateAvailable: () => void
  claimLootCrate: () => void
}

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

export const useGameStore = create<GameState>()(
  persist(
    (set, _get) => ({
      totalXp: 0,
      skillPoints: 0,
      skillPointsSpent: {},
      streak: 0,
      maxStreak: 0,
      lastActiveDate: null,
      streakShieldAvailable: true,
      streakShieldUsedThisWeek: false,
      dailyGoal: 3,
      username: 'Hero',
      onboardingDone: false,
      notifications: [],
      epicTasksDoneToday: 0,
      berserkerUsedToday: false,
      equippedGear: {},
      lootCrateAvailable: false,
      lastLootCrateDate: null,

      addXp: (amount) => {
        set(s => {
          const newXp = s.totalXp + amount
          const prevLevel = levelFromXp(s.totalXp)
          const newLevel = levelFromXp(newXp)
          const gained = newLevel - prevLevel
          const newSkillPoints = s.skillPoints + gained
          const notifs: Notification[] = []
          if (gained > 0) {
            notifs.push({ id: crypto.randomUUID(), type: 'levelup', message: `Level ${newLevel}!`, icon: '⬆️' })
          }
          return {
            totalXp: newXp,
            skillPoints: newSkillPoints,
            notifications: [...s.notifications, ...notifs],
          }
        })
      },

      spendSkillPoint: (nodeId) => {
        set(s => {
          if (s.skillPoints <= 0) return s
          const prev = s.skillPointsSpent[nodeId] ?? 0
          return {
            skillPoints: s.skillPoints - 1,
            skillPointsSpent: { ...s.skillPointsSpent, [nodeId]: prev + 1 },
          }
        })
      },

      updateStreak: () => {
        set(s => {
          const today = todayStr()
          if (s.lastActiveDate === today) return s
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayStr = yesterday.toISOString().split('T')[0]
          let newStreak = s.streak
          if (s.lastActiveDate === yesterdayStr) {
            newStreak = s.streak + 1
          } else if (s.lastActiveDate && s.lastActiveDate < yesterdayStr) {
            if (s.streakShieldAvailable && !s.streakShieldUsedThisWeek) {
              newStreak = s.streak
            } else {
              newStreak = 1
            }
          } else {
            newStreak = 1
          }
          const maxStreak = Math.max(s.maxStreak, newStreak)
          const notifs: Notification[] = []
          if ([3, 7, 14, 30].includes(newStreak)) {
            notifs.push({ id: crypto.randomUUID(), type: 'streak', message: `${newStreak}-day streak! 🔥`, icon: '🔥' })
          }
          return { streak: newStreak, maxStreak, lastActiveDate: today, notifications: [...s.notifications, ...notifs] }
        })
      },

      useStreakShield: () => set(_s => ({ streakShieldAvailable: false, streakShieldUsedThisWeek: true })),

      resetDailyState: () => set({ epicTasksDoneToday: 0, berserkerUsedToday: false }),

      setDailyGoal: (goal) => set({ dailyGoal: goal }),
      setUsername: (name) => set({ username: name }),
      completeOnboarding: () => set({ onboardingDone: true }),

      addNotification: (n) => set(s => ({
        notifications: [...s.notifications, { ...n, id: crypto.randomUUID() }],
      })),

      dismissNotification: (id) => set(s => ({
        notifications: s.notifications.filter(n => n.id !== id),
      })),

      incrementEpicToday: () => set(s => ({ epicTasksDoneToday: s.epicTasksDoneToday + 1 })),

      equipGear: (item) => set(s => ({
        equippedGear: { ...s.equippedGear, [item.slot]: item },
      })),

      unequipGear: (slot) => set(s => {
        const next = { ...s.equippedGear }
        delete next[slot]
        return { equippedGear: next }
      }),

      markLootCrateAvailable: () => set({
        lootCrateAvailable: true,
        lastLootCrateDate: todayStr(),
      }),

      claimLootCrate: () => set({ lootCrateAvailable: false }),
    }),
    { name: 'claude-organizer-game' }
  )
)

export function levelFromXp(xp: number): number {
  const thresholds = [0, 100, 250, 500, 900, 1400, 2100, 3000, 4200, 6000]
  let level = 1
  for (let i = 0; i < thresholds.length; i++) {
    if (xp >= thresholds[i]) level = i + 1
  }
  return level
}

export function getSkillBonuses(points: SkillPoints) {
  return {
    warrior: getTreeBonus(points, 'warrior'),
    scholar: getTreeBonus(points, 'scholar'),
    streakMaster: getTreeBonus(points, 'streakMaster'),
    tactician: getTreeBonus(points, 'tactician'),
  }
}
