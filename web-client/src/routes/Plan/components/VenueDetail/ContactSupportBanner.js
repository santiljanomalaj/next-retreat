import React from 'react'
import styled from 'styled-components'
import { rem } from 'polished'
import { COLORS, BOXSHADOWS, radius, mq } from 'Theme'
import { Flex, Box } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import Button from 'components/atoms/Button'
import bannerImage from 'assets/images/contact-support-banner.jpeg'

const HEIGHT = rem(210)

const StyledFlexContainer = styled(Flex)`
  border: 1px solid ${COLORS.IRRADIANT_IRIS};
  box-shadow: ${BOXSHADOWS.DARK};
  border-radius: ${radius.m};
  overflow: hidden;
`

const StyledFlex = styled(Flex)`
  z-index: 1;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  position: absolute;
  ${mq.to.tablet`
    position: static;
    height: ${HEIGHT};
    align-items: center;
  `}
`

const SkewedBox = styled('div')`
  position: absolute;
  right: ${rem(-75)};
  height: 100%;
  width: ${rem(200)};
  transform: skewX(-35deg);
  ${mq.to.tablet`
    display: none;
  `}
  ${mq.to.desktop`
    transform: skewX(-15deg);
    right: ${rem(-30)};
  `}
  background-color: ${COLORS.LYNX_WHITE};
`

const StyledText = styled(Text)`
  white-space: nowrap;
`

const Image = styled(Box)`
  height: ${HEIGHT};
  ${({ pictureUrl }) =>
    `background: url("${pictureUrl}") center / cover no-repeat;`}
`

const Link = styled(Button.Secondary)`
  text-decoration: none;
`

const ContactSupportBanner = () => (
  <StyledFlexContainer flexDirection={{ mobile: 'column', tablet: 'row' }}>
    <Box
      position={{ mobile: 'static', tablet: 'relative' }}
      width={{ mobile: '100%', tablet: '50%', desktop: '35%' }}
      bg={COLORS.LYNX_WHITE}
    >
      <StyledFlex ml={{ mobile: 0, tablet: 'l' }}>
        <StyledText
          as="p"
          fontSize="xxl"
          fontWeight="semi_bold"
          color={COLORS.SPACE_CADET}
          mb="s"
        >
          Need to know more?
        </StyledText>
        <StyledText fontSize="l" mb={{ mobile: 'm', tablet: 'l' }}>
          Let us know how we can help!
        </StyledText>
        <Link
          as="a"
          target="_blank"
          rel="noreferrer noopener"
          href={`https://www.nextretreat.com/contact`}
        >
          Contact Support
        </Link>
      </StyledFlex>
      <SkewedBox />
    </Box>
    <Image
      pictureUrl={bannerImage}
      width={{ mobile: '100%', tablet: '50%', desktop: '65%' }}
    />
  </StyledFlexContainer>
)

export default ContactSupportBanner
