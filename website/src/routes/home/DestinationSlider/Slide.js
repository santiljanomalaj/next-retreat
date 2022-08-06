import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { rem } from 'polished'
import { COLORS, radius } from 'Theme'
import { Box, Flex } from 'components/Layout'
import { Text } from 'components/Typography'
import LocationIcon from 'images/svg/location-icon.inline.svg'

const Picture = styled('div')`
  height: ${rem(500)};
  border-radius: ${radius.m};
  ${({ pictureUrl }) =>
    `background: url("${pictureUrl}") center / cover no-repeat;`}
`

const Slide = ({ description, pictureUrl, title, country }) => (
  <div>
    <Picture pictureUrl={pictureUrl} />
    <Box mt="m">
      <Flex alignItems="center">
        <LocationIcon />
        <Box ml="s">
          <Text fontSize="l" fontWeight="semi_bold" color={COLORS.SPACE_CADET}>
            {title}
          </Text>
          <Text color={COLORS.BROTHER_BLUE} mx="s">
            •
          </Text>
          <Text fontSize="m" color={COLORS.SPACE_CADET}>
            {country}
          </Text>
        </Box>
      </Flex>
      <Text
        as="p"
        lineHeight="24px"
        fontSize="m"
        color={COLORS.DEEP_RESERVOIR}
        mt="s"
      >
        {description}
      </Text>
    </Box>
  </div>
)

Slide.propTypes = {
  title: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  pictureUrl: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}

export default Slide
