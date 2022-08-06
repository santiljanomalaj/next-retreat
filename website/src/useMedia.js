import useMediaHook from 'use-media'
import { breakpoints } from 'Theme'

const queries = Object.fromEntries(
  Object.entries(breakpoints).map(([breakpoint, width], index, array) => [
    breakpoint,
    {
      ...(index !== 0 && { minWidth: Number.parseInt(width) }),
      ...(index !== array.length - 1 && {
        maxWidth: Number.parseInt(array[index + 1][1]) - 0.1,
      }),
    },
  ])
)

const { mobile, tablet, desktop, tv } = queries

export const useMedia = () => ({
  mobile: useMediaHook(mobile),
  tablet: useMediaHook(tablet),
  desktop: useMediaHook(desktop),
  tv: useMediaHook(tv),
})
