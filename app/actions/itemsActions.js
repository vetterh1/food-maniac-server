import * as c from '../utils/constants';

function requestItems() { return { type: c.REQUEST_ITEMS }; }
function receiveItems(json) { return { type: c.RECEIVE_ITEMS, items: json.items }; }
function errorRequestingItems(message) { return { type: c.ERROR_REQUESTING_ITEMS, error: message }; }

export function fetchItems() { // eslint-disable-line import/prefer-default-export
  return (dispatch) => {
    dispatch(requestItems()); // advertise we are starting a server request
    return fetch('/api/items')
      .then(response => response.json())
      .then(json => dispatch(receiveItems(json)))
      .catch(error => dispatch(errorRequestingItems(error.message)));
  };
}
