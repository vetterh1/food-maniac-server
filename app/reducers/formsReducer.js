import * as c from '../utils/constants';

const log = require('loglevel');

log.debug('--> entering formsReducer.js');


const initialState = { // define initial state - an empty form
  values: {},
};

const formsReducer = (state = initialState, action) => {
  switch (action.type) {
    case c.FORM_ITEM_UPDATE_VALUE: {
      log.debug('{}   formsReducer.FORM_ITEM_UPDATE_VALUE (fi_uv)');

      return Object.assign({}, state, {
        values: Object.assign({}, state.values, {
          [action.name]: action.value,
        }),
      });
    }

    case c.FORM_RESET:
      return initialState;

    default:
      return state;
  }
};

export default formsReducer;