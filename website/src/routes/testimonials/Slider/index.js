import React from 'react'
import PropTypes from 'prop-types'
import { useMedia } from 'useMedia'
import GallerySlider from './GallerySlider'

const swiperConfig = {
  loop: true,
  observerUpdate: true,
  slidesPerView: 1,
  spaceBetween: 1,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true,
  },
}

const Slider = ({ align, slides, cardData }) => {
  const matches = useMedia()
  return matches.mobile ? (
    <GallerySlider
      slides={slides}
      cardData={cardData}
      swiperConfig={{ ...swiperConfig, grabCursor: true }}
    />
  ) : (
    <GallerySlider
      key="fade"
      align={align}
      slides={slides}
      cardData={cardData}
      swiperConfig={{ ...swiperConfig, effect: 'fade' }}
    />
  )
}

Slider.propTypes = {
  align: PropTypes.string,
  cardData: PropTypes.shape({
    review: PropTypes.string.isRequired,
    logoUrl: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
    authorName: PropTypes.string.isRequired,
    numberOfDays: PropTypes.string.isRequired,
    authorJobTitle: PropTypes.string.isRequired,
    numberOfteamMembers: PropTypes.string.isRequired,
    goals: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  }).isRequired,
  slides: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
}

export default Slider
