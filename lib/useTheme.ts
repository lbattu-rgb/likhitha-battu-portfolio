'use client'

import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

function readTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
}

function subscribe(onChange: () => void) {
  window.addEventListener('themechange', onChange)
  return () => window.removeEventListener('themechange', onChange)
}

// SSR/hydration always sees 'dark' (matches the site's default) until the
// client re-syncs to the real value right after mount — no manual effect
// needed, useSyncExternalStore handles that hydration handoff itself.
function getServerSnapshot(): Theme {
  return 'dark'
}

export function applyTheme(theme: Theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
  try {
    localStorage.setItem('theme', theme)
  } catch {
    // localStorage unavailable (private browsing, etc.) — theme still applies for this session
  }
  window.dispatchEvent(new CustomEvent('themechange'))
}

// Reactive read of the current theme. Safe to use inside R3F/Canvas components
// too — BrainScene is mounted client-only (ssr:false), so by the time any of
// these hooks run, the anti-flash script in app/layout.tsx has already set
// data-theme, meaning the very first client read here is already accurate.
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, readTheme, getServerSnapshot)
}
