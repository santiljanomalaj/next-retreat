import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { useMedia } from 'useMedia'
import { fontSizes, mq, space, COLORS } from 'Theme'
import { maxWidthStyle } from 'components/mixins'
import Title from './Title'

const StyledSlide = styled('div')`
  display: flex;

  font-size: ${fontSizes.l};

  ${maxWidthStyle}

  p {
    max-width: ${rem('475px')};
    margin-top: ${space.m};
    margin-bottom: ${space.m};

    color: ${COLORS.DEEP_RESERVOIR};
  }

  ${mq.from.tablet`
    padding-top: ${space.l};
    padding-bottom: ${space.l};
  `}

  ${mq.from.tv`
    align-items: center;

    padding-top: ${space.xl};
    padding-bottom: ${space.xl};

    > * {
      flex: 1;
    }
  `}

  ${mq.to.tv`
    flex-direction: column;

    text-align: center;

    p {
      margin-left: auto;
      margin-right: auto;
    }
  `}
`

const Description = styled('div')`
  ${mq.to.tv`
    order: 2;
  `}
`

const ImageWrapper = styled('div')`
  ${mq.to.tv`
    order: 1;

    margin-top: ${space.l};
    margin-bottom: ${space.m};
  `}
`

const Image = styled('img')`
  ${({ height }) => height && `max-height: ${rem(height)};`}
`

const Slide = ({ title, description, image, imageHeight }) => {
  const matches = useMedia()

  return (
    <StyledSlide>
      {matches.mobile && (
        <Title isActive isBlock>
          {title}
        </Title>
      )}
      <Description>
        {description.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </Description>
      <ImageWrapper>
        <Image height={imageHeight} src={image} alt="" />
      </ImageWrapper>
    </StyledSlide>
  )
}

Slide.propTypes = {
  imageHeight: PropTypes.string,
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.array.isRequired,
}

export default Slide
