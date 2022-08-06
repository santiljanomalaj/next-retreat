import styled from 'styled-components'
import { rem } from 'polished'
import { fontSizes, fontWeights, mq, space, COLORS } from 'Theme'

const Title = styled('button')`
  position: relative;

  height: ${rem('68px')};
  padding: 0 ${space.l};

  font-size: ${fontSizes.xl};
  font-weight: ${fontWeights.semi_bold};

  color: ${COLORS.BLUEBERRY_SODA};

  transition: color 0.3s;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    border-bottom: 1px solid transparent;

    transition: border-color 0.3s;
  }

  ${mq.from.tablet`
    ${({ tabletSize }) =>
      tabletSize &&
      `
        flex: 0 0 ${tabletSize};
      `}
  `}

  ${mq.from.tv`
    flex: 1;
  `}

  ${({ isBlock }) => isBlock && `width: 100%;`}
  ${({ isActive }) =>
    isActive &&
    `
      color: ${COLORS.SPACE_CADET};

      &::after {
        border-color: ${COLORS.CHUN_LI_BLUE};
      }
    `}
`

Title.defaultProps = {
  type: 'button',
}

export default Title
