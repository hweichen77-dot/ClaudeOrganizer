import { NavLink, Outlet } from 'react-router-dom'
import { useGameStore, levelFromXp } from '../../stores/gameStore'
import { xpProgressInLevel, getRankForXp } from '../../lib/xp'

const NAV = [
  { to: '/',            label: 'Dashboard',    icon: '⌂', exact: true },
  { to: '/tasks',       label: 'Tasks',        icon: '✓' },
  { to: '/boss',        label: 'Boss',         icon: '◈' },
  { to: '/skills',      label: 'Skills',       icon: '◉' },
  { to: '/gear',        label: 'Gear',         icon: '⚔' },
  { to: '/achievements',label: 'Achievements', icon: '★' },
]

export default function Layout() {
  const totalXp  = useGameStore(s => s.totalXp)
  const username = useGameStore(s => s.username)
  const level    = levelFromXp(totalXp)
  const rank     = getRankForXp(totalXp)
  const { pct }  = xpProgressInLevel(totalXp)

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--color-base)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--color-border)',
        background: 'var(--color-card)',
      }}>
        {/* Brand */}
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid var(--color-border)' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 17,
            fontWeight: 700,
            color: 'var(--color-text)',
            letterSpacing: '0.03em',
          }}>
            ⚔️ ClaudeOrganizer
          </span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                borderRadius: 6,
                textDecoration: 'none',
                fontFamily: 'var(--font-display)',
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: '0.04em',
                color: isActive ? 'var(--color-accent)' : 'var(--color-muted)',
                background: isActive ? 'oklch(57% 0.19 264 / 0.12)' : 'transparent',
                transition: 'color 0.15s, background 0.15s',
              })}
            >
              <span style={{ width: 18, textAlign: 'center', fontSize: 13 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Player card */}
        <div style={{ padding: '12px 12px 16px', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: 'oklch(57% 0.19 264 / 0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 14,
              color: 'var(--color-accent)',
              flexShrink: 0,
            }}>
              {username.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 13,
                color: 'var(--color-text)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {username}
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 1 }}>
                {rank.name}
              </div>
            </div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 11,
              color: 'var(--color-accent)',
              background: 'oklch(57% 0.19 264 / 0.15)',
              padding: '2px 6px',
              borderRadius: 4,
              flexShrink: 0,
            }}>
              L{level}
            </span>
          </div>
          {/* Mini XP bar */}
          <div style={{
            height: 3,
            background: 'var(--color-border)',
            borderRadius: 2,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${pct * 100}%`,
              background: 'var(--color-accent)',
              borderRadius: 2,
              transition: 'width 0.6s ease',
            }} />
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
    </div>
  )
}
