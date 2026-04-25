import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { v4 as uuid } from 'uuid'
import { useGameStore } from '../../stores/gameStore'
import { rollLootCrate, getEquippedBonuses } from '../../lib/gear'
import type { GearItem } from '../../lib/gear'
import db from '../../db/database'
import GearCard from './GearCard'

type Phase = 'idle' | 'opening' | 'picking' | 'done'

export default function LootCrateModal() {
  const lootCrateAvailable      = useGameStore(s => s.lootCrateAvailable)
  const lootCratesRemaining     = useGameStore(s => s.lootCratesRemainingToday)
  const equippedGear            = useGameStore(s => s.equippedGear)
  const claimLootCrate          = useGameStore(s => s.claimLootCrate)
  const equipGear               = useGameStore(s => s.equipGear)
  const addNotification         = useGameStore(s => s.addNotification)

  const [phase, setPhase]       = useState<Phase>('idle')
  const [items, setItems]       = useState<GearItem[]>([])
  const [selected, setSelected] = useState<GearItem | null>(null)
  const [open, setOpen]         = useState(false)

  const gearBonuses = getEquippedBonuses(equippedGear)

  function handleOpen() {
    setOpen(true)
    setPhase('idle')
    setSelected(null)
    setItems(rollLootCrate(gearBonuses.luck))
  }

  function handleChestClick() {
    if (phase === 'idle') {
      setPhase('opening')
      setTimeout(() => setPhase('picking'), 600)
    }
  }

  async function handlePick(item: GearItem) {
    setSelected(item)
    setPhase('done')
    equipGear(item)
    await db.inventoryItems.add({ id: uuid(), gearData: item, obtainedAt: new Date().toISOString() })
    claimLootCrate()
    addNotification({ type: 'achievement', message: `${item.icon} ${item.name} equipped!`, icon: item.icon })
  }

  function handleClose() {
    setOpen(false)
    setPhase('idle')
    setItems([])
    setSelected(null)
  }

  // After claiming one crate, if another remains, let them open again
  function handleOpenNext() {
    setPhase('idle')
    setSelected(null)
    setItems(rollLootCrate(gearBonuses.luck))
  }

  if (!lootCrateAvailable && !open) return null

  return (
    <>
      {/* Trigger button */}
      {lootCrateAvailable && !open && (
        <motion.button
          onClick={handleOpen}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-1 px-4 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold shadow-xl shadow-yellow-500/40 transition-colors"
        >
          <div className="relative">
            <motion.span
              animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
              transition={{ repeat: Infinity, repeatDelay: 2, duration: 0.5 }}
              className="text-2xl block"
            >
              📦
            </motion.span>
            {lootCratesRemaining > 1 && (
              <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {lootCratesRemaining}
              </span>
            )}
          </div>
          <span className="text-xs uppercase tracking-wide">Open Loot Crate</span>
        </motion.button>
      )}

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={phase === 'done' && lootCratesRemaining === 0 ? handleClose : undefined}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              onClick={e => e.stopPropagation()}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
            >
              {/* Header */}
              <div className="text-center mb-5">
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-xl font-bold text-yellow-400">Daily Loot Crate</h2>
                  {lootCratesRemaining > 0 && phase !== 'done' && (
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 px-2 py-0.5 rounded-full">
                      {lootCratesRemaining} left
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  {phase === 'idle'    && 'All tasks complete! Click the chest to open.'}
                  {phase === 'opening' && 'Opening...'}
                  {phase === 'picking' && 'Pick one item to keep.'}
                  {phase === 'done'    && lootCratesRemaining > 0 && 'Nice! One more crate waiting.'}
                  {phase === 'done'    && lootCratesRemaining === 0 && 'All crates claimed. See you tomorrow!'}
                </p>
              </div>

              {/* Chest */}
              {(phase === 'idle' || phase === 'opening') && (
                <div className="flex flex-col items-center gap-4 py-6">
                  <motion.button
                    onClick={handleChestClick}
                    animate={phase === 'idle'
                      ? { y: [0, -6, 0] }
                      : { scale: [1, 1.3, 0.9, 1.2, 1], rotate: [0, -8, 8, -4, 0] }}
                    transition={phase === 'idle'
                      ? { repeat: Infinity, duration: 1.4, ease: 'easeInOut' }
                      : { duration: 0.5 }}
                    className="text-7xl select-none focus:outline-none"
                    disabled={phase === 'opening'}
                  >
                    {phase === 'idle' ? '📦' : '✨'}
                  </motion.button>
                  {phase === 'idle' && (
                    <p className="text-slate-400 text-sm animate-pulse">Click to open</p>
                  )}
                </div>
              )}

              {/* Picking */}
              {phase === 'picking' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                  {items.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ x: -40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.12, type: 'spring', stiffness: 260, damping: 20 }}
                    >
                      <GearCard item={item} onSelect={() => handlePick(item)} selected={false} />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Done */}
              {phase === 'done' && selected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <GearCard item={selected} />
                  {lootCratesRemaining > 0 ? (
                    <button
                      onClick={handleOpenNext}
                      className="w-full py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold text-sm transition-colors"
                    >
                      📦 Open Next Crate ({lootCratesRemaining} left)
                    </button>
                  ) : (
                    <p className="text-center text-xs text-slate-400">Tap anywhere to close</p>
                  )}
                </motion.div>
              )}

              {/* Close */}
              {phase !== 'done' && (
                <button
                  onClick={handleClose}
                  className="mt-4 w-full text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Close
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
