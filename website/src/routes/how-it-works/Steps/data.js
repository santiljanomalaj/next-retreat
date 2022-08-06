import bookingConfirmed from 'images/how-it-works/booking-confirmed.png'
import bookingRequest from 'images/how-it-works/booking-request.png'
import designYourSchedule from 'images/how-it-works/design-your-schedule.png'
import destinations from 'images/how-it-works/destinations.png'
import requestSummary from 'images/how-it-works/request-summary.png'
import teamLocations from 'images/how-it-works/team-locations.png'
import venues from 'images/how-it-works/venues.png'
import { paymentOptions } from './paymentOptions'

export const data = [
  {
    title: 'Team locations',
    description: [
      'Some companies have 1 or 2 office locations, and some have team members scattered all around the world, making it difficult to find a destination that suits everyone.',
      'To start the process, you can enter your team’s original locations or preferred points of departure. To refine the results even further, you have the option to include the number of individuals in each location (if you have this information).',
    ],
    image: teamLocations,
    imageHeight: '409px',
    imageOffsetX: '33.333%',
    imageOffsetY: 'xl',
  },
  {
    title: 'Destinations',
    description: [
      'We understand the hassle of synchronising dates, locations, flights and people.',
      'Thanks to our Destination Search Tool’s smart algorithm, you can discover destinations that match your original locations and work for everyone, taking into account the number of flight connections, average travel time, and price.',
      'If you already know when you’d like to travel, you can update the results based on the preferred month or range.',
    ],
    image: destinations,
    imageHeight: '507px',
    imageOffsetX: '83.333%',
    imageOffsetY: 'xl',
  },
  {
    title: 'Venues',
    description: [
      'The next step involves finding the right place for your team to stay, work, and have a good time.',
      'Whether you’re looking for a boutique hotel located in the heart of a bustling city with flexible cancellation policies or a tranquil rural villa, you’ll be sure to find the venue that meets your team’s needs.',
      'To begin your search, add the maximum number of team members (max. guests), property type, and price range. Optionally check if you require a meeting room and select suitable dates using the NextRetreat Sync Calendar [beta], which displays the number of team members who can fly out on the same day based on flight availability and layovers.',
      'After reviewing the results, select your preferred venue.',
    ],
    image: venues,
    imageHeight: '410px',
    imageOffsetY: 'xl',
  },
  {
    title: 'Booking request',
    description: [
      'Once you have checked the availability of your venue and selected the rooms needed, you can make a booking request.',
      'Review your details, including price and booking conditions, and finalize the request by filling out the form with your information. In this step you can also request our help with services that your team may need, such as travel insurance, WiFi dongles, transportation solutions, food, etc.',
    ],
    image: bookingRequest,
    imageHeight: '574px',
    imageOffsetX: '5%',
    imageOffsetY: 'xl',
  },
  {
    title: 'Request summary',
    description: [
      'Check your email inbox, where you will receive a summary of the booking request. An invoice will be sent to your email which will provide payment instructions.',
      'You can review the trip details, ask us any questions, and make the payment.',
      'We accept VISA, American Express, MasterCard, PayPal, bank transfer and Transferwise. Payment in cryptocurrency (ETH, BTC) is possible upon request.',
    ],
    extra: paymentOptions,
    image: requestSummary,
    imageHeight: '402px',
    imageOffsetX: '20%',
    imageOffsetY: 'm',
  },
  {
    title: 'Booking confirmed',
    description: [
      'Congratulations, your booking is confirmed!',
      'After successfully completing the payment, you will receive a confirmation email with your reservation number, all the booking details, and next steps.',
    ],
    image: bookingConfirmed,
    imageHeight: '423px',
    imageOffsetY: 'xl',
  },
  {
    title: 'Design your schedule',
    description: [
      'Let’s start planning your trip!',
      'Our Retreat Specialists will get in touch with you to schedule a 1-on-1 call to collect your requirements and start designing your schedule. In this step we will cover everything from logistics, local transportation to activities to make sure you are 100% prepared for your trip.',
      'We’ll take care of the legwork. What remains for your team is to lean back, chill out and look forward to your trip!',
    ],
    image: designYourSchedule,
    imageHeight: '372px',
    imageOffsetY: 'xl',
  },
]
