import React from 'react'
import base, { filename } from 'paths.macro'
import { createStoryName } from 'utils/storybook'
import { actions, action } from '@storybook/addon-actions'
import { Box } from 'components/atoms/Layout'
import BookVenue from './index'
import Modal from '../../Modal'

export const NoDatesNoRooms = () => (
  <Box mt="m" mx="m">
    <BookVenue.Form onSubmit={action('button-click')} />
  </Box>
)

export const WithDatesWithoutRooms = () => (
  <Box mt="m" mx="m">
    <BookVenue.Form
      checkInDate="2020-03-21"
      checkOutDate="2020-03-31"
      onSubmit={action('button-click')}
    />
  </Box>
)

export const WithDatesAndRooms = () => (
  <Box mt="m" mx="m">
    <BookVenue.Form
      price={1042}
      peopleToFit={3}
      maxTeamSize={5}
      checkInDate="2020-03-21"
      checkOutDate="2020-03-31"
      onSubmit={action('button-click')}
    />
  </Box>
)

export const TabletMobileWithModal = () => {
  const [isOpen, setOpen] = React.useState(false)
  const openModal = () => setOpen(true)
  const closeModal = () => setOpen(false)
  return (
    <Box mt="m" mx="m" height="10000px">
      <Modal isOpen={isOpen} closeModal={closeModal}>
        <Box my={{ mobile: 0, tablet: 'm' }}>
          <BookVenue.Form
            price={1042}
            peopleToFit={3}
            maxTeamSize={5}
            closeModal={closeModal}
            checkInDate="2020-03-21"
            checkOutDate="2020-03-31"
            onSubmit={action('button-click')}
          />
        </Box>
      </Modal>
      <button onClick={openModal} type="button">
        Open Modal
      </button>
    </Box>
  )
}

/* Your screen width should be less than 1024px
  in order to see the Panel component */

export const PanelNoDatesNoRooms = () => (
  <Box height="100vh" width="100vw">
    <BookVenue.Panel {...actions('onClick')} />
  </Box>
)

export const PanelWithDatesNoRooms = () => (
  <Box height="100vh" width="100vw">
    <BookVenue.Panel
      {...actions('onClick')}
      checkInDate="2020-03-21"
      checkOutDate="2020-03-31"
    />
  </Box>
)

export const PanelWithDatesAndRooms = () => (
  <Box height="100vh" width="100vw">
    <BookVenue.Panel
      {...actions('onClick')}
      price={1042}
      checkInDate="2020-03-21"
      checkOutDate="2020-03-31"
    />
  </Box>
)

export default {
  component: BookVenue,
  title: createStoryName({ base, filename }),
}
