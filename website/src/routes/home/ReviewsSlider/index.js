import React from 'react'
import { data as caseStudySectionData } from 'routes/testimonials/CaseStudySection/data'
import { data as sliderData } from 'routes/testimonials/Slider/data'
import ReviewSlider from './ReviewSlider'

const reviewCompanies = ['WeTravel', 'Hotjar', 'CM Commerce', 'Apiax', 'FuturedApp']

const filteredSlides = [...caseStudySectionData, ...sliderData]
  .filter((review) => reviewCompanies.includes(review.company))
  .map((slide) =>
    slide.slides ? { ...slide, pictureUrl: slide.slides[0] } : slide
  )

const orderedSlides = reviewCompanies.map((company) =>
  filteredSlides.find((review) => review.company === company)
)

const Slider = () => <ReviewSlider slides={orderedSlides} />

export default Slider
