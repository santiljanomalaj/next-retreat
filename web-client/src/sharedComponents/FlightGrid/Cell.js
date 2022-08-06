import styled from 'styled-components'
import { BORDER_WIDTH, COLORS } from 'Theme'
import { math, rgba } from 'polished'
import { modulo } from 'utils/helpers'
import { CELL_WIDTH, CELL_HEIGHT } from './constants'

const HOVER_COLOR = rgba(COLORS.CHUN_LI_BLUE, 0.1)

const Cell = styled.div.attrs(
  ({
    x = 0,
    y = 0,
    isHighlighted,
    lastMoveDirection,
    calendarSizePlusOne,
    calendarSizePlusTwo,
  }) => {
    const moduloX = modulo(x, calendarSizePlusTwo)
    const moduloY = modulo(y, calendarSizePlusTwo)
    const offsetX = math(`${moduloX} * ${CELL_WIDTH}`)
    const offsetY = math(`${moduloY} * ${CELL_HEIGHT}`)

    const noTransition =
      (moduloX === calendarSizePlusOne && lastMoveDirection === 'right') ||
      (moduloX === 0 && lastMoveDirection === 'left') ||
      (moduloY === calendarSizePlusOne && lastMoveDirection === 'down') ||
      (moduloY === 0 && lastMoveDirection === 'up')

    return {
      style: {
        ...(noTransition && { transition: 'none' }),
        transform: `translate3d(${offsetX}, ${offsetY}, 0)`,
        ...(isHighlighted && {
          backgroundImage: `linear-gradient(${HOVER_COLOR}, ${HOVER_COLOR})`,
        }),
      },
    }
  }
)`
  position: absolute;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: ${CELL_WIDTH};
  height: ${CELL_HEIGHT};

  text-align: center;

  border: solid ${COLORS.BROTHER_BLUE};
  border-width: 0 0 ${BORDER_WIDTH} ${BORDER_WIDTH};

  transition: transform 0.4s;
`

export default Cell
