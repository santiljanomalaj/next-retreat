import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { mq, COLORS } from 'Theme'
import { Text } from 'components/Typography'
import Link from 'components/RouterLink'

const SIZE = rem(22)

const StyledIMG = styled('img')`
  width: ${SIZE};
  height: ${SIZE};
`

const StyledIconText = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: ${rem('123px')};

  background-color: ${COLORS.LYNX_WHITE};

  ${mq.from.desktop`
    height: 100%;
  `}
`

const IconText = ({ src, label, onClick, linkTo }) => (
  <StyledIconText
    {...(linkTo && { as: Link, to: linkTo })}
    {...(onClick && { as: 'button', type: 'button', onClick })}
  >
    <StyledIMG src={src} alt="" />
    <Text as="p" fontSize="l" color={COLORS.CHUN_LI_BLUE} mt="s">
      {label}
    </Text>
  </StyledIconText>
)

IconText.propTypes = {
  onClick: PropTypes.func,
  linkTo: PropTypes.string,
  src: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}

export default IconText
