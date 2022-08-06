import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { COLORS, fontSizes, mq } from 'Theme'
import { Flex, Box } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import Input from 'components/Input'
import Tooltip from 'components/molecules/Tooltip'
import { formatPrice } from 'utils/money'
import RoomIcon from '../../RoomIcon'

const VenueImage = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;

  min-width: ${rem(140)};
  min-height: ${rem(100)};
  max-height: ${rem(120)};

  background-color: ${COLORS.SUPER_SILVER};

  ${mq.to.tablet`
    height: ${rem(200)};
    max-height: ${rem(200)};
  `}
`

const StyledFlex = styled(Flex)`
  flex: 1;
  border-right: 1px dashed ${COLORS.IRRADIANT_IRIS};
  ${mq.to.tablet`
    flex-direction: column;
    border-right: none;
    border-bottom: 1px dashed ${COLORS.IRRADIANT_IRIS};
  `}
`

const StyledText = styled(Text)`
  white-space: nowrap;
  font-size: ${fontSizes.xs};
  color: ${COLORS.BLUEBERRY_SODA};
`

const TOOLTIP = {
  IS_REFUNDABLE: {
    COLOR: COLORS.EXPLORATION_GREEN,
    LABEL: 'FLEXIBLE CANCELLATION',
    TEXT: `For the room type and rate that you've selected,
           you are allowed to change or cancel your reservation.
           If you cancel your room, you will still be charged for the
           full reservation amount.
          `,
  },
  NON_REFUNDABLE: {
    COLOR: COLORS.SPACE_CADET,
    LABEL: 'NON-REFUNDABLE',
    TEXT: `For the room type and rate that you've selected,
           you are not allowed to change or cancel your reservation.
           If you cancel your room, you will not be charged for the
           full reservation amount.
          `,
  },
}

const RoomType = ({
  id,
  icon,
  title,
  count,
  isDisabled,
  description,
  updateStepData,
  occupancyLimit,
  boardType,
  beddingData,
  pricePerNight: { amount, currencyIsoCode },
  cancelationPolicy: { isCancelable, description: cancelationDescription },
  maxRoomsCount,
}) => (
  <Flex
    flexDirection={{ mobile: 'column', tablet: 'row' }}
    maxWidth={{ tablet: rem(740) }}
    bg={COLORS.LYNX_WHITE}
  >
    <StyledFlex pl={{ tablet: 'm' }} py="m">
      <VenueImage>
        <RoomIcon type={icon} />
      </VenueImage>
      <Flex
        flex="1"
        flexDirection="column"
        justifyContent="space-between"
        minHeight="100%"
        mt={{ mobile: 'm', tablet: 0 }}
        mx="m"
      >
        <div>
          <Text
            as="p"
            fontSize="s"
            fontWeight="semi_bold"
            color={COLORS.SPACE_CADET}
          >
            {title}
          </Text>
          <Text as="p" fontSize="s" color={COLORS.DEEP_RESERVOIR} mt="xs">
            {description}
          </Text>
        </div>
        <div>
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
            text={cancelationDescription}
          />

          <div>
            <Text fontSize="xs" color={COLORS.DEEP_RESERVOIR} mr="s">
              {boardType}
            </Text>
            <Text fontSize="xs" color={COLORS.DEEP_RESERVOIR} mr="s">
              {beddingData &&
                beddingData
                  .filter(
                    ({ bedType, bedCount }) =>
                      bedType !== null && bedCount !== null
                  )
                  .map(({ bedType, bedCount }) => `${bedType}: ${bedCount}`)
                  .join(', ')}
            </Text>
          </div>

          <Flex
            alignItems="baseline"
            justifyContent="space-between"
            flexWrap="wrap"
          >
            <Text fontSize="xs" color={COLORS.DEEP_RESERVOIR} mr="s">
              {`Fits ${occupancyLimit} ${
                occupancyLimit === 1 ? 'person' : 'people'
              }`}
            </Text>
            <div>
              <Text
                fontSize="m"
                fontWeight="semi_bold"
                color={COLORS.SPACE_CADET}
              >
                {formatPrice({ value: amount, currencyIsoCode })}
              </Text>
              <Text fontSize="xs" color={COLORS.BLUEBERRY_SODA}>
                {' '}
                per night
              </Text>
            </div>
          </Flex>
        </div>
      </Flex>
    </StyledFlex>
    <Flex
      flexDirection="column"
      justifyContent="space-between"
      px={{ mobile: 'm' }}
      py="m"
    >
      <Flex justifyContent="space-between" mb={{ mobile: 'm', tablet: 0 }}>
        <Box mr="s">
          <StyledText as="p">Number of</StyledText>
          <StyledText as="p">rooms</StyledText>
        </Box>
        <Input.Number
          data-hj-whitelist
          min={0}
          max={maxRoomsCount}
          value={count}
          isDisabled={isDisabled}
          onChange={(value) => {
            updateStepData(({ detail: prevDetail }) => {
              const prevRooms = prevDetail?.rooms ?? []
              const index = prevRooms.findIndex((room) => room.id === id)
              const roomsUrlData =
                // eslint-disable-next-line no-nested-ternary
                index !== -1
                  ? value > 0
                    ? [
                        ...prevRooms.slice(0, index),
                        { id, count: value },
                        ...prevRooms.slice(index + 1),
                      ]
                    : [
                        ...prevRooms.slice(0, index),
                        ...prevRooms.slice(index + 1),
                      ]
                  : [...prevRooms, { id, count: value }]
              return {
                detail: { ...prevDetail, rooms: roomsUrlData },
              }
            })
          }}
        />
      </Flex>
      <Flex alignItems="baseline" justifyContent="space-between">
        <Text fontSize="xs" color={COLORS.BLUEBERRY_SODA}>
          Total
        </Text>
        <Text fontSize="l" fontWeight="semi_bold" color={COLORS.SPACE_CADET}>
          {count > 0
            ? formatPrice({
                value: count * amount,
                currencyIsoCode,
              })
            : `-`}
        </Text>
      </Flex>
    </Flex>
  </Flex>
)

RoomType.propTypes = {
  isDisabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  updateStepData: PropTypes.func.isRequired,
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
  beddingData: PropTypes.arrayOf(
    PropTypes.shape({
      bedCount: PropTypes.number.isRequired,
      bedType: PropTypes.string.isRequired,
    })
  ),
  maxRoomsCount: PropTypes.number.isRequired,
}

export default RoomType
