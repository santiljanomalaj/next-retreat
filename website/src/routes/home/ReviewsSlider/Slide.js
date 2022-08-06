import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { rem } from 'polished'
import { COLORS, radius, space, mq } from 'Theme'
import { Box, Flex } from 'components/Layout'
import { Text } from 'components/Typography'

const Picture = styled('div')`
  height: 100%;
  border-radius: 0 ${radius.m} ${radius.m} 0;
  ${mq.to.tablet`
    height: ${rem('180px')};
    border-radius: ${radius.m} ${radius.m} 0 0;
  `}
  ${({ pictureUrl }) =>
    `background: url("${pictureUrl}") center / cover no-repeat;`}
`

const Avatar = styled('img')`
  border-radius: ${radius.circle};
  height: ${rem(84)};
  margin-right: ${space.l};
  ${mq.to.tablet`
    height: ${rem(45)};
    margin-right: ${space.m};
  `}
`

const Logo = styled('img')`
  height: ${rem('45px')};
  max-width: ${rem('70px')};

  object-fit: contain;

  ${mq.to.tablet`
    height: ${rem('25px')};
  `}
`

const StyledFlex = styled(Flex)`
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
  <StyledFlex
    height={{ mobile: 'auto', tablet: rem('420px') }}
    flexDirection={{ mobile: 'column-reverse', tablet: 'row' }}
    bg={COLORS.LYNX_WHITE}
  >
    <Flex
      flexDirection={{ mobile: 'column-reverse', tablet: 'column' }}
      m={{ mobile: 'm', tablet: 'l' }}
    >
      <Flex alignItems={{ mobile: 'flex-start', desktop: 'center' }}>
        <Avatar src={avatarUrl} alt={authorName} />
        <Flex
          alignItems={{ mobile: 'flex-start', desktop: 'center' }}
          justifyContent="space-between"
          flexDirection={{
            mobile: 'column',
            desktop: 'row',
          }}
          width="100%"
        >
          <Box mr="m">
            <Text
              as="p"
              fontSize={{ mobile: 'm', tablet: 'xxl' }}
              fontWeight="semi_bold"
              color={COLORS.DEEP_RESERVOIR}
            >
              {authorName}
            </Text>
            <Text as="p" color={COLORS.BLUEBERRY_SODA}>
              {authorJobTitle}, {company}
            </Text>
          </Box>
          <Logo src={logoUrl} alt={`${company} logo`} />
        </Flex>
      </Flex>
      <Box pt="m" pb={{ mobile: 'm', tablet: 0 }}>
        <Text
          fontSize="l"
          fontWeight="light"
          fontStyle="italic"
          lineHeight={rem(30)}
          color={COLORS.DEEP_RESERVOIR}
        >
          {review}
        </Text>
      </Box>
    </Flex>
    <Box minWidth={{ tablet: '50%', desktop: '55%' }}>
      <Picture pictureUrl={pictureUrl} />
    </Box>
  </StyledFlex>
)

Slide.propTypes = {
  review: PropTypes.string.isRequired,
  logoUrl: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string.isRequired,
  pictureUrl: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  authorJobTitle: PropTypes.string.isRequired,
}

export default Slide
