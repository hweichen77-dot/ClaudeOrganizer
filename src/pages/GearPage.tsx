import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { useGameStore } from '../stores/gameStore'
import { getEquippedBonuses, SLOT_LABELS } from '../lib/gear'
import type { GearSlot } from '../lib/gear'
import db from '../db/database'
import GearCard from '../components/ui/GearCard'
import GearSlotDisplay from '../components/ui/GearSlotDisplay'

const SLOT_GRID: GearSlot[][] = [
  ['helmet'],
  ['chest', 'weapon', 'offhand'],
  ['gloves', 'ring', 'amulet'],
  ['legs'],
  ['boots'],
]

export default function GearPage() {
  const equippedGear = useGameStore(s => s.equippedGear)
  const equipGear    = useGameStore(s => s.equipGear)
  const unequipGear  = useGameStore(s => s.unequipGear)

  const [selectedSlot, setSelectedSlot] = useState<GearSlot | null>(null)

  const inventory = useLiveQuery(
    () => db.inventoryItems.orderBy('obtainedAt').reverse().toArray(),
    []
  ) ?? []

  const bonuses = getEquippedBonuses(equippedGear)

  const equippedIds = new Set(
    Object.values(equippedGear).map(g => g?.id).filter(Boolean)
  )

  function handleSlotClick(slot: GearSlot) {
    setSelectedSlot(prev => prev === slot ? null : slot)
  }

  return (
    <div className="flex flex-col gap-0 h-full">
      {/* Header */}
      <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid var(--color-border)' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--color-text)',
          letterSpacing: '0.04em',
        }}>
          ⚔️ Gear
        </h1>
        <p style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 4 }}>
          Complete all daily tasks to earn loot crates.
        </p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left — character sheet */}
        <div className="flex flex-col gap-4 p-5 w-64 border-r border-slate-700/50 overflow-y-auto shrink-0">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Equipment</h2>

          {SLOT_GRID.map((row, ri) => (
            <div key={ri} className={`grid gap-2 ${row.length > 1 ? `grid-cols-${row.length}` : 'grid-cols-1'}`}>
              {row.map(slot => (
                <GearSlotDisplay
                  key={slot}
                  slot={slot}
                  item={equippedGear[slot]}
                  onUnequip={equippedGear[slot] ? () => unequipGear(slot) : undefined}
                  onClick={() => handleSlotClick(slot)}
                />
              ))}
            </div>
          ))}

          {/* Stat summary */}
          <div className="mt-2 rounded-lg border border-slate-700 bg-slate-800/50 p-3 space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Gear Bonuses</h3>
            {[
              { label: 'XP Bonus',      value: bonuses.xpBonus,      format: 'pct' as const },
              { label: 'Boss Damage',   value: bonuses.bossDamage,   format: 'pct' as const },
              { label: 'Streak Shield', value: bonuses.streakShield, format: 'int' as const },
              { label: 'Luck',          value: bonuses.luck,         format: 'pct' as const },
            ].map(({ label, value, format }) => (
              <div key={label} className="flex justify-between text-xs">
                <span className="text-slate-400">{label}</span>
                <span className={value > 0 ? 'text-emerald-400 font-semibold' : 'text-slate-600'}>
                  {value > 0
                    ? format === 'pct' ? `+${Math.round(value * 100)}%` : `+${value}`
                    : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — inventory */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Slot filter header */}
          {selectedSlot && (
            <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-700/50 bg-slate-800/30">
              <span className="text-xs text-slate-400">Showing items for:</span>
              <span className="text-xs font-bold text-white bg-slate-700 px-2 py-0.5 rounded">
                {SLOT_LABELS[selectedSlot]}
              </span>
              <button
                onClick={() => setSelectedSlot(null)}
                className="ml-auto text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Show all
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
              Inventory {inventory.length > 0 && <span className="text-slate-600 font-normal">({inventory.length} items)</span>}
            </h2>

            {inventory.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-600">
                <span className="text-5xl opacity-40">📦</span>
                <p className="text-sm text-center">No gear yet.<br />Complete all daily tasks to earn a loot crate.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {inventory
                  .filter(inv => !selectedSlot || inv.gearData.slot === selectedSlot)
                  .map(inv => {
                    const isEquipped = equippedIds.has(inv.gearData.id)
                    return (
                      <div key={inv.id} className="relative">
                        <GearCard
                          item={inv.gearData}
                          onSelect={isEquipped ? undefined : () => equipGear(inv.gearData)}
                          selected={isEquipped}
                        />
                        {isEquipped && (
                          <span className="absolute top-1 right-1 text-[9px] bg-emerald-700 text-emerald-100 px-1 rounded uppercase tracking-wide">
                            Equipped
                          </span>
                        )}
                      </div>
                    )
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
