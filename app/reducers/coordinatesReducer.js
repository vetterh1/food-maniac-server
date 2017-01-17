import * as c from '../utils/constants';

const log = require('loglevel');

log.debug('--> entering coordinatesReducer.js');

const initialState = { // define initial state - an empty location
  real: false,
  nbRefreshes: 0,
  nbDiffs: 0,
  nbReal: 0,
  nbEstimated: 0,
  nbClose: 0,
};

const coordinatesReducer = (state = initialState, action) => {
  switch (action.type) {
    case c.SET_CURRENT_LOCATION: {
      log.debug('{   coordinatesReducer.SET_CURRENT_LOCATION (rsl)');

      const roundedStateLatitude = Math.round(parseFloat(state.latitude) * 1000) / 1000;
      const roundedStateLongitude = Math.round(parseFloat(state.longitude) * 1000) / 1000;
      const roundedActionLatitude = Math.round(parseFloat(action.latitude) * 1000) / 1000;
      const roundedActionLongitude = Math.round(parseFloat(action.longitude) * 1000) / 1000;
      const changed = roundedStateLatitude !== roundedActionLatitude ||
              roundedStateLongitude !== roundedActionLongitude;
      const changedReal = state.latitude !== action.latitude ||
              state.longitude !== action.longitude;

      const nbDiffs = changed ? state.nbDiffs + 1 : state.nbDiffs;
      const nbReal = action.real ? state.nbReal + 1 : state.nbReal;
      const nbEstimated = action.real ? state.nbEstimated : state.nbEstimated + 1;
      const nbClose = changedReal && !changed ? state.nbClose + 1 : state.nbClose;

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
        nbClose,
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