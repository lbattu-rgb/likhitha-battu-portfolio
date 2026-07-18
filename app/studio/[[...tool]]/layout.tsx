import type { Metadata, Viewport } from 'next'

// Override the root layout's body overflow so the Studio fills the viewport.
export const metadata: Metadata = {
  title: 'Studio — Likhitha Battu',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        body { overflow: auto !important; height: auto !important; }
      `}</style>
      {children}
    </>
  )
}
