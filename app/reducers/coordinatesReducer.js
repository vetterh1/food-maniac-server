import * as c from '../utils/constants';

const log = require('loglevel');

log.debug('--> entering coordinatesReducer.js');

const initialState = { // define initial state - an empty location
  values: {},
};

const coordinatesReducer = (state = initialState, action) => {
  switch (action.type) {
    case c.SET_CURRENT_LOCATION: {
      log.debug('{   coordinatesReducer.SET_CURRENT_LOCATION (rsl)');

      const changed = action.latitude === action.latitude &&
              state.longitude === action.longitude
              ? false : true;

      log.debug('       (rsl) previous state:', state);
      log.debug('       (rsl) action:', action);

      if (!changed) {
        log.debug('       (rsl) === no change in state');
        log.debug('}   coordinatesReducer.SET_CURRENT_LOCATION');
        return state;
      }

      const newState = { ...state,
        latitude: action.latitude,
        longitude: action.longitude,
        real: action.real,
        changed,
      };

      /* Same as:
      var newState = Object.assign({}, state, {
        latitude: action.latitude,
        longitude: action.longitude,
        real: action.real,
        changed: changed
      }); */

      log.debug('       (rsl) newState:', newState);
      log.debug('}   coordinatesReducer.SET_CURRENT_LOCATION');

      return newState;
    }
    default:
      return state;
  }
};

export default coordinatesReducer;