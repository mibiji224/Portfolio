import { Lottie } from 'lottie-react'
import animationData from '@/assets/loading.json'

// The source animation is 35 frames at 15fps (~2.3s). At 2x it plays one full
// cycle in ~1.2s, which is how long App holds this overlay open.
const SPEED = 2

const ReadMoreLoader = () => (
  <div
    role="status"
    aria-label="Loading"
    className="fixed inset-0 z-[100] flex items-center justify-center bg-background/85 backdrop-blur-sm"
  >
    <Lottie
      src={animationData}
      autoplay
      loop
      speed={SPEED}
      className="w-32 h-32 sm:w-40 sm:h-40"
    />
  </div>
)

export default ReadMoreLoader
