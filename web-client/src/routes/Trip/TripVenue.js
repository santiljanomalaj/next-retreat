import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem, ellipsis } from 'polished'
import { COLORS, mq } from 'Theme'
import { Text } from 'components/atoms/Typography'
import { Flex, Box } from 'components/atoms/Layout'

const IMAGE_SIZE = 50
const NUMBER_SIZE = 22

const StyledImage = styled.img`
  width: ${rem(IMAGE_SIZE)};
  height: ${rem(IMAGE_SIZE)};
  border-radius: 50%;
`

const ActionIconWrapper = styled(Flex)`
  margin-left: auto;
  ${({ onClick }) => onClick && `cursor: pointer;`}
  ${mq.from.tablet`
    visibility: hidden;
  `}
`

const TripItemWrapper = styled(Flex)`
  flex: 1;
  max-height: ${rem('66px')};
  ${({ isActive }) => isActive && `background-color: ${COLORS.LYNX_WHITE};`}
  ${({ onClick }) => onClick && `cursor: pointer};`}
  @media (hover: hover) {
    &:hover {
      background-color: ${COLORS.LYNX_WHITE};
    }
    &:hover ${ActionIconWrapper} {
      visibility: visible;
    }
  }
`

const TripItemTextWrapper = styled(Flex)`
  ${ellipsis()}
  flex-direction: column;
`

const StyledNumberWrapper = styled(Flex)`
  justify-content: center;
  align-items: center;
  position: absolute;
  width: ${rem(NUMBER_SIZE)};
  height: ${rem(NUMBER_SIZE)};
  background: ${COLORS.CHUN_LI_BLUE};
  border-radius: 50%;
  top: 0;
  bottom: 0;
  left: -${rem(NUMBER_SIZE / 2)};
  margin-top: auto;
  margin-bottom: auto;
`

const TripVenue = ({
  onClick,
  text,
  imageSrc,
  actionIconSrc,
  onActionIconClick,
  number,
  isActive,
  isTripAdmin,
  variations = [],
  venueId
}) => {

  let minPrice = Infinity
  let maxPrice = 0
  for (let i = 0; i < variations.length; i++) {
    const variation = variations[i];
    let venuePrices = (variation.prices || []).filter(p => p.venueId === Number(venueId))
    for (let j = 0; j < venuePrices.length; j++) {
      const variationPrice = venuePrices[j];
      if(variationPrice.isAvailable !== false && minPrice > variationPrice.price) minPrice = variationPrice.price
      if(variationPrice.isAvailable !== false && maxPrice < variationPrice.price) maxPrice = variationPrice.price
    }
  }
  
  return (
  <TripItemWrapper
    p="l"
    alignItems="center"
    onClick={onClick}
    isActive={isActive}
  >
    <Box position="relative">
      <StyledNumberWrapper>
        <Text fontSize="s" color={COLORS.WHITE}>
          {number}
        </Text>
      </StyledNumberWrapper>
      <StyledImage src={imageSrc} alt="" />
    </Box>
    <TripItemTextWrapper flexDirection="column" mr="m" ml="s">
      <Text as="p" fontSize="m" color={COLORS.SPACE_CADET} fontWeight="bold">
        {text}
      </Text>
      {minPrice !== Infinity && (<Text as="p" fontSize="s" color={COLORS.CHUN_LI_BLUE} fontWeight="bold">
        {minPrice} €{maxPrice !== minPrice ? ' - ' + maxPrice + ' €': ''}
      </Text>)}
    </TripItemTextWrapper>
    {actionIconSrc && isTripAdmin &&(
      <ActionIconWrapper ml="auto" onClick={onActionIconClick}>
        <img src={actionIconSrc} alt="" />
      </ActionIconWrapper>
    )}
  </TripItemWrapper>
)}

TripVenue.defaultProps = {
  isActive: false,
}

TripVenue.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.node.isRequired,
  imageSrc: PropTypes.node.isRequired,
  actionIconSrc: PropTypes.node,
  onActionIconClick: PropTypes.func,
  number: PropTypes.number.isRequired,
  isActive: PropTypes.bool,
  isTripAdmin: PropTypes.bool.isRequired,
  variations: PropTypes.array,
  venueId: PropTypes.string
}

export default TripVenue
