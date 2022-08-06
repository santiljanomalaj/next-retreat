import React from 'react'
import Cookies from 'universal-cookie'
import { useAuth } from 'AuthProvider'

const cookies = new Cookies()

const transferArgs = (args) => {
  if (EVENT_DATA_MAPPINGS[args.event]) {
    return { event: args.event, ...EVENT_DATA_MAPPINGS[args.event](args.data) }
  }
  return args
}


export const useGoogleTracking = () => {
  const { user } = useAuth()

  const getDefaultParameters = () => {
    return {
      _gid: cookies.get('_gid'),
    }
  }

  const logGTMEvent = React.useCallback(
    (args) => {
      const eventToLog = {
        uid: user?.id,
        ...getDefaultParameters(),
        ...transferArgs(args),
        ...EVENT_ADDITIONAL_PARAMS[args.event],
      }
      window.dataLayer.push(eventToLog)
    },
    [user]
  )

  return { logGTMEvent }
}

export const GTM_EVENTS = {
  originDestinationsSelected: 'origin_destinations_selected',
  destinationSearch: 'destination_search',
  destinationSelected: 'destination_selected',
  // goToOirignLocationsPage: 'go_to_origin_locations_page',
  // openAirplanTicketsInfo: 'open_airplane_tickets_info',
  venueSearch: 'venue_search',
  venueAddedToTrip: 'add_to_cart',
  createTrip: 'create_trip',
  venueRemovedFromTrip: 'removed_from_cart',
  // currencyChanged: 'currency_changed',
  venueSelected: 'select_item',
  // goToDestinationsPage: 'go_to_destinations_page',
  // askAQuestionModalOpened: 'ask_a_question_modal_opened',
  // askAQuestionSent: 'ask_a_question_sent',
  dateSelectedOnVenuePage: 'date_selected_on_venue_page',
  // checkAvailabilityModalOpened: 'check_availability_modal_opened',
  // checkAvailabilitySent: 'check_availability_sent',
  requestToBook: 'request_to_book',
  requestToBookForm: 'request_to_book_form',
  // formFailure: 'form_failure',
  // formSuccess: 'form_success',
  shareTrip: 'share_trip',
  // contactSupport: 'contact_support',
  modalOpened: 'modal_opened',
  modalSubmit: 'modal_submit',
  roomsNotFound: 'rooms_not_found',
  venuesNotFound: 'venues_not_found',
  marketingDataPush: 'marketing_data_push',
  chatConversationStarted: 'conversation_started',
  chatMessageSent: 'message_sent',
  chatMessageReceived: 'message_received',
  chatFirstInteraction: 'first_interaction',
  appVisit : 'app_visit',
}

const EVENT_DATA_MAPPINGS = {
  [GTM_EVENTS.venueSelected]: (data) => {
    return {
      items: [
        {
          item_id: data.venueid,
          item_name: data.title,
        },
      ]
    }
  },
  [GTM_EVENTS.venueAddedToTrip]: (data) => {
    return {
      currency: 'EUR',
      value: 0,
      items: [
        {
          item_id: data.venueId,
          item_name: '',
        },
      ]
    }
  },
  [GTM_EVENTS.venueRemovedFromTrip]: (data) => {
    return {
      currency: 'EUR',
      value: 0,
      items: [
        {
          item_id: data.id,
          item_name: '',
        },
      ]
    }
  },
}

const EVENT_ADDITIONAL_PARAMS = {
  [GTM_EVENTS.venueSelected]: {
    category: 'EEC',
    action: 'select_item',
    label: 'venue_click',
  },
  [GTM_EVENTS.venueAddedToTrip]: {
    category: 'EEC',
    action: 'add_to_cart',
    label: 'checkout1',
  },
  [GTM_EVENTS.venueRemovedFromTrip]: {
    category: 'EEC',
    action: 'removed_from_cart',
  },
  [GTM_EVENTS.originDestinationsSelected]: {
    category: 'CE app',
    action: 'originDestinationsSelected',
    label: 'Destination'
  },
  [GTM_EVENTS.destinationSearch]: {
    category: 'CE app',
    action: 'destinationSearch',
    label: 'XDestinationX'
  },
  [GTM_EVENTS.destinationSelected]: {
    category: 'CE app',
    action: 'destinationSelected',
    label: 'Destination'
  },
  [GTM_EVENTS.venueSearch]: {
    category: 'CE app',
    action: 'venueSearch',
    label: 'Venue'
  },
  [GTM_EVENTS.createTrip]: {
    category: 'CE app',
    action: 'createTrip',
    label: 'Trip'
  },
  [GTM_EVENTS.shareTrip]: {
    category: 'CE app',
    action: 'Share trip clicked',
    label: 'Trip'
  },
  [GTM_EVENTS.dateSelectedOnVenuePage]: {
    category: 'CE app',
    action: 'dateSelectedOnVenuePage',
    label: 'Venue'
  },
  [GTM_EVENTS.venuesNotFound]: {
    category: 'CE app',
    action: 'no_venues_found',
    label: 'Venue'
  },
  [GTM_EVENTS.roomsNotFound]: {
    category: 'CE app',
    action: 'venue_no_rooms_found',
    label: 'Venue'
  },
  [GTM_EVENTS.chatConversationStarted]: {
    category: 'chatbox',
    action: 'conversation_started',
    label: 'message'
  },
  [GTM_EVENTS.chatConversationStarted]: {
    category: 'chatbox',
    action: 'conversation_started',
    label: 'message'
  },
  [GTM_EVENTS.chatConversationStarted]: {
    category: 'chatbox',
    action: 'conversation_started',
    label: 'message'
  },
  [GTM_EVENTS.chatMessageSent]: {
    category: 'chatbox',
    action: 'message_sent',
    label: 'message'
  },
  [GTM_EVENTS.chatMessageReceived]: {
    category: 'chatbox',
    action: 'message_received',
    label: 'message'
  },
  [GTM_EVENTS.chatFirstInteraction]: {
    category: 'chatbox',
    action: 'first_interaction',
    label: 'click'
  },
  [GTM_EVENTS.appVisit]: {
    category: 'CE app',
    action: 'app_visit',
    label: 'Destination'
  },
  [GTM_EVENTS.marketingDataPush]: {
    category:'data push',
    action: 'marketing_data_push',
  }
}
