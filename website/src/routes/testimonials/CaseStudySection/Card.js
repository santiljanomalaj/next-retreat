import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Truncate from 'react-truncate'
import { rem } from 'polished'
import { space, radius, COLORS, fontSizes, fontWeights } from 'Theme'
import { Text } from 'components/Typography'
import { Flex, Box } from 'components/Layout'
import Wave from 'images/svg/wave-grey.inline.svg'

const PICTURE_MARGIN = space.m
const AVATAR_SIZE = rem('36px')

const ReadMoreButton = styled('button')`
  font-size: inherit;
  text-decoration: underline;

  color: inherit;
`

const Picture = styled(Box)`
  height: ${rem(180)};
  ${({ pictureUrl }) =>
    `background: url("${pictureUrl}") center / cover no-repeat;`}
  margin: -${PICTURE_MARGIN} -${PICTURE_MARGIN} 0;
`

const Avatar = styled('img')`
  flex: none;
  height: ${AVATAR_SIZE};
  width: ${AVATAR_SIZE};
  margin-right: ${space.m};

  object-fit: cover;
  border-radius: ${radius.circle};
`
const Logo = styled('img')`
  height: ${rem('24px')};
  max-width: ${rem('80px')};

  object-fit: contain;
`

const StyledWave = styled(Wave)`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
`

const StyledBox = styled(Box)`
  flex: none;
  min-height: ${rem('184px')};

  background: linear-gradient(360deg, #fafafa 0%, #ebeef2 100%);
  padding: ${space.m};
`

const textStyles = `
  font-size: ${fontSizes.m};
  color: ${COLORS.SPACE_CADET};
`

const StyledText = styled(Text)`
  ${textStyles};
  font-weight: ${fontWeights.semi_bold};
`

const GoalsBox = styled('div')`
  ${textStyles}
`

const Card = ({
  goals,
  review,
  logoUrl,
  company,
  avatarUrl,
  authorName,
  pictureUrl,
  numberOfDays,
  authorJobTitle,
  numberOfteamMembers,
}) => {
  const [isTextExpanded, setIsTextExpanded] = React.useState(false)

  return (
    <Flex
      flexDirection="column"
      justifyContent="space-between"
      width="100%"
      height="100%"
      bg={COLORS.LYNX_WHITE}
    >
      <Box position="relative" height="100%" px="m" pt="m" pb="l">
        <Picture pictureUrl={pictureUrl} />
        <Box
          pt="m"
          pb={{ mobile: 'm', tablet: 0 }}
          color={COLORS.DEEP_RESERVOIR}
          fontSize="s"
        >
          <Truncate
            lines={!isTextExpanded && 6}
            ellipsis={
              <Text color={COLORS.CHUN_LI_BLUE}>
                {' '}
                +{' '}
                <ReadMoreButton
                  type="button"
                  onClick={() => {
                    setIsTextExpanded(true)
                  }}
                >
                  Read more
                </ReadMoreButton>
              </Text>
            }
          >
            <Text as="p" fontSize="s" color={COLORS.DEEP_RESERVOIR}>
              {review}
            </Text>
          </Truncate>
        </Box>
        <Flex alignItems="center" mt="m">
          {avatarUrl && <Avatar src={avatarUrl} alt={authorName} />}
          <Flex alignItems="center" justifyContent="space-between" width="100%">
            <Box mr="m">
              <Text
                as="p"
                fontSize="s"
                fontWeight="semi_bold"
                color={COLORS.SPACE_CADET}
              >
                {authorName}
              </Text>
              <Text as="p" fontSize="s" color={COLORS.DEEP_RESERVOIR}>
                {authorJobTitle}, {company}
              </Text>
            </Box>
            <Logo src={logoUrl} alt={`${company} logo`} />
          </Flex>
        </Flex>
        <StyledWave />
      </Box>
      <StyledBox>
        <Flex justifyContent="space-between" mb="s">
          <StyledText as="p">{numberOfteamMembers}</StyledText>
          <StyledText as="p">{numberOfDays}</StyledText>
        </Flex>
        <StyledText as="p">Goals:</StyledText>
        <GoalsBox>
          {goals.map((goal) => (
            <Text as="p" key={goal}>
              <Text fontWeight="bold">•</Text> {goal}
            </Text>
          ))}
        </GoalsBox>
      </StyledBox>
    </Flex>
  )
}

Card.propTypes = {
  avatarUrl: PropTypes.string,
  review: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  logoUrl: PropTypes.string.isRequired,
  pictureUrl: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  numberOfDays: PropTypes.string.isRequired,
  authorJobTitle: PropTypes.string.isRequired,
  numberOfteamMembers: PropTypes.string.isRequired,
  goals: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
}

export default Card
