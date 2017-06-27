import * as log from 'loglevel';
import * as c from '../utils/constants';

const MIN_SECONDS_BETWEEN_UPDATES = 15;

const logCoordinatesReducer = log.getLogger('logCoordinatesReducer');
logCoordinatesReducer.setLevel('warn');
logCoordinatesReducer.debug('--> entering coordinatesReducer.js');

const initialState = { // define initial state - an empty location
  latitude: 0,
  longitude: 0,
  simulated: false,
  real: false,
  nbRefreshes: 0,
  nbDiffs: 0,
  nbReal: 0,
  nbEstimated: 0,
  nbClose: 0,
  timeUpdate: 0,
  latitude_save: 0,
  longitude_save: 0,
};

const coordinatesReducer = (state = initialState, action) => {
  switch (action.type) {

  //
  // Start simulated mode
  //

  case c.SET_SIMULATED_LOCATION: {
    logCoordinatesReducer.debug('{   coordinatesReducer.SET_SIMULATED_LOCATION (rsim)');

    const newState = { ...state,
      simulated: true,
      latitude: action.latitude,
      longitude: action.longitude,
      changed: true,
      latitude_save: state.latitude,
      longitude_save: state.longitude,
    };

    logCoordinatesReducer.debug('       (rsim) newState:', newState);
    logCoordinatesReducer.debug('}   coordinatesReducer.SET_SIMULATED_LOCATION');

    return newState;
  }

  //
  // End simulated mode
  //
  
  case c.STOP_SIMULATED_LOCATION: {
    logCoordinatesReducer.debug('{   coordinatesReducer.STOP_SIMULATED_LOCATION (rstsim)');

    const newState = { ...state,
      simulated: false,
      latitude: state.latitude_save,
      longitude: state.longitude_save,
      changed: true,
    };

    logCoordinatesReducer.debug('       (rstsim) newState:', newState);
    logCoordinatesReducer.debug('}   coordinatesReducer.STOP_SIMULATED_LOCATION');

    return newState;
  }


  //
  // Update coordinates (normal mode)
  //
  
  case c.SET_CURRENT_LOCATION: {
    logCoordinatesReducer.debug('{   coordinatesReducer.SET_CURRENT_LOCATION (rsl)');

    //
    // No update if too close from last one...
    //

    const now = Date.now();
    const nbSecondsSinceLastUpdate = (now - state.timeUpdate) / 1000;
    if (nbSecondsSinceLastUpdate < MIN_SECONDS_BETWEEN_UPDATES) {
      logCoordinatesReducer.debug('}   coordinatesReducer.SET_CURRENT_LOCATION - NO update: not enough time since previous one');
      return state;
    }

    //
    // No real update if in simulation mode
    //

    if (state.simulated) {
      logCoordinatesReducer.debug('}   coordinatesReducer.SET_CURRENT_LOCATION - Simulated location: save the coordinates');
      const newState = { ...state,
        latitude_save: action.latitude,
        longitude_save: action.longitude,
      };
      return newState;
    }

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

    logCoordinatesReducer.debug('       (rsl) previous state:', state);
    logCoordinatesReducer.debug('       (rsl) action:', action);

    if (!changedReal) {
      logCoordinatesReducer.debug('       (rsl) === no real change in state');
      logCoordinatesReducer.debug('}   coordinatesReducer.SET_CURRENT_LOCATION');
      return state;
    }

    const newState = { ...state,
      changed,
      changedReal,
      latitude: action.latitude,
      longitude: action.longitude,
      real: action.real,
      nbRefreshes: state.nbRefreshes + 1,
      timeUpdate: now,
      nbDiffs,
      nbReal,
      nbEstimated,
      nbClose,
    };

    logCoordinatesReducer.debug('       (rsl) newState:', newState);
    logCoordinatesReducer.debug('}   coordinatesReducer.SET_CURRENT_LOCATION');

    return newState;
  }


  default: {
    // logCoordinatesReducer.debug('{   coordinatesReducer.default (rde)');
    // logCoordinatesReducer.debug('       (rde) state:', state);
    // logCoordinatesReducer.debug('}   coordinatesReducer.default');

    return state;
  }
  }
};

export default coordinatesReducer;