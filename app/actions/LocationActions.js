export function setCurrentLocation (latitude, longitude, real) {

	console.log("Action: setCurrentLocation latitude=" + latitude + " longitude=" + longitude + " real=" +  real);

  return {
    type: 'SET_CURRENT_LOCATION',
    latitude: latitude,
    longitude: longitude,
    real: real
  }
}

export function getCurrentLocation () {
  return {
    type: 'GET_CURRENT_LOCATION'
  }
}