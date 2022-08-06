import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { radius, space, BOXSHADOWS, BORDER_WIDTH, COLORS } from 'Theme'
import Button from 'components/Button'
import { H1, Text } from 'components/Typography'

export const FORM_OFFSET = rem('80px')

const StyledForm = styled('div')`
  position: relative;
  bottom: -${FORM_OFFSET};

  max-width: ${rem('524px')};
  padding: ${space.l};

  background-color: ${COLORS.WHITE};
  border: ${BORDER_WIDTH} solid ${COLORS.IRRADIANT_IRIS};
  box-shadow: ${BOXSHADOWS.DARK};
  border-radius: ${radius.l};

  > * + * {
    margin-top: ${space.m};
  }
`

const Em = styled('span')`
  text-decoration: underline;

  color: ${COLORS.CHUN_LI_BLUE};
`

const Form = ({ onSubmit }) => (
  <StyledForm>
    <H1>
      Bring your remote team <Em>together!</Em>
    </H1>
    <Text as="p" mb="l" fontSize="l" color={COLORS.DEEP_RESERVOIR}>
      NextRetreat is streamlining the process of organising team travel.
      Automating the time-consuming parts and focusing on what matters most.
    </Text>
    <Button.Block as="a" onClick={onSubmit}>
      Get access
    </Button.Block>
    <Text as="p" fontSize="s" textAlign="center" color={COLORS.BLUEBERRY_SODA}>
      No fees, contracts or special software
    </Text>
  </StyledForm>
)

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

export default Form
