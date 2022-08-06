import React from 'react'
import lisbonPhoto from 'images/home/destinations/lisbon.jpg'
import tenerifePhoto from 'images/home/destinations/tenerife.jpg'
import praguePhoto from 'images/home/destinations/prague.jpg'
import budapestPhoto from 'images/home/destinations/budapest.jpg'
import mallorcaPhoto from 'images/home/destinations/mallorca.jpg'
import frankfurtPhoto from 'images/home/destinations/frankfurt.jpg'
import siciliaPhoto from 'images/home/destinations/sicilia.jpg'
import dubrovnikPhoto from 'images/home/destinations/dubrovnik.jpg'
import innsbruckPhoto from 'images/home/destinations/innsbruck.jpg'
import sussexPhoto from 'images/home/destinations/sussex.jpg'
import valenciaPhoto from 'images/home/destinations/valencia.jpg'
import londonPhoto from 'images/home/destinations/london.jpg'
import berlinPhoto from 'images/home/destinations/berlin.jpg'
import romePhoto from 'images/home/destinations/rome.jpg'
import milanPhoto from 'images/home/destinations/milan.jpg'
import biarritzPhoto from 'images/home/destinations/biarritz.jpg'
import splitPhoto from 'images/home/destinations/split.jpg'
import DestinationSlider from './DestinationSlider'

const slides = [
  {
    title: 'Lisbon',
    country: 'Portugal',
    description:
      'In this hilly Portuguese capital, your team will enjoy ginjinha berry liquor, sweet pasteis de belem, surfing, caving, wine farm visits, and nature discoveries.',
    pictureUrl: lisbonPhoto,
  },
  {
    title: 'Tenerife',
    country: 'Spain',
    description:
      'With over 180 direct flight connections from European cities, this popular destination for teams offers over 300 days of sunshine and an average temperature of 20°C, even in winter.',
    pictureUrl: tenerifePhoto,
  },
  {
    title: 'Prague',
    country: 'Czech Republic',
    description:
      'Bond with your team in Prague in an interactive and fun way with indoor skydiving, adventurous dinner in the sky, and rich historic activities.',
    pictureUrl: praguePhoto,
  },
  {
    title: 'Budapest',
    country: 'Hungary',
    description:
      'Budapest is an ideal match destination with its 148 direct flights, a number of unique venues and activities like racing, wall climbing or waterparks.',
    pictureUrl: budapestPhoto,
  },
  {
    title: 'Mallorca',
    country: 'Spain',
    description:
      'The largest Balearic island becoming a big hub for startups and tech thanks to its ecosystem makes it teams-friendly and perfect for company meetups.',
    pictureUrl: mallorcaPhoto,
  },
  {
    title: 'Frankfurt/Main',
    country: 'Germany',
    description:
      'Here old and modern architecture perfectly blend together. Explore the city’s hidden gems or let your team discover themselves at a painting party.',
    pictureUrl: frankfurtPhoto,
  },
  {
    title: 'Sicily',
    country: 'Italy',
    description:
      'The island can boast both of white and black sand beaches. Visit mount Etna with your team or learn the basics of winemaking - it’s a real cult here.',
    pictureUrl: siciliaPhoto,
  },
  {
    title: 'Dubrovnik',
    country: 'Croatia',
    description:
      'Dubrovnik, a city in southern Croatia and the most prominent destination in the Mediterrean sea is known for its distinctive Old Town and beaches.',
    pictureUrl: dubrovnikPhoto,
  },
  {
    title: 'Innsbruck',
    country: 'Austria',
    description:
      'Unique alpine-urban experience whether you stay in the city centre or in the alpine countryside. All team members will find something for themsleves.',
    pictureUrl: innsbruckPhoto,
  },
  {
    title: 'Sussex',
    country: 'United Kingdom',
    description:
      'A historic county in South East England features all you need to escape from the reality: boat safari rides, stunning seafront estates and more.',
    pictureUrl: sussexPhoto,
  },
  {
    title: 'Valencia',
    country: 'Spain',
    description:
      'Walking trails, beaches and futuristic structures including an ocenarium or a planetarium define the city where the original paella comes from.',
    pictureUrl: valenciaPhoto,
  },
  {
    title: 'London',
    country: 'United Kingdom',
    description:
      'The capital of Great Britain on the Thames River has 8 amazing Royal Parks which are perfect places for relaxation in such a bustling city.',
    pictureUrl: londonPhoto,
  },
  {
    title: 'Berlin',
    country: 'Germany',
    description:
      'Let your team be inspired here with a vibrant artistic streets. Take them on a boat cruise, taste the local authentic beer, enjoy Berlin’s cool vibe.',
    pictureUrl: berlinPhoto,
  },
  {
    title: 'Rome',
    country: 'Italy',
    description:
      'Fascinating capital of Italy known for its rich history, best venues to stay at; including cosy suites or guesthouses might be your next destination.',
    pictureUrl: romePhoto,
  },
  {
    title: 'Milan',
    country: 'Italy',
    description:
      'Experience cooking of the Milanese risotto at a workshop with your team or explore the architecture in one of the biggest Italian cities.',
    pictureUrl: milanPhoto,
  },
  {
    title: 'Biarritz',
    country: 'France',
    description:
      'An elegant seaside town on the French coast will enchant you with its aristocratic boulevards and panoramic ocean views. Also, it’s a surf paradise!',
    pictureUrl: biarritzPhoto,
  },
  {
    title: 'Split',
    country: 'Croatia',
    description:
      'The largest city on the Adriatic Coast has stunning sea views and abundant coniferous forests. Sample Dalmatian food after the hike up Marjan Hill.',
    pictureUrl: splitPhoto,
  },
]

const Slider = () => <DestinationSlider slides={slides} />

export default Slider
