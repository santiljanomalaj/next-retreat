import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { fontSizes, space } from 'Theme'
import { Box } from 'components/atoms/Layout'
import Button from './Button'

const isNotNil = (value) => value != null

const Info = styled('p')`
  overflow: hidden;

  max-width: max-content;
  margin: ${space.s} auto 0;

  font-size: ${fontSizes.s};
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Controls = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  > * {
    margin: 0 ${space.xxs} ${space.s};
  }
`

const Pagination = ({
  firstPage,
  lastPage,
  currentPage,
  previousPage,
  nextPage,
  onPageClick,
  onPrevClick,
  onNextClick,
  info,
  ...props
}) => {
  const createOnClickHandler = (page) => () => onPageClick(page)
  const handlePrevClick = () => onPrevClick(previousPage)
  const handleNextClick = () => onNextClick(nextPage)

  return (
    <Box {...props}>
      <Controls>
        {isNotNil(previousPage) && (
          <Button.PreviousPage onClick={handlePrevClick} />
        )}
        {isNotNil(firstPage) && firstPage < currentPage - 1 && (
          <Button.Page
            onClick={createOnClickHandler(firstPage)}
            page={firstPage}
          />
        )}
        {isNotNil(previousPage) && previousPage - 3 > firstPage && (
          <Button.More disabled />
        )}
        {isNotNil(previousPage) && previousPage - 2 > firstPage && (
          <Button.Page
            onClick={createOnClickHandler(previousPage - 2)}
            page={previousPage - 2}
          />
        )}
        {isNotNil(previousPage) && previousPage - 1 > firstPage && (
          <Button.Page
            onClick={createOnClickHandler(previousPage - 1)}
            page={previousPage - 1}
          />
        )}
        {isNotNil(previousPage) && (
          <Button.Page
            onClick={createOnClickHandler(previousPage)}
            page={previousPage}
          />
        )}
        {isNotNil(currentPage) && <Button.Page page={currentPage} isCurrent />}
        {isNotNil(nextPage) && (
          <Button.Page
            onClick={createOnClickHandler(nextPage)}
            page={nextPage}
          />
        )}
        {isNotNil(nextPage) && nextPage + 1 < lastPage && (
          <Button.Page
            onClick={createOnClickHandler(nextPage + 1)}
            page={nextPage + 1}
          />
        )}
        {isNotNil(nextPage) && nextPage + 2 < lastPage && (
          <Button.Page
            onClick={createOnClickHandler(nextPage + 2)}
            page={nextPage + 2}
          />
        )}
        {isNotNil(nextPage) && nextPage + 3 < lastPage && (
          <Button.More disabled />
        )}
        {isNotNil(lastPage) && lastPage > currentPage + 1 && (
          <Button.Page
            onClick={createOnClickHandler(lastPage)}
            page={lastPage}
          />
        )}
        {isNotNil(nextPage) && <Button.NextPage onClick={handleNextClick} />}
      </Controls>
      {info && <Info>{info}</Info>}
    </Box>
  )
}

Pagination.propTypes = {
  info: PropTypes.string,
  firstPage: PropTypes.number.isRequired,
  lastPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  previousPage: PropTypes.number,
  nextPage: PropTypes.number,
  onNextClick: PropTypes.func.isRequired,
  onPrevClick: PropTypes.func.isRequired,
  onPageClick: PropTypes.func.isRequired,
}

export default Pagination
