const FIRST_PAGE = 1

const getPaginationInfo = ({ total, limit, page }) => {
  const lastPage = Math.ceil(total / limit)
  return {
    totalCount: total,
    firstPage: () => FIRST_PAGE,
    lastPage,
    currentPage: page,
    nextPage: () => {
      const pagesCount = lastPage
      const nextPage = page + 1
      return nextPage > pagesCount ? null : nextPage
    },
    previousPage: () => {
      const previousPage = page - 1
      return previousPage < FIRST_PAGE ? null : previousPage
    },
  }
}

module.exports = { getPaginationInfo }
