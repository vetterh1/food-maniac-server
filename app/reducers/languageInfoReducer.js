import * as c from '../utils/constants';

const initialState = { // define initial state - an empty categories list
  list: [],
  codeLanguage: '',
};

const languageInfoReducer = (state = initialState, action) => {
  switch (action.type) {
  case c.REQUEST_LANGUAGE_INFO: return Object.assign({}, state);
  case c.REQUEST_CURRENT_LANGUAGE: return Object.assign({}, { codeLanguage: state.codeLanguage });
  case c.SETUP_LANGUAGES: return Object.assign({}, state, { list: action.list, codeLanguage: action.codeLanguage });
  case c.CHANGE_LANGUAGE: return Object.assign({}, state, { codeLanguage: action.codeLanguage });
  default: return state;
  }
};

export default languageInfoReducer;