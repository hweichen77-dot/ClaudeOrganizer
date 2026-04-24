import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'

export default function OnboardingModal() {
  const [step, setStep]       = useState(0)
  const [name, setName]       = useState('')
  const [goal, setGoal]       = useState(3)

  const setUsername       = useGameStore(s => s.setUsername)
  const setDailyGoal      = useGameStore(s => s.setDailyGoal)
  const completeOnboarding = useGameStore(s => s.completeOnboarding)

  function handleNext() {
    if (step === 0) {
      if (!name.trim()) return
      setUsername(name.trim())
      setStep(1)
    } else {
      setDailyGoal(goal)
      completeOnboarding()
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'oklch(0% 0 0 / 0.92)',
      zIndex: 9000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'var(--color-elevated)',
          border: '1px solid var(--color-border)',
          borderRadius: 16,
          padding: '40px 32px',
          textAlign: 'center',
        }}
      >
        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 32 }}>
          {[0, 1].map(i => (
            <div key={i} style={{
              width: i === step ? 20 : 6,
              height: 6,
              borderRadius: 3,
              background: i === step ? 'var(--color-accent)' : 'var(--color-border)',
              transition: 'width 0.3s ease, background 0.3s ease',
            }} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>⚔️</div>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 28,
                color: 'var(--color-text)',
                letterSpacing: '0.04em',
                marginBottom: 8,
              }}>
                WELCOME, HERO
              </h1>
              <p style={{ fontSize: 14, color: 'var(--color-muted)', marginBottom: 28, lineHeight: 1.6 }}>
                Your quest begins here. Complete tasks, defeat bosses, and level up your productivity.
              </p>
              <div style={{ textAlign: 'left', marginBottom: 24 }}>
                <label style={labelStyle}>What shall we call you?</label>
                <input
                  autoFocus
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleNext()}
                  placeholder="Enter your name"
                  style={{ ...inputStyle, textAlign: 'center', fontSize: 16 }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 28,
                color: 'var(--color-text)',
                letterSpacing: '0.04em',
                marginBottom: 8,
              }}>
                SET YOUR GOAL
              </h1>
              <p style={{ fontSize: 14, color: 'var(--color-muted)', marginBottom: 28, lineHeight: 1.6 }}>
                How many tasks do you want to complete each day?
              </p>
              <div style={{ marginBottom: 24 }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 52,
                  color: 'var(--color-accent)',
                  lineHeight: 1,
                  marginBottom: 12,
                }}>
                  {goal}
                </div>
                <input
                  type="range"
                  min={1} max={10} step={1}
                  value={goal}
                  onChange={e => setGoal(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-accent)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--color-faint)' }}>1</span>
                  <span style={{ fontSize: 11, color: 'var(--color-faint)' }}>10</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleNext}
          disabled={step === 0 && !name.trim()}
          style={{
            width: '100%',
            padding: '13px',
            borderRadius: 8,
            border: 'none',
            background: 'var(--color-accent)',
            color: 'white',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: '0.08em',
            cursor: step === 0 && !name.trim() ? 'not-allowed' : 'pointer',
            opacity: step === 0 && !name.trim() ? 0.4 : 1,
            transition: 'opacity 0.15s',
          }}
        >
          {step === 0 ? 'CONTINUE →' : 'BEGIN QUEST'}
        </button>
      </motion.div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-display)',
  fontWeight: 600,
  fontSize: 11,
  letterSpacing: '0.08em',
  color: 'var(--color-muted)',
  marginBottom: 8,
  textTransform: 'uppercase',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  background: 'var(--color-card)',
  border: '1px solid var(--color-border)',
  borderRadius: 8,
  color: 'var(--color-text)',
  fontSize: 14,
  outline: 'none',
}
