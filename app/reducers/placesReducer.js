import * as log from 'loglevel';
import * as c from '../utils/constants';

const logPlacesReducer = log.getLogger('logPlacesReducer');
logPlacesReducer.setLevel('warn');
logPlacesReducer.debug('--> entering placesReducer.js');

const initialState = { // define initial state - an empty places list
  places: [],
};

const placesReducer = (state = initialState, action) => {
  switch (action.type) {

  case c.SET_CURRENT_PLACES: {
    logPlacesReducer.debug('{   placesReducer.SET_CURRENT_PLACES (rsl)');
    logPlacesReducer.debug('       (rsl) previous state:', state);
    logPlacesReducer.debug('       (rsl) action:', action);

    const newState = { ...state, places: action.places };

    logPlacesReducer.debug('       (rsl) newState:', newState);
    logPlacesReducer.debug('}   placesReducer.SET_CURRENT_PLACES');

    return newState;
  }


  default: {
    // logPlacesReducer.debug('{   placesReducer.default (rde)');
    // logPlacesReducer.debug('       (rde) state:', state);
    // logPlacesReducer.debug('}   placesReducer.default');

    return state;
  }
  }
};

export default placesReducer;