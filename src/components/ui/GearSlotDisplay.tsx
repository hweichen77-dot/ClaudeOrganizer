import type { GearItem, GearSlot } from '../../lib/gear'
import { RARITY_COLORS, SLOT_ICONS, SLOT_LABELS } from '../../lib/gear'

interface Props {
  slot: GearSlot
  item?: GearItem
  onUnequip?: () => void
  onClick?: () => void
}

export default function GearSlotDisplay({ slot, item, onUnequip, onClick }: Props) {
  if (!item) {
    return (
      <div
        onClick={onClick}
        className={[
          'flex flex-col items-center justify-center gap-1 p-2 rounded-lg border-2',
          'border-slate-600/50 border-dashed text-slate-600',
          'min-h-[72px]',
          onClick ? 'cursor-pointer hover:border-slate-500 hover:text-slate-500 transition-colors' : '',
        ].join(' ')}
      >
        <span className="text-xl opacity-40">{SLOT_ICONS[slot]}</span>
        <span className="text-[10px] uppercase tracking-wider">{SLOT_LABELS[slot]}</span>
      </div>
    )
  }

  const colorClass = RARITY_COLORS[item.rarity]

  return (
    <div
      onClick={onClick}
      className={[
        'flex flex-col items-center justify-center gap-1 p-2 rounded-lg border-2 relative',
        colorClass,
        'bg-slate-800/80 min-h-[72px]',
        onClick ? 'cursor-pointer hover:brightness-110 transition-all' : '',
      ].join(' ')}
    >
      <span className="text-2xl">{item.icon}</span>
      <span className="text-[10px] font-semibold text-center leading-tight truncate w-full text-center">{item.name}</span>
      <span className="text-[9px] uppercase tracking-wider opacity-60">{SLOT_LABELS[slot]}</span>
      {onUnequip && (
        <button
          onClick={e => { e.stopPropagation(); onUnequip() }}
          className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-slate-700 hover:bg-red-800 text-slate-400 hover:text-white text-[10px] flex items-center justify-center transition-colors"
          title="Unequip"
        >
          ×
        </button>
      )}
    </div>
  )
}
