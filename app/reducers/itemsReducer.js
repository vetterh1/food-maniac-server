import * as c from '../utils/constants';

const initialState = { // define initial state - an empty items list
  items: [],
  isFetching: false,
  isValid: true,
  error: null,
};

const itemsReducer = (state = initialState, action) => {
  switch (action.type) {
  case c.REQUEST_ITEMS: return Object.assign({}, state, { isFetching: true, isValid: false, error: null });
  case c.RECEIVE_ITEMS: return Object.assign({}, state, { isFetching: false, isValid: true, error: null, items: action.items });
  case c.ERROR_REQUESTING_ITEMS: return Object.assign({}, state, { isFetching: false, isValid: false, error: action.error, items: [] });
  default: return state;
  }
};

export default itemsReducer;