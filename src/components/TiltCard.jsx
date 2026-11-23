import useTilt, { TILT } from '@/hooks/useTilt'

// Wrapper that leans toward the cursor. See useTilt.
// eslint-disable-next-line no-unused-vars -- used as a JSX tag; this lint config doesn't see that
const TiltCard = ({ as: Component = 'div', className, style, children, ...rest }) => {
  const { ref, tilt, active, bind } = useTilt()
  return (
    <Component
      ref={ref}
      className={className}
      style={{ ...style, transform: tilt, willChange: active ? 'transform' : undefined, transition: `transform ${TILT.speed}ms ${TILT.easing}` }}
      {...bind}
      {...rest}
    >
      {children}
    </Component>
  )
}

export default TiltCard
