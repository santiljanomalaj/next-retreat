import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { COLORS, radius, BOXSHADOWS, mq } from 'Theme'
import { Flex } from 'components/Layout'
import { Text } from 'components/Typography'

const StyledFlex = styled(Flex)`
  max-width: ${rem(264)};
  width: 100%;
  height: ${rem(104)};
  border-radius: ${radius.l};
  box-shadow: ${BOXSHADOWS.CARD};
  background-color: ${COLORS.WHITE};
  ${mq.to.tablet`
       max-width: 100%;
      box-shadow: unset;
      background-color: unset;
      height: unset;
  `}
`

const StyledIMG = styled('img')`
  width: ${rem(30)};
`

const IconText = ({ src, label }) => (
  <StyledFlex>
    <Flex
      alignItems={{ mobile: 'flex-end', tablet: 'center' }}
      px={{ tablet: 'm', desktop: 'l' }}
    >
      <StyledIMG src={src} alt="" />
      <Text
        as="p"
        lineHeight={rem(24)}
        fontSize={{ mobile: 'm', tablet: 's', desktop: 'm' }}
        fontWeight="semi_bold"
        color={COLORS.SPACE_CADET}
        ml="m"
      >
        {label}
      </Text>
    </Flex>
  </StyledFlex>
)

IconText.propTypes = {
  src: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}

export default IconText
