import React from 'react'
import base, { filename } from 'paths.macro'
import { createStoryName } from 'utils/storybook'
import Pagination from './Pagination'

export const DefaultView = () => {
  const [currentPage, setCurrentPage] = React.useState(6)
  const [firstPage, lastPage] = [1, 11]

  const getPrevPage = () => (currentPage > firstPage ? currentPage - 1 : null)
  const getNextPage = () => (currentPage < lastPage ? currentPage + 1 : null)

  return (
    <Pagination
      firstPage={firstPage}
      lastPage={lastPage}
      currentPage={currentPage}
      previousPage={getPrevPage()}
      nextPage={getNextPage()}
      onNextClick={setCurrentPage}
      onPrevClick={setCurrentPage}
      onPageClick={setCurrentPage}
      info="1-25 of 500+ retreat venues"
      m="l"
    />
  )
}

export default {
  component: Pagination,
  title: createStoryName({ base, filename }),
}
