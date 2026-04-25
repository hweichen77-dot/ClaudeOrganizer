import type { GearItem } from '../../lib/gear'
import { RARITY_COLORS, RARITY_GLOW, SLOT_LABELS, rarityLabel } from '../../lib/gear'

interface Props {
  item: GearItem
  onSelect?: () => void
  selected?: boolean
  compact?: boolean
}

function statLine(label: string, value: number, format: 'pct' | 'int') {
  if (value <= 0) return null
  const display = format === 'pct' ? `+${Math.round(value * 100)}%` : `+${value}`
  return (
    <div key={label} className="flex justify-between text-xs">
      <span className="text-slate-400">{label}</span>
      <span className="text-emerald-400 font-semibold">{display}</span>
    </div>
  )
}

export default function GearCard({ item, onSelect, selected, compact }: Props) {
  const colorClass = RARITY_COLORS[item.rarity]
  const glowClass = RARITY_GLOW[item.rarity]

  return (
    <button
      onClick={onSelect}
      className={[
        'w-full text-left rounded-lg border-2 transition-all duration-150',
        compact ? 'p-2' : 'p-3',
        colorClass,
        glowClass ? `shadow-lg ${glowClass}` : '',
        selected ? 'ring-2 ring-white/60 scale-[1.02]' : 'hover:scale-[1.01]',
        onSelect ? 'cursor-pointer hover:brightness-110' : 'cursor-default',
        'bg-slate-800/80',
      ].join(' ')}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{item.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm truncate">{item.name}</div>
          <div className="flex gap-1 text-xs opacity-70">
            <span>{rarityLabel(item.rarity)}</span>
            <span>·</span>
            <span>{SLOT_LABELS[item.slot]}</span>
          </div>
        </div>
      </div>

      {!compact && (
        <>
          <p className="text-xs text-slate-400 italic mb-2 leading-tight">{item.flavorText}</p>
          <div className="space-y-0.5">
            {statLine('XP Bonus', item.stats.xpBonus, 'pct')}
            {statLine('Boss Damage', item.stats.bossDamage, 'pct')}
            {statLine('Streak Shield', item.stats.streakShield, 'int')}
            {statLine('Luck', item.stats.luck, 'pct')}
          </div>
        </>
      )}
    </button>
  )
}
