import React from 'react'
import styled from 'styled-components'
import { rem, rgba, transparentize } from 'polished'
import { COLORS, mq, space } from 'Theme'
import { Box } from 'components/Layout'
import venuesImage from 'images/venues.png'
import destinationsImage from 'images/destinations.png'
import IconTextSection from './IconTextSection'
import Venues from './Venues'
import Destinations from './Destinations'

const FLEX_GAP = rem(80)
const MOBILE_SHIFT_RIGHT = space.s
const CONTAINER_WIDTH = { mobile: '100vw', tablet: 'unset' }

const DestinationImage = styled('img')`
  max-height: ${rem(490)};

  object-fit: contain;

  ${mq.to.desktop`
    max-height: ${rem(340)};
  `}
  ${mq.to.tablet`
    min-width: ${rem(690)};
    margin-left: -${MOBILE_SHIFT_RIGHT};
  `}
`
const VenueImage = styled('img')`
  max-height: ${rem(700)};
`

const StyledFlexVenues = styled('div')`
  display: flex;
  justify-content: flex-end;
  float: right;
  width: 100vw;
  margin-top: ${space.xl};
  ${mq.to.tablet`
    float: unset;
    width: 100%;
    align-items: center;
    flex-direction: column-reverse;
  `}
`
const StyledFlexDestinations = styled('div')`
  display: flex;
  width: 110vw;
  background-image: linear-gradient(
    270deg,
    ${COLORS.COTTON_BALL} 0%,
    ${rgba(COLORS.IRRADIANT_IRIS, 0)} 110%
  );
  padding: ${space.xl} 0 ${space.l};
  ${mq.to.desktop`
    width: 120vw;
  `}
  ${mq.to.tablet`
    align-items: center;
    flex-direction: column;
    width: calc(100% + ${MOBILE_SHIFT_RIGHT} * 2);
  `}
`

const DecorativeLine = styled('div')`
  position: relative;
  width: 100%;
  height: 1px;
  background-color: ${transparentize(0.7, COLORS.BROTHER_BLUE)};
  margin-top: ${space.l};
`

const Features = () => (
  <div>
    <IconTextSection />
    <DecorativeLine />
    <StyledFlexDestinations>
      <Box
        mb="l"
        mr={{ mobile: 0, tablet: FLEX_GAP }}
        pr={{ mobile: MOBILE_SHIFT_RIGHT, tablet: 0 }}
      >
        <Destinations />
      </Box>
      <Box width={CONTAINER_WIDTH}>
        <DestinationImage
          src={destinationsImage}
          alt="NextRetreat destinations"
        />
      </Box>
    </StyledFlexDestinations>
    <StyledFlexVenues>
      <Box width={CONTAINER_WIDTH} mr={{ mobile: 0, tablet: FLEX_GAP }}>
        <VenueImage src={venuesImage} alt="NextRetreat venues" />
      </Box>
      <Box mb="l">
        <Venues />
      </Box>
    </StyledFlexVenues>
  </div>
)

export default Features
