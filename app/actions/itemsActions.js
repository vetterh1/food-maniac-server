import * as c from '../utils/constants';

// "private" actions, meaning called by other actions below
function _requestItems() { return { type: c.REQUEST_ITEMS }; }
function _receiveItems(json) { return { type: c.RECEIVE_ITEMS, items: json.items }; }
function _errorRequestingItems(message) { return { type: c.ERROR_REQUESTING_ITEMS, error: message }; }
function _requestSaveItem() { return { type: c.REQUEST_SAVE_ITEM }; }
function _successSavingItem(item) { return { type: c.SAVE_ITEM_OK, item }; }
function _errorSavingItem(message) { return { type: c.SAVE_ITEM_KO, error: message }; }

export function fetchItems() { // eslint-disable-line import/prefer-default-export
  return (dispatch) => {
    dispatch(_requestItems()); // advertise we are starting a server request
    return fetch('/api/items')
      .then(response => response.json())
      .then(json => dispatch(_receiveItems(json)))
      .catch(error => dispatch(_errorRequestingItems(error.message)));
  };
}

export function saveItem(item) { // eslint-disable-line import/prefer-default-export
  return (dispatch) => {
    dispatch(_requestSaveItem()); // advertise we are starting a server request
    console.log('Action saveItem() - item:', item);
    return fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item }, null, 4),
    })
      .then((response) => {
        console.log('fetch result: ', response);
        if (response && response.ok) {
          dispatch(_successSavingItem(item));
          return;
        }
        // this.onEndSavingFailed('01');
        const error = new Error('fetch OK but returned nothing or an error (request: post /api/items');
        error.name = 'ErrorCaught';
        throw (error);
      })
      .catch((error) => {
        // if (error.name !== 'ErrorCaught') this.onEndSavingFailed('02');
        // logAddItemContainer.error(error.message);
        dispatch(_errorSavingItem(error.message));
      });
  };
}
