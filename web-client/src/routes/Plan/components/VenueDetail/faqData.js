import React from 'react'
import styled from 'styled-components'
import { rem } from 'polished'
import { space } from 'Theme'
import Faq from './Faq'

const Image = styled('img')`
  max-width: 100%;
  height: auto;
  margin: ${space.m} ${space.m} ${space.xl} 0;

  ${({ height }) => height && `max-height: ${rem(height)};`}
`

Image.defaultProps = {
  alt: '',
  height: '320px',
}

const Link = styled('a')``

Link.defaultProps = {
  as: 'a',
  target: '_blank',
  rel: 'noreferrer noopener',
}

export const data = (
  <>
    <Faq.Item question="How does the booking process work?">
      <p>Our booking process is simple and straightforward:</p>
      <ol style={{ listStyle: 'none' }}>
        <li>
          1. Add team members’ locations: – here, you select where your team
          members are flying from and the number of people participating.
        </li>
        <li>
          2. Select destination – in this step, our trip planning tool
          synchronises the travel dates and desired airports of all team members
          and displays a breakdown of the best arrival and departure dates for
          your trip. You can narrow destinations down by using our smart filters
          to pick the most suitable destination for your team.
        </li>
        <li>
          3. Find and select venue – after selecting the destination, you can
          review a list of venues. You can also use our smart filters to find
          hotels, apartment rentals, villas and more that match your pricing,
          location and accommodation requirements.
        </li>
        <li>
          4.-6. Make a reservation and get the confirmation – in this stage, you
          will see the interim summary of the booking you would like to make. If
          you would like assistance with adding activities and services to your
          retreat, you can select the services you would like to book in this
          step. After selecting ‘request to book,’ you will receive an email
          with the invoice where you can make a payment using Visa, MasterCard,
          American Express, PayPal, and various other providers. You will then
          receive a confirmation number after the booking has been made.
        </li>
        <li>
          7. Design your schedule – Once the booking is complete, our Retreat
          Specialists will reach out to you to assist in booking activities or
          services you requested during the reservation process such as airport
          transfers, a private chef, WiFi dongles, etc.
        </li>
        <p>
          Learn more details at{' '}
          <Link href={`https://www.nextretreat.com/how-it-works`}>
            How it Works
          </Link>
          .
        </p>
      </ol>
    </Faq.Item>
  </>
)
