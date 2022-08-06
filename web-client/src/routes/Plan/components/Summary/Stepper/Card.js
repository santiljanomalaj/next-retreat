import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { COLORS, radius, space } from 'Theme'
import { Box } from 'components/atoms/Layout'
import { Text } from 'components/atoms/Typography'
import Header from './Header'

const CARD_WIDTH = rem(170)

const ContainerBox = styled(Box)`
  background-color: ${COLORS.WHITE};
  border: 1px solid ${COLORS.IRRADIANT_IRIS};
  border-radius: ${radius.m};
`

const TextContainer = styled(Box)`
  height: ${rem('65px')};
  max-width: ${CARD_WIDTH};
  min-width: ${CARD_WIDTH};
  line-height: 1.4;
  border-top: 1px solid ${COLORS.IRRADIANT_IRIS};
  border-bottom-left-radius: ${radius.m};
  border-bottom-right-radius: ${radius.m};
  background-color: ${COLORS.WHITE};
  padding: ${space.s};
`

const Card = ({ list, ...props }) => (
  <ContainerBox>
    <Header {...props} />
    <TextContainer>
      {list.map((item, i) => (
        <span key={i}>
          <Text fontSize="s" color={COLORS.SPACE_CADET}>
            {item}
          </Text>
          {i !== list.length - 1 && (
            <Text fontSize="s" color={COLORS.SPACE_CADET}>
              ,{' '}
            </Text>
          )}
        </span>
      ))}
      {!list.length && (
        <Text fontSize="s" color={COLORS.BLUEBERRY_SODA}>
          Not Selected
        </Text>
      )}
    </TextContainer>
  </ContainerBox>
)

Card.propTypes = {
  list: PropTypes.arrayOf(PropTypes.string.isRequired),
}

export default Card
