export const extendBoundsByOffset = (bounds, offset) => {
  const center = bounds.getCenter()
  // northEast
  bounds.extend(
    new window.google.maps.LatLng(center.lat() + offset, center.lng() + offset)
  )
  // soutWest
  bounds.extend(
    new window.google.maps.LatLng(center.lat() - offset, center.lng() - offset)
  )
}
