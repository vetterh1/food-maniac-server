import * as c from '../utils/constants';

const initialState = { // define initial state - an empty places list
  places: [],
  locationType: 'restaurant',
  version: 0,
};

const placesReducer = (state = initialState, action) => {
  switch (action.type) {

  case c.SET_CURRENT_PLACES: {
    const newState = action.places.map((place) => { return Object.assign({}, place); });
    return Object.assign({}, state, { version: Date.now(), places: newState });
  }

  case c.SET_LOCATION_TYPE: return Object.assign({}, state, { locationType: action.locationType });

  default: { return state; }
  }
};

export default placesReducer;