import React from 'react'
import PropTypes from 'prop-types'
import { rem } from 'polished'
import { COLORS } from 'Theme'
import { Flex, Box } from 'components/Layout'
import { Text } from 'components/Typography'
import CheckmarkIcon from 'images/svg/feature/checkmark.inline.svg'
import SofaLampIcon from 'images/svg/feature/sofaLamp-icon.inline.svg'

const CONTAINER_WIDTH = rem(450)

const IconText = ({ label }) => (
  <Flex alignItems="center">
    <CheckmarkIcon />
    <Text as="p" fontSize="l" ml="m">
      {label}
    </Text>
  </Flex>
)

IconText.propTypes = {
  label: PropTypes.string.isRequired,
}

const Venues = () => (
  <div>
    <Box>
      <SofaLampIcon />
      <Text
        as="p"
        fontSize="xxl"
        fontWeight="semi_bold"
        color={COLORS.SPACE_CADET}
        my="m"
      >
        Book the right venue for your team
      </Text>
      <Box maxWidth={CONTAINER_WIDTH}>
        <Text
          as="p"
          lineHeight="27px"
          fontSize="l"
          color={COLORS.DEEP_RESERVOIR}
          mb="l"
        >
          Looking for a villa with spacious communal areas and reliable internet
          or a hotel that isn’t too ‘corporate’ and matches your needs and
          budget?
          <br />
          <br />
          NextRetreat is designed exclusively for teams. We understand how
          important details such as the venue’s capacity, distance from the
          airport, internet speed, and dedicated workspace can be when looking
          for the right venue for your team.
        </Text>
      </Box>
    </Box>
    <IconText label="Unique, high quality venues" />
    <IconText label="Size & capacity (suitable for large teams)" />
    <IconText label="Workspace & meeting rooms" />
    <IconText label="Strong internet" />
    <IconText label="Flexible booking policies" />
    <IconText label="Distance from the airport" />
  </div>
)

export default Venues
