import fresh8GamingLogo from 'images/logo/fresh-8-gaming.png'
import hotjarLogo from 'images/logo/hotjar.svg'
import teskalabsLogo from 'images/logo/teskalabs.png'
import fresh8GamingPerson from 'images/testimonials/people/fresh-8-gaming.jpg'
import hotjarPerson from 'images/testimonials/people/hotjar.jpg'
import teskalabsPerson from 'images/testimonials/people/teskalabs.jpg'
import fresh8gamingPhoto1 from 'images/testimonials/photos/fresh-8-gaming-1.jpg'
import fresh8gamingPhoto2 from 'images/testimonials/photos/fresh-8-gaming-2.jpg'
import fresh8gamingPhoto3 from 'images/testimonials/photos/fresh-8-gaming-3.jpg'
import fresh8gamingPhoto4 from 'images/testimonials/photos/fresh-8-gaming-4.jpg'
import hotjarPhoto1 from 'images/testimonials/photos/hotjar-1.jpg'
import hotjarPhoto2 from 'images/testimonials/photos/hotjar-2.jpg'
import hotjarPhoto3 from 'images/testimonials/photos/hotjar-3.jpg'
import hotjarPhoto4 from 'images/testimonials/photos/hotjar-4.jpg'
import teskalabsPhoto1 from 'images/testimonials/photos/teskalabs-1.jpg'
import teskalabsPhoto2 from 'images/testimonials/photos/teskalabs-2.jpg'
import teskalabsPhoto3 from 'images/testimonials/photos/teskalabs-3.jpg'
import teskalabsPhoto4 from 'images/testimonials/photos/teskalabs-4.jpg'

export const data = [
  {
    review: `
      “NextRetreat team took great care of us and made sure our company meetup involving 60+ people was memorable and hassle-free. During the event, they were always on site and providing loads of behind the scenes support. They did a fantastic job! I highly recommend them.”
    `,
    authorName: `Ken Weary`,
    authorJobTitle: `VP of Operations`,
    company: 'Hotjar',
    avatarUrl: hotjarPerson,
    logoUrl: hotjarLogo,
    numberOfteamMembers: '75 team members',
    numberOfDays: '5 days',
    goals: [
      'business meetup',
      'run workshops & presentations',
      'have some fun – ‘work hard, play hard’',
    ],
    slides: [hotjarPhoto1, hotjarPhoto2, hotjarPhoto3, hotjarPhoto4],
    ctaButtons: [
      {
        label: 'Watch Video 2018',
        youtubeVideoCode: 'mDNqiQBFG4M',
      },
      {
        label: 'Watch Video 2019',
        youtubeVideoCode: 'l5vf9JtoS10',
      },
    ],
  },
  {
    review: `
      “NextRetreat is amazing to help research and plan company retreats. As a Remote-First company, WeTravel organizes a large all-hands retreat each year and with our fast growth, we now also have smaller team-specific retreats. NextRetreat's automated platform saves us tons of time in destination-finding and planning!!”
    `,
    authorName: `Johannes Koeppel`,
    authorJobTitle: `CEO`,
    company: 'WeTravel',
    avatarUrl: 'https://cdn.nextretreat.com/wetravel-johannes-koeppel.jpeg',
    logoUrl: 'https://cdn.nextretreat.com/wetravel-logo.png',
    numberOfteamMembers: '35 team members',
    numberOfDays: '4 days',
    goals: [
      'bring remote team together',
      'onboarding new hires',
      'boost team spirit',
    ],
    slides: ['https://cdn.nextretreat.com/wetravel-portugal-testimonial.jpg'],
    ctaButtons: [
    ],
  },
  {
    review: `
      “During the week we completed a project that would have taken three months. On top of that, we still found time to rest and had plenty of fun too! Quite simply, I have never experienced such efficient teamwork in my life. We recommend NextRetreat and will definitely come back!”
    `,
    authorName: `Vladimira Teskova`,
    authorJobTitle: `COO`,
    company: 'TeskaLabs',
    avatarUrl: teskalabsPerson,
    logoUrl: teskalabsLogo,
    numberOfteamMembers: '6 team members',
    numberOfDays: '8 days',
    goals: [
      'launch a new project',
      'escape the routine',
      'boost productivity & morale',
    ],
    slides: [
      teskalabsPhoto1,
      teskalabsPhoto2,
      teskalabsPhoto3,
      teskalabsPhoto4,
    ],
    ctaButtons: [
      {
        label: 'What They Wrote',
        url:
          'https://teskalabs.com/blog/company-retreat-to-tenerife-catvision-io',
      },
      {
        label: 'View Photos',
        url: 'https://wolfhouse.co/teskalabs-team-retreat-summary/',
      },
    ],
  },
  {
    review: `
      “The Fresh8 team had a fantastic team-building & hackathon trip at the NextRetreat venue. They went over and above with her organisation before the trip and during, allowing the team to enjoy a relaxed work and leisure trip. Having the space and time together led to an extremely successful first company hackathon – something we wouldn’t have achieved back in London!”
    `,
    authorName: `Sarah McChesney-Gordon`,
    authorJobTitle: `Client Services Director`,
    company: 'Fresh 8 Gaming',
    avatarUrl: fresh8GamingPerson,
    logoUrl: fresh8GamingLogo,
    numberOfteamMembers: '28 team members',
    numberOfDays: '8 days',
    goals: [
      'implement team building activites',
      'run a hackathon',
      'plan innovations & business strategy',
    ],
    slides: [
      fresh8gamingPhoto1,
      fresh8gamingPhoto2,
      fresh8gamingPhoto3,
      fresh8gamingPhoto4,
    ],
    ctaButtons: [
      {
        label: 'View Photos',
        url: 'https://wolfhouse.co/fresh-8-gamings-team-getaway-to-tenerife/',
      },
    ],
  },
]
