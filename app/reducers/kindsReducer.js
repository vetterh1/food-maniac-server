import * as c from '../utils/constants';

const initialState = { // define initial state - an empty kinds list
  kinds: [],
  isFetching: false,
  isValid: true,
  error: null,
};

const kindsReducer = (state = initialState, action) => {
  switch (action.type) {
  case c.REQUEST_KINDS: return Object.assign({}, state, { isFetching: true, isValid: false, error: null });
  case c.RECEIVE_KINDS: return Object.assign({}, state, { isFetching: false, isValid: true, error: null, kinds: action.kinds });
  case c.ERROR_REQUESTING_KINDS: return Object.assign({}, state, { isFetching: false, isValid: false, error: action.error, kinds: [] });
  default: return state;
  }
};

export default kindsReducer;