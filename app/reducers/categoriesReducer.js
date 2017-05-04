import * as c from '../utils/constants';

const initialState = { // define initial state - an empty categories list
  categories: [],
  isFetching: false,
  isValid: true,
  error: null,
};

const categoriesReducer = (state = initialState, action) => {
  switch (action.type) {
  case c.REQUEST_CATEGORIES: return Object.assign({}, state, { isFetching: true, isValid: false, error: null });
  case c.RECEIVE_CATEGORIES: return Object.assign({}, state, { isFetching: false, isValid: true, error: null, categories: action.categories });
  case c.ERROR_REQUESTING_CATEGORIES: return Object.assign({}, state, { isFetching: false, isValid: false, error: action.error, categories: [] });
  default: return state;
  }
};

export default categoriesReducer;