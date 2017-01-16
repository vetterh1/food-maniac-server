import * as c from '../utils/constants';

const log = require('loglevel');

log.debug('--> entering coordinatesReducer.js');

const initialState = { // define initial state - an empty location
  real: false,
  nbRefreshes: 0,
  nbDiffs: 0,
  nbReal: 0,
  nbEstimated: 0,
};

const coordinatesReducer = (state = initialState, action) => {
  switch (action.type) {
    case c.SET_CURRENT_LOCATION: {
      log.debug('{   coordinatesReducer.SET_CURRENT_LOCATION (rsl)');

      const roundedStateLatitude = Math.round(parseFloat(state.latitude) * 100000) / 100000;
      const roundedStateLongitude = Math.round(parseFloat(state.longitude) * 100000) / 100000;
      const roundedActionLatitude = Math.round(parseFloat(action.latitude) * 100000) / 100000;
      const roundedActionLongitude = Math.round(parseFloat(action.longitude) * 100000) / 100000;
      const changed = roundedStateLatitude !== roundedActionLatitude ||
              roundedStateLongitude !== roundedActionLongitude;

      const nbDiffs = changed ? state.nbDiffs + 1 : state.nbDiffs;
      const nbReal = action.real ? state.nbReal + 1 : state.nbReal;
      const nbEstimated = action.real ? state.nbEstimated : state.nbEstimated + 1;

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
        nbRefreshes: state.nbRefreshes + 1,
        nbDiffs,
        nbReal,
        nbEstimated,
      };

      log.debug('       (rsl) newState:', newState);
      log.debug('}   coordinatesReducer.SET_CURRENT_LOCATION');

      return newState;
    }
    default:
      return state;
  }
};

export default coordinatesReducer;