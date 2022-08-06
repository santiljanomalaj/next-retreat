import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  Disclosure,
  DisclosurePanel,
  DisclosureButton,
} from '@reach/disclosure'
import { rem, math } from 'polished'
import { COLORS, space } from 'Theme'
import { Flex } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import { ReactComponent as ArrowIcon } from 'assets/images/svg/faq-arrow.svg'

const StyledButton = styled(DisclosureButton)`
  width: 100%;
  min-height: ${rem(90)};
  border-bottom: 1px solid ${COLORS.IRRADIANT_IRIS};
  ${({ isOpen }) => isOpen && `border-bottom: none`};
`

const StyledPanel = styled(DisclosurePanel)`
  padding-bottom: ${space.l};
  border-bottom: 1px solid ${COLORS.IRRADIANT_IRIS};

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
`

const DIRECTIONS = {
  DOWN: `transform: rotate(0deg);`,
  UP: `transform: rotate(180deg);`,
}

const ARROW_WIDTH = rem(15)
const ARROW_MARGIN_RIGHT = space.m
const ARROW_MARGIN_LEFT = space.l
const PANEL_OFFSET_RIGHT = math(
  `${ARROW_WIDTH} + ${ARROW_MARGIN_RIGHT} + ${ARROW_MARGIN_LEFT}`
)

const Icon = styled(ArrowIcon)`
  min-width: ${ARROW_WIDTH};
  margin-left: ${ARROW_MARGIN_LEFT};
  margin-right: ${ARROW_MARGIN_RIGHT};
  transition: transform 0.3s ease;
  ${({ isOpen }) => (isOpen ? DIRECTIONS.UP : DIRECTIONS.DOWN)};
`

const Item = ({ question, children }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const togglePanel = () => setIsOpen((prevOpen) => !prevOpen)
  return (
    <Disclosure open={isOpen} onChange={togglePanel}>
      <StyledButton isOpen={isOpen}>
        <Flex alignItems="baseline" justifyContent="space-between">
          <Text as="p" textAlign="left" fontSize="l" color={COLORS.SPACE_CADET}>
            {question}
          </Text>
          <Icon isOpen={isOpen} />
        </Flex>
      </StyledButton>
      <StyledPanel>
        <Text
          as="div"
          textAlign="justify"
          fontSize="m"
          color={COLORS.DEEP_RESERVOIR}
          mr={PANEL_OFFSET_RIGHT}
        >
          {children}
        </Text>
      </StyledPanel>
    </Disclosure>
  )
}

Item.propTypes = {
  question: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

const Container = ({ children, label, ...props }) => (
  <div>
    <Text
      as="p"
      fontSize="xxl"
      fontWeight="semi_bold"
      color={COLORS.SPACE_CADET}
      mb="m"
      {...props}
    >
      {label}
    </Text>
    {children}
  </div>
)

Container.defaultProps = {
  label: 'FAQs',
}

Container.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default { Container, Item }
