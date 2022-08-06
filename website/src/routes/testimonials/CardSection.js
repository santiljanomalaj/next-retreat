import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rgba } from 'polished'
import { useMedia } from 'useMedia'
import { space, BORDER_WIDTH, COLORS } from 'Theme'
import ArrowLink from 'components/ArrowLink'
import { Box, Flex, Grid } from 'components/Layout'
import { H2 } from 'components/Typography'
import { fullWidthStyle, maxWidthStyle } from 'components/mixins'

const Wrapper = styled(Box)`
  padding-top: ${space.xl};
  padding-bottom: ${space.xl};

  border: solid ${rgba(COLORS.BROTHER_BLUE, 0.4)};
  border-width: ${BORDER_WIDTH} 0;

  ${fullWidthStyle}

  ${({ background }) => background && `background: ${background};`}
`

const Content = styled('div')`
  ${maxWidthStyle}
`

const CardSection = ({ children, background, title, linkLabel, linkTo }) => {
  const matches = useMedia()

  const getMaxCardCount = () => {
    if (matches.mobile) {
      return 1
    }
    if (matches.tablet || matches.desktop) {
      return 2
    }
    return 3
  }

  return (
    <Wrapper background={background} py={{ tablet: 'xl', mobile: 'l' }}>
      <Content>
        <Flex justifyContent="space-between" alignItems="baseline">
          <H2 mb="l">{title}</H2>
          {linkTo && linkLabel && (
            <ArrowLink to={linkTo}>{linkLabel}</ArrowLink>
          )}
        </Flex>
        <Grid mt="s" gridGap="m" gridAutoFlow="column" gridAutoColumns="1fr">
          {React.Children.toArray(children).slice(0, getMaxCardCount())}
        </Grid>
      </Content>
    </Wrapper>
  )
}

CardSection.propTypes = {
  linkTo: PropTypes.string,
  linkLabel: PropTypes.string,
  background: PropTypes.string,
  title: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(PropTypes.node),
}

export default CardSection
