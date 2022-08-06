import React from 'react'
import PropTypes from 'prop-types'
import apartmentIcon from 'assets/images/svg/rooms/apartment.svg'
import bunkBedIcon from 'assets/images/svg/rooms/bunk-bed.svg'
import defaultIcon from 'assets/images/svg/rooms/default.svg'
import doubleBedIcon from 'assets/images/svg/rooms/double-bed.svg'
import doubleOrTwinIcon from 'assets/images/svg/rooms/double-or-twin.svg'
import familyIcon from 'assets/images/svg/rooms/family.svg'
import quadrupleBedIcon from 'assets/images/svg/rooms/quadruple-bed.svg'
import singleBedIcon from 'assets/images/svg/rooms/single-bed.svg'
import tripleBedIcon from 'assets/images/svg/rooms/triple-bed.svg'
import twinIcon from 'assets/images/svg/rooms/twin.svg'
import twoDoubleIcon from 'assets/images/svg/rooms/two-double.svg'

const ROOM_ICONS = {
  APARTMENT: apartmentIcon,
  BUNK_BED: bunkBedIcon,
  DEFAULT: defaultIcon,
  DOUBLE: doubleBedIcon,
  DOUBLE_OR_TWIN: doubleOrTwinIcon,
  FAMILY: familyIcon,
  QUADRUPLE: quadrupleBedIcon,
  SINGLE: singleBedIcon,
  TRIPLE: tripleBedIcon,
  TWIN: twinIcon,
  TWO_DOUBLE: twoDoubleIcon,
}

const RoomIcon = ({ type }) => (
  <img
    src={ROOM_ICONS[type]}
    alt={type ? `${type.toLowerCase()} room type` : ''}
  />
)

RoomIcon.propTypes = {
  type: PropTypes.string.isRequired,
}

export default RoomIcon
