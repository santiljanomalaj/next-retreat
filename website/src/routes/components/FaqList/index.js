import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rem } from 'polished'
import { space } from 'Theme'
import Link from 'components/RouterLink'
import destinations from 'images/faq/destinations.jpg'
import originLocations from 'images/faq/origin-locations.png'
import venueList from 'images/faq/venue-list.jpg'
import syncCalendar from 'images/how-it-works/sync-calendar.png'
import designedForTeams from 'images/how-it-works/designed-for-teams.png'
import allInOneSolution from 'images/how-it-works/all-in-one-solution.png'
import FaqItem from './FaqItem'

const Image = styled('img')`
  margin: ${space.m} ${space.m} ${space.xl} 0;

  ${({ height }) => height && `max-height: ${rem(height)};`}
`

Image.defaultProps = {
  alt: '',
  height: '320px',
}

const faqData = [
  <FaqItem key="what-is-nr" question="What is NextRetreat?">
    <p>
      NextRetreat is a solution for managing team travel. Our platform helps
      teams research and select a travel destination, find and book the best
      venue and design a travel schedule for your team with the help of our
      Retreat Specialists.
    </p>
    <p>
      Intuitively built for team travel organisers and company decision-makers
      alike, NextRetreat offers easy booking and expert human-centered customer
      support all in one place. No hidden fees, contracts or special software.
    </p>
    <p>
      Learn why forward-thinking companies and teams including Hotjar, SmartBNB,
      Brainbot Technologies and others trust NextRetreat to support their team
      travel at <Link to="/testimonials">NextRetreat Stories</Link>.
    </p>
  </FaqItem>,
  <FaqItem
    key="what-makes-nr-different"
    question="What makes NextRetreat different from other ‘OTAs’ like Expedia?"
  >
    <p>
      There are many features that set NextRetreat apart. Our easy-to-use
      platform is exclusively designed for team travel, unlike other sites.
      Teams can research, book and organise travel through NextRetreat, and our
      Retreat Specialists are available to help with changes to your booking,
      troubleshooting, and building a schedule based on your team’s unique needs
      and trip requirements.
    </p>
    <p>
      The main differences compared to booking sites & OTAs (online travel
      agencies) such as Expedia, Booking.com and Airbnb include:
    </p>
    <ul>
      <li>
        <b>NextRetreat is designed exclusively for teams</b>
      </li>
    </ul>
    <p>
      Existing platforms have limited functionalities when it comes to booking
      team stays, such as only allowing users to search for a certain number of
      rooms, not providing important details about the venue that are relevant
      for teams and often lacking any post-purchase support.
    </p>
    <p>
      When planning a team trip, we understand how important details such as{' '}
      <b>
        distance from the airport, size and quality of the venue, internet speed
      </b>{' '}
      and <b>dedicated workspace/meeting rooms</b> can be for you and your team.
    </p>
    <Image src={designedForTeams} />
    <p>
      That is why we have built NextRetreat specifically and exclusively for
      teams.
    </p>
    <ul>
      <li>
        <b>All-in-one solution</b>
      </li>
    </ul>
    <p>
      Finding and synchronising dates, locations, venue, flights, workspace and
      team members is no easy task.
    </p>
    <p>
      Prior to NextRetreat, organising team travel involved spending countless
      hours on Google and travel sites comparing flight options, researching
      destinations, looking into venues, comparing team member’s availability
      and various other tedious details.
    </p>
    <Image src={allInOneSolution} />
    <p>
      NextRetreat combines all of those elements into one easy to use solution,
      making team travel organisation a breeze. Our platform provides clear and
      transparent pricing with no hidden fees, contracts or special software.
    </p>
    <ul>
      <li>
        <b>Not only technology, but real humans</b>
      </li>
    </ul>
    <p>
      In addition to our unique, proprietary technology that expedites the
      travel organisation process, there are real people behind NextRetreat. Our
      team of Retreat Specialists are here to help design your schedule and
      ensure you don’t miss any details when planning a team stay. NextRetreat
      streamlines the process of team travel organisation, automating several
      elements to help you spend less time on tedious trip details and more time
      focusing on what really matters: your business, bonding, and having fun
      with your team!
    </p>
  </FaqItem>,
  <FaqItem key="what-does-nr-offer" question="What does NextRetreat offer?">
    <p>
      NextRetreat offers an easy way to organise team travel, saving time and
      money in the process.
    </p>
    <ul>
      <li>
        <b>Find the right destination</b>
      </li>
    </ul>
    <p>
      Finding the right destination for team travel can be challenging,
      especially when team members are located in various locations, or you have
      different points of departure.
    </p>
    <Image src={originLocations} />
    <Image src={destinations} />
    <p>
      Thanks to our Destination Search Tool’s smart algorithm, you can discover
      the most suitable destinations that match your original locations and work
      for everyone, taking into account the number of flight connections,
      average travel time and price.
    </p>
    <ul>
      <li>
        <b>Choose the right dates</b>
      </li>
    </ul>
    <p>
      One of the most challenging aspects of organising team travel is picking a
      date. Finding a block of time that works for everyone’s schedule and an
      available venue can feel like an impossibility at times.
    </p>
    <p>
      NR Sync Calendar
      <br />
      NextRetreat’s Sync Calendar compares airports in your original locations
      and selected destination, thousands of return flights and other data,
      helping you choose the right dates for your trip.
    </p>
    <Image src={syncCalendar} />
    <ul>
      <li>
        <b>Find and book the right venue</b>
      </li>
    </ul>
    <p>
      Whether you’re looking for a boutique hotel located in the heart of a
      bustling city with flexible cancellation policies or a tranquil rural
      villa, you’ll be sure to find the venue that meets your team’s needs on
      NextRetreat.
    </p>
    <Image src={venueList} />
    <ul>
      <li>
        <b>Get help with everything else</b>
      </li>
    </ul>
    <p>We’ve hosted thousands of team members and know what really matters! </p>
    <p>
      Our experienced Retreat Specialists are available to help you with the
      booking process, pre-travel planning and troubleshooting on-site. We
      provide constant support to ensure everything runs smoothly, helping you
      and your team focus on your business, bonding, and – most importantly –
      having fun!
    </p>
  </FaqItem>,
  <FaqItem
    key="how-does-booking-work"
    question="How does the booking process work?"
  >
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
        step. After selecting ‘request to book,’ you will receive an email with
        the invoice where you can make a payment using Visa, MasterCard,
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
        Learn more details at <Link to="/how-it-works">How it Works</Link>.
      </p>
    </ol>
  </FaqItem>,
]

const FaqList = ({ questions }) => (
  <div>
    {questions.map((key) => faqData.find((question) => question.key === key))}
  </div>
)

FaqList.defaultProps = {
  questions: faqData.map(({ key }) => key),
}

FaqList.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.string),
}

export default FaqList
