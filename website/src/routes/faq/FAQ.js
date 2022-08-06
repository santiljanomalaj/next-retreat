import React from 'react'
import SEO from 'components/SEO'
import GenericPage from 'components/GenericPage'
// import Input from 'components/Input'
import { H1 } from 'components/Typography'
import { Box } from 'components/Layout'
import FaqList from 'routes/components/FaqList'
import Hero from 'routes/components/Hero'
// import Categories from './Categories'

const FAQ = () => (
  <GenericPage>
    <SEO
      title="NextRetreat for Team Travel | Frequently Asked Questions"
      description="Frequently asked questions"
    />
    <Hero>
      <Box my="l">
        <H1 mb="l" textAlign={{ mobile: 'center', tablet: 'initial' }}>
          Frequently asked questions
        </H1>
        {/* TODO: Waiting for Intercom help center */}
        {/* <Input.Search placeholder="Search topics, questions,..." /> */}
      </Box>
    </Hero>
    <FaqList />
    <Box my="xl">
      {/* TODO: Waiting for Intercom help center */}
      {/* <Categories /> */}
    </Box>
  </GenericPage>
)

export default FAQ
