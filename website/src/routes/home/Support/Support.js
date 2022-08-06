import React from 'react'
import styled from 'styled-components'
import { rem, triangle, transparentize } from 'polished'
import { COLORS, space, mq } from 'Theme'
import Link from 'components/RouterLink'
import { Box, Flex } from 'components/Layout'
import { Text } from 'components/Typography'
import { fullWidthStyle, maxWidthStyle } from 'components/mixins'
import helpIcon from 'images/svg/support/help-icon.svg'
import busIcon from 'images/svg/support/bus-icon.svg'
import cutleryIcon from 'images/svg/support/cutlery-icon.svg'
import equipmentIcon from 'images/svg/support/equipment-icon.svg'
import headphonesIcon from 'images/svg/support/headphones-icon.svg'
import mappIcon from 'images/svg/support/map-icon.svg'
import surferIcon from 'images/svg/support/surfer-icon.svg'
import wifiIcon from 'images/svg/support/wifi-icon.svg'
import IconText from './IconText'
import Team from './Team'

const TRIANGLE_WIDTH = 20
const TRIANGLE_HEIGHT = 10
const TRIANGLE_DIRECTION = 'bottom'

const DecorativeLine = styled(Box)`
  position: relative;
  width: 100%;
  height: 1px;
  background-color: ${COLORS.BROTHER_BLUE};

  &::after {
    content: '';
    display: block;
    margin: 0 auto;
    ${triangle({
      width: rem(TRIANGLE_WIDTH),
      height: rem(TRIANGLE_HEIGHT),
      pointingDirection: TRIANGLE_DIRECTION,
      foregroundColor: COLORS.BROTHER_BLUE,
    })}
  }

  &::before {
    content: '';
    position: absolute;
    display: block;
    top: 0;
    right: 50%;
    transform: translateX(50%);
    ${triangle({
      width: rem(TRIANGLE_WIDTH - 5),
      height: rem(TRIANGLE_HEIGHT - 2),
      foregroundColor: COLORS.WHITE,
      pointingDirection: TRIANGLE_DIRECTION,
    })}
  }
`
const StyledFlex = styled(Flex)`
  ${mq.from.tablet`
      flex-direction: row;
       margin-bottom: ${space.s};
        > :last-child {
          margin-left: ${space.s};
        }
  `}
  ${mq.to.tablet`
      flex-direction: column;
        > div {
          margin-bottom: ${space.l};
        }
  `}
`

const StyledWrapper = styled(Flex)`
  flex-direction: column;
  border-top: 1px solid ${transparentize(0.8, COLORS.BROTHER_BLUE)};
  background-image: linear-gradient(
    180deg,
    #fafcfe 0%,
    rgba(219, 223, 231, 0) 100%
  );
`

const Support = () => (
  <StyledWrapper pt="xl" css={fullWidthStyle}>
    <Box width="100%">
      <Box css={maxWidthStyle}>
        <Flex
          flexDirection={{ mobile: 'column', tablet: 'row' }}
          justifyContent="space-between"
        >
          <Box flex="1" mb={{ mobile: 'l', tablet: 0 }}>
            <Team />
          </Box>
          <Box flex={{ tablet: '1', desktop: 'unset' }}>
            <StyledFlex>
              <IconText
                src={helpIcon}
                label="Help with designing your schedule"
              />
              <IconText
                src={cutleryIcon}
                label="Food options (catering, private chef..)"
              />
            </StyledFlex>
            <StyledFlex>
              <IconText src={mappIcon} label="Trip changes & cancellations" />
              <IconText
                src={wifiIcon}
                label="Internet solutions (pocket WiFi..)"
              />
            </StyledFlex>
            <StyledFlex>
              <IconText src={headphonesIcon} label="Resolve issues on‑site" />
              <IconText src={surferIcon} label="Local activities" />
            </StyledFlex>
            <StyledFlex>
              <IconText
                src={busIcon}
                label="Transportation (airport, minibus..)"
              />
              <IconText
                src={equipmentIcon}
                label="Office equipment (flipchart, beamer..)"
              />
            </StyledFlex>
          </Box>
        </Flex>
        <DecorativeLine mt={{ mobile: 'l', tablet: 'xxl' }} />
        <Link to="/how-it-works">
          <Text
            as="p"
            textAlign="center"
            fontSize="l"
            fontWeight="semi_bold"
            color={COLORS.CHUN_LI_BLUE}
            mt="m"
          >
            How It Works
          </Text>
        </Link>
      </Box>
    </Box>
  </StyledWrapper>
)

export default Support
