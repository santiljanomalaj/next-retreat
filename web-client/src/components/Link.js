import styled from 'styled-components'
import { COLORS } from 'Theme'
import { tertiaryStyle } from 'components/atoms/Button'
import RouterLink from 'sharedComponents/RouterLink'

const Link = styled(RouterLink)`
  ${tertiaryStyle}
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: ${COLORS.SPACE_CADET};
  @media (hover: hover) {
    &:hover {
      text-decoration: underline;
    }
  }
  ${({ isDisabled }) => isDisabled && `pointer-events: none;`}
`

export default Link
