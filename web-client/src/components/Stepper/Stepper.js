import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { space as styledSpace } from 'styled-system'
import { math } from 'polished'
import { mq, space } from 'Theme'
import { NUMBER_SIZE, OFFSET } from './Step'

const SHIFT = math(`${NUMBER_SIZE} + ${OFFSET}`)

const OrderedList = styled('ol')`
  list-style: none;
  counter-reset: steps;

  margin-top: ${space.m};

  ${mq.from.tv`
    position: relative;
    left: -${SHIFT};

    width: calc(100% + ${SHIFT});
    padding-left: ${NUMBER_SIZE};
  `}

  ${styledSpace}
`

const Stepper = ({ children, ...props }) => (
  <OrderedList {...props}>{children}</OrderedList>
)

Stepper.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Stepper
