import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { math, rem } from 'polished'
import { fontSizes, mq, radius, space, COLORS } from 'Theme'
import { Label } from 'components/atoms/Typography'

export const NUMBER_SIZE = rem('32px')
export const OFFSET = space.m

const StyledLabel = styled(Label)`
  position: absolute;
  bottom: 100%;

  padding-bottom: ${space.s};

  line-height: 1.5;

  ${mq.from.tv`
    left: ${OFFSET};
  `}
`

const Content = styled('div')`
  align-self: center;
  width: 100%;
`

const Item = styled('li')`
  counter-increment: steps;

  position: relative;
  display: flex;
  align-items: flex-start;

  padding-bottom: ${math(`${space.l} + ${space.s}`)};
  margin-top: ${space.s};
  min-height: ${NUMBER_SIZE};

  font-size: ${fontSizes.m};

  &::before,
  &::after {
    ${mq.to.tv`
      content: initial !important;
    `}
  }

  &::before {
    content: counter(steps) '.';

    z-index: 1;
    position: relative;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;

    margin-left: -${NUMBER_SIZE};
    margin-right: ${OFFSET};
    padding-left: 0.15em;
    width: ${NUMBER_SIZE};
    height: ${NUMBER_SIZE};

    font-size: ${fontSizes.s};

    background-color: ${COLORS.LYNX_WHITE};
    color: ${COLORS.BLUEBERRY_SODA};
    box-shadow: 0 0 0 ${rem('5px')} ${COLORS.WHITE};
    border-radius: ${radius.circle};
  }

  &::after {
    content: '';

    position: absolute;
    top: 0;
    bottom: 0;
    left: -${math(`${NUMBER_SIZE} / 2`)};
    display: block;

    border-left: 1px dashed ${COLORS.IRRADIANT_IRIS};
  }

  &:last-child {
    padding-bottom: 0;

    &::before {
      background-color: ${COLORS.WHITE};
      color: ${COLORS.CHUN_LI_BLUE};
      border: 1.5px solid;
    }

    &::after {
      content: unset;
    }
  }
`

const Step = ({ children, label }) => (
  <Item>
    <StyledLabel>{label}</StyledLabel>
    <Content>{children}</Content>
  </Item>
)

Step.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
}

export default Step
