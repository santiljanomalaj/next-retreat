import React from 'react'
import { rem } from 'polished'
import { COLORS } from 'Theme'
import { Box } from 'components/Layout'
import { Text } from 'components/Typography'
import CrossroadIcon from 'images/svg/feature/crossroad-icon.inline.svg'

const CONTAINER_WIDTH = rem(450)

const Destinations = () => (
  <div>
    <CrossroadIcon />
    <Text
      as="p"
      fontSize="xxl"
      fontWeight="semi_bold"
      color={COLORS.SPACE_CADET}
      my="m"
    >
      Discover the right destination
    </Text>
    <Box maxWidth={CONTAINER_WIDTH}>
      <Text
        as="p"
        lineHeight="27px"
        fontSize="l"
        color={COLORS.DEEP_RESERVOIR}
        mb="l"
      >
        Are your team members based in different places and you’re struggling to
        find a destination that everyone can travel to conveniently?
        <br />
        <br />
        NextRetreat helps you research and select the right destination that is
        viable for all team members – even those with the busiest schedules.
        Whether you’re traveling with 10 people or 150 people, our Destination
        Search Tool finds optimal travel locations for your team based on the
        number of flight connections, average travel time, and price.
      </Text>
    </Box>
  </div>
)

export default Destinations
