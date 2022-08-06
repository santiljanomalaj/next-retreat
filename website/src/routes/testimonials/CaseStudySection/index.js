import React from 'react'
import styled from 'styled-components'
import { rem } from 'polished'
import { COLORS, mq, fontSizes } from 'Theme'
import { fullWidthStyle } from 'components/mixins'
import { Grid, Box } from 'components/Layout'
import { Text } from 'components/Typography'
import caseStudyImage from 'images/testimonials.png'
import Button from 'components/Button'
import { data as cardData } from './data'
import Card from './Card'

const StyledBox = styled(Box)`
  z-index: 2;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-40%, -50%);
  ${mq.to.tablet`
    width: 100%;
    text-align: center;
    transform: translate(-50%, -50%);
    lineHeight="27px"
  `}
`

const GradientOverlay = styled('div')`
  z-index: 1;
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    360deg,
    ${COLORS.WHITE} 0%,
    rgba(219, 223, 231, 0) 100%
  );
`

const DecorativeImage = styled('div')`
  background: url("${caseStudyImage}") center / cover no-repeat;
  min-height: ${rem(210)};

  ${mq.from.tablet`
    min-height: ${rem(270)};
  `}

  ${mq.from.desktop`
    min-height: ${rem(420)};
  `}

  ${mq.to.tablet`
    background-size: auto 110%;
  `}
`

const StyledContainer = styled('div')`
  ${mq.to.tablet`
    ${fullWidthStyle}
  `}
`

const CaseStudySection = () => {
  const [itemLimit, setItemLimit] = React.useState(6)

  return (
    <div>
      <Box css={fullWidthStyle}>
        <GradientOverlay />
        <DecorativeImage />
        <StyledBox>
          <Text
            as="p"
            fontSize={{ mobile: rem(80), tablet: rem(128) }}
            fontWeight="bold"
            lineHeight={{ mobile: '50px', tablet: '100px', desktop: '154px' }}
          >
            2,000+
          </Text>
          <Text
            as="p"
            fontSize={{ mobile: 'xxxl', tablet: 'xxxxl', desktop: 'xxxxxxl' }}
            fontWeight="bold"
            lineHeight="54px"
          >
            team members hosted by NextRetreat
          </Text>
        </StyledBox>
      </Box>
      <Text
        as="p"
        textAlign="center"
        fontSize={{ mobile: fontSizes.xl, tablet: fontSizes.xxxxxl }}
        fontWeight="bold"
        color={COLORS.SPACE_CADET}
        mt="m"
        mb={{ mobile: 'm', tablet: 'xl' }}
      >
        A little more love
      </Text>
      <StyledContainer>
        <Grid
          gridTemplateColumns={{
            mobile: `1fr`,
            tablet: `1fr 1fr`,
            desktop: `1fr 1fr 1fr`,
          }}
          justifyItems="center"
          gridGap="m"
        >
          {cardData.slice(0, itemLimit).map((card, i) => (
            <Card {...card} key={i} />
          ))}
        </Grid>
      </StyledContainer>
      {itemLimit && (
        <Grid
          gridTemplateColumns={{
            mobile: `1fr`,
            desktop: `1fr 1fr 1fr`,
          }}
          justifyItems="center"
          gridGap="m"
          maxWidth={{ mobile: rem(216), desktop: '100%' }}
          pt="xl"
          m="0 auto"
        >
          <div />
          <Button.Secondary
            isBlock
            onClick={() => {
              setItemLimit(undefined)
            }}
          >
            Show More
          </Button.Secondary>
          <div />
        </Grid>
      )}
    </div>
  )
}

export default CaseStudySection
