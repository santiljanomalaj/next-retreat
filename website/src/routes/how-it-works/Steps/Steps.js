import React from 'react'
import { rem } from 'polished'
import styled, { css } from 'styled-components'
import { useMedia } from 'useMedia'
import { fontSizes, fontWeights, mq, radius, space, COLORS } from 'Theme'
import { Box, Flex } from 'components/Layout'
import { Text } from 'components/Typography'
import { SMALL_GUTTER } from 'components/mixins'
import curve from 'images/svg/curve.svg'
import curveWithGap from 'images/svg/curve-with-gap.svg'
import packYourLaptops from 'images/how-it-works/pack-your-laptops.svg'
import lastCurve from 'images/how-it-works/last-curve.svg'
import { data as steps } from './data'

const NUMBER_SIZE = rem('48px')
const CURVE_NUDGE = rem('3px')

const contentStyle = css`
  flex: 1;

  ${mq.from.tablet`
    margin-bottom: ${space.xxl};
  `}
`

const Wrapper = styled('div')`
  position: relative;
  counter-reset: steps;

  margin-top: ${space.l};
`

const Curve = styled('div')`
  position: relative;
  right: ${CURVE_NUDGE};
  left: auto;

  height: calc(100% - ${NUMBER_SIZE});
  width: ${rem('19px')};

  background: no-repeat center url("${curve}");
  background-size: 100% calc(100% - ${space.m});
`

const Order = styled('div')`
  order: 2;
  flex: none;

  margin: 0 ${space.xl};

  &::before {
    content: counter(steps);
    display: flex;
    align-items: center;
    justify-content: center;

    width: ${NUMBER_SIZE};
    height: ${NUMBER_SIZE};
    margin: auto;

    font-size: ${fontSizes.xl};
    font-weight: ${fontWeights.semi_bold};

    border-radius: ${radius.circle};
    color: ${COLORS.BLUEBERRY_SODA};
    background-color: ${COLORS.LYNX_WHITE};
  }

  ${mq.to.tablet`
    position: relative;
    display: flex;
    align-items: center;

    margin: ${space.xl} -${SMALL_GUTTER};

    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;

      height: ${rem('34px')};

      background: center no-repeat url("${curveWithGap}");
      background-size: 100% 100%;
    }

    &:nth-child(even)::after {
      transform: scaleX(-1);
    }
  `}
`

const TextWrapper = styled('div')`
  order: 1;

  ${contentStyle}
`

const ImageWrapper = styled('div')`
  order: 3;

  ${contentStyle}
`

const Image = styled('img')`
  object-fit: contain;

  ${({ height }) => height && `max-height: ${rem(height)};`}

  ${mq.from.tablet`
    ${({ imageOffsetY }) =>
      imageOffsetY && `margin-top: -${space[imageOffsetY]};`}
  `}

  ${({ imageOffsetX }) =>
    imageOffsetX &&
    `
      max-width: none;
      width: calc(100% + ${imageOffsetX});
      margin-left: auto;
      margin-right: -${imageOffsetX};
    `}
`

const StyledStep = styled('div')`
  counter-increment: steps;
  display: flex;

  &:first-child {
    ${mq.to.tablet`
      ${Order} {
        &,
        &::before {
          margin-left: 0;
        }

        &::after {
          left: -110vw;
        }
      }
    `}
  }

  &:nth-child(even) {
    ${Image} {
      ${({ imageOffsetX }) =>
        imageOffsetX &&
        `
          margin-left: -${imageOffsetX};
          margin-right: auto;
        `}
    }

    ${mq.to.tablet`
      ${Order} {
        &::after {
          transform: scaleX(-1);
        }
      }
    `}

    ${mq.from.tablet`
      ${Curve} {
        left: ${CURVE_NUDGE};
        right: auto;

        margin-left: auto;

        transform: scaleX(-1);
      }

      ${TextWrapper} {
        order: 3;
      }

      ${ImageWrapper} {
        order: 1;
      }
    `}
  }

  ${mq.to.tablet`
    display: block;
  `}
`

const Title = styled('h3')`
  font-size: ${fontSizes.xxl};
  font-weight: ${fontWeights.semi_bold};
`

const Description = styled('div')`
  font-size: ${fontSizes.l};

  color: ${COLORS.DEEP_RESERVOIR};

  > * {
    margin: ${space.m} 0;
  }
`

const LastCurve = styled('img')`
  position: relative;
  left: 25%;

  width: calc(50% + ${SMALL_GUTTER});
  height: ${rem('77px')};
  margin-bottom: ${space.s};
  margin-top: ${space.m};
  margin-right: -${SMALL_GUTTER};
`

const Steps = () => {
  const matches = useMedia()

  return (
    <Wrapper>
      {steps.map(
        (
          {
            title,
            extra,
            image,
            imageHeight,
            description,
            imageOffsetX,
            imageOffsetY,
          },
          index
        ) => (
          <StyledStep key={index} imageOffsetX={imageOffsetX}>
            <Order>{!matches.mobile && <Curve />}</Order>
            <TextWrapper>
              <Title>{title}</Title>
              <Description>
                {description.map((paragraph, paragraphIndex) => (
                  <p key={paragraphIndex}>{paragraph}</p>
                ))}
              </Description>
              {extra && <Box mb="l">{extra}</Box>}
            </TextWrapper>
            <ImageWrapper>
              <Image
                src={image}
                alt={title}
                height={imageHeight}
                imageOffsetX={imageOffsetX}
                imageOffsetY={imageOffsetY}
              />
            </ImageWrapper>
          </StyledStep>
        )
      )}
      <Flex flexDirection="column" alignItems="center" mb="xl">
        {matches.mobile && <LastCurve src={lastCurve} alt="" />}
        <img src={packYourLaptops} alt="" />
        <Text fontSize="xxl" fontWeight="semi_bold" mt="s" mb="l">
          Pack your laptops!
        </Text>
      </Flex>
    </Wrapper>
  )
}

export default Steps
