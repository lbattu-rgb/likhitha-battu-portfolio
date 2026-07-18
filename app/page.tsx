import BrainSceneLoader from '@/components/brain/BrainSceneLoader'
import { HeroOverlay } from '@/components/overlay/HeroOverlay'

export default function Home() {
  return (
    <main
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#000000',
      }}
    >
      {/* Full-screen WebGL brain */}
      <BrainSceneLoader />

      {/* Minimal text overlay — fades in after brain assembles */}
      <HeroOverlay />
    </main>
  )
}
