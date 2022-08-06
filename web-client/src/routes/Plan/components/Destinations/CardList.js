import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import { Element as ScrollTo } from 'react-scroll'
import { getScrollName } from 'utils/scroll'
import { space } from 'Theme'
import { Box } from 'components/atoms/Layout'
import RouterLink from 'sharedComponents/RouterLink'
import Card from './Card'
import {
  useGoogleTracking,
  GTM_EVENTS,
} from '../../../../hooks/useGoogleTracking'

const CardWrapper = styled(Box)`
  ${({ isDomestic }) =>
    isDomestic
      ? `
          margin-top: ${space.l};
        `
      : `
          margin-top: ${space.m};

          &:first-child {
            margin-top: ${space.s};
          }
        `}
`

const CardList = ({
  onHover,
  isCelsius,
  isMapOpen,
  destinations,
  originLocations,
  getVenueUrlByDestinationId,
  stepData,
}) => {
  const { logGTMEvent } = useGoogleTracking()
  return (
    <Box mb="s">
      {/* {destinations.some(({ isDomestic }) => isDomestic) && ( */}
      {/*   <Text */}
      {/*     as="p" */}
      {/*     color={COLORS.DEEP_RESERVOIR} */}
      {/*     p="m" */}
      {/*     pt="s" */}
      {/*     fontSize="s" */}
      {/*     css={` */}
      {/*       background-image: linear-gradient( */}
      {/*         ${COLORS.PALE_GREY}, */}
      {/*         ${rgba(COLORS.PALE_GREY, 0)} */}
      {/*       ); */}
      {/*     `} */}
      {/*   > */}
      {/*     As our response to COVID-19 we offer to choose from destinations within */}
      {/*     the country where your whole team is based, easily reacheable by road. */}
      {/*   </Text> */}
      {/* )} */}
      {destinations.map((destination) => (
        <CardWrapper
          key={destination.id}
          onMouseEnter={() => onHover(destination.id)}
          onMouseLeave={() => onHover(null)}
          display={isMapOpen ? 'none' : 'block'}
          isDomestic={destination.isDomestic}
        >
          <ScrollTo name={getScrollName(destination.id)}>
            <RouterLink
              to={getVenueUrlByDestinationId(destination.id)}
              onClick={() => {
                logGTMEvent({
                  event: GTM_EVENTS.destinationSelected,
                  title: destination.title,
                  isDomestic: destination.isDomestic,
                })
                if (window.ga) {
                  window.ga(() => {
                    const tracker = window.ga.getAll()[0]
                    tracker.send({
                      hitType: 'event',
                      eventCategory: 'destination_selection',
                      eventAction: 'selected',
                      eventLabel: destination.title,
                      eventValue: destination.isDomestic ? 1 : 0,
                    })
                  })
                }
              }}
            >
              <Card
                {...destination}
                originLocations={originLocations}
                isCelsius={isCelsius}
                stepData={stepData}
              />
            </RouterLink>
          </ScrollTo>
        </CardWrapper>
      ))}
    </Box>
  )
}

CardList.propTypes = {
  destinations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      isDomestic: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onHover: PropTypes.func.isRequired,
  isCelsius: PropTypes.bool.isRequired,
  isMapOpen: PropTypes.bool.isRequired,
  originLocations: PropTypes.array.isRequired,
  getVenueUrlByDestinationId: PropTypes.func.isRequired,
  stepData: PropTypes.object.isRequired,
}

export default CardList
