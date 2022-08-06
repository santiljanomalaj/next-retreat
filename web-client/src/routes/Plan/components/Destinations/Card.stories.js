import React from 'react'
import base, { filename } from 'paths.macro'
import { createStoryName } from 'utils/storybook'
import placeholder from 'assets/images/placeholder.png'
import avgTemperaturesByMonth from 'sharedComponents/Climate/climate.json'
import Card from './Card'

const description = `
The tallest range in the Carpathian Mountains, occupy a near-mythic
place in Slovak hearts. The crooked summit of Mount Gerlach is
instantly recognizable.
`

const destination1 = {
  id: 5,
  description,
  avgPrice: { amount: 150, currencyIsoCode: 'EUR' },
  country: 'Slovakia',
  title: 'High Tatras',
  avgTemperaturesByMonth,
  pictureUrl: placeholder,
  avgTravelTimeInMinutes: 1.2,
  types: ['BEACH', 'MOUNTAINS'],
  availableOriginLocationIds: ['Kosice', 'Bratislava'],
}
const destination2 = {
  id: 5,
  description,
  avgPrice: { amount: 150, currencyIsoCode: 'EUR' },
  types: ['MOUNTAINS'],
  country: 'Slovakia',
  title: 'High Tatras',
  avgTemperaturesByMonth,
  pictureUrl: placeholder,
  avgTravelTimeInMinutes: 1.2,
  availableOriginLocationIds: ['Kosice'],
}

const originLocations = ['Kosice', 'Bratislava']

export const AllTeamsAvailableAndBothTypes = () => (
  <Card
    originLocations={originLocations}
    {...destination1}
    isCelsius
    mx="20px"
    my="20px"
  />
)
export const OneTeamUnavailableAndOneType = () => (
  <Card
    originLocations={originLocations}
    {...destination2}
    isCelsius
    mx="20px"
    my="20px"
  />
)

export default {
  component: Card,
  title: createStoryName({ base, filename }),
}
