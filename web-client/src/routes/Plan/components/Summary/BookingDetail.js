import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { COLORS, fontSizes, space, mq } from 'Theme'
import NRModal from 'components/Modal'
import { Flex, Box } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import Tooltip from 'components/molecules/Tooltip'
import { ReactComponent as Cross } from 'assets/images/svg/summary-cross.svg'
import { formatPrice } from 'utils/money'
import RoomIcon from '../RoomIcon'

const CrossIcon = styled(Cross)`
  min-width: ${rem(5)};
  margin: 0 ${space.s};
`

const VenueImage = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;

  width: ${rem(71)};
  height: ${rem(53)};

  background-color: ${COLORS.SUPER_SILVER};

  ${mq.to.tablet`
    display: none;
  `}

  img {
    transform: scale(0.5);
  }
`

const StyledText = styled(Text)`
  white-space: nowrap;
  font-size: ${fontSizes.xs};
  color: ${COLORS.DEEP_RESERVOIR};
`

const StyledFlex = styled(Flex)`
  align-items: center;
  ${mq.to.tablet`
    align-items: flex-start;
  `}
  border-bottom: 1px solid ${COLORS.IRRADIANT_IRIS};
`

const TOOLTIP = {
  IS_REFUNDABLE: {
    COLOR: COLORS.EXPLORATION_GREEN,
    LABEL: 'FLEXIBLE CANCELLATION',
  },
  NON_REFUNDABLE: {
    COLOR: COLORS.SPACE_CADET,
    LABEL: 'NON-REFUNDABLE',
  },
}

const BookingDetail = ({
  icon,
  title,
  quantity,
  occupancyLimit,
  numberOfNights,
  boardType,
  taxesAndFees,
  resortFee,
  subtotal,
  total,
  pricePerNight,
  cancelationPolicy: { isCancelable, description },
  taxesData,
}) => {
  const [isTaxesAndFeesModalOpen, setIsTaxesAndFeesModalOpen] = React.useState(
    false
  )
  const toggleIsTaxesAndFeesModalOpen = () =>
    setIsTaxesAndFeesModalOpen((prevOpen) => !prevOpen)
  const { currencyIsoCode } = pricePerNight

  return (
    <StyledFlex>
      <Flex flex="1" alignItems="center" pb="m">
        <VenueImage>
          <RoomIcon type={icon} />
        </VenueImage>
        <Flex
          flex="1"
          flexDirection="column"
          justifyContent="center"
          minHeight="100%"
          mx={{ mobile: 0, tablet: 'm' }}
        >
          <Box display="inline-block">
            <Text
              fontSize="m"
              fontWeight="semi_bold"
              color={COLORS.SPACE_CADET}
            >
              {title}
            </Text>
            <Box display="inline-block">
              <CrossIcon />
              <Text
                fontSize="m"
                fontWeight="semi_bold"
                color={COLORS.SPACE_CADET}
              >
                {quantity}
              </Text>
            </Box>
          </Box>
          <Flex
            flexDirection={{ mobile: 'column', tablet: 'row' }}
            alignItems="baseline"
          >
            <Text
              as="p"
              fontSize="xs"
              color={COLORS.DEEP_RESERVOIR}
              mb={{ mobile: 'xxs', tablet: 0 }}
              mr="s"
            >
              {`Fits ${occupancyLimit} ${
                occupancyLimit === 1 ? 'person' : 'people'
              }`}
            </Text>
            <Tooltip
              maxWidth={rem(320)}
              position="TOP"
              textAlign="left"
              iconSize={10}
              iconFill={
                isCancelable
                  ? TOOLTIP.IS_REFUNDABLE.COLOR
                  : TOOLTIP.NON_REFUNDABLE.COLOR
              }
              label={
                isCancelable
                  ? TOOLTIP.IS_REFUNDABLE.LABEL
                  : TOOLTIP.NON_REFUNDABLE.LABEL
              }
              text={description}
            />
          </Flex>
          <Text as="p" fontSize="xs" color={COLORS.DEEP_RESERVOIR} mt="xs">
            {boardType}
          </Text>
        </Flex>
      </Flex>
      <Flex
        textAlign="right"
        flex="1"
        flexDirection="column"
        justifyContent="center"
        pb="m"
      >
        <Text>
          Price per night:{' '}
          {formatPrice({
            value: pricePerNight.amount,
            currencyIsoCode,
          })}
        </Text>
        <Text>
          Subtotal (without taxes and resort fees):{' '}
          {formatPrice({
            value: subtotal.amount,
            currencyIsoCode,
          })}
        </Text>
        <Text>
          <button
            type="button"
            onClick={toggleIsTaxesAndFeesModalOpen}
            style={{ color: 'inherit', textDecoration: 'underline' }}
          >
            Taxes and fees:{' '}
            {formatPrice({
              value: taxesAndFees.amount,
              currencyIsoCode,
            })}
          </button>
        </Text>
        <NRModal
          isOpen={isTaxesAndFeesModalOpen}
          closeModal={toggleIsTaxesAndFeesModalOpen}
          ariaLabel="Taxes and fees"
        >
          <>
            {taxesData.map((item, index) => (
              <Text key={index}>{item}</Text>
            ))}
          </>
        </NRModal>
        <Text fontSize="l" fontWeight="semi_bold" color={COLORS.SPACE_CADET}>
          Total price:{' '}
          {formatPrice({
            value: total.amount,
            currencyIsoCode,
          })}
        </Text>
        <Text>
          Resort fee (per person):{' '}
          {formatPrice({
            value: resortFee.amount,
            currencyIsoCode,
          })}
        </Text>
        <Flex ml="auto" flexDirection={{ mobile: 'column', tablet: 'row' }}>
          <Flex alignItems="center" justifyContent="flex-end">
            <StyledText>{quantity}</StyledText>
            <CrossIcon />
            <StyledText>
              {`${formatPrice({
                value: pricePerNight.amount,
                currencyIsoCode,
              })} / night`}
            </StyledText>
          </Flex>
          <Flex alignItems="center" justifyContent="flex-end">
            <CrossIcon />
            <StyledText>{`${numberOfNights} nights`}</StyledText>
          </Flex>
          <StyledText ml="xs">(+ taxes and fees)</StyledText>
        </Flex>
      </Flex>
    </StyledFlex>
  )
}

BookingDetail.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  numberOfNights: PropTypes.number.isRequired,
  occupancyLimit: PropTypes.number.isRequired,
  pricePerNight: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    currencyIsoCode: PropTypes.string.isRequired,
  }).isRequired,
  cancelationPolicy: PropTypes.shape({
    isCancelable: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  boardType: PropTypes.string.isRequired,
  taxesAndFees: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    currencyIsoCode: PropTypes.string.isRequired,
  }).isRequired,
  resortFee: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    currencyIsoCode: PropTypes.string.isRequired,
  }).isRequired,
  subtotal: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    currencyIsoCode: PropTypes.string.isRequired,
  }).isRequired,
  total: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    currencyIsoCode: PropTypes.string.isRequired,
  }).isRequired,
  taxesData: PropTypes.arrayOf(PropTypes.string),
}

export default BookingDetail
