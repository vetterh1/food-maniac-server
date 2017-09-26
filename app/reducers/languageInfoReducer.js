import * as c from '../utils/constants';

const initialState = { // define initial state - an empty categories list
  list: [],
  locale: '',
};

const languageInfoReducer = (state = initialState, action) => {
  switch (action.type) {
  case c.REQUEST_LANGUAGE_INFO: return Object.assign({}, state);
  case c.REQUEST_CURRENT_LOCALE: return Object.assign({}, { locale: state.locale });
  case c.SETUP_LANGUAGES: return Object.assign({}, state, { list: action.list, locale: action.locale });
  case c.CHANGE_LANGUAGE: return Object.assign({}, state, { locale: action.locale });
  default: return state;
  }
};

export default languageInfoReducer;