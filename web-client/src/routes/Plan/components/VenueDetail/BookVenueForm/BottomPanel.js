import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { format, parseISO } from 'date-fns'
import { rem } from 'polished'
import { COLORS, BOXSHADOWS, fontSizes, mq, space } from 'Theme'
import { getScrollName, scrollIntoView } from 'utils/scroll'
import { Flex, Box } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import Button from 'components/atoms/Button'
import { getNumberOfNightsByDates } from 'utils/getNumberOfNightsByDates'
import { formatPrice } from 'utils/money'
import { ROOM_TYPE, CALENDAR } from '../constants'

const StyledFlex = styled(Flex)`
  z-index: 1;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  bottom: 0;
  height: ${rem(70)};
  width: 100%;
  box-shadow: ${BOXSHADOWS.LIGHT};
  background-color: ${COLORS.WHITE};
  padding: 0 ${space.xl};
  ${mq.from.desktop`
      display: none;
  `}
  ${mq.to.tablet`
      padding: 0 ${space.l};
  `}
`

const StyledText = styled('p')`
  cursor: pointer;
  font-size: ${fontSizes.s};
  color: ${COLORS.CHUN_LI_BLUE};
  text-decoration: underline;
`

const getFormattedDates = (checkInDate, checkOutDate) =>
  `${format(parseISO(checkInDate), 'MMM dd')} - ${format(
    parseISO(checkOutDate),
    'MMM dd'
  )}`

const BottomPanel = ({
  onClick,
  checkInDate,
  checkOutDate,
  price,
  currencyIsoCode,
}) => {
  const areDatesSelected = checkInDate && checkOutDate
  const numberOfNights = getNumberOfNightsByDates(checkInDate, checkOutDate)
  const isPriceCalculated = price > 0
  return (
    <StyledFlex>
      {areDatesSelected ? (
        <>
          <Box>
            <Text
              fontSize="s"
              fontWeight="semi_bold"
              color={COLORS.SPACE_CADET}
            >
              {getFormattedDates(checkInDate, checkOutDate)}
            </Text>
            {isPriceCalculated && (
              <>
                <Text color={COLORS.BROTHER_BLUE} mx="xs">
                  •
                </Text>
                <Text
                  fontSize="s"
                  fontWeight="semi_bold"
                  color={COLORS.SPACE_CADET}
                >
                  {formatPrice({
                    value: price,
                    currencyIsoCode,
                  })}
                </Text>
              </>
            )}
            <Flex alignItems="baseline">
              <Text as="p" fontSize="s" color={COLORS.SPACE_CADET} mr="s">
                {`${numberOfNights} ${
                  numberOfNights === 1 ? 'night' : 'nights'
                }`}
              </Text>
              <StyledText
                onClick={() => scrollIntoView(getScrollName(CALENDAR))}
              >
                Change dates
              </StyledText>
            </Flex>
          </Box>
          {isPriceCalculated ? (
            <Button.Primary onClick={onClick}>Continue</Button.Primary>
          ) : (
            <Button.Primary
              onClick={() => scrollIntoView(getScrollName(ROOM_TYPE))}
            >
              Choose rooms
            </Button.Primary>
          )}
        </>
      ) : (
        <>
          <Text fontSize="s" fontWeight="semi_bold" color={COLORS.SPACE_CADET}>
            Add dates for prices
          </Text>
          <Button.Primary
            onClick={() => scrollIntoView(getScrollName(CALENDAR))}
          >
            Check availability
          </Button.Primary>
        </>
      )}
    </StyledFlex>
  )
}

BottomPanel.propTypes = {
  price: PropTypes.number,
  checkInDate: PropTypes.string,
  checkOutDate: PropTypes.string,
  currencyIsoCode: PropTypes.string,
  onClick: PropTypes.func.isRequired,
}

export default BottomPanel
