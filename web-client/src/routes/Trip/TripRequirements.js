import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import capacityIcon from 'assets/images/svg/capacity.svg'
import bedIcon from 'assets/images/svg/bed-venue-detail.svg'
import meetingRoomIcon from 'assets/images/svg/meeting-room-venue-detail.svg'
import mapIcon from 'assets/images/svg/map.svg'
import calendarIcon from 'assets/images/svg/calendar.svg'
import historicalBuildingIcon from 'assets/images/svg/historical-building.svg'
import notesIcon from 'assets/images/svg/notes.svg'
import { rem } from 'polished'
import { COLORS, radius, fontSizes } from 'Theme'
import { Flex, Box, Grid } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'

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
const TEXT_STYLES = `
  white-space: nowrap;
  font-size: ${fontSizes.m};
`

const StyledTextLabel = styled(Text)`
  ${TEXT_STYLES}
  color:${COLORS.BLUEBERRY_SODA};
`

const StyledTextValue = styled(Text)`
  ${TEXT_STYLES}
  color:${COLORS.SPACE_CADET};
  font-weight: 600;
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

const TripRequirements = ({ requirements }) => {
  const parsed = JSON.parse(requirements || '{}')
  const { pax, meetingRoom, nights, additionalInfo, venueType, destination, dateInfo } = parsed
  return (
    <>
      <Box m="m">
        <Text
          as="p"
          color={COLORS.BLACK}
          fontSize={{ mobile: 'xl', desktop: 'xxxl' }}
          fontWeight="bold"
          mr="m"
          maxWidth={{ mobile: '80%', desktop: 'initial' }}
        >
          Trip requirements
        </Text>

      </Box>
      <Box m="m" mb="xl">
        <Grid
          gridTemplateColumns={{ mobile: `1fr`, tablet: `1fr 1fr` }}
          gridGap="l"
        >
          <IconText icon={capacityIcon} texts={[
            <StyledTextValue>How big is your team?</StyledTextValue>,
            <StyledTextLabel>{pax ?? '-'}</StyledTextLabel>,
          ]} />
          <IconText icon={meetingRoomIcon} texts={[
            <StyledTextValue>Do you need a working space or common area?</StyledTextValue>,
            <StyledTextLabel>{meetingRoom ?? '-'}</StyledTextLabel>,
          ]} />
          <IconText icon={bedIcon} texts={[
            <StyledTextValue>How many nights would you like to stay?</StyledTextValue>,
            <StyledTextLabel>{nights ?? '-'}</StyledTextLabel>,
          ]} />
          <IconText icon={historicalBuildingIcon} texts={[
            <StyledTextValue>Where would you like to stay?</StyledTextValue>,
            <StyledTextLabel>{venueType ?? '-'}</StyledTextLabel>,
          ]} />
          <IconText icon={mapIcon} texts={[
            <StyledTextValue>Where would you like to go?</StyledTextValue>,
            <StyledTextLabel>{destination ?? '-'}</StyledTextLabel>,
          ]} />
          <IconText icon={notesIcon} texts={[
            <StyledTextValue>Anything else you would like to add?</StyledTextValue>,
            <StyledTextLabel>{additionalInfo ?? '-'}</StyledTextLabel>,
          ]} />
          <IconText icon={calendarIcon} texts={[
            <StyledTextValue>When would you like to go?</StyledTextValue>,
            <StyledTextLabel>{dateInfo ?? '-'}</StyledTextLabel>,
          ]} />

        </Grid>
      </Box>
    </>
  )
}

TripRequirements.propTypes = {
  requirements: PropTypes.string
}

export default TripRequirements
