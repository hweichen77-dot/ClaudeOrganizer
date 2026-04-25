import { v4 as uuid } from 'uuid'

export type GearSlot = 'helmet' | 'chest' | 'legs' | 'boots' | 'gloves' | 'weapon' | 'offhand' | 'ring' | 'amulet'
export type GearRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

export interface GearStats {
  xpBonus: number        // additive multiplier, e.g. 0.10 = +10% XP
  bossDamage: number     // additive multiplier, e.g. 0.15 = +15% boss dmg
  streakShield: number   // extra shield charges (integer)
  luck: number           // improves loot crate rarity rolls
  taskSpeed: number      // reserved
}

export interface GearItem {
  id: string
  name: string
  slot: GearSlot
  rarity: GearRarity
  stats: GearStats
  icon: string
  flavorText: string
}

export const RARITY_COLORS: Record<GearRarity, string> = {
  common:    'text-slate-300 border-slate-500',
  uncommon:  'text-green-400 border-green-500',
  rare:      'text-blue-400 border-blue-500',
  epic:      'text-purple-400 border-purple-500',
  legendary: 'text-yellow-400 border-yellow-500',
}

export const RARITY_GLOW: Record<GearRarity, string> = {
  common:    '',
  uncommon:  'shadow-green-500/30',
  rare:      'shadow-blue-500/40',
  epic:      'shadow-purple-500/50',
  legendary: 'shadow-yellow-500/60',
}

export const SLOT_LABELS: Record<GearSlot, string> = {
  helmet:  'Helmet',
  chest:   'Chest',
  legs:    'Legs',
  boots:   'Boots',
  gloves:  'Gloves',
  weapon:  'Weapon',
  offhand: 'Off-hand',
  ring:    'Ring',
  amulet:  'Amulet',
}

export const SLOT_ICONS: Record<GearSlot, string> = {
  helmet:  '⛑',
  chest:   '🥋',
  legs:    '👖',
  boots:   '👢',
  gloves:  '🧤',
  weapon:  '⚔️',
  offhand: '🛡',
  ring:    '💍',
  amulet:  '📿',
}

function s(xpBonus = 0, bossDamage = 0, streakShield = 0, luck = 0): GearStats {
  return { xpBonus, bossDamage, streakShield, luck, taskSpeed: 0 }
}

// Master gear pool — keyed IDs for stable references
export const GEAR_POOL: Record<GearSlot, GearItem[]> = {
  helmet: [
    { id: 'helm_c1', name: 'Leather Cap',        slot: 'helmet', rarity: 'common',    icon: '🪖', flavorText: 'Worn but serviceable.',                  stats: s(0.02) },
    { id: 'helm_u1', name: 'Chain Coif',          slot: 'helmet', rarity: 'uncommon',  icon: '⛑', flavorText: 'Rattles a little. Still works.',         stats: s(0.05) },
    { id: 'helm_r1', name: 'Iron Helm',           slot: 'helmet', rarity: 'rare',      icon: '🪖', flavorText: 'Heavy, but your enemies feel it too.',   stats: s(0.10, 0.05) },
    { id: 'helm_e1', name: 'Mithril Crown',       slot: 'helmet', rarity: 'epic',      icon: '👑', flavorText: 'Forged from the tears of champions.',    stats: s(0.15, 0.10) },
    { id: 'helm_l1', name: 'Crown of the Ancients', slot: 'helmet', rarity: 'legendary', icon: '👑', flavorText: 'Kings have died wearing this.',       stats: s(0.25, 0.15) },
  ],
  chest: [
    { id: 'chest_c1', name: 'Padded Vest',        slot: 'chest', rarity: 'common',    icon: '🥋', flavorText: 'Better than nothing.',                   stats: s(0, 0.03) },
    { id: 'chest_u1', name: 'Chainmail',          slot: 'chest', rarity: 'uncommon',  icon: '🥋', flavorText: 'Rings interlock. So does your resolve.',  stats: s(0, 0.08) },
    { id: 'chest_r1', name: 'Plate Cuirass',      slot: 'chest', rarity: 'rare',      icon: '🥋', flavorText: 'A ton of steel. Worth every pound.',      stats: s(0.05, 0.15) },
    { id: 'chest_e1', name: 'Dragon Scale Armor', slot: 'chest', rarity: 'epic',      icon: '🥋', flavorText: 'Scales from a slain wyvern.',             stats: s(0.08, 0.22) },
    { id: 'chest_l1', name: 'Aegis of Champions', slot: 'chest', rarity: 'legendary', icon: '🥋', flavorText: 'None who wore this were ever defeated.',  stats: s(0.12, 0.32) },
  ],
  legs: [
    { id: 'legs_c1', name: 'Cloth Trousers',      slot: 'legs', rarity: 'common',    icon: '👖', flavorText: 'At least they have pockets.',             stats: s(0.02) },
    { id: 'legs_u1', name: 'Leather Leggings',    slot: 'legs', rarity: 'uncommon',  icon: '👖', flavorText: 'Supple and silent.',                      stats: s(0.05) },
    { id: 'legs_r1', name: 'Chain Greaves',       slot: 'legs', rarity: 'rare',      icon: '👖', flavorText: 'The links never break. Neither do you.',   stats: s(0.08, 0.05) },
    { id: 'legs_e1', name: 'Titan Legplates',     slot: 'legs', rarity: 'epic',      icon: '👖', flavorText: 'Worn by giants. You feel taller.',         stats: s(0.12, 0.10) },
    { id: 'legs_l1', name: "Warlord's Tassets",   slot: 'legs', rarity: 'legendary', icon: '👖', flavorText: 'The battlefield parted for their wearer.',  stats: s(0.20, 0.15) },
  ],
  boots: [
    { id: 'boots_c1', name: 'Worn Boots',         slot: 'boots', rarity: 'common',    icon: '👢', flavorText: 'A thousand miles on these soles.',        stats: s(0, 0.02) },
    { id: 'boots_u1', name: 'Swift Boots',        slot: 'boots', rarity: 'uncommon',  icon: '👢', flavorText: 'Speed is its own armor.',                 stats: s(0.02, 0.05) },
    { id: 'boots_r1', name: 'Ironshod Boots',     slot: 'boots', rarity: 'rare',      icon: '👢', flavorText: 'The ground fears the sound of your step.', stats: s(0.05, 0.10) },
    { id: 'boots_e1', name: 'Boots of the Sprinter', slot: 'boots', rarity: 'epic',   icon: '👢', flavorText: 'You were here before you left.',           stats: s(0.08, 0.14) },
    { id: 'boots_l1', name: 'Windwalker Greaves', slot: 'boots', rarity: 'legendary', icon: '👢', flavorText: 'The wind itself got out of the way.',      stats: s(0.10, 0.10, 1) },
  ],
  gloves: [
    { id: 'gloves_c1', name: 'Cloth Wraps',       slot: 'gloves', rarity: 'common',    icon: '🧤', flavorText: 'Your knuckles thank you.',               stats: s(0.01) },
    { id: 'gloves_u1', name: 'Leather Gloves',    slot: 'gloves', rarity: 'uncommon',  icon: '🧤', flavorText: 'Grip and grit.',                         stats: s(0.03, 0.04) },
    { id: 'gloves_r1', name: 'Spiked Gauntlets',  slot: 'gloves', rarity: 'rare',      icon: '🧤', flavorText: 'Shake hands. End friendships.',           stats: s(0.05, 0.10) },
    { id: 'gloves_e1', name: "Forgemaster's Gloves", slot: 'gloves', rarity: 'epic',   icon: '🧤', flavorText: 'Crafted in the hottest furnace.',         stats: s(0.08, 0.16) },
    { id: 'gloves_l1', name: 'Fists of Fury',     slot: 'gloves', rarity: 'legendary', icon: '🧤', flavorText: 'Bosses have nightmares about these.',    stats: s(0.12, 0.22) },
  ],
  weapon: [
    { id: 'weap_c1', name: 'Rusty Sword',         slot: 'weapon', rarity: 'common',    icon: '🗡', flavorText: 'Still sharp enough.',                    stats: s(0, 0.05) },
    { id: 'weap_u1', name: 'Steel Blade',         slot: 'weapon', rarity: 'uncommon',  icon: '⚔️', flavorText: 'Balanced. Dependable. Deadly.',          stats: s(0, 0.12) },
    { id: 'weap_r1', name: 'Enchanted Axe',       slot: 'weapon', rarity: 'rare',      icon: '🪓', flavorText: 'Hums with stored momentum.',              stats: s(0.05, 0.20) },
    { id: 'weap_e1', name: 'Dragonslayer',        slot: 'weapon', rarity: 'epic',      icon: '⚔️', flavorText: 'The name is not exaggerating.',           stats: s(0.10, 0.28) },
    { id: 'weap_l1', name: 'Excalibur',           slot: 'weapon', rarity: 'legendary', icon: '⚔️', flavorText: 'Only the worthy may complete their tasks.', stats: s(0.15, 0.38, 0, 0.05) },
  ],
  offhand: [
    { id: 'off_c1', name: 'Wooden Shield',        slot: 'offhand', rarity: 'common',    icon: '🛡', flavorText: 'Splinters, but holds.',                  stats: s(0, 0.03) },
    { id: 'off_u1', name: 'Iron Shield',          slot: 'offhand', rarity: 'uncommon',  icon: '🛡', flavorText: 'Solid. Unyielding.',                     stats: s(0.02, 0.07) },
    { id: 'off_r1', name: 'Tower Shield',         slot: 'offhand', rarity: 'rare',      icon: '🛡', flavorText: 'A wall you carry.',                      stats: s(0.05, 0.12) },
    { id: 'off_e1', name: 'Spellbound Tome',      slot: 'offhand', rarity: 'epic',      icon: '📖', flavorText: 'The pages write themselves.',             stats: s(0.18, 0.08) },
    { id: 'off_l1', name: 'Grimoire of Power',    slot: 'offhand', rarity: 'legendary', icon: '📕', flavorText: 'Older than memory.',                     stats: s(0.22, 0.12, 1) },
  ],
  ring: [
    { id: 'ring_c1', name: 'Copper Band',         slot: 'ring', rarity: 'common',    icon: '💍', flavorText: 'Simple. Honest. Yours.',                   stats: s(0.02) },
    { id: 'ring_u1', name: 'Silver Ring',         slot: 'ring', rarity: 'uncommon',  icon: '💍', flavorText: 'Light catches it just right.',             stats: s(0.05, 0, 0, 0.03) },
    { id: 'ring_r1', name: 'Ruby Ring',           slot: 'ring', rarity: 'rare',      icon: '💍', flavorText: 'Red like ambition.',                       stats: s(0.08, 0, 0, 0.06) },
    { id: 'ring_e1', name: 'Ring of Fortune',     slot: 'ring', rarity: 'epic',      icon: '💍', flavorText: 'Luck bends around this stone.',            stats: s(0.12, 0, 0, 0.12) },
    { id: 'ring_l1', name: 'Ouroboros',           slot: 'ring', rarity: 'legendary', icon: '💍', flavorText: 'The snake eats its tail. Power is infinite.', stats: s(0.18, 0.05, 0, 0.18) },
  ],
  amulet: [
    { id: 'amu_c1', name: 'Wooden Pendant',       slot: 'amulet', rarity: 'common',    icon: '📿', flavorText: 'Carved by hand.',                        stats: s(0, 0.02) },
    { id: 'amu_u1', name: 'Silver Amulet',        slot: 'amulet', rarity: 'uncommon',  icon: '📿', flavorText: 'A tradition older than victory.',         stats: s(0.05, 0.03) },
    { id: 'amu_r1', name: 'Amulet of Power',      slot: 'amulet', rarity: 'rare',      icon: '📿', flavorText: 'Pulses with the energy of completed tasks.', stats: s(0.10, 0.07) },
    { id: 'amu_e1', name: 'Heartstone',           slot: 'amulet', rarity: 'epic',      icon: '📿', flavorText: 'Still beating.',                          stats: s(0.16, 0.12) },
    { id: 'amu_l1', name: 'Amulet of the Ancients', slot: 'amulet', rarity: 'legendary', icon: '📿', flavorText: 'Passed down through ten generations of heroes.', stats: s(0.22, 0.18, 1) },
  ],
}

const ALL_SLOTS: GearSlot[] = ['helmet', 'chest', 'legs', 'boots', 'gloves', 'weapon', 'offhand', 'ring', 'amulet']
const RARITY_ORDER: GearRarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary']

function rollRarity(luck: number = 0): GearRarity {
  const boost = Math.min(luck, 1.0)
  const weights: Record<GearRarity, number> = {
    common:    Math.max(5, 50 * (1 - boost * 0.5)),
    uncommon:  25,
    rare:      15 * (1 + boost),
    epic:      8  * (1 + boost * 2),
    legendary: 2  * (1 + boost * 3),
  }
  const total = RARITY_ORDER.reduce((acc, r) => acc + weights[r], 0)
  let roll = Math.random() * total
  for (const rarity of RARITY_ORDER) {
    roll -= weights[rarity]
    if (roll <= 0) return rarity
  }
  return 'common'
}

function rollItemForRarity(slot: GearSlot, rarity: GearRarity): GearItem {
  const pool = GEAR_POOL[slot].filter(g => g.rarity === rarity)
  // Fall back to highest available rarity at or below target
  if (pool.length === 0) {
    const idx = RARITY_ORDER.indexOf(rarity)
    for (let i = idx - 1; i >= 0; i--) {
      const fallback = GEAR_POOL[slot].filter(g => g.rarity === RARITY_ORDER[i])
      if (fallback.length > 0) return { ...fallback[Math.floor(Math.random() * fallback.length)], id: uuid() }
    }
    return { ...GEAR_POOL[slot][0], id: uuid() }
  }
  return { ...pool[Math.floor(Math.random() * pool.length)], id: uuid() }
}

export function rollLootCrate(luck: number = 0): [GearItem, GearItem, GearItem] {
  // Pick 3 different slots
  const shuffled = [...ALL_SLOTS].sort(() => Math.random() - 0.5)
  const slots = shuffled.slice(0, 3) as [GearSlot, GearSlot, GearSlot]
  return slots.map(slot => {
    const rarity = rollRarity(luck)
    return rollItemForRarity(slot, rarity)
  }) as [GearItem, GearItem, GearItem]
}

export function getEquippedBonuses(equipped: Partial<Record<GearSlot, GearItem>>): GearStats {
  const totals: GearStats = { xpBonus: 0, bossDamage: 0, streakShield: 0, luck: 0, taskSpeed: 0 }
  for (const item of Object.values(equipped)) {
    if (!item) continue
    totals.xpBonus     += item.stats.xpBonus
    totals.bossDamage  += item.stats.bossDamage
    totals.streakShield += item.stats.streakShield
    totals.luck        += item.stats.luck
    totals.taskSpeed   += item.stats.taskSpeed
  }
  return totals
}

export function rarityLabel(r: GearRarity): string {
  return r.charAt(0).toUpperCase() + r.slice(1)
}
