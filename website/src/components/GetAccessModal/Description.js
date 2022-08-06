import React from 'react'
import styled from 'styled-components'
import { COLORS, space } from 'Theme'
import { H3, Text } from 'components/Typography'
import { Box, Flex } from 'components/Layout'
import servicesImage from 'images/home/destinations/services.png'

const Image = styled('img')`
  display: block;
  object-fit: contain;
`

const Description = () => (
  <Flex alignSelf="center" flexDirection="column" mt="auto" mb="auto">
    <H3 fontWeight="bold" lineHeight="32px" color={COLORS.WHITE} mb="l">
      Beautiful & easy to use tool for organising team retreats, offsites &
      in-person meetups.
    </H3>
    <Text as="p" fontSize="s" color={COLORS.WHITE} mb="m">
      It takes 10 minutes to find a suitable destination for your team trip
      where everyone can get effectively.
    </Text>
    <Box mr={`-${space.xl}`} mb="l">
      <Image src={servicesImage} />
    </Box>
    <Text as="p" fontSize="s" color={COLORS.WHITE} mb="m">
      <span role="img" aria-label="clock">
        🕒
      </span>
      <Text ml="xs">
        Time: With NR you can save up to 100 hours of research & planning, which
        is almost 13 full work days (compared to self-organisation).
      </Text>
    </Text>
    <Text as="p" fontSize="s" color={COLORS.WHITE}>
      <span role="img" aria-label="clock">
        💸
      </span>
      <Text ml="xs">
        Cost: NR saves you up to 20% of all your expenses compared to a self
        organisation or organisation with an agency.
      </Text>
    </Text>
  </Flex>
)

export default Description
