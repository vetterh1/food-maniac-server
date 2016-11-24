export function setCurrentLocation(latitude, longitude, real) { // eslint-disable-line import/prefer-default-export
  // console.log("Action: setCurrentLocation latitude=" + latitude + " longitude=" + longitude + " real=" +  real);
  return {
    type: 'SET_CURRENT_LOCATION',
    latitude, // property value shorthand for latitude: latitude,
    longitude, // property value shorthand for longitude: longitude
    real,
  };
}
