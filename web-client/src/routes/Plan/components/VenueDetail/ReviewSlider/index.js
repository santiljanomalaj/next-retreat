import React from 'react'
import fresh8GamingLogo from 'assets/images/reviews/logo/fresh-8-gaming.png'
import hotjarLogo from 'assets/images/reviews/logo/hotjar.png'
import teskalabsLogo from 'assets/images/reviews/logo/teskalabs.png'
import fresh8GamingPerson from 'assets/images/reviews/people/fresh-8-gaming.jpg'
import hotjarPerson from 'assets/images/reviews/people/hotjar.jpg'
import teskalabsPerson from 'assets/images/reviews/people/teskalabs.jpg'
import fresh8gamingPhoto from 'assets/images/reviews/photos/fresh-8-gaming-1.jpg'
import hotjarPhoto from 'assets/images/reviews/photos/hotjar-1.jpg'
import teskalabsPhoto from 'assets/images/reviews/photos/teskalabs-1.jpg'
import ReviewSlider from './ReviewSlider'

const slides = [
  {
    review: `
      “NextRetreat team took great care of us and made sure our company meetup involving 60+ people was memorable and hassle-free. During the event, they were always on site and providing loads of behind the scenes support. They did a fantastic job! I highly recommend them.”
    `,
    authorName: `Ken Weary`,
    authorJobTitle: `VP of Operations`,
    company: 'Hotjar',
    pictureUrl: hotjarPhoto,
    avatarUrl: hotjarPerson,
    logoUrl: hotjarLogo,
  },
  {
    review: `
      “During the week we completed a project that would have taken three months. On top of that, we still found time to rest and had plenty of fun too! Quite simply, I have never experienced such efficient teamwork in my life. We recommend NextRetreat and will definitely come back!”
    `,
    authorName: `Vladimira Teskova`,
    authorJobTitle: `COO`,
    company: 'TeskaLabs',
    pictureUrl: teskalabsPhoto,
    avatarUrl: teskalabsPerson,
    logoUrl: teskalabsLogo,
  },
  {
    review: `
      “The Fresh8 team had a fantastic team-building & hackathon trip at the NextRetreat venue. They went over and above with her organisation before the trip and during, allowing the team to enjoy a relaxed work and leisure trip. Having the space and time together led to an extremely successful first company hackathon – something we wouldn’t have achieved back in London!”
    `,
    authorName: `Sarah McChesney-Gordon`,
    authorJobTitle: `Client Services Director`,
    company: 'Fresh 8 Gaming',
    pictureUrl: fresh8gamingPhoto,
    avatarUrl: fresh8GamingPerson,
    logoUrl: fresh8GamingLogo,
  },
]

const Slider = () => <ReviewSlider slides={slides} />

export default Slider
