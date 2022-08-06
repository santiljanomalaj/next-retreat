import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  Disclosure,
  DisclosurePanel,
  DisclosureButton,
} from '@reach/disclosure'
import { rem, math } from 'polished'
import { BORDER_WIDTH, COLORS, space, mq } from 'Theme'
import { Flex, Box } from 'components/Layout'
import { Text } from 'components/Typography'
import ArrowIcon from 'images/svg/faq-arrow.inline.svg'

const ARROW_WIDTH = rem(15)
const ARROW_MARGIN_RIGHT = space.m
const ARROW_MARGIN_LEFT = space.l
const PANEL_OFFSET_RIGHT = math(
  `${ARROW_WIDTH} + ${ARROW_MARGIN_RIGHT} + ${ARROW_MARGIN_LEFT}`
)

const StyledBox = styled(Box)`
  text-align: justify;
  font-size: ${space.m};
  color: ${COLORS.DEEP_RESERVOIR};
  margin-right: ${PANEL_OFFSET_RIGHT};

  p {
    margin-bottom: ${space.m};

    &:not(:first-child) {
      margin-top: ${space.m};
    }
  }

  ol {
    list-style-position: inside;
  }

  li:only-child {
    margin-top: ${space.l};
  }

  li + li {
    margin-top: ${space.m};
  }

  a {
    text-decoration: underline;

    color: ${COLORS.CHUN_LI_BLUE};
  }

  ${mq.to.tablet`
    margin-right: 0;
  `}
`

const StyledButton = styled(DisclosureButton)`
  width: 100%;
  min-height: ${rem(90)};
  border-bottom: ${BORDER_WIDTH} solid ${COLORS.IRRADIANT_IRIS};
  ${({ $isOpen }) => $isOpen && `border-color: transparent;`}
`

const StyledPanel = styled(DisclosurePanel)`
  padding-bottom: ${space.l};
  border-bottom: ${BORDER_WIDTH} solid ${COLORS.IRRADIANT_IRIS};
`

const DIRECTIONS = {
  DOWN: `transform: rotate(0deg);`,
  UP: `transform: rotate(180deg);`,
}

const Icon = styled(ArrowIcon)`
  min-width: ${ARROW_WIDTH};
  margin-left: ${ARROW_MARGIN_LEFT};
  margin-right: ${ARROW_MARGIN_RIGHT};
  transition: transform 0.3s ease;
  ${({ $isOpen }) => ($isOpen ? DIRECTIONS.UP : DIRECTIONS.DOWN)};
`

const FaqItem = ({ question, children }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const togglePanel = () => setIsOpen((prevOpen) => !prevOpen)
  return (
    <Disclosure open={isOpen} onChange={togglePanel}>
      <StyledButton $isOpen={isOpen}>
        <Flex alignItems="baseline" justifyContent="space-between">
          <Text
            as="p"
            fontWeight="semi_bold"
            textAlign="left"
            fontSize="l"
            color={COLORS.SPACE_CADET}
          >
            {question}
          </Text>
          <Icon $isOpen={isOpen} />
        </Flex>
      </StyledButton>
      <StyledPanel>
        <StyledBox>{children}</StyledBox>
      </StyledPanel>
    </Disclosure>
  )
}

FaqItem.propTypes = {
  question: PropTypes.string.isRequired,
  children: PropTypes.node,
}

export default FaqItem
