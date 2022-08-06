import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { rem } from 'polished'
import { COLORS, radius, space } from 'Theme'
import { Box, Flex } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'

const Picture = styled('div')`
  ${({ pictureUrl }) =>
    `background: url("${pictureUrl}") center / cover no-repeat;`}
  height: ${rem(200)};
  border-radius: ${radius.m} ${radius.m} 0 0;
`

const Avatar = styled('img')`
  border-radius: ${radius.circle};
  height: ${rem(84)};
  margin-right: ${space.l};
`

const Logo = styled('img')`
  height: ${rem(45)};
  max-width: ${rem(70)};

  object-fit: contain;
`

const StyledBox = styled(Box)`
  border-radius: ${radius.m};
`

const Slide = ({
  review,
  logoUrl,
  company,
  avatarUrl,
  pictureUrl,
  authorName,
  authorJobTitle,
}) => (
  <StyledBox bg={COLORS.LYNX_WHITE}>
    <Picture pictureUrl={pictureUrl} />
    <Box p="l">
      <Text
        fontSize="xl"
        fontWeight="light"
        fontStyle="italic"
        color={COLORS.DEEP_RESERVOIR}
      >
        {review}
      </Text>
    </Box>
    <Flex
      justifyContent={{ mobile: 'flex-start', tablet: 'space-between' }}
      flexDirection={{ mobile: 'column-reverse', tablet: 'row' }}
      alignItems={{ mobile: 'baseline', tablet: 'center' }}
      px="l"
      pb="m"
    >
      <Flex alignItems="center">
        <Avatar src={avatarUrl} />
        <Box mr="m">
          <Text
            as="p"
            fontSize="xxl"
            fontWeight="semi_bold"
            color={COLORS.DEEP_RESERVOIR}
            lineHeight="1.2"
          >
            {authorName}
          </Text>
          <Text as="p" color={COLORS.BLUEBERRY_SODA}>
            {authorJobTitle}, {company}
          </Text>
        </Box>
      </Flex>
      <Box mb={{ mobile: 's', descktop: 0 }}>
        <Logo src={logoUrl} />
      </Box>
    </Flex>
  </StyledBox>
)

Slide.propTypes = {
  review: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  logoUrl: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string.isRequired,
  pictureUrl: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  authorJobTitle: PropTypes.string.isRequired,
}

export default Slide
