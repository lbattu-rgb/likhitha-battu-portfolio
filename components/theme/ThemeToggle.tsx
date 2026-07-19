'use client'

import { motion } from 'framer-motion'
import { useTheme, applyTheme } from '@/lib/useTheme'
import { buttonTap } from '@/lib/motionVariants'

interface ThemeToggleProps {
  /** CSS color for the icon/border — defaults to the neutral foreground. */
  accent?: string
}

// Small icon button that flips data-theme on <html>. useTheme() renders
// 'dark' during SSR/hydration and re-syncs to the real value right after
// (see lib/useTheme.ts) — a brief icon flip on load is expected and fine.
export function ThemeToggle({ accent }: ThemeToggleProps) {
  const theme = useTheme()
  const color = accent ?? 'var(--fg-tertiary)'

  return (
    <motion.button
      type="button"
      onClick={() => applyTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      {...buttonTap}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        borderRadius: 'var(--ui-radius-sm)',
        border: '1px solid var(--card-border)',
        background: 'var(--surface)',
        color,
        fontSize: '14px',
        lineHeight: 1,
        cursor: 'pointer',
        transition: 'border-color 0.2s, color 0.2s, background 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--card-border-hover)'
        e.currentTarget.style.color = 'var(--fg)'
        e.currentTarget.style.background = 'var(--surface-hover)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--card-border)'
        e.currentTarget.style.color = color
        e.currentTarget.style.background = 'var(--surface)'
      }}
    >
      {theme === 'light' ? '☾' : '☀'}
    </motion.button>
  )
}
