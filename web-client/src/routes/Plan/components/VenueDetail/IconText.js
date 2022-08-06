import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { COLORS, radius, fontSizes } from 'Theme'
import { Flex, Box, Grid } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import meetingRoomIcon from 'assets/images/svg/meeting-room-venue-detail.svg'
import bedroomIcon from 'assets/images/svg/bed-venue-detail.svg'
import capacityIcon from 'assets/images/svg/capacity.svg'

const Icon = styled('img')`
  height: ${rem(22)};
`

const BUBBLE_SIZE = rem(44)

const StyledFlex = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${BUBBLE_SIZE};
  width: ${BUBBLE_SIZE};
  border-radius: ${radius.circle};
  border: 1px solid ${COLORS.BLACK};
`

const IconText = ({ icon, texts }) => (
  <Flex alignItems="center">
    <StyledFlex>
      <Icon src={icon} />
    </StyledFlex>
    <Box ml="s">
      {texts.map((text, i) => (
        <div key={i}>{text}</div>
      ))}
    </Box>
  </Flex>
)

IconText.propTypes = {
  icon: PropTypes.string.isRequired,
  texts: PropTypes.arrayOf(PropTypes.node.isRequired).isRequired,
}

const TEXT_STYLES = `
  white-space: nowrap;
  font-size: ${fontSizes.m};
`

export const StyledTextLabel = styled(Text)`
  ${TEXT_STYLES}
  color:${COLORS.BLUEBERRY_SODA};
`

export const StyledTextValue = styled(Text)`
  ${TEXT_STYLES}
  color:${COLORS.SPACE_CADET};
`

const IconTextGrid = ({ numberOfRooms, isMeetingRoomIncluded, capacity }) => (
  <Grid
    gridTemplateColumns={{ mobile: `1fr`, tablet: `1fr 1fr 1fr` }}
    gridGap="l"
  >
    <IconText
      icon={bedroomIcon}
      texts={[
        <StyledTextValue>{numberOfRooms}</StyledTextValue>,
        <StyledTextLabel>{numberOfRooms > 1 ? 'rooms' : 'room'}</StyledTextLabel>,
      ]}
    />
    {capacity && (
      <IconText
      icon={capacityIcon}
      texts={[
        <StyledTextValue>{capacity}</StyledTextValue>,
        <StyledTextLabel>pax</StyledTextLabel>,
      ]}
      />
    )}
    {isMeetingRoomIncluded && (
      <IconText
        icon={meetingRoomIcon}
        texts={[<StyledTextLabel>Meeting room</StyledTextLabel>]}
      />
    )}
  </Grid>
)

IconTextGrid.propTypes = {
  numberOfRooms: PropTypes.number.isRequired,
  isMeetingRoomIncluded: PropTypes.bool.isRequired,
}

export default {
  Item: IconText,
  Grid: IconTextGrid,
}
