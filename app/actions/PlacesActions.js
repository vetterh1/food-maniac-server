import * as c from '../utils/constants';

export function setCurrentPlaces(places) { // eslint-disable-line import/prefer-default-export
  // console.log("Action: setCurrentLocation latitude=" + latitude + " longitude=" + longitude + " real=" +  real);
  return {
    type: c.SET_CURRENT_PLACES,
    places,
  };
}
