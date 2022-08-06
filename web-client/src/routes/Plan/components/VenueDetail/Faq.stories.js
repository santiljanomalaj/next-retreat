import React from 'react'
import base, { filename } from 'paths.macro'
import { createStoryName } from 'utils/storybook'
import { Box } from 'components/atoms/Layout'
import Faq from './Faq'

const question = `How does the booking process work?`
const answer = `Postponement of your booking or its cancellation is subject to
availability and our terms of use. Depending on the timing of the
cancellation, we can partially or fully refund your booking.`

export const FAQ = () => (
  <Box mx={{ mobile: 'm', tablet: 'xl' }} mt="m">
    <Faq.Container>
      <Faq.Item question={question} answer={answer} />
      <Faq.Item question={question} answer={answer} />
      <Faq.Item question={question} answer={answer} />
    </Faq.Container>
  </Box>
)

export default {
  component: Faq,
  title: createStoryName({ base, filename }),
}
