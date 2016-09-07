export const setCurrentLocation = (latitude, longitude, real) => {
  return {
    type: 'SET_CURRENT_LOCATION',
    latitude: latitude,
    longitude: longitude,
    real: real
  }
}