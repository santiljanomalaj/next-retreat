import React from 'react'

export const useScroll = () => {
  const [scroll, setScroll] = React.useState(0)

  const scrollHandler = () => {
    setScroll(window.scrollY)
  }

  React.useEffect(() => {
    setScroll(window.scrollY)
    window.addEventListener('scroll', scrollHandler)

    return () => {
      window.removeEventListener('scroll', scrollHandler)
    }
  }, [])

  return scroll
}
