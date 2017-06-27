// eslint-disable-line import/prefer-default-export

import * as c from '../utils/constants';

export function setCurrentLocation(latitude, longitude, real) {  return { type: c.SET_CURRENT_LOCATION, latitude,  longitude, real }; }

export function setSimulatedMode(latitude, longitude) { return { type: c.SET_SIMULATED_LOCATION, latitude, longitude }; }
export function stopSimulatedMode() { return { type: c.STOP_SIMULATED_LOCATION }; }
