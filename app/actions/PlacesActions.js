import * as c from '../utils/constants';

export function setLocationType(locationType) { return { type: c.SET_LOCATION_TYPE, locationType }; }

export function setCurrentPlaces(places) { // eslint-disable-line import/prefer-default-export
  // console.log(`Action: setCurrentPlaces - places:\n\n${stringifyOnce(places, null, 2)}`);
  return {
    type: c.SET_CURRENT_PLACES,
    places,
  };
}
