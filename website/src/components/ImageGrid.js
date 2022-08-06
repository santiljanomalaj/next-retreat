import styled from 'styled-components'
import { mq, space } from 'Theme'

const ImageGrid = styled('div')`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;

  > * {
    margin: ${space.m};
    flex: 0 0 calc(var(--image-grid-child-width, 50%) - ${space.m} * 2);

    object-fit: contain;

    ${mq.from.tablet`
      --image-grid-child-width: 25%;
    `}

    ${mq.from.tv`
      --image-grid-child-width: 16.666%;
    `}
  }
`

export default ImageGrid
