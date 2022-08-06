import React from 'react'
import styled from 'styled-components'
import { rem, rgba } from 'polished'
import { radius, BOXSHADOWS, COLORS } from 'Theme'
import { Flex } from 'components/Layout'
import { Text } from 'components/Typography'
import YoutubeModal from 'components/YoutubeModal'
import playIcon from 'images/svg/play.svg'
import { data as videos } from './data'
import CardSection from '../CardSection'

const ICON_SIZE = rem('64px')

const StyledCard = styled('div')`
  overflow: hidden;
  display: flex;
  flex-direction: column;

  max-width: ${rem('357px')};
  height: 100%;
  margin: auto;

  background-color: ${COLORS.WHITE};
  box-shadow: ${BOXSHADOWS.CARD};
  border-radius: ${radius.l};
`

const Image = styled('div')`
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  height: ${rem('216px')};

  ${({ src }) => src && `background: no-repeat center / cover url("${src}");`}
`

const PlayIcon = styled('img')`
  pointer-events: none;

  width: ${ICON_SIZE};
  height: ${ICON_SIZE};
`

const Logo = styled('img')`
  margin-top: auto;
  max-width: 33.33%;

  object-fit: contain;

  ${({ height }) => height && `height: ${rem(height)};`}
`

const Link = styled('a')`
  display: contents;
`

const Videos = () => {
  const [youtubeVideoId, setYoutubeVideoId] = React.useState('')

  return (
    <>
      <CardSection
        linkLabel="All videos"
        title="See for yourself"
        linkTo="https://www.youtube.com/channel/UCQTeJOy8vZ4ODUzW7bhPQKg"
        background={`linear-gradient(${rgba(COLORS.PALE_GREY, 0)}, ${
          COLORS.PALE_GREY
        })`}
      >
        {videos.map(
          ({ title, description, youtubeVideoCode, logo, logoAlt }) => (
            <StyledCard key={youtubeVideoCode}>
              <Link
                onClick={(e) => {
                  if (!(e.metaKey || e.ctrlKey)) {
                    e.preventDefault()
                    setYoutubeVideoId(youtubeVideoCode)
                  }
                }}
                href={`https://www.youtube.com/watch?v=${youtubeVideoCode}`}
              >
                <Image
                  src={`https://img.youtube.com/vi/${youtubeVideoCode}/hqdefault.jpg`}
                >
                  <PlayIcon src={playIcon} alt="" />
                </Image>
              </Link>
              <Flex
                flex={1}
                flexDirection="column"
                alignItems="flex-start"
                p="m"
              >
                <Text
                  as="h3"
                  mb="s"
                  fontSize="l"
                  lineHeight={1.35}
                  fontWeight="semi_bold"
                  color={COLORS.SPACE_CADET}
                >
                  {title}
                </Text>
                <Text as="p" mb="m" fontSize="m" color={COLORS.DEEP_RESERVOIR}>
                  {description}
                </Text>
                <Logo src={logo} height="35px" alt={logoAlt || ''} />
              </Flex>
            </StyledCard>
          )
        )}
      </CardSection>
      <YoutubeModal
        youtubeVideoId={youtubeVideoId}
        setYoutubeVideoId={setYoutubeVideoId}
      />
    </>
  )
}

export default Videos
