import React from 'react'

const createObserver = (container, callback) =>
  new IntersectionObserver(callback, {
    threshold: [0],
    root: container,
  })

const useStickyObserver = (containerRef, targetRef) => {
  const [isSticky, setIsSticky] = React.useState(false)

  React.useEffect(() => {
    if (containerRef && targetRef) {
      createObserver(containerRef.current, (entries) => {
        entries.forEach(
          ({ boundingClientRect: targetInfo, rootBounds: rootBoundsInfo }) => {
            // Started sticking
            if (
              targetInfo.bottom >= rootBoundsInfo.top &&
              targetInfo.bottom < rootBoundsInfo.bottom
            ) {
              setIsSticky(true)
            }

            // Stopped sticking
            if (targetInfo.bottom < rootBoundsInfo.top) {
              setIsSticky(false)
            }
          }
        )
      }).observe(targetRef.current)
    }
  }, [containerRef, targetRef])

  return { isSticky }
}

export default useStickyObserver
