import styled from 'styled-components'
import { rem } from 'polished'
import { COLORS, radius, space, fontSizes, fontWeights } from 'Theme'
import { Text } from 'components/atoms/Typography'

const RatingBase = styled(Text)`
  white-space: nowrap;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: ${radius.m};
  font-weight: ${fontWeights.bold};
  color: ${COLORS.WHITE};
  background-color: ${COLORS.DEEP_RESERVOIR};
`

const Rating = styled(RatingBase)`
  font-size: ${fontSizes.m};
  padding: ${space.xxs} ${space.s};
`

const Large = styled(RatingBase)`
  width: ${rem(100)};
  height: ${rem(70)};
  font-size: ${fontSizes.xxxxxl};
  box-shadow: 0 0 0 ${radius.m} ${COLORS.WHITE};
`

Rating.Large = Large

export default Rating
