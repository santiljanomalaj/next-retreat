import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { rem } from 'polished'
import { useMedia } from 'useMedia'
import { mq, space, radius, COLORS, fontSizes, fontWeights } from 'Theme'
import { Flex, Box } from 'components/Layout'
import { Text } from 'components/Typography'
import Button from 'components/Button'
import YoutubeModal from 'components/YoutubeModal'
import Wave from 'images/svg/wave-grey.inline.svg'

const AVATAR_SIZE = rem('64px')

const Avatar = styled('img')`
  flex: none;
  height: ${AVATAR_SIZE};
  width: ${AVATAR_SIZE};
  margin-right: ${space.m};

  object-fit: cover;
  border-radius: ${radius.circle};
`

const Logo = styled('img')`
  height: ${rem('35px')};
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
  margin-bottom: ${space.m};
`

const CTAWrapper = styled('div')`
  display: flex;
  justify-content: space-between;

  ${mq.to.tablet`
    flex-direction: column;
  `}
`

const CTAButton = styled(Button.Secondary)`
  ${mq.to.tablet`
    & + & {
      margin-top: ${space.m};
    }
  `}

  ${mq.from.tablet`
    & + & {
      margin-left: ${space.m};
    }
  `}
`

const Card = ({
  goals,
  review,
  logoUrl,
  company,
  avatarUrl,
  authorName,
  ctaButtons,
  numberOfDays,
  authorJobTitle,
  numberOfteamMembers,
}) => {
  const [youtubeVideoId, setYoutubeVideoId] = React.useState('')
  const matches = useMedia()

  return (
    <>
      <Box width={{ mobile: '100%', tablet: rem(455) }} bg={COLORS.LYNX_WHITE}>
        <Box position="relative" px="m" pt="m" pb="l">
          <Flex alignItems={{ mobile: 'flex-start', tablet: 'center' }}>
            <Avatar src={avatarUrl} alt={authorName} />
            <Flex
              alignItems={{ mobile: 'flex-start', tablet: 'center' }}
              justifyContent="space-between"
              flexDirection={{
                mobile: 'column',
                tablet: 'row',
              }}
              width="100%"
            >
              <Box mr="m">
                <Text
                  as="p"
                  fontSize="l"
                  fontWeight="semi_bold"
                  color={COLORS.SPACE_CADET}
                >
                  {authorName}
                </Text>
                <Text as="p" color={COLORS.DEEP_RESERVOIR}>
                  {authorJobTitle}, {company}
                </Text>
              </Box>
              <Logo src={logoUrl} alt={`${company} logo`} />
            </Flex>
          </Flex>
          <Box pt="m" pb={{ mobile: 'm', tablet: 0 }}>
            <Text as="p" fontSize="m" color={COLORS.DEEP_RESERVOIR}>
              {review}
            </Text>
          </Box>
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
          <CTAWrapper>
            {ctaButtons.map(({ label, url, youtubeVideoCode }, input) => (
              <CTAButton
                as="a"
                href={url}
                key={input}
                target="_blank"
                isBlock={matches.mobile}
                rel="noreferrer noopener"
                {...(youtubeVideoCode && {
                  onClick: (e) => {
                    if (!(e.metaKey || e.ctrlKey)) {
                      e.preventDefault()
                      setYoutubeVideoId(youtubeVideoCode)
                    }
                  },
                  href: `https://www.youtube.com/watch?v=${youtubeVideoCode}`,
                })}
              >
                {label}
              </CTAButton>
            ))}
          </CTAWrapper>
        </StyledBox>
      </Box>
      <YoutubeModal
        youtubeVideoId={youtubeVideoId}
        setYoutubeVideoId={setYoutubeVideoId}
      />
    </>
  )
}

Card.propTypes = {
  ctaButtons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string,
      youtubeVideoCode: PropTypes.string,
    })
  ).isRequired,
  review: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  logoUrl: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  numberOfDays: PropTypes.string.isRequired,
  authorJobTitle: PropTypes.string.isRequired,
  numberOfteamMembers: PropTypes.string.isRequired,
  goals: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
}

export default Card
