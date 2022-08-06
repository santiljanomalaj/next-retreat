import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { fontSizes, mq } from 'Theme'
import Button from 'components/Button'
import { Box, Flex } from 'components/Layout'
import { H2 } from 'components/Typography'

const StyledH2 = styled(H2)`
  ${mq.to.tablet`
    font-size: ${fontSizes.xxxl};
  `}
`

const CallToAction = ({
  layout,
  message,
  onClick,
  children,
  className,
  buttonLabel,
}) => (
  <Box className={className}>
    <Flex
      py={{ mobile: 'l', desktop: 'xl' }}
      flexWrap="wrap"
      flexDirection={{ mobile: 'column', desktop: layout }}
    >
      <Box flex="2" py="m">
        <StyledH2 textAlign="center">{message}</StyledH2>
      </Box>
      {buttonLabel && (
        <Box flex="1" py="m" textAlign="center">
          <Button.Inline
            {...(onClick
              ? { onClick }
              : { as: 'a', href: process.env.GATSBY_APP_URL })}
          >
            {buttonLabel}
          </Button.Inline>
        </Box>
      )}
    </Flex>
    {children}
  </Box>
)

CallToAction.defaultProps = {
  layout: 'column',
  message: 'Ready to book retreat for your team?',
}

CallToAction.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
  layout: PropTypes.string,
  message: PropTypes.string,
  className: PropTypes.string,
  buttonLabel: PropTypes.string,
}

export default CallToAction
