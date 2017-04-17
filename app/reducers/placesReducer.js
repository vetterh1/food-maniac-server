import * as log from 'loglevel';
import * as c from '../utils/constants';
import stringifyOnce from '../utils/stringifyOnce';


const logPlacesReducer = log.getLogger('logPlacesReducer');
logPlacesReducer.setLevel('debug');
logPlacesReducer.debug('--> entering placesReducer.js');

const initialState = { // define initial state - an empty places list
  places: [],
};

const placesReducer = (state = initialState, action) => {
  switch (action.type) {

  case c.SET_CURRENT_PLACES: {
    logPlacesReducer.debug('{   placesReducer.SET_CURRENT_PLACES (rsl)');
    logPlacesReducer.debug('       (rsl) previous state:', state);
    // logPlacesReducer.debug(`       (rsl) action.places: ${stringifyOnce(action.places, null, 2)}`);

    const newState = action.places.map((place) => {
      return Object.assign({}, place);
    });

    const test = [{ name: 'a' }, { name: 'b' }, { name: 'c' }];
    // logPlacesReducer.debug(`       (rsl) newState: ${stringifyOnce(newState, null, 2)}`);
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