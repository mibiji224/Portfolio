import { Lottie } from 'lottie-react'
import animationData from '@/assets/loading.json'

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
      className="w-32 h-32 sm:w-40 sm:h-40"
    />
  </div>
)

export default ReadMoreLoader
