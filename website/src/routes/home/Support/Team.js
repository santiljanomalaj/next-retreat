import React from 'react'
import styled from 'styled-components'
import { rem } from 'polished'
import { COLORS } from 'Theme'
import { Box } from 'components/Layout'
import { Text } from 'components/Typography'
import supportTeamImage from 'images/support-team-home.png'

const SupportTeamImage = styled('img')`
  display: block;

  height: ${rem('96px')};
`

const Team = () => (
  <div>
    <SupportTeamImage
      src={supportTeamImage}
      alt="Petra, Inna & Snezana from NextRetreat"
    />
    <Box maxWidth={{ mobile: 'unset', tablet: rem(350), desktop: rem(450) }}>
      <Text
        as="p"
        fontSize="xxl"
        fontWeight="semi_bold"
        color={COLORS.SPACE_CADET}
        my="m"
      >
        Your dedicated Retreat Specialist
      </Text>
      <Text lineHeight={rem(27)} fontSize="l" color={COLORS.DEEP_RESERVOIR}>
        We’ve hosted thousands of team members and know what really matters!
        <br />
        <br />
        Our experienced Retreat Specialists help you with the booking process,
        pre-travel planning, and troubleshooting on-site. We provide constant
        support to ensure everything runs smoothly, helping you and your team
        focus on your business, bonding, and – most importantly – having fun!
      </Text>
    </Box>
  </div>
)

export default Team
