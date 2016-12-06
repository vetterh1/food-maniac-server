import * as c from '../utils/constants';

export function updateItem(name, value) {
  return dispatch => dispatch({
    type: c.FORM_ITEM_UPDATE_VALUE,
    name,
    value,
  });
}

export function resetItem() {
  return dispatch => dispatch({
    type: c.FORM_ITEM_RESET,
  });
}