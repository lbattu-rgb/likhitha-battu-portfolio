// Shared layout for all portfolio content pages.
// Overrides the root body overflow so pages can scroll.

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        body { overflow-y: auto !important; height: auto !important; }
      `}</style>
      {children}
    </>
  )
}
