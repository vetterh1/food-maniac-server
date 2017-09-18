import * as c from '../utils/constants';

const initialState = { // define initial state - an empty categories list
  list: ['EN', 'FR'],
  codeLanguage: 'EN',
  changed: false,
};

const languageInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case c.REQUEST_LANGUAGE_INFO: return Object.assign({}, state);
    case c.REQUEST_CURRENT_LANGUAGE: return Object.assign({}, { codeLanguage: state.codeLanguage });
    case c.CHANGE_LANGUAGE: return Object.assign({}, state, { changed: true, codeLanguage: action.codeLanguage });
  default: return state;
  }
};

export default languageInfoReducer;