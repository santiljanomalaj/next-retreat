import React from 'react'
import base, { filename } from 'paths.macro'
import { createStoryName } from 'utils/storybook'
import { parseISO } from 'date-fns'
import { parseQuery, stringifyQuery } from 'routes/Plan/urlHelpers'
import AllProperties from 'routes/Plan/components/Venues/Filters/AllProperties'
import MoreFilters from 'routes/Plan/components/Venues/Filters/MoreFilters'
import PriceRange from 'routes/Plan/components/Venues/Filters/PriceRange'
import MaxTeamSize from 'routes/Plan/components/Venues/Filters/MaxTeamSize'
import MonthFilter from 'routes/Plan/components/Destinations/MonthFilter'
import { Box, Flex } from 'components/atoms/Layout'
import Filter from './Filter'

const defaultURLData = stringifyQuery({
  venue: JSON.stringify({
    id: 0,
    filters: {
      retreatType: 'BALANCED',
      isMeetingRoomIncluded: false,
      venueTypes: ['HOTELS', 'APARTMENTS'],
      priceRange: [48, 281],
      priceRangeLimit: [40, 300],
    },
  }),
})

export const VenueFilters = () => {
  const [url, setUrl] = React.useState(defaultURLData)
  const venueData = JSON.parse(parseQuery(url).venue)
  const { filters } = venueData

  const setUrlFilters = (nextFilters) => {
    const nextURL = {
      venue: JSON.stringify({
        ...venueData,
        filters: {
          ...venueData.filters,
          ...nextFilters,
        },
      }),
    }

    setUrl(stringifyQuery(nextURL))
  }

  const {
    retreatType,
    isMeetingRoomIncluded,
    venueTypes,
    priceRange: [minPrice, maxPrice],
    priceRangeLimit: [minPriceLimit, maxPriceLimit],
    maxTeamSize,
    startMonth,
    endMonth,
  } = filters

  return (
    <Flex>
      <Box p="m">
        <AllProperties venueTypes={venueTypes} setUrlFilters={setUrlFilters} />
      </Box>
      <Box p="m">
        <MoreFilters
          retreatType={retreatType}
          isMeetingRoomIncluded={isMeetingRoomIncluded}
          maxTeamSize={maxTeamSize}
          setUrlFilters={setUrlFilters}
        />
      </Box>
      <Box p="m">
        <PriceRange
          minPriceLimit={minPriceLimit}
          maxPriceLimit={maxPriceLimit}
          minPrice={minPrice}
          maxPrice={maxPrice}
          setUrlFilters={setUrlFilters}
        />
      </Box>
      <Box p="m">
        <MaxTeamSize maxTeamSize={maxTeamSize} setUrlFilters={setUrlFilters} />
      </Box>
      <Box p="m">
        <MonthFilter
          startMonth={startMonth && parseISO(startMonth)}
          endMonth={endMonth && parseISO(endMonth)}
          setUrlFilters={setUrlFilters}
        />
      </Box>
    </Flex>
  )
}

export default {
  component: Filter,
  title: createStoryName({ base, filename }),
}
