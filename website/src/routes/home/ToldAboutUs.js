import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { math, rem, rgba } from 'polished'
import { fontSizes, fontWeights, mq, space, COLORS } from 'Theme'
import { fullWidthStyle, maxWidthStyle } from 'components/mixins'
import { H2 } from 'components/Typography'
import euStartupsLogo from 'images/home/told-about-us/eu-startups.png'
import forbesLogo from 'images/home/told-about-us/forbes.svg'
import hospodarskeNovinyLogo from 'images/home/told-about-us/hospodarske-noviny.svg'
import theGlobeAndMailLogo from 'images/home/told-about-us/the-globe-and-mail.svg'
import { REVIEW_SLIDER_OFFSET } from 'routes/home/constants'

const HIGHEST_LOGO_HEIGHT = rem('30px') // Ensures logos are baseline aligned

const StyledReview = styled('div')`
  font-style: italic;
  font-size: ${fontSizes.l};
  font-weight: ${fontWeights.light};
  line-height: 1.5;
  text-align: center;

  > * {
    padding: 0 ${space.s};
  }
`

const ReviewText = styled('p')`
  max-width: ${rem('340px')};
  margin: ${space.l} auto 0;
`

const ReviewLogo = styled('div')`
  margin: ${space.l} auto 0;
  height: ${HIGHEST_LOGO_HEIGHT};

  ${({ imgSrc, logoHeight }) =>
    imgSrc &&
    `
      background: url("${imgSrc}") no-repeat bottom center;
      background-size: auto ${logoHeight || rem('21px')};
    `}
`

const Review = ({ text, logo, logoHeight }) => (
  <StyledReview>
    <ReviewLogo imgSrc={logo} logoHeight={logoHeight} />
    <ReviewText>{text}</ReviewText>
  </StyledReview>
)

Review.propTypes = {
  text: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  logoHeight: PropTypes.string,
}

const Wrapper = styled('div')`
  padding: ${space.xl} 0 ${math(`${space.xxl} + ${rem(REVIEW_SLIDER_OFFSET)}`)};

  background-image: linear-gradient(
    ${COLORS.PALE_GREY},
    ${rgba(COLORS.PALE_GREY, 0)}
  );

  ${fullWidthStyle}
`

const Reviews = styled('div')`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: ${space.l} ${space.m};

  ${mq.from.tablet`
    grid-template-columns: repeat(2, 1fr);
  `}

  ${mq.from.desktop`
    grid-template-columns: repeat(4, 1fr);
  `}
`

const ToldAboutUs = () => (
  <Wrapper>
    <div css={maxWidthStyle}>
      <H2 textAlign="center" mb="l">
        Featured In
      </H2>
      <Reviews>
        <Review
          logo={theGlobeAndMailLogo}
          text="‘Combines living & working quarters specifically targeted to groups – complete with luxurious accommodations, team facilitation services & activities such as standup paddle.’"
        />
        <Review
          logo={forbesLogo}
          text="‘Imagine that the company decides to move its HQ from a gloomy urban environment to beautiful beaches in Tenerife, where team members not only relax but get to know each other better.’"
        />
        <Review
          logo={hospodarskeNovinyLogo}
          text="‘People work more efficiently outside the office, says company, offering trips for teams in destinations like High Tatras or Croatia.’"
        />
        <Review
          logo={euStartupsLogo}
          logoHeight={HIGHEST_LOGO_HEIGHT}
          text="‘Their aim is to help teams that are working remotely, flexibly or indeed in the same office, choose the right trip destination, find and book venues with ideal accommodations and workspace.’"
        />
      </Reviews>
    </div>
  </Wrapper>
)

export default ToldAboutUs
