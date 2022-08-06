import React from 'react'
import ReactMedia from 'react-media'
import { breakpoints } from 'Theme'

export const queries = Object.fromEntries(
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

const Media = (props) => <ReactMedia {...props} queries={queries} />

export default Media
