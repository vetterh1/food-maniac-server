import * as c from '../utils/constants';

const initialState = { // define initial state - an empty categories list
  list: ['EN', 'FR'],
  current: 0,
  changed: false,
};

const languageInfoReducer = (state = initialState, action) => {
  switch (action.type) {
  case c.REQUEST_LANGUAGE_INFO: return Object.assign({}, state);
  case c.CHANGE_LANGUAGE: return Object.assign({}, state, { changed: true, index: action.index });
  default: return state;
  }
};

export default languageInfoReducer;