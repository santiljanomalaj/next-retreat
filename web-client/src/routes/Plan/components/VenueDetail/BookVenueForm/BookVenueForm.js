import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { format, parseISO } from 'date-fns'
import { rem } from 'polished'
import {
  mq,
  space,
  radius,
  COLORS,
  fontSizes,
  BOXSHADOWS,
  fontWeights,
} from 'Theme'
import { useAuth } from 'AuthProvider'
import { useTripManagement, MODAL_TYPES } from 'TripManagementProvider'
import { getScrollName, scrollIntoView } from 'utils/scroll'
import { Text } from 'components/atoms/Typography'
import { Flex, Box } from 'components/atoms/Layout'
import Button from 'components/atoms/Button'
import { ReactComponent as CloseIcon } from 'assets/images/svg/close-modal.svg'
import heartIcon from 'assets/images/svg/heart.svg'
import { getNumberOfNightsByDates } from 'utils/getNumberOfNightsByDates'
import { formatPrice } from 'utils/money'
import { ROOM_TYPE, CALENDAR } from '../constants'
import {
  useGoogleTracking,
  GTM_EVENTS,
} from '../../../../../hooks/useGoogleTracking'

const OUTER_LINE_WIDTH = rem(340)
const INNER_LINE_WIDTH = rem(330)

const Form = styled('form')`
  position: relative;
  width: ${rem(360)};
  max-height: ${rem(480)};
  overflow: hidden;
  border-radius: ${radius.m};
  box-shadow: ${BOXSHADOWS.DARK};
  border: 1px solid ${COLORS.IRRADIANT_IRIS};
  background-color: ${COLORS.WHITE};
  ${mq.to.tablet`
    width: 100vw;
    height: var(--nr-100vh, 100vh);
    max-height: var(--nr-100vh, 100vh);
    box-shadow: unset;
    border-radius: 0;
    border: 0;
  `}
`

const DecorativeLine = styled(Box)`
  position: absolute;
  height: 1px;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${COLORS.IRRADIANT_IRIS};
  ${mq.to.tablet`
    display: none;
  `}
`

const CloseModalIcon = styled(CloseIcon)`
  height: ${rem(14)};
`

const TextChangeDates = styled('p')`
  cursor: pointer;
  font-size: ${fontSizes.s};
  color: ${COLORS.CHUN_LI_BLUE};
  text-decoration: underline;
  ${mq.to.desktop`
    display: none;
  `}
`

const StyledButton = styled('button')`
  ${mq.from.desktop`
    display: none;
  `}
`

const textStyles = `
  font-size: ${fontSizes.s};
  color: ${COLORS.SPACE_CADET};
`

const TextLeft = styled(Text)`
  ${textStyles};
  font-weight: ${fontWeights.semi_bold};
`

const TextRight = styled(Text)`
  ${textStyles};
`

const StyledBox = styled(Box)`
  > div:not(:first-child) {
    margin-top: ${space.s};
  }
`

const StyledFlex = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  position: relative;
  border-top: 1px solid ${COLORS.IRRADIANT_IRIS};
  border-bottom: 1px solid ${COLORS.IRRADIANT_IRIS};
  padding: ${space.m} 0;
  &::after {
    content: '';
    position: absolute;
    bottom: ${rem(-4)};
    width: 100%;
    height: 1px;
    background-color: ${COLORS.IRRADIANT_IRIS};
  }
`

const PassThroughText = styled(Text)`
  display: flex;
  flex-direction: row;
  font-size: ${fontSizes.s};
  color: ${COLORS.DEEP_RESERVOIR};
  padding: ${space.s} 0;

  &:before,
  &:after {
    content: '';
    flex: 1 1;
    border-bottom: 1px solid;
    margin: auto;
  }
  &:before {
    margin-right: ${rem(10)};
  }
  &:after {
    margin-left: ${rem(10)};
  }
`

const StyledIconImage = styled.img`
  width: ${rem(15)};
  height: auto;
  margin-right: ${space.s};
`

const StyledIconButton = styled(Button.Secondary)`
  padding: ${space.s} ${space.l};
`

const getArrivalDepartureDates = (checkInDate, checkOutDate) => {
  if (!checkInDate || !checkOutDate) {
    return {
      arrival: '',
      departure: '',
    }
  }
  return {
    arrival: format(parseISO(checkInDate), 'MMM dd, yyyy'),
    departure: format(parseISO(checkOutDate), 'MMM dd, yyyy'),
  }
}

const getOnSubmitButtonLabelAndText = (areDatesSelected, price, onSubmit, logGTMEvent) => {
  if (areDatesSelected && price) {
    return {
      onSubmitForm: (e) => {
        logGTMEvent({event: GTM_EVENTS.requestToBook})
        e.preventDefault()
        onSubmit({ summary: null })
      },
      buttonText: 'Request to Book',
      buttonLabel: 'You won’t be charged yet',
      withAddToTripButton: true,
    }
  }
  if (areDatesSelected) {
    return {
      onSubmitForm: (e) => {
        e.preventDefault()
        scrollIntoView(getScrollName(ROOM_TYPE))
      },
      buttonText: 'Choose rooms',
      buttonLabel: 'View room types and pick your preferences',
    }
  }
  return {
    onSubmitForm: (e) => {
      e.preventDefault()
      scrollIntoView(getScrollName(CALENDAR))
    },
    buttonText: 'Check availability',
    buttonLabel: 'Use NextRetreat Sync Calendar to choose the best dates',
  }
}

const BookVenueForm = ({
  price,
  onSubmit,
  closeModal,
  checkInDate,
  peopleToFit,
  checkOutDate,
  roomsTotalCount,
  currencyIsoCode,
  venueId,
}) => {
  const { openModal: openTripManagementModal } = useTripManagement()
  const { isSignedIn } = useAuth()
  const { logGTMEvent } = useGoogleTracking()
  const areDatesSelected = checkInDate && checkOutDate
  const isRoomChosen = price > 0
  const {
    onSubmitForm,
    buttonText,
    buttonLabel,
    withAddToTripButton,
  } = getOnSubmitButtonLabelAndText(areDatesSelected, price, onSubmit, logGTMEvent)
  const { arrival, departure } = getArrivalDepartureDates(
    checkInDate,
    checkOutDate
  )
  const numberOfNights = getNumberOfNightsByDates(checkInDate, checkOutDate)
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      width={{ mobile: '100%', tablet: rem(370) }}
    >
      <Form onSubmit={onSubmitForm}>
        <Box px="m" py="m">
          <Flex
            justifyContent="space-between"
            alignItems="center"
            mb="l"
            mt="xs"
          >
            <Text
              fontSize="xxl"
              fontWeight="semi_bold"
              color={COLORS.SPACE_CADET}
            >
              {areDatesSelected ? 'Your trip' : 'Add dates for prices'}
            </Text>
            {areDatesSelected && (
              <TextChangeDates
                onClick={() => scrollIntoView(getScrollName(CALENDAR))}
              >
                Change dates
              </TextChangeDates>
            )}
            <StyledButton type="button" onClick={closeModal}>
              <CloseModalIcon />
            </StyledButton>
          </Flex>
          {areDatesSelected && (
            <div>
              <StyledBox>
                <Flex justifyContent="space-between" alignItems="baseline">
                  <TextLeft>Arrival</TextLeft>
                  <TextRight>{arrival}</TextRight>
                </Flex>
                <Flex justifyContent="space-between" alignItems="baseline">
                  <TextLeft>Departure</TextLeft>
                  <TextRight>{departure}</TextRight>
                </Flex>
                <Flex justifyContent="space-between" alignItems="baseline">
                  <TextLeft>Duration</TextLeft>
                  <TextRight>
                    {`${numberOfNights} ${
                      numberOfNights === 1 ? 'night' : 'nights'
                    }`}
                  </TextRight>
                </Flex>
                {isRoomChosen && (
                  <Flex justifyContent="space-between" alignItems="baseline">
                    <TextLeft>Rooms</TextLeft>
                    <Box>
                      <TextRight>{roomsTotalCount} </TextRight>
                      <Text fontSize="s" color={COLORS.BLUEBERRY_SODA}>
                        {`(max ${peopleToFit} people)`}
                      </Text>
                    </Box>
                  </Flex>
                )}
              </StyledBox>
              {isRoomChosen && (
                <StyledFlex mt="m">
                  <Text
                    fontSize="m"
                    fontWeight="semi_bold"
                    color={COLORS.SPACE_CADET}
                  >
                    Total booking price
                  </Text>
                  <Text
                    fontSize="m"
                    fontWeight="semi_bold"
                    color={COLORS.SPACE_CADET}
                  >
                    {formatPrice({
                      value: price,
                      currencyIsoCode,
                    })}
                  </Text>
                </StyledFlex>
              )}
            </div>
          )}
          <Box my="l">
            {withAddToTripButton && isSignedIn && (
              <>
                <StyledIconButton
                  isBlock
                  onClick={() => {
                    openTripManagementModal({
                      type: MODAL_TYPES.ADD_VENUE_MODAL,
                      venueId,
                    })
                  }}
                >
                  <StyledIconImage src={heartIcon} alt="heartIcon" />
                  Save to Trip
                </StyledIconButton>
                <PassThroughText>or</PassThroughText>
              </>
            )}
            <Button.Primary type="submit" isBlock>
              {buttonText}
            </Button.Primary>
            <Text
              as="p"
              textAlign="center"
              fontSize="s"
              color={COLORS.DEEP_RESERVOIR}
              mt="s"
            >
              {buttonLabel}
            </Text>
          </Box>
        </Box>
        <DecorativeLine top={space.xs} width={OUTER_LINE_WIDTH} />
        <DecorativeLine top={space.s} width={INNER_LINE_WIDTH} />
        <DecorativeLine bottom={space.s} width={INNER_LINE_WIDTH} />
        <DecorativeLine bottom={space.xs} width={OUTER_LINE_WIDTH} />
      </Form>
    </Flex>
  )
}

BookVenueForm.propTypes = {
  price: PropTypes.number,
  closeModal: PropTypes.func,
  peopleToFit: PropTypes.number,
  checkInDate: PropTypes.string,
  checkOutDate: PropTypes.string,
  currencyIsoCode: PropTypes.string,
  roomsTotalCount: PropTypes.number,
  onSubmit: PropTypes.func.isRequired,
  venueId: PropTypes.number.isRequired,
}

export default BookVenueForm
