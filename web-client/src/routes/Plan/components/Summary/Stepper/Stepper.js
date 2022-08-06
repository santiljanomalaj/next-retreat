import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem, transparentize } from 'polished'
import { COLORS, space } from 'Theme'
import { Flex } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import { ReactComponent as Arrow } from 'assets/images/svg/summary-stepper-arrow.svg'
import Header from './Header'
import Card from './Card'

const ARROW_HEIGHT = 8
const BUBBLE_GREEN = transparentize(0.69, COLORS.EXPLORATION_GREEN)
const HEADER_GREEN = transparentize(0.92, COLORS.EXPLORATION_GREEN)
const TOOLTIP = {
  BOOKING_REQUEST:
    'Review your details, including price and booking conditions, and finalize the request by filling out the form with your information. In this step you can also request our help with services that your team may need, such as travel insurance, WiFi dongles, transportation solutions, food, etc.',
  BOOKING_CONFIRMATION:
    'Congrats, your booking is confirmed! You will receive a confirmation email with your reservation number, all the booking details and the next steps.',
  SCHEDULE_PLANNING:
    'Let’s design your schedule! Your dedicated Retreat Specialist will get in touch with you to suggest the best steps for moving forward, collect your requirements and help with building your itinerary, taking care of logistics and all the little details.',
}

const ArrowIcon = styled(Arrow)`
  height: ${ARROW_HEIGHT};
  min-width: ${rem(21)};
  margin: calc(${rem(55)} / 2 - ${rem(ARROW_HEIGHT / 2)}) ${space.xxs} 0
    ${space.xxs};
`

const StyledFlex = styled(Flex)`
  align-items: baseline;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
`

const Stepper = ({
  originLocations,
  destinationCountry,
  destinationCity,
  venueTitle,
  ...props
}) => (
  <StyledFlex {...props}>
    <Card
      list={originLocations}
      bubbleColor={
        originLocations.length ? BUBBLE_GREEN : COLORS.IRRADIANT_IRIS
      }
      headerColor={originLocations.length ? HEADER_GREEN : COLORS.LYNX_WHITE}
      headerText={{ top: 'YOUR', bottom: 'LOCATIONS' }}
      bubbleValue={
        originLocations.length ? (
          undefined
        ) : (
          <Text fontSize="s" color={COLORS.BLUEBERRY_SODA}>
            1
          </Text>
        )
      }
    />
    <ArrowIcon />
    <Card
      list={[destinationCity, destinationCountry]}
      bubbleColor={BUBBLE_GREEN}
      headerColor={HEADER_GREEN}
      headerText={{ top: 'DESTINATION', bottom: 'SELECTION' }}
    />
    <ArrowIcon />
    <Card
      list={[venueTitle]}
      bubbleColor={BUBBLE_GREEN}
      headerColor={HEADER_GREEN}
      headerText={{ top: 'VENUE', bottom: 'SELECTION' }}
    />
    <ArrowIcon />
    <Header
      bubbleColor={COLORS.CHUN_LI_BLUE}
      headerColor={COLORS.IRRADIANT_IRIS}
      tooltipText={TOOLTIP.BOOKING_REQUEST}
      headerBorderColor={COLORS.BROTHER_BLUE}
      headerText={{ top: 'BOOKING', bottom: 'REQUEST' }}
      bubbleValue={
        <Text fontSize="s" color={COLORS.WHITE}>
          4
        </Text>
      }
    />
    <ArrowIcon />
    <Header
      headerBorderColor={COLORS.IRRADIANT_IRIS}
      tooltipText={TOOLTIP.BOOKING_CONFIRMATION}
      headerText={{ top: 'BOOKING', bottom: 'CONFIRMATION' }}
      bubbleValue={
        <Text fontSize="s" color={COLORS.BLUEBERRY_SODA}>
          5
        </Text>
      }
    />
    <ArrowIcon />
    <Header
      headerBorderColor={COLORS.IRRADIANT_IRIS}
      tooltipText={TOOLTIP.SCHEDULE_PLANNING}
      headerText={{ top: 'SCHEDULE', bottom: 'PLANNING' }}
      bubbleValue={
        <Text fontSize="s" color={COLORS.BLUEBERRY_SODA}>
          6
        </Text>
      }
    />
  </StyledFlex>
)

Stepper.propTypes = {
  venueTitle: PropTypes.string.isRequired,
  destinationCity: PropTypes.string.isRequired,
  destinationCountry: PropTypes.string.isRequired,
  originLocations: PropTypes.arrayOf(PropTypes.string.isRequired),
}

export default Stepper
