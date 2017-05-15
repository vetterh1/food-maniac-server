import * as c from '../utils/constants';

const initialState = { // define initial state - an empty places list
  places: [],
  version: 0,
};

const placesReducer = (state = initialState, action) => {
  switch (action.type) {

  case c.SET_CURRENT_PLACES: {
    const newState = action.places.map((place) => { return Object.assign({}, place); });
    return { version: Date.now(), places: newState };
  }


  default: { return state; }
  }
};

export default placesReducer;